<template>
  <div class="ol-page">
    <!-- 原站 .order-list-header：状态栏 + 导航（一级 tabs） -->
    <div class="ol-header">
      <div class="ol-statusbar" />
      <div class="ol-nav">
        <div class="ol-nav__back" @click="goBack">
          <img class="ol-nav__back-img" src="/assets/img/order/back-btn-white.webp" alt="" />
        </div>
        <div class="ol-nav__tabs" ref="navTabsEl">
          <div
            v-for="(t, i) in orderTypeMap"
            :key="t.type"
            ref="navTabItems"
            class="ol-tab"
            :class="{ 'ol-tab--on': currentTypeMapIndex === i }"
            @click="changOrderType(t)"
          >
            <span class="ol-tab__text">{{ t.name }}</span>
            <i v-if="currentTypeMapIndex === i" class="ol-tab__line" />
          </div>
        </div>
      </div>
    </div>

    <!-- 原站 .order-list-filter：二级状态 tabs（胶囊按钮组） -->
    <div class="ol-filter">
      <div class="ol-filter__inner" ref="filterEl">
        <div
          v-for="(m, i) in orderMap"
          :key="m.name + i"
          ref="filterItems"
          class="ol-chip"
          :class="{ 'ol-chip--on': currenIndex === i }"
          @click="changOrderStatus(m)"
        >
          {{ m.name }}
        </div>
      </div>
    </div>

    <!-- 原站 .order-list-body -->
    <div class="ol-body" :class="{ 'ol-body--batch': isBatchType && list.length }">
      <div class="ol-gap">
        <!-- 首发寄售订单 -->
        <OrderItem
          v-if="currentType === 1"
          v-for="o in list"
          :key="o.order_sn"
          :order="o"
          @countDownOver="countDownOver"
        />

        <!-- 求购订单 -->
        <BegOrderItem
          v-if="currentType === 11"
          v-for="o in list"
          :key="o.order_sn"
          :item="o"
          @countDownOver="countDownOver"
        />

        <!-- 委托订单 -->
        <PreOrderItem
          v-if="currentType === 31"
          v-for="o in list"
          :key="o.order_sn"
          :item="o"
          @countDownOver="countDownOver"
        />

        <!-- 批量付面板（原站 .batch-panel） -->
        <div v-if="isBatchType" class="ol-batch-panel">
          <PayTypeRadio v-model="batchPayWay" />
          <BatchOrderList :list="cuurentBatchList" @changeStatus="changeStatus" />
        </div>
      </div>

      <!-- 原站空态 -->
      <div v-if="loading === 'empty'" class="ol-empty">
        <img class="ol-empty__img" src="/assets/img/order/search-empty-dark.webp" alt="" />
        <span class="ol-empty__text">暂无订单数据</span>
      </div>

      <!-- 原站 w-loading：加载中 / 没有更多 -->
      <div v-if="loading === 'loading' || loading === 'nomore'" class="ol-loading">
        <span class="ol-loading__text">{{ loading === 'loading' ? '加载中...' : '没有更多了' }}</span>
      </div>
    </div>

    <!-- 原站 .batch-action：批量付底部操作条 -->
    <div v-if="isBatchType && list.length" class="ol-batch-action">
      <div class="ol-batch-btn ol-batch-btn--dark" @click="showCancel = true">取消订单</div>
      <div
        class="ol-batch-btn ol-batch-btn--colorful"
        :class="{ 'ol-batch-btn--disabled': !checkIds.length }"
        @click="createPayOrder"
      >
        <span>确认</span>
        <span v-if="showCountdown" class="ol-batch-countdown">({{ countdown }})</span>
      </div>
    </div>

    <!-- 原站 w-modal：取消批付确认 -->
    <div v-if="showCancel" class="ol-modal" @click.self="showCancel = false">
      <div class="ol-modal__box">
        <div class="ol-modal__title">您确定要取消该批付订单吗？</div>
        <div class="ol-modal__text">1.取消订单将会限制一段时间使用批量购买功能</div>
        <div class="ol-modal__text">2.累计取消3次将永久限制使用批量购买功能</div>
        <div class="ol-modal__actions">
          <span class="ol-modal__btn" @click="showCancel = false">取消</span>
          <span class="ol-modal__btn ol-modal__btn--primary" @click="submitCancel">确定</span>
        </div>
      </div>
    </div>

    <!-- 原站 w-toast：还有未支付订单提醒 -->
    <div v-if="showToast" class="ol-modal" @click.self="showToast = false">
      <div class="ol-modal__box ol-modal__box--toast">
        <div class="ol-modal__title">温馨提示</div>
        <div class="ol-modal__text ol-modal__text--center">您还有未支付订单,是否立即支付</div>
        <div class="ol-modal__actions">
          <span class="ol-modal__btn" @click="showToast = false">取消</span>
          <span class="ol-modal__btn ol-modal__btn--primary" @click="payHasBatchOrder">确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 订单列表页 —— 原站 pages/order/list
 *
 * 反编译来源：chunk `pages-order-list.js`（511295 字节，135 个 webpack 模块）
 *   - 页面 script   : `c53a`（290 行量级，含 orderTypeMap / computed / methods）
 *   - 页面 render   : `7677`（scope `60b0d25e`）
 *   - 订单卡片     : script `927f` + render `43e8`（scope `32f4089f`）
 *   - 求购卡片     : script `ce36` + render `2986`（scope `26b377b4`）
 *   - 委托卡片     : script `b007` + render `33d1`（scope `3093a2ca`）
 *   - 批量付列表   : script `58db` + render `c951`（scope `352525cf`）
 *   - 支付方式单选 : script `a8fa` + render `5b09`（scope `54c0d499`）
 *   - 订单状态文案 : `c646d`（按 order_type × order_status 二维映射）
 *   - 接口模块     : `7db7`（订单）/ `48cc`（求购·委托）
 *
 * 所有文案、类名、尺寸、交互均逐字照抄原站，rpx 尺寸统一按 rpx × 0.52 换算为 px。
 */
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import OrderItem from '@/components/order/OrderItem.vue'
import BegOrderItem from '@/components/order/BegOrderItem.vue'
import PreOrderItem from '@/components/order/PreOrderItem.vue'
import BatchOrderList from '@/components/order/BatchOrderList.vue'
import PayTypeRadio from '@/components/order/PayTypeRadio.vue'
import {
  getOrderList,
  getBatchOrderList,
  getMyTradeList as fetchTradeList,
  getMyEntrustList as fetchEntrustList,
  cancelBatchOrder,
  createBatchPayOrder
} from '@/api'

