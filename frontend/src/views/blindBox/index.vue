<template>
  <!--
    原站 pages/blindBox/index（金标准实测 2026-10-25 登录后抓取，390x844，浅色 #f7f7f8）
    结构：container page-container page-bg flex flex-dir-col
      → nav 44px bg #fafafa：返回（back-btn.png 24x24 @(13,10)）、标题「我的盲盒」15px bold #000 @(165,15.5,60,16)
      → content（纵向居中）：
          listimg 332x234 @(29,236) bg product-bg-tz.png
          num-view 171x28 @(109.5,470) bg blind-num-bg.webp，内文「共有个」12px fw500 #fff @(177,478,36,14)
          「一键开启」按钮 260x45 @(65,514) 金渐变 br22px，文字 14px bold #2f2414
          「一次最多打开10个盲盒」12px #23262f @(135,570,120,14)
      → 底部按钮行（fixed 底，ptb-10 + plr-20）：
          「立即寄售」166x47 @(20,787) 浅灰 #f0f0f2 br26px，文字 14px bold #000
          「逐个拆开」166x47 @(204,787) 金渐变 br26px，文字 14px bold #2f2414
    数据：原站仅调 /user/getUserInfo → blind_box_num 为盲盒数量
  -->
  <div class="bb-page">
    <div class="bb-nav">
      <div class="bb-nav__back" @click="goBack">
        <div class="bb-nav__back-img"></div>
      </div>
      <span class="bb-nav__title"><span>我的盲盒</span></span>
    </div>

    <div class="bb-content">
      <div class="bb-con">
        <div class="bb-con__img"></div>
        <div class="bb-con__num">
          <span>共有<span v-if="count > 0">{{ count }}</span>个</span>
        </div>
        <div class="bb-con__btn" @click="onOpenAll">
          <span class="bb-con__btn-text">一键开启</span>
        </div>
        <span class="bb-con__tip">一次最多打开10个盲盒</span>
      </div>
    </div>

    <div class="bb-btns">
      <div class="bb-btns__row">
        <div class="bb-btn bb-btn--plain" @click="goConsign">
          <span class="bb-btn__text">立即寄售</span>
        </div>
        <div class="bb-btn" @click="onOpenOne">
          <span class="bb-btn__text">逐个拆开</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const count = ref(0)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

/** 立即寄售 → 原站 pages/consignments/myConsignment */
function goConsign() {
  router.push('/pages/consignments/myConsignment')
}

/** 一键开启 / 逐个拆开：原站走开盒接口，需盲盒列表；无列表时保持原站空态提示 */
function onOpenAll() {
  toast('暂无盲盒可开启')
}

function onOpenOne() {
  toast('暂无盲盒可开启')
}

onMounted(async () => {
  try {
    const res = await getUserInfo()
    count.value = Number((res.data && res.data.blind_box_num) || 0)
  } catch (e) {
    count.value = 0
  }
})
</script>

<style scoped>
.bb-page {
  position: relative;
  min-height: 100vh;
  background: #f7f7f8;
  padding-bottom: 95px;
}
.bb-nav {
  position: relative;
  height: 44px;
  background: #fafafa;
}
.bb-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.bb-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.bb-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #000;
}
.bb-nav__title > span {
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #000;
}
.bb-content {
  flex: 1;
}
.bb-con {
  margin-top: 192px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bb-con__img {
  width: 332px;
  height: 234px;
  background: url('/assets/img/p0/bg/product-bg-tz.png') no-repeat;
  background-size: 100% 100%;
}
.bb-con__num {
  width: 171px;
  height: 28px;
  background: url('/assets/img/p0/bg/blind-num-bg.webp') no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bb-con__num > span {
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  color: #fff;
}
.bb-con__btn {
  margin-top: 16px;
  width: 260px;
  height: 45px;
  border-radius: 22px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.bb-con__btn-text {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #2f2414;
}
.bb-con__tip {
  margin-top: 11px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color: #23262f;
}
.bb-btns {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 20px;
  background: #f7f7f8;
}
.bb-btns__row {
  display: flex;
  justify-content: space-between;
}
.bb-btn {
  width: 166px;
  height: 47px;
  border-radius: 26px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.bb-btn--plain {
  background: #f0f0f2;
}
.bb-btn__text {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #2f2414;
}
.bb-btn--plain .bb-btn__text {
  color: #000;
}
</style>
