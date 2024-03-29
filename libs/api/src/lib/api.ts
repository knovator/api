/* eslint-disable no-async-promise-executor */
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import {
  iConfigType,
  iFetchUrl,
  ObjectType,
  iFetchConfig,
  ACTION_TYPES,
  ACTION,
} from './interfaces';

let CONFIG: iConfigType = {
  baseUrl: '',
  handleCache: true,
};

axios.defaults.headers.common['Authorization'] = 'Bearer test';

export const setAPIConfig = (conf: iConfigType) => {
  CONFIG = {
    ...CONFIG,
    ...conf,
  };
};

let cache: Array<string> = [];
const cancel: Array<any> = [];

const getUrl = (config: iConfigType, resourceUrl: string, query?: string) => {
  // Sanitizing BaseUrl to always ends with /
  let baseUrl = CONFIG.baseUrl.endsWith('/')
    ? CONFIG.baseUrl
    : `${config.baseUrl}/`;

  // Adding Prefix if specified
  if (CONFIG.prefix) {
    let prefix =
      typeof CONFIG.prefix === 'function'
        ? CONFIG.prefix(config)
        : CONFIG.prefix;
    if (prefix) {
      if (prefix.startsWith('/')) prefix = prefix.substring(1);
      if (!prefix.endsWith('/')) prefix = prefix + '/';
      baseUrl = baseUrl + prefix;
    }
  }

  // Sanitizing resourceUrl and removing / in front of it
  let appendUrl = streamlineUrl(resourceUrl);
  if (appendUrl.startsWith('/')) appendUrl = appendUrl.substring(1);

  // Building finalUrl
  let finalUrl = `${baseUrl}${appendUrl || ''}`;
  if (query) {
    finalUrl = finalUrl + `?${query}`;
  }
  return finalUrl;
};

const getHeaders = async (config: iConfigType, fetchConfig?: iFetchConfig) => {
  let headers: AxiosRequestHeaders = {};
  const token =
    typeof config.getToken === 'function'
      ? await config.getToken()
      : config.getToken;

  // if token exits then set it to Authorization
  if (token) {
    // pass false to avoid any prefix
    const { tokenPrefix = 'Bearer' } = config;
    headers['Authorization'] = `${
      tokenPrefix ? `${tokenPrefix} ` : ''
    }${token}`;
  }
  if (fetchConfig?.headers) {
    headers = {
      ...headers,
      ...fetchConfig.headers,
    };
  }
  return headers;
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
    const query = data ? serialize(data) : '';
    const finalUrl = getUrl(CONFIG, url, query);
    return axios.get(finalUrl, {
      // credentials: 'include',
      // withCredentials: false,
      // cancelToken: new axios.CancelToken((cToken: any) => {
      //   cancel.push({ url, cToken });
      // }),
      headers: fetchConfig?.headers || {},
    });
  },
  DELETE: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = getUrl(CONFIG, url);
    return axios.delete(finalUrl, {
      data,
      headers: fetchConfig.headers,
    });
  },
  POST: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = getUrl(CONFIG, url);
    return axios.post(finalUrl, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    });
  },
  PATCH: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = getUrl(CONFIG, url);
    return axios.patch(finalUrl, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    });
  },
  PUT: (url: string, data: ObjectType, fetchConfig: iFetchConfig) => {
    const finalUrl = getUrl(CONFIG, url);
    return axios.put(finalUrl, data, {
      // credentials: 'include',
      // withCredentials: true,
      headers: fetchConfig.headers,
    });
  },
};

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
  return new Promise(async (resolve, reject) => {
    const actionType = type.toUpperCase() as ACTION_TYPES;
    url = config.hash ? `${url}?hash=${config.hash}` : url;
    cacheHandler(url);
    const handler = ACTION_HANDLERS[actionType];
    config.headers = await getHeaders(CONFIG, config);

    handler(url, data, config)
      .then((response: AxiosResponse) => resolve(response?.data))
      .catch((error: Error) => {
        handleError(error);
        return reject(error);
      });
  });
};

    // cacheHandler(url);