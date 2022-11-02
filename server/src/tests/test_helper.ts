import { NewUser, NewUserWithHashedPwd } from '../types';

export const newUser: NewUser = {
	username: 'matcha',
	email: 'matcha@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum'
};

export const newUserWithHashedPwd: NewUserWithHashedPwd = {
	username: 'matcha',
	email: 'matcha@test.com',
	passwordHash: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum',
	activationCode: 'qwertyuio21316546'
};

export const loginUser = { username: 'matcha', password: 'Test!111' };

// export const initialUsers: User[] = [
// 	{
// 		id: 0,
// 		username: 'ilona',
// 		email: 'ilona@test.com',
// 		password: '12345',
// 		firstname: 'ilona',
// 		lastname: 'shakurova'
// 	},
// 	{
// 		id: 1,
// 		username: 'test',
// 		email: 'test@test.com',
// 		password: '12345',
// 		firstname: 'nametest',
// 		lastname: 'surnametest'
// 	},
// 	{
// 		id: 2,
// 		username: 'test2',
// 		email: 'test2@test.com',
// 		password: '12345',
// 		firstname: 'nametest2',
// 		lastname: 'surnametest2'
// 	}
// ];
