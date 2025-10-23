import { writable } from 'svelte/store';
import { addDays, format, parseISO, isValid as isValidDate, startOfWeek } from 'date-fns';

import type {
	KPIBundle,
	PeriodFilter,
	PeriodPreset,
	PrimaryCategory,
	TransactionDraft,
	TransactionEntry,
	TransactionStoreState
} from '$lib/types';
import {
	applyPresetToFilter,
	compareEntriesByDateDesc,
	dateIsWithinFilter,
	resolvePresetRange
} from '$lib/utils/filters';
import { themeColor } from '$lib/utils/theme';

const DEFAULT_PRESET: PeriodPreset = 'this_month';

const initialFilter: PeriodFilter = applyPresetToFilter(
	{
		preset: DEFAULT_PRESET,
		startDate: '',
		endDate: ''
	},
	new Date()
);

const DEFAULT_SUBCATEGORIES: Record<PrimaryCategory, string[]> = {
	income: ['Salary', 'Bonus', 'Freelance', 'Investments'],
	fixed_expense: ['Rent/Mortgage', 'Utilities', 'Insurance', 'Subscriptions'],
	variable_expense: ['Groceries', 'Dining', 'Transportation', 'Entertainment']
};

const generateId = (): string => {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const deriveTransactionType = (category: PrimaryCategory) =>
	category === 'income' ? 'income' : 'expense';

const toCurrency = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const buildTrendSeries = (entries: TransactionEntry[]) => {
	type TrendAccumulator = {
		label: string;
		startDate: Date;
		income: number;
		expenses: number;
	};

	const buckets = entries.reduce<Map<string, TrendAccumulator>>((acc, entry) => {
		const parsed = parseISO(entry.date);
		if (!isValidDate(parsed)) return acc;

		const bucketDate = startOfWeek(parsed, { weekStartsOn: 1 });
		const key = bucketDate.toISOString().slice(0, 10);

		const bucket =
			acc.get(key) ??
			acc
				.set(key, {
					label: format(bucketDate, 'MMM d'),
					startDate: bucketDate,
					income: 0,
					expenses: 0
				})
				.get(key)!;

		if (entry.type === 'income') {
			bucket.income += entry.amount;
		} else {
			bucket.expenses += entry.amount;
		}

		return acc;
	}, new Map());

	return Array.from(buckets.values())
		.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
		.map(({ label, income, expenses }) => ({
			label,
			income: toCurrency(income),
			expenses: toCurrency(expenses)
		}));
};

const buildCategoryShare = (entries: TransactionEntry[]) => {
	const expenses = entries.filter((entry) => entry.type === 'expense');
	const total = expenses.reduce((sum, entry) => sum + entry.amount, 0);

	if (total <= 0) {
		return [];
	}

	const bucket = expenses.reduce<Record<string, number>>((acc, entry) => {
		const key = entry.subCategory || entry.primaryCategory;
		acc[key] = (acc[key] ?? 0) + entry.amount;
		return acc;
	}, {});

	return Object.entries(bucket)
		.map(([category, value]) => ({
			category,
			value: toCurrency(value),
			percentage: Math.round((value / total) * 1000) / 10
		}))
		.sort((a, b) => b.value - a.value);
};

const recalculateState = (
	entries: TransactionEntry[],
	filter: PeriodFilter,
	now = new Date()
): TransactionStoreState => {
	const normalizedFilter = applyPresetToFilter(filter, now);

	const filteredEntries = entries
		.filter((entry) => dateIsWithinFilter(entry.date, normalizedFilter))
		.sort((a, b) => {
			const byDate = compareEntriesByDateDesc(a.date, b.date);
			if (byDate !== 0) return byDate;
			return a.id > b.id ? -1 : 1;
		});

	const totalIncome = filteredEntries
		.filter((entry) => entry.type === 'income')
		.reduce((sum, entry) => sum + entry.amount, 0);

	const totalExpenses = filteredEntries
		.filter((entry) => entry.type === 'expense')
		.reduce((sum, entry) => sum + entry.amount, 0);

	const kpis: KPIBundle = {
		totalIncome: toCurrency(totalIncome),
		totalExpenses: toCurrency(totalExpenses),
		amountSaved: toCurrency(totalIncome - totalExpenses),
		leftoverBalance: toCurrency(totalIncome - totalExpenses),
		trendSeries: buildTrendSeries(filteredEntries),
		categoryShare: buildCategoryShare(filteredEntries)
	};

	return {
		entries: entries.slice().sort((a, b) => {
			const byDate = compareEntriesByDateDesc(a.date, b.date);
			if (byDate !== 0) return byDate;
			return a.id > b.id ? -1 : 1;
		}),
		filter: normalizedFilter,
		filteredEntries,
		kpis
	};
};

const createDefaultEntries = (): TransactionEntry[] => {
	const today = new Date();

	const sample: TransactionEntry[] = [
		{
			id: generateId(),
			date: format(addDays(today, -2), 'yyyy-MM-dd'),
			label: 'Product Design Contract',
			primaryCategory: 'income',
			subCategory: 'Freelance',
			amount: 3200,
			type: 'income'
		},
		{
			id: generateId(),
			date: format(addDays(today, -1), 'yyyy-MM-dd'),
			label: 'Rent - Downtown Loft',
			primaryCategory: 'fixed_expense',
			subCategory: 'Rent/Mortgage',
			amount: 1800,
			type: 'expense'
		},
		{
			id: generateId(),
			date: format(today, 'yyyy-MM-dd'),
			label: 'Whole Foods Market',
			primaryCategory: 'variable_expense',
			subCategory: 'Groceries',
			amount: 145.76,
			type: 'expense'
		}
	];

	return sample.sort((a, b) => compareEntriesByDateDesc(a.date, b.date));
};

const { subscribe, update, set } = writable<TransactionStoreState>(
	recalculateState(createDefaultEntries(), initialFilter)
);

export const transactionsStore = {
	subscribe,
	addEntry(draft: TransactionDraft) {
		update((state) => {
			const entry: TransactionEntry = {
				id: generateId(),
				date: draft.date,
				label: draft.label.trim(),
				primaryCategory: draft.primaryCategory,
				subCategory: draft.subCategory,
				amount: toCurrency(draft.amount),
				type: deriveTransactionType(draft.primaryCategory)
			};

			const entries = [entry, ...state.entries];
			return recalculateState(entries, state.filter);
		});
	},
	removeEntry(id: string) {
		update((state) => {
			const entries = state.entries.filter((entry) => entry.id !== id);
			return recalculateState(entries, state.filter);
		});
	},
	setPreset(preset: PeriodPreset) {
		update((state) => {
			const { start, end } = resolvePresetRange(preset);
			const nextFilter: PeriodFilter = {
				preset,
				startDate: start,
				endDate: end
			};

			return recalculateState(state.entries, nextFilter);
		});
	},
	setCustomRange(startDate: string, endDate: string) {
		update((state) => {
			const nextFilter: PeriodFilter = {
				...state.filter,
				preset: 'custom',
				startDate,
				endDate
			};

			return recalculateState(state.entries, nextFilter);
		});
	},
	resetFilter() {
		set(recalculateState(createDefaultEntries(), initialFilter));
	},
	clear() {
		set(
			recalculateState([], {
				preset: DEFAULT_PRESET,
				startDate: initialFilter.startDate,
				endDate: initialFilter.endDate
			})
		);
	},
	seed(entries: TransactionEntry[]) {
		set(recalculateState(entries, initialFilter));
	},
	getSubcategories(category: PrimaryCategory) {
		return DEFAULT_SUBCATEGORIES[category] ?? [];
	},
	getAccentFor(entry: TransactionEntry) {
		return entry.type === 'income' ? themeColor('positive') : themeColor('negative');
	}
};

export type TransactionsStore = typeof transactionsStore;
