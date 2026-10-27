<template>
  <!--
    原站 pages/market/tradingInformation（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container 390x844 bg rgb(245,245,245) + page-bg.webp 背景图
      → navbar 390x44 透明
          返回 back-btn-white.png 24x24 @(13,10)
          标题「成交记录」15px bold #fff @(165,15.5,60,16)
      → 主卡 356x122 @(17,52) bg #fff br9px
          「今日最高」11px fw500 rgb(116,116,116) @(145.1,61,55,16)
          「今日地板价」11px fw500 @(263.1,61,55,16)
          「￥7.00」13px bold rgb(101,201,24) @(145.1,84,55,19)
          「￥7.00」13px bold rgb(10,10,10) @(263.1,84,55,19)
          「CNY」19px fw900 rgb(0,0,0) @(71.9,99,41.2,22)
          「今日成交量」11px fw500 @(145.1,121,55,16)
          「0」13px bold rgb(10,10,10) @(145.1,143,55,16)
      → tabs y=198.5：「当前成交」13px bold rgb(53,120,252) @(71.5,198.5,52,19)
                          「当前寄售」13px fw500 rgb(153,153,153) @(266.5,198.5,52,19)
          指示线 17x3 @(89,221) bg rgb(68,120,255) br100px
      → 空态图 search-empty.png 121x122 @(134.5,277)
    数据：POST /market/trade/tradingInformation
         {page:1,sort:"price",id:"1",status:1,goods_id:"1"}
         → list:[]，today_highest_price/today_lowest_price 均 "7.00"
  -->
  <div class="ti-page">
    <div class="ti-nav">
      <div class="ti-nav__back" @click="goBack"></div>
      <span class="ti-nav__title">成交记录</span>
    </div>

    <div class="ti-card">
      <div class="ti-card__row1">
        <div class="ti-stat">
          <div class="ti-stat__label">今日最高</div>
          <div class="ti-stat__value ti-stat__value--up">￥{{ today_highest_price }}</div>
        </div>
        <div class="ti-stat">
          <div class="ti-stat__label">今日地板价</div>
          <div class="ti-stat__value">￥{{ today_lowest_price }}</div>
        </div>
      </div>
      <div class="ti-card__row2">
        <div class="ti-currency">CNY</div>
        <div class="ti-stat ti-stat--volume">
          <div class="ti-stat__label">今日成交量</div>
          <div class="ti-stat__value">{{ today_volume }}</div>
        </div>
      </div>
    </div>

    <div class="ti-tabs">
      <span class="ti-tabs__item ti-tabs__item--active">当前成交</span>
      <span class="ti-tabs__item">当前寄售</span>
      <span class="ti-tabs__line"></span>
    </div>

    <div class="ti-empty"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getTradingInformation } from '@/api'

const router = useRouter()
const route = useRoute()

const today_highest_price = ref('7.00')
const today_lowest_price = ref('7.00')
const today_volume = ref(0)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/market/market')
}

onMounted(async () => {
  try {
    const res = await getTradingInformation({
      id: route.query.id || 1,
      goods_id: route.query.goods_id || route.query.id || 1
    })
    const d = res.data || {}
    if (d.today_highest_price !== undefined) today_highest_price.value = d.today_highest_price
    if (d.today_lowest_price !== undefined) today_lowest_price.value = d.today_lowest_price
    if (d.today_volume !== undefined) today_volume.value = d.today_volume
  } catch (e) {
    /* mock 兜底保持默认 */
  }
})
</script>

<style scoped>
.ti-page {
  position: relative;
  min-height: 100vh;
  background: rgb(245, 245, 245);
  background-image: url('/static/bg/page-bg.webp');
  /* 原站实测：background-size 100%（按比例高度≈296px）、no-repeat、position 0% 0% */
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: 0% 0%;
  overflow: hidden;
}
.ti-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.ti-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat center / 24px 24px;
}
.ti-nav__title {
  position: absolute;
  left: 165px;
  top: 15.5px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  text-align: center;
}
/* 主卡 356x122 @(17,52) */
.ti-card {
  position: absolute;
  left: 17px;
  top: 52px;
  width: 356px;
  height: 122px;
  border-radius: 9px;
  background: #fff;
}
.ti-card__row1 {
  position: relative;
  width: 356px;
  height: 60px;
}
.ti-card__row2 {
  position: relative;
  width: 356px;
  height: 62px;
}
.ti-stat {
  position: absolute;
  top: 9px;
  width: 55px;
  height: 42px;
}
.ti-stat__label {
  width: 55px;
  height: 16px;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  color: rgb(116, 116, 116);
}
.ti-stat__value {
  width: 55px;
  height: 19px;
  margin-top: 7px;
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  color: rgb(10, 10, 10);
}
.ti-stat__value--up {
  color: rgb(101, 201, 24);
}
.ti-card__row1 .ti-stat:nth-child(1) { left: 128.1px; }
.ti-card__row1 .ti-stat:nth-child(2) { left: 246.1px; }
.ti-currency {
  position: absolute;
  left: 54.9px;
  top: -13px;
  width: 41.2px;
  height: 22px;
  font-size: 19px;
  font-weight: 900;
  line-height: 22px;
  color: rgb(0, 0, 0);
}
.ti-stat--volume {
  left: 128.1px;
  top: 9px;
}
.ti-stat--volume .ti-stat__value {
  height: 16px;
  line-height: 16px;
  margin-top: 6px;
}
/* tabs */
.ti-tabs {
  position: absolute;
  left: 0;
  top: 190px;
  width: 390px;
  height: 34px;
}
.ti-tabs__item {
  position: absolute;
  top: 8.5px;
  height: 19px;
  font-size: 13px;
  line-height: 19px;
}
.ti-tabs__item:nth-child(1) {
  left: 71.5px;
  width: 52px;
  font-weight: 700;
  color: rgb(53, 120, 252);
  text-align: center;
}
.ti-tabs__item:nth-child(2) {
  left: 266.5px;
  width: 52px;
  font-weight: 500;
  color: rgb(153, 153, 153);
  text-align: center;
}
.ti-tabs__line {
  position: absolute;
  left: 89px;
  top: 31px;
  width: 17px;
  height: 3px;
  border-radius: 100px;
  background: rgb(68, 120, 255);
}
.ti-empty {
  position: absolute;
  left: 134.5px;
  top: 277px;
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat center / 121px 122px;
}
</style>
