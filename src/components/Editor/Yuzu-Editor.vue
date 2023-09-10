<!-- eslint-disable vue/no-mutating-props -->
<!-- 这里就是要修改Props的 -->
<template>
    <div class="editor-container">
        <QuillEditor
            ref="QuillEditorRef"
            content-type="html"
            :options="options"
            v-model:content="post.content"
        />
        <div class="html-displayer">
            <div class="title">html展示</div>
            <div class="content" v-text="post.content"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/monokai-sublime.css' //导入代码高亮样式
import type { I_PublishPost } from '@/models/post/interface/index'
defineProps<{
    post: I_PublishPost
}>()
//编辑器逻辑
//#region
//配置高亮
hljs.configure({
    //注册语言
    languages: ['javascript', 'typescript', 'ruby', 'python', 'c', 'cpp', 'java', 'html', 'css']
})
//编辑器配置
const options = {
    modules: {
        syntax: {
            //即时渲染
            highlight: (text: string) => hljs.highlightAuto(text).value
        },
        toolbar: [
            { header: [1, 2, 3, 4, 5, 6, false] },
            { color: [] },
            { background: [] },
            { size: ['small', false, 'large', 'huge'] },
            { font: [] },
            { align: [] },
            'clean',
            'bold',
            'italic',
            'underline',
            'code-block',
            'strike',
            'blockquote'
        ]
    },
    placeholder: '...',
    theme: 'snow'
}
//#endregion
</script>

<style lang="less" scoped>
@width: 75%;
.editor-container {
    width: @width;
    height: 400px;
    overflow-y: auto;
    .html-displayer {
        width: @width;
        height: 500px;
    }
}
</style>
