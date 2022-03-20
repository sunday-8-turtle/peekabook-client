import { PKBResponse } from '@/types';
import httpClient from '.';

const fetchNotificationList = async (
  page = 0,
  size = 100
): Promise<PKBResponse<Notification[]>> => {
  const GET_NOTIFICATION_LIST = '/notification';
  const params = { page, size };
  const res = await httpClient.get(GET_NOTIFICATION_LIST, { params });
  return res.data;
};

export { fetchNotificationList };
