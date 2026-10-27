<template>
  <div class="lt-bg">
    <div class="u-status-bar" />

    <!-- 顶部返回栏（原站 lt-topbar） -->
    <div class="lt-topbar">
      <img class="lt-back" src="/assets/img/sign/icon-back.webp" alt="" @click="goBack" />
      <span class="lt-title">幸运抽奖</span>
      <span class="lt-record" @click="goRecord">中奖记录</span>
    </div>

    <!-- 头部标语 -->
    <div class="lt-hero">
      <span class="lt-hero-1">把好运，握在手里</span>
      <span class="lt-hero-2">每一次参与，都有惊喜相伴</span>
    </div>

    <!-- 九宫格：index 4 为「立即抽奖」按钮，其余 8 格为奖品 -->
    <div class="lt-card lt-panel">
      <div class="lt-grid">
        <template v-for="(cell, i) in gridCells">
          <!-- 中间抽奖按钮 -->
          <div v-if="i === 4" key="draw" class="lt-cell lt-draw" @click="isStartDraw(1)">
            <span class="lt-draw-1">立即</span>
            <span class="lt-draw-2">抽奖</span>
          </div>
          <!-- 奖品格 -->
          <div v-else :key="'prize-' + i" class="lt-cell">
            <img v-if="cell && cell.image" class="lt-cell-img" :src="imgUrl(cell.image)" alt="" />
            <span class="lt-cell-name">{{ cell ? cell.name : '' }}</span>
          </div>
        </template>
      </div>

      <div class="lt-card-foot">
        <span class="lt-remain">剩余抽奖次数：{{ info.remaining || 0 }} 次</span>
        <span class="lt-tip">邀请好友可获得更多机会</span>
        <div class="lt-five" @click="isStartDraw(5)">连抽 5 次</div>
      </div>
    </div>

    <span class="lt-section">活动说明</span>
    <div class="lt-rule">
      <div class="lt-rule-html" v-html="lotteryRule" />
    </div>

    <div class="lt-indicator-area"><div class="lt-indicator" /></div>

    <!-- 确认弹窗（原站 confimPop）：type=20 展示消耗藏品，type=10 展示消耗宝石 -->
    <div v-if="showPop" class="lt-mask" @click="cancel">
      <div class="lt-pop lt-pop-confirm">
        <div class="popCon">
          <div class="title">
            <div class="lt-pop-badge"> WY </div>
          </div>

          <div v-if="info.type === 20">
            <div class="hint title-text-style">此轮抽奖需要消耗藏品明细如下，请确认～</div>
            <div class="cp_info">
              <div v-for="(t, ti) in info.cp_list" :key="ti" class="item desc-text-style">
                <span class="cp-name">{{ t.name }} </span>
                <div class="mt-2">
                  <span v-for="cid in t.user_collection_ids" :key="cid" class="mr-4">#{{ cid }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="info.type === 10">
            <div class="hint">
              此轮抽奖需要消耗
              <span class="font-w-600 mlr-4">{{ crystal().num }}</span>
              {{ crystal().name }}，请确认～
            </div>
          </div>

          <div class="btn">
            <img class="lt-pop-btn" src="/assets/img/lottery/btn6.webp" alt="" @click="cancel" />
            <img class="lt-pop-btn" src="/assets/img/lottery/btn7.webp" alt="" @click="confim" />
          </div>
        </div>
      </div>
    </div>

    <!-- 中奖弹窗（原站 resultPop） -->
    <div v-if="showResultPop" class="lt-mask">
      <div class="lt-pop lt-pop-success">
        <div class="popCon">
          <div class="title">
            <div class="lt-pop-badge lt-badge-plain"> WY </div>
            <div class="lt-succ-1"> 恭喜中奖 </div>
            <div class="lt-succ-2"> 本次抽奖获得 </div>
            <div class="lt-succ-box">
              <scroll-view class="cp_info-scroll" scroll-y>
                <div class="cp_info">
                  <div v-for="(t, ti) in prize" :key="ti" class="cp_info-item">
                    <img
                      class="item-image"
                      :style="prize.length === 1 ? { width: '166.4px', height: '166.4px' } : {}"
                      :src="imgUrl(t.image)"
                      alt=""
                    />
                    <div class="item-name">{{ t.name }}</div>
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
          <div class="btn" @click="again">
            <img class="lt-pop-btn lt-pop-btn-full" src="/assets/img/lottery/btn7.webp" alt="" />
          </div>
        </div>
        <div class="close-success-btn">
          <img class="close-success" src="/assets/img/lottery/blank-close.webp" alt="" @click="showResultPop = false" />
        </div>
      </div>
    </div>

    <div class="safe-bottom" />
  </div>
