<template>
  <!--
    原站 pages/my/privacy（金标准实测 2026-10-25，390x844，浅色 #f7f7f8）
    结构：nav(44, bg#fafafa, back 24x24@(13,10), 标题15px bold #333)
      → 白卡 (13,44,364,80) bg#fff 边1px #e7e7ea br12（紧贴导航下方）
          文本 对外隐藏所有藏品 15px #23262f @x30
          开关 42x22@(318,73) ON：track #1b64de br100 / knob 20x20 白 @(339,74)
    交互：点击切换开关（推断端点 /user/profile，见 API 文档）
  -->
  <div class="pv-page">
    <div class="pv-nav">
      <img class="pv-nav__back" src="/assets/img/my/back-btn.png" alt="" @click="goBack" />
      <span class="pv-nav__title">隐私设置</span>
    </div>

    <div class="pv-card">
      <span class="pv-card__text">对外隐藏所有藏品</span>
      <div class="pv-switch" :class="{ 'pv-switch--on': hideAll }" @click="toggle">
        <i class="pv-switch__knob" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setHideCollection } from '@/api'

const router = useRouter()
/** 原站默认开启（金标准抓取时开关为 ON） */
const hideAll = ref(true)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

function toggle() {
  hideAll.value = !hideAll.value
  setHideCollection({ hide_collection: hideAll.value ? 1 : 0 })
}
</script>

<style scoped>
.pv-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.pv-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  background: #fafafa;
  z-index: 10;
}
.pv-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.pv-nav__title {
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
.pv-card {
  position: relative;
  margin-top: 44px;
  margin-left: 13px;
  margin-right: 13px;
  height: 80px;
  padding-top: 2px;
  background: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 12px;
  display: flex;
  align-items: center;
}
.pv-card__text {
  margin-left: 17px;
  font-size: 15px;
  line-height: 16px;
  color: #23262f;
}
.pv-switch {
  position: absolute;
  right: 17px;
  top: 50%;
  margin-top: -11px;
  width: 42px;
  height: 22px;
  border-radius: 100px;
  background: #dcdfe6;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: background 0.2s;
  cursor: pointer;
}
.pv-switch--on {
  background: #1b64de;
}
.pv-switch__knob {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 20px;
  height: 20px;
  border-radius: 100px;
  background: #fff;
  transition: left 0.2s;
}
.pv-switch--on .pv-switch__knob {
  left: 21px;
}
</style>
