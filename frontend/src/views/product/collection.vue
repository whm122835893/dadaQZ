<template>
  <div class="col-page">
    <!-- 原站 w-navbar：透明背景 + 标题「藏品」 + 自定义返回按钮 -->
    <div class="col-navbar">
      <div class="col-nav-back" @click="goBack">
        <img class="col-nav-back-icon" src="/assets/img/collection/back_btn.webp" alt="" />
      </div>
      <span class="col-nav-title">藏品</span>
    </div>

    <!-- 原站 hero：主图铺底 + 遮罩 + 居中竖版主图 -->
    <div class="col-hero" :style="{ backgroundImage: mainImage ? `url(${mainImage})` : 'none' }">
      <div class="col-hero-mask" />
      <img class="col-hero-img" :src="mainImage" alt="" @click="previewImg" />
      <!-- 抽签开启时才显示状态角标 -->
      <div
        v-if="darwIsOpen"
        class="col-draw-badge"
        :style="{ color: typeList[signUpStatus].color, borderColor: typeList[signUpStatus].color }"
      >
        {{ typeList[signUpStatus].title }}
      </div>
    </div>

    <div class="col-content">
      <!-- 原站 tools-bar：关注 / 相关公告 / 寄售市场 -->
      <div class="col-tools-bar">
        <div class="col-tool-item" @click="targetLike">
          <img class="col-tool-icon" :src="likeIcon" alt="" />
          <span class="col-tool-text">关注</span>
        </div>
        <div class="col-tool-item" @click="goNotice">
          <img class="col-tool-icon" src="/assets/img/collection/icon-related-public.webp" alt="" />
          <span class="col-tool-text">相关公告</span>
        </div>
        <div class="col-tool-item" @click="goMarket">
          <img class="col-tool-icon" src="/assets/img/collection/icon-consignment-market.webp" alt="" />
          <span class="col-tool-text">寄售市场</span>
        </div>
      </div>

      <!-- 原站 info-card -->
      <div class="col-info-card">
        <div class="col-price-row">
          <span class="col-price-label">发售价</span>
          <div class="col-price-value">
            <span class="col-price-symbol">¥</span>
            <span class="col-price-num">{{ priceText }}</span>
          </div>
        </div>
        <span class="col-goods-name">{{ product.name }}</span>
        <span class="col-goods-supply">发售{{ totalNum }}份</span>

        <div class="col-info-row" @click="goSeries">
          <span class="col-info-label">发售系列</span>
          <div class="col-info-value">
            <span class="col-info-text">{{ seriesName }}</span>
            <span class="col-info-arrow">›</span>
          </div>
        </div>

        <div class="col-info-row">
          <span class="col-info-label">作者介绍</span>
          <div class="col-info-value">
            <span class="col-info-text">{{ authorName }}</span>
          </div>
        </div>

        <div class="col-info-row">
          <span class="col-info-label">藏品详情</span>
          <div v-if="product.introduce_image" class="col-info-detail" v-html="product.introduce_image" />
        </div>

        <div class="col-info-row">
          <span class="col-info-label">购买须知</span>
          <div class="col-notice-box" v-html="noticeText" />
        </div>

        <div style="height: 62.4px" />
      </div>

      <!-- 原站 w-product-alldraw：仅抽签开启时展示 -->
      <template v-if="darwIsOpen">
        <div class="col-panel">
          <div class="col-panel-head">
            <span class="col-panel-title">抽签流程</span>
            <span class="col-panel-explain" @click="noteShow = true">说明</span>
          </div>
          <div class="col-steps">
            <div class="col-step">
              <div class="col-step-name"><i class="col-dot" />抽签</div>
              <div class="col-step-date">{{ formatDate(signStart) }}</div>
              <div class="col-step-time">{{ formatTime(signStart) }}</div>
            </div>
            <div class="col-step-line" />
            <div class="col-step">
              <div class="col-step-name"><i class="col-dot" />结束</div>
              <div class="col-step-date">{{ formatDate(drawEnd) }}</div>
              <div class="col-step-time">{{ formatTime(drawEnd) }}</div>
            </div>
          </div>
          <div class="col-divider" />
          <div class="col-result">
            <div class="col-result-text">
              <template v-if="signUpStatus === 3 && codeInfo.whether_res === 1 && codeInfo.my_code.length">
                <span class="col-result-title">{{ drawTypeText[1].text1 }}</span>
                <span class="col-result-desc">{{ drawTypeText[1].text2 }}</span>
              </template>
              <template v-else-if="signUpStatus === 3 && codeInfo.whether_res === 0 && codeInfo.my_code.length">
                <span class="col-result-title">{{ drawTypeText[0].text1 }}</span>
                <span class="col-result-desc">{{ drawTypeText[0].text2 }}</span>
              </template>
              <template v-else>
                <span class="col-result-desc">请等待结果</span>
              </template>
            </div>
            <span v-if="codeInfo.whether_res !== -1" class="col-result-link" @click="resultJump">中签结果&gt;</span>
          </div>
        </div>
      </template>

      <!-- 原站 w-copyright -->
      <div class="col-copyright" />
    </div>

    <!-- 底部操作区：原站 darwIsOpen ? z-draw-actionV2 : z-product-action -->
    <div v-if="darwIsOpen" class="col-draw-action">
      <!-- 抽签未开始 -->
      <div v-if="signUpStatus === 1" class="col-draw-row">
        <span class="col-remain">还剩 <em class="col-remain-num">{{ inventory }}</em> 份</span>
        <button class="col-draw-btn col-draw-btn-disabled" disabled>活动未开始</button>
      </div>
      <!-- 抽签中 -->
      <div v-else-if="signUpStatus === 2" class="col-draw-row col-draw-row-plain">
        <button v-if="codeInfo.my_draw_num" class="col-draw-btn col-draw-btn-primary" @click="signUp">
          进行中，获取签号（{{ codeInfo.my_draw_num }}）
        </button>
        <button v-else class="col-draw-btn col-draw-btn-primary" @click="toPage('/pages/draw/InvitationFriendAssist/InvitationFriendAssist')">
          暂无抽签次数，快去分享
        </button>
      </div>
      <!-- 已抽签 -->
      <template v-else>
        <div
          v-if="!(isDrawed && codeInfo.whether_res !== -1) && !codeInfo.my_code.length"
          class="col-draw-row col-draw-row-plain"
        >
          <button class="col-draw-btn col-draw-btn-disabled" disabled>等待抽签</button>
        </div>
        <div v-if="codeInfo.my_code.length === 0" class="col-draw-row col-draw-row-plain">
          <button class="col-draw-btn col-draw-btn-disabled" disabled>您未参与本次活动</button>
        </div>
        <div
          v-if="codeInfo.whether_res > -1 && codeInfo.my_code.length"
          class="col-draw-row col-draw-row-plain"
        >
          <template v-if="codeInfo.whether_res === 0">
            <button class="col-draw-btn col-draw-btn-disabled" disabled>很遗憾，您未中签</button>
          </template>
          <template v-else>
            <button v-if="saleStatus === 1" class="col-draw-btn col-draw-btn-disabled" disabled>
              {{ distanceStartText }}
            </button>
            <button v-if="saleStatus === 2" class="col-draw-btn col-draw-btn-primary" @click="showCreate = true">
              已中签，立即购买
            </button>
            <button v-if="saleStatus === 3 || saleStatus === 4" class="col-draw-btn col-draw-btn-primary" @click="toMarket">
              进入市场
            </button>
          </template>
        </div>
      </template>
    </div>

    <!-- 原站 z-product-action：普通发售分支 -->
    <div v-else class="col-tp-action">
      <div class="col-tp-action-bar">
        <!-- 待开售：设置购买提醒 + 倒计时 -->
        <div v-if="saleStatus === 1" class="col-tp-btn col-tp-btn-remind" @click="targetSub">
          <span class="col-tp-btn-text">{{ product.is_sub ? '取消提醒' : '设置购买提醒' }}</span>
          <span class="col-tp-count-down">{{ countDownText }}</span>
        </div>
        <!-- 可购买：立即抢购 -->
        <div v-else-if="saleStatus === 2" class="col-tp-btn" @click="buyAction">
          <span class="col-tp-btn-text">立即抢购</span>
        </div>
        <!-- 已售罄 / 已结束 -->
        <div v-else class="col-tp-btn col-tp-btn-disabled" @click="toMarket">
          <span class="col-tp-btn-text">已售罄，去市场看看</span>
        </div>
      </div>
    </div>

    <!-- 原站 z-product-action 内嵌的购买数量弹窗（u-popup bottom） -->
    <div v-if="showBuy" class="col-buy-mask" @click="showBuy = false">
      <div class="col-buy-panel" @click.stop>
        <div class="col-buy-head">
          <div class="col-buy-head-left">
            <span class="col-buy-label">购买数量</span>
            <span class="col-buy-limit">
              {{ maxBuyCount ? `（购买总数不得超过${maxBuyCount}个）` : '您已达到限购数量' }}
            </span>
          </div>
          <span class="col-buy-close" @click="showBuy = false">✕</span>
        </div>

        <div class="col-buy-goods">
          <img class="col-buy-img" :src="imgUrl(product.listimg)" alt="" />
          <div class="col-buy-info">
            <div class="col-buy-price">
              <span class="col-buy-price-sym">￥</span>
              <span class="col-buy-price-num">{{ product.price }}</span>
            </div>
            <span v-if="product.goods_type !== 1" class="col-buy-random">编号随机</span>
          </div>
          <div class="col-buy-stepper">
            <span class="col-buy-btn" @click="minus">-</span>
            <input
              class="col-buy-input"
              type="number"
              :value="count"
              @input="changeCount($event.target.value)"
            />
            <span class="col-buy-btn col-buy-btn-plus" @click="add">+</span>
          </div>
        </div>

        <button
          class="col-buy-submit"
          :disabled="!count || count > maxBuyCount"
          @click="comfirmOrder"
        >
          立即购买
        </button>
      </div>
    </div>

    <!-- 抽签说明弹窗（原站 z-model） -->
    <div v-if="noteShow" class="col-mask" @click="noteShow = false">
      <div class="col-modal" @click.stop>
        <div class="col-modal-title">抽签说明</div>
        <div class="col-modal-body">
          <div class="col-modal-html" v-html="drawLotsNotice" />
        </div>
        <div class="col-modal-btn" @click="noteShow = false">我知道了</div>
      </div>
    </div>

    <!-- 下单弹窗占位（z-create-order，本页仅需入口） -->
    <div v-if="showCreate" class="col-mask" @click="showCreate = false">
      <div class="col-modal" @click.stop>
        <div class="col-modal-title">确认购买</div>
        <div class="col-order">
          <img class="col-order-img" :src="mainImage" alt="" />
          <div class="col-order-info">
            <div class="col-order-name">{{ product.name }}</div>
            <div class="col-order-price"><i>￥</i>{{ priceText }}</div>
          </div>
        </div>
        <div class="col-modal-btn" @click="toPage('/pages/order/orderSubmit')">去下单</div>
      </div>
    </div>

    <!-- 中签结果提示（原站 u-popup showSignReslut） -->
    <div v-if="showSignResult" class="col-mask">
      <div class="col-pop">
        <div class="col-pop-title">温馨提示</div>
        <div class="col-pop-content">已抽签，签号：{{ signUpInfo.code }}</div>
        <div class="col-pop-actions">
          <div class="col-pop-btn" @click="showSignResult = false">取消</div>
          <div class="col-pop-btn col-pop-btn-primary" @click="showSignResult = false">确认</div>
        </div>
      </div>
    </div>

    <div class="col-safe-bottom" />
  </div>
