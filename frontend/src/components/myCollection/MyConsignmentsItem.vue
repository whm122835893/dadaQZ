<template>
  <!--
    原站 myConsignmentsItem（render `bf12c` / scope `f963d85e`）
      v-uni-view
        v-uni-view.item.mb-16  @click → $u.route('/pages/order/marketDetail', {id: item.id})
          w-image(src=item.goods_cover_image, width=80, height=80, radius=8)
          v-uni-view.right
            v-uni-view.flex-center-sb.flex-ai-start
              v-uni-view
                v-uni-view.title-text-style.text-overflow ← item.goods_name
                v-uni-view.flex-center-sb.mt-4
                  [goods_type==2] v-uni-view.num.desc-text-style ← "#" + code + "/" + total_num
              v-uni-text.price ← Number(item.price)
            v-uni-view.flex-center-sb
              v-uni-text.desc-text-style ← "共 1 件寄售"
              [item.status==1] v-uni-view.clear_btn @click.stop ← "取消寄售"
        w-toast(content="确认取消此寄售？", contentAlign=center) @action
  -->
  <div>
    <div class="item mb-16" @click="goDetail">
      <img class="cover" :src="item.goods_cover_image" alt="" />
      <div class="right">
        <div class="flex-center-sb flex-ai-start">
          <div class="left">
            <div class="title-text-style text-overflow">{{ item.goods_name }}</div>
            <div class="flex-center-sb mt-4">
              <div v-if="goods_type == 2" class="num desc-text-style">
                #<span>{{ item.user_collection.collection_code }}</span>/{{ item.user_collection.total_num }}
              </div>
            </div>
          </div>
          <span class="price">{{ Number(item.price) }}</span>
        </div>
        <div class="flex-center-sb">
          <span class="desc-text-style">共 1 件寄售</span>
          <div v-if="item.status == 1" class="clear_btn" @click.stop="onCancel">取消寄售</div>
        </div>
      </div>
    </div>

    <!-- 原站 w-toast 二次确认 -->
    <div v-if="cancel_consignment_pop" class="w-toast-mask" @click="closeToast" />
    <div v-if="cancel_consignment_pop" class="w-toast">
      <div class="w-toast-content">确认取消此寄售？</div>
      <div class="w-toast-action">
        <button class="w-toast-btn pain" @click="closeToast">取消</button>
        <button class="w-toast-btn primary" @click="cancelConsignment">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 我的寄售列表项 —— 原站 `myConsignmentsItem` 组件
 *
 * 反编译：chunk `pages-myCollection-myCollection.ea8eb40f.js`
 *   注册 fc2c → script `c224` / render `bf12c` / scope `f963d85e`
 *
 * 原站 script `c224` 关键逻辑（逐字照抄）：
 *   props: { item, goods_type }
 *   data: { cancel_consignment_id:'', cancel_consignment_pop:false }
 *   cancelConsignment(a):
 *     a && ( uni.showLoading(),
 *             changeMarketGoods({ id: this.cancel_consignment_id })
 *               .then(() => this.$emit('refresh')).catch(()=>{}) )
 *   render 中 clear_btn 的 click：stopPropagation → cancel_consignment_id = item.id
 *                                   → cancel_consignment_pop = true
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { changeMarketGoods } from '@/api'

const props = defineProps({
  item: { type: Object, default: () => ({}) },
  goods_type: { type: [Number, String], default: '' }
})
const emit = defineEmits(['refresh'])
const router = useRouter()

const cancel_consignment_id = ref('')
const cancel_consignment_pop = ref(false)

function goDetail() {
  router.push({ path: '/pages/order/marketDetail', query: { id: props.item.id } })
}

function onCancel() {
  cancel_consignment_id.value = props.item.id
  cancel_consignment_pop.value = true
}

function closeToast() {
  cancel_consignment_pop.value = false
}

async function cancelConsignment() {
  try {
    await changeMarketGoods({ id: cancel_consignment_id.value })
    cancel_consignment_pop.value = false
    emit('refresh')
  } catch (e) {
    /* 原站 catch 静默 */
  }
}
</script>

<style scoped>
/* 原站 scope f963d85e */
.item {
  width: 100%;
  height: 109.2px;
  border-radius: 12.48px;
  padding: 12.48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #181713;
  border: 0.52px solid #655032;
  box-sizing: border-box;
}
.mb-16 {
  margin-bottom: 16.64px;
}
.cover {
  width: 83.2px;
  height: 83.2px;
  border-radius: 4.16px;
  flex: none;
  object-fit: cover;
}
.right {
  width: calc(100% - 93.6px);
  height: 100%;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
}
.left {
  min-width: 0;
  flex: 1;
}
.title-text-style {
  font-weight: 700;
  font-size: 12px;
  color: #111216;
  /* 原站黑金风格覆盖：标题文字色随卡片 */
  color: #f1e2c6;
}
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mt-4 {
  margin-top: 4.16px;
}
.num {
  color: #b79c68;
  font-weight: 400;
  font-size: 10px;
}
.desc-text-style {
  font-weight: 400;
  font-size: 10px;
  color: #85868d;
}
.price {
  font-size: 20.8px;
  color: #f4dcaa;
  flex: none;
  margin-left: 8.32px;
}
.price::before {
  content: '￥';
  font-size: 13.52px;
}
.clear_btn {
  width: 74.88px;
  height: 26px;
  text-align: center;
  line-height: 23.92px;
  border-radius: 26px;
  background: linear-gradient(90deg, #fae8bd, #cfaf72);
  color: #2f2414;
  font-size: 10px;
  font-weight: 700;
  flex: none;
  cursor: pointer;
}
.flex-center-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-ai-start {
  align-items: flex-start;
}

/* ---- w-toast 二次确认（复用第 12 页 marketDetail 的实测尺寸） ---- */
.w-toast-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.w-toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 291.2px;
  background: #fff;
  border-radius: 15.6px;
  padding: 14.56px 17.68px 24.96px;
  box-sizing: border-box;
  z-index: 1001;
}
.w-toast-content {
  font-size: 14.56px;
  color: #333;
  text-align: center;
  padding-top: 16.64px;
}
.w-toast-action {
  margin-top: 58.24px;
  display: flex;
  justify-content: space-between;
}
.w-toast-btn {
  width: 114.4px;
  height: 41.6px;
  border-radius: 6.24px;
  border: none;
  font-size: 14.56px;
  cursor: pointer;
  font-family: inherit;
}
.w-toast-btn.pain {
  background: #f0f0f2;
  color: #000;
}
.w-toast-btn.primary {
  background: #000;
  color: #fff;
}
</style>
