<template>
  <!--
    原站 pages/kline/info（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：pageBg rgb(247,247,248)
      → u-navbar 深色 rgb(35,39,68) 390x44 @(0,0)
          返回 back-btn2.png 24x24 @(13,10)
          标题「详情」15px bold #fff @(180,15.5,30,16)
          右上「切换购买」12px #fff @(329,13,48,18)
      → swiper 高 179：图片 br10px，指示点 15x2 @(17,42)/(40,42) bg rgb(54,153,255)
      → 价格区（深色背景内）：
          「藏品名称」16px #fff @(0,236)
          「比太」12px #7a7a7a @(74,239,24,14)
          「112.34CNY」16px #333 @(0,255,77.2,17)
          「-0.53%」12px #333 @(87.2,257.5,35,14)
          6 行指标 15px #4a4a4a，y=277/298/319/340/361/382
      → tab bar 390x21 @(0,399) bg rgb(35,39,68)
          「行情」15px #fff @(37,399,30,21)（激活）
          「相关公告」/「成交记录」/「换手榜」/「寄售」15px #414141
          指示线 35x3 @(34.5,415) bg vector.png br100px
      → 底部固定操作条：
          「开启行情提醒」149x39 @(16,793.5) bg rgb(231,141,210) br26px
          「批量买卖」149x39 @(183,793.5) bg rgb(234,171,75) br26px
          关注 icon sc3.png 24x24 @(350,793.5) + 「关注」10px #fff @(352,820.5,20,11)
    数据：原站该页不发请求（复用商城 market 缓存），本地走 getKlineInfo mock
  -->
  <div class="ki-page">
    <!-- 导航栏 -->
    <div class="ki-nav">
      <div class="ki-nav__back" @click="goBack"></div>
      <span class="ki-nav__title">详情</span>
      <span class="ki-nav__switch" @click="goBuy">切换购买</span>
    </div>

    <!-- 主图轮播 -->
    <div class="ki-swiper">
      <div class="ki-swiper__img" :style="{ backgroundImage: `url(${images[0]})` }"></div>
    </div>
    <span class="ki-swiper__dot ki-swiper__dot--active"></span>
    <span class="ki-swiper__dot"></span>

    <!-- 行情信息区 -->
    <div class="ki-info">
      <div class="ki-info__row1">
        <span class="ki-info__label">{{ title }}</span>
        <span class="ki-info__name">{{ name }}</span>
      </div>
      <div class="ki-info__row2">
        <span class="ki-info__price">{{ price }}CNY</span>
        <span class="ki-info__rate">{{ change_rate }}</span>
      </div>
      <div class="ki-info__metrics">
        <div v-for="m in metrics" :key="m.label" class="ki-metric">
          <span class="ki-metric__label">{{ m.label }}</span>
          <span class="ki-metric__value">{{ m.value }}</span>
        </div>
      </div>
    </div>

    <!-- 顶部二级 tab（横向可滚动，原站「寄售」在屏幕外 x=453） -->
    <div class="ki-tabs">
      <span
        v-for="(t, i) in tabs"
        :key="t"
        class="ki-tabs__item"
        :class="{ 'ki-tabs__item--active': i === 0 }"
      >{{ t }}</span>
      <span class="ki-tabs__line"></span>
    </div>

    <div class="ki-gap"></div>

    <!-- 底部操作条 -->
    <div class="ki-bottom">
      <div class="ki-bottom__btn ki-bottom__btn--pink" @click="onRemind">开启行情提醒</div>
      <div class="ki-bottom__btn ki-bottom__btn--orange" @click="onBatch">批量买卖</div>
      <div class="ki-bottom__follow">
        <div class="ki-bottom__follow-icon" @click="onFollow"></div>
        <span class="ki-bottom__follow-text">关注</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getKlineInfo } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()

const title = ref('藏品名称')
const name = ref('比太')
const price = ref('112.34')
const change_rate = ref('-0.53%')
const images = ref(['/assets/img/kline/goods.png', '/assets/img/kline/goods2.png'])
const metrics = ref([])
const tabs = ref(['行情', '相关公告', '成交记录', '换手榜', '寄售'])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/market/market')
}
function goBuy() {
  router.replace(`/pages/kline/buy?id=${route.query.id || 1}`)
}
function onRemind() {
  toast('已开启行情提醒')
}
function onBatch() {
  router.replace(`/pages/market/marketGoodsList?id=${route.query.id || 1}`)
}
function onFollow() {
  toast('关注成功')
}

onMounted(async () => {
  try {
    const res = await getKlineInfo({ id: route.query.id || 1 })
    const d = res.data || {}
    if (d.title) title.value = d.title
    if (d.name) name.value = d.name
    if (d.price) price.value = d.price
    if (d.change_rate) change_rate.value = d.change_rate
    if (Array.isArray(d.images) && d.images.length) images.value = d.images
    if (Array.isArray(d.metrics) && d.metrics.length) metrics.value = d.metrics
    if (Array.isArray(d.tabs) && d.tabs.length) tabs.value = d.tabs
  } catch (e) {
    /* mock 兜底保持默认 */
  }
})
</script>

