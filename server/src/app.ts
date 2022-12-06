/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRouter from './routes/users';
import loginRouter from './routes/login';
import locationRouter from './routes/location';

import testAuthRouter from './routes/testAuth';

import { globalErrorHandler, unknownEndpoint } from './errors';
import { sessionExtractorSocket, sessionIdExtractor } from './utils/middleware';
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketCustom } from './types';

export const app = express();
// app.use(express.json());
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});
io.use(sessionExtractorSocket);

const onlineUsers: IOnlineUser[] = [];

interface IOnlineUser {
	user_id: string;
	active: number;
}

const updateOnlineUsers = (user_id: string) => {
	const i = onlineUsers?.findIndex((item) => item.user_id === user_id);
	if (i > -1) {
		onlineUsers[i] = {
			user_id: user_id,
			active: Date.now(),
		};
	} else {
		onlineUsers.push({
			user_id: user_id,
			active: Date.now(),
		});
	}
};

const queryOnlineUsers = (user_id: string) => {
	// const maxTimeInactive = 1000 * 60 * 10;
	const maxTimeInactive = 1000 * 10;
	const i = onlineUsers?.findIndex((item) => item.user_id === user_id);
	if (i > -1) {
		if (Date.now() - onlineUsers[i].active < maxTimeInactive) return true;
		onlineUsers.splice(i, 1);
	}
	return false;
};

const updateUserActivity = (user_id: string) => {
	const i = onlineUsers?.findIndex((item) => item.user_id === user_id);
	if (i > -1) {	
		onlineUsers[i] = { ...onlineUsers[i], active: Date.now() };
	}
};

io.on('connection', (socket: SocketCustom) => {
	if (!socket.session) return;
	updateOnlineUsers(socket.session.userId);
	void socket.join(socket.session.userId);
	console.log('client connected: ', socket.id);
    socket.on("connect_error", (err: { message: any; }) => {
		console.log(`connect_error due to ${err.message}`);
	});
	// Online query
	socket.on('online_query', (user_id: string, callback: (online: boolean) => void) => {
		const onlineStatus = queryOnlineUsers(user_id);
		callback(onlineStatus);
		console.log(`online_query: ${onlineStatus}`);
		updateUserActivity(socket.id);
	});
	
	socket.on('disconnect', (reason: any) => {
		console.log('client disconnected: ', socket.id, reason);
	});
	
});

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
