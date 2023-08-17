import { defineStore } from 'pinia'
import { POST_FROM, type GetPostOption } from './post'
import { useUserStore } from './user'
import { usePostStore } from './post'

const UserStore = useUserStore()
const PostStore = usePostStore()
//记录状态
export const useStatusStore = defineStore('status', {
  state: () => ({
    isEditing: false
  }),
  actions: {
    //根据来源来动态更新数据源
    async dynamicUpdate(FROM: POST_FROM, getOption: GetPostOption) {
      switch (FROM) {
        case POST_FROM.LATEST_POSTS:
          await PostStore.getLatestPosts()
          break
        case POST_FROM.USER_POSTS:
          await UserStore.getUser(getOption)
          break
        case POST_FROM.LIST_POSTS:
          await PostStore.getPosts(getOption)
          break
        default:
          Promise.all([
            PostStore.getLatestPosts(),
            UserStore.getUser(getOption),
            PostStore.getPosts(getOption)
          ])
          break
      }
    }
  }
})
