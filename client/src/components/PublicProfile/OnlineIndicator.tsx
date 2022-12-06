import { useEffect, useState } from "react";
import { socket } from "../../services/socket";

const divOnlineStyle = {
    color: 'green'
}

export const OnlineIndicator = ({ user_id }: { user_id: string }) => {
	const callback = ({online, lastActive}:{online: boolean, lastActive: number}) => {
		setOnline(online);
		const date = new Date(lastActive);
		setLastActive(date.toLocaleString("en-GB"));
	};
	const [online, setOnline] = useState(false);
	const [lastActive, setLastActive] = useState('Last seen: loading');
	// Query online status and listen for response
	useEffect(() => {
		try {
			socket.emit('online_query', user_id, callback);
		} catch (err) {
			console.log(err);
		}
		const intervalId = setInterval(() => {
			try {
				socket.emit('online_query', user_id, callback);
			} catch (err) {
				console.log(err);
			}
		}, 60000);
		return () => clearInterval(intervalId);
	}, [user_id]);

	return online ? (
		<div className="round-green" style={divOnlineStyle}>Online</div>
	) : (
		<div className="round-gray">{lastActive}</div>
	);
};