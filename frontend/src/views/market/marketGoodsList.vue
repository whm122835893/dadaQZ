<template>
  <!--
    原站 pages/market/marketGoodsList（专辑列表 / 市场购买链路首页）
      script 模块 48cc / render 逻辑见下（page 壳 w-container.mgl-page#market-list）
      路由参数：id（专辑 collection id）、goodsType（默认 2）
      4 tab：寄售(0) / 求购(1) / 委托(2) / 成交(3)
      行点击 → /pages/market/detail?id=
      底部操作条：寄售=快捷下单(弹支付方式) / 求购=求购 / 委托=委托 / 成交=空
  -->
  <div id="market-list" class="mgl-page" :class="{ able: list.length > 0 }">
    <!-- ============ 导航栏（原站 w-navbar navType=marketGoods） ============ -->
    <div class="mgl-navbar" :style="{ backgroundColor: bgColor }">
      <div class="mgl-navbar__side mgl-navbar__side--left" @click="goBack">
        <img class="mgl-navbar__icon" src="/assets/img/order/back-btn-white.webp" alt="" />
      </div>
      <div class="mgl-navbar__title">专辑列表</div>
      <div class="mgl-navbar__side mgl-navbar__side--right" @click="targetLike">
        <img class="mgl-navbar__icon" :src="likeIcon" alt="" />
      </div>
    </div>

    <!-- ============ 专辑卡 ============ -->
    <div class="mgl-card">
      <div class="mgl-coverwrap">
        <img class="mgl-cover" :src="coverUrl" alt="" />
      </div>
      <div class="mgl-info">
        <div class="mgl-name">{{ product.name ? handleLang(product.name) : '' }}</div>
        <div class="mgl-publisher">
          <img class="mgl-publisher-icon" src="/static/image/market-gold/icon-publisher.webp" alt="" />
          <span class="mgl-publisher-name">{{ publisherName }}</span>
        </div>
        <div class="mgl-pills">
          <img class="mgl-pill-arrow" src="/static/image/market-gold/left.webp" alt="" @click="toMyCollection" />
          <img class="mgl-pill-arrow" src="/static/image/market-gold/right.webp" alt="" @click="searchFn" />
        </div>
      </div>
      <div class="mgl-stats">
        <div class="mgl-stat-col">
          <div class="mgl-stat"><div class="mgl-stat-value">{{ product.total_num || 0 }} 份</div></div>
          <div class="mgl-title mgl-title--left">限量 / limited edition</div>
        </div>
        <div class="mgl-stat-col mgl-stat-col--right">
          <div class="mgl-stat"><div class="mgl-stat-value">{{ product.flux || 0 }} 份</div></div>
          <div class="mgl-title mgl-title--right">流通 / Circulation quantity</div>
        </div>
      </div>
    </div>

    <!-- ============ 主体：tabs + 列表 ============ -->
    <div class="mgl-body">
      <div class="mgl-tabs">
        <div class="mgl-tabs__nav">
          <div
            v-for="(t, i) in tabList"
            :key="i"
            class="mgl-tabs__item"
            :class="{ 'is-active': tabCurrent === i }"
            @click="onTabChange(i)"
          >
            {{ t.name }}
          </div>
          <!-- 原站 u-tabs 的下划线（被激活 tab 的 pill 覆盖，实际不可见，此处保留结构） -->
          <div class="mgl-tabs__line" :style="{ left: lineLeft }"></div>
        </div>
      </div>

      <div class="mgl-scrollwrap">
        <div class="tab-view-scroll" @scroll="onScrollList">
          <!-- 委托 tab -->
          <EntrustList v-show="tabCurrent === 2" ref="entrustList" :product="product" :id="id" />
          <!-- 寄售 / 求购 / 成交 tab -->
          <MGoodsList
            v-show="product.is_img_diff != 1 && tabCurrent != 4"
            :list="list"
            :tab-current="tabCurrent"
            :info="dealInfo"
            :search="search"
            :product="product"
          />
          <!-- 专属图（is_img_diff==1）寄售宫格 -->
          <div v-if="product.is_img_diff == 1 && tabCurrent === 0" class="mgl-pfp-list">
            <div v-for="(item, i) in list" :key="i" class="mgl-pfp" @click="toDetails(item)">
              <img class="mgl-pfp__img" :src="imgUrl(item.img)" alt="" />
              <div class="mgl-pfp-card">
                <div class="mgl-pfp__top">
                  <span class="font-size-14 mgl-pfp-name font-w-500">{{ item.name ? handleLang(item.name) : '' }}</span>
                </div>
                <div class="mgl-pfp__bottom">
                  <span class="font-size-14 mgl-pfp-code">#{{ item.collection_code }}</span>
                  <span class="font-size-10 mgl-pfp-total">/{{ item.total_num }}</span>
                </div>
                <div class="mgl-pfp-price">
                  <span class="font-size-14">￥</span><span class="font-size-14">{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 空态：寄售 tab 显示「该藏品已退市」 -->
          <div v-if="!list.length && tabCurrent === 0" class="mgl-out">
            <img class="mgl-empty" src="/static/empty/search-empty.webp" alt="" />
            <div class="mgl-out-text"> 该藏品已退市 </div>
          </div>
          <!-- 空态：求购 tab -->
          <div v-if="!list.length && tabCurrent === 1" class="mgl-empty-box">
            <img class="mgl-empty" src="/static/empty/search-empty.webp" alt="" />
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 底部操作条 ============ -->
    <div class="action mgl-action">
      <!-- 批量购买（product.batch_pay && list.length && tabCurrent==0） -->
      <div
        v-if="product.batch_pay && list.length && tabCurrent === 0"
        class="z-btn btn-size-lg circle mgl-btn-outline mtb-10 batch-btn"
        @click="showBatch = true"
      >
        批量购买
      </div>
      <!-- 快捷下单（原站 w-button style="flex:1"） -->
      <div v-show="list.length && tabCurrent === 0" class="z-btn btn-size-lg circle mgl-btn-gold mtb-10 action-btn" @click="showCreate = true">
        快捷下单
      </div>
      <!-- 已退市（原站 w-button style="flex:1"） -->
      <div v-show="!list.length && tabCurrent === 0" class="z-btn btn-size-lg circle mgl-btn-disabled mtb-10 action-btn" @click="showCreate = true">
        已退市，暂不可下单
      </div>
      <!--
        批量出售（原站 w-button style="flex:1;margin-right:30rpx"）
      -->
      <div
        v-show="tabCurrent === 1 && userInfo.is_batch_beg_sell == 1"
        class="z-btn btn-size-lg circle mgl-btn-outline mtb-10 action-btn action-btn--mr"
        @click="showBatchBegSell = true"
      >
        批量出售
      </div>
      <!-- 求购（原站 w-button style="flex:1"） -->
      <div v-show="tabCurrent === 1" class="z-btn btn-size-lg circle mgl-btn-gold mtb-10 action-btn" @click="toBeg">求购</div>
      <!-- 委托（原站 w-button style="flex:1"） -->
      <div v-show="tabCurrent === 2" class="z-btn btn-size-lg circle mgl-btn-gold mtb-10 action-btn" @click="toEntrust">委托</div>
    </div>

    <!-- ============ 选择支付方式弹窗 ============ -->
    <div v-if="showCreate" class="mgl-popup-mask" @click.self="showCreate = false">
      <div class="mgl-popup">
        <div class="title flex flex-ai-center">
          <div class="flex-1"></div>
          <div class="flex-1 font-color-black font-w-600"> 选择支付方式 </div>
          <div class="flex-center mgl-popup__close" @click="showCreate = false"><span class="uicon-close"></span></div>
        </div>
        <div
          v-for="p in basePayList"
          :key="p.pay_way"
          class="flex flex-js-sb mlr-8 ptb-12 mgl-popup__payrow"
          @click="checkFn(p)"
        >
          <div class="flex flex-ai-center">
            <img class="mgl-popup__payicon" :src="'/static/icon/' + p.icon + '.png'" alt="" />
            <span class="ml-8" :class="p.able && p.check ? 'font-color-black' : 'font-color-999'">{{ p.name }}</span>
          </div>
          <img v-if="p.check" class="mgl-popup__radio" src="/static/icon/checked-icon-blue.png" alt="" />
          <img v-else class="mgl-popup__radio mgl-popup__radio--off" src="/static/icon/uncheck-icon.png" alt="" />
        </div>
        <div class="z-btn btn-size-lg circle mt-30 mgl-popup__confirm" :class="{ disabled: disable }" @click="checkCaptcha">
          确认
        </div>
      </div>
    </div>

    <!-- ============ 选择出售数量弹窗（批量出售） ============ -->
    <div v-if="showBatchBegSell" class="mgl-popup-mask" @click.self="showBatchBegSell = false">
      <div class="mgl-popup">
        <div class="title flex flex-ai-center">
          <div class="flex-1"></div>
          <div class="flex-1 font-color-black font-w-600"> 选择出售数量 </div>
          <div class="flex-center mgl-popup__close" @click="showBatchBegSell = false"><span class="uicon-close"></span></div>
        </div>
        <div class="mgl-popup__numrow">
          <div> 数量： </div>
          <div class="mgl-popup__numbtn mgl-popup__numbtn--minus" @click="sellNumber = Math.max(1, sellNumber - 1)"> - </div>
          <input v-model.number="sellNumber" class="mgl-popup__numinput" type="number" />
          <div class="mgl-popup__numbtn mgl-popup__numbtn--plus" @click="sellNumber = sellNumber + 1"> + </div>
        </div>
        <div class="z-btn btn-size-lg circle mt-30 mgl-popup__confirm" @click="tobegBatchSell">确认</div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 市场专辑列表页 —— 原站 pages/market/marketGoodsList
 *
 * 反编译依据（pages-market-marketGoodsList.e57897bb.js）：
 *   render 页面壳：w-container.mgl-page#market-list
 *     w-navbar(专辑列表 / navType=marketGoods 右侧心形)
 *     .mgl-card（封面 / 名称 / 发行方 / 我拥有的 / 相关公告 / 限量 / 流通）
 *     .mgl-body → .mgl-tabs(u-tabs) + .tab-view-scroll(u-scroll-view)
 *       EntrustList(委托) / mGoodsList(寄售·求购·成交) / 空态
 *     u-popup(选择支付方式) / u-popup(选择出售数量)
 *     .action.mgl-action（快捷下单 / 批量出售 / 求购 / 委托）
 *   logic 页面逻辑：getInfo / reGetList / getMarketList / getBegList / getSellList /
 *                   loadMore / onTabChange / targetLike / payTypeInit / checkCaptcha /
 *                   fastCreate / checkFn / searchFn / toBeg / toEntrust / tobegBatchSell
 *
 * ★ 复刻要点：
 *   1. 成交汇总卡「今日最低」取的是 today_highest_price（原站渲染 bug）
 *   2. 委托 tab 汇总条数字来自 PrepaymentListMain 的 total_amount / total_number
 *   3. 页面本体不可滚动，仅 .tab-view-scroll 内部滚动（scrolltolower → loadMore）
 */
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMarketGoodsInfo, getMarketGoodsList, getBegBuyList, getSellInfo, fastCreateOrder, collectToggle } from '@/api'
import { BASE_PAY_LIST } from '@/api/mock'
import { OSS_URL } from '@/config'
import { useUserStore } from '@/stores/user'
import { useConfigStore } from '@/stores/config'
import { toast } from '@/utils/toast'
import MGoodsList from '@/components/market/MGoodsList.vue'
import EntrustList from '@/components/market/EntrustList.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const configStore = useConfigStore()

