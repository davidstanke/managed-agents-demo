#!/usr/bin/env python3
"""Invokes the Cloud Run Pull Request Reviewer Agent Service with SSE streaming."""

import json
import os
import sys
import urllib.request
import urllib.error

def main():
    service_url = os.environ.get("REVIEWER_SERVICE_URL", "").rstrip("/")
    id_token = os.environ.get("GCP_ID_TOKEN", "")
    pr_number = os.environ.get("PR_NUMBER", "")
    repo_url = os.environ.get("REPO_URL", "")
    branch = os.environ.get("BRANCH", "")
    base_branch = os.environ.get("BASE_BRANCH", "main")
    github_token = os.environ.get("GITHUB_TOKEN", "")
    step_summary_file = os.environ.get("GITHUB_STEP_SUMMARY", "")

    if not service_url:
        print("::error::REVIEWER_SERVICE_URL environment variable is missing.", file=sys.stderr)
        sys.exit(1)
    if not pr_number:
        print("::error::PR_NUMBER environment variable is missing.", file=sys.stderr)
        sys.exit(1)

    endpoint = f"{service_url}/tasks"
    payload = {
        "pr_number": pr_number,
        "repo_url": repo_url,
        "branch": branch,
        "base_branch": base_branch,
        "github_token": github_token,
    }

    data_bytes = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
    }
    if id_token:
        headers["Authorization"] = f"Bearer {id_token}"

    print(f"============================================================")
    print(f" Dispatching Pull Request #{pr_number} to Reviewer Agent (Cloud Run)")
    print(f" Endpoint:    {endpoint}")
    print(f" PR Number:   #{pr_number}")
    print(f" Branch:      {branch}")
    print(f" Base Branch: {base_branch}")
    print(f"============================================================\n")

    req = urllib.request.Request(endpoint, data=data_bytes, headers=headers, method="POST")

    full_output_lines = []
    summary_captured = []
    in_summary = False
    workflow_status = "completed"

    try:
        with urllib.request.urlopen(req, timeout=3600) as response:
            for raw_line in response:
                line = raw_line.decode("utf-8", errors="replace")
                # Handle SSE lines
                if line.startswith("data: "):
                    content = line[6:].rstrip("\r\n")
                    print(content, flush=True)
                    full_output_lines.append(content)

                    if "### SDLC Execution Summary" in content:
                        in_summary = True
                    if in_summary:
                        summary_captured.append(content)
                    if "status: BLOCKED" in content or "status: ERROR" in content or "🛑 Blocked" in content:
                        workflow_status = "blocked"
                elif line.startswith("data:"):
                    content = line[5:].rstrip("\r\n")
                    print(content, flush=True)
                    full_output_lines.append(content)
                elif line.strip() and not line.startswith(":"):
                    print(line.rstrip("\r\n"), flush=True)
                    full_output_lines.append(line.rstrip("\r\n"))
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8", errors="replace")
        print(f"::error::Cloud Run reviewer service responded with HTTP {e.code}: {error_msg}", file=sys.stderr)
        if step_summary_file:
            with open(step_summary_file, "a", encoding="utf-8") as f:
                f.write(f"### ❌ Reviewer Agent Error (HTTP {e.code})\n\n```\n{error_msg}\n```\n")
        sys.exit(1)
    except Exception as e:
        print(f"::error::Reviewer execution failed: {str(e)}", file=sys.stderr)
        if step_summary_file:
            with open(step_summary_file, "a", encoding="utf-8") as f:
                f.write(f"### ❌ Reviewer Agent Execution Failure\n\n```\n{str(e)}\n```\n")
        sys.exit(1)

    # Write Step Summary for GitHub Actions
    if step_summary_file:
        summary_text = "\n".join(summary_captured) if summary_captured else "\n".join(full_output_lines[-20:])
        with open(step_summary_file, "a", encoding="utf-8") as f:
            f.write(f"## SDLC Pull Request Reviewer Run Results\n\n{summary_text}\n")

    if workflow_status == "blocked":
        print("\n::error::Reviewer Agent encountered blockers during execution.", file=sys.stderr)
        sys.exit(1)

    print("\n[Done] Reviewer workflow completed successfully.")

if __name__ == "__main__":
    main()
