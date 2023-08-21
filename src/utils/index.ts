import { computed, type ComputedRef } from "vue"

export const serverIpAddress = 'http://localhost:4000'

//获取更好的时间格式,formatTime格式必须为YYYY-MM-DD
export function getBetterFormatTime(formatTime:string):ComputedRef<string> {
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
export function avatarURL(avatar:string):string{
    return `${serverIpAddress}/user_avatar/${avatar}`
}
