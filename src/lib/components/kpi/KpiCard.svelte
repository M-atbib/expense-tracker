<script lang="ts">
	export let label: string;
	export let value: string;
	export let helper: string = '';
	export let accent: 'positive' | 'negative' | 'accent' | 'neutral' = 'neutral';
	export let deltaLabel: string | null = null;
	export let deltaDirection: 'up' | 'down' | 'flat' = 'flat';

	const accentClasses: Record<typeof accent, string> = {
		positive: 'bg-positive/10 text-positive border-positive/30',
		negative: 'bg-negative/10 text-negative border-negative/30',
		accent: 'bg-accent/10 text-accent border-accent/30',
		neutral: 'bg-surface text-text-secondary border-border'
	};

	const deltaIcon = () => {
		if (deltaDirection === 'up') return '▲';
		if (deltaDirection === 'down') return '▼';
		return '◆';
	};
</script>

<article
	class={`rounded-card bg-surface-elevated shadow-elevated flex h-full flex-col justify-between gap-4 border p-6 ${accentClasses[accent] ?? accentClasses.neutral}`}
>
	<div class="flex flex-col gap-2">
		<p class="text-text-muted text-xs font-medium tracking-wide uppercase">{label}</p>
		<p class="text-text-secondary text-3xl font-semibold">{value}</p>
		{#if helper}
			<p class="text-text-muted text-sm">{helper}</p>
		{/if}
	</div>

	{#if deltaLabel}
		<p class="text-text-muted flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
			<span class="text-base">{deltaIcon()}</span>
			{deltaLabel}
		</p>
	{/if}
</article>
