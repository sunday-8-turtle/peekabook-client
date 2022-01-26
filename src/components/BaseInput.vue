<script lang="ts">
import { defineComponent, PropType } from 'vue';

type InputType = 'text' | 'email' | 'password';

export default defineComponent({
  props: {
    type: {
      type: String as PropType<InputType>,
      required: false,
      default: '',
    },
    value: {
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
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="wrapper">
    <input
      :type="type"
      :value="value"
      :placeholder="placeholder"
      class="base-input"
      :class="{ 'btn-padding': isBtnRequired }"
    />
    <button v-if="isBtnRequired" class="internal-btn">인증메일 발송</button>
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
  font-size: 11px;
  font-style: normal;
  font-weight: normal;
  border: 1px solid #ced4da;
  border-radius: 50px;
  margin-right: 12px;
  color: #ced4da;
  background: #ffffff;
  transform: translateY(-50%);
  // font-family: Pretendard;
  padding: 0 9.5px;
  // letter-spacing: -0.46px;
  cursor: pointer;
}
</style>