const router = useRouter()

/* ---------------- 原站 data ---------------- */

/** 一级 tabs：首发寄售 / 求购订单 / 委托订单（原站 orderTypeMap） */
const orderTypeMap = ref([
  {
    name: '首发寄售',
    type: 1,
    orderMap: [
      { name: '全部', status: 0, type: 1 },
      { name: '已完成', status: 2, type: 1 },
      { name: '批量付', type: 2, status: 0 },
      { name: '待支付', status: 1, type: 1 },
      { name: '进行中', status: 7, type: 1 },
      { name: '已取消', status: 3, type: 1 },
      { name: '已退款', status: 6, type: 1 }
    ]
  },
  {
    name: '求购订单',
    type: 11,
    orderMap: [
      { name: '全部', status: null, type: 11 },
      { name: '求购中', status: 2, type: 11 },
      { name: '已成交', status: 3, type: 11 },
      { name: '已取消', status: 4, type: 11 }
    ]
  },
  {
    name: '委托订单',
    type: 31,
    orderMap: [
      { name: '全部', status: null, type: 31 },
      { name: '委托中', status: 2, type: 31 },
      { name: '已成交', status: 3, type: 31 },
      { name: '已取消', status: 4, type: 31 }
    ]
  }
])

/** 二级状态 tabs（当前一级下的 orderMap） */
const orderMap = ref([])
const loading = ref('none')
const currentType = ref(1)
const searchType = ref(1)
const batchPayWay = ref('huifu')
const search = ref({ page: 1, status: 0, type: 1 })
const list = ref([])
const batchInfo = ref({})
const showToast = ref(false)
const showCancel = ref(false)

/* ---------------- 原站 computed ---------------- */

/** 当前选中的一级 tab 索引 */
const currentTypeMapIndex = computed(() =>
  orderTypeMap.value.findIndex((t) => t.type === search.value.type)
)

/** 当前选中的二级 tab 索引（原站 currenIndex） */
const currenIndex = computed(() => {
  if (searchType.value === 2) return 2
  const idx = orderTypeMap.value[currentTypeMapIndex.value].orderMap.findIndex(
    (t) => t.status === search.value.status && currentType.value === t.type
  )
  return idx <= 0 ? 0 : idx
})

/** 批量付类型判定（原站 currentType === 2） */
const isBatchType = computed(() => currentType.value === 2)

