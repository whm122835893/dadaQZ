<template>
  <!--
    原站 pages/message/message（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：uni-page-head 白底 44px
      → 返回（u-btn-icon 码点 e601 27px @(5,6.5)）
      → 标题「消息」16px bold #000 @(70,7,250,30)
      → page-body：container page-container（无 page-bg，原站 body 为纯白）
          页面内容由 w-container 承载，原站当前渲染为空白（无消息数据）
    说明：原站 chunk pages-message-message 仅 966 字节，
          组件为 w-container（模块 dc9d），data 为空对象 {}，
          未挂载任何列表接口 → 该页在原站即为空壳页。
  -->
  <div class="ms-page">
    <div class="ms-head">
      <div class="ms-head__btn" @click="goBack">
        <i class="ms-head__icon"></i>
      </div>
      <div class="ms-head__title">消息</div>
    </div>

    <div class="ms-body">
      <!-- 原站该页当前无任何内容渲染（w-container 无子节点） -->
    </div>
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
.ms-page {
  min-height: 100vh;
  background: #fff;
}
.ms-head {
  position: relative;
  height: 44px;
  background: #fff;
}
.ms-head__btn {
  position: absolute;
  left: 5px;
  top: 6.5px;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ms-head__icon {
  display: block;
  width: 27px;
  height: 27px;
  font-family: 'uview-icon';
  font-size: 27px;
  line-height: 27px;
  color: #000;
}
.ms-head__icon::before {
  content: '\e601';
}
.ms-head__title {
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
.ms-body {
  position: relative;
  min-height: 800px;
  background: #fff;
}
</style>
