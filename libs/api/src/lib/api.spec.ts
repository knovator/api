import { setAPIConfig, fetchUrl } from './api';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

setAPIConfig({
  baseUrl: 'https://www.google.com',
});

describe('api', () => {
  it('should call GET API', () => {
    mockedAxios.get.mockResolvedValue({ data: {} });
    fetchUrl({
      type: 'GET',
      url: 'posts',
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://www.google.com/posts',
      expect.anything()
    );
  });
});
