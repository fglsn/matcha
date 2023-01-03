import axios from 'axios';

export class AppError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AppError';
	}
}

export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthError';
	}
}

// can be used in services to separate auth errors from everything else
export const handleAxiosError = (err: unknown): never => {
	if (axios.isAxiosError(err)) {
		if (err.response) {
			if (err.response.status === 401) {
				throw new AuthError('Session expired, please login again.');
			}
			if (err.response.data && err.response.data.error) {
				throw new AppError(err.response.data.error);
			}
		}
	}
	throw err;
};
