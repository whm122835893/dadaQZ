<template>
  <div class="home">
    <div class="home__bg" />

    <!-- 顶部欢迎栏 .hg-header -->
    <header class="hg-header">
      <img class="hg-header-back" src="/assets/img/icon-back.webp" alt="" @click="goBack" />
      <div class="hg-header-right">
        <div class="hg-header-titles">
          <p class="hg-welcome">欢迎使用</p>
          <p class="hg-appname">嗒嗒Tata</p>
        </div>
        <span class="hg-header-logo">
          <img src="/assets/img/login-logo.webp" alt="" />
        </span>
      </div>
    </header>

    <!-- 公告条 .hg-notice.gold-panel -->
    <section class="hg-notice gold-panel" @click="go2Notice">
      <div class="hg-notice-body">
        <div class="hg-notice-row">
          <div class="hg-notice-bar">
            <div class="hg-notice-track">
              <p v-for="(item, i) in marqueeList" :key="i" class="hg-notice-item">{{ item.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner .hg-banner.gold-frame -->
    <section class="hg-banner gold-frame">
      <div class="hg-banner-swiper">
        <div class="hg-banner-track" :style="trackStyle">
          <div v-for="b in bannerList" :key="b.id" class="hg-banner-slide">
            <img class="hg-banner-pic" :src="b.image" @click="openBanner(b)" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- AI 条 .hg-ai（内容由背景图承担，innerHTML 为空） -->
    <section class="hg-ai" @click="goAsk" />

    <!-- 金刚区 .hg-activity（底图整图，三段裁切窗口各自定位） -->
    <section class="hg-activity">
      <div class="hg-act-track">
        <img class="hg-activity-bg" src="/assets/img/activity-cards.webp" alt="" />
      </div>
      <div
        v-for="m in menus"
        :key="m.name"
        class="hg-act-mask"
        :style="{ left: m.left, width: m.w }"
      >
        <div class="hg-act-inner">
          <div class="hg-act-stack">
            <p class="hg-act-name">{{ m.name }}</p>
            <span class="hg-act-btn">
              <span class="hg-act-btn-text">进入</span>
              <img class="hg-act-btn-arrow" src="/assets/img/icon-arrow-dark.webp" alt="" />
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 发售记录 .hg-section -->
    <section class="hg-section">
      <div class="hg-sec-head">
        <h2 class="hg-sec-title">发售记录</h2>
        <span class="hg-sec-more" @click="goMarketAll">全部 ›</span>
      </div>

      <div class="hg-filters">
        <div class="hg-filter" @click="seriesShow = true">
          <span class="hg-filter-text" :class="{ 'hg-filter-active': seriesName }">{{ seriesName || '类别' }}</span>
          <i class="hg-caret" />
        </div>
        <div class="hg-filter" @click="statusShow = true">
          <span class="hg-filter-text" :class="{ 'hg-filter-active': statusName }">{{ statusName || '售卖状态' }}</span>
          <i class="hg-caret" />
        </div>
        <div class="hg-flex-1" />
        <div class="hg-filter hg-filter-sort" @click="toggleSort('createtime')">
          <span class="hg-filter-text" :class="{ 'hg-filter-active': filterOrder === 'createtime' }">最新</span>
          <span class="hg-sort-arrows" :class="{ up: filterOrder === 'createtime' && filterSort === 'asc' }">
            <i class="hg-tri up" /><i class="hg-tri down" />
          </span>
        </div>
        <div class="hg-filter hg-filter-sort" @click="toggleSort('price')">
          <span class="hg-filter-text" :class="{ 'hg-filter-active': filterOrder === 'price' }">价格</span>
          <span class="hg-sort-arrows" :class="{ up: filterOrder === 'price' && filterSort === 'asc' }">
            <i class="hg-tri up" /><i class="hg-tri down" />
          </span>
        </div>
      </div>

      <div v-if="loading" class="hg-loading">
        <span class="hg-loading-spinner" />
        <p class="hg-loading-text">加载中</p>
      </div>

      <div v-else class="hg-goods">
        <article
          v-for="g in goodsList"
          :key="`${g.id}-${g.batch_id}`"
          class="hg-goods-card"
          @click="goGoods(g)"
        >
          <div class="hg-goods-img">
            <img class="hg-goods-pic" :src="g.listimg" alt="" />
            <span class="hg-status">
              <i class="hg-status-dot" /><span class="hg-status-text">{{ saleStatusText(g) }}</span>
            </span>
          </div>
          <p class="hg-goods-name">{{ g.name }}</p>
          <div class="hg-goods-foot">
            <span class="hg-goods-type">数字艺术</span>
            <span class="hg-goods-price">¥{{ g.price }}</span>
          </div>
        </article>
      </div>

      <p v-if="!loading && !goodsList.length" class="hg-empty">暂无发售记录</p>
    </section>

    <TabBar current="/pages/index/index" />
    <div class="hg-tabbar-placeholder" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import TabBar from '@/components/TabBar.vue'
import { getConfig, getSeries, getAfficheList, getBanner, getBlindBoxList } from '@/api'
import { useConfigStore } from '@/stores/config'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const configStore = useConfigStore()
const userStore = useUserStore()
const { nowTimestamp } = storeToRefs(configStore)

const bannerList = ref([])
const goodsList = ref([])
const loading = ref(true)
const afficheList = ref([])

const bannerIndex = ref(0)
let bannerTimer = null
let tickTimer = null

const seriesShow = ref(false)
const statusShow = ref(false)
const seriesName = ref('')
const statusName = ref('')
const filterSeriesId = ref(0)
const filterSaleStatus = ref(0)
const filterOrder = ref('')
const filterSort = ref('')

const seriesOptions = ref([{ id: 0, name: '类别' }])

/** 金刚区三项为原站硬编码，非接口数据。
 *  left/w 为底图 activity-cards.webp(1110×498) 中三张卡片的实测边界换算的百分比。 */
const menus = [
  {
    name: '每日签到',
    left: '4.14%',
    w: '30.54%',
    action: () => router.push('/pages/sign/index')
  },
  {
    name: '幸运抽奖',
    left: '36.04%',
    w: '29.19%',
    action: () => router.push('/pages/lottery/lottery?id=1')
  },
  {
    name: '邀请有礼',
    left: '66.40%',
    w: '33.51%',
    action: () => router.push('/pages/invitation/invitation')
  }
]

const marqueeList = computed(() => (afficheList.value.length ? afficheList.value : [{ title: '暂无公告' }]))

const trackStyle = computed(() => ({
  transform: `translateX(-${bannerIndex.value * 100}%)`
}))

function restartTimer() {
  if (bannerTimer) clearInterval(bannerTimer)
  bannerTimer = setInterval(() => {
    if (!bannerList.value.length) return
    bannerIndex.value = (bannerIndex.value + 1) % bannerList.value.length
  }, 4000)
}

/** 售卖状态：1即将发售 2开放发售 3已结束 4已售罄 */
function itemSaleStatus(g) {
  const t = g.release_time * 1000
  const d = g.batch ? g.batch.end_time * 1000 : g.end_time * 1000
  const r = g.batch ? g.batch.total_num : g.total_num
  const e = g.batch ? r - g.batch.has_num : g.sale_total_num
  const now = nowTimestamp.value || Date.now()
  if (!t || !d) return 3
  if (now < t) return 1
  if (now > d) return 4
  return e >= r ? 4 : 2
}

function saleStatusText(g) {
  return { 1: '即将发售', 2: '开放发售', 3: '已结束', 4: '已售罄' }[itemSaleStatus(g)] || ''
}

async function loadAll() {
  const [cfg, series, affiche, banner] = await Promise.all([
    getConfig(),
    getSeries({ type: 10 }),
    getAfficheList({ page: 1, limit: 15 }),
    getBanner(1)
  ])
  configStore.setConfig(cfg.data || {})
  const s = series.data || []
  configStore.setSeries(s)
  const opts = [{ id: 0, name: '类别' }]
  s.forEach((x) => {
    if (x.series_id >= 0) opts.push({ id: x.series_id, name: x.series_name })
  })
  seriesOptions.value = opts
  afficheList.value = affiche?.data?.data || []
  bannerList.value = banner?.data?.data || []
  await loadGoods()
  loading.value = false
}

async function loadGoods() {
  const res = await getBlindBoxList({
    list_rows: 30,
    page: 1,
    order: filterOrder.value,
    sort: filterSort.value,
    series_id: filterSeriesId.value,
    sale_status: filterSaleStatus.value
  })
  goodsList.value = res.data || []
}

function toggleSort(field) {
  if (filterOrder.value === field) {
    filterSort.value = filterSort.value === 'asc' ? 'desc' : 'asc'
  } else {
    filterOrder.value = field
    filterSort.value = 'asc'
  }
  loadGoods()
}

function openBanner(b) {
  const url = b.url || ''
  if (!url) return
  if (url.startsWith('http')) {
    if (url.includes('/#/pages/index/downloadApp')) router.push('/pages/index/downloadApp')
    else window.open(url, '_blank')
  }
}

function goGoods(g) {
  // 原站真实分流：goods_type != 1 → 藏品发售页；goods_type == 1 → 盲盒开盒页
  if (Number(g.goods_type) === 1) {
    router.push(`/pages/product/box?id=${g.id}`)
  } else {
    router.push(`/pages/product/collection?id=${g.id}&batch_id=${g.batch_id ?? ''}`)
  }
}
function go2Notice() {
  router.push('/pages/notice/notice')
}
function goAsk() {
  window.alert('暂未开放')
}
function goMarketAll() {
  router.push('/pages/market/market')
}
function goBack() {
  if (window.history.length > 1) window.history.back()
  else router.push('/pages/index/index')
}

onMounted(() => {
  if (!userStore.isLogin) userStore.loginDemo()
  loadAll().then(restartTimer)
  // 原站每秒更新 nowTimestamp，用于发售状态实时判定
  tickTimer = setInterval(() => configStore.tick(), 1000)
})

onBeforeUnmount(() => {
  if (bannerTimer) clearInterval(bannerTimer)
  if (tickTimer) clearInterval(tickTimer)
})
</script>

<style scoped>
/* rpx 换算：390 / 750 = 0.52 */
.home {
  position: relative;
  min-height: 100vh;
  padding: 0 0 calc(70px + var(--safe-bottom));
  background: #000;
}

.home__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #000 url('/assets/img/bg.webp') no-repeat center top;
  background-size: 100% auto;
  pointer-events: none;
}

.home > *:not(.home__bg) {
  position: relative;
  z-index: 1;
}
.home > .w-tabbar__fixed {
  position: fixed;
}

/* 公共金框 */
.gold-frame {
  border-radius: 16px;
  border: 1px solid rgba(216, 199, 164, 0.4);
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.55);
}
.gold-panel {
  background: url('/assets/img/notice-bar.webp') no-repeat 100% 100% / 100% 100%;
}

