import { User, NewUser } from '../types';

export const initialUsers: User[] = [
	{
		id: 0,
		username: 'ilona',
		email: 'ilona@test.com',
		password: '12345',
		firstname: 'ilona',
		lastname: 'shakurova'
	},
	{
		id: 1,
		username: 'test',
		email: 'test@test.com',
		password: '12345',
		firstname: 'nametest',
		lastname: 'surnametest'
	},
	{
		id: 2,
		username: 'test2',
		email: 'test2@test.com',
		password: '12345',
		firstname: 'nametest2',
		lastname: 'surnametest2'
	}
];

export const newUser: NewUser = {
	username: 'ilona',
	email: 'ilona@test.com',
	password: 'Test!111',
	firstname: 'ilona',
	lastname: 'shakurova'
};
