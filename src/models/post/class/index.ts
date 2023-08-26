import axios from 'axios'
import { POST_FROM } from '../enum'
import type { GetPostOption, PaginatedPostList, Post, PostList } from '../interface'
import type { GetPostResponse } from '../interface/index'
import type { I_User,I_OtherUser } from '@/models/user/interface'
import { DefaultGetOption } from '../const'

//!注意,这里是拿不到pinia实例的数据的!

//MainPosts类
export class MainPosts implements PaginatedPostList {
    readonly FROM: POST_FROM = POST_FROM.MAIN_POSTS
    list: Array<Post> = []
    total: number = 0
    currentPage: number = 0
    pageSize: number = 10
    constructor() {
    }

    async getPosts(option?: GetPostOption) {
        //检查是否有参数传入,没有就使用默认值
        if (!option) option = DefaultGetOption
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
    isEmpty() {
        return this.list.length === 0
    }
}
//LatestPosts类
export class LatestPosts implements PostList {
    list: Array<Post> = []
    total: number = 0
    readonly FROM: POST_FROM = POST_FROM.LATEST_POSTS
    //限制最多展示10篇文章
    postLimit: number = 10

    constructor() {
    }

    async getPosts(limit: number) {
        try {
            const {
                data: { data }
            } = (await axios.get(`/posts/latest?limit=${limit}`)) as GetPostResponse
            //更新list
            this.list = data.posts
            this.total = data.total
            console.log('updated latest-post-list:', data)
        } catch (error) {
            console.log(error)
        }
    }
    isEmpty() {
        return this.list.length === 0
    }
}
//PublishedPosts类,有泛型参数,用来指明是当前用户还是其他用户
export class PublishedPosts<U extends I_User | I_OtherUser> implements PaginatedPostList {
    readonly FROM: POST_FROM
    list: Array<Post> = []
    total: number = 0
    currentPage: number = 0
    pageSize: number = 10
    //保留当前用户的引用
    user: U = {} as U
    //构造函数,传入FROM参数
    constructor(FROM: POST_FROM) {
        this.FROM = FROM
    }
    async getPosts(option?: GetPostOption) {
        //检查是否有参数传入,没有就使用默认值
        if (!option) option = DefaultGetOption
        const currentPage = option.currentPage ? option.currentPage - 1 : 0 //currentPage=0的时候就是初始查询,不跳过
        const pageSize = option.pageSize || 10 //默认是一页展示10个post
        const keyword = option.keyword || '' //默认搜索关键字为空
        //获取数据
        try {
            const {
                data: { data }
            } = (await axios.get(
                `/posts/published?user_id=${this.user._id}&limit=${pageSize}&skip=${
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
    isEmpty() {
        return this.list.length === 0
    }
}
//FavoritesPosts类,有泛型参数,用来指明是当前用户还是其他用户
export class FavoritesPosts<U extends I_User | I_OtherUser> implements PaginatedPostList {
    readonly FROM: POST_FROM
    list: Array<Post> = []
    total: number = 0
    currentPage: number = 0
    pageSize: number = 10
    //保留当前用户的引用
    user: U = {} as U
    //构造函数,传入FROM参数
    constructor(FROM: POST_FROM) {
        this.FROM = FROM
    }
    
    async getPosts(option?: GetPostOption) {
        //检查是否有参数传入,没有就使用默认值
        if (!option) option = DefaultGetOption
        const currentPage = option.currentPage ? option.currentPage - 1 : 0 //currentPage=0的时候就是初始查询,不跳过
        const pageSize = option.pageSize || 10 //默认是一页展示10个post
        const keyword = option.keyword || '' //默认搜索关键字为空
        //获取数据
        try {
            const {
                data: { data }
            } = (await axios.get(
                `/posts/favorites?user_id=${this.user._id}&limit=${pageSize}&skip=${
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
    isEmpty() {
        return this.list.length === 0
    }
}
