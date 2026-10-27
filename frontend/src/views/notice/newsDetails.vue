<template>
  <!--
    原站 pages/notice/newsDetails（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg plr-16（pageBg #f7f7f8）
      → 全屏 u-loading-page 遮罩（fixed inset 0，display flex）
          spinner 26.6px @(181.7,319.7) 圆环色 #c8c8c8 / #f4f4f4
          「加载中...」12px #c8c8c8 @(172.5,355.5,45,14)
    数据：POST /discover/ant_news/info { id } → 实调 data:null
          原站 chunk（data.title="新闻发声"、data.info={}、data.category）
          因 info 为空，loading 遮罩持续覆盖全屏 → 复刻保持一致
  -->
  <div class="nd-page">
    <div class="nd-loading">
      <div class="nd-loading__box">
        <div class="nd-loading__spinner"></div>
        <span class="nd-loading__text">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAntNewsInfo } from '@/api'

const route = useRoute()
const info = ref({})

onMounted(async () => {
  try {
    const res = await getAntNewsInfo({ id: route.query.id || '' })
    info.value = res.data || {}
  } catch (e) {
    info.value = {}
  }
})
</script>

<style scoped>
.nd-page {
  position: relative;
  min-height: 100vh;
  background: #f7f7f8;
}
/* 原站 u-loading-page 固定铺满视口，内容整体偏上 74.8px
   （u-loading-page__warpper 自带下偏移），此处用 padding-bottom 还原 */
.nd-loading {
  position: fixed;
  inset: 0;
  padding-bottom: 154.8px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.nd-loading__box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nd-loading__spinner {
  width: 26.6px;
  height: 26.6px;
  border: 2px solid #f4f4f4;
  border-top-color: #c8c8c8;
  border-radius: 100px;
  animation: nd-spin 1.2s ease-in-out infinite;
}
@keyframes nd-spin {
  to {
    transform: rotate(360deg);
  }
}
.nd-loading__text {
  margin-top: 9.2px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color: #c8c8c8;
}
</style>
