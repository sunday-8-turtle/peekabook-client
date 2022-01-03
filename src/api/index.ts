import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

axios.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    let token = localStorage.getItem('auth.token');

    if (!token) return config;
    if (isTokenExpired(token)) token = refreshToken(token);

    return setDefaultHeaders(config, token);
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const setDefaultHeaders = (config: AxiosRequestConfig, token: string) => {
  if (!config || !config.headers) {
    throw new Error('Headers do not exist on axios.');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

const isTokenExpired = (token: string) => {
  return token;
};

const refreshToken = (token: string) => {
  return token;
};
