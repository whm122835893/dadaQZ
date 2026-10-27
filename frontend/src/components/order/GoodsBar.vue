<template>
  <!-- 原站 GoodsBar render `cc8d`（scope 62f5316a）：
       .goods.bg-color-item.br-20.flex.flex-ai-center.pa-10
         w-image(src=order.goods_cover_image, radius 8, 60x60)
         .flex-1.pl-16.ptb-4.flex.flex-dir-col.flex-js-center[height:166rpx]
           uni-text.title-text-style.mb-12 = order.goods_name
         u-icon(name="arrow-right", color #fff)
  -->
  <div class="goods">
    <div class="goods-img">
      <img v-if="order.goods_cover_image" :src="order.goods_cover_image" alt="" />
    </div>
    <div class="goods-info">
      <span class="goods-name">{{ order.goods_name }}</span>
    </div>
    <span class="uview-icon goods-arrow">&#xe605;</span>
  </div>
</template>

<script setup>
/**
 * 商品条 —— 原站组件 `GoodsBar`
 *   script `9653`：computed.code（collection_code 单值时 split('/')）—— 页面未使用，故不实现
 *   render `cc8d`（scope 62f5316a）
 */
defineProps({
  order: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.goods {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  align-items: center;
}
.goods-img {
  flex: none;
  width: 58.24px;
  height: 58.24px;
  border-radius: 4.16px;
  overflow: hidden;
  background-color: #262219;
}
.goods-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.goods-info {
  flex: 1;
  min-width: 0;
  padding-left: 8.32px;
  padding-top: 2.08px;
  padding-bottom: 2.08px;
  height: 86.32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.goods-name {
  display: block;
  margin-bottom: 6.24px;
  font-size: 15.6px;
  font-weight: 600;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 原站 .fsc-goods .goods .u-icon { display:none } —— 保留节点但按原站隐藏 */
.goods-arrow {
  display: none;
  font-size: 16px;
  color: #fff;
}
</style>