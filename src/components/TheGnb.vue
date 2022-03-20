<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { LocationQuery, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useAuthStore from '@/store/auth.store';

import { useOnClickOutside, useOnScroll } from '@/composables';

import AuthModalLogin from '@/components/AuthModalLogin.vue';
import AuthModalSignup from '@/components/AuthModalSignup.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseContextMenu from '@/components/BaseContextMenu.vue';
import BaseContextMenuItem from '@/components/BaseContextMenuItem.vue';

export default defineComponent({
  name: 'TheGnb',
  components: {
    AuthModalLogin,
    AuthModalSignup,
    BaseButton,
    BaseContextMenu,
    BaseContextMenuItem,
  },
  props: {},
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const $authStore = useAuthStore();

    // 로그인 여부 (GNB 디자인 변경)
    const { loggedIn } = storeToRefs($authStore);

    // 로그인 모달
    const loginModal = ref<InstanceType<typeof AuthModalLogin>>();
    const openLoginModal = () => loginModal.value?.open();
    // 파라미터를 활용한 로그인 모달 열기 (ex- ?initialLoginModal=true)
    watch(
      () => $route.query.initialLoginModal,
      (initialLoginModal) => {
        if (initialLoginModal) {
          openLoginModal();
        }
      }
    );

    // Signup Modal
    const signupModal = ref<InstanceType<typeof AuthModalSignup>>();
    const openSignupModal = () => signupModal.value?.open();

    // 프로그래밍적으로 로그인 모달 열기
    // 1) 익스텐션: 유효하지 않은 사용자가 익스텐션을 여는 경우
    // 2) 권한없음: 유효하지 않은 사용자가 authRequired 페이지를 요청하는 경우
    watch(
      () => $route.query,
      (query) => {
        const LOGIN_TYPES = ['extension', 'unauthorized'];
        const loginType = String(query['login-for']);

        // 로그인 타입 없으면 종료
        if (!loginType) {
          return;
        }
        // 유효하지 않은 로그인 타입이면 종료
        if (!LOGIN_TYPES.includes(String(loginType))) {
          return;
        }

        // 익스텐션 타입인 경우
        if (loginType === 'extension') {
          $authStore.$state.extension = {
            accessByExtension: true,
            extensionId: String(query['extension-id']),
          };
        }

        openLoginModal();
      }
    );

    // 로그인 완료 후 리다이렉트
    const goToPreviousPage = () => {
      $router.push($route.redirectedFrom || { name: 'MainView' });
    };

    // 알림 컨텍스트 메뉴
    const notifications = ref([
      {
        title: '서서하는 반복작업의 매력',
        date: '22. 05. 13',
        url: 'idontknow',
      },
      {
        title: '히히히 제목을 씁니다아아아아아',
        date: '22. 05. 13',
        url: 'idontknow',
      },
      {
        title:
          '제목이 길 경우의 즐겨찾기가 있다면제목이 길 경우제목이 길어질 수 있습니다',
        date: '22. 05. 13',
        url: 'idontknow',
      },
      {
        title: '하이이잇',
        date: '22. 05. 13',
        url: 'idontknow',
      },
      {
        title: '포켓몬빵',
        date: '22. 05. 13',
        url: 'idontknow',
      },
    ]);
    const notiMenu = ref<HTMLDivElement>();
    const notiContextMenu = ref<InstanceType<typeof BaseContextMenu>>();
    useOnClickOutside(notiMenu, () => notiContextMenu.value?.close());
    const toggleNotiContextMenu = () => notiContextMenu.value?.toggle();
    // const fetchNotifications = () => {};

    // 유저 컨텍스트 메뉴
    const userMenu = ref<HTMLDivElement>(); // 버튼 & 컨텍스트 메뉴
    const userContextMenu = ref<InstanceType<typeof BaseContextMenu>>();
    useOnClickOutside(userMenu, () => userContextMenu.value?.close());
    const toggleUserContextMenu = () => userContextMenu.value?.toggle();
    const onLogout = () => {
      $authStore.logout();
      $router.push({ name: 'LandingPageView' });
    };
    const goToProfile = () => {
      $router.push({ name: 'ProfileView' });
      userContextMenu.value?.close();
    };

    // 랜딩 페이지 스타일 관련 (borderless)
    const isLandingPage = computed(() => {
      return $route.path === '/';
    });
    const { isTopOfPage } = useOnScroll();

    return {
      loginModal,
      signupModal,
      openLoginModal,
      openSignupModal,
      loggedIn,
      goToPreviousPage,
      notifications,
      notiMenu,
      notiContextMenu,
      toggleNotiContextMenu,
      userMenu,
      userContextMenu,
      toggleUserContextMenu,
      onLogout,
      goToProfile,
      isLandingPage,
      isTopOfPage,
    };
  },
});
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
              <router-link :to="{ name: 'ExploreView' }">탐색</router-link>
            </li>
          </ul>
          <div class="search-container">
            <img
              src="@/assets/icons/search.svg"
              alt="search icon"
              class="search"
            />
            <input type="search" name="query" id="query" placeholder="검색" />
          </div>
        </div>
        <div class="context-menus">
          <div ref="notiMenu" class="menu noti">
            <button class="noti" @click="toggleNotiContextMenu">
              <img
                src="@/assets/icons/gnb-noti-rectangle.svg"
                alt="new noti"
                class="new"
              />
              <img src="@/assets/icons/gnb-noti.svg" alt="noti icon" />
            </button>
            <BaseContextMenu
              ref="notiContextMenu"
              class="notifications"
              :class="{ empty: notifications.length === 0 }"
            >
              <p class="empty-message" v-if="notifications.length === 0">
                알림이 없습니다.
              </p>
              <template v-else>
                <BaseContextMenuItem
                  v-for="(noti, idx) in notifications"
                  :key="idx"
                  :class="{ 'padding-top': idx > 0 }"
                >
                  <div class="wrapper">
                    <section class="notification">
                      <section class="image">
                        <img
                          src="@/assets/images/landing/landing-2.svg"
                          alt=""
                        />
                      </section>
                      <section class="content">
                        <section class="message">
                          <span class="title">{{ noti.title }}</span
                          >을(를) 확인하세요.
                        </section>
                        <section class="date">{{ noti.date }}</section>
                      </section>
                    </section>
                    <div
                      class="separator"
                      v-if="idx + 1 !== notifications.length"
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
          <BaseButton class="login" :shape="'line'" @click="openLoginModal">
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
  z-index: 100;

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

.notifications {
  padding: 12px 0;

  &.empty {
    padding: 61px 46px;
  }

  .padding-top {
    padding-top: 16px;
  }

  .wrapper {
    width: 320px;
    height: 100%;
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

  .notification {
    width: 320px;
    min-height: 40px;
    max-height: 62px;

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
        // height: 22px;

        font-weight: 400;
        font-size: 15px;
        line-height: 22px;
        /* identical to box height, or 147% */

        letter-spacing: -0.3px;

        /* Gray 8 */

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
  }

  .separator {
    width: 100%;
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
