---
description: 'Task list template for feature implementation'
---

# Tasks: Reactivity Upgrade & Period Filter

**Input**: Design documents from `/specs/002-update-runes-reactivity/`
**Prerequisites**: plan.md (required), spec.md, research.md, data-model.md, contracts/

**Manual Validation**: Automated tests are prohibited. Include explicit manual walkthrough tasks for each user story (devices, browsers, accessibility checks) to satisfy the constitution.

**Organization**: Tasks are grouped by user story to enable independent delivery and review of each slice.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **SvelteKit app**: `src/routes/` for pages, `src/lib/` for shared components/stores, `static/` for public assets
- Keep dependencies within package.json; flag any additions explicitly
- Tailwind utilities live inline; avoid new global stylesheets unless justified

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align environment, documentation, and baselines before rune migration work begins.

- [x] T001 Verify SvelteKit, Svelte, Tailwind, and Vite versions in `package.json` align with `specs/002-update-runes-reactivity/plan.md` requirements
- [x] T002 [P] Capture manual validation viewport/device matrix in `specs/002-update-runes-reactivity/checklists/requirements.md` covering 375px, 768px, 1024px, and 1440px flows
- [x] T003 [P] Record pre-migration KPI totals and chart observations from `src/routes/+page.svelte` into `specs/002-update-runes-reactivity/checklists/requirements.md` for comparison

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish reusable rune helpers and shared logic required by all user stories.

- [x] T004 Establish component-level rune subscription pattern mirroring `transactionsStore` via `$effect` to keep local state in sync without touching store modules
- [x] T005 [P] Refactor `src/lib/stores/transactions.ts` to expose clean store methods while remaining rune-free for compliance with Svelte module rules
- [x] T006 [P] Add range summary and adjustment feedback helpers to `src/lib/utils/filters.ts` for reuse by the period filter UI

**Checkpoint**: Rune infrastructure ready—user stories can consume shared helpers without duplicating logic.

---

## Phase 3: User Story 1 - Reliable Transaction Entry (Priority: P1) 🎯 MVP

**Goal**: Keep the transaction form reactive and ensure dashboard state updates instantly after each submission using Svelte 5 runes.

**Independent Test Criteria**:

- Submitting valid income, fixed expense, and variable expense entries updates KPIs, the entries table, and success messaging without console warnings.
- Switching primary categories refreshes subcategory options and clears stale selections automatically.
- Validation errors still block submissions for empty, out-of-range, or invalid entries.

- [x] T007 [US1] Enable runes in `src/routes/+page.svelte`, instantiate the rune-backed transactions snapshot, and replace `$:` statements with `$state`/`$derived` totals and counts
- [x] T008 [P] [US1] Refactor `src/lib/components/form/TransactionForm.svelte` to manage form data with `$state`, run subcategory sync via `effect`, and call `transactionsStore` methods without `$transactionsStore`
- [x] T009 [P] [US1] Update `src/lib/components/table/EntriesTable.svelte` to consume rune snapshot props, derive accent styles without `$transactionsStore`, and keep removal actions reactive
- [x] T010 [US1] Execute manual transaction entry walkthrough on 1440px and 375px viewports and log results in `specs/002-update-runes-reactivity/checklists/requirements.md`

**Checkpoint**: User Story 1 delivers value and is manually verified across required viewports.

---

## Phase 4: User Story 2 - Restore Period Filtering (Priority: P2)

**Goal**: Reinstate the period filter with accurate preset and custom range handling that drives downstream dashboards.

**Independent Test Criteria**:

- Preset selections (This Month, Last Month, Year to Date) update the active range header and refresh dependent data within one second.
- Custom ranges normalize inverted or future dates while surfacing plain-language feedback about adjustments.
- Filtered entries, KPIs, and charts stay aligned with the active period after successive preset toggles.

- [x] T011 [US2] Convert `src/lib/components/table/PeriodFilter.svelte` to runes, reuse `normalizeCustomRange`, and surface feedback with the new filter helpers
- [x] T012 [US2] Restore `<PeriodFilter />` in `src/routes/+page.svelte`, wiring rune snapshot data and range summaries into the dashboard layout
- [x] T013 [US2] Run period filter manual validation on 1024px and 768px viewports—cover presets, custom ranges, and feedback—and document outcomes in `specs/002-update-runes-reactivity/checklists/requirements.md`

