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

export type LoggedUser = (BaseUser & { id: string }) | undefined;

export enum AlertStatus {
	None = 'NONE',
	Success = 'SUCCSESS',
	Error = 'ERROR'
}
