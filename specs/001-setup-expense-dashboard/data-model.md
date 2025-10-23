# Data Model: Expense Tracker Launch Page

## TransactionEntry
| Field | Type | Validation / Notes |
|-------|------|--------------------|
| `id` | string (UUID) | Generated client-side for list rendering; ensures stability for future Firebase document IDs |
| `date` | string (ISO 8601) | Must be ≤ today; used for sorting and filtering |
| `label` | string | 1–80 chars, trimmed; displayed in table and KPI summaries |
| `primaryCategory` | enum (`income`, `fixed_expense`, `variable_expense`) | Controls available subcategories and coloring |
| `subCategory` | string | Must exist in category-specific list; future-proofed for custom options |
| `amount` | number | Positive currency value; sign derived from category (expenses shown as negative when rendered) |
| `type` | enum (`income`, `expense`) | Derived: income → `income`; fixed/variable expense → `expense` |

### Relationships & Derived Data
- Transactions aggregate into KPIBundle totals via reducers.
- Chart components consume grouped data (`byWeek`, `byCategory`) computed from TransactionEntry arrays.

## PeriodFilter
| Field | Type | Validation / Notes |
|-------|------|--------------------|
| `preset` | enum (`this_month`, `last_month`, `year_to_date`, `custom`) | Determines default start/end ranges |
| `startDate` | string (ISO 8601) | Required; when preset changes the store recalculates |
| `endDate` | string (ISO 8601) | Must be ≥ `startDate` and ≤ today |

### Behavior
- When `preset` ≠ `custom`, `startDate`/`endDate` are auto-derived via date-fns helpers.
- Filters scope table rows, KPI calculations, and chart datasets simultaneously.

## KPIBundle
| Field | Type | Validation / Notes |
|-------|------|--------------------|
| `totalIncome` | number | Sum of `amount` for entries where `type === 'income'` |
| `totalExpenses` | number | Sum of `amount` for entries where `type === 'expense'`; stored as positive numbers |
| `amountSaved` | number | `totalIncome - totalExpenses`; negative indicates overspend |
| `leftoverBalance` | number | Mirrors `amountSaved` in this release; kept separate to support future savings targets |
| `trendSeries` | Array<{ label: string, income: number, expenses: number }> | Weekly (or preset-appropriate) aggregation for TrendChart |
| `categoryShare` | Array<{ category: string, percentage: number, value: number }> | Input for CategoryDonut |

## ThemeToken
| Field | Type | Validation / Notes |
|-------|------|--------------------|
| `name` | string | Token identifier exposed via `@theme` (e.g., `surface`, `surface-muted`, `accent`) |
| `value` | CSS color value | Stored in `app.postcss`; mirrored into Tailwind config using CSS variables |

## Firebase Integration Placeholder
- Keep `TransactionEntry` schema compatible with Firestore collections (string ISO dates, numeric amounts).
- When persistence arrives, `id` maps directly to document ID; `userId` can be added without breaking current UI.
