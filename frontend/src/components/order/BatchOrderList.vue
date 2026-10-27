<template>
  <div>
    <div
      v-for="t in list"
      :key="t.id"
      class="bol-row"
      @click="changeCheck(t)"
    >
      <div class="bol-check">
        <img
          class="bol-check__img"
          :src="t.check ? CHECKED : UNCHECKED"
          alt=""
        />
      </div>
      <div class="bol-card">
        <div class="bol-card__title">等待付款</div>
        <div class="bol-card__body">
          <img class="bol-card__img" :src="t.goods_cover_image" alt="" />
          <div class="bol-card__info">
            <div class="bol-card__price-row">
              <span class="bol-card__price">￥{{ t.total_price }}</span>
            </div>
            <div class="bol-card__meta-row">
              <span class="bol-card__code">#{{ t.collection_code }}/{{ t.total_num }}</span>
              <span class="bol-card__time">{{ createtimeText(t.createtime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 批量付订单列表 —— 原站 BatchOrderList
 * script `58db` + render `c951`（scope `352525cf`）
 */
import { computed } from 'vue'

const props = defineProps({
  list: { type: Array, default: () => [{}] }
})
const emit = defineEmits(['changeStatus'])

const CHECKED = '/assets/img/order/checkbox_checked.webp'
const UNCHECKED = '/assets/img/order/checkbox_unchecked.webp'

/** 勾选切换（原站 changeCheck → $emit('changeStatus', item)） */
function changeCheck(t) {
  emit('changeStatus', t)
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}:${p(d.getSeconds())}`
}

function createtimeText(ts) {
  return formatDate(ts)
}
</script>

<style scoped>
/**
 * 对齐原站 scope `352525cf`，rpx × 0.52
 */
.bol-row {
  display: flex;
  align-items: center;
  margin-top: 6.24px;
  background: #fff;
  border-radius: 4.16px;
}
.bol-check {
  width: 41.6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bol-check__img {
  width: 10.4px;
  height: 10.4px;
}
.bol-card {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 4.16px;
  padding-top: 6.24px;
  padding-bottom: 4.16px;
}
.bol-card__title {
  padding: 0 6.24px 4.16px;
  border-bottom: 1px solid #f1f1f1;
  font-size: 12.48px;
  color: #000;
  font-weight: 500;
}
.bol-card__body {
  padding: 4.16px 6.24px 0;
  display: flex;
  align-items: center;
}
.bol-card__img {
  width: 62.4px;
  height: 62.4px;
  border-radius: 4.16px;
  object-fit: cover;
  background-color: #f1f1f1;
  flex-shrink: 0;
}
.bol-card__info {
  margin-left: 6.24px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.bol-card__price-row {
  display: flex;
  justify-content: flex-end;
}
.bol-card__price {
  font-size: 13.52px;
  color: #000;
  font-weight: 500;
}
.bol-card__meta-row {
  display: flex;
  justify-content: space-between;
}
.bol-card__code {
  font-size: 6.24px;
  color: #000;
}
.bol-card__time {
  font-size: 6.24px;
  color: #999;
}
</style>
