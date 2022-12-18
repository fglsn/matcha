import { Badge } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { MessageNotification } from '../../types';
import { AlertContext } from '../AlertProvider';
import { socket } from '../../services/socket';
import IconButton from '@mui/material/IconButton';
import { useServiceCall } from '../../hooks/useServiceCall';
import { getChatNotifications } from '../../services/chats';
import { useStateValue } from '../../state';
import EmailIcon from '@mui/icons-material/Email';

const ChatButton = () => {
	const alert = useContext(AlertContext);

	const {
		data: NotifQueueData,
		error: NotifQueueError
	}: { data: MessageNotification[] | undefined; error: Error | undefined } = useServiceCall(
		async () => await getChatNotifications(),
		[]
	);
	void NotifQueueError;

	const [initialCount, setInitialCount] = useState<number>(0);
    const [{ openChats, msgNotifications }, dispatch] = useStateValue();

	useEffect(() => {
		if (NotifQueueData) {
            console.log(NotifQueueData.length);
			setInitialCount(NotifQueueData.length);
		}
	}, [NotifQueueData]);

	const [counter, setCounter] = useState<number>(0);

	useEffect(() => {
		socket.on('chat_notification', (chatNotification) => {
			console.log(chatNotification);
            // setCounter((prev) => prev + 1);
			// alert.success(msg);
		});
		return () => {
			socket.off('chat_notification');
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
					<EmailIcon
						fontSize="medium"
						color={NotifQueueData ? 'primary' : 'disabled'}
					/>
				</IconButton>
			</Badge>
		</>
	);
};

export default ChatButton;
