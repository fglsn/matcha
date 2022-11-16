import express from 'express';
import asyncHandler from 'express-async-handler';
import { sessionExtractor } from '../utils/middleware';
import { CustomRequest } from '../types';
import { getUserDataByUserId, updateUserDataByUserId } from '../repositories/userRepository';
import { parseUserProfilePayload } from '../validators/userPayloadValidators';

const router = express.Router();

router.get(
	'/',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		let result;
		if (req.session) {
			result = await getUserDataByUserId(req.session.userId);
		}
		res.send(result);
	})
);

router.put(
	'/',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		if (req.session){
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const updatedProfile = parseUserProfilePayload(req.body);
			await updateUserDataByUserId(req.session.userId, updatedProfile);
			res.status(201).json(updatedProfile);
		}
	})
);

export default router;
