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
	class={`flex h-full flex-col justify-between gap-4 rounded-card border bg-surface-elevated p-6 shadow-elevated ${accentClasses[accent] ?? accentClasses.neutral}`}
>
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium tracking-wide text-text-muted uppercase">{label}</p>
		<p class="text-3xl font-semibold text-text-secondary">{value}</p>
		{#if helper}
			<p class="text-sm text-text-muted">{helper}</p>
		{/if}
	</div>

	{#if deltaLabel}
		<p class="flex items-center gap-2 text-xs font-medium tracking-wide text-text-muted uppercase">
			<span class="text-base">{deltaIcon()}</span>
			{deltaLabel}
		</p>
	{/if}
</article>
