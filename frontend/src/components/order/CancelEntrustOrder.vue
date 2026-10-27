<template>
  <!--
    原站 CancelEntrustOrder（entrust/list、entrust/info 共用，模块 629c）render（w-toast 壳）
      w-toast(title=取消委托,
              content=当订单数量大于1时，取消订单只能取消委托中的订单，不能取消委托成功的订单。,
              content-align=center, cancelText=我再想想, submitText=确认取消)
              @action=cancelFn
    logic（7745）：
      props: { order }
      data:  { show: false }
      cancel()   → show = true（父组件 $refs.cancelOrder.cancel() 触发）
      cancelFn(a)→ a 为真时 entrustCancel(order.id) → toast(msg) + order.order_status = 4
    接口：POST /market/Prepayment/cancelOrder  body { order_id }
    样式与 CancelBegOrder 一致（w-toast scope 06d93b02：291.2px / radius 15.6px）
  -->
  <div v-if="show" class="ov-mask" @click.self="show = false">
    <div class="w-toast">
      <div class="toast-title">取消委托</div>
      <div class="toast-content">当订单数量大于1时，取消订单只能取消委托中的订单，不能取消委托成功的订单。</div>
      <div class="toast-action">
        <div class="z-btn bl-dialog-btn bl-dialog-btn--cancel" @click="show = false">我再想想</div>
        <div class="z-btn bl-dialog-btn bl-dialog-btn--submit" @click="cancelFn(true)">确认取消</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 取消委托弹窗 —— 原站组件 `CancelEntrustOrder`（logic `7745`）
 *  entrust/list（chunk pages-order-entrust-list.bddad8c5.js）与
 *  entrust/info（chunk pages-order-entrust-info.17835750.js）共用同一组件实例
 */
import { ref } from 'vue'
import { entrustCancel } from '@/api'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})

const show = ref(false)

function cancel() {
  show.value = true
}

async function cancelFn(confirm) {
  if (!confirm) return
  show.value = false
  try {
    const res = await entrustCancel(props.order.id)
    toast((res && res.msg) || '取消成功')
    props.order.order_status = 4
  } catch (e) {
    /* 错误已由请求层提示 */
  }
}

defineExpose({ cancel })
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
/* 原站 w-toast scope 06d93b02 */
.w-toast {
  width: 291.2px;
  background: #fff;
  border-radius: 15.6px;
  padding: 14.56px 17.68px 24.96px;
}
.toast-title {
  font-size: 16.64px;
  font-weight: 700;
  color: #333;
  text-align: center;
}
.toast-content {
  font-size: 14.56px;
  font-weight: 400;
  color: #333;
  padding-top: 16.64px;
  text-align: center;
}
.toast-action {
  margin-top: 58.24px;
  display: flex;
  justify-content: space-between;
}
/* 原站 .w-toast > .toast-action > .z-btn{height:80rpx;width:220rpx;border-radius:12rpx} */
.bl-dialog-btn {
  height: 41.6px;
  width: 114.4px;
  border-radius: 6.24px;
  font-size: 14.56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  font-weight: bold;
}
.bl-dialog-btn--cancel {
  background: #f0f0f2;
  color: #000;
}
.bl-dialog-btn--submit {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
</style>
