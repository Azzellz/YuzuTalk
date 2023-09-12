import { defineStore } from 'pinia'
import { RecentUsers, CurrentUser, OtherUser } from '@/models/modules/user/class'
import type { I_User } from '@/models/modules/user/interface'
import { UserAPI } from '@/api/modules/user';

interface UserState {
    currentUser: CurrentUser
    otherUser: OtherUser
    recentUsers: RecentUsers
}

//!可以考虑初始化获取一下用户信息
export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        currentUser: new CurrentUser(), //指向当前用户
        otherUser: new OtherUser(), //指向当前浏览的其他用户
        recentUsers: new RecentUsers() //最近注册的所有用户
    }),
    actions: {
        //从服务器获取当前用户信息:最好用于初始化
        async getCurrentUser() {
            await this.currentUser.getUser()
        },
        //获取最近所有注册的用户
        async getRecentUsers() {
            await this.recentUsers.getUser()
        },
        //根据id获取其他用户的信息
        async getOtherUser(id: string) {
            await this.otherUser.getUser(id)
        },
        //获取其他用户的发布文章
        async getOtherUserPublishedPosts() {
            await this.otherUser.publishedPosts.getPosts()
        },
        //获取其他用户的收藏文章
        async getOtherUserFavoritesPosts() {
            await this.otherUser.favoritesPosts.getPosts()
        },
        //更新用户信息
        async updateUser(newUser: I_User) {
            await UserAPI.put('/', newUser)
        }
    }
})
