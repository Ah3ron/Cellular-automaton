import { writable } from 'svelte/store';

export const settings = writable({
	cellSize: 12,
	colors: ['161616', 'be95ff', 'ff7eb6']
});
