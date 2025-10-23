<script lang="ts">
	import { differenceInCalendarDays, format, isAfter, parseISO } from 'date-fns';

	import { transactionsStore } from '$lib/stores/transactions';
	import type { PeriodPreset } from '$lib/types';

	const presetOptions: Array<{ value: PeriodPreset; label: string; description: string }> = [
		{ value: 'this_month', label: 'This month', description: 'Current month to today' },
		{ value: 'last_month', label: 'Last month', description: 'Previous month, full span' },
		{ value: 'year_to_date', label: 'Year to date', description: 'January 1 to today' },
		{ value: 'custom', label: 'Custom range', description: 'Pick a custom start/end' }
	];

	const todayIso = format(new Date(), 'yyyy-MM-dd');

	const formatDate = (value: string) => {
		const parsed = parseISO(value);
		if (Number.isNaN(parsed.getTime())) return value;
		return format(parsed, 'MMM d, yyyy');
	};

	$: state = $transactionsStore;
	$: filter = state.filter;
	$: activePreset = filter.preset;

	let customStart = filter.startDate;
	let customEnd = filter.endDate;
	let feedback: string | null = null;

	$: if (activePreset !== 'custom') {
		customStart = filter.startDate;
		customEnd = filter.endDate;
		feedback = null;
	}

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
		const parsedStart = parseISO(userStart);
		const parsedEnd = parseISO(userEnd);

		transactionsStore.setCustomRange(customStart, customEnd);

		const adjustments: string[] = [];
		if (isAfter(parsedStart, parsedEnd)) {
			adjustments.push('Start date was moved before the end date');
		}

		if (isAfter(parseISO(userEnd), parseISO(todayIso))) {
			adjustments.push("Future dates aren't supported yet—end date reset to today");
		}

		if (adjustments.length > 0) {
			feedback = adjustments.join('. ') + '.';
		}
	};

	$: rangeLength = (() => {
		const start = parseISO(filter.startDate);
		const end = parseISO(filter.endDate);
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
		const days = Math.abs(differenceInCalendarDays(end, start)) + 1;
		return days;
	})();
</script>

<section
	class="rounded-card border-border bg-surface-elevated shadow-elevated flex flex-col gap-6 border p-6"
>
	<header class="flex flex-col gap-2">
		<h2 class="text-text-secondary text-lg font-semibold">Period filter</h2>
		<p class="text-text-muted text-sm">
			Choose a preset or define a custom range to refine the entries table and downstream insights.
		</p>
	</header>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each presetOptions as option}
			<button
				type="button"
				class={`flex flex-col gap-1 rounded-xl border px-4 py-3 text-left transition ${
					activePreset === option.value
						? 'border-accent bg-accent/10 text-text-secondary'
						: 'border-border bg-surface text-text-muted hover:border-border-muted'
				}`}
				on:click={() => handlePresetClick(option.value)}
			>
				<span class="text-text-secondary text-sm font-semibold">{option.label}</span>
				<span class="text-text-muted text-xs">{option.description}</span>
			</button>
		{/each}
	</div>

	<div
		class="border-border-muted bg-surface-inset/60 grid gap-4 rounded-xl border p-4 sm:grid-cols-2"
	>
		<div class="flex flex-col gap-2">
			<label class="text-text-muted text-xs font-medium tracking-wide uppercase" for="custom-start"
				>Start date</label
			>
			<input
				id="custom-start"
				type="date"
				bind:value={customStart}
				class="border-border bg-surface text-text-primary focus-visible:ring-accent focus-visible:ring-offset-surface-elevated h-10 rounded-lg border px-3 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				max={filter.endDate}
				disabled={activePreset !== 'custom'}
				on:change={applyCustomRange}
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-text-muted text-xs font-medium tracking-wide uppercase" for="custom-end"
				>End date</label
			>
			<input
				id="custom-end"
				type="date"
				bind:value={customEnd}
				class="border-border bg-surface text-text-primary focus-visible:ring-accent focus-visible:ring-offset-surface-elevated h-10 rounded-lg border px-3 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				min={customStart}
				max={todayIso}
				disabled={activePreset !== 'custom'}
				on:change={applyCustomRange}
			/>
		</div>

		<div class="text-text-muted flex flex-wrap items-center gap-4 text-sm sm:col-span-2">
			<span>
				<span class="text-text-secondary">{formatDate(filter.startDate)}</span>
				<span class="text-text-muted mx-2">to</span>
				<span class="text-text-secondary">{formatDate(filter.endDate)}</span>
			</span>
			{#if rangeLength}
				<span
					class="border-border-muted rounded-full border px-3 py-1 text-xs tracking-wide uppercase"
				>
					{rangeLength} day{rangeLength === 1 ? '' : 's'}
				</span>
			{/if}
		</div>

		{#if feedback}
			<p
				class="border-accent/40 bg-accent/5 text-accent rounded-lg border px-3 py-2 text-xs sm:col-span-2"
			>
				{feedback}
			</p>
		{/if}
	</div>
</section>
