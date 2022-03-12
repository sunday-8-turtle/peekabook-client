import httpClient from '.';
import { PKBResponse } from '@/types';
import { Tag, Bookmark } from '@/types/bookmark.types';

const getTagList = async (page = 0, size = 10): Promise<PKBResponse<Tag[]>> => {
  const USER_TAG_LIST = '/bookmark/tags';
  const params = { page, size };
  const res = await httpClient.get(USER_TAG_LIST, { params });
  return res.data;
};

const getBookmarkList = async (
  page = 0,
  size = 100
): Promise<PKBResponse<Bookmark[]>> => {
  const BOOKMARK_LIST = '/bookmark';
  const params = { page, size };
  const res = await httpClient.get(BOOKMARK_LIST, { params });
  return res.data;
};

const getBookmarkListByTag = async (
  tagId: number,
  page = 0,
  size = 100
): Promise<PKBResponse<Bookmark[]>> => {
  const BOOKMARK_LIST_BY_TAG = `/bookmark/tag/${tagId}`;
  const params = { page, size };
  const res = await httpClient.get(BOOKMARK_LIST_BY_TAG, { params });
  return res.data;
};

const deleteBookmark = async (bookmarkId: number): Promise<void> => {
  const BOOKMARK_DELETE_BY_ID = `/bookmark/delete/${bookmarkId}`;
  const res = await httpClient.delete(BOOKMARK_DELETE_BY_ID);
};

export { getTagList, getBookmarkList, getBookmarkListByTag, deleteBookmark };
