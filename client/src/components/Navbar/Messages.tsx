import { Badge } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { NotificationQueue } from '../../types';
import { AlertContext } from '../AlertProvider';
import { socket } from '../../services/socket';
import IconButton from '@mui/material/IconButton';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getNotificationsQueue } from '../../services/notifications';

const NotificationsButton = () => {
	const alert = useContext(AlertContext);

	const {
		data: NotifQueueData,
		error: NotifQueueError
	}: { data: NotificationQueue | undefined; error: Error | undefined } = useServiceCall(
		async () => await getNotificationsQueue(),
		[]
	);
	void NotifQueueError;

	const [initialCount, setInitialCount] = useState<number>(0);

	useEffect(() => {
		if (NotifQueueData) {
			setInitialCount(NotifQueueData.initialCount);
		}
	}, [NotifQueueData]);

	const [counter, setCounter] = useState<number>(0);

	useEffect(() => {
		socket.on('notification', (msg) => {
			setCounter((prev) => prev + 1);
			alert.success(msg);
		});
		return () => {
			socket.off('notification');
		};
	}, [alert]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        
	};

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
					aria-label="Chats button"
					// id="long-button"
					// aria-controls={open ? 'long-menu' : undefined}
					// aria-expanded={open ? 'true' : undefined}
					// aria-haspopup="true"
					onClick={handleClick}
				>
					<NotificationsActiveOutlinedIcon
						fontSize="medium"
						color={NotifQueueData ? 'primary' : 'disabled'}
					/>
				</IconButton>
			</Badge>
		</>
	);
};

export default NotificationsButton;
