import express from 'express';
import asyncHandler from 'express-async-handler';
// import { getString } from '../dbUtils';
import { AppError } from '../errors';
import { findEmailResetRequestByToken } from '../repositories/emailResetRequestRepository';
import { findPasswordResetRequestByToken } from '../repositories/passwordResetRequestRepository';
import { getAllUsers } from '../repositories/userRepository';
import {
	activateAccount,
	createNewUser,
	sendActivationCode,
	sendResetLink,
	changeForgottenPassword,
	updatePassword,
	sendUpdateEmailLink,
	changeUserEmail
} from '../services/users';
import { CustomRequest } from '../types';
import { sessionExtractor } from '../utils/middleware';
import { parseNewUserPayload, parseEmail, validateToken, validatePassword, validateEmailToken } from '../validators/userPayloadValidators';

const router = express.Router();

router.get(
	'/',
	asyncHandler(async (_req, res) => {
		const result = await getAllUsers();
		console.log(result);
		res.send(result);
	})
); //rm later

// create user
router.post(
	'/',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newUser = parseNewUserPayload(req.body);
		const createdUser = await createNewUser(newUser);
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

router.put(
	'/update_password',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) {
			throw new AppError(`No rights to update profile data`, 400);
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const oldPassword = validatePassword(req.body.oldPassword);
		const password = validatePassword(req.body.password);
		await updatePassword(req.session.userId, oldPassword, password);
		res.status(200).end();
		return;
	})
);

router.post(
	'/update_email',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId) {
			throw new AppError(`No rights to update profile data`, 400);
		}
		const email = parseEmail(req.body.email);
		await sendUpdateEmailLink(req.session.userId, email);
		// await updateEmailNoRequest(req.session.userId, email);
		res.status(201).end();
		return;
	})
);

router.get(
	'/update_email',
	asyncHandler(() => {
		throw new AppError('Missing activation code', 400);
	})
);

//also need to renew backend session and send it back to front?
router.get(
	'/update_email/:id',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const token = validateEmailToken(req.params.id);
		const emailResetRequsest = await findEmailResetRequestByToken(token);
		if (!emailResetRequsest) {
			throw new AppError('Invalid reset link. Please try again.', 400);
		}
		await changeUserEmail(emailResetRequsest);
		res.status(200).end();
	})
);

// router.get(
// 	'/:id',
// 	asyncHandler(async (req, res) => {
// 		const userId = getString(req.params.id);
// 		const user = await getUserDataByUserId(userId);
// 	})
// )

export default router;
