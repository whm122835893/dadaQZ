<template>
  <!--
    原站 pages/activity/draw（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：pageBg rgb(17,17,17)
      → navbar 44px（透明于深底）
          返回 iconfont e60e 20x20 @(13,12) #fff
          标题「抽签活动」16px #fff @(163,15,64,17)
      → 主卡 360x98 @(15,62) bg rgb(29,29,32) br15px bd 1px solid rgb(68,68,68)
          logo top_logo1.webp 62x18 @(31,78)
          「限定发售抽签」17px bold #fff @(31,100,328,25)
          「公平参与 · 结果可查」10px rgb(170,170,170) @(31,129,328,15)
      → 「抽签发售时间线」17px bold #fff @(16,176,374,25)
      → 4 个时间线格 176.4x46 @(15,216)/(198.6,216)/(15,277)/(198.6,277)
          bg rgb(32,32,36) br13px bd 1px solid rgb(72,72,77)
          圆形序号 24x24 @(28,227)/(211.6,227)/(28,288)/(211.6,288) bg #fff br50%
          标题 11px bold #fff @(67,227,66,16)
      → 抽签码区 357x123 @(15,353) bg rgb(28,28,32) br10px
          「我的抽签码」16px bold #fff @(30,368,327,24)
          tab 135x28 @(45,402) bg #fff / @(210,402) bg rgb(48,48,53) br11px
          「暂无抽签码」11px rgb(170,170,170) @(15,445,357,31)
      → 邀请区 360x123 @(15,531) bg rgb(28,28,32) br15px bd 1px solid rgb(68,68,68)
          「我的邀请」17px bold #fff @(15,491,68,25)
          「已成功邀请 0 人」10px rgb(170,170,170) @(305,496,70,15)
          「保存二维码」132x36 @(44,602) bd 1px solid #fff br20px
          「复制邀请链接」130x31 @(216,604.5) bg #fff br20px
      → 规则卡 360x71 @(15,669) bg rgb(28,28,32) br15px bd 1px solid rgb(68,68,68)
      → 底部占位 390x20 @(0,824) bg rgb(17,17,17)
    数据：POST /draw/get {id} → 实调 { code:0, msg:"活动不存在" }，
         页面据此弹出 uni-simple-toast「活动不存在」105x39 @(142.5,402.5)
  -->
  <div class="ad-page">
    <div class="ad-nav">
      <i class="ad-nav__back" @click="goBack"></i>
      <span class="ad-nav__title">抽签活动</span>
    </div>

    <!-- 主卡 -->
    <div class="ad-card">
      <div class="ad-card__logo"></div>
      <div class="ad-card__title">{{ card_title }}</div>
      <div class="ad-card__desc">{{ card_desc }}</div>
    </div>

    <!-- 时间线 -->
    <div class="ad-timeline-title">抽签发售时间线</div>
    <div class="ad-timeline">
      <div v-for="(t, i) in timeline" :key="t.key" class="ad-tl-item" :class="`ad-tl-item--c${i % 2}`">
        <span class="ad-tl-item__key">{{ t.key }}</span>
        <span class="ad-tl-item__title">{{ t.title }}</span>
      </div>
    </div>

    <!-- 我的抽签码 -->
    <div class="ad-code">
      <div class="ad-code__title">我的抽签码</div>
      <div class="ad-code__tabs">
        <span class="ad-code__tab ad-code__tab--on">抽签码</span>
        <span class="ad-code__tab">中签码</span>
      </div>
      <div class="ad-code__empty">暂无抽签码</div>
    </div>

    <!-- 我的邀请 -->
    <div class="ad-invite-title">我的邀请</div>
    <div class="ad-invite-title__num">已成功邀请 {{ invite_count }} 人</div>
    <div class="ad-invite">
      <div class="ad-invite__line1">每成功邀请 {{ invite_per_code }} 位新用户</div>
      <div class="ad-invite__line2">完成邀请任务1次，可获得抽签码 ×1</div>
      <div class="ad-invite__save" @click="onSave">保存二维码</div>
      <div class="ad-invite__copy" @click="onCopy">复制邀请链接</div>
    </div>

    <!-- 规则卡 -->
    <div class="ad-rule">
      <div class="ad-rule__title">{{ rule_title }}</div>
    </div>

    <div class="ad-bottom"></div>

    <!-- toast：活动不存在（uni-simple-toast） -->
    <div v-if="showToast" class="ad-toast">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDrawActivity } from '@/api'