</template>

<script setup>
/**
 * 藏品发售页 —— 原站 pages/product/collection
 *
 * 反编译依据（pages-product-collection.592d7e9a.js）：
 *   render f18e  页面壳：w-navbar(藏品) / hero / tools-bar / info-card / 底部二选一
 *   logic  0a25  页面逻辑：mainImage / heroBg / priceText / seriesName / authorName /
 *                      likeIcon / noticeText / targetLike / goNotice / goMarket / goSeries
 *   mixin ca08  drawBase / darwIsOpen / signUpStatus / isDrawed / countDown
 *   mixin d48a  saleStatus / saleStartTime / saleEndTime / totalNum / saleTotalNum / maxBuyCount
 *   底部二选一（决定性证据，f18e 尾部）：
 *     a.darwIsOpen ? d("z-draw-actionV2",{product,invitFriend,codeInfo})
 *                   : d("z-product-action",{product})
 *
 * ★ 真实数据（2026-10-20 实调 /box/collection/ProductDetail/ids/20?batch_id=7）：
 *   batch.open_draw = 0 → 该商品走【z-product-action 普通发售】分支，
 *   即底部为「立即抢购 / 已售罄，去市场看看 / 设置购买提醒」，页面不出现抽签流程。
 *
 * 状态机（前端判定，后端不返回状态码）：
 *   signUpStatus  1未开始 / 2抽签中 / 3已抽签
 *   saleStatus     1待开售 / 2可购买 / 3售罄 / 4已结束
 *   whether_res   -1未开奖 / 0未中签 / 1中签
 */
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProductDetail, signUpDraw, getDrawLog, getDrawLotsNotice } from '@/api'
import { OSS_URL } from '@/config'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()

