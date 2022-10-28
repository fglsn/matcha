import express from 'express';
import userRouter from './routes/users';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

import pool from '../db';
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
	try {
		const res = await pool.query('select 1 + 1');
		console.log(res);
		// await pool.end();
	} catch (error) {
		console.log(error);
	}
};

void connectDb();

app.get('/ping', (_req, res) => {
	console.log('someone pinged here');
	res.send('pong');
});

app.use('/api/users', userRouter);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
