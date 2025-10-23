# Quickstart: Expense Tracker Launch Page

## Prerequisites

- Node 20+
- pnpm 9+

## Install

```bash
pnpm install
```

## UI Component Scaffold

`components.json` is preconfigured for this feature. Use the helper scripts to initialise or add shadcn-svelte primitives when you need additional building blocks:

```bash
pnpm run shadcn:init
pnpm run shadcn:add button card input table select dialog
```

## Run Development Server

```bash
pnpm dev
```

Visit http://localhost:5173 and ensure the dashboard renders with the dark palette.

## Manual Verification Checklist

1. Create at least three transactions (income, fixed expense, variable expense). Confirm each appears at the top of the table, the success banner announces the addition, and fields reset.
2. Switch the period filter between This Month, Last Month, and a custom range; validate table rows, KPI cards, and charts update instantly. Attempt future dates to confirm the helper notice appears and the range clamps to today.
3. Resize the browser to 375px, 768px, and 1440px widths; ensure layout stacks gracefully, charts remain legible, legends stay accessible, and the table scrolls without losing headers.
4. Hover or tap trend points and donut segments to validate colour tokens align with the dark theme palette.
5. Refresh the page and confirm the dataset resets (expected for this release).

## Linting & Format

```bash
pnpm format
pnpm lint
pnpm check
```

## Building

```bash
pnpm build
pnpm preview
```

## Future Firebase Integration Notes

- Keep `src/lib/stores/transactions.ts` isolated so it can be swapped for Firebase Firestore calls.
- API contract defined in `specs/001-setup-expense-dashboard/contracts/openapi.yaml` should guide future endpoint wiring.
