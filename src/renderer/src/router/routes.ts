import 'vue-router'
import type { RouteRecordRaw } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    name: string
    icon: string
    title: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/onlineFollow',
    name: 'onlineFollow',
    meta: {
      title: 'Online Streamers',
      name: 'onlineFollow',
      icon: 'ph:users-three-fill'
    },
    component: () => import('../pages/OnlineFollow.vue'),
  },
  {
    path: '/searchStreamer',
    name: 'searchStreamer',
    meta: {
      title: 'Search Streamer',
      name: 'searchStreamer',
      icon: 'fluent:people-search-24-filled'
    },
    component: () => import('../pages/SearchStreamer.vue'),
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      title: 'APP Setting',
      name: 'setting',
      icon: 'ant-design:setting-filled'
    },
    component: () => import('../pages/Setting.vue'),
  }
];

export default routes;