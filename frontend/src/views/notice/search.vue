<template>
  <!--
    原站 pages/notice/search（金标准实测 2026-10-25 登录后抓取，390x844）
    容器实际底色 #101115（pageBg 探针读到 uni-page-body 的 #f7f7f8，实际可见层为黑底容器）
    结构：diy-nav 44px
      → 返回（uicon-arrow-left 码点 e60e 20px @(13,12)，色 #f4dcaa）
      → u-search__content (59,5,319,34) bg #1e1b16 br100px border 1px #655032
          搜索图标 search3.webp 22x22 @(70,11)
          input (97,6,265,32) 文字色 #f4dcaa，placeholder 14px #8a8172 @(97,15)
      → 「搜索」action 14px #303133 @(378,16,28,15)（原站溢出视口右侧，此处保留同样几何）
      → 列表项：标题 14px fw500 #ede6d6 @(41,69)，日期 11px #8a8172 @(41,98)，
                 右侧类型标签 fsc-news__tag 60x22 br4px @(301,95)
    交互：输入关键词回车 → POST /index/afficheList { search, page }
      实调（search="嗒"）返回 total:11 的公告列表
  -->
  <div class="ns-page">
    <div class="ns-nav">
      <div class="ns-nav__back" @click="goBack">
        <i class="ns-nav__back-icon"></i>
      </div>
      <div class="ns-search__box">
        <img class="ns-search__icon" src="/assets/img/p0/icon/search3.webp" alt="" />
        <input
          v-model="keyword"
          class="ns-search__input"
          type="search"
          placeholder="请输入搜索内容"
          placeholder-class="ns-search__ph"
          confirm-type="search"
          @confirm="onSearch"
          @keyup.enter="onSearch"
        />
      </div>
      <span class="ns-search__action" @click="onSearch">搜索</span>
    </div>

    <div class="ns-list">
      <div v-if="loading" class="ns-loading">
        <div class="ns-loading__spinner"></div>
        <span class="ns-loading__text">加载中</span>
      </div>
      <div v-else-if="searched && list.length === 0" class="ns-empty">
        <img class="ns-empty__img" src="/assets/img/p0/empty/search-empty.png" alt="" />
      </div>
      <div v-for="item in list" v-else :key="item.id" class="ns-item" @click="goDetail(item)">
        <div class="ns-item__head">
          <span class="ns-item__title">{{ item.title }}</span>
          <span class="ns-item__tag" :style="{ background: tagBg(item.affiche_type) }">
            <span class="ns-item__tag-text">{{ item.affiche_type }}</span>
          </span>
        </div>
        <span class="ns-item__date">{{ formatDate(item.createtime) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { searchAfficheList } from '@/api'

const router = useRouter()
const keyword = ref('')
const list = ref([])
const loading = ref(false)
const searched = ref(false)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/notice/notice')
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

/**
 * 公告类型标签配色（原站 fsc-news__tag 背景色随类型变化，实测样本）
 * 运营公告=绿 #8ddd10 / 合成公告=蓝 #1b53f7 / 寄售公告=绿 #4aca89
 */
function tagBg(type) {
  const map = {
    运营公告: '#8ddd10',
    合成公告: '#1b53f7',
    寄售公告: '#4aca89',
    置换公告: '#9851d0'
  }
  return map[type] || '#8a8172'
}

function goDetail(item) {
  router.push({ path: '/pages/notice/noticeDetails', query: { id: item.id } })
}

/** 搜索：原站输入关键词后 POST /index/afficheList { search, page } */
async function onSearch() {
  loading.value = true
  try {
    const res = await searchAfficheList(keyword.value.trim(), 1)
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  } finally {
    searched.value = true
    loading.value = false
  }
}

onMounted(async () => {
  // 原站首屏即请求一次（search 为空）
  await onSearch()
})
</script>

<style scoped>
.ns-page {
  min-height: 100vh;
  background: #101115;
}
.ns-nav {
  position: relative;
  height: 44px;
  overflow: hidden;
}
.ns-nav__back {
  position: absolute;
  left: 13px;
  top: 12px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ns-nav__back-icon {
  display: block;
  width: 20px;
  height: 20px;
  font-family: 'uview-icon';
  font-size: 20px;
  line-height: 20px;
  color: #f4dcaa;
}
.ns-nav__back-icon::before {
  content: '\e60e';
}
.ns-search__box {
  position: absolute;
  left: 59px;
  top: 5px;
  width: 319px;
  height: 34px;
  background: #1e1b16;
  border: 1px solid #655032;
  border-radius: 100px;
  display: flex;
  align-items: center;
}
.ns-search__icon {
  position: absolute;
  left: 11px;
  top: 6px;
  width: 22px;
  height: 22px;
}
.ns-search__input {
  margin-left: 38px;
  width: 265px;
  height: 32px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #f4dcaa;
  text-align: left;
}
.ns-search__input::placeholder {
  color: #8a8172;
  font-size: 14px;
}
.ns-search__action {
  position: absolute;
  left: 378px;
  top: 16px;
  width: 28px;
  height: 15px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #303133;
  white-space: nowrap;
  cursor: pointer;
}
.ns-list {
  padding: 0 29px 0 41px;
}
.ns-loading {
  margin-top: 208px;
  padding-bottom: 135px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ns-loading__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #dae4ff;
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: ns-spin 1.2s ease-in-out infinite;
}
@keyframes ns-spin {
  to {
    transform: rotate(360deg);
  }
}
.ns-loading__text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
}
.ns-empty {
  margin-top: 208px;
  padding-bottom: 135px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ns-empty__img {
  width: 121px;
  height: 122px;
  display: block;
}
.ns-item {
  padding-top: 19px;
  padding-bottom: 16px;
}
.ns-item__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.ns-item__title {
  width: 294px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #ede6d6;
}
.ns-item__tag {
  flex-shrink: 0;
  width: 60px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ns-item__tag-text {
  font-size: 11px;
  line-height: 16px;
  font-weight: 400;
  color: #fff;
}
.ns-item__date {
  display: block;
  margin-top: 3px;
  font-size: 11px;
  line-height: 16px;
  font-weight: 400;
  color: #8a8172;
}
</style>
