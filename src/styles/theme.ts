'use client'

import { createTheme } from '@mantine/core';

export const theme = createTheme({
	// fontFamily: 'Quicksand',
	// fontFamilyMonospace: 'Disket Mono, Quicksand, monospace',
	headings: {
		// fontFamily: 'Quicksand',
		fontWeight: '600',
	},
	colors: {
		'sky-blue': [
			"#e1f8ff",
			"#cbedff",
			"#9ad7ff",
			"#64c1ff",
			"#3aaefe",
			"#20a2fe",
			"#099cff",
			"#0088e4",
			"#0079cd",
			"#0068b6"
		],

	},
	primaryColor: 'sky-blue',
	defaultRadius: 'sm',
	// loader: 'dots',
})
