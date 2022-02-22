<script lang="ts">
import { ref, defineComponent } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';

export default defineComponent({
  name: 'ProfileView',
  components: { BaseInput, BaseButton, ModalConfirm },
  props: {},
  setup() {
    const isSubmitting = ref(false);
    const modalConfirm = ref<InstanceType<typeof ModalConfirm>>();
    const openModal = () => modalConfirm.value?.open();

    return {
      isSubmitting,
      modalConfirm,
      openModal,
    };
  },
});
</script>

<template>
  <main class="wrapper">
    <header>
      <h1 class="title">설정하기</h1>
    </header>
    <section>
      <form @submit.prevent>
        <div class="input-wrapper">
          <label for="nickname">닉네임</label>
          <BaseInput
            name="nickname"
            type="text"
            value="현재 유저의 닉네임"
            autofocus
          />
        </div>
        <div class="input-wrapper">
          <label for="email">이메일</label>
          <BaseInput
            name="email"
            type="email"
            value="현재 유저의 이메일"
            disabled
          />
        </div>
        <div class="input-wrapper">
          <label for="new-password">변경 비밀번호</label>
          <BaseInput
            name="new-password"
            type="password"
            placeholder="변경 비밀번호 입력"
          />
        </div>
        <div class="input-wrapper">
          <label for="current-password">현재 비밀번호</label>
          <BaseInput
            name="current-password"
            type="password"
            autocomplete="current-password"
            placeholder="현재 비밀번호 입력"
          />
        </div>
        <BaseButton
          type="submit"
          class="submit-btn"
          :fontSize="'18px'"
          :isLoading="isSubmitting"
          >저장</BaseButton
        >
      </form>
    </section>
    <footer>
      <button @click="openModal" type="button" class="resign-btn">
        탈퇴하기
      </button>
    </footer>
  </main>
  <ModalConfirm ref="modalConfirm" id="modal-confirm">
    <header>
      <p>모든 즐겨찾기 기록이 사라집니다.</p>
      <p>정말로.. 탈퇴하시나요?</p>
    </header>
  </ModalConfirm>
</template>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  width: 512px;
  height: 612px;
  padding: 56px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;

  .title,
  form {
    width: 400px;
  }
}

.title {
  font-size: 28px;
  line-height: 44px;
  color: #343a40;
  margin-top: 0px;
  margin-bottom: 32px;
}

form {
  .input-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    &:last-of-type {
      margin-bottom: 48px;
    }

    label {
      font-size: 14px;
      color: #868e96;
    }

    input {
      width: 280px;
      height: 48px;
      padding: 11px 25px 13px 11px;
      color: #343a40;
    }
  }

  .submit-btn {
    height: 56px;
    margin-bottom: 32px;
  }
}

footer {
  display: flex;
  justify-content: center;
  .resign-btn {
    margin: 0 auto;
    font-size: 14px;
    text-decoration-line: underline;
    border: none;
    color: #ced4da;
    background: none;

    &:hover {
      cursor: pointer;
    }
  }
}

#modal-confirm {
  header {
    height: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      margin: 0;
      font-size: 17px;
      line-height: 26px;
      color: #343a40;
      font-weight: 600;
    }
  }
}
</style>
