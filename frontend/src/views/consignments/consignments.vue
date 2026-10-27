<template>
  <!--
    原站 pages/consignments/consignments
      script 模块 676e
        data: showPop / showPop2 / showPop3 / showPop4 / pwdPop / sellingPrice / low_price
              / rate / share_proportion_rate / id / pageType / loading / low_price_text
              / details{product:{}} / income_type[] / checked
        computed:
          isDisabled → !income_type.length || Number(sellingPrice) <= 0 || !checked
          totalPrice  → sellingPrice * id.split(',').length
          servicePrice→ (totalPrice * rate).toFixed(2)
          incomePrice → (totalPrice - servicePrice).toFixed(2)
        onLoad({id, pageType}) → pageType / id → getDetails() + getRate()
        openToast            → 未填价 → toast「请输入寄售价格」；未选账户 → toast「请选择收入账号」
        confirmConsignment(e) → 价格 > reprice_limit → toast「该藏品寄售价格不得高于 X 元」
                               否则 popConfim(e)
        iptSellingPrice(e)    → sellingPrice = Math.floor(e.detail.value)
        getDetails()          → getUserCollectionDetails(id.split(',')) → details = res.data
        getRate()             → getSellConfig(id[0]) → rate / low_price / low_price_text / share_proportion_rate
        popConfim(e)          → sellingPrice < 0.2 * low_price → showPop2=true；否则 pwdPop=true
        confim(pwd)           → sellProduct(...) → password_error==1 → showPop4=true
                               否则 → route('/pages/order/marketDetail', {id})
        wrongPassword(e)      → e 为 false → route('/pages/my/actionPwd/getCode', {action:'reset'})
      render 模块 67c0（scope 54339814）
  -->
  <div id="consignment-page" class="fsc-page">
    <!-- 顶部导航：标题 2==pageType ? "寄售藏品" : "寄售盲盒"，白色 -->
    <div class="fsc-navbar">
      <img class="nav-back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
      <span class="nav-title">{{ pageType == 2 ? '寄售藏品' : '寄售盲盒' }}</span>
    </div>

    <div class="fsc-wrap">
      <!-- 藏品卡片 -->
      <div class="fsc-card fsc-goods fsc-goods--lg">
        <img class="fsc-goods__cover" :src="coverSrc" alt="" />
        <div class="fsc-goods__info">
          <span class="fsc-goods__name">{{ details.product.name }}</span>
          <span class="fsc-goods__meta">编号：#{{ details.collection_code }}</span>
        </div>
      </div>

      <!-- 寄售价格 -->
      <div class="fsc-card fsc-detail">
        <div class="fsc-detail__head">
          <span class="fsc-section-title fsc-section-title--inline">寄售价格</span>
          <span v-if="details.from_price" class="fsc-detail__extra">（您的买入价：¥{{ details.from_price }}）</span>
        </div>
        <div class="fsc-field">
          <span class="fsc-field__unit">¥</span>
          <input
            class="fsc-field__input"
            type="number"
            placeholder="请输入寄售价格"
            placeholder-class="fsc-field__ph"
            :value="sellingPrice"
            @input="iptSellingPrice"
          />
        </div>
      </div>

      <!-- 收款账户 -->
      <div class="fsc-card fsc-account">
        <RadioAccount :user-info="userInfo" :default-pay-type="defaultPayType" @change-income="onChangeIncome" />
      </div>

      <!-- 预计收入 -->
      <div class="fsc-card fsc-detail">
        <span class="fsc-section-title">预计收入</span>
        <div class="fsc-row">
          <span class="fsc-row__label">总售价</span>
          <span class="fsc-row__value">
            <template v-if="count > 1 && sellingPrice">￥{{ sellingPrice }}x{{ count }}=</template>
            ¥{{ totalPrice }}
          </span>
        </div>
        <div class="fsc-row">
          <span class="fsc-row__label">交易手续费 ({{ Number((100 * rate).toFixed(2)) }}%)</span>
          <span class="fsc-row__value fsc-row__value--minus">- ¥{{ servicePrice }}</span>
        </div>
        <div class="fsc-row">
          <span class="fsc-row__label">预计收入</span>
          <span class="fsc-row__value fsc-row__value--gold">¥{{ incomePrice }}</span>
        </div>
      </div>

      <div class="fsc-tail-space" />
    </div>

    <!-- 底部固定条 -->
    <div class="fsc-bottom">
      <div class="fsc-bottom__total">
        <span class="fsc-bottom__label">预计收入</span>
        <span class="fsc-bottom__price">
          <span class="fsc-bottom__symbol">¥</span>
          <span>{{ incomePrice }}</span>
        </span>
      </div>
      <div
        class="z-btn btn-size-lg btn-type-colorful circle"
        @click="onBtnClick"
      >
        确定寄售
      </div>
    </div>

    <!-- 寄售确认（价格低于市场最低价 20%） -->
    <WModal
      :show="showPop2"
      title="寄售确认"
      submit-text="继续寄售"
      @change="showPop2 = false"
      @confirm="showPop2 = false; showPop3 = true"
    >
      <div class="fsc-modal">
        <div class="fsc-modal__row">
          <span class="fsc-modal__label">藏品:</span>
          <span class="fsc-modal__value">{{ details.product.name }}</span>
        </div>
        <div class="fsc-modal__row">
          <span class="fsc-modal__label">当前寄售价格:</span>
          <span class="fsc-modal__price">
            <span class="fsc-modal__price-num">{{ sellingPrice }}</span> 元
          </span>
        </div>
        <div class="fsc-modal__warn">当前寄售价格已低于本藏品市场最低价的20%,是否继续寄售？</div>
      </div>
    </WModal>

    <!-- 最终确认 -->
    <WToast
      :show="showPop3"
      title="最终确认"
      content="您的寄售价格低于目前市场最低价20%,确认寄售后造成的损失将由您个人承担,是否确认寄售?"
      @change="showPop3 = false"
      @action="onFinalConfirm"
    />

    <!-- 操作密码 -->
    <PasswordAuth
      :show="pwdPop"
      :price="sellingPrice"
      :pay-type="income_type"
      @change="pwdPop = false"
      @finish="confim"
    />

    <!-- 操作密码错误 -->
    <WToast
      :show="showPop4"
      title="操作密码错误，请重试"
      cancel-text="忘记密码"
      submit-text="重试"
      @change="showPop4 = false"
      @action="onRetryPwd"
    />
  </div>