const product = ref({ goods_type: 2, publisher: {}, series: {} })
const codeInfo = ref({ whether_res: -1, my_code: [], my_draw_num: 0 })
const signUpInfo = ref({})
const showSignResult = ref(false)
const showCreate = ref(false)
const showBuy = ref(false)
const noteShow = ref(false)
const drawLotsNotice = ref('')
const nowTime = ref(new Date())
const count = ref(1)

/** 原站 typeList：抽签状态角标 */
const typeList = {
  1: { title: '未开始', color: '#B67930' },
  2: { title: '抽签中', color: '#FF303B' },
  3: { title: '已结束', color: '#999999' }
}

/** 原站 draw_type_text */
const drawTypeText = {
  '-1': { text1: '未开奖', text2: '敬请期待' },
  0: { text1: '很遗憾，未中签', text2: '不要灰心，下次一定！' },
  1: { text1: '恭喜您，中签啦！', text2: '再接再励！' }
}

const priceText = computed(() => (Number(product.value.price) || 0).toFixed(2))
const mainImage = computed(() => (product.value.main_image ? imgUrl(product.value.main_image) : ''))
const seriesName = computed(() => (product.value.series && product.value.series.name) || '')
const authorName = computed(
  () => (product.value.publisher && product.value.publisher.name) || product.value.author || ''
)
const likeIcon = computed(() =>
  product.value.is_like
    ? '/assets/img/collection/icon-liked.webp'
    : '/assets/img/collection/icon-like.webp'
)

