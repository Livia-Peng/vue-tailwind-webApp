<template>
  <!-- 路由出口 -->
  <router-view v-slot="{ Component }">
    <!-- 动画组件 -->
    <transition :name="transitionName" @before-enter="beforeEnter" @after-leave="afterLeave">
      <!-- 缓存组件 -->
      <keep-alive :include="virtualTaskStack">
        <component
          :is="Component"
          :class="{ 'fixed top-0 left-0 w-screen z-50': isAnimation }"
          :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>
  // 无需监听路由的各种状态（在 PC 端下）
  const NONE = 'none'
  // 路由进入
  const PUSH = 'push'
  // 路由退出
  const BACK = 'back'
  // 路由跳转的 enum
  const ROUTER_TYPE_ENUM = [NONE, PUSH, BACK]
</script>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const props = defineProps({
    // 路由跳转的类型，对应 ROUTER_TYPE_ENUM
    routerType: {
      type: String,
      default: NONE,
      validator(val) {
        const result = ROUTER_TYPE_ENUM.includes(val)
        if (!result) {
          throw new Error(`你的 routerType 必须是 ${ROUTER_TYPE_ENUM.join('、')} 中的一个`)
        }
        return result
      }
    },
    // 首页的组件名称，对应任务栈中的第一个组件
    mainComponentName: {
      type: String,
      required: true
    }
  })

  // 处理动画状态变化
  const isAnimation = ref(false)
  const beforeEnter = () => {
    isAnimation.value = true
  }
  const afterLeave = () => {
    isAnimation.value = false
  }

  // 任务栈
  const virtualTaskStack = ref([props.mainComponentName])

  const router = useRouter()
  // 跳转动画
  const transitionName = ref('')
  /**
   * 监听路由变化
   */
  router.beforeEach((to, from) => {
    // console.log(virtualTaskStack.value)
    // 定义当前动画名称
    transitionName.value = props.routerType

    if (props.routerType === PUSH) {
      // 入栈
      virtualTaskStack.value.push(to.name)
    } else if (props.routerType === BACK) {
      // 出栈
      virtualTaskStack.value.pop()
    }

    // 进入首页默认清空栈
    if (to.name === props.mainComponentName) {
      clearTask()
    }
  })
  /**
   * 清空栈
   */
  const clearTask = () => {
    virtualTaskStack.value = [props.mainComponentName]
  }
</script>

<style lang="scss" scoped>
  // push页面时：新页面的进入动画
  .push-enter-active {
    animation-name: push-in;
    animation-duration: 0.4s;
  }
  // push页面时：老页面的退出动画
  .push-leave-active {
    animation-name: push-out;
    animation-duration: 0.4s;
  }
  // push页面时：新页面的进入动画
  @keyframes push-in {
    0% {
      transform: translate(100%, 0);
    }
    100% {
      transform: translate(0, 0);
    }
  }
  // push页面时：老页面的退出动画
  @keyframes push-out {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-50%, 0);
    }
  }

  // 后退页面时：即将展示的页面动画
  .back-enter-active {
    animation-name: back-in;
    animation-duration: 0.4s;
  }
  // 后退页面时：后退的页面执行的动画
  .back-leave-active {
    animation-name: back-out;
    animation-duration: 0.4s;
  }
  // 后退页面时：即将展示的页面动画
  @keyframes back-in {
    0% {
      width: 100%;
      transform: translate(-100%, 0);
    }
    100% {
      width: 100%;
      transform: translate(0, 0);
    }
  }
  // 后退页面时：后退的页面执行的动画
  @keyframes back-out {
    0% {
      width: 100%;
      transform: translate(0, 0);
    }
    100% {
      width: 100%;
      transform: translate(50%, 0);
    }
  }
</style>
