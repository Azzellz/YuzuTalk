import axios from "axios";
import { ServerIpAddress } from "..";

export const PostAPI = axios.create({
    baseURL: `${ServerIpAddress}/api/post`,
    timeout: 10000,
})

