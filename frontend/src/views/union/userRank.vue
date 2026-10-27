<template>
  <!--
    原站 pages/union/userRank（工会成员排名）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：container 390x844 背景图 rank-bg.webp (100% 100%, no-repeat)，padding-top 36px
            返回 back-btn-white.png 24x24 @(13,10)
            标题「工会成员排名」15px bold 白 @(150,16,90,16)
          → 表头行 @(0,80)
              「排名」12px 白 @(32,80,62,18)
              「成员」12px 白 @(94,80,24,18)
              「荣誉值」12px 白 @(118,80,240,18) 右对齐 + ? 图标 12x12 @(346,83)
          → 列表占位 l-item 356x75 br7px @(16,112) / @(16,201)
            （接口 code 0「工会不存在」，卡片无背景/无边框，视觉不可见，仅保留占位）
    端点：POST /union/user/logs {types:1} → { code:0, msg:"工会不存在", data:null }
  -->
  <div class="us-page">
    <div class="us-nav">
      <div class="us-nav__back" @click="goBack"></div>
      <span class="us-nav__title">工会成员排名</span>
    </div>

    <div class="us-head">
      <span class="us-head__col us-head__col--number">排名</span>
      <span class="us-head__col us-head__col--people">成员</span>
      <span class="us-head__col us-head__col--name">
        荣誉值
        <i class="us-head__q"></i>
      </span>
    </div>

    <div class="us-item"></div>
    <div class="us-item us-item--second"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUnionUserLogs } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getUnionUserLogs({ types: 1 })
  } catch (e) {
    // 原站「工会不存在」，列表为空
  }
})
</script>

<style scoped>
.us-page {
  position: relative;
  min-height: 100vh;
  background: url('/static/icon/gh/rank-bg.webp') no-repeat 0 0 / 100% 100%;
  overflow: hidden;
}
.us-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.us-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat 0 0 / 24px 24px;
}
.us-nav__title {
  position: absolute;
  left: 150px;
  top: 16px;
  width: 90px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}
/* 表头行 @(0,80) */
.us-head {
  position: absolute;
  left: 0;
  top: 80px;
  width: 390px;
  height: 18px;
  padding: 0 16px;
}
.us-head__col {
  position: absolute;
  top: 0;
  height: 18px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: #fff;
  white-space: nowrap;
}
.us-head__col--number {
  left: 32px;
  width: 62px;
  text-align: left;
}
.us-head__col--people {
  left: 94px;
  width: 24px;
  text-align: left;
}
.us-head__col--name {
  left: 118px;
  width: 240px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  text-align: right;
}
.us-head__q {
  position: absolute;
  left: 228px;
  top: 3px;
  width: 12px;
  height: 12px;
  background: url('/static/icon/gh/q.webp') no-repeat 0 0 / 12px 12px;
}
/* 列表占位 356x75 br7px @(16,112) / @(16,201) */
.us-item {
  position: absolute;
  left: 16px;
  top: 112px;
  width: 356px;
  height: 75px;
  border-radius: 7px;
}
.us-item--second {
  top: 201px;
}
</style>
