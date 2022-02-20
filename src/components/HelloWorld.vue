<template>
  <div
    style="
      min-height: 80vh;
      display: flex;
      justify-content: center;
      margin-top: 22px;
    "
  >
    <BaseButton shape="line" @click="openLoginModal">Login</BaseButton>
    <BaseButton shape="line" @click="openSignupModal" style="margin-left: 14px">
      SignUp
    </BaseButton>
    <br /><br />
    <AuthModalLogin ref="loginModal" @open-signup-modal="openSignupModal" />
    <AuthModalSignup ref="signupModal" @open-login-modal="openLoginModal" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AuthModalLogin from '@/components/AuthModalLogin.vue';
import AuthModalSignup from '@/components/AuthModalSignup.vue';
import BaseButton from '@/components/BaseButton.vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    AuthModalLogin,
    AuthModalSignup,
    BaseButton,
  },
  setup() {
    const loginModal = ref<InstanceType<typeof AuthModalLogin>>();
    const signupModal = ref<InstanceType<typeof AuthModalSignup>>();

    const openLoginModal = () => loginModal.value?.open();
    const openSignupModal = () => signupModal.value?.open();

    return {
      loginModal,
      signupModal,
      openLoginModal,
      openSignupModal,
    };
  },
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
