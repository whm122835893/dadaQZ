<template>
  <!--
    原站 pages/my/join（金标准实测 2026-10-25，390x844，浅色 #f7f7f8）
    结构：nav(44, bg#f7f7f8 同页底色, back 24x24@(13,10), 标题15px bold #333)
      → 社群图 (0,127,390,390) 满宽方图（getConfig.service_image，黑底金色嗒嗒 logo）
  -->
  <div class="jn-page">
    <div class="jn-nav">
      <img class="jn-nav__back" src="/assets/img/my/back-btn.png" alt="" @click="goBack" />
      <span class="jn-nav__title">加入社群</span>
    </div>

    <div class="jn-poster" :style="{ backgroundImage: `url(${poster})` }" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getConfig } from '@/api'

const router = useRouter()
const poster = ref('/assets/img/641fb93746a2b4b145c6ce0479225bb7.png')

getConfig().then((res) => {
  if (res.data && res.data.service_image) poster.value = res.data.service_image
})

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}
</script>

<style scoped>
.jn-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.jn-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  background: #f7f7f8;
  z-index: 10;
}
.jn-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.jn-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #333;
}
.jn-poster {
  margin-top: 127px;
  width: 100%;
  height: 390px;
  background-size: cover;
  background-position: center;
}
</style>
