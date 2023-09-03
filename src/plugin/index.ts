import { serverIpAddress } from '@/utils'
import axios from 'axios'
import { nanoid } from 'nanoid'
import type { App } from 'vue'

export default {
  install(app:App) {
    //配置axios的根路径
    axios.defaults.baseURL = `${serverIpAddress}/`

    //配置全局工具api
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$nanoid = nanoid
    app.config.globalProperties.$avatarURL = (avatar:string) => {
      return `${serverIpAddress}/user_avatar/${avatar}`
    }
    //配置全局枚举变量
    app.config.globalProperties.$enum = {
      //post数据来源
      POST_FROM: {
        USER_POSTS: Symbol('用户自己的POST'),
        LASTEST_POSTS: Symbol('来自主页的最新的POST'),
        LIST_POSTS: Symbol('来自于列表的POST'),
        FOLLOWING_POSTS: Symbol('来自于用户关注的人的post')
      }
    }
    //全局防抖函数构造函数
    app.config.globalProperties.$debounce = (func:Function, delay:number) => {
      let timer:any
      return  (...args:Array<any>) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    }
  }
}
