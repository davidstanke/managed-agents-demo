#!/usr/bin/env python3
"""CLI entrypoint for running the Unified Implementer ADK Workflow Agent."""

import argparse
import asyncio
import os
from pathlib import Path
import sys
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Ensure repository root is in sys.path
repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from workflow import run_implementer_pipeline


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run the SDLC Implementer Agent on a feature specification."
    )
    parser.add_argument(
        "spec_path",
        help="Path to the specification directory (e.g., specs/000-example) or spec.md file.",
    )
    parser.add_argument(
        "--branch",
        default=None,
        help="Target branch name for implementation changes.",
    )
    parser.add_argument(
        "--base-branch",
        default="main",
        help="Target base branch for implementation changes (defaults to 'main').",
    )
    parser.add_argument(
        "--create-pr",
        action="store_true",
        default=True,
        help="Whether to open/update a pull request on completion.",
    )
    parser.add_argument(
        "--no-create-pr",
        dest="create_pr",
        action="store_false",
        help="Do not open/update a pull request on completion.",
    )
    return parser.parse_args()


async def run_workflow(
    spec_path: str,
    branch: str | None = None,
    base_branch: str = "main",
    create_pr: bool = True,
):
    resolved_path = Path(spec_path)
    if not resolved_path.is_absolute():
        resolved_path = (repo_root / spec_path).resolve()
    else:
        resolved_path = resolved_path.resolve()

    if not resolved_path.exists():
        print(f"Error: Path does not exist: {resolved_path}", file=sys.stderr)
        sys.exit(1)

    target_path = str(resolved_path)

    print("==================================================")
    print(f" Starting Implementer Pipeline for: {target_path}")
    if branch:
        print(f" Target Branch: {branch}")
    print(f" Base Branch:   {base_branch}")
    print("==================================================")

    payload = {
        "spec_path": target_path,
        "base_branch": base_branch,
        "create_pr": create_pr,
    }
    if branch:
        payload["branch"] = branch

    pipeline_status = "completed"
    summary_text = ""

    async for event in run_implementer_pipeline(payload):
        text = str(event)
        if text:
            print(text, flush=True)
        if hasattr(event, "output") and isinstance(event.output, dict):
            if "status" in event.output:
                pipeline_status = event.output["status"]
            if "summary" in event.output:
                summary_text = event.output["summary"]

    step_summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if step_summary_file and summary_text:
        try:
            with open(step_summary_file, "a", encoding="utf-8") as f:
                f.write(f"\n## SDLC Implementer Execution Summary\n\n{summary_text}\n")
        except Exception as e:
            print(f"Warning: could not write GITHUB_STEP_SUMMARY: {e}", file=sys.stderr)

    print("\n==================================================")
    print(f" Pipeline execution completed with status: {pipeline_status}")
    print("==================================================")

    if pipeline_status in ("failed", "blocked", "error"):
        sys.exit(1)


def main():
    args = parse_args()
    asyncio.run(
        run_workflow(
            spec_path=args.spec_path,
            branch=args.branch,
            base_branch=args.base_branch,
            create_pr=args.create_pr,
        )
    )


if __name__ == "__main__":
    main()
