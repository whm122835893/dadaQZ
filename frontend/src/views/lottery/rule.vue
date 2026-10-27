<template>
  <!--
    原站 pages/lottery/rule（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：pageBg rgb(247,247,248)
      → navbar 390x44 @(0,0) bg rgb(250,250,250)
          返回 back-btn.png 24x24 @(13,10)
          标题「活动规则」15px bold rgb(51,51,51) @(165,15.5,60,16)
      → 内容卡 358x675.2 @(16,59) bg #fff br12px bd 1px solid rgb(231,231,234)
          「规则详情」17px bold rgb(51,51,51) @(161,85,68,19)
    数据：内容取自 /index/getConfig 的 share_rule 字段
         （实调 "<p>1.111</p><p>2.222</p>"，原站该页仅渲染标题，卡内其余为空）
  -->
  <div class="lrul-page">
    <div class="lrul-nav">
      <div class="lrul-nav__back" @click="goBack"></div>
      <span class="lrul-nav__title">活动规则</span>
    </div>

    <div class="lrul-card">
      <div class="lrul-card__title">规则详情</div>
      <!--
        原站该页正文容器 #_root 实测 innerHTML 为空（share_rule 未渲染），
        故此处不渲染正文，仅保留标题与卡片四角淡粉装饰。
      -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLotteryRule } from '@/api'

const router = useRouter()
const ruleHtml = ref('')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/lottery/lottery')
}

onMounted(async () => {
  try {
    const res = await getLotteryRule()
    ruleHtml.value = (res.data && res.data.share_rule) || ''
  } catch (e) {
    ruleHtml.value = ''
  }
})
</script>

<style scoped>
.lrul-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.lrul-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.lrul-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat center / 24px 24px;
}
.lrul-nav__title {
  position: absolute;
  left: 165px;
  top: 15.5px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: rgb(51, 51, 51);
  text-align: center;
}
/* 内容卡 358x675.2 @(16,59) */
.lrul-card {
  position: absolute;
  left: 16px;
  top: 59px;
  width: 358px;
  height: 675.2px;
  box-sizing: border-box;
  border: 1px solid rgb(231, 231, 234);
  border-radius: 12px;
  background: #fff;
}
.lrul-card__title {
  position: absolute;
  left: 145px;
  top: 26px;
  width: 68px;
  height: 19px;
  font-size: 17px;
  font-weight: 700;
  line-height: 19px;
  color: rgb(51, 51, 51);
  text-align: center;
}
.lrul-card__body {
  position: absolute;
  left: 20px;
  top: 62px;
  width: 318px;
  font-size: 14px;
  line-height: 22px;
  color: rgb(102, 102, 102);
}
/* 卡片四角淡粉装饰（原站 .content 的 ::before / ::after 背景图） */
.lrul-card::before {
  content: '';
  position: absolute;
  left: 271px;
  top: 0;
  width: 85px;
  height: 45px;
  background: url('/static/cj/21.webp') no-repeat 0 0 / 100% 100%;
}
.lrul-card::after {
  content: '';
  position: absolute;
  left: 0;
  top: 628.188px;
  width: 85px;
  height: 45px;
  background: url('/static/cj/22.webp') no-repeat 0 0 / 100% 100%;
}
</style>
