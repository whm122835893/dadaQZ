<template>
  <!--
    原站 pages/my/about（金标准实测 2026-10-25，390x844，浅色 #f7f7f8）
    结构：nav(44, bg#fafafa, back 28x28@(13,8), 标题15px bold #333)
      → 品牌卡 (15,59,360,141) linear-gradient(135deg,#0d0e12,#343740) br26
          行星图 68x68@(287,69) / WanYu logo 104x32@(35,87)
          嗒嗒 22px bold #fff @(35,137) / slogan 11px #c8cbd2 @(35,174)
      → 联系我们 17px bold #111216 @(20,220)
      → 白卡×2 (15,260,360,59)(15,329,360,59) bg#fff 边1px #e7e7ea br20
          图标31x31@x31 / 文本12px bold @(77) / 箭头5x8@x354
      → 服务信息 @(20,433) → 白卡 (15,473,360,59)
    跳转：官方客服→/pages/my/service、官方社群→/pages/my/join（推断）、版本更新→toast
  -->
  <div class="ab-page">
    <div class="ab-nav">
      <img class="ab-nav__back" src="/assets/img/my/back-btn.png" alt="" @click="goBack" />
      <span class="ab-nav__title">关于我们</span>
    </div>

    <div class="ab-brand">
      <img class="ab-brand__planet" src="/assets/img/my/about-planet.webp" alt="" />
      <img class="ab-brand__logo" src="/assets/img/my/about-logo.webp" alt="" />
      <div class="ab-brand__name">嗒嗒</div>
      <div class="ab-brand__slogan">探索数字艺术新宇宙。</div>
    </div>

    <div class="ab-section ab-section--first">联系我们</div>
    <div class="ab-cell" @click="to('/pages/my/service')">
      <img class="ab-cell__icon" src="/assets/img/my/m1.webp" alt="" />
      <span class="ab-cell__text">官方客服</span>
      <img class="ab-cell__arrow" src="/assets/img/my/right.webp" alt="" />
    </div>
    <div class="ab-cell ab-cell--mt10" @click="to('/pages/my/join')">
      <img class="ab-cell__icon" src="/assets/img/my/m2.webp" alt="" />
      <span class="ab-cell__text">官方社群</span>
      <img class="ab-cell__arrow" src="/assets/img/my/right.webp" alt="" />
    </div>

    <div class="ab-section ab-section--second">服务信息</div>
    <div class="ab-cell" @click="checkUpdate">
      <img class="ab-cell__icon" src="/assets/img/my/m4.webp" alt="" />
      <span class="ab-cell__text">版本更新</span>
      <img class="ab-cell__arrow" src="/assets/img/my/right.webp" alt="" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { toast } from '@/utils/toast'
import { getConfig } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}
function to(path) {
  router.push(path)
}

/** 版本更新：对齐原站 getConfig.app_version，H5 环境提示已是最新（推断交互） */
async function checkUpdate() {
  const res = await getConfig()
  const v = (res.data && res.data.app_version) || ''
  toast(v ? `当前已是最新版本 v${v}` : '当前已是最新版本')
}
</script>

<style scoped>
.ab-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.ab-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  background: #fafafa;
  z-index: 10;
}
.ab-nav__back {
  position: absolute;
  left: 13px;
  top: 8px;
  width: 28px;
  height: 28px;
}
.ab-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #333;
}
.ab-brand {
  position: relative;
  margin: 59px 15px 0;
  height: 141px;
  border-radius: 26px;
  background: linear-gradient(135deg, #0d0e12 0%, #343740 100%);
}
.ab-brand__planet {
  position: absolute;
  top: 10px;
  right: 20px;
  width: 68px;
  height: 68px;
}
.ab-brand__logo {
  position: absolute;
  top: 28px;
  left: 20px;
  width: 104px;
  height: 32px;
}
.ab-brand__name {
  position: absolute;
  top: 78px;
  left: 20px;
  width: 320px;
  height: 32px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
}
.ab-brand__slogan {
  position: absolute;
  top: 115px;
  left: 20px;
  width: 320px;
  height: 16px;
  font-size: 11px;
  color: #c8cbd2;
}
.ab-section {
  margin: 0 20px;
  height: 25px;
  font-size: 17px;
  font-weight: bold;
  color: #111216;
}
.ab-section--first {
  margin-top: 20px;
}
.ab-section--second {
  margin-top: 45px;
}
.ab-cell {
  position: relative;
  margin: 15px 15px 0;
  height: 59px;
  background: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.ab-cell--mt10 {
  margin-top: 10px;
}
.ab-cell__icon {
  width: 31px;
  height: 31px;
  margin-left: 15px;
}
.ab-cell__text {
  margin-left: 15px;
  font-size: 12px;
  line-height: 14px;
  font-weight: bold;
  color: #111216;
}
.ab-cell__arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  margin-top: -4px;
  width: 5px;
  height: 8px;
}
</style>
