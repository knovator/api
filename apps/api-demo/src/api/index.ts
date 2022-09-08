import fetchUrl, { setAPIConfig } from '@knovator/api';

import apiList from './list';

const commonApi = async ({
  parameters = [],
  action,
  data,
  config,
}: iCommonAPI) => {
  const api = apiList[action];
  if (api) {
    const response = await fetchUrl({
      type: api.method as any,
      url: api.url({ id: parameters ? parameters[0] : undefined }),
      data,
      config,
    });
    return response;
  }
  return Promise.reject(new Error('Oops!, I guess its a wrong url.'));
};

setAPIConfig({
  baseUrl: 'https://jsonplaceholder.typicode.com/',
  onError: (error) => console.log(error),
});

export default commonApi;
