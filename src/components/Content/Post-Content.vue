<template>
    <div class="content-container ql-container ql-snow" ref="contentBoxRef">
        <div class="ql-editor" v-html="PostStore.currentPost.content"></div>
    </div>
</template>

<script setup lang="ts">
import { usePostStore } from '@/stores/modules/post'
const PostStore = usePostStore()
</script>

<style lang="less" scoped>
.content-container {
    white-space: pre-line;
    width: 80%;
    min-height: 600px;
    height: auto
}
</style>
