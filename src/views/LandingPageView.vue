<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useAuthStore from '@/store/auth.store';

import { useOnScroll } from '@/composables';

import BaseButton from '@/components/BaseButton.vue';
import TheFooter from '@/components/TheFooter.vue';
import LandingPageSection from '@/components/LandingPageSection.vue';
import useAuth from '@/composables/useAuth';
import { sendMessageToExtension } from '@/api/extension';

const emit = defineEmits(['open-login-modal']);

const { scrollIntoView } = useOnScroll();

const authStore = useAuthStore();
const openLoginModal = () => authStore.openLoginModal();

const { isValidUser } = useAuth();
const route = useRoute();
const router = useRouter();
onMounted(async () => {
  const loginType = route.query['login-for']?.toString();
  const extensionId = route.query['extension-id']?.toString();
  const token = authStore.user?.token;

  if (loginType === 'extension' && extensionId) {
    if (token) {
      (await isValidUser())
        ? sendMessageToExtension({ token, extensionId })
        : authStore.logout();

      console.debug('토큰 전송했으니 저리가줄래?');
      router.push({ name: 'MainView' });
    } else {
      authStore.extension = {
        accessByExtension: true,
        extensionId: extensionId,
      };
    }
  }

  if (token) {
    console.debug('로그인 유저는 오지못해!');
    router.push({ name: 'MainView' });
  }
});
</script>

<template>
  <div class="sections-container">
    <LandingPageSection id="section-1" :isFirst="true">
      <div class="text-container">
        <h2 class="h-large text-center">북마크, 잘 쓰고 계신가요?</h2>
        <p class="p text-center">
          나중에 다시 보려던 북마크, 잊진 않으셨나요? <br />
          언제 어디서나 사용 가능한 피카북이 도와드릴게요!
        </p>
        <BaseButton
          :shape="'fill'"
          :fontSize="'20px'"
          class="start-peekabook-btn"
          @click="openLoginModal"
        >
          피카북 시작하기
        </BaseButton>
      </div>
      <button class="next-section-btn" @click="scrollIntoView('section-2')">
        <img
          src="@/assets/images/landing/arrow-bottom.svg"
          alt="arrow bottom"
        />
      </button>
    </LandingPageSection>
    <LandingPageSection id="section-2" :hasImage="true">
      <template #image>
        <img
          src="@/assets/images/landing/landing-2.svg"
          alt="landing image 2"
        />
      </template>
      <div class="text-container left">
        <h2 class="h-small">카테고리로 정리하고<br />검색으로 쉽게</h2>
        <p class="p">
          북마크가 쌓여갈수록 다시 찾기 어려우셨죠?<br />
          이제 카테고리와 검색 기능으로 쉽게 찾아보세요.
        </p>
      </div>
    </LandingPageSection>
    <LandingPageSection id="section-3" :hasImage="true" :imagePosition="'left'">
      <template #image>
        <img
          src="@/assets/images/landing/landing-3.svg"
          alt="landing image 2"
        />
      </template>
      <div class="text-container left">
        <h2 class="h-small">
          확장 프로그램으로<br />
          간편해진 북마크
        </h2>
        <p class="p">
          확장 프로그램으로 북마크를 해보세요!<br />
          내 북마크 페이지에서 한눈에 확인할 수 있어요.
        </p>
        <BaseButton
          :shape="'line'"
          :fontSize="'20px'"
          class="install-extension-btn"
        >
          확장 프로그램 설치
        </BaseButton>
      </div>
    </LandingPageSection>
    <LandingPageSection id="section-4" :hasImage="true">
      <template #image>
        <img
          src="@/assets/images/landing/landing-4.svg"
          alt="landing image 2"
        />
      </template>
      <div class="text-container left">
        <h2 class="h-small">
          다시 볼 수 있도록<br />
          알려드려요.
        </h2>
        <p class="p">
          북마크 후에 잊어버린 적이 있지 않으신가요?<br />
          알림 설정하시면 언제 어디서든 피카북이 알려드려요!
        </p>
      </div>
    </LandingPageSection>
  </div>
  <TheFooter class="footer" />
</template>

<style lang="scss" scoped>
@import '@/design/layout.scss';

.sections-container {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  > section:nth-child(even) {
    background: #f8f9fa;
  }
}

.h-large {
  margin: 0;
  margin-bottom: 28px;

  font-weight: 700;
  font-size: 56px;
  line-height: 72px;
  color: #212529;
}

.h-small {
  margin: 0;
  margin-bottom: 20px;

  font-weight: 700;
  font-size: 38px;
  line-height: 54px;
  color: #343a40;
}

.p {
  margin: 0;
  font-weight: 400;
  font-size: 20px;
  line-height: 34px;
  color: #343a40;
}

.text-center {
  text-align: center;
}

.start-peekabook-btn {
  width: 280px;
  height: 64px;
  margin-top: 56px;
}

.install-extension-btn {
  width: 222px;
  height: 56px;
  margin-top: 48px;
}

.text-container {
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.left {
    align-items: flex-start;
  }
}

.next-section-btn {
  position: absolute;
  bottom: 63px;

  background-color: unset;
  border: unset;

  cursor: pointer;
  animation: moveBelow 1.2s linear infinite alternate;
}

.footer {
  background: #f8f9fa;
  margin-top: 0;
}

// 키프레임 애니메이션 - 리니어
// Duration - 1.2s
//  50%   +8px
// 100%  - 8px
// Loop

@keyframes moveBelow {
  50% {
    bottom: 68px;
  }

  100% {
    bottom: 63px;
  }
}
</style>
