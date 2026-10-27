<template>
  <!--
    原站 OrderAction render `60eb`（scope becf8788）—— 浅色主题版
      .order-action.bg-color-pageBg
        .order-action-container.plr-16.flex.flex-ai-center.flex-js-sb
          order_status == 1 → w-button(260rpx, colorful-sp, circle, pain) 取消订单
                            + w-button(400rpx, colorful-sp, circle) 确认支付
          order_status == 2 → w-button(260rpx, colorful-sp, circle, pain) 我的收藏
                            + w-button(400rpx, colorful-sp, circle) 继续购买
          order_status == 7 → w-button(flex-1, colorful-sp, circle, disabled) 转入中
          order_status == 3 → w-button(flex-1, colorful, circle) 继续购买
        w-toast(cancelText 我再想想, submitText 取消订单, title 取消订单,
                content 同一账号一段时间内取消3次订单,将会限购一段时间,
                contentAlign center) @action=changeOrderStatus
        w-modal(title "") @action=pay
          插槽：￥(font-size-12 #333 lh-30rpx) + 金额(font-size-24 #333 lh-48rpx)
                + 您确认购买吗？(font-size-14 #333 center mt-12)
    浅色（scope becf8788）：.order-action{...background-color:#fff!important}（无 border-top，
                           区别于深色版第 11 页 #101115 + 0.52px #655032）
  -->
  <div class="order-action bg-color-pageBg">
    <div class="order-action-container plr-16 flex flex-ai-center flex-js-sb">
      <!-- order_status == 1 -->
      <template v-if="order.order_status === 1">
        <div class="z-btn btn-size-lg btn-type-colorful-sp circle pain" style="width: 135.2px" @click="showCancelToast = true">
          取消订单
        </div>
        <div class="z-btn btn-size-lg btn-type-colorful-sp circle" style="width: 208px" @click="showConfirm = true">
          确认支付
        </div>
      </template>

      <!-- order_status == 2 -->
      <template v-else-if="order.order_status === 2">
        <div class="z-btn btn-size-lg btn-type-colorful-sp circle pain" style="width: 135.2px" @click="toMyCollection">
          我的收藏
        </div>
        <div class="z-btn btn-size-lg btn-type-colorful-sp circle" style="width: 208px" @click="toBuy">
          继续购买
        </div>
      </template>

      <!-- order_status == 7 -->
      <template v-else-if="order.order_status === 7">
        <div class="z-btn btn-size-lg btn-type-colorful-sp circle disabled flex-1">转入中</div>
      </template>

      <!-- order_status == 3 -->
      <template v-else-if="order.order_status === 3">
        <div class="z-btn btn-size-lg btn-type-colorful circle flex-1" @click="toBuy">继续购买</div>
      </template>
    </div>

    <!-- 原站 w-toast：u-popup(show, mode center, round 16) → .w-toast（scope 06d93b02） -->
    <div v-if="showCancelToast" class="wt-mask" @click.self="showCancelToast = false">
      <div class="w-toast">
        <div class="toast-title">取消订单</div>
        <div class="toast-content font-color-dark">同一账号一段时间内取消3次订单,将会限购一段时间</div>
        <div class="toast-action">
          <div class="z-btn btn-size-lsA btn-type-colorful circle pain" @click="showCancelToast = false">我再想想</div>
          <div class="z-btn btn-size-lg btn-type-toast-btn circle" @click="changeOrderStatus">取消订单</div>
        </div>
      </div>
    </div>

    <!-- 原站 w-modal：u-popup(show, mode center, round 16, bgColor transparent) → .w-modal（scope 471d5780） -->
    <div v-if="showConfirm" class="wt-mask" @click.self="showConfirm = false">
      <div class="w-modal">
        <div class="flex flex-js-center flex-ai-end">
          <span class="cur">￥</span>
          <span class="amount">{{ order.total_price ? order.total_price : order.price || 0 }}</span>
        </div>
        <div class="modal-tip">您确认购买吗？</div>
        <div class="toast-action">
          <div class="z-btn btn-size-lg btn-type-toast-btn square pain" @click="showConfirm = false">取消</div>
          <div class="z-btn btn-size-lg btn-type-toast-btn square" @click="pay">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 底部操作条（转赠订单详情 · 浅色版）—— 原站组件 `OrderAction`
 *   script `02e8`
 *     changeOrderStatus(A) → A 为真时 showLoading「订单取消中」→
 *       changeOrderStatus({order_type, status:3, order_sn}) → $emit('statusChange')
 *     toBuy            → 原生 App 回调，否则 uni.switchTab('/pages/index/index')
 *     toMyCollection   → 原生 App 回调，否则 $u.route('/pages/myCollection/myCollection')
 *     pay(A)           → A 为真时 new PaySdk({order_id, pay_type, order_number,
 *                        pay_way, order_type}) → /order/pay/doPay
 *   render `60eb`（scope becf8788）
 *
 * 与深色版 `OrderAction.vue`（第 11 页 defaultDetail 专用）的区别：
 *   - 背景 #fff（!important）且无 border-top；深色版 #101115 + 0.52px #655032
 *   - 按钮用全局 w-button 配色（colorful-sp 深金 #211c14/#f4dcaa、pain 素灰 #f0f0f2/#000、
 *     colorful 金渐变），未被页面级覆盖；深色版被 #order-details 覆盖为金渐变 + 幽灵描边
 *   - 弹窗为全局白底 w-toast / w-modal；深色版为 #22201d 深色弹窗
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

/** 原站 changeOrderStatus(A)：A = w-toast action 结果，仅提交（true）时执行 */
async function changeOrderStatus() {
  showCancelToast.value = false
  try {
    await apiChangeOrderStatus({
      order_type: props.order.order_type,
      status: 3,
      order_sn: props.order.order_sn
    })
    toast('订单已取消')
    emit('statusChange')
  } catch (e) {
    /* 错误已由请求层提示 */
  }
}

/** 原站 toBuy：原生 App 走回调，否则 switchTab 首页 */
function toBuy() {
  router.push('/pages/index/index')
}

/** 原站 toMyCollection：原生 App 走回调，否则跳我的藏品 */
function toMyCollection() {
  router.push('/pages/myCollection/myCollection')
}

/** 原站 pay → PaySdk（/order/pay/doPay）；本项目未接入支付渠道，保持与深色版一致 */
function pay() {
  showConfirm.value = false
  toast('暂未接入支付渠道')
}
</script>

<style scoped>
/* 原站 scope becf8788：.order-action{position:fixed;bottom:0;left:0;width:750rpx;
   padding-bottom:env(safe-area-inset-bottom);background-color:#fff!important} */
.order-action {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background-color: #fff !important;
  z-index: 99;
}
/* 原站 scope becf8788：.order-action-container{height:120rpx} */
.order-action-container {
  height: 62.4px;
  padding-left: 16.64px;
  padding-right: 16.64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bg-color-pageBg { background-color: #fafafa; }
.plr-16 { padding-left: 16.64px; padding-right: 16.64px; }
.flex { display: flex; }
.flex-ai-center { align-items: center; }
.flex-ai-end { align-items: flex-end; }
.flex-js-center { justify-content: center; }
.flex-js-sb { justify-content: space-between; }
.flex-1 { flex-grow: 1; }

/* 原站 w-button scope 50bc2949（全局，浅色页无页面级覆盖） */
.z-btn {
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
/* 原站 .btn-size-lg{height:92rpx;font-size:28rpx;border-radius:16rpx} */
.btn-size-lg { height: 47.84px; font-size: 14.56px; border-radius: 8.32px; }
/* 原站 .btn-size-lg.circle{height:92rpx;border-radius:46rpx} */
.btn-size-lg.circle { height: 47.84px; border-radius: 23.92px; }
/* 原站 btn-size-lsA 无对应 CSS（vendor chunk 未下载），高度由弹窗内规则覆盖 */
.btn-size-lsA { font-size: 14.56px; }
/* 原站 .btn-type-colorful-sp{background:#211c14;color:#f4dcaa} */
.btn-type-colorful-sp { background: #211c14; color: #f4dcaa; background-size: contain; }
/* 原站 .btn-type-colorful-sp.pain{background:#f0f0f2;color:#000} */
.btn-type-colorful-sp.pain { background: #f0f0f2; color: #000; }
/* 原站 .btn-type-colorful-sp.disabled{background:#e3e3e3;color:#666} */
.btn-type-colorful-sp.disabled { background: #e3e3e3; color: #666; background-size: cover; }
/* 原站 .btn-type-colorful{background:linear-gradient(135deg,#fae8bd,#cfaf72);color:#2f2414} */
.btn-type-colorful { background: linear-gradient(135deg, #fae8bd, #cfaf72); color: #2f2414; background-size: contain; }
/* 原站 .btn-type-colorful.pain{background:#f0f0f2;color:#000}（w-toast 取消按钮：
   pain:true 且未传 type → 默认 type="colorful"） */
.btn-type-colorful.pain { background: #f0f0f2; color: #000; }
/* 原站 .btn-type-toast-btn{background:#000;color:#fff} */
.btn-type-toast-btn { background: #000; color: #fff; background-size: contain; }
/* 原站 .btn-type-toast-btn.pain{background:#f0f0f2;color:#000} */
.btn-type-toast-btn.pain { background: #f0f0f2; color: #000; }

/* 原站 w-toast scope 06d93b02（全局白底弹窗） */
.wt-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.w-toast {
  width: 291.2px;
  background: #fff;
  border-radius: 15.6px;
  padding-top: 14.56px;
  padding-left: 17.68px;
  padding-right: 17.68px;
  padding-bottom: 24.96px;
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
.font-color-dark { color: #333; }
.toast-action {
  margin-top: 58.24px;
  display: flex;
  justify-content: space-between;
}
/* 原站 .w-toast > .toast-action > .z-btn{height:80rpx;width:220rpx;border-radius:12rpx} */
.w-toast > .toast-action > .z-btn {
  height: 41.6px;
  width: 114.4px;
  border-radius: 6.24px;
}

/* 原站 w-modal scope 471d5780（全局白底弹窗） */
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
.w-modal > .toast-action {
  margin-top: 58.24px;
  display: flex;
  justify-content: space-between;
}
/* 原站 .w-modal > .toast-action > .z-btn{height:80rpx;width:240rpx;border-radius:12rpx} */
.w-modal > .toast-action > .z-btn {
  height: 41.6px;
  width: 124.8px;
  border-radius: 6.24px;
}
/* 原站弹窗插槽：font-size-12 font-color-textPrimary（页面 scope #333）line-height 30rpx */
.cur {
  font-size: 12.48px;
  color: #333;
  line-height: 15.6px;
}
/* 原站弹窗插槽：font-size-24 font-color-textPrimary line-height 48rpx */
.amount {
  font-size: 24.96px;
  color: #333;
  line-height: 24.96px;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
/* 原站弹窗插槽：font-size-14 font-color-textPrimary text-center mt-12 */
.modal-tip {
  margin-top: 12.48px;
  font-size: 14.56px;
  color: #333;
  text-align: center;
}
</style>
