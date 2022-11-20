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
		if (!req.session || !req.session.userId || req.session.userId !== req.params.id) {
			throw new AppError(`No rights to get profile data`, 400);
		}
		const result = await getUserDataByUserId(req.session.userId);
		res.status(200).json(result);
		// return;
	})
);

router.put(
	'/:id',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (!req.session || !req.session.userId || req.session.userId !== req.params.id) {
			throw new AppError(`No rights to update profile data`, 400);
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const updatedProfile = parseUserProfilePayload(req.body);
		await updateUserDataByUserId(req.session.userId, updatedProfile);
		//res.status(200).json(updatedProfile);
		res.status(200).end();
		// return;
	})
);

export default router;
