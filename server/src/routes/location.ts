import express from 'express';
import asyncHandler from 'express-async-handler';
import { sessionExtractor } from '../utils/middleware';
import { CustomRequest } from '../types';
import { getLocation } from '../services/location';

const router = express.Router();

router.post(
	'/',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		const coordinates = req.body.coordinates as [number, number];
		const result = await getLocation({ lat: coordinates[0], lon: coordinates[1] });
		res.status(200).json(result);
	})
);

export default router;
