<script lang="ts">
	import { transactionsStore } from '$lib/stores/transactions';
	import type { TransactionEntry } from '$lib/types';
	import { formatCurrency, formatIsoDate } from '$lib/utils/format';

	$: state = $transactionsStore;
	$: entries = state.filteredEntries;

	const badgeStyle = (entry: TransactionEntry) =>
		`background: color-mix(in srgb, ${transactionsStore.getAccentFor(entry)} 22%, transparent); color: ${transactionsStore.getAccentFor(entry)}; border: 1px solid color-mix(in srgb, ${transactionsStore.getAccentFor(entry)} 35%, transparent);`;

	const rowAccent = (entry: TransactionEntry) =>
		entry.type === 'income' ? 'text-positive' : 'text-negative';

	const removeEntry = (id: string) => {
		transactionsStore.removeEntry(id);
	};
</script>

<section
	class="rounded-card border-border bg-surface-elevated shadow-elevated flex flex-col gap-4 border p-6"
>
	<header class="flex flex-col gap-1">
		<h2 class="text-text-secondary text-lg font-semibold">Entries</h2>
		<p class="text-text-muted text-sm">
			{entries.length} record{entries.length === 1 ? '' : 's'} in the selected period.
		</p>
	</header>

	{#if entries.length === 0}
		<div
			class="border-border-muted bg-surface-inset/60 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-14 text-center"
		>
			<p class="text-text-secondary text-base font-medium">No transactions found</p>
			<p class="text-text-muted max-w-md text-sm">
				Add a transaction or adjust the period filter to see your history here.
			</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="min-w-[720px] table-auto border-collapse text-sm">
				<thead>
					<tr class="text-text-muted text-left text-xs tracking-wide uppercase">
						<th class="pr-4 pb-3 font-medium">Date</th>
						<th class="pr-4 pb-3 font-medium">Description</th>
						<th class="pr-4 pb-3 font-medium">Category</th>
						<th class="pr-4 pb-3 text-right font-medium">Amount</th>
						<th class="pr-3 pb-3 pl-2 text-right font-medium">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-border divide-y">
					{#each entries as entry (entry.id)}
						<tr class="hover:bg-surface-inset/40 transition">
							<td class="text-text-secondary py-3 pr-4 align-middle">
								{formatIsoDate(entry.date)}
							</td>
							<td class="py-3 pr-4 align-middle">
								<div class="text-text-primary flex flex-col gap-1">
									<span class="font-medium">{entry.label}</span>
									<span class="text-text-muted text-xs">#{entry.id.slice(-6)}</span>
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
									class="text-text-muted hover:border-border hover:text-text-secondary rounded-lg border border-transparent px-2 py-1 text-xs font-medium transition"
									on:click={() => removeEntry(entry.id)}
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
