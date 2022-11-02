import { setLoggedUser, StateContext } from "../state";
import { useContext } from "react";

import { Link } from "react-router-dom";
import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { AlertContext } from "./AlertProvider";

const Navbar = () => {
	const loggedUser = useContext(StateContext);
	const alert = useContext(AlertContext);

	const handleLogout = async (event: any) => {
		event.preventDefault()
		window.localStorage.clear()
		dispatch(setLoggedUser(undefined))
		alert.success('Logged out');
	}

	return (<AppBar
		position="static"
		color="secondary"
		sx={{ justifyContent: 'space-between' }}
	>
		<Toolbar sx={{ justifyContent: 'flex-end' }}>
			<Typography
				color="primary"
				component={Link}
				to="/"
				sx={{
					flexGrow: 1,
					display: { xs: 'none', sm: 'block' }
				}}
			>
				<LoyaltyIcon
					sx={{
						flexGrow: 1,
						display: { xs: 'none', sm: 'block' }
					}}
				/>
			</Typography>
			{loggedUser[0].loggedUser !== undefined
				? <>
					<em>{loggedUser[0].loggedUser?.username} logged in </em>
					<Button onClick={handleLogout} color="inherit">Logout</Button>
				</>
				: <>
					<Button color="inherit" component={Link} to="/login">
						Login
					</Button>
					<Button color="inherit" component={Link} to="/signup">
						Sign Up
					</Button></>
			}
		</Toolbar>
	</AppBar>);
};

export default Navbar;

function dispatch(arg0: { type: "SET_LOGGED_USER"; payload: import("../types").LoggedUser; }) {
	throw new Error("Function not implemented.");
}
