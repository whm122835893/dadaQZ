<template>
  <!--
    原站 pages/blindBox/openRecord（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg flex flex-dir-col（pageBg #f7f7f8）
      → w-navbar 44px：
          返回 back-btn.png 24x24 @(13,10)、标题「开盒记录」15px bold #333 @(165,15.5,60,16)
      → 内容区（flex flex-dir-col flex-ai-center，margin-top 16px，padding-bottom 135px）
          空态 search-empty.png 121x122 @(134.5,60)
    数据：POST /box/blind_box/openlog { blind_box_id, page, list_rows }
          实调 { code:1, msg:"开盲盒记录", data:{ total:0, ... } } → 原站渲染空态
  -->
  <div class="bor-page">
    <div class="bor-nav">
      <div class="bor-nav__back" @click="goBack">
        <div class="bor-nav__back-img"></div>
      </div>
      <span class="bor-nav__title"><span>开盒记录</span></span>
    </div>

    <div class="bor-body">
      <div v-if="list.length === 0" class="bor-empty">
        <img class="bor-empty__img" src="/assets/img/m3/empty/search-empty.png" alt="" />
      </div>
      <div v-for="item in list" v-else :key="item.id" class="bor-item">
        <img class="bor-item__img" :src="item.list_image" alt="" />
        <div class="bor-item__info">
          <span class="bor-item__name">{{ item.goods_name }}</span>
          <span class="bor-item__time">{{ formatTime(item.create_time) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getOpenRecord } from '@/api'

const router = useRouter()
const route = useRoute()
const list = ref([])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/blindBox/index')
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

onMounted(async () => {
  try {
    const res = await getOpenRecord({ blind_box_id: route.query.id || '', page: 1, list_rows: 20 })
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  }
})
</script>

<style scoped>
.bor-page {
  min-height: 100vh;
  background: #f7f7f8;
  display: flex;
  flex-direction: column;
}
.bor-nav {
  position: relative;
  height: 44px;
  flex: none;
}
.bor-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.bor-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/m3/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.bor-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #333;
}
.bor-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #333;
}
.bor-body {
  margin-top: 16px;
  padding-bottom: 135px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bor-empty__img {
  width: 121px;
  height: 122px;
  display: block;
}
.bor-item {
  width: 358px;
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.bor-item__img {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  flex: none;
}
.bor-item__info {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}
.bor-item__name {
  font-size: 14px;
  line-height: 20px;
  color: #111216;
}
.bor-item__time {
  font-size: 10px;
  line-height: 14px;
  color: #85868d;
}
</style>
