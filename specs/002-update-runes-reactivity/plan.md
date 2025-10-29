# Implementation Plan: Reactivity Upgrade & Period Filter

**Branch**: `002-update-runes-reactivity` | **Date**: 2025-10-23 | **Spec**: [Reactivity Upgrade & Period Filter](../spec.md)  
**Input**: Feature specification from `/specs/002-update-runes-reactivity/spec.md`

## Summary

Upgrade every dashboard module produced in the first feature to Svelte 5 runes reactivity, keeping the existing UX and dark theme identical, while restoring the PeriodFilter component so date presets and custom ranges drive the in-memory analytics exactly as documented.

## Technical Context

**Language/Version**: SvelteKit `^2.43.2`, Svelte `^5.39.5`, TypeScript `^5.9.x`  
**Primary Dependencies**: Tailwind CSS `^4.1.13`, Vite `^7.1.7` (no new runtime dependencies)  
**Storage**: In-memory `transactionsStore` (custom writable store seeded with demo data)  
**Verification**: Manual walkthroughs only (desktop 1440px, tablet 768px, mobile 375px) per constitution and spec  
**Target Platform**: Responsive web dashboards spanning 320px–1440px viewports  
**Project Type**: Single-page SvelteKit application with shared component library  
**Performance Goals**: Dashboard recalculations complete within 2 seconds of an interaction (SC-001)  
**Constraints**: Preserve UI output, adopt `svelte:options runes={true}` across touched components, remove `$:` labels and `$store` syntax in favor of `$state`, `$derived`, and `effect` runes, and keep dependency footprint unchanged  
**Scale/Scope**: One route (`src/routes/+page.svelte`) plus shared modules in `src/lib/components`, `src/lib/stores`, and `src/lib/utils` created in Feature 001

## Constitution Check

- **Clean Code & Readability**: Centralize rune migration helper patterns (store bridging, derived KPIs) to avoid duplication, remove vestigial `$:` statements, and run `pnpm lint`/`pnpm format`/`pnpm check` before review.
- **Simple UX Flows**: No new UI; confirm form submission, filtering, and dashboard reading flows remain single-action and unchanged post-migration.
- **Responsive Across Viewports**: Validate the three breakpoints captured in the spec (375px, 768px, 1440px) after refactors to ensure layout classes still apply.
- **Minimal Dependency Footprint**: No new libraries; rely on existing Svelte/Tailwind stack and internal utilities only.
- **Manual Confidence Over Automation**: Document manual verification steps in PR (form submit, preset toggles, custom range adjustments, seed/clear cycle) and avoid adding automated tests.

## Project Structure

### Documentation (this feature)

```text
specs/002-update-runes-reactivity/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md          # created by /speckit.tasks
```

### Source Code (repository root)

```text
src/
├── lib/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CategoryDonut.svelte
│   │   │   └── TrendChart.svelte
│   │   ├── form/
│   │   │   └── TransactionForm.svelte
│   │   ├── kpi/
│   │   │   └── KpiCard.svelte
│   │   └── table/
│   │       ├── EntriesTable.svelte
│   │       └── PeriodFilter.svelte
│   ├── stores/
│   │   └── transactions.ts
│   └── utils/
│       ├── filters.ts
│       ├── format.ts
│       └── theme.ts
├── routes/
│   └── +page.svelte
└── app.html

static/
└── favicon.png
```

**Structure Decision**: Reuse the existing single-route dashboard architecture; rune migration touches component scripts and shared stores without adding new folders or entry points.

## Complexity Tracking

No constitutional exceptions anticipated; this effort replaces implementation details without expanding scope or dependencies.
