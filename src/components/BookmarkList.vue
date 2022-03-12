<script lang="ts">
import { defineComponent, computed } from 'vue';
import useBookmarkStore from '@/store/bookmark.store';
import BookmarkListItem from '@/components/BookmarkListItem.vue';

export default defineComponent({
  name: 'BookmarkList',
  components: { BookmarkListItem },
  setup() {
    const bookmarkStore = useBookmarkStore();
    const bookmarkList = computed(() => {
      return bookmarkStore.bookmarkList;
    });

    return {
      bookmarkList,
    };
  },
});
</script>

<template>
  <div class="bookmark-list-container">
    <h1># TAG</h1>
    <section class="bookmark-list">
      <BookmarkListItem
        v-for="bookmark in bookmarkList"
        :key="bookmark.bookmarkId"
        :bookmark="bookmark"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
$the-snb-width: 240px;

.bookmark-list-container {
  margin-left: $the-snb-width + 56px;

  h1 {
    margin-top: 0;
    margin-bottom: 32px;

    font-weight: bold;
    font-size: 28px;
    line-height: 42px;
  }
}

.bookmark-list {
  display: grid;
  gap: 20px;
  grid-template-columns: 288px 288px 288px;
}
</style>
