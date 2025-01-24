/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require('daisyui')],

	daisyui: {
		themes: [
			{
				mytheme: {
					// Основные цвета
					primary: '#08bdba', // base07
					'primary-focus': '#069d9a',
					secondary: '#78a9ff', // base09
					'secondary-focus': '#5687ff',
					accent: '#ee5396', // base0A
					'accent-focus': '#d63a7f',

					// Нейтральные цвета
					neutral: '#393939', // base02
					'neutral-focus': '#262626', // base01
					'base-100': '#161616', // base00
					'base-200': '#262626', // base01
					'base-300': '#393939', // base02
					'base-content': '#f2f4f8', // base05

					// Дополнительные цвета
					info: '#42be65', // base0D
					success: '#3ddbd9', // base08
					warning: '#be95ff', // base0E
					error: '#ff7eb6' // base0C
				}
			}
		]
	}
};
