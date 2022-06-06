<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import AuthModalLogin from '@/components/AuthModalLogin.vue';
import AuthModalSignup from '@/components/AuthModalSignup.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseContextMenu from '@/components/BaseContextMenu.vue';
import BaseContextMenuItem from '@/components/BaseContextMenuItem.vue';

import { useOnClickOutside, useOnScroll } from '@/composables';
import useNotification from '@/composables/useNotification';

import useAuthStore from '@/store/auth.store';
import { getSavedState, saveState } from '@/store/helpers';

import { sendMessageToExtension } from '@/api/extension';
import { getProfile } from '@/api/profile';
import { CurrentUserState } from '@/types/auth.types';

import defaultImg from '../assets/peekabook-empty-card-img.png';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Login Modal
const loginModal = ref<InstanceType<typeof AuthModalLogin>>();
const openLoginModal = () => loginModal.value?.open();
const onClickLoginBtn = () => {
  // 로컬 스토리지에 User 토큰 정보 있는지 확인 (=> 다른 페이지/탭에서 로그인한 경우)
  // 없으면 모달 열기
  // 있으면 유효하지 않은 토큰이면 열기
  const user: CurrentUserState | undefined = getSavedState('user');
  if (user && isValidToken()) {
    window.location.reload();
    return;
  }
  openLoginModal();
};

watch(
  () => route.query,
  (query) => {
    const loginType = String(query['login-for']);
    const extensionId = String(query['extension-id']);
    const token = authStore.$state.user?.token;
    // eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29jbzA2MThAZ21haWwuY29tIiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImlhdCI6MTY1NDQyNjk2OCwiZXhwIjoxNjU0NTEzMzY4fQ.VC_9d7iBtczoxLrOBbtGJLbPesbRze2BuET8TyIM6FA

    // 익스텐션에게 유효한 토큰 전송하기
    // 1. 토큰 없음 -> 로그인 모달 열기
    // 2. 토큰 있음, 무효함 -> 로그아웃 처리 후 로그인 모달 열기
    // 3. 토큰 있음, 유효함 -> 즉시 sendMessage

    // 익스텐션을 통한 로그인 요청
    if (loginType === 'extension' && extensionId) {
      // 익스텐션 ID 저장
      saveState('extensionId', extensionId);
      authStore.$state.extension = {
        accessByExtension: true,
        extensionId,
      };

      // Global State에 토큰 없는 경우
      if (!token) {
        openLoginModal();
        return;
      }

      // Global State에 토큰 있는 경우
      // 유효하지 않으면  로그아웃 후 로그인 모달 열기
      if (!isValidToken()) {
        onLogout();
        openLoginModal();
        return;
      }

      // 유효하면 메시지 전송
      if (token && isValidToken()) {
        sendMessageToExtension({ extensionId, token });
      }
    }
  }
);

const isValidToken = async (): Promise<boolean> => {
  const res = await getProfile();
  return !!res.data;
};

// SignUp Modal
const signupModal = ref<InstanceType<typeof AuthModalSignup>>();
const openSignupModal = () => signupModal.value?.open();

// Routes
const goToPreviousPage = () =>
  router.push(route.redirectedFrom || { name: 'MainView' });

// Search
const query = ref('');

// Notification Menu
const { notificationList, loadNotificationList, openNotificationWithNewTab } =
  useNotification();

const notiMenu = ref<HTMLDivElement>();
const notiContextMenu = ref<InstanceType<typeof BaseContextMenu>>();

useOnClickOutside(notiMenu, () => notiContextMenu.value?.close());
const toggleNotiContextMenu = () => notiContextMenu.value?.toggle();
const truncateStringWithEllipsis = (text: string, len: number) => {
  return text.length > len ? text.substr(0, len - 1) + '...' : text;
};

const { loggedIn } = storeToRefs(authStore);
watch(
  () => loggedIn.value,
  () => {
    if (loggedIn.value) {
      console.log('로그인 완료', loggedIn.value);
      loadNotificationList();
    }
  }
);

// User Menu
const userMenu = ref<HTMLDivElement>(); // 버튼 & 컨텍스트 메뉴
const userContextMenu = ref<InstanceType<typeof BaseContextMenu>>();
useOnClickOutside(userMenu, () => userContextMenu.value?.close());
const toggleUserContextMenu = () => userContextMenu.value?.toggle();

