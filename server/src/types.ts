export type User = {
	id: number,
	username: string,
	email: string,
	password: string,
	firstname: string,
	surname: string,
};

export type NewUser = Omit<User, "id">;