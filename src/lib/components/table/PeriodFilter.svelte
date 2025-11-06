<svelte:options runes={true} />

<script lang="ts">
	import { format } from 'date-fns';

	import { transactionsStore } from '$lib/stores/transactions';
	import { get } from 'svelte/store';
	import type { PeriodPreset } from '$lib/types';
	import {
		describeRangeAdjustments,
		normalizeCustomRange,
		summarizePeriodRange
	} from '$lib/utils/filters';

	const presetOptions: Array<{ value: PeriodPreset; label: string; description: string }> = [
		{ value: 'this_month', label: 'This month', description: 'Current month to today' },
		{ value: 'last_month', label: 'Last month', description: 'Previous month, full span' },
		{ value: 'year_to_date', label: 'Year to date', description: 'January 1 to today' },
		{ value: 'custom', label: 'Custom range', description: 'Pick a custom start/end' }
	];

	const todayIso = format(new Date(), 'yyyy-MM-dd');

	let storeState = $state(get(transactionsStore));

	$effect(() => {
		const unsubscribe = transactionsStore.subscribe((value) => {
			storeState = value;
		});

		return () => {
			unsubscribe();
		};
	});

	const filter = $derived(storeState.filter);
	const activePreset = $derived(filter.preset);
	let customStart = $state('');
	let customEnd = $state('');
	let feedback = $state(null as string | null);

	const rangeSummary = $derived(summarizePeriodRange(filter));

	$effect(() => {
		const currentFilter = filter;
		customStart = currentFilter.startDate;
		customEnd = currentFilter.endDate;

		if (currentFilter.preset !== 'custom') {
			feedback = null;
		}
	});

	const handlePresetClick = (preset: PeriodPreset) => {
		if (preset === 'custom') {
			transactionsStore.setPreset('custom');
			return;
		}
		transactionsStore.setPreset(preset);
	};

	const applyCustomRange = () => {
		if (!customStart || !customEnd) return;
		feedback = null;

		const userStart = customStart;
		const userEnd = customEnd;
		const normalized = normalizeCustomRange(userStart, userEnd);

		transactionsStore.setCustomRange(normalized.start, normalized.end);
		customStart = normalized.start;
		customEnd = normalized.end;

		const adjustments = describeRangeAdjustments(userStart, userEnd, normalized);
		feedback = adjustments.length > 0 ? `${adjustments.join('. ')}.` : null;
	};
</script>

<section
	class="flex flex-col gap-6 rounded-card border border-border bg-surface-elevated p-6 shadow-elevated"
>
	<header class="flex flex-col gap-2">
		<h2 class="text-lg font-semibold text-text-secondary">Period filter</h2>
		<p class="text-sm text-text-muted">
			Choose a preset or define a custom range to refine the entries table and downstream insights.
		</p>
	</header>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each presetOptions as option (option.value)}
			<button
				type="button"
				class={`flex flex-col gap-1 rounded-xl border px-4 py-3 text-left transition ${
					activePreset === option.value
						? 'border-accent bg-accent/10 text-text-secondary'
						: 'border-border bg-surface text-text-muted hover:border-border-muted'
				}`}
				onclick={() => handlePresetClick(option.value)}
			>
				<span class="text-sm font-semibold text-text-secondary">{option.label}</span>
				<span class="text-xs text-text-muted">{option.description}</span>
			</button>
		{/each}
	</div>

	{#if activePreset === 'custom'}
		<div
			class="grid gap-4 rounded-xl border border-border-muted bg-surface-inset/60 p-4 sm:grid-cols-2"
			data-testid="custom-range-panel"
		>
			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium tracking-wide text-text-muted uppercase" for="custom-start"
					>Start date</label
				>
				<input
					id="custom-start"
					type="date"
					bind:value={customStart}
					class="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
					max={filter.endDate}
					onchange={applyCustomRange}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label class="text-xs font-medium tracking-wide text-text-muted uppercase" for="custom-end"
					>End date</label
				>
				<input
					id="custom-end"
					type="date"
					bind:value={customEnd}
					class="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
					min={customStart}
					max={todayIso}
					onchange={applyCustomRange}
				/>
			</div>
		</div>

		{#if feedback}
			<p
				class="rounded-lg border border-accent/40 bg-accent/5 px-3 py-2 text-xs text-accent"
				aria-live="polite"
			>
				{feedback}
			</p>
		{/if}
	{:else}
		<div
			class="rounded-xl border border-border-muted bg-surface-inset/60 p-4 text-sm text-text-muted"
			data-testid="custom-range-placeholder"
		>
			<p>Choose “Custom range” above to reveal start and end date pickers.</p>
		</div>
	{/if}

	<div class="flex flex-wrap items-center gap-4 text-sm text-text-muted">
		<span>
			<span class="text-text-secondary">{rangeSummary.startLabel}</span>
			<span class="mx-2 text-text-muted">to</span>
			<span class="text-text-secondary">{rangeSummary.endLabel}</span>
		</span>
		{#if rangeSummary.dayCount}
			<span class="rounded-full border border-border-muted px-3 py-1 text-xs tracking-wide uppercase">
				{rangeSummary.dayCount} day{rangeSummary.dayCount === 1 ? '' : 's'}
			</span>
		{/if}
	</div>
</section>
