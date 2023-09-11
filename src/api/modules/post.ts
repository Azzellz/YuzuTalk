import axios from "axios";
import { ServerIpAddress, TimeOut } from "..";

//对单个post的api
export const PostAPI = axios.create({
    baseURL: `${ServerIpAddress}/api/post`,
    timeout: TimeOut,
})
//对posts的api
export const PostsAPI = axios.create({
    baseURL: `${ServerIpAddress}/api/posts`,
    timeout: TimeOut
})

