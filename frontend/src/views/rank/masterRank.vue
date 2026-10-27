<template>
  <!--
    原站 pages/rank/masterRank（大师动态）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：整页 390x844 背景 rgb(26,16,2)（深棕纯色）
            navbar 390x44 背景同色
            返回 back-btn-white.png 24x24 @(13,10)
            标题「大师动态」15px bold #fff @(165,16,60,16)
            原站无任何列表内容（接口 data:[]）
    端点：POST /user/masterlist { page:1 } → { code:1, data:[] }
  -->
  <div class="mr-page">
    <div class="mr-nav">
      <div class="mr-nav__back" @click="goBack"></div>
      <span class="mr-nav__title">大师动态</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserMasterList } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/rank/rankList')
}

onMounted(async () => {
  try {
    await getUserMasterList({ page: 1 })
  } catch (e) {
    // 原站接口返回空数组，页面保持空白
  }
})
</script>

<style scoped>
.mr-page {
  position: relative;
  min-height: 100vh;
  background: rgb(26, 16, 2);
  overflow: hidden;
}
.mr-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(26, 16, 2);
}
.mr-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn-white.png') no-repeat 0 0 / 100% 100%;
}
.mr-nav__title {
  position: absolute;
  left: 165px;
  top: 16px;
  width: 60px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  text-align: center;
}
</style>
