import asyncio
from dataclasses import dataclass, field
import os
from pathlib import Path
import re
import subprocess
from typing import Any, AsyncIterator, Dict, List, Optional
from dotenv import load_dotenv

import sys

# Ensure package directory and repo root in sys.path
pkg_dir = Path(__file__).resolve().parent
repo_root = pkg_dir.parent.parent
if str(pkg_dir) not in sys.path:
    sys.path.insert(0, str(pkg_dir))
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

try:
    os.chdir(repo_root)
except Exception:
    pass

load_dotenv()

from google.adk.agents.context import Context
from google.adk.events.event import Event
from google.adk.workflow import Workflow, START
from google.antigravity.hooks import post_tool_call
from google.genai import types

try:
    from .subagents.decomposer import create_decomposer_agent
    from .subagents.test_writer import create_test_writer_agent
    from .subagents.engineer import create_engineer_agent
    from .subagents.test_runner import create_test_runner_agent
except (ImportError, ValueError):
    from subagents.decomposer import create_decomposer_agent
    from subagents.test_writer import create_test_writer_agent
    from subagents.engineer import create_engineer_agent
    from subagents.test_runner import create_test_runner_agent


def _extract_text(node_input: Any) -> str:
    """Extracts plain text string from various ADK/GenAI node input structures."""
    if isinstance(node_input, str):
        return node_input
    if hasattr(node_input, "parts"):
        parts_text = [p.text for p in node_input.parts if hasattr(p, "text") and p.text]
        return "\n".join(parts_text)
    if isinstance(node_input, dict):
        if "text" in node_input:
            return str(node_input["text"])
        if "spec_path" in node_input:
            return str(node_input["spec_path"])
        if "parts" in node_input:
            return "\n".join([str(p.get("text", "")) for p in node_input["parts"] if isinstance(p, dict) and p.get("text")])
    return str(node_input)


def _extract_summary(text: str, default: str = "") -> str:
    """Extracts a SUMMARY line or concise concluding line from subagent output."""
    if not text:
        return default
    for line in text.splitlines():
        if line.strip().upper().startswith("SUMMARY:"):
            return line.strip()[8:].strip()
    non_empty = [
        line.strip()
        for line in text.splitlines()
        if line.strip() and not line.strip().startswith("```") and not line.strip().startswith("#")
    ]
    if non_empty:
        last = non_empty[-1]
        return (last[:140] + "...") if len(last) > 140 else last
    return default


def _extract_runner_telemetry(text: str) -> tuple[bool, str, str]:
    """Parses STATUS, TEST_SUMMARY, and DIAGNOSTICS from test-runner output."""
    passed = "STATUS: PASS" in text or "STATUS:PASS" in text.replace(" ", "")
    summary = ""
    diagnostics = ""
    in_diagnostics = False
    diag_lines = []

    for line in text.splitlines():
        stripped = line.strip()
        if stripped.upper().startswith("TEST_SUMMARY:"):
            summary = stripped[13:].strip()
            in_diagnostics = False
        elif stripped.upper().startswith("DIAGNOSTICS:"):
            first_diag = stripped[12:].strip()
            if first_diag and first_diag.lower() != "none":
                diag_lines.append(first_diag)
            in_diagnostics = True
        elif in_diagnostics:
            if stripped.upper().startswith("STATUS:") or stripped.upper().startswith("COMMAND:") or stripped.upper().startswith("EXIT_CODE:"):
                in_diagnostics = False
            elif stripped:
                diag_lines.append(stripped)

    if diag_lines:
        diagnostics = " | ".join(diag_lines[:2])
        if len(diagnostics) > 160:
            diagnostics = diagnostics[:157] + "..."

    if not summary:
        summary = "All tests passed" if passed else "Tests failed"
    if not diagnostics and not passed:
        error_lines = [l.strip() for l in text.splitlines() if "failed" in l.lower() or "error" in l.lower()]
        diagnostics = error_lines[0] if error_lines else "Verification checks failed"

    return passed, summary, diagnostics


