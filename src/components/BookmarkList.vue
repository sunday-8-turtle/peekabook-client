<script lang="ts">
import { defineComponent, ref } from 'vue';
import useBookmarkStore from '@/store/bookmark.store';
import BookmarkListItem from '@/components/BookmarkListItem.vue';

export default defineComponent({
  name: 'BookmarkList',
  components: {},
  setup() {
    const bookmarkStore = useBookmarkStore();

    return {
      bookmarkStore,
    };
  },
});
</script>

<template>
  <section class="bookmark-list">
    <p>북마크리스트</p>
    <div>
      {{ bookmarkStore }}
    </div>
  </section>
</template>

<style lang="scss" scoped>
$the-snb-width: 240px;

.bookmark-list {
  margin-left: $the-snb-width + 40px;
}
</style>
