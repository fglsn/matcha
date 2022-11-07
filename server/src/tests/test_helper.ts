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
