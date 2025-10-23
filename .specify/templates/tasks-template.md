---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
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

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Contracts or API shapes from contracts/

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align project structure, deps, and tooling before story work

- [ ] T001 Confirm Tailwind, SvelteKit, and Vite versions match constitution
- [ ] T002 [P] Ensure `src/lib/` has baseline folders for components, stores, utils
- [ ] T003 [P] Configure linting/formatting scripts (`pnpm lint`, `pnpm format`, `pnpm check`) in CI checklist

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story work

- [ ] T004 Prepare shared layout updates in `src/routes/+layout.svelte`
- [ ] T005 [P] Set up base data structures or stores in `src/lib/stores/`
- [ ] T006 Document manual validation matrix (viewports/browsers) in plan quickstart

**Checkpoint**: Foundation ready – user story implementation can begin

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

### Implementation for User Story 1

- [ ] T010 [P] [US1] Build responsive page/component in `src/routes/[path]/+page.svelte`
- [ ] T011 [P] [US1] Wire supporting store or util in `src/lib/`
- [ ] T012 [US1] Refine styling with Tailwind ensuring minimal custom CSS
- [ ] T013 [US1] Capture manual validation steps (screenshots/notes) in PR description

**Checkpoint**: User Story 1 delivers value and is manually verified across required viewports

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement UX slice in `src/routes/[path]/`
- [ ] T021 [US2] Extend shared modules while keeping dependencies minimal
- [ ] T022 [US2] Update accessibility cues (aria labels, focus handling)
- [ ] T023 [US2] Run documented manual walkthrough and note findings

**Checkpoint**: User Story 2 integrates cleanly and passes manual validation

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

### Implementation for User Story 3

- [ ] T030 [P] [US3] Deliver remaining UI flow using existing primitives
- [ ] T031 [US3] Confirm responsiveness on large screens and small devices
- [ ] T032 [US3] Record manual validation notes alongside screenshots

**Checkpoint**: User Story 3 completes the feature set with documented manual validation

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T900 [P] Documentation updates in `/docs` or feature quickstart
- [ ] T901 Code cleanup and refactoring to maintain readability
- [ ] T902 Performance or accessibility tuning without adding new deps
- [ ] T903 Confirm manual validation matrix still passes after refinements

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

- Setup and foundational tasks marked [P] can run concurrently
- Independent user stories can progress in parallel when touching separate files
- Manual validation notes can be prepared by collaborators while implementation finishes

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
