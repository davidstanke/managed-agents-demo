# 🤖 Engineering Team Managed Agent (`eng-team`)

This directory defines the **Engineering Team Agent (`eng-team`)**, an autonomous coding agent that implements software specifications via **Google Cloud Agent Runtime** and GitHub Actions.

When a developer pushes a branch containing a feature specification in `/docs/specs/`, GitHub Actions triggers the agent. The agent loads the engineering persona defined in `agent.md`, implements code and tests, moves the spec to `/docs/specs/_implemented/`, and opens/updates a Pull Request.

---

## 🏗️ Architecture & Workflow

```
[Developer] -> Push branch with /docs/specs/<feature-name>.md
                    │
                    ▼
     [GitHub Actions Workflow Triggered]
                    │
                    ▼
 [Workload Identity Federation (GCP Auth)]
                    │
                    ▼
[Antigravity SDK Runner on Agent Runtime]
 ├── Loads agent persona from /.agents/agents/eng-team/agent.md
 ├── Implements code & unit tests in workspace
 ├── Runs build & test suites
 ├── Moves /docs/specs/<spec>.md -> /docs/specs/_implemented/<spec>.md
 └── Pushes commits & opens/updates Pull Request
```

---

## 📁 Directory Structure

```text
.
├── .agents/
│   └── agents/
│       └── eng-team/
│           ├── agent.md                # Agent persona, instructions, and rules
│           └── README.md               # Setup & configuration guide (this file)
├── .github/
│   └── workflows/
│       └── agent-implementation.yml    # GitHub Actions workflow
├── docs/
│   └── specs/
│       ├── _implemented/              # Archive folder for completed specs
│       └── <feature>.md               # Active specification to implement
└── scripts/
    └── run_agent_runner.py            # Antigravity SDK invocation script
```

---

## ⚙️ Setup Guide

### 1. Google Cloud Platform Setup

#### A. Enable Required GCP APIs
```bash
gcloud services enable \
  aiplatform.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com
```

#### B. Create Service Account for GitHub Actions
```bash
gcloud iam service-accounts create github-agent-runner \
  --display-name="GitHub Actions Antigravity Agent Runner"

# Assign required Vertex AI / Agent Runtime permissions
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:github-agent-runner@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

#### C. Configure Workload Identity Federation (WIF)
Set up keyless authentication between GitHub Actions and GCP:

```bash
# 1. Create Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# 2. Create OIDC Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == '<YOUR_GITHUB_OWNER>/<YOUR_GITHUB_REPO>'" \
  --issuer-uri="https://token.actions.githubusercontent.com/"

# 3. Allow GitHub repository to impersonate the Service Account
GCP_PROJECT_NUMBER=$(gcloud projects describe "${GCP_PROJECT_ID}" --format="value(projectNumber)") && \
gcloud iam service-accounts add-iam-policy-binding "github-agent-runner@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/<YOUR_GITHUB_OWNER>/<YOUR_GITHUB_REPO>"
```

---

### 2. Configure GitHub Repository Variables

Navigate to **Settings** > **Secrets and variables** > **Actions** > **Variables** tab in your GitHub repository, and add:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `GCP_PROJECT_ID` | Your Google Cloud project ID string | `my-gcp-project` |
| `GCP_PROJECT_NUMBER` | Your numeric Google Cloud project number | `123456789012` |

> **Tip:** You can retrieve your project number using:
> ```bash
> gcloud projects describe <YOUR_GCP_PROJECT_ID> --format="value(projectNumber)"
> ```

---

### 3. GitHub Actions Workflow (`.github/workflows/agent-implementation.yml`)

The workflow automatically picks up pending specifications and triggers the agent:

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
          workload_identity_provider: 'projects/${{ vars.GCP_PROJECT_NUMBER }}/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'github-agent-runner@${{ vars.GCP_PROJECT_ID }}.iam.gserviceaccount.com'

      - name: Set up Python
        if: steps.find_spec.outputs.has_spec == 'true'
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Dependencies
        if: steps.find_spec.outputs.has_spec == 'true'
        run: |
          python -m pip install --upgrade pip
          pip install google-genai requests google-auth

      - name: Run Antigravity Managed Agent
        if: steps.find_spec.outputs.has_spec == 'true'
        env:
          GCP_PROJECT_ID: ${{ vars.GCP_PROJECT_ID }}
          GCP_LOCATION: 'global'
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
            --body "Automated spec implementation generated by Antigravity Managed Agent (\`/.agents/agents/eng-team/\`)." \
            --head "${{ github.ref_name }}" \
            --base "main" || echo "PR already exists or update pushed."
```

---

## 🧪 Verification & Testing Flow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. **Add a spec file** under `docs/specs/my-new-feature.md`:
   ```markdown
   # Spec: My New Feature
   - Describe requirements, expected behavior, and acceptance criteria.
   ```
3. **Commit & push:**
   ```bash
   git add docs/specs/my-new-feature.md
   git commit -m "docs: add specification for my new feature"
   git push origin feature/my-new-feature
   ```
4. **Observe GitHub Actions:**
   - The workflow triggers automatically.
   - The Antigravity Managed Agent implements the code and tests.
   - `docs/specs/my-new-feature.md` is moved to `docs/specs/_implemented/my-new-feature.md`.
   - A Pull Request is opened automatically for review.
