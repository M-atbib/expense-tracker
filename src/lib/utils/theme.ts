import type { ThemeColorToken } from '$lib/types';

const clamp = (value: number, min = 0, max = 1): number => Math.min(Math.max(value, min), max);

export const themeVar = (token: string): string => {
	const normalized = token.startsWith('--') ? token : `--${token}`;
	return `var(${normalized})`;
};

export const themeColor = (token: ThemeColorToken): string => themeVar(`color-${token}`);

export const themeShadow = (token: string = 'shadow-elevated'): string => themeVar(token);

export const themeRadius = (token = 'radius-card'): string => themeVar(token);

export const colorWithOpacity = (token: ThemeColorToken, alpha: number): string => {
	const percentage = clamp(alpha) * 100;
	return `color-mix(in srgb, ${themeColor(token)} ${percentage}%, transparent)`;
};

export const gradientBetween = (from: ThemeColorToken, to: ThemeColorToken, angle = 135): string =>
	`linear-gradient(${angle}deg, ${themeColor(from)} 0%, ${themeColor(to)} 100%)`;
