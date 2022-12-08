/* eslint-disable @typescript-eslint/unbound-method */
import { faker } from '@faker-js/faker/locale/fi';
import { updateCompletenessByUserId, updateFameRatingByUserId, updateUserDataByUserId } from './repositories/userRepository';
import { activateAccount, createNewUser, updateUserPhotos } from './services/users';
import { NewUser, Orientation, UpdateUserProfile } from './types';
import { parseImages } from './validators/imgValidators';
import { getLocation } from './services/location';
import { Tags } from './utils/tags';
import { Resvg } from '@resvg/resvg-js';
import * as style from '@dicebear/big-ears';
import { createAvatar } from '@dicebear/avatars';
import dotenv from 'dotenv';

const generateFakeUser = () => {
	const gender = faker.name.sexType();
	const firstname = faker.name.firstName(gender);
	const lastname = faker.name.lastName();
	const username = faker.internet.userName(firstname, lastname);
	const email = faker.helpers.unique(faker.internet.email, [firstname, lastname]);
	const birthday = faker.date.birthdate({ min: 1965, max: 2004, mode: 'year' });
	const orientation: Orientation = faker.helpers.arrayElement(['straight', 'gay', 'bi']);
	const bio = faker.word.adverb() + ' ' + faker.word.adjective() + ' ' + faker.word.noun() + ' ' + faker.word.verb();
	const tags = faker.helpers.arrayElements(Tags, 5);
	const [lat, lon] = faker.address.nearbyGPSCoordinate([60.16678195339881, 24.941711425781254], 100, true);
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

const longHair: style.Options['hair'] = [
	'long20',
	'long19',
	'long18',
	'long17',
	'long16',
	'long15',
	'long14',
	'long13',
	'long12',
	'long11',
	'long10',
	'long09',
	'long08',
	'long07',
	'long06',
	'long05',
	'long04',
	'long03',
	'long02',
	'long01'
];

const mouth: style.Options['mouth'] = [
	'variant0708',
	'variant0707',
	'variant0706',
	'variant0703',
	'variant0702',
	'variant0701',
	'variant0305',
	'variant0304',
	'variant0303',
	'variant0302',
	'variant0301',
	'variant0205',
	'variant0204',
	'variant0203',
	'variant0202',
	'variant0201',
];

const shortHair: style.Options['hair'] = [
	'short18',
	'short17',
	'short16',
	'short15',
	'short14',
	'short13',
	'short12',
	'short11',
	'short10',
	'short09',
	'short08',
	'short07',
	'short06',
	'short05',
	'short04',
	'short03',
	'short02',
	'short01'
];

const createAndPrepareUser = async () => {
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

	const size = 612;
	const hair = fakeUser.gender === 'male' ? faker.helpers.arrayElement(shortHair) : faker.helpers.arrayElement(longHair);
	const avatar = createAvatar(style, { size, hair: [hair], mouth: [faker.helpers.arrayElement(mouth)] });
	const resvg = new Resvg(avatar);
	const png = `data:image/png;base64,${resvg.render().asPng().toString('base64')}`;
	const images = await parseImages({ images: [{ dataURL: png }] });
	await updateUserPhotos(images, createdUser.id);

	await updateUserDataByUserId(createdUser.id, fakeProfileData);

	await updateCompletenessByUserId(createdUser.id, true);
	await updateFameRatingByUserId(createdUser.id, 5);
};

dotenv.config();

void (async () => {
	try {
		for (let i = 0; i < 75; i++) {
			await createAndPrepareUser();
		}
	} catch (e) {
		console.log(e);
	}
})();