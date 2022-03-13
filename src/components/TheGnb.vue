<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useAuthStore from '@/store/auth.store';

import AuthModalLogin from '@/components/AuthModalLogin.vue';
import AuthModalSignup from '@/components/AuthModalSignup.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseContextMenu from '@/components/BaseContextMenu.vue';
import BaseContextMenuItem from '@/components/BaseContextMenuItem.vue';
import { useOnScroll } from '@/composables';

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
    // Login Modal
    const loginModal = ref<InstanceType<typeof AuthModalLogin>>();
    const openLoginModal = () => loginModal.value?.open();
    // 파라미터를 활용한 로그인 모달 열기 (ex- ?initialLoginModal=true)
    const $route = useRoute();
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

    // loggedIn
    const authStore = useAuthStore();
    const { loggedIn } = storeToRefs(authStore);

    // Login 완료 후 리다이렉트
    const $router = useRouter();
    const goToPreviousPage = () => {
      $router.push($route.redirectedFrom || { name: 'MainView' });
    };

    // User Context Menu
    const userContextMenu = ref<InstanceType<typeof BaseContextMenu>>();
    const toggleUserContextMenu = () => userContextMenu.value?.toggle();
    const onLogout = () => {
      authStore.logout();
      $router.push({ name: 'LandingPageView' });
    };
    const goToProfile = () => {
      $router.push({ name: 'ProfileView' });
    };

    // LandingPageView related
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
  <header>
    <nav :class="{ borderless: isLandingPage && isTopOfPage }">
      <div class="logo-title">
        <router-link
          class="title"
          :to="{ name: loggedIn ? 'MainView' : 'LandingPageView' }"
        >
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
        <div class="user-info">
          <button class="noti">
            <img
              src="@/assets/icons/gnb-noti-rectangle.svg"
              alt="new noti"
              class="new"
            />
            <img src="@/assets/icons/gnb-noti.svg" alt="noti icon" />
          </button>
          <button class="profile" @click="toggleUserContextMenu">
            <img src="@/assets/icons/gnb-user.svg" alt="user icon" />
            <BaseContextMenu ref="userContextMenu">
              <BaseContextMenuItem @click="goToProfile">
                계정 정보 설정
              </BaseContextMenuItem>
              <BaseContextMenuItem @click="onLogout">
                로그아웃
              </BaseContextMenuItem>
            </BaseContextMenu>
          </button>
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

    <AuthModalLogin
      ref="loginModal"
      @open-signup-modal="openSignupModal"
      @go-to-previous-page="goToPreviousPage"
    />
    <AuthModalSignup ref="signupModal" @open-login-modal="openLoginModal" />
  </header>
</template>

<style lang="scss" scoped>
header {
  height: 72px;

  nav {
    max-width: 1440px;
    margin: 0 auto;
    height: 100%;
    padding: 0 120px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid #e9ecef;
    background-color: #ffffff;

    &.borderless {
      border-bottom: 1px solid transparent;
    }

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
          top: 14px;
          left: 28px;
        }

        input#query {
          width: 100%;
          height: 100%;
          padding: 22px 14px 22px 54px;

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

    div.user-info {
      display: flex;

      button {
        position: relative;
        background-color: inherit;
        border: none;
        cursor: pointer;

        &.noti {
          position: relative;

          img.new {
            position: absolute;
            right: 6px;
          }
        }

        &.profile {
          margin-left: 24px;
          z-index: 200;
        }
      }
    }
  }
}
</style>
