<template>
  <!--
    原站 collectionItem（render `cc0f` / scope `c1e22e5c`）
      v-uni-view.content-page.mb-16  @click → $emit('click')
        v-uni-view.img_con[style position:relative]
          w-image(src=item.collection.listimg, width=165, height=165, radius=20)
          [可合成] badge        ← can_compound && types!=4
          [赠送中] badge        ← user_collection.status==10 && types==4
          [已赠送] badge        ← user_collection && status!=10 && types==4
        v-uni-view.info.mt-10
          v-uni-view.t1.font-color-black.font-w-bold  ← 逐字 splitName(collection.name)
          [types!=3/4/6] v-uni-view.flex-center-sb[style margin 16rpx]
              v-uni-text.desc-text-style  ← getNum() = "持有:" + num
          [types==3/4/6] v-uni-view.flex-center-sb
              v-uni-text.font-size-10.font-color-minor  ← "#" + user_collection.collection_code
              v-uni-view.price ← item.price || item.total_price
  -->
  <div v-if="item.collection" class="content-page mb-16" @click="$emit('click')">
    <div class="img_con">
      <img class="img" :src="item.collection.listimg" alt="" />

      <!-- 原站 badge：可合成 -->
      <div v-if="item.can_compound && types != 4" class="badge title-text-style">可合成</div>
      <!-- 原站 badge：赠送中 / 已赠送 -->
      <div v-else-if="item.user_collection && types == 4" class="badge title-text-style">
        {{ item.user_collection.status === 10 ? '赠送中' : '已赠送' }}
      </div>
    </div>

    <div class="info mt-10">
      <!-- 原站 splitName：逐字渲染，便于关键词高亮 -->
      <div class="t1 font-color-black font-w-bold">
        <span v-for="(ch, i) in splitName(item.collection.name)" :key="i">{{ ch }}</span>
      </div>

      <!-- types = 2 藏品 / 1 盲盒 → 持有数量 -->
      <div v-if="types != 3 && types != 4 && types != 6" class="flex-center-sb num-row">
        <span class="desc-text-style">{{ getNum() }} </span>
      </div>

      <!-- types = 3 已售 / 4 / 6 → 藏品编号 + 价格 -->
      <div v-else class="flex-center-sb">
        <div>
          <span v-if="item.user_collection && item.user_collection.collection_code"
                class="font-size-10 font-color-minor code-text">
            #{{ item.user_collection.collection_code }}
          </span>
        </div>
        <div class="price">{{ item.price || item.total_price }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 我的藏品卡片 —— 原站 `collectionItem` 组件
 *
 * 反编译：chunk `pages-myCollection-myCollection.ea8eb40f.js`
 *   注册 0a4a → script `39c4` / render `cc0f` / scope `c1e22e5c`
 *
 * 原站 script `39c4` 关键逻辑：
 *   props: { types, item }
 *   splitName(a) → a.split('')          逐字拆分
 *   getNum()     → "持有:" + item.num
 *   setCollect() → isCollect(...) 点赞（本卡片 render 未挂载该事件，保留备用）
 */
const props = defineProps({
  types: { type: [String, Number], default: '' },
  item: { type: Object, default: () => ({ collection: {} }) }
})
defineEmits(['click'])

function splitName(name) {
  return String(name || '').split('')
}

function getNum() {
  return '持有:' + (props.item.num ?? 0)
}
</script>

<style scoped>
/* 原站 scope c1e22e5c */
.content-page {
  background-color: #171612;
  overflow: hidden;
  border-radius: 15.6px;
  border: 1px solid #27211a;
  width: 171.6px;
  margin-bottom: 16.64px;
  cursor: pointer;
}
.mb-16 {
  margin-bottom: 16.64px;
}
.img_con {
  width: 171.6px;
  height: 171.6px;
  border-radius: 10.4px;
  position: relative;
}
.img {
  width: 171.6px;
  height: 171.6px;
  border-radius: 10.4px;
  display: block;
  object-fit: cover;
}
/* 原站 badge：绝对定位左上，白半透明，圆角 10px 0 10px 0 */
.badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: hsla(0, 0%, 100%, 0.6);
  padding: 4.16px 8.32px;
  border-radius: 10px 0 10px 0;
  font-size: 8.32px;
  color: #333;
  font-weight: 700;
}
.title-text-style {
  font-weight: 700;
  font-size: 12px;
  color: #111216;
}
.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8.32px 8.32px;
  box-sizing: border-box;
}
.mt-10 {
  margin-top: 10.4px;
}
.t1 {
  font-weight: 700;
  font-size: 15.6px;
  color: #f1e2c6;
  text-align: center;
  word-break: break-all;
}
.font-color-black {
  color: #f1e2c6;
}
.font-w-bold {
  font-weight: 700;
}
.num-row {
  margin: 8.32px;
  width: 100%;
}
.desc-text-style {
  font-weight: 400;
  font-size: 10px;
  color: #85868d;
}
.flex-center-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.code-text {
  font-weight: 500;
  font-size: 12.48px;
  color: #000000;
}
.price {
  font-size: 16.64px;
  font-weight: 500;
  color: #f4dcaa;
}
.price::before {
  content: '￥';
  font-size: 11.44px;
  font-weight: 500;
}
</style>
