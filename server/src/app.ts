import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/users';
import loginRouter from './routes/login';
import { globalErrorHandler } from './errors';

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
app.use(globalErrorHandler);
