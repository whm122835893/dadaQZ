<template>
  <!--
    原站 pages/wallet/wallet（金标准实测 2026-10-25 登录后抓取，390x844，黑金 #101115）
    结构：nav(44, 透明底, 返回白圆钮 34x34@(13,5) br50% + back_btn.webp 7.3x13 居中,
              标题「我的钱包」17px fw500 #fff @(161,14.5,68,19))
      → wallet-item 易宝支付卡图 (18,62,354,156) yibao-bg1.webp 拉伸铺满
      → 底部固定条 (0,749,390,95) bg#101115 上边框 1px #655032
          进入钱包按钮 (23,765,344,52) bg#191919 br15
          文案 15px fw500 #fff Alibaba-PuHuiTi-Medium @(165,780.5,60,21)
    交互（原站实证 2026-10-25）：点击「进入钱包」→ POST /wallet/yibao/openAccount
      → 跳转 https://yvwallet.yeepay.com/wallet/index.html?t={ts}#/pages/fund/index?token={token}
      mock 返回同构 URL（MOCK 占位 token，跳转后由易宝侧提示无效，属外部系统预期行为）
  -->
  <div class="wt-page">
    <div class="wt-nav">
      <div class="wt-nav__back" @click="goBack">
        <img class="wt-nav__back-img" src="/assets/img/wallet/back_btn.webp" alt="" />
      </div>
      <span class="wt-nav__title"><span>我的钱包</span></span>
    </div>

    <div class="wt-content">
      <div class="wt-item"></div>
    </div>

    <div class="wt-bottom">
      <div class="wt-btn" @click="enterWallet">
        <span class="wt-btn__text">进入钱包</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { openYibaoAccount } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

/** 进入钱包：原站点击后调 openAccount 拿钱包 URL 再整页跳转（外部易宝钱包 H5） */
async function enterWallet() {
  try {
    const res = await openYibaoAccount()
    const url = res.data && res.data.url
    if (url) window.location.href = url
  } catch (e) {
    /* 原站失败时无额外提示（外部跳转由钱包侧兜底） */
  }
}
</script>

<style scoped>
.wt-page {
  min-height: 100vh;
  background: #101115;
}
.wt-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  background: transparent;
  z-index: 10;
}
.wt-nav__back {
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
.wt-nav__back-img {
  width: 7.3px;
  height: 13px;
}
.wt-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 14.5px;
  height: 19px;
  line-height: 19px;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #fff;
}
.wt-nav__title > span {
  font-size: 17px;
  line-height: 19px;
  font-weight: 500;
  color: #fff;
}
.wt-content {
  padding-top: 44px;
}
.wt-item {
  margin: 18px 18px 0;
  height: 156px;
  background: url('/assets/img/wallet/yibao-bg1.webp') no-repeat;
  background-size: 100% 100%;
}
.wt-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 95px;
  background: #101115;
  border-top: 1px solid #655032;
}
.wt-btn {
  margin: 16px 23px 0;
  height: 52px;
  background: #191919;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.wt-btn__text {
  font-family: Alibaba-PuHuiTi-Medium, 'Times New Roman', sans-serif;
  font-size: 15px;
  line-height: 21px;
  font-weight: 500;
  color: #fff;
}
</style>
