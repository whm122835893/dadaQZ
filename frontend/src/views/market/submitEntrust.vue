<template>
  <!--
    原站 pages/market/submitEntrust（发起委托，深色主题）
      script 模块 14d3（chunk pages-market-submitEntrust.6544ce09.js）
        data { showPriceTips, loading, id, info{floor_price:{}}, form{number:1, price:null},
               payList[], chargeInfo{}, sellingPrice, low_price, rate, share_proportion_rate }
        computed:
          priceTips       → number>1 && price → "(合计:￥{price}x{number}=￥{totalPrice})"
          placeholderTips → floor_price.minprice → "不得低于{xx.xx}元"；否则 "请输入委托价格"
          totalPrice      → price && number → (price*number).toFixed(2)；否则 "--"
          servicePrice    → totalPrice=="--" ? 0 : (totalPrice*rate).toFixed(2)
          disable         → 未选支付方式 或 无价格/数量
          priceTipsTitle  → "建议委托价：￥96"（原站硬编码，本页 render 未使用）
        onLoad({id}) → getUserInfo → payList = basePayList.map(able = !!userInfo[auth_key], check=false)
                       → getInfo()（getTradInfo）
                       → getEntrustInfo(id) → chargeInfo + rate/low_price/share_proportion_rate
        priceInput(e)  → debounce 500ms：含 "." 时小数位截断到 2 位
        tipAction(A)   → A && navigateTo /pages/market/marketGoodsList?id={id}&isagreement=1
        toOpen()       → navigateTo /pages/wallet/wallet
        targetCheck(p) → 单选支付方式（再次点击取消）
        getInfo(ref)   → getTradInfo(id) → info = data；ref → toast 刷新成功
        createOrder()  → price<=0 → toast「请输入价格」；否则 form.pay_way/collection_id 后
                         entrust(form) → new Pay({order_id, order_sn, order_type:31, pay_type:4, pay_way})
      render 模块（scope 06c4c513）；与 submitBegBuy（scope 0e57c3ac）CSS 逐字一致，
        仅多 6 条：.fsc-row / __label / __value / __value--minus / __value--gold / .fsc-html
    差异点（vs submitBegBuy）：无地板价 hint 行、meta=委托、placeholder 默认「请输入委托价格」、
        新增「预计收入」卡与「委托说明」卡（chargeInfo.tips → u-parse）、下单走 entrust 直接支付
  -->
  <div id="beg-entrust-submit" class="fsc-page">
    <!-- 原站 w-navbar：深色主题，白色标题 + 白色返回箭头（leftIcon=back-btn-white） -->
    <div class="fsc-navbar">
      <img class="fsc-navbar__back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
      <span class="fsc-navbar__title">发起委托</span>
    </div>

    <div class="fsc-body">
      <!-- 藏品卡 -->
      <div class="fsc-card fsc-goods">
        <img class="fsc-goods__img" :src="coverSrc" alt="" />
        <div class="fsc-goods__info">
          <span class="fsc-goods__name">{{ info.name }}</span>
          <span class="fsc-goods__meta">委托</span>
        </div>
        <!-- 数量步进器（原站 u-number-box 黑金化：bgColor #1E1B16 / color #F4DCAA） -->
        <div class="fsc-goods__qty">
          <div class="fsc-step" :class="{ 'fsc-step--off': form.number <= 1 }" @click="step(-1)">
            <span class="fsc-step__text">−</span>
          </div>
          <input
            class="fsc-qty__input"
            type="number"
            :value="form.number"
            @input="onQtyInput"
          />
          <div class="fsc-step" @click="step(1)">
            <span class="fsc-step__text">+</span>
          </div>
        </div>
      </div>

      <!-- 价格与数量（原站无 fsc-hint 行） -->
      <div class="fsc-card fsc-detail">
        <span class="fsc-section-title">价格与数量</span>
        <div class="fsc-field">
          <span class="fsc-field__unit">¥</span>
          <input
            class="fsc-field__input"
            type="number"
            :placeholder="placeholderTips"
            :value="form.price"
            @input="priceInput"
          />
        </div>
        <span v-if="priceTips" class="fsc-field__tip">{{ priceTips }}</span>
      </div>

      <!-- 支付方式 -->
      <div class="fsc-card fsc-detail">
        <span class="fsc-section-title">支付方式</span>
        <div
          v-for="p in payList"
          :key="p.auth_key"
          class="fsc-pay"
          :class="{ 'fsc-pay--on': p.check, 'fsc-pay--off': !p.able }"
          @click="targetCheck(p)"
        >
          <img class="fsc-pay__icon" :src="payIcon(p.icon)" alt="" />
          <div class="fsc-pay__body">
            <span class="fsc-pay__name">{{ p.name }}</span>
            <span class="fsc-pay__desc">
              {{ p.able ? `使用${p.name}进行快捷支付` : '该支付方式尚未开通' }}
            </span>
          </div>
          <div v-if="p.able" class="fsc-radio" :class="{ 'fsc-radio--on': p.check }">
            <span class="fsc-radio__dot"></span>
          </div>
          <div v-else class="fsc-open" @click.stop="toOpen">去开通</div>
        </div>
      </div>

      <!-- 预计收入（原站 render 新增卡） -->
      <div class="fsc-card fsc-detail">
        <span class="fsc-section-title">预计收入</span>
        <div class="fsc-row">
          <span class="fsc-row__label">总售价</span>
          <span class="fsc-row__value">¥{{ totalPrice }}</span>
        </div>
        <div class="fsc-row">
          <span class="fsc-row__label">综合服务费 ({{ ratePercent }}%)</span>
          <span class="fsc-row__value fsc-row__value--minus">- ¥{{ servicePrice }}</span>
        </div>
      </div>

      <!-- 委托说明（原站 chargeInfo.tips → u-parse；本项目按已验证页惯例用 v-html） -->
      <div v-if="chargeInfo.tips" class="fsc-card fsc-detail">
        <span class="fsc-section-title">委托说明</span>
        <div class="fsc-html" v-html="chargeInfo.tips"></div>
      </div>
    </div>

    <!-- 底部操作条 -->
    <div class="fsc-bottom">
      <div class="fsc-bottom__total">
        <span class="fsc-bottom__label">合计</span>
        <span class="fsc-bottom__price">¥{{ totalPrice }}</span>
      </div>
      <div class="fsc-buy fsc-buy--inline" :class="{ 'fsc-buy--disabled': disable }" @click="createOrder">
        <span class="fsc-buy__text">预付</span>
      </div>
    </div>

    <!-- 原站 w-toast：出价高于市场最低价提示 -->
    <WToast
      :show="showPriceTips"
      content="您的出价高于或者等于目前市场最低价，你可以直接购买该藏品。"
      cancel-text="取消"
      submit-text="去购买"
      @change="showPriceTips = false"
      @action="tipAction"
    />
  </div>
