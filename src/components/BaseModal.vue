<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue';
const attrs = useAttrs();

type ModalType = 'auth' | 'confirm';

const props = defineProps<{ type?: ModalType; onClose?: () => void }>();
const emit = defineEmits(['close-modal']);

const modalWrapper = ref<HTMLDivElement | null>(null);
const modal = ref<HTMLElement | null>(null);

const open = () => {
  document.body.style.overflow = 'hidden';
  if (!modalWrapper.value || !modal.value) return;

  modalWrapper.value.classList.add('black-out');
  modal.value.setAttribute('open', '');
  document.addEventListener('keydown', setEscKeydownEvent);
};
const close = () => {
  document.body.style.overflow = 'auto';
  if (!modalWrapper.value || !modal.value) return;

  modalWrapper.value.classList.remove('black-out');
  modal.value.removeAttribute('open');
  document.removeEventListener('keydown', setEscKeydownEvent);

  if (props.onClose) props.onClose();
  emit('close-modal');
};

const preventModalClosing = (e: MouseEvent) => e.stopPropagation();
const setEscKeydownEvent = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return;
  close();
};

defineExpose({ open, close });
</script>

<template>
  <div ref="modalWrapper" class="modal-wrapper">
    <dialog
      ref="modal"
      class="modal"
      aria-modal="true"
      v-bind="attrs"
      @click="preventModalClosing"
    >
      <button
        v-if="type !== 'confirm'"
        class="close-btn"
        aria-label="Close Modal"
        @click="close"
      >
        <img src="@/assets/icons/close-modal.svg" alt="close-modal-btn" />
      </button>
      <slot></slot>
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/design/_responsive.scss';

.modal-wrapper {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1010;

  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);

  &.black-out {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.modal {
  width: 100%;
  height: 100%;
  border-radius: 0;

  position: relative;
  padding: 40px;
  opacity: 0;
  z-index: 1011;

  background: #ffffff;
  border: 1px solid #e9ecef;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);

  pointer-events: none;

  &[open] {
    opacity: 1;
    pointer-events: auto;
  }

  @include respond-to(tablet) {
    min-width: 464px;
    height: unset;
    border-radius: 12px;
  }
}

.close-btn {
  position: absolute;
  top: 35px;
  right: 35px;

  border: none;
  background: none;
  cursor: pointer;
}
</style>
