interface Tag {
  tagId: number;
  tagName: string;
}

interface Bookmark {
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
