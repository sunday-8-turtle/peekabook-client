import httpClient from '.';
import { PKBResponse } from '@/types';
import { BookmarkNotification } from '@/types/noti.types';

const fetchNotificationList = async (
  page = 0,
  size = 100
): Promise<PKBResponse<BookmarkNotification[]>> => {
  const GET_NOTIFICATION_LIST = '/notification';
  const params = { page, size };
  const res = await httpClient.get(GET_NOTIFICATION_LIST, { params });
  return res.data;
};

const checkNotification = async (id: number): Promise<PKBResponse<null>> => {
  const CHECK_NOTIFICATION = `/notification/check/${id}`;
  const res = await httpClient.post(CHECK_NOTIFICATION);
  return res.data;
};

export { fetchNotificationList, checkNotification };
