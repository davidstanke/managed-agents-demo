# 🤖 Automated Spec Implementation with Antigravity Managed Agents

This repository automates software development using an **Antigravity Managed Agent** running on **Google Cloud Agent Runtime**.

When a developer pushes a new branch containing a feature specification in `/docs/specs/`, GitHub Actions triggers a cloud-hosted Antigravity agent. The agent assumes the engineering persona defined in `/.agents/eng-team/`, writes the implementation and tests, moves the spec to `/docs/specs/_implemented/`, and opens/updates a Pull Request.

---

## 🏗️ Architecture & Workflow

```
[Developer] -> Push branch with /docs/specs/my-feature.md
                    │
                    ▼
     [GitHub Actions Workflow Triggered]
                    │
                    ▼
 [Workload Identity Federation (GCP Auth)]
                    │
                    ▼
[Antigravity SDK Runner on Agent Runtime]
 ├── Loads agent definitions from /.agents/eng-team/
 ├── Implements code & unit tests in workspace
 ├── Runs build & test suites
 ├── Moves /docs/specs/my-feature.md -> /docs/specs/_implemented/my-feature.md
 └── Pushes commits & opens/updates Pull Request
```

---

## 📁 Repository Directory Structure

Ensure your repository follows this structure:

```text
.
├── .agents/
│   └── eng-team/
│       ├── AGENTS.md               # Main persona, instructions, and rules
│       └── skills/
│           └── code-verification/
│               └── SKILL.md        # Custom execution skills & tools
├── .github/
│   └── workflows/
│       └── agent-implementation.yml # GitHub Actions pipeline
├── docs/
│   └── specs/
│       ├── _implemented/           # Folder for completed specs
│       └── feature-x.md            # Active specification to implement
├── scripts/
│   └── run_agent_runner.py        # Antigravity SDK invocation script
└── README.md
```

---

## ⚙️ Step-by-Step Setup Guide

### Step 1: Google Cloud Platform Setup

#### 1. Enable Required GCP APIs
In your Google Cloud Project, enable the Vertex AI and IAM APIs:

```bash
gcloud services enable \
  aiplatform.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com
```

#### 2. Create Service Account for GitHub Actions
```bash
gcloud iam service-accounts create github-agent-runner \
  --display-name="GitHub Actions Antigravity Agent Runner"

# Assign required Vertex AI / Agent Runtime permissions
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:github-agent-runner@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

#### 3. Configure Workload Identity Federation (WIF)
Set up passwordless authentication between GitHub Actions and GCP:

```bash
# Create Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == 'davidstanke/managed-agents-demo'" \
  --issuer-uri="https://token.actions.githubusercontent.com/"


# Allow GitHub repo to impersonate Service Account
GCP_PROJECT_NUMBER=$(gcloud projects describe "${GCP_PROJECT_ID}" --format="value(projectNumber)") && \
gcloud iam service-accounts add-iam-policy-binding "github-agent-runner@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/davidstanke/managed-agents-demo"
```

---

### Step 2: Define the Engineering Agent (`/.agents/eng-team/`)

Create the agent instructions file at `/.agents/eng-team/AGENTS.md`:

```markdown
# Engineering Team Lead Agent (`eng-team`)

## Persona & Purpose
You are an expert full-stack software engineer responsible for autonomously implementing software specifications provided in `/docs/specs/`.

## Workflow Guidelines
1. **Locate Pending Spec:** Find any markdown specification file in `/docs/specs/` that is NOT inside `/docs/specs/_implemented/`.
2. **Analyze Codebase & Spec:** Read the project files to understand existing architectural patterns and conventions.
3. **Implement Feature:**
   - Write clean, maintainable production code fulfilling all requirements in the spec.
   - Write comprehensive unit tests.
