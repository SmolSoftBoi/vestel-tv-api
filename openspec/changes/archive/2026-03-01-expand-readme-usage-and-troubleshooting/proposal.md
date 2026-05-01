## Why

The current README is too minimal for new users to set up and validate compatibility confidently. We need clear onboarding documentation now to reduce avoidable integration failures and support churn.

## What Changes

- Add a `Supported brands and models` section that states supported Vestel-manufactured brands/model families and clearly marks unknown or unverified compatibility.
- Add a `How to identify your model` section with practical steps (TV label, TV settings menu, and discovery metadata such as manufacturer/model fields).
- Add a `Prerequisites` section covering runtime requirements and network assumptions.
- Add a `Quick start` section and runnable examples for discovery and common control actions.
- Add a `Troubleshooting` section for the most common failure modes (discovery issues, feature capability mismatches, and wake/connectivity problems) that links users to a dedicated GitHub diagnostics issue template.
- Add a GitHub issue template file for structured diagnostics collection in issue reports.

## Capabilities

### New Capabilities
- `readme-onboarding-and-compatibility`: Defines required README coverage for compatibility, model identification, setup, examples, troubleshooting guidance, and issue-report diagnostics collection via GitHub issue template.

### Modified Capabilities
- None.

## Impact

- Documentation: `README.md`, `.github/ISSUE_TEMPLATE/vestel-tv-diagnostics.yml`
- Developer onboarding and support workflows (clearer setup and compatibility guidance)
- No runtime code, API, or dependency changes
