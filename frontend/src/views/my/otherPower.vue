<template>
  <!--
    原站 pages/my/other-power（设置页，金标准实测 2026-10-25，390x844，黑金 #101115）
    结构：nav(透明, back-white 24x24@(13,10), 标题16px bold #fff)
      → 账户信息 15px fw500 Alibaba-PuHuiTi-Medium @(16,64)
        卡1 (16,95,358,66) bg#030303 br14：头像圈 47x47 bg#f5f5f5 + 箭头 e605
      → 账户安全 @(16,192)
        卡2 (16,223,358,198) br14：登录密码/操作密码/实名认证 三行 h66（行间 ::after 发丝线）
      → 通用 @(16,452)
        卡3 (16,483,358,132) br14：版本更新/注销账户 两行 h66
    箭头：uview-icon \ue605 20px #a89e8a @x338
    跳转：登录密码→forgetPwd(推断)、操作密码→actionPwd/getCode、实名认证→certification(推断)、
          版本更新→toast、注销账户→/pages/my/cancellation、账户信息→/pages/my/info
  -->
  <div class="op-page">
    <div class="op-nav">
      <img class="op-nav__back" src="/assets/img/my/back-btn-white.png" alt="" @click="goBack" />
      <span class="op-nav__title">设置</span>
    </div>

    <div class="op-section op-section--first">账户信息</div>
    <div class="op-card op-card--row" @click="to('/pages/my/info')">
      <div class="op-avatar" />
      <span class="uview-icon op-arrow">&#xe605;</span>
    </div>

    <div class="op-section op-section--gap">账户安全</div>
    <div class="op-card">
      <div class="op-row" @click="to('/pages/login/forgetPwd')">
        <span class="op-row__text">登录密码</span>
        <span class="uview-icon op-arrow">&#xe605;</span>
      </div>
      <div class="op-row" @click="to('/pages/my/actionPwd/getCode')">
        <span class="op-row__text">操作密码</span>
        <span class="uview-icon op-arrow">&#xe605;</span>
      </div>
      <div class="op-row" @click="to('/pages/certification/certification')">
        <span class="op-row__text">实名认证</span>
        <span class="uview-icon op-arrow">&#xe605;</span>
      </div>
    </div>

    <div class="op-section op-section--gap">通用</div>
    <div class="op-card">
      <div class="op-row" @click="checkUpdate">
        <span class="op-row__text">版本更新</span>
        <span class="uview-icon op-arrow">&#xe605;</span>
      </div>
      <div class="op-row" @click="to('/pages/my/cancellation')">
        <span class="op-row__text">注销账户</span>
        <span class="uview-icon op-arrow">&#xe605;</span>
      </div>
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

async function checkUpdate() {
  const res = await getConfig()
  const v = (res.data && res.data.app_version) || ''
  toast(v ? `当前已是最新版本 v${v}` : '当前已是最新版本')
}
</script>

<style scoped>
.op-page {
  min-height: 100vh;
  background: #101115;
}
.op-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  z-index: 10;
}
.op-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.op-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
.op-section {
  margin: 0 16px;
  height: 21px;
  font-family: 'Alibaba-PuHuiTi-Medium', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
}
.op-section--first {
  margin-top: 64px;
}
.op-section--gap {
  margin-top: 31px;
}
.op-card {
  margin: 10px 16px 0;
  background: #030303;
  border-radius: 14px;
}
.op-card--row {
  position: relative;
  height: 66px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.op-avatar {
  width: 47px;
  height: 47px;
  margin-left: 16px;
  border-radius: 50%;
  background: #f5f5f5;
}
.op-row {
  position: relative;
  height: 66px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.op-row + .op-row::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: rgba(74, 74, 74, 0.35);
}
.op-row__text {
  margin-left: 16px;
  font-size: 14px;
  line-height: 15px;
  color: #a59b88;
}
.op-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  margin-top: -10px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  line-height: 20px;
  color: #a89e8a;
}
</style>
