<!-- eslint-disable vue/no-mutating-props -->
<!-- 这里就是要修改Props的 -->
<template>
    <div class="base-editor-container" :style="customEditor">
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
import { type I_QuillEditorAPI, YuzuEditor } from '@/models/modules/editor'
import { ref, onMounted, watchEffect, watch } from 'vue'

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
//highlight完成后会触发更新
const highlightReadyFlag = ref(0)
//编辑器配置
const options = {
    modules: {
        syntax: {
            //即时语法高亮
            highlight: (text: string) => {
                highlightReadyFlag.value++
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
//升级Editor
//#region
//获取模板引用
const QuillEditorRef = ref<I_QuillEditorAPI | null>(null)
onMounted(() => {
    const quillEditor = QuillEditorRef.value
    if (quillEditor) {
        //升级
        const yuzuEditor = new YuzuEditor(quillEditor)
        //高亮完毕后触发post.content同步
        watch(highlightReadyFlag, () => {
            // eslint-disable-next-line vue/no-mutating-props
            props.post.content = yuzuEditor.editorAPI.getHTML()
        })
        //将content的变化和preContent同步
        watchEffect(() => {
            props.post.content
            setTimeout(() => {
                //getText要延时调用,不然会获取不到
                const text = yuzuEditor.editorAPI.getText()
                // eslint-disable-next-line vue/no-mutating-props
                props.post.preContent = text.slice(0, 100)
            }, 100)
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
