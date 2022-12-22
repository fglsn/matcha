import { io, httpServer } from '../app';
import { io as Client, Socket } from 'socket.io-client';
import { updateUserOnline } from '../repositories/onlineRepository';
import { clearUsers } from '../repositories/userRepository';
import { ServerToClientEvents, ClientToServerEvents } from '../types';
import { newUser, credentialsNewUser, profileDataNewUser, secondUser, credentialsSecondUser, profileDataSecondUser } from './test_helper_users';
import { loginAndPrepareUser, socketAuth, withTimeout } from './test_helper_fns';
import { maxTimeInactive } from './test_helper';

jest.setTimeout(3000);
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
	userOne = await loginAndPrepareUser(newUser, credentialsNewUser, profileDataNewUser);
	userTwo = await loginAndPrepareUser(secondUser, credentialsSecondUser, profileDataSecondUser);
	void userTwo;
	void userOne;
};

describe('test socket connection', () => {
	let clientSocket: Socket<ServerToClientEvents, ClientToServerEvents>;

	beforeAll((done) => {
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
					fail(new Error('Something went wrong!!!'));
				});
				clientSocket.on('connect', done);
			});
		});
	});

	afterAll(() => {
		io.close();
		clientSocket.close();
	});

	test('should return online user', (done) => {
		const callback = ({ online, lastActive }: { online: boolean; lastActive: number }) => {
			expect(online).toBe(true);
			expect(Date.now() - lastActive < maxTimeInactive).toBe(true);
			done();
		};
		clientSocket.emit('online_query', userOne.id, callback);
	});

	test('should return offline user', (done) => {
		const testOfflineUser = () => {
			const callback = ({ online, lastActive }: { online: boolean; lastActive: number }) => {
				expect(online).toBe(false);
				expect(Date.now() - lastActive < maxTimeInactive).toBe(false);
				done();
			};
			clientSocket.emit('online_query', userTwo.id, callback);
		};
		void updateUserOnline(userTwo.id, Date.now() - maxTimeInactive).then(testOfflineUser);
	});

	test('should timeout on non-exsitent user', (done) => {
		const callbackSuccess = ({ online, lastActive }: { online: boolean; lastActive: number }): void => {
			void online, lastActive;
			fail(new Error('Should not get here!!!'));
		};

		const callbackTimeout = () => {
			console.log('timeout');
			done();
		};

		clientSocket.emit('online_query', '1111111', withTimeout(callbackSuccess, callbackTimeout, 2000));
	});

	test('should return online user in time', (done) => {
		const callbackSuccess = ({ online, lastActive }: { online: boolean; lastActive: number }) => {
			expect(online).toBe(true);
			expect(Date.now() - lastActive < maxTimeInactive).toBe(true);
			done();
		};

		const callbackTimeout = () => {
			fail(new Error('Should not timeout!!!'));
		};

		clientSocket.emit('online_query', userOne.id, withTimeout(callbackSuccess, callbackTimeout, 2000));
	});
});
