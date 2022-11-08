import { useSearchParams } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

const ForgotPassword = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
	const resetCode = searchParams.get('reset');

	return !resetCode ? <ForgotPasswordForm/> : <ResetPasswordForm/>;
}
export default ForgotPassword;
