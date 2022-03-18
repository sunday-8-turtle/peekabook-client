interface Tag {
  tagId: number;
  tagName: string;
}

interface Bookmark {
  bookmarkId?: number | string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  image?: string;
  notidate?: string;
  createdDate?: string;
}

interface TagWithBookmark {
  [tagName: string]: {
    id: number | string;
    bookmarkList: Bookmark[];
  };
}

export { Tag, Bookmark, TagWithBookmark };
