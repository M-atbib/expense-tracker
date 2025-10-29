<svelte:options runes={true} />

<script lang="ts">
	import type { CategoryShareSlice } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';
	import { themeColor } from '$lib/utils/theme';

	let {
		title = 'Category share',
		data = []
	}: {
		title?: string;
		data?: CategoryShareSlice[];
	} = $props<{ title?: string; data?: CategoryShareSlice[] }>();

	const radius = 88;
	const center = 120;

	const palette: string[] = [
		themeColor('accent'),
		themeColor('positive'),
		themeColor('income'),
		themeColor('warning'),
		themeColor('negative')
	];

	const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => ({
		x: cx + r * Math.cos(angle),
		y: cy + r * Math.sin(angle)
	});

	const describeArc = (startAngle: number, endAngle: number) => {
		const start = polarToCartesian(center, center, radius, endAngle);
		const end = polarToCartesian(center, center, radius, startAngle);
		const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

		return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
	};

	const arcs = () => {
		let currentAngle = -Math.PI / 2;
		return data.map((slice: CategoryShareSlice, index: number) => {
			const angle = (slice.percentage / 100) * Math.PI * 2;
			const start = currentAngle;
			const end = currentAngle + angle;
			currentAngle = end;

			return {
				path: describeArc(start, end),
				color: palette[index % palette.length],
				category: slice.category,
				percentage: slice.percentage,
				value: slice.value
			};
		});
	};

	const arcSegments = $derived(arcs());
	const totalPercentage = $derived(
		data.reduce((sum: number, slice: CategoryShareSlice) => sum + slice.percentage, 0)
	);
	const totalValue = $derived(
		data.reduce((sum: number, slice: CategoryShareSlice) => sum + slice.value, 0)
	);
</script>

<section
	class="flex flex-col gap-5 rounded-card border border-border bg-surface-elevated p-6 shadow-elevated"
>
	<header class="flex items-center justify-between">
		<div class="flex flex-col gap-1">
			<h3 class="text-lg font-semibold text-text-secondary">{title}</h3>
			<p class="text-sm text-text-muted">Breakdown of spending by category.</p>
		</div>
		<span class="text-xs tracking-wide text-text-muted uppercase">
			{Math.round(totalPercentage)}%
		</span>
	</header>

	{#if data.length === 0}
		<div
			class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-muted bg-surface-inset/60 py-12 text-center text-text-muted"
		>
			<p class="text-sm">Add expense entries to visualize category share.</p>
		</div>
	{:else}
		<div class="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
			<div class="relative mx-auto flex h-[240px] w-[240px] items-center justify-center">
				<svg
					role="img"
					aria-label="Donut chart of spending by category"
					width={center * 2}
					height={center * 2}
					viewBox={`0 0 ${center * 2} ${center * 2}`}
				>
					<circle
						cx={center}
						cy={center}
						r={radius}
						fill="none"
						stroke="var(--color-surface-muted)"
						stroke-width="20"
						opacity="0.35"
					/>

					{#each arcSegments as segment, index (`${segment.category}-${index}`)}
						<g>
							<path
								d={segment.path}
								fill="none"
								stroke={segment.color}
								stroke-width="20"
								stroke-linecap="round"
								aria-label={`${segment.category}: ${segment.percentage.toFixed(1)} percent`}
							/>
							<title>{segment.category}: {segment.percentage.toFixed(1)}%</title>
						</g>
					{/each}

					<circle cx={center} cy={center} r={radius - 36} fill="var(--color-surface)" />

					<text
						x={center}
						y={center - 6}
						text-anchor="middle"
						class="fill-[var(--color-text-secondary)] text-xl font-semibold"
					>
						Expenses
					</text>
					<text
						x={center}
						y={center + 18}
						text-anchor="middle"
						class="fill-[var(--color-text-muted)] text-sm"
					>
						{formatCurrency(totalValue)}
					</text>
				</svg>
			</div>

			<ul class="grid gap-4">
				{#each data as slice, index (`${slice.category}-${index}`)}
					<li
						class="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3 text-sm"
					>
						<div class="flex items-center gap-3">
							<span
								class="inline-flex h-3 w-3 rounded-full"
								style={`background:${palette[index % palette.length]}`}
								aria-hidden="true"
							></span>
							<div class="flex flex-col">
								<span class="font-medium text-text-secondary">{slice.category}</span>
								<span class="text-xs text-text-muted">{formatCurrency(slice.value)}</span>
							</div>
						</div>
						<span class="text-xs font-semibold tracking-wide text-text-muted uppercase">
							{slice.percentage.toFixed(1)}%
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>
