import { ref, Ref } from 'vue';
import { getTagList, getBookmarkList } from '@/api/bookmark';
import { TagWithBookmark } from '@/types/bookmark.types';
import useBookmarkStore from '@/store/bookmark.store';

export default function useTag() {
  const initialTagWithBookmarkSet: Ref<TagWithBookmark> = ref({});
  const bookmarkStore = useBookmarkStore();

  (async () => {
    bookmarkStore.toggleFetchingStatus();
    const [tagListResponse, bookmarkListResponse] = await Promise.all([
      getTagList(),
      getBookmarkList(),
    ]);
    bookmarkStore.toggleFetchingStatus();

    const rawTagList = tagListResponse.data!;
    initialTagWithBookmarkSet.value['전체'] = {
      id: -1,
      bookmarkList: [],
    };
    for (const tag of rawTagList) {
      initialTagWithBookmarkSet.value[tag.tagName] = {
        id: tag.tagId,
        bookmarkList: [],
      };
    }

    const rawBookmarkList = bookmarkListResponse.data!;
    for (const bookmark of rawBookmarkList) {
      initialTagWithBookmarkSet.value['전체'].bookmarkList?.push(bookmark);

      for (const tag of bookmark.tags) {
        if (!initialTagWithBookmarkSet.value[tag]) continue;
        initialTagWithBookmarkSet.value[tag].bookmarkList?.push(bookmark);
      }
    }

    // 개수가 0개인 태그는 제거해서 보여줍니다.
    for (const tag in initialTagWithBookmarkSet.value) {
      if (!initialTagWithBookmarkSet.value[tag].bookmarkList.length) {
        delete initialTagWithBookmarkSet.value[tag];
      }
    }
  })();

  /**
   * (TODO) 기능 우선순위 낮음
   */
  const addTag = () => {
    console.log('hello world!');
  };

  return {
    initialTagWithBookmarkSet,
    addTag,
  };
}
