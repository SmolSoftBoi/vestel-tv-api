# Capability: README Onboarding and Compatibility

## Purpose

Define the baseline documentation requirements for compatibility, onboarding, troubleshooting, and issue-report diagnostics for this repository.

## Requirements

### Requirement: README SHALL document compatibility coverage
The README SHALL include a dedicated section that describes supported TV brands and model coverage for this library, including explicit boundaries for unverified devices.

#### Scenario: User checks brand/model compatibility before setup
- **WHEN** a user reads the compatibility section
- **THEN** they MUST find a clear list of supported or known-compatible brand/model categories and a clear note about unsupported or unverified coverage

### Requirement: README SHALL explain how to identify a TV model
The README SHALL provide actionable steps for identifying a TV model and manufacturer before integration, using at least two independent identification methods.

#### Scenario: User needs to identify model for compatibility checks
- **WHEN** a user follows the model-identification guidance
- **THEN** they MUST be able to retrieve model/manufacturer information using documented sources such as device labels, TV settings UI, or discovery metadata

### Requirement: README SHALL define prerequisites
The README SHALL include a prerequisites section that states runtime, environment, and network assumptions required for successful operation.

#### Scenario: User validates environment before running examples
- **WHEN** a user reviews prerequisites
- **THEN** they MUST be able to confirm required Node.js version and core network/setup assumptions before attempting integration

### Requirement: README SHALL provide quick start and examples
The README SHALL include a quick start path and examples for device discovery and at least one common control workflow.

#### Scenario: User performs first successful integration
- **WHEN** a user follows the quick start and example snippets
- **THEN** they MUST be able to run discovery and execute a documented control action using current public APIs

### Requirement: README SHALL include troubleshooting guidance
The README SHALL contain troubleshooting guidance for common setup and runtime failures encountered during discovery and control workflows, and SHALL direct users to the repository diagnostics issue template.

#### Scenario: User encounters a common failure mode
- **WHEN** a user sees an expected error or non-working behaviour during setup
- **THEN** they MUST find a matching troubleshooting entry with likely cause and practical remediation steps

#### Scenario: User reports an issue to maintainers
- **WHEN** a user follows troubleshooting guidance to report an unresolved issue
- **THEN** they MUST find a link to a diagnostics issue template that requests key triage details (environment, TV manufacturer/model identifiers, discovery output, failing action, and error message)

### Requirement: Repository SHALL provide a diagnostics issue template
The repository SHALL include a GitHub issue template dedicated to Vestel TV diagnostics reports, with structured fields for environment, TV details, discovery output, failing action, and error output.

#### Scenario: Maintainer receives a new diagnostics issue
- **WHEN** a user opens a new issue using the diagnostics template
- **THEN** the issue form MUST capture the required triage fields in a consistent structure
