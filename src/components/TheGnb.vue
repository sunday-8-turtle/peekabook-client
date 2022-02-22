<script lang="ts">
import { defineComponent, ref } from 'vue';

import AuthModalLogin from '@/components/AuthModalLogin.vue';
import AuthModalSignup from '@/components/AuthModalSignup.vue';
import BaseButton from '@/components/BaseButton.vue';

export default defineComponent({
  name: 'TheGnb',
  components: {
    AuthModalLogin,
    AuthModalSignup,
    BaseButton,
  },
  props: {},
  setup() {
    const loginModal = ref<InstanceType<typeof AuthModalLogin>>();
    const openLoginModal = () => loginModal.value?.open();

    const signupModal = ref<InstanceType<typeof AuthModalSignup>>();
    const openSignupModal = () => signupModal.value?.open();

    const loggedIn = false;

    return {
      loginModal,
      signupModal,
      openLoginModal,
      openSignupModal,
      loggedIn,
    };
  },
});
</script>

<template>
  <header>
    <nav>
      <router-link class="title" :to="{ name: 'Home' }">
        <img
          src="@/assets/peekabook-logo-title.svg"
          alt="title"
          width="153"
          height="32"
          class="logo"
        />
      </router-link>
      <template v-if="loggedIn"></template>
      <template v-else>
        <div class="auth-buttons">
          <BaseButton class="login" :shape="'line'" @click="openLoginModal">
            로그인
          </BaseButton>
          <BaseButton class="signup" :shape="'fill'" @click="openSignupModal">
            회원가입
          </BaseButton>
        </div>
      </template>
    </nav>

    <AuthModalLogin ref="loginModal" @open-signup-modal="openSignupModal" />
    <AuthModalSignup ref="signupModal" @open-login-modal="openLoginModal" />
  </header>
</template>

<style lang="scss" scoped>
header {
  height: 72px;

  nav {
    height: 100%;
    padding: 0 120px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid #e9ecef;
    background-color: #ffffff;

    a.title {
      width: 153px;
      height: 32px;

      img.logo {
        width: 100%;
        height: 100%;
      }
    }

    .auth-buttons {
      display: flex;

      button {
        height: 40px;

        &.login {
          width: 80px;
        }

        &.signup {
          width: 96px;
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
