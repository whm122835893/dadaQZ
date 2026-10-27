<template>
  <!--
    原站 pages/union/news（工会消息通知）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：container 390x844 背景图 rank-bg.webp (100% 100%, no-repeat)，padding-top 36px
            返回 back-btn-white.png 24x24 @(13,10)
            标题「消息通知」15px bold 白 @(165,16,60,16)
          → 列表区为空（接口 code 500「An error occurred」）
    端点：POST /union/user/message → { code:500, msg:"An error occurred", data:null }
          POST /union/user/myunion → { code:1, data:{...} }
  -->
  <div class="un-page">
    <div class="un-nav">
      <div class="un-nav__back" @click="goBack"></div>
      <span class="un-nav__title">消息通知</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUnionMessage, getUnionMyUnion } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getUnionMessage()
  } catch (e) {
    // 原站接口 500，列表为空
  }
  try {
    await getUnionMyUnion()
  } catch (e) {
    // 原站同样忽略
  }
})
</script>

<style scoped>
.un-page {
  position: relative;
  min-height: 100vh;
  background: url('/static/icon/gh/rank-bg.webp') no-repeat 0 0 / 100% 100%;
  overflow: hidden;
}
.un-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.un-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat 0 0 / 24px 24px;
}
.un-nav__title {
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
</style>
