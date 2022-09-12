import { AxiosRequestHeaders, AxiosResponse } from 'axios';

export interface iConfigType {
  baseUrl: string;
  tokenPrefix?: string;
  getToken?: string | (() => Promise<string>);
  prefix?: string | ((config: iConfigType) => string);
  onError?: (error: Error) => void;
  handleCache?: boolean;
}

export interface iFetchConfig {
  hash?: string;
  authToken?: boolean;
  skipErrors?: boolean;
  headers?: AxiosRequestHeaders;
}

export interface iFetchUrl {
  type: ACTION_TYPES;
  url: string;
  data?: ObjectType;
  config?: iFetchConfig;
}

export interface iSetHeaders {
  headers?: AxiosRequestHeaders;
  type: ACTION_TYPES;
}

export type ObjectType = {
  [key: string]: string | number | boolean | ObjectType;
};

export type ACTION_TYPES = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ACTION = (
  url: string,
  data: ObjectType,
  fetchConfig: iFetchConfig
) => Promise<AxiosResponse<any, any>>;
