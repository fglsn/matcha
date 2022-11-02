import express from 'express';
import asyncHandler from 'express-async-handler';
import { getAllUsers } from '../repositories/userRepository';
import { createNewUser } from '../services/users';
import { Mailer } from '../utils/mailer';
import { parseNewUserPayload } from '../validators/userPayloadValidators';

const router = express.Router();

//temp route
router.get(
	'/',
	asyncHandler(async (_req, res) => {
		const result = await getAllUsers();
		console.log(result);
		res.send(result);
	})
);

router.post(
	'/',
	asyncHandler(async (req, res) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const newUser = parseNewUserPayload(req.body);
		const createdUser = await createNewUser(newUser);
		Mailer(
			createdUser.email,
			'Activation code for Matcha-account',
			`<h1>Hi and thanks for signing up!</h1>
			<p>Please visit the link to activate your account here:</p>
			<a href='http://localhost:3001/users/activate/${createdUser.id}/${createdUser.activationCode}'>Link</a>
			<p> See you at Matcha! <3 </p>`
		);
		res.status(201).json(createdUser);
	})
);

export default router;
