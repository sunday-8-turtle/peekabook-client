<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';

import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseLottie from '@/components/BaseLottie.vue';

import { SignupRequest } from '@/types/login.types';
import {
  sendCertificationCode,
  verifyCertificationCode,
  signup,
} from '@/api/login';

export default defineComponent({
  name: 'SignupModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    BaseLottie,
  },
  emits: ['open-login-modal'],
  setup(props, { emit }) {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    const open = () => baseModal.value?.open();
    const onClose = () => resetData();

    const isSubmitting = ref(false);
    const signupData: SignupRequest = reactive({
      email: '',
      password: '',
      nickname: '',
      certificationCode: '',
    });
    const onSignup = async () => {
      try {
        isSubmitting.value = true;

        if (!isFormFilled.value) {
          alert('입력값을 확인해주세요.');
          return;
        }

        // 1. 인증코드 확인
        const certificationResult = await verifyCertificationCode({
          email: signupData.email,
          certificationCode: signupData.certificationCode,
        });
        if (certificationResult.result !== 'SUCCESS') {
          alert(certificationResult.message);
          throw new Error(
            `[${certificationResult.errorCode}] ${certificationResult.message}`
          );
        }

        // 2. 회원가입
        const signupResult = await signup(signupData);
        if (signupResult.result !== 'SUCCESS') {
          alert(signupResult.message);
          throw new Error(
            `[${signupResult.errorCode}] ${signupResult.message}`
          );
        }

        alert('회원가입 성공! 로그인 후 피카북을 이용해보세요 :)');
        goToLogin();
      } catch (err) {
        console.error(err);
      } finally {
        isSubmitting.value = false;
      }
    };

    const isSending = ref(false);
    const showCertificationCodeInput = ref(false);
    const onSendCertificationCode = async () => {
      try {
        isSending.value = true;

        if (!signupData.email) {
          alert('이메일을 입력해주세요.');
          return;
        }

        const certificateResult = await sendCertificationCode({
          email: signupData.email,
        });
        if (certificateResult.result !== 'SUCCESS') {
          alert(certificateResult.message);
          throw new Error(
            `[${certificateResult.errorCode}] ${certificateResult.message}`
          );
        }
        alert('이메일로 인증코드를 발송했습니다.');
        showCertificationCodeInput.value = true;
      } catch (err) {
        console.error(err);
      } finally {
        isSending.value = false;
      }
    };

    const isFormFilled = computed(() => {
      return (
        signupData.email &&
        signupData.password &&
        signupData.nickname &&
        signupData.certificationCode
      );
    });

    const resetData = () => {
      signupData.email = '';
      signupData.password = '';
      signupData.nickname = '';
      signupData.certificationCode = '';
      showCertificationCodeInput.value = false;
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
      signupData,
      onSignup,
      isSending,
      onSendCertificationCode,
      showCertificationCodeInput,
      isFormFilled,
      resetData,
      goToLogin,
    };
  },
});
</script>

<template>
  <BaseModal ref="baseModal" :width="590" :height="700" @close-modal="onClose">
    <div class="welcome-message">
      <p class="message-en">Welcome to peekabook!</p>
      <p class="message-kr">피카북에 오신 것을 환영합니다!</p>
    </div>

    <form
      action="#"
      class="signup-form"
      autocomplete="on"
      @submit.prevent="onSignup"
    >
      <BaseInput
        v-model="signupData.email"
        type="email"
        name="email"
        :placeholder="'이메일을 입력하세요.'"
        class="input input-email"
        :isBtnRequired="true"
        :isSending="isSending"
        @send-certification-code="onSendCertificationCode"
      />
      <BaseInput
        v-model="signupData.certificationCode"
        type="text"
        autocomplete="one-time-code"
        :placeholder="'인증코드를 입력하세요.'"
        class="input input-certification-code"
        :disabled="!showCertificationCodeInput"
      />
      <BaseInput
        v-model="signupData.password"
        type="password"
        name="password"
        autocomplete="new-password"
        :placeholder="'비밀번호를 입력하세요.'"
        class="input input-password"
      />
      <BaseInput
        v-model="signupData.nickname"
        type="text"
        name="username"
        placeholder="닉네임을 입력하세요(선택)"
        class="input input-nickname"
      />

      <BaseButton :shape="isFormFilled ? 'fill' : 'line'" class="submit-btn">
        <BaseLottie
          v-if="isSubmitting"
          name="loading-btn"
          width="32px"
          height="32px"
        />
        <span v-else>회원가입</span>
      </BaseButton>
    </form>
    <div class="options">
      <p class="go-login">
        <span>이미 회원이신가요?</span>
        &nbsp;
        <a href="#" @click="goToLogin"> 로그인 하기 </a>
      </p>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
.welcome-message {
  margin-top: 50px;
  font-family: Pretendard;
  font-style: normal;
  text-align: center;
  line-height: 140%;
  color: #343a40;

  p {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .message-en {
    height: 45px;
    font-weight: 700;
    font-size: 32px;
  }

  .message-kr {
    height: 20px;
    font-weight: 400;
    font-size: 14px;
    margin-top: 10px;
  }
}

.signup-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  margin-top: 32px;

  .input {
    margin-top: 20px;
  }

  .input-email {
    margin-top: 0;
  }

  .submit-btn {
    margin-top: 40px;
  }
}

.options {
  margin-top: 30px;

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 21px;
    margin: 0;
    font-size: 15px;
    line-height: 140%;

    a {
      font-weight: 700;
      color: #ff69b4;
    }
  }
}
</style>
