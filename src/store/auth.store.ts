import { defineStore } from 'pinia';
import { getSavedState } from './helpers';

export default defineStore('auth', {
  state: () => {
    return {
      currentUser: null,
    };
  },
  getters: {
    isLoggedIn: (state) => {
      return !!state.currentUser;
    },
  },
});
