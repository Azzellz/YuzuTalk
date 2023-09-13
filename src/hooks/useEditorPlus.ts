import axios from 'axios'
import { ref, onMounted } from 'vue'
import { ServerIpAddress } from '@/api/index'

//编辑器的抽象
abstract class YuzuEditor {
    public toolBar: HTMLSpanElement
    public editor: HTMLDivElement
    constructor(editorContainer: HTMLDivElement) {
        //这里要进行解包一次
        const ToolBar: HTMLDivElement = (editorContainer as any).getToolbar()
        this.toolBar = ToolBar.querySelector('.ql-formats') as HTMLSpanElement
        const Editor: HTMLDivElement = (editorContainer as any).getEditor()
        this.editor = Editor.querySelector('.ql-editor') as HTMLDivElement
    }
}
//图像上传
class ImageUploader {
    public uploader: HTMLInputElement
    constructor() {
        const imageUploader: HTMLInputElement = document.createElement('input')
        imageUploader.style.display = 'none'
        imageUploader.accept = '.jpg, .png, .gif'
        imageUploader.type = 'file'

        this.uploader = imageUploader
    }
}
//图像上传触发器
class ImageUploaderTrigger {
    public trigger: HTMLButtonElement
    constructor() {
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
        this.trigger = imageUploaderTrigger
    }
}
//图像管理器
class ImageManager extends YuzuEditor {
    public imageUploader: ImageUploader = new ImageUploader()
    public imageUploaderTrigger: ImageUploaderTrigger = new ImageUploaderTrigger()

    constructor(editorContainer: HTMLDivElement) {
        super(editorContainer)

        //初始化uploader事件
        this.imageUploader.uploader.addEventListener('change', () => {
            // this.showBackRemote(this.imageUploader.uploader.files!)
            this.showBackLocal(this.imageUploader.uploader.files!)
        })
        //初始化trigger事件
        this.imageUploaderTrigger.trigger.addEventListener('click', () => {
            this.imageUploader.uploader.click()
        })

        this.toolBar.appendChild(this.imageUploader.uploader)
        this.toolBar.appendChild(this.imageUploaderTrigger.trigger)
    }
    //向编辑器内容体添加img标签
    addImgToEditor(src: string) {
        //插入段落
        const p = document.createElement('p')
        const backImg = document.createElement('img')
        backImg.src = src
        //TODO: 这里可以实现后续界面可控
        const backImgStyle = 'width:50%;height:50%;'
        backImg.setAttribute('style', backImgStyle)
        //使用p标签包裹
        p.appendChild(backImg)
        this.editor.appendChild(p)
    }
    //服务器回显
    async showBackRemote(files: FileList) {
        const imgFile = files[0]
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
            this.addImgToEditor(imgUrl)
            //#endregion
        } catch (error) {
            console.log(error)
        }
    }
    //本地回显
    showBackLocal(files: FileList) {
        const img = files[0]
        const reader = new FileReader()
        // 监听FileReader对象的load事件
        reader.addEventListener('load', () => {
            // 获取base64数据
            const base64Data = reader.result as string
            //将base64作为src
            this.addImgToEditor(base64Data)
        })
        // 读取文件内容，以base64格式输出
        reader.readAsDataURL(img)
    }
}

export function useEditorPlus() {
    const QuillEditorRef = ref<HTMLDivElement | null>(null)
    onMounted(() => {
        const quillEditor = QuillEditorRef.value
        if (quillEditor) {
            new ImageManager(quillEditor)
        }
    })
    //!这里注意一定要返回Ref,vue才能获取到
    return { QuillEditorRef }
}
