<template>
  <!--
    原站 pages/compound/record（合成记录 / 活动记录）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：navbar 390x44 bg rgb(250,250,250)
            返回 back-btn.png 24x24 @(13,10)
            标题「活动记录」15px bold rgb(51,51,51) @(165,16,60,16)
      → 空态区 358x257 @(16,148)
            插画 121x122 @(134.5,148) search-empty.png
            「加载中」文字为 u-loading-icon__text，颜色 rgb(255,255,255)（白底不可见，原站如此）
    端点：POST /synthesis/recordList { page:1 } → { total:0, data:[] }
  -->
  <div class="cr-page">
    <div class="cr-nav">
      <div class="cr-nav__back" @click="goBack"></div>
      <span class="cr-nav__title">活动记录</span>
    </div>

    <div class="cr-empty">
      <div class="cr-empty__img"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSynthesisRecordList } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getSynthesisRecordList({ page: 1 })
  } catch (e) {
    // 原站接口异常时保持空态，不改动 UI
  }
})
</script>

<style scoped>
.cr-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.cr-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.cr-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat center / 24px 24px;
}
.cr-nav__title {
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
/* 空态区 358x257 @(16,148) */
.cr-empty {
  position: absolute;
  left: 16px;
  top: 148px;
  width: 358px;
  height: 257px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 135px;
  box-sizing: border-box;
}
.cr-empty__img {
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat center / 121px 122px;
}
</style>
