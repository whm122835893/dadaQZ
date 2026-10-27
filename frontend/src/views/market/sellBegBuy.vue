<template>
  <!--
    原站 pages/market/sellBegBuy（以求购价出售，浅色主题）
      script 模块 50ff（chunk pages-market-sellBegBuy.b53ead57.js）
        data { showTips, showPwd, showChoose, query{collection_id,pay_way,number},
               loading, info{selected[], user_collection_list[]} }
        computed:
          totalTips  → selected 按 price 分组 → "￥92x2+￥90x1="
          incomeType → selected 的 pay_way 集合（数组）
        onLoad(query) → query = 参数 → getInfo()
        getInfo()      → getSellBegInfo(query) → info = data → initInfo()
                        失败 → 1500ms 后 backPage()
        initInfo()     → 用 selected 反查 user_collection_list 的 check
        changeCheck(v, item)
                      → 选中数 > query.number → 取消勾选 + toast「请先取消一个」
                      → 选中时把 user_collection_id / collection_code 绑定到
                        selected 中第一条未绑定的记录
                      → 取消时解绑
        verifyChoose() → 勾选数 < query.number → toast「请选择N个」；否则关闭弹窗
        confim(pwd)    → sell_data = btoa(JSON.stringify([{buy_id, user_collection_id}]))
                        → sell({sell_data, pay_way, pay_password})
                        → password_error → toast(msg)；否则 toast(msg)
                        → 1500ms redirectTo /pages/order/list
      render（scope c2b3f2ee）
        w-container.page-bg.plr-16#sell
          w-navbar「以求购价出售」
          .select → info.selected 中有 user_collection_id 的项渲染白卡
          .order-info.pa-12.br-12.bg-color-item → 预计收入 / 总售价 / 综合服务费(%) / 预计收入
          .pa-12.br-12.bg-color-item.mt-16 → 以求购价出售说明 3 条
          .action → w-button(colorful-sp, circle)「确认出售」+ u-safe-bottom
          u-popup(bottom) → .batch-sell-popup 选藏品弹窗
          w-toast「您确认以X元出售吗？」
          password-authentification
  -->
  <div id="sell" class="page-bg plr-16">
    <!-- 原站 w-navbar：浅色主题 bg #fafafa，标题 #333 -->
    <div class="sell-navbar">
      <img class="sell-navbar__back" src="/assets/img/order/back-btn.png" alt="" @click="goBack" />
      <span class="sell-navbar__title">以求购价出售</span>
    </div>

    <!-- 已选中的求购单（绑定藏品后展示） -->
    <div class="select">
      <div
        v-for="a in selectedWithBinding"
        :key="a.id"
        class="bg-color-item pa-12 br-12 flex mb-16"
      >
        <img class="select__img" :src="imgUrl(a.listimg)" alt="" />
        <div class="select__body flex-1 pl-12 flex flex-dir-col flex-js-sb">
          <div class="flex flex-ai-center">
            <span class="select__name text-overflow">{{ a.name }}</span>
            <span class="select__tag">{{ a.pay_way === 'huifu' ? '汇' : '易' }}</span>
          </div>
          <div class="flex flex-ai-center">
            <span class="select__code">
              #<span class="select__code-num">{{ a.collection_code }}</span> /{{ a.total_num }}
            </span>
          </div>
          <div class="flex flex-js-sb flex-ai-end">
            <span class="select__count">拥有数量:{{ a.count }}</span>
            <span class="select__price">
              出售价:
              <span class="select__price-num">
                <span class="select__price-cur">￥</span>{{ a.price }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预计收入 -->
    <div class="order-info pa-12 br-12 bg-color-item">
      <div class="font-color-textPrimary">预计收入</div>
      <div class="item">
        <div class="label"> 总售价： </div>
        <div class="value">
          <span class="font-size-12 font-color-999">{{ totalTips }}</span> ￥{{ info.total_price }}
        </div>
      </div>
      <div class="item">
        <div class="label"> 综合服务费(%)： </div>
        <div class="value">{{ info.platform_service_price }}</div>
      </div>
      <div class="item">
        <div class="label"> 预计收入 </div>
        <div class="value">￥{{ info.estimated_income }}</div>
      </div>
    </div>

    <!-- 以求购价出售说明 -->
    <div class="pa-12 br-12 bg-color-item mt-16">
      <div class="font-w-500 font-size-14 font-color-textPrimary">以求购价出售说明</div>
      <div class="font-color-999 font-size-12 mt-8">
        <div>1.成交顺序是以买方发起求购订单的金额由高至低的顺序成交 。</div>
        <div>2.买方求购订单的付款钱包和卖方收款账户钱包需要一致才可成交，如果不一致会导致无法成交。</div>
        <div>3.订单一旦成交，不可撤销。</div>
      </div>
    </div>

    <!-- 底部确认条 -->
    <div class="action">
      <div class="plr-10 z-btn btn-size-lg btn-type-colorful-sp cir" @click="openTips">确认出售</div>
    </div>

    <!-- 选择藏品弹窗（原站 batch-sell-popup） -->
    <div v-if="showChoose" class="batch-mask" @click.self="showChoose = false">
      <div class="batch-sell-popup">
        <div class="flex flex-js-sb flex-ai-center">
          <div class="font-color-textPrimary">请选择{{ info.selected.length }}个藏品</div>
          <img class="batch-close" src="/assets/img/icon/close2.png" alt="" @click="verifyChoose" />
        </div>
        <div class="mt-10 batch-list">
          <div
            v-for="a in info.user_collection_list"
            :key="a.id"
            class="item flex"
            :class="{ active: a.check }"
            @click="toggleCheck(a)"
          >
            <span class="font-size-14 font-color-textPrimary text-overflow item-name">{{ a.name }}</span>
            <span class="font-size-12 font-color-999 flex-1">
              #<span class="font-color-textPrimary font-size-14">{{ a.collection_code }}</span>/ {{ a.total_num }}
            </span>
            <span class="checkbox" :class="{ 'checkbox--on': a.check }"></span>
          </div>
        </div>
        <div>
          <div class="plr-10 z-btn btn-size-lg btn-type-colorful-sp cir batch-confirm" @click="verifyChoose">
            确认出售
          </div>
        </div>
      </div>
    </div>

    <!-- 二次确认弹窗（原站 w-toast） -->
    <WToast
      :show="showTips"
      :content="`您确认以${info.total_price}元出售吗？`"
      cancel-text="取消"
      submit-text="确定"
      @change="showTips = false"
      @action="onConfirm"
    />

    <!-- 操作密码弹窗（原站 password-authentification） -->
    <PasswordAuth
      :show="showPwd"
      :price="info.total_price"
      :pay-type="incomeType"
      @change="showPwd = $event"
      @finish="confim"
    />
  </div>
</template>

<script setup>
/**
 * 以求购价出售页（对应原站 pages/market/sellBegBuy）
 *   - 浅色主题（#f7f7f8 底 / 白卡）
 *   - 逻辑 1:1 对齐原站 script 模块 50ff
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSellBegInfo, sell } from '@/api'
import { OSS_URL } from '@/config'
import WToast from '@/components/consignments/WToast.vue'
import PasswordAuth from '@/components/consignments/PasswordAuth.vue'

const route = useRoute()
const router = useRouter()

const showTips = ref(false)
const showPwd = ref(false)
const showChoose = ref(false)
const query = reactive({
  collection_id: String(route.query.collection_id || ''),
  pay_way: String(route.query.pay_way || 'yibao'),
  number: String(route.query.number || '1')
})
const info = ref({ selected: [], user_collection_list: [] })

/** 仅有 user_collection_id 的求购单才在页面上渲染（对齐原站 v-if） */
const selectedWithBinding = computed(() => info.value.selected.filter((a) => a.user_collection_id))

/** 合计提示：按价格分组 */
const totalTips = computed(() => {
  const counter = info.value.selected.reduce((acc, a) => {
    if (acc[a.price]) acc[a.price]++
    else acc[a.price] = 1
    return acc
  }, {})
  const list = []
  for (const price in counter) list.push(`￥${price}x${counter[price]}`)
  return list.length ? list.join('+') + '=' : null
})

/** 收款钱包类型集合 */
const incomeType = computed(() => {
  const set = info.value.selected.reduce((acc, a) => {
    acc.add(a.pay_way)
    return acc
  }, new Set())
  return Array.from(set)
})

/** 原站封面图已下载到本地 */
const LOCAL_IMG = {
  '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg': '/assets/img/market/e876e9a9c96521e170f455a6ee59c675.jpg'
}

/** 图片地址：本地已下载优先，其余走原站 OSS */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/assets') || src.startsWith('/static')) return src
  return LOCAL_IMG[src] || OSS_URL + src
}

