<template>
  <!--
    原站 pages/compound/result（合成结果）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：navbar 390x44 bg rgb(250,250,250)
            返回 back-btn.png 24x24 @(13,10)
            标题「合成结果」15px bold rgb(51,51,51) @(165,16,60,16)
      → 礼盒图 210x162 @(90,64) /static/compose/result-box.webp
      → 「恭喜您合成成功」18px bold rgb(3,139,255) @(135.5,296,119,23)
      → 提示卡 358x128 @(16,350) bg #fff br15px bd 1px rgb(231,231,234)
            「您可在 我的藏品 中查看」13px bold rgb(85,85,85) @(126.8,382,136.5,19)
            分割装饰 324x15 @(33,419)
      → 底部条 390x69 @(0,775) bg #fff br20px bd 1px rgb(231,231,234)
            「水晶商城」166x47 @(21,786) bg rgb(240,240,242) 14px bold rgb(0,0,0) br26px
            「再合一次」166x47 @(203,786) bg rgb(33,28,20) 14px bold rgb(244,220,170) br26px
    端点：POST /synthesis/recordInfo → { code:0, msg:"记录不存在", data:null }
         原站在记录不存在时仍展示上述成功态骨架（不渲染记录详情）
  -->
  <div class="crs-page">
    <div class="crs-nav">
      <div class="crs-nav__back" @click="goBack"></div>
      <span class="crs-nav__title">合成结果</span>
    </div>

    <div class="crs-box"></div>
    <div class="crs-success">恭喜您合成成功</div>

    <div class="crs-card">
      <div class="crs-card__text">您可在 <b>我的藏品</b> 中查看</div>
      <div class="crs-card__divider"></div>
    </div>

    <div class="crs-footer">
      <div class="crs-btn crs-btn--ghost" @click="goShop">水晶商城</div>
      <div class="crs-btn crs-btn--dark" @click="goAgain">再合一次</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSynthesisRecordInfo } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/compound/compound')
}
function goShop() {
  router.replace('/pages/shop/shop')
}
function goAgain() {
  router.replace('/pages/compound/compound')
}

onMounted(async () => {
  try {
    await getSynthesisRecordInfo({})
  } catch (e) {
    // 原站「记录不存在」时仍展示成功态骨架，不改动 UI
  }
})
</script>

<style scoped>
.crs-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.crs-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.crs-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat center / 24px 24px;
}
.crs-nav__title {
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
/* 礼盒图 210x162 @(90,64) */
.crs-box {
  position: absolute;
  left: 90px;
  top: 64px;
  width: 210px;
  height: 162px;
  background: url('/static/compose/result-box.webp') no-repeat 0 0 / 100% 100%;
}
/* 「恭喜您合成成功」18px rgb(3,139,255) @(135.5,296,119,23)
   原站使用书法体 YouSheBiaoTiHei，fw=400，单行不换行 */
.crs-success {
  position: absolute;
  left: 135.5px;
  top: 296px;
  width: 119px;
  height: 23px;
  font-family: YouSheBiaoTiHei, serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 23px;
  color: rgb(3, 139, 255);
  text-align: center;
  white-space: nowrap;
}
/* 提示卡 358x128 @(16,350) */
.crs-card {
  position: absolute;
  left: 16px;
  top: 350px;
  width: 358px;
  height: 128px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid rgb(231, 231, 234);
  border-radius: 15px;
}
/* 提示卡文字 原站 (126.8,382,136.5,19)，卡片有 1px 边框故减 1 */
.crs-card__text {
  position: absolute;
  left: 109.8px;
  top: 31px;
  width: 136.5px;
  height: 19px;
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  color: rgb(85, 85, 85);
  text-align: left;
  white-space: nowrap;
}
.crs-card__text b {
  font-weight: 700;
}
/* 分割装饰 324x15 @(33,419) */
.crs-card__divider {
  position: absolute;
  left: 16px;
  top: 68px;
  width: 324px;
  height: 15px;
  background: url('/assets/img/m5/compound_result_0.webp') no-repeat 0 0 / 100% 100%;
}
/* 底部条 390x69 @(0,775) bg #fff br20px bd 1px rgb(231,231,234) */
.crs-footer {
  position: absolute;
  left: 0;
  top: 775px;
  width: 390px;
  height: 69px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid rgb(231, 231, 234);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 20px;
}
.crs-btn {
  width: 166px;
  height: 47px;
  border-radius: 26px;
  font-size: 14px;
  font-weight: 700;
  line-height: 47px;
  text-align: center;
}
.crs-btn--ghost {
  background: rgb(240, 240, 242);
  color: rgb(0, 0, 0);
}
.crs-btn--dark {
  background: rgb(33, 28, 20);
  color: rgb(244, 220, 170);
}
</style>
