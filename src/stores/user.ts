import { defineStore } from 'pinia'
import axios from 'axios'
import type { GetPostOption } from '@/models/post/interface'
import type { User } from '@/models/user/interface'

interface UserState {
  user: User
  otherUser: User
  recentUsers: Array<User>
  publishedTotal: number
  favoritesTotal: number
}

//!可以考虑初始化获取一下用户信息
export const useUserStore = defineStore('user', {
  state: ():UserState => ({
    user: {} as User, //指向当前用户
    otherUser: {} as User, //指向当前浏览的其他用户
    recentUsers: [], //最近注册的所有用户
    publishedTotal: 0, //当前用户发布总数
    favoritesTotal: 0 //当前用户收藏总数
  }),
  actions: {
    //从服务器获取当前用户信息,并更新state
    getUser(option?: GetPostOption) {
      //检查是否有参数传入,没有就使用默认值
      //!这里是用来分页的逻辑,一定要注意,如果不传入参数,那么就是初始查询,不跳过
      //检查是否有参数传入,没有就使用默认值
      if (!option) option = {}
      const currentPage = option.currentPage ? option.currentPage - 1 : 0 //currentPage=0的时候就是初始查询,不跳过
      const pageSize = option.pageSize || 10 //默认是一页展示10个post
      const keyword = option.keyword || '' //默认搜索关键字为空

      return new Promise((resolve, reject) => {
        axios
          .get(
            `/user?id=${localStorage.getItem('user_id')}&limit=${pageSize}&skip=${
              currentPage * pageSize
            }&keyword=${keyword}`
          )
          .then(({ data: { data } }) => {
            //从上下文对象中触发commit函数提交mutation,更新state
            console.log('updated user-info:', data)
            this.user = data.user
            this.publishedTotal = data.publishedTotal
            this.favoritesTotal = data.favoritesTotal
            //解除渲染锁
            resolve(data)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },
    //获取最近所有注册的用户
    getRecentUsers() {
      //获取最近所有注册的用户
      axios.get(`/user/recent`).then(({ data: { data } }) => {
        console.log(data)
        this.recentUsers = data
      })
    },
    //根据id获取其他用户的信息
    getOtherUser(id: string) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/user?id=${id}&isOther=true`)
          .then(({ data: { data } }) => {
            //从上下文对象中触发commit函数提交mutation,更新state
            this.otherUser = data
            //解除渲染锁
            resolve(data)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },
    //更新用户信息
    //TODO: 这里的newUser类型需要改一下,接口约束
    updateUser(newUser:User) {
      return new Promise((resolve, reject) => {
        axios
          .put('/user', newUser)
          .then(({ data: { data } }) => {
            console.log(data)
            resolve(data)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    }
  }
})



