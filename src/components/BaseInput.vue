<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

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
  emits: ['update:modelValue', 'send-certification-code'],
  setup(props) {
    const input = ref<InstanceType<typeof HTMLInputElement>>();

    return { input };
  },
  methods: {
    isEligibleForSendCode() {
      if (!this.input) {
        console.error('Input 엘리먼트를 찾을 수 없습니다.');
        return false;
      }
      if (!this.input.checkValidity()) {
        console.error('이메일 형식이 올바르지 않습니다.');
        return false;
      }

      return true;
    },
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

  &:focus {
    outline: 1px solid #868e96;
  }

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