</template>

<script setup>
/**
 * 发起委托页（对应原站 pages/market/submitEntrust）
 *   - 深色黑金主题（#101115 底 / #181713 卡 / #f4dcaa 金），与 submitBegBuy 同族
 *   - 逻辑 1:1 对齐原站 script 模块 14d3
 *   - 接口：
 *       getTradInfo(id)      → POST /market/trade/collectionDetail   {collection_id}
 *       getEntrustInfo(id)   → POST /market/Prepayment/collectionDetail {collection_id}
 *       entrust(form)        → POST /market/Prepayment/createOrder   {number, price, pay_way, collection_id}
 *     下单成功走 PayClass（order_type=31, pay_type:4）；本项目未接入支付渠道，与
 *     PayEntrustOrder 一致：toast 提示 + console 记录
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTradInfo, getEntrustInfo, entrust } from '@/api'
import { BASE_PAY_LIST } from '@/api/mock'
import { OSS_URL } from '@/config'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/toast'
import WToast from '@/components/consignments/WToast.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const showPriceTips = ref(false)
const id = ref(String(route.query.id || '38'))
const info = ref({ floor_price: {} })
const form = reactive({ number: 1, price: null })
const payList = ref(BASE_PAY_LIST.map((x) => ({ ...x, able: true, check: false })))
const chargeInfo = ref({})

/** 原站 data：low_price / rate / share_proportion_rate 由 getEntrustInfo 填充 */
const rate = ref(0)

/** 原站封面图已下载到本地（/uploads/... → /assets/img/market/...） */
const LOCAL_IMG = {
  '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg': '/assets/img/market/e876e9a9c96521e170f455a6ee59c675.jpg'
}

