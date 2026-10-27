<template>
  <!--
    原站 pages/blindBox/result（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg（pageBg #f7f7f8）
      → w-navbar 44px（transparent）：
          返回 back-btn.png 24x24 @(13,10)、标题「盲盒结果」15px bold #333 @(165,15.5,60,16)
      → .content（width 690rpx=358.8px，padding 26rpx 26rpx 200rpx，bg #fff，br 18rpx=9.36px）
          .hint 10px #7a7a7a @(29,57,332,15)「商品陆续从链上转入个人中心，如有延迟请耐心等待」
      → .footer（fixed 底，bg #fff，ptb-10 + plr-20）
          按钮行 flex space-between：
            「我的藏品」166x47 @(21,776.5) bg #f0f0f2 br26px，文字 14px bold #000
            「继续开启」166x47 @(187,776.5) 金渐变 br26px，文字 14px bold #2f2414
    数据：原站本页从开盒结果路由参数取值（storage/上一页传递），无独立列表接口
  -->
  <div class="br-page">
    <div class="br-nav">
      <div class="br-nav__back" @click="goBack">
        <div class="br-nav__back-img"></div>
      </div>
      <span class="br-nav__title"><span>盲盒结果</span></span>
    </div>

    <div class="br-content">
      <div class="br-content__hint">商品陆续从链上转入个人中心，如有延迟请耐心等待</div>
    </div>

    <div class="br-footer">
      <div class="br-footer__row">
        <div class="br-btn br-btn--plain" @click="goMyCollection">
          <span class="br-btn__text">我的藏品</span>
        </div>
        <div class="br-btn" @click="goContinue">
          <span class="br-btn__text">继续开启</span>
        </div>
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

/** 继续开启 → 原站回到盲盒列表 */
function goContinue() {
  router.push('/pages/blindBox/index')
}
</script>

<style scoped>
.br-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.br-nav {
  position: relative;
  height: 44px;
}
.br-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.br-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/m3/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.br-nav__title {
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
.br-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #333;
}
/* 原站 .content：width 690rpx(=358.8px)，padding 26rpx 26rpx 200rpx，bg #fff，br 18rpx */
.br-content {
  width: 358.8px;
  margin: 0 auto;
  padding: 13.5px 13.5px 104px;
  background: #fff;
  border-radius: 9.36px;
}
.br-content__hint {
  font-size: 10px;
  line-height: 15px;
  font-weight: 400;
  color: #7a7a7a;
}
.br-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 88px;
  background: #fff;
  border-top: 1px solid #e7e7ea;
}
/* 原站 btnStyle：width 320rpx(=166.4px)，height 92rpx(=47.84px)，br 50rpx(=26px)
   按钮在原站 u-btn 组件内含额外内边距，实测落点 x=21 / x=187，此处按实测绝对定位 */
.br-btn {
  position: absolute;
  top: 20.5px;
  width: 166px;
  height: 47px;
  line-height: 47px;
  border-radius: 26px;
  text-align: center;
  cursor: pointer;
}
.br-btn--plain {
  left: 21px;
  background: #f0f0f2;
}
.br-btn:not(.br-btn--plain) {
  left: 187px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
}
.br-btn__text {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #000;
}
.br-btn:not(.br-btn--plain) .br-btn__text {
  color: #2f2414;
}
</style>
