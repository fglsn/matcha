import { io, httpServer } from '../app';
import { io as Client, Socket} from 'socket.io-client';
import { loginAndPrepareUser, socketAuth } from './test_helper_fns';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser } from './test_helper';
import {ServerToClientEvents, ClientToServerEvents } from '../types';
jest.setTimeout(1000);
jest.mock('../services/location');

let userOne: { id: string; token: string };

type AdressInfo = {
  port: string, 
  family: string, 
  address: string
};

const prepareTest = async() => {
    await clearUsers();
	userOne = await loginAndPrepareUser(newUser, loginUser);
};

describe("test socket connection", () => {
  let clientSocket: Socket<ServerToClientEvents, ClientToServerEvents>;

  beforeAll((done) => {
    void prepareTest().then(() => {
      httpServer.listen(() => {
        const port = httpServer.address() as unknown as AdressInfo;
        clientSocket = Client(`http://localhost:${port.port}`, {
          autoConnect: false,
          reconnection: true
        });
        done();
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should return connection error when no auth', () => {
    clientSocket.connect();
    clientSocket.on("connect_error", (err: Error) => {
      expect(err.message).toBe('Error: Access denied, no token provided');
      clientSocket.disconnect();
    });
    clientSocket.on("connect", () => {
      clientSocket.disconnect();
      fail(new Error('This is the error'));
    });
  });

  test('should return connection error with wrong token', () => {
    clientSocket.auth = socketAuth(userOne.id, 'wrongtoken');
    clientSocket.connect();
    
    clientSocket.on("connect_error", (err: Error) => {
      expect(err.message).toBe('Error: No sessions found or expired');
    });
    
    clientSocket.on("connect", () => {
      clientSocket.disconnect();
      fail(new Error('This is the error'));
    });
  });

  test('should connect', () => {
    clientSocket.auth = socketAuth(userOne.id, userOne.token);
    clientSocket.connect();
    
    clientSocket.on("connect_error", (err: Error) => {
      expect(err).toBeFalsy();
      fail(new Error('This is the error'));
    });
    
    clientSocket.on("connect", () => {
      clientSocket.disconnect();
    });
  });

});
