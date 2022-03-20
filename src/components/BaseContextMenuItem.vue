<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseContextMenuItem',
  components: {},
  setup() {
    return {};
  },
});
</script>

<template>
  <li>
    <slot></slot>
  </li>
</template>

<style lang="scss" scoped>
li {
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 15px;
  line-height: 24px;
  letter-spacing: -0.3px;
  color: #343a40;

  cursor: pointer;

  // &:hover {
  //   background: #f8f9fa;
  //   mix-blend-mode: darken;
  // }
}
</style>
