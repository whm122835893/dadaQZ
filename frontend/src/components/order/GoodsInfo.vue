<template>
  <!-- 原站 GoodsInfo render `a2d01`（scope 4e0342a8） -->
  <div class="goods-info">
    <!-- 区块1：购买明细（order_type != 8 且 collection_list.length > 0） -->
    <div v-if="order.order_type !== 8 && order.collection_list && order.collection_list.length > 0" class="gi-block mb-14">
      <span class="gi-block-title">购买明细</span>
      <div class="flex flex-ai-center gamx-title">
        <div class="gamx-code">#</div>
        <div class="gamx-cpbh">藏品编号</div>
        <div class="gamx-jyje">交易金额</div>
      </div>
      <div v-for="(item, i) in order.collection_list" :key="i" class="flex flex-ai-center gamx-value">
        <div class="gamx-code">{{ item.collection_code }}</div>
        <div class="gamx-cpbh">{{ item.collection_sn || '--' }}</div>
        <div class="gamx-jyje">￥{{ item.from_price || 0 }}</div>
      </div>
    </div>

    <!-- 区块2：购买数量 / 应付金额（order_type != 8） -->
    <div v-if="order.order_type !== 8" class="gi-block">
      <div class="flex flex-js-sb">
        <div class="pb-8 desc-text-style">购买数量</div>
        <div class="gap-12 mb-8 title-text-style">{{ order.num || 1 }}</div>
      </div>
      <div class="flex flex-js-sb">
        <div class="desc-text-style pb-8">{{ order.order_type !== 8 ? '应付金额' : '寄售金额' }}</div>
        <div class="gap-12 mb-8 title-text-style">￥{{ order.price || order.total_price }}</div>
      </div>
    </div>

    <!-- 区块3：商品编号 chips（goods_type != 1 且 collection_code.length > 1） -->
    <div v-if="showCodeChips" class="gi-block mt-14">
      <div class="desc-text-style pb-8">商品编号</div>
      <div class="flex flex-w gap-12 mb-8">
        <div v-for="(c, i) in order.collection_code" :key="i" class="title-text-style pa-3 br-4">#{{ c }}</div>
      </div>
    </div>

    <!-- 区块4：订单信息 -->
    <div class="gi-block mt-14 font-size-12">
      <span class="gi-block-title gi-block-title--dark">订单信息</span>

      <div class="flex flex-js-sb ptb-8 flex-ai-center font-color-666">
        <span class="desc-text-style">订单ID号:</span>
        <div class="title-text-style flex flex-ai-center">
          <span>{{ order.order_sn }}</span>
          <img class="w-icon" src="/assets/img/order/copy-dark.png" alt="复制" @click="copy(order.order_sn)" />
        </div>
      </div>

      <div class="flex flex-js-sb ptb-8 flex-ai-center font-color-666">
        <span class="desc-text-style">收款方式：</span>
        <div class="title-text-style flex flex-ai-center">
          <span>{{ order.income_type ? incomeType(order.income_type) : '' }}</span>
        </div>
      </div>

      <div v-if="order.buy_order_sn" class="flex flex-js-sb ptb-8 flex-ai-center font-color-666">
        <span class="desc-text-style">分账ID号:</span>
        <div class="title-text-style flex flex-ai-center">
          <span>{{ order.buy_order_sn }}</span>
          <img class="w-icon" src="/assets/img/order/copy-dark.png" alt="复制" @click="copy(order.buy_order_sn)" />
        </div>
      </div>

      <template v-if="order.card && order.card.length">
        <div v-for="(card, i) in order.card" :key="i">
          <div class="flex flex-js-sb ptb-8">
            <span>E卡卡号{{ order.card.length === 1 ? '' : i + 1 }}：</span>
            <div class="title-text-style flex flex-ai-center">
              <span>{{ card.card_sn }}</span>
              <img class="w-icon ml-4" src="/assets/img/order/copy-dark.png" alt="复制" @click="copy(card.card_sn)" />
            </div>
          </div>
          <div class="flex flex-js-sb ptb-8">
            <span>E卡密码{{ order.card.length === 1 ? '' : i + 1 }}：</span>
            <div class="title-text-style flex flex-ai-center">
              <span>{{ card.show_pwd ? card.card_pwd : card.card_keys }}</span>
              <span class="uview-icon ml-4 eye" @click="showECardPass(card)">
                {{ card.show_pwd ? '&#xe641;' : '&#xe648;' }}
              </span>
              <img
                v-if="card.card_pwd"
                class="w-icon ml-8"
                src="/assets/img/order/copy-dark.png"
                alt="复制"
                @click="copy(card.card_pwd)"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 原站 u-popup：操作密码 -->
    <div v-if="showPayPass" class="gi-popup-mask" @click.self="showPayPass = false">
      <div class="auth-popup">
        <span class="close uview-icon" @click="showPayPass = false">&#xe685;</span>
        <div class="pt-10 text-center font-color-black font-size-12 font-w-500">请输入操作密码</div>
        <div class="font-color-black font-size-12 text-center" @click="toForget">忘记密码？</div>
        <div class="flex flex-center mt-30">
          <div class="code-input">
            <input
              v-for="n in 6"
              :key="n"
              class="code-input__item"
              type="password"
              maxlength="1"
              :value="pwdArr[n - 1]"
              @input="onPwdInput(n - 1, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 订单明细 —— 原站组件 `GoodsInfo`
 *   script `0996`
 *   render `a2d01`（scope 4e0342a8）
 *   接口 `getECardPass`（模块 5a48 → /crystal_goods/getCardCode）
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getECardPass } from '@/api'
import { copyText as copy } from '@/utils/clipboard'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})

const router = useRouter()

const showPayPass = ref(false)
const ecard = ref({})
const pwd = ref('')
const pwdArr = ref(['', '', '', '', '', ''])

