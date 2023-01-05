import { LoggedUser, MessageNotification } from '../types';
import { State } from './state';
//prettier-ignore
export type Action =
	{
			type: 'SET_LOGGED_USER';
			payload: LoggedUser | undefined;
	  }
	| {
			type: 'SET_OPEN_CHATS';
			payload: string[];
	  }
	| {
			type: 'SET_MSG_NOTIFICATIONS';
			payload: MessageNotification[];
	  };

export const setLoggedUser = (loggedUser: LoggedUser | undefined): Action => {
	return {
		type: 'SET_LOGGED_USER',
		payload: loggedUser
	};
};

export const setOpenChats = (openChats: string[]): Action => {
	return {
		type: 'SET_OPEN_CHATS',
		payload: openChats
	};
};
export const setMsgNotifications = (msgNotifications: MessageNotification[]): Action => {
	return {
		type: 'SET_MSG_NOTIFICATIONS',
		payload: msgNotifications
	};
};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'SET_LOGGED_USER':
			if (action.payload)
				return {
					...state,
					loggedUser: action.payload
				};
			else {
				return { ...state, loggedUser: undefined };
			}
		case 'SET_OPEN_CHATS':
			return {
				...state,
				openChats: action.payload
			};
		case 'SET_MSG_NOTIFICATIONS':
			return {
				...state,
				msgNotifications: action.payload
			};
		default:
			return state;
	}
};
