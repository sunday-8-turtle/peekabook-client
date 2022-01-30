<template>
  <div>
    <button @click="openLoginModal">LOGIN</button>
    <br /><br />
    <LoginModal ref="loginModal" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LoginModal from '@/components/LoginModal.vue';

export default defineComponent({
  name: 'HelloWorld',
  components: {
    LoginModal,
  },
  setup() {
    const loginModal = ref<InstanceType<typeof LoginModal>>();
    const openLoginModal = () => {
      if (!loginModal.value) return;
      loginModal.value.open();
    };

    return {
      loginModal,
      openLoginModal,
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
