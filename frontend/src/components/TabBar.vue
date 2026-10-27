<template>
  <div class="w-tabbar__fixed" style="position: fixed;">
    <nav class="w-tabbar__pill">
      <div
        v-for="item in list"
        :key="item.path"
        class="w-tabbar__item"
        @click="go(item.path)"
      >
        <div class="w-tabbar__icon" :class="{ 'is-active': item.path === current }">
          <img
            class="w-tabbar__icon-img"
            :src="item.path === current ? item.activeIcon : item.icon"
            alt=""
          />
        </div>
        <span class="w-tabbar__text" :class="{ 'is-active': item.path === current }">
          {{ item.text }}
        </span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({ current: { type: String, default: '' } })

const route = useRoute()
const router = useRouter()

const current = computed(() => props.current || route.path)

/**
 * TabBar —— 完全对齐原站渲染结果
 * 原站真实渲染 static/tabBar/{1..10}.webp，实测映射为「奇数=未选中 / 偶数=选中」：
 *   首页 1/2 · 市场 3/4 · 公告 5/6 · 活动 7/8 · 我的 9/10
 * 容器为居中胶囊（344×56，圆角 28px），非全宽通栏。
 */
const list = [
  { text: '首页', path: '/pages/index/index', icon: '/assets/tabbar/1.webp', activeIcon: '/assets/tabbar/2.webp' },
  { text: '市场', path: '/pages/market/market', icon: '/assets/tabbar/3.webp', activeIcon: '/assets/tabbar/4.webp' },
  { text: '公告', path: '/pages/notice/notice', icon: '/assets/tabbar/5.webp', activeIcon: '/assets/tabbar/6.webp' },
  { text: '活动', path: '/pages/activity/activity', icon: '/assets/tabbar/7.webp', activeIcon: '/assets/tabbar/8.webp' },
  { text: '我的', path: '/pages/my/my', icon: '/assets/tabbar/9.webp', activeIcon: '/assets/tabbar/10.webp' }
]

function go(path) {
  if (path === route.path) return
  router.push(path)
}
</script>

<style scoped>
.w-tabbar__fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  padding-bottom: var(--safe-bottom, 0px);
  display: flex;
  justify-content: center;
}

.w-tabbar__pill {
  display: flex;
  align-items: stretch;
  width: 344px;
  height: 56px;
  border: 1px solid #887d67;
  border-radius: 28px;
  background: linear-gradient(
    135deg,
    rgba(148, 133, 112, 0.92) 0%,
    rgba(38, 35, 33, 0.94) 40%,
    rgba(118, 113, 91, 0.96) 100%
  );
  overflow: hidden;
}

.w-tabbar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.w-tabbar__icon {
  width: 20px;
  height: 20px;
  margin: 0;
}

.w-tabbar__icon-img {
  width: 100%;
  height: 100%;
  display: block;
}

.w-tabbar__text {
  margin-top: 4px;
  font-size: 10px;
  line-height: 1.2;
  letter-spacing: normal;
  font-weight: 400;
  color: #c6c0b5;
}

.w-tabbar__text.is-active {
  color: #fff8e5;
  font-weight: 700;
}
</style>
