import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
	palette: {
		background: {
			default: '#fcfcfc',
		},
		primary: {
			main: '#EEB902',
			contrastText: '#fff' //button text white instead of black
		},
		secondary: {
			main: '#ffffff',
		},
		error: {
			main: red.A400
		}
	},
	components: {
		MuiButton: {
			defaultProps: {
				disableElevation: true
			}
		},
		MuiTypography: {
			defaultProps: {
				variantMapping: {
					h1: 'h2',
					h2: 'h2',
					h3: 'h2',
					h4: 'h2',
					h5: 'h5',
					h6: 'h2',
					subtitle1: 'h2',
					subtitle2: 'h2',
					body1: 'span',
					body2: 'h5'
				}
			}
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
