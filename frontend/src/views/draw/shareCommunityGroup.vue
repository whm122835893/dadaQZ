<template>
  <!--
    原站 pages/draw/shareCommunityGroup/shareCommunityGroup（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg（pageBg #f5f5f5；page-body 内 uni-view bg #f7f7f8）
      → uni-page-head 白底 44px：返回（u-btn-icon e601 27px @(5,6.5)）、标题「分享」16px bold @(70,7,250,30)
      → pa-16 内容区：
          积分卡 358x56 @(16,60) bg rgb(48,41,32) br20px padding 12px 20px
            「分享社群，已获得」14px #666 @(36,82,115.5,15)
            「0」14px #333 @(157.5,82,7,15)
            「积分」14px #666 @(170.5,82,31.5,15)
            「分享图片」68x32 @(286,72) border 1px #333 br8px pa-6 14px #333
          「上传图片:」15px @(16,132,358,21) mt-16 mb-16
          上传格 83x83 @(16,169) bg rgb(229,229,229) br12px，IconAdd 16x16 @(49.5,202.5)
          「上传截图，图片大小限制5M内，数量3张」14px #999 @(16,268,358,20) mt-16
          表头 12px rgb(151,153,151) y=304：日期 @(16,304,125.3,18) zhanbi2 35%
                                    上传图片数量 @(177.1,304,89.5,18) zhanbi 25%
                                    审核结果 @(302.4,304,71.6,18) zhanbi1 20%
          规则卡 358x94 @(16,343) bg rgb(48,41,32) br20px padding 15px margin-top 5px
            「分享社群规则」14px bold rgb(35,38,47) @(31,358,328,20)
            规则正文 14px #666：「1.111」@(31,390,328,16)、「2.222」@(31,406,328,16)
          「提交」358x45 @(16,453) bg rgb(20,20,22) br33px 15px #fff mt-16
    数据：POST /score/get_my_share_details → data:null
          规则正文取 /index/getConfig 的 share_rule（实调 "<p>1.111</p><p>2.222</p>"）
  -->
  <div class="scg-page">
    <div class="scg-head">
      <div class="scg-head__btn" @click="goBack">
        <i class="scg-head__icon"></i>
      </div>
      <div class="scg-head__title">分享</div>
    </div>

    <div class="scg-body">
      <div class="scg-inner">
        <div class="scg-card">
          <div class="scg-card__row">
            <div class="scg-card__left">
              <span class="scg-card__label">分享社群，已获得</span>
              <span class="scg-card__num">{{ score }}</span>
              <span class="scg-card__unit">积分</span>
            </div>
            <div class="scg-card__share" @click="onShareImage">分享图片</div>
          </div>
        </div>

        <div class="scg-upload-title">上传图片:</div>

        <div class="scg-upload">
          <div class="scg-upload__cell" @click="onPickImage">
            <div class="scg-upload__icon"></div>
          </div>
        </div>

        <div class="scg-upload-tip">上传截图，图片大小限制5M内，数量3张</div>

        <div class="scg-table">
          <div class="scg-table__head">
            <span class="scg-table__cell scg-table__cell--date">日期</span>
            <span class="scg-table__cell scg-table__cell--count">上传图片数量</span>
            <span class="scg-table__cell scg-table__cell--audit">审核结果</span>
          </div>
        </div>

        <div class="scg-rules">
          <div class="scg-rules__head">
            <span class="scg-rules__title">分享社群规则</span>
          </div>
          <div class="scg-rules__body">
            <p v-for="(line, i) in ruleLines" :key="i" class="scg-rules__p">{{ line }}</p>
          </div>
        </div>

        <div class="scg-submit" @click="onSubmit">提交</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyShareDetails, getShareRule } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const score = ref(0)
const ruleLines = ref(['1.111', '2.222'])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/draw/communityShare/communityShare')
}

function onShareImage() {
  toast('请选择要分享的图片')
}