/** 原站 noticeText：purchase_information 为空时的兜底长文 */
const noticeText = computed(
  () =>
    product.value.purchase_information ||
    '为更好服务平台的各位用户，特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各不相同，请各位用户务必仔细阅读并同意相关规则后进行相应操作，以免造成不必要的损失。'
)

/**
 * 抽签基准对象（原站 drawBase）
 * 藏品（goods_type=1）取 product 自身，盲盒（=2）取 product.batch
 */
const drawBase = computed(() => {
  const p = product.value
  return p.goods_type === 1 ? p : p.batch && p.batch.id ? p.batch : p
})

/** 是否开启抽签（原站 darwIsOpen）：取 drawBase.open_draw */
const darwIsOpen = computed(() => !!drawBase.value && !!drawBase.value.open_draw)

/** 抽签开始 / 结束时间 */
const signStart = computed(() => drawBase.value?.sign_up_start_time)
const drawEnd = computed(() => drawBase.value?.sign_up_end_time)

/** 抽签状态（原站 signUpStatus） */
const signUpStatus = computed(() => {
  const b = drawBase.value
  if (!b) return 1
  const s = Number(b.sign_up_start_time) * 1000
  const e = Number(b.sign_up_end_time) * 1000
  const now = nowTime.value.getTime()
  if (now < s) return 1
  if (now < e) return 2
  return 3
})

/** 是否已开奖（原站 isDrawed） */
const isDrawed = computed(() => {
  const b = drawBase.value
  if (!b || !b.draw_time) return false
  return nowTime.value.getTime() > Number(b.draw_time) * 1000
})

/** 剩余库存（原站 inventory） */
const inventory = computed(() => {
  const p = product.value
  if (!p.id) return 0
  if (p.goods_type === 1) return Math.max(0, p.total_num - (p.sale_total_num || 0))
  return p.batch ? p.batch.has_num : 0
})

/** 发售开始时间（原站 saleStartTime） */
const saleStartTime = computed(() => {
  const p = product.value
  if (!p.id) return Date.now()
  if (p.goods_type === 1) return Number(p.release_time) * 1000
  if (p.batch) return Number(p.batch.start_time) * 1000
  return Number(p.release_time) * 1000
})

/** 发售结束时间（原站 saleEndTime） */
const saleEndTime = computed(() => {
  const p = product.value
  if (!p.id) return Date.now()
  if (p.goods_type === 1) return Date.now() + 86400000
  if (p.batch) return Number(p.batch.end_time) * 1000
  return Number(p.end_time) * 1000
})

