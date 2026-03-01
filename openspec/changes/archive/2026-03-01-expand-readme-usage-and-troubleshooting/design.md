## Context

`README.md` currently contains only a title and one sentence, which does not give integrators enough information to evaluate compatibility or get a working setup. The library behaviour already exposes useful compatibility signals (`manufacturer`, `model`) during discovery and has clear runtime requirements (`node` engine in `package.json`), but this is not documented for users.

Constraints:
- Keep the change documentation-only (no runtime behaviour or API shape changes).
- Keep guidance aligned with existing public behaviour in `src/` and scripts in `package.json`.

Stakeholders:
- First-time integrators trying to connect a TV quickly
- Maintainers handling setup/compatibility support queries

## Goals / Non-Goals

**Goals:**
- Add a compatibility section describing supported brands/models and confidence boundaries.
- Add clear steps for identifying a TV model before integration.
- Add prerequisites, quick start examples, and troubleshooting guidance that map to current library behaviour.
- Include structured diagnostics capture for issue reports via a GitHub issue template.
- Reduce avoidable setup failures by making README onboarding actionable.

**Non-Goals:**
- Implementing new discovery, pairing, or remote-control features
- Guaranteeing compatibility for every Vestel-manufactured rebrand without verification
- Creating a separate docs site or large documentation restructure

## Decisions

1. Keep all new onboarding content in `README.md`.
Rationale: This repository has no existing docs structure; centralising onboarding in one file reduces navigation overhead for new users.
Alternative considered: create a `/docs` folder with linked pages. Rejected as unnecessary complexity for current scope.

2. Document compatibility as "known supported" plus explicit caveats.
Rationale: The codebase does not contain a canonical brand/model allow-list. Publishing confidence-based guidance avoids false guarantees while still being useful.
Alternative considered: provide a strict exhaustive compatibility matrix. Rejected because there is no reliable in-repo source of truth.

3. Use model-identification instructions tied to observable data sources.
Rationale: The project can obtain manufacturer/model data via discovery metadata; pairing this with physical label/settings-menu checks gives users multiple routes.
Alternative considered: only recommend one identification path. Rejected due firmware and UI variance across brands/models.

4. Add quick start examples based on existing public APIs and common error states.
Rationale: Users need runnable examples and failure recovery paths grounded in real methods/errors from the current implementation.
Alternative considered: conceptual prose without code snippets. Rejected because it does not reduce time-to-first-success.

5. Move diagnostics capture into a dedicated GitHub issue template and reference it from troubleshooting.
Rationale: Maintainers need consistent, minimal reproduction context, and issue forms enforce required fields better than inline markdown snippets.
Alternative considered: keep an inline diagnostics block in README. Rejected because users often omit required fields when copying manually.

## Risks / Trade-offs

- [Compatibility guidance may age quickly] -> Keep wording explicit about "known/tested" vs "untested" and update sections as reports arrive.
- [Examples may drift from implementation over time] -> Base snippets on current exported APIs and include README review in future behaviour changes.
- [Model-identification steps may differ by firmware/brand skin] -> Provide multiple identification methods and a fallback troubleshooting path.
- [Diagnostics issue form can become too long or noisy] -> Keep required fields minimal and aligned to triage essentials (environment, TV identifiers, discovery output, failing call, observed error).

## Migration Plan

1. Update `README.md` with the new sections and verified examples.
2. Add a GitHub issue template for diagnostics and link to it from troubleshooting.
3. Perform a content sanity pass against `package.json` scripts and current API entrypoints.
4. Validate markdown rendering and command snippet correctness.
5. Merge as a documentation-only change with no rollback needs beyond git revert of README content.

## Open Questions

- Which brands/models should be marked as "confirmed tested" vs "community reported" at merge time?
