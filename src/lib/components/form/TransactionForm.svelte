<svelte:options runes={true} />

<script lang="ts">
	import { tick } from 'svelte';
	import { formatISO, isAfter, parseISO } from 'date-fns';

	import { transactionsStore } from '$lib/stores/transactions';
	import { CATEGORY_LABELS, PRIMARY_CATEGORIES, type PrimaryCategory } from '$lib/types';

	type FormState = {
		date: string;
		label: string;
		primaryCategory: PrimaryCategory;
		subCategory: string;
		amount: string;
	};

	type FormErrors = Partial<Record<keyof FormState, string>>;

	const today = formatISO(new Date(), { representation: 'date' });

	const emptyForm = (): FormState => ({
		date: today,
		label: '',
		primaryCategory: 'variable_expense',
		subCategory: '',
		amount: ''
	});

	let form = $state<FormState>(emptyForm());
	let errors = $state<FormErrors>({});
	let showSuccess = $state(false);
	let subcategoryOptions = $state<string[]>([]);
	// const subcategorySummary = $derived.by(() => {
	// 	const label = CATEGORY_LABELS[form.primaryCategory];
	// 	const list =
	// 		subcategoryOptions.length > 0 ? subcategoryOptions.join(', ') : 'Add categories later';
	// 	return `Subcategory dropdown lists only ${label} subcategories: ${list}`;
	// });

	$effect(() => {
		const options = transactionsStore.getSubcategories(form.primaryCategory);
		const fallback = options[0] ?? '';

		subcategoryOptions = [...options];

		if (options.length === 0 && form.subCategory !== '') {
			form = { ...form, subCategory: '' };
		} else if (options.length > 0 && !options.includes(form.subCategory)) {
			form = { ...form, subCategory: fallback };
		}
	});

	const validate = (): boolean => {
		const next: FormErrors = {};

		if (!form.label.trim()) {
			next.label = 'Provide a short description (1-80 characters).';
		} else if (form.label.trim().length > 80) {
			next.label = 'Description must be 80 characters or less.';
		}

		const parsedDate = parseISO(form.date);
		if (!form.date || Number.isNaN(parsedDate.getTime())) {
			next.date = 'Choose a valid date.';
		} else if (isAfter(parsedDate, new Date())) {
			next.date = 'Date cannot be in the future.';
		}

		const amountNumber = Number.parseFloat(form.amount);
		if (!form.amount) {
			next.amount = 'Enter an amount.';
		} else if (Number.isNaN(amountNumber) || amountNumber <= 0) {
			next.amount = 'Amount must be greater than 0.';
		}

		if (!form.subCategory) {
			next.subCategory = 'Select a subcategory.';
		}

		errors = next;
		return Object.keys(next).length === 0;
	};

	const resetForm = async () => {
		form = emptyForm();
		await tick();
		errors = {};
	};

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		if (!validate()) return;

		const amountNumber = Number.parseFloat(form.amount);

		transactionsStore.addEntry({
			date: form.date,
			label: form.label.trim(),
			primaryCategory: form.primaryCategory,
			subCategory: form.subCategory,
			amount: amountNumber
		});

		showSuccess = true;
		await resetForm();
		setTimeout(() => {
			showSuccess = false;
		}, 2500);
	};
</script>

<form
	onsubmit={handleSubmit}
	class="relative flex flex-col gap-6 rounded-card bg-surface-elevated p-6 shadow-elevated ring-1 ring-border"
>
	<header class="flex flex-col gap-2">
		<h2 class="text-lg font-semibold text-text-secondary">Add a transaction</h2>
		<p class="text-sm text-text-muted">
			Track your income and spending in one place. Transactions save locally and reset on refresh.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-2">
			<label class="text-sm font-medium text-text-secondary" for="date">Date</label>
			<input
				id="date"
				type="date"
				bind:value={form.date}
				max={today}
				required
				class="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
			/>
			{#if errors.date}
				<p class="text-xs text-negative">{errors.date}</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2 sm:col-span-2">
			<label class="text-sm font-medium text-text-secondary" for="label">Description</label>
			<input
				id="label"
				placeholder="e.g. Coffee with client"
				maxlength={80}
				bind:value={form.label}
				required
				class="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
			/>
			{#if errors.label}
				<p class="text-xs text-negative">{errors.label}</p>
			{:else}
				<p class="text-xs text-text-muted">Keep it short—this appears in your entries table.</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-sm font-medium text-text-secondary" for="primaryCategory">Category</label>
			<select
				id="primaryCategory"
				bind:value={form.primaryCategory}
				class="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
			>
				{#each PRIMARY_CATEGORIES as category (category)}
					<option value={category}>{CATEGORY_LABELS[category]}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-sm font-medium text-text-secondary" for="subCategory">Subcategory</label>
			<select
				id="subCategory"
				bind:value={form.subCategory}
				class="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated disabled:opacity-40"
				disabled={subcategoryOptions.length === 0}
			>
				{#if subcategoryOptions.length === 0}
					<option value="">Add categories later</option>
				{:else}
					{#each subcategoryOptions as option (option)}
						<option value={option}>{option}</option>
					{/each}
				{/if}
			</select>
			{#if errors.subCategory}
				<p class="text-xs text-negative">{errors.subCategory}</p>
			{/if}
			<!-- <p
				class="text-xs text-text-muted"
				aria-live="polite"
				data-testid="subcategory-options-hint"
			>
				{subcategorySummary}
			</p> -->
		</div>

		<div class="flex flex-col gap-2 sm:col-span-2">
			<label class="text-sm font-medium text-text-secondary" for="amount">Amount</label>
			<div class="relative">
				<span
					class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-text-muted"
					>$</span
				>
				<input
					id="amount"
					type="number"
					step="0.01"
					min="0"
					bind:value={form.amount}
					required
					class="h-11 w-full rounded-lg border border-border bg-surface pr-3 pl-8 text-sm text-text-primary transition outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
				/>
			</div>
			{#if errors.amount}
				<p class="text-xs text-negative">{errors.amount}</p>
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<button
			type="submit"
			class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-surface transition hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated focus-visible:outline-none"
		>
			Add transaction
		</button>

		{#if showSuccess}
			<p role="status" aria-live="polite" class="text-sm font-medium text-positive">
				Transaction added
			</p>
		{/if}
	</div>
</form>
