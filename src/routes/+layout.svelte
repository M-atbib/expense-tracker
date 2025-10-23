<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#070b14" />
</svelte:head>

<main class="bg-surface text-text-primary min-h-screen antialiased">
	<div class="relative isolate min-h-screen">
		{@render children?.()}
	</div>
</main>
