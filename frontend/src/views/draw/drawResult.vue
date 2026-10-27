<template>
  <!--
    原站 pages/draw/drawResult/drawResult（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg（pageBg #f5f5f5）
      → uni-page-head 白底 44px：返回（u-btn-icon e601 27px @(5,6.5)）、标题「中签结果」16px bold @(70,7,250,30)
      → 全屏 u-loading-page 遮罩（fixed inset 0，display flex）
          spinner 26.8px @(181.6,319.6) 圆环色 #c8c8c8 / #f4f4f4
          「加载中...」12px #c8c8c8 @(172.5,355.5,45,14)
    数据：原站 onLoad 解析 query.data 为 JSON（form），再调 qualification(form)
          POST /draw/get → 实调 { code:0, msg:"活动不存在" } → 原站保持 loading 遮罩
    说明：原站 chunk 中 qualification 失败时走 .catch(空函数)，loading 永不复位
  -->
  <div class="dr-page">
    <div class="dr-head">
      <div class="dr-head__btn" @click="goBack">
        <i class="dr-head__icon"></i>
      </div>
      <div class="dr-head__title">中签结果</div>
    </div>

    <div class="dr-loading">
      <div class="dr-loading__box">
        <div class="dr-loading__spinner"></div>
        <span class="dr-loading__text">加载中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDrawQualification } from '@/api'

const router = useRouter()
const route = useRoute()
const info = ref({ success_code: [] })

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  // 原站 onLoad：this.form = JSON.parse(query.data)，随后调 qualification(form)
  let form = {}
  try {
    form = JSON.parse(route.query.data || '{}')
  } catch (e) {
    form = {}
  }
  try {
    const res = await getDrawQualification({ form })
    info.value = res.data || { success_code: [] }
  } catch (e) {
    // 原站 catch 为空函数，loading 遮罩保持显示
    info.value = { success_code: [] }
  }
})
</script>

<style scoped>
.dr-page {
  position: relative;
  min-height: 100vh;
  background: #f5f5f5;
}
.dr-head {
  position: relative;
  height: 44px;
  background: #fff;
}
.dr-head__btn {
  position: absolute;
  left: 5px;
  top: 6.5px;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dr-head__icon {
  display: block;
  width: 27px;
  height: 27px;
  font-family: 'uview-icon';
  font-size: 27px;
  line-height: 27px;
  color: #000;
}
.dr-head__icon::before {
  content: '\e601';
}
.dr-head__title {
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
/* 原站 u-loading-page 固定铺满视口，内容整体偏上 74.8px */
.dr-loading {
  position: fixed;
  inset: 0;
  padding-bottom: 154.8px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dr-loading__box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dr-loading__spinner {
  width: 26.8px;
  height: 26.8px;
  border: 2px solid #f4f4f4;
  border-top-color: #c8c8c8;
  border-radius: 100px;
  animation: dr-spin 1.2s ease-in-out infinite;
}
@keyframes dr-spin {
  to {
    transform: rotate(360deg);
  }
}
.dr-loading__text {
  margin-top: 9px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color: #c8c8c8;
}
</style>
