import { defineStore } from 'pinia'
import { type Post } from '@/models/post/interface'
import { usePostStore } from './post'

const PostStore = usePostStore()
//记录状态
export const useStatusStore = defineStore('status', {
  state: () => ({
    //是否正处于post编辑状态
    isEditing: false,
    //存储当前博客
    currentPost: {} as Post,
    //存储当前博客列表
    // currentPostList: {
    //   list: [] as Post[],
    //   total: 0,
    //   from: '' //来源
    // }
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
      //!旧方法:根据id发送请求获取post,并存入currentPost
      const post = await PostStore.getPost(id)
      this.currentPost = post

      // //?新方法:根据id和来源获取post,并存入currentPost
      // //根据来源去查找post来源,并获取来源post的一个引用存入currentPost
      // //这里要确保FROM是正确的并且post存在
      // switch (FROM) {
      //   case PostStore.latestPosts.FROM:
      //     this.currentPost = PostStore.latestPosts.list.find((item) => item._id === id)!
      //     break
      //   case PostStore.mainPosts.FROM:
      //     this.currentPost = PostStore.mainPosts.list.find((item) => item._id === id)!
      //     break
      //   case PostStore.publishedPost.FROM:
      //     this.currentPost = PostStore.publishedPost.list.find((item) => item._id === id)!
      //     break
      //   case PostStore.favoritesPost.FROM:
      //     this.currentPost = PostStore.favoritesPost.list.find((item) => item._id === id)!
      //     break
      //   default:
      //     //抛错
      //     throw "FROM不正确或者post不存在"
      // }
    },
  }
})
