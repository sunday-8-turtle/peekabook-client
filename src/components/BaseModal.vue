<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';

type ModalType = 'signup' | 'login';

export default defineComponent({
  name: 'BaseModal',
  props: {
    modalType: {
      type: String as PropType<ModalType>,
      required: false,
    },
  },
  emits: ['close-modal'],
  setup(props) {
    const modalWrapper = ref<HTMLDivElement>();
    const modal = ref<HTMLElement>();

    return { modalWrapper, modal };
  },
  methods: {
    open() {
      // console.log(document.activeElement);

      // if (!this.modal) return;
      // const buttons = this.getAllFocusableButtons(this.modal);
      // const firstButton = this.getFirstFocusableButton(buttons);
      // console.log('buttons', buttons);
      // console.log('firstButton', firstButton);

      this.modalWrapper?.classList.add('black-out');
      this.modal?.setAttribute('open', '');
      document.addEventListener('keydown', this.setEscKeydownEvent);
    },
    close() {
      this.modalWrapper?.classList.remove('black-out');
      this.modal?.removeAttribute('open');
      document.removeEventListener('keydown', this.setEscKeydownEvent);
      this.$emit('close-modal');
    },
    preventModalClosing(e: PointerEvent) {
      e.stopPropagation();
    },
    setEscKeydownEvent(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      this.close();
    },
    // getAllFocusableButtons(modal: HTMLElement) {
    //   return Array.from(modal.querySelectorAll('button'));
    // },
    // getFirstFocusableButton(buttons: HTMLButtonElement[]) {
    //   if (buttons.length === 0) return;
    //   return buttons[0];
    // },
  },
});
</script>

<template>
  <div ref="modalWrapper" class="modal-wrapper" @click="close">
    <dialog
      ref="modal"
      class="modal"
      :class="modalType"
      aria-modal="true"
      @click="preventModalClosing"
    >
      <button class="close-btn" aria-label="Close Modal" @click="close">
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
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1010;

  width: 100%;
  height: 100%;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.6);

  &.black-out {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.modal {
  position: relative;
  padding: 35px;
  opacity: 0;
  z-index: 1011;

  background: #ffffff;
  border: 1px solid #e9ecef;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 12px;

  pointer-events: none;

  &[open] {
    opacity: 1;
    pointer-events: auto;
  }
}

.signup {
  width: 100%;
  height: 700px;

  @include respond-to(tablet) {
    width: 590px;
  }

  @include respond-to(desktop) {
    width: 590px;
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
