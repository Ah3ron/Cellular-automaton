<script>
	import { onMount, afterUpdate } from 'svelte';
	import { settings } from '../stores';

	let canvas,
		ctx,
		animationFrame,
		isMounted = false,
		backupGrid;
	let grid = new Uint8Array(),
		nextGrid = new Uint8Array(),
		colors = [];

	const getIndex = (x, y) => y * $settings.cols + x;
	const createGrid = (r, c) => new Uint8Array(r * c).fill(0);

	const resize = () => {
		if (!isMounted || $settings.paused) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		ctx.scale(dpr, dpr);

		$settings.cols = Math.ceil(window.innerWidth / $settings.cellSize);
		$settings.rows = Math.ceil(window.innerHeight / $settings.cellSize);

		grid = createGrid($settings.rows, $settings.cols);
		nextGrid = createGrid($settings.rows, $settings.cols);
		randomizeGrid();
	};

	const randomizeGrid = () => {
		for (let i = 0; i < grid.length; i++)
			grid[i] = Math.floor(Math.random() * $settings.colors.length);
		draw();
	};

	const draw = () => {
		if (!ctx || !grid) return;

		ctx.fillStyle = colors[0];
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (let y = 0; y < $settings.rows; y++) {
			for (let x = 0; x < $settings.cols; x++) {
				const ci = grid[getIndex(x, y)];
				if (ci === 0) continue;
				ctx.fillStyle = colors[ci];
				ctx.fillRect(
					x * $settings.cellSize,
					y * $settings.cellSize,
					$settings.cellSize - 1,
					$settings.cellSize - 1
				);
			}
		}
	};

	const update = () => {
		const { cols, rows } = $settings;
		const cl = $settings.colors.length;

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				let count = 0;
				const current = grid[getIndex(x, y)];

				for (let dy = -1; dy <= 1; dy++) {
					for (let dx = -1; dx <= 1; dx++) {
						if (dx === 0 && dy === 0) continue;
						const ny = (y + dy + rows) % rows;
						const nx = (x + dx + cols) % cols;
						if (grid[getIndex(nx, ny)] === (current + 1) % cl) count++;
					}
				}
				nextGrid[getIndex(x, y)] = count >= 3 ? (current + 1) % cl : current;
			}
		}
		[grid, nextGrid] = [nextGrid, grid];
	};

	const animate = () => {
		if (!isMounted) return;
		if (!$settings.paused) {
			update();
			draw();
		}
		animationFrame = requestAnimationFrame(animate);
	};

	onMount(() => {
		isMounted = true;
		ctx = canvas.getContext('2d', { alpha: false });
		colors = ($settings.colors || ['000000']).map((c) => `#${c}`);
		resize();
		animate();

		const resizeHandler = () => {
			if (!$settings.paused) {
				cancelAnimationFrame(animationFrame);
				resize();
				animate();
			}
		};

		window.addEventListener('resize', resizeHandler);
		return () => {
			window.removeEventListener('resize', resizeHandler);
			cancelAnimationFrame(animationFrame);
			isMounted = false;
		};
	});

	afterUpdate(() => {
		if (isMounted && !$settings.paused) {
			colors = ($settings.colors || ['000000']).map((c) => `#${c}`);
			const newCols = Math.ceil(window.innerWidth / $settings.cellSize);
			const newRows = Math.ceil(window.innerHeight / $settings.cellSize);
			newCols !== $settings.cols || newRows !== $settings.rows ? resize() : draw();
		}
	});

	$: {
		if ($settings.paused) backupGrid = grid?.slice();
		else if (backupGrid) {
			grid = new Uint8Array(backupGrid);
			backupGrid = null;
			draw();
		}
	}
</script>

<canvas bind:this={canvas} class="h-full w-full" style="touch-action: none;"></canvas>
