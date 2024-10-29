// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: any) => fn,
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const get = jest.fn().mockResolvedValue({ data: '' });
    const create = jest.fn().mockReturnValue({ get });
    (axios.create as jest.Mock).mockImplementation(create);
    await throttledGetDataFromApi('');

    expect(create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const get = jest.fn().mockResolvedValue({ data: '' });
    const create = jest.fn().mockReturnValue({ get });
    (axios.create as jest.Mock).mockImplementation(create);
    await throttledGetDataFromApi('path');

    expect(get).toBeCalledWith('path');
  });

  test('should return response data', async () => {
    const get = jest.fn().mockResolvedValue({ data: 'data' });
    const create = jest.fn().mockReturnValue({ get });
    (axios.create as jest.Mock).mockImplementation(create);
    const result = await throttledGetDataFromApi('');

    expect(result).toBe('data');
  });
});
