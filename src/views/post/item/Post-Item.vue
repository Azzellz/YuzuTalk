<template>
  <Post-Item-Normal v-if="!StatusStore.isEditing"></Post-Item-Normal>
  <Post-Item-Edit v-else></Post-Item-Edit>
</template>

<script setup lang="ts">
import PostItemNormal from './Post-Item-Normal.vue'
import PostItemEdit from './Post-Item-Edit.vue'
import { useStatusStore } from '@/stores/status'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import { onBeforeUnmount } from 'vue'
import type { POST_FROM } from '@/models/post/enum';
import { usePostStore } from '../../../stores/post';

//定义要接收的Props
//这里只需要接收id即可
//注意这里的props是通过路由传递过来的
const props = defineProps<{
  id: string,
  FROM:POST_FROM,
  //这里接收分页参数是为了分页刷新
  currentPage?:number,
  pageSize?:number
}>()
//获取状态管理对象
const StatusStore = useStatusStore()
const PostStore = usePostStore()
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
  //调用动态更新数据源方法
  //注意!!!!
  //这里的FROM是通过路由传递过来的,所以会变成字符串,这里要转换成数字
  //离开时动态更新数据源
  PostStore.dynamicUpdate(useRoute(),Number(props.FROM))
})

</script>

<style scoped></style>
