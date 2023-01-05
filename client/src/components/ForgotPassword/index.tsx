import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AlertContext } from '../AlertProvider';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import userService from '../../services/users';

const ForgotPassword = () => {
	const [searchParams] = useSearchParams();
	const resetToken = searchParams.get('reset');
	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	useEffect(() => {
		const validateResetToken = async () => {
			if (resetToken) {
				try {
					await userService.checkResetToken(resetToken);
				} catch (err) {
					alert.error('Invalid reset link. Please try again.');
					navigate('/forgot_password');
				}
			}
		};
		validateResetToken();
	}, [alert, navigate, resetToken]);

	return !resetToken ? <ForgotPasswordForm /> : <ResetPasswordForm token={resetToken} />;
};
export default ForgotPassword;
