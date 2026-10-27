<template>
  <!--
    原站页面 render `dfa1`（scope 4260e3b4）
      w-container.page-bg#order-details[loading]
        w-navbar(navType:"jwsz-order-market-detail", id:"my-nav", centerIcon:icon, title:title)
        v-uni-view.info-container.pa-16.br-t-12.mt-12
          GoodsBar(order=info)
          GoodsInfo.mt-24(order=info)
        MarkeyOrderAction(order=info) @statusChange @refresh
  -->
  <div id="order-details" class="page-bg">
    <!-- 原站 w-navbar：navType="jwsz-order-market-detail"（autoBack 白名单内）
         u-navbar fixed + placeholder：placeholder 高度 = 44px + 状态栏高度 -->
    <div class="md-navbar-placeholder" />
    <div class="md-navbar">
      <div class="md-navbar-content">
        <div class="md-navbar-left" @click="goBack">
          <img class="md-navbar-back" src="/assets/img/order/back-btn.png" alt="" />
        </div>
        <div class="md-navbar-center flex flex-ai-center">
          <img v-if="iconSrc" class="md-navbar-icon" :src="iconSrc" alt="" />
          <span class="md-navbar-title">{{ title }}</span>
        </div>
      </div>
    </div>

    <!-- 原站 w-container loading → u-loading-page（bgColor transparent / fontSize 12 / "加载中..."） -->
    <div v-if="loading" class="md-loading">
      <div class="md-loading-text">加载中...</div>
    </div>

    <template v-else>
      <div class="info-container pa-16 br-t-12 mt-12">
        <MarketGoodsBar :order="info" />
        <MarketGoodsInfo class="mt-24" :order="info" />
      </div>

      <MarketOrderAction :order="info" @status-change="getOrderInfo" @refresh="getOrderInfo" />
    </template>
  </div>
</template>

<script setup>
/**
 * 市场订单详情页 —— 原站 `pages/order/marketDetail`
 *
 * 反编译来源：chunk `pages-order-marketDetail.52247cc3.js`（585923 字节，51 模块）
 *   入口 `ad32`
 *   script `52c4`  页面逻辑
 *   render `dfa1`  页面壳
 *   style  scope `4260e3b4`
 *   子组件：
 *     GoodsBar         8b6f → 2969(script 9653) / cc8d(render, scope 62f5316a)
 *     GoodsInfo        f701 → 7acd(script 0996) / a2d01(render, scope 4e0342a8)
 *     MarkeyOrderAction 2a45 → ba69(script 7397) / 6fb0(render, scope f9dfd83c)
 *   接口模块 `7db7`：getMarketOrderDetails → /order/order/saleMarketOrderDetail
 *   接口模块 `3fd1`：changeMarketGoods    → /market/market/changeMarketGoods
 *
 * 原站 script `52c4` 逐字逻辑：
 *   data: { orderId, loading:false, info:{} }
 *   onLoad(query): orderId = query.id; getOrderInfo()
 *   computed:
 *     title → info.id ? ORDER_STATUS_MAP[info.order_type][info.order_status].title : ''
 *     icon  → info.id ? ORDER_STATUS_MAP[info.order_type][info.order_status].icon  : ''
 *   getOrderInfo():
 *     loading=true → getMarketOrderDetails(orderId)
 *       .then(res => { loading=false; info=res.data; info.order_type=8 })
 *       .catch(() => setTimeout(backPage, 1500))
 *
 * 注意：原站在拿到数据后**强制** `info.order_type = 8`（寄售单），
 *       故 GoodsInfo 区块1（购买明细）不渲染，区块2 只显示「寄售金额」。
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMarketOrderDetails } from '@/api'
import { ORDER_STATUS_MAP } from '@/components/order/statusMap'
import MarketGoodsBar from '@/components/order/MarketGoodsBar.vue'
import MarketGoodsInfo from '@/components/order/MarketGoodsInfo.vue'
import MarketOrderAction from '@/components/order/MarketOrderAction.vue'

const route = useRoute()
const router = useRouter()

const orderId = ref(null)
const loading = ref(false)
const info = ref({})

const title = computed(() => {
  if (!info.value.id) return ''
  const map = ORDER_STATUS_MAP[info.value.order_type]
  const item = map && map[info.value.order_status]
  return item ? item.title : ''
})

const icon = computed(() => {
  if (!info.value.id) return ''
  const map = ORDER_STATUS_MAP[info.value.order_type]
  const item = map && map[info.value.order_status]
  return item ? item.icon : ''
})

/**
 * 原站 w-icon：path = "/static/icon/" + name + ".png"，加载失败回退 u-icon。
 * 本地对应资源置于 /assets/img/order/。
 * order-lock.png 原站 404（回退 u-icon 且字体无该字形 → 空图标），故不提供本地文件。
 */
const ICON_MAP = {
  'market-submit': '/assets/img/order/market-submit.png',
  'js-success': '/assets/img/order/js-success.png',
  'qx-success': '/assets/img/order/qx-success.png',
  'order-await': '/assets/img/order/order-await.png',
  'order-success': '/assets/img/order/order-success.png',
  'order-cancel': '/assets/img/order/order-cancel.png'
}
const iconSrc = computed(() => (icon.value ? ICON_MAP[icon.value] || '' : ''))

async function getOrderInfo() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getMarketOrderDetails(orderId.value)
    loading.value = false
    info.value = res.data || {}
    /** 原站强制 order_type = 8（寄售订单） */
    info.value.order_type = 8
  } catch (e) {
    loading.value = false
    setTimeout(goBack, 1500)
  }
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/order/list')
}

function load() {
  orderId.value = route.query.id
  info.value = {}
  getOrderInfo()
}

onMounted(load)
watch(() => route.query.id, load)
</script>

<style scoped>
/* 原站 scope 4260e3b4 */
#order-details.page-bg {
  min-height: 100vh;
  background: #f7f7f8;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: #f2f2f2;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 62.4px);
  box-sizing: border-box;
}
.info-container {
  padding: 16.64px;
  border-radius: 12.48px 12.48px 0 0;
  margin-top: 12.48px;
}
.mt-12 { margin-top: 12.48px; }
.mt-24 { margin-top: 24.96px; }
.pa-16 { padding: 16.64px; }
.br-t-12 { border-radius: 12.48px 12.48px 0 0; }
.flex { display: flex; }
.flex-ai-center { align-items: center; }

/* 原站 w-navbar（navType="jwsz-order-market-detail"）
   —— u-navbar 44px 高、bgColor transparent、fixed + placeholder
   —— 左侧 w-icon name="back-btn" size 24；center 插槽 = w-icon(17) + 标题 */
.md-navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 11;
}
/* 原站 u-navbar__placeholder：height = 44px + statusBarHeight（H5 端 statusBarHeight=0） */
.md-navbar-placeholder {
  height: 44px;
}
.md-navbar-content {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: transparent;
}
.md-navbar-left {
  padding: 0 13px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}
.md-navbar-back {
  width: 24.96px;
  height: 24.96px;
}
.md-navbar-center {
  /* 原站 w-icon mr-8 → 8.32px */
  gap: 8.32px;
}
.md-navbar-icon {
  width: 17.68px;
  height: 17.68px;
  flex: none;
}
.md-navbar-title {
  font-weight: bold;
  font-size: 16.64px;
  color: #111111;
  font-family: 'Alibaba-PuHuiTi-Bold', sans-serif;
}
.md-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
.md-loading-text {
  font-size: 12.48px;
  color: #85868d;
}
</style>
