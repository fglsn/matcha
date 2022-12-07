import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/users';
import loginRouter from './routes/login';
import locationRouter from './routes/location';

import testAuthRouter from './routes/testAuth';

import { globalErrorHandler, unknownEndpoint } from './errors';
import { sessionExtractorSocket, sessionIdExtractor } from './utils/middleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { CallbackSucess, SocketCustom } from './types';
import { socketErrorHandler } from './errorsSocket';
import { queryOnlineUsers, updateOnlineUsers } from './services/users';

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST']
	}
});
io.use(sessionExtractorSocket);

io.on(
	'connection',
	socketErrorHandler(async (socket: SocketCustom) => {
		if (!socket.session) return;
		await updateOnlineUsers(socket.session.userId);
		void socket.join(socket.session.userId);
		console.log('client connected: ', socket.id);

		// Online query
		socket.on(
			'online_query',
			socketErrorHandler(async (user_id: string, callback: CallbackSucess) => {
				const onlineStatus = await queryOnlineUsers(user_id);
				callback(onlineStatus);
				console.log(`online_query: ${onlineStatus.online}`);
			})
		);

		socket.on('connect_error', (err: { message: string }) => {
			console.log(`connect_error due to ${err.message}`);
		});

		socket.on('disconnect', (reason: string) => {
			console.log('client disconnected: ', socket.id, reason);
		});
	})
);

app.use(express.json({ limit: '50mb' }));

app.use(cors());

dotenv.config();

app.use(sessionIdExtractor);

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/location', locationRouter);

app.use('/api/testAuth', testAuthRouter);

// Error handler for errors
app.use(globalErrorHandler);

app.use(unknownEndpoint);
