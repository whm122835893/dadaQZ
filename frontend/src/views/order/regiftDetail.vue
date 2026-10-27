<template>
  <!--
    原站页面 render `adce`（scope 3c9fc44c）
      w-container.page-bg#order-details[loading]
        w-navbar(navType="huhu-order-market-detail", id="my-nav",
                 centerIcon=orderStatusInfo.icon, title=title)
        OrderStatus(order=info) @finish=getOrderInfo
        v-uni-view.info-container.bg-color-item.pa-16.br-t-12.mt-12
          GoodsBar(order=info)
          GoodsInfo.mt-24(order=info)
        [5,6].includes(info.order_status) ? 无 : OrderAction(order=info) @statusChange=getOrderInfo

    ★ navbar 关键结论（与原站 w-navbar script 逐行比对）：
      navType="huhu-order-market-detail" **不在** autoBack 白名单
      （['default','address','compound','jwsz-goods','goods','marketGoods','jwsz-order-market-detail']），
      也不匹配任何 left/right/center 插槽分支
      ⇒ 无返回箭头、无图标、无左右插槽，仅 u-navbar 默认 center 标题
        （newTitleStyle：30rpx=15.6px / bold / #333；bgColor transparent；
          fixed:true；placeholder:true → 44px）
      centerIcon prop 虽传入，但无分支消费 → 不渲染
  -->
  <div id="order-details" class="page-bg">
    <!-- 原站 u-navbar：fixed + placeholder（H5 端 statusBarHeight=0 → 44px） -->
    <div class="rd-navbar-placeholder" />
    <div class="rd-navbar">
      <div class="rd-navbar-content">
        <span class="rd-navbar-title">{{ title }}</span>
      </div>
    </div>

    <!-- 原站 w-container loading → u-loading-page（bgColor transparent / fontSize 12 / "加载中..."） -->
    <div v-if="loading" class="rd-loading">
      <div class="rd-loading-text">加载中...</div>
    </div>

    <template v-else>
      <!-- 原站 OrderStatus（浅色版，scope 9453758e） -->
      <RegiftOrderStatus :order="info" @finish="getOrderInfo" />

      <!-- 原站 .info-container.bg-color-item.pa-16.br-t-12.mt-12
           （页面 scope 中 br-t-12 晚于 bg-color-item 定义 → 上圆角 12.48px 生效） -->
      <div class="info-container bg-color-item pa-16 br-t-12 mt-12">
        <RegiftGoodsBar :order="info" />
        <RegiftGoodsInfo class="mt-24" :order="info" />
      </div>

      <!-- 原站 [5,6].includes(info.order_status) ? 无 : OrderAction -->
      <RegiftOrderAction
        v-if="![5, 6].includes(info.order_status)"
        :order="info"
        @status-change="getOrderInfo"
      />
    </template>
  </div>
</template>

