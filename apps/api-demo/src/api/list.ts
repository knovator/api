// https://jsonplaceholder.typicode.com/
const apiList = {
  GET_ALBUMS: {
    url: () => 'albums',
    method: 'GET',
  },
  CREATE_ALBUM: {
    url: () => 'albums',
    method: 'POST',
  },
  EDIT_ALBUM: {
    url: ({ id }: URL_PARAMS) => `albums/${id}`,
    method: 'PUT',
  },
  DELETE: {
    url: ({ id }: URL_PARAMS) => `albums/${id}`,
    method: 'DELETE',
  },
  GET_SINGLE: {
    url: ({ id }: URL_PARAMS) => `albums/${id}`,
    method: 'GET',
  },
};

export default apiList;
