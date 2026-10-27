<template>
  <!--
    原站 pages/certification/certificationStatus（认证结果）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：原生 uni-page-head 390x44 bg #fff，标题「认证结果」16px bold 黑 @(70,7,250,30)
            页面内又叠了一层 u-navbar（back-btn.png @(13,10)、标题 @(165,16,60,16) 15px bold rgb(51,51,51)）
          → 标题「实名认证失败」24px rgb(51,51,51) @(123,137,144,26)
          → 提示「该身份信息认证失败，请重试」14px rgb(122,122,122) @(104,172,182,21)
          → 空态区（u-empty，image 无背景）
          → 按钮「重新认证」180x47 @(105,489) br23px
            渐变 linear-gradient(135deg, rgb(250,232,189), rgb(207,175,114))，文字 14px bold rgb(47,36,20)
    端点：无（仅读取本地认证状态，测试账号为「认证失败」）
  -->
  <div class="cs-page">
    <div class="cs-pagehead">
      <i class="cs-pagehead__icon">&#xe601;</i>
      <span class="cs-pagehead__title">认证结果</span>
    </div>

    <div class="cs-nav">
      <div class="cs-nav__back" @click="goBack"></div>
      <span class="cs-nav__title">认证结果</span>
    </div>

    <div class="cs-header">
      <div class="cs-header__title">实名认证失败</div>
      <div class="cs-header__hint">该身份信息认证失败，请重试</div>
    </div>

    <div class="cs-btn" @click="goRecert">重新认证</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function goRecert() {
  router.push('/pages/certification/certification')
}
</script>

<style scoped>
.cs-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
/* 原生 uni-page-head 390x44 bg #fff */
.cs-pagehead {
  position: relative;
  width: 390px;
  height: 44px;
  padding: 7px 3px;
  background: #fff;
}
.cs-pagehead__icon {
  font-family: unibtn;
  position: absolute;
  left: 5px;
  top: 6px;
  width: 27px;
  height: 27px;
  font-size: 27px;
  line-height: 27px;
  color: #000;
  font-style: normal;
  overflow: hidden;
}
.cs-pagehead__title {
  position: absolute;
  left: 70px;
  top: 7px;
  width: 250px;
  height: 30px;
  font-size: 16px;
  font-weight: 700;
  line-height: 30px;
  color: #000;
  text-align: center;
}
/* 页面内叠加的 u-navbar */
.cs-nav {
  position: absolute;
  left: 0;
  top: 0;
  width: 390px;
  height: 44px;
  background: transparent;
}
.cs-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat 0 0 / 24px 24px;
}
.cs-nav__title {
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
/* 标题区 */
.cs-header {
  position: absolute;
  left: 0;
  top: 137px;
  width: 390px;
  height: 60px;
  text-align: center;
}
.cs-header__title {
  width: 144px;
  height: 26px;
  margin: 0 auto;
  font-size: 24px;
  font-weight: 500;
  line-height: 26px;
  color: rgb(51, 51, 51);
}
.cs-header__hint {
  display: inline-block;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgb(122, 122, 122);
  white-space: nowrap;
}
/* 按钮 180x47 @(105,489) */
.cs-btn {
  position: absolute;
  left: 105px;
  top: 489px;
  width: 180px;
  height: 47px;
  border-radius: 23px;
  background: linear-gradient(135deg, rgb(250, 232, 189), rgb(207, 175, 114));
  font-size: 14px;
  font-weight: 700;
  line-height: 47px;
  color: rgb(47, 36, 20);
  text-align: center;
}
</style>
