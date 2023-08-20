import { defineStore } from 'pinia'
import { type Post } from './post'
import { usePostStore } from './post'

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
    async updateCurrentPost() {
      const id = this.currentPost._id
      if (id) {
        try {
          const newPost = await PostStore.getPost(id)
          this.currentPost = newPost
        } catch (error) {
          console.log(error)
        }
      }
    },
    //根据id获取博客
    //属于初始化过程
    async getPost(id: string) {
      const post = await PostStore.getPost(id)
      this.currentPost = post
    }
  }
})
