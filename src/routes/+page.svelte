<script>
	import Canvas from './Canvas.svelte';
	import Controls from './Controls.svelte';
	import { settings } from '../stores';

	let showControls = true;
</script>

<div class="relative h-screen w-screen overflow-hidden bg-base-300">
	<div class="absolute left-0 top-0 z-50">
		<button class="btn btn-sm m-2" on:click={() => (showControls = !showControls)}>
			{showControls ? '▶ Hide' : '◀ Show'} Controls
		</button>
	</div>

	<div class="relative flex h-full">
		{#if showControls}
			<div
				class="absolute left-0 top-0 z-40 h-full w-80 border-r border-base-200 bg-base-100 shadow-lg"
			>
				<Controls />
			</div>
		{/if}
		<Canvas class="flex-1" />
	</div>
</div>
