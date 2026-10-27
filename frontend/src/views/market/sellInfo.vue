<template>
  <!--
    原站 pages/market/sellInfo（chunk pages-market-sellInfo.1afef989.js，共享 chunk）
      render 8144 / logic bbed（经 2993 装配，scope 227e8585）/ mixin 72d9
      结构：w-container.bg-color-pageBg.page-bg#market-list :loading
        → w-navbar(placeholder:true, navType="marketGoods", bgColor, title, product)
            u-navbar fixed + bgColor 渐变；leftIcon=back-btn（autoBack 含 marketGoods）；
            navType=marketGoods 右侧 w-icon(product.is_like ? "has-like" : "no-like", size 24) @click=targetLike
        → v-uni-view.flex.flex-js-center.mt-16：v-for typeMap
            .flex.flex-dir-col.flex-ai-center.font-color-999.mlr-12.type-item {active}
              .font-size-16.title：name
              .font-size-10：{count}单
        → v-uni-view.plr-16.list：v-for list
            .plr-8.ptb-16.flex.font-color-textPrimary.flex-js-sb.item
              status==1：text(time) + view.font-size-14(#code /total) + view(￥price)
              status>1：view(￥price) + view.font-size-14(number单)
        → w-loading.mt-16 :type=loadingType empty-type=search
      页面 CSS（scope 227e8585）：
        .list .item { border-bottom: 1px solid rgba(0,0,0,.05) }
        .type-item.active { position: relative }
        .type-item.active .title { position: relative; z-index: 2 }
        .type-item.active::after { content:""; position:absolute; width:130rpx; height:12rpx;
          background:url(https://zmwc-static.obs.cn-south-1.myhuaweicloud.com/static/bg/tab-line.webp);
          background-size:cover; top:26rpx; left:0; z-index:1 }
      逻辑（bbed）：
        data { loading, title:"买卖详情", product:{}, id, search:{status:1,page:1}, info:{}, list:[], loadingType:"none" }
        computed typeMap → [{成交记录,type:1,count:info.transaction_record_number},
                            {当前求购,type:2,count:info.current_buying},
                            {当前寄售,type:3,count:info.current_consignment}]
        onPullDownRefresh → getInfo()；onReachBottom → copyObj(search);page++;getList(A)
        onLoad({id}) → id=id; search.goods_id=id; getInfo()
        getInfo() → getMarketGoodsInfo({id,type:2}) → product=data; product.goods_type=2;
                    product.isagreement=this.isagreement; title=product.name;
                    setNavigationBarTitle; getList(search)
                    catch → setTimeout(backPage,1500)；finally stopPullDownRefresh; loading=false
        changeType(A) → search.status=A.type; page=1; loadingType="none"; getList(search)
        getList(A) → loadingType∉[loading,nomore] 时 loadingType="loading"；
                     getSellInfo(A).then → loadingType="none";
                     {list,current_buying,current_consignment,transaction_record_number}=data;
                     info={...}; 1==page&&(list=[]); list.length&&(search=A);
                     list.length<20&&(loadingType="nomore"); list=list.concat(list)
      全局 mixin（app 19d7）：backPage()、handleLang(e)、isLogin(user store)
      navbar logic（4a99）targetLike：isCollect(product.is_like,{types:goods_type,id}) → toast(msg) + is_like 取反
  -->
  <div id="market-list" class="page-bg">
    <!-- 原站 w-navbar：fixed + placeholder 占位 44px；navType=marketGoods → autoBack 显示返回键；
         bgColor 由 mixin 72d9 滚动渐变（black → rgba(51,51,51,opacity)）；
         标题 30rpx=15.6px bold #303133（newTitleStyle），右侧收藏心形 24×24 -->
    <div class="si-navbar" :style="{ backgroundColor: bgColor }">
      <img class="si-navbar__back" src="/assets/img/order/back-btn.png" alt="" @click="goBack" />
      <span class="si-navbar__title">{{ title }}</span>
      <img
        class="si-navbar__like"
        :src="product.is_like > 0 ? '/assets/img/icon/has-like.png' : '/assets/img/icon/no-like.png'"
        alt=""
        @click="targetLike"
      />
    </div>
    <div class="si-body">
      <!-- 原站 tab 组：flex js-center mt-16(16.64px)；item mlr-12(12.48px)；
           title font-size-16(16.64px)；count font-size-10(10.4px) + "单"；
           active：color #333 + ::after 下划线 130rpx×12rpx @ top 26rpx -->
      <div class="si-tabs">
        <div
          v-for="t in typeMap"
          :key="t.type"
          class="si-tab"
          :class="{ active: t.type === search.status }"
          @click="changeType(t)"
        >
          <span class="si-tab__title">{{ t.name }}</span>
          <span class="si-tab__count">{{ t.count }}单</span>
        </div>
      </div>

      <!-- 原站 list：plr-16(16.64px)；item plr-8(8.32px) ptb-16(16.64px) flex jsb + 底部分割线 -->
      <div class="si-list">
        <div v-for="(item, i) in list" :key="i" class="si-item">
          <template v-if="search.status === 1">
            <span class="si-item__time">{{ item.time }}</span>
            <span class="si-item__code">
              #{{ item.collection_code }}
              <span class="si-item__total">/{{ item.total_num }}</span>
            </span>
          </template>
          <span class="si-item__price"> ￥{{ item.price }} </span>
          <span v-if="search.status > 1" class="si-item__num"> {{ item.number }}单 </span>
        </div>
      </div>

      <!-- 原站 w-loading.mt-16(type=loadingType, empty-type=search)；
           search 空配置为空对象（app 7a32），empty 态不渲染内容；本页 getList 无 empty 分支 -->
      <div class="si-loading">
        <div v-if="loadingType === 'loading'" class="si-loading__box">
          <span class="si-loading__icon"></span>
          <span class="si-loading__text">加载中</span>
        </div>
        <div v-else-if="loadingType === 'nomore'" class="si-loading__nomore">已经到底了~</div>
      </div>
    </div>

    <!-- 原站 w-container :loading（getInfo 期间全屏 loading 遮罩） -->
    <div v-if="loading" class="si-mask">
      <span class="si-mask__icon"></span>
      <span class="si-mask__text">加载中</span>
    </div>
  </div>
</template>

<script setup>
/**
 * 买卖详情页（对应原站 pages/market/sellInfo）
 *   路由参数：id（goods_id，如 38）
 *   链路：marketGoodsList 等页跳入；顶部三 tab：成交记录 / 当前求购 / 当前寄售
 *   接口：POST /market/market/marketGoodsDetail   body {id, type:2}（专辑商品，navbar 标题与收藏用）
 *        POST /market/trade/tradingInformation    body {status, page, goods_id}
 *        响应 data { list, transaction_record_number, current_buying, current_consignment }
 *        status=1 成交记录（list: price/time/collection_code/total_num）
 *        status=2 当前求购（list: price/number）
 *        status=3 当前寄售（list: price/number）
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMarketGoodsInfo, getSellInfo, collectToggle } from '@/api'
import { toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()

/** 原站 data */
const loading = ref(false)
const title = ref('买卖详情')
const product = ref({})
const id = ref(null)
const search = ref({ status: 1, page: 1 })
const info = ref({})
const list = ref([])
const loadingType = ref('none')

/** 原站 computed.typeMap：三个 tab 的名称与实时单数 */
const typeMap = computed(() => [
  { name: '成交记录', type: 1, count: info.value.transaction_record_number },
  { name: '当前求购', type: 2, count: info.value.current_buying },
  { name: '当前寄售', type: 3, count: info.value.current_consignment }
])

/** 原站 mixin 72d9：bgColorType=black → 滚动渐变导航栏 */
const opacity = ref(0)
const bgColor = computed(() => `rgba(51, 51, 51, ${opacity.value})`)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/market/market')
}

/** 原站 navbar targetLike：isCollect(product.is_like, {types: goods_type, id: product.id})
 *  → toast(res.msg) + product.is_like 取反 */
async function targetLike() {
  const p = product.value
  if (!p.id) return
  const next = p.is_like > 0 ? 0 : 1
  try {
    const res = await collectToggle(p.is_like, { types: p.goods_type, id: p.id })
    toast((res && res.msg) || (next ? '收藏成功' : '取消收藏'))
    p.is_like = next
  } catch (e) {
    toast('操作失败')
  }
}

/** 原站 getInfo() */
async function getInfo() {
  loading.value = true
  try {
    const res = await getMarketGoodsInfo({ id: id.value, type: 2 })
    const d = (res && res.data) || {}
    product.value = d || {}
    product.value.goods_type = 2
    /* 原站 product.isagreement = this.isagreement（onLoad URL 参数，本站无协议态，透传 query 值） */
    if (route.query.isagreement != null) product.value.isagreement = route.query.isagreement
    title.value = product.value.name
    getList({ ...search.value })
  } catch (e) {
    /* 原站 catch：1.5s 后返回上一页 */
    setTimeout(goBack, 1500)
  } finally {
    loading.value = false
  }
}

/** 原站 changeType(A) */
function changeType(t) {
  search.value.status = t.type
  search.value.page = 1
  loadingType.value = 'none'
  getList({ ...search.value })
}

/** 原站 getList(A) */
async function getList(params) {
  if (loadingType.value === 'loading' || loadingType.value === 'nomore') return
  loadingType.value = 'loading'
  try {
    const res = await getSellInfo(params)
    const d = (res && res.data) || {}
    const rows = d.list || []
    loadingType.value = 'none'
    info.value = {
      current_buying: d.current_buying,
      current_consignment: d.current_consignment,
      transaction_record_number: d.transaction_record_number
    }
    if (params.page === 1) list.value = []
    if (rows.length) search.value = params
    if (rows.length < 20) loadingType.value = 'nomore'
    list.value = list.value.concat(rows)
  } catch (e) {
    loadingType.value = 'none'
  }
}

/** 原站 onReachBottom：copyObj(search); page++; getList(A) */
function onReachBottom() {
  const params = { ...search.value }
  params.page = params.page + 1
  getList(params)
}

/** 原站 onPullDownRefresh → getInfo()（H5 无原生下拉，保留 mixin 滚动逻辑） */
function onScroll() {
  const el = document.documentElement
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) onReachBottom()
  /** mixin 72d9 scrollChange：opacity = scrollTop>=200 ? 1 : scrollTop/200 */
  const t = el.scrollTop || 0
  opacity.value = t >= 200 ? 1 : t / 200
}

