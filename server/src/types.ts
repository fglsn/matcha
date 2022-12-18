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
	fameRating: number;
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
	fameRating: number;
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
	fameRating: number;
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

export interface ServerToClientEvents {
	receive_message: (message: ChatMsg) => void;
	// receive_notification: (message: any) => void;
	// online_response: (data: any) => void;
	chat_notification: (chatNotification: MessageNotification) => void;
	notification: (notification_message: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ClientToServerEvents {
	send_message: (match_id: number, message: string) => void;
	// send_notification: (receiver_id: number, notification: {}) => void;
	// set_user: (receiver_id: number) => void;
	active_chat: (match_id: number, callback: ChatCallback) => void;
	clear_notifications: () => void;
	online_query: (user_id: string, callback: ({ online, lastActive }: { online: boolean; lastActive: number }) => void) => void;
	auth: { token: string; user_id: number };
}
export type MatchEntry = {
	matchId: string;
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

export type UserEntry = {
	id: string;
	username: string;
	avatar: string;
};

export type NotificationQueue = {
	initialCount: number;
};

//prettier-ignore
export type NotificationMsg = 
	{
		id: string;
		avatar: string;
		username: string;
		type: "like";
		message: string;
	} | {
		id: string;
		avatar: string;
		username: string;
		type: "dislike";
		message: string;
	} | {
		id: string;
		avatar: string;
		username: string;
		type: "visit";
		message: string;
	} | {
		id: string;
		avatar: string;
		username: string;
		type: "match";
		message: string;
	};

export type Notifications = {
	notifications: NotificationMsg[];
};

export type ChatMsg = { 
	receiver_id: string;
    sender_id: string;
    message_text: string;
    message_time: Date;
};

export type Chat = {
	messages: ChatMsg[];
};

export type ChatCallback = ({messages}: Chat) => void;

export type UserEntryForChat = {
    id: string;
    username: string;
    firstname: string;
    age: number;
    avatar: string;
};

export type ChatHeader = {
    matchId: string;
    matchedUser: UserEntryForChat;
    lastMessage: ChatMsg;
};

export type MessageNotification = {
	matchId: string,
	senderId: string,
	receiverId: string
};