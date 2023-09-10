import { defineStore } from 'pinia'
//!这里要传入同个pinia实例
// const PostStore = usePostStore(pinia)
//记录全局性的状态状态
export const useStatusStore = defineStore('status', {
  state: () => ({
    //是否正处于post编辑状态
    isEditing: false,
    //是否打开了Yuzu
    isYuzu:false,
  }),
  actions: {
  }
})
