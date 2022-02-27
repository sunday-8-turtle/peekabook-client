import axios from 'axios';
import useAuthStore from '@/store/auth.store';
import { getSavedState } from '@/store/helpers';
import { CurrentUserState } from '@/types/auth.types';

const httpClient = axios.create();

httpClient.defaults.baseURL = process.env.VUE_APP_BASE_URL;

httpClient.interceptors.request.use(
  function (config) {
    const user = getCurrentUser();
    if (!user) return config;

    let token = user.token;
    const { refreshToken, expireTime } = user;
    if (isTokenExpired(token)) {
      token = reissueToken(refreshToken);
    }

    httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response) {
      console.error(error);
    }
    return Promise.reject(error);
  }
);

const getCurrentUser = (): CurrentUserState | undefined => {
  const user: CurrentUserState | undefined = getSavedState('user');
  return user ? user : undefined;
};

const isTokenExpired = (token: string): boolean => {
  return false;
};

const reissueToken = (token: string) => {
  return token;
};

export default httpClient;
