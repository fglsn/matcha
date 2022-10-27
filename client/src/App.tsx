import React from 'react'

import SignUpForm from './components/SignUpForm';
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";

import {
	Routes,
	Route,
	Link,
	// Navigate,
} from 'react-router-dom'

import {
	Box,
	Button,
	AppBar,
	Toolbar,
	Typography,
} from '@mui/material'

import LoyaltyIcon from '@mui/icons-material/Loyalty';



const App = () => {

	return (
		<Box>
			<AppBar position="static" color="secondary" sx={{ justifyContent: "space-between" }} >
				<Toolbar sx={{ justifyContent: "flex-end" }}>
					<Typography
						color="primary"
						component={Link} to="/"
						sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
					>
						<LoyaltyIcon sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}/>
					</Typography>
					<Button color="inherit" component={Link} to="/login">Login</Button>
					<Button color="inherit" component={Link} to="/signup">Sign Up</Button>
					{/* {user
							? <div>
								<em>{user.name} logged in </em>
								<Button onClick={handleLogout} color="inherit">Logout</Button>
							</div>
							: <Button color="inherit" component={Link} to="/login">
								login
							</Button>
						} */}
				</Toolbar>
			</AppBar>
			<Routes>
				<Route path="/login" element={<LoginForm />} />
				<Route path="/signup" element={<SignUpForm />} />
			</Routes>
			<Footer />
		</Box>
	);
};

export default App;
