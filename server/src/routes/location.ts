import axios from 'axios';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { sessionExtractor } from '../utils/middleware';
import { CustomRequest } from '../types';

const router = express.Router();

router.post(
	'/',
	sessionExtractor,
	asyncHandler(async (req: CustomRequest, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const coordinates = req.body.coordinates;
		let result;
		try {
			const params = {
				access_key: process.env.API_KEY,
				query: `${coordinates[0]}, ${coordinates[1]}`
			};
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			result = await axios.get(`http://api.positionstack.com/v1/reverse`, { params });
		} catch (err) {
			if (axios.isAxiosError(err))
				console.log('Response err: ', err.response?.data);
		}
		res.status(200).json(result?.data?.data[0]);
	})
);

export default router;
