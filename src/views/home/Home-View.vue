<template>
    <div class="container">
        <div class="recent-posts">
            <h1 style="text-align: center">最新</h1>
            <el-scrollbar>
                <PostCard
                    v-for="post in PostStore.latestPosts.list"
                    :key="post._id"
                    :post="post"
                    :FROM="POST_FROM.LATEST_POSTS"
                />
            </el-scrollbar>
        </div>
        <div class="recent-users">
            <div class="hot-user-post">
                <h1 style="text-align: center; margin: 20px">
                    {{ UserStore.currentUser.origin.user_name }}
                </h1>
                <!-- 本人 -->
                <div class="user-box">
                    <UserAvatarRoute
                        :user="UserStore.currentUser.origin"
                        :options="{
                            fit: 'fill',
                            style: 'margin: 20px',
                            size: 120
                        }"
                    ></UserAvatarRoute>
                    <div class="user-meta">
                        <p>发表了{{ UserStore.currentUser.publishedPosts.total }}篇帖子</p>
                        <p>收藏了{{ UserStore.currentUser.favoritesPosts.total }}篇帖子</p>
                        <p>关注了{{ UserStore.currentUser.origin.follows.length }}人</p>
                        <p>被{{ UserStore.currentUser.origin.fans.length }}人关注</p>
                    </div>
                </div>
            </div>
            <div class="recent-visitor">
                <h1 style="text-align: center; margin: 20px">最近访客</h1>
                <div style="padding: 20px">
                    <UserAvatarRoute
                        v-for="user in UserStore.recentUsers.origin"
                        :key="user._id"
                        :user="user"
                        :avatarSize="60"
                    ></UserAvatarRoute>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import UserAvatarRoute from '@/components/User/User-Avatar-Route.vue'
import PostCard from '../post/card/Post-Card.vue'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/user'
import { POST_FROM } from '@/models/post/enum'

//初始化数据
//#region
const PostStore = usePostStore()
const UserStore = useUserStore()
//获取有用到的数据
//TODO: 这里没做TryCatch
try {
    await Promise.all([
        PostStore.getLatestPosts(10),
        UserStore.getCurrentUser(),
        UserStore.getRecentUsers()
    ])
} catch (error) {
    console.log(error)
}

//#endregion
</script>

<style lang="less" scoped>
.container {
    margin-top: 60px;
    padding: 50px;
    display: flex;
    .recent-posts {
        display: flex;
        flex-direction: column;
        align-content: center;
        height: 610px;
        overflow: auto;
        box-shadow: 0 0 10px #ccc;
        margin: 20px;
        padding: 50px;
        border-radius: 10px;
        flex: 0.6;
    }
    .recent-users {
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        flex: 0.4;
        .hot-user-post {
            box-shadow: 0 0 10px #ccc;
            margin: 20px;
            border-radius: 10px;
            flex: 0.5;
            .user-box {
                display: flex;
                padding: 20px;
                .user-meta {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    padding: 25px;
                    line-height: 1.5;
                    flex: 1;
                    text-align: center;
                    color: #999999;
                }
            }
        }
        .recent-visitor {
            box-shadow: 0 0 10px #ccc;
            margin: 20px;
            border-radius: 10px;
            flex: 0.5;
        }
    }
}
</style>
