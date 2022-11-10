import express from 'express';
import asyncHandler from 'express-async-handler';
import { sessionExtractor } from '../utils/middleware';
import { CustomRequest } from '../types';
import { getUserDataByUserId } from '../repositories/userRepository';

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

export default router;