4. **Verification:** Execute local tests/build checks to ensure no regressions.
5. **Archive Spec:** Move the specification file from `/docs/specs/<spec-name>.md` to `/docs/specs/_implemented/<spec-name>.md`.
6. **Summary:** Output a clear summary of all code changes made, tests added, and files modified.
```

---

### Step 3: Create the SDK Runner Script (`scripts/run_agent_runner.py`)

Create a Python invocation script that bundles the workspace files, mounts `.agents/eng-team/`, and executes the Managed Agent on Agent Runtime:

```python
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

    # Read agent instructions from /.agents/eng-team/
    agent_instructions_path = ".agents/eng-team/AGENTS.md"
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
                    "target": ".agents/eng-team/AGENTS.md",
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
```

---

### Step 4: Add GitHub Actions Workflow (`.github/workflows/agent-implementation.yml`)

Create the GitHub Actions workflow file:

```yaml
name: Antigravity Spec Implementation Agent

on:
  push:
    branches-ignore:
      - main
      - master

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  implement-spec:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Identify Pending Specification
        id: find_spec
        run: |
          # Find new/un-implemented spec files
          SPEC_FILE=$(find docs/specs -maxdepth 1 -name "*.md" ! -path "docs/specs/_implemented/*" | head -n 1)
          if [ -z "$SPEC_FILE" ]; then
            echo "No un-implemented spec found in /docs/specs/. Exiting gracefully."
            echo "has_spec=false" >> $GITHUB_OUTPUT
            exit 0
          fi
          echo "Found spec: $SPEC_FILE"
          echo "has_spec=true" >> $GITHUB_OUTPUT
          echo "spec_file=$SPEC_FILE" >> $GITHUB_OUTPUT

      - name: Authenticate to Google Cloud via WIF
        if: steps.find_spec.outputs.has_spec == 'true'
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/YOUR_GCP_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'github-agent-runner@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com'

      - name: Set up Python
        if: steps.find_spec.outputs.has_spec == 'true'
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Dependencies
        if: steps.find_spec.outputs.has_spec == 'true'
        run: |
          python -m pip install --upgrade pip
          pip install google-genai

      - name: Run Antigravity Managed Agent
        if: steps.find_spec.outputs.has_spec == 'true'
        env:
          GCP_PROJECT_ID: 'YOUR_GCP_PROJECT_ID'
          GCP_LOCATION: 'us-central1'
          SPEC_FILE: ${{ steps.find_spec.outputs.spec_file }}
        run: |
          python scripts/run_agent_runner.py

      - name: Commit Changes & Move Spec
        if: steps.find_spec.outputs.has_spec == 'true'
        run: |
          git config --global user.name "Antigravity Agent [bot]"
          git config --global user.email "agent-bot@users.noreply.github.com"
          git add .
          if git diff --staged --quiet; then
            echo "No changes committed by agent."
          else
            git commit -m "feat: automated implementation of spec ${{ steps.find_spec.outputs.spec_file }}"
            git push origin ${{ github.ref_name }}
          fi

      - name: Create or Update Pull Request
        if: steps.find_spec.outputs.has_spec == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh pr create \
            --title "feat: Implemented spec ${{ steps.find_spec.outputs.spec_file }}" \
            --body "Automated spec implementation generated by Antigravity Managed Agent (\`/.agents/eng-team/\`)." \
            --head "${{ github.ref_name }}" \
            --base "main" || echo "PR already exists or update pushed."
```

---

## 🧪 Verification & Testing Flow

To test the automated pipeline:

1. **Create a new branch:**
   ```bash
   git checkout -b feature/add-user-login
   ```
2. **Add a spec file** under `docs/specs/add-user-login.md`:
   ```markdown
   # Spec: User Login Endpoint
   - Create a `/api/login` route in Python/Flask.
   - Accept JSON payload with `username` and `password`.
   - Write unit tests in `tests/test_login.py`.
   ```
3. **Commit & Push the branch:**
   ```bash
   git add docs/specs/add-user-login.md
   git commit -m "docs: add user login specification"
   git push origin feature/add-user-login
   ```
4. **Observe GitHub Actions:**
   - The workflow triggers automatically.
   - The Antigravity Managed Agent builds the code and unit tests.
   - `docs/specs/add-user-login.md` is moved to `docs/specs/_implemented/add-user-login.md`.
   - A Pull Request is opened automatically for team review! 🚀

---