const router = useRouter()
const route = useRoute()

const card_title = ref('限定发售抽签')
const card_desc = ref('公平参与 · 结果可查')
const timeline = ref([])
const invite_count = ref(0)
const invite_per_code = ref(0)
const rule_title = ref('抽签码获取规则')
const showToast = ref(false)
const toastMsg = ref('活动不存在')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}
function onSave() {
  /* 原站保存二维码到相册 */
}
function onCopy() {
  /* 原站复制邀请链接 */
}

onMounted(async () => {
  try {
    const res = await getDrawActivity({ id: route.query.id || 1 })
    const d = res.data || {}
    if (d.card_title) card_title.value = d.card_title
    if (d.card_desc) card_desc.value = d.card_desc
    if (Array.isArray(d.timeline) && d.timeline.length) timeline.value = d.timeline
    if (d.invite_count !== undefined) invite_count.value = d.invite_count
    if (d.invite_per_code !== undefined) invite_per_code.value = d.invite_per_code
    if (d.rule_title) rule_title.value = d.rule_title
    if (d.exists === false) {
      showToast.value = true
      setTimeout(() => { showToast.value = false }, 3000)
    }
  } catch (e) {
    /* mock 兜底保持默认 */
  }
})
</script>

<style scoped>
.ad-page {
  position: relative;
  min-height: 100vh;
  background: rgb(17, 17, 17);
  overflow: hidden;
}
.ad-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.ad-nav__back {
  position: absolute;
  left: 13px;
  top: 12px;
  width: 20px;
  height: 20px;
  font-family: 'uview-icon';
  font-size: 20px;
  line-height: 20px;
  color: #fff;
}
.ad-nav__back::before {
  content: '\e60e';
}
.ad-nav__title {
  position: absolute;
  left: 163px;
  top: 15px;
  width: 64px;
  height: 17px;
  font-size: 16px;
  line-height: 17px;
  color: #fff;
  text-align: center;
}
/* 主卡 360x98 @(15,62) */
.ad-card {
  position: relative;
  width: 360px;
  height: 98px;
  margin: 18px 0 0 15px;
  box-sizing: border-box;
  border: 1px solid rgb(68, 68, 68);
  border-radius: 15px;
  background: rgb(29, 29, 32);
}
.ad-card__logo {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 62px;
  height: 18px;
  background: url('/assets/img/draw/top_logo1.webp') no-repeat center / 62px 18px;
}
.ad-card__title {
  position: absolute;
  left: 16px;
  top: 38px;
  width: 328px;
  height: 25px;
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  color: #fff;
}
.ad-card__desc {
  position: absolute;
  left: 16px;
  top: 67px;
  width: 328px;
  height: 15px;
  font-size: 10px;
  line-height: 15px;
  color: rgb(170, 170, 170);
}
/* 时间线标题 */
.ad-timeline-title {
  width: 374px;
  margin: 16px 0 0 16px;
  height: 25px;
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  color: #fff;
}
/* 时间线 4 格 */
.ad-timeline {
  position: relative;
  width: 390px;
  height: 107px;
  margin-top: 15px;
}
.ad-tl-item {
  position: absolute;
  width: 176.4px;
  height: 46px;
  box-sizing: border-box;
  border: 1px solid rgb(72, 72, 77);
  border-radius: 13px;
  background: rgb(32, 32, 36);
}
.ad-tl-item--c0 { left: 15px; top: 0; }
.ad-tl-item--c1 { left: 198.6px; top: 0; }
.ad-tl-item:nth-child(3) { left: 15px; top: 61px; }
.ad-tl-item:nth-child(4) { left: 198.6px; top: 61px; }
.ad-tl-item__key {
  position: absolute;
  left: 13px;
  top: 11px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  font-size: 9px;
  font-weight: 700;
  line-height: 24px;
  color: rgb(17, 17, 17);
  text-align: center;
}
.ad-tl-item__title {
  position: absolute;
  left: 52px;
  top: 11px;
  width: 66px;
  height: 16px;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  white-space: nowrap;
}
/* 抽签码区 357x123 @(15,353) */
.ad-code {
  position: relative;
  width: 357px;
  height: 123px;
  margin: 30px 0 0 15px;
  border-radius: 10px;
  background: rgb(28, 28, 32);
}
.ad-code__title {
  position: absolute;
  left: 15px;
  top: 15px;
  width: 327px;
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #fff;
}
.ad-code__tabs {
  position: absolute;
  left: 15px;
  top: 49px;
  width: 330px;
  height: 28px;
}
.ad-code__tab {
  position: absolute;
  top: 0;
  width: 135px;
  height: 28px;
  border-radius: 11px;
  font-size: 10px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
}
.ad-code__tab:nth-child(1) {
  left: 15px;
  background: #fff;
  color: rgb(17, 17, 17);
}
.ad-code__tab:nth-child(2) {
  left: 180px;
  background: rgb(48, 48, 53);
  color: #fff;
}
.ad-code__empty {
  position: absolute;
  left: 0;
  top: 92px;
  width: 357px;
  height: 31px;
  font-size: 11px;
  line-height: 31px;
  color: rgb(170, 170, 170);
  text-align: center;
}
/* 我的邀请标题 */
.ad-invite-title {
  position: absolute;
  left: 15px;
  top: 491px;
  width: 68px;
  height: 25px;
  font-size: 17px;
  font-weight: 700;
  line-height: 25px;
  color: #fff;
}
.ad-invite-title__num {
  position: absolute;
  left: 305px;
  top: 496px;
  width: 70px;
  height: 15px;
  font-size: 10px;
  line-height: 15px;
  color: rgb(170, 170, 170);
  text-align: right;
}
/* 邀请卡 360x123 @(15,531) */
.ad-invite {
  position: absolute;
  left: 15px;
  top: 531px;
  width: 360px;
  height: 123px;
  box-sizing: border-box;
  border: 1px solid rgb(68, 68, 68);
  border-radius: 15px;
  background: rgb(28, 28, 32);
}
.ad-invite__line1 {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 328px;
  height: 19px;
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  color: #fff;
}
.ad-invite__line2 {
  position: absolute;
  left: 16px;
  top: 40px;
  width: 328px;
  height: 16px;
  font-size: 11px;
  line-height: 16px;
  color: rgb(187, 187, 187);
}
.ad-invite__save {
  position: absolute;
  left: 29px;
  top: 71px;
  width: 132px;
  height: 36px;
  box-sizing: border-box;
  border: 1px solid #fff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  line-height: 34px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.ad-invite__copy {
  position: absolute;
  left: 201px;
  top: 73.5px;
  width: 130px;
  height: 31px;
  border-radius: 20px;
  background: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 31px;
  color: rgb(0, 0, 0);
  text-align: center;
  cursor: pointer;
}
/* 规则卡 360x71 @(15,669) */
.ad-rule {
  position: absolute;
  left: 15px;
  top: 669px;
  width: 360px;
  height: 71px;
  box-sizing: border-box;
  border: 1px solid rgb(68, 68, 68);
  border-radius: 15px;
  background: rgb(28, 28, 32);
}
.ad-rule__title {
  position: absolute;
  left: 16px;
  top: 16px;
  width: 328px;
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #fff;
}
.ad-bottom {
  position: absolute;
  left: 0;
  top: 824px;
  width: 390px;
  height: 20px;
  background: rgb(17, 17, 17);
}
/* toast：uni-simple-toast */
.ad-toast {
  position: absolute;
  left: 142.5px;
  top: 402.5px;
  width: 105px;
  height: 39px;
  box-sizing: border-box;
  border-radius: 5px;
  background: rgba(17, 17, 17, 0.7);
  font-size: 13px;
  line-height: 39px;
  color: #fff;
  text-align: center;
  z-index: 20;
}
</style>
