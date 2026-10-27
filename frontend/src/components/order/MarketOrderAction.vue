<template>
  <!--
    原站 `MarkeyOrderAction` render `6fb0`（scope f9dfd83c）
      .order-action.bg-color-pageBg
        .order-action-container.plr-16.flex.flex-ai-center.flex-js-sb
          order_status == 1 → w-button(width 100%, type colorful, shape circle) 取消寄售
          order_status == 3 → w-button(width 100%, type colorful, shape circle) 继续寄售
        w-toast(contentAlign center, content 确认取消此寄售？) @action=cancelConsignment
  -->
  <div class="order-action bg-color-pageBg">
    <div class="order-action-container plr-16 flex flex-ai-center flex-js-sb">
      <template v-if="order.order_status === 1">
        <div class="z-btn btn-size-lg btn-type-colorful circle" style="width: 100%" @click="cancelConsignmentPop = true">
          取消寄售
        </div>
      </template>
      <template v-else-if="order.order_status === 3">
        <div class="z-btn btn-size-lg btn-type-colorful circle" style="width: 100%" @click="toMycollection">
          继续寄售
        </div>
      </template>
    </div>

    <!-- 原站 w-toast：u-popup(show, mode center, round 16) → .w-toast -->
    <div v-if="cancelConsignmentPop" class="wt-mask" @click.self="cancelConsignmentPop = false">
      <div class="w-toast">
        <div class="toast-title">提示</div>
        <div class="toast-content font-color-dark">确认取消此寄售？</div>
        <div class="toast-action">
          <div class="z-btn btn-size-lsA btn-type-colorful circle pain" @click="cancelConsignmentPop = false">
            取消
          </div>
          <div class="z-btn btn-size-lg btn-type-toast-btn circle" @click="cancelConsignment">
            确认
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 底部操作条（市场订单详情 · 浅色版）—— 原站组件 `MarkeyOrderAction`
 *   script `7397`
 *     cancelConsignment → changeMarketGoods({id:order.id}) → $emit('refresh')
 *     toMycollection     → 原生 App 回调，否则 uni.redirectTo('/pages/myCollection/myCollection')
 *     viewProduct       → 按 goods_type 跳 collectionDetails / blindBoxDetails
 *   render `6fb0`（scope f9dfd83c）
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { changeMarketGoods } from '@/api'
import { toast } from '@/utils/toast'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['refresh'])

const router = useRouter()

const cancelConsignmentPop = ref(false)

/** 原站 cancelConsignment → changeMarketGoods({id}) */
async function cancelConsignment() {
  cancelConsignmentPop.value = false
  try {
    await changeMarketGoods({ id: props.order.id })
    toast('取消寄售成功')
    emit('refresh')
  } catch (e) {
    /* 错误已由请求层提示 */
  }
}

/** 原站 toMycollection：原生 App 走回调，否则 redirectTo 我的藏品 */
function toMycollection() {
  router.push('/pages/myCollection/myCollection')
}
</script>

<style scoped>
/* 原站 scope f9dfd83c */
.order-action {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 99;
}
.bg-color-pageBg { background-color: #fafafa; }
.order-action-container {
  height: 62.4px;
  padding-left: 16.64px;
  padding-right: 16.64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.plr-16 { padding-left: 16.64px; padding-right: 16.64px; }
.flex { display: flex; }
.flex-ai-center { align-items: center; }
.flex-js-sb { justify-content: space-between; }

/* 原站 w-button scope 50bc2949 */
.z-btn {
  white-space: nowrap;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.btn-size-lg { height: 47.84px; font-size: 14.56px; border-radius: 8.32px; }
.btn-size-lg.circle { height: 47.84px; border-radius: 23.92px; }
/* 原站 w-toast 的取消按钮：size="lsA"（原站类名 btn-size-lsA 无对应 CSS，
   高度由 .w-toast > .toast-action > .z-btn 覆盖为 41.6px） */
.btn-size-lsA { font-size: 14.56px; }
.btn-type-colorful {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
.btn-type-colorful.pain { background: #f0f0f2; color: #000; }
.btn-type-toast-btn { background: #000; color: #fff; background-size: contain; }

/* 原站 w-toast scope 06d93b02 */
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
.w-toast > .toast-action > .z-btn {
  height: 41.6px;
  width: 114.4px;
  border-radius: 6.24px;
}
</style>
