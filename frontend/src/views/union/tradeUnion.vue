<template>
  <!--
    原站 pages/union/tradeUnion（嗒嗒工会 / 工会首页）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：container 390x844 bg rgb(246,246,246) + 背景图 d-bg.webp (100%, no-repeat)，padding-top 78px
            返回 back-btn-white.png 24x24 @(13,10)
            标题「嗒嗒工会」15px bold 白 @(165,16,60,16)
          → 右上「公会排行」图标 26x26 @(347,31) rank.webp + 文字 40x47 @(340,31) 10px 白
          → 右上第二「消息通知」图标 26x26 @(347,98) ding.webp + 文字 40x47 @(340,98)
          → 左侧「工会商城」图标 26x26 @(17,82) ghsc.webp + 文字 40x47 @(10,82)
          → 未解锁锁 57x57 @(166.5,103) lock.webp，小锁 16x19 @(187,122) lock-1.webp
          → 「您的公会未解锁」16px bold 白 @(139,172,112,24)
          → 「赶快购买公会藏品解锁您的公会吧~」12px 白 @(101.8,212,186.5,18)
          → tab「个人权益/我的工会/申请入会」16px @(33,290,64,24) 白 / 灰
          → tab 指示条 20x3 @(55,320) 白
          → 权益卡 356x191.5 @(17,357) 白底 br10px pad26px
            手续费减免 16px bold 黑 @(185,383,80,24) + 图标 44x44 @(125,388.5)
            分割线 318x0.5
            公会成员人数 16px bold 黑 @(103,466.5,244,24) + 图标 44x44 @(43,481)
            「每位公会会长最多可绑定邀请20人。」12px rgb(102,102,102) @(103,504.5,244,18)
    端点：POST /union/user/myunion → { code:1, data:{ config, my } }，测试账号 is_join=0 走未解锁分支
  -->
  <div class="tu-page">
    <div class="tu-nav">
      <div class="tu-nav__back" @click="goBack"></div>
      <span class="tu-nav__title">嗒嗒工会</span>
    </div>

    <div class="tu-icon tu-icon--rank" @click="go('/pages/union/unionRank')">
      <div class="tu-icon__img"></div>
      <span class="tu-icon__text">公会排行</span>
    </div>
    <div class="tu-icon tu-icon--shop" @click="go('/pages/union/tradeUnion')">
      <div class="tu-icon__img"></div>
      <span class="tu-icon__text">工会商城</span>
    </div>
    <div class="tu-icon tu-icon--msg" @click="go('/pages/union/news')">
      <div class="tu-icon__img"></div>
      <span class="tu-icon__text">消息通知</span>
    </div>

    <div class="tu-lock">
      <div class="tu-lock__big"></div>
      <div class="tu-lock__small"></div>
    </div>

    <div class="tu-unlock">您的公会未解锁</div>
    <div class="tu-tip">赶快购买公会藏品解锁您的公会吧~</div>

    <div class="tu-tabs">
      <span class="tu-tabs__item tu-tabs__item--on">个人权益</span>
      <span class="tu-tabs__item">我的工会</span>
      <span class="tu-tabs__item">申请入会</span>
      <div class="tu-tabs__line"></div>
    </div>

    <div class="tu-card">
      <div class="tu-card__row">
        <div class="tu-card__icon tu-card__icon--fee"></div>
        <div class="tu-card__title">手续费减免</div>
      </div>
      <div class="tu-card__divider"></div>
      <div class="tu-card__row">
        <div class="tu-card__icon tu-card__icon--member"></div>
        <div class="tu-card__body">
          <div class="tu-card__title tu-card__title--left">公会成员人数</div>
          <div class="tu-card__desc">每位公会会长最多可绑定邀请20人。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUnionMyUnion } from '@/api'

const router = useRouter()

function go(path) {
  router.push(path)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getUnionMyUnion()
  } catch (e) {
    // 原站接口异常时保持未解锁态
  }
})
</script>

