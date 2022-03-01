<script lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import ModalConfirm from '@/components/ModalConfirm.vue';
import Snackbar from '@/components/Snackbar.vue';

import {
  ResetPasswordResponse,
  ResetNicknameResponse,
} from '@/types/profile.types';
import {
  resetNickname,
  resetPassword,
  getProfile,
  deleteAccount,
} from '@/api/profile';

export default defineComponent({
  name: 'ProfileView',
  components: { BaseInput, BaseButton, ModalConfirm, Snackbar },
  setup() {
    const router = useRouter();
    const goToMain = () => router.push('/');

    const isSubmitting = ref(false);

    const modalConfirm = ref<InstanceType<typeof ModalConfirm>>();
    const hasConfirmed = ref(false);
    const confirmEmail = ref('');
    const openModal = () => {
      hasConfirmed.value = false;
      modalConfirm.value?.open();
    };

    const onConfirmDeleteACcount = async () => {
      if (!hasConfirmed.value) {
        hasConfirmed.value = true;
        return;
      } else {
        isSubmitting.value = true;
        await deleteAccount();
        isSubmitting.value = false;
        alert('계정이 삭제되었습니다.');
        goToMain();
      }
    };

    const formData = reactive({
      nickname: '',
      password: '',
      beforePassword: '',
    });
    const formDataErrors: { [index: string]: boolean } = reactive({
      nickname: false,
      password: false,
      beforePassword: false,
    });
    const snackbarMessage = ref();
    const MESSAEG_SET = {
      NO_NICKNAME: '닉네임을 입력하세요.',
      NO_NEW_PASSWORD: '변경 비밀번호를 입력해주세요.',
      NO_BEFORE_PASSWORD: '현재 비밀번호를 입력해주세요.',
      INVALID_NICKNAME: '닉네임은 최대 10자까지만 가능합니다.',
      REQUEST_SUCCESS: '변경사항이 저장되었습니다.',
      REQUEST_DUPLICATE: '이미 요청하였습니다. 잠시만 기다려주세요.',
    };
    const resetErrors = () => {
      Object.keys(formDataErrors).forEach((key) => {
        formDataErrors[key] = false;
      });
    };

    const onSubmit = async () => {
      snackbarMessage.value = '';
      resetErrors();

      if (isSubmitting.value) {
        snackbarMessage.value = MESSAEG_SET.REQUEST_DUPLICATE;
        return;
      }

      // (todo) 비활성화 상태 추가되면 필요 없어짐
      if (!formData.nickname) {
        snackbarMessage.value = MESSAEG_SET.NO_NICKNAME;
        formDataErrors.nickname = true;
        return;
      }

      if (formData.password && !formData.beforePassword) {
        snackbarMessage.value = MESSAEG_SET.NO_BEFORE_PASSWORD;
        formDataErrors.beforePassword = true;
        return;
      }
      if (formData.beforePassword && !formData.password) {
        snackbarMessage.value = MESSAEG_SET.NO_NEW_PASSWORD;
        formDataErrors.password = true;
        return;
      }

      if (formData.nickname.length > 10) {
        snackbarMessage.value = MESSAEG_SET.INVALID_NICKNAME;
        formDataErrors.nickname = true;
        return;
      }

      const requests = [] as Promise<
        ResetNicknameResponse | ResetPasswordResponse
      >[];
      requests.push(resetNickname(formData));
      if (formData.password) requests.push(resetPassword(formData));

      isSubmitting.value = true;
      const responseList = await Promise.all(requests);
      isSubmitting.value = false;

      for (const response of responseList) {
        if (response.result === 'FAIL') {
          snackbarMessage.value = response.message;
          return;
        }
      }

      snackbarMessage.value = MESSAEG_SET.REQUEST_SUCCESS;
    };

    const profile = ref({
      email: '',
      nickname: '',
    });
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
      modalConfirm,
      openModal,
      confirmEmail,
      hasConfirmed,
      onConfirmDeleteACcount,

      snackbarMessage,
      isSubmitting,
      formData,
      formDataErrors,
      onSubmit,

      profile,
    };
  },
});
</script>

<template>
  <div class="wrapper">
    <div class="profile">
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
              :error="formDataErrors.nickname"
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
              :error="formDataErrors.password"
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
              :error="formDataErrors.beforePassword"
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
    </div>
  </div>
  <Snackbar :message="snackbarMessage" />
  <ModalConfirm
    ref="modalConfirm"
    id="modal-confirm"
    :reversed="hasConfirmed"
    :disableConfirm="hasConfirmed && confirmEmail !== profile.email"
    :confirmMsg="hasConfirmed ? '회원 탈퇴' : '네'"
    :cancelMsg="hasConfirmed ? '취소' : '아니오'"
    @confirm="onConfirmDeleteACcount"
  >
    <header v-if="!hasConfirmed" class="decision-request">
      <p>모든 즐겨찾기 기록이 사라집니다.</p>
      <p>정말로.. 탈퇴하시나요?</p>
    </header>
    <header v-else class="final-request">
      <p>가입하신 이메일을 입력해주세요.</p>
      <BaseInput
        :placeholder="profile.email"
        v-model="confirmEmail"
      ></BaseInput>
    </header>
  </ModalConfirm>
</template>

<style lang="scss" scoped>
.wrapper {
  height: calc(100vh - 72px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background-color: #f8f9fa;
}

.profile {
  width: 512px;
  height: 612px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // position: fixed;
  // padding: 56px;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);

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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 17px;
    line-height: 26px;
    color: #17191b;
    font-weight: 600;
  }
  header.decision-request {
    height: 128px;

    p {
      margin: 0;
      font-size: 17px;
    }
  }

  header.final-request {
    p {
      margin-top: 40px;
      margin-bottom: 20px;
      text-align: center;
    }

    input {
      height: 48px;
      margin-bottom: 32px;

      font-weight: normal;
      font-size: 15px;
      line-height: 22px;
      color: #343a40;
    }
  }
}
</style>
