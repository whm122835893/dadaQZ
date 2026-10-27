<template>
  <!--
    原站 pages/blindBox/result2（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg（pageBg #f7f7f8）
      → w-navbar 44px（bg #fafafa）：
          返回 back-btn.png 24x24 @(13,10)、标题「盲盒结果」15px bold #333 @(165,15.5,60,16)
      → .content（width 100%，padding 104rpx 32rpx 228rpx）
          「藏品编号：」12px #999 @(162,102,66,18)  居中
          「#」12px fw500 #999 @(222,105,6,14)
      → .footer（fixed 底 y=756 h=88，bg #fff，border-top 1px solid #e7e7ea）
          「我的藏品」166x47 @(21,776.5) bg #f0f0f2 br26px，文字 14px bold #000
          「继续购买」166x47 @(197,776.5) 金渐变 br26px，文字 14px bold #2f2414
    数据：原站本页从开盒结果路由参数取值（storage/上一页传递），无独立列表接口
  -->
  <div class="br2-page">
    <div class="br2-nav">
      <div class="br2-nav__back" @click="goBack">
        <div class="br2-nav__back-img"></div>
      </div>
      <span class="br2-nav__title"><span>盲盒结果</span></span>
    </div>

    <div class="br2-content">
      <div class="br2-content__row">
        <span class="br2-content__label">藏品编号：</span>
        <span class="br2-content__hash">#</span>
      </div>
    </div>

    <div class="br2-footer">
      <div class="br2-btn br2-btn--plain" @click="goMyCollection">
        <span class="br2-btn__text">我的藏品</span>
      </div>
      <div class="br2-btn" @click="goContinue">
        <span class="br2-btn__text">继续购买</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/blindBox/index')
}

/** 我的藏品 → 原站 pages/myCollection/myCollection */
function goMyCollection() {
  router.push('/pages/myCollection/myCollection')
}

/** 继续购买 → 原站回到商城/盲盒列表 */
function goContinue() {
  router.push('/pages/blindBox/index')
}
</script>

<style scoped>
.br2-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.br2-nav {
  position: relative;
  height: 44px;
  background: #fafafa;
}
.br2-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.br2-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/m3/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.br2-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #333;
}
.br2-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #333;
}
/* 原站 .content：padding 104rpx 32rpx 228rpx → 54.08px 16.64px 118.56px */
.br2-content {
  position: relative;
  width: 100%;
  padding: 54.08px 16.64px 118.56px;
  display: flex;
  justify-content: center;
}
/* 原站块宽 66px 居中（(390-66)/2=162），「#」在块内偏移 60px */
.br2-content__row {
  position: relative;
  width: 66px;
  height: 18px;
  margin-top: 4.16px;
}
.br2-content__label {
  display: block;
  width: 66px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: #999;
}
.br2-content__hash {
  position: absolute;
  left: 60px;
  top: 3px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  color: #999;
}
.br2-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 88px;
  background: #fff;
  border-top: 1px solid #e7e7ea;
}
/* 原站 btnStyle：width 320rpx(=166.4px)，height 92rpx(=47.84px)，br 50rpx(=26px)
   按钮在原站 u-btn 组件内含额外内边距，实测落点 x=21 / x=197，此处按实测绝对定位 */
.br2-btn {
  position: absolute;
  top: 20.5px;
  width: 166px;
  height: 47px;
  line-height: 47px;
  border-radius: 26px;
  text-align: center;
  cursor: pointer;
}
.br2-btn--plain {
  left: 21px;
  background: #f0f0f2;
}
.br2-btn:not(.br2-btn--plain) {
  left: 197px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
}
.br2-btn__text {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #000;
}
.br2-btn:not(.br2-btn--plain) .br2-btn__text {
  color: #2f2414;
}
</style>