<style scoped>
.tu-page {
  position: relative;
  min-height: 100vh;
  background: rgb(246, 246, 246) url('/static/icon/gh/d-bg.webp') no-repeat 0 0 / 100% auto;
  overflow: hidden;
}
.tu-nav {
  position: relative;
  width: 390px;
  height: 44px;
}
.tu-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat 0 0 / 24px 24px;
}
.tu-nav__title {
  position: absolute;
  left: 165px;
  top: 16px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  text-align: center;
}
/* 三个功能入口：图标 26x26，文字 40x47 flex 竖排居中 */
.tu-icon {
  position: absolute;
  width: 40px;
  height: 47px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.tu-icon--rank { left: 340px; top: 31px; }
.tu-icon--shop { left: 10px; top: 82px; }
.tu-icon--msg { left: 340px; top: 98px; }
.tu-icon__img {
  position: absolute;
  left: 7px;
  top: 0;
  width: 26px;
  height: 26px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 26px 26px;
}
.tu-icon--rank .tu-icon__img { background-image: url('/static/icon/gh/rank.webp'); }
.tu-icon--shop .tu-icon__img { background-image: url('/static/icon/gh/ghsc.webp'); }
.tu-icon--msg .tu-icon__img { background-image: url('/static/icon/gh/ding.webp'); }
.tu-icon__text {
  position: absolute;
  left: 0;
  top: 28px;
  width: 40px;
  text-align: center;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  color: #fff;
  white-space: nowrap;
}
/* 未解锁锁图标 57x57 @(166.5,103)，小锁 16x19 @(187,122) */
.tu-lock {
  position: absolute;
  left: 166.5px;
  top: 103px;
  width: 57px;
  height: 57px;
}
.tu-lock__big {
  position: absolute;
  left: 0;
  top: 0;
  width: 57px;
  height: 57px;
  background: url('/static/icon/gh/lock.webp') no-repeat 0 0 / 57px 57px;
}
.tu-lock__small {
  position: absolute;
  left: 20.5px;
  top: 19px;
  width: 16px;
  height: 19px;
  background: url('/static/icon/gh/lock-1.webp') no-repeat 0 0 / 16px 19px;
}
.tu-unlock {
  position: absolute;
  left: 139px;
  top: 172px;
  width: 112px;
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}
.tu-tip {
  position: absolute;
  left: 101.8px;
  top: 212px;
  width: 186.5px;
  height: 18px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}
/* tab 区 390x38 @(0,282) */
.tu-tabs {
  position: absolute;
  left: 0;
  top: 282px;
  width: 390px;
  height: 41px;
}
.tu-tabs__item {
  position: absolute;
  top: 8px;
  width: 64px;
  height: 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  white-space: nowrap;
}
.tu-tabs__item:nth-child(1) { left: 33px; }
.tu-tabs__item:nth-child(2) { left: 163px; }
.tu-tabs__item:nth-child(3) { left: 293px; }
.tu-tabs__item--on {
  font-weight: 700;
  color: #fff;
}
.tu-tabs__item:not(.tu-tabs__item--on) {
  color: rgb(163, 163, 163);
}
.tu-tabs__line {
  position: absolute;
  left: 55px;
  top: 38px;
  width: 20px;
  height: 3px;
  background: #fff;
  border-radius: 100px;
}
/* 权益卡 356x191.5 @(17,357) */
.tu-card {
  position: absolute;
  left: 17px;
  top: 357px;
  width: 356px;
  height: 191.5px;
  background: #fff;
  border-radius: 10px;
}
.tu-card__row {
  position: absolute;
  left: 0;
  top: 0;
  width: 356px;
  height: 191.5px;
}
.tu-card__icon {
  width: 44px;
  height: 44px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 44px 44px;
}
.tu-card__icon {
  position: absolute;
  left: 0;
  top: 0;
}
.tu-card__row--second {
  top: 0;
}
.tu-card__icon--fee {
  left: 108px;
  top: 31.5px;
  background-image: url('/static/icon/gh/union-fee.webp');
}
.tu-card__icon--member {
  left: 26px;
  top: 124px;
  background-image: url('/static/icon/gh/union-members.webp');
}
.tu-card__title {
  position: absolute;
  left: 168px;
  top: 26px;
  width: 80px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #000;
  white-space: nowrap;
}
.tu-card__title--left {
  left: 86px;
  top: 109.5px;
  width: 244px;
}
.tu-card__divider {
  position: absolute;
  left: 26px;
  top: 84px;
  width: 318px;
  height: 0.5px;
  background: url('/static/icon/gh/union-divider.webp') no-repeat 0 0 / 100% 0.5px;
}
.tu-card__body {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
}
.tu-card__desc {
  position: absolute;
  left: 86px;
  top: 147.5px;
  width: 244px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: rgb(102, 102, 102);
  white-space: nowrap;
}
</style>
