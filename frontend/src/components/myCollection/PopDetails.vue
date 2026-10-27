<template>
  <!--
    原站 popDetails（render `cc38` / scope `8d59f590`）
      u-popup(mode=bottom, round=10) @close → $emit('change', false)
        v-uni-view.pop_con
          v-uni-view.flex.flex-js-sb
            v-uni-view.flex.flex-center
              v-uni-text.font-size-16.font-color-black.font-w-bold.mr-2 ← collection.name
              v-uni-text.font-size-14.font-color-black ← "（共 N 份）"
            v-uni-view.flex.flex-ai-center
              [types==1] v-uni-view.main-button ← "一键开启"
              w-icon.close(name="close2", size=24)
          v-uni-view.list_con
            uni-scroll-view(max-height 500rpx, scroll-y)
              v-uni-view.flex-center-sb.flex-w
                [types==2] v-uni-view.card.pb-8 @click → goCP
                    [showCheck] check 图标
                    v-uni-view.font-size-14.font-color-dark.font-w-bold ← "#code/total"
                    [from_price] " 价格： " + price
                    [否则] title-text-style ← "持仓天数：" + day
                    v-uni-view.desc-text-style ← "来源: " + source_type
                    v-uni-view.status ← getStatus(text/style)
                [types==1] v-uni-view.card @click → goBlindBox
                    v-uni-view.price.font-size-16 ← from_price
                    v-uni-view.status
                    v-uni-view.font-size-12.font-color-999 ← "来源:" + source_type
            w-loading(type=loadingType, emptyType="search", emptyTop="100")
          [showCheck] v-uni-view.flex.flex-js-sb.flex-ai-center.pt-12
              w-button(width 260rpx, circle, pain) ← "取消寄售"
              w-button(width 400rpx, circle) ← "立即寄售"
          [collection.batch_up && types==2] v-uni-view.mtb-16
              [showCheck==false] w-button(size=lg, circle) ← "批量寄售"
  -->
  <div v-if="show" class="pop-mask" @click="$emit('change', false)" />
  <div v-if="show" class="pop_con">
    <div class="flex flex-js-sb">
      <div class="flex flex-center">
        <span class="font-size-16 font-color-black font-w-bold mr-2">{{ collection.name }}</span>
        <span class="font-size-14 font-color-black">（共{{ totalNum }}份）</span>
      </div>
      <div class="flex flex-ai-center">
        <div v-if="types == 1" class="main-button" @click="openBox">一键开启</div>
        <img class="close" src="/assets/img/myCollection/close2.png" alt="" @click="$emit('change', false)" />
      </div>
    </div>

    <div class="list_con">
      <div class="scroll-list">
        <div class="flex-center-sb flex-w">
          <!-- types == 2：普通藏品（可批量寄售） -->
          <template v-for="(item, i) in list" :key="'c' + i">
            <div v-if="types == 2" class="card pb-8" @click="goCP(item)">
              <div v-if="showCheck" class="check">
                <img
                  class="check-icon"
                  :src="checked.has(item.id) ? CHECKED : UNCHECKED"
                  alt=""
                />
              </div>
              <div class="font-size-14 font-color-dark font-w-bold">
                #{{ item.collection_code }}{{ item.collection.total_num ? '/' + item.collection.total_num : '' }}
              </div>
              <div v-if="item.from_price" class="flex flex-center font-size-12 font-color-dark font-w-500">
                价格：
                <span class="price mr-6">{{ item.from_price }}</span>
              </div>
              <div v-else class="title-text-style mt-4">
                持仓天数：<span class="font-color-dark font-w-bold">{{ item.day }}</span>
              </div>
              <div class="desc-text-style font-w-400 mt-2">来源: {{ sourceTypeText(item.source_type) }}</div>
              <div class="status" :style="getStatus(item).style">{{ getStatus(item).text }}</div>
            </div>

            <!-- types == 1：盲盒（点开盒） -->
            <div v-else-if="types == 1" class="card" @click="goBlindBox(item)">
              <div class="price font-size-16 font-color-dark font-w-bold">{{ item.from_price || '--' }} </div>
              <div class="status" :style="getStatus(item).style">{{ getStatus(item).text }}</div>
              <div class="font-size-12 font-color-999 font-w-400 mt-2">来源:{{ sourceTypeText(item.source_type) }}</div>
            </div>
          </template>
        </div>
      </div>

      <div v-if="!list.length" class="pop-empty">
        <img class="pop-empty-img" src="/assets/img/myCollection/empty.png" alt="" />
      </div>
    </div>

    <!-- 原站批量寄售操作条：仅 showCheck 时显示 -->
    <div v-if="showCheck" class="flex flex-js-sb flex-ai-center pt-12">
      <!-- 原站 w-button：width 260rpx=135.2px, shape=circle, pain=true
           → className = "z-btn btn-size-lg btn-type-colorful circle pain" -->
      <div class="z-btn btn-size-lg btn-type-colorful circle pain" style="width: 135.2px" @click="cleatBatch">
        取消寄售
      </div>
      <!-- 原站 w-button：width 400rpx=208px, shape=circle（默认 type=colorful, size=lg） -->
      <div class="z-btn btn-size-lg btn-type-colorful circle" style="width: 208px" @click="toResale">
        立即寄售
      </div>
    </div>

    <!-- 原站：collection.batch_up && types==2 → 「批量寄售」入口 -->
    <div v-if="collection.batch_up && types == 2" class="mtb-16">
      <!-- 原站 w-button：size=lg, shape=circle（无 width → 撑满） -->
      <div v-if="!showCheck" class="z-btn btn-size-lg btn-type-colorful circle full" @click="showCheck = true">
        批量寄售
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 藏品详情弹窗 —— 原站 `popDetails` 组件
 *
 * 反编译：chunk `pages-myCollection-myCollection.ea8eb40f.js`
 *   注册 ba48 → script `121a` / render `cc38` / scope `8d59f590`
 *
 * 原站 script `121a` 关键逻辑（逐字照抄）：
 *   props: { id, types, showPop }   model: { prop:'showPop', event:'change' }
 *   watch showPop → 重置 data；showPop 为真 → getDetails()
 *   data.source_type 映射：
 *     1购买 2二级市场 3开盲盒 4赠送 5空投 6抽奖 7积分兑换 8合成
 *   getDetails() → user_collection_Detail({collection_id:id, types, page})
 *                  → collection / list.data / total / last_page
 *   getStatus(a) 状态判定（顺序固定）：
 *     !a.is_link && types==2 → { text:'未寄售', style:{background-color:'#000'} }
 *     !!a.is_lock            → { text:'未寄售', style:{background-color:'#000'} }
 *     a.status==2            → { text:'寄售中', style:{background:'#D94755'} }
 *     !!a.can_compose        → { text:'未寄售', style:{background-color:'#000'} }
 *     a.status==1            → { text:'未寄售', style:{background:'linear-gradient(135deg,#FAE8BD,#CFAF72)'} }
 *     a.status==10           → { text:'赠送中', style:{'background-color':'#D94755'} }
 *   cleatBatch() / minus() / add() / changeCount() / goChecked() 批量数量控制
 *   toResale()  → navigateTo('/pages/consignments/consignments?pageType=types&id=ids')
 *   goCP(a)     → $emit('change',false) → 500ms 后 route('/pages/myCollection/collectionDetails',{id:a.id})
 *   goBlindBox(a)→ setStorageSync('blindBoxInfo', ...) → 500ms 后 route('/pages/blindBox/index' 或 blindBoxDetails)
 */
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getUserCollectionDetail } from '@/api'