/* ---------------- 原站 data ---------------- */
const basePayList = ref(BASE_PAY_LIST.map((x) => ({ ...x })))
const id = ref('')
const goodsType = ref('2')
const loading = ref(false)
const title = ref('')
const product = ref({})
const list = ref([])
const showCreate = ref(false)
const showBatchBegSell = ref(false)
const showBatch = ref(false)
const search = reactive({ page: 1, sort: 'price', order: 'asc', type: 2, keyword: '', id: '' })
const firstError = ref(false)
const loadingType = ref('none')
const sellNumber = ref(1)
const opacity = ref(0)
const pageTitle = ref(null)
const bgColorType = ref('black')
const dealInfo = ref({})
const sale_num = ref(0)

/** 原站 tabList：寄售 / 求购 / 委托 / 成交 */
const tabList = [
  { name: '寄售', types: 1 },
  { name: '求购', types: 2 },
  { name: '委托', types: 3 },
  { name: '成交', types: 4 }
]
const tabCurrent = ref(0)

/** 原站 sortMap：按价格 / 按编号 */
const sortMap = [
  { title: '按价格排序', key: 'price', order: 'asc' },
  { title: '按编号排序', key: 'collection_code', order: 'desc' }
]

const entrustList = ref(null)

/* ---------------- 原站 computed ---------------- */
const userInfo = computed(() => userStore.userInfo || {})
const appConfig = computed(() => configStore.config || {})
/** 原站 computed publisherName */
const publisherName = computed(() =>
  product.value.publisher && product.value.publisher.name
    ? handleLang(product.value.publisher.name)
    : handleLang(appConfig.value.appName || '嗒嗒Tata')
)
/** 原站 computed getLike */
const likeIcon = computed(() => (product.value.is_like ? '/static/icon/has-like.png' : '/static/icon/no-like.png'))
/** 原站 computed bgColor（mixin 72d9） */
const bgColor = computed(() =>
  bgColorType.value === 'black' ? `rgba(51, 51, 51, ${opacity.value})` : `rgba(255, 255, 255, ${opacity.value})`
)
/** 原站 computed disable：没有选中支付方式时禁用确认按钮 */
const disable = computed(() => !basePayList.value.map((a) => a.check).includes(true))
/** 下划线位置（激活 tab 中心） */
const lineLeft = computed(() => `calc(${tabCurrent.value * 25}% + 12.5% - 10px)`)
const coverUrl = computed(() => (product.value.main_image ? imgUrl(product.value.main_image) : ''))

