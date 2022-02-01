import { createWebHashHistory, createRouter } from 'vue-router';
import routes from './routes';
import layout from '../components/layout/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: layout,
      redirect: '/onlineFollow',
      children: routes
    }
  ]
});

export default router;