/** 原站 script data.payAarr */
const payAarr = {
  yibao: { image: '/static/icon/yibao-image.webp', name: '易宝支付', type: 'yibao' },
  huifu: { image: '/static/icon/huifu-image.webp', name: '汇付钱包', type: 'huifu' }
}
function incomeType(type) {
  return payAarr[type] ? payAarr[type].name : ''
}

const showCodeChips = computed(() => {
  const o = props.order
  return (
    o.goods_type !== 1 &&
    o.goods_type !== undefined &&
    o.collection_code &&
    o.collection_code.length > 1
  )
})

/** 原站 showECardPass：有 card_pwd 直接切换显隐，否则弹操作密码 */
function showECardPass(card) {
  if (card.card_pwd) {
    card.show_pwd = !card.show_pwd
  } else {
    showPayPass.value = true
    ecard.value = card
  }
}

function toForget() {
  showPayPass.value = false
  router.push('/pages/my/actionPwd/getCode?action=reset')
}

function onPwdInput(idx, e) {
  pwdArr.value[idx] = e.target.value.replace(/\D/g, '').slice(0, 1)
  pwd.value = pwdArr.value.join('')
  if (pwd.value.length === 6) passRes(pwd.value)
}

/** 原站 passRes → getECardPass({pay_password, sn, order_id}) */
async function passRes(val) {
  try {
    const res = await getECardPass({
      pay_password: val,
      sn: ecard.value.card_sn,
      order_id: props.order.id
    })
    const idx = (props.order.card || []).findIndex((c) => c.card_sn === ecard.value.card_sn)
    if (idx > -1) {
      props.order.card[idx].card_pwd = res.data
      props.order.card[idx].show_pwd = true
    }
    showPayPass.value = false
    pwd.value = ''
    pwdArr.value = ['', '', '', '', '', '']
  } catch (e) {
    /* 错误已由请求层提示 */
  }
}
</script>

<style scoped>
.gi-block {
  padding: 15.6px;
  padding-bottom: 7.8px;
  background: transparent;
  border: none;
  border-radius: 0;
}
.mt-14 {
  margin-top: 14.56px;
}
.mb-14 {
  margin-bottom: 14.56px;
}
.gi-block-title {
  display: block;
  padding-bottom: 4.16px;
  font-size: 15.6px;
  font-weight: 600;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.gi-block-title--dark {
  font-weight: bold;
  font-size: 15.6px;
  color: #fff;
}
.desc-text-style {
  font-size: 12.48px;
  color: #999;
}
.title-text-style {
  font-size: 14.56px;
  font-weight: 600;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
}
.font-color-666 { color: #999; }

.flex { display: flex; }
.flex-ai-center { align-items: center; }
.flex-js-sb { justify-content: space-between; }
.flex-js-center { justify-content: center; }
.flex-center { justify-content: center; align-items: center; }
.flex-w { flex-wrap: wrap; }
/* 原站原子类 rpx 换算：N × 1.04px（N = rpx/2） */
.gap-12 { gap: 12.48px; }
.mb-8 { margin-bottom: 8.32px; }
.mb-12 { margin-bottom: 12.48px; }
.pb-8 { padding-bottom: 8.32px; }
.ptb-8 { padding-top: 8.32px; padding-bottom: 8.32px; }
.pt-10 { padding-top: 10.4px; }
.mt-30 { margin-top: 31.2px; }
.text-center { text-align: center; }
.font-size-12 { font-size: 12.48px; }
.font-w-500 { font-weight: 500; }
.font-color-black { color: #fff; }

/* 原站 .goods-info .gamx-title */
.gamx-title {
  background-color: rgba(64, 128, 255, 0.08);
  border-radius: 5.2px;
  padding: 9.88px 9.36px;
  font-weight: 500;
  font-size: 12.48px;
  color: #fff;
}
/* 原站 .goods-info .gamx-value */
.gamx-value {
  padding: 9.88px 9.36px;
  font-weight: 500;
  font-size: 13.52px;
  color: #fff;
}
/* 原站基础样式：uni-view{display:flex;flex-direction:column;flex-shrink:0;flex-grow:0;flex-basis:auto}
   → 三列各占 18% / 36% / 36%，合计 90%，不压缩、不换行 */
.gamx-code { width: 18%; }
.gamx-cpbh, .gamx-jyje { width: 36%; }
.gamx-title > div, .gamx-value > div { flex-shrink: 0; }

/* 原站 .pa-3.br-4 → 页面级 background-color:#332919 */
.pa-3 {
  padding: 3.12px;
  background-color: #332919 !important;
}
.br-4 { border-radius: 4.16px; }

/* 原站 .w-icon uni-image { filter:brightness(0) invert(1) } */
.w-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
  cursor: pointer;
}
.ml-4 { margin-left: 4.16px; }
.ml-8 { margin-left: 8.32px; }

/* 原站 u-icon color:#999!important */
.eye {
  font-size: 15px;
  color: #999;
  cursor: pointer;
  display: inline-block;
}

/* 原站 u-popup：bgColor #22201D / mode center */
.gi-popup-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-popup {
  position: relative;
  width: 340.08px;
  padding: 27.04px 0;
  border-radius: 6.24px;
  background: #22201d;
}
.auth-popup .close {
  position: absolute;
  right: 0;
  top: -41.6px;
  z-index: 2;
  font-size: 24px;
  color: #fff;
}
.code-input {
  display: flex;
  gap: 10.4px;
}
.code-input__item {
  background-color: #ececec;
  width: 43.68px !important;
  height: 43.68px !important;
  border: none;
  border-radius: 8.32px;
  text-align: center;
  font-size: 20px;
  color: #101010;
  outline: none;
}
</style>