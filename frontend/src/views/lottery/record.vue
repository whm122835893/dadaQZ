<template>
  <!--
    原站 pages/lottery/record（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：body 背景 rgb(16,17,21) + radial-gradient(468px 364px at 50% -93px,
              rgba(130,96,59,0.42), rgba(3,3,3,0) 70%)
      → navbar：返回 back-btn-white.png 24x24 @(13,10)
          标题「中奖记录」15px bold rgb(248,248,248) @(165,15.5,60,16)
      → 中奖记录卡 358x283 @(16,54) br12px bd 1px rgba(216,199,164,0.4)
          bg linear-gradient(135deg, rgba(196,181,144,0.5), rgba(55,52,49,0.9) 22%,
             rgba(24,23,23,0.92) 64%, rgba(155,117,67,0.72))
          title-bar 3x15 @(32,75.5) linear-gradient(rgb(249,232,196), rgb(212,182,138))
          「中奖记录」16px bold rgb(244,220,170) @(43,76,64,17)
          「2」22px bold rgb(244,220,170) @(34,109,11,25)
          「我的中奖记录」11px rgb(152,154,156) @(52,119,66,12)
          奖品格 326x70 @(32,160)/(32,240) bg rgb(3,3,3) br10px
             bd 1px rgba(216,199,164,0.25)
             缩略图 52x52 @(45,169)/(45,249) br50% + radial-gradient 光晕
             「0」13px bold rgb(244,220,170) @(109,177,6.5,15)
             「嗒嗒会员卡」11px rgb(248,248,248) @(109,200,55,12)
      → 抽奖记录卡 358x174 @(16,351)（同款渐变）
          「抽奖记录」16px bold @(43,373)
          「0」22px bold @(34,406)
          表头「抽奖结果」/「抽奖时间」11px rgb(152,154,156) @(44,462.5)/(302,462.5)
          「暂无抽奖记录」12px rgb(171,171,171) @(32,490,326,18)
    数据：POST /lottery/statistics {lottery_id} → 2 个奖品
         POST /lottery/record {type,lottery_id,page} → total 0
  -->
  <div class="lr-page">
    <div class="lr-nav">
      <div class="lr-nav__back" @click="goBack"></div>
      <span class="lr-nav__title">中奖记录</span>
    </div>

    <!-- 中奖记录 -->
    <div class="lr-card lr-card--win">
      <div class="lr-title-bar"></div>
      <span class="lr-card__title">中奖记录</span>
      <div class="lr-count">
        <span class="lr-count__num">{{ prizes.length }}</span>
        <span class="lr-count__label">我的中奖记录</span>
      </div>
      <div class="lr-prize-list">
        <div v-for="p in prizes" :key="p.id" class="lr-prize">
          <div class="lr-prize__thumb" :style="{ backgroundImage: `url(${p.image})` }"></div>
          <div class="lr-prize__meta">
            <span class="lr-prize__num">{{ p.num }}</span>
            <span class="lr-prize__name">{{ p.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 抽奖记录 -->
    <div class="lr-card lr-card--draw">
      <div class="lr-title-bar"></div>
      <span class="lr-card__title">抽奖记录</span>
      <div class="lr-count">
        <span class="lr-count__num">{{ drawTotal }}</span>
        <span class="lr-count__label">我的抽奖记录</span>
      </div>
      <div class="lr-table-head">
        <span class="lr-table-head__cell">抽奖结果</span>
        <span class="lr-table-head__cell lr-table-head__cell--right">抽奖时间</span>
      </div>
      <div v-if="!drawLogs.length" class="lr-empty">暂无抽奖记录</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getLotteryPrizeList, getLotteryDrawLog } from '@/api'

const router = useRouter()
const route = useRoute()

const prizes = ref([])
const drawLogs = ref([])
const drawTotal = ref(0)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/lottery/lottery')
}

onMounted(async () => {
  const lotteryId = route.query.id || 1
  try {
    const res = await getLotteryPrizeList({ lottery_id: lotteryId })
    prizes.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    prizes.value = []
  }
  try {
    const res = await getLotteryDrawLog({ lottery_id: lotteryId })
    const d = res.data || {}
    drawLogs.value = Array.isArray(d.data) ? d.data : []
    drawTotal.value = d.total || 0
  } catch (e) {
    drawLogs.value = []
  }
})
</script>

