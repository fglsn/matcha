import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/users';
import loginRouter from './routes/login';

import { ValidationError } from './validators/userPayloadValidators';

export const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

app.get('/ping', (_req, res) => {
	console.log('someone pinged here');
	res.send('pong');
});

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

// Error handler for unexpected async errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(function (_err: any, _req: Request, res: Response, _next: NextFunction) {
	if (_err instanceof ValidationError) {
		res.status(400).json({
			error: `Validation error: ${_err.message}`
		});
		return;
	} //move to service
	if (_err.message === 'duplicate key value violates unique constraint "users_username_key"') {
		res.status(400).json({
			error: 'Username already exists'
		});
		return;
	}
	if (_err.message === 'duplicate key value violates unique constraint "users_email_key"') {
		res.status(400).json({
			error: 'This email was already used'
		});
		return;
	}
	res.status(500).json({
		error: 'Unexpected error: ' + _err
	});
});
