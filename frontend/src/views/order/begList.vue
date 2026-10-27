<template>
  <!--
    原站 pages/order/beg/list（chunk pages-order-beg-list.7456f706.js）
      render 85d8 / logic 8dba / scope 39353d13（本页无页面级 <style>，样式全部来自各组件内嵌原子库副本）
      结构：w-container.page-bg.plr-16
        → w-navbar(id=my-nav, title=我的求购)
        → u-tabs(list=statusList, current=currentIndex, scrollable=false,
                 inactiveStyle/activeStyle, lineHeight=0) @click=changeStatus
        → v-for list：.bg-color-item.flex.pa-12.br-12.mb-12 @click=toDetail
            w-image(80,80,radius 8)
            .pl-10.flex-1.flex.flex-dir-col.flex-js-sb.ptb-8
              ① .flex.flex-js-sb.flex-ai-center：名称(max-width 300rpx) + ￥total_price
              ② (status==2||3)&&number>1 → u-line-progress(236rpx) + 求购数量 x/y
                 else → x number
              ③ .flex.flex-js-sb.flex-ai-center：formatDate(updatetime) + 按钮组
        → w-loading(type=loading, empty-type=search)
        → currentOrderIndex>=0 ? CancelBegOrder / PayBegOrder
    逻辑（script 8dba）：
      statusList 全部(null)/求购中(2)/已成交(3)/已取消(4)
      onLoad → getList(search)；onReachBottom → copyObj(search);page++;getList(A)
      changeStatus(A) → status=A.status;page=1;list=[];loading=none;getList(search)
      getList(A) → loading∉[loading,nomore] 时 loading=loading；
                    getMyTradeList(A).then → loading=none; data.length&&(search=A);
                    list=list.concat(data); data.length<per_page&&(loading=nomore);
                    !total&&(loading=empty)
      cancelOrder(A,i)/pay(A,i) → currentOrderIndex=i; nextTick → $refs.cancel/pay .cancel()/.pay()
      toBeg(A) → /pages/market/submitBegBuy?id=A.goods_id
      toDetail(A) → /pages/order/beg/info?id=A.id
  -->
  <div id="beg-list" class="page-bg plr-16">
    <!-- 原站 w-navbar(u-navbar)：fixed、bgColor 透传 page-bg、标题 30rpx bold #333；
         左侧 w-icon name=back-btn size=24（/static/icon/back-btn.png），@left 13px/top 10px。
         注：浅色页 navbar 底色沿用项目已验证页（record/regift）的 #fafafa。 -->
    <div class="rr-navbar">
      <img class="rr-navbar__back" src="/assets/img/order/back-btn.png" alt="" @click="goBack" />
      <span class="rr-navbar__title">我的求购</span>
    </div>

    <!-- 原站 u-navbar placeholder：fixed+placeholder 时占位 44px -->
    <div class="rr-body">
      <!-- 原站 u-tabs：scrollable=false → 每个 item flex:1；lineHeight=0 隐藏底部线；
           文本样式来自页面内联 inactiveStyle/activeStyle（覆盖 uView 默认 #606266） -->
      <div class="u-tabs">
        <div class="u-tabs__wrapper">
          <div class="u-tabs__wrapper__scroll-view-wrapper">
            <div class="u-tabs__wrapper__scroll-view">
              <div class="u-tabs__wrapper__nav">
                <div
                  v-for="(s, i) in statusList"
                  :key="i"
                  class="u-tabs__wrapper__nav__item"
                  @click="changeStatus(s)"
                >
                  <span class="u-tabs__wrapper__nav__item__text" :style="i === currentIndex ? activeStyle : inactiveStyle">
                    {{ s.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 原站卡片列表 -->
      <div v-for="(a, i) in list" :key="a.id" class="bg-color-item flex pa-12 br-12 mb-12" @click="toDetail(a)">
        <!-- 原站 w-image：width=2*80rpx=160rpx=83.2px，radius=8（不翻倍，按 uView addUnit 取 px） -->
        <div class="bl-cover">
          <img class="bl-cover__img" :src="imgUrl(a.goods_image)" alt="" />
        </div>

        <div class="pl-10 flex-1 flex flex-dir-col flex-js-sb ptb-8">
          <!-- ① 名称 + 总价 -->
          <div class="flex flex-js-sb flex-ai-center">
            <span class="text-overflow font-size-14 font-color-black bl-name">{{ a.goods_name }}</span>
            <span class="font-color-black">
              <span class="font-size-14">￥</span>
              <span class="font-size-16">{{ a.total_price }}</span>
            </span>
          </div>

          <!-- ② 求购进度（status==2||3 且 number>1） -->
          <div v-if="(a.order_status == 2 || a.order_status == 3) && a.number > 1">
            <!-- 原站 u-line-progress：width 236rpx=122.72px、height 8rpx=4.16px、inactive #DEE8FF、active #f52500 -->
            <div class="u-line-progress">
              <div class="u-line-progress__background"></div>
              <div class="u-line-progress__line" :style="{ width: (a.sale_number / a.number) * 100 + '%' }"></div>
            </div>
            <div class="font-size-10 font-color-999 mt-4">求购数量：{{ a.sale_number }}/{{ a.number }}</div>
          </div>
          <div v-else class="font-size-14 font-color-999">x{{ a.number }}</div>

          <!-- ③ 更新时间 + 按钮组 -->
          <div class="flex flex-js-sb flex-ai-center">
            <span class="font-size-10 font-color-999">{{ formatDate(a.updatetime) }}</span>
            <div class="flex">
              <!-- 原站 w-button size=mini pain circle：高 26px、radius 13px、bg #f0f0f2/#000、行内 font-size 24rpx -->
              <div
                v-if="a.order_status == 2"
                class="z-btn btn-size-mini circle btn-type-colorful pain bl-btn"
                @click.stop="cancelOrder(a, i)"
              >
                取消订单
              </div>
              <!-- 原站 w-button size=mini circle（默认 type=colorful 金渐变） -->
              <div v-if="a.order_status == 1" class="z-btn btn-size-mini circle btn-type-colorful bl-btn" @click.stop="pay(a, i)">
                立即支付
              </div>
              <div v-if="a.order_status == 4" class="z-btn btn-size-mini circle btn-type-colorful bl-btn" @click.stop="toBeg(a)">
                重新求购
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 原站 w-loading(type=loading, empty-type=search) -->
      <div v-if="loading === 'loading'" class="bl-loading">
        <span class="bl-loading__icon"></span>
        <!-- 原站 u-loading-icon textSize 14；原站传 textColor #fff 在浅色底上不可见，按 uView 默认 #606266 落地 -->
        <span class="bl-loading__text">加载中</span>
      </div>
      <div v-else-if="loading === 'empty'" class="bl-empty">
        <img class="bl-empty__img" src="/assets/img/empty/search-empty.png" alt="" />
      </div>
      <div v-else-if="loading === 'nomore'" class="bl-nomore">已经到底了~</div>
    </div>

    <!-- 原站 CancelBegOrder（w-toast，btnType 默认 colorful → 确认键金色渐变）
         cancelFn(true) → cancelBegBuy(order.id) → toast(msg) + order.order_status=4 -->
    <div v-if="cancelShow" class="ov-mask" @click.self="cancelShow = false">
      <div class="w-toast">
        <div class="toast-title">取消求购</div>
        <div class="toast-content">当订单数量大于1时，取消订单只能取消求购中的订单，不能取消求购成功的订单。</div>
        <div class="toast-action">
          <div class="z-btn bl-dialog-btn bl-dialog-btn--cancel" @click="cancelShow = false">我再想想</div>
          <div class="z-btn bl-dialog-btn bl-dialog-btn--submit" @click="cancelFn(true)">确认取消</div>
        </div>
      </div>
    </div>

    <!-- 原站 PayBegOrder（w-modal，title=null 无标题；按钮 type=toast-btn，cancel 带 pain）
         payFn(true) → new Pay({order_id, order_number:order_sn, order_type:11, pay_type:4, pay_way}) → doPay -->
    <div v-if="payShow" class="ov-mask" @click.self="payShow = false">
      <div class="w-modal">
        <div class="text-center font-size-12 font-color-textPrimary">
          ￥<span class="font-size-24">{{ currentOrder && currentOrder.total_price }}</span>
        </div>
        <div class="text-center font-color-textPrimary mt-12 font-size-14">您确认求购吗？</div>
        <div class="toast-action">
          <div class="z-btn bl-dialog-btn bl-dialog-btn--cancel bl-dialog-btn--wide" @click="payShow = false">取消</div>
          <div class="z-btn bl-dialog-btn bl-dialog-btn--dark bl-dialog-btn--wide" @click="payFn(true)">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 我的求购订单列表页（对应原站 pages/order/beg/list）
 *
 * 反编译：chunk `pages-order-beg-list.7456f706.js`（入口 2647）
 *   render 85d8 / logic 8dba / scope 39353d13（无页面级 CSS）
 *   子组件 CancelBegOrder（d42e/6482）、PayBegOrder（5921/c37f）
 *
 * 接口：POST /market/trade/begBuyOrderList   body { page, status }
 *   响应 data { total, per_page, current_page, last_page, data: [] }
 *   status=null 全部 / 2 求购中 / 3 已成交 / 4 已取消
 *   取消：POST /market/trade/cancelBegBuyOrder  body { order_id }
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyTradeList, cancelBegBuy } from '@/api'
import { toast } from '@/utils/toast'
import { OSS_URL } from '@/config'

const router = useRouter()

/** 原站 statusList（顺序固定） */
const statusList = [
  { name: '全部', status: null },
  { name: '求购中', status: 2 },
  { name: '已成交', status: 3 },
  { name: '已取消', status: 4 }
]

/** 原站 data：inactiveStyle/activeStyle 内联传给 u-tabs 文本 */
const inactiveStyle = { width: 'auto', fontWeight: '500', color: '#333333' }
const activeStyle = { width: 'auto', color: '#4478FF', fontWeight: 'bold' }

const search = ref({ page: 1, status: null })
const list = ref([])
const loading = ref('none')
const currentOrderIndex = ref(-1)

/** 原站 computed.currentIndex */
const currentIndex = computed(() => statusList.findIndex((s) => s.status === search.value.status))

/** 弹窗显隐（原站由子组件内部 show 控制，这里在页面内联实现） */
const cancelShow = ref(false)
const payShow = ref(false)

/** 当前操作中的订单 */
const currentOrder = computed(() => (currentOrderIndex.value >= 0 ? list.value[currentOrderIndex.value] : null))

/** 原站 formatDate 过滤器：dayjs(1e3*e).format('YYYY-MM-DD HH:mm:ss') */
function formatDate(ts) {
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

/** 原站 w-image 的 targetSrc 规则 */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/')) return src
  return OSS_URL + src
}

/** 原站 toBeg(A) → /pages/market/submitBegBuy?id=A.goods_id */
function toBeg(a) {
  router.push({ path: '/pages/market/submitBegBuy', query: { id: a.goods_id } })
}

/** 原站 cancelOrder(A, i) → currentOrderIndex=i; nextTick → cancelOrder.cancel() */
function cancelOrder(a, i) {
  currentOrderIndex.value = i
  cancelShow.value = true
}

/** 原站 toDetail(A) → /pages/order/beg/info?id=A.id */
function toDetail(a) {
  router.push({ path: '/pages/order/beg/info', query: { id: a.id } })
}

/** 原站 pay(A, i) → currentOrderIndex=i; nextTick → payOrder.pay() */
function pay(a, i) {
  currentOrderIndex.value = i
  payShow.value = true
}

/** 原站 CancelBegOrder.cancelFn(true) → cancelBegBuy(order.id) → toast(msg) + order_status=4 */
async function cancelFn(confirm) {
  if (!confirm) return
  cancelShow.value = false
  const order = currentOrder.value
  if (!order) return
  try {
    const res = await cancelBegBuy(order.id)
    toast((res && res.msg) || '取消成功')
    order.order_status = 4
  } catch (e) {
    toast('取消失败')
  }
}

/** 原站 PayBegOrder.payFn(true) → new Pay({order_id, order_number:order_sn, order_type:11, pay_type:4, pay_way})
 *  PayClass → /order/pay/doPay；本项目未接入支付渠道，保持与既有页面一致 */
function payFn(confirm) {
  if (!confirm) return
  payShow.value = false
  const order = currentOrder.value
  if (!order) return
  toast('暂未接入支付渠道')
  console.log('[begList] doPay →', {
    order_id: order.id,
    order_number: order.order_sn,
    order_type: 11,
    pay_type: 4,
    pay_way: order.pay_way
  })
}

/** 原站 changeStatus(A) → status=A.status; page=1; list=[]; loading=none; getList(search) */
function changeStatus(s) {
  if (!s) return
  search.value.status = s.status
  search.value.page = 1
  list.value = []
  loading.value = 'none'
  getList({ ...search.value })
}

/** 原站 getList(A) */
async function getList(params) {
  if (loading.value === 'loading' || loading.value === 'nomore') return
  loading.value = 'loading'
  try {
    const res = await getMyTradeList(params)
    const d = (res && res.data) || {}
    const rows = d.data || []
    loading.value = 'none'
    if (rows.length) search.value = params
    list.value = list.value.concat(rows)
    if (rows.length < d.per_page) loading.value = 'nomore'
    if (!d.total) loading.value = 'empty'
  } catch (e) {
    loading.value = 'none'
  }
}

/** 原站 onReachBottom：复制 search，page++ 后加载 */
function onReachBottom() {
  const params = { ...search.value }
  params.page = params.page + 1
  getList(params)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

function onScroll() {
  const el = document.documentElement
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) onReachBottom()
}

onMounted(() => {
  /** 原站 onLoad → getList(search) */
  getList({ ...search.value })
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* 原站 scope 39353d13 无页面级 CSS；以下按各组件内嵌原子库副本逐值落地 */
.page-bg {
  background: #f7f7f8;
  min-height: 100vh;
}
.plr-16 {
  padding-left: 16.64px;
  padding-right: 16.64px;
}

/* ============ w-navbar(u-navbar) ============ */
/* 原站 u-navbar--fixed：z-index 11；content 高 44px；标题 30rpx=15.6px→15px bold #333；
   返回键 w-icon back-btn 24×24 @ u-navbar__content__left(left:0, padding 0 13px) */
.rr-navbar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: #fafafa;
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
}
.rr-navbar__back {
  position: absolute;
  left: 13px;
  top: calc(env(safe-area-inset-top) + 10px);
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.rr-navbar__title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}
/* 原站 u-navbar placeholder 高 44px */
.rr-body {
  padding-top: 44px;
}

/* ============ u-tabs（scope 2ffdb29d）============ */
/* 原站 .u-tabs 无样式规则（普通块级 div），wrapper 因此撑满宽度；
   record.vue 曾给 .u-tabs 加 display:flex，本页 item 需 flex:1 均分，不能收缩 */
.u-tabs__wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.u-tabs__wrapper__scroll-view-wrapper {
  flex: 1;
  overflow: auto hidden;
}
.u-tabs__wrapper__scroll-view {
  display: flex;
  flex-direction: row;
  flex: 1;
}
.u-tabs__wrapper__nav {
  display: flex;
  flex-direction: row;
  position: relative;
  flex: 1; /* 原站 nav 无显式宽度，靠 uni-app scroll-view 在 H5 端撑满 scroll-view 容器；
              普通 div 作为 flex item 只收缩到内容宽（实测 253px），显式补 flex:1 对齐均分效果 */
}
/* 原站 scrollable=false → item flex:1 */
.u-tabs__wrapper__nav__item {
  flex: 1;
  padding: 0 11px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
/* 原站 .u-tabs__wrapper__nav__item__text：font-size 15px；颜色/字重来自页面内联样式 */
.u-tabs__wrapper__nav__item__text {
  font-size: 15px;
  line-height: 22px;
  white-space: nowrap;
}
/* lineHeight=0 → 底部线隐藏，不渲染 */

/* ============ 求购订单卡片 ============ */
/* 原站 .bg-color-item：白卡 + 1px #e7e7ea 边框（其自带 radius 40rpx 被后定义的 .br-12 覆盖） */
.bg-color-item {
  background-color: #fff;
  border: 1px solid #e7e7ea;
  cursor: pointer;
}
/* 原站 .br-12：radius 24rpx=12.48px（原子库中定义晚于 .bg-color-item，实际生效） */
.br-12 {
  border-radius: 12.48px;
}
/* 原站 w-image：width=2*80rpx=160rpx=83.2px，radius=8 */
.bl-cover {
  width: 83.2px;
  height: 83.2px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
}
.bl-cover__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* 原站 max-width 300rpx=156px */
.bl-name {
  max-width: 156px;
}

/* ============ u-line-progress（scope 5a885ee4）============ */
/* 原站：align-items stretch、flex row、radius 100px；height 8rpx=4.16px 由页面行内指定 */
.u-line-progress {
  align-items: stretch;
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
  border-radius: 100px;
  height: 4.16px;
  width: 122.72px;
}
.u-line-progress__background {
  background-color: #dee8ff;
  border-radius: 100px;
  flex: 1;
}
.u-line-progress__line {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  align-items: center;
  display: flex;
  flex-direction: row;
  color: #fff;
  border-radius: 100px;
  transition: width 0.5s ease;
  justify-content: flex-end;
  background-color: #f52500;
}

/* ============ 卡片按钮（w-button size=mini）============ */
/* 原站 w-button：根节点 plr-10 + font-weight bold */
.z-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  box-sizing: border-box;
  font-weight: bold;
  padding-left: 10.4px;
  padding-right: 10.4px;
  cursor: pointer;
  user-select: none;
}
/* 原站 .btn-size-mini.circle：height 50rpx=26px、radius 25rpx=13px */
.btn-size-mini.circle {
  height: 26px;
  border-radius: 13px;
}
/* 原站 .btn-type-colorful：金渐变 */
.btn-type-colorful {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
/* 原站 .btn-type-colorful.pain：素色 */
.btn-type-colorful.pain {
  background: #f0f0f2;
  color: #000;
}
/* 原站行内 font-size 24rpx=12.48px */
.bl-btn {
  font-size: 12.48px;
}

/* ============ w-loading ============ */
/* 原站 u-loading-icon：circle 模式 14px #4478FF + 文本 textSize 14 */
.bl-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}
.bl-loading__icon {
  width: 14px;
  height: 14px;
  border: 2px solid #dee8ff;
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: bl-spin 0.8s linear infinite;
}
@keyframes bl-spin {
  to {
    transform: rotate(360deg);
  }
}
/* 原站 u-loading-icon__text：margin-left 4px、默认色 #606266（原站行内 textColor #fff 在浅底不可见，取 uView 默认值） */
.bl-loading__text {
  margin-top: 4px;
  font-size: 14px;
  color: #606266;
  line-height: 20px;
}
/* 原站空态：marginTop 2*16rpx=16.64px、paddingBottom 260rpx=135.2px、图片宽 234rpx=121.68px */
.bl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16.64px;
  padding-bottom: 135.2px;
}
.bl-empty__img {
  width: 121.68px;
  height: 121.68px;
  object-fit: contain;
  display: block;
}
/* 原站 nomore：font-size-12 font-color-describe flex-center */
.bl-nomore {
  font-size: 12.48px;
  color: #ababab;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
}

/* ============ 弹窗（w-toast / w-modal）============ */
.ov-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 原站 .w-toast：width 560rpx=291.2px、bg #fff、radius 30rpx=15.6px、padding 28/34/48rpx */
.w-toast {
  width: 291.2px;
  background: #fff;
  border-radius: 15.6px;
  padding: 14.56px 17.68px 24.96px;
  box-sizing: border-box;
}
.w-toast > .toast-title {
  font-size: 16.64px;
  font-weight: 700;
  color: #333;
  text-align: center;
}
/* 原站 .w-toast > .toast-content：padding-top 32rpx=16.64px、font-size 28rpx=14.56px、色 #333 */
.w-toast > .toast-content {
  padding-top: 16.64px;
  font-size: 14.56px;
  font-weight: 400;
  color: #333;
  line-height: 1.5;
  text-align: center;
}
/* 原站 .w-toast > .toast-action：flex、space-between、margin-top 112rpx=58.24px、font-size 28rpx */
.w-toast > .toast-action {
  display: flex;
  justify-content: space-between;
  margin-top: 58.24px;
  font-size: 14.56px;
}
/* 原站 .w-toast > .toast-action > .z-btn：height 80rpx=41.6px、width 220rpx=114.4px、radius 12rpx=6.24px */
.bl-dialog-btn {
  height: 41.6px;
  border-radius: 6.24px;
  font-size: 14.56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 10.4px;
}
.bl-dialog-btn--cancel {
  background: #f0f0f2;
  color: #000;
}
/* 原站 w-toast 默认 btnType=colorful → 确认键金色渐变 */
.bl-dialog-btn--submit {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
/* 原站 .w-modal：width 600rpx=312px、bg #fff、border 1px #e7e7ea、radius 32rpx=16.64px、padding 28/34/48rpx */
.w-modal {
  width: 312px;
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 16.64px;
  padding: 14.56px 17.68px 24.96px;
  position: relative;
  box-sizing: border-box;
}
/* 原站 .w-modal > .toast-action：flex、space-between、margin-top 112rpx=58.24px */
.w-modal > .toast-action {
  display: flex;
  justify-content: space-between;
  margin-top: 58.24px;
}
/* 原站 .w-modal > .toast-action > .z-btn：height 80rpx=41.6px、width 240rpx=124.8px、radius 12rpx=6.24px */
.bl-dialog-btn--wide {
  width: 124.8px;
}
/* 原站 w-modal 按钮 type=toast-btn：确认键 #000 底白字；cancel 带 pain → #f0f0f2/#000 */
.bl-dialog-btn--dark {
  background: #000;
  color: #fff;
}

/* ============ 工具类（原子库）============ */
.flex {
  display: flex;
}
.flex-1 {
  flex-grow: 1;
}
.flex-dir-col {
  flex-direction: column;
}
.flex-js-sb {
  justify-content: space-between;
}
.flex-ai-center {
  align-items: center;
}
.pa-12 {
  padding: 12.48px;
}
.pl-10 {
  padding-left: 10.4px;
}
.ptb-8 {
  padding-top: 8.32px;
  padding-bottom: 8.32px;
}
.mb-12 {
  margin-bottom: 12.48px;
}
.mt-4 {
  margin-top: 4.16px;
}
.mt-12 {
  margin-top: 12.48px;
}
.font-size-10 {
  font-size: 10.4px;
}
.font-size-12 {
  font-size: 12.48px;
}
.font-size-14 {
  font-size: 14.56px;
}
.font-size-16 {
  font-size: 16.64px;
}
.font-size-24 {
  font-size: 24.96px;
}
.font-color-black {
  color: #23262f;
}
.font-color-999 {
  color: #999;
}
.font-color-textPrimary {
  color: #333;
}
.text-center {
  text-align: center;
}
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
