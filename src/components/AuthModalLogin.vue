<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import useAuthStore from '@/store/auth.store';

import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import AuthModalHeader from '@/components/AuthModalHeader.vue';
import AuthModalFooter from '@/components/AuthModalFooter.vue';

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
  },
  emits: ['open-signup-modal', 'redirect-to-previous-page'],
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
      try {
        if (isSubmitting.value) {
          alert('이전 요청을 처리하고 있습니다.');
          return;
        }

        if (!isFormFilled.value) {
          alert('입력값을 확인해주세요.');
          return;
        }

        isSubmitting.value = true;

        const user = await authStore.login(loginBody);
        if (!user) {
          throw new Error('Login Error');
        }

        // 익스텐션에 토큰 전달
        // alert('로그인 성공!');
        sendMessageToExtension({ token: user.token });
        baseModal.value?.close();
        isSubmitting.value = false;

        emit('redirect-to-previous-page');
      } catch (err) {
        console.error(err);
        alert(err);
      }
    };

    const isFormFilled = computed(() => {
      return loginBody.email && loginBody.password;
    });

    const resetData = () => {
      loginBody.email = '';
      loginBody.password = '';
      isSubmitting.value = false;
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
      loginBody,
      onLogin,
      isFormFilled,
      resetData,
      goToSignup,
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
