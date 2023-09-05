import type { I_MainUserInfo } from '@/models/user/interface'
import type { POST_FROM } from '../enum'

//Post
export interface Post {
    _id: string //id,由服务端生成
    title: string //标题
    content: string //正文
    user: I_MainUserInfo //主要的用户信息
    tags: Array<string> //标签
    comments: Array<Comment> //评论
    support: number //帖子点赞数
    oppose: number //帖子反对数
    follow: number //收藏数
    isShowContent: boolean //是否显示正文
    isCommentable: boolean //是否启动评论区
    isUnknown: boolean //是否匿名发布
    index: number //文章索引
    format_time: string //格式化的发布时间
    time_stamp: number //发布时间戳
}
//发布时的数据约束
export interface PublishPost {
    title: string //标题
    content: string //正文
    tags: Array<string> //标签
    //发布时只需要初始化,所以不需要很细的接口限制
    comments: Array<object> //评论
    support: number //帖子点赞数
    oppose: number //帖子反对数
    follow: number //收藏数
    isShowContent: boolean //是否显示正文
    isCommentable: boolean //是否启动评论区
    isUnknown: boolean //是否匿名发布
}
//Comment
export interface Comment {
    _id: string //id
    user: I_MainUserInfo //用户信息
    post: Post //评论所属的post
    content: string //评论内容
    time_stamp: number //评论时间戳
    format_time: string //格式化的评论时间
    support: number //评论点赞数
    oppose: number //评论反对数
}
//post列表
export interface PostList {
    list: Array<Post> //post列表
    total: number //post总数
    FROM: POST_FROM //post来源
}
//浏览过的post
export interface I_VisitedPost extends Post,Pagination {
    FROM: POST_FROM //post来源
}
//浏览过的post列表
export interface I_VisitedPosts {
    list: Array<I_VisitedPost>
}
//分页数据
export interface Pagination {
    currentPage: number //当前页
    pageSize: number //每页显示的记录数
}
//可分页的列表
export interface PaginatedPostList extends PostList, Pagination {}
//搜索
export interface Search {
    keyword: string //搜索关键字
}
//获取post的参数:分页+搜索
export interface GetPostOption extends Pagination, Search {}
//后端返回的posts类型
export interface GetPostResponse {
    data: {
        data: {
            posts: Array<Post> //post列表
            total: number //post总数(在数据库中的总数,不是当前页的总数)
        }
    }
}
