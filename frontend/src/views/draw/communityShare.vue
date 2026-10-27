<template>
  <!--
    原站 pages/draw/communityShare/communityShare（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg（pageBg #f5f5f5；page-body 内 uni-view bg #f7f7f8）
      → uni-page-head 白底 44px：返回（u-btn-icon e601 27px @(5,6.5)）、标题「分享」16px bold @(70,7,250,30)
      → pa-16 内容区：
          助力卡 358x56 @(16,60) bg rgb(48,41,32) br20px padding 12px 20px
            「您已成功获得助力」14px #666 @(36,82,115.5,15)
            「0」14px #333 @(157.5,82,7,15)
            「次」14px #666 @(170.5,82,17.5,15)
            「分享图片」68x32 @(286,72) border 1px #333 br8px pa-6 14px #333
          「上传图片:」15px @(16,132,358,21) mt-16 mb-16
          上传格 83x83 @(16,169) bg rgb(229,229,229) br12px，IconAdd 16x16 @(49.5,202.5)
          「上传截图，图片大小限制5M内，数量3张」14px #999 @(16,268,358,20) mt-16
          表头 12px rgb(151,153,151) y=304：日期 @(16,304,125.3,18) zhanbi2 35%
                                    上传图片数量 @(177.1,304,89.5,18) zhanbi 25%
                                    审核结果 @(302.4,304,71.6,18) zhanbi1 20%
          空态 icon e62f 90px @(150,358,90,90) #c0c4cc + 「暂无分享记录」14px @(153,458,84,20)
          规则卡 358x66 @(16,504) bg rgb(48,41,32) br20px padding 15px
            「分享社群规则」16px bold #4a4a4a @(56,519,96,24)
          底部「提交」352x47 @(19.5,782) bg rgb(227,227,227) br8px 14px bold #666（disabled）
    数据：POST /score/get_my_share_details → 实调 data:null（无分享记录）
  -->
  <div class="cs-page">
    <div class="cs-head">
      <div class="cs-head__btn" @click="goBack">
        <i class="cs-head__icon"></i>
      </div>
      <div class="cs-head__title">分享</div>
    </div>

    <div class="cs-body">
      <div class="cs-inner">
        <div class="cs-card">
          <div class="cs-card__row">
            <div class="cs-card__left">
              <span class="cs-card__label">您已成功获得助力</span>
              <span class="cs-card__num">{{ helpCount }}</span>
              <span class="cs-card__unit">次</span>
            </div>
            <div class="cs-card__share" @click="onShareImage">分享图片</div>
          </div>
        </div>

        <div class="cs-upload-title">上传图片:</div>

        <div class="cs-upload">
          <div class="cs-upload__cell" @click="onPickImage">
            <div class="cs-upload__icon"></div>
          </div>
        </div>

        <div class="cs-upload-tip">上传截图，图片大小限制5M内，数量3张</div>

        <div class="cs-table">
          <div class="cs-table__head">
            <span class="cs-table__cell cs-table__cell--date">日期</span>
            <span class="cs-table__cell cs-table__cell--count">上传图片数量</span>
            <span class="cs-table__cell cs-table__cell--audit">审核结果</span>
          </div>

          <div v-if="list.length === 0" class="cs-empty">
            <i class="cs-empty__icon"></i>
            <span class="cs-empty__text">暂无分享记录</span>
          </div>
          <div v-for="row in list" v-else :key="row.id" class="cs-table__row">
            <span class="cs-table__cell cs-table__cell--date">{{ row.date }}</span>
            <span class="cs-table__cell cs-table__cell--count">{{ row.count }}</span>
            <span class="cs-table__cell cs-table__cell--audit">{{ row.audit }}</span>
          </div>
        </div>

        <div class="cs-rules">
          <div class="cs-rules__head">
            <i class="cs-rules__icon"></i>
            <span class="cs-rules__title">分享社群规则</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cs-footer">
      <div class="cs-footer__btn">提交</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHelpRecord } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const helpCount = ref(0)
const list = ref([])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/draw/Leaderboard/Leaderboard')
}

