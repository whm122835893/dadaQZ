<template>
  <!--
    原站 OrderStatus render `78fe`（scope 9453758e）—— 浅色主题版
    结构（与原站逐字一致）：
      .os-content.pt-15.pb-1.flex.flex-ai-center.flex-js-center
        .ml-12.text-center.font-w-bold
          [info.text]  uni-text.mt-4.font-color-{textColor}
          [info.tips] .flex.mt-4.font-color-{tipsColor}
              · tips!=='updatetime' → uni-text.font-size-12.font-color-black
              · 倒计时 u-count-down(ml-4, font-color-black, time=1000*surplus_time_text, 'mm:ss')
              · tips==='updatetime' → uni-text.font-size-12 = formatDate(updatetime)
    浅色配色（原站 scope 9453758e 色板）：
      font-color-success → #333；font-color-black → #23262f；font-color-999 → #999
      （tipsColor='main-text' 在浅色 scope 中无定义 → 不着色，由内部 font-color-black 决定）
    尺寸（原站 .os-content{width:690rpx;height:140rpx;margin:0 auto}，px = rpx × 0.52）：
      358.8 × 72.8，水平居中；pt-15 = 15.6px、pb-1 = 1.04px
  -->
  <div class="os-content">
    <div class="os-inner">
      <div class="os-main">
        <span v-if="info.text" class="os-text" :style="{ color: textColor }">{{ info.text }}</span>

        <div v-if="info.tips" class="os-tips">
          <span v-if="info.tips !== 'updatetime'" class="os-tips-text">{{ info.tips }}</span>

          <span
            v-if="info.tips !== 'updatetime' && order.surplus_time_text != 0 && showCountDown"
            class="os-count"
          >{{ countDownText }}</span>

          <span v-if="info.tips === 'updatetime'" class="os-tips-text">{{ formatDate(order.updatetime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 订单状态卡（浅色版）—— 原站组件 `OrderStatus`
 *   script `23a1`：computed.info = ORDER_STATUS_MAP[order.order_type][order.order_status]
 *                   methods.finish → $emit('finish')
 *   render `78fe`（scope 9453758e）
 *
 * 与深色版 `OrderStatus.vue`（第 11 页 defaultDetail 专用）的区别仅在配色与
 * `.os-content` 尺寸：深色页由 #order-details 覆盖为 width:100%/height:auto；
 * 本页（原站 scope 3c9fc44c）无覆盖，保持组件默认 690rpx × 140rpx。
 * 为不影响已验收页面，此处独立成组件，不改动原 OrderStatus.vue。
 */
import { computed, onUnmounted, ref, watch } from 'vue'
import { ORDER_STATUS_MAP } from './statusMap'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['finish'])

const info = computed(() => {
  const map = ORDER_STATUS_MAP[props.order.order_type]
  return (map && map[props.order.order_status]) || {}
})

/** 原站浅色色板：textColor='success' → #333（scope 9453758e .font-color-success） */
const textColor = computed(() => '#333')

/** 原站条件：0 != surplus_time_text && (order_type<=2 || ==10 || ==19) && order_status==1 */
const showCountDown = computed(() => {
  const o = props.order
  if (!o || o.surplus_time_text == 0) return false
  if (!(o.order_type <= 2 || o.order_type === 10 || o.order_type === 19)) return false
  return o.order_status === 1
})

/** u-count-down：format 'mm:ss'，倒计时结束触发 finish → 父组件 getOrderInfo() */
const remain = ref(0)
let timer = null

function fmt(total) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
const countDownText = computed(() => fmt(Math.max(0, remain.value)))

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
function start() {
  stop()
  if (!showCountDown.value) {
    remain.value = 0
    return
  }
  remain.value = Number(props.order.surplus_time_text) || 0
  timer = setInterval(() => {
    remain.value -= 1
    if (remain.value <= 0) {
      remain.value = 0
      stop()
      emit('finish')
    }
  }, 1000)
}

watch(() => [props.order.id, props.order.surplus_time_text, showCountDown.value], start, { immediate: true })
onUnmounted(stop)

/** 原站 formatDate(order.updatetime)，YYYY-MM-DD HH:mm */
function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>

<style scoped>
/* 原站 scope 9453758e：.os-content{width:690rpx;height:140rpx;margin:0 auto} */
.os-content {
  width: 358.8px;
  height: 72.8px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.os-inner {
  width: 100%;
  text-align: center;
}
.os-main {
  font-weight: 700;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
/* 原站 .ml-12.text-center.font-w-bold：ml-12 = 24rpx = 12.48px */
.os-inner {
  margin-left: 12.48px;
}
/* 原站 uni-text.mt-4.font-color-success → #333 */
.os-text {
  display: block;
  margin-top: 4.16px;
  font-size: 17.68px;
  font-weight: 700;
  color: #333;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
/* 原站 .flex.mt-4.font-color-{tipsColor}（main-text 无定义 → 不着色） */
.os-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4.16px;
}
/* 原站 uni-text.font-size-12.font-color-black → #23262f */
.os-tips-text {
  font-size: 12.48px;
  color: #23262f;
  font-family: 'Alibaba-PuHuiTi-Regular', sans-serif;
}
/* 原站 u-count-down.ml-4.font-color-black → #23262f */
.os-count {
  margin-left: 4.16px;
  font-size: 14px;
  color: #23262f;
  font-family: 'Alibaba-PuHuiTi-Regular', sans-serif;
}
</style>
