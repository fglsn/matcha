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

// Error handler for errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(function (err: any, _req: Request, res: Response, _next: NextFunction) {
	if (err instanceof ValidationError) {
		res.status(400).json({
			error: `Validation error: ${err.message}`
		});
		return;
	}
	res.status(500).json({
		error: 'Unexpected error: ' + err
	});
});
