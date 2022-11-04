import express from 'express';
import asyncHandler from 'express-async-handler';
import { getAllUsers } from '../repositories/userRepository';
import { activateAccount, createNewUser, sendActivationCode } from '../services/users';
import { parseNewUserPayload } from '../validators/userPayloadValidators';

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

export default router;
