<template>
  <!--
    原站页面 render `1983`（pages-market-market.24482309.js）／script `5599`
      w-container.mk-bg
        mk-page
          u-status-bar
          mk-search-row
            mk-search > mk-search-icon(icon-search.webp) + mk-search-input(v-model form.keywords, input→changeMarketTab)
            mk-rank(click goRanking)「榜单」
          mk-zones-scroll(scroll-x) > mk-zones > v-for zoneCards > mk-zone
            mk-zone-head > mk-zone-tag「大区」+ mk-zone-name
            mk-zone-price-row > mk-zone-price + mk-zone-chart(icon-chart.webp)
            mk-zone-foot > mk-zone-trend(icon-trend.webp) + mk-zone-change + mk-zone-vol
          mk-cate
            mk-cate-scroll(scroll-x) > v-for cateTabs > mk-cate-item(active:Number(form.series_id)===t.id)
                 > text + [active] mk-cate-line
            mk-activity(click toggleActivity) > mk-act-toggle(class on:onlyActivity) + text「只看活动」
          mk-body
            [market_type 1|3] mk-thead
                 mk-th-name「藏品名称 | 发行流通」
                 mk-th-sort(click changeMarketSort min_price) > text「地板价」(active 类) + mk-sort-arrows(class up)
                      > mk-tri.up + mk-tri.down
                 mk-th-sort(click changeMarketSort sale_num) > text「成交量」+ 同样箭头
            [market_type 1|3] v-for list > mk-row(click rowClick)
                 mk-row-img($ossUrl+product.listimg, aspectFill) + mk-row-info(mk-row-name + mk-row-sub)
                 [is_out==0] mk-row-price「¥ {goods_type!=1?min_price:price}」 [else] mk-row-price.mk-row-out「已退市」
                 mk-row-vol{deal_num}
            [market_type 2] flex.flex-js-sb.flex-w > v-for list > MarketCard(staticClass mb-4 mt-8)
            w-loading(emptyType:"search", emptyTop:"100", type:loading)
            [loading=='none' && list.length] mk-foot「已展示全部藏品」
            mk-body-bottom
          mk-tabbar-placeholder
        w-tabbar(value=1)
  -->
  <div class="mk-bg">
    <div class="mk-page">
      <!-- 搜索栏 + 榜单 -->
      <div class="mk-search-row">
        <div class="mk-search">
          <img class="mk-search-icon" src="/assets/img/market/icon-search.webp" alt="" />
          <input
            v-model="form.keywords"
            class="mk-search-input"
            type="text"
            placeholder="搜索数字文创"
            placeholder-style="color:#8A7C63;"
            @input="onSearchInput"
          />
        </div>
        <span class="mk-rank" @click="goRanking">榜单</span>
      </div>

      <!-- 大区卡片（横向滚动） -->
      <div class="mk-zones-scroll">
        <div class="mk-zones">
          <div v-for="z in zoneCards" :key="z.id" class="mk-zone">
            <div class="mk-zone-head">
              <span class="mk-zone-tag">大区</span>
              <span class="mk-zone-name">{{ z.name }}</span>
            </div>
            <div class="mk-zone-price-row">
              <span class="mk-zone-price">{{ z.current_price }}</span>
              <img class="mk-zone-chart" src="/assets/img/market/icon-chart.webp" alt="" />
            </div>
            <div class="mk-zone-foot">
              <img class="mk-zone-trend" src="/assets/img/market/icon-trend.webp" alt="" />
              <span class="mk-zone-change">{{ z.fluctuation }}</span>
              <span class="mk-zone-vol">{{ z.change_price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类 tab + 只看活动 -->
      <div class="mk-cate">
        <div class="mk-cate-scroll">
          <div
            v-for="t in cateTabs"
            :key="t.id"
            class="mk-cate-item"
            :class="{ active: Number(form.series_id) === t.id }"
            @click="changeSeries(t.id)"
          >
            <span>{{ t.name }}</span>
            <i v-if="Number(form.series_id) === t.id" class="mk-cate-line" />
          </div>
        </div>
        <div class="mk-activity" @click="toggleActivity">
          <span class="mk-act-toggle" :class="{ on: onlyActivity }" />
          <span>只看活动</span>
        </div>
      </div>

      <!-- 列表主体 -->
      <div class="mk-body">
        <!-- 表头（market_type 1/3） -->
        <div v-if="form.market_type == 1 || form.market_type == 3" class="mk-thead">
          <span class="mk-th-name">藏品名称 | 发行流通</span>
          <div class="mk-th-sort" @click="changeMarketSort('min_price', form.order === 'min_price' && form.sort === 'desc' ? 'asc' : 'desc')">
            <span :class="{ 'mk-th-active': form.order === 'min_price' }">地板价</span>
            <span class="mk-sort-arrows" :class="{ up: form.order === 'min_price' && form.sort === 'asc' }">
              <i class="mk-tri up" /><i class="mk-tri down" />
            </span>
          </div>
          <div class="mk-th-sort" @click="changeMarketSort('sale_num', form.order === 'sale_num' && form.sort === 'desc' ? 'asc' : 'desc')">
            <span :class="{ 'mk-th-active': form.order === 'sale_num' }">成交量</span>
            <span class="mk-sort-arrows" :class="{ up: form.order === 'sale_num' && form.sort === 'asc' }">
              <i class="mk-tri up" /><i class="mk-tri down" />
            </span>
          </div>
        </div>

        <!-- 藏品列表（market_type 1/3） -->
        <template v-if="form.market_type == 1 || form.market_type == 3">
          <div v-for="t in list" :key="t.id" class="mk-row" @click="rowClick(t)">
            <img class="mk-row-img" :src="rowImg(t)" alt="" />
            <div class="mk-row-info">
              <p class="mk-row-name">{{ t.product && t.product.name ? t.product.name : '' }}</p>
              <p class="mk-row-sub">发行 {{ t.total_num || 0 }} 流通 {{ t.flux || '—' }}</p>
            </div>
            <span v-if="t.is_out == 0" class="mk-row-price">
              ¥ {{ t.goods_type != 1 ? t.min_price : t.price }}
            </span>
            <span v-else class="mk-row-price mk-row-out">已退市</span>
            <span class="mk-row-vol">{{ t.deal_num || '—' }}</span>
          </div>
        </template>

        <!-- 盲盒列表（market_type 2）：flex-js-sb flex-w > MarketCard(staticClass mb-4 mt-8)；卡片 width:100% ⇒ 一列满宽 -->
        <div v-else class="mk-box-grid">
          <MarketCard v-for="t in list" :key="t.id" class="mb-4 mt-8" :market="t" />
        </div>

        <!-- 原站 w-loading(emptyType:"search", emptyTop:"100", type:loading) -->
        <div v-if="loading === 'loading'" class="mk-wloading">
          <span class="mk-wloading-spinner" />
          <span class="mk-wloading-text">加载中</span>
        </div>
        <div v-else-if="loading === 'empty'" class="mk-wempty">
          <img class="mk-wempty-img" src="/assets/img/market/search-empty.png" alt="" />
        </div>

        <div v-if="loading === 'none' && list.length" class="mk-foot">已展示全部藏品</div>
        <div class="mk-body-bottom" />
      </div>

      <div class="mk-tabbar-placeholder" />
      <TabBar current="/pages/market/market" />
    </div>
  </div>
</template>

<script setup>
/**
 * 市场页 —— 原站 `pages/market/market`
 *
 * 反编译：chunk `pages-market-market.24482309.js`
 *   页面 script `5599` / render `1983` / 页面 CSS 未随包下载（mk-* 规则经原站 Playwright 实测回填）
 *   子组件 MarketCard：5504(script) / 1fe9(render) / CSS d497(scope 6fe165cf)
 *   全局组件：w-loading(a6cf script / 0f20 render / empty 配置表 7a32)
 *
 * 原站 script `5599` 逐字逻辑（Vue2 → Vue3 等价迁移，行为不变）：
 *   data: { tabList:[{藏品,2},{盲盒,1}], marketTabList:[{数字藏品,1},{盲盒,2},{权益资产,3}],
 *           current:2, form:{goods_type:2,page:1,list_rows:10,series_id:"",market_type:1,
 *           order:"",keywords:"",sort:""}, loading:"none", list:[], searchShow:!1, onlyActivity:!1 }
 *   onLoad         → getList(form); uni.hideTabBar(); initDefaultSeries()
 *   onPullDownRefresh → form.page=1; list=[]; loading="none"; getList(form)
 *   onReachBottom  → 1==form.goods_type && loadMoreBox()
 *   changeTab(a)   → current=goodsType; form.goods_type=goodsType; page=1; series_id=7;
 *                    goods_type==1 ? (form.new=1, form.price=null) : (delete form.new, form.price);
 *                    list=[]; getList(form)
 *   changeMarketTab(a) → current=2; form.goods_type=2; form.market_type=marketType;
 *                    market_type==1 ? series_id="" : ==2 ? series_id=3 : ==-2;
 *                    page=1; list=[]; getList(form)
 *   changeSeries(a) → copy=copyObj(form); copy.series_id=a; copy.page=1; list=[];
 *                    form.series_id=a; getList(copy)
 *   changeFilter(a) → key/value; "new"→delete form.price; "price"→delete form.new;
 *                    form[key]=value; page=1; list=[]; getList(form)
 *   sortAfter(a)   → a.map((item,i)=>list[i]=item)
 *   getList(a)     → 2==a.goods_type ? getCollectionList(a) : getBoxList(a)
 *   loadMoreBox()  → copy=copyObj(form); copy.page++; getBoxList(copy)
 *   getBoxList(a)  → loading!="loading" 时：loading="loading"; getMarketBoxList(a).then(d=>{
 *                      loading="none"; d.data.total||(loading="empty");
 *                      d.data.data.length&&(form=a); d.data.data.map(item=>list.push(item)) })
 *   changeMarketSort(a,t) → form.order=a; form.sort=t; page=1; list=[]; getList(form)
 *   getCollectionList(a) → loading="loading"; a.add_deal_num=!0; getMarketList(a).then(r=>{
 *                      loading="none"; r.data.length==0&&(loading="empty");
 *                      r.data.length&&(list=r.data, form=a) })
 *   initDefaultSeries() → dispatch goods/getSeries → collectionSeries.find(is_def) → changeSeries(series_id)
 *   goRanking / toggleActivity / rowClick / tabClick 均逐字迁移
 *
 * 搜索框 input 事件（render 1983）：changeMarketTab({marketType: form.market_type})
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import MarketCard from '@/components/market/MarketCard.vue'
import { getMarketList, getMarketBoxList, getMarketSeries } from '@/api'
import { OSS_URL } from '@/config'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

/* ---- data（5599） ---- */
const tabList = [{ name: '藏品', goodsType: 2 }, { name: '盲盒', goodsType: 1 }]
const marketTabList = [
  { name: '数字藏品', marketType: 1 },
  { name: '盲盒', marketType: 2 },
  { name: '权益资产', marketType: 3 }
]
const current = ref(2)
const form = ref({
  goods_type: 2,
  page: 1,
  list_rows: 10,
  series_id: '',
  market_type: 1,
  order: '',
  keywords: '',
  sort: ''
})
const loading = ref('none')
const list = ref([])
const searchShow = ref(false)
const onlyActivity = ref(false)
const series = ref([])

/* ---- computed ---- */
/** cateTabs：[{id:0,name:"全部"}] + collectionSeries.map(series_id/series_name) */
const cateTabs = computed(() =>
  [{ id: 0, name: '全部' }].concat(
    (series.value || []).map((t) => ({ id: t.series_id, name: t.series_name }))
  )
)

/** zoneCards：大区卡片；fluctuation 公式逐字保留原站写法 */
const zoneCards = computed(() =>
  (series.value || []).map((t) => ({
    id: t.series_id,
    name: t.series_name,
    current_price: t.current_price,
    change_price: t.change_price,
    fluctuation: t.change_price
      ? '0%'
      : ((t.change_price / (t.current_price - t.change_price)) * 100).toFixed(2) + '%'
  }))
)

/* ---- methods ---- */
function copyObj(o) {
  return JSON.parse(JSON.stringify(o))
}

/** 搜索框 input（render 1983：input → changeMarketTab({marketType: form.market_type})） */
function onSearchInput() {
  changeMarketTab({ marketType: form.value.market_type })
}

function changeTab(a) {
  const t = a.goodsType
  current.value = t
  form.value.goods_type = t
  form.value.page = 1
  form.value.series_id = 7
  if (form.value.goods_type == 1) {
    form.value.new = 1
    form.value.price = null
  } else {
    delete form.value.new
    delete form.value.price
  }
  list.value = []
  getList(form.value)
}

function changeMarketTab(a) {
  const t = a.marketType
  current.value = 2
  form.value.goods_type = 2
  form.value.market_type = t
  if (t == 1) form.value.series_id = ''
  if (t == 2) form.value.series_id = 3
  if (t == 3) form.value.series_id = -2
  form.value.page = 1
  list.value = []
  getList(form.value)
}

function sortAfter(a) {
  a.map((item, i) => {
    list.value[i] = item
  })
}

function changeSeries(a) {
  const t = copyObj(form.value)
  t.series_id = a
  t.page = 1
  list.value = []
  form.value.series_id = a
  getList(t)
}

function changeFilter(a) {
  const t = a.key
  const d = a.value
  if (t == 'new') form.value.price && delete form.value.price
  if (t == 'price') form.value.new && delete form.value.new
  form.value[t] = d
  form.value.page = 1
  list.value = []
  getList(form.value)
}

function getList(a) {
  if (a.goods_type == 2) getCollectionList(a)
  else getBoxList(a)
}

function loadMoreBox() {
  const a = copyObj(form.value)
  a.page++
  getBoxList(a)
}

async function getBoxList(a) {
  if (loading.value == 'loading') return
  loading.value = 'loading'
  const d = await getMarketBoxList(a)
  loading.value = 'none'
  if (!d.data || !d.data.total) loading.value = 'empty'
  if (d.data && d.data.data && d.data.data.length) {
    form.value = a
    d.data.data.map((item) => list.value.push(item))
  }
}

function changeMarketSort(a, t) {
  form.value.order = a
  form.value.sort = t
  form.value.page = 1
  list.value = []
  getList(form.value)
}

async function getCollectionList(a) {
  loading.value = 'loading'
  a.add_deal_num = true
  const r = await getMarketList(a)
  loading.value = 'none'
  if (!r.data.length) loading.value = 'empty'
  if (r.data.length) {
    list.value = r.data
    form.value = a
  }
}

async function initDefaultSeries() {
  const res = await getMarketSeries()
  series.value = res.data || []
  const t = series.value || []
  const d = t.find((x) => x.is_def)
  if (d) changeSeries(d.series_id)
}

function goRanking() {
  router.push('/pages/marketCapRanking/marketCapRanking')
}

function toggleActivity() {
  onlyActivity.value = !onlyActivity.value
}

/** rowClick：未登录进 Demo 登录；goods_type!=1 → marketGoodsList，否则 → detail */
function rowClick(a) {
  if (!a.id) return
  if (!userStore.isLogin) {
    userStore.loginDemo()
    return
  }
  if (a.goods_type != 1) {
    router.push(`/pages/market/marketGoodsList?id=${a.product.id}&goodsType=${a.goods_type}`)
  } else {
    router.push(`/pages/market/detail?id=${a.id}`)
  }
}

function tabClick(a) {
  switch (a) {
    case 0:
      router.push('/pages/index/index')
      break
    case 1:
      router.push('/pages/market/market')
      break
    case 2:
      router.push('/pages/notice/notice')
      break
    case 3:
      router.push('/pages/activity/activity')
      break
    case 4:
      router.push('/pages/my/my')
      break
  }
}

/** 行封面：$ossUrl + product.listimg；本地资源（/ 开头）直接用 */
function rowImg(t) {
  const src = (t.product && t.product.listimg) || t.listimg || ''
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/')) return src
  return OSS_URL + src
}

/* ---- onReachBottom（H5：window 滚动到底，仅 goods_type==1） ---- */
function onScroll() {
  if (form.value.goods_type != 1) return
  const doc = document.documentElement
  if (window.scrollY + doc.clientHeight >= doc.scrollHeight - 40) loadMoreBox()
}

onMounted(() => {
  getList(form.value)
  initDefaultSeries()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* rpx 换算：390 / 750 = 0.52；像素值取自原站 Playwright 实测（iPhone 390 宽） */
.mk-bg {
  min-height: 100vh;
  background: #060504;
}
.mk-page {
  min-height: 100vh;
  padding-bottom: 104px;
}

/* ---- 搜索栏（实测：row pad 10 12 0 20 / h 43） ---- */
.mk-search-row {
  display: flex;
  align-items: center;
  padding: 10px 12px 0 20px;
}
.mk-search {
  flex: 1;
  height: 33px;
  border-radius: 17px;
  background: #211c15;
  border: 1px solid #6c5737;
  display: flex;
  align-items: center;
  padding: 0 15px;
}
.mk-search-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
.mk-search-input {
  flex: 1;
  min-width: 0;
  margin-left: 8px;
  padding: 0;
  font-size: 12px;
  line-height: 16.8px;
  height: 16.8px;
  color: #d8c8ab;
  background: transparent;
  border: none;
  outline: none;
}
.mk-search-input::placeholder {
  color: #8a7c63;
}
.mk-rank {
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
  color: #f4dcaa;
  padding: 0 8px 0 17px;
  white-space: pre-line;
  cursor: pointer;
}

/* ---- 大区卡片（实测：scroll mar-top 15 / zone 108×85） ---- */
.mk-zones-scroll {
  margin-top: 15px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.mk-zones-scroll::-webkit-scrollbar {
  display: none;
}
.mk-zones {
  display: inline-flex;
  padding: 0 23px;
  white-space: nowrap;
}
.mk-zone {
  width: 108px;
  height: 85px;
  flex-shrink: 0;
  margin-right: 8px;
  border-radius: 8px;
  background: #1d1a15;
  border: 1px solid #665334;
  padding: 8px 9px;
  display: flex;
  flex-direction: column;
}
.mk-zone:last-child {
  margin-right: 0;
}
.mk-zone-head {
  display: flex;
  align-items: center;
}
.mk-zone-tag {
  background: #f4dcaa;
  border-radius: 4px;
  font-size: 7px;
  font-weight: 700;
  line-height: 10px;
  color: #372816;
  padding: 1px 4px;
  margin-right: 5px;
  flex-shrink: 0;
}
.mk-zone-name {
  font-size: 10px;
  line-height: 15px;
  color: #f2e6cf;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mk-zone-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 9px;
}
.mk-zone-price {
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  color: #fff0d1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mk-zone-chart {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.mk-zone-foot {
  display: flex;
  align-items: center;
  margin-top: auto;
}
.mk-zone-trend {
  width: 8px;
  height: 6px;
  flex-shrink: 0;
}
.mk-zone-change {
  font-size: 8px;
  font-weight: 700;
  line-height: 9px;
  color: #f4dcaa;
  margin-left: 4px;
}
.mk-zone-vol {
  font-size: 8px;
  line-height: 9px;
  color: #aba08e;
  margin-left: auto;
}

/* ---- 分类 tab + 只看活动（实测：cate pad 20 20 0 / item pad 0 11 8 / h 46） ---- */
.mk-cate {
  display: flex;
  align-items: center;
  padding: 20px 20px 0;
}
.mk-cate-scroll {
  flex: 1;
  min-width: 0;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
}
.mk-cate-scroll::-webkit-scrollbar {
  display: none;
}
.mk-cate-item {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  padding: 0 11px 8px;
  line-height: 18px;
  font-size: 11px;
  color: #989a9c;
  cursor: pointer;
}
.mk-cate-item.active {
  font-weight: 700;
  color: #f4dcaa;
}
.mk-cate-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 23px;
  height: 2px;
  border-radius: 1px;
  background: #f4dcaa;
}
.mk-activity {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 10px;
  font-size: 10px;
  line-height: 15px;
  color: #d0c9bb;
  cursor: pointer;
}
.mk-act-toggle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #9d927e;
  margin-right: 5px;
  flex-shrink: 0;
}
.mk-act-toggle.on {
  background: #f4dcaa;
  border-color: #f4dcaa;
}

/* ---- 列表主体（实测：body pad 0 23） ---- */
.mk-body {
  padding: 0 23px;
}
.mk-thead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 31px;
  margin-top: 13px;
  border-bottom: 1px solid #231f1e;
}
.mk-th-name {
  width: 55%;
  font-size: 9px;
  line-height: 13px;
  color: #989a9c;
}
.mk-th-sort {
  display: flex;
  align-items: center;
  font-size: 9px;
  line-height: 13px;
  color: #989a9c;
  cursor: pointer;
}
.mk-th-sort .mk-th-active {
  color: #f4dcaa;
}
.mk-sort-arrows {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 4px;
}
.mk-tri {
  width: 0;
  height: 0;
  border-left: 2px solid transparent;
  border-right: 2px solid transparent;
}
.mk-tri.up {
  border-bottom: 3px solid #cbc8c2;
  margin-bottom: 1px;
}
.mk-tri.down {
  border-top: 3px solid #cbc8c2;
}
.mk-sort-arrows.up .mk-tri.up {
  border-bottom-color: #f4dcaa;
}
.mk-sort-arrows.up .mk-tri.down {
  border-top-color: rgba(203, 200, 194, 0.35);
}

.mk-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #231f1e;
  cursor: pointer;
}
.mk-row-img {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #1d1a15;
  flex-shrink: 0;
  object-fit: cover;
}
.mk-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-left: 9px;
}
.mk-row-name {
  margin: 0;
  font-size: 11px;
  line-height: 16px;
  color: #f8f8f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mk-row-sub {
  margin: 6px 0 0;
  font-size: 8px;
  line-height: 11px;
  color: #918b80;
}
.mk-row-price {
  width: 88px;
  text-align: right;
  font-size: 14px;
  line-height: 16px;
  font-weight: 700;
  color: #f8f8f8;
}
.mk-row-out {
  font-size: 10px;
  color: #989a9c;
}
.mk-row-vol {
  width: 78px;
  text-align: right;
  font-size: 13px;
  line-height: 16px;
  font-weight: 700;
  color: #f8f8f8;
}

