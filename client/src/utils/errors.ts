import axios from 'axios';
import { NavigateFunction } from 'react-router';

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
		}
	}
	throw err;
};

// can be used in components or in some custom hooks that handle service calls for components
export const handleServiceError = (err: unknown, navigate: NavigateFunction, alertError: (error: string) => void) => {
	if (err instanceof AuthError) {
		alertError(err.message);
		navigate("/login");
	}
	alertError('Something went wrong');
}