/* .hg-header */
.hg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 0;
  height: 41px;
}
.hg-header-back {
  width: 6px;
  height: 12px;
  margin-left: 11px;
  cursor: pointer;
}
.hg-header-right {
  display: flex;
  align-items: center;
  padding-right: 21px;
}
.hg-header-titles {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10px;
}
.hg-welcome {
  margin: 0;
  font-size: 9px;
  color: #a8a393;
  line-height: 13px;
}
.hg-appname {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #f8efdd;
  line-height: 18px;
}
.hg-header-logo {
  width: 52px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
}
.hg-header-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* .hg-notice */
.hg-notice {
  margin: 13px 18px 0;
  height: 33px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
}
.hg-notice-body {
  flex: 1;
  min-width: 0;
  margin-left: 31px;
  height: 33px;
  overflow: hidden;
}
.hg-notice-row {
  display: flex;
  align-items: center;
  height: 33px;
}
.hg-notice-bar {
  width: 194px;
  height: 33px;
  overflow: hidden;
}
.hg-notice-track {
  display: flex;
  flex-direction: column;
  animation: hgNoticeRoll 14s linear infinite;
}
.hg-notice-item {
  margin: 0;
  height: 33px;
  line-height: 33px;
  font-size: 10px;
  color: #cbc0ac;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@keyframes hgNoticeRoll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-33px); }
}

