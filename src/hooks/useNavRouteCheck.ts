import router from '@/router'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'
//顶部Header检查
export function useHeaderNavRouteCheck() {
  //获取当前路由
  const currentRoute: RouteLocationNormalizedLoaded = useRoute()
  //动态路由索引,以当前路由path初始化
  const activeIndex = ref(currentRoute.path)
  const currentIndex = ref(false) //刚开始不可见
  //动态展示导航标题内容
  const currentIndexContent = computed(() => {
    if (currentRoute.query.title) return currentRoute.query.title
    else return '当前'
  })
  //监听路由变化,当路由变化自动调用hook
  watchEffect(() => {
    checkRoute(currentRoute)
  })

  //组件创建初就开始路由检查
  onMounted(() => {
    checkRoute(currentRoute)
  })
  //显示当前路由标题
  function showCurrentIndex(to: RouteLocationNormalizedLoaded) {
    activeIndex.value = to.fullPath
    currentIndex.value = true
  }
  //路由检查
  function checkRoute(to: RouteLocationNormalizedLoaded) {
    currentIndex.value = false
    const front = to.path.split('/')[1]
    const end = to.path.split('/')[2]
    //匹配前缀和后缀
    switch (front) {
      case 'post':
        activeIndex.value = '/post/list'
        break
      case 'user':
        if (end === 'info' || end === 'follows' || end === 'published' || end === 'favorites') {
          activeIndex.value = '/user/info'
        } else {
          showCurrentIndex(to)
        }
        break
      default:
        //TODO导航到首页???或者可以导航到未知页?
        activeIndex.value = '/home'
        router.replace('/home')
        break
    }
  }
  return {
    activeIndex,
    currentIndex,
    currentIndexContent
  }
}

//PostAside检查
export function usePostAsideNavRouteCheck() {
  //获取当前路由
  const currentRoute: RouteLocationNormalizedLoaded = useRoute()
  //动态路由索引,以当前路由path初始化
  const activeIndex = ref(currentRoute.path)
  const currentIndex = ref(false) //刚开始不可见
  //动态展示导航标题内容
  const currentIndexContent = computed(() => {
    if (currentRoute.query.title) return currentRoute.query.title
    else return '当前'
  })

  //监听路由变化,当路由变化自动调用hook
  watchEffect(() => {
    checkRoute(currentRoute)
    // console.log(currentRoute)
  })

  //组件创建初就开始路由检查
  onMounted(() => {
    checkRoute(currentRoute)
  })
  //显示当前路由标题
  function showCurrentIndex(to: RouteLocationNormalizedLoaded) {
    activeIndex.value = to.fullPath
    currentIndex.value = true
  }
  //路由检查
  function checkRoute(to: RouteLocationNormalizedLoaded) {
    currentIndex.value = false
    switch (to.path) {
      case '/post/list':
        activeIndex.value = '/post/list'
        break
      case '/post/publish':
        activeIndex.value = '/post/publish'
        break
      default:
        showCurrentIndex(to)
        break
    }
  }

  return {
    activeIndex,
    currentIndex,
    currentIndexContent
  }
}

//UserAside检查
export function useUserAsideNavRouteCheck() {
    //获取当前路由
    const currentRoute: RouteLocationNormalizedLoaded = useRoute()
    //动态路由索引,以当前路由path初始化
    const activeIndex = ref(currentRoute.path)
    const currentIndex = ref(false) //刚开始不可见
    //动态展示导航标题内容
    const currentIndexContent = computed(() => {
        if (currentRoute.query.title) return currentRoute.query.title
        else return '当前'
    })

    //监听路由变化,当路由变化自动调用hook
    watchEffect(() => {
        checkRoute(currentRoute)
    })

    //组件创建初就开始路由检查
    onMounted(() => {
        checkRoute(currentRoute)
    })
    //显示当前路由标题
    function showCurrentIndex(to: RouteLocationNormalizedLoaded) {
        activeIndex.value = to.fullPath
        currentIndex.value = true
    }
    //路由检查
    function checkRoute(to: RouteLocationNormalizedLoaded) {
        currentIndex.value = false
        switch (to.path) {
            case '/user/info':
                activeIndex.value = '/user/info'
                break
            case '/user/published':
                activeIndex.value = '/user/published'
                break
            case '/user/favorites':
                activeIndex.value = '/user/favorites'
                break
            default:
                showCurrentIndex(to)
                break
        }
    }

    return {
        activeIndex,
        currentIndex,
        currentIndexContent
    }
}