<svelte:options runes={true} />

<script lang="ts">
	import type { TrendSeriesPoint } from '$lib/types';
	import { formatCompactNumber } from '$lib/utils/format';

	let {
		title = 'Cashflow trend',
		data = []
	}: {
		title?: string;
		data?: TrendSeriesPoint[];
	} = $props<{ title?: string; data?: TrendSeriesPoint[] }>();

	const width = 520;
	const height = 260;
	const paddingX = 40;
	const paddingY = 32;

	const toY = (value: number, max: number) => {
		if (max === 0) return height - paddingY;
		const scale = (height - paddingY * 2) / max;
		return height - paddingY - value * scale;
	};

	const toX = (index: number, total: number) => {
		if (total <= 1) return paddingX;
		const usable = width - paddingX * 2;
		const step = usable / (total - 1);
		return paddingX + index * step;
	};

	const buildPoints = (key: 'income' | 'expenses', max: number) =>
		data
			.map(
				(point: TrendSeriesPoint, index: number) =>
					`${toX(index, data.length)},${toY(point[key], max)}`
			)
			.join(' ');

	const maxValue = $derived(
		Math.max(...data.flatMap((point: TrendSeriesPoint) => [point.income, point.expenses]), 0)
	);
	const incomePoints = $derived(buildPoints('income', maxValue));
	const expensePoints = $derived(buildPoints('expenses', maxValue));

	const buildAreaPath = (key: 'income' | 'expenses', max: number) => {
		if (data.length === 0) return '';
		const topPoints = data
			.map(
				(point: TrendSeriesPoint, index: number) =>
					`L ${toX(index, data.length)} ${toY(point[key], max)}`
			)
			.join(' ')
			.replace(/^L/, 'M');
		const lastX = toX(data.length - 1, data.length);
		const baseLine = `L ${lastX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;
		return `${topPoints} ${baseLine}`;
	};

	const incomeArea = $derived(buildAreaPath('income', maxValue));
	const expenseArea = $derived(buildAreaPath('expenses', maxValue));
</script>

<section
	class="flex flex-col gap-5 rounded-card border border-border bg-surface-elevated p-6 shadow-elevated"
>
	<header class="flex items-center justify-between">
		<div class="flex flex-col gap-1">
			<h3 class="text-lg font-semibold text-text-secondary">{title}</h3>
			<p class="text-sm text-text-muted">Weekly view of income versus spending.</p>
		</div>
		<span class="text-xs tracking-wide text-text-muted uppercase">
			{data.length} data point{data.length === 1 ? '' : 's'}
		</span>
	</header>

	{#if data.length === 0}
		<div
			class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-muted bg-surface-inset/60 py-12 text-center text-text-muted"
		>
			<p class="text-sm">Add transactions to generate a trend chart.</p>
		</div>
	{:else}
		<div class="overflow-hidden rounded-xl border border-border bg-surface-inset/60">
			<svg
				role="img"
				aria-label="Line chart comparing income versus expenses"
				width="100%"
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="incomeFill" x1="0%" x2="0%" y1="0%" y2="100%">
						<stop
							offset="0%"
							stop-color="color-mix(in srgb, var(--color-positive) 65%, transparent)"
						/>
						<stop offset="100%" stop-color="transparent" />
					</linearGradient>
					<linearGradient id="expenseFill" x1="0%" x2="0%" y1="0%" y2="100%">
						<stop
							offset="0%"
							stop-color="color-mix(in srgb, var(--color-negative) 65%, transparent)"
						/>
						<stop offset="100%" stop-color="transparent" />
					</linearGradient>
				</defs>

				<g stroke="var(--color-border-muted)" stroke-width="1" stroke-dasharray="4 6">
					{#each [0.25, 0.5, 0.75] as ratio (ratio)}
						<line
							x1={paddingX}
							x2={width - paddingX}
							y1={paddingY + (height - paddingY * 2) * ratio}
							y2={paddingY + (height - paddingY * 2) * ratio}
						/>
					{/each}
				</g>

				<path d={incomeArea} fill="url(#incomeFill)" />
				<path d={expenseArea} fill="url(#expenseFill)" />

				<polyline
					points={incomePoints}
					fill="none"
					stroke="var(--color-positive)"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>

				<polyline
					points={expensePoints}
					fill="none"
					stroke="var(--color-negative)"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>

				{#each data as point, index (`${point.label}-${index}`)}
					<g>
						<circle
							cx={toX(index, data.length)}
							cy={toY(point.income, maxValue)}
							r="4"
							fill="var(--color-positive)"
						/>
						<circle
							cx={toX(index, data.length)}
							cy={toY(point.expenses, maxValue)}
							r="4"
							fill="var(--color-negative)"
						/>
					</g>
				{/each}

				<g font-size="11" fill="var(--color-text-muted)">
					{#if maxValue > 0}
						{#each [maxValue, maxValue * 0.66, maxValue * 0.33] as tick (tick)}
							<text x="8" y={toY(tick, maxValue) + 4} text-anchor="start">
								{formatCompactNumber(Math.max(tick, 0))}
							</text>
						{/each}
					{/if}
				</g>

				<g font-size="11" fill="var(--color-text-muted)">
					{#each data as point, index (`${point.label}-${index}`)}
						<text x={toX(index, data.length)} y={height - paddingY / 2} text-anchor="middle">
							{point.label}
						</text>
					{/each}
				</g>
			</svg>
		</div>
	{/if}
</section>
