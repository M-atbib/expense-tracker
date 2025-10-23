---

description: "Task list template for feature implementation"
---

# Tasks: Expense Tracker Launch Page

**Input**: Design documents from `/specs/001-setup-expense-dashboard/`
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

**Purpose**: Align project structure, deps, and tooling before story work

- [ ] T001 Update `package.json` to add the `date-fns` dependency required by the plan
- [ ] T002 Scaffold shadcn-svelte configuration in `components.json` and wire CLI scripts in `package.json`
- [ ] T003 Create dark-mode theme tokens in `src/app.postcss` using `@theme` variables
- [ ] T004 Extend `tailwind.config.ts` to consume `@theme` tokens and register shadcn presets
- [ ] T005 Create `docs/manual-validation.md` with sections for US1–US3 walkthrough notes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story work

- [ ] T006 Define shared finance types in `src/lib/types.ts`
- [ ] T007 Implement date range helpers in `src/lib/utils/filters.ts`
- [ ] T008 Add theme utilities (CSS variable getters) in `src/lib/utils/theme.ts`
- [ ] T009 Build the in-memory transaction store in `src/lib/stores/transactions.ts`
- [ ] T010 Configure global layout styling and imports in `src/routes/+layout.svelte`

**Checkpoint**: Foundation ready – user story implementation can begin

---

## Phase 3: User Story 1 - Capture New Transaction (Priority: P1) 🎯 MVP

**Goal**: Allow users to enter income or expense entries through a single form and see them instantly in the dataset

**Independent Test**: Complete a transaction submission on desktop and mobile; verify the row appears at the top of the table and the form resets without reloading the page

### Implementation for User Story 1

- [ ] T011 [US1] Create `TransactionForm.svelte` in `src/lib/components/form/` using shadcn form primitives
- [ ] T012 [US1] Wire form validation and store submission logic in `src/lib/components/form/TransactionForm.svelte`
- [ ] T013 [US1] Compose the form section and confirmation messaging in `src/routes/+page.svelte`
- [ ] T014 [US1] Record desktop/mobile walkthrough results in `docs/manual-validation.md`

**Checkpoint**: User Story 1 delivers value and is manually verified across required viewports

---

## Phase 4: User Story 2 - Review and Filter Entries (Priority: P2)

**Goal**: Provide a responsive entries table with period filtering so users can audit spending slices

**Independent Test**: Apply preset and custom period filters after creating sample data; confirm the table, counts, and empty state behave correctly on tablet and mobile

### Implementation for User Story 2

- [ ] T015 [US2] Build `PeriodFilter.svelte` in `src/lib/components/table/` with presets and custom range controls
- [ ] T016 [US2] Extend `src/lib/stores/transactions.ts` with filtering state and derived `filteredEntries`
- [ ] T017 [US2] Implement `EntriesTable.svelte` in `src/lib/components/table/` with responsive styling and category badges
- [ ] T018 [US2] Integrate the filter + table stack into `src/routes/+page.svelte`
- [ ] T019 [US2] Capture tablet/mobile filter walkthrough notes in `docs/manual-validation.md`

**Checkpoint**: User Story 2 integrates cleanly and passes manual validation

---

## Phase 5: User Story 3 - Monitor Budget Insights (Priority: P3)

**Goal**: Surface KPI cards and charts that summarize savings and spending patterns for the selected period

**Independent Test**: For three distinct periods, confirm KPI totals match manual calculations and charts mirror those totals across desktop and mobile

### Implementation for User Story 3

- [ ] T020 [US3] Add KPI aggregations and chart-ready datasets to `src/lib/stores/transactions.ts`
- [ ] T021 [US3] Create `KpiCard.svelte` in `src/lib/components/kpi/` with dark-mode styles
- [ ] T022 [US3] Implement `TrendChart.svelte` in `src/lib/components/charts/` using SVG and theme tokens
- [ ] T023 [US3] Implement `CategoryDonut.svelte` in `src/lib/components/charts/` with accessible legends
- [ ] T024 [US3] Assemble the KPI and charts section in `src/routes/+page.svelte`
- [ ] T025 [US3] Document KPI/chart validation outcomes in `docs/manual-validation.md`

**Checkpoint**: User Story 3 completes the feature set with documented manual validation

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 Ensure form and chart components expose ARIA labels and keyboard interactions in `src/lib/components/`
- [ ] T027 Refresh onboarding instructions with final steps in `specs/001-setup-expense-dashboard/quickstart.md`
- [ ] T028 Update project screenshots or placeholder image in `static/images/dashboard-placeholder.png`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies – can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion – BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
  - Stories proceed in priority order or parallel when files do not conflict
- **Polish (Final Phase)**: Depends on all targeted user stories completing

### User Story Dependencies

- **User Story 1 (P1)**: Starts after foundational work; sets baseline patterns
- **User Story 2 (P2)**: Builds on patterns from US1 but must remain independently reviewable
- **User Story 3 (P3)**: Leverages existing primitives with minimal new dependencies

### Within Each User Story

- Build shared utilities before consuming components
- Keep logic concise; extract helpers rather than introducing new frameworks
- Document manual validation immediately after implementation while context is fresh

### Parallel Opportunities

- Setup tasks T003–T005 can run once `package.json` edits (T001–T002) land
- In Phase 2, T007–T009 operate on distinct files and can proceed in parallel after T006
- Within User Story phases, component builds (e.g., T011/T012 or T021–T023) can be parallelized by different contributors once store updates are in place

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup + Foundational phases
2. Deliver User Story 1
3. **STOP AND VERIFY MANUALLY**: Follow documented walkthrough, capture screenshots
4. Share MVP for review/demo

### Incremental Delivery

1. Complete Setup + Foundational → baseline ready
2. Add User Story 1 → manual validation → demo
3. Add User Story 2 → manual validation → demo
4. Add User Story 3 → manual validation → demo
5. Each increment must keep dependencies lean and UX simple

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Split user stories across developers using [P] annotations to avoid conflicts
3. Share manual validation responsibilities so every story has reviewer-confirmed notes

---

## Notes

- [P] tasks = different files, no dependencies
- Keep file paths explicit to protect cleanliness and traceability
- Record manual validation steps alongside implementation to replace automated tests
- Avoid vague tasks, large refactors, or new dependencies without constitution-level justification
