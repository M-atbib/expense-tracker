import { format, parseISO } from 'date-fns';

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

export const formatIsoDate = (isoDate: string, pattern = 'MMM d, yyyy'): string => {
	const parsed = parseISO(isoDate);
	if (Number.isNaN(parsed.getTime())) return isoDate;
	return format(parsed, pattern);
};

export const formatCompactNumber = (value: number): string =>
	new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
