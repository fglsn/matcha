import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CssBaseline } from '@mui/material';

import { reducer, StateProvider } from "./state";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
	<ThemeProvider theme={theme}>
		{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
		<CssBaseline />
		<Router>
			<StateProvider reducer={reducer}>
				<App />
			</StateProvider>
		</Router>
	</ThemeProvider>
);