</template>

<script setup>
/**
 * 寄售发起页（对应原站 pages/consignments/consignments）
 *   路由参数：id（user_collection_id，多件用逗号分隔）、pageType（2 藏品 / 其他 盲盒）
 */
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getConsignDetail, getSellConfig, sellProduct } from '@/api'
import { toast } from '@/utils/toast'
import RadioAccount from '@/components/consignments/RadioAccount.vue'
import PasswordAuth from '@/components/consignments/PasswordAuth.vue'
import WModal from '@/components/consignments/WModal.vue'
import WToast from '@/components/consignments/WToast.vue'

const route = useRoute()
const router = useRouter()

const OSS_URL = 'https://jufengwangluo.oss-cn-beijing.aliyuncs.com'

const showPop2 = ref(false)
const showPop3 = ref(false)
const showPop4 = ref(false)
const pwdPop = ref(false)
const sellingPrice = ref('')
const low_price = ref(0)
const rate = ref(0)
const share_proportion_rate = ref(0)
const id = ref('')
const pageType = ref('')
const details = ref({ product: {} })
const income_type = ref([])
const checked = ref(true)

const userInfo = ref({ yibao_status: 1 })
const defaultPayType = ref('yibao')

const ossUrl = OSS_URL

/**
 * 封面图拼接（对齐原站 w-image 的 targetSrc 规则）
 *   targetSrc = src.startsWith('http') || isLoc ? src : OssUrl + src
 * 本项目 mock 使用本地静态资源（以 / 开头），直接使用；相对路径才补 OSS 前缀。
 */
const coverSrc = computed(() => {
  const src = details.value.product?.listimg || ''
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/')) return src
  return ossUrl + src
})

/** 寄售件数（id 逗号分隔） */
const count = computed(() => String(id.value).split(',').filter(Boolean).length)

const isDisabled = computed(() => {
  return !income_type.value.length || Number(sellingPrice.value) <= 0 || !checked.value
})
const totalPrice = computed(() => sellingPrice.value * count.value)
const servicePrice = computed(() => (totalPrice.value * rate.value).toFixed(2))
const incomePrice = computed(() => (totalPrice.value - servicePrice.value).toFixed(2))

onMounted(() => {
  id.value = String(route.query.id || '')
  pageType.value = String(route.query.pageType || '')
  getDetails()
  getRate()
})

/** 原站 getDetails */
async function getDetails() {
  try {
    const res = await getConsignDetail(id.value.split(',').join(','))
    details.value = res.data || { product: {} }
  } catch (e) {
    /* 错误已由请求层提示 */
  }
}

/** 原站 getRate */
async function getRate() {
  try {
    const res = await getSellConfig(id.value.split(',')[0])
    const t = res.data || {}
    rate.value = t.pay_platform_service_rate || 0
    low_price.value = t.low_price || 0
    share_proportion_rate.value = t.share_proportion_rate || 0
  } catch (e) {
    /* 错误已由请求层提示 */
  }
}

