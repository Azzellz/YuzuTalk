import axios from 'axios'
import { ServerIpAddress, TimeOut } from '..'

export const UserAPI = axios.create({
    baseURL: `${ServerIpAddress}/api/user`,
    timeout: TimeOut
})
export const UsersAPI = axios.create({
    baseURL: `${ServerIpAddress}/api/users`,
    timeout: TimeOut
})
