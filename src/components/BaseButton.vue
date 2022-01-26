<script lang="ts">
import { defineComponent, PropType } from 'vue';

type Shape = 'fill' | 'line';

export default defineComponent({
  props: {
    shape: {
      type: String as PropType<Shape>,
      required: false,
      default: 'fill',
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <button class="base-button" :class="shape">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 390px;
  height: 56px;
  border-radius: 4px;
  font-family: Pretendard;
  font-style: normal;
  font-size: 18px;
  line-height: 140%;
  cursor: pointer;
}

.line {
  color: #ff69b4;
  background: #ffffff;
  border: 1px solid #ff69b4;
  font-weight: normal;
}

.fill {
  color: #ffffff;
  background: #ff69b4;
  border: 1px solid #ff69b4;
  font-weight: bold;
}
</style>
