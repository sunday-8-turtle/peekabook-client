<script lang="ts">
import { defineComponent } from 'vue';
import TheSnb from '@/components/TheSnb.vue';
import BookmarkList from '@/components/BookmarkList.vue';
import TheFooter from '@/components/TheFooter.vue';

export default defineComponent({
  name: 'MainView',
  components: {
    TheSnb,
    BookmarkList,
    TheFooter,
  },
  props: {},
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="wrapper">
    <TheSnb />
    <BookmarkList />
  </div>
  <TheFooter />
</template>

<style lang="scss" scoped>
$the-snb-width: 240px;
$the-nav-height: 72px;
$the-footer-height: 88px;
$the-global-top-padding: 56px;

.wrapper {
  max-width: 1440px;
  min-height: calc(100vh - $the-nav-height - $the-global-top-padding - 48px);

  padding: 0 120px;
  margin: 0 auto;
  margin-top: 48px;
}
</style>
