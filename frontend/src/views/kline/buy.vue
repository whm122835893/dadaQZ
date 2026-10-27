<template>
  <!--
    原站 pages/kline/buy（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：
      → u-navbar 深色 rgb(35,39,68) 390x44 @(0,0)
          返回 back-btn-white.png 24x24 @(13,10)
          标题「购买」15px bold #fff @(180,15.5,30,16)
          右上「切换行情」12px #fff @(329,16,48,14)
      → swiper 图片 358x179 @(16,44) br10px，指示点 15x2 @(20,34)/(43,34) rgb(54,153,255)
      → 主体深灰区 rgb(51,51,51)，自 y=224 延伸到底
          「凤吹晚霞」18px fw600 #fff @(16,240,72,20)
          「嗒嗒」12px #7a7a7a @(102,242,24,14)
          「112.34CNY」20px #333 @(277.5,236.5,96.5,22)（与背景同色，原站即不可见）
          「-0.53%」12px #333 @(235.5,240.5,35,14)
      → tabs y=273：流通 15px #fff @(16,273,30,16)（激活，底图 line.webp）
                       相关公告 15px #7a7a7a @(58,273,60,16)
                       成交额 15px #7a7a7a @(130,273,45,16)
    数据：原站复用商城 market 缓存，本地走 getKlineBuy mock
  -->
  <div class="kb-page">
    <div class="kb-nav">
      <div class="kb-nav__back" @click="goBack"></div>
      <span class="kb-nav__title">购买</span>
      <span class="kb-nav__switch" @click="goInfo">切换行情</span>
    </div>

    <div class="kb-swiper">
      <div class="kb-swiper__img" :style="{ backgroundImage: `url(${images[0]})` }"></div>
      <span class="kb-swiper__dot kb-swiper__dot--active"></span>
      <span class="kb-swiper__dot"></span>
    </div>

    <div class="kb-body">
      <div class="kb-price-row">
        <span class="kb-name">{{ name }}</span>
        <span class="kb-brand">{{ brand }}</span>
        <span class="kb-price">{{ price }}CNY</span>
        <span class="kb-rate">{{ change_rate }}</span>
      </div>

      <div class="kb-tabs">
        <span
          v-for="(t, i) in tabs"
          :key="t"
          class="kb-tabs__item"
          :class="{ 'kb-tabs__item--active': i === 0 }"
        >{{ t }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getKlineBuy } from '@/api'

const router = useRouter()
const route = useRoute()

const name = ref('凤吹晚霞')
const brand = ref('嗒嗒')
const price = ref('112.34')
const change_rate = ref('-0.53%')
const images = ref(['/assets/img/kline/goods.png', '/assets/img/kline/goods2.png'])
const tabs = ref(['流通', '相关公告', '成交额'])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/market/market')
}
function goInfo() {
  router.replace(`/pages/kline/info?id=${route.query.id || 1}`)
}

onMounted(async () => {
  try {
    const res = await getKlineBuy({ id: route.query.id || 1 })
    const d = res.data || {}
    if (d.name) name.value = d.name
    if (d.brand) brand.value = d.brand
    if (d.price) price.value = d.price
    if (d.change_rate) change_rate.value = d.change_rate
    if (Array.isArray(d.images) && d.images.length) images.value = d.images
    if (Array.isArray(d.tabs) && d.tabs.length) tabs.value = d.tabs
  } catch (e) {
    /* mock 兜底保持默认 */
  }
})
</script>

<style scoped>
.kb-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.kb-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(35, 39, 68);
}
.kb-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat center / 24px 24px;
}
.kb-nav__title {
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
.kb-nav__switch {
  position: absolute;
  left: 329px;
  top: 16px;
  width: 48px;
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  color: #fff;
  text-align: right;
  cursor: pointer;
}
.kb-swiper {
  position: relative;
  width: 390px;
  height: 180px;
  background: rgb(51, 51, 51);
}
.kb-swiper__img {
  position: absolute;
  left: 16px;
  top: 0;
  width: 358px;
  height: 179px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
}
.kb-swiper__dot {
  position: absolute;
  top: -10px;
  width: 15px;
  height: 2px;
  border-radius: 1px;
  background: rgb(54, 153, 255);
}
.kb-swiper__dot:nth-of-type(1) {
  left: 20px;
}
.kb-swiper__dot:nth-of-type(2) {
  left: 43px;
}
/* 主体深灰区：自 y=224 起 */
.kb-body {
  position: absolute;
  left: 0;
  top: 224px;
  width: 390px;
  bottom: 0;
  background: rgb(51, 51, 51);
}
.kb-price-row {
  position: relative;
  width: 390px;
  height: 49px;
}
.kb-name {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 72px;
  height: 20px;
  font-size: 18px;
  font-weight: 600;
  line-height: 20px;
  color: #fff;
}
.kb-brand {
  position: absolute;
  left: 102px;
  top: 18px;
  width: 24px;
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  color: rgb(122, 122, 122);
}
.kb-price {
  position: absolute;
  left: 277.5px;
  top: 12.5px;
  width: 96.5px;
  height: 22px;
  font-size: 20px;
  line-height: 22px;
  color: rgb(51, 51, 51);
  text-align: right;
}
.kb-rate {
  position: absolute;
  left: 235.5px;
  top: 16.5px;
  width: 35px;
  height: 14px;
  font-size: 12px;
  line-height: 14px;
  color: rgb(51, 51, 51);
}
.kb-tabs {
  position: relative;
  width: 390px;
  height: 32px;
}
.kb-tabs__item {
  position: absolute;
  top: 0;
  height: 16px;
  font-size: 15px;
  line-height: 16px;
  color: rgb(122, 122, 122);
  white-space: nowrap;
}
.kb-tabs__item:nth-child(1) { left: 16px; width: 30px; }
.kb-tabs__item:nth-child(2) { left: 58px; width: 60px; }
.kb-tabs__item:nth-child(3) { left: 130px; width: 45px; }
.kb-tabs__item--active {
  color: #fff;
  background: url('/assets/img/kline/line.webp') no-repeat center bottom / 100% 100%;
}
</style>
