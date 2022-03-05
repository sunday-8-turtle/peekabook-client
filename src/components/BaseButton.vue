<script lang="ts">
import { defineComponent, PropType } from 'vue';

import BaseLottie from '@/components/BaseLottie.vue';

type Shape = 'fill' | 'line';

export default defineComponent({
  name: 'BaseButton',
  components: { BaseLottie },
  props: {
    shape: {
      type: String as PropType<Shape>,
      required: false,
      default: 'fill',
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
    fontSize: {
      type: String,
      default: '14px',
    },
    loaderSize: {
      type: String,
      default: '18px',
    },
  },
  setup(props) {
    const customStyle = {
      'font-size': props.fontSize,
    };
    return { customStyle };
  },
});
</script>

<template>
  <button class="base-button" :class="shape" :style="[customStyle]">
    <BaseLottie
      v-if="isLoading"
      name="loading-btn"
      :width="loaderSize"
      :height="loaderSize"
    />
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  border-radius: 4px;

  font-family: Pretendard;
  font-style: normal;
  font-size: 18px;
  line-height: 140%;
  cursor: pointer;

  &.line {
    color: #ff69b4;
    background: #ffffff;
    border: 1px solid #ff69b4;
    font-weight: normal;
  }

  &.fill {
    color: #ffffff;
    background: #ff69b4;
    border: 1px solid #ff69b4;
    font-weight: bold;
  }

  &:disabled {
    color: #ffffff;
    background: #ced4da;
    border: 1px solid #ced4da;
    cursor: not-allowed;
  }
}
</style>
