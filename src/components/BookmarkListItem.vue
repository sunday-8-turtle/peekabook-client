<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { Bookmark } from '@/types/bookmark.types';

export default defineComponent({
  name: 'BookmarkListItem',
  components: {},
  props: {
    bookmark: {
      type: Object as PropType<Bookmark>,
      required: true,
    },
  },
  setup(props) {
    const defaultImgSrc = computed(() => {
      return require('../assets/peekabook-empty-card-img.png');
    });
    const setDefaultImage = (e: Event) => {
      (e.target as HTMLImageElement).src =
        '../assets/peekabook-empty-card-img.png';
    };

    const humanizedNotiDate = computed(() => {
      return props.bookmark.notidate;
    });

    return {
      defaultImgSrc,
      setDefaultImage,
      humanizedNotiDate,
    };
  },
});
</script>

<template>
  <article class="bookmark-card">
    <header class="bookmark-img-box">
      <img
        v-if="bookmark.image"
        @error="setDefaultImage"
        :src="bookmark.image"
        alt="bookmark imgae"
      />
      <img v-else :src="defaultImgSrc" alt="default image" />
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
        <div class="save-date">NO DATA YET</div>
        <div class="noti-date">
          {{ humanizedNotiDate }}
        </div>
      </div>
      <div class="actions"></div>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
.bookmark-card {
  min-height: 303px;

  background: #ffffff;
  border: 1px solid rgba(33, 37, 41, 0.08);
  border-radius: 16px;
  box-shadow: 0px 8px 24px 4px rgba(164, 181, 198, 0.12);
}

.bookmark-img-box {
  height: 148px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    transition: 200ms ease-in-out;

    &:hover {
      transform: scale(1.2);
    }
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

    .save-date,
    .noti-date {
      font-weight: normal;
      font-size: 12px;
      line-height: 19px;
      color: #adb5bd;
    }
  }
}
</style>
