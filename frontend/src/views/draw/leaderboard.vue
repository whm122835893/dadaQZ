<template>
  <!--
    原站 pages/draw/Leaderboard/Leaderboard（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg（pageBg #f5f5f5；page-body 内 uni-view bg #f7f7f8）
      → uni-page-head 白底 44px：返回（u-btn-icon e601 27px @(5,6.5)）、标题「参与人数」16px bold @(70,7,250,30)
      → 参与人数卡 390x56 @(0,60) bg rgb(48,41,32) br20px padding 18px 0
          「参与人数」14px #666 @(150.5,82,56,15)
          「0」14px bold #666 @(212.5,82,7,15)
          「人」14px #666 @(225.5,82,14,15)
      → u-gap 122px 占位（透明）
      → common_box 白底 @(0,752,390,92)
          「邀请好友助力」374.4x47 @(7.8,767) 金渐变 br8px，文字 14px bold #2f2414
      → 海报层（display none，原站同）
    数据：POST /draw/get { id } → 实调 { code:0, msg:"活动不存在" }，参与人数 0
  -->
  <div class="lb-page">
    <div class="lb-head">
      <div class="lb-head__btn" @click="goBack">
        <i class="lb-head__icon"></i>
      </div>
      <div class="lb-head__title">参与人数</div>
    </div>

    <div class="lb-body">
      <div class="lb-card">
        <span class="lb-card__label">参与人数</span>
        <span class="lb-card__num">{{ count }}</span>
        <span class="lb-card__unit">人</span>
      </div>

      <div class="lb-gap"></div>

      <div class="lb-box">
        <div class="lb-btn" @click="onInvite">邀请好友助力</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDrawInfo } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const count = ref(0)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/draw/communityShare/communityShare')
}

function onInvite() {
  toast('请复制邀请链接分享给好友')
}

onMounted(async () => {
  try {
    const res = await getDrawInfo({ id: route.query.id || '' })
    const data = res.data || {}
    count.value = data.count || 0
  } catch (e) {
    count.value = 0
  }
})
</script>

<style scoped>
.lb-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.lb-head {
  position: relative;
  height: 44px;
  background: #fff;
}
.lb-head__btn {
  position: absolute;
  left: 5px;
  top: 6.5px;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-head__icon {
  display: block;
  width: 27px;
  height: 27px;
  font-family: 'uview-icon';
  font-size: 27px;
  line-height: 27px;
  color: #000;
}
.lb-head__icon::before {
  content: '\e601';
}
.lb-head__title {
  position: absolute;
  left: 70px;
  top: 7px;
  width: 250px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000;
}
.lb-body {
  position: relative;
  min-height: 800px;
  overflow: hidden;
  background: #f7f7f8;
}
/* 参与人数卡：390x56 @(0,60)，padding 18px 0 */
.lb-card {
  position: relative;
  width: 390px;
  height: 56px;
  margin-top: 16px;
  border-radius: 20px;
  background: rgb(48, 41, 32);
}
.lb-card__label {
  position: absolute;
  left: 150.5px;
  top: 22px;
  width: 56px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.lb-card__num {
  position: absolute;
  left: 212.5px;
  top: 22px;
  width: 7px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 700;
  color: #666;
}
.lb-card__unit {
  position: absolute;
  left: 225.5px;
  top: 22px;
  width: 14px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.lb-gap {
  height: 122px;
  background: transparent;
}
/* 白底区块：390x92 @(0,752)，按钮 374.4x47 @(7.8,767) */
.lb-box {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 92px;
  box-sizing: border-box;
  background: #fff;
  padding: 15px 7.8px 30px;
}
.lb-btn {
  width: 374.4px;
  height: 47px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  font-size: 14px;
  line-height: 47px;
  font-weight: 700;
  color: #2f2414;
  text-align: center;
  cursor: pointer;
}
</style>
