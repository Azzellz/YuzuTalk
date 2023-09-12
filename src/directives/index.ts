import Prism from 'prismjs'
//启动代码高亮的指令
export const highlight = {
    mounted(el: HTMLElement) {
        //使用Prism高亮代码
        Prism.highlightElement(el)
    }
}