/** 拉取出售信息 */
function getInfo() {
  getSellBegInfo({ ...query })
    .then((res) => {
      info.value = res.data || { selected: [], user_collection_list: [] }
      initInfo()
    })
    .catch(() => {
      setTimeout(() => goBack(), 1500)
    })
}

/** 用 selected 反查勾选状态 */
function initInfo() {
  info.value.user_collection_list = info.value.user_collection_list.map((a) => {
    const matched = info.value.selected.find((s) => s.user_collection_id === a.id)
    return { ...a, check: !!matched }
  })
}

/** 勾选/取消藏品 */
function toggleCheck(a) {
  const checkedCount = info.value.user_collection_list.filter((x) => x.check).length
  if (!a.check) {
    if (Number(query.number) < checkedCount + 1) {
      a.check = false
      showToast('请先取消一个')
      return
    }
    const slot = info.value.selected.find((s) => !s.user_collection_id)
    if (slot) {
      slot.user_collection_id = a.id
      slot.collection_code = a.collection_code
    }
    a.check = true
  } else {
    const idx = info.value.selected.findIndex((s) => s.user_collection_id === a.id)
    if (idx > -1) {
      info.value.selected[idx].user_collection_id = null
      info.value.selected[idx].collection_code = null
    }
    a.check = false
  }
}

