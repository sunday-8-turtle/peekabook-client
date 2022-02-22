import { defineStore } from 'pinia';
import useAuthStore from './auth.store';

const useMainStore = defineStore('main', {
  state: () => {
    return {
      version: '0.0.1',
    };
  },
});

export { useMainStore, useAuthStore };
