import { Bookmark } from './bookmark.types';

interface Notification {
  id: number;
  notiType: 'BROWSER';
  message: string;
  image?: string;
  notidate: string;
  check: boolean;
  bookmark: Bookmark;
}

export { Notification };
