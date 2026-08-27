---
name: spec-council-engine
description: Multi-Agent Spec-Driven Authoring & Review Engine. Enforces specification quality standards, INVEST criteria, and parallel Reviewer evaluation (Product, Tech, Security) to produce certified specifications.
---

# Multi-Agent Spec-Driven Authoring & Review Engine

This skill provides operational guidelines, quality rubrics, and BDD templates for transforming software concepts into clear, deterministic, and certified product specifications. Its sole responsibility is delivering a certified specification document—it does not specify or perform code implementation.

---

## 🏗️ The 2-Phase Lifecycle

```
┌────────────────────────────────────────────────────────────────────────┐
│                   2-Phase Spec Authoring & Review Engine               │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Spec Drafting (DRA)            │ 2. Parallel Review & Synthesis     │
│    (spec-dra)                     │    (Prod, Tech, Sec -> spec-dra)   │
└───────────────────────────────────┴────────────────────────────────────┘
```

1. **Phase 1: Spec Authoring (`spec-dra`)**:
   - Clarifies ambiguous requirements early with the user using `ask_question`.
   - Defines clear user personas, business value, user workflows, BDD acceptance criteria, and data contracts.
   - Focuses strictly on product requirements and behavior without code implementation details.

2. **Phase 2: Parallel Review & Direct Synthesis**:
   - **Direct Top-Level Invocation & Visibility**: The parent orchestrator invokes `product-reviewer`, `tech-reviewer`, and `security-reviewer` in parallel as direct subagents via `invoke_subagent` (`model: flash`). This ensures all reviewer agents appear actively in Antigravity's **Subagents** panel.
   - **In-Memory Payloads**: Reviewers return structured assessments directly in their completion payloads (pure in-memory, no intermediate file writes).
   - **Direct Synthesis & Blocker Resolution**: The review scores and feedback are synthesized directly into the specification. If any reviewer identifies an irreconcilable critical blocker (<50), consult the user interactively via `ask_question`.
   - **Final Delivery**: Write the certified specification with embedded review scorecard directly to `docs/specs/<feature_dir>/SPECIFICATION.md`.

---

## 📊 The Adapted INVEST Framework for Specs

All specifications and stories must satisfy INVEST principles:

* **I - Independent**: The story must be clearly scoped without unstated external dependencies.
* **N - Negotiable**: Captures business intent and value while leaving technical details open within defined architectural boundaries.
* **V - Valuable**: Delivers clear, verifiable functional value or technical capability.
* **E - Estimable / Feasible**: Functional context is clear enough to evaluate without ambiguity.
* **S - Small**: Sized to fit comfortably as a focused, cohesive feature scope.
* **T - Testable / Verifiable**: Acceptance criteria are concrete, measurable, and unambiguous via Given/When/Then scenarios.

---

## 📋 Standard Specification Layout

Every generated specification must follow this structure:

```markdown
# [FEATURE-ID]: [Short, Descriptive Summary]

**Issue Type:** User Story / Feature Spec
**Status:** Certified
**Priority:** [High / Medium / Low]

## 1. Description & Context
**As a** [Persona / Role],
**I want to** [Action / Feature / Goal],
**So that** [Benefit / Value / Reason].

## 2. Business Context & User Workflow
[Concise explanation of business context, user workflows, and target personas]

## 3. Behavior-Driven Development (BDD) Acceptance Criteria
* **AC1: [Scenario Title - Happy Path]**
  * **Given** [explicit initial state, authenticated user, or preconditions]
  * **When** [action, event trigger, or user interaction]
  * **Then** [expected state delta, response outcome, or visible result]
* **AC2: [Scenario Title - Error / Edge Case]**
  * **Given** [precondition with invalid input or missing authorization]
  * **When** [action or trigger occurs]
  * **Then** [expected error response, message, or fallback behavior]

## 4. Constraints, Boundaries & Out of Scope
* **Non-Functional Requirements (NFRs):** [Performance metrics, latency targets, security/auth policies, rate limits]
* **In-Scope:** [Explicit list of capabilities and behaviors to deliver]
* **Out of Scope:** [Explicit non-goals to prevent scope creep]

## 5. Specification Quality Checklist
* [ ] **Requirements Clarity:** User persona, business intent, and value proposition clearly stated.
* [ ] **BDD Acceptance Coverage:** Given/When/Then scenarios cover happy paths, error handling, and edge cases.
* [ ] **Scope Boundaries:** In-scope and out-of-scope boundaries explicitly demarcated.
* [ ] **Data & Contract Definitions:** Request/response schemas, state changes, and types explicitly documented.

## 6. Review & Quality Scorecard
### Consensus Scorecard
| Reviewer Role | Score (1-100) | Status | Key Focus Area |
| :--- | :--- | :--- | :--- |
| **Product Reviewer** | [Score]/100 | [Approved / Needs Revision] | INVEST, User Personas, Edge Cases |
| **Tech Reviewer** | [Score]/100 | [Approved / Needs Revision] | Feasibility, Data Contracts, NFRs |
| **Security Reviewer** | [Score]/100 | [Approved / Needs Revision] | OWASP, Auth/RBAC, Threat Hygiene |
| **Overall Verdict** | **[Average]/100** | **CERTIFIED_APPROVED** | Single-pass synthesis by spec-dra |

### Synthesis Notes & Addressed Feedback
* [Summary of improvements made during review synthesis]

### Future Scope & Deferred Items (Optional)
* **ITEM-001**: [Non-blocking improvement or future optimization deferred past V1]
```

---

## 📚 Reference Subdocuments & Tooling

* **[BDD & Schema Templates](references/bdd_templates.md)**: Detailed BDD Given/When/Then syntax, REST/GraphQL contracts, and state transition matrices.

