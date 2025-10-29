# Data Model — Reactivity Upgrade & Period Filter

## TransactionEntry

- **id**: string — unique identifier generated via `crypto.randomUUID()` fallback to timestamp hash.
- **date**: ISO date string (`YYYY-MM-DD`) — must parse successfully; future dates rejected by validation.
- **label**: string (≤ 80 chars) — trimmed description shown in table.
- **primaryCategory**: enum (`income`, `fixed_expense`, `variable_expense`) — controls subcategory options.
- **subCategory**: string — must be one of the pre-defined options for the selected primary category.
- **amount**: number — positive currency value rounded to 2 decimals.
- **type**: derived enum (`income` | `expense`) — inferred from `primaryCategory` for styling and aggregation.

## PeriodSelection

- **preset**: enum (`this_month`, `last_month`, `year_to_date`, `custom`) — determines how start/end are populated.
- **startDate**: ISO date string — clamped to be ≤ `endDate` and ≤ today.
- **endDate**: ISO date string — clamped to be ≥ `startDate` and ≤ today.
- **source**: derived string — identifies whether values came from preset or custom range (used for messaging).

## DashboardState

- **entries**: `TransactionEntry[]` — all records sorted by date desc.
- **filteredEntries**: `TransactionEntry[]` — entries within current `PeriodSelection`.
- **kpis**:
  - **totalIncome**: number — sum of income entries in filter.
  - **totalExpenses**: number — sum of expense entries in filter.
  - **amountSaved**: number — income minus expenses in filter.
  - **leftoverBalance**: number — mirrors `amountSaved` until savings targets exist.
  - **trendSeries**: array of `{ label: string; income: number; expenses: number }` grouped by week.
  - **categoryShare**: array of `{ category: string; value: number; percentage: number }` for expense distribution.
- **filter**: `PeriodSelection` — active range driving derived slices.

## FormState (component-local)

- **date**: ISO date string — defaults to today, validated against future dates.
- **label**: string — same caps as `TransactionEntry.label`.
- **primaryCategory**: enum — drives subcategory binding.
- **subCategory**: string — cleared when no options exist.
- **amount**: string — retains raw input before cast to number.

## Validation Errors

- **keyed by field name** with human-readable message.
- Built per submission attempt; cleared once validation passes or form resets.
