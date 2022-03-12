import { defineStore } from 'pinia';

import { Bookmark, TagWithBookmark } from '@/types/bookmark.types';

const bookmarkList: Bookmark[] = [];
const tagWithBookmarkSet: TagWithBookmark = {};

const useBookmarkStore = defineStore('bookmark', {
  state: () => {
    return {
      bookmarkList,
      tagWithBookmarkSet,
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
    updateTagWithBookmarkSet(tagWithBookmarkSet: TagWithBookmark) {
      this.tagWithBookmarkSet = tagWithBookmarkSet;
    },
    removeOneFromBookmarkList(targetBookmarkId: number) {
      this.bookmarkList = this.bookmarkList.filter((bookmark) => {
        if (bookmark.bookmarkId !== targetBookmarkId) return bookmark;
      });
    },
    removeOneFromTagWithBookmarkList(targetBookmark: Bookmark) {
      // 1) 전체에서 지우고
      this.tagWithBookmarkSet['전체'].bookmarkList = this.tagWithBookmarkSet[
        '전체'
      ].bookmarkList.filter((bookmark) => {
        if (bookmark.bookmarkId !== targetBookmark.bookmarkId) return bookmark;
      });

      // 2) 개별 태그에서 삭제
      targetBookmark.tags.forEach((tag) => {
        this.tagWithBookmarkSet[tag].bookmarkList = this.tagWithBookmarkSet[
          tag
        ].bookmarkList.filter((bookmark) => {
          if (bookmark.bookmarkId !== targetBookmark.bookmarkId)
            return bookmark;
        });

        // 3) 만약 해당 태그의 북마크가 0개라면 태그도 삭제
        if (!this.tagWithBookmarkSet[tag].bookmarkList.length) {
          delete this.tagWithBookmarkSet[tag];
        }
      });
    },
  },
});

export default useBookmarkStore;
