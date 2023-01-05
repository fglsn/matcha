import { Action, setLoggedUser } from '../state';

export const logoutUser = (dispatch: React.Dispatch<Action>) => {
	window.localStorage.clear();
	dispatch(setLoggedUser(undefined));
};
