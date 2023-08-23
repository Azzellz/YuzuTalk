import { defineStore } from 'pinia'
import axios from 'axios'
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import { MainPosts, FavoritesPosts, LatestPosts, PublishedPosts } from '@/models/post/class'
import type { GetPostOption, Post } from '@/models/post/interface'
import { POST_FROM } from '@/models/post/enum'
import { useUserStore } from './user'

const UserStore = useUserStore()

//state约束
interface PostState {
  mainPosts: MainPosts
  latestPosts: LatestPosts
  publishedPost: PublishedPosts
  favoritesPost: FavoritesPosts
}

export const usePostStore = defineStore('post', {
  state: (): PostState => {
    return {
      //记录总post列表
      mainPosts: new MainPosts(),
      //记录最新的post
      latestPosts: new LatestPosts(),
      //记录当前用户发布的post
      publishedPost: new PublishedPosts(),
      //记录当前用户收藏的post
      favoritesPost: new FavoritesPosts()
    }
  },
  actions: {
    //动态更新post列表
    /**
     * 
     * @param route 当前路由对象
     * @param FROM Post来源的枚举值
     */
    async dynamicUpdate(route: RouteLocationNormalizedLoaded, FROM: POST_FROM) {
      //根据路由参数分割出currentPage和pageSize和keyword
      //组装选项
      const option: GetPostOption = {
        currentPage: route.query.currentPage ? Number(route.query.currentPage) : 1,
        pageSize: route.query.pageSize ? Number(route.query.pageSize) : 10,
        keyword: route.query.keyword ? String(route.query.keyword) : ''
      }
      //根据来源去动态更新列表
      switch (FROM) {
        case this.latestPosts.FROM:
          await this.getLatestPosts()
          break
        case this.mainPosts.FROM:
          await this.getPosts(option)
          break
        case this.publishedPost.FROM:
          await this.getPublishedPosts(option)
          break
        case this.favoritesPost.FROM:
          await this.getFavoritesPosts(option)
          break
        default:
          //全部更新
          await Promise.all([
            this.getLatestPosts(),
            this.getPosts(option),
            this.getPublishedPosts(option),
            this.getFavoritesPosts(option)
          ])
      }
    },
    //根据条件获取post列表
    async getPosts(option?: GetPostOption) {
      await this.mainPosts.getPosts(option)
    },
    //根据id获取post
    async getPost(id: string): Promise<Post> {
      const {
        data: { data }
      } = await axios.get(`/post?id=${id}`)
      return data as Post
    },
    //获取最新的十篇文章
    async getLatestPosts(limit?: number) {
      //没传limit使用默认值
      if (!limit) limit = this.latestPosts.postLimit
      await this.latestPosts.getPosts(limit)
    },
    //获取当前用户发布的post
    async getPublishedPosts(option?: GetPostOption) {
      await this.publishedPost.getPosts(UserStore.user._id, option)
    },
    //获取当前用户收藏的post
    async getFavoritesPosts(option?: GetPostOption) {
      await this.favoritesPost.getPosts(UserStore.user._id, option)
    },
    //直接将整个post对象传入,替换数据库内具有相同id的post
    async updatePost(new_post: Post) {
      await axios.put(`/post`, new_post)
    },
    //删除post
    async deletePost(post_id: string) {
      await axios.delete(`/post?post_id=${post_id}`)
    },
    //获取getOption
    getOption(): GetPostOption {
      const route = useRoute()
      const option: GetPostOption = {
        currentPage: route.query.currentPage ? Number(route.query.currentPage) : 1,
        pageSize: route.query.pageSize ? Number(route.query.pageSize) : 10,
        keyword: route.query.keyword ? String(route.query.keyword) : ''
      }
      return option
    }
  }
})
