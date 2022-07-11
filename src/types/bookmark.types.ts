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

interface BookmarkByTagName {
  [tagName: string]: {
    tagId: number;
    bookmarkList: Bookmark[];
  };
}

export { Tag, Bookmark, BookmarkByTagName };
