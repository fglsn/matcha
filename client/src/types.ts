import { Dayjs } from "dayjs";

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

export type UserData = BaseUser & {
	id: string;
	birthday: Date | undefined;
	gender: string | undefined;
	orientation: string | undefined;
	bio: string | undefined;
};

export type UserDataWithoutId = BaseUser & {
	birthday: Date | undefined;
	gender: string | undefined;
	orientation: string | undefined;
	bio: string | undefined;
};


export type NewUserDataWithoutId = {
	username: string | undefined;
	email: string | undefined;
	firstname: string | undefined;
	lastname: string | undefined;
	birthday: Dayjs | null;
	gender: string | undefined;
	orientation: string | undefined;
	bio: string | undefined;
};

export type NewUserWithHashedPwd = BaseUser & { passwordHash: string };

export type NewUser = BaseUser & { passwordPlain: string };

export type LoggedUser = { id: string; token: string; username: string };

export enum AlertStatus {
	None = 'NONE',
	Success = 'SUCCSESS',
	Error = 'ERROR'
}

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
	file: File;
}