<template>
  <div class="nt-bg">
    <div class="nt-page">
      <div class="nt-main">
        <!-- 左侧分类导航（原站 nt-rail） -->
        <scroll-view class="nt-rail" scroll-y :show-scrollbar="false">
          <div
            v-for="(c, i) in railClasses"
            :key="c.id"
            class="nt-rail-item"
            :class="{ active: railIndex === i }"
            @click="onSelectClass(i)"
          >
            <span v-for="(line, li) in railLines(c.name)" :key="li" class="nt-rail-text">{{ line }}</span>
          </div>
        </scroll-view>

        <div class="nt-divider" />

        <!-- 右侧内容区 -->
        <div class="nt-content">
          <!-- 横幅 -->
          <div class="nt-banner">
            <img class="nt-banner-bg" :src="bannerUrl" alt="" />
            <div class="nt-banner-mask" />
            <div class="nt-banner-texts">
              <span class="nt-banner-brand">嗒嗒Tata</span>
              <span class="nt-banner-title">公告中心</span>
              <span class="nt-banner-sub">每一份动态，及时知晓</span>
              <div class="nt-banner-foot">
                <span class="nt-banner-line" />
                <span class="nt-banner-tag">官方资讯 · 即时更新</span>
              </div>
            </div>
          </div>

          <!-- 小标题 -->
          <div class="nt-subhead">
            <div class="nt-sub-left">
              <span class="nt-sub-name">{{ currentClassName }}</span>
              <i class="nt-caret" />
            </div>
            <span class="nt-sub-right">最新发布</span>
          </div>

          <!-- 列表 -->
          <div class="nt-list">
            <div v-for="n in list" :key="n.id" class="nt-item" @click="goDetail(n)">
              <div class="nt-item-row">
                <span class="nt-tag"><span class="nt-tag-text">{{ n.affiche_type }}</span></span>
                <span class="nt-item-title">{{ n.title }}</span>
              </div>
              <span v-if="n.describe" class="nt-item-desc">{{ n.describe }}</span>
              <span class="nt-item-date">{{ formatDateSimple(n.createtime) }}</span>
            </div>

            <div v-if="loading === 'loading'" class="nt-loading">
              <span class="nt-spinner" />
            </div>
            <div v-else-if="loading === 'empty'" class="nt-empty">
              <img class="nt-empty-img" :src="emptyIcon" alt="" />
              <p class="nt-empty-title">暂无数据</p>
            </div>
            <div v-else-if="!hasMore" class="nt-nomore">没有更多了</div>
          </div>

          <div class="nt-body-bottom" />
        </div>
      </div>
    </div>

    <div class="nt-tabbar-placeholder" />
    <TabBar current="/pages/notice/notice" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { getAfficheList, getAfficheTypeList, getNoticeBanner } from '@/api'
import { OSS_URL, EMPTY_ICON } from '@/config'

const router = useRouter()

/** 左侧分类：初始「全部」，接口返回后在其后追加 6 个分类（原站 onClassesChange） */
const railClasses = ref([{ id: 0, name: '全部' }])
const railIndex = ref(0)

const list = ref([])
const page = ref(1)
const total = ref(0)
const lastPage = ref(1)
const loading = ref('loading')

const bannerUrl = ref('')

const hasMore = computed(() => page.value < lastPage.value)
const currentClassName = computed(
  () => railClasses.value[railIndex.value]?.name || '全部'
)

/** 原站 railLines：名称 ≤3 字单行，否则居中拆两行 */
function railLines(name) {
  const t = String(name || '')
  if (t.length <= 3) return [t]
  const d = Math.ceil(t.length / 2)
  return [t.slice(0, d), t.slice(d)]
}

