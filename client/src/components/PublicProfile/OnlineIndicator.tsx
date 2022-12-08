import { useEffect, useState } from "react";
import { socket } from "../../services/socket";

const divOnlineStyle = {
    color: 'green'
}

type CallbackSucess = ({ online, lastActive }: { online: boolean; lastActive: number; }) => void;
type CallbackTimeout = () => void;


export const withTimeout = (onSuccess: CallbackSucess, onTimeout: CallbackTimeout, timeout:number) => {
	let called = false;
  
	const timer = setTimeout(() => {
		if (called) return;
		called = true;
		onTimeout();
	}, timeout);
  
	return (...args: [{ online: boolean; lastActive: number; }]) => {
		if (called) return;
		called = true;
		clearTimeout(timer);
		onSuccess.apply(this, args);
	};
};

export const OnlineIndicator = ({ user_id }: { user_id: string }) => {
	
    const callbackSuccess: CallbackSucess = ({online, lastActive}) => {
		setOnline(online);
		const date = new Date(lastActive);
		setLastActive(date.toLocaleString("en-GB"));
	};

    const callbackTimeout = () => {
		setOnline(false);
		setLastActive('Never been active');
	};

	const [online, setOnline] = useState(false);
	const [lastActive, setLastActive] = useState('Last seen: loading');
	// Query online status and get response in callback
	useEffect(() => {
		socket.emit('online_query', user_id, withTimeout(callbackSuccess, callbackTimeout, 2000));
		const intervalId = setInterval(() => {
			socket.emit('online_query', user_id, withTimeout(callbackSuccess, callbackTimeout, 2000));
		}, 60000);
		return () => clearInterval(intervalId);
	}, [user_id]);

	return online ? (
		<div className="round-green" style={divOnlineStyle}>Online</div>
	) : (
		<div className="round-gray">{lastActive}</div>
	);
};