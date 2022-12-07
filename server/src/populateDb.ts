/* eslint-disable @typescript-eslint/unbound-method */
import { updateCompletenessByUserId, updateUserDataByUserId } from './repositories/userRepository';
import { activateAccount, createNewUser, updateUserPhotos } from './services/users';
import { NewUser, Orientation, UpdateUserProfile } from './types';
import { parseImages } from './validators/imgValidators';
import { getLocation } from './services/location';
import { Tags } from './utils/tags';

import { faker } from '@faker-js/faker/locale/fi';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/big-ears';
import { Resvg } from '@resvg/resvg-js';

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

	const size = 612;
	const avatar = createAvatar(style, { size });
	const resvg = new Resvg(avatar);
	const png = `data:image/png;base64,${resvg.render().asPng().toString('base64')}`;
	const images = await parseImages({ images: [{ dataURL: png }] });
	await updateUserPhotos(images, createdUser.id);

	await updateCompletenessByUserId(createdUser.id, true);
};
