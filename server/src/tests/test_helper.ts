import { User, NewUser } from '../types';

const initialUsers: User[] = [
	{
		id: 0,
		username: 'ilona',
		email: 'ilona@test.com',
		password: '12345',
		firstname: 'ilona',
		surname: 'shakurova'
	},
	{
		id: 1,
		username: 'test',
		email: 'test@test.com',
		password: '12345',
		firstname: 'nametest',
		surname: 'surnametest'
	},
	{
		id: 2,
		username: 'test2',
		email: 'test2@test.com',
		password: '12345',
		firstname: 'nametest2',
		surname: 'surnametest2'
	}
];

const newUser: NewUser = {
	username: 'ilona',
	email: 'ilona@test.com',
	password: '12345',
	firstname: 'ilona',
	surname: 'shakurova'
};

module.exports = {
	initialUsers,
	newUser
};
