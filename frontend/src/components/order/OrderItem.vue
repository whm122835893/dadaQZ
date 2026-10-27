<template>
  <div class="oi-card" @click="toDetail">
    <!-- 原站 .order-item-head -->
    <div class="oi-head">
      <span class="oi-head__name">{{ order.goods_name }}</span>
      <span class="oi-head__arrow">›</span>
      <div class="oi-head__sn">
        <span class="oi-head__sn-label">订单号:</span>
        <span class="oi-head__sn-value">{{ maskedSn }}</span>
      </div>
    </div>

    <!-- 原站 .order-item-body -->
    <div class="oi-body">
      <img class="oi-body__img" :src="order.goods_cover_image" alt="" />
      <div class="oi-body__info">
        <span class="oi-body__name">{{ order.goods_name }}</span>
        <span class="oi-body__price">{{ priceLabel }}: ¥{{ displayPrice }}</span>
        <span class="oi-body__time">创建订单: {{ createtimeText }}</span>
        <span v-if="order.order_type === 8" class="oi-body__time"> 更新时间: {{ updatetimeText }}</span>
        <span v-else class="oi-body__time"> 转入成功: {{ transferText }}</span>
      </div>
      <div class="oi-body__side">
        <div class="oi-status" :style="{ fontSize: '12.48px', color: statusColor, marginBottom: '4.16px' }">
          <template v-if="isPending && countDown >= 0 && order.order_type < 3">
            <span class="oi-status__count">{{ countDownText }}</span>
            <span class="oi-status__text">{{ statusInfo.title || '待付款' }}</span>
          </template>
          <span v-else class="oi-status__text" :style="{ color: successTextColor }">
            {{ statusInfo.title || '未知状态' }}
          </span>
        </div>
        <div class="oi-qty">x{{ order.num || 1 }}</div>
      </div>
    </div>

    <!-- 原站 .order-item-foot -->
    <div class="oi-foot">
      <div class="oi-foot__more" @click.stop="toDetail">
        <span>更多信息</span>
        <img class="oi-foot__more-arrow" src="/assets/img/order/arrow-right.webp" alt="" />
      </div>
      <div class="oi-foot__right">
        <div v-if="isPending" class="oi-foot__pay">
          <div class="oi-foot__pay-btn" @click.stop="toDetail">去付款</div>
          <span class="oi-foot__pay-price">待付款 ¥{{ fixedTotal }}</span>
        </div>
        <span v-else-if="order.order_status === 2" class="oi-foot__success">
          {{ order.order_type === 8 ? '寄售价' : '实付款' }} ¥{{ fixedTotal }}
        </span>
        <span v-else class="oi-foot__price">¥{{ fixedTotal }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 订单卡片 —— 原站 OrderItem
 * script `927f` + render `43e8`（scope `32f4089f`）
 */
import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { ORDER_STATUS_MAP } from './statusMap'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['countDownOver'])

const router = useRouter()

/** 原站 orderStatusInfo：orderStatusMap[order_type][order_status] */
const statusInfo = computed(() => {
  if (!props.order.id) return {}
  const t = ORDER_STATUS_MAP[props.order.order_type] || {}
  return t[props.order.order_status] || {}
})

/** 订单号脱敏：前 5 位 + **** + 后 5 位 */
const maskedSn = computed(() => {
  const sn = props.order.order_sn
  if (!sn) return ''
  return sn.slice(0, 5) + '****' + sn.slice(-5)
})

/** 寄售价 / 购入价（原站 order_type === 8 判断） */
const priceLabel = computed(() => (props.order.order_type === 8 ? '寄售价' : '购入价'))

const displayPrice = computed(
  () => props.order.total_price || props.order.price || 0
)

const fixedTotal = computed(() =>
  Number(props.order.total_price || props.order.price || 0).toFixed(2)
)

/** 是否待付款 */
const isPending = computed(
  () => statusInfo.value.title === '待付款' || statusInfo.value.text === '待支付'
)

/** 待付款红色，否则灰色 */
const statusColor = computed(() => (isPending.value ? '#FF3B30' : '#999'))

/** 状态文案颜色（含「取消」时用警示色） */
const successTextColor = computed(() =>
  (statusInfo.value.title || '').indexOf('取消') > -1 ? '#2FCB7A' : ''
)

/**
 * 支付倒计时：createtime + pay_time_limit - now
 * pay_time_limit 实调 /index/getConfig 返回 "180"（秒）
 */
const configStore = useConfigStore()
const payTimeLimit = computed(() => {
  const v = configStore.config?.pay_time_limit
  return v ? Number(v) : 180
})
const nowTimestamp = ref(Date.now())
const countDown = computed(
  () => 1000 * (props.order.createtime + payTimeLimit.value) - nowTimestamp.value
)

