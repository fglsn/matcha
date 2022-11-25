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

export type LoggedUser = { id: string; token: string; username: string };

export type Location = {
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
	coordinates: Location;
	location: string;
};

export type NewUserData = {
	firstname: string | undefined;
	lastname: string | undefined;
	birthday: Dayjs | null;
	gender: string | undefined;
	orientation: string | undefined;
	tags: string[] | undefined;
	bio: string | undefined;
	coordinates: Location;
	location: string;
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

export enum AlertStatus {
	None = 'NONE',
	Success = 'SUCCSESS',
	Error = 'ERROR'
}
