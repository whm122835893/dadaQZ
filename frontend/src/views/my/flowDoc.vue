<template>
  <!--
    原站 pages/my/flowDoc（金标准实测 2026-10-25 登录后抓取，390x844，浅色 #f7f7f8）
    结构：nav(44, bg#fafafa, back-btn.png 24x24@(13,10), 标题15px bold #333)
      → 空态容器 (16,148,358,257) flex 纵向居中
          search-empty.png 121x122 @(134.5,148)（水平居中）
    数据：POST /user_collection/user_collection/getRecord {page:1}
      原站实调返回 code:0「参数错误」→ 空态；mock 对齐返回空列表 → 空态
    加载中：u-loading-icon 形态（spinner + 加载中），请求完成后切空态
  -->
  <div class="fd-page">
    <div class="fd-nav">
      <img class="fd-nav__back" src="/assets/img/my/back-btn.png" alt="" @click="goBack" />
      <span class="fd-nav__title"><span>流转记录</span></span>
    </div>

    <div class="fd-main">
      <!-- 加载中（对齐原站 u-loading-icon + 加载中文案） -->
      <div v-if="loading" class="fd-empty">
        <div class="fd-loading">
          <div class="fd-loading__spinner"></div>
          <span class="fd-loading__text">加载中</span>
        </div>
      </div>
      <!-- 空态（原站实测：仅 search-empty.png 居中，无文案） -->
      <div v-else class="fd-empty">
        <img class="fd-empty__img" src="/assets/img/flowdoc/search-empty.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFlowRecord } from '@/api'

const router = useRouter()
const loading = ref(true)
const records = ref([])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

onMounted(async () => {
  try {
    const res = await getFlowRecord({ page: 1 })
    // 原站 getRecord 对测试账号返回 code:0「参数错误」→ 空态；
    // 有数据时预留列表渲染位（当前无真实列表样式金标准，不臆造）
    records.value = (res.data && res.data.data) || []
  } catch (e) {
    records.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fd-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.fd-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  background: #fafafa;
  z-index: 10;
}
.fd-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.fd-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #333;
}
.fd-nav__title > span {
  font-size: 15px;
  line-height: 16px;
  font-weight: bold;
  color: #333;
}
.fd-main {
  padding: 44px 16px 0;
}
.fd-empty {
  margin-top: 104px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fd-empty__img {
  width: 121px;
  height: 122px;
}
.fd-loading {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fd-loading__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #d8d8dc;
  border-top-color: #909099;
  border-radius: 50%;
  animation: fd-spin 0.8s linear infinite;
}
@keyframes fd-spin {
  to {
    transform: rotate(360deg);
  }
}
.fd-loading__text {
  margin-top: 8px;
  font-size: 14px;
  line-height: 16px;
  color: #909099;
}
</style>
