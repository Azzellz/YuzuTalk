//!插件列表
import type { Quill } from '@vueup/vue-quill'
import { ImageManager } from './plugins/imageManager'

//将需要实现的功能插件放到这里做约束
interface I_YuzuEditorPlugins {
    imageManager: ImageManager
}

//!提供访问quillEditor提供的api
export interface I_QuillEditorAPI {
    getToolbar(): HTMLDivElement
    getEditor(): HTMLDivElement
    //!这个api有限制,需要延迟调用
    getText(index?: number, length?: number): string
    getHTML(): string
    getQuill(): Quill
}
//插入元素的属性
interface I_Attribute {
    key: string
    value: string
}

//抽象编辑器核心
abstract class EditorCore {
    constructor(
        //这两个本质就是Span和Div
        public toolBar: HTMLSpanElement,
        public editor: HTMLDivElement
    ) {}
    appendChildToEditor<ElementType extends HTMLElement>(
        tagName: string,
        ...attributes: Array<I_Attribute>
    ): void {
        const p = document.createElement('p')
        const childTag = document.createElement(tagName) as ElementType
        attributes.forEach((attribute: I_Attribute) => {
            childTag.setAttribute(attribute.key, attribute.value)
        })
        p.appendChild(childTag)
        this.editor.appendChild(p)
    }
    //!触发编辑器更新, 用来修复初次进入editor,getText获取不到内容
    triggerEditorUpdate() {
        //插入再删除一个标签可以触发编辑器重新渲染
        const p = document.createElement('p')
        this.editor.appendChild(p)
        this.editor.removeChild(p)
    }
}
//管理插件
export class EditorPlugins implements I_YuzuEditorPlugins {
    public imageManager: ImageManager
    constructor(yuzuEditor: YuzuEditor) {
        this.imageManager = new ImageManager(yuzuEditor)
    }
}
export class YuzuEditor extends EditorCore {
    //!初始化插件
    public plugins: EditorPlugins = new EditorPlugins(this)
    //实现类需要提供ref引用的value传入来初始化
    //接收quillEditor进行改造
    constructor(public editorAPI: I_QuillEditorAPI) {
        //这里要对两个容器进行解包
        const toolBarContainer: HTMLDivElement = editorAPI.getToolbar()
        const toolBar = toolBarContainer.querySelector('.ql-formats') as HTMLSpanElement
        const editorContainer: HTMLDivElement = editorAPI.getEditor()
        const editor = editorContainer.querySelector('.ql-editor') as HTMLDivElement
        //初始化core
        super(toolBar, editor)
    }
}