<script setup>
/**
 * 转赠订单详情页 —— 原站 `pages/order/regiftDetail`
 *
 * 反编译来源：chunk `pages-order-regiftDetail.dee640c4.js`（628080 字节）
 *   入口（list 页模块 927f 的 toDetail 分发）：order_type == 19 → 本页
 *   页面 script `3ca8` / render `adce` / style scope `3c9fc44c`
 *   子组件（与第 11 页 defaultDetail 同模块，但本页为浅色主题）：
 *     OrderStatus   61aa → 23a1(script) / 78fe(render, scope 9453758e)
 *     GoodsBar      8b6f → 9653(script) / cc8d(render, scope 62f5316a)
 *     GoodsInfo     f701 → 0996(script) / a2d01(render, scope 4e0342a8)
 *     OrderAction   8c46 → 02e8(script) / 60eb(render, scope becf8788)
 *   接口模块 `7db7`：getRegiftOrderDetails → POST /order/order/giveOrderDetail/ids/{id}
 *   接口模块 `5a48`：getECardPass → /crystal_goods/getCardCode（GoodsInfo 内）
 *
 * 原站 script `3ca8` 逐字逻辑：
 *   data: { orderId:null, loading:false, orderType:null, info:{} }
 *   onLoad({id, orderType}): orderType=orderType; orderId=id; getOrderInfo()
 *   computed:
 *     orderStatusInfo → info.id ? ORDER_STATUS_MAP[info.order_type][info.order_status] : {}
 *     title           → info.id ? orderStatusInfo.title : ''
 *   getOrderInfo():
 *     if (loading) return
 *     loading=true → getRegiftOrderDetails(orderId)
 *       .then(res => { loading=false; info=res.data })
 *       .catch(() => setTimeout(backPage, 1500))   ← 注意：catch 不重置 loading
 *
 * 原站实调（2026-10-25，账号 17587881293）：
 *   POST /order/order/giveOrderDetail/ids/40021 → {code:0, msg:"找不到该订单或已被删除"}
 *   orderList 遍历 order_type 1/2/3/4/5/6/7/8/10 均 total:0 ⇒ 无转赠订单，走 mock。
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRegiftOrderDetails } from '@/api'
import { ORDER_STATUS_MAP } from '@/components/order/statusMap'
import RegiftOrderStatus from '@/components/order/RegiftOrderStatus.vue'
import RegiftGoodsBar from '@/components/order/RegiftGoodsBar.vue'
import RegiftGoodsInfo from '@/components/order/RegiftGoodsInfo.vue'
import RegiftOrderAction from '@/components/order/RegiftOrderAction.vue'

const route = useRoute()
const router = useRouter()

const orderId = ref(null)
const orderType = ref(null)
const loading = ref(false)
const info = ref({})

const orderStatusInfo = computed(() => {
  if (!info.value.id) return {}
  const map = ORDER_STATUS_MAP[info.value.order_type]
  const item = map && map[info.value.order_status]
  return item || {}
})

const title = computed(() => (info.value.id ? orderStatusInfo.value.title : ''))

/** 原站 getOrderInfo：loading 去重；catch 不重置 loading，1500ms 后返回上一页 */
async function getOrderInfo() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getRegiftOrderDetails(orderId.value)
    loading.value = false
    info.value = res.data || {}
  } catch (e) {
    setTimeout(goBack, 1500)
  }
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/order/list')
}

function load() {
  orderId.value = route.query.id
  orderType.value = route.query.orderType
  info.value = {}
  getOrderInfo()
}

onMounted(load)
watch(() => route.query.id, load)
</script>

<style scoped>
/* 原站 scope 3c9fc44c：.page-bg{background:#f7f7f8} */
#order-details.page-bg {
  min-height: 100vh;
  background: #f7f7f8;
  box-sizing: border-box;
  /* 原站 #order-details{padding-bottom:calc(env(safe-area-inset-bottom) + 120rpx)} */
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 62.4px);
}
/* 原站 .info-container.bg-color-item.pa-16.br-t-12.mt-12 */
.info-container {
  padding: 16.64px;
  margin-top: 12.48px;
  border-radius: 12.48px 12.48px 0 0;
  box-sizing: border-box;
}
/* 原站页面 scope .bg-color-item{background:#fff;border:1px solid #e7e7ea;border-radius:40rpx}
   （br-t-12 在页面 scope 中晚于 bg-color-item 定义 → 上圆角 12.48px 优先生效） */
.bg-color-item {
  background-color: #fff;
  border: 1px solid #e7e7ea;
}
.pa-16 { padding: 16.64px; }
.br-t-12 { border-radius: 12.48px 12.48px 0 0; }
.mt-12 { margin-top: 12.48px; }
.mt-24 { margin-top: 24.96px; }

/* 原站 u-navbar（navType="huhu-order-market-detail"）
   —— 44px 高、bgColor transparent、fixed + placeholder、border:false
   —— 无 left/right/center 插槽分支 → 仅默认居中标题 */
.rd-navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 11;
}
/* 原站 u-navbar__placeholder：height = 44px + statusBarHeight（H5 端 statusBarHeight=0） */
.rd-navbar-placeholder {
  height: 44px;
}
.rd-navbar-content {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: transparent;
}
/* 原站 newTitleStyle：{font-size:"30rpx", font-weight:"bold", color:"#333"} */
.rd-navbar-title {
  font-size: 15.6px;
  font-weight: bold;
  color: #333;
  font-family: 'Alibaba-PuHuiTi-Bold', sans-serif;
}
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
</style>