<style scoped>
.ki-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
/* 导航栏：深色 390x44 */
.ki-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(35, 39, 68);
}
.ki-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn2.png') no-repeat center / 24px 24px;
}
.ki-nav__title {
  position: absolute;
  left: 180px;
  top: 15.5px;
  width: 30px;
  height: 16px;
  line-height: 16px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  text-align: center;
}
.ki-nav__switch {
  position: absolute;
  left: 329px;
  top: 13px;
  width: 48px;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  text-align: right;
  cursor: pointer;
}
/* 轮播：179 高 */
.ki-swiper {
  position: relative;
  width: 390px;
  height: 191px;
  background: rgb(247, 247, 248);
}
.ki-swiper__img {
  position: absolute;
  left: 13px;
  top: 8px;
  width: 364px;
  height: 179px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
}
.ki-swiper__dot {
  position: absolute;
  top: 42px;
  width: 15px;
  height: 2px;
  border-radius: 1px;
  background: rgb(54, 153, 255);
}
.ki-swiper__dot:nth-of-type(1) {
  left: 17px;
}
.ki-swiper__dot:nth-of-type(2) {
  left: 40px;
}
/* 行情信息区 */
.ki-info {
  position: relative;
  width: 390px;
  height: 164px;
  box-sizing: border-box;
  padding-top: 1px;
}
.ki-info__row1 {
  position: relative;
  height: 19px;
}
.ki-info__label {
  position: absolute;
  left: 0;
  top: 1px;
  width: 64px;
  height: 17px;
  font-size: 16px;
  line-height: 17px;
  color: #fff;
}
.ki-info__name {
  position: absolute;
  left: 74px;
  top: 4px;
  width: 24px;
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  color: rgb(122, 122, 122);
}
.ki-info__row2 {
  position: relative;
  height: 22px;
}
.ki-info__price {
  position: absolute;
  left: 0;
  top: 0;
  width: 77.2px;
  height: 17px;
  font-size: 16px;
  line-height: 17px;
  color: rgb(51, 51, 51);
}
.ki-info__rate {
  position: absolute;
  left: 87.2px;
  top: 2.5px;
  width: 35px;
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  color: rgb(51, 51, 51);
}
.ki-info__metrics {
  position: relative;
  margin-top: 0;
}
.ki-metric {
  position: relative;
  height: 21px;
}
.ki-metric__label {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 15px;
  line-height: 16px;
  color: rgb(74, 74, 74);
  white-space: nowrap;
}
.ki-metric__value {
  position: absolute;
  top: 0;
  font-size: 15px;
  line-height: 16px;
  color: rgb(74, 74, 74);
}
.ki-metric:nth-child(1) .ki-metric__label { width: 45px; }
.ki-metric:nth-child(1) .ki-metric__value { left: 45px; width: 37.5px; }
.ki-metric:nth-child(2) .ki-metric__label { width: 120.8px; }
.ki-metric:nth-child(2) .ki-metric__value { left: 120.8px; width: 37.5px; }
.ki-metric:nth-child(3) .ki-metric__label { width: 67.5px; }
.ki-metric:nth-child(3) .ki-metric__value { left: 67.5px; width: 37.5px; }
.ki-metric:nth-child(4) .ki-metric__label { width: 105px; }
.ki-metric:nth-child(4) .ki-metric__value { left: 105px; width: 37.5px; }
.ki-metric:nth-child(5) .ki-metric__label { width: 67.5px; }
.ki-metric:nth-child(5) .ki-metric__value { left: 67.5px; width: 37.5px; }
.ki-metric:nth-child(6) .ki-metric__label { width: 90px; }
.ki-metric:nth-child(6) .ki-metric__value { left: 90px; width: 37.5px; }
/* 顶部 tab bar：390x21 @(0,399) */
.ki-tabs {
  position: absolute;
  left: 0;
  top: 399px;
  width: 390px;
  height: 21px;
  background: rgb(35, 39, 68);
  overflow: hidden;
  z-index: 5;
}
.ki-tabs__item {
  position: absolute;
  top: 0;
  height: 21px;
  font-size: 15px;
  line-height: 21px;
  color: rgb(65, 65, 65);
  white-space: nowrap;
}
.ki-tabs__item:nth-child(1) { left: 37px; width: 30px; }
.ki-tabs__item:nth-child(2) { left: 126px; width: 60px; }
.ki-tabs__item:nth-child(3) { left: 230px; width: 60px; }
.ki-tabs__item:nth-child(4) { left: 341.5px; width: 45px; }
.ki-tabs__item:nth-child(5) { left: 453px; width: 30px; }
.ki-tabs__item--active {
  color: #fff;
}
.ki-tabs__line {
  position: absolute;
  left: 34.5px;
  top: 16px;
  width: 35px;
  height: 3px;
  border-radius: 100px;
  background: url('/static/bg/vector.png') no-repeat center / 35px 3px;
}
.ki-gap {
  height: 380px;
}
.ki-page {
  padding-bottom: 60px;
}
/* 底部操作条 */
.ki-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12px;
  height: 50px;
}
.ki-bottom__btn {
  position: absolute;
  top: 11.5px;
  width: 149px;
  height: 39px;
  border-radius: 26px;
  font-size: 15px;
  line-height: 39px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.ki-bottom__btn--pink {
  left: 16px;
  background: rgb(231, 141, 210);
}
.ki-bottom__btn--orange {
  left: 183px;
  background: rgb(234, 171, 75);
}
.ki-bottom__follow {
  position: absolute;
  left: 350px;
  top: 11.5px;
  width: 24px;
  height: 39px;
}
.ki-bottom__follow-icon {
  display: block;
  width: 24px;
  height: 24px;
  background: url('/static/icon/sc3.png') no-repeat center / 24px 24px;
}
.ki-bottom__follow-text {
  display: block;
  width: 20px;
  height: 11px;
  margin-left: 2px;
  margin-top: 3px;
  font-size: 10px;
  line-height: 11px;
  color: #fff;
  text-align: center;
}
</style>
