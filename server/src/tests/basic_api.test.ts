import { describe, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';

describe('GET / - a simple endpoint', () => {
	it('basic request to /ping', async () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		const result = await request(app).get('/ping');
		expect(result.text).toEqual('pong');
		expect(result.statusCode).toEqual(200);
	});
});
