<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'LandingPageSection',
  components: {},
  props: {
    // 첫번째 섹션: Navbar를 제외한 전체 높이
    // 나머지 섹션: 560px
    isFirst: {
      type: Boolean,
      default: false,
    },
    // 이미지를 포함하는 수평 레이아웃 여부
    hasImage: {
      type: Boolean,
      default: false,
    },
    // 수평 레이아웃에서 이미지의 위치 설정
    imagePosition: {
      type: String as PropType<'left' | 'right'>,
      default: 'right',
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <section :class="{ 'h-full': isFirst }">
    <div class="container" :class="{ horizontal: hasImage }">
      <div class="text" :class="{ 'text-left': hasImage }">
        <slot></slot>
      </div>
      <div
        v-if="hasImage"
        class="image"
        :class="{ left: imagePosition === 'left' }"
      >
        <slot name="image"></slot>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/design/layout.scss';

section {
  width: 100%;
  height: 560px;

  display: flex;
  justify-content: center;

  &.h-full {
    height: calc(100vh - $navbar-height);
  }

  .container {
    width: 100%;
    max-width: 1440px;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    &.horizontal {
      justify-content: space-around;

      .text {
        width: 50%;
      }
    }

    .text {
      width: 100%;
      height: 100%;
      position: relative;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image {
      width: 50%;
      height: 100%;

      display: flex;
      justify-content: flex-start;
      align-items: center;

      &.left {
        justify-content: flex-end;
        order: -1;
      }
    }
  }
}
</style>
