import axios from 'axios'
import { ServerIpAddress } from '..'

export const UserAPI = axios.create({
    baseURL: `${ServerIpAddress}/api/user`,
    timeout: 10000
})
