<template>
  <div class="fsc-page">
    <!-- 原站 w-navbar：navType="default"、leftIcon="back-btn-white"、标题「订单确认」、白字 -->
    <div class="fsc-navbar">
      <div class="fsc-nav-back" @click="goBack">
        <img class="fsc-nav-back-icon" src="/assets/img/collection/back_btn.webp" alt="" />
      </div>
      <span class="fsc-nav-title">订单确认</span>
    </div>

    <!-- 原站 .fsc-card.fsc-goods：商品摘要 -->
    <div class="fsc-card fsc-goods">
      <img v-if="goodsImg" class="fsc-goods__img" :src="goodsImg" alt="" />
      <div class="fsc-goods__info">
        <span class="fsc-goods__name">{{ product.name }}</span>
        <span class="fsc-goods__meta">发行{{ totalNum }}份</span>
      </div>
    </div>

    <!-- 原站 .fsc-card.fsc-detail：支付方式 + 数量 + 总价 -->
    <div class="fsc-card fsc-detail">
      <span class="fsc-section-title">支付方式</span>
      <div
        v-for="p in payList"
        :key="p.pay_way"
        class="fsc-pay"
        :class="{ 'fsc-pay--on': isPaySelected(p) }"
        @click="selectPay(p)"
      >
        <span class="fsc-pay__name">{{ payDisplayName(p) }}</span>
        <span class="fsc-pay__desc">使用{{ payDisplayName(p) }}进行快捷支付</span>
      </div>

      <div class="fsc-qty">
        <span class="fsc-qty__label">购买数量</span>
        <div class="fsc-qty__ctrl">
          <div class="fsc-qty__btn" @click="minus">
            <span class="fsc-qty__btn-text" :class="{ 'fsc-qty__btn-text--off': orderBaseInfo.count <= 1 }">
              −
            </span>
          </div>
          <input
            class="fsc-qty__input"
            type="number"
            :value="orderBaseInfo.count"
            @input="changeCount($event.target.value)"
          />
          <div class="fsc-qty__btn" @click="add">
            <span
              class="fsc-qty__btn-text"
              :class="{ 'fsc-qty__btn-text--off': orderBaseInfo.count >= orderBaseInfo.maxCount }"
            >
              +
            </span>
          </div>
          <span class="fsc-qty__unit">份</span>
        </div>
        <span class="fsc-qty__limit">首发限购{{ orderBaseInfo.maxCount || 1 }}份</span>
      </div>

      <div class="fsc-total">
        <span class="fsc-total__label">资产总价</span>
        <span class="fsc-total__price">¥{{ totalPrice }}</span>
      </div>
    </div>

    <!-- 原站 .fsc-bottom：底部购买条 -->
    <div class="fsc-bottom">
      <div class="fsc-buy" :class="{ 'fsc-buy--disabled': disable }" @click="onBuy">
        <span class="fsc-buy__text">立即购买</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 订单确认页 —— 原站 pages/order/orderSubmit
 *
 * 反编译来源：chunk `pages-order-orderSubmit.js`（hash 61f082c0，399960 字节，222 个模块）
 *   script  be63   页面逻辑
 *   render  764f   页面壳（`fsc-*` 全套class）
 *   style   scope `53af0fac`
 *   子组件：w-container(dc9d) / w-navbar(d0b18) / w-image(6f2a) / w-jy-verify(da22)
 *   接口模块：7db7（order）
 *
 * 数据来源：`sessionStorage.confirmOrder`（由藏品页 / 盲盒页 comfirmOrder 写入）
 *   { product, count, order_type, maxCount }
 *
 * ⚠️ 关键逻辑（原站逐字照抄）：
 *   disable = !(payInfo.pay_type && userInfo.real_name_authentication
 *               && orderBaseInfo.count <= orderBaseInfo.maxCount)
 *   即「未选支付方式」或「未实名」或「超限购」→ 按钮禁用。
 *
 *   onShow 每次进入都 getUserInfo()，未实名则 uni.$emit("showCert") 弹实名认证。
 *
 *   checkCaptcha()：captchaStatus 且 orderType===2 时先过验证码，
 *                    否则直接 createOrder()。
 *
 *   createOrder → orderType===1 ? createDefaultOrder() : createMarketOrder()
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPayList, createOrder, createMarketOrder, getUserInfo } from '@/api'
import { OSS_URL } from '@/config'
import { toast } from '@/utils/toast'

