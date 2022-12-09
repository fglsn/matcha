import bcrypt from 'bcrypt';
import crypto from 'crypto';
//prettier-ignore
import { addPasswordResetRequest, findPasswordResetRequestByUserId, removePasswordResetRequest, removePasswordResetRequestByUserId } from '../repositories/passwordResetRequestRepository';
//prettier-ignore
import { addUpdateEmailRequest, findUpdateEmailRequestByUserId, removeUpdateEmailRequest, removeUpdateEmailRequestByUserId } from '../repositories/updateEmailRequestRepository';
//prettier-ignore
import { addNewUser, findUserByActivationCode, setUserAsActive, findUserByEmail, updateUserPassword, updateUserEmail, getPasswordHash, isUserById, getCompletenessByUserId, userHasPhotos, userDataIsNotNULL, updateCompletenessByUserId, getUserDataByUserId, increaseReportCount, updateFameRatingByUserId, getFameRatingByUserId, findUsernameById } from '../repositories/userRepository';
import { getPhotosByUserId, updatePhotoByUserId } from '../repositories/photosRepository';
import { clearSessionsByUserId, updateSessionEmailByUserId } from '../repositories/sessionRepository';
import { addEntryToVisitHistory } from '../repositories/visitHistoryRepository';
import { EmailUpdateRequest, LikeAndMatchStatus, NewUser, PasswordResetRequest, Photo, ProfilePublic, User, UserData } from '../types';
import { requestCoordinatesByIp } from './location';
import { sendMail } from '../utils/mailer';
import { AppError } from '../errors';
import { assertNever, getAge, getDistance } from '../utils/helpers';
import { addLikeEntry, checkLikeEntry, removeLikeEntry } from '../repositories/likesRepository';
import { addMatchEntry, checkMatchEntry, removeMatchEntry } from '../repositories/matchesRepository';
import { addUserOnline, getOnlineUser } from '../repositories/onlineRepository';
import { addBlockEntry, checkBlockEntry, removeBlockEntry } from '../repositories/blockEntriesRepository';
import { addReportEntry } from '../repositories/reportEntriesRepository';
import { getNotificationsByNotifiedUserId, getNotificationsPageByNotifiedUserId } from '../repositories/notificationsRepository';

//create
export const createHashedPassword = async (passwordPlain: string): Promise<string> => {
	const saltRounds = 10;
	return await bcrypt.hash(passwordPlain, saltRounds);
};

export const createNewUser = async (newUser: NewUser, ipAddress: string | undefined): Promise<User> => {
	const passwordHash = await createHashedPassword(newUser.passwordPlain);
	const activationCode = crypto.randomBytes(20).toString('hex');

	const coordinates = await requestCoordinatesByIp(ipAddress);
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
	const updateRequest = await findUpdateEmailRequestByUserId(id);
	if (updateRequest) {
		await removeUpdateEmailRequest(updateRequest.token);
	}

	const newUpdateRequest = await addUpdateEmailRequest(id, email);
	if (!newUpdateRequest) {
		throw new AppError('Error creating reset link, please try again', 400);
	}
	mailEmailUpdateLink(email, newUpdateRequest);
};

