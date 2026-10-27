<template>
  <!--
    原站 pages/webview/webview（）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：原生 uni-page-head 390x44 bg #fff
              左侧返回图标 \ue601 27px @(5,6)
              标题「」16px bold 黑 @(70,7,250,30)
          → uni-web-view 全屏容器（<web-view>，原站无 src 时为空白）
    说明：原站为纯 webview 壳页，实际内容由 query 参数 url 决定；
          本复刻保留壳结构并支持 url 参数渲染 iframe。
  -->
  <div class="wv-page">
    <div class="wv-pagehead">
      <i class="wv-pagehead__icon" @click="goBack">&#xe601;</i>
      <span class="wv-pagehead__title"></span>
    </div>
    <div class="wv-body">
      <iframe v-if="url" class="wv-body__frame" :src="url"></iframe>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const url = computed(() => route.query.url || '')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}
</script>

<style scoped>
.wv-page {
  position: relative;
  min-height: 100vh;
  background: #fff;
  overflow: hidden;
}
.wv-pagehead {
  position: relative;
  width: 390px;
  height: 44px;
  padding: 7px 3px;
  background: #fff;
}
.wv-pagehead__icon {
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
.wv-pagehead__title {
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
.wv-body {
  position: absolute;
  left: 0;
  top: 44px;
  width: 390px;
  height: 800px;
}
.wv-body__frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
