<template>
  <!--
    原站 pages/index/downloadApp（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：app-view 整页渐变 linear-gradient(160deg,#0d0b1f 0%,#1a1240 42%,#3d1c74 72%,#6b2ea8 100%)
      → bg-decor：grid-mask (0,0,390,468) 网格线覆盖层
      → blob 光斑：blob-1 (211.9,-47.2,239,239) rgba(255,84,172,.45) br50%
                   blob-2 (-72,105.7,208,208) rgba(64,132,255,.4)
                   blob-3 (227.8,226.2,187,187) rgba(255,205,84,.3)
      → nav：返回（back-btn.png 24x24 @(13,10)）、标题「下载嗒嗒」15px fw600 #fff @(161,15.5,68,16)
      → logo-wrap：ring-2 (108.1,55.1,173.8) / ring-1 (109.3,56.3,171.5,粉) / ring-3 (141.4,88.4,107.2)
          logo-card (148.5,95.5,93,93) rgba(255,255,255,.14) br22px
            logo.webp 78x78 @(156,103) br10px
      → brand-name「嗒 嗒」29px fw800 渐变字 @(20,238,350,42)
      → brand-slogan「数字藏品的下一站，触手可及」12px rgba(255,255,255,.72) @(20,286,350,18)
      → tags 三枚胶囊 11px（白 12% 底 + 白 22% 边 + 圆点）：
          (80,321,100,26) / (188,321,122,26) / (139.5,353,111,26)
      → panel (20,408,350,299) rgba(255,255,255,.1) 白 22% 边 br20px
          panel-hd：title「选择你的设备」16px fw700 @(38,434,102,17)
                    sub「推荐使用最新版浏览器打开」11px @(38,460,132,12)
          btn-list：
            dl-btn ios (38,488,314,68) br14 白 22% 边
              图标框 (54,502,40,40) br12 + uicon-apple-fill e881 34px @(57,505)
              「下载 iOS 版」/「App Store / TestFlight」
              箭头圈 (307,507.5,29,29) br50% + uicon-arrow-right e605 24px
            dl-btn android (38,568,314,68) 渐变 #ff7a3c→#ff3d77 55%→#a42bd6
              图标框 (53,582,40,40) + uicon-android-fill e67d 34px @(56,585)
          tip (38,653,314,38) rgba(255,216,84,.12) 黄 30% 边 br10px
            ⚠ 12px #ffd854 @(50,666) + 说明 10px rgba(255,255,255,.82) @(68,666.5,260,11)
      → footer：line (172,733,46,2) 渐变分割线
                 「© 2026 嗒嗒 · 让每一份热爱都有归属」10px @(103.5,760,182.9,11)
    数据：下载地址取自 /index/getConfig 的 base_apk / ipa
  -->
  <div class="da-page">
    <div class="da-grid"></div>
    <div class="da-blob da-blob--1"></div>
    <div class="da-blob da-blob--2"></div>
    <div class="da-blob da-blob--3"></div>

    <div class="da-nav">
      <div class="da-nav__back" @click="goBack">
        <div class="da-nav__back-img"></div>
      </div>
      <span class="da-nav__title"><span>下载嗒嗒</span></span>
    </div>

    <div class="da-logo">
      <div class="da-logo__ring da-logo__ring--2"></div>
      <div class="da-logo__ring da-logo__ring--1"></div>
      <div class="da-logo__ring da-logo__ring--3"></div>
      <div class="da-logo__card">
        <img class="da-logo__img" src="/assets/img/p0/image/index/logo.webp" alt="" />
      </div>
    </div>

    <div class="da-brand">
      <div class="da-brand__name">嗒 嗒</div>
      <div class="da-brand__slogan">数字藏品的下一站，触手可及</div>
      <div class="da-brand__tags">
        <span class="da-brand__tag da-brand__tag--1"><i class="da-brand__dot"></i>潮玩数字藏品</span>
        <span class="da-brand__tag da-brand__tag--2"><i class="da-brand__dot"></i>安全可信链上确权</span>
        <span class="da-brand__tag da-brand__tag--3"><i class="da-brand__dot"></i>一键发现新朋友</span>
      </div>
    </div>

    <div class="da-panel">
      <div class="da-choose">
        <span class="da-choose__title">选择你的设备</span>
        <span class="da-choose__sub">推荐使用最新版浏览器打开</span>
      </div>

      <div class="da-btns">
        <div class="da-btn da-btn--ios" @click="onIOS">
          <span class="da-btn__icon-box">
            <i class="da-btn__icon da-btn__icon--ios"></i>
          </span>
          <div class="da-btn__text">
            <span class="da-btn__name">下载 iOS 版</span>
            <span class="da-btn__desc">App Store / TestFlight</span>
          </div>
          <span class="da-btn__arrow-box">
            <i class="da-btn__arrow"></i>
          </span>
        </div>

        <div class="da-btn da-btn--android" @click="onAndroid">
          <span class="da-btn__icon-box">
            <i class="da-btn__icon da-btn__icon--android"></i>
          </span>
          <div class="da-btn__text">
            <span class="da-btn__name">下载安卓版</span>
            <span class="da-btn__desc">APK 安装包 · 通用</span>
          </div>
          <span class="da-btn__arrow-box">
            <i class="da-btn__arrow"></i>
          </span>
        </div>
      </div>

      <div class="da-warn">
        <span class="da-warn__icon">⚠</span>
        <span class="da-warn__text">微信内无法直接安装，请点击右上角「···」在浏览器中打开</span>
      </div>
    </div>

    <div class="da-footer">
      <div class="da-line"></div>
      <div class="da-copy">© 2026 嗒嗒 · 让每一份热爱都有归属</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDownloadConfig } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const baseApk = ref('')
