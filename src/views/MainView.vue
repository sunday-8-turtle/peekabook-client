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
.wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 120px;
}
</style>
