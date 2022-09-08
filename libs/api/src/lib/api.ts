/* eslint-disable no-async-promise-executor */
import axios, { AxiosResponse } from 'axios';
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

export const setAPIConfig = (conf: iConfigType) => {
  CONFIG = {
    ...CONFIG,
    ...conf,
  };
};

let cache: Array<string> = [];
const cancel: Array<any> = [];

const getEndPoint = (config: iConfigType) => {
  const finalUrl = CONFIG.baseUrl.endsWith('/')
    ? CONFIG.baseUrl
    : `${config.baseUrl}/`;
  if (CONFIG.prefix) {
    const prefix =
      typeof CONFIG.prefix === 'function'
        ? CONFIG.prefix(config)
        : CONFIG.prefix;
    return finalUrl + prefix;
  } else {
    return finalUrl;
  }
};

export function serialize(obj: ObjectType) {
  const qs = Object.keys(obj)
    .reduce(function (a, k) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      a.push(k + '=' + encodeURIComponent(obj[k]));
      return a;
    }, [])
    .join('&');
  if (qs) return '?' + qs;
  else return '';
}

const streamlineUrl = (url: string): string => {
  return url.replace(/\/+/g, '/');
};

const ACTION_HANDLERS: { [key in ACTION_TYPES]: ACTION } = {
  GET: (url: string, data: ObjectType, fetchConfig?: iFetchConfig) => {
    return new Promise(async (resolve, reject) => {
      try {
        let queryUrl = url || '';
        if (queryUrl.startsWith('/')) queryUrl = queryUrl.substring(1);

        if (data !== undefined) {
          const query = serialize(data);
          if (query) queryUrl = `${queryUrl}?${query}`;
        }
        const finalUrl = `${getEndPoint(CONFIG)}${url ? queryUrl : ''}`;
        const response = await axios.get(finalUrl, {
          // credentials: 'include',
          // withCredentials: false,
          cancelToken: new axios.CancelToken((cToken: any) => {
            cancel.push({ url, cToken });
          }),
          headers: fetchConfig?.headers || {},
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },
  DELETE: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = streamlineUrl(
      `${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`
    );
    return axios.delete(finalUrl, {
      data,
      headers: fetchConfig.headers,
    });
  },
  POST: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = streamlineUrl(
      `${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`
    );
    return axios.post(finalUrl, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    });
  },
  PATCH: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = streamlineUrl(
      `${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`
    );
    return axios.patch(finalUrl, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    });
  },
  PUT: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = streamlineUrl(
      `${getEndPoint(CONFIG)}${url ? `/${url}` : ''}`
    );
    return axios.put(finalUrl, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    });
  },
};

async function setHeaders({ headers = undefined, type }: iSetHeaders) {
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
  if (typeof headers === 'object' && type) {
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

export const fetchUrl = ({
  type = 'GET',
  url,
  data = {},
  config = {},
}: iFetchUrl) => {
  return new Promise((resolve, reject) => {
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
  });
};