/** 弹窗「确认出售」→ 校验勾选数量 */
function verifyChoose() {
  const count = info.value.user_collection_list.filter((a) => a.check).length
  if (count < Number(query.number)) {
    showToast(`请选择${query.number}个`)
    return
  }
  showChoose.value = false
}

/** 主按钮：先确认数量，再拉起二次确认弹窗 */
function openTips() {
  const count = info.value.user_collection_list.filter((a) => a.check).length
  if (count < Number(query.number)) {
    showChoose.value = true
    return
  }
  showTips.value = true
}

/** 二次确认 → 输入操作密码 */
function onConfirm(action) {
  if (!action) return
  showTips.value = false
  showPwd.value = true
}

/** 提交出售 */
function confim(pwd) {
  const data = info.value.selected.map((a) => ({
    buy_id: a.id,
    user_collection_id: a.user_collection_id
  }))
  const sellData = btoa(JSON.stringify(data))
  sell({ sell_data: sellData, pay_way: query.pay_way, pay_password: pwd })
    .then((res) => {
      if (res.data && res.data.password_error) {
        showToast(res.msg)
        return
      }
      showToast(res.msg)
      setTimeout(() => router.replace('/pages/order/list'), 1500)
    })
    .catch(() => {})
}

/** 轻提示 */
function showToast(title) {
  const el = document.createElement('div')
  el.className = 'sell-toast'
  el.textContent = title
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1800)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/pages/market/marketGoodsList')
}

onMounted(() => {
  getInfo()
})
</script>

<style scoped>
/*
 * 原站 scope c2b3f2ee + 全局原子类（浅色主题）
 * rpx 换算按 1rpx = 0.52px（750rpx → 390px）
 */
.page-bg {
  background: #f7f7f8;
  min-height: 100vh;
}
#sell {
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
}
.plr-16 {
  padding-left: 16px;
  padding-right: 16px;
}