onMounted(() => {
  /** 原站 onLoad({id}) */
  id.value = route.query.id
  search.value.goods_id = id.value
  getInfo()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

/* 同一路由不同 id 时重新拉数据，对齐原站 onLoad 语义 */
watch(
  () => route.query.id,
  (v) => {
    id.value = v
    search.value.goods_id = v
    search.value.page = 1
    getInfo()
  }
)
</script>

<style scoped>
.page-bg {
  background: #f7f7f8;
  min-height: 100vh;
}

/* ============ 原站 w-navbar（u-navbar）+ mixin 72d9 ============ */
/* u-navbar--fixed：z-index 11；content 高 44px；标题 30rpx=15.6px bold #303133（newTitleStyle）；
   返回键 w-icon back-btn 24×24 @ left 13px；右侧心形 w-icon 24×24 @ right 13px */
.si-navbar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
}
.si-navbar__back {
  position: absolute;
  left: 13px;
  top: calc(env(safe-area-inset-top) + 10px);
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.si-navbar__title {
  font-size: 15.6px;
  font-weight: bold;
  color: #303133;
  line-height: normal;
}
.si-navbar__like {
  position: absolute;
  right: 13px;
  top: calc(env(safe-area-inset-top) + 10px);
  width: 24px;
  height: 24px;
  cursor: pointer;
}
/* 原站 u-navbar placeholder：fixed+placeholder 时占位 44px */
.si-body {
  padding-top: 44px;
}

/* ============ 原站 tab 组（scope 227e8585 页面 CSS）============ */
/* .flex.flex-js-center.mt-16 → display:flex; justify-content:center; margin-top:32rpx=16.64px */
.si-tabs {
  display: flex;
  justify-content: center;
  margin-top: 16.64px;
}
/* .flex.flex-dir-col.flex-ai-center.font-color-999.mlr-12
   → flex column + ai-center + #999 + 左右 margin 24rpx=12.48px */
.si-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #999;
  margin-left: 12.48px;
  margin-right: 12.48px;
  cursor: pointer;
}
/* .font-size-16.title → 32rpx=16.64px */
.si-tab__title {
  font-size: 16.64px;
  line-height: normal;
}
/* .font-size-10 → 20rpx=10.4px */
.si-tab__count {
  font-size: 10.4px;
  line-height: normal;
}
/* 原站 .font-color-textPrimary, .type-item.active { color:#333 } */
.si-tab.active {
  color: #333;
}
/* .type-item.active { position:relative } */
.si-tab.active {
  position: relative;
}
/* .type-item.active .title { position:relative; z-index:2 } */
.si-tab.active .si-tab__title {
  position: relative;
  z-index: 2;
}
/* .type-item.active::after { content:""; position:absolute; width:130rpx=67.6px; height:12rpx=6.24px;
   background:url(tab-line.webp); background-size:cover; top:26rpx=13.52px; left:0; z-index:1 }
   注：原图所在 OBS bucket 已失效（NoSuchBucket），原站同为裂图状态；
   此处以同尺寸品牌金渐变下划线本地替代（/assets/img/market/tab-line.webp），无任何外链依赖 */
.si-tab.active::after {
  content: '';
  position: absolute;
  width: 67.6px;
  height: 6.24px;
  background: url('/assets/img/market/tab-line.webp');
  background-size: cover;
  top: 13.52px;
  left: 0;
  z-index: 1;
}

/* ============ 原站 list（scope 227e8585）============ */
/* .plr-16 → padding 0 32rpx=16.64px */
.si-list {
  padding-left: 16.64px;
  padding-right: 16.64px;
}
/* .plr-8.ptb-16.flex.font-color-textPrimary.flex-js-sb.item
   → padding 0 16rpx(8.32px) / 32rpx(16.64px) 0 + flex + #333 + space-between */
.si-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  padding-left: 8.32px;
  padding-right: 8.32px;
  padding-top: 16.64px;
  padding-bottom: 16.64px;
}
/* .list .item { border-bottom: 1px solid rgba(0,0,0,.05) } */
.si-list .si-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
/* .font-size-14 → 28rpx=14.56px（#code 列与 number 列） */
.si-item__code {
  font-size: 14.56px;
  line-height: normal;
}
.si-item__num {
  font-size: 14.56px;
  line-height: normal;
}
/* #code 后内嵌 .font-color-999.font-size-12 → #999 + 24rpx=12.48px */
.si-item__total {
  color: #999;
  font-size: 12.48px;
}
.si-item__price {
  line-height: normal;
}
.si-item__time {
  line-height: normal;
}

/* ============ 原站 w-loading.mt-16（scope 227e8585）============ */
.si-loading {
  margin-top: 16.64px;
}
/* 原站 u-loading-icon：circle 模式 14px #4478FF + 文本 textSize 14 */
.si-loading__box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}
.si-loading__icon {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(68, 120, 255, 0.25);
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: siSpin 0.8s linear infinite;
}
@keyframes siSpin {
  to {
    transform: rotate(360deg);
  }
}
.si-loading__text {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}
/* 原站 w-loading nomore：font-size-12(12.48px) font-color-describe(#ababab) flex-center */
.si-loading__nomore {
  font-size: 12.48px;
  color: #ababab;
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* ============ 原站 w-container :loading 全屏遮罩 ============ */
.si-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(247, 247, 248, 0.6);
}
.si-mask__icon {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(68, 120, 255, 0.25);
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: siSpin 0.8s linear infinite;
}
.si-mask__text {
  margin-top: 10px;
  font-size: 13px;
  color: #606266;
}
</style>
