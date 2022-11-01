import express from 'express';
import asyncHandler from 'express-async-handler';
import { getAllUsers } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
import { parseNewUserPayload } from '../validators/userPayloadValidators';

const router = express.Router();

//temp route
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
		res.status(201).json(createdUser);
	})
);

export default router;
