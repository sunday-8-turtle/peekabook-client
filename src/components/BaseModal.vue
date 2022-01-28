<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseModal',
  props: {
    width: {
      type: Number, // ex) 500 -> '500px'
      required: false,
    },
    height: {
      type: Number, // ex) 600 -> '600px'
      required: false,
    },
  },
  computed: {
    customSize() {
      return {
        width: this.width ? `${this.width}px` : '100%',
        height: this.height ? `${this.height}px` : '100%',
      };
    },
  },
  data() {
    return {
      modalWrapper: null as HTMLDivElement | null,
      modal: null as HTMLElement | null,
    };
  },
  mounted() {
    this.modalWrapper = document.querySelector('.modal-wrapper');
    this.modal = document.querySelector('.modal');
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
  <div class="modal-wrapper" @click="close">
    <dialog
      class="modal"
      :style="[customSize]"
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
.modal-wrapper {
  display: none;
  position: absolute;
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
  position: relative;
  width: 590px;
  height: 700px;
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

.close-btn {
  position: absolute;
  top: 35px;
  right: 35px;

  border: none;
  background: none;
  cursor: pointer;
}
</style>