async def branch_init_node(ctx: Context, node_input: Any) -> AsyncIterator[Event]:
    """Initializes git branch for the feature spec."""
    raw_input = _extract_text(node_input)
    clean_path_str = raw_input.strip().strip("`").strip("'").strip('"')

    # Resolve spec directory path
    spec_dir = Path(clean_path_str).resolve()
    if spec_dir.is_file() and spec_dir.name == "spec.md":
        spec_dir = spec_dir.parent

    spec_file = spec_dir / "spec.md"
    if not spec_file.exists():
        raise FileNotFoundError(f"Specification file not found at: {spec_file}")

    feature_name = spec_dir.name
    branch_name = f"feature/{feature_name}"

    yield Event(
        content=types.Content(
            role="model",
            parts=[types.Part.from_text(text=f"[Branch] 🌿 Initializing branch `{branch_name}` for spec at `{spec_dir.name}`...")]
        )
    )

    # Checkout or create branch
    print(f"[Workflow: branch_init] Checking out branch {branch_name}")
    proc = await asyncio.create_subprocess_exec(
        "git", "checkout", "-B", branch_name,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()
    if proc.returncode != 0:
        print(f"[Workflow: branch_init] Git checkout warning: {stderr.decode()}")

    output_data = {
        "spec_dir": str(spec_dir),
        "spec_file": str(spec_file),
        "feature_name": feature_name,
        "branch_name": branch_name,
    }
    yield Event(
        output=output_data,
        content=types.Content(
            role="model",
            parts=[types.Part.from_text(text=f"[Branch] 🌿 Created and checked out feature branch `{branch_name}` successfully.")]
        ),
        state={"spec_info": output_data}
    )


def _extract_task_badge_info(file_path: Path) -> str:
    """Extracts task number, stem, title, and short problem description for streaming badges."""
    stem = file_path.stem
    num_match = re.match(r"^(\d+)", stem)
    task_num = num_match.group(1) if num_match else stem.split("-")[0]

    title = ""
    desc = ""
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception:
        content = ""

    if content:
        title_match = re.search(r"^\s*#\s*(?:Task\s*\[?\d+\]?:\s*)?([^\n]+)", content, re.MULTILINE | re.IGNORECASE)
        if title_match:
            raw_title = title_match.group(1).strip()
            title = re.sub(r"^\[?Task\s*\d+\]?:\s*", "", raw_title, flags=re.IGNORECASE).strip()

        prob_match = re.search(r"##\s*(?:\d+\.\s*)?Problem\s*(?:to\s*Solve)?\s*\n+([^#\n]+)", content, re.IGNORECASE)
        if prob_match:
            raw_desc = prob_match.group(1).strip()
            raw_desc = re.sub(r"^[-*]\s*", "", raw_desc).strip()
            sentences = re.split(r"(?<=[.!?])\s+", raw_desc)
            desc = sentences[0].strip() if sentences else raw_desc
            if len(desc) > 85:
                desc = desc[:82].rsplit(" ", 1)[0] + "..."

    if not title:
        clean_name = re.sub(r"^\d+[-_]?", "", stem).replace("-", " ").replace("_", " ").strip()
        title = clean_name.title() if clean_name else stem

    if desc:
        return f"[Decomposer] 📝 Created task {task_num}: {stem} ({title} - {desc})"
    else:
        return f"[Decomposer] 📝 Created task {task_num}: {stem} ({title})"


async def decomposer_node(ctx: Context, node_input: Dict[str, Any]) -> AsyncIterator[Event]:
    """Runs the decomposer subagent to break the spec into discrete task files with real-time streaming."""
    spec_file = Path(node_input["spec_file"])
    spec_dir = Path(node_input["spec_dir"])
    feature_name = node_input["feature_name"]

    yield Event(
        content=types.Content(
            role="model",
            parts=[types.Part.from_text(text=f"[Decomposer] 📋 Analyzing spec `{spec_file.name}` to generate task decomposition...")]
        )
    )

    print(f"[Workflow: decomposer] Running decomposer agent on {spec_file}")
    tasks_dir = spec_dir / "tasks"
    tasks_dir.mkdir(parents=True, exist_ok=True)

    spec_content = spec_file.read_text(encoding="utf-8")

    event_queue: asyncio.Queue[str] = asyncio.Queue()
    seen_tasks: set[str] = set()
    stop_watcher = asyncio.Event()

    # Pre-populate any existing task files so we only stream new ones
    for existing in tasks_dir.glob("*.md"):
        seen_tasks.add(existing.name)

    async def scan_and_queue_new_tasks():
        if tasks_dir.exists():
            for p in sorted(tasks_dir.glob("*.md")):
                if p.name not in seen_tasks and p.stat().st_size > 0:
                    seen_tasks.add(p.name)
                    # Brief pause to allow concurrent file write flush
                    await asyncio.sleep(0.05)
                    badge = _extract_task_badge_info(p)
                    await event_queue.put(badge)

    @post_tool_call
    async def on_tool_done(data: Any):
        await scan_and_queue_new_tasks()

    async def watcher_loop():
        while not stop_watcher.is_set():
            await scan_and_queue_new_tasks()
            try:
                await asyncio.wait_for(stop_watcher.wait(), timeout=0.15)
            except asyncio.TimeoutError:
                pass
        await scan_and_queue_new_tasks()

    watcher_task = asyncio.create_task(watcher_loop())

    prompt = (
        f"Analyze the specification at `{spec_file}`.\n\n"
        f"Specification Content:\n"
        f"```markdown\n{spec_content}\n```\n\n"
        f"Decompose this specification into multiple discrete, small, independent engineering tasks.\n"
        f"Write each task to a sequentially numbered file under `{tasks_dir}/001-<task-name>.md`.\n"
        f"Ensure each task defines Target Files, Interfaces, Acceptance Criteria, and a Verification Command.\n\n"
        f"Conclude your response with a summary line in this format:\n"
        f"SUMMARY: Created N tasks (001-<name>, 002-<name>, ...)"
    )

    async def run_chat():
        async with create_decomposer_agent(hooks=[on_tool_done]) as decomposer:
            resp = await decomposer.chat(prompt)
            return await resp.text()

    chat_task = asyncio.create_task(run_chat())

    while not chat_task.done() or not event_queue.empty():
        try:
            badge_text = await asyncio.wait_for(event_queue.get(), timeout=0.1)
            print(f"[Workflow: decomposer] {badge_text}")
            yield Event(
                content=types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=badge_text)]
                )
            )
        except asyncio.TimeoutError:
            pass

    decomposer_output = await chat_task
    stop_watcher.set()
    await watcher_task

    while not event_queue.empty():
        badge_text = event_queue.get_nowait()
        print(f"[Workflow: decomposer] {badge_text}")
        yield Event(
            content=types.Content(
                role="model",
                parts=[types.Part.from_text(text=badge_text)]
            )
        )

    # Discover generated task files
    task_files = sorted([str(p) for p in tasks_dir.glob("*.md")])
    if not task_files:
        # Fallback: extract markdown files if the model emitted markdown code blocks with file paths or headings
        pattern = r"```(?:markdown)?\s*(?:# Task\s*\[?(\d+)\]?:\s*([^\n]+)[\s\S]*?)```"
        matches = re.finditer(pattern, decomposer_output, re.IGNORECASE)
        idx = 1
        for m in matches:
            content = m.group(0).strip("`").strip()
            task_name = re.sub(r"[^a-zA-Z0-9_-]", "-", m.group(2).strip().lower()).strip("-")
            filename = f"{idx:03d}-{task_name}.md"
            (tasks_dir / filename).write_text(content, encoding="utf-8")
            idx += 1
        task_files = sorted([str(p) for p in tasks_dir.glob("*.md")])

    # Emit badge for any task files that were not yet emitted (e.g. from fallback)
    for p_str in task_files:
        p = Path(p_str)
        if p.name not in seen_tasks:
            seen_tasks.add(p.name)
            badge = _extract_task_badge_info(p)
            print(f"[Workflow: decomposer] {badge}")
            yield Event(
                content=types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=badge)]
                )
            )

    if not task_files:
        raise RuntimeError(f"Decomposer did not create any task files in {tasks_dir}")

    output_data = {
        **node_input,
        "tasks_dir": str(tasks_dir),
        "task_files": task_files,
        "decomposer_summary": decomposer_output,
    }
    task_names = [Path(p).stem for p in task_files]
    print(f"[Workflow: decomposer] Created {len(task_files)} task files: {task_files}")

    yield Event(
        output=output_data,
        content=types.Content(
            role="model",
            parts=[types.Part.from_text(text=f"[Decomposer] 📋 Generated {len(task_files)} tasks: {', '.join(task_names)}")]
        ),
        state={"tasks_info": output_data}
    )


