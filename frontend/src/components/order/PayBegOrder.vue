<template>
  <!--
    原站 PayBegOrder（beg/info 用）render `c37f`
      w-modal(title=null → 无标题) @action=payFn
        插槽1：.text-center.font-size-12.font-color-textPrimary
               = " ￥" + uni-text.font-size-24(order.total_price)
        插槽2：.text-center.font-color-textPrimary.mt-12.font-size-14
               = 您确认求购吗？
    w-modal（scope 471d5780）：312px / border 1px #e7e7ea / radius 16.64px /
      padding 14.56-17.68-24.96；按钮 type=toast-btn（确认 #000 白字），cancel 带 pain；
      弹窗内 .toast-action > .z-btn 覆盖：高 41.6px / 宽 124.8px / radius 6.24px
  -->
  <div v-if="show" class="ov-mask" @click.self="show = false">
    <div class="w-modal">
      <div class="text-center font-size-12 font-color-textPrimary">
        <span>￥</span><span class="font-size-24">{{ order.total_price }}</span>
      </div>
      <div class="text-center font-color-textPrimary mt-12 font-size-14">您确认求购吗？</div>
      <div class="toast-action">
        <div class="z-btn bl-dialog-btn bl-dialog-btn--cancel bl-dialog-btn--wide" @click="show = false">取消</div>
        <div class="z-btn bl-dialog-btn bl-dialog-btn--dark bl-dialog-btn--wide" @click="payFn(true)">确认</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 求购支付弹窗 —— 原站组件 `PayBegOrder`（logic `5921` / render `c37f`）
 *   props: { order }
 *   data:  { show: false }
 *   methods:
 *     pay()   → show = true（父组件 $refs.payOrder.pay() 触发）
 *     payFn(a)→ a 为真时 new Pay({order_id, order_number:order_sn,
 *                order_type:11, pay_type:4, pay_way}) → doPay
 * 本项目未接入支付渠道，与 begList 内联版一致：toast 提示 + console 记录。
 */
import { ref } from 'vue'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})

const show = ref(false)

function pay() {
  show.value = true
}

function payFn(confirm) {
  if (!confirm) return
  show.value = false
  toast('暂未接入支付渠道')
  console.log('[begInfo] doPay →', {
    order_id: props.order.id,
    order_number: props.order.order_sn,
    order_type: 11,
    pay_type: 4,
    pay_way: props.order.pay_way
  })
}

defineExpose({ pay })
</script>

<style scoped>
.ov-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 原站 w-modal scope 471d5780 */
.w-modal {
  width: 312px;
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 16.64px;
  padding: 14.56px 17.68px 24.96px;
  position: relative;
  box-sizing: border-box;
}
/* 原站 .w-modal > .toast-action{margin-top:112rpx} */
.toast-action {
  margin-top: 58.24px;
  display: flex;
  justify-content: space-between;
}
/* 原站 .w-modal > .toast-action > .z-btn{height:80rpx;width:240rpx;border-radius:12rpx} */
.bl-dialog-btn {
  height: 41.6px;
  border-radius: 6.24px;
  font-size: 14.56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  font-weight: bold;
}
.bl-dialog-btn--wide {
  width: 124.8px;
}
/* 原站 w-modal 按钮 type=toast-btn：确认键 #000 底白字；cancel 带 pain → #f0f0f2/#000 */
.bl-dialog-btn--dark {
  background: #000;
  color: #fff;
}
.bl-dialog-btn--cancel {
  background: #f0f0f2;
  color: #000;
}
.font-size-12 { font-size: 12.48px; }
.font-size-14 { font-size: 14.56px; }
.font-size-24 { font-size: 24.96px; }
.mt-12 { margin-top: 12.48px; }
.text-center { text-align: center; }
.font-color-textPrimary { color: #333; }
</style>
