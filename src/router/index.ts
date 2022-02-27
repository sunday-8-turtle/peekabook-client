import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LandingPageView from '../views/LandingPageView.vue';
import MainView from '../views/MainView.vue';
import ExploreView from '../views/ExploreView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPageView',
    component: LandingPageView,
  },
  {
    path: '/bookmark',
    name: 'MainView',
    component: MainView,
  },
  {
    path: '/explore',
    name: 'ExploreView',
    component: ExploreView,
  },
  {
    path: '/me',
    name: 'ProfileView',
    component: ProfileView,
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

export default router;
