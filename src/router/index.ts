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
    //post相关的路由
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
          component: () => import('@/views/post/list/Post-List.vue')
        },
        {
          path: 'publish',
          component: () => import('@/views/post/publish/Post-Publish.vue')
        },
        {
          path: 'item',
          component: () => import('@/views/post/item/Post-Item.vue'),
          //使用props传参
          props($route) {
            return {
              id: $route.query.id,
              FROM: $route.query.FROM,
              currentPage: $route.query.currentPage,
              pageSize: $route.query.pageSize
            }
          }
        }
      ]
    },
    //user相关的路由
    {
      path: '/user',
      redirect: '/user/info',
      //使用componens实现多个组件渲染
      components: {
        //配置default属性，渲染默认组件,会渲染到没有name属性的router-view中
        default: () => import('@/views/user/User-View.vue'),
        aside: () => import('@/components/Aside/User-Aside.vue')
      },
      children: [
        {
          path: 'follows',
          component: () => import('@/views/user/info/User-Follows.vue')
        },
        {
          path: 'info',
          component: () => import('@/views/user/info/User-Info.vue')
        },
        {
          path: 'published',
          component: () => import('@/views/user/posts/User-Published.vue')
        },
        {
          path: 'favorites',
          component: () => import('@/views/user/posts/User-Favorites.vue')
        },
        {
          path: 'other',
          component: import('@/views/user/other/User-Other-Info.vue'),
          meta: {
            isHideAside: true //展示其他用户信息时隐藏侧边栏,注意,meta以这里的为主,其他地方的会被覆盖
          }
          // props($route) {
          //   return {
          //     id: $route.query.id,
          //     FROM: $route.query.FROM,
          //     currentPage: $route.query.currentPage,
          //     pageSize: $route.query.pageSize
          //   }
          // }
        }
      ]
    }
  ]
})

export default router
