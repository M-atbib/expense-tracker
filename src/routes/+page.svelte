<script lang="ts">
	import TransactionForm from '$lib/components/form/TransactionForm.svelte';
	import PeriodFilter from '$lib/components/table/PeriodFilter.svelte';
	import EntriesTable from '$lib/components/table/EntriesTable.svelte';
	import KpiCard from '$lib/components/kpi/KpiCard.svelte';
	import TrendChart from '$lib/components/charts/TrendChart.svelte';
	import CategoryDonut from '$lib/components/charts/CategoryDonut.svelte';
	import { transactionsStore } from '$lib/stores/transactions';
	import { formatCurrency } from '$lib/utils/format';

	const store = transactionsStore;
	$: state = $transactionsStore;
	$: kpis = state.kpis;
	$: totalIncome = formatCurrency(kpis.totalIncome);
	$: totalExpenses = formatCurrency(kpis.totalExpenses);
	$: netBalance = formatCurrency(kpis.amountSaved);
	$: savingsRate =
		kpis.totalIncome > 0
			? Math.round(((kpis.amountSaved / kpis.totalIncome) * 100 + Number.EPSILON) * 10) / 10
			: 0;
</script>

<div class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-12 pb-16 md:px-6 lg:px-8">
	<header class="flex flex-col gap-3">
		<p class="text-accent text-sm font-medium tracking-wide uppercase">Expense dashboard</p>
		<h1 class="text-text-secondary text-3xl font-semibold sm:text-4xl">
			Balance income, expenses, and savings in one glance
		</h1>
		<p class="text-text-muted max-w-3xl text-base sm:text-lg">
			Add a transaction and the dashboard refreshes instantly. All data lives in memory for this
			release—refreshing the page clears the ledger.
		</p>
	</header>

	<section class="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
		<TransactionForm />

		<aside
			class="rounded-card border-border bg-surface-inset shadow-elevated flex flex-col items-start justify-between gap-6 border p-6"
		>
			<div class="flex flex-col gap-4">
				<h3 class="text-text-secondary text-xl font-semibold">Instant confirmation</h3>
				<p class="text-text-muted text-sm">
					Entries appear at the top of your history as soon as you submit the form. Filtered KPIs
					and charts will update in real time as you continue to add data.
				</p>
			</div>

			<div class="border-border-muted bg-surface-elevated w-full rounded-xl border p-4">
				<p class="text-text-muted text-xs tracking-wide uppercase">Active entries</p>
				<p class="text-text-secondary mt-2 text-3xl font-semibold">
					{state.filteredEntries.length}
					<span class="text-text-muted ml-2 text-sm font-normal">in current view</span>
				</p>
			</div>

			<div class="text-text-muted flex w-full flex-col gap-2 text-sm">
				<p>Data resets on refresh. Firebase persistence will arrive in a later milestone.</p>
				<div class="text-text-muted flex items-center gap-2 text-xs">
					<span
						class="inline-flex h-2 w-2 rounded-full"
						style="background: var(--color-positive); box-shadow: 0 0 12px color-mix(in srgb, var(--color-positive) 60%, transparent);"
					></span>
					Income entries
					<span
						class="inline-flex h-2 w-2 rounded-full"
						style="background: var(--color-negative); box-shadow: 0 0 12px color-mix(in srgb, var(--color-negative) 60%, transparent);"
					></span>
					Spending entries
				</div>
			</div>
		</aside>
	</section>

	<section class="grid gap-6">
		<!-- <PeriodFilter /> -->
		<EntriesTable />
	</section>

	<section class="grid gap-6">
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<KpiCard
				label="Total income"
				value={totalIncome}
				helper="Sum of all inflows for the selected period."
				accent="positive"
			/>
			<KpiCard
				label="Total expenses"
				value={totalExpenses}
				helper="Spending is tracked as positive numbers for clarity."
				accent="negative"
			/>
			<KpiCard
				label="Net balance"
				value={netBalance}
				helper={`Savings rate ${savingsRate.toFixed(1)}%`}
				accent={kpis.amountSaved >= 0 ? 'accent' : 'negative'}
				deltaLabel={kpis.amountSaved >= 0 ? 'Above zero—keep going!' : 'Overspending detected'}
				deltaDirection={kpis.amountSaved >= 0 ? 'up' : 'down'}
			/>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<TrendChart data={kpis.trendSeries} />
			<CategoryDonut data={kpis.categoryShare} />
		</div>
	</section>
</div>