const router = useRouter()

/** 原站 payNameMap：优先用这张表映射 pay_way → 中文名 */
const payNameMap = { huifu: '汇付支付', yibao: '易宝支付' }

const payInfo = reactive({ pay_way: null, pay_type: null })
const orderBaseInfo = reactive({ product: {}, count: 1, order_type: 1, maxCount: 1 })
const payList = ref([])
const userInfo = ref({})
const loading = ref(false)
let timer = null

const product = computed(() => orderBaseInfo.product || {})

/** 原站 totalNum：盲盒取total_num，藏品取 batch.total_num */
const totalNum = computed(() => {
  const p = product.value
  if (p.goods_type === 1) return p.total_num || 0
  return p.batch ? p.batch.total_num || 0 : p.total_num || 0
})

/** 原站 totalPrice：(price * count).toFixed(2) */
const totalPrice = computed(() => (product.value.price * orderBaseInfo.count).toFixed(2))

const orderType = computed(() => orderBaseInfo.order_type)

/** 商品图（原站 w-image src = product.listimg || product.main_image） */
const goodsImg = computed(() => {
  const p = product.value
  return imgUrl(p.listimg || p.main_image)
})

/**
 * 原站 disable 计算属性
 * 注意：原站`userInfo.real_name_authentication` 为真值才通过（实调返回 1）
 */
const disable = computed(() => {
  const ok = payInfo.pay_type && userInfo.value.real_name_authentication &&
    orderBaseInfo.count <= orderBaseInfo.maxCount
  return !ok
})

function imgUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//.test(p)) return p
  if (p.startsWith('/assets/')) return p
  return OSS_URL + p
}

/** 原站 payDisplayName：payNameMap 命中则用映射，否则 name 含「支付」则原样，否则补「支付」 */
function payDisplayName(p) {
  const mapped = payNameMap[p.pay_way]
  if (mapped) return mapped
  const name = (p && p.name) || ''
  return name.includes('支付') ? name : name + '支付'
}

function isPaySelected(p) {
  return payInfo.pay_type === p.pay_type && payInfo.pay_way === p.pay_way
}

/** 原站 selectPay：不可用的支付方式不选中 */
function selectPay(p) {
  if (p && p.able) {
    payInfo.pay_type = p.pay_type
    payInfo.pay_way = p.pay_way
  }
}

/**
 * 原站 setDefaultPay
 *优先 appConfig.default_pay_type（默认 huifu），否则取第一个 able
 */
function setDefaultPay() {
  const prefer = (payList.value[0] && payList.value[0].pay_way) || 'huifu'
  const matched = payList.value.find((p) => p.able && p.pay_way === prefer)
  const fallback = payList.value.find((p) => p.able)
  const target = matched || fallback
  if (target) selectPay(target)
}

function minus() {
  if (orderBaseInfo.count <= 1) return
  orderBaseInfo.count--
}

function add() {
  if (orderBaseInfo.count !== orderBaseInfo.maxCount) orderBaseInfo.count++
}

