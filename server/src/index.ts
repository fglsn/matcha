import express, { NextFunction, Request, Response, } from 'express';
import userRouter from './routes/users';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

import dotenv from 'dotenv';
dotenv.config();

app.get('/ping', (_req, res) => {
	console.log('someone pinged here');
	res.send('pong');
});

app.use('/api/users', userRouter);

app.use(function (_err: unknown, _req: Request, res: Response, _next: NextFunction) {
    res.status(500).json({
        error: 'Unexpected error: ' + _err,
    });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
