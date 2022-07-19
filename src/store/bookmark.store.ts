import { defineStore } from 'pinia';
import {
  getBookmarkSet,
  createBookmark as _createBookmark,
  modifyBookmark as _modifyBookmark,
  deleteBookmark as _deleteBookmark,
} from '@/api/bookmark-service/bookmark';
import { Bookmark, BookmarkByTagName } from '@/types/bookmark.types';

interface BookmarkState {
  bookmarkSetByTagName: BookmarkByTagName | null;
  selectedTagName: string;
  selectedSort: '최신 순' | '가나다';
  isLoading: boolean;
}

const useBookmarkStore = defineStore('bookmark', {
  state: (): BookmarkState => {
    return {
      bookmarkSetByTagName: null,
      selectedTagName: '전체',
      selectedSort: '최신 순',
      isLoading: false,
    };
  },
  getters: {
    getBookmarkSetByTagName(state) {
      if (!state.bookmarkSetByTagName) return null;

      let result = null;
      for (const [key, value] of Object.entries(state.bookmarkSetByTagName)) {
        if (key === state.selectedTagName) result = value.bookmarkList;
      }

      return result;
    },
    getSortedBookmarkSet(state): Bookmark[] | null {
      if (!this.getBookmarkSetByTagName) return null;

      if (state.selectedSort === '최신 순') {
        return [...this.getBookmarkSetByTagName].sort((a, b) => {
          if (a.createdDate > b.createdDate) return -1;
          else return 1;
        });
      } else if (state.selectedSort === '가나다') {
        return [...this.getBookmarkSetByTagName].sort((a, b) => {
          if (a.title < b.title) return -1;
          else return 1;
        });
      } else {
        return null;
      }
    },
  },
  actions: {
    async fetchBookmarkSetByTagName() {
      try {
        this.isLoading = true;
        const bookmarkSetByTagName = await getBookmarkSet();
        this.isLoading = false;

        this.bookmarkSetByTagName = bookmarkSetByTagName;
        return this.bookmarkSetByTagName;
      } catch (err) {
        console.error(err);
      }
    },
    async createBookmark(newBookmark: Bookmark) {
      try {
        this.isLoading = true;
        await _createBookmark(newBookmark);
        await this.fetchBookmarkSetByTagName();
        this.isLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    async modifyBookmark(targetBookmark: Bookmark) {
      if (!this.bookmarkSetByTagName) return;

      try {
        this.isLoading = true;
        await _modifyBookmark(targetBookmark);
        this.isLoading = false;

        for (const [key, value] of Object.entries(this.bookmarkSetByTagName)) {
          value.bookmarkList = value.bookmarkList.map((bookmark) => {
            if (bookmark.bookmarkId === targetBookmark.bookmarkId) {
              return targetBookmark;
            }
            return bookmark;
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteBookmark(targetBookmark: Bookmark) {
      if (!this.bookmarkSetByTagName) return;

      try {
        this.isLoading = true;
        await _deleteBookmark(targetBookmark.bookmarkId);
        this.isLoading = false;

        for (const [key, value] of Object.entries(this.bookmarkSetByTagName)) {
          value.bookmarkList = value.bookmarkList.filter((bookmark) => {
            return bookmark.bookmarkId !== targetBookmark.bookmarkId;
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
});

export default useBookmarkStore;
