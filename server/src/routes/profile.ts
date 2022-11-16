import express from 'express';
import asyncHandler from 'express-async-handler';
import { sessionExtractor } from '../utils/middleware';
import { CustomRequest } from '../types';
import { getUserDataByUserId, updateUserDataByUserId } from '../repositories/userRepository';
import { parseUserProfilePayload } from '../validators/userPayloadValidators';
import { AppError } from '../errors';

const router = express.Router();

router.get(
	'/:id',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (req.session) {
			if (req.session.userId === req.params.id && req.session.userId) {
				const result = await getUserDataByUserId(req.session.userId);
				res.status(200).json(result);
			}
			throw new AppError(`No rights to get profile data`, 400);
			// res.status(400).json({ error: `Bad Request: no rights to get profile data with id: ${req.params.id}` });
		}
	})
);

router.put(
	'/:id',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (req.session) {
			if (req.session.userId === req.params.id && req.session.userId) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				const updatedProfile = parseUserProfilePayload(req.body);
				await updateUserDataByUserId(req.session.userId, updatedProfile);
				//res.status(200).json(updatedProfile);
				res.status(200).end();
			}
			throw new AppError(`No rights to update profile data`, 400);
			// res.status(400).json({ error: `No rights to update profile data with id: ${req.params.id}` });
		}
	})
);

export default router;