/* ---------------- 原站 methods ---------------- */
/** 原站 handleLang → converter（中文站原样返回） */
function handleLang(s) {
  return s == null ? '' : s
}

/** 原站 w-image 的 targetSrc 规则 */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/static') || src.startsWith('/assets')) return src
  return OSS_URL + src
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/market/market')
}

/** 原站 toPage('/pages/myCollection/myCollection') */
function toMyCollection() {
  router.push('/pages/myCollection/myCollection')
}

/** 原站 searchFn → /pages/notice/search?keyword=产品名 */
function searchFn() {
  router.push({ path: '/pages/notice/search', query: { keyword: product.value.name } })
}

/** 原站 toDetails（专属图宫格点击） */
function toDetails(item) {
  router.push({ path: '/pages/market/detail', query: { id: item.id } })
}

/** 原站 targetLike：收藏 / 取消收藏 */
async function targetLike() {
  if (!userStore.isLogin) {
    toast('请先登录')
    return
  }
  const next = product.value.is_like > 0 ? 0 : 1
  try {
    const res = await collectToggle(product.value.is_like, { types: product.value.goods_type, id: product.value.id })
    toast((res && res.msg) || '')
    product.value.is_like = next
  } catch (e) {
    toast('操作失败')
  }
}

/** 原站 payTypeInit：按用户信息刷新支付方式可用状态
 *  able = 用户是否开通该渠道（未登录/信息未就绪时回退到列表自带 able）
 *  check = 可用且等于 appConfig.default_pay_type 时默认选中 */
