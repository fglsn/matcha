import express from 'express';
import asyncHandler from 'express-async-handler';
import { sessionExtractor } from '../utils/middleware';
import { CustomRequest } from '../types';
import { findSessionBySessionId } from '../repositories/sessionRepository';

const router = express.Router();
router.get( //rm later
	'/',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		let result;
		if (req.sessionId) {
			result = await findSessionBySessionId(req.sessionId);
		}
		res.send(result);
	})
);

export default router;