**Checkpoint**: User Story 2 integrates cleanly and passes manual validation.

---

## Phase 5: User Story 3 - Preserve Dashboard Confidence (Priority: P3)

**Goal**: Ensure KPI cards and charts remain visually and numerically stable after the reactivity migration.

**Independent Test Criteria**:

- Baseline demo data renders identical KPI totals, chart labels, and entries after refresh.
- Clearing and reseeding sample data never produces empty flashes or mismatched legends.
- Dashboard stays synchronized when filters change rapidly after transactions or reseeds.

- [x] T014 [US3] Refactor `src/lib/components/charts/TrendChart.svelte` to compute geometry with `$derived` runes while preserving existing SVG output
- [x] T015 [P] [US3] Refactor `src/lib/components/charts/CategoryDonut.svelte` to derive arc segments and totals with runes and maintain stable color assignments
- [x] T016 [US3] Ensure `src/routes/+page.svelte` derives KPI strings, chart datasets, and savings rate via runes so clear/seed flows remain flicker-free
- [x] T017 [US3] Perform baseline-versus-post migration comparison on 414px and 1440px viewports (including reseed/clear flows) and record evidence in `specs/002-update-runes-reactivity/checklists/requirements.md`

**Checkpoint**: User Story 3 completes the feature set with documented manual validation.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize documentation and quality gates after all user stories land.

- [x] T018 [P] Update `specs/002-update-runes-reactivity/quickstart.md` with final rune migration notes and consolidated manual QA summary
- [x] T019 Run `pnpm format`, `pnpm lint`, and `pnpm check` from the project root to satisfy `package.json` quality gates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately; establishes documentation and baselines.
- **Phase 2 (Foundational)**: Depends on Setup; creates shared rune helpers required for all stories.
- **Phase 3 (US1)**: Depends on Foundational; supplies MVP transaction flow.
- **Phase 4 (US2)**: Depends on US1 for stable rune snapshot patterns.
- **Phase 5 (US3)**: Depends on US2 to ensure filters feed charts correctly.
- **Phase 6 (Polish)**: Runs after all story phases to wrap documentation and quality gates.

### User Story Dependencies

- **US1 (P1)**: Establishes rune-based transaction synchronization.
- **US2 (P2)**: Builds on US1 snapshot structure to drive the restored filter.
- **US3 (P3)**: Relies on US2’s filter accuracy to validate KPI and chart consistency.

### Within Each User Story

- Migrate shared helpers before touching components that consume them.
- Update route-level derived state before component-level adjustments to avoid double work.
- Run manual validations immediately after implementation while context is fresh.

### Parallel Opportunities

- Setup documentation tasks (T002, T003) can proceed alongside dependency verification.
- After T005 lands, component migrations marked [P] (T008, T009, T015) can run concurrently on separate files.
- Documentation updates (T018) can start while final formatting checks (T019) await code freeze.

### Parallel Execution Examples

- **US1**: One developer handles `TransactionForm.svelte` (T008) while another converts `EntriesTable.svelte` (T009) once T007 completes.
- **US2**: After T011, a second developer can focus on layout wiring in `+page.svelte` (T012) while the first documents validation (T013).
- **US3**: Chart migrations (T014, T015) can progress in parallel before consolidating derived state in `+page.svelte` (T016).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phases 1–2 to establish rune helpers.
2. Deliver User Story 1 (T007–T010) and run manual validation.
3. Share MVP for feedback before proceeding.

### Incremental Delivery

1. Ship US1 with verified transaction flow.
2. Layer in US2 to restore filtering, validate presets/custom ranges, and demo.
3. Finish with US3 to reconfirm dashboard integrity, then execute polish tasks.

### Parallel Team Strategy

1. Pair on Foundational tasks to land rune helpers quickly.
2. Split component migrations by file ownership (form/table/filter/charts) using [P] tasks to avoid conflicts.
3. Rotate manual validation ownership per story so evidence is captured alongside implementation.

---

## Notes

- [P] tasks = different files, no dependencies.
- Keep file paths explicit to protect cleanliness and traceability.
- Record manual validation steps alongside implementation to replace automated tests.
- Avoid introducing new dependencies without constitution-level justification.
