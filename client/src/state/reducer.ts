import { LoggedUser } from '../types';
import { State } from './state';

export type Action = {
	type: 'SET_LOGGED_USER';
	payload: LoggedUser | undefined;
};

export const setLoggedUser = (loggedUser: LoggedUser | undefined): Action => {
	return {
		type: 'SET_LOGGED_USER',
		payload: loggedUser
	};
};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'SET_LOGGED_USER':
			if (action.payload)
				return {
					...state,
					loggedUser: action.payload
					// loggedUser: {
					// 	...state.loggedUser,
					// 	[action.payload.id]: action.payload
					// }
				};
			else {
				return { loggedUser: undefined };
			}
		default:
			return state;
	}
};
