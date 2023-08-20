import { defineStore } from 'pinia'
import { POST_FROM, type GetPostOption, type Post } from './post'
import { useUserStore } from './user'
import { usePostStore } from './post'

const UserStore = useUserStore()
const PostStore = usePostStore()
//记录状态
export const useStatusStore = defineStore('status', {
  state: () => ({
    //是否正处于post编辑状态
    isEditing: false,
    //存储当前博客
    currentPost: {} as Post
  }),
  actions: {
    //更新当前博客
    async updateCurrentPost(): Promise<void> {
      const id = this.currentPost._id
      if (id) {
        try {
          this.currentPost = await PostStore.getPost(id)
        } catch (error) {
          console.log(error)
        }
      }
    },
    //根据id获取博客
    async getPost(id: string) {
      const post = await PostStore.getPost(id)
      this.currentPost = post
    }
  }
})
