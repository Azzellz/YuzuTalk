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
      path: '/',
      component: () => import('@/views/home/Home-View.vue'),
      meta: {
        hideAside: true
      }
    },
    {
      path: '/post',
      components: {
        //配置default属性，渲染默认组件,会渲染到没有name属性的router-view中
        default: () => import('@/views/post/Post-View.vue'), //路由中转
        aside: () => import('@/components/Aside/Post-Aside.vue')
      },
      redirect: '/post/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/post/Post-List.vue')
        },
        {
          path: 'publish',
          component: () => import('@/views/post/Post-Publish.vue')
        },
        {
          path: 'item',
          component: () => import('@/views/post/Post-Item.vue'),
          //使用props传参
          props($route) {
            return {
              id: $route.query.id,
              currentPage: $route.query.currentPage,
              pageSize: $route.query.pageSize
            }
          }
        }
      ]
    }
  ]
})

export default router
