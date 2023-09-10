import type { I_OtherUser, I_User } from '../interface'
import { PublishedPosts, FavoritesPosts } from '../../post/class/index'
import axios from 'axios'
import { POST_FROM } from '../../post/enum/index'

abstract class Abstract_User<U extends I_User | I_OtherUser | Array<I_OtherUser>> {
    public origin: U
    constructor(u: U) {
        this.origin = u
    }
    //获取的抽象方法
    abstract getUser(id?:string): Promise<void>
}

//当前用户信息
export class CurrentUser extends Abstract_User<I_User> {
    publishedPosts: PublishedPosts<I_User> = new PublishedPosts<I_User>(
        POST_FROM.CURRENT_USER_PUBLISHED_POSTS
    )
    favoritesPosts: FavoritesPosts<I_User> = new FavoritesPosts<I_User>(
        POST_FROM.CURRENT_USER_FAVORITES_POSTS
    )
    constructor() {
        //初始化
        super({} as I_User)
    }
    //从服务器获取当前用户信息:最好用于初始化
    async getUser(): Promise<void> {
        const {
            data: { data }
        } = await axios.get(`/user?id=${localStorage.getItem('user_id')}`)
        console.log('updated user-info:', data)
        //这里只更新了origin字段,还有两个字段是在其他地方更新的
        this.origin = data.user
        //初始化publishedPosts和favoritesPosts
        //更新指向
        this.publishedPosts.user = this.origin
        this.favoritesPosts.user = this.origin
        //获取当前用户的发布文章
        if (this.publishedPosts.list.length === 0) {
            await this.publishedPosts.getPosts()
        }
        //获取当前用户的收藏文章
        if (this.favoritesPosts.list.length === 0) {
            await this.favoritesPosts.getPosts()
        }
    }
}

//当前浏览的其他用户信息
export class OtherUser extends Abstract_User<I_OtherUser> {
    publishedPosts: PublishedPosts<I_OtherUser> = new PublishedPosts<I_OtherUser>(
        POST_FROM.OTHER_USER_PUBLISHED_POSTS
    )
    favoritesPosts: FavoritesPosts<I_OtherUser> = new FavoritesPosts<I_OtherUser>(
        POST_FROM.OTHER_USER_FAVORITES_POSTS
    )
    constructor() {
        //初始化
        super({} as I_OtherUser)
    }
    async getUser(id:string): Promise<void> {
        const {
            data: { data }
        } = await axios.get(`/user?id=${id}&isOther=true`)
        console.log('updated other-user-info:', data)
        this.origin = data.user
        //初始化publishedPosts和favoritesPosts
        //更新user指向
        this.publishedPosts.user = this.origin
        this.favoritesPosts.user = this.origin
        //获取当前用户的发布文章
        if (this.publishedPosts.isEmpty()) {
            await this.publishedPosts.getPosts()
        }
        //获取当前用户的收藏文章
        if (this.favoritesPosts.isEmpty()) {
            await this.favoritesPosts.getPosts()
        }
    }
}

//最近注册的所有用户信息
export class RecentUsers extends Abstract_User<Array<I_OtherUser>> {
    constructor() {
        //初始化
        super([] as Array<I_OtherUser>)
    }
    //获取最近所有注册的用户
    async getUser(): Promise<void> {
        const {
            data: { data }
        } = await axios.get(`/user/recent`)
        console.log('recentUsers: ', data)
        this.origin = data
    }
}
