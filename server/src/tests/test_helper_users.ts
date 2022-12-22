import { NewUser } from "../types";
import { defaultCoordinates } from "./test_helper";

export const loginUser1 = { username: 'matcha', password: 'Test!111' };
export const loginUser2 = { username: 'matcha2', password: 'Test!111' };
export const loginUser3 = { username: 'matcha3', password: 'Test!111' };
export const loginUser4 = { username: 'matcha4', password: 'Test!111' };
export const loginUser5 = { username: 'matcha5', password: 'Test!111' };
export const loginUser6 = { username: 'matcha6', password: 'Test!111' };
export const loginUser7 = { username: 'matcha7', password: 'Test!111' };

export const user1: NewUser = {
	username: 'matcha',
	email: 'matcha@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum'
};

export const profileData1 = {
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

export const user2: NewUser = {
	username: 'matcha2',
	email: 'matcha2@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum'
};

export const profileData2 = {
	username: 'matcha2',
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

export const user3: NewUser = {
	username: 'matcha3',
	email: 'matcha3@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const profileData3 = {
	username: 'matcha3',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('2001-03-22').toISOString(),
	gender: 'male',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const user4: NewUser = {
	username: 'matcha4',
	email: 'matcha4@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const profileData4 = {
	username: 'matcha4',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('2001-03-22').toISOString(),
	gender: 'male',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const user5: NewUser = {
	username: 'matcha5',
	email: 'matcha5@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const profileData5 = {
	username: 'matcha5',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('2000-03-22').toISOString(),
	gender: 'female',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const user6: NewUser = {
	username: 'matcha6',
	email: 'matcha6@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const profileData6 = {
	username: 'matcha6',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('1998-03-22').toISOString(),
	gender: 'female',
	orientation: 'gay',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland',
	fameRating: 45
};

export const user7: NewUser = {
	username: 'matcha7',
	email: 'matcha7@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'lorem'
};

export const profileData7 = {
	username: 'matcha7',
	firstname: 'lorem',
	lastname: 'lorem',
	birthday: new Date('1998-03-22').toISOString(),
	gender: 'female',
	orientation: 'bi',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	coordinates: defaultCoordinates,
	location: 'Helsinki, Finland',
	fameRating: 45
};