import axios from 'axios';
//prettier-ignore
import { defaultCoordinates, ipAddress, positionstackResponseDataAllThree, positionstackResponseDataOnlyCountry, positionstackResponseNoNeighbourhood } from './test_helper';
import { getLocation, requestCoordinatesByIp } from '../services/location';

jest.setTimeout(10000);

jest.mock('axios');
const axiosMocked = jest.mocked(axios);

describe('test requestCoordinatesByIp() fn', () => {
	test('returns new object with coordinates (lat, lon) when called with valid IP address', async () => {
		const apiResponseData = {
			status: 'success',
			lat: 60.1797,
			lon: 24.9344
		};
		axiosMocked.get.mockResolvedValue({ data: apiResponseData });
		const result = await requestCoordinatesByIp(ipAddress);
		expect(result).toEqual({ lat: 60.1797, lon: 24.9344 });
	});
	test('returns default coords if no IP was fetched', async () => {
		const apiResponseData = {
			status: 'fail',
			message: 'invalid query'
		};
		axiosMocked.get.mockResolvedValue({ data: apiResponseData });
		const result = await requestCoordinatesByIp(undefined);
		expect(result).toEqual(defaultCoordinates);
	});
	it.each([
		'string not object',
		[1, 'array not object'],
		{
			status: 'fail',
			message: 'invalid query'
		},
		{
			status: 'success',
			lat: 24.9344
		},
		{
			status: 'success',
			lon: 24.9344
		},
		{
			status: 'fail',
			lat: 60.1797,
			lon: 24.9344
		},
		{
			status: 'fail',
			message: 'SSL unavailable for this endpoint, order a key at https://members.ip-api.com/'
		}
	])('returns default coords on unexpected response from API ( %s )', async (apiResponseData) => {
		axiosMocked.get.mockResolvedValue({ data: apiResponseData });
		const result = await requestCoordinatesByIp(ipAddress);
		expect(result).toEqual(defaultCoordinates);
	});
	test('default coords if catched an Error', async () => {
		axiosMocked.get.mockRejectedValue(new Error('Async error message'));
		const result = await requestCoordinatesByIp(ipAddress);
		expect(result).toEqual(defaultCoordinates);
	});
});

describe('test getLocation() fn', () => {
	test('returns full string on good coordinates', async () => {
		axiosMocked.get.mockResolvedValue({ data: positionstackResponseDataAllThree });
		const result = await getLocation(defaultCoordinates);
		expect(result).toEqual('Vilhonvuori, Helsinki, Finland');
	});
	test('returns city & country if neighbourhood is null in API response', async () => {
		axiosMocked.get.mockResolvedValue({ data: positionstackResponseNoNeighbourhood });
		const result = await getLocation(defaultCoordinates);
		expect(result).toEqual('Pihtipudas, Finland');
	});
	test('returns only country name if locality and neighbourhood are null in response', async () => {
		axiosMocked.get.mockResolvedValue({ data: positionstackResponseDataOnlyCountry });
		const result = await getLocation(defaultCoordinates);
		expect(result).toEqual('Finland');
	});
	test('empty string on all nulls in response', async () => {
		axiosMocked.get.mockResolvedValue({ data: [[]] });
		const result = await getLocation(defaultCoordinates);
		expect(result).toEqual('');
	});
	test('empty string on weird response', async () => {
		axiosMocked.get.mockResolvedValue('something went wrong');
		const result = await getLocation(defaultCoordinates);
		expect(result).toEqual('');
	});

	test('empty string if catched an Error', async () => {
		axiosMocked.get.mockRejectedValue(new Error('Async error message'));
		const result = await getLocation(defaultCoordinates);
		expect(result).toEqual('');
	});
});
