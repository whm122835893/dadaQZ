<template>
  <!--
    原站 GoodsInfo render `4312`（scope 7c6b1df8）—— beg/info / entrust/info 共用版
    结构（与原站逐字一致，按 order_type=11 实际渲染分支标注）：
      .goods-info
        ① [goods_type!=1 && collection_code.length>1] 商品编号 chips
           标题 .font-color-black.pb-8.font-w-500「商品编号」
           行 .flex.flex-w.gap-12.mb-16 → chip .font-size-12.pa-3.br-4[bg #e5e5e5] = #code
        ② 白卡 .bg-color-item.br-8.pa-14.mt-14.font-size-12
            「订单详情」.font-color-black.font-w-bold.pb-8
            行 .flex.flex-js-sb.ptb-8.flex-ai-center：
              订单金额: → .font-size-16.font-color-black ￥total_price（order_type 8 用 price）
              订单ID号: → .font-size-14 order_sn + w-icon(copy-dark, 18)
              [buy_order_sn] 分账ID号:
              [!card.length] [1,2].includes(order_type)?支付方式:到账账户 → payName(pay_way)
        ③ 白卡 .bg-color-item.br-8.pt-14.plr-14.mt-14.font-size-12
            [card.length] E 卡列表（求购订单无）
            [status!=3 && step>-1] 「订单状态」.font-color-black.pb-8.font-w-bold
            [status!=3 && step>-1 && order_type!=11] u-steps([1,7,2]) —— beg 不渲染
            u-steps(process) 无条件渲染：current=step dot column activeColor #f52500
              desc slot: .pb-20.font-size-14 [active? font-color-theme : font-color-999]
                         title +（formatDate(updatetime)）（仅 active 项）
              icon slot: .slot-icon[.active]
        ④ [[1,2].includes(order_type) && status==1] 说明文字 —— beg 不渲染
        ⑤ u-popup(round 12, mode center) 操作密码（无 E 卡时不触发）
  -->
  <div class="goods-info">
    <!-- ① 商品编号 chips -->
    <template v-if="showCodeChips">
      <div class="font-color-black pb-8 font-w-500">商品编号</div>
      <div class="flex flex-w gap-12 mb-16">
        <div v-for="(c, i) in order.collection_code" :key="i" class="font-size-12 pa-3 br-4 code-chip">#{{ c }}</div>
      </div>
    </template>

    <!-- ② 订单详情白卡 -->
    <div class="bg-color-item br-8 pa-14 mt-14 font-size-12">
      <div class="font-color-black font-w-bold pb-8">订单详情</div>

      <div class="flex flex-js-sb ptb-8 flex-ai-center">
        <span class="font-color-999">订单金额:</span>
        <div class="font-size-16 font-color-black">
          <span>￥</span><span>{{ ['8', 8].includes(order.order_type) ? order.price : order.total_price }}</span>
        </div>
      </div>

      <div class="flex flex-js-sb ptb-8 flex-ai-center">
        <span class="font-color-999">订单ID号:</span>
        <div class="font-size-16 font-color-black flex flex-ai-center">
          <span class="font-size-14">{{ order.order_sn }}</span>
          <img class="w-icon" src="/assets/img/order/copy-dark.png" alt="复制" style="width:18px;height:18px" @click="copy(order.order_sn)" />
        </div>
      </div>

      <div v-if="order.buy_order_sn" class="flex flex-js-sb ptb-8 flex-ai-center">
        <span class="font-color-999">分账ID号:</span>
        <div class="font-size-16 font-color-black flex flex-ai-center">
          <span class="font-size-14">{{ order.buy_order_sn }}</span>
          <img class="w-icon" src="/assets/img/order/copy-dark.png" alt="复制" @click="copy(order.buy_order_sn)" />
        </div>
      </div>

      <div v-if="!(order.card && order.card.length)" class="flex flex-js-sb ptb-8 flex-ai-center">
        <span class="font-color-999">{{ [1, 2, '1', '2'].includes(order.order_type) ? '支付方式' : '到账账户' }}:</span>
        <div class="font-size-16 font-color-black flex flex-ai-center">
          <span class="font-size-14">{{ payName(order.pay_way) }}</span>
        </div>
      </div>
    </div>

    <!-- ③ 订单状态白卡 -->
    <div class="bg-color-item br-8 pt-14 plr-14 mt-14 font-size-12">
      <!-- E 卡列表（order.card.length）—— 求购订单无此字段，结构保留 -->
      <template v-if="order.card && order.card.length">
        <div v-for="(card, i) in order.card" :key="i" class="font-size-14">
          <div class="flex flex-js-sb ptb-8">
            <span class="font-color-999">E卡卡号{{ order.card.length === 1 ? '' : i + 1 }}：</span>
            <div class="font-color-black flex flex-ai-center">
              <span>{{ card.card_sn }}</span>
              <img class="w-icon ml-4" src="/assets/img/order/copy-dark.png" alt="复制" @click="copy(card.card_sn)" />
            </div>
          </div>
          <div class="flex flex-js-sb ptb-8">
            <span class="font-color-999">E卡密码{{ order.card.length === 1 ? '' : i + 1 }}：</span>
            <div class="font-color-black flex flex-ai-center">
              <span>{{ card.show_pwd ? card.card_pwd : card.card_keys }}</span>
              <span class="uview-icon ml-4 eye" @click="showECardPass(card)">{{ card.show_pwd ? '&#xe641;' : '&#xe648;' }}</span>
              <img v-if="card.card_pwd" class="w-icon ml-8" src="/assets/img/order/copy-dark.png" alt="复制" @click="copy(card.card_pwd)" />
            </div>
          </div>
        </div>
      </template>

      <!-- 订单状态标题：status!=3 && step>-1 -->
      <div v-if="order.order_status != 3 && step > -1" class="font-color-black pb-8 font-w-bold">订单状态</div>

      <!-- 第一个 u-steps（[1,7,2]）：order_type!=11 才渲染 —— 求购订单走 process steps -->
      <div v-if="order.order_status != 3 && step > -1 && order.order_type != 11" class="mt-8">
        <div class="u-steps">
          <div v-for="(s, i) in [1, 7, 2]" :key="i" class="u-steps-item">
            <div class="u-steps-item__line" v-if="i < 2" />
            <div class="u-steps-item__wrapper">
              <div class="slot-icon" :class="{ active: order.order_status == s }" />
            </div>
            <div class="u-steps-item__content">
              <div class="pb-20 font-size-14" :class="order.order_status == s ? 'font-color-theme' : 'font-color-999'">
                <span>{{ processMap[s] && processMap[s].process }}</span>
                <span v-if="order.order_status == s" class="ml-8">（{{ formatDate(order.updatetime) }}）</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二个 u-steps（process）：无条件渲染 -->
      <div class="mt-8">
        <div class="u-steps">
          <div v-for="(p, i) in process" :key="i" class="u-steps-item">
            <div class="u-steps-item__line" v-if="i < process.length - 1" />
            <div class="u-steps-item__wrapper">
              <div class="slot-icon" :class="{ active: order.order_status == p.status }" />
            </div>
            <div class="u-steps-item__content">
              <div class="pb-20 font-size-14" :class="order.order_status == p.status ? 'font-color-theme' : 'font-color-999'">
                <span>{{ p.title }}</span>
                <span v-if="order.order_status == p.status" class="ml-8">（{{ formatDate(order.updatetime) }}）</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ⑤ u-popup：操作密码（无 E 卡时不触发，结构保留） -->
    <div v-if="showPayPass" class="gi-popup-mask" @click.self="showPayPass = false">
      <div class="auth-popup">
        <span class="close uview-icon" @click="showPayPass = false">&#xe685;</span>
        <div class="pt-10 text-center font-color-black font-size-16 font-w-500">请输入操作密码</div>
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
 * 订单明细（beg/info 版）—— 原站组件 `GoodsInfo`（render `4312` / script `0fbc`）
 *
 * 与深色版 `GoodsInfo.vue`（defaultDetail，render `a2d01`）是**同组件不同页面的两份编译产物**：
 *   本版 scope 7c6b1df8（beg/info + entrust/info 共用），结构为
 *   「商品编号 chips + 订单详情卡 + 订单状态卡 + u-steps 步骤条」。
 *
 * 原站 script `0fbc` 逐字逻辑：
 *   filters.payName: {huifu:'汇付支付', yibao:'易宝支付'}[pay_way]
 *   computed.step: order_status ? [1,7,2].indexOf(Number(order_status)) : 0
 *   computed.process:
 *     arr = order_status<=3 ? [1,7,2,3] : order_status<8 ? [5,6,4] : [5,8,4]
 *     arr.map(s => ({status:s, title:ORDER_STATUS_MAP[order_type][s].process, time:'updatetime'}))
 *   methods: copy / showECardPass / toForget / passRes（E 卡相关，求购订单无 card 走不到）
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ORDER_STATUS_MAP } from './statusMap'
import { copyText as copy } from '@/utils/clipboard'

