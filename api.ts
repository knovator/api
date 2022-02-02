import { fetchConfigType, fetchUrlType } from "./config/interfaces";
/**
 *  Copyright (C) Knovator Technology 2020 - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by VimLeSai <desai.vimal250@gmail.com>, 2021
 * */

import axios from "axios";
import QueryString = require("qs");
import { config as CONFIG, setAPIConfig } from "./config/init";

let cache: Array<String> = [];
let cancel: Array<any> = [];

const getEndPoint = (config: any) => {
  if (CONFIG.prefix) {
    let prefix =
      typeof CONFIG.prefix === "function"
        ? CONFIG.prefix(config)
        : CONFIG.prefix;
    return CONFIG.baseUrl + "/" + prefix;
  } else {
    return CONFIG.baseUrl;
  }
};

const ACTION_HANDLERS: any = {
  GET: (url: String, data: Object | any, config: any) => {
    let queryUrl = url;

    if (data !== undefined) {
      const query = QueryString.stringify(data);
      queryUrl = `${queryUrl}?${query}`;
    }

    return axios.get(`${getEndPoint(config)}${url ? `${queryUrl}` : ""}`, {
      // credentials: 'include',
      // withCredentials: false,
      cancelToken: new axios.CancelToken((cToken) => {
        cancel.push({ url, cToken });
      }),
    });
  },

  DELETE: (url: String, data: Object | any, config: any) =>
    axios.delete(`${getEndPoint(config)}${url ? `/${url}` : ""}`, { data }),

  POST: (url: String, data: Object | any, config: any) =>
    axios.post(`${getEndPoint(config)}${url ? `/${url}` : ""}`, data, {
      // credentials: 'include',
      // withCredentials: true,
    }),

  PATCH: (url: String, data: Object | any, config: any) =>
    axios.patch(`${getEndPoint(config)}${url ? `/${url}` : ""}`, data, {
      // credentials: 'include',
      // withCredentials: true,
    }),

  PUT: (url: String, data: Object | any, config: any) =>
    axios.put(`${getEndPoint(config)}${url ? `/${url}` : ""}`, data, {
      // credentials: 'include',
      // withCredentials: true,
    }),
};

// eslint-disable-next-line max-statements
function setHeaders({ headers, authToken = true }: any) {
  // getting token
  const token =
    typeof CONFIG.getToken === "function" ? CONFIG.getToken() : CONFIG.getToken;

  // if token exits then set it to Authorization else remove it
  if (authToken && token) {
    // pass false to avoid any prefix
    const { tokenPrefix = "Bearer" } = CONFIG;
    axios.defaults.headers.common.Authorization = `${
      tokenPrefix ? `${tokenPrefix} ` : ""
    }${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }

  // setting other headers
  if (typeof headers === "object") {
    Object.entries((key: string, value: string) => {
      axios.defaults.headers.post[key] = value;
    });
  }
}

function handleError(error: Error) {
  cache = [];
  CONFIG?.onError?.(error);

  return Promise.reject(error);
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
  type = "get",
  url,
  data = {},
  config = {},
}: fetchUrlType) => {
  setHeaders(config);
  url = config.hash ? `${url}?hash=${config.hash}` : url;
  cacheHandler(url);

  const handler = ACTION_HANDLERS[type.toUpperCase()];

  return handler(url, data)
    .then((response: any) => Promise.resolve(response.data))
    .catch((error: Error) => handleError(error));
};

export { setAPIConfig };
export default fetchUrl;
