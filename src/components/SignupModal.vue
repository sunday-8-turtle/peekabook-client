<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default defineComponent({
  name: 'SignupModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
  },
  setup() {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    const open = () => baseModal.value?.open();
    return { baseModal, open };
  },
});
</script>

<template>
  <BaseModal ref="baseModal" :width="590" :height="700">
    <!--
      로그인/회원가입 모달 
      - 컴포넌트 네이밍 : AuthModalLogin, AuthModalSignup
      - 레이아웃 컴포넌트 : AuthModalHeader
     -->
    <div class="welcome-message">
      <p class="message-en">Welcome to peekabook!</p>
      <p class="message-kr">피카북에 오신 것을 환영합니다!</p>
    </div>

    <form action="#" class="signup-form">
      <BaseInput
        :type="'email'"
        :placeholder="'이메일을 입력하세요.'"
        :isBtnRequired="true"
        class="input input-email"
      />
      <BaseInput
        :type="'string'"
        :placeholder="'인증코드를 입력하세요.'"
        class="input input-verification-code"
        :disabled="true"
      />
      <BaseInput
        :type="'password'"
        :placeholder="'비밀번호를 입력하세요.'"
        class="input input-password"
      />
      <BaseInput
        :type="'string'"
        :placeholder="'닉네임을 입력하세요(선택)'"
        class="input input-nickname"
      />

      <BaseButton shape="line" class="submit-btn">회원가입</BaseButton>
    </form>
    <div class="options">
      <p class="go-login">
        <span>이미 회원이신가요?</span>
        &nbsp;
        <a href="#">로그인 하기</a>
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
