import { defineStore } from 'pinia';

const useMainStore = defineStore('main', {
  state: () => {
    return {
      version: '0.0.1',
    };
  },
});

export default useMainStore;
