import { loginAndPrepareUser, api } from './test_helper_fns';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2 } from './test_helper';
import { addNotificationEntry, clearNotifications } from '../repositories/notificationsRepository';
import { NotificationMessage } from '../types';
jest.setTimeout(3000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };

const prepareUsers = async () => {
	await clearUsers();
	userOne = await loginAndPrepareUser(newUser, loginUser);
	userTwo = await loginAndPrepareUser(secondUser, loginUser2);
	void userTwo;
	void userOne;
};

const create100LikeNotifications = async () => {
	const promises = [];
	for (let i = 0; i < 100; i++) {
		const orderPromise = addNotificationEntry(userOne.id, userTwo.id, 'like');
		promises.push(orderPromise);
	}
	await Promise.all(promises);
};
const create100DisLikeNotifications = async () => {
	const promises = [];
	for (let i = 0; i < 100; i++) {
		const orderPromise = addNotificationEntry(userOne.id, userTwo.id, 'dislike');
		promises.push(orderPromise);
	}
	await Promise.all(promises);
};

describe('notifications api tests', () => {
	beforeAll(async () => {
		await clearUsers();
		await clearNotifications();
		await prepareUsers();
	});

	afterEach(async () => {
		await clearNotifications();
	});

	test('should return 100 like notifications', async () => {
		await create100LikeNotifications();
		const res = await api
			.get(`/api/users/notifications`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.notifications).toHaveLength(100);
		(res.body.notifications as NotificationMessage[]).forEach((item: NotificationMessage) => {
			expect(item.message).toBe(`@matcha2 liked your profile!`);
			expect(item.type).toBe(`like`);
		});
	});
	//like notifications: because page2 limit100 includes last 100 and database returns in desc order
	test('should return 100 like notifications with page2 and limit100', async () => {
		await create100LikeNotifications();
		await create100DisLikeNotifications();

		const res = await api
			.get(`/api/users/notifications/?page=2&limit=100`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.notifications).toHaveLength(100);
		(res.body.notifications as NotificationMessage[]).forEach((item: NotificationMessage) => {
			expect(item.message).toBe(`@matcha2 liked your profile!`);
			expect(item.type).toBe(`like`);
		});
	});
	//dislike notifications: because page1 limit100 includes last 100 and database returns in desc order
	test('should return 100 dislike notifications with page2 and limit100', async () => {
		await create100LikeNotifications();
		await create100DisLikeNotifications();

		const res = await api
			.get(`/api/users/notifications/?page=1&limit=100`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.notifications).toHaveLength(100);
		(res.body.notifications as NotificationMessage[]).forEach((item: NotificationMessage) => {
			expect(item.message).toBe(`@matcha2 disliked your profile!`);
			expect(item.type).toBe(`dislike`);
		});
	});

	test('should return falsy body.notifications', async () => {
		await create100LikeNotifications();
		const res = await api
			.get(`/api/users/notifications/?page=2&limit=100`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.notifications).toBeFalsy();
	});

	test('should return error on missing limit', async () => {
		await create100LikeNotifications();
		const res = await api
			.get(`/api/users/notifications/?page=2`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain('This api expects page and limit query params or no params to get all notifications');
	});
	test('should return error on missing page', async () => {
		await create100LikeNotifications();
		const res = await api
			.get(`/api/users/notifications/?limit=2`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain('This api expects page and limit query params or no params to get all notifications');
	});
	test('should return error on wrong query params', async () => {
		await create100LikeNotifications();
		const res = await api
			.get(`/api/users/notifications/?page=2&limit=f`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(res.body.error).toContain('Limit and offset should be string represented integers');
	});

	test('should return 100 notifications', async () => {
		await create100LikeNotifications();
		const res = await api
			.get(`/api/users/notifications/?page=1&limit=105`)
			.set({ Authorization: `bearer ${userOne.token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(res.body.notifications).toHaveLength(100);
		(res.body.notifications as NotificationMessage[]).forEach((item: NotificationMessage) => {
			expect(item.message).toBe(`@matcha2 liked your profile!`);
			expect(item.type).toBe(`like`);
		});
	});
});
