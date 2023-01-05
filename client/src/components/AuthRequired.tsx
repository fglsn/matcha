import { useContext } from 'react';
import { Navigate } from 'react-router';
import { StateContext } from '../state';

const withAuthRequired =
	<P extends object>(Component: React.ComponentType<P>): React.FC<P> =>
	(props) => {
		const [{ loggedUser }] = useContext(StateContext);

		if (!loggedUser) {
			return <Navigate to="/login" />;
		}

		return <Component {...(props as P)} />;
	};

//https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
export default withAuthRequired;
