//prettier-ignore
import { addPasswordResetRequest, findPasswordResetRequestByUserId, removePasswordResetRequest, removePasswordResetRequestByUserId } from '../repositories/passwordResetRequestRepository';
//prettier-ignore
import { addUpdateEmailRequest, findUpdateEmailRequestByUserId, removeUpdateEmailRequest, removeUpdateEmailRequestByUserId } from '../repositories/updateEmailRequestRepository';
//prettier-ignore
import { addNewUser, findUserByActivationCode, setUserAsActive, findUserByEmail, updateUserPassword, updateUserEmail, getPasswordHash, isUserById } from '../repositories/userRepository';
import { updateSessionEmailByUserId } from '../repositories/sessionRepository';
import { EmailUpdateRequest, NewUser, PasswordResetRequest, Photo, User, Location } from '../types';
import { sendMail } from '../utils/mailer';
import { AppError } from '../errors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getPhotosByUserId, updatePhotoByUserId } from '../repositories/photosRepository';
import axios from 'axios';

//create
export const createHashedPassword = async (passwordPlain: string): Promise<string> => {
	const saltRounds = 10;
	return await bcrypt.hash(passwordPlain, saltRounds);
};

export const requestLocationByIp = async (ipAddress: string | undefined): Promise<Location> => {
	const defaultCoordinates: Location = { lat: 60.16678195339881, lon: 24.941711425781254 }; //Hki city center as we are hki startup hehe
	if (!ipAddress) return defaultCoordinates;

	try {
		const response = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=status,message,lat,lon`);

		const payload: unknown = response.data;
		let parsedPayload;
		if (payload && typeof payload === 'object' && 'lat' in payload && 'lon' in payload && 'status' in payload && 'message' in payload) {
			parsedPayload = payload as { lat: number; lon: number; status: string; message: string };
			console.log('parsed payload from IP API: ', parsedPayload); //rm later
		} else {
			return defaultCoordinates;
		}

		if (parsedPayload.status === 'fail') console.log(`Location by ip response: ${parsedPayload.status}, message: ${parsedPayload.message}`); //rm later

		if (parsedPayload.status === 'success') {
			return { lat: parsedPayload.lat, lon: parsedPayload.lon };
		} else {
			console.log(`Unexpected response from IP API (requestLocationByIp) ${ipAddress}, ${response.data}`);
			return defaultCoordinates;
		}
	} catch (err) {
		if (axios.isAxiosError(err)) console.log('Response err: ', err.response?.data); //rm later
		console.log(err); //rm later
		return defaultCoordinates;
	}
};

export const createNewUser = async (newUser: NewUser, ipAddress: string | undefined): Promise<User> => {
	const passwordHash = await createHashedPassword(newUser.passwordPlain);
	const activationCode = crypto.randomBytes(20).toString('hex');

	const coordinates = await requestLocationByIp(ipAddress);
	return addNewUser({ ...newUser, passwordHash, activationCode, lat: coordinates.lat, lon: coordinates.lon });
};

//activate
export const sendActivationCode = (user: User): void => {
	sendMail(
		user.email,
		'Activation code for Matcha-account',
		`<h1>Hi and thanks for signing up!</h1>
			<p>Please visit the link to activate your account here:</p>
			<a href='http://localhost:3000/login?activate=${user.activationCode}'>Link</a>
			<p> See you at Matcha! <3 </p>`
	);
};

export const activateAccount = async (activationCode: string): Promise<void> => {
	const user = await findUserByActivationCode(activationCode);
	if (!user) {
		throw new AppError("Activation code doesn't exist", 400);
	}
	if (user.isActive) {
		throw new AppError('Account already activated', 400);
	}
	if (!user.isActive) {
		await setUserAsActive(activationCode);
	}
};

//reset forgotten password
export const sendResetLink = async (email: string): Promise<void> => {
	const user = await findUserByEmail(email);
	if (!user) {
		throw new AppError("Couldn't find this email address.", 400);
	}

	if (!user.isActive) {
		throw new AppError('Account is not active, please activate account first.', 400);
	}

	const resetRequset = await findPasswordResetRequestByUserId(user.id);
	if (resetRequset) {
		await removePasswordResetRequest(resetRequset.token);
	}

	const newResetRequset = await addPasswordResetRequest(user.id);
	if (!newResetRequset) {
		throw new AppError('Error creating reset link, please try again', 400);
	}
	sendResetPasswordLink(user, newResetRequset);
};

export const sendResetPasswordLink = (user: User, newResetRequset: PasswordResetRequest): void => {
	sendMail(
		user.email,
		'Password reset link for Matcha-account',
		`<h1>Hi, forgot your password? No problem! !</h1>
			<p>Visit the link below to reset your password:</p>
			<a href='http://localhost:3000/forgot_password?reset=${newResetRequset.token}'>Reset password here</a>
			<p>Link will be active until ${newResetRequset.expiresAt}.</p>
			<p>Ignore this message if you haven't requested password reset.</p>

			<p> See you at Matcha! <3 </p>`
	);
};

export const changeForgottenPassword = async (userId: string, passwordPlain: string): Promise<void> => {
	const passwordHash = await createHashedPassword(passwordPlain);
	await updateUserPassword(userId, passwordHash);
	await removePasswordResetRequestByUserId(userId);
};

export const updatePassword = async (userId: string, oldPasswordPlain: string, newPasswordPlain: string): Promise<void> => {
	const oldPwdHash = await getPasswordHash(userId);
	const confirmOldPassword = await bcrypt.compare(oldPasswordPlain, oldPwdHash);
	if (!confirmOldPassword) {
		throw new AppError('Wrong old password, please try again', 400);
	}
	const passwordHash = await createHashedPassword(newPasswordPlain);
	await updateUserPassword(userId, passwordHash);
};

export const sendUpdateEmailLink = async (id: string, email: string): Promise<void> => {
	const userWithThisEmail = await findUserByEmail(email);
	if (userWithThisEmail) {
		if (userWithThisEmail.id === id) {
			throw new AppError('Please provide new email address', 400);
		} else {
			throw new AppError('This email is already taken. Please try another email address.', 400);
		}
	}
	const updateRequset = await findUpdateEmailRequestByUserId(id);
	if (updateRequset) {
		await removeUpdateEmailRequest(updateRequset.token);
	}

	const newUpdateRequset = await addUpdateEmailRequest(id, email);
	if (!newUpdateRequset) {
		throw new AppError('Error creating reset link, please try again', 400);
	}
	mailEmailUpdateLink(email, newUpdateRequset);
};

export const mailEmailUpdateLink = (email: User['email'], newUpdateRequset: EmailUpdateRequest): void => {
	sendMail(
		email,
		'Confirm email reset for Matcha-account',
		`<h1>Hi, here you can confirm email reset!</h1>
			<p>Visit the link below to reset your email:</p>
			<a href='http://localhost:3000/update_email?update=${newUpdateRequset.token}'>Reset email here</a>
			<p>Link will be active until ${newUpdateRequset.expiresAt}.</p>
			<p>Ignore this message if you haven't requested email reset.</p>

			<p> See you at Matcha! <3 </p>`
	);
};

export const changeUserEmail = async (emailResetRequest: EmailUpdateRequest): Promise<void> => {
	await updateUserEmail(emailResetRequest.userId, emailResetRequest.email);
	await removeUpdateEmailRequestByUserId(emailResetRequest.userId);
	await updateSessionEmailByUserId(emailResetRequest.userId, emailResetRequest.email);
};

export const updateUserPhotos = async (images: Photo[], userId: string) => {
	// await dropPhotosByUserId(userId);
	// for (let i = 0; i < images.length; i++) {
	// 	await addPhotoByUserId(userId, images[i]);
	// }
	await updatePhotoByUserId(userId, images);
};

export const getUserPhotosById = async (userId: string) => {
	if (!(await isUserById(userId))) throw new AppError('No user with provided id', 400);
	const userPhotos = await getPhotosByUserId(userId);
	return userPhotos;
};
