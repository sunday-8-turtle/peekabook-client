import { defineStore } from 'pinia';

import { Bookmark } from '@/types/bookmark.types';

const bookmarkList: Bookmark[] = [];

const useBookmarkStore = defineStore('bookmark', {
  state: () => {
    return {
      bookmarkList,
    };
  },
  getters: {
    getBookmarkListByTagName(state) {
      return (tagName: string) =>
        state.bookmarkList.filter((bookmark) =>
          bookmark.tags.includes(tagName)
        );
    },
  },
  actions: {
    updateBookmarkList(bookmarkList: Bookmark[]) {
      this.bookmarkList = bookmarkList;
    },
  },
});

export default useBookmarkStore;
