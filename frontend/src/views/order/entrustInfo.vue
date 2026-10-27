<template>
  <!--
    原站页面 render `7540` / script `65e1`（chunk pages-order-entrust-info.17835750.js，753413 字节）
      w-container.page-bg[loading, padding-bottom:120rpx]
        w-navbar(id=my-nav, title=订单详情)（navType 默认 default → autoBack → back-btn 返回键）
        OrderStatus(order)
        v-uni-view.info-container.pa-16.br-t-12.mt-12
          GoodsBar(order)
          GoodsInfo.mt-24(order)
        v-uni-view.action
          1==status → [w-button 260rpx pain circle 取消订单][w-button 400rpx circle 确认支付]
          2==status||7==status → [260rpx pain 取消订单][400rpx 继续委托]
          3==status → [260rpx pain 我的收藏（无点击）][400rpx 继续委托]
          status>=4&&!=7 → [w-button 100% 继续委托]
          u-safe-bottom（H5 空占位）
        CancelEntrustOrder(ref=cancelOrder, order)
        PayEntrustOrder(ref=payOrder, order)
    ★ 与 beg/info（render 99ab）逐节点同构，仅三处差异：
      ① 按钮文案「继续委托」（原站 handleLang key 不同）
      ② toBeg 跳 /pages/market/submitBegBuy?id=goods_id —— 原站此处复用求购页
         （redirectTo，与 beg/info 相同，属原站 copy 遗留，按 1:1 复刻照搬）
      ③ 子组件为 CancelEntrustOrder / PayEntrustOrder（order_type=31、委托文案）
    ★ 子组件 OrderStatus(61aa→78fe) / GoodsBar(8b6f→cc8d) / GoodsInfo(770c→4312)
      与 beg/info 为同一模块（两 chunk 中 render 逐字一致），复用项目的
      BegOrderStatus / BegGoodsBar / BegGoodsInfo（已随 beg/info 验收）。
    ★ 状态文案走 c646d[order_type=31]：status2 为「求购中」（原站 copy 遗留，
      与 key 11 的「委托中」对调），项目的 statusMap.js TYPE_31 已照搬。
  -->
  <div id="entrust-info" class="page-bg">
    <!-- 原站 u-navbar：fixed + placeholder（H5 端 statusBarHeight=0 → 44px） -->
    <div class="rr-navbar-placeholder" />
    <div class="rr-navbar">
      <div class="rr-navbar-back" @click="goBack">
        <img class="rr-navbar-back-icon" src="/assets/img/order/back-btn.png" alt="" />
      </div>
      <span class="rr-navbar-title">订单详情</span>
    </div>

    <!-- 原站 w-container loading → u-loading-page（bgColor transparent / fontSize 12 / "加载中..."） -->
    <div v-if="loading" class="rd-loading">
      <div class="rd-loading-text">加载中...</div>
    </div>

    <template v-else>
      <!-- 原站 OrderStatus（浅色版，scope 9453758e；与 beg/info 同一组件） -->
      <BegOrderStatus :order="order" @finish="getInfo" />

      <!-- 原站 .info-container.pa-16.br-t-12.mt-12
           （页面 scope 中 br-t-12 晚于 bg-color-item 定义 → 上圆角 12.48px 生效） -->
      <div class="info-container bg-color-item pa-16 br-t-12 mt-12">
        <BegGoodsBar :order="order" />
        <BegGoodsInfo class="mt-24" :order="order" />
      </div>

      <!-- 原站 .action：fixed 底部操作条（白底 + 1px #e7e7ea + 20.8px 圆角） -->
      <div class="action">
        <div class="action-container">
          <!-- order_status == 1：待支付 -->
          <template v-if="order.order_status === 1">
            <div class="z-btn btn-size-lg btn-type-colorful circle pain" style="width: 135.2px" @click="cancelOrder.cancel()">取消订单</div>
            <div class="z-btn btn-size-lg btn-type-colorful circle" style="width: 208px" @click="payOrder.pay()">确认支付</div>
          </template>
          <!-- order_status == 2 || 7 -->
          <template v-else-if="order.order_status === 2 || order.order_status === 7">
            <div class="z-btn btn-size-lg btn-type-colorful circle pain" style="width: 135.2px" @click="cancelOrder.cancel()">取消订单</div>
            <div class="z-btn btn-size-lg btn-type-colorful circle" style="width: 208px" @click="toBeg">继续委托</div>
          </template>
          <!-- order_status == 3：已成交（「我的收藏」原站无点击事件） -->
          <template v-else-if="order.order_status === 3">
            <div class="z-btn btn-size-lg btn-type-colorful circle pain" style="width: 135.2px">我的收藏</div>
            <div class="z-btn btn-size-lg btn-type-colorful circle" style="width: 208px" @click="toBeg">继续委托</div>
          </template>
          <!-- order_status >= 4 && != 7 -->
          <template v-else-if="order.order_status >= 4">
            <div class="z-btn btn-size-lg btn-type-colorful circle" style="width: 100%" @click="toBeg">继续委托</div>
          </template>
        </div>
        <!-- 原站 u-safe-bottom：H5 端空占位 -->
        <div class="u-safe-bottom" />
      </div>
    </template>

    <!-- 原站 CancelEntrustOrder / PayEntrustOrder（独立组件，各自由内部 show 控制） -->
    <CancelEntrustOrder ref="cancelOrder" :order="order" />
    <PayEntrustOrder ref="payOrder" :order="order" />
  </div>
