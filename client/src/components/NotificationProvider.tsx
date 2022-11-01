import React, { useEffect, useRef, useState } from "react";

type NotificationContextValue = {
	notification: string | undefined;
	setNotification: (notification: string) => void;
};

export const NotificationContext =
	React.createContext<NotificationContextValue>({
		notification: undefined,
		setNotification: (_notificaiton) => { }
	});

const NotificationProvider = ({ children }: any) => {
	const [notification, setNotification] = useState<string | undefined>(
		undefined
	);

	const timerRef = useRef<undefined | number>(undefined);

	useEffect(() => {
		// Clear the interval when the component unmounts
		if (timerRef === undefined)
			return
		else
			return () => window.clearTimeout(timerRef.current);
	}, []);

	return (<NotificationContext.Provider
		value={{
			notification,
			setNotification: (newNotification: string) => {
				setNotification(newNotification);
				timerRef.current = window.setTimeout(() => {
					setNotification(undefined);
				}, 2000);
			}
		}}
	>
		{children}
	</NotificationContext.Provider>
	)
}

export default NotificationProvider;