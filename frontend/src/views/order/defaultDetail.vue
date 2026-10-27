<template>
  <div id="order-details" class="fsc-page">
    <!-- 原站 w-navbar：navType="default"、leftIcon="back-btn-white"、title=info.title、titleStyle color #fff -->
    <div class="fsc-navbar">
      <div class="fsc-nav-back" @click="goBack">
        <img class="fsc-nav-back-icon" src="/assets/img/order/back-btn-white.png" alt="" />
      </div>
      <span class="fsc-nav-title">{{ title }}</span>
    </div>

    <div v-if="!info.id && loading" class="fsc-loading">加载中…</div>

    <template v-else>
      <!-- .fsc-card.fsc-status → OrderStatus -->
      <div class="fsc-card fsc-status">
        <OrderStatus :order="info" @finish="getOrderInfo" />
      </div>

      <!-- .fsc-card.fsc-goods → GoodsBar -->
      <div class="fsc-card fsc-goods">
        <GoodsBar :order="info" />
      </div>

      <!-- .fsc-card.fsc-detail → GoodsInfo -->
      <div class="fsc-card fsc-detail">
        <GoodsInfo :order="info" />
      </div>

      <!-- [5,6].includes(info.order_status) ? 无 : OrderAction -->
      <OrderAction
        v-if="![5, 6].includes(info.order_status)"
        :order="info"
        @status-change="getOrderInfo"
      />
    </template>
  </div>
</template>

<script setup>
/**
 * 普通订单详情页 —— 原站 `pages/order/defaultDetail`
 *
 * 反编译来源：chunk `pages-order-defaultDetail.501b067d.js`（633298 字节，102 个模块）
 *   入口 `d80f`
 *   script `de30`  页面逻辑
 *   render `3038`  页面壳
 *   style  scope `2045eb18`（#order-details 全套样式）
 *   子组件：
 *     OrderStatus  61aa → bfaa(script 23a1) / 78fe(render, scope 9453758e)
 *     GoodsBar     8b6f → 2969(script 9653) / cc8d(render, scope 62f5316a)
 *     GoodsInfo    f701 → 7acd(script 0996) / a2d01(render, scope 4e0342a8)
 *     OrderAction  8c46 → b8d0(script 02e8) / 60eb(render, scope becf8788)
 *   接口模块 `7db7`：getOrderDetails / changeOrderStatus
 *   接口模块 `5a48`：getECardPass → /crystal_goods/getCardCode
 *
 * 原站 script `de30` 逐字逻辑：
 *   data: { orderId, loading:false, orderType, info:{} }
 *   onLoad(query): orderId=query.id; orderType=query.orderType; getOrderInfo()
 *   computed:
 *     orderStatusInfo → info.id ? ORDER_STATUS_MAP[info.order_type][info.order_status] : {}
 *     title           → info.id ? ORDER_STATUS_MAP[info.order_type][info.order_status].title : ''
 *   getOrderInfo():
 *     loading=true → getOrderDetails(orderId, orderType)
 *       .then(res => { loading=false; info=res.data })
 *       .catch(() => setTimeout(backPage, 1500))
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail } from '@/api'
import { ORDER_STATUS_MAP } from '@/components/order/statusMap'
import OrderStatus from '@/components/order/OrderStatus.vue'
import GoodsBar from '@/components/order/GoodsBar.vue'
import GoodsInfo from '@/components/order/GoodsInfo.vue'
import OrderAction from '@/components/order/OrderAction.vue'

const route = useRoute()
const router = useRouter()

const orderId = ref(null)
const orderType = ref(null)
const loading = ref(false)
const info = ref({})

const orderStatusInfo = computed(() => {
  if (!info.value.id) return {}
  const map = ORDER_STATUS_MAP[info.value.order_type]
  return (map && map[info.value.order_status]) || {}
})

const title = computed(() => (info.value.id ? orderStatusInfo.value.title || '' : ''))

async function getOrderInfo() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getOrderDetail(orderId.value, orderType.value)
    loading.value = false
    info.value = res.data || {}
  } catch (e) {
    loading.value = false
    setTimeout(goBack, 1500)
  }
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/order/list')
}

/**
 * 原站每次 uni.navigateTo 都是新页面实例，onLoad 必触发；
 * Vue Router 对同路由不同 query 会复用组件，故此处 watch query 以对齐原站语义。
 */
function load() {
  orderId.value = route.query.id
  orderType.value = route.query.orderType
  info.value = {}
  getOrderInfo()
}

onMounted(load)
watch(() => [route.query.id, route.query.orderType], load)
</script>

<style scoped>
/* 原站 scope 2045eb18 —— #order-details 全套 */
#order-details.fsc-page {
  min-height: 100vh;
  background: #101115;
  padding: 12.48px 16.64px 124.8px;
  box-sizing: border-box;
}
#order-details .fsc-card {
  border: 0.52px solid #655032;
  background-color: #181713;
  border-radius: 15.6px;
}
#order-details .fsc-status {
  padding: 20.8px 14.56px;
  margin-bottom: 12.48px;
}
#order-details .fsc-goods {
  padding: 14.56px;
  margin-bottom: 12.48px;
}
#order-details .fsc-detail {
  padding: 16.64px 14.56px;
}

.fsc-navbar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 4px;
}
.fsc-nav-back {
  position: absolute;
  left: 16.64px;
  top: 0;
  height: 44px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.fsc-nav-back-icon {
  width: 20px;
  height: 20px;
}
.fsc-nav-title {
  font-size: 16.64px;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.fsc-loading {
  padding: 60px 0;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>