async def task_orchestrator_node(ctx: Context, node_input: Dict[str, Any]) -> AsyncIterator[Event]:
    """Orchestrates test-writer, engineer, and test-runner subagents through each task."""
    task_files = node_input.get("task_files", [])
    total_tasks = len(task_files)
    results = []
    has_blocker = False

    yield Event(
        content=types.Content(
            role="model",
            parts=[types.Part.from_text(text=f"[Orchestrator] 🚀 Starting task execution pipeline ({total_tasks} tasks total)...")]
        )
    )

    for idx, task_file in enumerate(task_files, 1):
        task_name = Path(task_file).stem
        print(f"\n[Workflow: task_orchestrator] Processing Task {idx}/{total_tasks}: {task_file}")
        task_content = Path(task_file).read_text(encoding="utf-8")

        yield Event(
            content=types.Content(
                role="model",
                parts=[types.Part.from_text(text=f"\n[Task {idx}/{total_tasks}: {task_name}] 🚀 Starting execution")]
            )
        )

        # Step A: Test-Writer Authors Tests
        yield Event(
            content=types.Content(
                role="model",
                parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] 🧪 Test-Writer authoring verification tests...")]
            )
        )
        print(f"[Workflow: task_orchestrator] Invoking test-writer for {task_file}")
        async with create_test_writer_agent() as test_writer:
            tw_prompt = (
                f"You are the Test-Writer Agent. Read the task specification at `{task_file}`:\n\n"
                f"{task_content}\n\n"
                f"Author or update test files to verify all acceptance criteria. "
                f"Do not run tests. Only write/edit test files.\n\n"
                f"Conclude your response with a 1-2 line summary:\n"
                f"SUMMARY: Created/updated <test_files> covering <key criteria>"
            )
            tw_resp = await test_writer.chat(tw_prompt)
            tw_output = await tw_resp.text()

        tw_summary = _extract_summary(tw_output, "Prepared test suite for acceptance criteria")
        yield Event(
            content=types.Content(
                role="model",
                parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] 🧪 Test-Writer prepared tests: {tw_summary}")]
            )
        )

        # Step B: Code/Test Loop (Max 3 turns)
        turn = 0
        task_passed = False
        last_diagnostics = ""

        while turn < 3 and not task_passed:
            turn += 1
            print(f"[Workflow: task_orchestrator] Code/Test Loop - Task {idx}, Turn {turn}/3")
            yield Event(
                content=types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] ⚙️ Engineer implementing solution (Turn {turn}/3)...")]
                )
            )

            # Engineer writes/fixes code
            async with create_engineer_agent() as engineer:
                if turn == 1:
                    eng_prompt = (
                        f"Implement the solution for task `{task_file}`:\n\n"
                        f"{task_content}\n\n"
                        f"Tests have been prepared. Author clean implementation code to satisfy the task. "
                        f"Do not run tests.\n\n"
                        f"Conclude your response with a 1-2 line summary:\n"
                        f"SUMMARY: Modified <files> to implement <key features>"
                    )
                else:
                    eng_prompt = (
                        f"The previous test run failed with diagnostics:\n\n"
                        f"{last_diagnostics}\n\n"
                        f"Analyze the failure, identify the root cause, and update the implementation code. "
                        f"Do not run tests.\n\n"
                        f"Conclude your response with a 1-2 line summary:\n"
                        f"SUMMARY: Resolved <issues> in <files>"
                    )
                eng_resp = await engineer.chat(eng_prompt)
                eng_output = await eng_resp.text()

            eng_summary = _extract_summary(eng_output, "Updated implementation files")
            yield Event(
                content=types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] ⚙️ Engineer completed (Turn {turn}/3): {eng_summary}")]
                )
            )

            yield Event(
                content=types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] 🔬 Test-Runner executing verification tests (Turn {turn}/3)...")]
                )
            )

            # Test-Runner executes verification
            async with create_test_runner_agent() as test_runner:
                tr_prompt = (
                    f"Run the verification command for task `{task_file}`.\n"
                    f"Inspect the task details and test files, execute the tests with `run_command`, "
                    f"and return the structured status report (STATUS: PASS | FAIL)."
                )
                tr_resp = await test_runner.chat(tr_prompt)
                tr_output = await tr_resp.text()

            print(f"[Workflow: task_orchestrator] Test-Runner output:\n{tr_output}")
            passed, test_summary, diag = _extract_runner_telemetry(tr_output)

            if passed:
                task_passed = True
                print(f"[Workflow: task_orchestrator] Task {idx} PASSED on turn {turn}")
                yield Event(
                    content=types.Content(
                        role="model",
                        parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] ✅ Verification PASSED on Turn {turn}/3 ({test_summary})")]
                    )
                )
                break
            else:
                last_diagnostics = tr_output
                yield Event(
                    content=types.Content(
                        role="model",
                        parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] ❌ Verification FAILED on Turn {turn}/3: {diag}")]
                    )
                )
                if turn < 3:
                    yield Event(
                        content=types.Content(
                            role="model",
                            parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] 🔄 Engineer starting Turn {turn + 1}/3 to resolve failures...")]
                        )
                    )

        results.append({
            "task_file": task_file,
            "passed": task_passed,
            "turns_used": turn,
            "diagnostics": last_diagnostics if not task_passed else None,
        })

        if not task_passed:
            has_blocker = True
            print(f"[Workflow: task_orchestrator] Task {idx} failed after 3 turns. Halting task loop.")
            yield Event(
                content=types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] 🛑 Blocked after 3 turns. Halting remaining tasks.")]
                )
            )
            break
        else:
            yield Event(
                content=types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=f"[Task {idx}/{total_tasks}: {task_name}] 🎉 Task COMPLETED successfully ({turn} turn{'s' if turn > 1 else ''}).")]
                )
            )

    status = "completed" if not has_blocker else "blocked"
    output_data = {
        **node_input,
        "results": results,
        "status": status,
    }
    yield Event(
        output=output_data,
        content=types.Content(
            role="model",
            parts=[types.Part.from_text(text=f"[Orchestrator] 🏁 Task orchestration finished with status: {status.upper()}")]
        ),
        state={"execution_results": output_data}
    )


