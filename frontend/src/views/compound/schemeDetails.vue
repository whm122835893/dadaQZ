<template>
  <!--
    原站 pages/compound/schemeDetails（金标准实测 2026-10-25 登录后抓取，390x916，黑金 #101115）
    结构：container page-container page-bg（整页高 916.4）
      → nav 44px 透明：返回（back-btn-white.png 24x24 @(13,10)）、标题空、右侧「合成规则」14px bold #fff @(321,12,56,20)
      → mian-img 206x206 @(86.5,59) br15px（无数据时为空框）
      → materials-all 面板 390x506.4 @(0,306) bg #1d1a15 br20px 20px 0 0
          「兑换材料」title-value 15px bold #fff @(10,336,78,21)
      → 底部固定条 390x87 @(0,757) bg #111111
          「立即合成」358x47 @(16,777) 金渐变 br23px，文字 14px bold #2f2413
    数据：POST /synthesis/playInfo { play_id, grp, classify }
      实调（缺 query）：{ code:0, msg:"玩法不存在", data:null } → 原站渲染空面板
  -->
  <div class="cs-page">
    <div class="cs-nav">
      <div class="cs-nav__back" @click="goBack">
        <div class="cs-nav__back-img"></div>
      </div>
      <span class="cs-nav__title"><span></span></span>
      <span class="cs-nav__rule">合成规则</span>
    </div>

    <div class="cs-img"></div>

    <div class="cs-panel">
      <div class="cs-panel__title">兑换材料</div>
    </div>

    <div class="cs-bottom">
      <div class="cs-btn" @click="onCompound">
        <span class="cs-btn__text">立即合成</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSynthesisPlayInfo } from '@/api'
import { toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/activity/activity')
}

function onCompound() {
  toast('玩法不存在')
}

onMounted(async () => {
  try {
    await getSynthesisPlayInfo({
      play_id: route.query.play_id || '',
      grp: route.query.grp || '',
      classify: route.query.classify || ''
    })
  } catch (e) {
    /* 原站无数据时保持空面板 */
  }
})
</script>

<style scoped>
.cs-page {
  position: relative;
  min-height: 916px;
  background: #101115;
}
.cs-nav {
  position: relative;
  height: 44px;
}
.cs-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.cs-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn-white.png') no-repeat;
  background-size: 100% 100%;
}
.cs-nav__title {
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
.cs-nav__rule {
  position: absolute;
  right: 13px;
  top: 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}
.cs-img {
  position: absolute;
  left: 86.5px;
  top: 59px;
  width: 206px;
  height: 206px;
  border-radius: 15px;
  background: #1d1a15;
}
.cs-panel {
  position: absolute;
  left: 0;
  top: 306px;
  width: 390px;
  height: 506.4px;
  background: #1d1a15;
  border-radius: 20px 20px 0 0;
  padding-top: 30px;
}
.cs-panel__title {
  display: inline-block;
  width: 78px;
  margin-left: 10px;
  font-size: 15px;
  line-height: 21px;
  font-weight: 700;
  color: #fff;
}
.cs-bottom {
  position: absolute;
  left: 0;
  top: 757px;
  width: 390px;
  height: 87px;
  background: #111111;
  padding: 20px 16px;
}
.cs-btn {
  width: 358px;
  height: 47px;
  border-radius: 23px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.cs-btn__text {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #2f2413;
}
</style>