function payTypeInit() {
  basePayList.value = basePayList.value.map((A) => {
    const able = userInfo.value[A.auth_key] === undefined ? A.able : !!userInfo.value[A.auth_key]
    return { ...A, able, check: able && A.pay_way === appConfig.value.default_pay_type }
  })
}

/** 原站 checkFn：单选支付方式 */
function checkFn(p) {
  basePayList.value = basePayList.value.map((A) => ({ ...A, check: A.pay_way === p.pay_way ? !A.check : false }))
}

/** 原站 checkCaptcha → fastCreate */
function checkCaptcha() {
  fastCreate()
}

/** 原站 fastCreate：POST /order/pay/fastOrderNew → PayClass（doPay 跳转 pay.url） */
async function fastCreate() {
  const checked = basePayList.value.find((a) => a.check)
  if (!checked) return
  try {
    const res = await fastCreateOrder({ goods_id: product.value.id, key: product.value.key, pay_way: checked.pay_way })
    showCreate.value = false
    const data = (res && res.data) || {}
    /* 原站 PayClass({pay_type:4, order_number:order_sn, order_type:2, pay_way, order_id})
       → doPay → H5 端跳转 pay.url；本项目未接入支付渠道，保持与深色版一致 */
    toast('暂未接入支付渠道')
    console.log('[marketGoodsList] fastCreateOrder →', { order_sn: data.order_sn, order_id: data.order_id, pay_way: checked.pay_way })
  } catch (e) {
    toast('下单失败')
  }
}

