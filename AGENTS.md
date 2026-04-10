# AGENTS.md

## Project overview

This repository contains a local-first Node.js application for authorized Canvas administrators to run, inspect, and chain Canvas API requests from their own computer.

The application is intended for administrative use in higher education, with special attention to:

- security of bearer tokens
- safe handling of institutional and student-related data
- reliable execution of Canvas API workflows
- strong test coverage
- modular architecture that limits regressions
- maintainable code and documentation

This project is not a cloud token broker and must not require persistent storage of Canvas credentials outside the user's own device.

---

## Core operating rules

When working in this repository, prioritize the following in order:

1. Protect credentials.
2. Protect institutional data.
3. Preserve correctness.
4. Preserve modularity.
5. Maintain or improve test coverage.
6. Keep the code understandable to future maintainers.

Do not trade security or maintainability for speed.

---

## Technology direction

Unless explicitly changed by the user, assume:

- Runtime: Node.js
- Language: TypeScript preferred
- Package manager: npm
- Test framework: Vitest or Jest
- Linting: ESLint
- Formatting: Prettier if added
- HTTP layer: a dedicated Canvas API client module, not ad hoc fetch calls scattered across the codebase

If the repository later adopts a different package manager or toolchain, update this file immediately.

---

## Product expectations

The application should support the following capabilities:

- store one or more Canvas environment profiles locally
- save bearer tokens securely in the local OS keychain
- build and run individual Canvas API requests
- chain requests into reusable workflows
- inspect request and response metadata safely
- support pagination and rate-limit-aware behavior
- separate read-only operations from mutating operations
- make destructive actions harder to run accidentally
- produce sanitized logs and diagnostics without exposing secrets

---

## Security requirements

### Credentials

Canvas bearer tokens are sensitive credentials.

Required behavior:

- Store tokens only in the user's device keychain.
- Never persist tokens in plaintext files.
- Never persist tokens in `.env` files intended for long-term use.
- Never write tokens to logs, test fixtures, screenshots, commit history, or exported artifacts.
- Never print full `Authorization` headers.
- Never commit real Canvas URLs tied to sensitive environments together with live credentials.
- Mask token values whenever the UI or CLI confirms that a token exists.

Preferred implementation:

- Create a small dedicated secrets module with a narrow interface such as:
  - `saveToken(profileName, token)`
  - `getToken(profileName)`
  - `deleteToken(profileName)`
  - `hasToken(profileName)`

No other module should implement credential persistence directly.

### Data handling

Assume Canvas responses may contain sensitive institutional information, including student, course, enrollment, grading, and user data.

Required behavior:

- Minimize local caching.
- Cache only when needed for product behavior.
- Prefer short-lived in-memory state over persistent storage.
- Redact or omit sensitive payload fields from logs and diagnostics.
- Do not add telemetry that sends Canvas data to third-party services.

### Network behavior

- Use HTTPS for Canvas API calls.
- Keep environment configuration explicit.
- Make it difficult to confuse production and test environments.
- Keep profile names clear, such as `uwm-prod`, `uwm-test`, or similarly explicit labels.

---

## UWM-oriented constraints

This tool must be suitable for use in an institutional environment with administrative sensitivity.

Design and implementation choices should assume:

- least-privilege use
- privacy-conscious defaults
- controlled access by authorized administrators
- careful handling of records and exports
- accessibility-conscious interface and documentation
- no casual leakage of student or instructional data

When unsure, choose the option that is more local, more inspectable, less persistent, and easier to test.

---

## Architecture rules

The codebase must remain highly modular.

Use clear separation between:

- presentation layer
- application/service layer
- workflow engine
- Canvas API client
- secrets/keychain adapter
- validation and schema logic
- domain models and shared types

Do not collapse these concerns into large utility files.

### Required boundaries

#### Presentation layer
Responsible for CLI, local web UI, or desktop UI behavior only.

It may:

- collect input
- show results
- show errors
- show previews

It must not:

- contain Canvas business logic
- store secrets directly
- implement workflow execution rules directly

#### Application/service layer
Coordinates user intent.

Examples:

- run a request
- run a workflow
- load a profile
- preview a change
- export sanitized diagnostics

#### Canvas API client
Responsible for HTTP interactions with Canvas.

Examples:

- request construction
- auth header injection
- pagination handling
- rate limit awareness
- endpoint helpers
- structured error handling

#### Workflow engine
Responsible for chaining requests.

Examples:

- step sequencing
- interpolation of prior results
- dependency handling
- stop-on-failure behavior
- preview mode where feasible
- classification of read-only vs mutating steps

