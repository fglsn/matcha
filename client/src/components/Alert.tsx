import { useContext } from "react";
import { AlertContext } from "./AlertProvider";
import AlertSnackBar from "./AlertSnackBar";

export const Alert = () => {
	const alert = useContext(AlertContext);
	console.log(alert)

	if (alert.alert) {
		return <AlertSnackBar alert={alert.alert} text={alert.alertText}/>;
	} else {
		return null;
	}
};
