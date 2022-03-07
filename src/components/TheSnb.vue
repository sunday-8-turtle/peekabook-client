<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import BaseButton from './BaseButton.vue';

import { getTagList, getBookmarkListByTag } from '@/api/bookmark';
import { PKBResponse } from '@/types';
import { Tag, Bookmark } from '@/types/bookmark.types';

export default defineComponent({
  name: 'TheSnb',
  components: {
    BaseButton,
  },
  setup() {
    const tagList: Ref<{ tag: Tag; bookmarkCount: number }[]> = ref([]);

    (async () => {
      const res = await getTagList();
      const rawTagList = res.data ? res.data : [];

      const requests = [] as Promise<PKBResponse<Bookmark[]>>[];
      for (const tag of rawTagList) {
        requests.push(getBookmarkListByTag(tag.tagId));
      }
      const responseList = await Promise.all(requests);

      for (let i = 0; i <= rawTagList.length - 1; i++) {
        const bookmarkCount = responseList[i]?.data?.length ?? 0;
        tagList.value.push({
          tag: rawTagList[i],
          bookmarkCount,
        });
      }
    })();

    return {
      tagList,
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
      <div class="tag-total">
        <span>전체</span>
        <span>1</span>
      </div>
      <ul v-if="tagList.length" class="tag-list">
        <li v-for="data in tagList" :key="data.tag.tagId" class="tag-item">
          <span>{{ data.tag.tagName }}</span>
          <span>{{ data.bookmarkCount }}</span>
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
