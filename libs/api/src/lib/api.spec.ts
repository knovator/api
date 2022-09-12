import { setAPIConfig, fetchUrl } from './api';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

setAPIConfig({
  baseUrl: 'https://www.google.com',
});

describe('@knovator/api', () => {
  describe('GET, POST, PATCH, PUT, DELETE api calls', () => {
    it('should call GET API', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });
      await fetchUrl({
        type: 'GET',
        url: 'posts',
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.google.com/posts',
        expect.anything()
      );
    });
    it('should call POST API', async () => {
      const payloadData = {
        title: 'ABCD',
      };
      mockedAxios.post.mockResolvedValue({ data: {} });
      await fetchUrl({
        type: 'POST',
        url: 'posts',
        data: payloadData,
      });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.google.com/posts',
        payloadData,
        expect.anything() // headers
      );
    });
    it('should call PATCH API', async () => {
      const payloadData = {
        title: 'Updated Title',
      };
      mockedAxios.patch.mockResolvedValue({ data: {} });
      await fetchUrl({
        type: 'PATCH',
        url: 'posts/1',
        data: payloadData,
      });
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        'https://www.google.com/posts/1',
        payloadData,
        expect.anything() // headers
      );
    });
    it('should call PUT API', async () => {
      const payloadData = {
        title: 'Updated Title',
      };
      mockedAxios.put.mockResolvedValue({ data: {} });
      await fetchUrl({
        type: 'PUT',
        url: 'posts/1',
        data: payloadData,
      });
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'https://www.google.com/posts/1',
        payloadData,
        expect.anything() // headers
      );
    });
    it('should call DELETE API', async () => {
      mockedAxios.delete.mockResolvedValue({ data: {} });
      await fetchUrl({
        type: 'DELETE',
        url: 'posts/1',
      });
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        'https://www.google.com/posts/1',
        expect.anything() // headers
      );
    });
    it('should add prefix to routes', async () => {
      setAPIConfig({
        baseUrl: 'https://www.google.com',
        prefix: 'test',
      });
      mockedAxios.get.mockResolvedValue({ data: {} });
      await fetchUrl({
        type: 'GET',
        url: 'posts',
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.google.com/test/posts',
        expect.anything()
      );
      setAPIConfig({
        baseUrl: 'https://www.google.com',
        prefix: '',
      });
    });
  });
  describe('Headers', () => {
    it('Headers should get sent in Request', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });
      await fetchUrl({
        type: 'GET',
        url: 'posts',
        config: {
          headers: {
            Authentication: 'ABCD',
          },
        },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://www.google.com/posts',
        { headers: { Authentication: 'ABCD' } }
      );
    });
    describe('Token', () => {
      it('Should send token in header if exists', async () => {
        mockedAxios.get.mockResolvedValue({ data: {} });
        setAPIConfig({
          baseUrl: 'https://www.google.com',
          tokenPrefix: 'jwt',
          getToken: 'ABCD',
        });
        await fetchUrl({
          type: 'GET',
          url: 'users',
        });
        expect(mockedAxios.get).toHaveBeenCalledWith(
          'https://www.google.com/users',
          { headers: { Authorization: 'jwt ABCD' } }
        );
      });
      it('Should call token function for header if exists', async () => {
        mockedAxios.get.mockResolvedValue({ data: {} });
        setAPIConfig({
          baseUrl: 'https://www.google.com',
          tokenPrefix: 'jwt',
          getToken: () => Promise.resolve('ABCD'),
        });
        await fetchUrl({
          type: 'GET',
          url: 'users',
        });
        expect(mockedAxios.get).toHaveBeenCalledWith(
          'https://www.google.com/users',
          { headers: { Authorization: 'jwt ABCD' } }
        );
      });
    });
  });
});

