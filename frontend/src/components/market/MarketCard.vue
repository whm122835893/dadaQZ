<template>
  <!--
    原站 MarketCard（script 5504 / render 1fe9 / CSS d497 scope 6fe165cf）
    仅 market_type=2（盲盒市场）分支渲染：
      d("v-uni-view",{staticClass:"flex flex-js-sb flex-w"}, v-for → MarketCard(staticClass:"mb-4 mt-8", market:a))
      ※ .market-card{width:100%} + flex-wrap ⇒ 一列满宽（非两列）
    render 1fe9 结构：
      market-card.flex.flex-ai-center.flex-js-sb.goods-info  style{padding:"18rpx 30rpx"}
        .img.goods-info-name.flex          → width:60%（.goods-info .goods-info-name 源序覆盖 .market-card .img 的 56.16px）
          v-uni-image(108rpx×108rpx, radius 20rpx) src=$ossUrl+market.product.listimg
          [market.product] .pt-4.pb-8.plr-10   → 4.16px 10.40px 8.32px
            .font-w-bold.text-overflow(max-width 264rpx→137.28px) {product.name}   （字号 13px 继承自 .goods-info-name）
            .flex.mt-10                       → margin-top 10.40px
              v-uni-text.total-num "发行{total_num}份"   （fs10 fw400 #85868d）
        [is_out==0] .goods-info-price > ￥ + {goods_type!=1 ? min_price : price}
        [else]     .goods-info-price.main-button(style color:#fff) "已退市"
                     → width:20%/fs11 取自 .goods-info .goods-info-price（源序优先于 .main-button 的 fs10）
        .goods-info-flux {deal_num || "—"}
    父级 staticClass mb-4 mt-8 → margin-bottom:4.16px / margin-top:8.32px
  -->
  <div v-if="market.id" class="market-card" @click="toDetails">
    <div class="market-card-img">
      <img class="market-card-img-el" :src="coverSrc" alt="" />
      <div v-if="market.product" class="market-card-text">
        <div class="market-card-name">{{ market.product.name || '' }}</div>
        <div class="market-card-total-row">
          <span class="market-card-total">发行{{ market.total_num }}份</span>
        </div>
      </div>
    </div>
    <div v-if="market.is_out == 0" class="goods-info-price">
      <span>￥</span><span>{{ market.goods_type != 1 ? market.min_price : market.price }}</span>
    </div>
    <div v-else class="goods-info-price market-card-out">已退市</div>
    <div class="goods-info-flux">{{ market.deal_num || '—' }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OSS_URL } from '@/config'

const props = defineProps({
  market: {
    type: Object,
    default: () => ({
      id: '',
      listimg: '',
      total_num: 0,
      reprice_limit: '--.--',
      flux: 0,
      min_price: 0,
      is_out: 0,
      new_time: 0,
      goods_type: '2',
      product: {}
    })
  }
})

const router = useRouter()
const userStore = useUserStore()

/** 原站 $ossUrl + market.product.listimg；本地资源（/ 开头）直接用 */
const coverSrc = computed(() => {
  const src = props.market.product?.listimg || ''
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/')) return src
  return OSS_URL + src
})

/** 原站 script 5504 toDetails：未登录 emit showLogin；goods_type!=1 → marketGoodsList，否则 → detail */
function toDetails() {
  if (!userStore.isLogin) {
    userStore.loginDemo()
    return
  }
  if (props.market.goods_type != 1) {
    router.push(`/pages/market/marketGoodsList?id=${props.market.product.id}&goodsType=${props.market.goods_type}`)
  } else {
    router.push(`/pages/market/detail?id=${props.market.id}`)
  }
}
</script>

<style scoped>
/* rpx 换算：390 / 750 = 0.52 */
/* CSS d497（scope 6fe165cf）解码值：
   .market-card{width:100%;position:relative;background-size:100% auto;background-repeat:no-repeat;
                background-position:bottom;background-color:#fff;padding:9.36px;border-bottom:1px solid #e7e7ea}
   .goods-info{font-weight:500;font-size:11.44px;color:#999;width:100%}
   .goods-info .goods-info-name{width:60%;font-weight:700;font-size:13px;color:#111216}
   .goods-info .goods-info-flux, .goods-info .goods-info-price{width:20%;font-weight:700;font-size:11px;color:#111216;text-align:right}
   .goods-info .total-num{font-weight:400;font-size:10px;color:#85868d}
   .main-button{background:#101114;border-radius:26px;display:flex;align-items:center;justify-content:center;
                font-weight:700;font-size:10px;color:#fff;padding:8.32px}   ← fs10 被 .goods-info .goods-info-price 的 fs11 源序覆盖
   .pt-4=4.16px  .pb-8=8.32px  .plr-10=10.40px  .mt-10=10.40px  .mb-4=4.16px  .mt-8=8.32px
   render staticStyle: padding:"18rpx 30rpx" → 9.36px 15.6px（覆盖 class padding） */
.market-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 9.36px 15.6px;
  background-color: #fff;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: bottom;
  border-bottom: 1px solid #e7e7ea;
  font-weight: 500;
  font-size: 11.44px;
  color: #999;
  cursor: pointer;
}
/* 原站 .img.goods-info-name.flex：width:60%（源序覆盖 .market-card .img 的 56.16px）+ height:56.16px + flex */
.market-card-img {
  position: relative;
  display: flex;
  align-items: center;
  width: 60%;
  height: 56.16px;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 13px;
  color: #111216;
}
/* 原站 v-uni-image staticStyle: width/height 108rpx → 56.16px，border-radius 20rpx → 10.4px */
.market-card-img-el {
  width: 56.16px;
  height: 56.16px;
  border-radius: 10.4px;
  object-fit: fill;
  flex-shrink: 0;
}
/* 原站 .pt-4.pb-8.plr-10 → 4.16px 10.40px 8.32px */
.market-card-text {
  padding: 4.16px 10.4px 8.32px;
  min-width: 0;
}
/* 原站 .font-w-bold.text-overflow + staticStyle max-width:264rpx → 137.28px；字号 13px/颜色 #111216 继承自 .goods-info-name */
.market-card-name {
  max-width: 137.28px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 原站 .flex.mt-10 → display:flex + margin-top 10.40px */
.market-card-total-row {
  display: flex;
  margin-top: 10.4px;
}
/* 原站 .total-num：fs10 fw400 #85868d */
.market-card-total {
  font-weight: 400;
  font-size: 10px;
  color: #85868d;
  white-space: nowrap;
}
.goods-info-price,
.goods-info-flux {
  width: 20%;
  font-weight: 700;
  font-size: 11px;
  color: #111216;
  text-align: right;
  flex-shrink: 0;
}
/* 原站 .goods-info-price.main-button：width:20%/fs11 源序优先；bg #101114 / radius 26px / pad 8.32px；color:#fff 为 inline */
.market-card-out {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #101114;
  border-radius: 26px;
  font-size: 11px;
  color: #fff;
  padding: 8.32px;
}
</style>
