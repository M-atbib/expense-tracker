# Quickstart: Expense Tracker Launch Page

## Prerequisites
- Node 20+
- pnpm 9+

## Install
```bash
pnpm install
```

## Add shadcn-svelte components
```bash
pnpm dlx shadcn-svelte@latest init
pnpm dlx shadcn-svelte@latest add button card input table select dialog
```

## Run Development Server
```bash
pnpm dev
```
Visit http://localhost:5173 and ensure the dashboard renders with the dark palette.

## Manual Verification Checklist
1. Create at least three transactions (income, fixed expense, variable expense). Confirm each appears at the top of the table and totals update.
2. Switch the period filter between This Month, Last Month, and a custom range; validate table rows, KPI numbers, and charts update instantly.
3. Resize the browser to 375px, 768px, and 1440px widths; ensure layout stacks gracefully, charts remain legible, and no horizontal scroll occurs on the form.
4. Hover or tap on chart data points to review tooltips. Confirm colors match the `@theme` tokens.
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