</template>

<script setup>
/**
 * 委托订单详情页 —— 原站 `pages/order/entrust/info`
 *
 * 反编译来源：chunk `pages-order-entrust-info.17835750.js`（753413 字节）
 *   render `7540` / script `65e1`
 *   子组件：
 *     OrderStatus        61aa → 78fe(render, scope 9453758e)   —— 与 beg/info 同模块
 *     GoodsBar           8b6f → cc8d(render, scope 62f5316a)   —— 与 beg/info 同模块
 *     GoodsInfo          770c → 4312(render, scope 7c6b1df8)   —— 与 beg/info 同模块
 *     CancelEntrustOrder 629c → 7745(script)
 *     PayEntrustOrder    5a12 → a57d(script)  order_type=31
 *   接口：getMyEntrustInfo → POST /market/Prepayment/myOrderInfo  body {order_id}
 *        （原站 getMyEntrustInfo(this.id)，data 直接传 id 值）
 *
 * 原站 script `65e1` 逐字逻辑：
 *   data: { loading:false, id:null, order:{} }
 *   onLoad({id}): id=id; getInfo()
 *   methods:
 *     cancel()  → $nextTick(() => $refs.cancelOrder.cancel())
 *     toBeg()   → uni.redirectTo('/pages/market/submitBegBuy?id=' + order.goods_id)
 *     getInfo() → loading 去重；getMyEntrustInfo(id).then(res => {
 *                   order = res.data
 *                   order.num = order.number
 *                   order.goods_cover_image = order.goods_image
 *                 }).finally(() => loading = false)
 */
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMyEntrustInfo } from '@/api'
import BegOrderStatus from '@/components/order/BegOrderStatus.vue'
import BegGoodsBar from '@/components/order/BegGoodsBar.vue'
import BegGoodsInfo from '@/components/order/BegGoodsInfo.vue'
import CancelEntrustOrder from '@/components/order/CancelEntrustOrder.vue'
import PayEntrustOrder from '@/components/order/PayEntrustOrder.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const id = ref(null)
const order = ref({})
const cancelOrder = ref(null)
const payOrder = ref(null)

/** 原站 cancel()：$nextTick 后触发弹窗（对齐原站时序） */
function cancel() {
  requestAnimationFrame(() => cancelOrder.value && cancelOrder.value.cancel())
}

/** 原站 toBeg()：redirectTo 跳 submitBegBuy（原站复用求购页，照搬） */
function toBeg() {
  router.replace('/pages/market/submitBegBuy?id=' + order.value.goods_id)
}

