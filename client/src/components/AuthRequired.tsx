import { useContext } from 'react';
import { Navigate } from 'react-router';
import { StateContext } from '../state';

// type Props = {
// 	children?: React.ReactNode;
// };
// const AuthRequired: React.FC<Props> = ({children}) => {
// 	const [{ loggedUser }] = useContext(StateContext);

// 	if (!loggedUser) {
// 		return <Navigate to="/login"/>
// 	}

// 	return (
// 		<>{children}</>
// 	);
// };

const withAuthRequired =
	<P extends object>(
		Component: React.ComponentType<P>
	): React.FC<P> =>
	(...props) => {
		const [{ loggedUser }] = useContext(StateContext);

		if (!loggedUser) {
			return <Navigate to="/login" />;
		}

		return <Component {...props as P}/>;
	}

export default withAuthRequired
