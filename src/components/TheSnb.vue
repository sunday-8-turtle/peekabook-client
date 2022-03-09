<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BaseButton from './BaseButton.vue';

import useTag from '@/composables/useTag';
import useBookmarkStore from '@/store/bookmark.store';
import { Bookmark } from '@/types/bookmark.types';

export default defineComponent({
  name: 'TheSnb',
  components: {
    BaseButton,
  },
  setup() {
    const { initialTagWithBookmarkSet, addTag } = useTag();
    const bookmarkStore = useBookmarkStore();
    const $route = useRoute();
    const $router = useRouter();

    const totalTagCount = computed(() => {
      return Object.keys(initialTagWithBookmarkSet.value).length;
    });
    const totalBookmarkList = computed(() => {
      return Object.values(initialTagWithBookmarkSet.value).reduce(
        (acc: Bookmark[], tag) => {
          return acc.concat(tag.bookmarkList);
        },
        []
      );
    });

    /**
     * 최초 내 북마크 페이지에 접속시 쿼리값에 따라 북마크 리스트 세팅
     * 스토어에 우선 전체 리스트를 넣어놓은 뒤 쿼리값을 이용하여 필터링해서 가져옵니다.
     */
    const currentTag = ref(($route.query.tag as string) ?? '');
    watch(initialTagWithBookmarkSet.value, () => {
      resetBookmarkList();

      const bookmarkListByTagName = bookmarkStore.getBookmarkListByTagName(
        currentTag.value as string
      );
      updateBookmarkListView({
        tagName: currentTag.value,
        bookmarkList: bookmarkListByTagName,
      });
    });

    function resetBookmarkList() {
      bookmarkStore.updateBookmarkList(totalBookmarkList.value);
    }
    function updateBookmarkListView({
      tagName,
      bookmarkList,
    }: {
      tagName?: string;
      bookmarkList?: Bookmark[];
    }) {
      $router.push({ name: 'MainView', query: { tag: tagName } });

      if (!tagName) resetBookmarkList();
      if (!bookmarkList || !bookmarkList.length) return;

      bookmarkStore.updateBookmarkList(bookmarkList);
    }

    return {
      initialTagWithBookmarkSet,
      totalTagCount,
      updateBookmarkListView,
    };
  },
});
</script>

<template>
  <aside>
    <header class="user-info">
      <h2 class="nickname">닉네임</h2>
      <h3 class="email">peekabook@gmail.com</h3>
    </header>
    <section class="bookmark-add">
      <BaseButton>북마크 추가하기</BaseButton>
    </section>
    <nav class="bookmark-navigator">
      <div class="tag-total" @click="updateBookmarkListView({})">
        <span>전체</span>
        <span>{{ totalTagCount }}</span>
      </div>
      <ul v-if="Object.keys(initialTagWithBookmarkSet).length" class="tag-list">
        <li
          class="tag-item"
          v-for="(value, key) of initialTagWithBookmarkSet"
          :key="key"
          @click="
            updateBookmarkListView({ tagName: key as string, bookmarkList: value.bookmarkList })
          "
        >
          <span>{{ key }}</span>
          <span>{{ value?.bookmarkList?.length }}</span>
        </li>
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
</template>

<style lang="scss" scoped>
aside {
  position: fixed;
  width: 240px;
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
  .tag-total {
    margin-bottom: 8px;

    display: flex;
    justify-content: space-between;

    background: #f8f9fa;
    border-radius: 12px;

    padding: 12px;
    margin-left: 12px;
    margin-right: 14px;

    line-height: 16px;

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

  .tag-list {
    margin: 0;
    padding: 0;
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
