<template>
  <div class="sg-bg">
    <!-- 顶部返回栏（原站 u-status-bar + sg-topbar） -->
    <div class="u-status-bar" />
    <div class="sg-topbar">
      <img class="sg-back" src="/assets/img/sign/icon-back.webp" alt="" @click="goBack" />
      <span class="sg-title">每日签到</span>
      <span class="sg-record" @click="toPage('/pages/task/index')">任务</span>
    </div>

    <!-- 头部标语 -->
    <div class="sg-hero">
      <span class="sg-hero-1">每一份热爱，都值得被记录</span>
      <span class="sg-hero-2">每日签到领取积分，连续签到解锁奖励</span>
    </div>

    <!-- 签到主卡片 -->
    <div class="sg-card sg-panel">
      <div class="sg-card-head">
        <div class="sg-head-left">
          <span class="sg-label">已连续签到</span>
          <div class="sg-days">
            <span class="sg-days-num">{{ streakDays }}</span>
            <span class="sg-days-unit">天</span>
          </div>
        </div>
        <span class="sg-point">累计积分 {{ pointText }}</span>
      </div>

      <!-- 7 天签到格：已签显示 ✓，未签显示奖励值 -->
      <div class="sg-week">
        <div
          v-for="(d, n) in signDays"
          :key="n"
          class="sg-day"
          :class="{ signed: d.signed }"
        >
          <span class="sg-day-label">第{{ n + 1 }}天</span>
          <span class="sg-day-value">{{ d.signed ? '✓' : d.reward }}</span>
        </div>
      </div>

      <div class="sg-btn" @click="onSign">
        <span>{{ signBtnText }}</span>
      </div>
    </div>

    <span class="sg-section">签到奖励</span>
    <div class="sg-rows">
      <div v-for="r in rewardRows" :key="r.title" class="sg-row">
        <div class="sg-row-icon">
          <img class="sg-row-icon-img" :src="r.image" alt="" />
        </div>
        <div class="sg-row-info">
          <span class="sg-row-title">{{ r.title }}</span>
          <span class="sg-row-desc">{{ r.desc }}</span>
        </div>
        <span v-if="r.action" class="sg-row-value" @click="r.onClick">{{ r.action }}</span>
        <span v-else class="sg-row-value">{{ r.value }}</span>
      </div>
    </div>

    <div class="sg-indicator-area">
      <div class="sg-indicator" />
    </div>

    <div class="safe-bottom" />
  </div>
</template>

<script setup>
/**
 * 每日签到 —— 原站 pages/sign/index
 * 反编译：pages-sign-index.ac51158a.js
 *   render 模块 a06b（scopeId 48fef3c4，30 个 sg- 类）
 *   logic  模块 4170
 * CSS 数值均为原站 rpx × 0.52 换算所得。
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSignConfig, getSignRecord, doSign } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()

const config = ref({})
const select = ref([])

/** 已连续签到天数（原站 computed streakDays） */
const streakDays = computed(() => Number(config.value.successions || 0))

/** 累计积分（原站依次取 integral / point / total_point / score，全空显示"—」） */
const pointText = computed(() => {
  const c = config.value || {}
  const v = c.integral || c.point || c.total_point || c.score
  return v || '—'
})

/**
 * 7 天签到格（原站 signDays）
 * 已签天数 = 连续天数，故第 0..streakDays-1 天为已签；第 7 天奖励 +50，其余 +10
 */
const signDays = computed(() => {
  const e = streakDays.value
  return [1, 2, 3, 4, 5, 6, 7].map((a, t) => ({
    day: a,
    signed: t < e,
    reward: 7 === a ? '+50' : '+10'
  }))
})

/** 按钮文案（原站 signBtnText） */
const signBtnText = computed(() => (config.value.is_signin ? '今日已签到' : '立即签到'))

/** 签到奖励三行（硬编码于原站 render，非接口数据） */
const rewardRows = computed(() => [
  {
    title: '每日签到',
    desc: '每日可领取 10 积分',
    value: '+10',
    image: '/assets/img/sign/icon-daily.webp'
  },
  {
    title: '连续 7 天',
    desc: '额外领取连续签到奖励',
    value: '+50',
    image: '/assets/img/sign/icon-streak.webp'
  },
  {
    title: '积分用途',
    desc: '可前往积分商城兑换好物',
    action: '前往 ›',
    image: '/assets/img/sign/icon-gift.webp',
    onClick: () => toPage('/pages/shop/shop')
  }
])

/** 初始化（原站 init）：并行拉配置 + 记录 */
async function init() {
  const [cfg, rec] = await Promise.all([getSignConfig(), getSignRecord()])
  config.value = cfg.data || {}
  const r = rec.data || {}
  // 原站用 moment(1e3 * time).format('YYYY-MM') 取当月，再把键拼成「月-日」
  const d = new Date(Number(rec.time || 0) * 1000)
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  select.value = Object.values(r).map((e) => ({ date: `${ym}-${e}`, info: '签到' }))
}

/** 签到（原站 onSign）：code === 1 → toast「签到成功」并重新 init */
async function onSign() {
  if (config.value.is_signin) {
    toast('今日已签到')
    return
  }
  const res = await doSign()
  if (res && res.code === 1) {
    toast('签到成功')
    init()
  } else {
    toast((res && res.msg) || '签到失败')
  }
}

