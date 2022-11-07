/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../types';
import { findSessionBySessionId } from '../repositories/sessionRepository';

export const sessionIdExtractor = (req: any, _res: any, next: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const authorization: string | undefined = req.get('Authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		const sessionId: string = authorization.substring(7);
		req.sessionId = sessionId;
		console.log(req.sessionId);
	}
	next();
};

export const sessionExtractor = asyncHandler(async (req: CustomRequest, res: any, next: any) => {
	const sessionId = req.sessionId;
	if (!sessionId) {
		res.status(401).json({ error: 'Error: Access denied, no token provided' });
		return; 
	}
	const session = await findSessionBySessionId(sessionId);
	if (!session) {
		res.status(401).json({ error: 'Error: No sessions found or expired' });
		return;
	}
	req.session = session;
	next();
});