const ipa = ref('')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function onIOS() {
  if (ipa.value) window.location.href = ipa.value
  else toast('暂未配置 iOS 下载地址')
}

function onAndroid() {
  if (baseApk.value) window.location.href = baseApk.value
  else toast('暂未配置安卓下载地址')
}

onMounted(async () => {
  try {
    const res = await getDownloadConfig()
    baseApk.value = (res.data && res.data.base_apk) || ''
    ipa.value = (res.data && res.data.ipa) || ''
  } catch (e) {
    /* 原站失败时无提示 */
  }
})
</script>

<style scoped>
.da-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: #0d0b1f;
  background-image: linear-gradient(160deg, #0d0b1f 0%, #1a1240 42%, #3d1c74 72%, #6b2ea8 100%);
}
.da-grid {
  position: absolute;
  left: 0;
  top: 0;
  width: 390px;
  height: 468px;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, rgba(0, 0, 0, 0) 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, rgba(0, 0, 0, 0) 1px);
  background-size: 28px 28px;
}
.da-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(28px);
}
.da-blob--1 {
  left: 211.9px;
  top: -47.2px;
  width: 239px;
  height: 239px;
  background: rgba(255, 84, 172, 0.45);
}
.da-blob--2 {
  left: -72px;
  top: 105.7px;
  width: 208px;
  height: 208px;
  background: rgba(64, 132, 255, 0.4);
}
.da-blob--3 {
  left: 227.8px;
  top: 226.2px;
  width: 187px;
  height: 187px;
  background: rgba(255, 205, 84, 0.3);
}
.da-nav {
  position: relative;
  height: 44px;
}
.da-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.da-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.da-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}
.da-nav__title > span {
  display: inline-block;
  width: 68px;
  font-size: 15px;
  line-height: 16px;
  font-weight: 600;
  color: #fff;
}
.da-logo {
  position: static;
  height: 194px;
}
.da-logo__ring {
  position: absolute;
  border-radius: 50%;
}
.da-logo__ring--2 {
  left: 108.1px;
  top: 55.1px;
  width: 173.8px;
  height: 173.8px;
  border: 1px solid rgba(255, 255, 255, 0.28);
}
.da-logo__ring--1 {
  left: 109.3px;
  top: 56.3px;
  width: 171.5px;
  height: 171.5px;
  border: 1px solid rgb(255, 84, 172);
}
.da-logo__ring--3 {
  left: 141.4px;
  top: 88.4px;
  width: 107.2px;
  height: 107.2px;
  border: 1px solid rgba(255, 255, 255, 0.28);
}
.da-logo__card {
  position: absolute;
  left: 148.5px;
  top: 95.5px;
  width: 93px;
  height: 93px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.da-logo__img {
  width: 78px;
  height: 78px;
  border-radius: 10px;
  display: block;
}
.da-brand {
  padding: 0 20px;
}
.da-brand__name {
  height: 42px;
  font-size: 29px;
  line-height: 42px;
  font-weight: 800;
  background: linear-gradient(100deg, #ffffff 20%, #ffd854 55%, #ff8fc6 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-align: center;
  letter-spacing: 8px;
}
.da-brand__slogan {
  margin-top: 6px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
}
.da-brand__tags {
  margin-top: 17px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.da-brand__tag {
  height: 26px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 11px;
  line-height: 24px;
  font-weight: 400;
  color: #fff;
  white-space: nowrap;
}
.da-brand__tag--1 {
  width: 100px;
}
.da-brand__tag--2 {
  width: 122px;
}
.da-brand__tag--3 {
  width: 111px;
  margin-top: 6px;
}
.da-brand__dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  margin-right: 5px;
  border-radius: 50%;
  background: #ffd854;
  vertical-align: middle;
}
.da-panel {
  position: absolute;
  left: 20px;
  top: 408px;
  width: 350px;
  height: 299px;
  padding: 26px 18px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 20px;
}
.da-choose {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.da-choose__title {
  display: inline-block;
  width: 102px;
  font-size: 16px;
  line-height: 17px;
  font-weight: 700;
  color: #fff;
}
.da-choose__sub {
  display: inline-block;
  width: 132px;
  margin-top: 9px;
  font-size: 11px;
  line-height: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
}
.da-btns {
  margin-top: 16px;
}
.da-btn {
  position: relative;
  width: 314px;
  height: 68px;
  border-radius: 14px;
  display: flex;
  align-items: center;
}
.da-btn--ios {
  background: linear-gradient(120deg, #1b1b2f 0%, #3a3a5c 100%);
  border: 1px solid rgba(255, 255, 255, 0.22);
}
.da-btn--android {
  margin-top: 12px;
  background: linear-gradient(120deg, #ff7a3c 0%, #ff3d77 55%, #a42bd6 100%);
}
.da-btn__icon-box {
  flex-shrink: 0;
  margin-left: 16px;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.da-btn__icon {
  display: block;
  width: 34px;
  height: 34px;
  font-family: 'uview-icon';
  font-size: 34px;
  line-height: 34px;
  color: #fff;
  font-style: normal;
  text-align: center;
}
.da-btn__icon--ios::before {
  content: '\e881';
}
.da-btn__icon--android::before {
  content: '\e67d';
}
.da-btn__text {
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}
.da-btn__name {
  font-size: 16px;
  line-height: 17px;
  font-weight: 700;
  color: #fff;
}
.da-btn__desc {
  margin-top: 5px;
  font-size: 10px;
  line-height: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.68);
}
.da-btn__arrow-box {
  margin-left: auto;
  margin-right: 16px;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.da-btn__arrow {
  display: block;
  width: 24px;
  height: 24px;
  font-family: 'uview-icon';
  font-size: 24px;
  line-height: 24px;
  color: #fff;
  font-style: normal;
  text-align: center;
}
.da-btn__arrow::before {
  content: '\e605';
}
.da-warn {
  margin-top: 17px;
  width: 314px;
  height: 38px;
  padding: 0 11px;
  background: rgba(255, 216, 84, 0.12);
  border: 1px solid rgba(255, 216, 84, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
}
.da-warn__icon {
  display: inline-block;
  font-size: 12px;
  line-height: 14px;
  color: #ffd854;
}
.da-warn__text {
  display: inline-block;
  width: 260px;
  margin-left: 6px;
  font-size: 10px;
  line-height: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.82);
}
.da-footer {
  position: absolute;
  left: 0;
  top: 733px;
  width: 390px;
}
.da-line {
  margin: 0 auto;
  width: 46px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.55), rgba(0, 0, 0, 0));
}
.da-copy {
  width: 183px;
  margin: 25px auto 0;
  font-size: 10px;
  line-height: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  white-space: nowrap;
}
</style>
