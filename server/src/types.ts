import { Request } from 'express';

export type BaseUser = {
	username: string;
	email: string;
	firstname: string;
	lastname: string;
};

export type User = BaseUser & { id: string; passwordHash: string; createdAt: Date; isActive: boolean; activationCode: string };

export type NewUserWithHashedPwd = BaseUser & { passwordHash: string; activationCode: string };

export type LoggedUser = BaseUser & { id: string };

export type NewUser = BaseUser & { passwordPlain: string };

export type NewSessionUser = {
	userId: string;
	username: string;
	email: string;
};

export type Session = NewSessionUser & { sessionId: string; expiresAt: Date };

export interface CustomRequest extends Request {
	sessionId?: string;
	session?: Session;
}

export type NewPasswordResetRequest = { userId: string };

export type PasswordResetRequest = NewPasswordResetRequest & { token: string; expiresAt: Date };
