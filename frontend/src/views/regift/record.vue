<template>
  <!--
    原站 pages/regift/record（浅色主题，背景 #f7f7f8）
      script 模块 116b
        data { tabs:[{name:'我转赠的',type:1},{name:'我收到的',type:2}],
               search:{page:1,types:1}, list:[], loadingType:'none' }
        computed.currentIndex → tabs.findIndex(t => t.type === search.types)
        onLoad            → changeTab({type: search.types})
        onReachBottom     → copyObj(search); page++; getList(A)
        changeTab(t)      → search.page=1; search.types=t.type; list=[];
                           loadingType='none'; getList(search)
        getList(A)        → loadingType!=='loading' → loadingType='loading';
                           getGiveRecord(A)
                             → loadingType='none';
                               data.data.length → search=A
                               list = list.concat(data.data)
                               !data.total → loadingType='empty'
      render 模块 56c0 / scope 666016ec
        w-container.page-bg#regift-record
          w-navbar(navType="default", id="my-nav", title="转赠记录")
          u-sticky
            .tabs-contaienr.flex.flex-js-center.ptb-16
              w-tabs(current=currentIndex, tabList=tabs) @change=changeTab
          .list.plr-16
            v-for a in list
              .bg-color-item.pt-12.plr-12.pb-16.br-12.mb-12
                .flex
                  w-image(radius=12, width=83, height=83, src=a.product.listimg)
                  usercollection.types != 1 → .info-bar.flex.flex-dir-col.flex-js-sb
                      .text-overflow-2.font-size-16.font-color-textPrimary.font-w-500
                        → a.product.name
                      .flex → "编号：#"(10/#999) + collection_code(16) + "/"+total_num(10)
                  else → .info-bar.flex.flex-ai-center → a.product.name
                .font-size-14
                  .mt-16.flex.flex-js-sb
                    (types==1?"转赠时间":"转入时间")：" + formatDate(a.createtime)
                  .mt-16.flex.flex-js-sb
                    (types==1?"接收人":"转赠人")：" + (types==1?a.user.mobile:a.from_user.mobile)
          w-loading(type=loadingType, empty-type="search")
  -->
  <div id="regift-record" class="page-bg">
    <!-- 原站 w-navbar(u-navbar)：fixed、bgColor #fafafa、autoBack 渲染 back-btn.png -->
    <div class="rr-navbar">
      <img class="rr-navbar__back" src="/assets/img/regift/back-btn.png" alt="" @click="goBack" />
      <span class="rr-navbar__title">转赠记录</span>
    </div>

    <!-- 原站 w-container：navbar 为 fixed，占位 44px -->
    <div class="rr-body">
      <!-- 原站 u-sticky：包裹 tabs，吸顶于导航栏下方（customNavHeight 44） -->
      <div class="rr-sticky">
        <!-- 原站 .tabs-contaienr：padding 上下 16rpx，flex 居中 -->
        <div class="tabs-contaienr flex flex-js-center ptb-16">
          <!-- 原站 w-tabs → u-tabs：item padding 0 15px，line 18×3px vector.png -->
          <div class="u-tabs">
            <div
              v-for="(tab, i) in tabs"
              :key="tab.type"
              class="u-tabs__wrapper__nav__item"
              @click="changeTab(tab)"
            >
              <span class="u-tabs__wrapper__nav__item__text">{{ tab.name }}</span>
            </div>
            <i class="u-tabs__wrapper__nav__line" :style="lineStyle" />
          </div>
        </div>
      </div>

      <!-- 原站 .list.plr-16 -->
      <div class="list plr-16">
        <div
          v-for="a in list"
          :key="a.id"
          class="bg-color-item pt-12 plr-12 pb-16 br-12 mb-12"
        >
          <div class="flex">
            <!-- 原站 w-image：width=2*83rpx=86.32px，radius=12 -->
            <div class="rr-cover">
              <img class="rr-cover__img" :src="coverSrc(a)" alt="" />
            </div>
            <!-- usercollection.types != 1：名称 + 编号/总量 -->
            <div v-if="a.usercollection.types != 1" class="info-bar flex flex-dir-col flex-js-sb">
              <span class="text-overflow-2 font-size-16 font-color-textPrimary font-w-500" style="width: 100%">
                {{ a.product.name }}
              </span>
              <div class="flex">
                <span class="font-size-10 font-color-999">编号：#</span>
                <span class="font-size-16 font-color-textPrimary">{{ a.usercollection.collection_code }}</span>
                <span class="font-size-10 font-color-999">/{{ a.product.total_num }}</span>
              </div>
            </div>
            <!-- usercollection.types == 1：仅名称 -->
            <div v-else class="info-bar flex flex-ai-center">
              <span class="font-size-16 font-color-textPrimary font-w-500">{{ a.product.name }}</span>
            </div>
          </div>

          <div class="font-size-14">
            <div class="mt-16 flex flex-js-sb">
              <span class="font-color-999">{{ search.types == 1 ? '转赠时间' : '转入时间' }}：</span>
              <span class="font-color-textPrimary">{{ formatDate(a.createtime) }}</span>
            </div>
            <div class="mt-16 flex flex-js-sb">
              <span class="font-color-999">{{ search.types == 1 ? '接收人' : '转赠人' }}：</span>
              <span class="font-color-textPrimary">{{ counterparty(a) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 原站 w-loading(type=loadingType, empty-type="search") -->
      <div v-if="loadingType === 'loading'" class="rr-loading">
        <span class="rr-loading__text">加载中</span>
      </div>
      <div v-else-if="loadingType === 'empty'" class="rr-empty">
        <img class="rr-empty__img" src="/assets/img/regift/search-empty.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 转赠记录页（对应原站 pages/regift/record）
 *
 * 反编译：chunk `pages-regift-record.db3df6e9.js`
 *   script 116b / render 56c0 / scope 666016ec
 *
 * 接口：POST /user/aboutGift  body { page, types }
 *   types=1 我转赠的；types=2 我收到的
 *   响应 data { total, per_page, current_page, last_page, data: [] }
 */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getGiveRecord } from '@/api'
import { OSS_URL } from '@/config'

const router = useRouter()

/** 原站 tabs（顺序固定） */
const tabs = [
  { name: '我转赠的', type: 1 },
  { name: '我收到的', type: 2 }
]

const search = reactive({ page: 1, types: 1 })
const list = ref([])
const loadingType = ref('none')

/** 原站 computed.currentIndex */
const currentIndex = computed(() => tabs.findIndex((t) => t.type === search.types))

/**
 * 原站 u-tabs line 定位：setLineLeft()
 *   lineOffsetLeft = Σ 前序 item 宽 + (当前 item 宽 - lineWidth) / 2
 *   实测原站：nav 宽 268px（两个 item 各 134px），line 宽 18px
 *   → 第一个 tab：0 + (134-18)/2 = 58px；第二个 tab：134 + 58 = 192px
 */
const TAB_ITEM_W = 134
const LINE_W = 18
const lineStyle = computed(() => ({
  width: LINE_W + 'px',
  transform: `translate(${currentIndex.value * TAB_ITEM_W + (TAB_ITEM_W - LINE_W) / 2}px)`
}))

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
function coverSrc(a) {
  return imgUrl(a && a.product ? a.product.listimg : '')
}

/** types==1（我转赠的）显示接收人 user.mobile；types==2（我收到的）显示转赠人 from_user.mobile */
function counterparty(a) {
  if (!a) return ''
  return search.types == 1 ? (a.user && a.user.mobile) : (a.from_user && a.from_user.mobile)
}

/** 原站 changeTab(t) */
function changeTab(t) {
  if (!t) return
  search.page = 1
  search.types = t.type
  list.value = []
  loadingType.value = 'none'
  getList({ ...search })
}

/** 原站 getList(A) */
async function getList(params) {
  if (loadingType.value === 'loading') return
  loadingType.value = 'loading'
  try {
    const res = await getGiveRecord(params)
    const d = (res && res.data) || {}
    const rows = d.data || []
    loadingType.value = 'none'
    if (rows.length) search.page = params.page
    list.value = list.value.concat(rows)
    if (!d.total) loadingType.value = 'empty'
  } catch (e) {
    loadingType.value = 'none'
  }
}

/** 原站 onReachBottom：复制 search，page++ 后加载 */
function onReachBottom() {
  const params = { ...search }
  params.page = params.page + 1
  getList(params)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

onMounted(() => {
  /** 原站 onLoad → changeTab({type: search.types}) */
  changeTab({ type: search.types })
  window.addEventListener('scroll', onScroll, { passive: true })
})

function onScroll() {
  const el = document.documentElement
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) onReachBottom()
}

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* 原站 scope 666016ec */
.page-bg {
  background: #f7f7f8;
  min-height: 100vh;
}

/* ============ w-navbar(u-navbar) ============ */
/* 实测原站：fixed、bg rgb(250,250,250)、content 高 44px、标题 15px #333、返回箭头 24×24 @ x13/y10 */
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
/* 原站 u-navbar fixed 的 placeholder 占位 44px */
.rr-body {
  padding-top: 44px;
}

/* ============ u-sticky ============ */
/* 原站 u-sticky：offsetTop=0，position sticky；被 fixed navbar 覆盖 */
.rr-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f7f7f8;
}
/* 原站 #regift-record .tabs-contaienr：width 750rpx；background-size 750rpx 100vh；background-position 0 88rpx */
.tabs-contaienr {
  width: 390px;
  background-size: 390px 100vh;
  background-position: 0 45.76px;
  background-repeat: no-repeat;
}

/* ============ w-tabs → u-tabs ============ */
.u-tabs {
  position: relative;
  display: flex;
  flex-direction: row;
}
.u-tabs__wrapper__nav__item {
  width: 134px;
  padding: 0 15px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  cursor: pointer;
}
.u-tabs__wrapper__nav__item__text {
  font-size: 15px;
  line-height: 22px;
  color: #414141;
  width: 104px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
/* 原站 u-tabs line：height 3px、bottom 2px、background url(/static/bg/vector.png) 100% 100% */
.u-tabs__wrapper__nav__line {
  position: absolute;
  left: 0;
  bottom: 2px;
  height: 3px;
  background: url('/assets/img/regift/vector.png') 100% 100% / cover;
  border-radius: 100px;
  transition: transform 0.3s;
}

/* ============ 记录卡片 ============ */
.bg-color-item {
  background-color: #fff;
  border: 1px solid #e7e7ea;
}
.br-12 {
  border-radius: 12.48px;
}
/* 原站 w-image：width=2*83rpx=86.32px、radius=12 */
.rr-cover {
  width: 86.32px;
  height: 86.32px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
}
.rr-cover__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* 原站 #regift-record .info-bar：ptb 4rpx、pl 16rpx、flex-grow 1 */
.info-bar {
  padding-top: 4.16px;
  padding-bottom: 4.16px;
  padding-left: 16.64px;
  flex-grow: 1;
  min-width: 0;
}

/* ============ w-loading ============ */
/* 原站空态：marginTop 2*16rpx=16.64px、paddingBottom 260rpx=135.2px、图片宽 234rpx=121.68px */
.rr-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16.64px;
  padding-bottom: 135.2px;
}
.rr-empty__img {
  width: 121.68px;
  height: 121.68px;
  object-fit: contain;
  display: block;
}
.rr-loading {
  padding: 24px 0;
  text-align: center;
}
.rr-loading__text {
  font-size: 12.48px;
  color: #ababab;
}

/* ============ 工具类 ============ */
.flex {
  display: flex;
}
.flex-js-center {
  justify-content: center;
}
.flex-js-sb {
  justify-content: space-between;
}
.flex-dir-col {
  flex-direction: column;
}
.flex-ai-center {
  align-items: center;
}
.ptb-16 {
  padding-top: 16.64px;
  padding-bottom: 16.64px;
}
.plr-16 {
  padding-left: 16.64px;
  padding-right: 16.64px;
}
.pt-12 {
  padding-top: 12.48px;
}
.plr-12 {
  padding-left: 12.48px;
  padding-right: 12.48px;
}
.pb-16 {
  padding-bottom: 16.64px;
}
.mb-12 {
  margin-bottom: 12.48px;
}
.mt-16 {
  margin-top: 16.64px;
}
.font-size-10 {
  font-size: 10.4px;
}
.font-size-14 {
  font-size: 14.56px;
}
.font-size-16 {
  font-size: 16.64px;
}
.font-w-500 {
  font-weight: 500;
}
.font-color-textPrimary {
  color: #333;
}
.font-color-999 {
  color: #999;
}
.text-overflow-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
