<template>
  <div>
    <button @click="openLoginModal">Login</button>
    <button @click="openSignupModal">SignUp</button>
    <br /><br />
    <LoginModal ref="loginModal" />
    <SignupModal ref="signupModal" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
import SignupModal from '@/components/SignupModal.vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    LoginModal,
    SignupModal,
  },
  setup() {
    const loginModal = ref<InstanceType<typeof LoginModal>>();
    const signupModal = ref<InstanceType<typeof SignupModal>>();

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
