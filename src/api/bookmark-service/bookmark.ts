import { createHttpClient } from '@/lib/http-client';
import { Tag, Bookmark, BookmarkByTagName } from '@/types/bookmark.types';

interface ErrorResponse {
  errorCode: string;
  message: string;
}

const instance = createHttpClient()
  .setBaseUrl(import.meta.env.VITE_API_BASE_URL)
  .build();

const mapTag = (tagList: Tag[]) => {
  return tagList;
};

const mapBookmark = (bookmarkResponse: Bookmark[]) => {
  const defaultTagName = '전체';
  const result: BookmarkByTagName = {
    [defaultTagName]: {
      tagId: -1,
      bookmarkList: [],
    },
  };

  bookmarkResponse.forEach((bookmark) => {
    result[defaultTagName].bookmarkList.push(bookmark);
    bookmark.tags.forEach((tag) => {
      if (tag in result) {
        result[tag].bookmarkList.push(bookmark);
      } else {
        result[tag] = {
          tagId: -1,
          bookmarkList: [bookmark],
        };
      }
    });
  });

  return result;
};

const dispatchError = (err: ErrorResponse) => {
  if (err.errorCode === 'AUTH_INVALID_TOKEN') {
    throw new Error('TOKEN_EXPIRED_ERROR');
  } else {
    throw new Error('UNKNOWN_ERROR');
  }
};

const getTagList = ({ page = 0, size = 100 } = {}): Promise<Tag[]> => {
  const params = { page, size };
  return instance
    .get('/bookmark/tags', { params })
    .then((res) => mapTag(res as Tag[]))
    .catch((error: ErrorResponse) => dispatchError(error));
};

const getBookmarkSet = ({
  page = 0,
  size = 100,
} = {}): Promise<BookmarkByTagName> => {
  const params = { page, size };
  return instance
    .get(`/bookmark`, { params })
    .then((res) => mapBookmark(res as Bookmark[]))
    .catch((error: ErrorResponse) => dispatchError(error));
};

const createBookmark = (body: Bookmark): Promise<unknown> => {
  return instance
    .post(`/bookmark`, body)
    .catch((error: ErrorResponse) => dispatchError(error));
};

const deleteBookmark = (bookmarkId: number): Promise<unknown> => {
  return instance
    .delete(`/bookmark/delete/${bookmarkId}`)
    .catch((error: ErrorResponse) => dispatchError(error));
};

const modifyBookmark = (bookmark: Bookmark): Promise<unknown> => {
  return instance
    .put(`/bookmark/modify/${bookmark.bookmarkId}`, bookmark)
    .catch((error: ErrorResponse) => dispatchError(error));
};

export { getBookmarkSet, createBookmark, deleteBookmark, modifyBookmark };
