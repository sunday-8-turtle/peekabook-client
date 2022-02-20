<script lang="ts">
import { defineComponent, PropType } from 'vue';

type AuthModalFooterType = 'signup' | 'login';

export default defineComponent({
  name: 'AuthModalFooter',
  components: {},
  props: {
    type: {
      type: String as PropType<AuthModalFooterType>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const goToSignup = () => {
      emit('open-signup-modal');
    };

    const goToLogin = () => {
      emit('open-login-modal');
    };

    const goToFindPassword = () => {
      emit('open-find-password-modal');
    };

    return { goToSignup, goToLogin, goToFindPassword };
  },
});
</script>

<template>
  <footer>
    <template v-if="type === 'login'">
      <p class="go-signup">
        <span>피카북에 처음 방문하셨나요?</span>
        &nbsp;
        <a href="#" @click="goToSignup"> 회원가입 하기 </a>
      </p>
      <p class="find-password">
        <span>비밀번호를 잊으셨나요?</span>
        &nbsp;
        <a href="#" @click="goToFindPassword">비밀번호 찾기</a>
      </p>
    </template>
    <template v-else>
      <p class="go-login">
        <span>이미 회원이신가요?</span>
        &nbsp;
        <a href="#" @click="goToLogin"> 로그인 하기 </a>
      </p>
    </template>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  margin-bottom: 30px;

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
