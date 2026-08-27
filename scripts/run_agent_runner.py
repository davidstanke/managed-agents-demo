import os
import sys
from google import genai

def run_agent():
    project_id = os.environ.get("GCP_PROJECT_ID")
    location = os.environ.get("GCP_LOCATION", "us-central1")
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

    # Launch Managed Agent on Agent Runtime
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
    )

    print("✅ Managed Agent execution completed.")
    print("--- AGENT OUTPUT ---")
    print(interaction.output)

if __name__ == "__main__":
    run_agent()
