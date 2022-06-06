import { ref } from 'vue';

import { checkNotification, fetchNotificationList } from '@/api/noti.api';
import { BookmarkNotification } from '@/types/noti.types';

export default function useNotification() {
  const notificationList = ref<BookmarkNotification[]>([]);

  const loadNotificationList = async () => {
    notificationList.value = [];

    const res = await fetchNotificationList();
    if (res.result === 'SUCCESS' && res.data) {
      notificationList.value = res.data;
      console.log('Load Notifications', notificationList.value);
    }
  };

  const openNotificationWithNewTab = (notification: BookmarkNotification) => {
    window.open(notification.bookmark.url, '_blank');
    checkNotificationRead(notification.id);
  };

  const checkNotificationRead = async (notiId: number) => {
    const res = await checkNotification(notiId);
    if (res.result === 'FAIL') return;

    const target = notificationList.value.find((noti) => noti.id === notiId);
    if (target) target.check = true;
  };

  return {
    notificationList,
    loadNotificationList,
    openNotificationWithNewTab,
    checkNotificationRead,
  };
}
