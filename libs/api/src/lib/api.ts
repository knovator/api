import axios, { AxiosResponse } from 'axios';
import QueryString from 'qs';
import {
  iConfigType,
  iFetchUrl,
  ObjectType,
  iFetchConfig,
  ACTION_TYPES,
  ACTION,
  iSetHeaders,
} from './interfaces';

let CONFIG: iConfigType = {
  baseUrl: '',
  handleCache: true,
};

const setAPIConfig = (conf: iConfigType) => {
  CONFIG = {
    ...CONFIG,
    ...conf,
  };
};

let cache: Array<string> = [];
const cancel: Array<any> = [];

const getEndPoint = (config: iConfigType) => {
  if (CONFIG.prefix) {
    const prefix =
      typeof CONFIG.prefix === 'function'
        ? CONFIG.prefix(config)
        : CONFIG.prefix;
    return CONFIG.baseUrl + '/' + prefix;
  } else {
    return CONFIG.baseUrl;
  }
};

const ACTION_HANDLERS: { [key in ACTION_TYPES]: ACTION } = {
  GET: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    let queryUrl = url;

    if (data !== undefined) {
      const query = QueryString.stringify(data);
      queryUrl = `${queryUrl}?${query}`;
    }

    return axios.get(`${getEndPoint(CONFIG)}${url ? `/${queryUrl}` : ''}`, {
      // credentials: 'include',
      // withCredentials: false,
      cancelToken: new axios.CancelToken((cToken: any) => {
        cancel.push({ url, cToken });
      }),
      headers: fetchConfig.headers,
    });
  },

  DELETE: (url: string, data: ObjectType, fetchConfig: iFetchConfig) =>
    axios.delete(`${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`, {
      data,
      headers: fetchConfig.headers,
    }),

  POST: (url: string, data: ObjectType, fetchConfig: iFetchConfig) =>
    axios.post(`${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    }),

  PATCH: (url: string, data: ObjectType, fetchConfig: iFetchConfig) =>
    axios.patch(`${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    }),

  PUT: (url: string, data: ObjectType, fetchConfig: iFetchConfig) =>
    axios.put(`${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    }),
};

async function setHeaders({ headers, type }: iSetHeaders) {
  // getting token
  const token =
    typeof CONFIG.getToken === 'function'
      ? await CONFIG.getToken()
      : CONFIG.getToken;

  // if token exits then set it to Authorization else remove it
  if (token) {
    // pass false to avoid any prefix
    const { tokenPrefix = 'Bearer' } = CONFIG;
    axios.defaults.headers.common['Authorization'] = `${
      tokenPrefix ? `${tokenPrefix} ` : ''
    }${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // ! Removed: setting other headers
  // * added headers config in ACTION_HANDLER itself
  if (typeof headers === "object" && type) {
    const actionType = type.toLowerCase() as unknown as string;
    Object.entries((key: string, value: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      axios.defaults.headers[actionType][key] = value;
    });
  }
}

function handleError(error: Error) {
  cache = [];
  CONFIG?.onError?.(error);
}

const cacheHandler = (url: string) => {
  if (CONFIG.handleCache) {
    if (cache.includes(url)) {
      // console.warn("api cancelled with url:", url);
      const controller = cancel.filter((index) => index.url === url);
      controller.map((item) => item.cToken());
    } else {
      cache.push(url);
    }
  }
};

const fetchUrl = ({
  type = 'GET',
  url,
  data = {},
  config = {},
}: iFetchUrl) => {
  return new Promise( (resolve, reject) => {
    const actionType = type.toUpperCase() as ACTION_TYPES;
    setHeaders({ headers: config.headers, type });
    url = config.hash ? `${url}?hash=${config.hash}` : url;
    cacheHandler(url);
  
    const handler = ACTION_HANDLERS[actionType];
  
    handler(url, data, config)
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error: Error) => {
        handleError(error);
        return reject(error);
      });
  })
};

export { setAPIConfig };
export default fetchUrl;