/* 盲盒网格（market_type 2）：原站 flex.flex-js-sb.flex-w；卡片 width:100% ⇒ 一列满宽 */
.mk-box-grid {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
/* 原站 MarketCard staticClass mb-4/mt-8（d497 解码值），经 Vue3 scoped 作用于子组件根节点 */
.mb-4 {
  margin-bottom: 4.16px;
}
.mt-8 {
  margin-top: 8.32px;
}

/* 原站 w-loading：u-loading-icon(size 14 / circle / #4478FF / vertical / textColor #fff) */
.mk-wloading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}
.mk-wloading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(68, 120, 255, 0.25);
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: mkSpin 0.8s linear infinite;
}
.mk-wloading-text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
}
@keyframes mkSpin {
  to {
    transform: rotate(360deg);
  }
}
/* 原站 w-loading 空态（emptyType:"search" → 空配置 {}，仅图）；
   容器 marginTop:2*100rpx=104px / paddingBottom:260rpx=135.2px / 图宽 234rpx=121.68px widthFix */
.mk-wempty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 104px;
  padding-bottom: 135.2px;
}
.mk-wempty-img {
  width: 121.68px;
  height: 121.68px;
}

.mk-foot {
  text-align: center;
  padding: 20px 0 0;
  font-size: 9px;
  line-height: 13px;
  color: #706b61;
}
.mk-body-bottom {
  height: 20px;
}

.mk-tabbar-placeholder {
  height: 104px;
}
</style>
