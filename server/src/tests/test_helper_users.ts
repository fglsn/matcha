import { Coordinates, NewUser } from "../types";
import { defaultCoordinates } from "./test_helper";

export const credentialsNewUser = { username: 'matcha', password: 'Test!111' };
export const credentialsSecondUser = { username: 'matcha2', password: 'Test!111' };
export const credentials3 = { username: 'matcha3', password: 'Test!111' };
export const credentials4 = { username: 'matcha4', password: 'Test!111' };
export const credentials5 = { username: 'matcha5', password: 'Test!111' };
export const credentials6 = { username: 'matcha6', password: 'Test!111' };
export const credentials7 = { username: 'matcha7', password: 'Test!111' };

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

export const newUser: NewUser = {
	username: 'matcha',
	email: 'matcha@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum'
};

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

export const secondUser: NewUser = {
	username: 'matcha2',
	email: 'matcha2@test.com',
	passwordPlain: 'Test!111',
	firstname: 'lorem',
	lastname: 'ipsum'
};

export const profileDataSecondUser = {
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