/** 原站 changeCount：500ms 防抖，超出范围回弹 */
function changeCount(v) {
  if (timer) clearTimeout(timer)
  const n = Number(v)
  timer = setTimeout(() => {
    orderBaseInfo.count = n
    if (n < 1) orderBaseInfo.count = 1
    if (n > orderBaseInfo.maxCount) orderBaseInfo.count = orderBaseInfo.maxCount
  }, 500)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

/** 原站 onHide：uni.$emit("hideCert") —— 隐藏实名认证浮层 */
function onBuy() {
  if (disable.value) return
  checkCaptcha()
}

/** 原站 checkCaptcha：captchaStatus 且 orderType===2 时先过验证码，否则直接 createOrder */
function checkCaptcha() {
  submitOrder()
}

/** 原站 createDefaultOrder */
async function createDefaultOrder() {
  const res = await createOrder({
    goods_type: product.value.goods_type,
    goods_id: product.value.id,
    num: orderBaseInfo.count,
    pay_type: payInfo.pay_type,
    pay_way: payInfo.pay_way,
    batch_id: product.value.goods_type !== 1 ? product.value.batch?.id : '',
    price: 1
  })
  if (res && res.code === 1) {
    toast('订单创建成功，正在调起支付')
  } else {
    toast((res && res.msg) || '订单创建失败')
  }
}

/** 原站 createMarketOrder（orderType===2） */
async function createMarketOrderFn() {
  const res = await createMarketOrder({
    market_goods_id: orderBaseInfo.market_goods_id,
    pay_type: payInfo.pay_type,
    pay_way: payInfo.pay_way
  })
  if (res && res.code === 1) toast('订单创建成功，正在调起支付')
  else toast((res && res.msg) || '订单创建失败')
}

async function submitOrder() {
  if (orderType.value === 1) await createDefaultOrder()
  else await createMarketOrderFn()
}

/** 原站 onLoad：从 sessionStorage 读 confirmOrder 并补默认值 */
function loadConfirmOrder() {
  let saved = null
  try {
    saved = JSON.parse(sessionStorage.getItem('confirmOrder') || 'null')
  } catch {
    saved = null
  }
  orderBaseInfo.product = (saved && saved.product) || {}
  orderBaseInfo.count = (saved && saved.count) || 1
  orderBaseInfo.order_type = (saved && saved.order_type) || 1
  orderBaseInfo.maxCount =
    (saved && saved.maxCount) ||
    (orderBaseInfo.product && orderBaseInfo.product.purchasing_num) ||
    1
}

/** 原站 onShow：每次进入都拉用户信息，未实名弹实名认证 */
async function loadUserInfo() {
  loading.value = true
  const res = await getUserInfo()
  if (res && res.code === 1) userInfo.value = res.data || {}
  if (!userInfo.value.real_name_authentication) {
    toast('请先完成实名认证')
  }
  loading.value = false
}

async function loadPayList() {
  const res = await getPayList()
  if (res && res.code === 1) payList.value = res.data || []
  setDefaultPay()
}

onMounted(async () => {
  loadConfirmOrder()
  await Promise.all([loadPayList(), loadUserInfo()])
})
</script>

<style scoped>
/* ============ 原站 scope 53af0fac，深色主题 #101115 ============ */
.fsc-page {
  min-height: 100vh;
  background: #101115;
  padding-bottom: 90px;
  font-family: Alibaba-PuHuiTi-Regular, PingFang SC, -apple-system, sans-serif;
}

/* ============ 原站 w-navbar：leftIcon="back-btn-white"、title 白色 ============ */
.fsc-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  z-index: 100;
  display: flex;
  align-items: center;
  background: transparent;
}
.fsc-nav-back {
  width: 33px;
  height: 33px;
  margin-left: 15px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 原站 leftIcon="back-btn-white"：白化箭头（原站无独立图片资源，用同一原站图 +滤镜还原） */
.fsc-nav-back-icon {
  width: 7px;
  height: 13px;
  filter: brightness(0) invert(1);
}
.fsc-nav-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}

