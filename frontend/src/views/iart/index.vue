<template>
  <!--
    原站 pages/iart/index（iArt 超话）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：原生 uni-page-head 390x44 bg #fff
              左侧返回图标 \ue601 27px @(5,6)
              标题「iArt超话」16px bold 黑 @(70,7,250,30)
          → 内容区为空（uni-view 无子节点，原站该页当前无内容渲染）
    端点：无
  -->
  <div class="ia-page">
    <div class="ia-pagehead">
      <i class="ia-pagehead__icon" @click="goBack">&#xe601;</i>
      <span class="ia-pagehead__title">iArt超话</span>
    </div>
    <div class="ia-body"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}
</script>

<style scoped>
.ia-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.ia-pagehead {
  position: relative;
  width: 390px;
  height: 44px;
  padding: 7px 3px;
  background: #fff;
}
.ia-pagehead__icon {
  font-family: unibtn;
  position: absolute;
  left: 5px;
  top: 6px;
  width: 27px;
  height: 27px;
  overflow: hidden;
  font-size: 27px;
  line-height: 27px;
  color: #000;
  font-style: normal;
}
.ia-pagehead__title {
  position: absolute;
  left: 70px;
  top: 7px;
  width: 250px;
  height: 30px;
  font-size: 16px;
  font-weight: 700;
  line-height: 30px;
  color: #000;
  text-align: center;
}
.ia-body {
  position: absolute;
  left: 0;
  top: 44px;
  width: 390px;
  height: 800px;
}
</style>