/** 总发售量（原站 totalNum） */
const totalNum = computed(() => {
  const p = product.value
  if (!p.id) return 0
  if (p.goods_type === 1) return p.total_num
  if (p.batch) return p.batch.total_num
  return p.total_num
})

/** 已售数量（原站 saleTotalNum） */
const saleTotalNum = computed(() => {
  const p = product.value
  if (!p.id) return 0
  if (p.goods_type === 1) return p.sale_total_num
  if (p.batch) return totalNum.value - p.batch.has_num
  return p.sale_total_num
})

/** 限购数量（原站 maxBuyCount） */
const maxBuyCount = computed(() => product.value.purchasing_num || 1)

/** 发售状态（原站 saleStatus） */
const saleStatus = computed(() => {
  if (!product.value.id) return 3
  const r = checkTimeBetween(Math.floor(Date.now() / 1000), saleStartTime.value, saleEndTime.value)
  if (r === 2) return 4
  if (!r) return 1
  return saleTotalNum.value >= totalNum.value ? 4 : 2
})

/** 距开售倒计时（原站 countDown，saleStatus=1 时有效） */
const countDownText = computed(() => {
  const diff = Math.max(0, (saleStartTime.value - nowTime.value.getTime()) / 1000)
  const h = String(Math.floor(diff / 3600)).padStart(2, '0')
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
  const s = String(Math.floor(diff % 60)).padStart(2, '0')
  return `${h}:${m}:${s}`
})

/** 距开售倒计时文案（抽签分支用） */
const distanceStartText = computed(() => `${countDownText.value}后开售`)

/** 复刻原站 $tools.checkTimeBetween：0未开始 / 1进行中 / 2已结束 */
function checkTimeBetween(now, start, end) {
  const s = Number(start)
  const e = Number(end)
  if (!s || !e) return 1
  if (now < s) return 0
  if (now > e) return 2
  return 1
}

const p2 = (n) => String(n).padStart(2, '0')
function formatDate(v) {
  const d = new Date(Number(v || 0))
  if (isNaN(d.getTime())) return ''
  return `${p2(d.getMonth() + 1)}月${p2(d.getDate())}日`
}
function formatTime(v) {
  const d = new Date(Number(v || 0))
  if (isNaN(d.getTime())) return ''
  return `${p2(d.getHours())}:${p2(d.getMinutes())}`
}

function imgUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//.test(p)) return p
  if (p.startsWith('/assets/')) return p
  return OSS_URL + p
}

/** 关注（原站 targetLike） */
function targetLike() {
  product.value.is_like = product.value.is_like ? 0 : 1
}

/** 相关公告（原站 goNotice） */
function goNotice() {
  router.push('/pages/notice/notice')
}

/** 寄售市场（原站 goMarket） */
function goMarket() {
  router.push('/pages/market/market')
}

/** 发售系列（原站 goSeries 为空实现，保持无跳转） */
function goSeries() {}

/** 预览大图（原站 previewImg） */
function previewImg() {
  const url = product.value['3d_url'] ? imgUrl(product.value['3d_url']) : mainImage.value
  if (!url) return
  window.open(url, '_blank')
}

/** 报名抽签（原站 signUp） */
async function signUp() {
  const id = drawBase.value?.id
  if (!id) return toast('活动未开始')
  const res = await signUpDraw({ goods_id: id, goods_type: product.value.goods_type })
  if (res && res.code === 1) {
    signUpInfo.value = res.data || {}
    showSignResult.value = true
    loadCodeInfo()
  } else {
    toast((res && res.msg) || '报名失败')
  }
}

function resultJump() {
  const payload = JSON.stringify({
    goods_id: drawBase.value.id,
    goods_type: product.value.goods_type
  })
  toPage(`/pages/draw/drawResult?data=${encodeURIComponent(payload)}`)
}

async function loadCodeInfo() {
  if (!darwIsOpen.value) return
  const res = await getDrawLog({ id: drawBase.value.id })
  if (res && res.code === 1)
    codeInfo.value = res.data || { whether_res: -1, my_code: [], my_draw_num: 0 }
}

/** 设置/取消购买提醒（原站 targetSub → /subscribe/index、/subscribe/cancel） */
async function targetSub() {
  const p = product.value
  const next = !p.is_sub
  const { subscribe, cancelSubscribe } = await import('@/api')
  const payload = {
    type: p.goods_type === 1 ? 20 : 10,
    opr_id: p.goods_type === 1 ? p.id : p.batch.id
  }
  const res = next ? await subscribe(payload) : await cancelSubscribe(payload)
  if (res && res.code === 1) {
    toast(res.msg || (next ? '设置成功' : '已取消'))
    p.is_sub = next
  } else {
    toast((res && res.msg) || '操作失败')
  }
}

