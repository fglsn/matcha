import express from 'express';
import asyncHandler from 'express-async-handler';
import { AppError, ValidationError } from '../errors';
import { findUpdateEmailRequestByToken } from '../repositories/updateEmailRequestRepository';
import { findPasswordResetRequestByToken } from '../repositories/passwordResetRequestRepository';
//prettier-ignore
import { getAllUsers, getTagsByUserId, getUserDataByUserId, getUserEntries, updateFameRatingByUserId, updateUserDataByUserId } from '../repositories/userRepository';
import { CustomRequest } from '../types';
import { sessionExtractor } from '../utils/middleware';
//prettier-ignore
import { parseNewUserPayload, parseEmail, validateToken, validatePassword, validateEmailToken, parseUserProfilePayload, parseIdList } from '../validators/userPayloadValidators';
//prettier-ignore
import { activateAccount, createNewUser, sendActivationCode, sendResetLink, changeForgottenPassword, updatePassword, sendUpdateEmailLink, changeUserEmail, updateUserPhotos, getUserPhotosById, getAndUpdateUserCompletnessById, getPublicProfileData, likeUser, dislikeUser, getLikeAndMatchStatusOnVisitedProfile, blockUser, unblockUser, getBlockStatus, reportFakeUser, getNotifications, getNotificationsPage } from '../services/users';
import { getLocation } from '../services/location';
import { parseImages } from '../validators/imgValidators';
import { isStringRepresentedInteger } from '../validators/basicTypeValidators';
import { getLikesByVisitedId, getLikesByVisitorId } from '../repositories/likesRepository';
import { getVisitHistoryByVisitedId, getVisitHistoryByVisitorId } from '../repositories/visitHistoryRepository';
import { getMatchesByUserId } from '../repositories/matchesRepository';
import { getBlockedUsersByBlockingUserId } from '../repositories/blockEntriesRepository';

const router = express.Router();

router.get(
	'/',
	asyncHandler(async (_req, res) => {
		const result = await getAllUsers();
		res.send(result);
	})
); //rm later

// create user
router.post(
	'/',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newUser = parseNewUserPayload(req.body);
		const ipAddress = req.socket.remoteAddress;
		const createdUser = await createNewUser(newUser, ipAddress);
		sendActivationCode(createdUser);
		res.status(201).json(createdUser);
	})
);

//activate
router.post(
	'/activate/:id',
	asyncHandler(async (req, res) => {
		await activateAccount(req.params.id);
		res.status(200).end();
	})
);

//forgot pwd request from email form
router.post(
	'/forgot_password',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const email = parseEmail(req.body.email);
		await sendResetLink(email);
		res.status(201).end();
	})
);

router.get(
	'/forgot_password/',
	asyncHandler(() => {
		throw new AppError('Missing activation code', 400);
	})
);

router.get(
	'/forgot_password/:id',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const token = validateToken(req.params.id);
		const passwordResetRequsest = await findPasswordResetRequestByToken(token);
		if (!passwordResetRequsest) {
			throw new AppError('Invalid reset link. Please try again.', 400);
		}
		res.status(200).end();
	})
);

router.post(
	'/forgot_password/:id',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const token = validateToken(req.params.id);
		const passwordResetRequest = await findPasswordResetRequestByToken(token);
		if (!passwordResetRequest) {
			throw new AppError('Reset password code is missing or expired. Please try again.', 400);
		}
		const password = validatePassword(req.body.password);
		await changeForgottenPassword(passwordResetRequest.userId, password);
		res.status(200).end();
	})
);

//get profile page
//check user by
router.get(
	'/:id/profile',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId || req.session.userId !== req.params.id) {
			throw new AppError(`No rights to get profile data`, 400);
		}
		const result = await getUserDataByUserId(req.session.userId);
		res.status(200).json(result);
		// return;
	})
);