/** 图片地址：本地已下载优先，其余走原站 OSS */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/assets') || src.startsWith('/static')) return src
  return LOCAL_IMG[src] || OSS_URL + src
}

/** 原站本地藏品图（无图时占位） */
const coverSrc = computed(
  () => imgUrl(info.value.listimg) || '/assets/img/market/e876e9a9c96521e170f455a6ee59c675.jpg'
)

/** 数量 > 1 时显示合计提示（原站 priceTips） */
const priceTips = computed(() => {
  if (form.number > 1 && form.price) {
    return `(合计:￥${form.price}x${form.number}=￥${totalPrice.value})`
  }
  return ''
})

/** 输入框占位文案（原站 placeholderTips） */
const placeholderTips = computed(() => {
  if (Number((info.value.floor_price || {}).minprice)) {
    return `不得低于${Number(info.value.floor_price.minprice).toFixed(2)}元`
  }
  return '请输入委托价格'
})

/** 合计金额（原站 totalPrice） */
const totalPrice = computed(() => {
  if (form.price && form.number) return (form.price * form.number).toFixed(2)
  return '--'
})

/** 综合服务费（原站 servicePrice = totalPrice * rate） */
const servicePrice = computed(() => {
  if (totalPrice.value === '--') return 0
  return (totalPrice.value * rate.value).toFixed(2)
})

/** 服务费百分比展示（原站 (100*rate).toFixed(2)） */
const ratePercent = computed(() => (100 * rate.value).toFixed(2))

/** 底部按钮禁用态（原站 disable） */
const disable = computed(() => {
  const hasPay = payList.value.findIndex((a) => a.check) > -1
  return !(form.number && form.price && hasPay)
})

/** 支付方式图标（原站 /static/icon/{icon}.png） */
function payIcon(icon) {
  return `/assets/img/icon/${icon}.png`
}

/** 步进器加减 */
function step(n) {
  const next = Number(form.number || 1) + n
  form.number = next < 1 ? 1 : next
}

/** 数量输入 */
function onQtyInput(e) {
  const v = parseInt(e.target.value, 10)
  form.number = Number.isNaN(v) || v < 1 ? 1 : v
}

/** 价格输入：最多 2 位小数（原站 debounce 500ms） */
let priceTimer = null
function priceInput(e) {
  const val = e.target.value
  form.price = val === '' ? null : val
  clearTimeout(priceTimer)
  priceTimer = setTimeout(() => {
    if (val && val.includes('.')) {
      const parts = val.split('.')
      if (parts[1].length > 2) {
        form.price = `${parts[0]}.${String(parts[1]).substr(0, 2)}`
      }
    }
  }, 500)
}

/** 单选支付方式（再次点击同一项则取消） */
function targetCheck(p) {
  if (!p.able) return
  payList.value = payList.value.map((a) => ({
    ...a,
    check: a.auth_key === p.auth_key && !p.check
  }))
}

/** 「去开通」→ 钱包页 */
function toOpen() {
  router.push('/pages/wallet/wallet')
}

/** 出价提示弹窗「去购买」→ 专辑列表页 */
function tipAction(action) {
  if (!action) return
  showPriceTips.value = false
  router.push(`/pages/market/marketGoodsList?id=${id.value}&isagreement=1`)
}

/** 原站 getInfo(refresh)：拉取藏品详情 */
function getInfo(refresh = false) {
  getTradInfo(id.value)
    .then((res) => {
      info.value = res.data || { floor_price: {} }
      if (refresh) toast('刷新成功')
    })
    .catch(() => {})
}

/** 原站 getEntrustInfo(id)：拉取委托收费信息 */
function getChargeInfo() {
  getEntrustInfo(id.value)
    .then((res) => {
      const d = res.data || {}
      chargeInfo.value = d
      rate.value = Number(d.pay_platform_service_rate) || 0
    })
    .catch(() => {})
}

