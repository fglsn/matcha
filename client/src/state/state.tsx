import React, { createContext, useContext, useReducer } from "react";
import { LoggedUser } from "../types";

import { Action } from "./reducer";

let user: LoggedUser | undefined;
const loggedUserJSON = localStorage.getItem('loggedUser')
loggedUserJSON ? user = JSON.parse(loggedUserJSON) : user = undefined;

export type State = {
	loggedUser: LoggedUser | undefined,
};

const initialState: State = {
	loggedUser: user,
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
	initialState,
	() => initialState
]);

type StateProviderProps = {
	reducer: React.Reducer<State, Action>;
	children: React.ReactElement;
};

export const StateProvider = ({
	reducer,
	children
}: StateProviderProps) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<StateContext.Provider value={[state, dispatch]}>
			{children}
		</StateContext.Provider>
	);
};
export const useStateValue = () => useContext(StateContext);
