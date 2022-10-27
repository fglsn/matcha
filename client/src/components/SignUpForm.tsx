import * as React from 'react';
import {
	Avatar,
	Box,
	Button,
	CssBaseline,
	TextField,
	FormControlLabel,
	Checkbox,
	Grid,
	Container,
	Link,
	Typography
} from '@mui/material'

import { useField } from '../hooks';

const SignUpForm = () => {

	const name = useField('text', 'Name')
	const surname = useField('text', 'Surname')
	const username = useField('text', 'Username')
	const email = useField('text', 'Email')
	const password = useField('text', 'Password')

	return (
		<Box>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: '#e3dee1' }} />
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<Box component="form" noValidate sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									{...name}
									required
									fullWidth
									autoFocus
									autoComplete="given-name"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									{...surname}
									required
									fullWidth
									autoFocus
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...username}
									required
									fullWidth
									autoFocus
									autoComplete="username"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...email}
									required
									fullWidth
									autoFocus
									id="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									{...password}
									required
									fullWidth
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={<Checkbox value="allowExtraEmails" color="primary" />}
									label="Sometext if needed."
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="/login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}

export default SignUpForm;