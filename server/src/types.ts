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
	reportsCount: number;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents {
	// receive_message: (message: any) => void;
	// receive_notification: (message: any) => void;
	// online_response: (data: any) => void;
}

export interface ClientToServerEvents {
	// send_message: (match_id: number, payload: {}) => void;
	// send_notification: (receiver_id: number, notification: {}) => void;
	// set_user: (receiver_id: number) => void;
	// active_chat: (match_id: number) => void;
	online_query: (user_id: string, callback: ({ online, lastActive }: { online: boolean; lastActive: number }) => void) => void;
	auth: { token: string; user_id: number };
}
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

export type CallbackSucess = ({ online, lastActive }: { online: boolean; lastActive: number }) => void;
export type CallbackTimeout = () => void;

export type NotificationEntry = {
	notified_user_id: string;
	acting_user_id: string;
	type: string;
};

export type NotificationMessage = {
	type: string;
	message: string;
};

export type NotificationType = 'like' | 'dislike' | 'visit' | 'match';
