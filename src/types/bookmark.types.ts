interface Tag {
  tagId: number;
  tagName: string;
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

interface CreateBookmarkResponse {
  bookmarkId: number;
}

interface TagWithBookmark {
  [tagName: string]: {
    id: number | string;
    bookmarkList: Bookmark[];
  };
}

export { Tag, Bookmark, TagWithBookmark, CreateBookmarkResponse };
