import { Bookmark } from './bookmark.types';

interface BookmarkNotification {
  id: number;
  notiType: 'BROWSER';
  message: string;
  image?: string;
  notidate: string;
  check: boolean;
  bookmark: Bookmark;
}

export { BookmarkNotification };
