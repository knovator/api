import { configType } from "./interfaces";

let config: configType = {
  baseUrl: "",
  handleCache: true,
};

const setAPIConfig: Function = (conf: configType) => {
  config = {
    ...config,
    ...conf,
  };
};

export { config, setAPIConfig };
