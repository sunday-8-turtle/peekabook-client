<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import useBookmarkStore from '@/store/bookmark.store';
import BookmarkListItem from '@/components/BookmarkListItem.vue';
import BaseContextMenu from '@/components/BaseContextMenu.vue';
import BaseContextMenuItem from '@/components/BaseContextMenuItem.vue';
import Snackbar from '@/components/Snackbar.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import BookmarkModal from '@/components/BookmarkModal.vue';

import { Bookmark } from '@/types/bookmark.types';
import { deleteBookmark } from '@/api/bookmark';
import { useOnClickOutside } from '@/composables';

export default defineComponent({
  name: 'BookmarkList',
  components: {
    BookmarkListItem,
    BaseContextMenu,
    BaseContextMenuItem,
    Snackbar,
    ModalConfirm,
    BookmarkModal,
  },
  setup() {
    const $route = useRoute();

    // tag setup
    const tagName = ref(($route.query.tag as string) || '전체');
    watch($route, (newRoute) => {
      tagName.value = (newRoute.query.tag as string) || '전체';
    });

    // bookmark setup
    const bookmarkStore = useBookmarkStore();
    const bookmarkList = computed(() => {
      return bookmarkStore.getBookmarkListByFilter(bookmarkFilter.value);
    });

    // bookmark fillter with context menu
    const filterMenu = ref<HTMLDivElement>();
    const bookmarkFilter = ref<'최신 순' | '가나다 순'>('최신 순');
    const bookmarkFilterContextMenu =
      ref<InstanceType<typeof BaseContextMenu>>();
    useOnClickOutside(filterMenu, () =>
      bookmarkFilterContextMenu.value?.close()
    );
    const toggleUserContextMenu = () =>
      bookmarkFilterContextMenu.value?.toggle();

    // snackbar
    const snackbarMessage = ref();
    const showSnackbar = (message: string) => (snackbarMessage.value = message);
    const closeSnackbar = (seconds: number) => {
      setTimeout(() => {
        snackbarMessage.value = '';
      }, seconds);
    };

    // modal confirm
    const isLoading = ref(false);
    const targetBookmark = ref<Bookmark>();
    const modalConfirm = ref<InstanceType<typeof ModalConfirm>>();
    const openModalConfirm = (bookmark: Bookmark) => {
      targetBookmark.value = bookmark;
      modalConfirm.value?.open();
    };
    const closeModalConFirm = () => modalConfirm.value?.close();
    const onConfirmDeleteBookmark = async () => {
      if (!targetBookmark.value) return;

      isLoading.value = true;
      await deleteBookmark(targetBookmark.value?.bookmarkId as number);
      bookmarkStore.removeOneFromBookmarkList(
        targetBookmark.value?.bookmarkId as number
      );
      bookmarkStore.removeOneFromTagWithBookmarkList(targetBookmark.value);
      isLoading.value = false;

      showSnackbar('북마크가 삭제되었습니다.');
      closeModalConFirm();
      closeSnackbar(3000);
    };

    // bookmark modal
    const bookmarkModal = ref<InstanceType<typeof BookmarkModal>>();
    const selectedBookmark = ref<Bookmark>();
    const openBookmarkModal = (bookmark: Bookmark) => {
      selectedBookmark.value = bookmark;
      bookmarkModal.value?.open();
    };

    return {
      tagName,
      bookmarkList,
      bookmarkFilter,
      bookmarkFilterContextMenu,
      toggleUserContextMenu,

      snackbarMessage,

      isLoading,
      modalConfirm,
      openModalConfirm,
      onConfirmDeleteBookmark,

      bookmarkModal,
      selectedBookmark,
      openBookmarkModal,
    };
  },
});
</script>

<template>
  <div class="bookmark-list-container">
    <header>
      <h1># {{ tagName }}</h1>
      <div
        v-if="bookmarkList.length"
        ref="filterMenu"
        class="bookmark-list-filter"
        @click="toggleUserContextMenu"
      >
        <span>{{ bookmarkFilter }}</span>
        <img src="@/assets/icons/arrow-down.svg" alt="filter arrow" />
        <BaseContextMenu
          class="bookmark-list-filter-context"
          ref="bookmarkFilterContextMenu"
        >
          <BaseContextMenuItem @click="bookmarkFilter = '최신 순'"
            >최신 순</BaseContextMenuItem
          >
          <BaseContextMenuItem @click="bookmarkFilter = '가나다 순'"
            >가나다 순</BaseContextMenuItem
          >
        </BaseContextMenu>
      </div>
    </header>
    <section class="bookmark-list" v-if="bookmarkList.length">
      <BookmarkListItem
        v-for="bookmark in bookmarkList"
        :key="bookmark.bookmarkId"
        :bookmark="bookmark"
        @open-modal-confirm="openModalConfirm"
        @open-modal-bookmark="openBookmarkModal"
      />
    </section>
    <p v-if="!bookmarkList.length" class="empty-message">북마크가 없습니다.</p>
  </div>

  <Snackbar v-if="snackbarMessage" :message="snackbarMessage" />
  <Teleport to="body">
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
  </Teleport>

  <BookmarkModal
    ref="bookmarkModal"
    actionType="modify"
    :selectedBookmark="selectedBookmark"
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
  margin-left: $the-snb-width + $the-global-top-padding;

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

.bookmark-list-filter {
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

  .bookmark-list-filter-context {
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

p.empty-message {
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
