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

	let form = emptyForm();
	let errors: FormErrors = {};
	let showSuccess = false;
	let subcategoryOptions: string[] = [];

	const syncSubcategories = (category: PrimaryCategory = form.primaryCategory) => {
		const options = transactionsStore.getSubcategories(category);
		subcategoryOptions = options;

		const fallback = options[0] ?? '';
		if (options.length === 0 && form.subCategory !== '') {
			form = { ...form, subCategory: '' };
		} else if (options.length > 0 && !options.includes(form.subCategory)) {
			form = { ...form, subCategory: fallback };
		}
	};

	syncSubcategories();

	const handlePrimaryCategoryChange = (event: Event) => {
		const target = event.currentTarget as HTMLSelectElement;
		const value = target.value as PrimaryCategory;

		if (form.primaryCategory === value) return;

		form = { ...form, primaryCategory: value };
		syncSubcategories(value);
	};

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
		syncSubcategories();
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
	on:submit={handleSubmit}
	class="rounded-card bg-surface-elevated shadow-elevated ring-border relative flex flex-col gap-6 p-6 ring-1"
>
	<header class="flex flex-col gap-2">
		<h2 class="text-text-secondary text-lg font-semibold">Add a transaction</h2>
		<p class="text-text-muted text-sm">
			Track your income and spending in one place. Transactions save locally and reset on refresh.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-2">
			<label class="text-text-secondary text-sm font-medium" for="date">Date</label>
			<input
				id="date"
				type="date"
				bind:value={form.date}
				max={today}
				required
				class="border-border bg-surface text-text-primary focus-visible:ring-accent focus-visible:ring-offset-surface-elevated h-11 rounded-lg border px-3 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
			/>
			{#if errors.date}
				<p class="text-negative text-xs">{errors.date}</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2 sm:col-span-2">
			<label class="text-text-secondary text-sm font-medium" for="label">Description</label>
			<input
				id="label"
				placeholder="e.g. Coffee with client"
				maxlength={80}
				bind:value={form.label}
				required
				class="border-border bg-surface text-text-primary focus-visible:ring-accent focus-visible:ring-offset-surface-elevated h-11 rounded-lg border px-3 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
			/>
			{#if errors.label}
				<p class="text-negative text-xs">{errors.label}</p>
			{:else}
				<p class="text-text-muted text-xs">Keep it short—this appears in your entries table.</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-text-secondary text-sm font-medium" for="primaryCategory">Category</label>
			<select
				id="primaryCategory"
				value={form.primaryCategory}
				class="border-border bg-surface text-text-primary focus-visible:ring-accent focus-visible:ring-offset-surface-elevated h-11 rounded-lg border px-3 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				on:change={handlePrimaryCategoryChange}
			>
				{#each PRIMARY_CATEGORIES as category}
					<option value={category}>{CATEGORY_LABELS[category]}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-text-secondary text-sm font-medium" for="subCategory">Subcategory</label>
			<select
				id="subCategory"
				bind:value={form.subCategory}
				class="border-border bg-surface text-text-primary focus-visible:ring-accent focus-visible:ring-offset-surface-elevated h-11 rounded-lg border px-3 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40"
				disabled={subcategoryOptions.length === 0}
			>
				{#if subcategoryOptions.length === 0}
					<option value="">Add categories later</option>
				{:else}
					{#each subcategoryOptions as option}
						<option value={option}>{option}</option>
					{/each}
				{/if}
			</select>
			{#if errors.subCategory}
				<p class="text-negative text-xs">{errors.subCategory}</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2 sm:col-span-2">
			<label class="text-text-secondary text-sm font-medium" for="amount">Amount</label>
			<div class="relative">
				<span
					class="text-text-muted pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm"
					>$</span
				>
				<input
					id="amount"
					type="number"
					step="0.01"
					min="0"
					bind:value={form.amount}
					required
					class="border-border bg-surface text-text-primary focus-visible:ring-accent focus-visible:ring-offset-surface-elevated h-11 w-full rounded-lg border pr-3 pl-8 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				/>
			</div>
			{#if errors.amount}
				<p class="text-negative text-xs">{errors.amount}</p>
			{/if}
		</div>
	</div>

	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<button
			type="submit"
			class="bg-accent text-surface hover:bg-accent-soft focus-visible:ring-accent focus-visible:ring-offset-surface-elevated inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			Add transaction
		</button>

		{#if showSuccess}
			<p role="status" aria-live="polite" class="text-positive text-sm font-medium">
				Transaction added
			</p>
		{/if}
	</div>
</form>
