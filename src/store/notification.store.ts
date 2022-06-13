import { BookmarkNotification } from '@/types/noti.types';
import { defineStore } from 'pinia';

const notificationList: BookmarkNotification[] = [];

const useNotiStore = defineStore('notification', {
  state: () => {
    return {
      notificationList,
    };
  },
});

export default useNotiStore;
