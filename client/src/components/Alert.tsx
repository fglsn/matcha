import { useContext } from "react";
import { NotificationContext } from "../App";
import Notification from "./Notification";

export const Alert = () => {
	const notification = useContext(NotificationContext);

	if (notification.notification) {
		return <Notification info={notification.notification} error={notification.notification}/>;
	} else {
		return null;
	}
};