/** 原站 toBeg → /pages/market/submitBegBuy?id= */
function toBeg() {
  router.push({ path: '/pages/market/submitBegBuy', query: { id: id.value } })
}

/** 原站 toEntrust → /pages/market/submitEntrust?id= */
function toEntrust() {
  router.push({ path: '/pages/market/submitEntrust', query: { id: id.value } })
}

/** 原站 tobegBatchSell → /pages/market/sellBegBuy?collection_id&pay_way&number= */
function tobegBatchSell() {
  if (!product.value.is_has) {
    toast('当前未持有该藏品')
    return
  }
  const checked = basePayList.value.find((a) => a.check)
  router.push({
    path: '/pages/market/sellBegBuy',
    query: {
      collection_id: product.value.id,
      pay_way: checked ? checked.pay_way : '',
      number: sellNumber.value
    }
  })
}

/** 原站 onTabChange */
function onTabChange(index) {
  tabCurrent.value = index
  reGetList(index)
}

/** 原站 loadMore：page++ 后按当前 tab 重新拉取（不重置 list） */
function loadMore() {
  search.page = search.page + 1
  reGetList(tabCurrent.value, false)
}

/** 原站 reGetList：按 tab 分派数据源 */
function reGetList(index = 0, reset = true) {
  if (reset) {
    list.value = []
    search.page = 1
  }
  if (index === 0) {
    search.type = 2
    search.id = id.value
    getMarketList({ ...search })
  } else if (index === 1) {
    search.sort = 'desc'
    search.collection_id = id.value
    getBegList({ ...search })
  } else if (index === 3) {
    search.status = 1
    search.goods_id = id.value
    getSellList({ ...search })
  } else if (index === 2) {
    search.sort = 'desc'
    search.collection_id = id.value
    if (entrustList.value) entrustList.value.getList({ ...search })
  }
}

/** 原站 getMarketList：POST /market/market/getMarketGoodsListByGoodsId */
async function getMarketList(params) {
  if (loadingType.value === 'loading') return
  loadingType.value = 'loading'
  const p = { ...params }
  if (tabCurrent.value !== 0) {
    const sort = sortMap.find((x) => x.key === p.sort)
    p.order = sort ? sort.order : p.order
  }
  try {
    const res = await getMarketGoodsList(p)
    const d = (res && res.data) || {}
    const rows = d.list || []
    loadingType.value = 'none'
    if (rows.length) {
      search.sort = p.sort
      search.order = p.order
      search.page = p.page
      list.value = list.value.concat(rows)
    }
    if (rows.length < 1 && p.page === 1) loadingType.value = 'empty'
    firstError.value = false
    if (tabCurrent.value === 0) sale_num.value = d.count || 0
  } catch (e) {
    if (p.page === 1) firstError.value = true
    loadingType.value = 'none'
  }
}

/** 原站 getBegList：POST /market/trade/begBuyList */
async function getBegList(params) {
  loadingType.value = 'loading'
  const p = { ...params }
  const res = await getBegBuyList(p)
  const d = (res && res.data) || {}
  const rows = d.data || []
  if (p.page === 1) list.value = []
  loadingType.value = 'none'
  if (rows.length) search.page = p.page
  list.value = list.value.concat(rows)
  if (rows.length < (d.per_page || 0)) loadingType.value = 'nomore'
  if (!d.total) loadingType.value = 'empty'
}