/**
 * 原站 w-button 同时绑定两个处理函数：
 *   on:click      → confirmConsignment(e)（组件事件）
 *   nativeOn:click → openToast(e)（原生 DOM 事件）
 * 二者都会执行：先做价格上限校验并进入确认流程，
 * 同时对「未填价 / 未选账户」给出轻提示。
 */
function onBtnClick() {
  openToast()
  confirmConsignment()
}

/** 原站 openToast：按钮点击的第一道校验 */
function openToast() {
  if (sellingPrice.value) {
    if (!income_type.value.length) toast('请选择收入账号')
  } else {
    toast('请输入寄售价格')
  }
}

/** 原站 confirmConsignment：价格上限校验 */
function confirmConsignment() {
  if (Number(sellingPrice.value) > Number(details.value.product.reprice_limit)) {
    toast(`该藏品寄售价格不得高于${details.value.product.reprice_limit}元`)
    return
  }
  popConfim()
}

/** 原站 popConfim：低于市场最低价 20% 需二次确认 */
function popConfim() {
  const threshold = 0.2 * low_price.value
  if (Number(sellingPrice.value) < Number(threshold)) {
    showPop2.value = true
  } else {
    pwdPop.value = true
  }
}

/** 原站 iptSellingPrice：向下取整 */
function iptSellingPrice(e) {
  sellingPrice.value = Math.floor(e.target.value)
  e.target.value = sellingPrice.value
}

/** 原站 changeIncome */
function onChangeIncome(v) {
  income_type.value = v
}

/** w-modal「继续寄售」→ 打开最终确认 */
function onFinalConfirm() {
  showPop3.value = false
  pwdPop.value = true
}

/** w-toast「重试」→ 重新打开密码框 */
function onRetryPwd() {
  showPop4.value = false
  pwdPop.value = true
}

/** 原站 confim：提交寄售 */
async function confim(pwd) {
  try {
    const res = await sellProduct({
      user_collection_id: id.value,
      price: sellingPrice.value,
      pay_password: pwd,
      income_type: income_type.value.join(',')
    })
    pwdPop.value = false
    const d = res.data || {}
    if (d.password_error == 1) {
      showPop4.value = true
    } else if (d.id) {
      router.replace({ path: '/pages/order/marketDetail', query: { id: d.id } })
    } else {
      toast('转售成功')
      setTimeout(() => {
        router.replace('/pages/myCollection/myCollection')
      }, 1200)
    }
  } catch (e) {
    /* 错误已由请求层提示 */
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped>
/* 原站 scope 54339814（#consignment-page） */
#consignment-page.fsc-page {
  min-height: 100vh;
  background: #101115;
  box-sizing: border-box;
}

/* 顶部导航 */
.fsc-navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
}
.fsc-navbar .nav-back {
  position: absolute;
  left: 12.48px;
  top: 50%;
  transform: translateY(-50%);
  width: 24.96px;
  height: 24.96px;
}
.fsc-navbar .nav-title {
  font-size: 15.6px;
  font-weight: bold;
  color: #fff;
}

