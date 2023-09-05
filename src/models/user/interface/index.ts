import type { I_Post } from '@/models/post/interface'

//完整的用户信息
export interface I_User {
    _id: string
    user_name: string
    account: string
    password: string
    avatar: string
    favorites: Array<I_Post>
    published: Array<I_Post>
    follows: Array<I_MainUserInfo> //!注意,这边应该是经过阉割的user
    fans: Array<I_MainUserInfo> //!注意,这边应该是经过阉割的user
    register_time: string
    time_stamp: number
}
//其他人的用户信息,有部分删减

export interface I_OtherUser extends I_MainUserInfo {
    favorites: Array<I_Post>
    published: Array<I_Post>
    follows: Array<I_MainUserInfo> //!注意,这边应该是经过阉割的user
    fans: Array<I_MainUserInfo> //!注意,这边应该是经过阉割的user
}

//主要的用户信息
export interface I_MainUserInfo {
    _id: string
    user_name: string
    account: string
    avatar: string
}
