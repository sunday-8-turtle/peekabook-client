<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';

import BaseModal from '@/components/BaseModal.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import AuthModalHeader from '@/components/AuthModalHeader.vue';
import AuthModalFooter from '@/components/AuthModalFooter.vue';
import Snackbar from '@/components/Snackbar.vue';

import useAuthStore from '@/store/auth.store';
import { LoginRequest } from '@/types/auth.types';
import { sendMessageToExtension } from '@/api/extension';

const emit = defineEmits(['open-signup-modal', 'go-to-previous-page']);

const authStore = useAuthStore();
const { extension } = storeToRefs(authStore);

const baseModal = ref<InstanceType<typeof BaseModal>>();
const open = () => baseModal.value?.open();

// Subscribe 'openLoginModal' action
authStore.$onAction(({ name }) => {
  if (name !== 'openLoginModal') return;
  open();
}, true);

const isSubmitting = ref(false);
const loginBody: LoginRequest = reactive({
  email: '',
  password: '',
});
const snackbarMessage = ref('');
// 모듈화
const MESSAGE_SET = {
  REQUEST_DUPLICATE: '이미 요청하였습니다. 잠시만 기다려주세요.',
  LOGIN_FAIL: '로그인에 실패하였습니다. 다시 시도해주세요.',
};
const onLogin = async () => {
  snackbarMessage.value = '';

  if (isSubmitting.value) {
    snackbarMessage.value = MESSAGE_SET.REQUEST_DUPLICATE;
    return;
  }

  try {
    isSubmitting.value = true;

    const user = await authStore.login(loginBody);
    if (!user) throw new Error(MESSAGE_SET.LOGIN_FAIL);

    // 익스텐션에 토큰 전달
    const { accessByExtension, extensionId } = extension.value;

    if (accessByExtension && extensionId) {
      sendMessageToExtension({
        extensionId,
        token: user.token,
      });
    }

    baseModal.value?.close();
    isSubmitting.value = false;

    // 정상적인 접근 -> 직전 페이지로 리다이렉트
    // 익스텐션을 통한 접근 -> 열려있는 탭 기
    emit('go-to-previous-page');
  } catch (error: any) {
    console.error(error);
    snackbarMessage.value = error.message;
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

defineExpose({ open });
</script>

<template>
  <BaseModal ref="baseModal" id="login-modal" :on-close="resetData">
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
          :disabled="isSubmitting"
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
          :disabled="isSubmitting"
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
