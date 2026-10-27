<template>
  <!--
    原站 pages/notice/wallDetails（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container wall page-bg plr-16（pageBg #f7f7f8）
      → 全屏 u-loading-page 遮罩（fixed inset 0，display flex）
          spinner 25.7px @(182.2,320.2) 圆环色 #c8c8c8 / #f4f4f4
          「加载中...」12px #c8c8c8 @(172.5,355.5,45,14)
    数据：POST /discover/rumor_wall/info { id } → 实调 data:null
          POST /discover/rumor_wall/getcomment { id, page } → 实调 total:0
          原站 chunk data 含 isError/loading/…
          因 info 为空，loading 遮罩持续覆盖全屏 → 复刻保持一致
  -->
  <div class="wd-page">
    <div class="wd-loading">
      <div class="wd-loading__box">
        <div class="wd-loading__spinner"></div>
        <span class="wd-loading__text">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getRumorWallInfo, getRumorWallComment } from '@/api'

const route = useRoute()
const info = ref({})
const commentList = ref([])

onMounted(async () => {
  const id = route.query.id || ''
  try {
    const res = await getRumorWallInfo({ id })
    info.value = res.data || {}
  } catch (e) {
    info.value = {}
  }
  try {
    const res = await getRumorWallComment({ id, page: 1 })
    commentList.value = (res.data && res.data.data) || []
  } catch (e) {
    commentList.value = []
  }
})
</script>

<style scoped>
.wd-page {
  position: relative;
  min-height: 100vh;
  background: #f7f7f8;
}
/* 原站 u-loading-page 固定铺满视口，内容整体偏上，与 newsDetails 一致 */
.wd-loading {
  position: fixed;
  inset: 0;
  padding-bottom: 154.8px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.wd-loading__box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.wd-loading__spinner {
  width: 25.7px;
  height: 25.7px;
  border: 2px solid #f4f4f4;
  border-top-color: #c8c8c8;
  border-radius: 100px;
  animation: wd-spin 1.2s ease-in-out infinite;
}
@keyframes wd-spin {
  to {
    transform: rotate(360deg);
  }
}
.wd-loading__text {
  margin-top: 9.8px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color: #c8c8c8;
}
</style>