export const mailEmailUpdateLink = (email: User['email'], newUpdateRequest: EmailUpdateRequest): void => {
	sendMail(
		email,
		'Confirm email reset for Matcha-account',
		`<h1>Hi, here you can confirm email reset!</h1>
			<p>Visit the link below to reset your email:</p>
			<a href='http://localhost:3000/update_email?update=${newUpdateRequest.token}'>Reset email here</a>
			<p>Link will be active until ${newUpdateRequest.expiresAt}.</p>
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
	const photos = await getPhotosByUserId(userId);
	const photosCount = photos.images ? photos.images.length : 0;
	await updateFameRatingByUserId(userId, (-photosCount + images.length) * 2);
	await updatePhotoByUserId(userId, images);
};

export const getUserPhotosById = async (userId: string) => {
	if (!(await isUserById(userId))) throw new AppError('No user with provided id', 400);
	const userPhotos = await getPhotosByUserId(userId);
	return userPhotos;
};

export const checkCompletnessByUserId = async (userId: string) => {
	if ((await userHasPhotos(userId)) && (await userDataIsNotNULL(userId))) return true;
	return false;
};

export const getAndUpdateUserCompletnessById = async (userId: string) => {
	const completeness = await getCompletenessByUserId(userId);
	if (!completeness) throw new AppError('No user with provided id', 400);
	if (!completeness.complete) {
		completeness.complete = await checkCompletnessByUserId(userId);
		if (completeness.complete) void updateCompletenessByUserId(userId, completeness.complete);
	}

	return completeness;
};

export const getPublicProfileData = async (profileId: string, requestorId: string): Promise<ProfilePublic> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
	const [requestor, profile] = await Promise.all([
		getUserDataByUserId(requestorId) as Promise<UserData>,
		getUserDataByUserId(profileId) as Promise<UserData>
	]);
	const distance = getDistance(requestor.coordinates, profile.coordinates);
	const age = getAge(String(profile.birthday));

	if (profileId !== requestorId) {
		if (await addEntryToVisitHistory(profileId, requestorId)) {
      //add notification
			await updateFameRatingByUserId(profileId, 1);
			profile.fameRating = profile.fameRating + 1;
		}
	}

	const profilePublic = {
		id: profile.id,
		username: profile.username,
		firstname: profile.firstname,
		lastname: profile.lastname,
		age: age,
		gender: profile.gender as string,
		orientation: profile.orientation as string,
		bio: profile.bio as string,
		tags: profile.tags as string[],
		distance: distance,
		location: profile.location,
		fameRating: profile.fameRating
	};
  
	return profilePublic;
};

export const getLikeAndMatchStatusOnVisitedProfile = async (profileId: string, requestorId: string): Promise<LikeAndMatchStatus> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
	return { like: await checkLikeEntry(profileId, requestorId), match: await checkMatchEntry(profileId, requestorId) };
};

export const likeUser = async (profileId: string, requestorId: string): Promise<void> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
  
	if (await addLikeEntry(profileId, requestorId)) {
    await updateFameRatingByUserId(profileId, 2);
    	//add notigication
  }
	if (await checkLikeEntry(requestorId, profileId)) {
		await addMatchEntry(profileId, requestorId);
    //add notification
		if ((await getFameRatingByUserId(requestorId)) >= 75) {
			await updateFameRatingByUserId(profileId, 2);
		} else if ((await getFameRatingByUserId(requestorId)) <= 25) {
			await updateFameRatingByUserId(profileId, -2);
		}

		const updateFameOfVisited = async () => {
			const fameVisitor = await getFameRatingByUserId(requestorId);
			if (fameVisitor >= 75) await updateFameRatingByUserId(profileId, 2);
			if (fameVisitor <= 25) await updateFameRatingByUserId(profileId, -2);
		};

		const updateFameOfVisitor = async () => {
			const fameVisited = await getFameRatingByUserId(profileId);
			if (fameVisited >= 75) await updateFameRatingByUserId(requestorId, 2);
			if (fameVisited <= 25) await updateFameRatingByUserId(requestorId, -2);
		};

		await Promise.all([updateFameOfVisited(), updateFameOfVisitor()]);

		// if ((await getFameRatingByUserId(requestorId)) >= 75) {
		// 	await updateFameRatingByUserId(profileId, 2);
		// } else if ((await getFameRatingByUserId(requestorId)) <= 25) {
		// 	await updateFameRatingByUserId(profileId, -2);
		// }

		// if ((await getFameRatingByUserId(profileId)) >= 75) {
		// 	await updateFameRatingByUserId(requestorId, 2);
		// } else if ((await getFameRatingByUserId(profileId)) <= 25) {
		// 	await updateFameRatingByUserId(requestorId, -2);
		// }
	}
};

export const dislikeUser = async (profileId: string, requestorId: string): Promise<void> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
	if (await removeLikeEntry(profileId, requestorId)) await updateFameRatingByUserId(profileId, -2);
	if (await checkMatchEntry(requestorId, profileId)) {
		await removeMatchEntry(profileId, requestorId);
		//add notification
	}
};

export const getBlockStatus = async (profileId: string, requestorId: string): Promise<{ block: boolean }> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
	return { block: await checkBlockEntry(profileId, requestorId) };
};

export const blockUser = async (profileId: string, requestorId: string): Promise<void> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
	if (await addBlockEntry(profileId, requestorId)) {
		await updateFameRatingByUserId(profileId, -2);
		if (await checkLikeEntry(profileId, requestorId)) await removeLikeEntry(profileId, requestorId);
		if (await checkMatchEntry(requestorId, profileId)) await removeMatchEntry(profileId, requestorId);
	}
};

export const unblockUser = async (profileId: string, requestorId: string): Promise<void> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
	if (await removeBlockEntry(profileId, requestorId)) {
		await updateFameRatingByUserId(profileId, 2);
	}
};

export const reportFakeUser = async (profileId: string, requestorId: string): Promise<void> => {
	const completeness = await Promise.all([getAndUpdateUserCompletnessById(requestorId), getAndUpdateUserCompletnessById(profileId)]);
	if (!completeness[0].complete) throw new AppError('Please, complete your own profile first', 400);
	if (!completeness[1].complete) throw new AppError('Profile you are looking for is not complete. Try again later!', 400);
	if (await addReportEntry(profileId, requestorId)) {
		const reportCount = await increaseReportCount(profileId);
		await blockUser(profileId, requestorId);
		await updateFameRatingByUserId(profileId, -3);
		if (reportCount > 10) {
			await clearSessionsByUserId(profileId);
			await updateFameRatingByUserId(profileId, -100);
		}
	}
};

export const updateOnlineUsers = async (user_id: string) => {
	await addUserOnline(user_id, Date.now());
};

export const queryOnlineUsers = async (user_id: string) => {
	const maxTimeInactive = 1000 * 60 * 2;
	const onlineUser = await getOnlineUser(user_id);
	if (!onlineUser) throw new Error('No record of this user being active');
	if (Date.now() - onlineUser.active < maxTimeInactive) return { online: true, lastActive: onlineUser.active };
	return { online: false, lastActive: onlineUser.active };
};

const generateMessage = async (acting_user_id: string, type: string) => {
	const username = await findUsernameById(acting_user_id);
	if (!username) throw new AppError('Failed to find username!', 500);

	switch (type) {
		case 'like':
			return { type: type, message: `@${username} liked your profile!` };
		case 'dislike':
			return { type: type, message: `@${username} disliked your profile!` };
		case 'visit':
			return { type: type, message: `@${username} visited your profile!` };
		case 'match':
			return { type: type, message: `You matched with @${username}!` };
		default:
			return assertNever(type);
	}
};

export const getNotifications = async (id: string) => {
	const notificatonEtries = await getNotificationsByNotifiedUserId(id);
	if (!notificatonEtries) return undefined;
	const promises = notificatonEtries.map((item) => generateMessage(item.acting_user_id, item.type));
	const notifications = await Promise.all(promises);
	return { notifications: notifications };
};

export const getNotificationsPage = async (id: string, page: string, limit: string) => {
	const notificatonEtries = await getNotificationsPageByNotifiedUserId(id, Number(page), Number(limit));
	if (!notificatonEtries) return undefined;
	const promises = notificatonEtries.map((item) => generateMessage(item.acting_user_id, item.type));
	const notifications = await Promise.all(promises);
	return { notifications: notifications };
};