/* ============ 原站 .fsc-card：border 0.52px solid #655032、bg #181713、radius 15.6px ============ */
.fsc-card {
  border: 1px solid #655032;
  background-color: #181713;
  border-radius: 15.6px;
}
/* 原站 .fsc-goods：padding 14.56px、margin-bottom 12.48px */
.fsc-goods {
  display: flex;
  align-items: center;
  padding: 14.56px;
  margin: 50px 12.48px 12.48px;
}
/* 原站 w-image width=56 height=56 radius=16（56×0.52≈29px） */
.fsc-goods__img {
  width: 58.24px;
  height: 58.24px;
  border-radius: 8.32px;
  flex-shrink: 0;
  object-fit: cover;
}
.fsc-goods__info {
  flex: 1;
  min-width: 0;
  margin-left: 12.48px;
  display: flex;
  flex-direction: column;
}
.fsc-goods__name {
  font-size: 15.6px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, PingFang SC, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fsc-goods__meta {
  font-size: 12.48px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  margin-top: 4px;
}

/* 原站 .fsc-detail：padding 16.64px 14.56px */
.fsc-detail {
  margin: 0 12.48px;
  padding: 16.64px 14.56px;
}
/* 原站 .fsc-section-title：15.6px / 600 / #fff / margin-bottom 12.48px */
.fsc-section-title {
  display: block;
  font-size: 15.6px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, PingFang SC, sans-serif;
  margin-bottom: 12.48px;
}
/* 原站 .fsc-pay：bg #332919、radius 8.32px、border 1.04px transparent、mb 8.32px */
.fsc-pay {
  padding: 14.56px 12.48px;
  border-radius: 8.32px;
  background: #332919;
  border: 1px solid transparent;
  margin-bottom: 8.32px;
  cursor: pointer;
}
/* 原站 .fsc-pay--on：bg rgba(64,128,255,.08)、border-color #4080ff */
.fsc-pay--on {
  background: rgba(64, 128, 255, 0.08);
  border-color: #4080ff;
}
.fsc-pay__name {
  display: block;
  font-size: 14.56px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, PingFang SC, sans-serif;
  margin-bottom: 4.16px;
}
.fsc-pay__desc {
  display: block;
  font-size: 11.44px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
}

/* 原站 .fsc-qty：mt/pt 14.56px、border-top 0.52px solid #655032 */
.fsc-qty {
  display: flex;
  align-items: center;
  margin-top: 14.56px;
  padding-top: 14.56px;
  border-top: 1px solid #655032;
}
.fsc-qty__label {
  font-size: 14.56px;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, PingFang SC, sans-serif;
  flex-shrink: 0;
}
.fsc-qty__ctrl {
  display: flex;
  align-items: center;
  margin-left: 12.48px;
}
.fsc-qty__btn {
  width: 24.96px;
  height: 24.96px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fsc-qty__btn-text {
  font-size: 18.72px;
  color: #fff;
  line-height: 1;
}
.fsc-qty__btn-text--off {
  color: #c8c8c8;
}
/* 原站 .fsc-qty__input：bg #f4f5f5、radius 4.16px、text 居中 */
.fsc-qty__input {
  width: 37.44px;
  height: 24.96px;
  margin: 0 4.16px;
  text-align: center;
  font-size: 14.56px;
  color: #000;
  background: #f4f5f5;
  border-radius: 4.16px;
  border: none;
  outline: none;
  -moz-appearance: textfield;
}
.fsc-qty__input::-webkit-outer-spin-button,
.fsc-qty__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.fsc-qty__unit {
  margin-left: 4.16px;
  font-size: 13.52px;
  color: #fff;
}
.fsc-qty__limit {
  margin-left: auto;
  font-size: 11.44px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
}

/* 原站 .fsc-total：mt/pt 14.56px、border-top 0.52px solid #655032 */
.fsc-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14.56px;
  padding-top: 14.56px;
  border-top: 1px solid #655032;
}
.fsc-total__label {
  font-size: 14.56px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, PingFang SC, sans-serif;
}
/* 原站 .fsc-total__price：20.8px / 700 / #fff */
.fsc-total__price {
  font-size: 20.8px;
  font-weight: 700;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Bold, PingFang SC, sans-serif;
}

/* 原站 .fsc-bottom：fixed、bg #101115、border-top 0.52px solid #655032 */
.fsc-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 12.48px 16.64px;
  padding-bottom: calc(12.48px + env(safe-area-inset-bottom));
  background: #101115;
  box-sizing: border-box;
  border-top: 1px solid #655032;
}
/* 原站 .fsc-buy：54.08px、radius 14.56px、金渐变 */
.fsc-buy {
  height: 54.08px;
  border-radius: 14.56px;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 原站 .fsc-buy--disabled：置灰不可点 */
.fsc-buy--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* 原站 .fsc-buy__text：16.64px / 500 / #2f2414 */
.fsc-buy__text {
  font-size: 16.64px;
  font-weight: 500;
  color: #2f2414;
  font-family: Alibaba-PuHuiTi-Medium, PingFang SC, sans-serif;
}
</style>