function onPickImage() {
  toast('请选择图片')
}

function onSubmit() {
  toast('请先上传截图')
}

onMounted(async () => {
  try {
    const res = await getMyShareDetails()
    const data = res.data || {}
    score.value = data.score || 0
  } catch (e) {
    score.value = 0
  }
  try {
    const res = await getShareRule()
    const html = (res.data && res.data.share_rule) || ''
    const lines = html
      .replace(/<\/?p>/g, '\n')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    if (lines.length) ruleLines.value = lines
  } catch (e) {
    /* 保持默认规则文案 */
  }
})
</script>

<style scoped>
.scg-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.scg-head {
  position: relative;
  height: 44px;
  background: #fff;
}
.scg-head__btn {
  position: absolute;
  left: 5px;
  top: 6.5px;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.scg-head__icon {
  display: block;
  width: 27px;
  height: 27px;
  font-family: 'uview-icon';
  font-size: 27px;
  line-height: 27px;
  color: #000;
}
.scg-head__icon::before {
  content: '\e601';
}
.scg-head__title {
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
.scg-body {
  position: relative;
  min-height: 800px;
  background: #f7f7f8;
}
.scg-inner {
  padding: 16px;
}
/* 积分卡：358x56 @(16,60)，padding 12px 20px */
.scg-card {
  position: relative;
  width: 358px;
  height: 56px;
  padding: 12px 20px;
  box-sizing: border-box;
  border-radius: 20px;
  background: rgb(48, 41, 32);
}
.scg-card__row {
  height: 32px;
}
.scg-card__label {
  position: absolute;
  left: 20px;
  top: 22px;
  width: 115.5px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.scg-card__num {
  position: absolute;
  left: 141.5px;
  top: 22px;
  width: 7px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #333;
}
.scg-card__unit {
  position: absolute;
  left: 154.5px;
  top: 22px;
  width: 31.5px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.scg-card__share {
  position: absolute;
  right: 20px;
  top: 12px;
  width: 68px;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 14px;
  line-height: 30px;
  white-space: nowrap;
  color: #333;
  text-align: center;
  cursor: pointer;
}
.scg-upload-title {
  margin: 16px 0;
  font-size: 15px;
  line-height: 21px;
  font-weight: 400;
  color: #4a4a4a;
}
.scg-upload {
  display: flex;
}
.scg-upload__cell {
  width: 83px;
  height: 83px;
  border-radius: 12px;
  background: rgb(229, 229, 229);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.scg-upload__icon {
  width: 16px;
  height: 16px;
  background: url('/assets/img/m3/icon/IconAdd.webp') no-repeat;
  background-size: 100% 100%;
}
.scg-upload-tip {
  margin-top: 16px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #999;
}
.scg-table {
  margin-top: 16px;
}
/* 原站表头容器 358x34 @(16,304) */
.scg-table__head {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.scg-table__cell {
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: rgb(151, 153, 151);
  text-align: center;
}
.scg-table__cell--date {
  width: 35%;
}
.scg-table__cell--count {
  width: 25%;
}
.scg-table__cell--audit {
  width: 20%;
}
/* 规则卡：358x94 @(16,343)，padding 15px */
.scg-rules {
  width: 358px;
  min-height: 94px;
  margin-top: 5px;
  padding: 15px;
  border-radius: 20px;
  background: rgb(48, 41, 32);
  box-shadow: 0 0 25px 2px rgba(149, 153, 173, 0.19);
}
.scg-rules__head {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.scg-rules__title {
  flex: 1;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: rgb(35, 38, 47);
}
.scg-rules__p {
  margin: 0;
  width: 100%;
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #666;
}
/* 提交：358x45 @(16,453) */
.scg-submit {
  width: 358px;
  height: 45px;
  margin-top: 16px;
  border-radius: 33px;
  background: rgb(20, 20, 22);
  font-size: 15px;
  line-height: 45px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>
