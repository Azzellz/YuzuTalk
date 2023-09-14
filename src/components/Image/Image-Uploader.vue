<template>
    <!-- <div class="container"> -->
    <vueCropper
        ref="cropper"
        :img="option.img"
        :outputSize="option.outputSize"
        :outputType="option.outputType"
        :autoCrop="true"
        :full="true"
    ></vueCropper>
    <!-- </div> -->
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { reactive } from 'vue'
import { avatarURL } from '@/utils/index'
const option = reactive({
    img: avatarURL(localStorage.getItem('avatar')!),
    outputSize: 1,
    outputType: 'jpeg'
})
</script>

<style lang="less" scoped>
.container {
    width: 500px;
    height: 500px;
}
</style>
