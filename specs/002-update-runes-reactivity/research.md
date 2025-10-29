# Research Notes — Reactivity Upgrade & Period Filter

## Decision: Adopt Svelte 5 runes primitives in all migrated modules

- **Rationale**: Using `$state`, `$derived`, and `effect` runes keeps component logic aligned with the official Svelte 5 reactivity model, eliminates deprecated `$:` labels, and provides explicit cleanup points for subscriptions (critical when bridging the custom `transactionsStore`).
- **Alternatives considered**:
  - Continue relying on legacy `$:` syntax with compatibility mode — rejected because it defers the migration debt and conflicts with the stated goal of adopting runes.
  - Replace stores with plain module-level variables — rejected because it would break the shared store API and manual validation flows across components.

## Decision: Bridge `transactionsStore` through a local rune-managed state

- **Rationale**: Maintaining a single `$state` snapshot of the store, synchronized via an `effect` that manages `subscribe`/`unsubscribe`, keeps components declarative while preserving in-memory storage behavior. This approach also supports future persistence upgrades without reworking component contracts.
- **Alternatives considered**:
  - Call `transactionsStore.subscribe` directly inside markup expressions — rejected because it introduces side effects during rendering and complicates teardown.
  - Refactor the store into individual exports per field — rejected because it fragments the API and increases wiring complexity across components.

## Decision: Fix PeriodFilter by normalizing custom range inputs via existing utilities

- **Rationale**: Leveraging `normalizeCustomRange` and `applyPresetToFilter` ensures start/end dates stay clamped to valid values while keeping presets authoritative. Mirroring this logic in the component resolves the start date bug without introducing new dependencies or diverging from current utility behavior.
- **Alternatives considered**:
  - Add bespoke date validation inside the component — rejected to avoid duplication of utility logic.
  - Defer the PeriodFilter reinstatement — rejected because the spec prioritizes restoring filtering alongside the reactivity migration.
