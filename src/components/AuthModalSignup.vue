<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';

import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import AuthModalHeader from '@/components/AuthModalHeader.vue';
import AuthModalFooter from '@/components/AuthModalFooter.vue';
import Snackbar from '@/components/Snackbar.vue';

import {
  CheckDuplicateEmailRequest,
  SignupRequest,
  VerifyCertificationCodeRequest,
} from '@/types/auth.types';
import {
  sendCertificationCode,
  verifyCertificationCode,
  signup,
  checkDuplicateEmail,
} from '@/api/auth.api';
import { AxiosError } from 'axios';

export default defineComponent({
  name: 'AuthModalSignup',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    AuthModalHeader,
    AuthModalFooter,
    Snackbar,
  },
  emits: ['open-login-modal'],
  setup(props, { emit }) {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    const open = () => baseModal.value?.open();
    const onClose = () => resetData();

    const isSubmitting = ref(false); // 회원가입 제출 중
    const signupBody: SignupRequest = reactive({
      email: '',
      password: '',
      nickname: '',
      certificationCode: '',
    });
    const snackbarMessage = ref('');
    // 모듈화 필요
    const MESSAGE_SET = {
      REQUEST_DUPLICATE: '이미 요청하였습니다. 잠시만 기다려주세요.',
      SEND_EMAIL_SUCCESS: '인증번호를 발송했습니다.',
      INVALID_EMAIL: '이메일 형식이 올바르지 않습니다.',
    };
    const onSignup = async () => {
      if (isSubmitting.value) {
        snackbarMessage.value = MESSAGE_SET.REQUEST_DUPLICATE;
        return;
      }

      try {
        isSubmitting.value = true;

        // 인증번호 확인
        const verifyBody: VerifyCertificationCodeRequest = {
          email: signupBody.email,
          certificationCode: signupBody.certificationCode,
        };
        const verifyResult = await verifyCertificationCode(verifyBody);
        if (verifyResult.result !== 'SUCCESS') {
          throw new Error(verifyResult.message || '인증번호 확인 에러');
        }

        // 회원가입
        const signupResult = await signup(signupBody);
        if (signupResult.result !== 'SUCCESS') {
          throw new Error(signupResult.message || '회원가입 에러');
        }

        alert('회원가입 성공! 로그인 후 피카북을 이용해보세요 :)');
        isSubmitting.value = false;
        goToLogin();
      } catch (error: any) {
        // if (error.response) {
        //   console.log(error.response.data);
        //   console.log(error.response.status);
        //   console.log(error.response.headers);
        // }
        // console.error(error);
        snackbarMessage.value = error.response.data.message;
        isSubmitting.value = false;
      }
    };

    const isSending = ref(false); // 인증코드 발송 중
    const showCertificationCodeInput = ref(false); // 인증코드 입력창 디스플레이 여부
    const onClickCertificationEmail = async () => {
      snackbarMessage.value = '';

      // 중복 요청 방지
      if (isSending.value) {
        snackbarMessage.value = MESSAGE_SET.REQUEST_DUPLICATE;
        return;
      }

      // 이메일 유효성 검사
      const VALID_EMAIL_REGEX =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!VALID_EMAIL_REGEX.test(signupBody.email)) {
        snackbarMessage.value = MESSAGE_SET.INVALID_EMAIL;
        return;
      }

      try {
        // 이메일 중복여부 확인
        const checkDuplicateEmailBody: CheckDuplicateEmailRequest = {
          email: signupBody.email,
        };
        const checkDuplicateEmailResult = await checkDuplicateEmail(
          checkDuplicateEmailBody
        );
        if (checkDuplicateEmailResult.result !== 'SUCCESS') {
          throw new Error(
            checkDuplicateEmailResult.message || '이메일 중복 확인 에러'
          );
        }

        // 인증번호 전송
        isSending.value = true;
        const sendCodeResult = await sendCertificationCode({
          email: signupBody.email,
        });
        if (sendCodeResult.result !== 'SUCCESS') {
          throw new Error(
            sendCodeResult.message || '인증코드 발송을 실패했습니다.'
          );
        }

        snackbarMessage.value = MESSAGE_SET.SEND_EMAIL_SUCCESS;
        showCertificationCodeInput.value = true;
        isSending.value = false;
      } catch (err: any) {
        console.log(err);
        snackbarMessage.value = err.message;
        isSending.value = false;
      }
    };

    const isFormFilled = computed(() => {
      return (
        signupBody.email && signupBody.password && signupBody.certificationCode
      );
    });

    const resetData = () => {
      signupBody.email = '';
      signupBody.password = '';
      signupBody.nickname = '';
      signupBody.certificationCode = '';
      showCertificationCodeInput.value = false;
      isSubmitting.value = false;
      isSending.value = false;
      snackbarMessage.value = '';
    };

    const goToLogin = () => {
      baseModal.value?.close();
      emit('open-login-modal');
    };

    return {
      baseModal,
      open,
      onClose,
      isSubmitting,
      signupBody,
      snackbarMessage,
      onSignup,
      isSending,
      onClickCertificationEmail,
      showCertificationCodeInput,
      isFormFilled,
      resetData,
      goToLogin,
    };
  },
});
</script>

