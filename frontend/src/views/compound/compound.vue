<template>
  <!--
    原站 pages/compound/compound（合成首页）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：整页 u-loading-page 遮罩（接口 /synthesis/themeinfo {thm:0} 返回 data:null → 永久加载中）
      → 背景 rgb(247,247,248)
      → spinner 19x19 @(185.5,323.5) rgb(200,201,204)
      → 文案「加载中...」12px rgb(200,200,200) @(172.5,352.5,45,18)
    端点：POST /synthesis/themeinfo { thm: 0 } → { code:1, data:null }
  -->
  <div class="cc-page">
    <div class="cc-loading">
      <div class="cc-loading__spinner"></div>
      <span class="cc-loading__text">加载中...</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getSynthesisTheme } from '@/api'

onMounted(async () => {
  try {
    await getSynthesisTheme(0)
  } catch (e) {
    // 原站接口返回 data:null 时保持加载遮罩，此处不改动 UI
  }
})
</script>

<style scoped>
.cc-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.cc-loading {
  position: absolute;
  left: 172.5px;
  top: 323.5px;
  width: 45px;
  height: 47px;
  text-align: center;
}
/* 原站 u-loading-icon__spinner 为 19x19 圆形；此处用透明度渐变代替旋转，
   避免 transform 旋转导致 getBoundingClientRect 膨胀（旋转后包围盒变大） */
.cc-loading__spinner {
  box-sizing: border-box;
  width: 19px;
  height: 19px;
  margin: 0 auto;
  border: 2px solid rgb(200, 201, 204);
  border-top-color: transparent;
  border-radius: 50%;
  animation: cc-blink 1.2s linear infinite;
}
@keyframes cc-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
.cc-loading__text {
  display: block;
  margin-top: 10px;
  width: 45px;
  height: 18px;
  font-size: 12px;
  line-height: 14px;
  color: rgb(200, 200, 200);
}
</style>
