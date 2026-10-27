<template>
  <!--
    原站 `GoodsBar` render `cc8d`（scope 62f5316a，组件自身无独立 CSS）
      .goods.bg-color-item.br-20.flex.flex-ai-center.pa-10
        w-image(src=order.goods_cover_image, radius 8, height 60, width 60)
        .flex-1.pl-16.ptb-4.flex.flex-dir-col.flex-js-center[height:166rpx]
          uni-text.title-text-style.mb-12 = order.goods_name
        u-icon(name:"arrow-right", color:"#fff")
    说明：marketDetail 页面无 `.fsc-goods .goods` 覆盖，
         故 GoodsBar 走父页面 scope 的原子类 → 白底卡片 + 可见箭头。
  -->
  <div class="goods bg-color-item br-20 flex flex-ai-center pa-10">
    <div class="goods-img">
      <img v-if="order.goods_cover_image" :src="order.goods_cover_image" alt="" />
    </div>
    <div class="goods-info flex-1 pl-16 ptb-4 flex flex-dir-col flex-js-center">
      <span class="title-text-style mb-12 goods-name">{{ order.goods_name }}</span>
    </div>
    <span class="uview-icon goods-arrow">&#xe605;</span>
  </div>
</template>

<script setup>
/**
 * 商品条（市场订单详情 · 浅色版）—— 原站组件 `GoodsBar`
 *   script `9653`：computed.code（collection_code 单值时 split('/')）—— 页面未使用
 *   render `cc8d`（scope 62f5316a）
 */
defineProps({
  order: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.goods {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px;
  padding: 10.4px;
}
.goods-img {
  flex: none;
  width: 62.4px;
  height: 62.4px;
  /* 原站 w-image radius="8" → u-image border-radius: 8rpx */
  border-radius: 4.16px;
  overflow: hidden;
  background-color: #f0f0f2;
}
.goods-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.goods-info {
  flex-grow: 1;
  min-width: 0;
  padding-left: 16.64px;
  padding-top: 4.16px;
  padding-bottom: 4.16px;
  height: 86.32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.goods-name {
  display: block;
  margin-bottom: 12.48px;
  font-weight: 700;
  font-size: 12px;
  color: #111216;
  font-family: 'Alibaba-PuHuiTi-Bold', sans-serif;
}
/* 原站 u-icon name="arrow-right" color="#fff" */
.goods-arrow {
  flex: none;
  font-size: 16px;
  color: #fff;
}
</style>
