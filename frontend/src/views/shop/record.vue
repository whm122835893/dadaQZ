<template>
  <!--
    原站 pages/shop/record（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container page-bg（pageBg #f7f7f8）
      → w-navbar（transparent，44px）：返回 back-btn.png 24x24 @(13,10)、
        标题「兑换记录」15px bold #333 @(165,15.5,60,16)
      → 内容区 pa-16（padding 16px）
          → 列表项 item：width 100%, height 200rpx(=104px), br 16rpx(=8.32px),
            bg #fff, padding 18rpx(=9.36px), margin-bottom 24rpx(=12.48px)
            ├ w-image 83x83 radius 8
            └ .right（width calc(100% - 186rpx)，flex space-between，align center）
                ├ 上：商品名 16px fw500 #111216 + mt-12 水晶图标 20px + 数量 16px
                └ 下：时间 10px #85868d mt-4
                └ w-icon right3 24x24
          → w-loading 空态：search-empty.png 121x122 @(134.5,268)
    数据：POST /crystal_goods/exchangeRecord { page }
          实调 total:0 → 原站渲染空态
  -->
  <div class="sr-page">
    <div class="sr-nav">
      <div class="sr-nav__back" @click="goBack">
        <div class="sr-nav__back-img"></div>
      </div>
      <span class="sr-nav__title"><span>兑换记录</span></span>
    </div>

    <div class="sr-body">
      <div v-if="loading" class="sr-loading">
        <div class="sr-loading__spinner"></div>
        <span class="sr-loading__text">加载中</span>
      </div>
      <div v-else-if="list.length === 0" class="sr-empty">
        <img class="sr-empty__img" src="/assets/img/p0/empty/search-empty.png" alt="" />
      </div>
      <div v-for="item in list" v-else :key="item.id" class="sr-item" @click="toDetail(item)">
        <img class="sr-item__img" :src="item.list_image" alt="" />
        <div class="sr-item__right">
          <div class="sr-item__top">
            <span class="sr-item__name">{{ item.goods_name }}</span>
            <span class="sr-item__arrow"></span>
          </div>
          <div class="sr-item__crystal">
            <span class="sr-item__crystal-icon"></span>
            <span class="sr-item__crystal-num">{{ item.crystal_number }}</span>
          </div>
          <span class="sr-item__time">{{ formatTime(item.create_time) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCrystalExchangeRecord } from '@/api'

const router = useRouter()
const loading = ref(false)
const list = ref([])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function toDetail(item) {
  router.push({ path: '/pages/order/defaultDetail', query: { id: item.order_id, orderType: 4 } })
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

async function refresh() {
  loading.value = true
  list.value = []
  try {
    const res = await getCrystalExchangeRecord({ page: 1 })
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<style scoped>
.sr-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.sr-nav {
  position: relative;
  height: 44px;
}
.sr-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.sr-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.sr-nav__title {
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
.sr-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #333;
}
.sr-body {
  padding: 16px;
}
.sr-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sr-loading__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #dae4ff;
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: sr-spin 1.2s ease-in-out infinite;
}
@keyframes sr-spin {
  to {
    transform: rotate(360deg);
  }
}
.sr-loading__text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
}
.sr-empty {
  margin-top: 208px;
  padding-bottom: 135px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sr-empty__img {
  width: 121px;
  height: 122px;
  display: block;
}
.sr-item {
  width: 100%;
  height: 104px;
  border-radius: 8px;
  background-color: #fff;
  padding: 9.36px;
  margin-bottom: 12.48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sr-item__img {
  width: 83px;
  height: 83px;
  border-radius: 8px;
  display: block;
  flex: none;
}
.sr-item__right {
  width: calc(100% - 96.72px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.sr-item__top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sr-item__name {
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: #111216;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sr-item__arrow {
  width: 24px;
  height: 24px;
  flex: none;
  font-family: 'uview-icon';
  font-size: 24px;
  line-height: 24px;
  color: #85868d;
}
.sr-item__arrow::before {
  content: '\e603';
}
.sr-item__crystal {
  display: flex;
  align-items: center;
  margin-top: 12px;
}
.sr-item__crystal-icon {
  width: 20px;
  height: 20px;
  display: block;
  background: url('/assets/img/p0/icon/crystal/lsj.png') no-repeat;
  background-size: 100% 100%;
}
.sr-item__crystal-num {
  margin-left: 8px;
  font-size: 16px;
  line-height: 22px;
  color: #111216;
}
.sr-item__time {
  margin-top: 4px;
  font-size: 10px;
  line-height: 14px;
  color: #85868d;
}
</style>
