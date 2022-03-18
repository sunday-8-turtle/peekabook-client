import { defineStore } from 'pinia';

import { login as loginRequest } from '@/api/auth.api';
import { CurrentUserState, LoginRequest } from '@/types/auth.types';

import { getSavedState, saveState } from './helpers';

const user: CurrentUserState | undefined = getSavedState('user');
const initialUserState = user
  ? { loggedIn: true, user }
  : { loggedIn: false, user: null };

const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      ...initialUserState,
    };
  },
  actions: {
    setUserState({
      loggedIn,
      user,
    }: {
      loggedIn: boolean;
      user: CurrentUserState | null;
    }) {
      this.loggedIn = loggedIn;
      this.user = user;

      if (user) saveState('user', user);
      else localStorage.removeItem('user');
    },
    async login(body: LoginRequest): Promise<CurrentUserState | undefined> {
      const res = await loginRequest(body);
      if (res.result === 'FAIL' || !res.data) {
        throw new Error(res.message || 'Get Token Error');
      }
      const user = res.data;
      const newUserState = {
        loggedIn: true,
        user: user,
      };
      this.setUserState(newUserState);
      return Promise.resolve(user);
    },
    logout() {
      const newUserState = {
        loggedIn: false,
        user: null,
      };
      this.setUserState(newUserState);
    },
  },
});

export default useAuthStore;
