<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

type InputType = 'text' | 'email' | 'password';

export default defineComponent({
  props: {
    type: {
      type: String as PropType<InputType>,
      required: false,
      default: '',
    },
    modelValue: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    isBtnRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['update:modelValue', 'send-certification-code'],
  setup() {
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
    onClickInternalBtn() {
      if (!this.isEligibleForSendCode()) {
        alert('이메일 형식을 확인해주세요.');
        return;
      }
      this.$emit('send-certification-code');
    },
  },
});
</script>

<template>
  <div class="wrapper">
    <input
      ref="input"
      :type="type"
      :placeholder="placeholder"
      class="base-input"
      :class="{ 'btn-padding': isBtnRequired }"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      v-if="isBtnRequired"
      class="internal-btn"
      @click.prevent="onClickInternalBtn"
    >
      인증메일 발송
    </button>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  width: 390px;
  height: 56px;
}

.base-input {
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0 12px;
  color: #868e96;
  font-size: 16px;
  width: 100%;
  height: 100%;

  &:disabled {
    background-color: #e9ecef;
  }
}

.base-input::placeholder {
  font-size: 16px;
  color: #ced4da;
}

.btn-padding {
  padding-right: 102px;
}

.internal-btn {
  position: absolute;
  top: 50%;
  right: 0;
  width: 78px;
  height: 32px;
  transform: translateY(-50%);
  font-size: 11px;
  font-family: Pretendard;
  font-style: normal;
  font-weight: normal;
  letter-spacing: -0.46px;
  border: 1px solid #ced4da;
  border-radius: 50px;
  padding: 0 9.5px;
  margin-right: 12px;
  color: #ced4da;
  background: #ffffff;
  cursor: pointer;
}
</style>