/** 原站 getSellList：POST /market/trade/tradingInformation（只取前 20 条） */
async function getSellList(params) {
  if (loadingType.value === 'loading' || loadingType.value === 'nomore') return
  loadingType.value = 'loading'
  const p = { ...params }
  const res = await getSellInfo(p)
  const d = (res && res.data) || {}
  const rows = d.list || []
  loadingType.value = 'none'
  dealInfo.value = {
    current_buying: d.current_buying,
    current_consignment: d.current_consignment,
    transaction_record_number: d.transaction_record_number,
    floor_price: d.floor_price,
    today_amount: d.today_amount,
    today_volume: d.today_volume,
    today_highest_price: d.today_highest_price,
    today_lowest_price: d.today_lowest_price
  }
  if (p.page === 1) list.value = []
  if (rows.length) search.page = p.page
  if (rows.length < (d.per_page || 0)) loadingType.value = 'nomore'
  if (!d.total) loadingType.value = 'empty'
  list.value = list.value.concat(rows).slice(0, 20)
}

/** 原站 getInfo：POST /market/market/marketGoodsDetail */
async function getInfo() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getMarketGoodsInfo({ id: id.value, type: goodsType.value })
    const p = (res && res.data) || {}
    product.value = p && p.length === 0 ? {} : p
    product.value.goods_type = goodsType.value
    title.value = product.value.name
    document.title = title.value || '专辑列表'
    reGetList()
  } finally {
    loading.value = false
  }
}

/** 原站 mixin 72d9：页面滚动渐变导航栏（本页不可滚动，仅保留语义） */
function scrollChange(t) {
  opacity.value = t >= 200 ? 1 : t / 200
  pageTitle.value = product.value.name && t >= 120 ? product.value.name : null
}
function onPageScroll(e) {
  scrollChange(e.target.scrollTop || document.documentElement.scrollTop || 0)
}

/** 原站 scroll-view scrolltolower → loadMore */
function onScrollList(e) {
  const el = e.target
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) loadMore()
}

onMounted(() => {
  id.value = route.query.id || ''
  goodsType.value = route.query.goodsType || '2'
  payTypeInit()
  getInfo()
  window.addEventListener('scroll', onPageScroll, { passive: true })
})

watch(
  () => userInfo.value,
  () => payTypeInit(),
  { deep: true }
)

watch(
  () => route.query.id,
  (v) => {
    if (v && v !== id.value) {
      id.value = v
      product.value = {}
      list.value = []
      getInfo()
    }
  }
)
</script>

<style scoped>
/* 原站 mgl-* 页面样式（H5 编译后保留 px，以下为实测值） */
#market-list {
  position: relative;
  min-height: 100vh;
  padding-bottom: 72px;
  background: radial-gradient(468px 364px at 50% -72px, rgba(130, 96, 59, 0.38), rgba(3, 3, 3, 0) 70%), #101115;
  color: #f8f8f8;
  font-size: 15px;
  line-height: normal;
}
#market-list.able {
  padding-bottom: calc(14px + 58px + env(safe-area-inset-bottom, 0px));
}

