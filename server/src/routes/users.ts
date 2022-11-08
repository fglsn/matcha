import express from 'express';
import asyncHandler from 'express-async-handler';
import { findPasswordResetRequestByToken } from '../repositories/passwordResetRequestRepository';
import { getAllUsers } from '../repositories/userRepository';
import { activateAccount, createNewUser, sendActivationCode, sendResetLink } from '../services/users';
import { parseNewUserPayload, parseEmail, validateToken, validatePassword } from '../validators/userPayloadValidators';

const router = express.Router();

//rm later
router.get(
	'/',
	asyncHandler(async (_req, res) => {
		const result = await getAllUsers();
		console.log(result);
		res.send(result);
	})
);

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
router.get(
	'/activate/:id',
	asyncHandler(async (req, res) => {
		await activateAccount(req.params.id);
		res.status(200).end();
	})
);

//forgot pwd
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
	'/forgot_password/:id',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const token = validateToken(req.params.id);
		await findPasswordResetRequestByToken(token);
		res.status(201).end();
	})
);

// router.post(
// 	'/forgot_password/:id',
// 	asyncHandler(async (req, res) => {
// 		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// 		const token = validateToken(req.params.id);
// 		const password = validatePassword(req.body.password);

// 		// await sendResetLink(email);
// 		// res.status(201).end();
// 	})
// );

export default router;
