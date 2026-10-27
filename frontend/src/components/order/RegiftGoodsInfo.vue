<template>
  <!--
    原站 GoodsInfo render `a2d01`（scope 4e0342a8）—— 浅色主题版
    每个区块都是独立白卡：.bg-color-item.br-20.pa-15 + inline padding-bottom:15rpx
    浅色配色（scope 4e0342a8）：
      title-text-style → 700/12px/#111216；desc-text-style → 400/10px/#85868d
      .gamx-title → bg rgba(53,120,252,.2) / radius 10rpx / padding 19rpx 18rpx / 500 / 24rpx / #000
      .gamx-value → padding 19rpx 18rpx / 500 / 26rpx / #000
      .gamx-code 18%；.gamx-cpbh/.gamx-jyje 36%
      商品编号 chips：title-text-style pa-3 br-4 + inline background-color:#FCF0FE
      订单信息标题：font-w-500 + inline {font-weight:bold;font-size:30rpx;color:#101010}
      E卡密码眼睛：u-icon color #666666
    操作密码弹窗：u-popup(round 12, bgColor #22201D, mode center) —— 浅色页仍是深色弹窗（与原站一致）
      .auth-popup width 654rpx / ptb-26 / br-12；.u-code-input gap 20rpx；
      .u-code-input__item bg #ececec / 84rpx × 84rpx / margin-right 0
  -->
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
    <div class="gi-block">
      <div v-if="order.order_type !== 8" class="flex flex-js-sb">
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
        <div v-for="(c, i) in order.collection_code" :key="i" class="title-text-style pa-3 br-4 gi-chip">#{{ c }}</div>
      </div>
    </div>

    <!-- 区块4：订单信息 -->
    <div class="gi-block mt-14 font-size-12">
      <span class="gi-block-title gi-block-title--order">订单信息</span>

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

    <!-- 原站 u-popup：操作密码（bgColor #22201D，浅色页同为深色弹窗） -->
    <div v-if="showPayPass" class="gi-popup-mask" @click.self="showPayPass = false">
      <div class="auth-popup">
        <img class="close" src="/assets/img/regift/close4.png" alt="关闭" @click="showPayPass = false" />
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
 * 订单明细（浅色版）—— 原站组件 `GoodsInfo`
 *   script `0996`
 *   render `a2d01`（scope 4e0342a8）
 *   接口 `getECardPass`（模块 5a48 → /crystal_goods/getCardCode）
 * 深色版见 `GoodsInfo.vue`（第 11 页专用）。
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
/* 原站 .bg-color-item.br-20.pa-15 + inline padding-bottom:15rpx */
.gi-block {
  padding: 15.6px; /* pa-15 = 30rpx */
  padding-bottom: 7.8px; /* inline 15rpx */
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px; /* br-20 = 40rpx */
  box-sizing: border-box;
}
.mt-14 { margin-top: 14.56px; }
.mb-14 { margin-bottom: 14.56px; }

/* 原站 .font-color-black.pb-8.font-w-bold → #23262f */
.gi-block-title {
  display: block;
  padding-bottom: 8.32px;
  font-size: 12.48px;
  font-weight: 700;
  color: #23262f;
  font-family: 'Alibaba-PuHuiTi-Bold', sans-serif;
}
/* 原站「订单信息」标题：font-w-500 + inline {font-weight:bold;font-size:30rpx;color:#101010} */
.gi-block-title--order {
  font-weight: 700;
  font-size: 15.6px; /* 30rpx */
  color: #101010;
}

/* 原站 scope 4e0342a8：.desc-text-style / .title-text-style */
.desc-text-style {
  font-size: 12.48px; /* 10px 原站即 24rpx */
  font-weight: 400;
  color: #85868d;
}
.title-text-style {
  font-size: 14.56px; /* 12px 原站即 28rpx */
  font-weight: 700;
  color: #111216;
  font-family: 'Alibaba-PuHuiTi-Bold', sans-serif;
}
.font-color-666 { color: #666; }

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
.font-color-black { color: #23262f; }

/* 原站 .goods-info .gamx-title */
.gamx-title {
  background-color: rgba(53, 120, 252, 0.2);
  border-radius: 5.2px; /* 10rpx */
  padding: 9.88px 9.36px; /* 19rpx 18rpx */
  font-weight: 500;
  font-size: 12.48px; /* 24rpx */
  color: #000;
  box-sizing: border-box;
}
/* 原站 .goods-info .gamx-value */
.gamx-value {
  padding: 9.88px 9.36px; /* 19rpx 18rpx */
  font-weight: 500;
  font-size: 13.52px; /* 26rpx */
  color: #000;
  box-sizing: border-box;
}
/* 原站基础样式：uni-view{display:flex;flex-direction:column;flex-shrink:0;flex-grow:0;flex-basis:auto}
   → 三列各占 18% / 36% / 36%，合计 90%，不压缩、不换行 */
.gamx-code { width: 18%; }
.gamx-cpbh, .gamx-jyje { width: 36%; }
.gamx-title > div, .gamx-value > div { flex-shrink: 0; }

/* 原站商品编号 chips：title-text-style pa-3 br-4 + inline background-color:#FCF0FE */
.pa-3 { padding: 3.12px; }
.br-4 { border-radius: 4.16px; }
.gi-chip { background-color: #fcf0fe; }

/* 原站 w-icon name="copy-dark" → 图片 /static/icon/copy-dark.png */
.w-icon {
  width: 16px;
  height: 16px;
  margin-left: 8.32px;
  cursor: pointer;
  flex: none;
}
.ml-4 { margin-left: 4.16px; }
.ml-8 { margin-left: 8.32px; }

/* 原站 u-icon color:#666666 */
.eye {
  font-size: 15px;
  color: #666;
  cursor: pointer;
  display: inline-block;
}

/* 原站 u-popup：bgColor #22201D / mode center / round 12 */
.gi-popup-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 原站 .auth-popup width 654rpx + ptb-26 + br-12 */
.auth-popup {
  position: relative;
  width: 340.08px; /* 654rpx */
  padding: 27.04px 0; /* ptb-26 */
  border-radius: 12.48px; /* br-12 */
  background: #22201d;
}
/* 原站 w-icon.close size 24（原站 name="close3" 的图片在原站 404，
   本项目按同规格关闭图标 close4.png 替代，已在侦查报告中记录） */
.auth-popup .close {
  position: absolute;
  right: 0;
  top: -41.6px; /* top:-80rpx */
  z-index: 2;
  width: 24.96px;
  height: 24.96px;
  cursor: pointer;
}
/* 原站 .auth-popup .u-code-input{gap:20rpx} */
.code-input {
  display: flex;
  gap: 10.4px; /* 20rpx */
}
/* 原站 .auth-popup .u-code-input__item{bg #ececec; 84rpx × 84rpx; margin-right 0} */
.code-input__item {
  background-color: #ececec;
  width: 43.68px; /* 84rpx */
  height: 43.68px;
  border: none;
  border-radius: 8.32px;
  text-align: center;
  font-size: 20px;
  color: #101010;
  outline: none;
  box-sizing: border-box;
}
</style>
