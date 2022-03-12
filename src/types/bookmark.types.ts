interface Tag {
  tagId: number;
  tagName: string;
}

interface Bookmark {
  bookmarkId: number;
  title: string;
  url: string;
  description: string;
  image?: string;
  notidate?: string;
  tags: string[];
}

interface TagWithBookmark {
  [tagName: string]: {
    id: number;
    bookmarkList: Bookmark[];
  };
}

export { Tag, Bookmark, TagWithBookmark };
