<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

type InputType = 'text' | 'email' | 'password';

export default defineComponent({
  components: {},
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
    name: {
      type: String,
      required: false,
      default: '',
    },
    autocomplete: {
      type: String,
      required: false,
      default: '',
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSending: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // height: {
    //   type: String,
    //   default: '100%',
    // },
    // width: {
    //   type: String,
    //   default: '100%',
    // },
  },
  emits: ['update:modelValue', 'send-certification-code'],
  setup(props) {
    const input = ref<InstanceType<typeof HTMLInputElement>>();

    const customSize = computed(() => {
      return {
        // width: props.width,
        // height: props.height,
      };
    });

    return { input, customSize };
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
    :style="[customSize]"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    :autocomplete="autocomplete"
    :required="required"
    :disabled="disabled"
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