async def pr_node(ctx: Context, node_input: Dict[str, Any]) -> AsyncIterator[Event]:
    """Final node: reports execution outcome and creates GitHub PR if successful."""
    status = node_input.get("status")
    feature_name = node_input.get("feature_name")
    branch_name = node_input.get("branch_name")
    results = node_input.get("results", [])

    summary_lines = [
        f"### SDLC Execution Summary for `{feature_name}`",
        f"- **Branch**: `{branch_name}`",
        f"- **Overall Status**: `{status.upper()}`",
        "",
        "| Task | Status | Turns |",
        "|---|---|---|",
    ]
    for r in results:
        task_name = Path(r["task_file"]).stem
        status_icon = "✅ PASS" if r["passed"] else "❌ FAIL (3 turns exceeded)"
        summary_lines.append(f"| `{task_name}` | {status_icon} | {r['turns_used']} |")

    summary_text = "\n".join(summary_lines)

    if status == "completed":
        summary_text += f"\n\nAll tasks verified. Ready to create Pull Request for branch `{branch_name}`."
    else:
        summary_text += "\n\nBlocker encountered during task execution. Manual intervention required."

    print(f"\n{summary_text}\n")
    yield Event(
        output={"summary": summary_text, "status": status},
        content=types.Content(
            role="model",
            parts=[types.Part.from_text(text=summary_text)]
        )
    )


# Construct the ADK Workflow
implementer_workflow = Workflow(
    name="implementer_workflow",
    description="Automated SDLC Feature Implementer Workflow",
    edges=[
        (START, branch_init_node),
        (branch_init_node, decomposer_node),
        (decomposer_node, task_orchestrator_node),
        (task_orchestrator_node, pr_node),
    ],
)
