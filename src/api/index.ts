import axios from "axios"

export const ServerIpAddress = 'http://localhost:4000'
//配置根路径
axios.defaults.baseURL = ServerIpAddress
