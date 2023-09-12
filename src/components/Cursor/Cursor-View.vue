<template>
    <!-- 模拟鼠标的dom -->
    <div ref="cursor" id="cursor" :class="cursorStatus"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
//获取模板引用
const cursor = ref<HTMLDivElement | null>(null)
const pt: Array<string> = []
//鼠标的状态
type CursorStatus = 'hidden' | 'active' | 'hover' | 'default'
const cursorStatus = ref<CursorStatus>('hidden')

//渲染
const renderCursor = () => {
    interface point {
        x: number
        y: number
    }
    let pos = { curr: {} as point, prev: {} as point }
    //这里要确定是存在的
    const cursorEl = cursor.value!

    const moveCursor = (left: number, top: number) => {
        cursorEl.style.left = `${left}px`
        cursorEl.style.top = `${top}px`
    }
    //绑定事件
    document.onmouseover = (e: Event) => {
        if (pt.includes((e.target as HTMLDivElement).outerHTML)) {
            cursorStatus.value = 'hover'
        }
    }

    document.onmouseout = (e) => {
        if (pt.includes((e.target as HTMLDivElement).outerHTML)) {
            cursorStatus.value = 'default'
        }
    }

    document.onmousemove = (e) => {
        if (!pos.curr.x) {
            moveCursor(e.clientX - 8, e.clientY - 8)
        }
        pos.curr = { x: e.clientX - 8, y: e.clientY - 8 } as any
        cursorStatus.value = 'default'
    }

    document.onmouseenter = () => {
        cursorStatus.value = 'default'
    }

    document.onmouseleave = () => {
        cursorStatus.value = 'hidden'
    }

    document.onmousedown = () => {
        cursorStatus.value = 'active'
    }

    document.onmouseup = () => {
        cursorStatus.value = 'default'
    }
    //插值函数
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

    const render = () => {
        if (pos.prev.x) {
            pos.prev.x = lerp(pos.prev.x, pos.curr.x, 0.15)
            pos.prev.y = lerp(pos.prev.y, pos.curr.y, 0.15)
            moveCursor(pos.prev.x, pos.prev.y)
        } else {
            pos.prev = pos.curr
        }
        //60帧
        requestAnimationFrame(render)
    }

    render()
}

onMounted(() => {
    renderCursor()
})
</script>

<style lang="less" scoped>
#cursor {
    position: fixed;
    width: 16px;
    height: 16px;
    background: #000;
    border-radius: 8px;
    opacity: 0.25;
    z-index: 10086;
    pointer-events: none;
    transition: 0.2s ease-in-out;
    transition-property: background, opacity, transform;
}
/*离开界面时隐藏*/
#cursor.hidden {
    opacity: 0;
}
/*鼠标悬浮时放大*/
#cursor.hover {
    opacity: 0.1;
    transform: scale(2.5);
}
/*鼠标左键时缩小*/
#cursor.active {
    opacity: 0.5;
    transform: scale(0.5);
}
</style>
