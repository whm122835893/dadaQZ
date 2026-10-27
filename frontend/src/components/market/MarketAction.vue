<template>
  <!--
    原站 w-market-action（pages/market/detail 底部购买条，模块 3fd1）
    render：
      .market-action
        .market-action-container.plr-16.ptb-8.flex.flex-ai-center.flex-js-sb
          v-if 1==info.buy_status → .font-color-dark（￥ + info.price）
          v-if 1==info.buy_status → .mkt-buy-btn 立即购买（@click submitOrder）
          v-elif 2==info.status  → .mkt-buy-btn.disabled 已出售
          v-elif 3==info.status  → .mkt-buy-btn.disabled 已下架
          v-elif 4==info.status && 1!=info.buy_status → .mkt-buy-btn.disabled 锁单中
    方法 submitOrder（原站逐字）：
      uni.setStorage({ key:"confirmOrder",
        data:{ product: info.product, income_type: info.income_type,
               market_goods_id: info.id, count:1, order_type:2, maxCount:1 },
        success: () => uni.navigateTo({ url:"/pages/order/orderSubmit" }) })
  -->
  <div class="market-action">
    <div class="market-action-container plr-16 ptb-8 flex flex-ai-center flex-js-sb">
      <div v-if="info.buy_status == 1" class="font-color-dark">
        <span class="font-size-12">￥</span>
        <span class="font-size-22 Alibaba-PuHuiTi-Bold">{{ info.price }}</span>
      </div>
      <div v-if="info.buy_status == 1" class="mkt-buy-btn" @click="submitOrder">立即购买</div>
      <div v-else-if="info.status == 2" class="mkt-buy-btn disabled">已出售</div>
      <div v-else-if="info.status == 3" class="mkt-buy-btn disabled">已下架</div>
      <div v-else-if="info.status == 4 && info.buy_status != 1" class="mkt-buy-btn disabled">锁单中</div>
    </div>
  </div>
</template>

<script setup>
/**
 * 市场购买条（原站 w-market-action）
 *   props.info = pages/market/detail 的 data.info（MarketDetail/ids/{id} 响应）
 *   点击「立即购买」→ 写 confirmOrder → 跳订单确认页（与藏品页/盲盒页同一键，orderSubmit 读取）
 */
import { useRouter } from 'vue-router'

const props = defineProps({ info: { type: Object, default: () => ({}) } })
const router = useRouter()

function submitOrder() {
  sessionStorage.setItem(
    'confirmOrder',
    JSON.stringify({
      product: props.info.product,
      income_type: props.info.income_type,
      market_goods_id: props.info.id,
      count: 1,
      order_type: 2,
      maxCount: 1
    })
  )
  router.push('/pages/order/orderSubmit')
}
</script>

<style scoped>
.market-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 10px 15px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  background-color: #101115;
  border-top: 1px solid #332b1e;
}
.market-action-container {
  height: 62px;
}
.market-action .font-color-dark {
  color: #fff;
}
.market-action .mkt-buy-btn {
  width: 248px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2413;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, sans-serif;
  line-height: normal;
}
.market-action .mkt-buy-btn.disabled {
  opacity: 0.55;
}

/* 原站全局工具类（仅本组件用到的最小集；line-height:normal 避免继承 body 1.5 撑高）
   注：原站 class="font-size-22 Alibaba-PuHuiTi-Bold" 无对应字体规则（全局只有 @font-face），
   价格「￥92」实际继承 body 默认的 Times New Roman 渲染（实测 ff="Times New Roman"，
   22px 下「92」宽 22px、￥ 高 14px），此处显式复刻该行为 */
.flex { display: flex; }
.flex-ai-center { align-items: center; }
.flex-js-sb { justify-content: space-between; }
.plr-16 { padding-left: 16px; padding-right: 16px; }
.ptb-8 { padding-top: 8px; padding-bottom: 8px; }
.font-size-12 { font-size: 12px; line-height: normal; font-family: 'Times New Roman', serif; }
.font-size-22 { font-size: 22px; line-height: normal; font-family: 'Times New Roman', serif; }
.font-color-dark { line-height: normal; }
</style>
