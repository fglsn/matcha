import { httpServer } from './app';

const PORT = 3001;

// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });

// const SOCKET_PORT = 3002;

// io.listen(SOCKET_PORT);

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
