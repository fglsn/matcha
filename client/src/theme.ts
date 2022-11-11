import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
	palette: {
		background: {
			default: '#fcfcfc'
		},
		primary: {
			main: '#EEB902'
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

// --charcoal: #364652ff;
// --dark-jungle-green: #071108ff;
// --black-shadows: #bfb1c1ff;
// --silver-sand: #b5bec6ff;
// --beau-blue: #c7dbe6ff;
