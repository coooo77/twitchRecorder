import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/onlineFollow',
  },
  {
    path: '/onlineFollow',
    name: 'onlineFollow',
    component: () => import('../pages/OnlineFollow.vue'),
  },
];

export default routes;