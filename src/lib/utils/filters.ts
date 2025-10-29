import {
	endOfMonth,
	format,
	formatISO,
	isAfter,
	isBefore,
	isValid,
	isWithinInterval,
	parseISO,
	startOfMonth,
	startOfYear,
	subMonths,
	differenceInCalendarDays
} from 'date-fns';

import type { PeriodFilter, PeriodPreset } from '$lib/types';

export type IsoDateRange = { start: string; end: string };

const toISODate = (date: Date): string => formatISO(date, { representation: 'date' });

const clampToToday = (date: Date, now = new Date()): Date => (isAfter(date, now) ? now : date);

export const resolvePresetRange = (preset: PeriodPreset, now = new Date()): IsoDateRange => {
	switch (preset) {
		case 'this_month': {
			const start = startOfMonth(now);
			const end = clampToToday(endOfMonth(now), now);
			return { start: toISODate(start), end: toISODate(end) };
		}
		case 'last_month': {
			const previousMonth = subMonths(now, 1);
			return {
				start: toISODate(startOfMonth(previousMonth)),
				end: toISODate(endOfMonth(previousMonth))
			};
		}
		case 'year_to_date': {
			const start = startOfYear(now);
			return { start: toISODate(start), end: toISODate(now) };
		}
		default: {
			// Default custom window to the current month until user overrides it.
			const start = startOfMonth(now);
			return { start: toISODate(start), end: toISODate(now) };
		}
	}
};

export const normalizeCustomRange = (
	start: string,
	end: string,
	now = new Date()
): IsoDateRange => {
	let parsedStart = parseISO(start);
	let parsedEnd = parseISO(end);

	if (!isValid(parsedStart)) {
		parsedStart = startOfMonth(now);
	}

	if (!isValid(parsedEnd)) {
		parsedEnd = now;
	}

	parsedEnd = clampToToday(parsedEnd, now);

	if (isAfter(parsedStart, parsedEnd)) {
		[parsedStart, parsedEnd] = [parsedEnd, parsedStart];
	}

	return { start: toISODate(parsedStart), end: toISODate(parsedEnd) };
};

export const applyPresetToFilter = (filter: PeriodFilter, now = new Date()): PeriodFilter => {
	if (filter.preset === 'custom') {
		const { start, end } = normalizeCustomRange(filter.startDate, filter.endDate, now);
		return { ...filter, startDate: start, endDate: end };
	}

	const { start, end } = resolvePresetRange(filter.preset, now);
	return { ...filter, startDate: start, endDate: end };
};

export const dateIsWithinFilter = (isoDate: string, filter: PeriodFilter): boolean => {
	const date = parseISO(isoDate);
	if (!isValid(date)) return false;

	const start = parseISO(filter.startDate);
	const end = parseISO(filter.endDate);

	if (!isValid(start) || !isValid(end)) return false;

	const normalizedStart = isBefore(start, end) ? start : end;
	const normalizedEnd = isAfter(end, start) ? end : start;

	return isWithinInterval(date, { start: normalizedStart, end: normalizedEnd });
};

export const compareEntriesByDateDesc = (a: string, b: string): number => {
	const dateA = parseISO(a);
	const dateB = parseISO(b);

	if (!isValid(dateA) && !isValid(dateB)) return 0;
	if (!isValid(dateA)) return 1;
	if (!isValid(dateB)) return -1;

	if (dateA.getTime() === dateB.getTime()) return 0;

	return dateA.getTime() > dateB.getTime() ? -1 : 1;
};

export const summarizePeriodRange = (filter: PeriodFilter) => {
	const start = parseISO(filter.startDate);
	const end = parseISO(filter.endDate);

	if (!isValid(start) || !isValid(end)) {
		return {
			startLabel: filter.startDate,
			endLabel: filter.endDate,
			rangeLabel: `${filter.startDate} to ${filter.endDate}`,
			dayCount: null
		};
	}

	const startLabel = format(start, 'MMM d, yyyy');
	const endLabel = format(end, 'MMM d, yyyy');
	const dayCount = Math.abs(differenceInCalendarDays(end, start)) + 1;

	return {
		startLabel,
		endLabel,
		rangeLabel: `${startLabel} to ${endLabel}`,
		dayCount
	};
};

export const describeRangeAdjustments = (
	userStart: string,
	userEnd: string,
	normalized: IsoDateRange,
	now = new Date()
): string[] => {
	const adjustments: string[] = [];

	const parsedUserStart = parseISO(userStart);
	const parsedUserEnd = parseISO(userEnd);
	const parsedNormalizedEnd = parseISO(normalized.end);

	const userStartValid = isValid(parsedUserStart);
	const userEndValid = isValid(parsedUserEnd);

	if (!userStartValid) {
		adjustments.push('Start date reset to the first day of the current month');
	}

	if (!userEndValid) {
		adjustments.push('End date defaulted to today');
	}

	if (userStartValid && userEndValid && isAfter(parsedUserStart, parsedUserEnd)) {
		adjustments.push('Start date was moved before the end date');
	}

	if (
		userEndValid &&
		isAfter(parsedUserEnd, now) &&
		isValid(parsedNormalizedEnd) &&
		parsedNormalizedEnd.getTime() !== parsedUserEnd.getTime()
	) {
		adjustments.push("Future dates aren't supported yet—end date reset to today");
	}

	return adjustments;
};
