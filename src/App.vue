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
@import 'design/layout.scss';

#app {
  display: flex;
  flex-direction: column;
}

main#main {
  margin-top: $navbar-height;
}
</style>
