<template>
  <!--
    原站 pages/rebate/leaderboard（返佣排行榜）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：body bg rgb(247,247,248)
            navbar 390x44 bg rgb(250,250,250)
              返回 back-btn.png 24x24 @(13,10)
              标题为空（原站 u-navbar 标题 span 为空）
          → tab 三个 45x22 @(60.5,60) / @(194.5,60) / @(328.5,60)，15px rgb(65,65,65)
              「日排行」「周排行」「月排行」
          → tab 指示条 18x3 @(74,77) url(/static/bg/vector.png)
          → 表头行 @(0,91.5)
              「排名」15px rgb(153,153,153) @(32,91.5,65.2,22)
              「用户」15px rgb(153,153,153) @(97.2,91.5,97.8,22)
              「返佣金额」15px rgb(153,153,153) @(195,91.5,163,22) 右对齐
          → 空态插画 121x122 @(134.5,227) search-empty.png
    端点：POST /user/commison_rank {type:1} → 响应体为空（type 1 日 / 2 周 / 3 月）
  -->
  <div class="rl-page">
    <div class="rl-nav">
      <div class="rl-nav__back" @click="goBack"></div>
      <span class="rl-nav__title"></span>
    </div>

    <div class="rl-tabs">
      <span
        v-for="t in tabs"
        :key="t.type"
        class="rl-tabs__item"
        :class="{ 'rl-tabs__item--on': t.type === curType }"
        @click="curType = t.type"
      >{{ t.text }}</span>
      <div class="rl-tabs__line" :style="{ left: lineLeft + 'px' }"></div>
    </div>

    <div class="rl-head">
      <span class="rl-head__col rl-head__col--rank">排名</span>
      <span class="rl-head__col rl-head__col--user">用户</span>
      <span class="rl-head__col rl-head__col--price">返佣金额</span>
    </div>

    <div class="rl-empty">
      <div class="rl-empty__img"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCommissionRank } from '@/api'

const router = useRouter()

const tabs = [
  { type: 1, text: '日排行' },
  { type: 2, text: '周排行' },
  { type: 3, text: '月排行' }
]
const curType = ref(1)
// 原站指示条固定在第一个 tab 下（74,77），随选中项移动
const lineLeft = computed(() => 74 + (curType.value - 1) * 134)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getCommissionRank({ type: curType.value })
  } catch (e) {
    // 原站接口无响应，列表为空
  }
})
</script>

<style scoped>
.rl-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.rl-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.rl-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat 0 0 / 24px 24px;
}
.rl-nav__title {
  position: absolute;
  left: 165px;
  top: 16px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: rgb(51, 51, 51);
  text-align: center;
}
/* tab 三个 45x22 @(60.5,60) / (194.5,60) / (328.5,60) */
.rl-tabs {
  position: absolute;
  left: 0;
  top: 60px;
  width: 390px;
  height: 22px;
}
.rl-tabs__item {
  position: absolute;
  top: 0;
  width: 45px;
  height: 22px;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  color: rgb(65, 65, 65);
  text-align: center;
  white-space: nowrap;
}
.rl-tabs__item:nth-child(1) { left: 60.5px; }
.rl-tabs__item:nth-child(2) { left: 194.5px; }
.rl-tabs__item:nth-child(3) { left: 328.5px; }
.rl-tabs__line {
  position: absolute;
  left: 74px;
  top: 17px;
  width: 18px;
  height: 3px;
  background: url('/static/bg/vector.png') no-repeat 100% 100% / cover;
  border-radius: 100px;
}
/* 表头行 @(0,91.5) */
.rl-head {
  position: absolute;
  left: 0;
  top: 91.5px;
  width: 390px;
  height: 22px;
  padding: 0 16px;
}
.rl-head__col {
  position: absolute;
  top: 0;
  height: 22px;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  color: rgb(153, 153, 153);
  white-space: nowrap;
}
.rl-head__col--rank {
  left: 32px;
  width: 65.2px;
  text-align: left;
}
.rl-head__col--user {
  left: 97.2px;
  width: 97.8px;
  text-align: left;
}
.rl-head__col--price {
  left: 195px;
  width: 163px;
  text-align: right;
}
/* 空态插画 121x122 @(134.5,227) */
.rl-empty {
  position: absolute;
  left: 134.5px;
  top: 227px;
  width: 121px;
  height: 122px;
}
.rl-empty__img {
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat 0 0 / 121px 122px;
}
</style>