/** 原站 createOrder()：price<=0 → toast；否则 entrust(form) → 拉起支付 */
function createOrder() {
  if (Number(form.price) <= 0) {
    toast('请输入价格')
    return
  }
  if (disable.value) return
  const checked = payList.value.find((a) => a.check)
  if (!checked) return
  form.pay_way = checked.pay_way
  form.collection_id = id.value
  entrust({ ...form })
    .then((res) => {
      const d = res.data || {}
      toast('暂未接入支付渠道')
      console.log('[submitEntrust] doPay →', {
        order_id: d.order_id,
        order_number: d.order_sn,
        order_type: 31,
        pay_type: 4,
        pay_way: checked.pay_way
      })
    })
    .catch(() => {})
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/pages/market/marketGoodsList')
}

onMounted(() => {
  // 原站 onLoad：按用户信息判断支付方式是否开通
  const ui = userStore.userInfo || {}
  payList.value = BASE_PAY_LIST.map((a) => ({
    ...a,
    able: ui[a.auth_key] === undefined ? a.able : !!ui[a.auth_key],
    check: false
  }))
  getInfo()
  getChargeInfo()
})
</script>

<style scoped>
/*
 * 原站 scope 06c4c513，rpx 换算按 1rpx = 0.52px（750rpx → 390px）
 * 规则与 submitBegBuy（scope 0e57c3ac）逐字一致（其盒模型已用 Playwright 实测核对），
 * 仅追加 6 条：.fsc-row / .fsc-row__label / .fsc-row__value
 *              / .fsc-row__value--minus / .fsc-row__value--gold / .fsc-html
 */
.fsc-page {
  min-height: 100vh;
  background: #101115;
  padding: 12px 16px 114px;
  box-sizing: border-box;
}
/* 原站 uni-page-body padding: 24rpx 32rpx 220rpx */
.fsc-navbar {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fsc-navbar__back {
  position: absolute;
  left: 0;
  top: 10px;
  width: 24px;
  height: 24px;
}
.fsc-navbar__title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  line-height: 22px;
}

/* 卡片 */
.fsc-card {
  border: 1px solid #30291d;
  background-color: #181713;
  border-radius: 15px;
}
/* 藏品卡 */
.fsc-goods {
  display: flex;
  align-items: center;
  padding: 14px;
  margin-bottom: 12px;
}
.fsc-goods__img {
  width: 58px;
  height: 58px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
}
.fsc-goods__info {
  flex: 1;
  min-width: 0;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}
.fsc-goods__info > * + * {
  margin-top: 6px;
}
.fsc-goods__name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 21px;
}
.fsc-goods__meta {
  font-size: 12px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  line-height: 17px;
}
.fsc-goods__qty {
  flex-shrink: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
}
.fsc-step {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(244, 220, 170, 0.12);
  border: 1px solid #8d7855;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fsc-step__text {
  font-size: 15px;
  line-height: 1;
  color: #f4dcaa;
}
.fsc-step--off {
  opacity: 0.4;
}
.fsc-qty__input {
  width: 44px;
  height: 27px;
  margin: 0 2px;
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  color: #f4dcaa;
  font-size: 14px;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  line-height: 19.6px;
  appearance: none;
  -webkit-appearance: none;
}
.fsc-qty__input::-webkit-outer-spin-button,
.fsc-qty__input::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
}

/* 详情卡 */
.fsc-detail {
  padding: 16px 14px;
  margin-bottom: 12px;
}
.fsc-section-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, sans-serif;
  margin-bottom: 12px;
  line-height: 21px;
}
/* 价格输入 */
.fsc-field {
  display: flex;
  align-items: center;
  height: 49px;
  padding: 0 12px;
  border-radius: 8px;
  background: #332919;
  border: 1px solid transparent;
}
.fsc-field__unit {
  font-size: 14px;
  font-weight: 600;
  color: #f4dcaa;
  font-family: Alibaba-PuHuiTi-Medium, sans-serif;
  flex-shrink: 0;
  line-height: normal;
}
.fsc-field__input {
  flex: 1;
  min-width: 0;
  margin-left: 10px;
  font-size: 14px;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  background: transparent;
  border: none;
  outline: none;
  height: 20px;
  line-height: 19.6px;
  appearance: none;
  -webkit-appearance: none;
}
.fsc-field__input::placeholder {
  color: #8a8172;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  font-size: 14px;
}
.fsc-field__input::-webkit-outer-spin-button,
.fsc-field__input::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
}
.fsc-field__tip {
  display: block;
  margin-top: 8px;
  font-size: 11px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  line-height: 17px;
}

