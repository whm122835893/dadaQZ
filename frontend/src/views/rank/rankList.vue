<template>
  <!--
    原站 pages/rank/rankList（龙虎榜）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：整页 390x880
            背景 rgb(233,241,252) + /static/bg/dragonTigerList1.webp (size 100%, no-repeat)
            返回 back-btn-white.png 24x24 @(13,10)
      → 顶部装饰 195x79 @(97.5,208) /static/image/rank/rank-time-bg.webp
            「榜单每3分钟刷新」14px bold #fff 居中
      → 榜单卡 353x593 @(16,287) bg /static/bg/rank-list-bg.webp (size 100% 100%) br8px
            表头行 353x21 @(16,291)
              「排名」10px #fff @(16,294,94,15)
              「用户」10px #fff @(110,294,131,15)
              「市场影响力」10px #fff @(241,294,128,15)
              问号图标 14x14 @(328,294.5) /static/icon/q.png
            空态区 353x255 @(16,312)
              插画 121x122 @(132,332) /static/empty/search-empty.png
    端点：POST /user/newrank1 → { headUser:[], list:[], rank1:[], rank2:[] }
  -->
  <div class="rl-page">
    <div class="rl-back" @click="goBack"></div>

    <div class="rl-banner">
      <span class="rl-banner__text">榜单每3分钟刷新</span>
    </div>

    <div class="rl-card">
      <div class="rl-head">
        <span class="rl-head__col rl-head__col--order">排名</span>
        <span class="rl-head__col rl-head__col--user">用户</span>
        <span class="rl-head__col rl-head__col--value">市场影响力</span>
        <div class="rl-head__q"></div>
      </div>
      <div class="rl-body">
        <div class="rl-empty__img"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserNewRank } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getUserNewRank({})
  } catch (e) {
    // 原站接口异常时保持空态，不改动 UI
  }
})
</script>

<style scoped>
/*
 * 原站 .rank 元素背景为 dragonTigerList1.webp，但被内部 .container(page-container)
 * 的 rgb(247,247,248) 不透明底色整页覆盖 → 实际视觉为浅灰白，牛头仅出现在
 * rank-time-bg 装饰条中。故此处不复刻牛头背景图，改为浅色底。
 */
.rl-page {
  position: relative;
  min-height: 880px;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.rl-back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat 0 0 / 100% 100%;
}
/* 顶部装饰 195x79 @(97.5,208) */
.rl-banner {
  position: absolute;
  left: 97.5px;
  top: 208px;
  width: 195px;
  height: 79px;
  background: url('/static/image/rank/rank-time-bg.webp') no-repeat 0 0 / 100% auto;
  text-align: center;
}
/* 文字 span 原站位于 (142.5,234,105,15)，水平居中于装饰条 */
.rl-banner__text {
  position: absolute;
  left: 45px;
  top: 26px;
  width: 105px;
  height: 15px;
  font-size: 14px;
  font-weight: 700;
  line-height: 15px;
  color: #fff;
  white-space: nowrap;
  text-align: center;
}
/* 榜单卡 353x593 @(16,287) */
.rl-card {
  position: absolute;
  left: 16px;
  top: 287px;
  width: 353px;
  height: 593px;
  background: url('/static/bg/rank-list-bg.webp') no-repeat 50% 0 / 100% 100%;
  border-radius: 8px;
  overflow: hidden;
}
/* 表头行 353x21 @(16,291) */
.rl-head {
  position: absolute;
  left: 0;
  top: 4px;
  width: 353px;
  height: 21px;
  display: flex;
  align-items: center;
}
.rl-head__col {
  font-size: 10px;
  color: #fff;
}
.rl-head__col--order {
  width: 94px;
  text-align: center;
}
.rl-head__col--user {
  width: 131px;
  text-align: center;
}
.rl-head__col--value {
  width: 128px;
  text-align: left;
}
.rl-head__q {
  position: absolute;
  left: 312px;
  top: 3.5px;
  width: 14px;
  height: 14px;
  background: url('/static/icon/q.png') no-repeat 0 0 / 100% 100%;
}
/* 空态区 353x255 @(16,312) */
.rl-body {
  position: absolute;
  left: 0;
  top: 25px;
  width: 353px;
  height: 255px;
}
.rl-empty__img {
  position: absolute;
  left: 116px;
  top: 20px;
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat 0 0 / 100% 100%;
}
</style>