/** 原站 getInfo()：loading 去重 + finally 重置；字段映射 num/goods_cover_image */
async function getInfo() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getMyEntrustInfo(id.value)
    order.value = res.data || {}
    order.value.num = order.value.number
    order.value.goods_cover_image = order.value.goods_image
  } catch (e) {
    console.error('[entrustInfo] getMyEntrustInfo failed', e)
  } finally {
    loading.value = false
  }
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/order/entrust/list')
}

/**
 * 原站每次 uni.navigateTo 都是新页面实例，onLoad 必触发；
 * Vue Router 对同路由不同 query 会复用组件，故此处 watch query 以对齐原站语义。
 */
function load() {
  id.value = route.query.id
  order.value = {}
  getInfo()
}

onMounted(load)
watch(() => route.query.id, load)
</script>

<style scoped>
/* 原站页面 CSS 与 beg/info 同款（scope 415c22ca 的对应副本）：.page-bg{background:#f7f7f8} */
#entrust-info.page-bg {
  background: #f7f7f8;
  min-height: 100vh;
}
/* 原站 w-container：staticStyle padding-bottom 120rpx = 62.4px */
#entrust-info {
  padding-bottom: 62.4px;
  box-sizing: border-box;
}

/* ============ w-navbar(u-navbar)（同 begList 已验证模式） ============ */
/* 原站 u-navbar--fixed：z-index 11；content 高 44px；标题 30rpx=15.6px→15px bold #333；
   返回键 w-icon back-btn 24×24 @ u-navbar__content__left(left:0, padding 0 13px) */
.rr-navbar-placeholder {
  height: 44px;
}
.rr-navbar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: #fafafa;
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
}
.rr-navbar-back {
  position: absolute;
  left: 13px;
  top: calc(env(safe-area-inset-top) + 10px);
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.rr-navbar-back-icon {
  width: 24px;
  height: 24px;
  display: block;
}
.rr-navbar-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

/* ============ w-container loading → u-loading-page ============ */
.rd-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
.rd-loading-text {
  font-size: 12.48px;
  color: #85868d;
}

/* ============ .info-container（bg-color-item + br-t-12） ============ */
.bg-color-item {
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px; /* 40rpx */
}
/* br-t-12 晚于 bg-color-item 定义 → 上圆角 12.48px 生效 */
.br-t-12 { border-radius: 12.48px 12.48px 0 0; }
.pa-16 { padding: 8.32px; } /* 32rpx */
.mt-12 { margin-top: 6.24px; } /* 12rpx */
.mt-24 { margin-top: 12.48px; } /* 24rpx */

/* ============ .action ============ */
/* .bg-color-item,.action{白底+1px #e7e7ea+40rpx 圆角} 在后，
   .bg-color-item,.action{background-color:#fff} 仅覆盖背景 → 边框与圆角保留 */
.action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 390px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px;
  z-index: 99;
}
/* 原站 .action .action-container{display:flex;justify-content:space-between;padding:14rpx 32rpx} */
.action-container {
  display: flex;
  justify-content: space-between;
  padding: 7.28px 16.64px;
}
/* 原站 u-safe-bottom：H5 端空占位 */
.u-safe-bottom {
  height: env(safe-area-inset-bottom, 0px);
}

/* ============ w-button（浅色页无页面级覆盖） ============ */
.z-btn {
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
/* 原站 .btn-size-lg{height:92rpx;font-size:28rpx;border-radius:16rpx} */
.btn-size-lg { height: 47.84px; font-size: 14.56px; border-radius: 8.32px; }
/* 原站 .btn-size-lg.circle{height:92rpx;border-radius:46rpx} */
.btn-size-lg.circle { height: 47.84px; border-radius: 23.92px; }
/* 原站 .btn-type-colorful{background:linear-gradient(135deg,#fae8bd,#cfaf72);color:#2f2414} */
.btn-type-colorful { background: linear-gradient(135deg, #fae8bd, #cfaf72); color: #2f2414; background-size: contain; }
/* 原站 .btn-type-colorful.pain{background:#f0f0f2;color:#000} */
.btn-type-colorful.pain { background: #f0f0f2; color: #000; }
</style>
