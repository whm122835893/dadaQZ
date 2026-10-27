<template>
  <!--
    原站 pages/consignments/search（金标准实测 2026-10-25 登录后抓取，390x844，浅色 #f7f7f8）
    结构：u-sticky 顶部（背景透明）
      → nav 44px：返回（back-btn.png 24x24 @(13,10)）、搜索框 (55.5,5,299,34) bg #f2f2f2 br100px
          搜索图标 search.webp 22x22 @(66.5,11)
          input (93.5,6,245,32) placeholder 14px #909399 @(93.5,15)
          「搜索」14px #303133 @(354.5,16,28,15)
      → tab 行（输入关键词后出现）y=44：
          「全部」14px fw500 #df0007 @(79,44,28,20)
          「藏品」14px fw400 #ababab @(183,44,28,20)
          「盲盒」14px fw400 #ababab @(287,44,28,20)
      → 结果区：空态 search-empty.png 121x122 @(134.5,168)
    交互：输入关键词回车 → POST /order/order/myConsignment { keyword, status, goods_type, page }
      实调（keyword="嗒"）返回 total:0 → 空态
  -->
  <div class="cs-page">
    <div class="cs-sticky">
      <div class="cs-nav">
        <div class="cs-nav__back" @click="goBack">
          <div class="cs-nav__back-img"></div>
        </div>
        <div class="cs-search">
          <div class="cs-search__box">
            <img class="cs-search__icon" src="/assets/img/p0/icon/search.webp" alt="" />
            <input
              v-model="keyword"
              class="cs-search__input"
              type="search"
              placeholder="请输入搜索内容"
              placeholder-class="cs-search__ph"
              confirm-type="search"
              @confirm="onSearch"
              @keyup.enter="onSearch"
            />
          </div>
          <span class="cs-search__action" @click="onSearch">搜索</span>
        </div>
      </div>

      <!-- tab 行：原站在有搜索关键词后展示 -->
      <div v-if="searched" class="cs-tabs">
        <span
          v-for="t in tabs"
          :key="t.value"
          class="cs-tabs__item"
          :class="{ 'is-active': tab === t.value }"
          @click="onTab(t.value)"
        >{{ t.label }}</span>
      </div>
    </div>

    <div class="cs-list">
      <div v-if="loading" class="cs-loading">
        <div class="cs-loading__spinner"></div>
        <span class="cs-loading__text">加载中</span>
      </div>
      <div v-else-if="list.length === 0" class="cs-empty">
        <img class="cs-empty__img" src="/assets/img/p0/empty/search-empty.png" alt="" />
      </div>
      <div v-for="item in list" v-else :key="item.id" class="cs-item">
        <span class="cs-item__title">{{ item.name || item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { searchMyConsignment } from '@/api'

const router = useRouter()
const keyword = ref('')
const list = ref([])
const loading = ref(false)
const searched = ref(false)
const tab = ref('all')

/** 原站 tab：全部 / 藏品 / 盲盒，映射到接口 goods_type 参数 */
const tabs = [
  { label: '全部', value: 'all' },
  { label: '藏品', value: '1' },
  { label: '盲盒', value: '2' }
]

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/consignments/myConsignment')
}

function goodsTypeOf(value) {
  return value === 'all' ? '' : value
}

async function fetchList() {
  loading.value = true
  try {
    const res = await searchMyConsignment({
      keyword: keyword.value.trim(),
      status: '',
      goods_type: goodsTypeOf(tab.value),
      page: 1
    })
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  } finally {
    loading.value = false
  }
}

/** 搜索：原站输入关键词后 POST /order/order/myConsignment */
async function onSearch() {
  searched.value = true
  await fetchList()
}

function onTab(value) {
  if (tab.value === value) return
  tab.value = value
  fetchList()
}

onMounted(async () => {
  await fetchList()
})
</script>

<style scoped>
.cs-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.cs-sticky {
  position: sticky;
  top: 0;
  z-index: 970;
  background: transparent;
}
.cs-nav {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
}
.cs-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.cs-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.cs-search {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 55.5px;
  padding-right: 7.5px;
}
.cs-search__box {
  position: relative;
  flex: none;
  width: 299px;
  height: 34px;
  background: #f2f2f2;
  border-radius: 100px;
  display: flex;
  align-items: center;
}
.cs-search__icon {
  position: absolute;
  left: 11px;
  top: 6px;
  width: 22px;
  height: 22px;
}
.cs-search__input {
  margin-left: 38px;
  width: 245px;
  height: 32px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #000;
  text-align: left;
}
.cs-search__input::placeholder {
  color: #909399;
  font-size: 14px;
}
.cs-search__action {
  position: absolute;
  left: 354.5px;
  top: 16px;
  width: 28px;
  height: 15px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #303133;
  white-space: nowrap;
  cursor: pointer;
}
.cs-tabs {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 51px;
}
.cs-tabs__item {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #ababab;
  cursor: pointer;
}
.cs-tabs__item.is-active {
  font-weight: 500;
  color: #df0007;
}
.cs-list {
  padding: 0 12px;
}
.cs-loading {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cs-loading__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #dae4ff;
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: cs-spin 1.2s ease-in-out infinite;
}
@keyframes cs-spin {
  to {
    transform: rotate(360deg);
  }
}
.cs-loading__text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 18px;
  color: #909399;
}
.cs-empty {
  margin-top: 94px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cs-empty__img {
  width: 121px;
  height: 122px;
  display: block;
}
.cs-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.cs-item__title {
  font-size: 14px;
  line-height: 20px;
  color: #333;
}
</style>
