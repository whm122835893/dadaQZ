<template>
  <!--
    原站 pages/consignments/myConsignment（我的寄售，黑金主题）
      script 模块（chunk pages-consignments-myConsignment.0921bf08.js）
        data:
          tabList  = [{type:2,name:'藏品'},{type:1,name:'盲盒'}]        ← navbar 内 w-tabs
          tabList2 = [{name:'全部',type:''},{name:'寄售中',type:'1'},{name:'已成交',type:'2'}]
          inactiveStyle / activeStyle / status / goods_type / page / loadingType / isNext / list
        changeTab(t)  → goods_type = t.type → refresh()
        changeTab2(t) → status = t.type → refresh()
        refresh()     → loadingType='none'、isNext=true、list=[]、page=1 → getList()
        getList()     → isNext 时 myConsignment({status, goods_type, page})
                        → list 追加 data，page<last_page 则 page++，否则 isNext=false/loadingType='nomore'
                        → data 为空 → loadingType='empty'
      render（scope 32beda5c）
        w-container.my-consignment-page
          u-sticky(top 0)
            w-navbar(fixed=false, leftIcon=back-btn-white)
              w-tabs(slot=center, tabList=tabList, inactive #8A8172 / active #F4DCAA bold) @change=changeTab
              w-icon(slot=right, name=search, size=22) @click → /pages/consignments/search
            w-tabs.navbar(tabList=tabList2, lineWidth=20, lineBg=#CFAF72, lineHeight=3) @change=changeTab2
          v-uni-view.plr-16.mt-16
            myConsignmentsItem(v-for list) @refresh=refresh
            w-loading(mt-12, type=loadingType, emptyType=search, emptyTop=100)
  -->
  <div class="my-consignment-page">
    <!-- 吸顶区：navbar（含一级 tabs + 搜索）+ 二级 tabs -->
    <div class="mc-sticky">
      <div class="mc-navbar">
        <img class="mc-navbar__back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
        <!-- 一级 tabs：藏品 / 盲盒 -->
        <div class="mc-tabs1">
          <div
            v-for="t in tabList"
            :key="t.type"
            class="mc-tabs1__item"
            @click="changeTab(t)"
          >
            <span :class="{ 'mc-tabs1__text--on': goods_type === t.type }" class="mc-tabs1__text">{{ t.name }}</span>
          </div>
        </div>
        <img class="mc-navbar__search" src="/assets/img/icon/search.png" alt="" @click="goSearch" />
        <span class="mc-tabs1-line"></span>
      </div>
      <!-- 二级 tabs：全部 / 寄售中 / 已成交 -->
      <div class="mc-tabs2">
        <div
          v-for="t in tabList2"
          :key="t.name"
          class="mc-tabs2__item"
          @click="changeTab2(t)"
        >
          <span
            class="mc-tabs2__text"
            :class="{ 'mc-tabs2__text--on': status === t.type }"
          >{{ t.name }}</span>
        </div>
        <span class="mc-tabs2__line" :style="lineStyle"></span>
      </div>
    </div>

    <!-- 列表 + 加载态 -->
    <div class="plr-16 mt-16">
      <MyConsignmentsItem
        v-for="(item, i) in list"
        :key="i"
        :item="item"
        :goods-type="goods_type"
        @refresh="refresh"
      />
      <div v-if="loadingType === 'empty'" class="mc-empty">
        <img class="mc-empty__img" src="/assets/img/empty/search-empty.png" alt="" />
      </div>
      <div v-else-if="loadingType === 'loading'" class="mc-loading">加载中...</div>
      <div v-else-if="loadingType === 'nomore'" class="mc-loading">没有更多了</div>
    </div>
  </div>
</template>

<script setup>
/**
 * 我的寄售页（对应原站 pages/consignments/myConsignment）
 *   - 黑金主题（#101115 底）
 *   - 两级 tabs：一级 藏品/盲盒（切换 goods_type），二级 全部/寄售中/已成交（切换 status）
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyConsignment } from '@/api'
import MyConsignmentsItem from '@/components/myCollection/MyConsignmentsItem.vue'

const router = useRouter()

/** 一级 tabs */
const tabList = [
  { type: 2, name: '藏品' },
  { type: 1, name: '盲盒' }
]
/** 二级 tabs */
const tabList2 = [
  { name: '全部', type: '' },
  { name: '寄售中', type: '1' },
  { name: '已成交', type: '2' }
]

const status = ref('')
const goods_type = ref(2)
const page = ref(1)
const loadingType = ref('none')
const isNext = ref(false)
const list = ref([])

/** 二级 tabs 指示条位置（对齐原站：lineWidth 20，lineBg #CFAF72，lineHeight 3；原站实测 x=57/191/325） */
const lineStyle = computed(() => {
  const idx = tabList2.findIndex((t) => t.type === status.value)
  const ITEM_W = 134
  return { left: `${idx * ITEM_W + ITEM_W / 2 - 10}px`, width: '20px' }
})

/** 切换一级 tab */
function changeTab(t) {
  goods_type.value = t.type
  refresh()
}

/** 切换二级 tab */
function changeTab2(t) {
  status.value = t.type
  refresh()
}

/** 重新加载 */
function refresh() {
  loadingType.value = 'none'
  isNext.value = true
  list.value = []
  page.value = 1
  getList()
}

/** 拉取寄售列表 */
function getList() {
  if (!isNext.value) return
  loadingType.value = 'loading'
  getMyConsignment({ status: status.value, goods_type: goods_type.value, page: page.value })
    .then((res) => {
      const d = res.data || {}
      const rows = d.data || []
      const last = d.last_page || 1
      list.value = list.value.concat(rows)
      if (page.value < last) page.value++
      else {
        isNext.value = false
        loadingType.value = 'nomore'
      }
      if (!rows.length) loadingType.value = 'empty'
    })
    .catch(() => {})
}

/** 搜索页（原站 /pages/consignments/search?status&goods_type） */
function goSearch() {
  router.push({ path: '/pages/consignments/search', query: { status: status.value, goods_type: goods_type.value } })
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

onMounted(() => {
  refresh()
})
</script>

<style scoped>
/*
 * 原站 scope 32beda5c
 * 盒模型已用 Playwright 实测原站逐项核对
 */
.my-consignment-page {
  min-height: 100vh;
  background: #101115;
}
.plr-16 {
  padding-left: 16px;
  padding-right: 16px;
}
.mt-16 {
  margin-top: 16px;
}

/* 吸顶区 */
.mc-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #101115;
}
/* navbar */
.mc-navbar {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mc-navbar__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.mc-navbar__search {
  position: absolute;
  right: 13px;
  top: 11px;
  width: 22px;
  height: 22px;
}
/* 一级 tabs（藏品 / 盲盒）：容器宽 268px 居中（left 61），项宽 134px，文字左对齐 padding 15px */
.mc-tabs1 {
  display: flex;
  width: 268px;
  margin: 0 auto;
}
.mc-tabs1__item {
  width: 134px;
  height: 22px;
  flex: none;
  display: flex;
  align-items: center;
}
.mc-tabs1__text {
  padding-left: 15px;
  font-size: 15px;
  font-weight: 400;
  color: #8a8172;
  line-height: 22px;
}
.mc-tabs1__text--on {
  font-weight: 700;
  color: #f4dcaa;
}
/* 二级 tabs（全部 / 寄售中 / 已成交）：项宽 134px 固定，文字左对齐 padding 15px */
.mc-tabs2 {
  position: relative;
  display: flex;
  height: 31px;
}
.mc-tabs2__item {
  width: 134px;
  height: 31px;
  flex: none;
  display: flex;
  align-items: center;
}
.mc-tabs2__text {
  padding-left: 15px;
  font-size: 14px;
  font-weight: 400;
  color: #8a8172;
  line-height: 21px;
}
.mc-tabs2__text--on {
  font-weight: 500;
  color: #f4dcaa;
}
.mc-tabs1-line {
  position: absolute;
  top: 28px;
  left: 119px;
  width: 18px;
  height: 3px;
  background: #cfaf72;
  border-radius: 100px;
}
.mc-tabs2__line {
  position: absolute;
  bottom: 2px;
  height: 3px;
  background: #cfaf72;
  border-radius: 100px;
  transition: left 0.2s;
}

/* 空态（对齐原站 w-loading emptyTop=100：图片 y=179，容器 padding-bottom 135px） */
.mc-empty {
  display: flex;
  justify-content: center;
  padding-top: 88px;
  padding-bottom: 135px;
}
.mc-empty__img {
  width: 121px;
  height: 122px;
}
.mc-loading {
  text-align: center;
  font-size: 14px;
  color: #8a8172;
  padding: 20px 0;
}
</style>