const onLogout = () => {
  authStore.logout();

  const extensionId = localStorage.getItem('extensionId');
  if (extensionId) {
    sendMessageToExtension({
      extensionId: JSON.parse(extensionId),
      token: '',
    });
  }
  localStorage.removeItem('extensionId');

  router.push({ name: 'LandingPageView' });
};

const goToProfile = () => {
  router.push({ name: 'ProfileView' });
  userContextMenu.value?.close();
};

// Styles
const { isTopOfPage } = useOnScroll();
const isLandingPage = computed(() => route.path === '/');
const setDefaultImage = (e: Event) => {
  (e.target as HTMLImageElement).src = defaultImg;
};
</script>

<template>
  <header :class="{ borderless: isLandingPage && isTopOfPage }">
    <nav>
      <div class="logo-title">
        <router-link class="title" :to="{ name: 'LandingPageView' }">
          <img
            src="@/assets/peekabook-logo-title.svg"
            alt="title"
            width="153"
            height="32"
            class="logo"
          />
        </router-link>
      </div>
      <template v-if="loggedIn">
        <div class="center-container">
          <ul class="menus">
            <li>
              <router-link :to="{ name: 'MainView' }">내 북마크</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'LandingPageView' }">탐색</router-link>
            </li>
          </ul>
          <div class="search-container" style="display: none">
            <img
              src="@/assets/icons/search.svg"
              alt="search icon"
              class="search"
            />
            <input
              v-model="query"
              type="search"
              name="query"
              id="query"
              placeholder="검색"
            />
          </div>
        </div>
        <div class="context-menus">
          <div ref="notiMenu" class="menu noti">
            <button class="noti" @click="toggleNotiContextMenu">
              <img
                v-if="notificationList.length > 0"
                src="@/assets/icons/gnb-noti-rectangle.svg"
                alt="new noti"
                class="new"
              />
              <img src="@/assets/icons/gnb-noti.svg" alt="noti icon" />
            </button>
            <BaseContextMenu
              ref="notiContextMenu"
              class="notificationList"
              :class="{ empty: notificationList.length === 0 }"
            >
              <p class="empty-message" v-if="notificationList.length === 0">
                알림이 없습니다.
              </p>
              <template v-else>
                <BaseContextMenuItem
                  v-for="(notification, idx) in notificationList"
                  :key="notification.id"
                  :class="{ 'padding-top': idx > 0 }"
                >
                  <div class="wrapper">
                    <section
                      class="notification"
                      :class="{ read: notification.check }"
                      @click="openNotificationWithNewTab(notification)"
                    >
                      <section class="image">
                        <img
                          v-if="notification.bookmark.image"
                          @error="setDefaultImage"
                          :src="notification.bookmark.image"
                          alt="bookmark image"
                        />
                        <img v-else :src="defaultImg" alt="default image" />
                      </section>
                      <section class="content">
                        <section class="message">
                          <span class="title">{{
                            truncateStringWithEllipsis(
                              notification.bookmark.title,
                              33
                            )
                          }}</span
                          >을(를) 확인하세요.
                        </section>
                        <section class="date">
                          {{ notification.notidate }}
                        </section>
                      </section>
                    </section>
                    <div
                      class="separator"
                      v-if="idx + 1 !== notificationList.length"
                    ></div>
                  </div>
                </BaseContextMenuItem>
              </template>
            </BaseContextMenu>
          </div>
          <div ref="userMenu" class="menu user">
            <button class="user" @click="toggleUserContextMenu">
              <img src="@/assets/icons/gnb-user.svg" alt="user icon" />
            </button>
            <BaseContextMenu ref="userContextMenu" class="user-menus">
              <BaseContextMenuItem @click="goToProfile">
                <div class="user-menu profile">계정 정보 설정</div>
              </BaseContextMenuItem>
              <BaseContextMenuItem @click="onLogout">
                <div class="user-menu logout">로그아웃</div>
              </BaseContextMenuItem>
            </BaseContextMenu>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="auth-buttons">
          <BaseButton class="login" :shape="'line'" @click="onClickLoginBtn">
            로그인
          </BaseButton>
          <BaseButton class="signup" :shape="'fill'" @click="openSignupModal">
            회원가입
          </BaseButton>
        </div>
      </template>
    </nav>
  </header>
  <Teleport to="body">
    <AuthModalLogin
      ref="loginModal"
      @open-signup-modal="openSignupModal"
      @go-to-previous-page="goToPreviousPage"
    />
    <AuthModalSignup ref="signupModal" @open-login-modal="openLoginModal" />
  </Teleport>
