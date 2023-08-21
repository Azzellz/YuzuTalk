<template>
  <Post-Item-Normal v-if="!StatusStore.isEditing"></Post-Item-Normal>
  <Post-Item-Edit v-else></Post-Item-Edit>
</template>

<script setup lang="ts">
import PostItemNormal from './Post-Item-Normal.vue'
import PostItemEdit from './Post-Item-Edit.vue'
import { useStatusStore } from '@/stores/status'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue'

//定义要接收的Props
//这里只需要接收id即可
const props = defineProps<{
  id: string
}>()
//获取状态管理对象
const StatusStore = useStatusStore()
try {
  //让StatusStore获取当前文章的引用
  await StatusStore.getPost(props.id)
} catch (error) {
  //如果不存在,则跳转到文章列表页
  ElMessage.error({
    message: '文章不存在',
    offset: 80
  })
  const router = useRouter()
  router.push('/post/list')
}

onBeforeUnmount(() => {
  //离开页面时,强制结束编辑状态
  StatusStore.isEditing = false
})

</script>

<style scoped></style>
