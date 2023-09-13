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
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { ServerIpAddress } from '@/api/index'

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
//自定义样式
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
//获取编辑器引用来添加上传图片的功能
const QuillEditorRef = ref(null)
onMounted(() => {
    if (QuillEditorRef.value) {
        //图片上传逻辑
        //#region
        const toolBar: HTMLDivElement = (QuillEditorRef.value as any).getToolbar()
        const functionList = toolBar.querySelector('.ql-formats') as HTMLSpanElement
        const imageUploader: HTMLInputElement = document.createElement('input')
        imageUploader.style.display = 'none'
        imageUploader.accept = '.jpg, .png, .gif'
        imageUploader.type = 'file'
        //绑定改变事件
        imageUploader.addEventListener('change', async () => {
            const imgFile = imageUploader.files![0]
            console.log(imgFile)
            const formData = new FormData()
            formData.append('img', imgFile)
            try {
                //图片回显逻辑
                //#region
                const {
                    data: { data }
                } = await axios.post('/api/test', formData)
                //获取存储在服务器的文件名
                const filename = data.filename
                //获取静态资源路径
                const imgUrl = `${ServerIpAddress}/post/images/${filename}`
                const editorContainer: HTMLDivElement = (QuillEditorRef.value as any).getEditor()
                const editor: HTMLDivElement = editorContainer.querySelector('.ql-editor')!
                const p = document.createElement('p')
                //回显图片
                const backImg = document.createElement('img')
                backImg.src = imgUrl
                backImg.setAttribute('style', 'width:50%;height:50%;')
                //使用p标签包裹
                p.appendChild(backImg)
                editor.appendChild(p)
                //#endregion
            } catch (error) {
                console.log(error)
            }
        })
        functionList.appendChild(imageUploader)
        const imageUploaderTrigger: HTMLButtonElement = document.createElement('button')
        imageUploaderTrigger.type = 'button'
        imageUploaderTrigger.innerHTML =
            '<svg t="1694590863173" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1748" width="32" height="32"><path d="M784.97794147 611.26470568V288.65441138H239.02205853v228.30882358L363.10294147 387.91911789l243.19852926 253.125L710.52941138 536.81617642l74.44853009 74.44852926zM189.38970568 239.02205853h645.22058864v545.95588294H189.38970568V239.02205853z m446.69117643 198.5294122c-29.77941138 0-49.63235285-19.85294147-49.63235284-49.63235284s19.85294147-49.63235285 49.63235284-49.63235285 49.63235285 19.85294147 49.63235285 49.63235285-19.85294147 49.63235285-49.63235285 49.63235284z" p-id="1749"></path></svg>'
        imageUploaderTrigger.setAttribute(
            'style',
            `display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;`
        )
        //点击触发
        imageUploaderTrigger.addEventListener('click', () => {
            imageUploader.click()
        })
        functionList.appendChild(imageUploaderTrigger)
        //#endregion
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
