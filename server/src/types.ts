import { Request } from 'express';
import { Socket } from 'socket.io';

export type BaseUser = {
	username: string;
	email: string;
	firstname: string;
	lastname: string;
};

export type Coordinates = {
	lat: number;
	lon: number;
};

export type UserData = {
	//add tags & photos later
	id: string;
	username: string;
	firstname: string;
	lastname: string;
	birthday: Date | undefined;
	gender: string | undefined;
	orientation: string | undefined;
	bio: string | undefined;
	tags: string[] | undefined;
	coordinates: Coordinates;
	location: string;
};

export type ProfilePublic = {
	id: string;
	username: string;
	firstname: string;
	lastname: string;
	age: number;
	gender: string;
	orientation: string;
	bio: string;
	tags: string[];
	distance: number;
	location: string;
};

export type UpdateUserProfile = UpdateUserProfileWithoutLocation & { location: string };

export type UpdateUserProfileWithoutLocation = {
	firstname: string;
	lastname: string;
	birthday: Date;
	gender: Gender;
	orientation: Orientation;
	bio: string;
	tags: string[];
	coordinates: Coordinates;
};

export type Gender = 'male' | 'female';

export type Orientation = 'straight' | 'gay' | 'bi';

export type User = BaseUser & {
	id: string;
	passwordHash: string;
	createdAt: Date;
	isActive: boolean;
	activationCode: string;
	coordinates: Coordinates;
	location: string;
	complete: boolean;
};

export type UserCompletness = { complete: boolean };

export type NewUserWithHashedPwd = BaseUser & { passwordHash: string; activationCode: string; lat: number; lon: number };

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

export type EmailUpdateRequest = { userId: string; email: string; token: string; expiresAt: Date };

export type PasswordResetRequest = NewPasswordResetRequest & { token: string; expiresAt: Date };

export type Photo = {
	imageType: string;
	dataBase64: string;
};

export interface ImageType {
	dataURL: string;
}
export type Images = {
	images: ImageType[] | undefined;
};

export type VisitEntry = {
	visitedUserId: string;
	visitorUserId: string;
};
export type LikeEntry = {
	likedUserId: string;
	likingUserId: string;
};

export type LikeAndMatchStatus = {
	like: boolean;
	match: boolean;
};

export interface SocketCustom extends Socket {
	session?: Session;
}

export type BlockEntry = {
	blockedUserId: string;
	blockingUserId: string;
};
// export interface ServerToClientEvents {
// 	noArg: () => void;
// 	basicEmit: (a: number, b: string, c: Buffer) => void;
// 	withAck: (d: string, callback: (e: number) => void) => void;
// }

// export interface ClientToServerEvents {
// 	hello: () => void;
// }

// export interface InterServerEvents {
// 	ping: () => void;
// }
export type MatchEntry = {
	matchedUserIdOne: string;
	matchedUserIdTwo: string;
};

export type ReportEntry = {
	reportedUserId: string;
	reportingUserId: string;
};
export interface IOnlineUser {
	user_id: string;
	active: number;
}
