import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { StateContext, useStateValue } from '../state';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedUser } from '../types';
import { AlertContext } from './AlertProvider';
import { logoutUser } from '../services/logout';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { socket } from '../services/socket';

const LoggedInUserButtons = ({
	loggedUser,
	handleLogout
}: {
	loggedUser: LoggedUser;
	handleLogout: any;
}) => {
	return (
		<>
			<em>{loggedUser?.username} logged in </em>
			{/* <Button color="inherit" component={Link} to="/profile">
				Profile
			</Button> */}
			<Button onClick={handleLogout} color="inherit">
				Logout
			</Button>
		</>
	);
};

const LoggedOutButtons = () => {
	return (
		<>
			<Button color="inherit" component={Link} to="/login">
				Login
			</Button>
			<Button color="inherit" component={Link} to="/signup">
				Sign Up
			</Button>
		</>
	);
};

const Navbar = () => {
	const [, dispatch] = useStateValue();
	const loggedUser = useContext(StateContext);
	const navigate = useNavigate();
	const alert = useContext(AlertContext);

	const handleLogout = async (event: any) => {
		event.preventDefault();
		logoutUser(dispatch);
		if (socket.connected) {
			socket.disconnect();
		} 
		alert.success('Logged out');
		navigate('/');
	};

	return (
		<AppBar
			position="fixed"
			color="secondary"
			sx={{
				mb: 5,
				zIndex: (theme) => theme.zIndex.drawer + 1,
				justifyContent: 'space-between',
				'& .MuiAppBar-root': {
					borderRadius: '0!important'
				}
			}}
		>
			<Toolbar
				sx={{
					justifyContent: 'flex-end',
					'& .MuiPaper-root': {
						borderRadius: '0!important'
					}
				}}
			>
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
				{loggedUser[0].loggedUser !== undefined ? (
					<LoggedInUserButtons
						loggedUser={loggedUser[0].loggedUser}
						handleLogout={handleLogout}
					/>
				) : (
					<LoggedOutButtons />
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
