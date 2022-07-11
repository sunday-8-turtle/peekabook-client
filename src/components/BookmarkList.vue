<script setup lang="ts">
import { ref } from 'vue';

import BaseLottie from '@/components/BaseLottie.vue';
import BookmarkListItem from '@/components/BookmarkListItem.vue';
import BaseContextMenu from '@/components/BaseContextMenu.vue';
import BaseContextMenuItem from '@/components/BaseContextMenuItem.vue';
import Snackbar from '@/components/Snackbar.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import BookmarkModal from '@/components/BookmarkModal.vue';

import { Bookmark } from '@/types/bookmark.types';
import { useOnClickOutside } from '@/composables';

/**
 * props & emits
 */
const props = defineProps<{
  bookmarkList: Bookmark[] | null;
  selectedTagName: string;
  selectedSort: '최신 순' | '가나다';
  isLoading: boolean;
}>();
const emits = defineEmits<{
  (e: 'updateSort', newSelectedSort: typeof props.selectedSort): void;
  (e: 'modifyBookmark', targetBookmark: Bookmark, callback: () => void): void;
  (e: 'deleteBookmark', targetBookmark: Bookmark, callback: () => void): void;
}>();

/**
 * sort & context menu
 */
const sortMenu = ref<HTMLDivElement>();
const bookmarkSortContextMenu = ref<InstanceType<typeof BaseContextMenu>>();
useOnClickOutside(sortMenu, () => bookmarkSortContextMenu.value?.close());
const toggleUserContextMenu = () => bookmarkSortContextMenu.value?.toggle();

/**
 * snackbar
 */
const snackbarMessage = ref('');
const showSnackbar = (message: string) => {
  snackbarMessage.value = message;
  setTimeout(() => {
    snackbarMessage.value = '';
  }, 3000);
};

/**
 * modal for confirming on deletion
 */
const selectedBookmark = ref<Bookmark>();

const modalConfirm = ref<InstanceType<typeof ModalConfirm>>();
const openModalConfirm = (bookmark: Bookmark) => {
  selectedBookmark.value = bookmark;
  modalConfirm.value?.open();
};
const closeModalConFirm = () => modalConfirm.value?.close();
const onConfirmDeleteBookmark = async () => {
  if (!selectedBookmark.value) return;
  emits('deleteBookmark', selectedBookmark.value, closeModalConFirm);
};

/**
 * modal for bookmark
 */
const bookmarkModal = ref<InstanceType<typeof BookmarkModal>>();
const openBookmarkModal = (bookmark: Bookmark) => {
  selectedBookmark.value = bookmark;
  bookmarkModal.value?.open();
};
const onModifyBookmark = (formData: Bookmark, callback: any) => {
  emits('modifyBookmark', formData, callback);
};
</script>

<template>
  <div class="bookmark-list-container">
    <template v-if="isLoading">
      <BaseLottie
        class="empty-message"
        name="loading-btn"
        width="32px"
        height="32px"
      />
    </template>
    <template v-else>
      <header>
        <h1># {{ selectedTagName }}</h1>
        <div
          v-if="bookmarkList && bookmarkList.length"
          ref="sortMenu"
          class="bookmark-list-sort"
          @click="toggleUserContextMenu"
        >
          <span>{{ selectedSort }}</span>
          <img src="@/assets/icons/arrow-down.svg" alt="sort arrow" />
          <BaseContextMenu
            class="bookmark-list-sort-context"
            ref="bookmarkSortContextMenu"
          >
            <BaseContextMenuItem @click="$emit('updateSort', '최신 순')"
              >최신 순</BaseContextMenuItem
            >
            <BaseContextMenuItem @click="$emit('updateSort', '가나다')"
              >가나다 순</BaseContextMenuItem
            >
          </BaseContextMenu>
        </div>
      </header>
      <section class="bookmark-list" v-if="bookmarkList && bookmarkList.length">
        <BookmarkListItem
          v-for="bookmark in bookmarkList"
          :key="bookmark.bookmarkId"
          :bookmark="bookmark"
          @open-modal-confirm="openModalConfirm"
          @open-modal-bookmark="openBookmarkModal"
        />
      </section>
      <p
        v-else-if="!bookmarkList || !bookmarkList.length"
        class="empty-message"
      >
        북마크가 없습니다.
      </p>
    </template>
  </div>

  <Snackbar v-if="snackbarMessage" :message="snackbarMessage" />
  <ModalConfirm
    ref="modalConfirm"
    id="modal-confirm"
    confirmMsg="네"
    cancelMsg="아니오"
    :is-loading="isLoading"
    @confirm="onConfirmDeleteBookmark"
  >
    <header class="decision-request">
      <p>등록된 북마크를</p>
      <p>삭제하시겠니까?</p>
    </header>
  </ModalConfirm>
  <BookmarkModal
    ref="bookmarkModal"
    actionType="modify"
    :is-loading="isLoading"
    :selectedBookmark="selectedBookmark"
    @onConfirm="onModifyBookmark"
  />
</template>

<style lang="scss" scoped>
$the-snb-width: 240px;
$the-nav-height: 72px;
$the-footer-height: 88px;
$the-global-top-padding: 56px;

.bookmark-list-container {
  position: relative;
  min-height: calc(100vh - $the-nav-height - $the-global-top-padding - 48px);
  margin-left: $the-global-top-padding;

  h1 {
    margin-top: 0;
    margin-bottom: 32px;

    font-weight: bold;
    font-size: 28px;
    line-height: 42px;
  }

  header {
    z-index: 100;
    position: relative;
  }
}

.bookmark-list {
  display: grid;
  gap: 20px;
  grid-template-columns: 288px 288px 288px;
}

.bookmark-list-sort {
  display: flex;
  align-items: center;

  position: absolute;
  right: 0;
  bottom: -8px;

  span {
    color: rgba(0, 0, 0, 0.8);
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;

    margin-right: 8px;
  }

  &:hover {
    cursor: pointer;
  }

  .bookmark-list-sort-context {
    top: 22px;
    right: 0;

    > li {
      padding: 8px 0;

      &:hover {
        background: #f8f9fa;
        mix-blend-mode: darken;
      }
      &:first-child {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }

      &:last-child {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }
    }
  }
}

.empty-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  margin: 0;

  font-weight: 400;
  font-size: 17px;
  line-height: 26px;
  text-align: center;
  color: #868e96;

  display: flex;
  justify-content: center;
  align-items: center;
}

#modal-confirm {
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 17px;
    line-height: 26px;
    color: #17191b;
    font-weight: 600;
  }

  header.decision-request {
    height: 128px;

    p {
      margin: 0;
      font-size: 17px;
    }
  }
}
</style>
