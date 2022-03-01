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
      authRequired: false,
    },
  },
  {
    path: '/bookmark',
    name: 'MainView',
    component: MainView,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/explore',
    name: 'ExploreView',
    component: ExploreView,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/me',
    name: 'ProfileView',
    component: ProfileView,
    meta: {
      authRequired: true,
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((route) => route.meta.authRequired);
  if (!authRequired) return next();

  const { loggedIn } = useAuthStore();
  if (loggedIn) {
    return next();
  }

  alert('로그인이 필요합니다.');
  return next({
    name: 'LandingPageView',
    query: { initialLoginModal: 'true' },
  });
});

export default router;
