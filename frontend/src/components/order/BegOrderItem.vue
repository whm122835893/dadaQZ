<template>
  <div class="beg-card">
    <!-- 原站 .beg-card__head -->
    <div class="beg-head">
      <div class="beg-series">
        <span class="beg-series__name">{{ seriesName }}</span>
      </div>
      <span class="beg-sn">订单号: {{ maskedSn }}</span>
    </div>

    <!-- 原站 .beg-card__body -->
    <div class="beg-body">
      <img class="beg-img" :src="goodsImage" alt="" />
      <div class="beg-info">
        <div class="beg-row">
          <span class="beg-name">{{ item.goods_name }}</span>
          <span class="beg-price">¥ {{ displayPrice }}</span>
        </div>
        <span class="beg-qty">x{{ item.number || 1 }}</span>
      </div>
    </div>

    <!-- 原站 .beg-card__foot -->
    <div class="beg-foot">
      <span class="beg-time">{{ createtimeText }}</span>
      <div class="beg-actions">
        <div v-if="item.order_status === 1" class="beg-btn" @click.stop="pay(item)">立即支付</div>
        <div v-else-if="item.order_status === 2" class="beg-btn" @click.stop="cancelOrder(item)">取消订单</div>
        <div v-else-if="item.order_status === 4" class="beg-btn" @click.stop="toBeg(item)">重新求购</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 求购订单卡片 —— 原站 begOrderItem
 * script `ce36` + render `2986`（scope `26b377b4`）
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  item: { type: Object, default: () => ({}) }
})
defineEmits(['countDownOver'])

const router = useRouter()

const seriesName = computed(
  () =>
    props.item.series_name ||
    props.item.category_name ||
    props.item.collection_name ||
    props.item.goods_name ||
    '默认分类'
)

const goodsImage = computed(
  () => props.item.goods_image || props.item.goods_cover_image || ''
)

const maskedSn = computed(() => {
  const sn = props.item.order_sn
  if (!sn) return ''
  return sn.slice(0, 5) + '****' + sn.slice(-5)
})

const displayPrice = computed(
  () => Number((props.item.price ?? props.item.total_price) || 0).toFixed(2)
)

function formatDate(ts) {
  if (!ts) return '---'
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}:${p(d.getSeconds())}`
}

const createtimeText = computed(() => formatDate(props.item.createtime))

/** 重新求购 → /pages/market/submitBegBuy */
function toBeg(a) {
  router.push(`/pages/market/submitBegBuy?id=${a.goods_id}`)
}

/** 取消订单（原站走 $refs.cancelOrder.cancel() 弹确认框） */
function cancelOrder(a) {
  // eslint-disable-next-line no-console
  console.log('取消求购订单', a.id)
}

/** 立即支付（原站走 $refs.payOrder.pay()） */
function pay(a) {
  // eslint-disable-next-line no-console
  console.log('支付求购订单', a.id)
}
</script>

<style scoped>
/**
 * 对齐原站 scope `26b377b4`，rpx × 0.52
 */
.beg-card {
  background: #181713;
  border: 0.52px solid #655032;
  border-radius: 10.4px;
  padding: 10.4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.beg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.beg-series__name {
  font-size: 13.52px;
  color: #fff;
  font-weight: 500;
}
.beg-sn {
  font-size: 11.44px;
  color: #999;
}
.beg-body {
  display: flex;
  align-items: center;
  margin-top: 8.32px;
}
.beg-img {
  width: 72px;
  height: 72px;
  border-radius: 7.28px;
  object-fit: cover;
  background-color: #262219;
  flex-shrink: 0;
}
.beg-info {
  flex: 1;
  min-width: 0;
  margin-left: 10.4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.beg-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.beg-name {
  font-size: 13.52px;
  color: #fff;
  max-width: 156px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.beg-price {
  font-size: 13.52px;
  color: #fae8bd;
  font-weight: 500;
}
.beg-qty {
  font-size: 13.52px;
  color: #999;
}
.beg-foot {
  margin-top: 8.32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.beg-time {
  font-size: 10.4px;
  color: #999;
}
.beg-actions {
  display: flex;
  align-items: center;
}
.beg-btn {
  padding: 4.16px 14.56px;
  font-size: 12.48px;
  border-radius: 15.6px;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  font-weight: 500;
}
</style>
