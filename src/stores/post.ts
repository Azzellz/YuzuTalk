import { defineStore } from 'pinia'
import axios from 'axios'

//分页获取post配置接口
export interface getPostOption {
  currentPage?: number
  pageSize?: number
  keyword?: string
}

export const usePostStore = defineStore('post', {
  state: () => {
    return {
      posts: [],
      lastestPosts: [], //记录最新的post
      total: 0, //记录数据库post总数
      currentPage: 0, //默认从0开始算就是第一页
      pageSize: 10 //每页显示的记录数
    }
  },
  actions: {
    //根据条件获取post列表
    getPosts(option?: getPostOption) {
      //检查是否有参数传入,没有就使用默认值
      if (!option) option = {}
      const currentPage = option.currentPage ? option.currentPage - 1 : 0 //currentPage=0的时候就是初始查询,不跳过
      const pageSize = option.pageSize || 10 //默认是一页展示10个post
      const keyword = option.keyword || '' //默认搜索关键字为空

      return new Promise((resolve, reject) => {
        axios
          .get(`/posts?limit=${pageSize}&skip=${currentPage * pageSize}&keyword=${keyword}`)
          .then(({ data: { data } }) => {
            //从上下文对象中触发commit函数提交mutation,更新state
            //修改state
            //todo 可优化成直接替换当前State
            this.currentPage = currentPage
            this.pageSize = pageSize
            this.total = data.total
            this.posts = data.posts
            console.log('updated post-list:', this.posts)

            //解除渲染锁
            resolve(data)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },
    //获取最新的十篇文章
    getLastestPosts() {
      //!获取最新的十篇文章,后续可拓展获取指定数量的文章
      return new Promise((resolve, reject) => {
        axios
          .get(`/posts/lastest`)
          .then(({ data: { data } }) => {
            //更新LastestPosts
            this.lastestPosts = data
            console.log('updated lastest-post-list:', data)
            //解除渲染锁
            resolve(data)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },
    //直接将整个post对象传入,替换数据库内具有相同id的post
    //TODO: 这里的newPost需要加个接口约束
    updatePost(newPost: any) {
      console.log('going to update:', newPost)
      return axios.put(`/post`, newPost)
    },
    //删除post
    deletePost(post_id: string) {
      return axios.delete(`/post?post_id=${post_id}`)
    }
  }
})