/** 立即抢购（原站 buyAction）：maxBuyCount=1 直接下单，否则弹数量框 */
function buyAction() {
  if (maxBuyCount.value === 1) comfirmOrder()
  else showBuy.value = true
}

/** 提交订单（原站 comfirmOrder） */
function comfirmOrder() {
  showBuy.value = false
  sessionStorage.setItem(
    'confirmOrder',
    JSON.stringify({
      product: product.value,
      count: count.value,
      order_type: 1,
      maxCount: maxBuyCount.value
    })
  )
  toPage('/pages/order/orderSubmit')
}

function changeCount(v) {
  let n = Number(v)
  if (isNaN(n) || n < 1) n = 1
  if (n > maxBuyCount.value) n = maxBuyCount.value
  count.value = n
}
function minus() {
  if (count.value <= 1) return
  count.value--
}
function add() {
  if (count.value >= maxBuyCount.value) return
  count.value++
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function toPage(p) {
  if (!p) return
  router.push(p)
}

let timer = null
onMounted(async () => {
  const id = route.query.id || 20
  const batchId = route.query.batch_id || 7
  const [detail, notice] = await Promise.all([
    getProductDetail({ id, batch_id: batchId }),
    getDrawLotsNotice()
  ])
  if (detail && detail.code === 1 && detail.data) {
    product.value = detail.data
    // 原站 getDetails 中强制 goods_type = 2
    product.value.goods_type = 2
    if (product.value.batch) product.value.batch_id = product.value.batch.id
  }
  if (notice && notice.code === 1) drawLotsNotice.value = notice.data?.draw_lots_notice || ''
  loadCodeInfo()
  timer = setInterval(() => {
    nowTime.value = new Date()
  }, 1000)
})
onUnmounted(() => timer && clearInterval(timer))
</script>

<style scoped>
/* ==========================================================
   藏品发售页 —— 原站 f18e 页面壳 + d48a/saleStatus 分支
   数值均已按原站 rpx × 0.52 换算为 px
   ========================================================== */
.col-page {
  min-height: 100vh;
  background: #101115;
  padding-bottom: calc(78px + var(--safe-bottom));
}

/* 顶部导航（原站 w-navbar + nav-back-btn） */
.col-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.col-nav-back {
  position: absolute;
  left: 12.44px;
  top: 50%;
  transform: translateY(-50%);
  width: 33px;
  height: 33px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  cursor: pointer;
}
.col-nav-back-icon {
  width: 7px;
  height: 13px;
}
.col-nav-title {
  font-size: 21px;
  font-weight: bold;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Bold, 'PingFang SC', sans-serif;
}

/* 主图区（原站 hero） */
.col-hero {
  position: relative;
  width: 100%;
  height: 393px;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
.col-hero-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  pointer-events: none;
}
.col-hero-img {
  position: absolute;
  top: 104px;
  left: 50%;
  transform: translateX(-50%);
  width: 168px;
  height: 254px;
  border-radius: 22px;
  box-shadow: 0 0 17px rgba(0, 0, 0, 0.6);
  object-fit: cover;
  cursor: pointer;
}
.col-draw-badge {
  position: absolute;
  top: 60px;
  right: 17px;
  z-index: 2;
  padding: 4px 10px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 12px;
  background: hsla(0, 0%, 100%, 0.85);
}

/* 内容区（原站 content） */
.col-content {
  margin: 0 15.6px;
  background-color: #313131;
  padding: 0;
  border-radius: 15.6px;
  transform: translateY(-24px);
}

/* 工具条（原站 tools-bar） */
.col-tools-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #313131;
  border-radius: 12px;
  padding: 10px 0;
}
.col-tool-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.col-tool-item + .col-tool-item {
  margin-left: 27px;
}
.col-tool-icon {
  width: 24px;
  height: 24px;
}
.col-tool-text {
  margin-left: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, 'PingFang SC', sans-serif;
}