//update basic user data on profile page
router.put(
	'/:id/profile',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId || req.session.userId !== req.params.id) {
			throw new AppError(`No rights to update profile data`, 400);
		}
		const userId = req.session.userId;
		const tags = await getTagsByUserId(userId);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const updatedProfile = parseUserProfilePayload(req.body);
		const location = await getLocation(updatedProfile.coordinates);
		if (!tags) {
			await updateFameRatingByUserId(userId, updatedProfile.tags.length);
		} else {
			await updateFameRatingByUserId(userId, -tags.length + updatedProfile.tags.length);
		}
		await updateUserDataByUserId(req.session.userId, { ...updatedProfile, location });
		res.status(200).end();
	})
);

router.get(
	'/:id/public_profile',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can see profiles`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		const result = await getPublicProfileData(req.params.id, req.session.userId);

		res.status(200).json(result);
	})
);

router.get(
	'/:id/like',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Please log in first`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		// if (req.session.userId === req.params.id) throw new AppError(`You cannot like own profile`, 400);
		const result = await getLikeAndMatchStatusOnVisitedProfile(req.params.id, req.session.userId);
		res.status(200).json(result);
	})
);

router.post(
	'/:id/like',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Please log in first`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.session.userId === req.params.id) throw new AppError(`You cannot like own profile`, 400);
		await likeUser(req.params.id, req.session.userId);
		res.status(200).end();
	})
);

router.delete(
	'/:id/like',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Please log in first`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.session.userId === req.params.id) throw new AppError(`You cannot dislike own profile`, 400);
		await dislikeUser(req.params.id, req.session.userId);
		res.status(200).end();
	})
);

router.get(
	'/:id/visit_history',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Please log in first`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.params.id !== req.session.userId) throw new AppError(`You're not authorised to see this page.`, 403);
		const result = await Promise.all([getVisitHistoryByVisitedId(req.session.userId), getVisitHistoryByVisitorId(req.session.userId)]);
		res.status(200).json(result);
	})
);

router.get(
	'/:id/likes',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Please log in first`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.params.id !== req.session.userId) throw new AppError(`You're not authorised to see this page.`, 403);
		const result = await Promise.all([getLikesByVisitedId(req.session.userId), getLikesByVisitorId(req.session.userId)]);
		res.status(200).json(result);
	})
);

router.get(
	'/:id/matches',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Please log in first`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.params.id !== req.session.userId) throw new AppError(`You're not authorised to see this page.`, 403);
		const result = await getMatchesByUserId(req.session.userId);
		res.status(200).json(result);
	})
);

router.get(
	'/:id/blocks',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Please log in first`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.params.id !== req.session.userId) throw new AppError(`You're not authorised to see this page.`, 403);

		const result = await getBlockedUsersByBlockingUserId(req.session.userId);
		res.status(200).json(result);
	})
);

router.post(
	'/entries',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can see profiles`, 400);
		const idList = parseIdList(req.body);
		const result = await getUserEntries(idList);
		res.status(200).json(result);
	})
);

router.get(
	'/:id/block',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can see profiles`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		// if (req.session.userId === req.params.id) throw new AppError(`You cannot block own profile`, 400);
		const result = await getBlockStatus(req.params.id, req.session.userId);
		res.status(200).json(result);
	})
);

router.post(
	'/:id/block',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can see profiles`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.session.userId === req.params.id) throw new AppError(`You cannot block own profile`, 400);
		await blockUser(req.params.id, req.session.userId);
		res.status(200).end();
	})
);

router.delete(
	'/:id/block',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can see profiles`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Id path parameter is requried to find profile`, 400);
		if (req.session.userId === req.params.id) throw new AppError(`You cannot (un)block own profile`, 400);
		await unblockUser(req.params.id, req.session.userId);
		res.status(200).end();
	})
);

router.post(
	'/:id/report',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can see profiles`, 400);
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`ID path parameter is requried to find profile`, 400);
		if (req.session.userId === req.params.id) throw new AppError(`You cannot report own profile`, 400);
		await reportFakeUser(req.params.id, req.session.userId);
		res.status(200).end();
	})
);
router.post(
	'/:id/update_email',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId || req.session.userId !== req.params.id) {
			throw new AppError(`No rights to update profile data`, 400);
		}
		const email = parseEmail(req.body.email);
		await sendUpdateEmailLink(req.session.userId, email);
		res.status(201).end();
	})
);

