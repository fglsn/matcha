import express from 'express';
import asyncHandler from 'express-async-handler';
import { sessionExtractor } from '../utils/middleware';
import { CustomRequest } from '../types';
import { getLocation } from '../services/location';
import { ValidationError } from '../errors';

const router = express.Router();

router.post(
	'/',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const coordinates = req.body.coordinates;
		if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') throw new ValidationError('Array of coordinates (numbers) is expected!');
		const result = await getLocation({ lat: coordinates[0], lon: coordinates[1] });
		res.status(200).json(result);
	})
);

export default router;
