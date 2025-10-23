# Research Notes: Expense Tracker Launch Page

## Decision: Adopt shadcn-svelte for UI primitives
- **Rationale**: Provides accessible, headless components that pair with Tailwind and accelerate building consistent forms, tables, and cards while honoring dark-mode requirements.
- **Alternatives considered**: Raw Tailwind-only components (slower to assemble, harder to keep consistent); Skeleton UI (heavier design system, more dependencies than needed).

## Decision: Define dark palette with Svelte `@theme` tokens
- **Rationale**: Centralizes color tokens in `app.postcss`, enabling reuse across Tailwind classes, shadcn styles, and custom charts while supporting future theming without refactors.
- **Alternatives considered**: Tailwind config `theme.extend.colors` (less flexible for runtime theming); CSS variables in layout (works but duplicates config between Tailwind and components).

## Decision: Use date-fns for date math and formatting
- **Rationale**: Lightweight utility set for computing preset periods, custom ranges, and formatted labels without bringing in moment.js or heavier libs; integrates easily in a Svelte store.
- **Alternatives considered**: Native `Intl.DateTimeFormat` (formatting only, limited interval helpers); Day.js (good API but adds another dependency similar in scope to date-fns).

## Decision: Implement charts with custom SVG components
- **Rationale**: Keeps dependency footprint lean, allows pixel-perfect dark-mode styling, and satisfies spec with bar/line and donut charts derived from computed KPIs.
- **Alternatives considered**: Chart.js (powerful but heavy and requires canvas integration); ApexCharts (nice defaults but adds ~200kb and extra runtime cost).

## Decision: Plan for future Firebase persistence but keep current build in-memory
- **Rationale**: Aligns with requirement to skip persistence now while ensuring stores, data types, and API contracts can swap to Firebase collections later with minimal rewrites.
- **Alternatives considered**: Implement Supabase or localStorage now (contradicts "no data saving" requirement); delay all planning for persistence (would make future work harder).
