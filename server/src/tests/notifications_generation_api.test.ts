import { io, httpServer } from '../app';
import { io as Client, Socket } from 'socket.io-client';
import { loginAndPrepareUser, putLike, removeLike, socketAuth, twoUserLikeEachOther, userVisitsAnotherUsersProfile } from './test_helper_fns';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2 } from './test_helper';
import { ServerToClientEvents, ClientToServerEvents } from '../types';
import { clearNotifications, getNotificationsByNotifiedUserId } from '../repositories/notificationsRepository';
import { clearLikes } from '../repositories/likesRepository';
import { clearMatches } from '../repositories/matchesRepository';
import { clearVisitHistory } from '../repositories/visitHistoryRepository';

jest.setTimeout(5000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };
type AdressInfo = {
	port: string;
	family: string;
	address: string;
};

const prepareTest = async () => {
	await clearUsers();
	await clearNotifications();
	await clearLikes();
	await clearMatches();
	await clearVisitHistory();
	userOne = await loginAndPrepareUser(newUser, loginUser);
	userTwo = await loginAndPrepareUser(secondUser, loginUser2);
};

function fail(message = '') {
	let failMessage = '';
	failMessage += '\n';
	failMessage += 'FAIL FUNCTION TRIGGERED\n';
	failMessage += 'The fail function has been triggered';
	failMessage += message ? ' with message:' : '';

	expect(message).toEqual(failMessage);
}

describe('test notification emitters on working connection', () => {
	let clientSocket: Socket<ServerToClientEvents, ClientToServerEvents>;

	beforeEach((done) => {
		void prepareTest().then(() => {
			httpServer.listen(() => {
				const port = httpServer.address() as unknown as AdressInfo;
				clientSocket = Client(`http://localhost:${port.port}`, {
					autoConnect: false,
					reconnection: true,
					auth: socketAuth(userOne.id, userOne.token)
				});
				clientSocket.connect();
				clientSocket.on('connect_error', (err: Error) => {
					console.log(`connect_error due to ${err.message}`);
					io.close();
					clientSocket.close();
					fail('Something went wrong!!!');
				});
				clientSocket.on('connect', done);
			});
		});
	});

	afterEach(() => {
		io.close();
		clientSocket.close();
	});

	test('should return like notification and create like entry', (done) => {
		clientSocket.on('notification', (notification_message) => {
			// console.log(notification_message);
			expect(notification_message).toBe('Someone liked your profile!');
			void getNotificationsByNotifiedUserId(userOne.id).then((notifications) => {
				expect(notifications).toEqual([{ notified_user_id: userOne.id, acting_user_id: userTwo.id, type: 'like' }]);
				done();
			});
		});

		void putLike(userOne, userTwo);
	});
	test('should return visit notification and create visit entry', (done) => {
		clientSocket.on('notification', (notification_message) => {
			// console.log(notification_message);
			expect(notification_message).toBe('Someone visited your profile!');
			void getNotificationsByNotifiedUserId(userOne.id).then((notifications) => {
				expect(notifications).toEqual([{ notified_user_id: userOne.id, acting_user_id: userTwo.id, type: 'visit' }]);
				done();
			});
		});
		void userVisitsAnotherUsersProfile(userOne, userTwo);
	});
	test('should return dislike notification and create dislike entry', (done) => {
		clientSocket.on('notification', (notification_message) => {
			// console.log(notification_message);
			if (notification_message === 'Someone you matched disliked you ;(') {
				expect(notification_message).toBe('Someone you matched disliked you ;(');
				void getNotificationsByNotifiedUserId(userOne.id).then((notifications) => {
					expect(notifications).toEqual(expect.arrayContaining([{ notified_user_id: userOne.id, acting_user_id: userTwo.id, type: 'dislike' }]));
					done();
				});
			}
		});
		void twoUserLikeEachOther(userOne, userTwo).then(() => void removeLike(userOne, userTwo));
	});
	test('should return match notification and create match entry on giving like', (done) => {
		clientSocket.on('notification', (notification_message) => {
			// console.log(notification_message);
			if (notification_message === 'New match is waiting!!!') {
				expect(notification_message).toBe('New match is waiting!!!');
				void getNotificationsByNotifiedUserId(userOne.id).then((notifications) => {
					expect(notifications).toEqual(expect.arrayContaining([{ notified_user_id: userOne.id, acting_user_id: userTwo.id, type: 'match' }]));
					done();
				});
			}
		});
		void twoUserLikeEachOther(userTwo, userOne);
	});

	test('should return match notification and create match entry on receiving like', (done) => {
		clientSocket.on('notification', (notification_message) => {
			// console.log(notification_message);
			if (notification_message === 'New match is waiting!!!') {
				expect(notification_message).toBe('New match is waiting!!!');
				void getNotificationsByNotifiedUserId(userOne.id).then((notifications) => {
					expect(notifications).toEqual(expect.arrayContaining([{ notified_user_id: userOne.id, acting_user_id: userTwo.id, type: 'match' }]));
					done();
				});
			}
		});
		void twoUserLikeEachOther(userOne, userTwo);
	});
});