function onShareImage() {
  toast('请选择要分享的图片')
}

function onPickImage() {
  toast('请选择图片')
}

onMounted(async () => {
  try {
    const res = await getHelpRecord()
    const data = res.data || {}
    helpCount.value = data.count || 0
    list.value = data.list || []
  } catch (e) {
    helpCount.value = 0
    list.value = []
  }
})
</script>

<style scoped>
.cs-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.cs-head {
  position: relative;
  height: 44px;
  background: #fff;
}
.cs-head__btn {
  position: absolute;
  left: 5px;
  top: 6.5px;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cs-head__icon {
  display: block;
  width: 27px;
  height: 27px;
  font-family: 'uview-icon';
  font-size: 27px;
  line-height: 27px;
  color: #000;
}
.cs-head__icon::before {
  content: '\e601';
}
.cs-head__title {
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
.cs-body {
  position: relative;
  min-height: 800px;
  background: #f7f7f8;
}
.cs-inner {
  padding: 16px;
}
/* 助力卡：358x56 @(16,60)，padding 12px 20px */
.cs-card {
  position: relative;
  width: 358px;
  height: 56px;
  padding: 12px 20px;
  box-sizing: border-box;
  border-radius: 20px;
  background: rgb(48, 41, 32);
}
.cs-card__row {
  height: 32px;
}
.cs-card__label {
  position: absolute;
  left: 20px;
  top: 22px;
  width: 115.5px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.cs-card__num {
  position: absolute;
  left: 141.5px;
  top: 22px;
  width: 7px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #333;
}
.cs-card__unit {
  position: absolute;
  left: 154.5px;
  top: 22px;
  width: 17.5px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.cs-card__share {
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
.cs-upload-title {
  margin: 16px 0;
  font-size: 15px;
  line-height: 21px;
  font-weight: 400;
  color: #4a4a4a;
}
.cs-upload {
  display: flex;
}
.cs-upload__cell {
  width: 83px;
  height: 83px;
  border-radius: 12px;
  background: rgb(229, 229, 229);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.cs-upload__icon {
  width: 16px;
  height: 16px;
  background: url('/assets/img/m3/icon/IconAdd.webp') no-repeat;
  background-size: 100% 100%;
}
.cs-upload-tip {
  margin-top: 16px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #999;
}
.cs-table {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* 原站表头容器 358x34 @(16,304) */
.cs-table__head {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.cs-table__cell {
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: rgb(151, 153, 151);
  text-align: center;
}
.cs-table__cell--date {
  width: 35%;
}
.cs-table__cell--count {
  width: 25%;
}
.cs-table__cell--audit {
  width: 20%;
}
.cs-table__row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.cs-empty {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cs-empty__icon {
  display: block;
  width: 90px;
  height: 90px;
  font-family: 'uview-icon';
  font-size: 90px;
  line-height: 90px;
  color: #c0c4cc;
}
.cs-empty__icon::before {
  content: '\e62f';
}
.cs-empty__text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #c0c4cc;
}
/* 规则卡：358x66 @(16,504)，padding 15px */
.cs-rules {
  width: 358px;
  height: 66px;
  margin-top: 26px;
  padding: 15px;
  border-radius: 20px;
  background: rgb(48, 41, 32);
  box-shadow: 0 0 25px 2px rgba(149, 153, 173, 0.19);
}
.cs-rules__head {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.cs-rules__icon {
  width: 15px;
  height: 15px;
  display: block;
  background: none;
}
.cs-rules__title {
  margin-left: 10px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #4a4a4a;
}
/* 底部提交：352x47 @(19.5,782) —— 原站 common_box 390x77 @(0,767) padding 15px 0 0 19.5px */
.cs-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 77px;
  box-sizing: border-box;
  padding: 15px 0 0 19.5px;
}
.cs-footer__btn {
  width: 95%;
  height: 47px;
  border-radius: 8px;
  background: rgb(227, 227, 227);
  font-size: 14px;
  line-height: 47px;
  font-weight: 700;
  color: #666;
  text-align: center;
}
</style>
