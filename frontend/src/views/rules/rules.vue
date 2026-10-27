<template>
  <!--
    原站 pages/rules/rules（活动规则）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：navbar 390x44 bg rgb(250,250,250)
            返回 back-btn.png 24x24 @(13,10)
            标题「活动规则」15px bold rgb(51,51,51) @(165,16,60,16)
      → 内容卡 360x422 @(15,59) bg #fff br12px bd 1px rgb(231,231,234)
            卡内无任何内容（接口无数据，原站即为空白卡）
    端点：无（该页仅渲染静态空卡）
  -->
  <div class="rr-page">
    <div class="rr-nav">
      <div class="rr-nav__back" @click="goBack"></div>
      <span class="rr-nav__title">活动规则</span>
    </div>

    <div class="rr-card"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}
</script>

<style scoped>
.rr-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.rr-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.rr-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat center / 24px 24px;
}
.rr-nav__title {
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
/* 内容卡 360x422 @(15,59) */
.rr-card {
  position: absolute;
  left: 15px;
  top: 59px;
  width: 360px;
  height: 422px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid rgb(231, 231, 234);
  border-radius: 12px;
}
</style>
