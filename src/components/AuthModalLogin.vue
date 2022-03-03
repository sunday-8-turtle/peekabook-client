<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import useAuthStore from '@/store/auth.store';

import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import AuthModalHeader from '@/components/AuthModalHeader.vue';
import AuthModalFooter from '@/components/AuthModalFooter.vue';
import Snackbar from '@/components/Snackbar.vue';

import { LoginRequest } from '@/types/auth.types';
import { sendMessageToExtension } from '@/api/extension';

export default defineComponent({
  name: 'AuthModalLogin',
  components: {
    BaseModal,
    BaseInput,
    BaseButton,
    AuthModalHeader,
    AuthModalFooter,
    Snackbar,
  },
  emits: ['open-signup-modal', 'go-to-previous-page'],
  setup(props, { emit }) {
    const baseModal = ref<InstanceType<typeof BaseModal>>();
    const open = () => baseModal.value?.open();
    const onClose = () => resetData();

    const authStore = useAuthStore();
    const isSubmitting = ref(false);
    const loginBody: LoginRequest = reactive({
      email: '',
      password: '',
    });
    const onLogin = async () => {
      snackbarMessage.value = '';

      if (isSubmitting.value) {
        snackbarMessage.value = '로그인을 시도하고 있습니다.';
        return;
      }

      try {
        isSubmitting.value = true;

        const user = await authStore.login(loginBody);
        if (!user) {
          snackbarMessage.value = '로그인에 실패하였습니다.';
          throw new Error('Login Error');
        }

        baseModal.value?.close();
        isSubmitting.value = false;
        emit('go-to-previous-page');

        // 익스텐션에 토큰 전달
        sendMessageToExtension({ token: user.token });
      } catch (error: any) {
        console.error(error);
        snackbarMessage.value = String(error.message);
        isSubmitting.value = false;
      }
    };

    const isFormFilled = computed(() => {
      return loginBody.email && loginBody.password;
    });

    const resetData = () => {
      loginBody.email = '';
      loginBody.password = '';
      isSubmitting.value = false;
      snackbarMessage.value = '';
    };

    const goToSignup = () => {
      baseModal.value?.close();
      emit('open-signup-modal');
    };

    let snackbarMessage = ref('');

    return {
      baseModal,
      open,
      onClose,
      isSubmitting,
      loginBody,
      onLogin,
      isFormFilled,
      resetData,
      goToSignup,
      snackbarMessage,
    };
  },
});
</script>

<template>
  <BaseModal ref="baseModal" id="login-modal" @close-modal="onClose">
    <AuthModalHeader />
    <form
      action="#"
      class="login-form"
      autocomplete="on"
      @submit.prevent="onLogin"
    >
      <div class="input-wrapper">
        <BaseInput
          v-model="loginBody.email"
          class="input input-email"
          type="email"
          name="email"
          required
          placeholder="이메일을 입력하세요."
        />
      </div>
      <div class="input-wrapper">
        <BaseInput
          v-model="loginBody.password"
          class="input input-password"
          type="password"
          name="password"
          autocomplete="current-password"
          required
          :placeholder="'비밀번호를 입력하세요.'"
        />
      </div>

      <BaseButton
        :shape="isFormFilled ? 'fill' : 'line'"
        class="submit-btn"
        :fontSize="'18px'"
        :loaderSize="'32px'"
        :isLoading="isSubmitting"
      >
        로그인
      </BaseButton>
    </form>
    <AuthModalFooter :type="'login'" @open-signup-modal="goToSignup" />
    <Snackbar :message="snackbarMessage" />
  </BaseModal>
</template>

<style lang="scss">
@import '@/design/_responsive.scss';

#login-modal {
  padding: 28px;

  @include respond-to(tablet) {
    width: 464px;
    padding: 40px;
  }

  form.login-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    margin-top: 32px;
    margin-bottom: 40px;

    div.input-wrapper {
      width: 100%;
      height: 100%;
      margin-top: 16px;

      &:first-child {
        margin-top: 0;
      }

      .input {
        height: 56px;
      }
    }

    button.submit-btn {
      height: 56px;
      margin-top: 40px;
    }
  }
}
</style>