/* 信息卡（原站 info-card） */
.col-info-card {
  background: #181713;
  padding: 15.6px;
  border-radius: 12px;
  margin: 0 12.44px;
}
.col-price-row {
  display: flex;
  align-items: baseline;
}
.col-price-label {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Bold, 'PingFang SC', sans-serif;
}
.col-price-value {
  display: flex;
  align-items: baseline;
  margin-left: 6px;
  color: #fff;
}
.col-price-symbol {
  font-size: 28px;
  font-weight: 800;
  font-family: Alibaba-PuHuiTi-Bold, 'PingFang SC', sans-serif;
  line-height: 1;
}
.col-price-num {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Bold, 'PingFang SC', sans-serif;
  line-height: 1;
  margin-left: 4px;
}
.col-goods-name {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Bold, 'PingFang SC', sans-serif;
}
.col-goods-supply {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #838383;
  font-family: Alibaba-PuHuiTi-Regular, 'PingFang SC', sans-serif;
}
.col-info-row {
  margin-top: 20px;
}
.col-info-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Bold, 'PingFang SC', sans-serif;
}
.col-info-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
}
.col-info-text {
  font-size: 12px;
  color: #838383;
  font-family: Alibaba-PuHuiTi-Regular, 'PingFang SC', sans-serif;
}
.col-info-arrow {
  font-size: 12px;
  color: #666;
  line-height: 1;
}
.col-info-detail {
  margin-top: 6px;
  font-size: 12px;
  color: #838383;
  font-family: Alibaba-PuHuiTi-Regular, 'PingFang SC', sans-serif;
  line-height: 1.7;
}
.col-notice-box {
  margin-top: 6px;
  border-radius: 6px;
  font-size: 12px;
  color: #838383;
  font-family: Alibaba-PuHuiTi-Regular, 'PingFang SC', sans-serif;
  line-height: 1.7;
}
.col-notice-box :deep(p) {
  margin: 0 0 6px;
}

/* 抽签流程面板（原站 currentDrawProcess，浅色卡片） */
.col-panel {
  margin: 15.6px 12.44px 0;
  padding: 0 15.6px 15.6px;
  background: #fff;
  border-radius: 12px;
}
.col-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15.6px;
  padding-top: 15.6px;
}
.col-panel-title {
  font-size: 14px;
  color: #111216;
  font-weight: 700;
}
.col-panel-explain {
  font-size: 12px;
  color: #999;
  font-weight: 700;
  cursor: pointer;
}
.col-steps {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.col-step {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.col-step-name {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #c8a45c;
}
.col-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #c8a45c;
  margin-right: 2px;
}
.col-step-date {
  font-size: 10px;
  color: #222;
  margin-top: 5.2px;
}
.col-step-time {
  font-size: 12px;
  color: #222;
  font-weight: 700;
  margin-top: 5.2px;
}
.col-step-line {
  flex: 1;
  height: 1px;
  background: #ccc;
  margin: 7px 8px 0;
}
.col-divider {
  height: 1px;
  background: #f5f5f5;
  margin: 15.6px 0;
}
.col-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.col-result-text {
  display: flex;
  flex-direction: column;
}
.col-result-title {
  font-size: 14px;
  color: #c8a45c;
  font-weight: 700;
}
.col-result-desc {
  font-size: 12px;
  color: #666;
  margin-top: 5.2px;
}
.col-result-link {
  font-size: 14px;
  color: #c8a45c;
  cursor: pointer;
}

/* 版权位（原站 w-copyright，配置为空时不渲染内容） */
.col-copyright {
  height: 32px;
}

/* ---------- 底部：z-draw-actionV2（抽签分支） ---------- */
.col-draw-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background: #fff;
  display: flex;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.col-draw-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding-left: 16px;
}
.col-draw-row-plain {
  justify-content: center;
  padding-left: 0;
}
.col-remain {
  font-size: 14px;
  color: #333;
  flex: 1;
}
.col-remain-num {
  font-style: normal;
  color: #c8a45c;
}
.col-draw-btn {
  width: 343px;
  height: 46px;
  border: none;
  border-radius: 23px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}
.col-draw-btn-primary {
  background: #c8a45c;
  color: #fff;
}
.col-draw-btn-disabled {
  background: #e5e5e5;
  color: #999;
}

/* ---------- 底部：z-product-action（普通发售分支，原站 tp-action） ---------- */
.col-tp-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background-color: #101115;
  border-top: 1px solid #231f1a;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.col-tp-action-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}
