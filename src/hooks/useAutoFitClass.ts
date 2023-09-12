import { computed } from 'vue'
import { useRoute } from 'vue-router'
//根据当前路由信息返回自适应header和aside的样式
export function useAutoFitClass() {
    type autoFitClass = 'without-aside' | 'without-header' | 'with-aside-header' | ''
    const route = useRoute()
    const autoFitClass = computed<autoFitClass>(() => {
        if (route.meta.isHideAside && route.meta.isHideHeader) return ''
        else if (route.meta.isHideAside) return 'without-aside'
        else if (route.meta.isHideHeader) return 'without-header'
        else return 'with-aside-header'
    })
    return {
        autoFitClass
    }
}
