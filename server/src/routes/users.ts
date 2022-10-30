import express from 'express';
import asyncHandler from 'express-async-handler';
import { getAllUsers } from '../repositories/userRepository';

const router = express.Router();

router.get(
	'/',
	asyncHandler(async (_req, res) => {
		const result = await getAllUsers();
		console.log(result);
		res.send(result);
	})
);

export default router;