.fsc-wrap {
  padding: 12.48px 16.64px calc(env(safe-area-inset-bottom) + 114.4px);
}
.fsc-card {
  border: 0.52px solid #30291d;
  background-color: #181713;
  border-radius: 15.6px;
}
.fsc-goods {
  display: flex;
  align-items: center;
  padding: 14.56px;
  margin-bottom: 12.48px;
}
.fsc-goods--lg {
  padding: 15.6px;
}
.fsc-goods__cover {
  width: 104px;
  height: 104px;
  border-radius: 10.4px;
  flex-shrink: 0;
  background: #26221b;
}
.fsc-goods__info {
  flex: 1;
  min-width: 0;
  margin-left: 14.56px;
  display: flex;
  flex-direction: column;
}
.fsc-goods__info > * + * {
  margin-top: 8.32px;
}
.fsc-goods__name {
  font-size: 15.6px;
  font-weight: 600;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.fsc-goods__meta {
  font-size: 12.48px;
  color: #b79c68;
}
.fsc-detail {
  padding: 16.64px 14.56px;
  margin-bottom: 12.48px;
}
.fsc-detail__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fsc-detail__extra {
  font-size: 11.44px;
  color: #999;
}
.fsc-section-title {
  display: block;
  font-size: 15.6px;
  font-weight: 600;
  color: #fff;
}
.fsc-section-title--inline {
  display: inline-block;
  margin-bottom: 12.48px;
}
.fsc-field {
  display: flex;
  align-items: center;
  height: 49.92px;
  padding: 0 12.48px;
  border-radius: 8.32px;
  background: #332919;
  border: 1.04px solid transparent;
}
.fsc-field__unit {
  font-size: 14.56px;
  font-weight: 600;
  color: #f4dcaa;
  flex-shrink: 0;
}
.fsc-field__input {
  flex: 1;
  min-width: 0;
  margin-left: 10.4px;
  font-size: 14.56px;
  color: #fff;
  background: transparent;
  border: none;
  outline: none;
}
.fsc-field__input::placeholder {
  font-size: 14.56px;
  color: #8a8172;
}
/* 原站 uni-input type=number 无原生微调箭头 */
.fsc-field__input::-webkit-outer-spin-button,
.fsc-field__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.fsc-field__input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
.fsc-account {
  padding: 14.56px;
  margin-bottom: 12.48px;
}
.fsc-account :deep(.w-radio-account) {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin: 0;
}
.fsc-account :deep(.w-radio-account .font-color-black) {
  color: #ede6d6 !important;
}
.fsc-account :deep(.w-radio-account .font-color-describe) {
  color: #999 !important;
}
.fsc-account :deep(.w-radio-account .goOpen) {
  background: linear-gradient(90deg, #fae8bd, #cfaf72);
  color: #2f2414;
}
.fsc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8.32px 0;
}
.fsc-row__label {
  font-size: 13.52px;
  color: #999;
}
.fsc-row__value {
  font-size: 14.56px;
  font-weight: 600;
  color: #fff;
  display: inline-flex;
  align-items: baseline;
}
.fsc-row__value--minus {
  color: #e08d79;
}
.fsc-row__value--gold {
  color: #f4dcaa;
  font-size: 16.64px;
}
.fsc-tail-space {
  height: 1.04px;
}

/* 底部固定条 */
.fsc-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10.4px 16.64px;
  padding-bottom: calc(10.4px + env(safe-area-inset-bottom));
  background: #101115;
  box-sizing: border-box;
  border-top: 0.52px solid #30291d;
}
.fsc-bottom__total {
  display: flex;
  flex-direction: column;
}
.fsc-bottom__label {
  font-size: 12.48px;
  color: #999;
  margin-bottom: 5.2px;
}
.fsc-bottom__price {
  font-size: 20.8px;
  font-weight: 700;
  color: #f4dcaa;
  display: flex;
  align-items: baseline;
}
.fsc-bottom__symbol {
  font-size: 13.52px;
  margin-right: 2.08px;
}
/* 原站 `.fsc-bottom .z-btn { width:166.4px; height:49.92px; flex:none }`
   注意：需高于 `.btn-size-lg.circle`（同为 0-3-0 权重），故追加 .btn-size-lg 提高特异性 */
.fsc-bottom .z-btn.btn-size-lg {
  width: 166.4px;
  height: 49.92px;
  flex: none;
}
.z-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10.4px;
  font-weight: bold;
  cursor: pointer;
  box-sizing: border-box;
}
.btn-size-lg {
  height: 47.84px;
  font-size: 14.56px;
  border-radius: 8.32px;
}
.btn-size-lg.circle {
  height: 47.84px;
  border-radius: 23.92px;
}
.btn-type-colorful {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
.btn-type-colorful.pain {
  background: #f0f0f2;
  color: #000;
}
.btn-type-colorful.disabled {
  background-size: cover;
  background: #e3e3e3;
  color: #666;
}
.fsc-bottom .btn-type-colorful.disabled {
  background: #211c14;
  color: #f4dcaa;
}

/* 寄售确认弹窗内容 */
.fsc-modal {
  margin-top: 12.48px;
}
.fsc-modal__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 41.6px;
  padding: 0 12.48px;
  margin-bottom: 8.32px;
  background: #26221b;
  border-radius: 6.24px;
}
.fsc-modal__label {
  font-size: 11.44px;
  color: #999;
}
.fsc-modal__value {
  flex: 1;
  min-width: 0;
  margin-left: 12.48px;
  text-align: right;
  font-size: 13.52px;
  font-weight: 500;
  color: #ede6d6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fsc-modal__price {
  margin-left: 12.48px;
  font-size: 12.48px;
  color: #ede6d6;
}
.fsc-modal__price-num {
  font-size: 15.6px;
  font-weight: 700;
  color: #f4dcaa;
  margin-right: 2.08px;
}
.fsc-modal__warn {
  margin-top: 12.48px;
  padding: 8.32px 12.48px;
  border-radius: 6.24px;
  background: rgba(224, 141, 121, 0.12);
  font-size: 11.44px;
  line-height: 17.68px;
  color: #e08d79;
}
</style>
