<script setup lang="ts">
import { ref, Ref, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getProfile } from '@/api/profile';

import BaseButton from './BaseButton.vue';
import BookmarkModal from './BookmarkModal.vue';

import useBookmarkStore from '@/store/bookmark.store';

import { Profile } from '@/types/profile.types';

import useTag from '@/composables/useTag';
import truncate from '@/directives/truncate';

const user: Ref<Profile | undefined> = ref();
const email = computed(() => user.value?.data?.email || '');
const nickname = computed(() => user.value?.data?.nickname || '');

/**
 * custom directives
 */
const vTruncate = {
  truncate,
};

/**
 * route & router
 */
const $route = useRoute();
const $router = useRouter();

/**
 * store
 */
const bookmarkStore = useBookmarkStore();
const selectedTagName = computed(() => {
  return bookmarkStore.selectedTagName;
});
const bookmarkSetByTagName = computed(() => {
  return bookmarkStore.bookmarkSetByTagName;
});
const bookmarkListByAllTag = computed(() => {
  if (bookmarkSetByTagName.value) {
    return bookmarkSetByTagName.value['전체'];
  }
});

/**
 * bookmark modal
 */
const isLoading = ref(false);
const bookmarkModal = ref<InstanceType<typeof BookmarkModal>>();
const openBookmarkModal = () => {
  bookmarkModal.value?.open();
};

/**
 * snb related data
 */
const userProfile = ref();
const showUserProfile = async () => {
  const rawUserProfile = await getProfile();
  userProfile.value = rawUserProfile.data;
};
const handlerSelectTag = (tagName: string) => {
  bookmarkStore.selectedTagName = tagName;
};

/**
 * init
 */
onBeforeMount(() => {
  showUserProfile();
});
</script>

<template>
  <aside>
    <header class="user-info" v-if="userProfile">
      <h2 class="nickname">{{ userProfile.nickname }}</h2>
      <h3 class="email">{{ userProfile.email }}</h3>
    </header>
    <section class="bookmark-add">
      <BaseButton @click="openBookmarkModal">북마크 추가하기</BaseButton>
    </section>
    <nav class="bookmark-navigator">
      <div
        class="tag-item"
        :class="{ 'tag-item--selected': selectedTagName === '전체' }"
        @click="handlerSelectTag('전체')"
      >
        <span>전체</span>
        <span>{{ bookmarkListByAllTag?.bookmarkList.length }}</span>
      </div>
      <ul
        v-if="bookmarkSetByTagName && Object.keys(bookmarkSetByTagName).length"
        class="tag-list"
      >
        <template v-for="(value, key) of bookmarkSetByTagName" :key="key">
          <li
            v-if="key !== '전체'"
            class="tag-item"
            :class="{ 'tag-item--selected': key === selectedTagName }"
            @click="handlerSelectTag(key as string)"
          >
            <span v-truncate>{{ key }}</span>
            <span>{{ value?.bookmarkList?.length }}</span>
          </li>
        </template>
      </ul>
    </nav>
    <section class="tag-add">
      <button>
        <img src="../assets/icons/snb-plus.svg" alt="" />
        <span>태그 추가</span>
      </button>
    </section>
    <footer>
      <a href="#">시작 페이지로 설정</a>
      <a href="#">확장 프로그램</a>
    </footer>
  </aside>

  <BookmarkModal
    ref="bookmarkModal"
    actionType="modify"
    :isLoading="isLoading"
  />
</template>

<style lang="scss" scoped>
@import '@/design/layout.scss';

$the-global-top-padding: 56px;

aside {
  top: $navbar-height + $the-global-top-padding;
  // position: fixed;

  min-width: 240px;

  align-self: flex-start;

  border: 1px solid #e9ecef;
  border-radius: 12px;
}

header.user-info {
  margin-top: 40px;
  margin-bottom: 24px;
  padding: 0 12px;

  .nickname,
  .email {
    margin: 0;
    text-align: center;
    line-height: 150%;
    font-style: normal;
  }

  .nickname {
    margin-bottom: 4px;

    color: #343a40;
    font-size: 15px;
    font-weight: 500;
  }

  .email {
    color: #ff69b4;
    font-size: 12px;
    font-weight: normal;
  }
}

section.bookmark-add {
  height: 48px;
  padding: 0 20px;
  margin-bottom: 40px;
}

nav.bookmark-navigator {
  .tag-list {
    margin: 0;
    padding: 0;
    // max-height: 200px;
    overflow-y: auto;
  }

  .tag-item {
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding: 12px 24px;
    list-style: none;
    line-height: 16px;

    :first-child {
      font-weight: normal;
      font-size: 15px;
      color: #343a40;
    }

    :last-child {
      font-weight: 500;
      font-size: 13px;
      color: #adb5bd;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .tag-item:last-child {
    margin-bottom: 12px;
  }

  .tag-item--selected {
    display: flex;
    justify-content: space-between;

    background: #f8f9fa;
    border-radius: 12px;

    margin-left: 12px;
    margin-right: 14px;
    padding-left: 12px;
    padding-right: 10px;

    &:hover {
      cursor: pointer;
    }

    :first-child {
      color: #343a40;
      font-size: 15px;
      font-weight: bold;
    }

    :last-child {
      color: #ff69b4;
      font-size: 13px;
    }
  }
}

.tag-add {
  margin-bottom: 16px;

  button {
    display: flex;
    align-items: center;

    height: 32px;
    margin-left: 28px;
    border: none;
    background: none;

    &:hover {
      cursor: pointer;
    }

    img {
      margin-right: 8px;
    }

    span {
      color: #ff69b4;
      font-size: 13px;
      line-height: 16px;
    }
  }
}

footer {
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  margin-bottom: 24px;

  a {
    text-decoration: none;
    font-size: 12px;
    line-height: 22px;
    letter-spacing: -0.25px;
    color: #868e96;
  }
}
</style>
