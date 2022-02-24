<script lang="ts">
import { ref, Ref, reactive, defineComponent } from 'vue';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';

import {
  ResetPasswordResponse,
  ResetNicknameResponse,
} from '@/types/profile.types';
import { resetNickname, resetPassword, getProfile } from '@/api/profile';

export default defineComponent({
  name: 'ProfileView',
  components: { BaseInput, BaseButton, ModalConfirm },
  props: {},
  setup() {
    /**
     * Profile
     */
    const profile = ref({
      email: '',
      nickname: '',
    });

    /**
     * Modal
     */
    const modalConfirm = ref<InstanceType<typeof ModalConfirm>>();
    const openModal = () => modalConfirm.value?.open();

    /**
     * Form
     */
    const messageList: Ref<string[]> = ref([]);
    const setMessage = (error: string) => messageList.value.push(error);
    const resetMessageList = () => (messageList.value = []);

    const isSubmitting = ref(false);
    const formData = reactive({
      nickname: '',
      password: '',
      beforePassword: '',
    });
    const onSubmit = async (e: Event) => {
      resetMessageList();

      if (isSubmitting.value) {
        setMessage('이미 요청하였습니다. 잠시만 기다려주세요.');
        return;
      }

      // validation - empty
      if (!formData.nickname) {
        setMessage('닉네임을 입력하세요.');
      }
      if (
        (formData.password && !formData.beforePassword) ||
        formData.password !== formData.beforePassword
      ) {
        setMessage('비밀번호가 일치하지 않습니다.');
      }
      /**
       * validation - constraints
       * nickname: 최대 10자
       * password: ...
       */
      if (formData.nickname.length > 10) {
        setMessage('닉네임은 최대 10자까지만 가능합니다.');
      }
      if (messageList.value.length) return;

      const requests = [] as Promise<
        ResetNicknameResponse | ResetPasswordResponse
      >[];
      requests.push(resetNickname(formData));
      if (formData.password) requests.push(resetPassword(formData));

      try {
        isSubmitting.value = true;
        await Promise.all(requests);
        setMessage('변경사항이 저장되었습니다.');
      } catch (e) {
        console.log(e);
      }

      isSubmitting.value = false;
    };

    /**
     * initial requests
     */
    (async () => {
      try {
        const response = await getProfile();
        profile.value = response.data;

        formData.nickname = profile.value.nickname;
      } catch (err) {
        console.error(err);
      }
    })();

    return {
      profile,

      modalConfirm,
      openModal,

      messageList,
      isSubmitting,
      formData,
      onSubmit,
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
      <form @submit.prevent="onSubmit">
        <div class="input-wrapper">
          <label for="nickname">닉네임</label>
          <BaseInput
            name="nickname"
            type="text"
            autofocus
            v-model="formData.nickname"
          />
        </div>
        <div class="input-wrapper">
          <label for="email">이메일</label>
          <BaseInput
            name="email"
            type="email"
            :value="profile.email"
            disabled
          />
        </div>
        <div class="input-wrapper">
          <label for="new-password">변경 비밀번호</label>
          <BaseInput
            name="new-password"
            type="password"
            placeholder="변경 비밀번호 입력"
            v-model="formData.password"
          />
        </div>
        <div class="input-wrapper">
          <label for="current-password">현재 비밀번호</label>
          <BaseInput
            name="current-password"
            type="password"
            autocomplete="current-password"
            v-model="formData.beforePassword"
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
    <div class="snackbar-wrapper">
      <TransitionGroup name="snackbar" tag="ul">
        <li class="snackbar" v-for="error in messageList" :key="error">
          {{ error }}
        </li>
      </TransitionGroup>
    </div>
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

.snackbar-wrapper {
  position: fixed;
  top: 0;
  left: calc(50% + 256px);

  width: fit-content;
  height: 100vh;

  display: flex;
  flex-direction: column;
  margin-left: 56px;

  ul {
    margin: 0;
    padding: 0;
  }
}
.snackbar {
  display: flex;
  align-items: center;

  height: 48px;
  padding: 12px 32px;
  margin-bottom: 40px;

  background: #343a40;
  color: white;
  opacity: 0.85;

  border-radius: 99px;
}

.snackbar-move,
.snackbar-enter-active {
  transition: all 0.5s ease;
}
.snackbar-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

// .snackbar-leave-to {
//   opacity: 0;
//   transform: translateY(30px);
// }
</style>
