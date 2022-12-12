import { Button, AppBar, Toolbar, Typography, Badge, Divider } from '@mui/material';
import { StateContext, useStateValue } from '../state';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedUser, NotificationQueue, Notifications } from '../types';
import { AlertContext } from './AlertProvider';
import { logoutUser } from '../services/logout';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { socket } from '../services/socket';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useServiceCall } from '../hooks/useServiceCall';
import { getNotifications, getNotificationsQueue } from '../services/notifications';
import LoadingIcon from './LoadingIcon';

const ITEM_HEIGHT = 48;

interface NotificationsListProps {
	open: boolean;
	anchorEl: HTMLElement | null;
	handleClose: () => void;
}
const NotificationsList = ({ ...props }: NotificationsListProps) => {
	const {
		data: NotificationsData,
		error: NotificationsError
	}: { data: Notifications | undefined; error: Error | undefined } = useServiceCall(
		async () => await getNotifications(),
		[]
	);

	// useEffect(() => {
	// 	console.log('uf for data');
	// 	if (NotifQueueData) {
	// 		setInitialCount(NotifQueueData.initialCount);
	// 	};
	// }, []);

	if (NotificationsData) {
		return (
			<Menu
				id="long-menu"
				MenuListProps={{
					'aria-labelledby': 'long-button'
				}}
				anchorEl={props.anchorEl}
				open={props.open}
				onClose={props.handleClose}
				PaperProps={{
					style: {
						maxHeight: ITEM_HEIGHT * 4.5,
						width: '30em'
					}
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{
					NotificationsData.notifications.map((option, index) => (
						<>
							<MenuItem key={index} onClick={props.handleClose}>
								{option.message}
							</MenuItem>
							<Divider />
						</>
					))
				}
			</Menu>
		);
	}

	return (
		<Menu
			id="long-menu"
			MenuListProps={{
				'aria-labelledby': 'long-button'
			}}
			anchorEl={props.anchorEl}
			open={props.open}
			onClose={props.handleClose}
			PaperProps={{
				style: {
					maxHeight: ITEM_HEIGHT * 4.5,
					width: '30em'
				}
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			<MenuItem onClick={props.handleClose}>
				{NotificationsError ? 'Fail loading notifications' : <LoadingIcon />}
			</MenuItem>
		</Menu>
	);
};

// const NotificationsButton = ({id}: {id:string}) => {
const NotificationsButton = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const alert = useContext(AlertContext);

	const {
		data: NotifQueueData,
		error: NotifQueueError
	}: { data: NotificationQueue | undefined; error: Error | undefined } = useServiceCall(
		async () => await getNotificationsQueue(),
		[]
	);

	const [initialCount, setInitialCount] = useState<number>(0);

	useEffect(() => {
		console.log('uf for data');
		if (NotifQueueData) {
			setInitialCount(NotifQueueData.initialCount);
		}
	}, [NotifQueueData]);

	const [counter, setCounter] = useState<number>(0);

	useEffect(() => {
		console.log('uf');
		socket.on('notification', (msg) => {
			alert.success(msg);
			setCounter(counter + 1);
		});
		return () => {
			socket.off('notification');
		};
	}, [alert, counter]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		socket.emit('clear_notifications');
		setCounter(0);
		setInitialCount(0);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	if (NotifQueueError) {
		return <NotificationsActiveOutlinedIcon fontSize="medium" color="disabled" />;
	}

	if (!NotifQueueData) {
		return <LoadingIcon />;
	}

	return (
		<>
			<Badge
				badgeContent={initialCount + counter}
				max={999}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				overlap="circular"
				color="error"
			>
				<IconButton
					aria-label="notifications"
					id="long-button"
					aria-controls={open ? 'long-menu' : undefined}
					aria-expanded={open ? 'true' : undefined}
					aria-haspopup="true"
					onClick={handleClick}
				>
					<NotificationsActiveOutlinedIcon fontSize="medium" color="primary" />
				</IconButton>
			</Badge>
			{
				open && 
				<NotificationsList
				anchorEl={anchorEl}
				open={open}
				handleClose={handleClose}
				/>
			}

		</>
	);
};

const LoggedInUserButtons = ({
	loggedUser,
	handleLogout
}: {
	loggedUser: LoggedUser;
	handleLogout: any;
}) => {
	return (
		<>
			<NotificationsButton />
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

const drawerWidth = 200;

const Navbar = ({
	setMobileOpen,
	mobileOpen
}: {
	setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
	mobileOpen: boolean;
}) => {
	const [, dispatch] = useStateValue();
	const loggedUser = useContext(StateContext);
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
					sx={{ mr: 2, ml: 0.5, display: { sm: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<LoyaltyIcon
					color="primary"
					sx={{
						ml: 1,
						display: { xs: 'none', sm: 'block' }
					}}
				/>
				<div>
					<Typography
						color="primary"
						component={Link}
						to="/"
						sx={{
							flexGrow: 1,
							display: { xs: 'none', sm: 'block' }
						}}
					></Typography>
					{loggedUser[0].loggedUser !== undefined ? (
						<LoggedInUserButtons
							loggedUser={loggedUser[0].loggedUser}
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
