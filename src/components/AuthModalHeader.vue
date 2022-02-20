<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthModalHeader',
  components: {},
  props: {},
  setup() {
    return {};
  },
});
</script>

<template>
  <header class="modal-header">
    <img
      class="logo"
      src="@/assets/logo.svg"
      alt="logo"
      width="184"
      height="33"
    />
    <p class="message">피카북에 오신 것을 환영합니다!</p>
  </header>
</template>

<style lang="scss" scoped>
.modal-header {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img.logo {
    width: 184px;
    height: 33px;
  }

  p.message {
    margin-top: 16px;
    margin-bottom: 0;

    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 140%;
    color: #343a40;
  }
}
</style>
