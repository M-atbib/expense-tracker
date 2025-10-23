# Repository Guidelines

## Project Structure & Module Organization
This SvelteKit project keeps all source under `src/`. Routes live in `src/routes`, with `+page.svelte` handling feature UIs and `+layout.svelte` wiring shared layout logic. Reusable stores, utilities, and static assets belong in `src/lib`, while app-level styling sits in `src/app.css`. Public assets that should be served verbatim go into `static/`. Configuration for linting, TypeScript, Tailwind, and SvelteKit stays at the repository root.

## Build & Quality Commands
Install dependencies with `pnpm install`. Use `pnpm dev` for hot-reload development, `pnpm build` to produce the production Vite bundle, and `pnpm preview` to sanity-check the build locally. Before opening a pull request, run `pnpm lint`, `pnpm format`, and `pnpm check`; these are the mandatory gates in lieu of automated tests.

## Coding Style & Naming Conventions
Follow Prettier defaults (two-space indentation, semicolons off) and keep imports sorted logically. Components, stores, and helper modules in `src/lib` should use PascalCase for Svelte components, camelCase for functions and stores, and SCREAMING_SNAKE_CASE for constants. Co-locate component-specific styles in `<style>` blocks and prefer Tailwind utility classes for layout. Avoid default exports except for Svelte components to simplify refactors.

## Manual Validation Guidelines
Automated testing is prohibited. Every change must include a documented manual walkthrough covering the affected user journeys, responsive breakpoints (at least 320px, tablet, and desktop), and accessibility cues (focus order, ARIA labels when applicable). Capture findings in the PR description with notes or screenshots so reviewers can reproduce results quickly. Lean on `pnpm check` for type safety and linting for static assurance, and clean up any dead code uncovered during review.

## Dependency Discipline
Keep the stack lean—prefer SvelteKit core APIs, Svelte `^5.39.5`, Tailwind CSS `^4.1.13`, and Vite `^7.1.7`. Any new dependency requires written justification tied to user value and approval during review, along with a plan for future removal if the dependency stops providing value. When feature work demands shared helpers, place them in `src/lib` instead of introducing new packages.
