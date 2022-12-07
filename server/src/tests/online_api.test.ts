import { io, httpServer } from '../app';
import { io as Client} from 'socket.io-client';
import { loginAndPrepareUser } from './test_helper_fns';
import { clearUsers } from '../repositories/userRepository';
import { newUser, loginUser, secondUser, loginUser2 } from './test_helper';

jest.setTimeout(10000);
jest.mock('../services/location');

let userOne: { id: string; token: string };
let userTwo: { id: string; token: string };

type AdressInfo = {
  port: string, 
  family: string, 
  address: string
}

const prepareTest = async() => {
    await clearUsers();
		userOne = await loginAndPrepareUser(newUser, loginUser);
		userTwo = await loginAndPrepareUser(secondUser, loginUser2);
    void userTwo;
    void userOne;
};

const socketAuthCorrect = () =>{
  return {
    sessionId: userOne.token,
    user_id: userOne.id
  }
};

const socketAuthFalse = () =>{
  return {
    sessionId: 'wrongtoken',
    user_id: userOne.id
  }
};

// function fail(message: string) {
//   throw new Error(message);
// }
describe("test socket connection", () => {
  let serverSocket: any, clientSocket: any;
  void serverSocket;

  beforeAll((done) => {
    prepareTest().then(() => {
      httpServer.listen(() => {
        const port = httpServer.address() as unknown as AdressInfo;
        clientSocket = Client(`http://localhost:${port.port}`, {
          autoConnect: false,
          reconnection: true
        });
        done();
      });
    })
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should return connection error when no auth', async() => {
    clientSocket.connect();
    clientSocket.on("connect_error", (err: any) => {
      expect(err.message).toBe('Error: Access denied, no token provided');
      clientSocket.disconnect();
    });
    clientSocket.on("connect", () => {
      clientSocket.disconnect();
      fail(new Error('This is the error'))
    });
  });

  test('should return connection error with wrong token', async() => {
    clientSocket.auth = socketAuthFalse();
    clientSocket.connect();
    
    clientSocket.on("connect_error", (err: any) => {
      expect(err.message).toBe('Error: No sessions found or expired');
    });
    
    clientSocket.on("connect", () => {
      clientSocket.disconnect();
      fail(new Error('This is the error'))
    });
  });

  test('should connect', async() => {
    clientSocket.auth = socketAuthCorrect();
    clientSocket.connect();
    
    clientSocket.on("connect_error", (err: any) => {
      expect(err).toBeFalsy();
      fail(new Error('This is the error'))
    });
    
    clientSocket.on("connect", () => {
      clientSocket.disconnect();
    });
  });

});

// describe("test socket connection", () => {
//   let serverSocket: any, clientSocket: any;
//   void serverSocket;

//   beforeAll((done) => {
//     prepareTest().then(() => {
//       httpServer.listen(() => {
//         const port = httpServer.address() as unknown as AdressInfo;
//         clientSocket = Client(`http://localhost:${port.port}`, {
//           autoConnect: false,
//           reconnection: true,
//           auth: socketAuthCorrect()
//         });
//         clientSocket.connect();
//         clientSocket.on("connect_error", (err: any) => {
//           console.log(`connect_error due to ${err.message}`);
//           io.close();
//           clientSocket.close();
//           fail(new Error('Something went wrong!!!'));
//         });
//         io.on("connection", (socket) => {
//           serverSocket = socket;
//         });
//         clientSocket.on("connect", done);
//       });
//     })
//   });

//   afterAll(() => {
//     io.close();
//     clientSocket.close();
//   });

//   test('should return connection error when no auth', async() => {
//     clientSocket.connect();
//     clientSocket.on("connect_error", (err: any) => {
//       expect(err.message).toBe('Error: Access denied, no token provided');
//       clientSocket.disconnect();
//     });
//     clientSocket.on("connect", () => {
//       clientSocket.disconnect();
//       fail(new Error('This is the error'))
//     });
//   });

//   test('should return connection error with wrong token', async() => {
//     clientSocket.auth = socketAuthFalse();
//     clientSocket.connect();
    
//     clientSocket.on("connect_error", (err: any) => {
//       expect(err.message).toBe('Error: No sessions found or expired');
//     });
    
//     clientSocket.on("connect", () => {
//       clientSocket.disconnect();
//       fail(new Error('This is the error'))
//     });
//   });

//   test('should connect', async() => {
//     clientSocket.auth = socketAuthCorrect();
//     clientSocket.connect();
    
//     clientSocket.on("connect_error", (err: any) => {
//       expect(err).toBeFalsy();
//       fail(new Error('This is the error'))
//     });
    
//     clientSocket.on("connect", () => {
//       clientSocket.disconnect();
//     });
//   });

// });