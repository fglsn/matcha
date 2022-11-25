import { Request } from 'express';

export type BaseUser = {
	username: string;
	email: string;
	firstname: string;
	lastname: string;
};

export type Location = {
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
	coordinates: Location;
};

export type UpdateUserProfile = {
	firstname: string;
	lastname: string;
	birthday: Date;
	gender: Gender;
	orientation: Orientation;
	bio: string;
	tags: string[];
	coordinates: Location;
};

export type Gender = 'male' | 'female';

export type Orientation = 'straight' | 'gay' | 'bi';

export type User = BaseUser & { id: string; passwordHash: string; createdAt: Date; isActive: boolean; activationCode: string; coordinates: Location };

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
