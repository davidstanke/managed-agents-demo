#!/usr/bin/env python3
"""CLI entrypoint for running the Unified Implementer ADK Workflow Agent."""

import argparse
import asyncio
from pathlib import Path
import sys
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Ensure repository root is in sys.path
repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from google.adk.runners import InMemoryRunner
from google.genai import types

from agent import app


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run the Unified Implementer ADK Agent on a feature specification."
    )
    parser.add_argument(
        "spec_path",
        help="Path to the specification directory (e.g., specs/000-example) or spec.md file.",
    )
    return parser.parse_args()


async def run_workflow(spec_path: str):
    resolved_path = Path(spec_path).resolve()
    if resolved_path.is_dir():
        spec_file = resolved_path / "spec.md"
        if not spec_file.exists():
            print(f"Error: No spec.md found in directory: {resolved_path}", file=sys.stderr)
            sys.exit(1)
        target_path = str(resolved_path)
    elif resolved_path.is_file():
        target_path = str(resolved_path.parent)
    else:
        print(f"Error: Path does not exist: {resolved_path}", file=sys.stderr)
        sys.exit(1)

    print(f"==================================================")
    print(f" Starting Implementer Workflow for: {target_path}")
    print(f"==================================================")

    runner = InMemoryRunner(app=app)
    session = await runner.session_service.create_session(
        app_name="implementer_agent",
        user_id="cli_user"
    )

    user_content = types.Content(
        role="user",
        parts=[types.Part.from_text(text=target_path)]
    )

    async for event in runner.run_async(
        user_id="cli_user",
        session_id=session.id,
        new_message=user_content,
    ):
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    print(part.text, flush=True)

    print(f"\n==================================================")
    print(f" Workflow execution completed.")
    print(f"==================================================")


def main():
    args = parse_args()
    asyncio.run(run_workflow(args.spec_path))


if __name__ == "__main__":
    main()
