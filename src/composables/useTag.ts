import { ref, Ref } from 'vue';
import { getTagList, getBookmarkList } from '@/api/bookmark';
import { TagWithBookmark } from '@/types/bookmark.types';

export default function useTag() {
  const initialTagWithBookmarkSet: Ref<TagWithBookmark> = ref({});

  (async () => {
    const [tagListResponse, bookmarkListResponse] = await Promise.all([
      getTagList(),
      getBookmarkList(),
    ]);

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
        initialTagWithBookmarkSet.value[tag].bookmarkList?.push(bookmark);
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
