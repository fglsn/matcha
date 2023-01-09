import { Link } from 'react-router-dom';
import {
	Avatar,
	styled,
	Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import { UserEntry } from '../../types';
import Box from '@mui/material/Box';
import { CallbackSucess, withTimeout } from '../PublicProfile/OnlineIndicator';
import CircleIcon from '@mui/icons-material/Circle';

const StyledLink = styled(Link)`
	color: rgba(0, 0, 0, 0.6);
	text-decoration: none;
`;

const User = ({ user }: { user: UserEntry }) => {
	const callbackSuccess: CallbackSucess = ({ online, lastActive }) => {
		setOnline(online);
	};

	const callbackTimeout = () => {
		setOnline(false);
	};

	const [online, setOnline] = useState(false);

	// Query online status and get response in callback
	useEffect(() => {
		socket.emit(
			'online_query',
			user.id,
			withTimeout(callbackSuccess, callbackTimeout, 2000)
		);
		const intervalId = setInterval(() => {
			socket.emit(
				'online_query',
				user.id,
				withTimeout(callbackSuccess, callbackTimeout, 2000)
			);
		}, 60000);
		return () => clearInterval(intervalId);
	}, [user.id]);

	return (
		<StyledLink to={`/profile/${user.id}`}>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'nowrap',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Avatar alt={`Avatar of user ${user.username}`} src={`${user.avatar}`} />
				<Typography variant="h6" style={{ fontWeight: '400' }}>
					{`${user.firstname}, ${user.age}`}
				</Typography>
				{online ? (
					<CircleIcon sx={{ fontSize: 15, marginLeft: 1 }} color="success" />
				) : (
					''
				)}
			</Box>
		</StyledLink>
	);
};

export default User;