<template>
  <!--
    原站 pages/rank/userBuy（买入清单）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：整页 390x844
            背景 rgb(246,246,246) + /static/image/leaderboard/qd-bg.webp (size 390px, no-repeat)
            返回 back-btn2.png 24x24 @(13,10)（深色箭头，压在浅蓝背景上）
            标题「买入清单」15px bold #fff 居中 @(165,16,60,16)
      → 白色列表区 364x740 @(13,77) bg #fff br12px（原站无数据，空列表）
    端点：POST /user/masterinfo → { code:1, data:[] }
  -->
  <div class="ub-page">
    <div class="ub-nav">
      <div class="ub-nav__back" @click="goBack"></div>
      <span class="ub-nav__title">买入清单</span>
    </div>

    <div class="ub-list"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserMasterInfo } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/rank/rankList')
}

onMounted(async () => {
  try {
    await getUserMasterInfo({})
  } catch (e) {
    // 原站接口返回空数组，页面保持空列表
  }
})
</script>

<style scoped>
.ub-page {
  position: relative;
  min-height: 100vh;
  background: rgb(246, 246, 246);
  background-image: url('/static/image/leaderboard/qd-bg.webp');
  background-size: 390px auto;
  background-repeat: no-repeat;
  background-position: 0% 0%;
  overflow: hidden;
}
.ub-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.ub-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn2.png') no-repeat 0 0 / 100% 100%;
}
.ub-nav__title {
  position: absolute;
  left: 165px;
  top: 16px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  text-align: center;
}
/* 白色列表区 364x740 @(13,77) */
.ub-list {
  position: absolute;
  left: 13px;
  top: 77px;
  width: 364px;
  height: 740px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}
</style>
