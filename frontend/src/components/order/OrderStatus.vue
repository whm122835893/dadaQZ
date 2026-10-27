<template>
  <!-- 原站 OrderStatus render `78fe`（scope 9453758e）：
       .os-content.pt-15.pb-1 .info.icon .flex.flex-ai-center.flex-js-center
       > .ml-12.text-center.font-w-bold
         > uni-text.mt-4.font-color-{info.textColor}  → info.text
         > [info.tips] .flex.mt-4.font-color-{info.tipsColor}
               · tips!=='updatetime' → uni-text.font-size-12.font-color-black = info.tips
               · 倒计时 u-count-down(time=1000*surplus_time_text, format 'mm:ss')
               · tips==='updatetime' → formatDate(order.updatetime)
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
 * 订单状态卡 —— 原站组件 `OrderStatus`
 *   script  `23a1`：computed.info = ORDER_STATUS_MAP[order.order_type][order.order_status]
 *                     methods.finish → $emit('finish')
 *   render  `78fe`（scope 9453758e）
 *   style   .os-content{width:690rpx;height:140rpx;margin:0 auto}
 *           页面级（#order-details）覆盖为 width:100%;height:auto;margin:0;padding:0
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

/**
 * 颜色按原站 #order-details 作用域样式层叠结果确定：
 *   `.fsc-status .os-content .font-w-bold > uni-text`（0,3,1）
 *     → 主状态文字 恒为 #fff / 17.68px（`font-color-success` 的 #fae8bd 被更高特异性覆盖）
 *   `.fsc-status .os-content .font-color-black`（0,3,0）
 *     → 后定义的 `.font-size-12`（同特异性、位置更后）color:#999 覆盖 → tips 文字 #999 / 12.48px
 *   u-count-down 的 `.font-color-black` 未被覆盖 → #fff
 */
const textColor = computed(() => '#fff')

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
.os-content {
  width: 100%;
  height: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.os-inner {
  margin-left: 0;
  width: 100%;
  text-align: center;
}
.os-main {
  font-weight: 600;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.os-text {
  display: block;
  margin-top: 4.16px;
  font-size: 17.68px;
  font-weight: 600;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.os-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4.16px;
  color: #999;
}
.os-tips-text {
  font-size: 12.48px;
  color: #999;
  font-family: 'Alibaba-PuHuiTi-Regular', sans-serif;
}
.os-count {
  margin-left: 4.16px;
  font-size: 14px;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Regular', sans-serif;
}
</style>