/* eslint-disable @typescript-eslint/unbound-method */
import { updateCompletenessByUserId, updateUserDataByUserId } from './repositories/userRepository';
import { activateAccount, createNewUser } from './services/users';
import { NewUser, Orientation, UpdateUserProfile } from './types';
import { getLocation } from './services/location';
import { Tags } from './utils/tags';

import { faker } from '@faker-js/faker/locale/fi';

const generateFakeUser = () => {
	const gender = faker.name.sexType();
	const firstname = faker.name.firstName(gender);
	const lastname = faker.name.lastName();
	const username = faker.internet.userName(firstname, lastname);
	const email = faker.helpers.unique(faker.internet.email, [firstname, lastname]);
	const birthday = faker.date.birthdate({ min: 1965, max: 2004, mode: 'year' });
	const orientation: Orientation = faker.helpers.arrayElement(['straight', 'gay', 'bi']);
	const bio = faker.word.adverb() + ' ' + faker.word.adjective() + ' ' + faker.word.noun() + ' ' + faker.word.verb();
	const tags = faker.helpers.arrayElements(Tags, 4);
	const [lat, lon] = faker.address.nearbyGPSCoordinate([60.16678195339881, 24.941711425781254], 50, true);
	const latitude = Number(lat);
	const longtitude = Number(lon);

	return {
		username,
		email,
		firstname,
		lastname,
		birthday,
		gender,
		orientation,
		bio,
		tags,
		latitude,
		longtitude
	};
};

export const createAndPrepareUser = async () => {
	const fakeUser = generateFakeUser();

	const fakeNewUser: NewUser = {
		username: fakeUser.username,
		firstname: fakeUser.firstname,
		lastname: fakeUser.lastname,
		email: fakeUser.email,
		passwordPlain: 'Test!111'
	};

	const fakeIpAddress: string = faker.internet.ipv6();

	const createdUser = await createNewUser(fakeNewUser, fakeIpAddress);

	await activateAccount(createdUser.activationCode);

	const location = await getLocation({ lat: fakeUser.latitude, lon: fakeUser.longtitude });

	const fakeProfileData: UpdateUserProfile = {
		firstname: fakeUser.firstname,
		lastname: fakeUser.lastname,
		birthday: fakeUser.birthday,
		gender: fakeUser.gender,
		orientation: fakeUser.orientation,
		bio: fakeUser.bio,
		tags: fakeUser.tags,
		coordinates: { lat: fakeUser.latitude, lon: fakeUser.longtitude },
		location
	};

	await updateUserDataByUserId(createdUser.id, fakeProfileData);


	await updateCompletenessByUserId(createdUser.id, true);
};
