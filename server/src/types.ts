export type BaseUser = {
	username: string;
	email: string;
	firstname: string;
	lastname: string;
};

export type User = BaseUser & { id: string; passwordHash: string; createdAt: Date, activationCode: string };

export type NewUserWithHashedPwd = BaseUser & { passwordHash: string, activationCode: string };

export type LoggedUser = BaseUser & { id: string };

export type NewUser = BaseUser & { passwordPlain: string };
