import { defineStore } from 'pinia';

import { Bookmark, TagWithBookmark } from '@/types/bookmark.types';

const bookmarkList: Bookmark[] = [];
const tagWithBookmarkSet: TagWithBookmark = {};

const useBookmarkStore = defineStore('bookmark', {
  state: () => {
    return {
      isFetchingBookmark: false,
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
    getBookmarkListByFilter(state) {
      return (filterBy: '최신 순' | '가나다 순') => {
        switch (filterBy) {
          case '최신 순':
            return state.bookmarkList.sort((a, b) => {
              return Number(b.bookmarkId) - Number(a.bookmarkId); // createdDate 값이ymd라서 비교 불가
              // return (
              //   new Date(b.createdDate).getTime() -
              //   new Date(a.createdDate).getTime()
              // );
            });
          case '가나다 순':
            return state.bookmarkList.sort((a, b) => {
              return a.title.localeCompare(b.title);
            });
        }
      };
    },
  },
  actions: {
    toggleFetchingStatus() {
      this.isFetchingBookmark = !this.isFetchingBookmark;
    },
    updateBookmarkList(bookmarkList: Bookmark[]) {
      this.bookmarkList = bookmarkList;
    },
    updateTagWithBookmarkSet(tagWithBookmarkSet: TagWithBookmark) {
      this.tagWithBookmarkSet = tagWithBookmarkSet;
    },
    addOneBookmarkToList(newBookmark: Bookmark) {
      const isDuplicate = this.bookmarkList.some((bookmark) => {
        return bookmark.bookmarkId === newBookmark.bookmarkId;
      });
      if (isDuplicate) return;
      this.bookmarkList.unshift(newBookmark);
    },
    addOneBookmarkToTagWithBookmarkSet(bookmark: Bookmark) {
      if (this.tagWithBookmarkSet['전체']) {
        this.tagWithBookmarkSet['전체'].bookmarkList.unshift(bookmark);
      } else {
        this.tagWithBookmarkSet['전체'] = {
          id: -1,
          bookmarkList: [bookmark],
        };
      }

      bookmark.tags.forEach((tag) => {
        if (this.tagWithBookmarkSet[tag]) {
          this.tagWithBookmarkSet[tag].bookmarkList.unshift(bookmark);
        } else {
          this.tagWithBookmarkSet[tag] = {
            id: bookmark.title,
            bookmarkList: [bookmark],
          };
        }
      });
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
        if (!this.tagWithBookmarkSet[tag]) return;

        this.tagWithBookmarkSet[tag].bookmarkList = this.tagWithBookmarkSet[
          tag
        ].bookmarkList.filter((bookmark) => {
          if (bookmark.bookmarkId !== targetBookmark.bookmarkId)
            return bookmark;
        });

        // 3) 만약 해당 태그의 북마크가 0개라면 태그도 삭제
        if (
          tag !== '전체' &&
          !this.tagWithBookmarkSet[tag].bookmarkList.length
        ) {
          delete this.tagWithBookmarkSet[tag];
        }
      });
    },
    updateOneBookmark(modifiedBookmark: Bookmark) {
      // 1. 전체 북마크 리스트에 추가하고
      this.bookmarkList = this.bookmarkList.map((bookmark) => {
        if (bookmark.bookmarkId === modifiedBookmark.bookmarkId) {
          return modifiedBookmark;
        }
        return bookmark;
      });

      // 현재 구조상 '전체' 태그 또한 따로 업데이트 필요 (Refactoring required)
      this.tagWithBookmarkSet['전체'].bookmarkList = this.tagWithBookmarkSet[
        '전체'
      ].bookmarkList.map((bookmark) => {
        if (bookmark.bookmarkId === modifiedBookmark.bookmarkId) {
          return modifiedBookmark;
        }
        return bookmark;
      });

      // 2. 현재 북마크에 가지고 있는 모든 태그에 대해 업데이트
      modifiedBookmark.tags.forEach((tag) => {
        // 새롭게 추가된 태그의 경우, 태그 자체를 추가하고 북마크 리스트 초기화
        if (!this.tagWithBookmarkSet[tag]) {
          this.tagWithBookmarkSet[tag] = {
            id: new Date().getTime(), // 북마크 수정 시 새로 생성된 태그의 id를 가져올 수 없음...
            bookmarkList: [modifiedBookmark],
          };
        } else {
          // 이미 있는 태그의 경우, 해당 태그의 북마크 리스트에서 수정된 것만 변경
          this.tagWithBookmarkSet[tag].bookmarkList = this.tagWithBookmarkSet[
            tag
          ].bookmarkList.map((bookmark) => {
            if (bookmark.bookmarkId === modifiedBookmark.bookmarkId) {
              return modifiedBookmark;
            }
            return bookmark;
          });
        }
      });

      // 3. 태그가 삭제된 경우
      for (const tag in this.tagWithBookmarkSet) {
        if (tag === '전체') continue;
        if (modifiedBookmark.tags.includes(tag)) continue;

        this.tagWithBookmarkSet[tag].bookmarkList = this.tagWithBookmarkSet[
          tag
        ].bookmarkList.filter((bookmark) => {
          return bookmark.bookmarkId !== modifiedBookmark.bookmarkId;
        });
      }

      // 북마크가 0개일 경우 태그 삭제
      for (const tag in this.tagWithBookmarkSet) {
        if (tag === '전체') continue;
        if (!this.tagWithBookmarkSet[tag].bookmarkList.length) {
          delete this.tagWithBookmarkSet[tag];
        }
      }
    },
  },
});

export default useBookmarkStore;