.col-tp-btn {
  width: 340px;
  height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  border-radius: 14px;
  margin-top: 9px;
  margin-bottom: 18px;
  font-family: Alibaba-PuHuiTi-Medium, 'PingFang SC', sans-serif;
  cursor: pointer;
}
.col-tp-btn-text {
  font-size: 15px;
  font-weight: 500;
}
.col-tp-btn-remind {
  flex-direction: row;
  gap: 10px;
}
.col-tp-count-down {
  color: #fff;
  font-size: 12px;
}
.col-tp-btn-disabled {
  background: #211c14;
  border: 1px solid #4d3e27;
  color: #f4dcaa;
}

/* ---------- 购买数量弹窗（原站 z-product-action 内 u-popup） ---------- */
.col-buy-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 900;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}
.col-buy-panel {
  width: 100%;
  background: #fff;
  border-radius: 15.6px 15.6px 0 0;
  padding: 12.44px;
}
.col-buy-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.col-buy-head-left {
  display: flex;
  align-items: flex-end;
}
.col-buy-label {
  font-size: 14px;
  color: #111216;
}
.col-buy-limit {
  font-size: 10px;
  color: #999;
  margin-left: 4px;
}
.col-buy-close {
  font-size: 16px;
  color: #999;
  cursor: pointer;
  line-height: 1;
}
.col-buy-goods {
  display: flex;
  align-items: center;
  padding-top: 12.44px;
}
.col-buy-img {
  width: 70.72px;
  height: 70.72px;
  border-radius: 4px;
  object-fit: cover;
  background: #eee;
}
.col-buy-info {
  flex: 1;
  padding-left: 12.44px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.col-buy-price {
  display: flex;
  align-items: baseline;
}
.col-buy-price-sym {
  font-size: 12px;
}
.col-buy-price-num {
  font-size: 20px;
  margin-left: 4px;
  color: #111216;
}
.col-buy-random {
  font-size: 10px;
  color: #999;
  display: block;
  margin-top: 4px;
}
.col-buy-stepper {
  display: flex;
  align-items: center;
  width: 104.52px;
  height: 31.72px;
  border-radius: 50px;
  border: 1px solid #e7e7ea;
  overflow: hidden;
}
.col-buy-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dedee2;
  color: #000;
  font-size: 14px;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
}
.col-buy-btn-plus {
  background: #000;
  color: #fff;
}
.col-buy-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  text-align: center;
  font-size: 14px;
  color: #111216;
  background: transparent;
  height: 100%;
}
.col-buy-submit {
  width: 100%;
  height: 46px;
  margin-top: 12.44px;
  border: none;
  border-radius: 23px;
  background: #101114;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.col-buy-submit:disabled {
  opacity: 0.4;
}

/* ---------- 通用弹窗 ---------- */
.col-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 900;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
}
.col-modal {
  width: 100%;
  background: #1a1a1a;
  border-radius: 6px;
  padding: 20px 16px 16px;
  text-align: center;
}
.col-modal-title {
  font-size: 14px;
  color: #f8f8f8;
  font-weight: 700;
}
.col-modal-body {
  max-height: 55vh;
  margin-top: 12px;
  overflow-y: auto;
}
.col-modal-html {
  font-size: 14px;
  color: #999;
  line-height: 1.8;
  text-align: left;
}
.col-modal-html :deep(p) {
  margin: 0 0 8px;
}
.col-modal-btn {
  margin-top: 20px;
  height: 46px;
  border-top: 1px solid #cacaca;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #c8a45c;
  cursor: pointer;
}
.col-order {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.col-order-img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  background: #222;
}
.col-order-info {
  text-align: left;
}
.col-order-name {
  font-size: 14px;
  color: #f8f8f8;
}
.col-order-price {
  font-size: 16px;
  color: #f4dcaa;
  font-weight: 700;
  margin-top: 4px;
}
.col-order-price i {
  font-size: 13px;
  font-style: normal;
}

/* 中签结果弹窗（原站 u-popup bgColor #fff） */
.col-pop {
  width: 100%;
  max-width: 312px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
}
.col-pop-title {
  padding: 6px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: #222;
  text-align: center;
}
.col-pop-content {
  padding: 12px 0 24px;
  font-size: 14px;
  color: #333;
  text-align: center;
}
.col-pop-actions {
  display: flex;
  height: 45.76px;
  border-top: 1px solid #cacaca;
}
.col-pop-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
  border-right: 1px solid #cacaca;
  cursor: pointer;
}
.col-pop-btn-primary {
  color: #c8a45c;
  border-right: none;
}

.col-safe-bottom {
  height: calc(70px + var(--safe-bottom));
}
</style>