const props = defineProps({
  id: { type: [String, Number], default: '' },
  types: { type: [String, Number], default: '' },
  showPop: { type: Boolean, default: false }
})
const emit = defineEmits(['change'])
const router = useRouter()

const CHECKED = '/assets/img/myCollection/checked-icon.png'
const UNCHECKED = '/assets/img/myCollection/uncheck-icon.png'

/** 原站 source_type 文案映射 */
const source_type = {
  1: '购买',
  2: '二级市场',
  3: '开盲盒',
  4: '赠送',
  5: '空投',
  6: '抽奖',
  7: '积分兑换',
  8: '合成'
}

const showCheck = ref(false)
const list = ref([])
const collection = ref({ batch_up: 0 })
const totalNum = ref(0)
const checked = ref(new Set())
const batch = ref({ count: 0, maxCount: 200 })

const show = computed(() => props.showPop)

watch(
  () => props.showPop,
  (v) => {
    showCheck.value = false
    batch.value = { count: 0, maxCount: 200 }
    checked.value = new Set()
    list.value = []
    if (v) getDetails()
  }
)

async function getDetails() {
  try {
    const res = await getUserCollectionDetail({
      collection_id: props.id,
      types: props.types,
      page: 1
    })
    const d = res.data || {}
    collection.value = d.collection || { batch_up: 0 }
    const l = d.list || {}
    list.value = l.data || []
    totalNum.value = l.total || 0
    batch.value.maxCount = Math.min(200, list.value.length)
  } catch (e) {
    /* 原站 catch 静默 */
  }
}