<style scoped>
.lr-page {
  position: relative;
  min-height: 100vh;
  background: rgb(16, 17, 21);
  background-image: radial-gradient(468px 364px at 50% -93px, rgba(130, 96, 59, 0.42), rgba(3, 3, 3, 0) 70%);
  overflow: hidden;
}
.lr-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.lr-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat center / 24px 24px;
}
.lr-nav__title {
  position: absolute;
  left: 165px;
  top: 15.5px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: rgb(248, 248, 248);
  text-align: center;
}
/* 卡片通用渐变 */
.lr-card {
  position: absolute;
  left: 16px;
  width: 358px;
  box-sizing: border-box;
  border: 1px solid rgba(216, 199, 164, 0.4);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(196, 181, 144, 0.5), rgba(55, 52, 49, 0.9) 22%,
    rgba(24, 23, 23, 0.92) 64%, rgba(155, 117, 67, 0.72));
}
.lr-card--win {
  top: 54px;
  height: 283px;
}
.lr-card--draw {
  top: 351px;
  height: 174px;
}
.lr-title-bar {
  position: absolute;
  left: 16px;
  top: 21.5px;
  width: 3px;
  height: 15px;
  border-radius: 1px;
  background: linear-gradient(rgb(249, 232, 196), rgb(212, 182, 138));
}
.lr-card--draw .lr-title-bar {
  top: 21.5px;
}
.lr-card__title {
  position: absolute;
  left: 27px;
  top: 22px;
  width: 64px;
  height: 17px;
  font-size: 16px;
  font-weight: 700;
  line-height: 17px;
  color: rgb(244, 220, 170);
}
/* 数量 */
.lr-count {
  position: absolute;
  left: 18px;
  top: 55px;
  height: 25px;
}
.lr-count__num {
  display: inline-block;
  width: 11px;
  height: 25px;
  font-size: 22px;
  font-weight: 700;
  line-height: 25px;
  color: rgb(244, 220, 170);
  vertical-align: top;
}
.lr-count__label {
  display: inline-block;
  margin-left: 7px;
  width: 66px;
  height: 12px;
  font-size: 11px;
  line-height: 12px;
  color: rgb(152, 154, 156);
  vertical-align: top;
  margin-top: 10px;
}
/* 奖品列表 */
.lr-prize-list {
  position: absolute;
  left: 16px;
  top: 106px;
  width: 326px;
  height: 150px;
}
.lr-prize {
  position: relative;
  width: 326px;
  height: 70px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid rgba(216, 199, 164, 0.25);
  border-radius: 10px;
  background: rgb(3, 3, 3);
}
.lr-prize__thumb {
  position: absolute;
  left: 12px;
  top: 8px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-image: radial-gradient(circle, rgba(130, 96, 59, 0.44) 0px, rgba(16, 17, 21, 0) 70%);
  background-size: cover;
  background-position: center;
}
.lr-prize__meta {
  position: absolute;
  left: 76px;
  top: 16px;
  width: 66px;
  height: 30px;
}
.lr-prize__num {
  display: block;
  width: 6.5px;
  height: 15px;
  font-size: 13px;
  font-weight: 700;
  line-height: 15px;
  color: rgb(244, 220, 170);
}
.lr-prize__name {
  display: block;
  width: 55px;
  height: 12px;
  margin-top: 8px;
  font-size: 11px;
  line-height: 12px;
  color: rgb(248, 248, 248);
}
/* 表头 */
.lr-table-head {
  position: absolute;
  left: 16px;
  top: 111.5px;
  width: 326px;
  height: 18px;
}
.lr-table-head__cell {
  position: absolute;
  left: 12px;
  top: 0;
  top: 0;
  width: 44px;
  height: 12px;
  font-size: 11px;
  line-height: 12px;
  color: rgb(152, 154, 156);
}
.lr-table-head__cell--right {
  left: 270px;
}
.lr-empty {
  position: absolute;
  left: 16px;
  top: 139px;
  width: 326px;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  color: rgb(171, 171, 171);
  text-align: center;
}
</style>
