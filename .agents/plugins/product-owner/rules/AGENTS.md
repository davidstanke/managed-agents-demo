# Multi-Agent Spec Rules

These rules apply when authoring and reviewing feature specifications in this workspace:

1. **Grounded & Verifiable Specifications**:
   - Every specification must be grounded in user requirements, explicit domain models / data contracts, and unambiguous Given/When/Then acceptance criteria. Never generate abstract specifications.

2. **Requirements Focus (No Implementation Details)**:
   - Specifications must focus strictly on product requirements, user behavior, domain boundaries, and verifiable acceptance criteria.
   - Do NOT include technical code implementation specifics, target source file paths, class/function scaffolding, or programming language implementation details.

3. **Parallel Fast Review & Direct Synthesis**:
   - Product, Technical Feasibility, and Security reviews run independently and in parallel using fast model tiers (`model: flash`).
   - Reviewers return structured assessments directly in their completion payloads (pure in-memory, no intermediate file writes).
   - Lead Author (`spec-dra`) synthesizes reviewer feedback directly into the specification. If an irreconcilable functional or security blocker (<50) is detected, `spec-dra` prompts the user interactively.

4. **Unified Specification Artifact**:
   - `spec-dra` writes the consolidated, certified specification to `docs/specs/<feature_dir>/SPECIFICATION.md`, embedding the Review Scorecard and any deferred items in the appendix.

5. **Spec-Only Scope**:
   - The sole objective of `product-owner` (including `spec-dra` and the reviewer agents) is to deliver a complete, certified specification document. It does not perform, manage, or reference code implementation.


