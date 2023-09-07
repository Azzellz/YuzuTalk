<template>
    <el-input
        v-if="searchType === 'lazy'"
        v-model="keyword"
        :placeholder="placeholder"
        suffix-icon="Search"
        class="search"
        @keydown.enter="lazySearch"
    ></el-input>
    <el-input
        v-else
        v-model="keyword"
        :placeholder="placeholder"
        suffix-icon="Search"
        class="search"
    ></el-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
//数据抽象成Props,行为抽象成Emits
//定义Props
const props = withDefaults(
    defineProps<{
        searchType: 'lazy' | 'immediate' //定义搜索模式
        placeholder: string //搜索框内容
    }>(),
    {
        searchType: 'immediate', //默认是立刻搜索
        placeholder: '请搜索'
    }
)
//定义事件触发函数
const emit = defineEmits<{
    search: [newKeyword: string]
}>()
//绑定搜索逻辑
//#region
function lazySearch(event: Event) {
    //事件处理函数类型断言,这样写不错的👍
    const keyword: string = (event.target as HTMLInputElement).value
    //触发搜索事件
    emit('search', keyword)
}
//即时搜索模式
const keyword = ref<string>('')
if (props.searchType === 'immediate') {
    //即刻执行
    watch(keyword, (newKeyword:string) => {
        emit('search', newKeyword)
    })
}
//#endregion
//懒搜索模式
</script>

<style scoped>
.search {
    width: 50%;
    margin: 20px;
    height: 40px;
}
</style>
