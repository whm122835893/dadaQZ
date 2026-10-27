<template>
  <div class="box-page">
    <!-- 原站 w-navbar：navType="goods" 走 autoBack，滚动渐变 mixin 72d9 -->
    <div class="box-navbar" :style="{ background: bgColor }">
      <div class="box-nav-back" @click="goBack">
        <img class="box-nav-back-icon" src="/assets/img/collection/back_btn.webp" alt="" />
      </div>
      <span v-if="pageTitle" class="box-nav-title">{{ pageTitle }}</span>
    </div>

    <!-- 原站 w-product-details-card：白底圆角卡，crystal 类目时挂 crystal class -->
    <div class="product-card" :class="{ crystal: product.crystal }">
      <div class="media-card">
        <div class="media-box">
          <img v-if="mediaUrl" class="media-img" :src="mediaUrl" alt="" @click="preview" />
        </div>
      </div>

      <div class="goods-info">
        <div class="flex flex-ai-center">
          <span class="main-button">嗒嗒精选</span>
          <span class="desc-button" style="margin-left: 30rpx">数字艺术</span>
        </div>
        <div class="product-name">{{ product.name }}</div>
        <div class="product-slogan">一枚关于想象、链接与未来的数字艺术藏品</div>

        <div class="goods-price flex flex-ai-center flex-js-sb">
          <div>
            <span class="desc-text-style">首发价格</span>
            <span class="price">¥{{ priceText }}</span>
          </div>
        </div>

        <div class="goods_public_info">
          <div class="flex flex-ai-center flex-js-sb">
            <div style="width: 50%">
              <div class="desc-text-style">发行 / SUPPLY</div>
              <div class="title-text-style" style="font-size: 14px; margin-top: 7px">
                {{ product.total_num }}
              </div>
            </div>
            <div style="width: 50%">
              <div class="desc-text-style">流通 / CIRCULATION</div>
              <div class="title-text-style" style="font-size: 14px; margin-top: 7px">
                {{ product.flux || '--' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="plr-16 ptb-12">
      <!-- 原站 w-product-box：可能抽到的作品列表 -->
      <div v-if="collectionList.length" class="product-box pa-12 br-12 bg-color-item">
        <div class="font-size-14 flex flex-js-sb flex-ai-center" style="width: 100%">
          <span class="title-text-style">藏品描述</span>
          <span class="flex-1" />
        </div>
        <div class="mt-12">
          <span class="desc-text-style">您可能抽到以下作品中的 1 个</span>
        </div>

        <div
          v-for="item in collectionList"
          :key="item.id"
          class="pa-6 flex itme mt-12 flex-ai-center"
        >
          <img class="itme-img" :src="imgUrl(item.listimg)" alt="" />
          <div class="flex-1 flex flex-dir-col flex-js-sb pl-8 ptb-6" style="height: 59px">
            <span class="font-size-13 font-w-500 title-text-style">{{ item.name }}</span>
            <div class="flex font-size-12">
              <span class="desc-text-style">概率：{{ item.probability }}%</span>
              <span class="ml-20 desc-text-style">总量：{{ item.show_total_num }}份</span>
            </div>
          </div>
          <img v-if="item.rarity_icon" class="itme-rarity" :src="imgUrl(item.rarity_icon)" alt="" />
        </div>
      </div>

      <!-- 原站 w-product-introduce：藏品故事 -->
      <div class="bg-color-item br-8 pa-12 product-introduce mt-12">
        <div class="font-size-14 flex flex-js-sb flex-ai-center" style="width: 100%">
          <span class="product-builder-title">藏品故事 / STORY</span>
          <span class="flex-1" />
        </div>
        <div class="mt-12 product-parse" v-html="product.introduce_image || ''" />
      </div>

      <!-- 原站 w-product-buy-need：藏品须知 -->
      <div
        v-show="product.purchase_information"
        class="pa-12 bg-color-item br-8 buy-need mt-12"
      >
        <div class="font-size-14 flex flex-js-sb flex-ai-center" style="width: 100%">
          <span class="product-builder-title">藏品须知 / NOTICE</span>
          <span class="flex-1" />
        </div>
        <div class="mt-12 product-parse" v-html="product.purchase_information || ''" />
      </div>

      <div class="w-copyright">Copyright © 嗒嗒艺术</div>
    </div>

    <!-- 原站 w-product-action（浅色版，非藏品页的深色 z-product-action） -->
    <div class="product-action">
      <div class="action-container flex flex-ai-center flex-js-sb">
        <div v-if="saleStatus !== 4" class="price price-18">
          <i>￥</i><span class="ml-4">{{ product.price }}</span>
        </div>

        <div v-if="saleStatus === 1" @click="targetSub">
          <div v-if="product.is_sub" class="action-btn flex flex-dir-col flex-center">
            <span>取消提醒</span>
            <span><span class="count-down">{{ countDownText }}</span></span>
          </div>
          <div v-else class="action-btn flex flex-dir-col flex-center no-sub">
            <span>设置购买提醒</span>
            <span class="count-down">{{ countDownText }}</span>
          </div>
        </div>

        <button
          v-if="saleStatus === 2"
          class="w-button colorful buy-btn"
          @click="buyAction"
        >
          立即购买
        </button>

        <button v-if="saleStatus === 4" class="w-button disabled sellout-btn" disabled>
          已售罄，去市场看看
        </button>
      </div>

      <!-- 购买数量弹窗（u-popup bottom，bgColor transparent） -->
      <div v-if="show" class="popup-mask" @click="show = false">
        <div class="submit-order bg-color-item pa-12" @click.stop>
          <div class="flex flex-js-sb flex-ai-center">
            <div class="flex flex-ai-end">
              <span class="order-label">购买数量</span>
              <span class="font-size-10 ml-4 order-tip">
                {{ maxBuyCount ? `（购买总数不得超过${maxBuyCount}个）` : '您已达到限购数量' }}
              </span>
            </div>
            <!-- 原站 w-icon name="close2"（uView iconfont），以 CSS 叉号还原同一视觉 -->
            <span class="popup-close" @click="show = false" />
          </div>

          <div class="pt-12 flex">
            <img class="br-4 order-img" :src="imgUrl(product.listimg)" alt="" />
            <div class="pl-12 ptb-10 flex-1">
              <div class="price">
                <i class="font-size-12">￥</i><span class="font-size-20 ml-4">{{ product.price }}</span>
              </div>
              <span class="font-size-10 order-num">编号随机</span>
            </div>
            <div class="flex flex-ai-center count-box">
              <div class="count-btn" @click="minus">-</div>
              <input
                class="count-input"
                type="number"
                v-model="count"
                @input="changeCount"
              />
              <div class="count-btn count-btn-add" @click="add">+</div>
            </div>
          </div>

          <button
            class="w-button colorful mt-12"
            :disabled="!count || count > maxBuyCount"
            @click="comfirmOrder"
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 盲盒开盒页 —— 原站 pages/product/box
 *
 * 反编译来源：chunk `pages-product-box.js`（c7594761）
 *   script  8ab0   页面逻辑（mixins: d48a 发售状态 + 72d9 导航栏滚动渐变）
 *   render  7aa3   页面壳
 *   子组件：
 *     w-container           dc9d
 *     w-navbar             4a99（与藏品页共用）
 *     w-product-details-card  e788 + 4e30
 *     w-product-box        32e6 + 231b（可能抽到的作品列表）
 *     w-product-introduce  ec26 + ac5a（藏品故事）
 *     w-product-buy-need   a5d7 + 3ce9（藏品须知）
 *     w-copyright          773f
 *     w-product-action     84664 + baf0（浅色版底部购买条）
 *     w-media              dbec + 65fc（主图，3d_url_type 切换 img/3d/mp4）
 *
 * ⚠️ 与藏品页（product/collection）的关键差异：
 *   1. 浅色主题：page-bg #f7f7f8，卡片纯白 —— 藏品页是深色 #101115
 *   2. 顶部是横版详情卡（media-card 52rpx 上边距 + 白卡 goods-info），
 *      而非藏品页的 hero 铺底大图
 *   3. 独有「藏品描述」区块：盲盒可能抽到的作品 + 概率 + 总量
 *   4. 无 tools-bar（关注/相关公告/寄售市场）、无发售系列、无作者介绍
 *   5. 导航栏 rightAction → /pages/blindBox/openRecord（开盒记录）
 *   6. 藏品故事用 introduce_image，藏品须知用 purchase_information
 *
 * saleStatus（mixin d48a）：1待开售 / 2可购买 / 3无数据 / 4已结束或售罄
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBoxDetail } from '@/api'
import { OSS_URL } from '@/config'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()

const product = ref({ goods_type: 1, publisher: {}, series: {} })
const show = ref(false)
const count = ref(1)
const opacity = ref(0)
const pageTitle = ref(null)
let timer = null

/** 可能抽到的作品（原站 product.collectionlist） */
const collectionList = computed(() => product.value.collectionlist || [])

const priceText = computed(() => (Number(product.value.price) || 0).toFixed(2))

/** 主图（原站 mediaUrl：3d_url_type === 'img' 用 main_image，否则用 3d_url） */
const mediaUrl = computed(() => {
  const p = product.value
  const raw = p['3d_url_type'] === 'img' ? p.main_image : p['3d_url'] || p.main_image
  return raw ? imgUrl(raw) : ''
})

/** 导航栏背景（原站 mixin 72d9：bgColorType 固定 black，透明度随滚动 200px 内渐变） */
const bgColor = computed(() => `rgba(51,51,51,${opacity.value})`)

/** 发售开始时间（原站 saleStartTime：盲盒取 release_time） */
const saleStartTime = computed(() => {
  const p = product.value
  if (!p.id) return Date.now()
  return Number(p.release_time || p.batch?.start_time || 0) * 1000
})

/** 发售结束时间（原站 saleEndTime） */
const saleEndTime = computed(() => {
  const p = product.value
  if (!p.id) return Date.now()
  if (p.batch && p.batch.end_time) return Number(p.batch.end_time) * 1000
  return Number(p.end_time || 0) * 1000 || Date.now() + 86400000
})

/** 总发售量（原站 totalNum） */
const totalNum = computed(() => product.value.total_num || 0)

/** 已售数量（原站 saleTotalNum） */
const saleTotalNum = computed(() => {
  const p = product.value
  if (p.batch && p.batch.id) return p.batch.total_num - (p.batch.has_num || 0)
  return p.sale_total_num || 0
})

/** 限购数量（原站 maxBuyCount） */
const maxBuyCount = computed(() => product.value.purchasing_num || 1)

/** 发售状态（原站 saleStatus，mixin d48a） */
const saleStatus = computed(() => {
  if (!product.value.id) return 3
  const r = checkTimeBetween(Math.floor(Date.now() / 1000), saleStartTime.value, saleEndTime.value)
  if (r === 2) return 4
  if (!r) return 1
  return saleTotalNum.value >= totalNum.value ? 4 : 2
})

/** 距开售倒计时（原站 u-count-down HH:mm:ss） */
const countDownText = computed(() => {
  const diff = saleStartTime.value - Date.now()
  if (diff <= 0) return '00:00:00'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(h)}:${p(m)}:${p(s)}`
})

/** 复刻原站 $tools.checkTimeBetween：0未开始 / 1进行中 / 2已结束 */
function checkTimeBetween(now, start, end) {
  const s = Number(start)
  const e = Number(end)
  if (!s || !e) return 1
  if (now * 1000 < s) return 0
  if (now * 1000 > e) return 2
  return 1
}

function imgUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//.test(p)) return p
  if (p.startsWith('/assets/')) return p
  return OSS_URL + p
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

/** 预览大图（原站 preview） */
function preview() {
  if (!mediaUrl.value) return
  window.open(mediaUrl.value, '_blank')
}

/**
 * 设置/取消购买提醒（原站 targetSub）
 * 注意盲盒的 type 是 20（藏品是 10），opr_id 取 product.id 而非 batch.id
 */
async function targetSub() {
  const p = product.value
  const next = !p.is_sub
  const { subscribe, cancelSubscribe } = await import('@/api')
  const payload = {
    type: p.goods_type === 1 ? 20 : 10,
    opr_id: p.goods_type === 1 ? p.id : p.batch?.id
  }
  const res = await (next ? subscribe(payload) : cancelSubscribe(payload))
  toast((res && res.msg) || (next ? '设置成功' : '已取消'))
  p.is_sub = next
}

/** 立即购买（原站 buyAction）：maxBuyCount=1 直接下单，否则弹数量框 */
function buyAction() {
  if (maxBuyCount.value === 1) comfirmOrder()
  else show.value = true
}

/** 提交订单（原站 comfirmOrder → sessionStorage.confirmOrder → orderSubmit） */
function comfirmOrder() {
  show.value = false
  sessionStorage.setItem(
    'confirmOrder',
    JSON.stringify({
      product: product.value,
      count: count.value,
      order_type: 1,
      maxCount: maxBuyCount.value
    })
  )
  router.push('/pages/order/orderSubmit')
}

function minus() {
  if (count.value <= 1) return
  count.value--
}

function add() {
  if (count.value >= maxBuyCount.value) return
  count.value++
}

function changeCount() {
  let n = Number(count.value) || 1
  if (n < 1) n = 1
  if (n > maxBuyCount.value) n = maxBuyCount.value
  count.value = n
}

/** 导航栏滚动渐变（原站 mixin 72d9 scrollChange） */
function onScroll() {
  const top = window.scrollY
  opacity.value = top >= 200 ? 1 : top / 200
  pageTitle.value = product.value.name && top >= 120 ? product.value.name : null
}

async function load() {
  const id = route.query.id
  if (!id) return
  const res = await getBoxDetail({ id })
  if (res && res.code === 1) {
    product.value = { ...(res.data || {}), goods_type: 1 }
  } else {
    toast((res && res.msg) || '获取失败')
    setTimeout(goBack, 1500)
  }
}

onMounted(() => {
  load()
  window.addEventListener('scroll', onScroll, { passive: true })
  timer = setInterval(() => {}, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* ============ 原站浅色主题（page-bg #f7f7f8） ============ */
.box-page {
  min-height: 100vh;
  background: #f7f7f8;
  padding-bottom: 100px;
  font-family: PingFang SC, -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 原子类 */
.flex { display: flex; }
.flex-1 { flex-grow: 1; }
.flex-ai-center { align-items: center; }
.flex-ai-end { align-items: flex-end; }
.flex-js-sb { justify-content: space-between; }
.flex-dir-col { flex-direction: column; }
.flex-center { align-items: center; justify-content: center; }
.font-size-10 { font-size: 10px; }
.font-size-12 { font-size: 12px; }
.font-size-13 { font-size: 13px; }
.font-size-14 { font-size: 14px; }
.font-w-500 { font-weight: 500; }
.ml-4 { margin-left: 4px; }
.ml-20 { margin-left: 20px; }
.mt-12 { margin-top: 12px; }
.pl-8 { padding-left: 8px; }
.pl-12 { padding-left: 12px; }
.pt-12 { padding-top: 12px; }
.ptb-6 { padding-top: 6px; padding-bottom: 6px; }
.ptb-10 { padding-top: 10px; padding-bottom: 10px; }
.ptb-12 { padding-top: 12px; padding-bottom: 12px; }
.pa-6 { padding: 6px; }
.pa-10 { padding: 10px; }
.pa-12 { padding: 12px; }
.plr-16 { padding-left: 16px; padding-right: 16px; }
.br-4 { border-radius: 4px; }
.br-8 { border-radius: 8px; }
.br-12 { border-radius: 12px; }

/* 原站 .bg-color-item：白底 + 1px #e7e7ea 边框 + radius 20.8px */
.bg-color-item {
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 10.4px;
}
/* 原站 .title-text-style / .desc-text-style */
.title-text-style { font-weight: 700; font-size: 12px; color: #111216; }
.desc-text-style { font-weight: 400; font-size: 10px; color: #85868d; }
/* 原站 .main-button / .desc-button */
.main-button {
  background: #101114;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  color: #fff;
  padding: 4.16px;
}
.desc-button {
  background: #f0f0f2;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 10px;
  color: #111;
  padding: 4.16px;
}

/* ============ 原站 w-navbar ============ */
.box-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  z-index: 100;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.box-nav-back {
  width: 33px;
  height: 33px;
  margin-left: 15px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}
.box-nav-back-icon { width: 7px; height: 13px; }
.box-nav-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  font-weight: bold;
  color: #333;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============ 原站 w-product-details-card ============ */
.product-card { position: relative; }
/* 原站 .media-card：margin-top 52rpx = 27px，居中 */
.media-card {
  margin-top: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 原站 w-media 组件 width=300 → 2*300rpx = 600rpx = 312px 方图 */
.media-box {
  width: 312px;
  height: 312px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}
/* 原站 .goods-info：margin 30rpx(15.6px)，padding 30rpx，radius 52rpx(26px) */
.goods-info {
  background-color: #fff;
  margin: 15.6px;
  padding: 15.6px;
  border-radius: 13px;
  position: relative;
  z-index: 1;
}
.product-name { font-size: 18.72px; font-weight: 700; line-height: 25px; margin-top: 6px; color: #111216; }
.product-slogan { margin-top: 7px; font-weight: 400; font-size: 12px; color: #73737b; }
/* 原站 .goods-price：margin-top 56rpx = 29.12px */
.goods-price { margin-top: 29.12px; }
/* 原站 .price：字号 20px bold */
.price { font-size: 20px; font-weight: 700; color: #111114; margin-left: 6px; }
.price i { font-style: normal; font-size: 14px; }
/* 原站 .goods_public_info：margin-top 7px */
.goods_public_info { margin-top: 7px; }

/* ============ 原站 w-product-box（藏品描述） ============ */
.product-box { border: none; }
.product-box .title { font-size: 18.72px; }
/* 原站 .itme：border 1rpx solid #e7e7ea，radius 8px */
.itme {
  border: 1px solid #e7e7ea;
  border-radius: 8px;
  opacity: 1;
}
/* 原站 w-image width=59 → 59rpx×? 原站单位 rpx，312px 卡宽下约 30px */
.itme-img {
  width: 59px;
  height: 59px;
  border-radius: 4px;
  flex-shrink: 0;
  object-fit: cover;
}
.itme-rarity {
  width: 55px;
  height: 55px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* ============ 原站 w-product-introduce / w-product-buy-need ============ */
.product-introduce,
.buy-need { border: none; }
/* 原站 .product-builder-title */
.product-introduce .product-builder-title,
.buy-need .product-builder-title { font-weight: 700; font-size: 12px; color: #111114; }
.product-parse {
  color: #999;
  font-size: 12px;
  line-height: 1.6;
  word-break: break-all;
}
.product-parse :deep(p) { margin: 0 0 6px; }

.w-copyright {
  text-align: center;
  font-size: 10px;
  color: #b0b0b6;
  padding: 18px 0 8px;
}

/* ============ 原站 w-product-action（浅色） ============ */
.product-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
}
.action-container {
  height: 52px;
  padding: 0 16px;
  background: #fff;
}
.price-18 { font-size: 18px; font-weight: bold; color: #111114; }
.price-18 i { font-style: normal; font-size: 18px; font-weight: bold; }
/* 原站 .action-btn：胶囊按钮，内含文案 + 倒计时 */
.action-btn {
  min-width: 120px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #101115;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.25;
  padding: 0 16px;
  text-align: center;
}
.action-btn.no-sub { line-height: 40px; }
.count-down { font-size: 11px; font-weight: 400; }
/* 原站 w-button：type=colorful shape=circle width 480rpx = 250px */
.w-button {
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  height: 40px;
  cursor: pointer;
}
.w-button.colorful { width: 250px; }
.buy-btn { color: #101115; }
.w-button.disabled,
.sellout-btn {
  width: 100%;
  background: #f0f0f2;
  color: #999;
  cursor: not-allowed;
}

/* ============ 原站 u-popup bottom 购买数量弹窗 ============ */
.popup-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}
.submit-order {
  width: 100%;
  border-radius: 12px 12px 0 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
.order-label { color: #111216; font-size: 14px; font-weight: 500; }
.order-tip { color: #85868d; }
/* 原站 w-icon size=24 → 24rpx×2 = 12px 叉号 */
.popup-close {
  position: relative;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  cursor: pointer;
}
.popup-close::before,
.popup-close::after {
  content: '';
  position: absolute;
  left: 0;
  top: 5px;
  width: 12px;
  height: 1px;
  background: #85868d;
}
.popup-close::before { transform: rotate(45deg); }
.popup-close::after { transform: rotate(-45deg); }
.order-img { width: 68px; height: 68px; object-fit: cover; flex-shrink: 0; }
.order-num { color: #999; display: block; margin-top: 4px; }
/* 原站 .count-box：width 201rpx height 61rpx radius 100rpx */
.count-box {
  width: 104px;
  height: 31px;
  border-radius: 50px;
  background: #f5f5f6;
  flex-shrink: 0;
}
.count-btn {
  padding: 5px;
  width: 15px;
  height: 15px;
  background-color: #dedee2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-size: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
}
.count-btn-add { background-color: #000; color: #fff; }
.count-input {
  width: 65px;
  text-align: center;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  background: transparent;
  font-size: 13px;
  outline: none;
}
</style>