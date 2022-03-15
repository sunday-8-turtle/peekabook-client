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
        <li>
          <a
            class="link"
            href="https://www.notion.so/bside/85cf94e445724821a8e4ca10e397a480"
            target="_blank"
            >이용약관</a
          >
        </li>
        <li></li>
        <li>
          <a
            class="link"
            href="https://www.notion.so/bside/092bf11f20634880b0a4674c89aa4ec0"
            target="_blank"
            >개인정보처리방침</a
          >
        </li>
        <li></li>
        <li>ⓒ peekabook All Rights Reserved.</li>
      </ul>
    </nav>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  // position: fixed;
  margin-top: 48px;
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

    .link {
      color: inherit;
      text-decoration: none;
    }
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
