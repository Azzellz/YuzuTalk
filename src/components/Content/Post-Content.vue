<template>
    <!-- 内容回显处要加上富文本编辑器的样式,不然会导致样式丢失 -->
    <div class="content-container ql-container ql-snow">
        <div class="ql-editor" ref="contentRef" v-html="PostStore.currentPost.content"></div>
    </div>
</template>

<script setup lang="ts">
import { usePostStore } from '@/stores/modules/post'
import { ref } from 'vue'
const PostStore = usePostStore()
const contentRef = ref<HTMLDivElement | null>(null)
</script>

<style lang="less" scoped>
.content-container {
    white-space: pre-line;
    width: 80%;
    height: 600px;
}
</style>
