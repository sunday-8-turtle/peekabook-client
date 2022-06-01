import { ref } from 'vue';

import { checkNotification, fetchNotificationList } from '@/api/noti.api';
import { BookmarkNotification } from '@/types/noti.types';

export default function useNotification() {
  const notificationList = ref<BookmarkNotification[]>([]);

  const loadNotificationList = async () => {
    notificationList.value = [];

    const res = await fetchNotificationList();
    if (res.result === 'FAIL' || !res.data) return;
    notificationList.value = res.data;
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

  // Initial Fetching
  loadNotificationList();

  return {
    notificationList,
    loadNotificationList,
    openNotificationWithNewTab,
    checkNotificationRead,
  };
}
