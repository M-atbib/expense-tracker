<script lang="ts">
	import type { CategoryShareSlice } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';
	import { themeColor } from '$lib/utils/theme';

	export let title = 'Category share';
	export let data: CategoryShareSlice[] = [];

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
		return data.map((slice, index) => {
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

	$: arcSegments = arcs();
	$: totalPercentage = data.reduce((sum, slice) => sum + slice.percentage, 0);
</script>

<section
	class="rounded-card border-border bg-surface-elevated shadow-elevated flex flex-col gap-5 border p-6"
>
	<header class="flex items-center justify-between">
		<div class="flex flex-col gap-1">
			<h3 class="text-text-secondary text-lg font-semibold">{title}</h3>
			<p class="text-text-muted text-sm">Breakdown of spending by category.</p>
		</div>
		<span class="text-text-muted text-xs tracking-wide uppercase">
			{Math.round(totalPercentage)}%
		</span>
	</header>

	{#if data.length === 0}
		<div
			class="border-border-muted bg-surface-inset/60 text-text-muted flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-12 text-center"
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

					{#each arcSegments as segment}
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
						{formatCurrency(data.reduce((sum, slice) => sum + slice.value, 0))}
					</text>
				</svg>
			</div>

			<ul class="grid gap-4">
				{#each data as slice, index}
					<li
						class="border-border bg-surface flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm"
					>
						<div class="flex items-center gap-3">
							<span
								class="inline-flex h-3 w-3 rounded-full"
								style={`background:${palette[index % palette.length]}`}
								aria-hidden="true"
							></span>
							<div class="flex flex-col">
								<span class="text-text-secondary font-medium">{slice.category}</span>
								<span class="text-text-muted text-xs">{formatCurrency(slice.value)}</span>
							</div>
						</div>
						<span class="text-text-muted text-xs font-semibold tracking-wide uppercase">
							{slice.percentage.toFixed(1)}%
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>
