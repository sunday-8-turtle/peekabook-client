<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TheFooter',
  components: {},
  setup() {
    return {};
  },
});
</script>

<template>
  <footer>
    <nav>
      <ul>
        <li>이용약관</li>
        <li></li>
        <li>개인정보처리방침</li>
        <li></li>
        <li>ⓒ peekabook All Rights Reserved.</li>
      </ul>
    </nav>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  background: #ffffff;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;

  height: 88px;

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  nav {
    display: flex;
    align-items: center;
  }

  ul {
    display: flex;
  }

  li {
    font-size: 13px;
    line-height: 20px;
    color: #868e96;
  }

  li:not(:last-child) {
    margin-right: 16px;
  }

  li:nth-child(even) {
    width: 1.33px;
    background: #dee2e6;
  }
}
</style>