/* 支付方式 */
.fsc-pay {
  display: flex;
  align-items: center;
  padding: 14px 12px;
  border-radius: 8px;
  background: #332919;
  border: 1px solid transparent;
  margin-bottom: 8px;
}
.fsc-pay:last-child {
  margin-bottom: 0;
}
.fsc-pay--on {
  background: rgba(244, 220, 170, 0.08);
  border-color: #f4dcaa;
}
.fsc-pay--off {
  opacity: 0.75;
}
.fsc-pay__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-right: 10px;
}
.fsc-pay__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.fsc-pay__name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, sans-serif;
  margin-bottom: 4px;
  line-height: 20px;
}
.fsc-pay__desc {
  font-size: 11px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  line-height: 16px;
}
.fsc-radio {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid #8d7855;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fsc-radio--on {
  border-color: #f4dcaa;
}
.fsc-radio--on .fsc-radio__dot {
  background: #f4dcaa;
}
.fsc-radio__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: transparent;
}
.fsc-open {
  flex-shrink: 0;
  height: 24px;
  padding: 0 10px;
  border-radius: 17px;
  background: linear-gradient(90deg, #fae8bd, #cfaf72);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #2f2414;
  font-family: Alibaba-PuHuiTi-Medium, sans-serif;
}

/* 预计收入行（原站 scope 06c4c513 新增 6 条） */
/* .fsc-row{display:flex;align-items:center;justify-content:space-between;padding:16rpx 0} */
.fsc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8.32px 0;
}
/* .fsc-row__label{font-size:26rpx;color:#999} */
.fsc-row__label {
  font-size: 13.52px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
}
/* .fsc-row__value{font-size:28rpx;font-weight:600;color:#fff} */
.fsc-row__value {
  font-size: 14.56px;
  font-weight: 600;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Medium, sans-serif;
}
/* .fsc-row__value--minus{color:#e08d79} */
.fsc-row__value--minus {
  color: #e08d79;
}
/* .fsc-row__value--gold{color:#f4dcaa;font-size:32rpx}（原站 CSS 定义，本页 render 未使用，照录） */
.fsc-row__value--gold {
  color: #f4dcaa;
  font-size: 16.64px;
  font-family: Alibaba-PuHuiTi-Bold, sans-serif;
}
/* .fsc-html{display:block;background:#302a22;border-radius:20rpx;padding:20rpx;font-size:24rpx;color:#999;line-height:1.6} */
.fsc-html {
  display: block;
  background: #302a22;
  border-radius: 10.4px;
  padding: 10.4px;
  font-size: 12.48px;
  color: #999;
  line-height: 1.6;
}
/* u-parse 内 p 标签间距（原站 u-parse 默认处理） */
.fsc-html :deep(p) {
  margin: 0 0 6px;
}
.fsc-html :deep(p:last-child) {
  margin-bottom: 0;
}

/* 底部操作条 */
.fsc-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #101115;
  box-sizing: border-box;
  border-top: 1px solid #30291d;
}
.fsc-bottom__total {
  display: flex;
  align-items: baseline;
}
.fsc-bottom__label {
  font-size: 13px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, sans-serif;
  margin-right: 6px;
  line-height: normal;
}
.fsc-bottom__price {
  font-size: 20px;
  font-weight: 700;
  color: #f4dcaa;
  font-family: Alibaba-PuHuiTi-Bold, sans-serif;
  line-height: 27px;
}
.fsc-buy {
  height: 54px;
  border-radius: 14px;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fsc-buy--inline {
  width: 166px;
  height: 49px;
  border-radius: 12px;
}
.fsc-buy__text {
  font-size: 16px;
  font-weight: 500;
  color: #2f2414;
  font-family: Alibaba-PuHuiTi-Medium, sans-serif;
  line-height: normal;
}
/* 原站 disabled 态未做视觉降级（实测 disabled 时背景仍为金色渐变），仅阻止点击 */
.fsc-buy--disabled {
  cursor: not-allowed;
}

/* 轻提示 */
.fsc-toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 14px;
  padding: 12px 18px;
  border-radius: 8px;
  z-index: 2000;
  max-width: 70%;
  text-align: center;
  line-height: 1.5;
}
</style>