<template>
  <BaseModal ref="baseModal" id="signup-modal" @close-modal="onClose">
    <AuthModalHeader />
    <form
      action="#"
      class="signup-form"
      autocomplete="on"
      @submit.prevent="onSignup"
    >
      <div class="input-wrapper two-columns">
        <BaseInput
          v-model="signupBody.email"
          class="input input-email"
          type="email"
          name="email"
          required
          :placeholder="'이메일을 입력하세요.'"
          :isSending="isSending || isSubmitting"
        />
        <BaseButton
          shape="line"
          class="email-btn"
          fontSize="16px"
          loaderSize="24px"
          :isLoading="isSending"
          :disabled="!signupBody.email || isSubmitting"
          @click.prevent="onClickCertificationEmail"
        >
          인증메일
        </BaseButton>
      </div>
      <div class="input-wrapper">
        <BaseInput
          v-model="signupBody.certificationCode"
          class="input input-certification-code"
          type="text"
          autocomplete="one-time-code"
          required
          :placeholder="'인증코드를 입력하세요.'"
          :disabled="!showCertificationCodeInput || isSubmitting"
        />
      </div>
      <div class="input-wrapper">
        <BaseInput
          v-model="signupBody.password"
          class="input input-password"
          type="password"
          name="password"
          autocomplete="new-password"
          required
          :placeholder="'비밀번호를 입력하세요.'"
          :disabled="isSubmitting"
        />
      </div>
      <div class="input-wrapper">
        <BaseInput
          v-model="signupBody.nickname"
          class="input input-nickname"
          type="text"
          name="username"
          placeholder="닉네임을 입력하세요(선택)"
          :disabled="isSubmitting"
        />
      </div>
      <BaseButton
        :shape="'fill'"
        class="submit-btn"
        fontSize="18px"
        loaderSize="32px"
        :isLoading="isSubmitting"
        :disabled="!isFormFilled"
      >
        회원가입
      </BaseButton>
    </form>
    <AuthModalFooter :type="'signup'" @open-login-modal="goToLogin" />
    <Snackbar :message="snackbarMessage" />
  </BaseModal>
</template>

<style lang="scss">
@import '@/design/_responsive.scss';

#signup-modal {
  padding: 28px;

  @include respond-to(tablet) {
    width: 464px;
    padding: 40px;
  }

  form.signup-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    margin-top: 32px;
    margin-bottom: 40px;

    > div {
      margin-top: 20px;
      height: 56px;
    }

    .input-wrapper {
      width: 100%;
      height: 100%;
      margin-top: 16px;

      &:first-child {
        margin-top: 0;
      }

      &.two-columns {
        display: flex;
        justify-content: space-between;

        .email-btn {
          width: 96px;
          height: 56px;
          margin-left: 8px;
        }
      }

      .input {
        height: 56px;
      }
    }

    .submit-btn {
      margin-top: 40px;
      height: 56px;
    }
  }
}
</style>
