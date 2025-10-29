# Quickstart — Reactivity Upgrade & Period Filter

## Prerequisites

- Node.js ≥ 20 and pnpm installed locally.
- Dependencies already bootstrapped (`pnpm install` from repo root).
- Branch `002-update-runes-reactivity` checked out via `/speckit.specify`.

## Local Workflow

1. **Start Dev Server**

   ```sh
   pnpm dev
   ```

   Visit `http://localhost:5173` to view the dashboard.

2. **Follow Rune Migration Patterns**
   - Enable runes with `svelte:options runes={true}` in each component.
   - Mirror `transactionsStore` inside components using `let snapshot = $state(get(transactionsStore));` plus `$effect` subscriptions so markup reads from `$derived` values.
   - Keep store modules rune-free; interact with them through exported methods (`addEntry`, `setPreset`, etc.) from inside the component effects.
   - Replace `$:` labels with `$state` + `$derived` and consolidate shared helpers inside `src/lib/utils/filters.ts`.

3. **Period Filter Reinstatement**
   - `<PeriodFilter />` is live again in `src/routes/+page.svelte`; keep it adjacent to `<EntriesTable />` for context.
   - `PeriodFilter.svelte` now uses `normalizeCustomRange`, `summarizePeriodRange`, and `describeRangeAdjustments`—reuse those helpers for future filtering work.

4. **Manual Verification** (required by constitution)
   - 375px & 1440px: submit income/fixed/variable transactions, watch KPIs and success banner, confirm validation states.
   - 768px & 1024px: exercise presets and custom ranges, including inverted dates and future ranges, ensure feedback banner appears when adjustments occur.
   - 414px & 1440px: capture before/after screenshots, clear and reseed sample data, and stress-test rapid preset toggles without losing chart/KPI alignment.
   - Log findings in `specs/002-update-runes-reactivity/checklists/requirements.md` before shipping.

5. **Quality Gates**
   ```sh
   pnpm format
   pnpm lint
   pnpm check
   ```
   Record manual QA notes and screenshots for the PR.

## Troubleshooting

- If runes reactivity produces console warnings, confirm `$state` variables are reassigned (no direct mutation) and effects return cleanup functions.
- If the period filter reverts to blank dates, ensure `normalizeCustomRange` feeds into `setCustomRange` and the custom inputs stay bound to the normalized values.
