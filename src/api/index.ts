import axios from 'axios';
import { getSavedState } from '@/store/helpers';
import { CurrentUserState } from '@/types/auth.types';

import { reissueToken } from './auth.api';
import useAuthStore from '@/store/auth.store';

const httpClient = axios.create();

httpClient.defaults.baseURL = process.env.VUE_APP_BASE_URL;

let hasRequested = false;
httpClient.interceptors.request.use(
  async function (config) {
    const user = getCurrentUser();
    if (!user) return config;

    const { token, refreshToken } = user;
    const parsedToken = parseJWT(token);

    if (isTokenExpired(parsedToken.exp) && !hasRequested) {
      hasRequested = true;
      const authStore = useAuthStore();
      config.headers!.Authorization = '';

      const res = await reissueToken({
        accessToken: token,
        refreshToken: refreshToken,
      });
      authStore.setUserState({ loggedIn: true, user: res.data! });
      hasRequested = false;
    }

    config.headers!.Authorization = `${token}`;
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

const isTokenExpired = (expireTime: number): boolean => {
  const now = new Date();
  const timeDelta = expireTime - now.getTime() / 1000;
  if (timeDelta < 0) return true;
  return false;
};

const parseJWT = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};

export default httpClient;
