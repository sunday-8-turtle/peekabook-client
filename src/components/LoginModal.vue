<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default defineComponent({
  name: 'LoginModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
  },
  setup() {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    return { baseModal };
  },
  methods: {
    open() {
      if (!this.baseModal) return;
      this.baseModal.open();
    },
  },
});
</script>

<template>
  <BaseModal ref="baseModal" width="590" height="585">
    <div class="welcome-message">
      <p class="message-en">Welcome to peekabook!</p>
      <p class="message-kr">피카북에 오신 것을 환영합니다!</p>
    </div>
    <form action="#" class="login-form">
      <BaseInput
        :type="'email'"
        :placeholder="'이메일을 입력하세요.'"
        class="input-email"
      />
      <BaseInput
        :type="'password'"
        :placeholder="'비밀번호를 입력하세요.'"
        class="input-password"
      />

      <BaseButton shape="line" class="submit-btn">로그인</BaseButton>
    </form>
    <div class="options">
      <p class="go-signup">
        <span>피카북에 처음 방문하셨나요?</span>
        &nbsp;
        <a href="#">회원가입 하기</a>
      </p>
      <p class="find-password">
        <span>비밀번호를 잊으셨나요?</span>
        &nbsp;
        <a href="#">비밀번호 찾기</a>
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

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  margin-top: 32px;

  .input-password {
    margin-top: 24px;
  }

  .submit-btn {
    margin-top: 40px;
  }
}

.options {
  margin-top: 40px;

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

  .find-password {
    margin-top: 10px;
  }
}
</style>
