import { Dayjs } from 'dayjs';

export type BaseUser = {
	username: string;
	email: string;
	firstname: string;
	lastname: string;
};

export type User = BaseUser & {
	id: string;
	passwordHash: string;
	created_at: Date;
};

export type NewUserWithHashedPwd = BaseUser & { passwordHash: string };

export type NewUser = BaseUser & { passwordPlain: string };

export type LoggedUser = {
	id: string;
	token: string;
	username: string;
	complete: boolean;
};

export type UserCompletness = { complete: boolean };

export type Coordinates = {
	lat: number;
	lon: number;
};

export type UserData = {
	username: string;
	firstname: string;
	lastname: string;
	birthday: Date | undefined;
	gender: string | undefined;
	orientation: string | undefined;
	tags: string[] | undefined;
	bio: string | undefined;
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

export type NewUserData = {
	firstname: string | undefined;
	lastname: string | undefined;
	birthday: Dayjs | null;
	gender: string | undefined;
	orientation: string | undefined;
	tags: string[] | undefined;
	bio: string | undefined;
	coordinates: Coordinates;
};

export enum Gender {
	MALE = 'male',
	FEMALE = 'female'
}

export enum Orientation {
	STRAIGHT = 'straight',
	GAY = 'gay',
	BI = 'bi'
}

export interface ImageType {
	dataURL: string;
}

export type Images = {
	images: ImageType[];
};

export type LikeAndMatchStatus = {
	like: boolean;
	match: boolean;
	matchId: string | undefined;
};

export enum AlertStatus {
	None = 'NONE',
	Success = 'SUCCSESS',
	Error = 'ERROR'
}

export type UserEntry = {
	id: string;
	username: string;
	avatar: string;
};

export type VisitEntry = {
	visitedUserId: string;
	visitorUserId: string;
};

export type LikeEntry = {
	likedUserId: string;
	likingUserId: string;
};

export type MatchEntry = {
	matchId: string;
	matchedUserIdOne: string;
	matchedUserIdTwo: string;
};

export type BlockEntry = {
	blockedUserId: string;
	blockingUserId: string;
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
	message_id: string;
	receiver_id: string;
	sender_id: string;
	message_text: string;
	message_time: Date;
};

export type Chat = {
	messages: ChatMsg[];
};

export type ChatCallback = ({ messages }: Chat) => void;

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
	matchId: string;
	senderId: string;
	receiverId: string;
};
