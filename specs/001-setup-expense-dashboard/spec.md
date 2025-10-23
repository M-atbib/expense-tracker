# Feature Specification: Expense Tracker Launch Page

**Feature Branch**: `001-setup-expense-dashboard`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: User description: "initial page setup - this application is a personal expenses tracker, since am not an excel expert I can't create really good sheets to track my expenses, plus i need to buy microsoft excel in order for me be able to create and use the sheet. But I am a developer, and i understand coding and web developing. So this expenses tracker must simple but efficient, with a form to add to create an new entry for my table and KPIs, so the form must have date, amount, label, catgories(income, fixed expense, variable expense), then sub-categories to each of the three, i let you decide them. Then there is the table the shows all entries. Finally a dashboard section that has the following stuff:
- a period filter i let you decide filter option
- end of period let sold
- amount saved in a period
- then just some chart and graphes
To be clear all this ,must be in one page, i'll let decide the layout, the color pallette must something easy on the eye, since i prefer to have dark mode by default - no theme switch for now-"

## User Scenarios & Manual Validation *(mandatory)*

### User Story 1 - Capture New Transaction (Priority: P1)

As a budget-conscious user, I want to record a new income or expense with one form so I can keep my tracker up to date without buying spreadsheet software.

**Why this priority**: Without quick entry the tool delivers no value; this story underpins the rest of the page.

**Manual Validation**: On desktop (1440px) and mobile (375px) viewports, open the page, confirm the form loads with dark background and light text, complete required fields (date defaults to today, positive amount, label, category, subcategory) and submit. Verify success confirmation and that the form resets for the next entry.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** the user submits all required fields, **Then** the transaction is stored and visible at the top of the entries table without reloading the page.
2. **Given** the form is incomplete, **When** the user attempts to submit, **Then** the form highlights missing fields with inline guidance while preserving entered values.

---

### User Story 2 - Review and Filter Entries (Priority: P2)

As a user reviewing budgets, I want to see all transactions in a responsive table and filter them by period so I can audit spending across time.

**Why this priority**: Visibility into recorded entries ensures trust and supports manual analysis.

**Manual Validation**: On tablet (768px) and mobile (375px) widths, submit at least three transactions across categories, then apply the period filter (This Month, Last Month, Custom Range). Confirm rows update instantly, table headers remain readable in dark mode, and scrolling works without layout breakage.

**Acceptance Scenarios**:

1. **Given** transactions exist, **When** the user selects "Last Month" in the period filter, **Then** only transactions dated within that range remain visible while summary counts update.
2. **Given** the user enters a custom start and end date, **When** the range is applied, **Then** the table and KPI cards recalculate totals for that exact range.

---

### User Story 3 - Monitor Budget Insights (Priority: P3)

As a user tracking financial health, I want to view end-of-period balance, saved amount, and visual summaries so I can spot trends without exporting data.

**Why this priority**: Insightful KPIs and charts turn raw entries into actionable information and justify using the app over spreadsheets.

**Manual Validation**: On desktop (1440px) verify KPI cards display total income, total expenses, amount saved (income minus expenses), and end-of-period leftover balance. Confirm cards re-compute after adjusting the period filter. Review the bar/line chart showing trends and a donut chart showing category distribution, checking tooltips and contrast. Repeat on mobile (375px) to ensure charts collapse into stacked layout without clipping.

**Acceptance Scenarios**:

1. **Given** the user filters to the current month, **When** they view the dashboard, **Then** the "Amount Saved" card shows income minus expenses for that period and labels indicate the timeframe.
2. **Given** multiple categories exist, **When** the charts render, **Then** one chart visualizes totals by week within the selected period and another shows category share, both matching the numeric KPI values.

### Edge Cases

- User enters a future date; the system must flag it and request confirmation or correction.
- Amount is zero or negative; the form must prevent submission with an explanatory message.
- The period filter returns no transactions; the table should display a dark-mode friendly empty state with guidance to widen the range.
- Large data sets (200+ entries) should still present smoothly (e.g., pagination or staged loading) so the table renders within 2 seconds on desktop.
- User switches between categories rapidly; subcategory options must refresh consistently without stale selections.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The transaction form MUST collect date (default today, editable), amount (positive currency with two decimals), label (free text up to 80 characters), primary category (Income, Fixed Expense, Variable Expense), and a subcategory constrained to the chosen category.
- **FR-002**: Subcategory menus MUST provide: Income → Salary, Freelance, Other; Fixed Expense → Rent/Mortgage, Utilities, Subscriptions; Variable Expense → Groceries, Dining Out, Travel/Leisure. The UX MUST allow adding new subcategories in future without redesign.
- **FR-003**: On submission, the system MUST append the new entry to the current session's records, surface it in the entries table sorted by date (newest first), and clear the form while confirming success inline.
- **FR-004**: The entries table MUST support period filters with presets (This Month, Last Month, Year to Date) and a custom date range picker, updating rows, totals, and chart inputs instantly.
- **FR-005**: Each table row MUST show date, label, primary category, subcategory, amount (positive values green for income, negative red for expenses), and persist manual filters during navigation within the page.
- **FR-006**: KPI cards MUST present total income, total expenses, end-of-period leftover balance (income minus expenses), and amount saved (target savings minus total expenses when a savings target is provided, otherwise default to income minus expenses). Card copy MUST clarify which calculation is displayed.
- **FR-007**: The dashboard MUST render at least two visualizations: (a) a time-series chart of total income vs. expenses across the selected period; (b) a category distribution chart showing percentages by primary category. Both MUST inherit the dark palette and display tooltips for precise values.
- **FR-008**: The page MUST ship with a dark mode-first palette (charcoal backgrounds, muted accent colors, accessible contrast ≥ 4.5:1 for text) and responsive layout that stacks sections vertically below 768px without introducing horizontal scroll.
- **FR-009**: Manual validation steps MUST be documented in the PR description for new features, including device viewport sizes tested and screenshots of KPI and chart states.

### Key Entities *(include if feature involves data)*

- **TransactionEntry**: Captures a single record with id, date, label, primary category, subcategory, amount, and derived type (income vs. expense).
- **PeriodFilter**: Represents the active time window selection (preset or custom range) used to scope table contents, KPIs, and charts.
- **KPIBundle**: Aggregated metrics for the active period including total income, total expenses, amount saved, and leftover balance, plus chart-ready datasets.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: During manual review, a user records a new transaction and sees it in the table within 10 seconds of submission across desktop and mobile viewports.
- **SC-002**: The dashboard maintains readability and interactive controls without overflow at 320px, 768px, and 1440px widths (verified during manual walkthrough).
- **SC-003**: Financial KPIs (income, expenses, amount saved, leftover balance) recalculate correctly for three distinct period selections with no more than ±1 currency unit variance compared to manual spreadsheet calculations.
- **SC-004**: At least 90% of pilot users surveyed describe the default dark palette as "comfortable" or "easy on the eyes" after a full week of use.

## Assumptions

- "End of period let sold" is interpreted as the leftover balance at the end of the selected period (income minus expenses).
- Savings targets are optional; when absent, amount saved equals leftover balance.
- Data persists in-browser for the initial version; backend storage will be addressed in future iterations if required.
