# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an expense tracker built with **SvelteKit 2** and **TypeScript**, using Tailwind CSS v4 for styling. The app is a single-page dashboard that manages income and expense transactions entirely in client-side memory (no persistence yet).

## Common Commands

### Development
```bash
pnpm dev              # Start dev server (default: http://localhost:5173)
pnpm dev -- --open    # Start dev server and open browser
```

### Build & Preview
```bash
pnpm build    # Build production version
pnpm preview  # Preview production build
```

### Code Quality
```bash
pnpm format       # Format code with Prettier
pnpm lint         # Run Prettier check and ESLint
pnpm check        # Type-check with svelte-check
pnpm check:watch  # Type-check in watch mode
```

### Component Library
```bash
pnpm shadcn:add <component>  # Add shadcn-svelte component
```

## Architecture

### State Management: Reactive Store Pattern

The application uses a **centralized Svelte store** (`transactionsStore`) as the single source of truth. All state mutations flow through this store, which automatically:
- Recalculates filtered entries based on the active period filter
- Derives KPIs (total income, expenses, savings rate) 
- Generates time-series data for charts (weekly buckets)
- Computes category share percentages for the donut chart

**Key insight**: The store is *derived state heavy*. When you add a transaction or change the filter, `recalculateState()` runs and regenerates all downstream data. Components consume this via Svelte's reactivity (`$state` and `$derived` runes in Svelte 5).

**Location**: `src/lib/stores/transactions.ts`

### Component Organization

```
src/lib/components/
├── form/             TransactionForm - handles add transaction
├── table/            EntriesTable, PeriodFilter - main data table and filter UI
├── kpi/              KpiCard - reusable metric display
└── charts/           TrendChart (weekly line), CategoryDonut (expense breakdown)
```

Components are **presentation-only** and receive props from `+page.svelte`, which subscribes to the store. There's no prop drilling beyond one level.

### Type System

**All types are defined in `src/lib/types.ts`**. Notable types:
- `TransactionEntry` - immutable record with generated ID
- `TransactionDraft` - form submission shape (no ID/type yet)
- `PrimaryCategory` - union: `'income' | 'fixed_expense' | 'variable_expense'`
- `PeriodFilter` - contains preset + start/end dates
- `KPIBundle` - aggregated metrics + chart data

The store enforces strict typing between `TransactionDraft` → `TransactionEntry` transformations.

### Styling System

- **Tailwind v4** with custom CSS variables (see `src/app.css`)
- Dark theme with semantic color tokens (e.g., `--color-accent`, `--color-positive`)
- All components use Tailwind utilities; no component-scoped styles
- Theme utilities in `src/lib/utils/theme.ts` provide programmatic access to CSS variables

**Color tokens are exposed as Tailwind classes** (e.g., `text-accent`, `bg-surface-elevated`).

### Utility Modules

- `src/lib/utils/filters.ts` - Date range logic (presets like "this_month", custom ranges)
- `src/lib/utils/format.ts` - Currency and date formatting
- `src/lib/utils/theme.ts` - CSS variable helpers (`themeColor`, `colorWithOpacity`)

## Data Flow

1. User submits form → `transactionsStore.addEntry(draft)`
2. Store generates ID, derives type from category, calls `recalculateState()`
3. `recalculateState()` filters entries by date, sorts them, and rebuilds KPIs
4. Components re-render automatically via Svelte reactivity

**No API calls or persistence exist yet.** Refreshing the page resets to default sample data.

## Testing

- E2E tests are in `testsprite_tests/` (Python-based, external framework)
- **No unit tests exist in the codebase yet** (no Vitest/Jest config found)
- Linting/typechecking serves as the primary validation

To add unit tests, install Vitest and configure it for SvelteKit.

## Code Style

- **Tabs for indentation** (enforced by Prettier)
- 100-character line limit
- Single quotes for strings
- No trailing commas
- ESLint enforces `typescript-eslint` + `eslint-plugin-svelte` rules

Run `pnpm format` before committing changes.

## Key Constraints

- **No persistence layer**: All data is in-memory only
- **No authentication**: This is a local-only demo app
- **Date-fns is the only date library**: Use it for all date operations
- **Svelte 5 runes**: Use `$state`, `$derived`, `$effect` instead of legacy reactive declarations

## Working with the Store

When adding new features that involve transactions:

1. Update types in `src/lib/types.ts` first
2. Extend `transactionsStore` with new methods if needed
3. Make sure `recalculateState()` accounts for new computed fields
4. Update KPI calculations in `buildTrendSeries()` or `buildCategoryShare()` if charts are affected

**Do not mutate store state directly**—always use the provided methods (`addEntry`, `removeEntry`, etc.).

## Component Patterns

- Use **Svelte 5 runes** (`$state`, `$props`, `$derived`) instead of `let`, `export let`, `$:`
- Keep components focused—no business logic beyond formatting/display
- Pass data down from `+page.svelte`; keep store subscriptions at the page level
- Use `@render` syntax for slots (Svelte 5)

## File Naming

- Components: PascalCase (e.g., `TransactionForm.svelte`)
- Utils/stores: camelCase (e.g., `transactions.ts`, `filters.ts`)
- Routes follow SvelteKit conventions (`+page.svelte`, `+layout.svelte`)
