<template>
  <!-- 原站 OrderAction render `60eb`（scope becf8788） -->
  <div class="order-action">
    <div class="order-action-container plr-16 flex flex-ai-center flex-js-sb">
      <!-- order_status == 1 -->
      <template v-if="order.order_status === 1">
        <div class="z-btn pain" style="width: 135.2px" @click="showCancelToast = true">取消订单</div>
        <div class="z-btn" style="width: 208px" @click="showConfirm = true">确认支付</div>
      </template>

      <!-- order_status == 2 -->
      <template v-else-if="order.order_status === 2">
        <div class="z-btn pain" style="width: 135.2px" @click="toMyCollection">我的收藏</div>
        <div class="z-btn" style="width: 208px" @click="toBuy">继续购买</div>
      </template>

      <!-- order_status == 7 -->
      <template v-else-if="order.order_status === 7">
        <div class="z-btn disabled flex-1">转入中</div>
      </template>

      <!-- order_status == 3 -->
      <template v-else-if="order.order_status === 3">
        <div class="z-btn flex-1" @click="toBuy">继续购买</div>
      </template>
    </div>

    <!-- 原站 w-toast：取消订单二次确认 -->
    <div v-if="showCancelToast" class="ov-mask" @click.self="showCancelToast = false">
      <div class="ov-toast">
        <div class="ov-toast-title">取消订单</div>
        <div class="ov-toast-content">同一账号一段时间内取消3次订单,将会限购一段时间</div>
        <div class="ov-toast-actions">
          <div class="ov-toast-btn" @click="showCancelToast = false">我再想想</div>
          <div class="ov-toast-btn ov-toast-btn--sub" @click="changeOrderStatus">取消订单</div>
        </div>
      </div>
    </div>

    <!-- 原站 w-modal：确认购买 -->
    <div v-if="showConfirm" class="ov-mask" @click.self="showConfirm = false">
      <div class="ov-modal">
        <div class="flex flex-js-center flex-ai-end">
          <span class="cur">￥</span>
          <span class="amount">{{ order.total_price ? order.total_price : order.price || 0 }}</span>
        </div>
        <div class="ov-modal-tip">您确认购买吗？</div>
        <div class="ov-modal-actions">
          <div class="ov-modal-btn" @click="showConfirm = false">取消</div>
          <div class="ov-modal-btn ov-modal-btn--sub" @click="pay">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 底部操作条 —— 原站组件 `OrderAction`
 *   script `02e8`
 *     changeOrderStatus → changeOrderStatus({order_type, status:3, order_sn}) → $emit('statusChange')
 *     toBuy            → 原生 App 回调，否则 uni.switchTab('/pages/index/index')
 *     toMyCollection   → 原生 App 回调，否则 $u.route('/pages/myCollection/myCollection')
 *     pay              → new PaySdk({order_id, pay_type, order_number, pay_way, order_type})
 *   render `60eb`（scope becf8788）
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { changeOrderStatus as apiChangeOrderStatus } from '@/api'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, default: () => ({ total_price: undefined }) }
})
const emit = defineEmits(['statusChange'])

const router = useRouter()

const showCancelToast = ref(false)
const showConfirm = ref(false)

async function changeOrderStatus() {
  showCancelToast.value = false
  const res = await apiChangeOrderStatus({
    order_type: props.order.order_type,
    status: 3,
    order_sn: props.order.order_sn
  })
  if (res && res.code === 1) {
    toast('订单已取消')
    emit('statusChange')
  }
}

function toBuy() {
  router.push('/pages/index/index')
}

function toMyCollection() {
  router.push('/pages/myCollection/myCollection')
}

/** 原站 PaySdk → /order/pay/doPay（returnurl /pages/order/defaultDetail?id={id}） */
function pay() {
  showConfirm.value = false
  toast('暂未接入支付渠道')
}
</script>

<style scoped>
/* 原站 scope becf8788：.order-action{position:fixed;bottom:0;left:0;width:100%;padding-bottom:env(safe-area-inset-bottom)} */
.order-action {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: #101115 !important;
  border-top: 0.52px solid #655032;
  z-index: 99;
}
/* 原站 scope becf8788 base：height 120rpx；页面级覆盖 152rpx */
.order-action-container {
  height: 79.04px;
  gap: 12.48px;
  padding-left: 16.64px;
  padding-right: 16.64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex { display: flex; }
.flex-ai-center { align-items: center; }
.flex-js-center { justify-content: center; }
.flex-js-sb { justify-content: space-between; }
.flex-ai-end { align-items: flex-end; }
.flex-1 { flex-grow: 1; }

.z-btn {
  height: 54.08px;
  border-radius: 14.56px;
  font-size: 16.64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
  cursor: pointer;
  user-select: none;
}
.z-btn.pain {
  background: transparent !important;
  color: #f4dcaa !important;
  border: 0.52px solid #655032;
}
.z-btn.disabled {
  background: #211c14 !important;
  color: #f4dcaa !important;
}

/* 原站 w-toast */
.ov-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ov-toast {
  width: 280px;
  background: #22201d;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
}
.ov-toast-title {
  padding: 20px 16px 8px;
  font-size: 16px;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.ov-toast-content {
  padding: 0 20px 20px;
  font-size: 12.48px;
  color: #999;
  line-height: 1.5;
}
.ov-toast-actions,
.ov-modal-actions {
  display: flex;
  border-top: 0.52px solid #33302b;
}
.ov-toast-btn {
  flex: 1;
  height: 46px;
  line-height: 46px;
  font-size: 14.56px;
  color: #999;
}
.ov-toast-btn--sub {
  color: #f4dcaa;
  border-left: 0.52px solid #33302b;
}

/* 原站 w-modal */
.ov-modal {
  width: 290px;
  background: #22201d;
  border-radius: 12px;
  padding: 24px 20px 0;
  text-align: center;
}
.cur {
  font-size: 12.48px;
  color: #fff;
  line-height: 24.96px;
}
.amount {
  font-size: 24.96px;
  color: #fff;
  line-height: 24.96px;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.ov-modal-tip {
  margin-top: 6.24px;
  font-size: 14.56px;
  color: #fff;
  text-align: center;
}
.ov-modal-actions {
  margin: 20px -20px 0;
}
.ov-modal-btn {
  flex: 1;
  height: 46px;
  line-height: 46px;
  font-size: 14.56px;
  color: #999;
}
.ov-modal-btn--sub {
  color: #f4dcaa;
  border-left: 0.52px solid #33302b;
}
</style>