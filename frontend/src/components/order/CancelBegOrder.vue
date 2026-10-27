<template>
  <!--
    原站 CancelBegOrder（beg/info 用）render `6482`
      w-toast(title=取消求购,
              content=当订单数量大于1时，取消订单只能取消求购中的订单，不能取消求购成功的订单。,
              content-align=center, cancelText=我再想想, submitText=确认取消)
              @action=cancelFn
    w-toast（scope 06d93b02）：291.2px / radius 15.6px / padding 14.56-17.68-24.96；
      按钮 type 默认 colorful（金渐变），cancel 带 pain（#f0f0f2/#000）；
      弹窗内 .toast-action > .z-btn 覆盖：高 41.6px / 宽 114.4px / radius 6.24px
  -->
  <div v-if="show" class="ov-mask" @click.self="show = false">
    <div class="w-toast">
      <div class="toast-title">取消求购</div>
      <div class="toast-content">当订单数量大于1时，取消订单只能取消求购中的订单，不能取消求购成功的订单。</div>
      <div class="toast-action">
        <div class="z-btn bl-dialog-btn bl-dialog-btn--cancel" @click="show = false">我再想想</div>
        <div class="z-btn bl-dialog-btn bl-dialog-btn--submit" @click="cancelFn(true)">确认取消</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 取消求购弹窗 —— 原站组件 `CancelBegOrder`（logic `d42e` / render `6482`）
 *   props: { order }
 *   data:  { show: false }
 *   methods:
 *     cancel()   → show = true（父组件 $refs.cancelOrder.cancel() 触发）
 *     cancelFn(a)→ a 为真时 cancelBegBuy(order.id) → toast(msg) + order.order_status = 4
 * 样式与 begList.vue 内联版一致（该页已验收）；此处抽成组件供 beg/info 复用。
 */
import { ref } from 'vue'
import { cancelBegBuy } from '@/api'
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
    const res = await cancelBegBuy(props.order.id)
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
