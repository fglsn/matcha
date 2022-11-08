import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertContext } from "../AlertProvider";
import userService from '../../services/users';
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

const ForgotPassword = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
	const resetToken = searchParams.get('reset');
	const alert = useContext(AlertContext);
	const navigate = useNavigate();

	useEffect(() => {
		const validateResetToken = async () => {
			if (resetToken) {
				try {
					await userService.checkResetToken(resetToken);
				} catch (err) {
					console.log(err.response.data.error);
					alert.error(err.response.data.error);
					navigate('/forgot_password');
				}
			}
		};
		validateResetToken();
	}, [alert, navigate, resetToken]);

	return !resetToken ? <ForgotPasswordForm/> : <ResetPasswordForm/>;
}
export default ForgotPassword;
