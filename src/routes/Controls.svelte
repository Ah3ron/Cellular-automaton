<script>
	import { settings } from '../stores';

	const presets = [
		'000000',
		'161616',
		'262626',
		'393939',
		'333333',
		'1a1c24',
		'3a3e4b',
		'f2f4f8',
		'ffffff',
		'08bdba',
		'3ddbd9',
		'78a9ff',
		'5687ff',
		'be95ff',
		'42be65',
		'ee5396',
		'ff7eb6',
		'e9436f',
		'd63a7f',
		'f5c2e7'
	];

	let selectedPreset = 0;
	let showColorPicker = null;

	const addColor = () => {
		$settings.colors = [...$settings.colors, 'ffffff'];
	};

	const removeColor = (index) => {
		if ($settings.colors.length > 1) {
			$settings.colors = $settings.colors.filter((_, i) => i !== index);
		}
	};

	const updateColor = (index, value) => {
		$settings.colors = $settings.colors.map((c, i) => (i === index ? value : c));
	};
</script>

<div class="space-y-6 p-4 pt-14">
	<!-- Кнопка паузы -->
	<div class="form-control">
		<button
			class="btn btn-block {$settings.paused ? 'btn-error' : 'btn-success'}"
			on:click={() => ($settings.paused = !$settings.paused)}
		>
			{$settings.paused ? '▶ Resume' : '⏸ Pause'}
		</button>
	</div>

	<!-- Настройка цветов -->
	<div class="form-control">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label class="label">
			<span class="label-text">Colors ({$settings.colors.length})</span>
		</label>
		<div class="space-y-2">
			{#each $settings.colors as color, i}
				<div class="flex items-center gap-2">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<div class="dropdown">
						<label
							tabindex="0"
							class="btn btn-sm size-10 p-0"
							style="background-color: #{color}"
							on:click={() => (showColorPicker = showColorPicker === i ? null : i)}
						></label>
						{#if showColorPicker === i}
							<div
								tabindex="0"
								class="dropdown-content z-10 grid w-52 grid-cols-5 gap-1 rounded-box bg-base-100 p-2 shadow"
							>
								{#each presets as presetColor}
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="h-8 w-8 cursor-pointer rounded transition-transform hover:scale-105"
										style="background-color: #{presetColor}"
										on:click={() => {
											updateColor(i, presetColor);
											showColorPicker = null;
										}}
									></div>
								{/each}
								<div class="col-span-5 mt-2">
									<input
										type="text"
										class="input input-xs input-bordered w-full"
										placeholder="Hex color"
										bind:value={color}
										on:input={(e) =>
											updateColor(i, e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6))}
									/>
								</div>
							</div>
						{/if}
					</div>
					<input
						type="text"
						class="input input-sm input-bordered flex-1"
						value={color}
						on:input={(e) => updateColor(i, e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6))}
					/>
					{#if $settings.colors.length > 1}
						<button class="btn btn-error btn-sm" on:click={() => removeColor(i)}> × </button>
					{/if}
				</div>
			{/each}
			<button class="btn btn-sm btn-block" on:click={addColor}> + Add Color </button>
		</div>
	</div>

	<!-- Ползунки с значениями -->
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<div class="form-control">
		<label class="label">
			<span class="label-text">Cell Size: {$settings.cellSize}px</span>
		</label>
		<input type="range" min="4" max="24" bind:value={$settings.cellSize} class="range range-xs" />
		<div class="flex w-full justify-between px-2 text-xs">
			<span>4</span>
			<span>24</span>
		</div>
	</div>
</div>
