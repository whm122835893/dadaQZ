<template>
  <div class="ptr">
    <div
      v-for="t in basePayList"
      :key="t.pay_way"
      class="ptr__item"
      :class="{ 'ptr__item--active': value === t.pay_way }"
      @click="changePayWay(t)"
    >
      {{ t.name }}支付
    </div>
  </div>
</template>

<script setup>
/**
 * 支付方式单选 —— 原站 PayTypeRadio
 * script `a8fa` + render `5b09`（scope `54c0d499`）
 * basePayList 取自原站主包常量（仅「易宝」一项）
 */
import { BASE_PAY_LIST } from '@/api/mock'

const props = defineProps({
  value: { type: String, default: 'huifu' }
})
const emit = defineEmits(['change'])

const basePayList = BASE_PAY_LIST

/** 原站 changePayWay：$emit('change', pay_way) */
function changePayWay(a) {
  emit('change', a.pay_way)
}
</script>

<style scoped>
/**
 * 对齐原站 scope `54c0d499`
 */
.ptr {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ptr__item {
  padding: 5.2px 12.7px;
  border-radius: 5.2px;
  font-size: 12.48px;
  color: #8e8e93;
  background: #1e1e22;
  border: 0.52px solid #3a3a42;
}
.ptr__item--active {
  color: #2f2414;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  border-color: transparent;
  font-weight: 500;
}
</style>
