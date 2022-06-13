<template>
  <TheGnb />
  <main id="main">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import TheGnb from '@/components/TheGnb.vue';
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

#main {
  margin-top: $navbar-height;
}
</style>
