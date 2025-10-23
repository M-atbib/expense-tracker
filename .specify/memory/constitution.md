<!--
Sync Impact Report
Version change: n/a → 1.0.0
Modified principles: Clean Code & Readability; Simple UX Flows; Responsive Across Viewports; Minimal Dependency Footprint; Manual Confidence Over Automation
Added sections: Implementation Constraints; Workflow Expectations
Removed sections: None
Templates requiring updates: ✅ .specify/templates/plan-template.md; ✅ .specify/templates/spec-template.md; ✅ .specify/templates/tasks-template.md; ✅ AGENTS.md
Follow-up TODOs: None
-->

# Expense Tracker Constitution

## Core Principles

### Clean Code & Readability
We ship Svelte and TypeScript that is self-explanatory, modular, and lint-clean. Every change MUST
leave files clearer than before—prefer extracting helpers into `src/lib` over adding inline
complexity, keep functions short, and delete dead code immediately. This keeps the codebase easy to
review and safe for rapid manual verification.

### Simple UX Flows
User journeys MUST be obvious on first use: one action per screen, minimal configuration, and clear
copy. Favor defaults that work out of the box and remove toggles or options that introduce friction.
Delivering a focused experience accelerates decision-making and prevents regressions when we iterate
quickly by hand.

### Responsive Across Viewports
Every UI must adapt seamlessly from mobile (min 320px) through widescreen layouts. Implement with
Tailwind utility classes, flex/grid primitives, and semantic markup so we avoid custom CSS bloat.
Consistent responsiveness ensures the tracker remains usable during manual QA on any device.

### Minimal Dependency Footprint
Default to built-in SvelteKit, Svelte `^5.39.5`, and Tailwind CSS `^4.1.13`. Any extra dependency
MUST have a written justification tied to user value and be tracked for removal when no longer
essential. A lean stack keeps bundle size predictable and simplifies long-term maintenance.

### Manual Confidence Over Automation
Automated tests are prohibited. We rely on linting, TypeScript checks, and deliberate manual
walkthroughs to validate behavior. Document manual verification steps with each change so reviewers
can reproduce results quickly. This focus keeps the team aligned on human-centric quality gates.

## Implementation Constraints

- Framework versions are locked to the repository `package.json`: SvelteKit `^2.43.2`, Svelte
  `^5.39.5`, Tailwind CSS `^4.1.13`, and Vite `^7.1.7`. Upgrades require a governance amendment.
- Styling defaults to Tailwind utilities and component-scoped styles; introduce custom CSS files only
  when Tailwind cannot express the need succinctly.
- Persist shared utilities in `src/lib` and keep route files focused on data orchestration plus
  presentation.
- New tooling, plugins, or build steps must not add automated testing capabilities.

## Workflow Expectations

- Start every feature with a lightweight plan identifying the minimal UX slice and manual validation
  steps.
- Run `pnpm lint`, `pnpm format`, and `pnpm check` before requesting review; these are the only
  mandatory gates.
- Record manual walkthrough notes (screenshots, bullet steps) in PR descriptions to create a living
  QA log.
- Prioritize accessibility basics (semantic HTML, focus management) during manual checks to support
  simple UX and responsive design.

## Governance

- This constitution supersedes conflicting guidance in templates or docs. Amendments require consensus
  during review and documentation of rationale in the PR description.
- Versioning follows semantic rules: bump MAJOR for principle changes that relax or contradict prior
  mandates; MINOR for new principles or sections; PATCH for clarifications.
- The maintainer on call records the amendment date and version in this file and updates all related
  templates the same day.
- Compliance is reviewed at plan time using the Constitution Check gate and again during code review;
  deviations require an explicit follow-up task with owner and due date.

**Version**: 1.0.0 | **Ratified**: 2025-10-23 | **Last Amended**: 2025-10-23
