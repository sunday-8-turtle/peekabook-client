import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import useAuthStore from '@/store/auth.store';
import useAuth from '@/composables/useAuth';

import LandingPageView from '../views/LandingPageView.vue';
import MainView from '../views/MainView.vue';
import ExploreView from '../views/ExploreView.vue';
import ProfileView from '../views/ProfileView.vue';
import { sendMessageToExtension } from '@/api/extension';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPageView',
    component: LandingPageView,
    meta: {
      loginRequired: false,
    },
    async beforeEnter(to, from, next) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        const deleted = await caches.delete(name);
        console.log(`${name} delete ${deleted}`);
      }
    },
    // async beforeEnter(to, from, next) {
    //   // 로그인하지 않고 접근 시
    //   const authStore = useAuthStore();
    //   if (!authStore.loggedIn) {
    //     return next();
    //   }

    //   // 로그인 되어있고 익스텐션 활성화를 위해 접근 시
    //   const { getCurrentAccessToken, isValidUser } = useAuth();
    //   const loginType = to.query['login-for']?.toString();
    //   const extensionId = to.query['extension-id']?.toString();
    //   const accessToken = getCurrentAccessToken();
    //   if (loginType === 'extension' && extensionId && accessToken) {
    //     if (await isValidUser()) {
    //       sendMessageToExtension({
    //         token: accessToken,
    //         extensionId,
    //       });
    //     } else {
    //       authStore.logout();
    //     }

    //     authStore.extension = { accessByExtension: true, extensionId };

    //     return next();
    //   }

    //   return next({ name: 'MainView' });
    // },
  },
  {
    path: '/bookmark',
    name: 'MainView',
    component: MainView,
    meta: {
      loginRequired: true,
    },
  },
  {
    path: '/explore',
    name: 'ExploreView',
    component: ExploreView,
    meta: {
      loginRequired: true,
    },
  },
  {
    path: '/me',
    name: 'ProfileView',
    component: ProfileView,
    meta: {
      loginRequired: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global Before Guards
// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach((to, from, next) => {
  const loginRequired = to.matched.some((route) => route.meta.loginRequired);
  const { loggedIn } = useAuthStore();

  if (loginRequired && !loggedIn) {
    alert('로그인이 필요합니다.');
    return next({
      name: 'LandingPageView',
      query: { 'login-for': 'loginRequired' },
    });
  }

  next();
});

export default router;