/** 原站 $tools.formatDateSimple → MM-DD HH:mm */
function formatDateSimple(v) {
  if (typeof v !== 'number' || isNaN(v)) return ''
  const ms = v < 1e12 ? v * 1000 : v
  const d = new Date(ms)
  if (isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

const emptyIcon = EMPTY_ICON

async function loadClasses() {
  const res = await getAfficheTypeList()
  const data = res.data || []
  if (data.length) {
    // 原站左栏：第 1 项固定「全部」(id=0)，其后追加接口返回的分类字典
    railClasses.value = [{ id: 0, name: '全部' }].concat(
      data.map((c) => ({ id: c.id, name: c.name }))
    )
  }
}

async function loadList(reset = false) {
  if (reset) {
    page.value = 1
    loading.value = 'loading'
  } else if (!hasMore.value) {
    return
  }

  const category = railClasses.value[railIndex.value]?.id || 0
  const res = await getAfficheList({
    category,
    page: page.value,
    list_rows: 15
  })
  const data = res.data || {}
  const rows = data.data || []

  total.value = data.total || 0
  lastPage.value = data.last_page || 1
  list.value = reset ? rows : list.value.concat(rows)
  loading.value = list.value.length ? 'none' : 'empty'

  if (!reset) page.value += 1
}

async function loadBanner() {
  const res = await getNoticeBanner()
  if (!res.data) return
  // mock 已本地化（/assets/...），真实接口返回的 /uploads/... 才拼 OSS 前缀
  bannerUrl.value = res.data.startsWith('/assets/') ? res.data : OSS_URL + res.data
}

/** 原站 onSelectClass：切分类即刷新 */
function onSelectClass(i) {
  railIndex.value = i
  loadList(true)
}

/** 原站 goNoticeDetail */
function goDetail(item) {
  router.push({
    path: '/pages/notice/noticeDetails',
    query: { id: item.id, category: item.affiche_type }
  })
}

onMounted(async () => {
  await loadBanner()
  await loadClasses()
  await loadList(true)
})
</script>

<style scoped>
/* rpx → px：390 / 750 = 0.52 */
.nt-bg {
  min-height: 100vh;
  background: radial-gradient(416px 312px at 30% -62.4px, rgba(120, 92, 55, 0.3), rgba(3, 3, 3, 0) 70%),
    #101115;
  color: #f8f8f8;
}
.nt-page {
  min-height: 100vh;
}
.nt-main {
  display: flex;
  align-items: flex-start;
  padding-top: 15.6px;
}

/* 左侧分类 */
.nt-rail {
  width: 45.24px;
  margin-left: 17.16px;
  max-height: 572px;
}
.nt-rail-item {
  width: 45.24px;
  height: 50.96px;
  border-radius: 8.32px;
  background: #1b1813;
  background-image: url('/assets/img/notice/tab.webp');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 14.04px;
  cursor: pointer;
}
.nt-rail-text {
  font-size: 10.92px;
  line-height: 14.56px;
  color: #c8b99a;
  text-align: center;
}
.nt-rail-item.active .nt-rail-text {
  color: #f4dcaa;
  font-weight: 700;
}

/* 分隔线 */
.nt-divider {
  width: 0.52px;
  height: 572px;
  background: #26231d;
  margin: 0 9.88px 0 11.96px;
}

/* 右侧内容 */
.nt-content {
  flex: 1;
  min-width: 0;
  padding-right: 23.92px;
}

/* 横幅 */
.nt-banner {
  position: relative;
  width: 100%;
  height: 120.12px;
  border-radius: 8.32px;
  overflow: hidden;
  border: 0.52px solid #655032;
}
.nt-banner-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 120.12px;
  object-fit: cover;
}
.nt-banner-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 120.12px;
  background: linear-gradient(180deg, rgba(8, 8, 8, 0.62), rgba(8, 8, 8, 0) 60%);
}
.nt-banner-texts {
  position: absolute;
  left: 13px;
  top: 13px;
  right: 13px;
  bottom: 13px;
  display: flex;
  flex-direction: column;
}
.nt-banner-brand {
  font-size: 9.88px;
  color: #f4dcaa;
}
.nt-banner-title {
  font-size: 20.8px;
  font-weight: 700;
  color: #f9e5b9;
  margin-top: 3.12px;
}
.nt-banner-sub {
  font-size: 8.84px;
  color: #c4b494;
  margin-top: 5.2px;
}
.nt-banner-foot {
  display: flex;
  align-items: center;
  margin-top: auto;
}
.nt-banner-line {
  width: 11.96px;
  height: 1.04px;
  background: #b1945d;
}
.nt-banner-tag {
  font-size: 8.32px;
  color: #c6b690;
  margin-left: 6.24px;
}

/* 小标题 */
.nt-subhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 13px;
}
.nt-sub-left {
  display: flex;
  align-items: center;
}
.nt-sub-name {
  font-size: 13px;
  font-weight: 700;
  color: #f0e7d8;
}
.nt-caret {
  width: 0;
  height: 0;
  border-left: 4.16px solid transparent;
  border-right: 4.16px solid transparent;
  border-top: 5.2px solid #f4dcaa;
  margin-left: 6.24px;
}
.nt-sub-right {
  font-size: 8.84px;
  color: #8e826f;
}

/* 列表 */
.nt-list {
  margin-top: 7.8px;
}
.nt-item {
  background: #181713;
  border: 0.52px solid #352d20;
  border-radius: 8.32px;
  padding: 11.44px 13.52px;
  margin-bottom: 10.92px;
  cursor: pointer;
}
.nt-item-row {
  display: flex;
  align-items: center;
}
.nt-tag {
  background: #312919;
  border-radius: 4.16px;
  padding: 2.08px 7.28px;
  flex-shrink: 0;
}
.nt-tag-text {
  font-size: 9.36px;
  color: #f4dcaa;
}
.nt-item-title {
  flex: 1;
  min-width: 0;
  margin-left: 6.24px;
  font-size: 10.92px;
  color: #f0e7d8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nt-item-desc {
  display: block;
  margin-top: 7.28px;
  font-size: 10.4px;
  color: #c6bdad;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nt-item-date {
  display: block;
  margin-top: 7.28px;
  text-align: right;
  font-size: 8.84px;
  color: #8e8576;
}

.nt-body-bottom {
  height: 20.8px;
}

/* 加载 / 空态 */
.nt-loading {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.nt-spinner {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(244, 220, 170, 0.25);
  border-top-color: #f4dcaa;
  border-radius: 50%;
  animation: ntSpin 0.8s linear infinite;
}
@keyframes ntSpin {
  to {
    transform: rotate(360deg);
  }
}
.nt-empty {
  padding: 50px 0;
  text-align: center;
}
.nt-empty-img {
  width: 121.68px;
}
.nt-empty-title {
  margin: 8.32px 0 0;
  font-size: 7.28px;
  color: #333;
}
.nt-nomore {
  text-align: center;
  padding: 16px 0;
  font-size: 6.24px;
  color: #ababab;
}

/* 底部占位 */
.nt-tabbar-placeholder {
  height: 104px;
}
</style>
