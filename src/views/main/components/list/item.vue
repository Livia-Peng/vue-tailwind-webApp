<template>
  <div class="bg-white dark:bg-zinc-900 xl:dark:bg-zinc-800 rounded pb-1">
    <div
      class="relative w-full rounded cursor-zoom-in group"
      :style="{
        backgroundColor: randomRGB()
      }"
      @click="onToPinsClick">
      <!-- :src="data.photo" -->
      <img
        v-lazy
        ref="imgTarget"
        class="w-full rounded bg-transparent"
        :src="data.photo"
        :style="{
          height: (width / data.photoWidth) * data.photoHeight + 'px'
        }" />
      <!-- 遮罩层 -->
      <div
        class="opacity-0 w-full h-full bg-zinc-900/50 absolute top-0 left-0 rounded duration-300 group-hover:opacity-100 hidden xl:block">
        <!-- 分享 -->
        <m-button class="absolute top-1.5 left-1.5" @click="onShareClick">分享</m-button>
        <!-- 点赞 -->
        <m-button
          class="absolute top-1.5 right-1.5"
          type="info"
          icon="heart"
          iconClass="fill-zinc-900 dark:fill-zinc-200" />
        <!-- 下载 -->
        <m-button
          class="absolute bottom-1.5 left-1.5 bg-zinc-100/70"
          type="info"
          size="small"
          icon="download"
          iconClass="fill-zinc-900 dark:fill-zinc-200"
          @click="onDownload" />
        <!-- 全屏 -->
        <m-button
          class="absolute bottom-1.5 right-1.5 bg-zinc-100/70"
          type="info"
          size="small"
          icon="full"
          iconClass="fill-zinc-900 dark:fill-zinc-200"
          @click="onImgFullScreen" />
      </div>
    </div>
    <!-- 标题 -->
    <p class="text-sm mt-1 font-bold text-zinc-900 dark:text-zinc-300 line-clamp-2 px-1" alt>
      {{ data.title }}
    </p>
    <!-- 作者 -->
    <div class="flex items-center mt-1 px-1">
      <img v-lazy class="h-2 w-2 rounded-full" :src="data.avatar" alt="" />
      <span class="text-sm text-zinc-500 ml-1">{{ data.author }}</span>
    </div>
  </div>
</template>

<script setup>
  import { useFullscreen, useElementBounding } from '@vueuse/core'
  import { ref, computed } from 'vue'
  import { randomRGB } from '@/utils/color'
  import { saveAs } from 'file-saver'
  import { message } from '@/libs'
  import { weiboShare } from '@/utils/share'

  const props = defineProps({
    data: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 0
    }
  })

  const emits = defineEmits(['click'])

  const imgTarget = ref(null)
  /**
   * pins 跳转处理，记录图片的中心点（X|Y位置 + 宽|高的一半）
   */
  const {
    x: imgContainerX,
    y: imgContainerY,
    width: imgContainerWidth,
    height: imgContainerHeight
  } = useElementBounding(imgTarget)
  const imgContainerCenter = computed(() => {
    return {
      translateX: parseInt(imgContainerX.value + imgContainerWidth.value / 2),
      translateY: parseInt(imgContainerY.value + imgContainerHeight.value / 2)
    }
  })
  /**
   * 进入详情点击事件
   */
  const onToPinsClick = () => {
    emits('click', {
      id: props.data.id,
      localtion: imgContainerCenter.value
    })
  }

  /**
   * 生成全屏方法
   */
  const { enter: onImgFullScreen } = useFullscreen(imgTarget)

  /**
   * 下载按钮点击事件
   */
  const onDownload = () => {
    // 提示消息
    message('success', '图片开始下载')
    setTimeout(() => {
      saveAs(props.data.photoDownLink, `${props.data.title} - 作者：${props.data.author}`)
    }, 100)
  }

  /**
   * 分享按钮点击处理
   */
  const onShareClick = () => {
    weiboShare(props.data.photo, `https://imooc-front.lgdsunday.club/pins/${props.data.id}`)
  }
</script>
