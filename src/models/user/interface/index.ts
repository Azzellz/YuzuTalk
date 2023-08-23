import type { Post } from "@/models/post/interface"

export interface User {
  _id: string
  user_name: string
  account: string
  password: string
  avatar: string
  favorites: Array<Post>
  published: Array<Post>
  follows: Array<MainUserInfo> //!注意,这边应该是经过阉割的user
  fans: Array<MainUserInfo> //!注意,这边应该是经过阉割的user
  register_time: string
  time_stamp: number
}

export interface MainUserInfo {
  _id: string
  user_name: string
  avatar: string
}