/** 每秒刷新倒计时 */
const timer = setInterval(() => {
  nowTimestamp.value = Date.now()
}, 1000)
onUnmounted(() => clearInterval(timer))

/** HH:mm:ss 倒计时文案 */
const countDownText = computed(() => {
  const total = Math.max(0, Math.floor(countDown.value / 1000))
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
})

/** 原站 formatDate 过滤器：秒级时间戳 → YYYY-MM-DD HH:mm:ss */
function formatDate(ts) {
  if (!ts) return '---'
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}:${p(d.getSeconds())}`
}

const createtimeText = computed(() => formatDate(props.order.createtime))
const updatetimeText = computed(() =>
  props.order.updatetime ? formatDate(props.order.updatetime) : '---'
)
const transferText = computed(() => {
  if (props.order.transfer_time) return formatDate(props.order.transfer_time)
  if (props.order.order_status === 2) return formatDate(props.order.updatetime)
  return '---'
})

/** 点击跳转订单详情（原站 toDetail） */
function toDetail() {
  const o = props.order
  if (o.order_type === 19) {
    router.push({ path: '/pages/order/regiftDetail', query: { id: o.id, orderType: o.order_type } })
  } else if (o.order_type !== 8) {
    router.push({ path: '/pages/order/defaultDetail', query: { id: o.id, orderType: o.order_type } })
  } else {
    router.push({ path: '/pages/order/marketDetail', query: { id: o.id } })
  }
}
</script>

<style scoped>
/**
 * 对齐原站 scope `32f4089f`，rpx × 0.52
 */
.oi-card {
  background: #181713;
  width: 353.6px;
  margin-bottom: 10.4px;
  border: 0.52px solid #655032;
  border-radius: 10.92px;
  padding: 8.16px 8.62px 10.4px 9.07px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* ---- head ---- */
.oi-head {
  display: flex;
  align-items: center;
}
.oi-head__name {
  font-weight: 500;
  font-size: 14.56px;
  color: #fff;
  margin-left: 7.25px;
  font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.oi-head__arrow {
  margin-left: 9.07px;
  flex-shrink: 0;
  color: #655032;
  font-size: 15px;
  line-height: 1;
}
.oi-head__sn {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.oi-head__sn-label,
.oi-head__sn-value {
  font-weight: 400;
  font-size: 12.48px;
  color: #999;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
}

/* ---- body ---- */
.oi-body {
  margin-top: 8.62px;
  flex: 1;
  display: flex;
  align-items: center;
}
.oi-body__img {
  width: 78px;
  height: 78px;
  margin-right: 9.07px;
  border-radius: 7.28px;
  flex-shrink: 0;
  object-fit: cover;
  background-color: #262219;
}
.oi-body__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.oi-body__info > * + * {
  margin-top: 5.2px;
}
.oi-body__name {
  font-weight: 500;
  font-size: 12.48px;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.oi-body__price {
  font-weight: 500;
  font-size: 11.96px;
  color: #fae8bd;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
}
.oi-body__time {
  font-weight: 400;
  font-size: 9.88px;
  color: #999;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
}
.oi-body__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 6.24px;
}
.oi-status {
  display: flex;
  align-items: center;
}
.oi-status > * + * {
  margin-left: 5.2px;
}
.oi-status__text {
  font-size: 12.48px;
}
.oi-status__count {
  font-size: 12.48px;
  color: #ff3b30;
  font-weight: 500;
}
.oi-qty {
  font-size: 12.48px;
  color: #999;
}

/* ---- foot ---- */
.oi-foot {
  margin-top: 5.2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.oi-foot__more {
  font-size: 12.48px;
  color: #999;
  display: flex;
  align-items: center;
}
.oi-foot__more-arrow {
  width: 12.48px;
  height: 12.48px;
  margin-left: 2.08px;
  filter: brightness(0) invert(1);
}
.oi-foot__right {
  display: flex;
  align-items: center;
}
.oi-foot__right > * + * {
  margin-left: 10.4px;
}
.oi-foot__pay {
  display: flex;
  align-items: center;
}
.oi-foot__pay > * + * {
  margin-left: 10.4px;
}
.oi-foot__pay-btn {
  padding: 6.24px 16.64px;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  border-radius: 7.28px;
  font-size: 12.48px;
  color: #2f2414;
  font-weight: 500;
  border: none;
}
.oi-foot__pay-price {
  font-size: 14.56px;
  color: #ff453a;
  font-weight: 500;
}
.oi-foot__success {
  font-size: 14.56px;
  color: #fae8bd;
  font-weight: 700;
}
.oi-foot__price {
  font-size: 14.56px;
  color: #fff;
  font-weight: 500;
}
</style>