#### Secrets layer
Responsible only for local keychain interaction.

This should be small, isolated, and heavily tested.

---

## Testing requirements

Tests are mandatory.

Every meaningful feature should include appropriate test coverage.

### Required test types

- Unit tests for pure logic.
- Unit tests for request builders and validators.
- Unit tests for workflow interpolation and dependency handling.
- Integration tests for Canvas client behavior with mocked HTTP responses.
- Integration tests for workflow execution paths.
- Regression tests for every bug fix.

### Test rules

- Every bug fix must include a regression test.
- New functionality must not rely on manual testing alone.
- Do not use real bearer tokens in tests.
- Do not rely on live production Canvas environments in the default test path.
- Mock keychain access in automated tests.
- Mock network responses unless a test is explicitly designated as controlled integration testing.

### Before considering a task complete

Run, at minimum, the repository’s standard checks:

- install dependencies
- lint
- typecheck
- unit tests
- integration tests that do not require live secrets

If commands change, update this file.

---

## Workflow-engine expectations

This project’s distinctive feature is chaining Canvas API requests. Treat workflow reliability as first-class.

Required behavior:

- Each workflow step must be explicit.
- Inputs and outputs between steps must be validated.
- The engine must distinguish read-only operations from mutating operations.
- Failure handling must be predictable.
- Destructive or broad-impact operations should require extra confirmation or guardrails in the product design.
- Preview or dry-run behavior should be supported wherever realistic.
- Pagination and partial failures must be handled deliberately, not accidentally.

Do not pass unvalidated giant response objects through the workflow engine without clear shaping or typing.

Prefer:

- typed step inputs
- typed step outputs
- narrow transforms
- explicit mapping of values from one step to the next

---

## Canvas API implementation guidance

When adding or changing Canvas API behavior:

- centralize endpoint construction
- centralize pagination logic
- centralize rate-limit handling
- centralize error normalization
- avoid duplicate endpoint wrappers across files
- distinguish transport errors from Canvas API errors
- preserve useful metadata such as status code, request path, and pagination state

Do not scatter raw fetch calls across unrelated modules.

---

## Logging and diagnostics

Logging must be useful but sanitized.

Allowed examples:

- HTTP method
- endpoint path
- status code
- request duration
- pagination state
- profile name if non-sensitive
- sanitized error classification

Do not log:

- bearer tokens
- authorization headers
- full raw request headers
- raw payloads containing sensitive records by default

If a debug mode is added, it must still redact secrets and should be clearly opt-in.

---

## UX and accessibility expectations

Even if this begins as an internal admin tool, it should still be usable and accessible.

Required expectations:

- keyboard-friendly interaction
- visible and understandable error states
- clear distinction between preview and execute
- avoid color-only indicators
- support readable structured output
- use plain language in user-facing error messages where possible
- make destructive actions visually and behaviorally distinct

If a local web UI or desktop UI is built, ensure controls are labeled clearly enough for assistive technology.

---

## Documentation requirements

Keep documentation current.

The repository should maintain:

- `README.md` for human-oriented setup and overview
- `AGENTS.md` for coding-agent instructions
- architecture notes for major design decisions
- setup instructions for local development
- testing instructions
- security notes for credential handling
- sanitized examples of workflow definitions or request chains

Never include real credentials or sensitive screenshots in documentation.

---

## Preferred implementation habits

When making changes:

- keep diffs focused
- avoid incidental refactors unless they are necessary
- name files and functions according to responsibility
- prefer explicit types over loose objects
- add or update tests alongside the change
- update documentation when behavior changes
- keep functions and modules small enough to reason about

If a file starts doing multiple unrelated jobs, split it.

---

## Anti-patterns to avoid

Do not:

- store tokens in files
- put business logic in UI components
- create a single catch-all `utils` file
- introduce hidden global mutable state
- bypass tests for “small” changes
- mix mock and live Canvas behavior in the same default test path
- add convenience exports that leak sensitive data
- make broad mutating Canvas actions easy to trigger accidentally
- swallow API errors without preserving useful context

---

## Definition of done

A task is done only when:

- the implementation is modular
- tests pass
- new logic is covered by tests
- secrets are handled safely
- logs remain sanitized
- documentation is updated if needed
- the change does not introduce obvious regression risk

---

## If instructions conflict

Follow this priority order:

1. direct user request
2. this `AGENTS.md`
3. existing repository architecture and tests
4. incidental convenience

If the repository later adds a more specific nested `AGENTS.md` in a subdirectory, the more specific file should govern work in that subtree.
