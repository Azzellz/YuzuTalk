import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/Login-View.vue'),
      meta: {
        hideHeader: true
      }
    },
    {
      path: '/register',
      component: () => import('@/views/register/Register-View.vue'),
      meta: {
        hideHeader: true
      }
    },
    {
      path: '/home',
      component: () => import('@/views/home/Home-View.vue'),
    }
  ]
})

export default router
