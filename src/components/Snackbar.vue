<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Snackbar',
  props: {
    message: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: false,
      default: 'top',
    },
  },
});
</script>

<template>
  <dialog v-if="message" class="snackbar-wrapper">
    <p class="snackbar">
      {{ message }}
    </p>
  </dialog>
</template>

<style lang="scss" scoped>
.snackbar-wrapper {
  z-index: 500;
  height: fit-content;
  width: fit-content;

  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;

  position: fixed;
  top: 108px;
  left: 50%;
  transform: translateX(-50%);

  border-color: #343a40;
  border-radius: 99px;
  background: #343a40;
  color: white;
  opacity: 0.85;

  p.snackbar {
    width: fit-content;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 12px 32px;
  }
}
</style>
