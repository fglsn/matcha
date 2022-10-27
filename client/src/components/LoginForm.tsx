import { useField } from '../hooks/index'

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

const LoginForm = () => {
	const username = useField('text', 'Username')
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
						Sign in
					</Typography>
					<Box component="form" noValidate sx={{ mt: 1 }}>
						<TextField
							{...username}
							margin="normal"
							required
							fullWidth
							autoFocus
						/>
						<TextField
							{...password}
							margin="normal"
							required
							fullWidth
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</Box>
	)
}

export default LoginForm;