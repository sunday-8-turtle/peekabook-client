<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';

export default defineComponent({
  name: 'BookmarkModal',
  components: { BaseModal, BaseButton, BaseInput },
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
  <BaseModal ref="baseModal" id="bookmark-modal" type="confirm">
    <header>
      <div class="bookmark-modal-logo">
        <img src="@/assets/peekabook-logo-title.svg" alt="피카북 로고" />
      </div>
      <div class="bookmark-modal-notification">
        <img src="@/assets/icons/bell.svg" alt="알람 설정 아이콘" />
        <!-- (todo) 알림 설정 논의 필요 -->
      </div>
    </header>
    <main>
      <h1 class="bookmark-modal-title">제목</h1>
      <form action="">
        <BaseInput />
        <textarea />
        <BaseInput />
      </form>
    </main>
    <footer class="modal-confirm-footer">
      <BaseButton class="cancel-btn" @click="close">취소</BaseButton>
      <BaseButton class="confirm-btn" @click="$emit('confirm')"
        >저장</BaseButton
      >
    </footer>
  </BaseModal>
</template>

<style lang="scss">
@import '@/design/_responsive.scss';

#bookmark-modal {
  padding: 24px !important;
  width: 320px;
  height: 404px;

  @include respond-to(tablet) {
    min-width: 320px;
    padding: 0px 20px 20px 20px;
  }

  header {
    margin-bottom: 12px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .bookmark-modal-logo {
      width: 84px;
      height: 20px;

      img {
        width: 100%;
        height: auto;
      }
    }

    .bookmark-modal-notification {
      width: 28px;
      height: 28px;

      display: flex;
      justify-content: center;
      align-items: center;

      border: 1px solid #dee2e6;
      box-sizing: border-box;
      border-radius: 99px;

      img {
        width: 20px;
        height: 20px;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  main {
    .bookmark-modal-title {
      font-weight: 600;
      font-size: 17px;
      line-height: 26px;
      color: #343a40;

      margin-top: 0px;
      margin-bottom: 20px;
    }
  }
}
</style>
