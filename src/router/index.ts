import { useCheck } from '@/hooks/useCheck'
import { createRouter, createWebHashHistory, type RouteLocationNormalized } from 'vue-router'
//定义router
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/door'
        },
        {
            path: '/door',
            component: () => import('@/views/door/Door-View.vue'),
            meta: {
                isHideHeader: true,
                isHideAside:true
            },
            beforeEnter: () => {
                //在这里判断是否已经有token,如果有则直接导航到首页
                if (localStorage.getItem('token')) {
                    return '/home'
                } else {
                    return true
                }
            }
        },
        {
            path: '/home',
            component: () => import('@/views/home/Home-View.vue'),
            meta: {
                isHideAside: true
            },
            beforeEnter: () => {
                //在这里判断是否已经有token,如果有则直接导航到首页
                if (!localStorage.getItem('token')) {
                    return '/door'
                } else {
                    return true
                }
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
                        //注意这里要注意类型转换
                        //query中的数据都是字符串类型,而我们需要的是数字类型(除了id是字符串类型)
                        return {
                            id: String($route.query.id),
                            FROM: Number($route.query.FROM),
                            currentPage: Number($route.query.currentPage),
                            pageSize: Number($route.query.pageSize)
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
                    path: 'info',
                    component: () => import('@/views/user/info/User-Info.vue')
                },
                {
                    path:'find',
                    component:()=>import('@/views/user/find/Find-Other.vue')
                },
                {
                    path: 'other',
                    component: () => import('@/views/user/other/User-Other-Info.vue'),
                    meta: {
                        isHideAside: true //展示其他用户信息时隐藏侧边栏,注意,meta以这里的为主,其他地方的会被覆盖
                    },
                    beforeEnter: (to) => {
                        //在这里判断是否是当前用户的id,如果是,则跳转到info页面
                        if (to.query.id === localStorage.getItem('user_id')) {
                            return '/user/info'
                        } else {
                            return true
                        }
                    },
                    props($route) {
                        return {
                            id: $route.query.id,
                            title: $route.query.title
                        }
                    }
                }
            ]
        }
    ]
})
//check-hooks
const { loginCheck, storageCheck } = useCheck()
router.beforeEach(async (to: RouteLocationNormalized) => {
    //在这里进行登录检查
    await loginCheck(to)
    //本地存储检查
    storageCheck(to)
})
export default router
