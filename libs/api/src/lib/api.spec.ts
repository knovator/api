import { setAPIConfig, fetchUrl } from './api';
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const domain = 'https://www.example.com';
setAPIConfig({
  baseUrl: domain,
});

describe('@knovator/api', () => {
  const payloadData = {
    title: 'ABCD',
  };
  mockedAxios.get.mockResolvedValue({ data: {} });
  mockedAxios.delete.mockResolvedValue({ data: {} });
  mockedAxios.post.mockResolvedValue({ data: {} });
  mockedAxios.put.mockResolvedValue({ data: {} });
  mockedAxios.patch.mockResolvedValue({ data: {} });

  describe('GET, POST, PATCH, PUT, DELETE api calls', () => {
    it('should call GET API', async () => {
      await fetchUrl({
        type: 'GET',
        url: 'posts',
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${domain}/posts`,
        expect.anything()
      );
    });
    it('should call POST API', async () => {
      await fetchUrl({
        type: 'POST',
        url: 'posts',
        data: payloadData,
      });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${domain}/posts`,
        payloadData,
        expect.anything() // headers
      );
    });
    it('should call PATCH API', async () => {
      await fetchUrl({
        type: 'PATCH',
        url: 'posts/1',
        data: payloadData,
      });
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${domain}/posts/1`,
        payloadData,
        expect.anything() // headers
      );
    });
    it('should call PUT API', async () => {
      await fetchUrl({
        type: 'PUT',
        url: 'posts/1',
        data: payloadData,
      });
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${domain}/posts/1`,
        payloadData,
        expect.anything() // headers
      );
    });
    it('should call DELETE API', async () => {
      await fetchUrl({
        type: 'DELETE',
        url: 'posts/1',
      });
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${domain}/posts/1`,
        expect.anything() // headers
      );
    });
    it('should add prefix to routes', async () => {
      setAPIConfig({
        baseUrl: domain,
        prefix: 'test',
      });
      await fetchUrl({
        type: 'GET',
        url: 'posts',
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${domain}/test/posts`,
        expect.anything()
      );
      setAPIConfig({
        baseUrl: domain,
        prefix: '',
      });
    });
  });
  describe('Headers', () => {
    it('Headers should get sent in Request', async () => {
      await fetchUrl({
        type: 'GET',
        url: 'posts',
        config: {
          headers: {
            Authentication: 'ABCD',
          },
        },
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(`${domain}/posts`, {
        headers: { Authentication: 'ABCD' },
      });
    });
    describe('Token', () => {
      it('Should send token in header if exists', async () => {
        setAPIConfig({
          baseUrl: domain,
          tokenPrefix: 'jwt',
          getToken: 'ABCD',
        });
        await fetchUrl({
          type: 'GET',
          url: 'users',
        });
        expect(mockedAxios.get).toHaveBeenCalledWith(`${domain}/users`, {
          headers: { Authorization: 'jwt ABCD' },
        });
      });
      it('Should call token function for header if exists', async () => {
        setAPIConfig({
          baseUrl: domain,
          tokenPrefix: 'jwt',
          getToken: () => Promise.resolve('ABCD'),
        });
        await fetchUrl({
          type: 'GET',
          url: 'users',
        });
        expect(mockedAxios.get).toHaveBeenCalledWith(`${domain}/users`, {
          headers: { Authorization: 'jwt ABCD' },
        });
      });
    });
  });
});

