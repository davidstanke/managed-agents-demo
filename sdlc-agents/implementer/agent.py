"""Unified Implementer ADK Agent definition."""

from google.adk.apps.app import App

try:
    from .workflow import implementer_workflow
except (ImportError, ValueError):
    from workflow import implementer_workflow

root_agent = implementer_workflow
app = App(name="implementer_agent", root_agent=root_agent)

__all__ = ["app", "root_agent", "implementer_workflow"]
