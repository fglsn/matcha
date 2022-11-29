import { Coordinates, NewUser, NewUserWithHashedPwd } from '../types';

export const newUser: NewUser = {
	username: 'matcha',
	email: 'matcha@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum'
};
export const secondUser: NewUser = {
	username: 'matcha2',
	email: 'matcha2@test.com',
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
	activationCode: 'qwertyuio21316546',
	lat: 60.1797,
	lon: 24.9344
};

export const defaultCoordinates: Coordinates = {
	lat: 60.16678195339881,
	lon: 24.941711425781254
};

export const ipAddress = '194.136.126.42'; //Hive

export const expectedResponseFromIpLocator = {
	//Hive
	lat: 60.1797,
	lon: 24.9344
};

export const loginUser = { username: 'matcha', password: 'Test!111' };

export const loginUser2 = { username: 'matcha2', password: 'Test!111' };

export const newPass = { password: 'Test!2222' };

export const newEmail = { email: 'tester1.hive@yahoo.com' };

export const infoProfile = {
	username: 'matcha',
	firstname: 'lorem',
	lastname: 'ipsum',
	birthday: new Date('1999-03-22').toISOString(),
	gender: 'male',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland'
};

export const infoProfile2 = {
	username: 'matcha2',
	firstname: 'lorem',
	lastname: 'ipsum',
	birthday: new Date('1999-03-22').toISOString(),
	gender: 'male',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland'
};

export const bioTooLong =
	'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

export const bioMax =
	'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

export const completenessFalse = { complete: false };
export const completenessTrue = { complete: true };
