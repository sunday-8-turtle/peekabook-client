<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { login } from '@/api/login';
import { LoginRequest } from '@/types/login.types';
import BaseLottie from './BaseLottie.vue';

export default defineComponent({
  name: 'LoginModal',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    BaseLottie,
  },
  emits: ['open-signup-modal'],
  setup(props, { emit }) {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    const open = () => baseModal.value?.open();
    const onClose = () => resetData();

    const isSubmitting = ref(false);
    const loginData: LoginRequest = reactive({
      email: '',
      password: '',
    });
    const onLogin = async () => {
      try {
        isSubmitting.value = true;

        if (!isFormFilled.value) {
          alert('입력값을 확인해주세요.');
          return;
        }

        const loginResult = await login(loginData);
        if (loginResult.result !== 'SUCCESS') {
          alert(loginResult.message);
          throw new Error(`[${loginResult.errorCode}] ${loginResult.message}`);
        }

        const token = loginResult.data.token;
        localStorage.token = token;
        alert('로그인 성공!');
        baseModal.value?.close();
      } catch (err) {
        console.error(err);
      } finally {
        isSubmitting.value = false;
      }
    };

    const isFormFilled = computed(() => {
      return loginData.email && loginData.password;
    });

    const resetData = () => {
      loginData.email = '';
      loginData.password = '';
    };

    const goToSignup = () => {
      baseModal.value?.close();
      emit('open-signup-modal');
    };
    return {
      baseModal,
      open,
      onClose,
      isSubmitting,
      loginData,
      onLogin,
      isFormFilled,
      resetData,
      goToSignup,
    };
  },
});
</script>

<template>
  <BaseModal ref="baseModal" :width="590" :height="585" @close-modal="onClose">
    <div class="welcome-message">
      <p class="message-en">Welcome to peekabook!</p>
      <p class="message-kr">피카북에 오신 것을 환영합니다!</p>
    </div>
    <form
      action="#"
      class="login-form"
      autocomplete="on"
      @submit.prevent="onLogin"
    >
      <BaseInput
        v-model="loginData.email"
        type="email"
        name="email"
        placeholder="이메일을 입력하세요."
        class="input-email"
        :required="true"
      />
      <BaseInput
        v-model="loginData.password"
        type="password"
        name="password"
        autocomplete="current-password"
        :placeholder="'비밀번호를 입력하세요.'"
        class="input-password"
      />

      <BaseButton :shape="isFormFilled ? 'fill' : 'line'" class="submit-btn">
        <BaseLottie
          v-if="isSubmitting"
          name="loading-btn"
          width="32px"
          height="32px"
        />
        <span v-else>로그인</span>
      </BaseButton>
    </form>
    <div class="options">
      <p class="go-signup">
        <span>피카북에 처음 방문하셨나요?</span>
        &nbsp;
        <a href="#" @click="goToSignup"> 회원가입 하기 </a>
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