</template>

<script setup>
/**
 * 幸运抽奖 —— 原站 pages/lottery/lottery
 * 反编译：pages-lottery-lottery.63c25018.js
 *   主 render 模块 386d（scopeId cd90d3aa，24 个 lt- 类）
 *   logic 模块 0950（data/computed/methods 全部复刻）
 *   API 模块 c6d8：/lottery/info、/lottery/start、/lottery/record
 * CSS 数值均为原站 rpx × 0.52 换算所得。
 */
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getLotteryInfo, startLottery } from '@/api'
import { OSS_URL } from '@/config'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()

const nowTimestamp = ref(Math.floor(Date.now() / 1000))
const showPop = ref(false)
const showResultPop = ref(false)
const num = ref(1)
const isStart = ref(false)
const prize = ref([])
const info = ref({
  remaining: 0,
  collection_json: [],
  lotteryList: [],
  award_list: []
})
const lotteryRule = ref('')

/**
 * 奖品格归一化（原站 prizeCells）
 * award_list 可能是数组或对象；对象则把键作为 name 合并进值
 * 最终取前 8 个
 */
const prizeCells = computed(() => {
  const t = info.value.award_list || []
  const d = Array.isArray(t)
    ? t
    : Object.keys(t).map((k) => {
        const v = t[k]
        return v && typeof v === 'object' ? { name: k, ...v } : { name: k }
      })
  return d.slice(0, 8).map((t) => ({
    name: t.name || '',
    detail: t.detail || '',
    image: t.image || ''
  }))
})

/**
 * 九宫格布局（原站 gridCells）
 * 共 9 格，index=4 是抽奖按钮位（占位 null），其余按奖品顺序填充
 * 注意原站索引：i>4 时取 d[i-1]，即 5..8 对应奖品[4..7]
 */
const gridCells = computed(() => {
  const a = prizeCells.value
  const out = []
  for (let i = 0; i < 9; i++) {
    out.push(i === 4 ? null : a[i > 4 ? i - 1 : i] || null)
  }
  return out
})

/** 当前宝石（原站 crystal）：crystal 10=黄 20=紫 30=蓝 */
function crystal() {
  const a = info.value
  switch (a.crystal) {
    case '10':
      return { icon: 'hsj', name: '黄', num: a.crystal_yellow }
    case '20':
      return { icon: 'zsj', name: '紫', num: a.crystal_purple }
    case '30':
      return { icon: 'lsj', name: '蓝', num: a.crystal_blue }
    default:
      return { icon: 'lsj', name: '蓝', num: 0 }
  }
}

/** 活动状态（原站 activeState → $tools.checkTimeBetween）：0未开始 1进行中 2已结束 */
function activeState() {
  const a = info.value
  const s = Number(a.start_time) * 1000
  const e = Number(a.end_time) * 1000
  if (!s || !e) return 1
  const now = nowTimestamp.value * 1000
  if (now < s) return 0
  if (now > e) return 2
  return 1
}

/**
 * 点击抽奖（原站 isStartDraw）
 * 校验顺序：活动状态 → 剩余次数 → 是否正在抽 → 免费次数
 * 免费次数 > 0 直接抽，否则弹确认框
 */
function isStartDraw(a) {
  const t = info.value
  const d = t.remaining
  const r = t.free_number
  const n = activeState()
  isStart.value = false
  if (n === 0) return toast('暂未开始')
  if (n === 2) return toast('活动已结束')
  if (Number(d) <= 0) return toast('次数不足')
  if (isStart.value) return toast('抽奖进行中...')
  if (r > 0) {
    num.value = a
    startDraw()
  } else {
    num.value = a
    showPop.value = true
  }
}

/** 确认弹窗确定 → 真正发起抽奖 */
function confim() {
  showPop.value = false
  startDraw()
}

function cancel() {
  showPop.value = false
}

