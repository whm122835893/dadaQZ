<template>
  <!--
    原站 pages/shop/detailList（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-bg（pageBg #f7f7f8）
      → u-sticky（sticky top:0, z-index:970）
          → u-sticky__content 390x85 @0,0，背景 bg/my-bg.webp
          → w-navbar（transparent，44px）：返回 back-btn.png 24x24 @(13,10)、
            标题「水晶明细」15px bold #333 @(165,15.5,60,16)
          → tab 行（高 41px，y=44..85）：u-tabs 三项各 104px 宽
              「全部」span @(99,54,30,21) fs15 #414141
              「水晶获取」span @(188,54,60,21)
              「水晶消耗」span @(292,54,60,21)
            选中下划线 u-tabs__wrapper__nav__line 18x3 @(105,70) 背景 bg/vector.png br100px
            右侧筛选图标 more-cate.png 16x16 @(358,56.5)
      → 列表区（mt-12）
      → 空态：search-empty.png 121x122 @(134.5,293)，容器 margin-top:208px
    数据：POST /crystal_goods/crystalDetail { page, cat, type, m }
          实调 total:0 → 原站渲染空态
  -->
  <div class="dl-page">
    <div class="dl-sticky">
      <div class="dl-sticky__content">
        <div class="dl-nav">
          <div class="dl-nav__back" @click="goBack">
            <div class="dl-nav__back-img"></div>
          </div>
          <span class="dl-nav__title"><span>水晶明细</span></span>
        </div>

        <div class="dl-tab">
          <div
            v-for="(tab, i) in tabList"
            :key="tab.type"
            class="dl-tab__item"
            :style="{ left: `${62 + i * 104}px` }"
            @click="changeTab(i)"
          >
            <span class="dl-tab__text">{{ tab.name }}</span>
          </div>
          <div class="dl-tab__line" :style="{ left: `${62 + current * 104 + 43}px` }"></div>
          <div class="dl-tab__filter" @click="openSelect">
            <div class="dl-tab__filter-img"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="dl-body">
      <div v-if="loading" class="dl-loading">
        <div class="dl-loading__spinner"></div>
        <span class="dl-loading__text">加载中</span>
      </div>
      <div v-else-if="list.length === 0" class="dl-empty">
        <img class="dl-empty__img" src="/assets/img/p0/empty/search-empty.png" alt="" />
      </div>
      <div v-for="item in list" v-else :key="item.id" class="dl-item">
        <div class="dl-item__row">
          <span class="dl-item__name">{{ item.goods_name || item.name }}</span>
          <span class="dl-item__num">{{ item.crystal_number }}</span>
        </div>
        <span class="dl-item__time">{{ formatTime(item.create_time) }}</span>
      </div>
    </div>

    <!-- 种类 / 时间筛选弹层（原站 u-popup mode="top"） -->
    <div v-if="showPop" class="dl-popup-mask" @click="closeSelect"></div>
    <div v-if="showPop" class="dl-popup">
      <div class="dl-popup__list">
        <div
          v-for="opt in typeOptions"
          :key="opt.value"
          class="dl-popup__opt"
          @click="selectType(opt.value)"
        >
          <span class="dl-popup__opt-text" :class="{ 'dl-popup__opt-text--on': param.type === opt.value }">
            {{ opt.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCrystalDetailList } from '@/api'

const router = useRouter()

const tabList = [
  { type: '', name: '全部' },
  { type: '1', name: '水晶获取' },
  { type: '-1', name: '水晶消耗' }
]

const typeOptions = [
  { name: '黄水晶', value: 'yellow' },
  { name: '紫水晶', value: 'purple' },
  { name: '蓝水晶', value: 'blue' }
]

const current = ref(0)
const showPop = ref(false)
const loading = ref(false)
const list = ref([])
const param = reactive({ page: 1, cat: '', type: '', m: '' })

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function changeTab(index) {
  current.value = index
  param.cat = tabList[index].type
  showPop.value = false
  refresh()
}

function openSelect() {
  showPop.value = true
}

function closeSelect() {
  showPop.value = false
}

function selectType(value) {
  param.type = value
  showPop.value = false
  refresh()
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

async function refresh() {
  loading.value = true
  param.page = 1
  list.value = []
  try {
    const res = await getCrystalDetailList({ ...param })
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.dl-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.dl-sticky {
  position: sticky;
  top: 0;
  z-index: 970;
  background-color: transparent;
}
.dl-sticky__content {
  position: relative;
  width: 100%;
  height: 85px;
  background: #f7f7f8 url('/assets/img/p0/bg/my-bg.webp') no-repeat;
  background-size: 100% 100%;
}
.dl-nav {
  position: relative;
  height: 44px;
}
.dl-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.dl-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.dl-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #333;
}
.dl-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #333;
}
.dl-tab {
  position: relative;
  height: 41px;
}
.dl-tab__item {
  position: absolute;
  top: 10px;
  width: 104px;
  height: 34px;
  text-align: center;
}
.dl-tab__text {
  display: inline-block;
  height: 21px;
  line-height: 21px;
  font-size: 15px;
  font-weight: 400;
  color: #414141;
}
.dl-tab__line {
  position: absolute;
  top: 26px;
  width: 18px;
  height: 3px;
  border-radius: 100px;
  background: url('/assets/img/p0/bg/vector.png') no-repeat;
  background-size: 100% 100%;
  transition: left 0.3s;
}
.dl-tab__filter {
  position: absolute;
  right: 16px;
  top: 12.5px;
  width: 16px;
  height: 16px;
}
.dl-tab__filter-img {
  width: 16px;
  height: 16px;
  background: url('/assets/img/p0/icon/more-cate.png') no-repeat;
  background-size: 100% 100%;
}
.dl-body {
  margin-top: 12px;
}
.dl-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dl-loading__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #dae4ff;
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: dl-spin 1.2s ease-in-out infinite;
}
@keyframes dl-spin {
  to {
    transform: rotate(360deg);
  }
}
.dl-loading__text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
}
.dl-empty {
  margin-top: 208px;
  padding-bottom: 135px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dl-empty__img {
  width: 121px;
  height: 122px;
  display: block;
}
.dl-item {
  margin: 12px 16px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
}
.dl-item__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dl-item__name {
  font-size: 15px;
  line-height: 21px;
  font-weight: 700;
  color: #111216;
}
.dl-item__num {
  font-size: 14px;
  line-height: 20px;
  color: #85868d;
}
.dl-item__time {
  display: block;
  margin-top: 8px;
  font-size: 10px;
  line-height: 14px;
  color: #85868d;
}
.dl-popup-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 968;
}
.dl-popup {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 969;
  background: #fff;
  border-radius: 10px 10px 0 0;
  padding: 12px 16px;
}
.dl-popup__opt {
  height: 44px;
  display: flex;
  align-items: center;
}
.dl-popup__opt-text {
  font-size: 14px;
  line-height: 20px;
  color: #85868d;
}
.dl-popup__opt-text--on {
  color: #111216;
  font-weight: 700;
}
</style>