/* navbar */
.sell-navbar {
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sell-navbar__back {
  position: absolute;
  left: 0;
  top: 10px;
  width: 24px;
  height: 24px;
}
.sell-navbar__title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  line-height: 22px;
}

/* 原子类 */
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
.flex-ai-end {
  align-items: flex-end;
}
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.font-color-textPrimary {
  color: #333;
}
.font-color-999 {
  color: #999;
}
.font-size-12 {
  font-size: 12.48px;
  line-height: 18px;
}
.font-size-14 {
  font-size: 14px;
  line-height: 21px;
}
.font-w-500 {
  font-weight: 500;
}
.pa-12 {
  padding: 12px;
}
.bg-color-item {
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px;
}
/* 原站 .br-12(24rpx) 在 .bg-color-item(40rpx) 之后定义，覆盖其圆角 */
.br-12 {
  border-radius: 12.48px;
}
.mb-16 {
  margin-bottom: 16px;
}
.mt-8 {
  margin-top: 8px;
}
.mt-10 {
  margin-top: 10px;
}
.mt-16 {
  margin-top: 16px;
}
.pl-12 {
  padding-left: 12px;
}
.plr-10 {
  padding-left: 10px;
  padding-right: 10px;
}

/* 已选藏品卡 */
.select__img {
  width: 83px;
  height: 83px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
}
.select__body {
  min-width: 0;
}
.select__name {
  max-width: 198px;
  font-size: 14px;
  color: #333;
  line-height: 21px;
}
.select__tag {
  margin-left: 4px;
  padding: 3px;
  background: #101115;
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
  line-height: 12px;
}
.select__code {
  font-size: 12px;
  color: #999;
  line-height: 18px;
}
.select__code-num {
  font-size: 14px;
  color: #333;
}
.select__count {
  font-size: 10px;
  color: #999;
  line-height: 15px;
}
.select__price {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: flex-end;
  line-height: 18px;
}
.select__price-num {
  color: #333;
  display: flex;
  align-items: flex-end;
}
.select__price-cur {
  font-size: 12px;
}
.select__price-num :deep(.select__price-cur) {
  font-size: 12px;
}

/* 预计收入 */
.order-info {
  background: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 12px;
  padding: 12px;
}
.order-info > .font-color-textPrimary {
  font-size: 15px;
  line-height: 22px;
}
.order-info .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-size: 14px;
  color: #4a4a4a;
}
.order-info .item .label {
  font-size: 14px;
  color: #999;
  line-height: 21px;
}
.order-info .item .value {
  font-size: 14px;
  color: #333;
  line-height: 21px;
}

/* 底部按钮 */
.action {
  box-sizing: border-box;
  width: 100%;
  left: 0;
  bottom: 0;
  position: fixed;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e7e7ea;
  padding: 7px 16px;
  display: flex;
}
.z-btn {
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-type-colorful-sp {
  background: #211c14;
  color: #f4dcaa;
}
.cir {
  border-radius: 23px;
}
.btn-size-lg {
  height: 47px;
  flex: 1;
}

/* 批量选择弹窗 */
.batch-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
}
.batch-sell-popup {
  width: 100%;
  background: linear-gradient(147deg, #f2f6ff, #fff 37%);
  box-sizing: border-box;
  border-radius: 12px 12px 0 0;
  padding: 12px;
}
.batch-close {
  width: 24px;
  height: 24px;
}
.batch-list {
  height: 380px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.batch-list .item {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 12px;
  margin-bottom: 10px;
  align-items: center;
  background: #fff;
}
.batch-list .item.active {
  border-color: #101115;
  background: #f7f7f8;
}
.batch-list .item-name {
  width: 120px;
}
.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #c8c8cc;
  flex-shrink: 0;
  margin-left: 8px;
  position: relative;
  box-sizing: border-box;
}
.checkbox--on {
  background: #101115;
  border-color: #101115;
}
.checkbox--on::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 3px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.batch-confirm {
  margin-top: 8px;
}

/* 轻提示 */
:deep(.sell-toast),
.sell-toast {
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