/* .hg-banner */
.hg-banner {
  margin: 13px 18px 0;
}
.hg-banner-swiper {
  height: 166px;
  overflow: hidden;
  border-radius: 15px;
}
.hg-banner-track {
  display: flex;
  height: 166px;
  transition: transform 0.45s cubic-bezier(0.25, 0.8, 0.35, 1);
}
.hg-banner-slide {
  flex: 0 0 100%;
  height: 166px;
  overflow: hidden;
}
.hg-banner-pic {
  display: block;
  width: 100%;
  height: 166px;
  object-fit: cover;
}

/* .hg-ai */
.hg-ai {
  background: url('/assets/img/ai.webp') no-repeat 100% 100% / 100% 100%;
  margin: 13px 18px 0;
  height: 44px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  padding: 0 6px 0 10px;
  cursor: pointer;
}

/* .hg-activity */
.hg-activity {
  position: relative;
  height: 166px;
  margin: 13px 9px 0;
}
.hg-act-track {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.hg-activity-bg {
  display: block;
  width: 100%;
  height: 166px;
  object-fit: fill;
}
.hg-act-mask {
  position: absolute;
  top: 0;
  height: 166px;
  cursor: pointer;
}
/* 文字与「进入」按钮共享左边缘成列，整体在卡片内居中 */
.hg-act-inner {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 17px;
  display: flex;
  justify-content: center;
}
.hg-act-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.hg-act-name {
  margin: 0 0 7px;
  font-size: 14px;
  font-weight: 700;
  color: #fff1da;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}
.hg-act-btn {
  height: 22px;
  padding: 0 9px;
  border-radius: 11px;
  background: #f5e3c9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hg-act-btn-text {
  font-size: 11px;
  font-weight: 700;
  color: #2d251c;
  margin-right: 3px;
}
.hg-act-btn-arrow {
  width: 10px;
  height: 7px;
}

/* .hg-section */
.hg-section {
  margin: 17px 18px 0;
}
.hg-sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hg-sec-title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  color: #f8f8f8;
}
.hg-sec-more {
  font-size: 11px;
  color: #989a9c;
  cursor: pointer;
}

.hg-filters {
  display: flex;
  align-items: center;
  margin-top: 14px;
}
.hg-flex-1 { flex: 1; }
.hg-filter {
  display: flex;
  align-items: center;
  margin-right: 26px;
  cursor: pointer;
}
.hg-filter-sort {
  margin-right: 0;
  margin-left: 20px;
}
.hg-filter-text {
  font-size: 10px;
  color: #cbc8c2;
}
.hg-filter-active { color: #f4dcaa; }
.hg-caret {
  width: 0;
  height: 0;
  border-left: 3.5px solid transparent;
  border-right: 3.5px solid transparent;
  border-top: 4px solid #cbc8c2;
  margin-left: 4px;
}
.hg-sort-arrows {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 4px;
}
.hg-tri {
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
}
.hg-tri.up {
  border-bottom: 3.5px solid #cbc8c2;
  margin-bottom: 1.5px;
}
.hg-tri.down { border-top: 3.5px solid #cbc8c2; }
.hg-sort-arrows.up .hg-tri.up { border-bottom-color: #f4dcaa; }
.hg-sort-arrows.up .hg-tri.down { border-top-color: rgba(203, 200, 194, 0.35); }

.hg-goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 13px;
}
.hg-goods-card {
  width: 171px;
  margin-bottom: 13px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(180deg, hsla(0, 0%, 100%, 0.05), hsla(0, 0%, 100%, 0.015));
  cursor: pointer;
}
.hg-goods-img {
  position: relative;
  width: 100%;
  height: 156px;
}
.hg-goods-pic {
  display: block;
  width: 100%;
  height: 156px;
  border-radius: 8px 8px 0 0;
  object-fit: cover;
}
.hg-status {
  position: absolute;
  top: 7px;
  left: 7px;
  display: flex;
  align-items: center;
  padding: 2.5px 8px;
  border-radius: 10px;
  background: rgba(48, 42, 34, 0.95);
  border: 1px solid #8d7855;
}
.hg-status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #f4dcaa;
  margin-right: 4px;
}
.hg-goods-name {
  display: block;
  margin: 10px;
  font-size: 14px;
  color: #f8f8f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hg-goods-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
}
.hg-goods-type {
  font-size: 11px;
  color: #f4dcaa;
}
.hg-goods-price {
  color: #f4dcaa;
  font-size: 19px;
}

.hg-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
}
.hg-loading-spinner {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(244, 220, 170, 0.25);
  border-top-color: #f4dcaa;
  border-radius: 50%;
  animation: hgSpin 0.8s linear infinite;
}
@keyframes hgSpin { to { transform: rotate(360deg); } }
.hg-loading-text {
  margin: 10px 0 0;
  font-size: 13px;
  color: #8a8a8a;
}
.hg-empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: #666;
}

.hg-tabbar-placeholder { height: 56px; }
</style>