</template>

<style lang="scss" scoped>
@import '@/design/layout.scss';

header {
  height: $navbar-height;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;

  &.borderless {
    border-bottom: 1px solid transparent;
  }

  nav {
    max-width: 1440px;
    margin: 0 auto;
    height: 100%;
    padding: 0 120px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    div.logo-title {
      width: 153px;
      height: 32px;
    }

    div.auth-buttons {
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

    div.center-container {
      height: 100%;
      width: 100%;

      display: flex;
      align-items: center;

      ul.menus {
        height: 100%;
        padding: 0;
        margin: 0;
        margin-left: 130px;

        display: flex;

        li {
          min-width: 96px;
          display: flex;
          justify-content: center;
          align-items: center;

          position: relative;
          list-style: none;

          a {
            color: #ced4da;
            text-decoration: none;

            font-weight: bold;
            font-size: 16px;

            &.router-link-active {
              color: #343a40;

              &::after {
                content: '';
                width: 100%;
                height: 3px;

                position: absolute;
                bottom: 0;
                left: 0;

                background-color: #ff69b4;
              }
            }
          }
        }
      }
      .search-container {
        position: relative;
        width: 320px;
        height: 40px;
        margin-left: 107px;

        img.search {
          width: 16px;
          height: 16px;

          position: absolute;
          top: 12px;
          left: 22px;
        }

        input#query {
          width: 100%;
          height: 100%;
          padding-left: 44px;
          padding-right: 22px;

          border: 1px solid #dee2e6;
          border-radius: 88px;

          font-size: 14px;
          color: #343a40;

          &::placeholder {
            font-size: 15px;
            color: #ced4da;
          }
        }
      }
    }

    div.context-menus {
      display: flex;

      .menu {
        position: relative;

        &.noti {
        }

        &.user {
          margin-left: 24px;
        }

        button {
          background-color: inherit;
          border: none;
          cursor: pointer;
          z-index: 200;

          &.noti {
            position: relative;

            img.new {
              position: absolute;
              right: 6px;
            }
          }
        }
      }
    }
  }
}

// 알림 컨텍스트 메뉴
.notificationList {
  &.show {
    width: 360px;
    max-height: 320px;
    padding-top: 20px;
    padding-bottom: 20px;
    overflow: auto;
  }

  &.show.empty {
    width: 320px;
    height: 160px;
    padding: 61px 46px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .padding-top {
    padding-top: 16px;
  }

  .wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .empty-message {
    margin: 0;
    font-weight: 400;
    font-size: 15px;
    line-height: 22px;

    text-align: center;
    letter-spacing: -0.3px;

    color: #343a40;
  }

  // 알림 단건
  .notification {
    width: 100%;
    min-height: 40px;
    max-height: 62px;
    padding: 0 20px;

    display: flex;

    .image {
      width: 40px;
      height: 40px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .content {
      width: calc(320px - 40px);
      height: 100%;
      padding-left: 12px;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .message {
        font-weight: 400;
        font-size: 15px;
        line-height: 22px;
        letter-spacing: -0.3px;
        color: #212529;

        .title {
          color: #343a40;
          font-weight: 600;
        }
      }

      .date {
        // height: 16px;

        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        /* identical to box height, or 123% */

        /* Gray 6 */

        color: #868e96;
      }
    }

    // 확인한 알림
    &.read {
      .content {
        .message {
          color: #adb5bd;

          .title {
            color: inherit;
          }
        }

        .date {
          color: #ced4da;
        }
      }
    }
  }

  .separator {
    width: 320px;
    height: 1px;
    margin-top: 16px;
    background-color: #e9ecef;
  }
}

.user-menus {
  .user-menu {
    width: 100%;
    height: 40px;
    padding: 0 20px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    &:hover {
      background: #f8f9fa;
      mix-blend-mode: darken;
    }

    &.profile {
    }

    &.logout {
    }
  }
}
</style>