/** 返回（原站 goBack）：无历史则回首页 tab */
function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function toPage(path) {
  if (!path) return
  router.push(path)
}

init()
</script>

<style scoped>
/* ==========================================================
   签到页 —— 数值全部来自原站 scopeId 48fef3c4 的 rpx CSS，
   已按 px = rpx × 0.52 换算
   ========================================================== */
.sg-bg {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1815 0%, #0a0a0a 46%, #000 100%);
  padding-bottom: calc(20px + var(--safe-bottom));
}

.u-status-bar {
  height: env(safe-area-inset-top, 0px);
}

/* 顶部返回栏 */
.sg-topbar {
  position: relative;
  height: 22.3px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sg-back {
  position: absolute;
  left: 12.44px;
  width: 5.95px;
  height: 9.19px;
}
.sg-title {
  font-size: 8.38px;
  font-weight: 700;
  color: #f8f8f8;
}
.sg-record {
  position: absolute;
  right: 12.44px;
  font-size: 5.41px;
  color: #989a9c;
}

/* 头部标语 */
.sg-hero {
  padding: 18.93px 12.44px 0;
}
.sg-hero-1 {
  display: block;
  font-size: 8.38px;
  font-weight: 700;
  color: #f4dcaa;
}
.sg-hero-2 {
  display: block;
  margin-top: 4.33px;
  font-size: 5.95px;
  color: #989a9c;
}

/* 主卡片 */
.sg-panel {
  background: linear-gradient(
    135deg,
    rgba(196, 181, 144, 0.57),
    rgba(55, 52, 49, 0.9) 20%,
    rgba(24, 23, 23, 0.9) 63%,
    rgba(155, 117, 67, 0.77)
  );
  border: 0.52px solid rgba(216, 199, 164, 0.4);
}
.sg-card {
  margin: 10.82px 12.44px 0;
  border-radius: 6.49px;
  padding: 8.11px 8.38px;
}
.sg-card-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.sg-label {
  font-size: 5.95px;
  color: #d8cdb6;
}
.sg-days {
  display: flex;
  align-items: baseline;
  margin-top: 2.16px;
}
.sg-days-num {
  font-size: 16.49px;
  font-weight: 700;
  color: #f4dcaa;
  line-height: 19.47px;
}
.sg-days-unit {
  font-size: 6.22px;
  color: #f4dcaa;
  margin-left: 2.16px;
}
.sg-point {
  font-size: 5.95px;
  color: #f4dcaa;
}

/* 7 天签到格 */
.sg-week {
  display: flex;
  justify-content: space-between;
  margin-top: 10.82px;
}
.sg-day {
  width: 20.28px;
  height: 27.04px;
  border-radius: 4.33px;
  background: #242220;
  border: 0.52px solid #f4dcaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 原站 width 为固定 rpx 值，需禁止 flex 压缩，否则「+50」会被裁切 */
  flex-shrink: 0;
  overflow: hidden;
}
.sg-day.signed {
  background: linear-gradient(135deg, #f4dcaa, #c8a45c);
}
.sg-day-label {
  font-size: 4.6px;
  color: #4e3e26;
}
.sg-day-value {
  margin-top: 2.7px;
  font-size: 6.22px;
  font-weight: 700;
  color: #4e3e26;
}

/* 签到按钮 */
.sg-btn {
  margin-top: 8.11px;
  height: 18.66px;
  border-radius: 9.46px;
  background: #f4dcaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5.72px;
  font-weight: 700;
  color: #3f2d14;
}
.sg-btn:active {
  opacity: 0.85;
}

/* 奖励区 */
.sg-section {
  display: block;
  margin: 10px 12.44px 0;
  font-size: 8.38px;
  font-weight: 700;
  color: #f8f8f8;
}
.sg-rows {
  margin: 6.76px 12.44px 0;
}
.sg-row {
  height: 31.64px;
  border-radius: 4.33px;
  background: #030303;
  border: 0.52px solid rgba(216, 199, 164, 0.25);
  display: flex;
  align-items: center;
  padding: 0 7.03px;
  margin-bottom: 6.76px;
}
.sg-row-icon {
  width: 17.58px;
  height: 17.58px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(130, 96, 59, 0.44) 0, rgba(16, 17, 21, 0) 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sg-row-icon-img {
  width: 13px;
  height: 13px;
}
.sg-row-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  margin-left: 5.95px;
}
.sg-row-title {
  font-size: 6.22px;
  color: #f8f8f8;
}
.sg-row-desc {
  margin-top: 2.7px;
  font-size: 5.41px;
  color: #989a9c;
}
.sg-row-value {
  font-size: 6.76px;
  font-weight: 700;
  color: #f4dcaa;
  flex-shrink: 0;
}

.sg-indicator-area {
  padding: 10.82px 0 5.41px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sg-indicator {
  width: 73px;
  height: 2.43px;
  border-radius: 1.35px;
  background: #f8f8f8;
}

.safe-bottom {
  height: calc(20px + var(--safe-bottom));
}
</style>