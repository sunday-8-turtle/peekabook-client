<script lang="ts">
import { ref, defineComponent } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';

export default defineComponent({
  name: 'ModalConfirm',
  components: { BaseButton, BaseModal },
  emits: ['confirm'],
  props: {
    cancelMsg: {
      type: String,
      required: false,
      default: '취소',
    },
    confirmMsg: {
      type: String,
      required: false,
      default: '네',
    },
    reversed: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableConfirm: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    const open = () => baseModal.value?.open();
    const close = () => baseModal.value?.close();

    return {
      baseModal,
      open,
      close,
    };
  },
});
</script>

<template>
  <BaseModal id="modal-confirm" type="confirm" ref="baseModal">
    <slot class="modal-confirm-body"></slot>
    <footer class="modal-confirm-footer">
      <template v-if="!reversed">
        <BaseButton class="cancel-btn" @click="close">{{
          cancelMsg
        }}</BaseButton>
        <BaseButton
          :disabled="disableConfirm"
          class="confirm-btn"
          @click="$emit('confirm')"
          >{{ confirmMsg }}</BaseButton
        >
      </template>
      <template v-else>
        <BaseButton
          :disabled="disableConfirm"
          class="confirm-btn"
          @click="$emit('confirm')"
          >{{ confirmMsg }}</BaseButton
        >
        <BaseButton class="cancel-btn" @click="close">{{
          cancelMsg
        }}</BaseButton>
      </template>
    </footer>
  </BaseModal>
</template>

<style lang="scss">
@import '@/design/_responsive.scss';

#modal-confirm {
  height: unset;
  width: 320px;
  padding: 0px 20px 20px 20px;

  @include respond-to(tablet) {
    min-width: 320px;
    padding: 0px 20px 20px 20px;
  }
}

.modal-confirm-footer {
  display: flex;
  justify-content: space-between;

  .cancel-btn,
  .confirm-btn {
    width: 132px;
    height: 48px;
    font-size: 15px;
  }

  .cancel-btn {
    color: #343a40;
    background: #e9ecef;
    border: 1px solid #e9ecef;
  }

  .confirm-btn:disabled {
    color: #ced4da;
    background: #e9ecef;
    border: none;
  }
}
</style>
