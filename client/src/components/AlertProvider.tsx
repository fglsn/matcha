import React, { useEffect, useRef, useState } from "react";
import { AlertStatus } from "../types";

type AlertContextValue = {
	alert: AlertStatus;
	alertText: string | undefined;
	success: (text: string) => void;
	error: (text: string) => void;
};

export const AlertContext =
	React.createContext<AlertContextValue>({
		alert: AlertStatus.None,
		alertText: undefined,
		success: () => { },
		error: () => { }
	});

const AlertProvider = ({ children }: any) => {

	const [alert, setAlert] = useState(AlertStatus.None)
	const [alertText, setAlertText] = useState<string | undefined>(undefined);

	const timerRef = useRef<undefined | number>(undefined);

	useEffect(() => {
		// Clear the interval when the component unmounts
		if (timerRef === undefined)
			return;
		else
			return () => window.clearTimeout(timerRef.current);
	}, []);

	const runAlert = () => {
		timerRef.current = window.setTimeout(() => {
			setAlertText(undefined);
			setAlert(AlertStatus.None);
		}, 2000);
	}

	return (
		<AlertContext.Provider
			value={{
				alert,
				alertText,
				success: (text: string) => {
					setAlertText(text);
					setAlert(AlertStatus.Success);
					runAlert();
				},
				error: (text: string) => {
					setAlertText(text);
					setAlert(AlertStatus.Error);
					runAlert();
				}
			}}
		>
			{children}
		</AlertContext.Provider>
	)
}

export default AlertProvider;