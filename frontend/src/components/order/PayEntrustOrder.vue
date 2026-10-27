<template>
  <!--
    原站 PayEntrustOrder（entrust/list、entrust/info 共用，模块 5a12）render `52cb`
      w-modal(title=null → 无标题) @action=payFn
        插槽1：.text-center.font-size-12.font-color-textPrimary
               = " ￥" + uni-text.font-size-24(order.total_price)
        插槽2：.text-center.font-color-textPrimary.mt-12.font-size-14
               = 您确认委托吗？
    logic（a57d）：
      props: { order }
      data:  { show: false }
      pay()   → show = true（父组件 $refs.payOrder.pay() 触发）
      payFn(a)→ a 为真时 new Pay({order_id, order_number:order_sn,
                 order_type:31, pay_type:4, pay_way}) → doPay
    接口路径同 beg 版 PayClass（/order/pay/doPay），仅 order_type 31 与文案不同
  -->
  <div v-if="show" class="ov-mask" @click.self="show = false">
    <div class="w-modal">
      <div class="text-center font-size-12 font-color-textPrimary">
        <span>￥</span><span class="font-size-24">{{ order.total_price }}</span>
      </div>
      <div class="text-center font-color-textPrimary mt-12 font-size-14">您确认委托吗？</div>
      <div class="toast-action">
        <div class="z-btn bl-dialog-btn bl-dialog-btn--cancel bl-dialog-btn--wide" @click="show = false">取消</div>
        <div class="z-btn bl-dialog-btn bl-dialog-btn--dark bl-dialog-btn--wide" @click="payFn(true)">确认</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 委托支付弹窗 —— 原站组件 `PayEntrustOrder`（logic `a57d`）
 *  entrust/list（chunk pages-order-entrust-list.bddad8c5.js）与
 *  entrust/info（chunk pages-order-entrust-info.17835750.js）共用同一组件实例
 *  本项目未接入支付渠道，与 PayBegOrder 一致：toast 提示 + console 记录
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
  console.log('[entrustInfo] doPay →', {
    order_id: props.order.id,
    order_number: props.order.order_sn,
    order_type: 31,
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
