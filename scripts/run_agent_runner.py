import os
import sys
import time
import requests
import tarfile
import google.auth
import google.auth.transport.requests
from google import genai

def run_agent():
    project_id = os.environ.get("GCP_PROJECT_ID")
    location = os.environ.get("GCP_LOCATION", "global")
    spec_file = os.environ.get("SPEC_FILE")

    if not spec_file:
        print("❌ Error: SPEC_FILE environment variable not set.")
        sys.exit(1)

    print(f"🚀 Invoking Antigravity Managed Agent for spec: {spec_file}")

    client = genai.Client(vertexai=True, project=project_id, location=location)

    # Read agent instructions from /.agents/agents/eng-team/
    agent_instructions_path = ".agents/agents/eng-team/agent.md"
    agent_instructions = ""
    if os.path.exists(agent_instructions_path):
        with open(agent_instructions_path, "r") as f:
            agent_instructions = f.read()

    # Read specification file
    with open(spec_file, "r") as f:
        spec_content = f.read()

    prompt = f"""
    You are executing as the `eng-team` agent.

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

    # Launch Managed Agent on Agent Runtime in the background
    interaction = client.interactions.create(
        agent="antigravity-preview-05-2026",
        input=prompt,
        environment={
            "type": "remote",
            "sources": [
                {
                    "type": "inline",
                    "target": ".agents/agents/eng-team/agent.md",
                    "content": agent_instructions,
                },
                {
                    "type": "inline",
                    "target": spec_file,
                    "content": spec_content,
                },
            ],
        },
        background=True,
    )

    print(f"⏳ Agent task started (Interaction ID: {interaction.id}, Environment ID: {interaction.environment_id}). Polling...")

    # Poll for completion
    while interaction.status in ("in_progress", "requires_action"):
        time.sleep(10)
        interaction = client.interactions.get(id=interaction.id)
        print(f"  Current status: {interaction.status}")

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
