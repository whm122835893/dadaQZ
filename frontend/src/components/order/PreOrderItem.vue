<template>
  <div class="ent-card">
    <img class="ent-img" :src="item.goods_image" alt="" />
    <div class="ent-info">
      <div class="ent-row">
        <span class="ent-name">{{ item.goods_name }}</span>
        <div class="ent-price">
          <span class="ent-price__sym">￥</span>
          <span class="ent-price__num">{{ item.total_price }}</span>
        </div>
      </div>

      <!-- 委托中/已成交 且数量>1 → 显示进度条 -->
      <div v-if="showProgress" class="ent-progress">
        <div class="ent-progress__bar">
          <i class="ent-progress__fill" :style="{ width: progressPercent + '%' }" />
        </div>
        <div class="ent-progress__text">委托数量：{{ item.sale_number }}/{{ item.number }}</div>
      </div>
      <span v-else class="ent-qty"> x{{ item.number }} </span>

      <div class="ent-row ent-row--foot">
        <span class="ent-time">{{ updatetimeText }}</span>
        <div class="ent-actions">
          <div v-if="item.order_status === 2" class="ent-btn" @click.stop="cancelOrder(item)">取消订单</div>
          <div v-else-if="item.order_status === 1" class="ent-btn" @click.stop="pay(item)">立即支付</div>
          <div v-else-if="item.order_status === 4" class="ent-btn" @click.stop="toBeg(item)">重新委托</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 委托订单卡片 —— 原站 preOrderItem
 * script `b007` + render `33d1`（scope `3093a2ca`）
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  item: { type: Object, default: () => ({}) }
})
defineEmits(['countDownOver'])

const router = useRouter()

/** 委托中(2) 或 已成交(3) 且数量 > 1 时展示进度条 */
const showProgress = computed(
  () =>
    (props.item.order_status === 2 || props.item.order_status === 3) &&
    props.item.number > 1
)

const progressPercent = computed(() => {
  const n = Number(props.item.number || 0)
  const s = Number(props.item.sale_number || 0)
  if (!n) return 0
  return (s / n) * 100
})

function formatDate(ts) {
  if (!ts) return '---'
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}:${p(d.getSeconds())}`
}

const updatetimeText = computed(() => formatDate(props.item.updatetime))

/** 重新委托 → /pages/market/submitEntrust */
function toBeg(a) {
  router.push(`/pages/market/submitEntrust?id=${a.goods_id}`)
}

function cancelOrder(a) {
  // eslint-disable-next-line no-console
  console.log('取消委托订单', a.id)
}

function pay(a) {
  // eslint-disable-next-line no-console
  console.log('支付委托订单', a.id)
}
</script>

<style scoped>
/**
 * 对齐原站 scope `3093a2ca`，rpx × 0.52
 */
.ent-card {
  display: flex;
  background: #181713;
  border: 0.52px solid #655032;
  border-radius: 10.4px;
  padding: 10.4px;
  box-sizing: border-box;
}
.ent-img {
  width: 41.6px;
  height: 41.6px;
  border-radius: 4.16px;
  object-fit: cover;
  background-color: #262219;
  flex-shrink: 0;
}
.ent-info {
  flex: 1;
  min-width: 0;
  margin-left: 5.2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4.16px 0;
}
.ent-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ent-name {
  font-size: 13.52px;
  color: #fff;
  max-width: 156px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ent-price {
  display: flex;
  align-items: baseline;
  color: #999;
}
.ent-price__sym {
  font-size: 12.48px;
}
.ent-price__num {
  font-size: 14.56px;
  color: #fae8bd;
  font-weight: 500;
}
.ent-qty {
  font-size: 12.48px;
  color: #999;
}
.ent-progress__bar {
  width: 122.72px;
  height: 4.16px;
  background: #2a2a30;
  border-radius: 2px;
  overflow: hidden;
}
.ent-progress__fill {
  display: block;
  height: 100%;
  background: #cfaf72;
}
.ent-progress__text {
  font-size: 5.2px;
  color: #999;
  margin-top: 2.08px;
}
.ent-row--foot {
  margin-top: 6.24px;
}
.ent-time {
  font-size: 5.2px;
  color: #999;
}
.ent-actions {
  display: flex;
  align-items: center;
}
.ent-btn {
  padding: 4.16px 14.56px;
  font-size: 12.48px;
  border-radius: 15.6px;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  font-weight: 500;
}
</style>
