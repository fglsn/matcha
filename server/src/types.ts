export type User = {
	id: number;
	username: string;
	email: string;
	password: string;
	firstname: string;
	lastname: string;
};

export type NewUser = Omit<User, 'id'>;
