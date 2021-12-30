import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

axios.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    let token = localStorage.getItem('auth.token');
    if (token) {
      token = refreshToken(token);
      config = setDefaultHeaders(config, { token });
    }

    return config;
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

const setDefaultHeaders = (
  config: AxiosRequestConfig,
  { token }: { token: string }
) => {
  if (!config || !config.headers) {
    throw new Error('Headers do not exist on axios.');
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

const refreshToken = (token: string) => {
  // 1. veryfiy the token
  // 2. if not expired, return the token
  // 3. if expired, refresh the token
  return token;
};
