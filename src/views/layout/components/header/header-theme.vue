<template>
  <m-popover>
    <template #reference>
      <m-svg-icon
        :name="svgIconName"
        class="guide-theme w-4 h-4 p-1 cursor-pointer rounded-sm duration-200 outline-none hover:bg-zinc-100/60 dark:hover:bg-zinc-900"
        fillClass="fill-zinc-900 dark:fill-zinc-300"></m-svg-icon>
    </template>

    <div class="w-[140px] overflow-hidden">
      <div
        class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60 dark:hover:bg-zinc-800"
        v-for="item in themeArr"
        :key="item.id"
        @click="onItemClick(item)">
        <m-svg-icon
          :name="item.icon"
          class="w-1.5 h-1.5 mr-1"
          fillClass="fill-zinc-900 dark:fill-zinc-300"></m-svg-icon>
        <span class="text-zinc-800 dark:text-zinc-300 text-sm">{{ item.name }}</span>
      </div>
    </div>
  </m-popover>
</template>

<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { commonConfig } from '@/constants'

  // 构建渲染数据源
  const themeArr = [
    {
      id: '0',
      type: commonConfig.themeTypes.LIGHT,
      icon: 'theme-light',
      name: '极简白'
    },
    {
      id: '1',
      type: commonConfig.themeTypes.DARK,
      icon: 'theme-dark',
      name: '极夜黑'
    },
    {
      id: '2',
      type: commonConfig.themeTypes.SYSTEM,
      icon: 'theme-system',
      name: '跟随系统'
    }
  ]

  // 图标展示
  const store = useStore()
  const svgIconName = computed(() => {
    // 根据当前的 themeType 返回当前的选中 icon
    const findTheme = themeArr.find((theme) => {
      return theme.type === store.getters.themeType
    })
    return findTheme?.icon || themeArr[0].icon
  })

  const onItemClick = (item) => {
    // console.log(item)
    store.commit('theme/changeThemeType', item.type)
  }
</script>
