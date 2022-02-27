<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {},
  props: {
    modelValue: {
      type: String,
      required: false,
      default: '',
    },
    isSending: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup() {
    return {};
  },
});
</script>

<template>
  <input
    ref="input"
    class="base-input"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped lang="scss">
.base-input {
  width: 100%;
  height: 100%;
  padding: 0 12px;

  border: 1px solid #ced4da;
  border-radius: 4px;

  color: #868e96;
  font-size: 16px;

  caret-color: #ff69b4;

  &:disabled {
    background-color: #e9ecef;
    color: #ced4da;
    cursor: not-allowed;
  }
}

.base-input::placeholder {
  font-size: 16px;
  color: #ced4da;
}
</style>