function sourceTypeText(t) {
  return source_type[t] || ''
}

/** 原站 getStatus：判定顺序不可调换 */
function getStatus(a) {
  if (!a.is_link && Number(props.types) === 2) {
    return { text: '未寄售', style: { 'background-color': '#000' } }
  }
  if (a.is_lock) {
    return { text: '未寄售', style: { 'background-color': '#000' } }
  }
  if (a.status === 2) {
    return { text: '寄售中', style: { background: '#D94755' } }
  }
  if (a.can_compose) {
    return { text: '未寄售', style: { 'background-color': '#000' } }
  }
  if (a.status === 1) {
    return {
      text: '未寄售',
      style: { background: 'linear-gradient(135deg, #FAE8BD 0%, #CFAF72 100%)' }
    }
  }
  if (a.status === 10) {
    return { text: '赠送中', style: { 'background-color': '#D94755' } }
  }
  return { text: '', style: {} }
}

/** 原站 cleatBatch */
function cleatBatch() {
  showCheck.value = false
  batch.value.count = 0
  goChecked()
}

/** 原站 goChecked：取前 count 个已勾选 */
function goChecked() {
  const n = batch.value.count
  const arr = list.value.filter((a) => a.checked).slice(0, n)
  checked.value = new Set(arr.map((a) => a.id))
}

/** 原站 toResale → 跳寄售发起页 */
function toResale() {
  const ids = Array.from(checked.value)
  if (!ids.length) return
  router.push({
    path: '/pages/consignments/consignments',
    query: { pageType: String(props.types), id: ids.join(',') }
  })
}

/** 原站 goCP → 藏品详情页 */
function goCP(a) {
  if (showCheck.value) {
    if (!a.checked) return
    if (checked.value.has(a.id)) checked.value.delete(a.id)
    else checked.value.add(a.id)
    batch.value.count = checked.value.size
    return
  }
  emit('change', false)
  setTimeout(() => {
    router.push({ path: '/pages/myCollection/collectionDetails', query: { id: a.id } })
  }, 500)
}

/** 原站 goBlindBox → 盲盒开盒 */
function goBlindBox(a) {
  emit('change', false)
  setTimeout(() => {
    router.push(
      a.status === 1
        ? { path: '/pages/blindBox/index' }
        : { path: '/pages/blindBox/blindBoxDetails', query: { id: a.id } }
    )
  }, 500)
}

/** 原站 openBox → 一键开启 */
function openBox() {
  router.push({ path: '/pages/product/box' })
}
</script>

