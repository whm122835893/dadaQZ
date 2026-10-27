<template>
  <!--
    原站 GoodsBar render `cc8d`（scope 62f5316a）—— beg/info（浅色页）版
      .goods.bg-color-item.br-20.flex.flex-ai-center.pa-10
        w-image(src=order.goods_cover_image, radius 8, 60×60)
        .flex-1.pl-16.ptb-4.flex.flex-dir-col.flex-js-center[height:166rpx]
          uni-text.title-text-style.mb-12 = order.goods_name
        u-icon(name="arrow-right", color #fff)
    浅色（scope 62f5316a）：.bg-color-item{background:#fff;border:1px solid #e7e7ea;border-radius:40rpx}
                        .title-text-style{font-weight:700;font-size:12px;color:#111216}
    w-image：width = 2×60 = 120rpx = 62.4px；height 62.4px；
             radius 走 uView addUnit 默认单位 px → 8px（非 8.32px）
    注：beg/info 页面 getInfo 里做了 order.goods_cover_image = order.goods_image
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
 * 商品条（beg/info 浅色版）—— 原站组件 `GoodsBar`
 *   script `9653`：computed.code（collection_code 单值时 split('/')）—— 页面未使用，故不实现
 *   render `cc8d`（scope 62f5316a）
 *
 * 与 `RegiftGoodsBar.vue`（regiftDetail 已验收页）的差异（均按原站原子库校正）：
 *   - .goods padding：原站 pa-10 = 20rpx = 10.4px（非 20.8px）
 *   - 图片 radius：原站 w-image radius=8 → addUnit 默认 px → 8px（非 4.16px）
 * 为不影响已验收页面，此处独立成件。
 */
defineProps({
  order: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
/* 原站 .goods.bg-color-item.br-20.flex.flex-ai-center.pa-10 */
.goods {
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px; /* br-20 = 40rpx */
  padding: 10.4px; /* pa-10 = 20rpx */
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
/* w-image：120rpx × 120rpx，radius 8px（addUnit 默认单位 px） */
.goods-img {
  flex: none;
  width: 62.4px;
  height: 62.4px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}
.goods-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* 原站 .flex-1.pl-16.ptb-4.flex.flex-dir-col.flex-js-center，height 166rpx */
.goods-info {
  flex: 1;
  min-width: 0;
  height: 86.32px; /* 166rpx */
  padding-left: 16.64px; /* pl-16 = 32rpx */
  padding-top: 4.16px; /* ptb-4 = 8rpx */
  padding-bottom: 4.16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
/* 原站 .title-text-style.mb-12 */
.goods-name {
  display: block;
  margin-bottom: 12.48px; /* mb-12 = 24rpx */
  font-size: 12.48px; /* 12px 原站即 24rpx */
  font-weight: 700;
  color: #111216;
  font-family: 'Alibaba-PuHuiTi-Bold', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 原站 u-icon name="arrow-right" color #fff（白底上不可见，按原站保留节点） */
.goods-arrow {
  flex: none;
  font-size: 16px;
  color: #fff;
}
</style>
