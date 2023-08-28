import router from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { type RouteLocationNormalized } from 'vue-router'

//接收一个to参数,检查要前往的路由是否需要登录
export function useCheck() {
    return { ...useLoginCheck(), ...useStorageCheck() }
}

//TODO 允许未登录访问的路径,是一个路径字符串数组
const AllowRoutePathsWithoutCheck: Array<string> = ['/door']
function isAllow(path: string): boolean {
    return AllowRoutePathsWithoutCheck.includes(path)
}

//登录相关
export function useLoginCheck() {
    //路由检查函数
    async function loginCheck(to: RouteLocationNormalized): Promise<void> {
        //先判断是否为允许的路径
        if (isAllow(to.path)) return
        //做Token校验
        if (localStorage.getItem('token')) {
            //Token校验
            try {
                await axios.post(
                    '/login',
                    {
                        user_id: localStorage.getItem('user_id')
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    }
                )
            } catch (error) {
                //token校验失败,说明登录过期
                console.log(error)
                ElMessage.error({
                    message: '登录过期,请重新登录',
                    offset: 80
                })
                //移除旧的token
                localStorage.clear()
                //将界面路由至登录页面
                router.replace('/door')
            }
        } else if (to.path !== '/door') {
            router.replace('/door')
        }
    }
    return { loginCheck, AllowRoutePathsWithoutCheck, isAllow }
}

//本地存储相关
export function useStorageCheck() {
    function storageCheck(to: RouteLocationNormalized) {
        console.log(to.path)
        //先判断是否为允许的路径
        if (isAllow(to.path)) return
        //做本地存储检查,如果有缺漏,则跳转至登录页面
        if (
            !localStorage.getItem('user_id') ||
            !localStorage.getItem('token') ||
            !localStorage.getItem('user_name') ||
            !localStorage.getItem('user_account') ||
            !localStorage.getItem('avatar')
        ) {
            localStorage.clear()
            if (to.path !== '/door') {
                router.replace('/door')
                ElMessage.error({
                    message: '本地信息有误,请重新登录',
                    offset: 80
                })
            }
        }
    }
    return { storageCheck }
}
