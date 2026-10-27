<template>
  <!--
    原站 pages/activeSelected/activeSelected（活动中心 / 活动精选）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：body bg rgb(247,247,248)
            navbar 390x44 bg rgb(250,250,250)
              返回 back-btn.png 24x24 @(13,10)
              标题「活动中心」15px bold rgb(51,51,51) @(165,16,60,16)
          → 顶部两个入口 170x66 @(16,60) / @(204,60)
              背景图 active-banner-bg1/2.webp 原站已 404 → 回落为 u-image__error 占位
              占位块 33x33 @(48.5,76.5) / @(236.5,76.5) bg rgb(243,244,246)
              感叹号图标 \ue624 16x16 @(57,85) / @(245,85) rgb(96,98,102)
              文字「最新活动」「抽奖中心」白字 15px @(93.5,82,60,22) / @(281.5,82,60,22)
          → tab 指示条 30x5 @(16,131) bg url(/static/bg/vector.png)
          → 空态插画 121x122 @(134.5,242) search-empty.png
    端点：POST /Activity/category → data []
          POST /activity/index {page:1,limit:10,category_id:1} → total 0
  -->
  <div class="as-page">
    <div class="as-nav">
      <div class="as-nav__back" @click="goBack"></div>
      <span class="as-nav__title">活动中心</span>
    </div>

    <div class="as-entry">
      <div class="as-entry__item">
        <div class="as-entry__icon">&#xe624;</div>
        <span class="as-entry__text">最新活动</span>
      </div>
      <div class="as-entry__item">
        <div class="as-entry__icon">&#xe624;</div>
        <span class="as-entry__text">抽奖中心</span>
      </div>
    </div>

    <div class="as-tabs">
      <div class="as-tabs__line"></div>
    </div>

    <div class="as-empty">
      <div class="as-empty__img"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getActivityCategory, getActivityIndex } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getActivityCategory()
    await getActivityIndex({ page: 1, limit: 10, category_id: 1 })
  } catch (e) {
    // 原站接口无数据时保持空态，不改动 UI
  }
})
</script>

<style scoped>
.as-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.as-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.as-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat 0 0 / 24px 24px;
}
.as-nav__title {
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
/* 两个入口 170x66 @(16,60) / @(204,60)，间距 18px */
.as-entry {
  position: absolute;
  left: 16px;
  top: 60px;
  width: 358px;
  height: 66px;
  display: flex;
  justify-content: space-between;
}
.as-entry__item {
  position: relative;
  width: 170px;
  height: 66px;
}
/* 原站背景图 active-banner-bg1/2.webp 已 404，浏览器回落为 u-image__error 占位块 */
.as-entry__icon {
  position: absolute;
  left: 32.5px;
  top: 16.5px;
  width: 33px;
  height: 33px;
  background: rgb(243, 244, 246);
  color: rgb(96, 98, 102);
  font-size: 16px;
  line-height: 33px;
  text-align: center;
}
.as-entry__text {
  position: absolute;
  left: 77.5px;
  top: 22px;
  width: 60px;
  height: 22px;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  color: rgb(255, 255, 255);
  white-space: nowrap;
}
/* tab 指示条 30x5 @(16,131) */
.as-tabs {
  position: absolute;
  left: 16px;
  top: 131px;
  width: 358px;
  height: 5px;
}
.as-tabs__line {
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 5px;
  background: url('/static/bg/vector.png') no-repeat 100% 100% / cover;
  border-radius: 100px;
}
/* 空态插画 121x122 @(134.5,242) */
.as-empty {
  position: absolute;
  left: 134.5px;
  top: 242px;
  width: 121px;
  height: 122px;
}
.as-empty__img {
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat 0 0 / 121px 122px;
}
</style>