router.put(
	'/update_email',
	asyncHandler(() => {
		throw new AppError('Missing activation code', 400);
	})
);

//also need to renew backend session and send it back to front?
router.put(
	'/update_email/:token',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const token = validateEmailToken(req.params.token);
		const emailResetRequsest = await findUpdateEmailRequestByToken(token);
		if (!emailResetRequsest) {
			throw new AppError('Invalid reset link. Please try again.', 400);
		}
		await changeUserEmail(emailResetRequsest);
		res.status(200).end();
	})
);

router.put(
	'/:id/password',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId || req.session.userId !== req.params.id) {
			throw new AppError(`No rights to update profile data`, 400);
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const oldPassword = validatePassword(req.body.oldPassword);
		const password = validatePassword(req.body.password);
		await updatePassword(req.session.userId, oldPassword, password);
		res.status(200).end();
	})
);

//rename in photos
router.post(
	'/:id/photos',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId || req.session.userId !== req.params.id) {
			throw new AppError(`No rights to update profile data`, 400);
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const images = await parseImages(req.body);
		await updateUserPhotos(images, req.params.id);
		res.status(200).end();
	})
);

//rename photos
router.get(
	'/:id/photos',
	// sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		// if (!req.session || !req.session.userId) {
		// 	throw new AppError(`No rights to update profile data`, 400);
		// }
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Please, provide correct user id`, 400);
		const userPhotos = await getUserPhotosById(req.params.id);
		res.status(200).json(userPhotos);
	})
);

router.get(
	'/:id/complete',
	// sessionExtractor,
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		if (!req.params.id || !isStringRepresentedInteger(req.params.id)) throw new AppError(`Please, provide correct user id`, 400);
		const completeness = await getAndUpdateUserCompletnessById(req.params.id);
		res.status(200).json(completeness);
	})
);

router.get(
	'/notifications/',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can get notifications`, 400);
		if (!req.query.page && !req.query.limit) {
			const notifications = await getNotifications(req.session.userId);
			res.status(200).json(notifications);
		}
		if (req.query.page && req.query.limit) {
			if (!isStringRepresentedInteger(req.query.page) || !isStringRepresentedInteger(req.query.limit))
				throw new ValidationError(`Limit and offset should be string represented integers`);
			const notifications = await getNotificationsPage(req.session.userId, req.query.page, req.query.limit);
			res.status(200).json(notifications);
		}
		throw new AppError(`This api expects page and limit query params or no params to get all notifications`, 400);
	})
);

// router.get(
// 	'/notifications_page/',
// 	sessionExtractor,
// 	asyncHandler(async (req: CustomRequest, res) => {
// 		if (!req.session || !req.session.userId) throw new AppError(`Only logged in users can get notifications`, 400);
// 		if (!req.query.page || !req.query.limit) throw new ValidationError(`Limit and offset were not provided`);
// 		if (!isStringRepresentedInteger(req.query.page) || !isStringRepresentedInteger(req.query.limit)) throw new ValidationError(`Limit and offset should be string represented integers`);
// 		const notifications = await getNotificationsPage(req.session.userId, req.query.page , req.query.limit);
// 		res.status(200).json(notifications);
// 	})
// );

// router.get(
// 	'/:id',
// 	asyncHandler(async (req, res) => {
// 		const userId = getString(req.params.id);
// 		const user = await getUserDataByUserId(userId);
// 	})
// )

export default router;
