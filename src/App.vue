<template>
  <TheGnb />
  <main id="main">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import TheGnb from '@/components/TheGnb.vue';

export default defineComponent({
  name: 'App',
  components: { TheGnb },
});
</script>

<style lang="scss">
@import 'design/_normalize.css';
@import 'design/_typography.scss';
@import 'design/_responsive.scss';

#app {
  display: flex;
  flex-direction: column;
}

#main {
  margin-top: 72px;
  display: flex;
  flex-direction: column;
}
</style>
