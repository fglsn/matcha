import { defaultCoordinates } from './test_helper';
import { Coordinates, NewUser } from '../types';

export type Credentials = { username: string; password: string };

export type ProfileData = {
	username: string;
	firstname: string;
	lastname: string;
	birthday: string;
	gender: string;
	orientation: string;
	bio: string;
	tags: string[];
	coordinates: Coordinates;
	location: string;
	fameRating: number;
};

//Users to create
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

export const user3: NewUser = {
	username: 'matcha3',
	email: 'matcha3@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const user4: NewUser = {
	username: 'matcha4',
	email: 'matcha4@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const user5: NewUser = {
	username: 'matcha5',
	email: 'matcha5@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const user6: NewUser = {
	username: 'matcha6',
	email: 'matcha6@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const user7: NewUser = {
	username: 'matcha7',
	email: 'matcha7@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const user8: NewUser = {
	username: 'matcha8',
	email: 'matcha8@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const user9: NewUser = {
	username: 'matcha9',
	email: 'matcha9@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const user10: NewUser = {
	username: 'matcha10',
	email: 'matcha10@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

//Profile Data to put to new users
export const profileDataNewUser = {
	username: 'matcha',
	firstname: 'lorem',
	lastname: 'ipsum',
	birthday: new Date('1999-03-22').toISOString(),
	gender: 'male',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const profileDataSecondUser = {
	username: 'matcha2',
	firstname: 'lorem',
	lastname: 'ipsum',
	birthday: new Date('1999-03-22').toISOString(),
	gender: 'male',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland',
	fameRating: 50
};

export const profileData3 = {
	username: 'matcha3',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('2001-03-22').toISOString(),
	gender: 'male',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Swimming', 'Tea', 'Shisha', 'Pets'],
	coordinates: { lat: 59.977005492196, lon: 10.615466564685324 }, //795km
	location: 'Helsinki, Finland',
	fameRating: 70
};

export const profileData4 = {
	username: 'matcha4',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('2001-03-22').toISOString(),
	gender: 'male',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Sauna', 'Drummer', 'Pets', 'Cinema'],
	coordinates: { lat: 60.2154326997618, lon: 24.954802826567956 }, //6km
	location: 'Helsinki, Finland',
	fameRating: 75
};

export const profileData5 = {
	username: 'matcha5',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('2000-03-22').toISOString(),
	gender: 'female',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Swimming', 'Biking', 'Cinema'],
	coordinates: { lat: 60.31062731740045, lon: 25.043457884888564 }, //17km
	location: 'Helsinki, Finland',
	fameRating: 90
};

export const profileData6 = {
	username: 'matcha6',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('1998-03-22').toISOString(),
	gender: 'female',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'BBQ', 'Drummer'],
	coordinates: { lat: 60.973107109199425, lon: 24.45473666958043 }, //94km
	location: 'Helsinki, Finland',
	fameRating: 35
};

export const profileData7 = {
	username: 'matcha7',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('1998-03-22').toISOString(),
	gender: 'female',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Reading', 'Singing', 'Poetry'],
	coordinates: { lat: 60.17874561927682, lon: 24.923508597420668 }, //2km
	location: 'Helsinki, Finland',
	fameRating: 100
};

export const profileData8 = {
	username: 'matcha8',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('2001-03-22').toISOString(),
	gender: 'male',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Sauna', 'Drummer', 'Pets', 'Cinema'],
	coordinates: { lat: 60.2154326997618, lon: 24.954802826567956 }, //6km
	location: 'Helsinki, Finland',
	fameRating: 75
};

export const profileData9 = {
	username: 'matcha',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('1998-03-22').toISOString(),
	gender: 'female',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'BBQ', 'Drummer'],
	coordinates: { lat: 60.973107109199425, lon: 24.45473666958043 }, //94km
	location: 'Helsinki, Finland',
	fameRating: 35
};

export const profileData10 = {
	username: 'matcha10',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('1998-03-22').toISOString(),
	gender: 'female',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Reading', 'Singing', 'Poetry'],
	coordinates: { lat: 60.31062731740045, lon: 25.043457884888564 }, //17km
	location: 'Helsinki, Finland',
	fameRating: 100
};

//Public Profiles
export const publicProfile1 = {
	username: 'matcha',
	firstname: 'lorem',
	lastname: 'ipsum',
	gender: 'male',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	location: 'Helsinki, Finland',
	fameRating: 47
};

export const publicProfile2 = {
	username: 'matcha2',
	firstname: 'lorem',
	lastname: 'ipsum',
	gender: 'male',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	location: 'Helsinki, Finland',
	fameRating: 47
};

export const publicProfile3 = {
	username: 'matcha3',
	firstname: 'lorem',
	lastname: 'lorem',
	age: 21,
	gender: 'male',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Swimming', 'Tea', 'Shisha', 'Pets'],
	distance: 794,
	location: 'Helsinki, Finland',
	fameRating: 46
};

export const publicProfile4 = {
	username: 'matcha4',
	firstname: 'lorem',
	lastname: 'lorem',
	age: 21,
	gender: 'male',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Sauna', 'Drummer', 'Pets', 'Cinema'],
	distance: 6,
	location: 'Helsinki, Finland',
	fameRating: 46
};

export const publicProfile5 = {
	username: 'matcha5',
	firstname: 'lorem',
	lastname: 'lorem',
	gender: 'female',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Swimming', 'Biking', 'Cinema'],
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const publicProfile6 = {
	username: 'matcha6',
	firstname: 'lorem',
	lastname: 'lorem',
	gender: 'female',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'BBQ', 'Drummer'],
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const publicProfile7 = {
	username: 'matcha7',
	firstname: 'lorem',
	lastname: 'lorem',
	gender: 'female',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Reading', 'Singing', 'Poetry'],
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const publicProfile8 = {
	username: 'matcha8',
	firstname: 'lorem',
	lastname: 'lorem',
	gender: 'male',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Sauna', 'Drummer', 'Pets', 'Cinema'],
	location: 'Helsinki, Finland',
	fameRating: 46
};

export const publicProfile9 = {
	username: 'matcha9',
	firstname: 'lorem',
	lastname: 'lorem',
	gender: 'female',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'BBQ', 'Drummer'],
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const publicProfile10 = {
	username: 'matcha10',
	firstname: 'lorem',
	lastname: 'lorem',
	gender: 'female',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Reading', 'Singing', 'Poetry'],
	location: 'Helsinki, Finland',
	fameRating: 45
};
