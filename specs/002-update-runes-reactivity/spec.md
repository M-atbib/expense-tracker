# Feature Specification: Reactivity Upgrade & Period Filter

**Feature Branch**: `002-update-runes-reactivity`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: User description: "switch to svelte 5 - in the first feature i let you run free, and you used svelte 4 reactivity system that stands on using $ sign, while in package.json specifies version 5. Nevertheless am creating this new feature/specification to migrate all create file in first feature from svelte 4 to svelte 5 that stands on runes usage for reactivity. Also in root page there is a PeriodFilter that is commented, because it has an issue with startDate, so that need to be fixed."

## User Scenarios & Manual Validation _(mandatory)_

### User Story 1 - Reliable Transaction Entry (Priority: P1)

As a user logging expenses, I expect the transaction form to respond instantly and keep the dashboard in sync so I can trust the tracker after the reactivity upgrade.

**Why this priority**: If the form or dashboard lags or falls out of sync during the migration, the app loses its core value of quick expense capture.

**Manual Validation**: On desktop (1440px) and mobile (375px), submit three transactions (income, fixed expense, variable expense). Confirm validation messages still appear for empty or invalid fields, the entries table refreshes without page reloads, KPI totals update immediately, and the console shows no reactivity warnings or errors.

**Acceptance Scenarios**:

1. **Given** the form is complete, **When** the user submits a transaction, **Then** the new entry appears at the top of the table, KPI values recalculate, and the success message displays without console errors.
2. **Given** the user changes the primary category, **When** subcategory options refresh, **Then** the first valid subcategory is preselected and stale selections are cleared automatically.

---

### User Story 2 - Restore Period Filtering (Priority: P2)

As a user reviewing trends, I need the period filter visible and accurate so I can limit the dashboard to the dates that matter.

**Why this priority**: Without a functioning period filter, users cannot narrow insights and the dashboard becomes noisy and less trustworthy.

**Manual Validation**: Re-enable the period filter on the home page. On desktop (1024px) and tablet (768px), switch between presets (This Month, Last Month, Year to Date) and verify the table, KPIs, and charts recalculate within one second. Enable the custom range, adjust start and end dates (including reversing their order), and confirm the UI keeps inputs valid, applies corrections, and surfaces plain-language feedback.

**Acceptance Scenarios**:

1. **Given** the user selects a preset, **When** the filter applies it, **Then** the displayed date range header matches the preset window and downstream data refreshes.
2. **Given** the user sets a custom start date that is after the end date, **When** the range is applied, **Then** the system swaps the values, limits future dates, and informs the user of adjustments without clearing the form.

---

### User Story 3 - Preserve Dashboard Confidence (Priority: P3)

As a returning user, I want KPI cards and charts to feel stable after the framework migration so I can compare sessions without second-guessing the data.

**Why this priority**: Visual trust is critical when changing underlying state management; any regressions in KPIs or chart rendering will erode confidence.

**Manual Validation**: On mobile (414px) and desktop (1440px), capture screenshots before and after migrating, then refresh the page to confirm baseline demo data loads identically. Toggle filters and delete/clear sample entries to ensure the dashboard never flashes empty values or mismatched chart legends.

**Acceptance Scenarios**:

1. **Given** the baseline dataset loads, **When** the page renders after the upgrade, **Then** KPI values, chart labels, and table rows match the pre-migration values.
2. **Given** a user clears and reseeds data via the existing controls, **When** the dashboard rebuilds, **Then** aggregated metrics stay coherent with the entries shown.

### Edge Cases

- Start date or end date fields left blank while preset is custom; the component must restore the last valid range rather than applying an empty filter.
- Users selecting future dates; the system should cap selections at today and inform the user of the adjustment.
- Rapid preset toggling combined with quick form submissions; updates must queue without dropping transactions or misreporting totals.
- Clearing all transactions; the dashboard should fall back to empty-state messaging without breaking cards or charts.
- Page reload immediately after submitting data; default demo entries must still appear to prove the upgrade retains initial-state behavior.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The expense entry form MUST retain all validations and instantly update the entries table, KPI cards, and charts after submission without relying on deprecated reactivity patterns.
- **FR-002**: Category-to-subcategory dependencies MUST stay synchronized for every selection change, defaulting to a valid option and preventing stale or empty values from persisting.
- **FR-003**: Success messaging, form reset behavior, and error states MUST remain consistent across desktop and mobile once the new reactive state approach is in place.
- **FR-004**: The period filter component MUST be reinstated on the home page, display the active range, and correctly apply all presets in under one second without visual flicker.
- **FR-005**: Custom date ranges MUST normalize invalid or future inputs, keep both start and end fields populated, and provide user-readable feedback whenever adjustments occur.
- **FR-006**: Dashboard aggregates and visualizations MUST respect the active filter and reflect the underlying data set consistently after clearing, seeding, or editing entries.

### Key Entities _(include if feature involves data)_

- **TransactionEntry**: User-submitted record including id, date, label, primary category, subcategory, amount, and derived type used for filtering and KPI calculations.
- **PeriodSelection**: Current time window containing preset identifier, start date, and end date that scopes table rows, KPIs, and charts.
- **DashboardState**: Derived metrics and visualization data (totals, savings, trend series, category share) that must stay aligned with the latest entries and period selection.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Manual QA notes under 2 seconds between form submission and updated KPIs/entries across desktop and mobile after the reactivity upgrade, with zero console warnings.
- **SC-002**: Reviewers confirm every preset and custom range yields matching date headers, table rows, and chart data for at least three sample ranges.
- **SC-003**: No more than one clarification message appears per session when users enter invalid dates, and the filter never applies an empty range.
- **SC-004**: A/B comparison of pre- and post-upgrade dashboards shows identical baseline figures (±0 variance) using the seeded dataset after page reload.

## Assumptions

- The migration focuses on the expense creation flow, period filter, and dashboard reactions; other areas will adopt the new reactivity model in later iterations.
- Demo data and in-memory storage remain acceptable for this milestone; persistence changes are out of scope.
- Reviewers have access to browser developer tools to monitor console output during validation.
