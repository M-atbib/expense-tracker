export const PRIMARY_CATEGORIES = ['income', 'fixed_expense', 'variable_expense'] as const;
export type PrimaryCategory = (typeof PRIMARY_CATEGORIES)[number];

export const PERIOD_PRESETS = ['this_month', 'last_month', 'year_to_date', 'custom'] as const;
export type PeriodPreset = (typeof PERIOD_PRESETS)[number];

export type TransactionKind = 'income' | 'expense';

export interface TransactionEntry {
	id: string;
	date: string;
	label: string;
	primaryCategory: PrimaryCategory;
	subCategory: string;
	amount: number;
	type: TransactionKind;
}

export interface TransactionDraft {
	date: string;
	label: string;
	primaryCategory: PrimaryCategory;
	subCategory: string;
	amount: number;
}

export interface PeriodFilter {
	preset: PeriodPreset;
	startDate: string;
	endDate: string;
}

export interface TrendSeriesPoint {
	label: string;
	income: number;
	expenses: number;
}

export interface CategoryShareSlice {
	category: PrimaryCategory | string;
	percentage: number;
	value: number;
}

export interface KPIBundle {
	totalIncome: number;
	totalExpenses: number;
	amountSaved: number;
	leftoverBalance: number;
	trendSeries: TrendSeriesPoint[];
	categoryShare: CategoryShareSlice[];
}

export interface TransactionStoreState {
	entries: TransactionEntry[];
	filter: PeriodFilter;
	filteredEntries: TransactionEntry[];
	kpis: KPIBundle;
}

export const THEME_COLOR_TOKENS = [
	'surface',
	'surface-elevated',
	'surface-muted',
	'surface-inset',
	'border',
	'border-muted',
	'accent',
	'accent-soft',
	'positive',
	'negative',
	'warning',
	'income',
	'expense',
	'text-primary',
	'text-secondary',
	'text-muted'
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_TOKENS)[number];

export const CATEGORY_LABELS: Record<PrimaryCategory, string> = {
	income: 'Income',
	fixed_expense: 'Fixed Expense',
	variable_expense: 'Variable Expense'
};
