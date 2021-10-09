export interface configType {
  getToken?: Function | String;
  baseUrl: string;
  prefix?: Function | string;
  onError?: Function;
  handleCache?: boolean | undefined;
}

export interface fetchConfigType {
  hash?: string;
  skipErrors?: boolean | undefined;
  headers?: object | undefined;
}

export interface fetchUrlType {
  type: "get" | "post" | "delete" | "put" | "patch";
  url: string;
  data?: object | undefined;
  config?: fetchConfigType | undefined;
}