/* ============ 导航栏 ============ */
.mgl-navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 11;
  height: 44px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.mgl-navbar__side {
  padding: 0 13px;
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.mgl-navbar__side--left {
  left: 0;
}
.mgl-navbar__side--right {
  right: 0;
}
.mgl-navbar__icon {
  width: 24px;
  height: 24px;
  display: block;
}
.mgl-navbar__title {
  width: 208px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #f8f8f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============ 专辑卡 ============ */
.mgl-card {
  margin: 46px 18px 0;
  padding: 11px;
  border-radius: 12px;
  background: linear-gradient(135deg, #25200f, #17150f 58%, #101115);
  border: 0.5px solid #443722;
  display: flex;
  flex-wrap: wrap;
}
.mgl-coverwrap {
  width: 112px;
  height: 112px;
  padding: 4px;
  border: 1px solid #6f5831;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.mgl-card .mgl-cover {
  width: 102px;
  height: 102px;
  border-radius: 10px;
  display: block;
  object-fit: cover;
}
.mgl-card .mgl-info {
  flex: 1;
  min-width: 0;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}
.mgl-card .mgl-info .mgl-name {
  font-size: 15px;
  line-height: 22px;
  font-weight: 700;
  color: #f6e5bf;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mgl-card .mgl-info .mgl-publisher {
  display: flex;
  align-items: center;
  margin-top: 7px;
}
.mgl-card .mgl-info .mgl-publisher .mgl-publisher-icon {
  width: 11px;
  height: 13px;
}
.mgl-card .mgl-info .mgl-publisher .mgl-publisher-name {
  margin-left: 5px;
  font-size: 10px;
  line-height: 15px;
  color: #c3b79e;
}
.mgl-card .mgl-info .mgl-pills {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 26px;
  height: 30px;
}
.mgl-card .mgl-info .mgl-pills .mgl-pill-arrow {
  width: 48%;
  display: block;
}
.mgl-card .mgl-stats {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 11px;
  text-align: center;
}
.mgl-card .mgl-stats .mgl-stat {
  width: 147px;
  padding: 6px 8px;
  border-radius: 8px;
  background: #302819;
  border: 0.5px solid #5f4b2c;
  display: flex;
  flex-direction: column;
}
.mgl-card .mgl-stats .mgl-stat .mgl-stat-value {
  font-size: 11px;
  line-height: 16px;
  font-weight: 700;
  color: #f4dcaa;
}
.mgl-card .mgl-stats .mgl-title {
  font-size: 10px;
  line-height: 15px;
}
.mgl-title--left {
  margin-left: -15px;
  margin-top: 5px;
  color: #928675;
}
.mgl-title--right {
  margin-right: 10px;
  margin-top: 5px;
  color: #928675;
}
.mgl-stat-col {
  width: 50%;
}
.mgl-stat-col--right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* ============ tabs ============ */
.mgl-body {
  margin-top: 10px;
}
.mgl-body .mgl-tabs {
  margin: 0 18px;
  padding: 3px;
  border-radius: 15px;
  background: #171611;
  border: 0.5px solid #30291d;
}
.mgl-tabs__nav {
  position: relative;
  display: flex;
}
.mgl-tabs__item {
  flex: 1;
  height: 31px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  border-radius: 15px;
  background: transparent;
  color: #989a9c;
  font-size: 11px;
  font-weight: bold;
}
.mgl-tabs__item.is-active {
  background: #332917;
  color: #f4dcaa;
}
.mgl-tabs__line {
  position: absolute;
  bottom: 2px;
  width: 20px;
  height: 6px;
  border-radius: 100px;
  background: #f4dcaa;
  transition: left 0.3s;
}

/* ============ 列表滚动区 ============ */
.mgl-scrollwrap {
  margin-top: 10px;
}
.mgl-body .tab-view-scroll {
  height: 416px;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 10px;
  -webkit-overflow-scrolling: touch;
}
.mgl-body .mgl-pfp-card {
  background: #19170f;
  border: 0.5px solid #3a3225;
}
.mgl-body .mgl-pfp-name {
  color: #f8f8f8;
}
.mgl-body .mgl-pfp-code {
  color: #e0cfa9;
}
.mgl-body .mgl-pfp-price {
  color: #f4dcaa;
}
.mgl-pfp-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 12px;
}
.mgl-pfp {
  width: 33%;
  border: none;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
.mgl-pfp__img {
  width: 100%;
  border-radius: 6px;
  display: block;
}
.mgl-pfp-card {
  width: 100%;
  padding: 8px;
  border-radius: 0 0 6px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
  box-sizing: border-box;
}
.mgl-pfp__top {
  display: flex;
  align-items: center;
}
.mgl-pfp__bottom {
  display: flex;
  align-items: flex-end;
}
.mgl-pfp-total {
  color: #8d8474;
}
.mgl-pfp-price {
  display: flex;
  margin-top: 3px;
  width: 93.6px;
}
/* 空态 */
.mgl-out {
  padding: 20.8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15.6px;
  border-radius: 20.8px;
  flex-direction: column;
}
.mgl-empty-box {
  padding: 20.8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15.6px;
  border-radius: 20.8px;
  flex-direction: column;
}
.mgl-empty {
  width: 90px;
  height: auto;
  display: block;
}
.mgl-body .mgl-out-text {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #c6bdad;
}

/* ============ 底部操作条 ============ */
.mgl-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 15px;
  padding-right: 15px;
  background-color: #101115 !important;
  border-top: 0.5px solid #332b1e;
  display: flex;
  justify-content: space-between;
}
/* 原站 w-button 渲染为 uni-view，flex:1 撑满 */
.action-btn {
  flex: 1 1 0%;
  min-width: 0;
}
.action-btn--mr {
  margin-right: 15px;
}
.z-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: none;
  font-weight: bold;
}
.btn-size-lg {
  height: 47px;
  font-size: 14px;
}
.circle {
  border-radius: 23px;
}
.plr-10 {
  padding-left: 10px;
  padding-right: 10px;
}
.mtb-10 {
  margin-top: 10px;
  margin-bottom: 10px;
}
.mgl-action .mgl-btn-outline.z-btn {
  background: #211c14 !important;
  border: 0.5px solid #5c492d !important;
  color: #f4dcaa !important;
}
.mgl-action .mgl-btn-gold.z-btn {
  background: linear-gradient(135deg, #fae8bd, #cfaf72) !important;
  color: #2f2413 !important;
  border: none !important;
}
.mgl-action .mgl-btn-disabled.z-btn {
  background: #23211c !important;
  color: #8d8474 !important;
}
.batch-btn {
  width: 171.6px;
  margin-right: 14px;
  flex: none;
}

/* ============ 支付方式弹窗 ============ */
.mgl-popup-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}
.mgl-popup {
  width: 100%;
  padding: 16px;
  border-radius: 12px 12px 0 0;
  background-color: #fff;
  border: 1px solid #e7e7ea;
  box-sizing: border-box;
}
.mgl-popup__close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mgl-popup__close .uicon-close {
  font-family: 'uview-icon' !important;
  font-size: 24px;
  color: #fff;
  line-height: 1;
}
.mgl-popup__payrow {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.mgl-popup__payicon {
  width: 18px;
  height: 18px;
  display: block;
}
.mgl-popup__radio {
  width: 20px;
  height: 20px;
  display: block;
}
/* 原站 uncheck-icon w-icon size=16 */
.mgl-popup__radio--off {
  width: 16px;
  height: 16px;
}
.mgl-popup__confirm {
  margin-top: 31px;
  width: 100%;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
}
.mgl-popup__confirm.disabled {
  opacity: 0.55;
}
.mgl-popup__numrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
}
.mgl-popup__numbtn {
  width: 15.6px;
  height: 15.6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 50%;
}
.mgl-popup__numbtn--minus {
  background-color: #dedee2;
  color: #000;
}
.mgl-popup__numbtn--plus {
  background-color: #000;
  color: #fff;
}
.mgl-popup__numinput {
  color: #333;
  width: 156px;
  text-align: center;
}

/* ============ 工具类 ============ */
.flex {
  display: flex;
}
.flex-ai-center {
  align-items: center;
}
.flex-js-sb {
  justify-content: space-between;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-1 {
  flex-grow: 1;
}
.ml-8 {
  margin-left: 8px;
}
.mlr-8 {
  margin-left: 8px;
  margin-right: 8px;
}
.ptb-12 {
  padding-top: 12px;
  padding-bottom: 12px;
}
.mt-30 {
  margin-top: 31px;
}
.font-color-black {
  color: #23262f;
}
.font-color-999 {
  color: #999;
}
.font-w-600 {
  font-weight: 600;
}
.font-size-14 {
  font-size: 14px;
}
.font-size-10 {
  font-size: 10px;
}
.font-w-500 {
  font-weight: 500;
}
</style>
