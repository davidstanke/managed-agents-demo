import os
import sys
import time
import requests
import tarfile
import google.auth
import google.auth.transport.requests
from google import genai

def create_interaction_with_retry(client, prompt, max_retries=3):
    """Creates an interaction with exponential backoff for transient network drops."""
    for attempt in range(1, max_retries + 1):
        try:
            return client.interactions.create(
                agent="antigravity-preview-05-2026",
                input=prompt,
                environment="remote",
                background=True,
            )
        except Exception as e:
            if attempt == max_retries:
                raise
            wait_time = attempt * 10
            print(f"⚠️ Connection error on create (attempt {attempt}/{max_retries}): {e}. Retrying in {wait_time}s...")
            time.sleep(wait_time)

def run_agent():
    project_id = os.environ.get("GCP_PROJECT_ID")
    location = os.environ.get("GCP_LOCATION", "global")
    spec_file = os.environ.get("SPEC_FILE")

    if not spec_file:
        print("❌ Error: SPEC_FILE environment variable not set.")
        sys.exit(1)

    print(f"🚀 Invoking Antigravity Managed Agent for spec: {spec_file}")

    # Configure client with extended timeout (5 minutes) for remote sandbox provisioning
    client = genai.Client(
        vertexai=True,
        project=project_id,
        location=location,
        http_options={"timeout": 300000},
    )

    # Read agent instructions from /.agents/agents/eng-team/
    agent_instructions_path = ".agents/agents/eng-team/agent.md"
    agent_instructions = ""
    if os.path.exists(agent_instructions_path):
        with open(agent_instructions_path, "r") as f:
            agent_instructions = f.read()

    # Read specification file
    with open(spec_file, "r") as f:
        spec_content = f.read()

    github_repo = os.environ.get("GITHUB_REPOSITORY")
    github_ref = os.environ.get("GITHUB_REF_NAME")
    repo_info = f"\n    REPOSITORY: https://github.com/{github_repo} (branch: {github_ref})" if github_repo else ""

    prompt = f"""
    You are executing as the `eng-team` agent.{repo_info}

    AGENTS.MD INSTRUCTIONS:
    {agent_instructions}

    YOUR GOAL:
    Implement the specification located at `{spec_file}`.
    
    SPECIFICATION CONTENT:
    {spec_content}

    After implementing and testing:
    1. Verify all tests pass.
    2. Move the specification file `{spec_file}` into `docs/specs/_implemented/{os.path.basename(spec_file)}`.
    3. Provide a detailed summary of changes.
    """

    # Launch Managed Agent on Agent Runtime in the background with retry logic
    interaction = create_interaction_with_retry(client, prompt)

    print(f"⏳ Agent task started (Interaction ID: {interaction.id}, Environment ID: {interaction.environment_id}). Polling...")

    # Poll for completion with transient error tolerance
    consecutive_poll_errors = 0
    max_poll_errors = 5
    while interaction.status in ("in_progress", "requires_action"):
        time.sleep(10)
        try:
            interaction = client.interactions.get(id=interaction.id)
            print(f"  Current status: {interaction.status}")
            consecutive_poll_errors = 0
        except Exception as e:
            consecutive_poll_errors += 1
            print(f"  ⚠️ Transient error during status poll ({consecutive_poll_errors}/{max_poll_errors}): {e}")
            if consecutive_poll_errors >= max_poll_errors:
                print("❌ Exceeded maximum consecutive poll errors. Exiting.")
                raise

    if interaction.status == "completed":
        print("✅ Managed Agent execution completed.")
        print("--- AGENT OUTPUT ---")
        print(interaction.output_text)

        # Download environment snapshot to sync modified files back to runner workspace
        env_id = interaction.environment_id
        if env_id:
            try:
                credentials, _ = google.auth.default()
                auth_req = google.auth.transport.requests.Request()
                credentials.refresh(auth_req)
                token = credentials.token

                headers = {"Authorization": f"Bearer {token}"} if token else {}
                download_url = f"https://aiplatform.googleapis.com/v1beta1/projects/{project_id}/locations/{location}/files/environment-{env_id}:download?alt=media"

                res = requests.get(download_url, headers=headers, allow_redirects=True)
                if res.status_code == 200:
                    with open("env_snapshot.tar", "wb") as f:
                        f.write(res.content)
                    with tarfile.open("env_snapshot.tar") as tar:
                        tar.extractall(path=".")
                    os.remove("env_snapshot.tar")
                    print("📦 Synchronized environment files back to workspace.")
                else:
                    print(f"⚠️ Note: Environment snapshot download returned status {res.status_code}")
            except Exception as e:
                print(f"⚠️ Warning: Could not download environment snapshot: {e}")
    else:
        print(f"❌ Agent execution failed with status: {interaction.status}")
        if hasattr(interaction, "error") and interaction.error:
            print(f"Error details: {interaction.error}")
        sys.exit(1)

if __name__ == "__main__":
    run_agent()
