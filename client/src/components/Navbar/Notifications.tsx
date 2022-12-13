import {  Badge, Divider } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { NotificationQueue, Notifications } from '../../types';
import { AlertContext } from '../AlertProvider';
import { socket } from '../../services/socket';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getNotifications, getNotificationsQueue } from '../../services/notifications';
import LoadingIcon from '../LoadingIcon';

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
						<div key={index}>
							<MenuItem onClick={props.handleClose}>
								{option.message}
							</MenuItem>
							<Divider />
						</div>
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
		if (NotifQueueData) {
			setInitialCount(NotifQueueData.initialCount);
		}
	}, [NotifQueueData]);

	const [counter, setCounter] = useState<number>(0);

	useEffect(() => {
		socket.on('notification', (msg) => {
			setCounter(prev => prev + 1);
			alert.success(msg);
		});
		return () => {
			socket.off('notification');
		};
	}, [alert]);

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

export default NotificationsButton;