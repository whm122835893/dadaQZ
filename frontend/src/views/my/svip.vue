<template>
  <!--
    原站 pages/my/svip（金标准实测 2026-10-25 登录后抓取，390x844，浅色 #f7f7f8）
    结构：nav(44, bg#fafafa, back-btn-white.png 24x24@(13,10), 标题15px bold #fff)
      → 全部为 320x240 权益图（x13，纵向堆叠，间隔 4px）：
        logo.webp @44 / tqryz-image.webp @288 / bofang.webp @532(x35 容器内居中)
        time-title.webp @772 / 倒计时 @1016(h20) / bdtq-image @1036
        tq-image @1280 / ljkt-image(立即开通) @1524
      倒计时：00天00时00分00（7 格 14px 宽 = 98px 居中；秒位无单位字）
    数据：POST /index/getConfig {key:"vip_agreement,vip_time"} + POST /user/getUserInfo
      倒计时 = 用户 vip_time（会员到期时间戳）- 当前时间；未开通（is_vip=0, vip_time=null）恒为 00
    交互：立即开通/播放按钮原站为支付/视频拉起（外部系统），复刻保留静态图不臆造跳转
  -->
  <div class="sv-page">
    <div class="sv-nav">
      <img class="sv-nav__back" src="/assets/img/my/back-btn-white.png" alt="" @click="goBack" />
      <span class="sv-nav__title"><span>会员中心</span></span>
    </div>

    <div class="sv-main">
      <img class="sv-img" src="/assets/img/svip/logo.webp" alt="" />
      <img class="sv-img sv-mt4" src="/assets/img/svip/tqryz-image.webp" alt="" />
      <div class="sv-video sv-mt4">
        <img class="sv-video__play" src="/assets/img/svip/bofang.webp" alt="" />
      </div>

      <div class="sv-time">
        <img class="sv-time__title" src="/assets/img/svip/time-title.webp" alt="" />
        <div class="sv-time__show">
          <span class="sv-num">{{ cd.d }}</span>
          <span class="sv-unit">天</span>
          <span class="sv-num">{{ cd.h }}</span>
          <span class="sv-unit">时</span>
          <span class="sv-num">{{ cd.m }}</span>
          <span class="sv-unit">分</span>
          <span class="sv-num">{{ cd.s }}</span>
        </div>
      </div>

      <img class="sv-img" src="/assets/img/svip/bdtq-image.webp" alt="" />
      <img class="sv-img sv-mt4" src="/assets/img/svip/tq-image.webp" alt="" />
      <img class="sv-img sv-mt4" src="/assets/img/svip/ljkt-image.webp" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo } from '@/api'

const router = useRouter()
const cd = reactive({ d: '00', h: '00', m: '00', s: '00' })
const expireTs = ref(0)
let timer = null

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

const pad = (n) => String(n).padStart(2, '0')

/** 倒计时：会员到期时间戳（用户 vip_time，秒）- 当前时间；未开通恒为 00 */
function tick() {
  const exp = Number(expireTs.value || 0)
  const left = exp > 0 ? Math.max(0, Math.floor(exp - Date.now() / 1000)) : 0
  cd.d = pad(Math.floor(left / 86400))
  cd.h = pad(Math.floor((left % 86400) / 3600))
  cd.m = pad(Math.floor((left % 3600) / 60))
  cd.s = pad(left % 60)
}

onMounted(async () => {
  try {
    const res = await getUserInfo()
    const u = (res && res.data) || {}
    expireTs.value = Number(u.vip_time || 0)
  } catch (e) {
    expireTs.value = 0
  }
  tick()
  timer = setInterval(tick, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.sv-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.sv-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  background: #fafafa;
  z-index: 10;
}
.sv-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.sv-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}
.sv-nav__title > span {
  font-size: 15px;
  line-height: 16px;
  font-weight: bold;
  color: #fff;
}
.sv-main {
  padding: 44px 13px 17px;
}
.sv-img {
  display: block;
  width: 320px;
  height: 240px;
}
.sv-mt4 {
  margin-top: 4px;
}
.sv-video {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sv-video__play {
  width: 320px;
  height: 240px;
}
.sv-time__title {
  display: block;
  width: 320px;
  height: 240px;
}
.sv-time__show {
  margin-top: 4px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sv-num {
  width: 14px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 14px;
  color: #4a4a4a;
}
.sv-unit {
  width: 14px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #4a4a4a;
}
</style>
