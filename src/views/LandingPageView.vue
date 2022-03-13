<script lang="ts">
import { defineComponent } from 'vue';

import BaseButton from '@/components/BaseButton.vue';
import TheFooter from '@/components/TheFooter.vue';

export default defineComponent({
  name: 'LandingPageView',
  components: { BaseButton, TheFooter },
  props: {},
  setup() {
    return {};
  },
});
</script>

<template>
  <div class="container">
    <section class="first">
      <p class="large" style="margin-bottom: 28px">북마크, 잘 쓰고 계신가요?</p>
      <p style="margin-bottom: 56px">
        나중에 다시 보려던 북마크, 잊진 않으셨나요? <br />
        언제 어디서나 사용 가능한 피카북이 도와드릴게요!
      </p>
      <BaseButton
        :shape="'fill'"
        :fontSize="'20px'"
        style="width: 280px; height: 64px"
      >
        피카북 시작하기
      </BaseButton>
    </section>
    <section>
      <p>두번째 섹션</p>
    </section>
    <section>
      <p>세번째 섹션</p>
    </section>
    <section>
      <p>네번째 섹션</p>
    </section>
  </div>
  <TheFooter class="footer" />
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  // height: 100%;

  display: flex;
  flex-direction: column;

  > section {
    &:nth-child(2n) {
      background: #f8f9fa;
    }
  }
}

section {
  width: 100%;
  height: 560px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.first {
    height: calc(100vh - 72px);
  }

  p {
    margin: 0;
    text-align: center;

    font-size: 20px;
    line-height: 34px;
    font-weight: 400;
    color: #343a40;

    &.large {
      font-weight: 700;
      font-size: 56px;
      line-height: 72px;
      color: #212529;
    }
  }
}

.footer {
  background: #f8f9fa;
  margin-top: 0;
}
</style>
