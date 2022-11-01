import express from 'express';
import asyncHandler from 'express-async-handler';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { findUserByUsername } from '../repositories/userRepository';
import { parseUsername, validatePassword } from '../validators/userPayloadValidators';

const router = express.Router();

router.post(
	'/',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { username, password } = req.body;

		const parsedUsername = parseUsername(username);
		const parsedPassword = validatePassword(password);

		const user = await findUserByUsername(parsedUsername);
		if (user === undefined) {
			res.status(400).json({ error: 'User not found' });
		}
		const passwordCorrect = user === undefined
			? false
			: await bcrypt.compare(parsedPassword, user.passwordHash);

		if (!passwordCorrect) {
			res.status(400).json({ error: 'Wrong password' });
		}

		const token = jwt.sign(
			{ username: user?.username, id: user?.id },
			"secret", //change to be secret
			{ expiresIn: 60 * 60 }
		);

		res.status(201).send({ token, username: user?.username, id: user?.id });
	})
);

export default router;