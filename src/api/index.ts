import axios from 'axios'

export const ServerIpAddress: string = 'http://localhost:4000'
export const TimeOut: number = 10000
//配置根路径
axios.defaults.baseURL = ServerIpAddress
