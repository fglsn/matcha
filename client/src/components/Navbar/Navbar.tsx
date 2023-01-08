import { Button, AppBar, Toolbar, Box } from '@mui/material';
import { useStateValue } from '../../state';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedUser } from '../../types';
import { AlertContext } from '../AlertProvider';
import { logoutUser } from '../../services/logout';
import { socket } from '../../services/socket';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsButton from './Notifications';
import ChatButton from './Messages';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const LoggedInUserButtons = ({
	loggedUser,
	handleLogout
}: {
	loggedUser: LoggedUser;
	handleLogout: any;
}) => {
	return (
		<Box sx={{ pr: 0 }}>
			<ChatButton />
			<NotificationsButton />
			<IconButton onClick={handleLogout}>
				<MeetingRoomIcon color="primary" />
			</IconButton>
		</Box>
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

const drawerWidth = 200;

const Navbar = ({
	setMobileOpen,
	mobileOpen
}: {
	setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mobileOpen: boolean;
}) => {
	const [, dispatch] = useStateValue();
	const [{ loggedUser }] = useStateValue();
	const navigate = useNavigate();
	const alert = useContext(AlertContext);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

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
				ml: { sm: `${drawerWidth}px` },
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
					justifyContent: 'space-between',
					'& .MuiPaper-root': {
						borderRadius: '0!important'
					}
				}}
			>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, ml: 0.5, display: !loggedUser ? 'none' : { md: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<Box
					component={Link}
					to="/"
					sx={{
						textDecoration: 'none',
						ml: 1,
						display: { xs: 'none', sm: 'none', md: 'flex' },
						alignItems: 'center'
					}}
				>
					<div
						style={{
							fontFamily: "'Paytone One', cursive",
							fontSize: '1.6rem',
							color: '#ffc600',
							textAlign: 'center'
						}}
					>
						Match
					</div>
					<BrightnessAutoIcon style={{ marginTop: '4px' }} color="primary" />
				</Box>
				<div>
					{loggedUser ? (
						<LoggedInUserButtons
							loggedUser={loggedUser}
							handleLogout={handleLogout}
						/>
					) : (
						<LoggedOutButtons />
					)}
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
