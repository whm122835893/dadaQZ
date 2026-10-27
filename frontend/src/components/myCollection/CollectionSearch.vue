<template>
  <!--
    原站 collectionSearch（render `a6af` / scope `11f074a4`）
      u-sticky#sticky[staticStyle top=0, disabled]
        w-navbar(fixed=false, title="我的藏品", leftIcon="back-btn-white", leftIconColor="#F8F8F8", titleStyle color #F8F8F8)
        v-uni-view.search.plr-10[style width 100vw, margin-top 20rpx]
          w-tabs(lineWidth=0, lineBg="#4478FF", tabList, itemStyle, inactiveStyle, activeStyle) @change
          v-uni-view.search_con[animation]
            u-input(clearable, placeholder="搜索内容", border=none, shape=circle, fontSize=14, color=#F4DCAA, placeholderStyle color #8B8474)
              w-icon(slot=prefix, name="search", size=24)
              v-uni-view(slot=suffix) "返回"
      u-popup(mode=top, round=10, zIndex=-1) → searcList
  -->
  <div class="mc-search">
    <!-- 原站 w-navbar：fixed=false（非固定），44px 高，透明底 -->
    <div class="mc-navbar">
      <div class="mc-navbar-content">
        <div class="mc-navbar-left" @click="goBack">
          <img class="mc-navbar-back" src="/assets/img/order/back-btn-white.webp" alt="" />
        </div>
        <div class="mc-navbar-center">
          <span class="mc-navbar-title">我的藏品</span>
        </div>
      </div>
    </div>

    <!-- 原站 .search.plr-10：width 100vw, margin-top 20rpx(10.4px) -->
    <div class="search plr-10">
      <!-- 原站 w-tabs：lineWidth=0（无下划线），四个 tab 胶囊样式 -->
      <div class="tabs">
        <div
          v-for="(tab, i) in tabList"
          :key="tab.types"
          class="tab-item"
          :class="{ active: current === i }"
          :style="current === i ? activeStyle : inactiveStyle"
          @click="onChange(tab, i)"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- 原站 u-input：shape=circle / border=none / height 72rpx(37.44px)
           search_con 绝对定位 left:100vw，聚焦时用 animation 滑入 -->
      <div class="search-con" :class="conClass">
        <div class="ipt-wrap">
          <img class="ipt-icon" src="/assets/img/myCollection/search.png" alt="" @click="doSearch" />
          <input
            v-model="keywords"
            class="ipt"
            type="text"
            placeholder="搜索内容"
            @input="iptChange"
            @focus="onFocus"
            @keyup.enter="doSearch"
          />
          <span class="ipt-suffix" @click="closeIpt">返回</span>
        </div>
      </div>
    </div>

    <!-- 原站 u-popup(mode=top, round=10)：搜索建议浮层 -->
    <div v-if="showPop" class="searc-mask" @click="closeIpt" />
    <div v-if="showPop" class="searcList">
      <div
        v-for="(item, idx) in searcList"
        :key="idx"
        class="item flex flex-ai-center"
        @click="changeSearch(item)"
      >
        <span
          v-for="(ch, ci) in splitName(item.name)"
          :key="ci"
          class="ch"
          :class="keywords.includes(ch) ? 'font-color-textPrimary' : 'font-color-convention'"
        >{{ ch }}</span>
      </div>
      <div v-if="isSearcListEmpty" class="item flex-center font-size-14 font-color-describe">
        暂无数据~
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 我的藏品搜索头 —— 原站 `collectionSearch` 组件
 *
 * 反编译：chunk `pages-myCollection-myCollection.ea8eb40f.js`
 *   注册 48d0 → script `e842` / render `a6af` / scope `11f074a4`
 *
 * 原站 script `e842` 关键逻辑（逐字照抄）：
 *   data:
 *     tabStyle   { padding:'0', position:'relative', 'z-index':1 }
 *     iptStyle   { height:'72rpx', padding:'0 24rpx', 'background-color':'#1B1913' }
 *     inactiveStyle { width:'78px', height:'28px', fontWeight:'bold', color:'#B5AA96',
 *                     'font-size':'10px', background:'#1B1913', 'border-radius':'30rpx' }
 *     activeStyle   { width:'78px', height:'28px', color:'#302518', 'font-size':'10px',
 *                     fontWeight:'bold', background:'#D9B979', 'border-radius':'30rpx' }
 *     types: 2
 *     tabList: [藏品 2 / 盲盒 1 / 寄售 6 / 已售 3]
 *     keywords:''  showPop:false  showPop2:false  popTop:0
 *     searcList:[]  isSearcListEmpty:false  searchLoading:'none'
 *   mounted:
 *     createSelectorQuery().select('#sticky').boundingClientRect → popTop = height+'px'
 *   methods:
 *     iptChange(e)  → showPop2 为 false 时 debounce 500ms → getSearchList()
 *     getSearchList() → searchLoading='loading'; likeCollection({keyword})
 *                       → searcList = data; 无数据 → isSearcListEmpty = true
 *     closeIpt()     → showPop=false; animation=2; $emit('closeSearch'); clearIptAn()
 *     openIpt()      → animation=1
 *     clearIptAn()   → 1s 后 animation=''
 *     changeSearch(a)→ $emit('changeSearch', a.collection_id); keywords=a.name;
 *                       showPop2=true; showPop=false
 */
import { computed, ref } from 'vue'
import { likeCollection } from '@/api'

const props = defineProps({
  types: { type: [String, Number], default: 2 }
})
const emit = defineEmits(['changetab', 'changeSearch', 'closeSearch'])

/** 原站 tabList（顺序固定） */
const tabList = [
  { name: '藏品', types: 2 },
  { name: '盲盒', types: 1 },
  { name: '寄售', types: 6 },
  { name: '已售', types: 3 }
]

/** 原站 activeStyle / inactiveStyle（px 值已是原站 CSS 换算后的绝对值） */
const activeStyle = {
  width: '78px',
  height: '28px',
  color: '#302518',
  fontSize: '10px',
  fontWeight: 'bold',
  background: '#D9B979',
  borderRadius: '15.6px'
}
const inactiveStyle = {
  width: '78px',
  height: '28px',
  fontWeight: 'bold',
  color: '#B5AA96',
  fontSize: '10px',
  background: '#1B1913',
  borderRadius: '15.6px'
}

const keywords = ref('')
const showPop = ref(false)
const showPop2 = ref(false)
const animation = ref('')
const searcList = ref([])
const isSearcListEmpty = ref(false)
const searchLoading = ref('none')

/** 当前选中 tab 下标（由 types 反推） */
const current = computed(() => {
  const i = tabList.findIndex((t) => t.types === Number(props.types))
  return i < 0 ? 0 : i
})

/** 原站 animation: 1 → 滑入（search_con_start），2 → 滑出（search_con_end） */
const conClass = computed(() => {
  if (animation.value === 1) return 'search_con_start'
  if (animation.value === 2) return 'search_con_end'
  return ''
})

function splitName(name) {
  return String(name || '').split('')
}

let debounceTimer = null
function iptChange() {
  if (showPop2.value) return
  if (!keywords.value.length) return
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(getSearchList, 500)
}

async function getSearchList() {
  searchLoading.value = 'loading'
  isSearcListEmpty.value = false
  try {
    const res = await likeCollection({ keyword: keywords.value })
    searchLoading.value = 'none'
    searcList.value = res.data || []
    if (!searcList.value.length) isSearcListEmpty.value = true
  } catch (e) {
    searchLoading.value = 'none'
  }
}

function doSearch() {
  if (!keywords.value.length) return
  getSearchList()
}

function onFocus() {
  showPop2.value = false
}

let animTimer = null
function closeIpt() {
  showPop.value = false
  animation.value = 2
  emit('closeSearch')
  clearTimeout(animTimer)
  animTimer = setTimeout(() => {
    animation.value = ''
  }, 1000)
}

function changeSearch(item) {
  emit('changeSearch', item.collection_id)
  keywords.value = item.name
  showPop2.value = true
  showPop.value = false
}

function onChange(tab, index) {
  emit('changetab', { ...tab, index })
}

function goBack() {
  window.history.length > 1 ? window.history.back() : (window.location.hash = '/pages/my/my')
}
</script>

<style scoped>
/* 原站 scope 11f074a4 */
.mc-search {
  position: relative;
  z-index: 10;
}

/* ---- w-navbar：fixed=false、bgColor transparent、title 白色 ---- */
.mc-navbar {
  width: 100%;
}
.mc-navbar-content {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: transparent;
}
.mc-navbar-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 13px;
  cursor: pointer;
}
.mc-navbar-back {
  width: 24.96px;
  height: 24.96px;
}
.mc-navbar-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.mc-navbar-title {
  font-weight: bold;
  font-size: 15.6px;
  color: #f8f8f8;
  font-family: 'Alibaba-PuHuiTi-Bold', sans-serif;
}

/* ---- .search：width 100vw, margin-top 20rpx, padding 0 10rpx ---- */
.search {
  width: 100vw;
  margin-top: 10.4px;
  padding-left: 5.2px;
  padding-right: 5.2px;
  position: relative;
  overflow: hidden;
}

/* ---- w-tabs：lineWidth=0 → 无滑动下划线，四个固定胶囊 ---- */
.tabs {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8.32px;
  position: relative;
  z-index: 1;
  flex: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

/* ---- u-input：circle / border none / height 72rpx ---- */
.search-con {
  width: 100%;
  padding: 0 16.64px;
  position: absolute;
  left: 100vw;
  top: calc(50% - 18.72px);
  z-index: 999999;
}
.ipt-wrap {
  height: 37.44px;
  padding: 0 12.48px;
  background-color: #1B1913;
  border-radius: 15.6px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.ipt-icon {
  width: 12.48px;
  height: 12.48px;
  flex: none;
  margin-right: 6.24px;
  cursor: pointer;
}
.ipt {
  flex: 1;
  min-width: 0;
  height: 37.44px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #F4DCAA;
  font-family: 'Alibaba-PuHuiTi-Regular', sans-serif;
}
.ipt::placeholder {
  color: #8B8474;
}
.ipt-suffix {
  flex: none;
  font-size: 14px;
  color: #F4DCAA;
  cursor: pointer;
}

/* 原站动画：search_con_start / search_con_end */
@keyframes iptAnimation {
  from {
    left: 100vw;
  }
  to {
    left: 0;
  }
}
@keyframes iptAnimation2 {
  from {
    left: 0;
  }
  to {
    left: 100vw;
  }
}
.search_con_start {
  animation-name: iptAnimation;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}
.search_con_end {
  animation-name: iptAnimation2;
  animation-fill-mode: forwards;
  animation-duration: 1s;
}

/* ---- u-popup(mode=top)：搜索建议浮层 ---- */
.searc-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999998;
}
.searcList {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  max-height: 50vh;
  overflow-y: scroll;
  padding: 10.4px 16.64px;
  background: #16150f;
  z-index: 999999;
  border-radius: 10px 10px 0 0;
}
.searcList .item {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
}
.searcList .ch {
  font-size: 14px;
}
.font-color-convention {
  color: #c6bdad !important;
}
.font-color-textPrimary {
  color: #f4dcaa !important;
}
.font-color-describe {
  color: #8d8474 !important;
}
.flex {
  display: flex;
}
.flex-ai-center {
  align-items: center;
}
.flex-center {
  display: flex;
  justify-content: center;
}
.font-size-14 {
  font-size: 14px;
}
</style>
