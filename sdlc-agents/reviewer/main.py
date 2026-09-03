#!/usr/bin/env python3
"""CLI entrypoint for running the Unified Reviewer ADK Agent Council."""

import argparse
import asyncio
import json
import os
from pathlib import Path
import sys
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Ensure repository root and package directory are in sys.path
repo_root = Path(__file__).resolve().parent.parent.parent
pkg_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(repo_root))
sys.path.insert(0, str(pkg_dir))

from google.adk.runners import InMemoryRunner
from google.genai import types

try:
    from agent import app as adk_app
except (ImportError, ValueError):
    from .agent import app as adk_app


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run the Unified Reviewer ADK Agent Council on a pull request."
    )
    parser.add_argument(
        "--pr",
        "--pr-number",
        dest="pr_number",
        default=None,
        help="Pull Request number to review (e.g. 42).",
    )
    parser.add_argument(
        "--base-branch",
        default="main",
        help="Base branch to diff against (defaults to 'main').",
    )
    parser.add_argument(
        "--head-sha",
        default=None,
        help="Target commit SHA of the PR head.",
    )
    parser.add_argument(
        "--workspace-dir",
        default=None,
        help="Path to workspace root directory (defaults to repo root).",
    )
    parser.add_argument(
        "--repo-url",
        default=None,
        help="Git repository clone URL.",
    )
    parser.add_argument(
        "--github-token",
        default=None,
        help="GitHub token for API calls and posting review comments.",
    )
    return parser.parse_args()


async def run_workflow(args):
    pr_number = args.pr_number
    base_branch = args.base_branch
    head_sha = args.head_sha or ""
    repo_url = args.repo_url or os.environ.get("REPO_URL", "")
    github_token = (
        args.github_token
        or os.environ.get("GITHUB_TOKEN")
        or os.environ.get("GH_TOKEN", "")
    )

    workspace_dir = (
        Path(args.workspace_dir).resolve()
        if args.workspace_dir
        else repo_root
    )

    print("==================================================")
    print(" Running Reviewer Agent Council")
    print(f" PR Number:    #{pr_number or 'Local'}")
    print(f" Base Branch:  {base_branch}")
    print(f" Head SHA:     {head_sha or 'auto'}")
    print(f" Workspace:    {workspace_dir}")
    print("==================================================")

    payload = {
        "pr_number": pr_number,
        "base_branch": base_branch,
        "head_sha": head_sha,
        "workspace_dir": str(workspace_dir),
        "repo_url": repo_url,
        "github_token": github_token,
    }

    runner = InMemoryRunner(app=adk_app)
    user_id = "gha_reviewer"
    session = await runner.session_service.create_session(
        app_name=adk_app.name,
        user_id=user_id,
    )

    user_content = types.Content(
        role="user",
        parts=[types.Part.from_text(text=json.dumps(payload))],
    )

    workflow_status = "completed"
    summary_text = ""

    async for event in runner.run_async(
        user_id=user_id,
        session_id=session.id,
        new_message=user_content,
    ):
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    print(part.text, flush=True)

        if hasattr(event, "output") and isinstance(event.output, dict):
            if "status" in event.output:
                workflow_status = event.output["status"]
            if "summary" in event.output:
                summary_text = event.output["summary"]

    step_summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if step_summary_file and summary_text:
        try:
            with open(step_summary_file, "a", encoding="utf-8") as f:
                f.write(f"\n## SDLC Pull Request Reviewer Summary\n\n{summary_text}\n")
        except Exception as e:
            print(f"Warning: could not write GITHUB_STEP_SUMMARY: {e}", file=sys.stderr)

    print("\n==================================================")
    print(f" Reviewer pipeline finished with status: {workflow_status}")
    print("==================================================")

    if workflow_status in ("failed", "error"):
        sys.exit(1)


def main():
    args = parse_args()
    asyncio.run(run_workflow(args))


if __name__ == "__main__":
    main()