<style scoped>
/* 原站 scope 8d59f590 */
.pop-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.pop_con {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 17.68px;
  border-radius: 15.6px 15.6px 0 0;
  background: #fff;
  z-index: 1001;
  box-sizing: border-box;
}
.flex {
  display: flex;
}
.flex-js-sb {
  justify-content: space-between;
}
.flex-center {
  align-items: center;
}
.flex-ai-center {
  align-items: center;
}
.flex-ai-start {
  align-items: flex-start;
}
.flex-w {
  flex-wrap: wrap;
}
.font-size-16 {
  font-size: 16px;
}
.font-size-14 {
  font-size: 14px;
}
.font-size-12 {
  font-size: 12px;
}
.font-color-black {
  color: #000;
}
.font-color-dark {
  color: #23262f;
}
.font-color-999 {
  color: #999;
}
.font-w-bold {
  font-weight: 700;
}
.font-w-500 {
  font-weight: 500;
}
.font-w-400 {
  font-weight: 400;
}
.mr-2 {
  margin-right: 8.32px;
}
.mr-6 {
  margin-right: 6.24px;
}
.mt-2 {
  margin-top: 4.16px;
}
.mt-4 {
  margin-top: 4.16px;
}
.pt-12 {
  padding-top: 12.48px;
}
.mtb-16 {
  margin-top: 16.64px;
  margin-bottom: 16.64px;
}
.title-text-style {
  font-weight: 700;
  font-size: 12px;
  color: #111216;
}
.desc-text-style {
  font-weight: 400;
  font-size: 10px;
  color: #85868d;
}
.main-button {
  background: #101114;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  color: #fff;
  padding: 8.32px;
  margin-right: 6.24px;
  cursor: pointer;
}
.close {
  position: absolute;
  right: 17.68px;
  top: 17.68px;
  width: 12.48px;
  height: 12.48px;
  cursor: pointer;
}
.list_con {
  width: 100%;
  max-height: 416px;
  overflow-y: scroll;
  margin-top: 12.48px;
}
.scroll-list {
  width: 100%;
}
.card {
  width: 170.56px;
  background-color: #f2f2f2;
  border-radius: 8.32px;
  position: relative;
  overflow: hidden;
  min-height: 78px;
  padding: 10.4px;
  box-sizing: border-box;
  margin-bottom: 8.32px;
  cursor: pointer;
}
.pb-8 {
  padding-bottom: 8.32px;
}
.check {
  position: absolute;
  right: 4.16px;
  top: 4.16px;
}
.check-icon {
  width: 7.28px;
  height: 7.28px;
  display: block;
}
.price {
  font-size: 16px;
  font-weight: 700;
  color: #23262f;
}
.price::before {
  content: '￥';
  font-size: 11.44px;
}
.status {
  display: inline-block;
  padding: 2.08px 6.24px;
  border-radius: 2.08px;
  font-size: 10px;
  color: #fff;
  margin-top: 4.16px;
}
.pop-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}
.pop-empty-img {
  width: 117px;
  height: 117px;
}
.pop-btn {
  height: 41.6px;
  border-radius: 20.8px;
  border: none;
  font-size: 14.56px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}
.pop-btn.pain {
  width: 135.2px;
  background: #f0f0f2;
  color: #111;
}
.pop-btn.primary {
  width: 208px;
  background: #101114;
  color: #fff;
}
.pop-btn.lg {
  width: 100%;
  background: #101114;
  color: #fff;
}

/* ============ 原站 w-button（scope 50bc2949，render 29cc） ============
   script: props { size:'lg', type:'colorful', shape:'square', pain:false }
   className = "z-btn btn-size-"+size +" btn-type-"+type +" "+shape + (pain?" pain":"")
   render: v-uni-view.plr-10[style font-weight:bold]
   ─────────────────────────────────────────────────────────────────── */
.z-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10.4px;
  padding-right: 10.4px;
  font-weight: bold;
  cursor: pointer;
  box-sizing: border-box;
}
.z-btn.full {
  width: 100%;
}
.btn-size-lg {
  height: 47.84px;
  font-size: 14.56px;
  border-radius: 8.32px;
}
.btn-size-lg.circle {
  height: 47.84px;
  border-radius: 23.92px;
}
.btn-type-colorful {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
.btn-type-colorful.pain {
  background: #f0f0f2;
  color: #000;
}
</style>
