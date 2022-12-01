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

export const infoProfilePublic = {
	username: 'matcha',
	firstname: 'lorem',
	lastname: 'ipsum',
	age: 23,
	gender: 'male',
	orientation: 'straight',
	bio: 'born sleepy',
	tags: ['Sauna', 'Swimming', 'Biking', 'BBQ', 'Drummer'],
	distance: 2,
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

export const positionstackResponseDataAllThree = {
	data: [
		{
			latitude: 60.180873,
			longitude: 24.958137,
			type: 'address',
			distance: 0.016,
			name: 'Sörnäs Strandväg 15b',
			number: '15b',
			postal_code: '00530',
			street: 'Sörnäs Strandväg',
			confidence: 0.8,
			region: 'Uusimaa',
			region_code: null,
			county: 'Helsinki',
			locality: 'Helsinki',
			administrative_area: null,
			neighbourhood: 'Vilhonvuori',
			country: 'Finland',
			country_code: 'FIN',
			continent: 'Europe',
			label: 'Sörnäs Strandväg 15b, Helsinki, Finland'
		},
		{
			latitude: 60.180873,
			longitude: 24.958137,
			type: 'address',
			distance: 0.016,
			name: 'Haapaniemenkatu 5b',
			number: '5b',
			postal_code: '00530',
			street: 'Haapaniemenkatu',
			confidence: 0.8,
			region: 'Uusimaa',
			region_code: null,
			county: 'Helsinki',
			locality: 'Helsinki',
			administrative_area: null,
			neighbourhood: 'Vilhonvuori',
			country: 'Finland',
			country_code: 'FIN',
			continent: 'Europe',
			label: 'Haapaniemenkatu 5b, Helsinki, Finland'
		}
	]
};

export const positionstackResponseNoNeighbourhood = {
	data: [
		{
			latitude: 63.367725,
			longitude: 25.574402,
			type: 'address',
			distance: 0.063,
			name: 'Kolimantie 9',
			number: '9',
			postal_code: '44800',
			street: 'Kolimantie',
			confidence: 0.8,
			region: 'Central Finland',
			region_code: null,
			county: 'Saarijarvi-Viitasaari',
			locality: 'Pihtipudas',
			administrative_area: 'Pihtipudas',
			neighbourhood: null,
			country: 'Finland',
			country_code: 'FIN',
			continent: 'Europe',
			label: 'Kolimantie 9, Pihtipudas, Finland'
		},
		{
			latitude: 63.367931,
			longitude: 25.574391,
			type: 'address',
			distance: 0.066,
			name: 'Kolimantie 7',
			number: '7',
			postal_code: '44800',
			street: 'Kolimantie',
			confidence: 0.8,
			region: 'Central Finland',
			region_code: null,
			county: 'Saarijarvi-Viitasaari',
			locality: 'Pihtipudas',
			administrative_area: 'Pihtipudas',
			neighbourhood: null,
			country: 'Finland',
			country_code: 'FIN',
			continent: 'Europe',
			label: 'Kolimantie 7, Pihtipudas, Finland'
		}
	]
};

export const positionstackResponseDataOnlyCountry = {
	data: [
		{
			latitude: 60.324422,
			longitude: 24.575217,
			type: 'venue',
			distance: 0.323,
			name: 'Valkealampi',
			number: null,
			postal_code: null,
			street: null,
			confidence: 0.6,
			region: 'Uusimaa',
			region_code: null,
			county: 'Helsinki',
			locality: null,
			administrative_area: 'Vihti',
			neighbourhood: null,
			country: 'Finland',
			country_code: 'FIN',
			continent: 'Europe',
			label: 'Valkealampi, Vihti, Finland'
		},
		{
			latitude: 60.323799,
			longitude: 24.576445,
			type: 'venue',
			distance: 0.384,
			name: 'Valkealampi Kehrääjänpesä',
			number: null,
			postal_code: null,
			street: null,
			confidence: 0.6,
			region: 'Uusimaa',
			region_code: null,
			county: 'Helsinki',
			locality: null,
			administrative_area: 'Vihti',
			neighbourhood: null,
			country: 'Finland',
			country_code: 'FIN',
			continent: 'Europe',
			label: 'Valkealampi Kehrääjänpesä, Vihti, Finland'
		}
	]
};
