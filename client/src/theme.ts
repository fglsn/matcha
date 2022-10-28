import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
	palette: {
		background: {
			default: '#fcfcfc'
		},
		primary: {
			main: '#1976d2'
		},
		secondary: {
			main: '#ffffff'
		},
		error: {
			main: red.A400
		}
	}
});

export const themeLight = createTheme({
	palette: {
		background: {
			default: '#e4f0e2'
		}
	}
});

export const themeDark = createTheme({
	palette: {
		background: {
			default: '#222222'
		},
		text: {
			primary: '#ffffff'
		}
	}
});

export default theme;
