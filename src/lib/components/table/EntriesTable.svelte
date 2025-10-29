<svelte:options runes={true} />

<script lang="ts">
	import { transactionsStore } from '$lib/stores/transactions';
	import { get } from 'svelte/store';
	import type { TransactionEntry } from '$lib/types';
	import { formatCurrency, formatIsoDate } from '$lib/utils/format';

	let snapshot = $state(get(transactionsStore));

	$effect(() => {
		const unsubscribe = transactionsStore.subscribe((value) => {
			snapshot = value;
		});

		return () => {
			unsubscribe();
		};
	});

	const entries = $derived(snapshot.filteredEntries);

	const badgeStyle = (entry: TransactionEntry) => {
		const accent = transactionsStore.getAccentFor(entry);
		return `background: color-mix(in srgb, ${accent} 22%, transparent); color: ${accent}; border: 1px solid color-mix(in srgb, ${accent} 35%, transparent);`;
	};

	const rowAccent = (entry: TransactionEntry) =>
		entry.type === 'income' ? 'text-positive' : 'text-negative';
</script>

<section
	class="flex flex-col gap-4 rounded-card border border-border bg-surface-elevated p-6 shadow-elevated"
>
	<header class="flex flex-col gap-1">
		<h2 class="text-lg font-semibold text-text-secondary">Entries</h2>
		<p class="text-sm text-text-muted">
			{entries.length} record{entries.length === 1 ? '' : 's'} in the selected period.
		</p>
	</header>

	{#if entries.length === 0}
		<div
			class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-muted bg-surface-inset/60 py-14 text-center"
		>
			<p class="text-base font-medium text-text-secondary">No transactions found</p>
			<p class="max-w-md text-sm text-text-muted">
				Add a transaction or adjust the period filter to see your history here.
			</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-[720px] table-auto border-collapse text-sm">
				<thead>
					<tr class="text-left text-xs tracking-wide text-text-muted uppercase">
						<th class="pr-4 pb-3 font-medium">Date</th>
						<th class="pr-4 pb-3 font-medium">Description</th>
						<th class="pr-4 pb-3 font-medium">Category</th>
						<th class="pr-4 pb-3 text-right font-medium">Amount</th>
						<th class="pr-3 pb-3 pl-2 text-right font-medium">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each entries as entry (entry.id)}
						<tr class="transition hover:bg-surface-inset/40">
							<td class="py-3 pr-4 align-middle text-text-secondary">
								{formatIsoDate(entry.date)}
							</td>
							<td class="py-3 pr-4 align-middle">
								<div class="flex flex-col gap-1 text-text-primary">
									<span class="font-medium">{entry.label}</span>
									<span class="text-xs text-text-muted">#{entry.id.slice(-6)}</span>
								</div>
							</td>
							<td class="py-3 pr-4 align-middle">
								<span
									class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase"
									style={badgeStyle(entry)}
								>
									{entry.primaryCategory.replace('_', ' ')}
									{#if entry.subCategory}
										<span class="text-text-muted">·</span>
										<span class="text-text-secondary capitalize">{entry.subCategory}</span>
									{/if}
								</span>
							</td>
							<td class={`py-3 pr-4 text-right font-semibold ${rowAccent(entry)}`}>
								{entry.type === 'expense' ? '-' : '+'}
								{formatCurrency(entry.amount)}
							</td>
							<td class="py-3 pr-3 pl-2 text-right">
								<button
									type="button"
									class="rounded-lg border border-transparent px-2 py-1 text-xs font-medium text-text-muted transition hover:border-border hover:text-text-secondary"
									onclick={() => transactionsStore.removeEntry(entry.id)}
									aria-label={`Remove ${entry.label}`}
								>
									Remove
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
