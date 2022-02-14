<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';

import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import AuthModalHeader from '@/components/AuthModalHeader.vue';

import { SignupRequest } from '@/types/login.types';
import {
  sendCertificationCode,
  verifyCertificationCode,
  signup,
} from '@/api/login';

export default defineComponent({
  name: 'AuthModalSignup',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    AuthModalHeader,
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
        if (isSubmitting.value) {
          alert('이전 요청을 처리하고 있습니다.');
          return;
        }

        if (!isFormFilled.value) {
          alert('입력값을 확인해주세요.');
          return;
        }

        if (!isEmailVerified.value) {
          alert('인증코드를 확인해주세요.');
          return;
        }

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

    const isEmailVerified = ref(false); // 인증코드 확인 완료
    const isSending = ref(false); // 인증코드 발송 중
    const showCertificationCodeInput = ref(false); // 인증코드 입력창 디스플레이 여부
    const onClickCertificationEmail = async () => {
      try {
        if (isSending.value) {
          alert('이전 요청을 처리하고 있습니다.');
          return;
        }
        if (!signupData.email) {
          alert('이메일을 입력해주세요.');
          return;
        }

        isSending.value = true;
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

    const isVerifying = ref(false); // 인증코드 확인 중
    const onClickVerfication = async () => {
      try {
        if (isVerifying.value) {
          alert('인증 코드를 확인하고 있습니다.');
          return;
        }

        if (!signupData.certificationCode) {
          alert('인증코드를 입력해주세요.');
          return;
        }

        isVerifying.value = true;
        const { email, certificationCode } = signupData;
        const verificationResult = await verifyCertificationCode({
          email,
          certificationCode,
        });
        if (verificationResult.result !== 'SUCCESS') {
          alert(verificationResult.message);
          throw new Error(
            `[${verificationResult.errorCode}] ${verificationResult.message}`
          );
        }
        alert('인증완료!');
        isEmailVerified.value = true;
      } catch (err) {
        console.error(err);
      } finally {
        isVerifying.value = false;
      }
    };

    const isFormFilled = computed(() => {
      return (
        signupData.email && signupData.password && signupData.certificationCode
      );
    });

    const resetData = () => {
      signupData.email = '';
      signupData.password = '';
      signupData.nickname = '';
      signupData.certificationCode = '';
      showCertificationCodeInput.value = false;
      isSubmitting.value = false;
      isSending.value = false;
      isEmailVerified.value = false;
      isVerifying.value = false;
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
      isEmailVerified,
      isSending,
      onClickCertificationEmail,
      showCertificationCodeInput,
      isVerifying,
      onClickVerfication,
      isFormFilled,
      resetData,
      goToLogin,
    };
  },
});
</script>

<template>
  <BaseModal ref="baseModal" modal-type="signup" @close-modal="onClose">
    <AuthModalHeader />
    <form
      action="#"
      class="signup-form"
      autocomplete="on"
      @submit.prevent="onSignup"
    >
      <div class="input-btn-wrapper">
        <BaseInput
          v-model="signupData.email"
          type="email"
          name="email"
          required
          :placeholder="'이메일을 입력하세요.'"
          class="input input-email"
          :isSending="isSending"
          :disabled="isEmailVerified"
        />
        <BaseButton
          shape="line"
          class="btn"
          fontSize="16px"
          loaderSize="24px"
          :isLoading="isSending"
          :disabled="isEmailVerified"
          @click.prevent="onClickCertificationEmail"
        >
          인증메일
        </BaseButton>
      </div>
      <div class="input-btn-wrapper">
        <BaseInput
          v-model="signupData.certificationCode"
          type="text"
          autocomplete="one-time-code"
          required
          :placeholder="'인증코드를 입력하세요.'"
          class="input input-certification-code"
          :disabled="!showCertificationCodeInput || isEmailVerified"
        />
        <BaseButton
          shape="line"
          class="btn"
          fontSize="16px"
          loaderSize="24px"
          :isLoading="isVerifying"
          :disabled="!showCertificationCodeInput || isEmailVerified"
          @click.prevent="onClickVerfication"
        >
          인증확인
        </BaseButton>
      </div>
      <BaseInput
        v-model="signupData.password"
        type="password"
        name="password"
        required
        autocomplete="new-password"
        :placeholder="'비밀번호를 입력하세요.'"
        class="input input-password"
        height="56px"
      />
      <BaseInput
        v-model="signupData.nickname"
        type="text"
        name="username"
        placeholder="닉네임을 입력하세요(선택)"
        class="input input-nickname"
        height="56px"
      />
      <BaseButton
        :shape="isFormFilled ? 'fill' : 'line'"
        class="submit-btn"
        fontSize="18px"
        loaderSize="32px"
        :isLoading="isSubmitting"
      >
        회원가입
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
@import '@/design/_responsive.scss';

.signup-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  margin-top: 32px;

  > div {
    margin-top: 20px;
    height: 56px;
  }

  .input-btn-wrapper {
    display: flex;
    justify-content: space-between;

    width: 100%;
    height: 56px;
    margin-top: 20px;

    .input {
      height: 100%;
    }

    .btn {
      width: 96px;
      height: 100%;
      margin-left: 8px;
    }
  }
  .input-email {
    margin-top: 0;
  }

  .submit-btn {
    margin-top: 40px;
    height: 56px;

    // @include respond-to(tablet) {
    //   width: 390px;
    // }
  }
}

.options {
  margin: 30px 0;

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