/**
 * 发起抽奖（原站 startDraw）
 * 注意原站有1s 节流；成功后 prize=返回值，remaining -= num，
 * 扣宝石（crystalKC）、展示中奖弹窗
 */
let lastStart = 0
async function startDraw() {
  const now = Date.now()
  if (now - lastStart < 1000) return
  lastStart = now

  isStart.value = true
  const res = await startLottery({ lotteryId: info.value.id, number: num.value })
  isStart.value = false
  if (res && res.code === 1) {
    prize.value = Array.isArray(res.data) ? res.data : [res.data]
    info.value.remaining = (info.value.remaining || 0) - num.value
    crystalKC()
    showResultPop.value = true
  } else {
    toast((res && res.msg) || '抽奖失败')
  }
}

/** 扣除宝石（原站 crystalKC）：仅免费次数为 0 时才扣 */
function crystalKC() {
  const a = info.value
  if (a.free_number !== 0) return
  const cost = num.value * a.integral_1
  if (a.crystal === '10') a.crystal_yellow = a.crystal_yellow - cost
  else if (a.crystal === '20') a.crystal_yellow = a.crystal_blue - cost
  else if (a.crystal === '30') a.crystal_yellow = a.crystal - cost
}

/** 再抽一次（原站 again）：次数够则关闭弹窗重抽 */
function again() {
  if (num.value < info.value.remaining) {
    showResultPop.value = false
    startDraw()
  } else {
    toast('次数不足')
  }
}

/** 图片地址兼容本地与 OSS 相对路径 */
function imgUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//.test(p)) return p
  if (p.startsWith('/assets/')) return p
  return OSS_URL + p
}

async function getDetails() {
  const res = await getLotteryInfo({ id: route.query.id || 1 })
  if (res && res.code === 1 && res.data) {
    info.value = res.data
    lotteryRule.value = res.data.content || ''
  }
}

function goRecord() {
  toPage(`/pages/lottery/record?id=${info.value.id}`)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function toPage(p) {
  if (!p) return
  router.push(p)
}

const timer = setInterval(() => {
  nowTimestamp.value = Math.floor(Date.now() / 1000)
}, 1000)
onUnmounted(() => clearInterval(timer))

getDetails()
</script>

<style scoped>
/* ==========================================================
   抽奖页 —— 数值来自原站 scopeId cd90d3aa 的 rpx CSS（× 0.52）
   ========================================================== */
.lt-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #1c1a17 0%, #0a0a0a 40%, #000 100%);
  padding-bottom: calc(20px + var(--safe-bottom));
}

.u-status-bar {
  height: env(safe-area-inset-top, 0px);
}

