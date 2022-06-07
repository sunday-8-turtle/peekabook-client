import { createHttpClient } from '@/lib/http-client';

// (todo) UI에서 사용하기 좋은 형식으로 재정의할 예정
interface BookmarkResponse {
  bookmarkId: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  image?: string;
  notidate?: string;
  createdDate: string;
}

interface Bookmark {
  bookmarkId: number;
  title: string;
  url: string;
  description: string;
  tags: string[];
  image?: string;
  notidate?: string;
  createdDate: string;
}

interface ErrorResponse {
  errorCode: string;
  message: string;
}

const instance = createHttpClient()
  .setBaseUrl(import.meta.env.VITE_API_BASE_URL)
  .build();

const mapBookmark = (bookmarkResponse: any) => {
  return bookmarkResponse;
};

const dispatchError = (err: ErrorResponse) => {
  // Error를 한 곳에 모아놓고 커스텀으로 정의하여 사용하면 좋을 것 같습니다.
  if (err.errorCode === 'AUTH_INVALID_TOKEN') {
    throw new Error('TOKEN_EXPIRED_ERROR');
  } else {
    throw new Error('UNKNOWN_ERROR');
  }
};

const getBookmarkList = (): Promise<Bookmark[]> => {
  const params = {
    page: 0,
    size: 100,
  };
  return instance
    .get(`/bookmark`, { params })
    .then((res) => mapBookmark(res))
    .catch((error: ErrorResponse) => dispatchError(error));
};

export { getBookmarkList };
