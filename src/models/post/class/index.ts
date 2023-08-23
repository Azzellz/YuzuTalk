import axios from 'axios'
import { POST_FROM } from '../enum'
import type { GetPostOption, PaginatedPostList,  Post, PostList } from '../interface'
import type { GetPostResponse } from '../interface/index'

//!注意,这里是拿不到pinia实例的数据的!

//MainPosts类
export class MainPosts implements PaginatedPostList {
   readonly FROM: POST_FROM = POST_FROM.MAIN_POSTS
   list: Array<Post>
   total: number
   currentPage?: number | undefined
   pageSize?: number | undefined
   constructor() {
      this.list = []
      this.total = 0
      this.currentPage = 0
      this.pageSize = 10
   }
   
   async getPosts(option?: GetPostOption) {
      //检查是否有参数传入,没有就使用默认值
      if (!option) option = {}
      this.currentPage = option.currentPage ? option.currentPage - 1 : 0 //currentPage=0的时候就是初始查询,不跳过
      this.pageSize = option.pageSize || 10 //默认是一页展示10个post
      const keyword = option.keyword || '' //默认搜索关键字为空
      //获取数据
      try {
         const {
            data: { data }
         } = (await axios.get(
            `/posts?limit=${this.pageSize}&skip=${
               this.currentPage * this.pageSize
            }&keyword=${keyword}`
         )) as GetPostResponse

         //todo 可优化成直接替换当前State
         this.total = data.total
         this.list = data.posts
         console.log('updated main-post-list:', data)

      } catch (error) {
         console.log(error)
      }
   }
}
//LatestPosts类
export class LatestPosts implements PostList {
   list: Array<Post>
   total: number
   readonly FROM: POST_FROM = POST_FROM.LATEST_POSTS
   //限制最多展示10篇文章
   postLimit: number = 10

   constructor() {
      this.list = []
      this.total = 0
   }

   async getPosts(limit: number) {
      try {
         const {
            data: { data }
         } = (await axios.get(`/posts/lastest?limit=${limit}`)) as GetPostResponse
         //更新list
         this.list = data.posts
         this.total = data.total
         console.log('updated lastest-post-list:', data)
      } catch (error) {
         console.log(error)
      }
   }
}
//PublishedPosts类
export class PublishedPosts implements PaginatedPostList {
    list: Array<Post>
    total: number
    readonly FROM: POST_FROM = POST_FROM.PUBLISHED_POSTS
    currentPage?: number | undefined
    pageSize?: number | undefined

    constructor() {
        this.list = []
        this.total = 0
        this.currentPage = 0
        this.pageSize = 10
    }
    async getPosts(user_id: string, option?: GetPostOption) {
        //检查是否有参数传入,没有就使用默认值
        if (!option) option = {}
        const currentPage = option.currentPage ? option.currentPage - 1 : 0 //currentPage=0的时候就是初始查询,不跳过
        const pageSize = option.pageSize || 10 //默认是一页展示10个post
        const keyword = option.keyword || '' //默认搜索关键字为空
        //获取数据
        try {
            const {
                data: { data }
            } = (await axios.get(
                `/posts/published?user_id=${user_id}&limit=${pageSize}&skip=${
                    currentPage * pageSize
                }&keyword=${keyword}`
            )) as GetPostResponse
            //更新list
            this.list = data.posts
            this.total = data.total
            console.log('updated published-post-list:', data)
        } catch (error) {
            console.log(error)
        }
    }
}
//FavoritesPosts类
export class FavoritesPosts implements PaginatedPostList {
    list: Array<Post>
    total: number
    readonly FROM: POST_FROM = POST_FROM.FAVORITES_POSTS
    currentPage?: number | undefined
    pageSize?: number | undefined
    constructor() {
        this.list = []
        this.total = 0
        this.currentPage = 0
        this.pageSize = 10
    }
    async getPosts(user_id: string, option?: GetPostOption) {
        //检查是否有参数传入,没有就使用默认值
        if (!option) option = {}
        const currentPage = option.currentPage ? option.currentPage - 1 : 0 //currentPage=0的时候就是初始查询,不跳过
        const pageSize = option.pageSize || 10 //默认是一页展示10个post
        const keyword = option.keyword || '' //默认搜索关键字为空
        //获取数据
        try {
            const {
                data: { data }
            } = (await axios.get(
                `/posts/favorites?user_id=${user_id}&limit=${pageSize}&skip=${
                    currentPage * pageSize
                }&keyword=${keyword}`
            )) as GetPostResponse
            //更新list
            this.list = data.posts
            this.total = data.total
            console.log('updated favorites-post-list:', data)
        } catch (error) {
            console.log(error)
        }
    }
}
