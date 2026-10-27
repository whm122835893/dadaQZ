<template>
  <!--
    原站 pages/activity/record（中签记录）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：body bg rgb(247,247,248)
            navbar 390x44 bg rgb(250,250,250)
              返回 back-btn.png 24x24 @(13,10)
              标题「中签记录」15px bold rgb(51,51,51) @(165,16,60,16)
          → 空容器 358x32 @(16,44) br12px pa16（列表为空，容器保留 padding）
          → 空态插画 121x122 @(134.5,284) search-empty.png
    端点：POST /draw/drawLog → { code:1, data:[] }
  -->
  <div class="ar-page">
    <div class="ar-nav">
      <div class="ar-nav__back" @click="goBack"></div>
      <span class="ar-nav__title">中签记录</span>
    </div>

    <div class="ar-box"></div>

    <div class="ar-empty">
      <div class="ar-empty__img"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getActivityDrawLog } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getActivityDrawLog()
  } catch (e) {
    // 原站接口无数据时保持空态，不改动 UI
  }
})
</script>

<style scoped>
.ar-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.ar-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.ar-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat 0 0 / 24px 24px;
}
.ar-nav__title {
  position: absolute;
  left: 165px;
  top: 16px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: rgb(51, 51, 51);
  text-align: center;
}
/* 空列表容器 358x32 @(16,44) br12px pa16（原站列表为空，仅剩 padding，无背景色） */
.ar-box {
  position: absolute;
  left: 16px;
  top: 44px;
  width: 358px;
  height: 32px;
  padding: 16px;
  border-radius: 12px;
}
/* 空态插画 121x122 @(134.5,284) */
.ar-empty {
  position: absolute;
  left: 134.5px;
  top: 284px;
  width: 121px;
  height: 122px;
}
.ar-empty__img {
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat 0 0 / 121px 122px;
}
</style>
