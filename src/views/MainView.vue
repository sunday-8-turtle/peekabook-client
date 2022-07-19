<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import useBookmarkStore from '@/store/bookmark.store';

import { Bookmark } from '@/types/bookmark.types';

import TheSnb from '@/components/TheSnb.vue';
import BookmarkList from '@/components/BookmarkList.vue';
import TheFooter from '@/components/TheFooter.vue';

/**
 * route & router
 */
const $route = useRoute();

/**
 * tags
 */
const tagName = ref(($route.query.tag as string) || '전체');
watch($route, (newRoute) => {
  tagName.value = (newRoute.query.tag as string) || '전체';
});

/**
 * store & setup
 */
const bookmarkStore = useBookmarkStore();
bookmarkStore.$patch((state) => {
  state.selectedTagName = tagName.value; // set up the tag that a user selected.
});
bookmarkStore.fetchBookmarkSetByTagName();

/**
 * bookmark related data
 */
const { getSortedBookmarkSet, selectedTagName, selectedSort, isLoading } =
  storeToRefs(bookmarkStore); // this creates reactivity on getters.

/**
 * methods
 */
const updateSort = (newSelectedSort: typeof selectedSort.value) => {
  bookmarkStore.$patch((state) => {
    state.selectedSort = newSelectedSort;
  });
};
const createBookmark = async (
  newBookmark: Bookmark,
  closeBookmarkModal: any
) => {
  await bookmarkStore.createBookmark(newBookmark);
  closeBookmarkModal();
};
const modifyBookmark = async (
  targetBookmark: Bookmark,
  closeBookmarkModal: any
) => {
  await bookmarkStore.modifyBookmark(targetBookmark);
  closeBookmarkModal();
};
const deleteBookmark = async (
  targetBookmark: Bookmark,
  closeModalConfirm: any
) => {
  await bookmarkStore.deleteBookmark(targetBookmark);
  closeModalConfirm();
};
</script>

<template>
  <div class="wrapper">
    <TheSnb @create-bookmark="createBookmark" />
    <main>
      <BookmarkList
        :bookmark-list="getSortedBookmarkSet"
        :selected-tag-name="selectedTagName"
        :selected-sort="selectedSort"
        :is-loading="isLoading"
        @update-sort="updateSort"
        @delete-bookmark="deleteBookmark"
        @modify-bookmark="modifyBookmark"
      />
    </main>
  </div>
  <TheFooter />
</template>

<style lang="scss" scoped>
$the-snb-width: 240px;
$the-nav-height: 72px;
$the-footer-height: 88px;
$the-global-top-padding: 56px;

.wrapper {
  max-width: 1440px;
  min-height: calc(100vh - $the-nav-height - $the-global-top-padding - 48px);

  padding: 0 120px;
  margin: 0 auto;
  margin-top: 48px;

  display: flex;

  main {
    width: 100%;
    height: 100%;

    position: relative;
    display: flex;
    flex-direction: column;
  }
}
</style>
