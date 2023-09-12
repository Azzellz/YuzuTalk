import { computed, type ComputedRef } from 'vue'
import { ServerIpAddress } from '@/api/index';


//获取更好的时间格式,formatTime格式必须为YYYY-MM-DD
export function getBetterFormatTime(formatTime: string): ComputedRef<string> {
    const betterFormatTime = computed(() => {
        //如果是当前年份则不显示年份
        const currentYear = new Date().getFullYear() + ''
        if (formatTime.split('-')[0] === currentYear) {
            return formatTime.split('-').slice(1).join('-')
        } else {
            return formatTime
        }
    })
    return betterFormatTime
}
//获取服务器图片地址
export function avatarURL(avatar: string): string {
    return `${ServerIpAddress}/user/avatar/${avatar}`
}

//防抖函数
export function debounce<F extends (...args: any[]) => any>(
    func: F,
    delay: number
): (...args: Parameters<F>) => void {
    let timeoutId: ReturnType<typeof setTimeout>
    let isFirstCall = true // 添加标记:是否首次执行
    return function (...args: Parameters<F>): void {
        clearTimeout(timeoutId)

        if (isFirstCall) {
            func.apply(func, args)
            isFirstCall = false
        } else {
            timeoutId = setTimeout(() => {
                func.apply(func, args)
            }, delay)
        }
    }
}
