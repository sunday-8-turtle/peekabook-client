import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import useAuthStore from '@/store/auth.store';

import LandingPageView from '../views/LandingPageView.vue';
import MainView from '../views/MainView.vue';
import ExploreView from '../views/ExploreView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPageView',
    component: LandingPageView,
    meta: {
      loginRequired: false,
    },
    beforeEnter(to, from, next) {
      const { loggedIn } = useAuthStore();
      if (loggedIn) {
        return next({ name: 'MainView' });
      }
      next();
    },
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
