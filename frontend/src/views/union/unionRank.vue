<template>
  <!--
    原站 pages/union/unionRank（工会排名）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：container 390x844 背景图 rank-bg.webp (100% 100%, no-repeat)，padding-top 36px
            返回 back-btn-white.png 24x24 @(13,10)
            标题「工会排名」15px bold 白 @(165,16,60,16)
          → 表头行 390x36 @(0,80)
              「排名」12px 白 @(32,80,62,18)
              「工会」12px 白 @(94,80,24,18)
              「荣誉值」12px 白 @(118,80,240,18) 右对齐 + ? 图标 12x12 @(346,83)
    端点：POST /union/index/logs {types:1,page:1,pageSize:15} → { code:1, data:[] }（空列表）
  -->
  <div class="ur-page">
    <div class="ur-nav">
      <div class="ur-nav__back" @click="goBack"></div>
      <span class="ur-nav__title">工会排名</span>
    </div>

    <div class="ur-head">
      <span class="ur-head__col ur-head__col--number">排名</span>
      <span class="ur-head__col ur-head__col--people">工会</span>
      <span class="ur-head__col ur-head__col--name">
        荣誉值
        <i class="ur-head__q"></i>
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUnionRankLogs } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getUnionRankLogs({ types: 1, page: 1, pageSize: 15 })
  } catch (e) {
    // 原站列表为空，不渲染数据行
  }
})
</script>

<style scoped>
.ur-page {
  position: relative;
  min-height: 100vh;
  background: url('/static/icon/gh/rank-bg.webp') no-repeat 0 0 / 100% 100%;
  overflow: hidden;
}
.ur-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.ur-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat 0 0 / 24px 24px;
}
.ur-nav__title {
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
/* 表头行 390x36 @(0,80) */
.ur-head {
  position: absolute;
  left: 0;
  top: 80px;
  width: 390px;
  height: 18px;
  padding: 0 16px;
}
.ur-head__col {
  position: absolute;
  top: 0;
  height: 18px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: #fff;
  white-space: nowrap;
}
.ur-head__col--number {
  left: 32px;
  width: 62px;
  text-align: left;
}
.ur-head__col--people {
  left: 94px;
  width: 24px;
  text-align: left;
}
.ur-head__col--name {
  left: 118px;
  width: 240px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  text-align: right;
}
.ur-head__q {
  position: absolute;
  left: 228px;
  top: 3px;
  width: 12px;
  height: 12px;
  background: url('/static/icon/gh/q.webp') no-repeat 0 0 / 12px 12px;
}
</style>
