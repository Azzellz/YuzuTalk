import { defineStore } from 'pinia'
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
import { MainPosts, LatestPosts, VisitedPosts, Post } from '@/models/modules/post/class'
import type { I_GetPostOption, I_VisitedPost, I_Post } from '@/models/modules/post/interface'
import { POST_FROM } from '@/models/modules/post/enum'
import { useUserStore } from './user'
import pinia from '../index'
import { PostAPI } from '@/api/modules/post'
//!这里要传入同个pinia实例
const UserStore = useUserStore(pinia)

//state约束
interface PostState {
    //记录总post列表
    mainPosts: MainPosts
    //记录最新的post
    latestPosts: LatestPosts
    //记录已经浏览过的post
    visitedPosts: VisitedPosts
    //记录当前的post
    currentPost: Post
}

export const usePostStore = defineStore('post', {
    state: (): PostState => {
        return {
            //记录总post列表
            mainPosts: new MainPosts(),
            //记录最新的post
            latestPosts: new LatestPosts(),
            //记录已经浏览过的post
            visitedPosts: new VisitedPosts(),
            //记录当前浏览的post
            currentPost: new Post()
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
            //获取option
            const option = this.getOption(route)
            //根据来源去动态更新列表
            switch (FROM) {
                case POST_FROM.LATEST_POSTS:
                    await this.getLatestPosts()
                    break
                case POST_FROM.MAIN_POSTS:
                    await this.getPosts(option)
                    break
                case POST_FROM.CURRENT_USER_PUBLISHED_POSTS:
                    //更新当前用户发布的post
                    await this.getCurrentUserPublishedPosts(option)
                    break
                case POST_FROM.CURRENT_USER_FAVORITES_POSTS:
                    //更新当前用户收藏的post
                    await this.getCurrentUserFavoritesPosts(option)
                    break
                case POST_FROM.OTHER_USER_PUBLISHED_POSTS:
                    //更新其他用户发布的post
                    await this.getOtherUserPublishedPosts(option)
                    break
                case POST_FROM.OTHER_USER_FAVORITES_POSTS:
                    //更新其他用户收藏的post
                    await this.getOtherUserFavoritesPosts(option)
                    break
                default:
                    //全部更新
                    await Promise.all([
                        this.getLatestPosts(),
                        this.getPosts(option),
                        this.getCurrentUserPublishedPosts(option),
                        this.getCurrentUserFavoritesPosts(option)
                    ])
            }
        },
        //根据条件获取post列表
        async getPosts(option?: I_GetPostOption) {
            await this.mainPosts.getPosts(option)
        },
        //根据id获取post,同时也可以起到更新的作用
        async getPost(id: string) {
            const {
                data: { data }
            } = await PostAPI.get('/', {
                params: {
                    id
                }
            })
            this.currentPost = new Post(data as I_Post)
        },
        //获取最新的十篇文章
        async getLatestPosts(limit?: number) {
            //没传limit使用默认值
            if (!limit) limit = this.latestPosts.postLimit
            await this.latestPosts.getPosts(limit)
        },
        //获取当前用户发布的post
        async getCurrentUserPublishedPosts(option?: I_GetPostOption) {
            await UserStore.currentUser.publishedPosts.getPosts(option)
        },
        //获取当前用户收藏的post
        async getCurrentUserFavoritesPosts(option?: I_GetPostOption) {
            await UserStore.currentUser.favoritesPosts.getPosts(option)
        },
        async getOtherUserPublishedPosts(option?: I_GetPostOption) {
            await UserStore.otherUser.publishedPosts.getPosts(option)
        },
        async getOtherUserFavoritesPosts(option?: I_GetPostOption) {
            await UserStore.otherUser.favoritesPosts.getPosts(option)
        },
        //直接将整个post对象传入,替换数据库内具有相同id的post
        async updatePost(new_post: I_Post) {
            await PostAPI.put('/', new_post)
        },
        //删除post
        async deletePost(post_id: string) {
            await PostAPI.delete('/',{
                params:{
                    post_id
                }
            })
        },
        //获取getOption
        getOption(route?: RouteLocationNormalizedLoaded): I_GetPostOption {
            if (!route) route = useRoute()
            //根据路由参数分割出currentPage和pageSize和keyword
            const option: I_GetPostOption = {
                keyword: route.query.keyword ? String(route.query.keyword) : '',
                order: 'new'
            }
            return option
        },
        //记录当前浏览的post
        recordVisitedPost(post: I_Post, FROM: POST_FROM): void {
            this.visitedPosts.recordPost(post, FROM)
        },
        //根据id找到
        findVisitedPostById(post_id: string): I_VisitedPost | undefined {
            return this.visitedPosts.findVisitedPostById(post_id)
        },
        filterVisitedPosts(fitler: (post: I_VisitedPost) => boolean) {
            this.visitedPosts.filterVisitedPosts(fitler)
        }
    }
})
