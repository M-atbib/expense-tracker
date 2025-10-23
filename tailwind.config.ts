import type { Config } from 'tailwindcss';
import { shadcnPreset } from 'shadcn-svelte/preset';

const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	presets: [shadcnPreset()],
	theme: {
		extend: {
			colors: {
				surface: 'var(--color-surface)',
				'surface-muted': 'var(--color-surface-muted)',
				'surface-elevated': 'var(--color-surface-elevated)',
				'surface-inset': 'var(--color-surface-inset)',
				border: 'var(--color-border)',
				'border-muted': 'var(--color-border-muted)',
				accent: 'var(--color-accent)',
				'accent-soft': 'var(--color-accent-soft)',
				positive: 'var(--color-positive)',
				negative: 'var(--color-negative)',
				warning: 'var(--color-warning)',
				income: 'var(--color-income)',
				expense: 'var(--color-expense)',
				'text-primary': 'var(--color-text-primary)',
				'text-secondary': 'var(--color-text-secondary)',
				'text-muted': 'var(--color-text-muted)'
			},
			boxShadow: {
				elevated: 'var(--shadow-elevated)'
			},
			borderRadius: {
				card: 'var(--radius-card)'
			}
		}
	}
} satisfies Config;

export default config;
