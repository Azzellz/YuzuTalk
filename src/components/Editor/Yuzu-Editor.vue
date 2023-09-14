<!-- eslint-disable vue/no-mutating-props -->
<!-- 这里就是要修改Props的 -->
<template>
    <div class="base-editor-container" :style="customEditor" @keydown.ctrl.v="showTip">
        <QuillEditor
            ref="QuillEditorRef"
            content-type="html"
            :style="{ flex: 1, height: 0 }"
            :options="options"
            v-model:content="post.content"
        />
        <div v-if="isShowHTML" class="html-displayer">
            <h5 class="title">html展示</h5>
            <div class="html-content" v-text="post.content"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import hljs from 'highlight.js' //导入代码高亮文件
import 'highlight.js/styles/monokai-sublime.css' //导入代码高亮样式
import type { I_PublishPost, I_Post } from '@/models/modules/post/interface/index'
import { ElMessage } from 'element-plus'
import { type I_QuillEditor, YuzuEditor } from '@/models/modules/editor'
import { ref, onMounted, watchEffect } from 'vue'

//定义Props
const props = withDefaults(
    defineProps<{
        post: I_PublishPost | I_Post
        height?: number
        isShowHTML?: boolean
    }>(),
    {
        height: 500,
        isShowHTML: false
    }
)

//自定义编辑器样式
//#region
const customEditor = {
    height: props.height + 'px'
}
//#endregion

//编辑器逻辑
//#region
//配置高亮语言
hljs.configure({
    //注册语言
    languages: ['javascript', 'typescript', 'ruby', 'python', 'c', 'cpp', 'java', 'html', 'css']
})
//编辑器配置
const options = {
    modules: {
        syntax: {
            //即时渲染
            highlight: (text: string) => {
                return hljs.highlightAuto(text).value
            }
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
//展示可能出现的bug的提示
function showTip() {
    ElMessage.warning({
        message: '粘贴后会出现样式丢失,触发编辑器输入后解决',
        offset: 80
    })
}
//升级Editor
//#region
const QuillEditorRef = ref<I_QuillEditor | null>(null)
onMounted(() => {
    const quillEditor = QuillEditorRef.value
    if (quillEditor) {
        const yuzuEditor = new YuzuEditor(quillEditor)
        //将content的变化和preContent同步
        watchEffect(() => {
            props.post.content
            const text = yuzuEditor.editorAPI.getText()
            // eslint-disable-next-line vue/no-mutating-props
            props.post.preContent = text.slice(0, 100)
        })
    }
})
//#endregion
</script>

<style lang="less" scoped>
@width: 75%;

.base-editor-container {
    width: @width;
    display: flex;
    flex-direction: column;
    .html-displayer {
        width: @width;
        margin-top: 10px;
        .title {
            color: gray;
        }
        .html-content {
            color: gray;
        }
    }
}
</style>
