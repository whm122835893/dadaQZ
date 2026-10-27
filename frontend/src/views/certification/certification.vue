<template>
  <!--
    原站 pages/certification/certification（金标准实测 2026-10-25 登录后抓取，390x844，浅色 #f7f7f8）
    结构：container page-container（背景 verified-bg.webp，background-size:100% 397px，顶部居中不重复）
      → nav 44px 透明底：返回（白圆钮 34x34 @(13,5) 内含 cw/back_btn.webp 7.3x13 @(26.3,15.5)）
                     标题「实名认证」17px fw700 #000 @(161,10.5,68,23)
      → certification-card：
          card-title「当前已完成实名认证」29px fw700 #847765 @(64.5,67,261,39)
          card-subtitle（半透明白底 rgba(255,255,255,0.4) br7px @(36.5,114,317,37)）
            文本 10px #c3b49e @(60,125.5,270,14)
          verified-icon.webp 353x353 @(18.5,178)
    数据：GET /user/getUserInfo → real_name_authentication=1 已实名
  -->
  <div class="cf-page">
    <div class="cf-container">
      <div class="cf-nav">
        <div class="cf-nav__back" @click="goBack">
          <div class="cf-nav__back-img"></div>
        </div>
        <span class="cf-nav__title"><span>实名认证</span></span>
      </div>

      <div class="cf-card">
        <div class="cf-card__title">当前已完成实名认证</div>
        <div class="cf-card__subtitle">
          <span>实名认证仅用于判断是否为真人用户，平台保障不会泄露信息</span>
        </div>
        <img class="cf-card__icon" src="/assets/img/p0/tangpai/verified-icon.webp" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}
</script>

<style scoped>
.cf-page {
  position: relative;
  min-height: 100vh;
  background: #f7f7f8;
}
.cf-container {
  position: relative;
  min-height: 100vh;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('/assets/img/p0/tangpai/verified-bg.webp');
  background-size: 100% 397px;
  background-repeat: no-repeat;
  background-position: center top;
}
.cf-nav {
  position: static;
  width: 100%;
  height: 44px;
}
.cf-nav__back {
  position: absolute;
  left: 13px;
  top: 5px;
  width: 34px;
  height: 34px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cf-nav__back-img {
  width: 7.3px;
  height: 13px;
  background: url('/assets/img/p0/cw/back_btn.webp') no-repeat;
  background-size: 100% 100%;
}
.cf-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 10.5px;
  height: 23px;
  line-height: 23px;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: #000;
}
.cf-nav__title > span {
  display: inline-block;
  font-size: 17px;
  line-height: 23px;
  font-weight: 700;
  color: #000;
}
.cf-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cf-card__title {
  margin-top: 23px;
  font-size: 29px;
  line-height: 39px;
  font-weight: 700;
  color: #847765;
  text-align: center;
}
.cf-card__subtitle {
  margin-top: 8px;
  width: 317px;
  height: 37px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cf-card__subtitle > span {
  font-size: 10px;
  line-height: 14px;
  font-weight: 400;
  color: #c3b49e;
}
.cf-card__icon {
  margin-top: 27px;
  width: 353px;
  height: 353px;
  display: block;
}
</style>