/* 顶部栏 */
.lt-topbar {
  position: relative;
  height: 23.8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lt-back {
  position: absolute;
  left: 12.44px;
  width: 5.95px;
  height: 9.19px;
}
.lt-title {
  font-size: 8.38px;
  font-weight: 700;
  color: #f8f8f8;
}
.lt-record {
  position: absolute;
  right: 12.44px;
  font-size: 5.41px;
  color: #989a9c;
}

/* 头部标语 */
.lt-hero {
  padding: 16.22px 12.44px 0;
  text-align: center;
}
.lt-hero-1 {
  display: block;
  font-size: 11.36px;
  font-weight: 700;
  color: #f4dcaa;
}
.lt-hero-2 {
  display: block;
  margin-top: 4.87px;
  font-size: 5.95px;
  color: #989a9c;
}

/* 九宫格卡片 */
.lt-panel {
  background: linear-gradient(
    135deg,
    rgba(196, 181, 144, 0.57),
    rgba(55, 52, 49, 0.9) 20%,
    rgba(24, 23, 23, 0.9) 63%,
    rgba(155, 117, 67, 0.77)
  );
  border: 0.52px solid rgba(216, 199, 164, 0.4);
}
.lt-card {
  margin: 10.82px 12.44px 0;
  border-radius: 6.49px;
  padding: 10.28px 16.76px 12.44px;
}
.lt-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.lt-cell {
  width: 44.62px;
  height: 47.86px;
  border-radius: 4.33px;
  background: #111112;
  border: 0.52px solid #7a6242;
  margin-bottom: 5.14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.24px;
}
.lt-cell-img {
  width: 27.04px;
  height: 27.04px;
  border-radius: 3.24px;
  margin-bottom: 3.24px;
}
.lt-cell-name {
  font-size: 5.41px;
  color: #f4dcaa;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
/* 中间抽奖按钮：金色渐变 */
.lt-draw {
  background: linear-gradient(135deg, #fff0da, #d6ad66 25%, #fff1d1 52%, #8e642b);
  border: none;
}
.lt-draw-1 {
  font-size: 8.38px;
  font-weight: 700;
  color: #3f2d14;
  line-height: 10.82px;
}
.lt-draw-2 {
  font-size: 9.46px;
  font-weight: 700;
  color: #3f2d14;
  line-height: 11.9px;
}

/* 卡片底部 */
.lt-card-foot {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.7px;
}
.lt-remain {
  font-size: 6.22px;
  font-weight: 700;
  color: #f4dcaa;
}
.lt-tip {
  margin-top: 3.79px;
  font-size: 5.41px;
  color: #989a9c;
}
.lt-five {
  margin-top: 5.41px;
  padding: 2.7px 8.11px;
  border-radius: 6.49px;
  border: 0.52px solid rgba(216, 199, 164, 0.55);
  font-size: 5.41px;
  color: #f4dcaa;
}

/* 活动说明 */
.lt-section {
  display: block;
  margin: 10.82px 12.44px 0;
  font-size: 8.38px;
  font-weight: 700;
  color: #f8f8f8;
}
.lt-rule {
  margin: 6.76px 12.44px 0;
  padding: 7.03px;
  border-radius: 4.33px;
  background: #030303;
  border: 0.52px solid rgba(216, 199, 164, 0.25);
  font-size: 5.68px;
  color: #989a9c;
}
.lt-rule-html :deep(p) {
  margin: 0 0 6px;
  line-height: 1.7;
}
.lt-rule-html :deep(p:last-child) {
  margin-bottom: 0;
}

.lt-indicator-area {
  padding: 10.82px 0 5.41px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lt-indicator {
  width: 73px;
  height: 2.43px;
  border-radius: 1.35px;
  background: #f8f8f8;
}

/* ---------------- 弹窗 ---------------- */
.lt-mask {
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
  padding: 0 40px;
}
.lt-pop {
  position: relative;
  width: 100%;
  border-radius: 12px;
  background: #1a1a1a;
  padding: 20px 16px 16px;
}
.popCon .title {
  text-align: center;
}
.lt-pop-badge {
  background: #111;
  border-radius: 50%;
  width: 62.4px;
  height: 62.4px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  margin: 0 auto;
  letter-spacing: 2px;
}
.lt-badge-plain {
  width: auto;
  height: auto;
  background: #111;
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 11px;
}
.lt-succ-1 {
  font-weight: bold;
  font-size: 13.52px;
  color: #111111;
  text-align: center;
  margin-top: 15.6px;
  color: #f4dcaa;
}
.lt-succ-2 {
  font-weight: 400;
  margin-top: 3.64px;
  font-size: 5.72px;
  color: #777777;
  text-align: center;
}
.lt-succ-box {
  background: #f3f3f4;
  border: 0.52px solid #e2e2e4;
  margin: 0 26px;
  border-radius: 26px;
  padding: 12px;
}
.lt-pop-confirm .hint {
  font-size: 6.22px;
  margin-top: 14px;
  color: #989a9c;
  text-align: center;
}
.lt-pop-confirm .title-text-style {
  font-weight: 700;
  font-size: 6.22px;
  color: #111216;
}
.lt-pop-confirm .desc-text-style {
  font-weight: 400;
  font-size: 5.2px;
  color: #85868d;
}
.cp_info {
  margin-top: 10px;
  max-height: 160px;
  overflow-y: auto;
}
.cp_info .item {
  padding: 6px 0;
  text-align: center;
}
.cp-info-scroll {
  max-height: 220px;
}
.cp_info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
}
.item-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  background: #e2e2e4;
}
.item-name {
  margin-top: 6px;
  font-size: 11px;
  color: #111;
}
.lt-pop .btn {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.lt-pop-btn {
  width: 46%;
  height: auto;
}
.lt-pop-btn-full {
  width: 100%;
}
.close-success-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  z-index: 2;
}
.close-success {
  width: 18px;
  height: 18px;
}

.safe-bottom {
  height: calc(20px + var(--safe-bottom));
}
</style>