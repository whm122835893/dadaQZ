<template>
  <!--
    原站 pages/rebate/rebate（返佣概览）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：body bg rgb(247,247,248)
          → u-loading 竖向 loading（spinner 圆环 + 「加载中...」文字）
            spinner 19.7x19.7 @(185.2,323.2)，bd 2px solid rgb(200,200,200)，br 100px
            文字 12px rgb(200,200,200) @(172.5,355.5,45,14)
    端点：POST /user/commision_info → 响应体为空（无 data），页面永久停留在「加载中...」
  -->
  <div class="rb-page">
    <div class="rb-loading">
      <div class="rb-loading__spinner"></div>
      <span class="rb-loading__text">加载中...</span>
    </div>  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getCommissionInfo } from '@/api'

onMounted(async () => {
  try {
    await getCommissionInfo()
  } catch (e) {
    // 原站接口无响应，永久停留在加载态
  }
})
</script>

<style scoped>
.rb-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.rb-loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 390px;
  height: 844px;
}
.rb-loading__spinner {
  position: absolute;
  left: 185.2px;
  top: 323.2px;
  width: 19.7px;
  height: 19.7px;
  box-sizing: border-box;
  border: 2px solid rgb(200, 200, 200);
  border-top-color: transparent;
  border-radius: 100px;
}
.rb-loading__text {
  position: absolute;
  left: 172.5px;
  top: 355.5px;
  width: 45px;
  height: 14px;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: rgb(200, 200, 200);
  text-align: center;
  white-space: nowrap;
}
</style>
