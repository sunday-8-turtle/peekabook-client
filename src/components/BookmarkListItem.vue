<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue';

import BaseContextMenu from '@/components/BaseContextMenu.vue';
import BaseContextMenuItem from '@/components/BaseContextMenuItem.vue';

import { Bookmark } from '@/types/bookmark.types';
import truncate from '@/directives/truncate';

export default defineComponent({
  name: 'BookmarkListItem',
  components: { BaseContextMenu, BaseContextMenuItem },
  props: {
    bookmark: {
      type: Object as PropType<Bookmark>,
      required: true,
    },
  },
  emits: ['open-modal-confirm', 'open-modal-bookmark'],
  setup(props) {
    const goToArticle = () => {
      window.open(props.bookmark.url, '_blank');
    };

    // bookmark image
    const defaultImgSrc = computed(() => {
      return require('../assets/peekabook-empty-card-img.png');
    });
    const setDefaultImage = (e: Event) => {
      (
        e.target as HTMLImageElement
      ).src = require('../assets/peekabook-empty-card-img.png');
    };

    /**
     * humanization for notidate
     * @returns { number } notidate 값을 현재 시점으로부터 남은 일 수로 변환하여 반환합니다.
     */
    const humanizedNotiDate = computed(() => {
      const today = new Date();
      const notidate = new Date(props.bookmark.notidate as string);
      const totalRemainTime = notidate.getTime() - today.getTime();
      const denominatorForDaysinSecond = {
        milisecond: 1000,
        oneMinute: 60,
        oneHour: 60,
        oneDay: 24,
      };
      const remainDays = Math.ceil(
        totalRemainTime /
          Object.values(denominatorForDaysinSecond).reduce(
            (acc, denominator) => {
              return acc * denominator;
            },
            1
          )
      );

      return remainDays;
    });

    // context menu
    const userContextMenu = ref<InstanceType<typeof BaseContextMenu>>();
    const toggleUserContextMenu = () => userContextMenu.value?.toggle();

    return {
      goToArticle,

      defaultImgSrc,
      setDefaultImage,

      humanizedNotiDate,

      userContextMenu,
      toggleUserContextMenu,
    };
  },
  directives: {
    truncate,
  },
});
</script>

<template>
  <article class="bookmark-card">
    <header class="bookmark-img-box" @click="goToArticle">
      <img
        v-if="bookmark.image"
        @error="setDefaultImage"
        :src="bookmark.image"
        alt="bookmark image"
      />
      <img v-else :src="defaultImgSrc" alt="default image" />
      <ul v-if="bookmark.tags.length" class="bookmark-tag-box">
        <li v-truncate v-for="tag in bookmark.tags" :key="tag">#{{ tag }}</li>
      </ul>
    </header>
    <main class="bookmark-info">
      <h2 class="bookmark-title">
        {{ bookmark.title }}
      </h2>
      <p class="bookmark-description">
        {{ bookmark.description }}
      </p>
    </main>
    <footer>
      <div class="date">
        <div class="save-date">{{ bookmark.createdDate }}</div>
        <template v-if="humanizedNotiDate > 0">
          <div class="v-divider"></div>
          <div class="noti-date">{{ humanizedNotiDate }}일 후 알림</div>
        </template>
      </div>
      <div class="actions" @click="toggleUserContextMenu">
        <img
          src="@/assets/icons/dots-vertical.svg"
          alt="카드 수정 및 삭제를 위한 액션 아이콘"
        />
        <BaseContextMenu class="bookmark-item-context" ref="userContextMenu">
          <BaseContextMenuItem @click="$emit('open-modal-bookmark', bookmark)"
            >수정하기</BaseContextMenuItem
          >
          <BaseContextMenuItem @click="$emit('open-modal-confirm', bookmark)"
            >삭제하기</BaseContextMenuItem
          >
        </BaseContextMenu>
      </div>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
.bookmark-card {
  height: 303px;
  min-height: 303px;
  width: 288px;
  max-width: 288px;

  background: #ffffff;
  border: 1px solid rgba(33, 37, 41, 0.08);
  border-radius: 16px;
  box-shadow: 0px 8px 24px 4px rgba(164, 181, 198, 0.12);
}

.bookmark-img-box {
  width: 100%;
  height: 148px;
  overflow: hidden;
  position: relative;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  img {
    width: 100%;
    height: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    transition: 200ms ease-in-out;
    object-fit: cover;
  }

  .bookmark-tag-box {
    transform: translateY(100%);
    transition: 200ms ease-in-out;

    display: none;
    position: absolute;
    bottom: 0;

    width: 288px;
    padding: 10px 20px;
    margin: 0;

    display: flex;
    background: rgba(0, 0, 0, 0.7);

    li {
      list-style: none;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
    }

    li:not(:last-child) {
      margin-right: 8px;
    }
  }

  &:hover {
    cursor: pointer;
  }

  &:hover img {
    transform: scale(1.2);
  }

  &:hover .bookmark-tag-box {
    transform: translateY(0%);
  }
}

.bookmark-info {
  margin: 0 24px;
  margin-bottom: 20px;

  .bookmark-title,
  .bookmark-description {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bookmark-title {
    margin-top: 24px;
    margin-bottom: 4px;

    white-space: nowrap;
    font-weight: bold;
    font-size: 17px;
    line-height: 26px;
    color: #343a40;
  }

  .bookmark-description {
    min-height: 42px;
    max-height: 42px;

    margin-top: 0px;
    margin-bottom: 20px;

    white-space: pre-wrap;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    color: #495057;
  }
}

footer {
  margin: 0 24px;
  display: flex;
  justify-content: space-between;

  .date {
    display: flex;
    align-items: center;

    .save-date,
    .noti-date {
      font-weight: normal;
      font-size: 12px;
      line-height: 19px;
      color: #adb5bd;
    }

    .v-divider {
      width: 1px;
      height: 12px;
      background: #dee2e6;
      margin: 0 8px;
    }
  }

  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 200ms ease-in-out;

    width: 24px;
    height: 24px;
    border-radius: 50%;

    position: relative;
    z-index: 200;

    &:hover {
      cursor: pointer;
      background: #f8f9fa;
    }

    &:focus,
    &:active {
      background: #f8f9fa;
    }

    img {
      width: 3.5px;
      height: 17.5px;
    }
  }
}

.bookmark-item-context {
  top: 24px;
  right: -24px !important;
}
</style>