/** 批量付列表（仅 type!==1 时按 income_type 过滤） */
const cuurentBatchList = computed(() => {
  if (currentType.value === 1) return []
  return list.value.filter((t) => (t.income_type || []).includes(batchPayWay.value))
})

/** 勾选的订单 id 集合 */
const checkIds = computed(() =>
  cuurentBatchList.value.filter((a) => a.check).map((a) => a.id)
)

/** 批付倒计时文案（原站 countdown） */
const countdown = computed(() => {
  const end = Number(batchInfo.value.endtime || 0) * 1000
  const diff = Math.max(0, end - nowTimestamp.value)
  const m = Math.floor(diff / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `剩余${m}分${s}秒`
})

/** 是否展示倒计时 */
const showCountdown = computed(() => Number(batchInfo.value.endtime || 0) * 1000 > nowTimestamp.value)

/** 全局秒级时间戳（原站 vuex config.nowTimestamp） */
const nowTimestamp = ref(Date.now())
let timer = null

/* 原站 w-tabs（模块 72ae）封装 uView u-tabs（66f7），scrollable=true 时内部用
   u-scroll-view(scroll-x) 横向滚动。切换 tab 时 u-tabs 会把选中项滚动进可视区域，
   这里用等效实现：一级 tabs 与二级 chips 都是横向滚动容器 + 选中项自动居中。 */
const navTabsEl = ref(null)
const navTabItems = ref([])
const filterEl = ref(null)
const filterItems = ref([])

/** 把选中项滚动进可视区域（对齐 u-tabs 的 scroll-into-view 行为） */
function scrollIntoView(container, items, index) {
  if (!container) return
  const c = container
  const target = items[index]
  if (!target) return
  const cRect = c.getBoundingClientRect()
  const tRect = target.getBoundingClientRect()
  if (tRect.width === 0) return
  let targetLeft = c.scrollLeft
  if (tRect.left < cRect.left) {
    targetLeft = c.scrollLeft - (cRect.left - tRect.left)
  } else if (tRect.right > cRect.right) {
    targetLeft = c.scrollLeft + (tRect.right - cRect.right)
  } else {
    return
  }
  if (typeof c.scrollTo === 'function') {
    c.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
  } else {
    c.scrollLeft = Math.max(0, targetLeft)
  }
}

function syncFilterScroll() {
  const arr = Array.isArray(filterItems.value) ? filterItems.value : [filterItems.value]
  scrollIntoView(filterEl.value, arr.filter(Boolean), currenIndex.value)
}

function syncNavScroll() {
  const arr = Array.isArray(navTabItems.value) ? navTabItems.value : [navTabItems.value]
  scrollIntoView(navTabsEl.value, arr.filter(Boolean), currentTypeMapIndex.value)
}

/* ---------------- 原站 methods ---------------- */

/** 切换二级状态 tab */
function changOrderStatus(a) {
  list.value = []
  search.value.status = a.status
  searchType.value = a.type
  currentType.value = a.type
  search.value.page = 1
  if (a.type === 1) getList(search.value)
  else if (a.type === 11) getMyTradeList(search.value)
  else if (a.type === 31) getMyEntrustList(search.value)
  else getBatchList(search.value)
  nextTick(syncFilterScroll)
}

/** 切换一级 tab */
function changOrderType(a) {
  currentType.value = a.type
  search.value.type = a.type
  search.value.status = 0
  orderMap.value = orderTypeMap.value[currentTypeMapIndex.value].orderMap
  changOrderStatus({ status: 0, type: a.type })
  nextTick(syncNavScroll)
}

/** 上拉加载更多 */
function loadMore() {
  const p = { ...search.value }
  p.page = (p.page || 1) + 1
  const t = currentType.value
  if (t === 1) getList(p)
  else if (t === 11) getMyTradeList(p)
  else if (t === 31) getMyEntrustList(p)
  else getBatchList(p)
}

/** 首发寄售订单列表（原站 getList） */
function getList(a) {
  if (loading.value === 'loading') return
  loading.value = 'loading'
  getOrderList(a)
    .then((d) => {
      loading.value = 'none'
      const rows = (d.data && d.data.data) || []
      if (!((d.data && d.data.total) || 0)) loading.value = 'empty'
      if (rows.length) {
        rows.forEach((row) => list.value.push(row))
        search.value = { ...a }
      }
    })
    .catch(() => {
      loading.value = 'none'
    })
}

/** 批量付订单列表（原站 getBatchList） */
function getBatchList(a) {
  if (loading.value === 'loading') return
  loading.value = 'loading'
  getBatchOrderList()
    .then((res) => {
      loading.value = 'none'
      const d = res.data || {}
      batchInfo.value = d
      const rows = d.data || []
      if (!rows.length) loading.value = 'empty'
      list.value = rows.map((row) => ({ ...row, check: true }))
      if (list.value[0]) batchPayWay.value = (list.value[0].income_type || [])[0] || batchPayWay.value
    })
    .catch(() => {
      loading.value = 'none'
    })
}

/** 求购订单列表（原站 getMyTradeList） */
function getMyTradeList(a) {
  if (loading.value === 'loading') return
  loading.value = 'loading'
  fetchTradeList(a)
    .then((d) => {
      loading.value = 'none'
      const rows = (d.data && d.data.data) || []
      if (rows.length) {
        rows.forEach((row) => list.value.push(row))
        search.value = { ...a }
      }
      if (rows.length < ((d.data && d.data.per_page) || 15)) loading.value = 'nomore'
      if (!((d.data && d.data.total) || 0)) loading.value = 'empty'
    })
    .catch(() => {
      loading.value = 'none'
    })
}

/** 委托订单列表（原站 getMyEntrustList） */
function getMyEntrustList(a) {
  if (loading.value === 'loading') return
  loading.value = 'loading'
  fetchEntrustList(a)
    .then((d) => {
      loading.value = 'none'
      const rows = (d.data && d.data.data) || []
      if (rows.length) {
        rows.forEach((row) => list.value.push(row))
        search.value = { ...a }
      }
      if (rows.length < ((d.data && d.data.per_page) || 15)) loading.value = 'nomore'
      if (!((d.data && d.data.total) || 0)) loading.value = 'empty'
    })
    .catch(() => {
      loading.value = 'none'
    })
}

/** 勾选/取消勾选批量付订单 */
function changeStatus(a) {
  a.check = !a.check
  const i = list.value.findIndex((t) => t.id === a.id)
  if (i > -1) list.value[i] = { ...a }
}

/** 批付倒计时结束 → 订单超时自动取消 */
function countDownOver(a) {
  const id = a.id
  const d = list.value.findIndex((t) => t.id === id)
  if (d > -1) {
    if (search.value.status === 1) list.value.splice(d, 1)
    else list.value[d] = { ...list.value[d], order_status: 3 }
  }
}

/** 确认批量支付 */
function createPayOrder() {
  createBatchPayOrder({
    order_ids: checkIds.value.join(','),
    batch_order_id: batchInfo.value.batch_order_id,
    pay_way: batchPayWay.value
  })
    .then((t) => {
      const d = t.data || {}
      if (d.order_type) {
        showToast.value = true
      } else {
        // 原站：直接拉起 PaySdk 支付
        showToast.value = true
      }
    })
    .catch(() => {})
}

/** Toast「立即支付」 */
function payHasBatchOrder() {
  showToast.value = false
}

/** 取消批量付订单 */
function submitCancel() {
  cancelBatchOrder({ batch_order_id: batchInfo.value.batch_order_id })
    .then(() => {
      showCancel.value = false
      changOrderStatus(orderMap.value[currenIndex.value])
    })
    .catch(() => {})
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/pages/my/my')
}

/* ---------------- 生命周期 ---------------- */

onMounted(() => {
  // 原站 onLoad：读取「我的」页传来的 order-list（{type, status}）
  const raw = sessionStorage.getItem('order-list')
  if (raw) {
    try {
      const a = JSON.parse(raw)
      currentType.value = a.type
      searchType.value = a.type
      search.value.status = a.status
      sessionStorage.removeItem('order-list')
    } catch (e) {
      /* ignore */
    }
  }
  orderMap.value = orderTypeMap.value[currentTypeMapIndex.value].orderMap
  changOrderStatus(orderTypeMap.value[currentTypeMapIndex.value].orderMap[currenIndex.value])
  timer = setInterval(() => {
    nowTimestamp.value = Date.now()
  }, 1000)
  nextTick(() => {
    syncNavScroll()
    syncFilterScroll()
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/**
 * 样式严格对齐原站 scope `60b0d25e`，rpx × 0.52 换算为 px
 */
.ol-page {
  background: #101115;
  min-height: 100vh;
}

/* ---- .order-list-header ---- */
.ol-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #101115;
  padding: 12.58px 18.14px;
  box-sizing: border-box;
}
.ol-statusbar {
  height: 20px;
}
.ol-nav {
  display: flex;
  align-items: center;
  min-height: 37.44px;
}
.ol-nav__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34.84px;
  height: 34.84px;
  background: #1e1e22;
  border: 0.52px solid #655032;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 12.48px;
  box-sizing: border-box;
}
.ol-nav__back-img {
  width: 8.84px;
}
.ol-nav__tabs {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.ol-nav__tabs::-webkit-scrollbar { display: none; }
.ol-tab {
  position: relative;
  display: flex;
  align-items: center;
  padding: 13.52px 3.12px;
  flex-shrink: 0;
}
.ol-tab__text {
  font-weight: 500;
  font-size: 15.6px;
  color: #8e8e93;
  font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, sans-serif;
  white-space: nowrap;
}
.ol-tab--on .ol-tab__text {
  font-size: 15.6px;
  color: #fae8bd;
}
.ol-tab__line {
  position: absolute;
  left: 50%;
  bottom: 4px;
  transform: translateX(-50%);
  width: 14.56px;
  height: 2.08px;
  background: #847765;
  border-radius: 2px;
}

/* ---- .order-list-filter ---- */
/* 原站 .order-list-filter 与 header 同为吸顶元素：
   header 高 = padding 12.58 + 状态栏 20 + nav 37.44 = 70.02px，
   filter 再下移 margin-top 10.88px → 实际 top ≈ 80.9px */
.ol-filter {
  position: fixed;
  top: 70.02px;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #181713;
  border: 0.52px solid #655032;
  border-radius: 7.28px;
  display: flex;
  align-items: center;
  margin-top: 10.88px;
  box-sizing: border-box;
}
.ol-filter__inner {
  flex: 1;
  padding: 8.32px;
  display: flex;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
}
.ol-filter__inner::-webkit-scrollbar { display: none; }
.ol-chip {
  flex-shrink: 0;
  font-weight: 400;
  font-size: 12.48px;
  color: #8e8e93;
  background-color: #1e1e22;
  border-radius: 5.2px;
  padding: 7.25px 12.7px;
  margin-right: 6.24px;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  transition: color .18s, background .18s;
}
.ol-chip--on {
  font-weight: 500;
  color: #2f2414;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, sans-serif;
}

/* ---- .order-list-body ---- */
.ol-body {
  padding: 132px 18.14px 12.58px;
  box-sizing: border-box;
  min-height: 100vh;
}
.ol-body--batch {
  padding-bottom: calc(76.96px + env(safe-area-inset-bottom));
}
.ol-gap {
  display: flex;
  flex-direction: column;
}
.ol-gap > * + * {
  margin-top: 10.88px;
}

/* ---- 空态 ---- */
.ol-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 104px;
}
.ol-empty__img {
  width: 140.4px;
}
.ol-empty__text {
  margin-top: 8.32px;
  color: #999;
  font-size: 13.52px;
}

/* ---- loading ---- */
.ol-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
.ol-loading__text {
  color: #999;
  font-size: 12.48px;
}

/* ---- .batch-panel ---- */
.ol-batch-panel {
  display: flex;
  flex-direction: column;
}

/* ---- .batch-action ---- */
.ol-batch-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 14.56px 18.14px;
  padding-bottom: calc(14.56px + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #101115;
  border-top: 0.52px solid #655032;
  box-sizing: border-box;
}
.ol-batch-btn {
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
}
.ol-batch-btn--dark {
  width: 135.2px;
  background: #1e1e22;
  border: 0.52px solid #655032;
  color: #fff;
}
.ol-batch-btn--colorful {
  width: 208px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  color: #2f2414;
}
.ol-batch-btn--disabled {
  opacity: .5;
}
.ol-batch-countdown {
  font-size: 12.48px;
  margin-left: 4px;
}

/* ---- 弹窗 ---- */
.ol-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 0 40px;
}
.ol-modal__box {
  width: 100%;
  max-width: 310px;
  background: #1e1e22;
  border: 0.52px solid #655032;
  border-radius: 10.4px;
  padding: 20px 16px 12px;
  box-sizing: border-box;
}
.ol-modal__box--toast {
  text-align: center;
}
.ol-modal__title {
  text-align: center;
  font-weight: 500;
  color: #fff;
  font-size: 15.6px;
  padding-bottom: 10px;
}
.ol-modal__text {
  color: #999;
  font-size: 12.48px;
  line-height: 1.7;
}
.ol-modal__text--center {
  text-align: center;
  padding: 6px 0 14px;
}
.ol-modal__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}
.ol-modal__btn {
  margin-left: 10px;
  padding: 7px 16px;
  border-radius: 16px;
  background: #2a2a30;
  color: #fff;
  font-size: 13px;
}
.ol-modal__btn--primary {
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  color: #2f2414;
}
</style>