const props = defineProps({
  order: { type: Object, default: () => ({}) }
})

const router = useRouter()

const showPayPass = ref(false)
const ecard = ref({})
const pwd = ref('')
const pwdArr = ref(['', '', '', '', '', ''])

/** 原站 filters.payName */
function payName(way) {
  return { huifu: '汇付支付', yibao: '易宝支付' }[way] || ''
}

/** 原站 computed.step */
const step = computed(() => {
  const st = props.order.order_status
  return st ? [1, 7, 2].indexOf(Number(st)) : 0
})

/** 原站 computed.process */
const process = computed(() => {
  const o = props.order
  const st = Number(o.order_status)
  const arr = st <= 3 ? [1, 7, 2, 3] : st < 8 ? [5, 6, 4] : [5, 8, 4]
  const map = ORDER_STATUS_MAP[o.order_type] || {}
  return arr.map((s) => ({ status: s, title: (map[s] && map[s].process) || '', time: 'updatetime' }))
})

/** 第一个 u-steps（[1,7,2]）用的映射（仅 order_type!=11 渲染） */
const processMap = computed(() => {
  const map = ORDER_STATUS_MAP[props.order.order_type] || {}
  return { 1: map[1], 7: map[7], 2: map[2] }
})

/** 商品编号 chips：goods_type!=1 && collection_code.length>1 */
const showCodeChips = computed(() => {
  const o = props.order
  return o.goods_type != 1 && o.goods_type !== undefined && o.collection_code && o.collection_code.length > 1
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

/** 原站 passRes → getECardPass（本页求购订单无 E 卡，保留结构） */
async function passRes(val) {
  try {
    const { getECardPass } = await import('@/api')
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

/** 原站 formatDate(updatetime)，YYYY-MM-DD HH:mm */
function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>

<style scoped>
/* ============ 原子类（原站 scope 7c6b1df8 内嵌副本，按需落地） ============ */
.gap-12 { gap: 12.48px; } /* 24rpx */
.mb-16 { margin-bottom: 16.64px; } /* 32rpx */
.mb-8 { margin-bottom: 8.32px; }
.pa-3 { padding: 3.12px; } /* 6rpx */
.pa-14 { padding: 14.56px; } /* 28rpx */
.pt-14 { padding-top: 14.56px; }
.plr-14 { padding-left: 14.56px; padding-right: 14.56px; }
.mt-14 { margin-top: 14.56px; }
.mt-8 { margin-top: 8.32px; }
.mt-30 { margin-top: 31.2px; }
.pb-8 { padding-bottom: 8.32px; }
.ptb-8 { padding-top: 8.32px; padding-bottom: 8.32px; }
.pt-10 { padding-top: 10.4px; }
.pb-20 { padding-bottom: 20.8px; } /* 40rpx */
.ml-4 { margin-left: 4.16px; }
.ml-8 { margin-left: 8.32px; }
.br-4 { border-radius: 4.16px; } /* 8rpx */
.br-8 { border-radius: 8.32px; } /* 16rpx */
.font-size-12 { font-size: 12.48px; } /* 24rpx */
.font-size-14 { font-size: 14.56px; } /* 28rpx */
.font-size-16 { font-size: 16.64px; } /* 32rpx */
.font-w-500 { font-weight: 500; }
.font-w-bold { font-weight: 700; }
.flex { display: flex; }
.flex-w { flex-wrap: wrap; }
.flex-js-sb { justify-content: space-between; }
.flex-ai-center { align-items: center; }
.flex-center { justify-content: center; align-items: center; }
.text-center { text-align: center; }

/* ============ 颜色（原站 scope 7c6b1df8 色板） ============ */
.font-color-theme { color: #333; }
.font-color-999 { color: #999; }
.font-color-black { color: #23262f; }

/* ============ .bg-color-item（7c6b1df8：白底 + 1px #e7e7ea + 40rpx 圆角，br-8 后覆盖圆角） ============ */
.bg-color-item {
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px; /* 40rpx，被 .br-8 覆盖为 8.32px */
}
.bg-color-item.br-8 { border-radius: 8.32px; }

/* 原站 chips：staticStyle background-color #e5e5e5 */
.code-chip { background-color: #e5e5e5; }

/* ============ w-icon copy-dark（原站 w-icon size 默认 14；订单ID行 size=18） ============ */
.w-icon {
  width: 14px;
  height: 14px;
  margin-left: 4.16px;
  cursor: pointer;
}

/* ============ u-steps（原站 ba11/eb2e 简化落地：column + dot） ============ */
.u-steps { display: flex; flex-direction: column; }
.u-steps-item {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-bottom: 5px; /* 原站 .u-steps-item--column */
}
/* 原站 .u-steps-item__line--column{width:1px;left:10px}；
   页面级 .goods-info .u-steps-item__line{background-color:#cfcfcf!important} */
.u-steps-item__line {
  position: absolute;
  width: 1px;
  left: 10px;
  height: 20px;
  background-color: #cfcfcf;
}
/* 原站 .u-steps-item__wrapper--column--dot{width:20px;height:20px}，wrapper 白底遮线 */
.u-steps-item__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #fff;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
/* 原站 .u-steps-item__content--column{flex-direction:column;margin-left:6px}，content flex:1 */
.u-steps-item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 6px;
}
/* 原站 .goods-info .slot-icon{width:10rpx;height:10rpx;border-radius:50%;background-color:#cfcfcf} */
.slot-icon {
  width: 5.2px;
  height: 5.2px;
  border-radius: 50%;
  background-color: #cfcfcf;
}
/* 原站 .goods-info .slot-icon.active{background-color:#f52500} */
.slot-icon.active { background-color: #f52500; }

/* ============ u-popup 操作密码（原站 u-popup round 12 / mode center） ============ */
.gi-popup-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 原站 staticStyle{width:654rpx} + .ptb-26.br-12.auth-popup；.goods-info .auth-popup{position:relative} */
.auth-popup {
  position: relative;
  width: 340.08px; /* 654rpx */
  padding: 27.04px 0; /* ptb-26 = 52rpx */
  border-radius: 6.24px; /* br-12 = 24rpx */
  background: #fff;
}
/* 原站 .goods-info .auth-popup .close{position:absolute;right:0;top:-80rpx;z-index:2} */
.auth-popup .close {
  position: absolute;
  right: 0;
  top: -41.6px; /* -80rpx */
  z-index: 2;
  font-size: 24px;
  color: #333;
}
/* 原站 .goods-info .auth-popup .u-code-input{gap:20rpx} */
.code-input {
  display: flex;
  gap: 10.4px; /* 20rpx */
}
/* 原站 .u-code-input__item{background-color:#ececec;width:84rpx!important;height:84rpx!important;
   margin-right:0!important} + .br-8{border-radius:16rpx} */
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
}
.eye {
  font-size: 15px;
  color: #999;
  cursor: pointer;
  display: inline-block;
}
</style>
