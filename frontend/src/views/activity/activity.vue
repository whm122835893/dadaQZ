<template>
  <div class="ac-bg">
    <!-- tab：发售 / 合成 -->
    <div class="ac-tabs-wrap">
      <div class="ac-tabs-scroll">
        <div class="ac-tabs-list">
          <div
            v-for="(t, i) in tabs"
            :key="t"
            class="ac-tab-item"
            :class="{ active: currentTab === i }"
            @click="switchTab(i)"
          >
            <span class="ac-tab-text">{{ t }}</span>
            <i v-if="currentTab === i" class="ac-tab-line" />
          </div>
        </div>
      </div>
    </div>

    <div class="ac-list">
      <!-- 发售 -->
      <template v-if="currentTab === 0">
        <div
          v-for="g in collectionList"
          :key="g.id + String(g.batch_id)"
          class="ac-card"
          @click="goSaleDetail(g)"
        >
          <div class="ac-card-img">
            <img class="ac-card-img-el" :src="imgUrl(g.listimg)" alt="" />
            <div class="ac-img-fade" />
            <div class="ac-pill" :class="{ 'ac-pill-gray': saleStatus(g).status === 2 }">
              <i class="ac-pill-dot" />
              <span class="ac-pill-text">{{ salePillText(g) }}</span>
            </div>
          </div>
          <div class="ac-card-body">
            <p class="ac-card-title">{{ g.name }}</p>
            <div class="ac-card-foot">
              <div class="ac-tags">
                <span v-for="(tg, ti) in saleTagList(g)" :key="ti" class="ac-tag">{{ tg }}</span>
              </div>
              <span v-if="salePriceText(g)" class="ac-price">{{ salePriceText(g) }}</span>
            </div>
          </div>
        </div>
        <div v-if="!collectionList.length" class="empty-box">
          <img class="empty-img" :src="EMPTY_IMG" alt="" />
          <span class="empty-text">暂无发售活动</span>
        </div>
      </template>

      <!-- 合成 -->
      <template v-else-if="currentTab === 1">
        <div
          v-for="c in compoundList"
          :key="c.id"
          class="ac-card"
          @click="goCompound(c)"
        >
          <div class="ac-card-img">
            <img class="ac-card-img-el" :src="imgUrl(c.image)" alt="" />
            <div class="ac-img-fade" />
            <div class="ac-pill" :class="{ 'ac-pill-gray': compoundStatus(c).status === 2 }">
              <i class="ac-pill-dot" />
              <span class="ac-pill-text">{{ compoundPillText(c) }}</span>
            </div>
          </div>
          <div class="ac-card-body ac-card-body-cp">
            <p class="ac-card-title">{{ c.title }}</p>
            <p class="ac-card-desc">消耗指定藏品，合成全新作品</p>
            <p v-if="compoundProgressText(c)" class="ac-card-progress">{{ compoundProgressText(c) }}</p>
            <div
              class="ac-btn"
              :class="{ 'ac-btn-disabled': compoundStatus(c).status === 2 }"
              @click.stop="goCompound(c)"
            >
              {{ compoundBtnText(c) }}
            </div>
          </div>
        </div>
        <div v-if="!compoundList.length" class="empty-box">
          <img class="empty-img" :src="EMPTY_IMG" alt="" />
          <span class="empty-text">暂无合成活动</span>
        </div>
      </template>

      <div v-else class="empty-box">
        <img class="empty-img" :src="EMPTY_IMG" alt="" />
        <span class="empty-text">敬请期待</span>
      </div>
    </div>

    <!-- 合成材料方案选择弹层 -->
    <div v-if="showPop" class="pop-mask" @click="showPop = false">
      <div class="pop-panel" @click.stop>
        <div class="pop-head">
          <span class="pop-title">请选择合成材料</span>
          <span class="pop-close" @click="showPop = false">✕</span>
        </div>
        <div class="scheme-list">
          <div v-for="m in materialsList" :key="m.grp" class="scheme-item">
            <span class="scheme-title">{{ m.title }}</span>
            <span class="scheme-btn" @click="selectScheme(m)">选择</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showToast" class="toast-mask" @click="showToast = false">
      <div class="toast-box">
        <span class="toast-text">您未获得合成资格</span>
      </div>
    </div>

    <div class="ac-tabbar-placeholder" />
    <TabBar current="/pages/activity/activity" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { getBlindBoxList, getSynthesisTheme, getSynthesisMaterial } from '@/api'
import { OSS_URL } from '@/config'
import { useConfigStore } from '@/stores/config'

const router = useRouter()
const configStore = useConfigStore()

const tabs = ['发售', '合成']
const currentTab = ref(0)

const collectionList = ref([])
const compoundList = ref([])
const materialsList = ref([])
const popClassify = ref('')
const showPop = ref(false)
const showToast = ref(false)

const EMPTY_IMG = '/assets/img/activity/search-empty.webp'
const OSS = OSS_URL

/** 原站图片为 OSS 相对路径；本地 mock 已带绝对路径，故做兼容判断 */
function imgUrl(p) {
  if (!p) return ''
  if (/^https?:\/\//.test(p)) return p
  if (p.startsWith('/assets/')) return p
  return OSS_URL + p
}

const nowTimestamp = computed(() => configStore.nowTimestamp)

/* ---------------- 原站 saleStatus / compoundStatus ---------------- */

/** 返回 0=未开始 1=进行中 2=已结束 */
function checkTimeBetween(now, start, end) {
  const s = Number(start) * 1000
  const e = Number(end) * 1000
  if (!s || !e) return 1
  if (now < s) return 0
  if (now > e) return 2
  return 1
}

function saleStatus(g) {
  const start = g.sale_start_time || g.start_time
  const end = g.sale_end_time || g.end_time
  if (!start || !end) return { text: '进行中', status: 1 }
  const status = checkTimeBetween(nowTimestamp.value, start, end)
  return { text: ['未开始', '进行中', '已结束'][status], status }
}

function compoundStatus(c) {
  if (c.stock === 0) return { text: '已结束', status: 2 }
  const status = checkTimeBetween(nowTimestamp.value, c.real_start_time, c.real_end_time)
  return { text: ['未开始', '进行中', '已结束'][status], status }
}

/* ---------------- 原站时间格式化 ---------------- */

/** 原站 $u.timeFormat(ts, fmt)，支持 mm-dd hh:MM:ss / yyyy-mm-dd hh:MM:ss / mm-dd hh:MM / mm-dd */
function pad(n) {
  return String(n).padStart(2, '0')
}
function toDate(ts) {
  const n = Number(ts)
  if (!n) return null
  const ms = n > 1e12 ? n : n * 1000
  const d = new Date(ms)
  return isNaN(d.getTime()) ? null : d
}
function timeFormat(ts, fmt) {
  const d = toDate(ts)
  if (!d) return ''
  const Y = d.getFullYear()
  const M = pad(d.getMonth() + 1)
  const D = pad(d.getDate())
  const h = pad(d.getHours())
  const H = pad(d.getMinutes())
  const S = pad(d.getSeconds())
  // 原站 uView timeFormat 中 MM=分钟、mm=月，按原站调用约定替换
  return fmt
    .replace('yyyy', Y)
    .replace('mm', M)
    .replace('dd', D)
    .replace('hh', h)
    .replace('MM', H)
    .replace('ss', S)
}

/* ---------------- 原站文案方法 ---------------- */

function salePillText(g) {
  const st = saleStatus(g)
  const d = g.release_date_time_text ? String(g.release_date_time_text).slice(5) : ''
  const end = g.sale_end_time || g.end_time
  const e = end ? timeFormat(end, 'mm-dd') : ''
  if (st.status === 0) return '敬请期待' + (d ? ` ${d} 开始` : '')
  if (st.status === 2) return '已结束' + (d ? ` ${d}` : '')
  return '进行中' + (d ? ` ${d}` : '') + (e ? ` — ${e}` : '')
}

function saleTagList(g) {
  const tags = []
  const name = g.series_name ? g.series_name : ''
  tags.push(name ? name : '数字艺术')
  const total =
    g.total_num !== undefined && g.total_num !== null
      ? g.total_num
      : g.batch && g.batch.total_num !== undefined && g.batch.total_num !== null
        ? g.batch.total_num
        : null
  if (total !== null && Number(total) > 0) tags.push(`限量 ${total} 份`)
  if (Number(g.goods_type) === 2 && Number(g.sale_status_text) === 3) tags.push('已售罄')
  return tags
}

function salePriceText(g) {
  return g.price === undefined || g.price === null || g.price === '' ? '' : `¥${g.price}`
}

function compoundPillText(c) {
  const st = compoundStatus(c)
  const d = c.real_start_time ? timeFormat(c.real_start_time, 'mm-dd hh:MM') : ''
  const end = c.real_end_time ? timeFormat(c.real_end_time, 'mm-dd') : ''
  if (st.status === 0) return '敬请期待' + (d ? ` ${d} 开始` : '')
  if (st.status === 2) return '已结束'
  return '进行中' + (d ? ` ${d}` : '') + (end ? ` — ${end}` : '')
}

function compoundProgressText(c) {
  const done = c.done_num !== undefined && c.done_num !== null ? c.done_num : null
  const total = c.total_num !== undefined && c.total_num !== null ? c.total_num : null
  if (done !== null && total !== null) return `已合成 ${done} / ${total}`
  if (c.stock !== undefined && c.stock !== null && c.stock !== '') return `剩余 ${c.stock} 份`
  return ''
}

function compoundBtnText(c) {
  return compoundStatus(c).status === 2 ? '已结束' : '去合成'
}

/* ---------------- 数据加载与跳转 ---------------- */

async function getCollectionList() {
  const res = await getBlindBoxList({ goods_type: '', list_rows: 30, page: 1 })
  collectionList.value = res.data || []
}

async function getCompoundInfo() {
  const res = await getSynthesisTheme(1)
  compoundList.value = (res.data && res.data.play) || []
}

function switchTab(i) {
  currentTab.value = i
  if (i === 0) getCollectionList()
  else if (i === 1) getCompoundInfo()
}

/** 原站 goSaleDetail */
function goSaleDetail(g) {
  if (Number(g.goods_type) === 1) router.push({ path: '/pages/product/box', query: { id: g.id } })
  else
    router.push({
      path: '/pages/product/collection',
      query: { id: g.id, batch_id: g.batch_id }
    })
}

/** 原站 goCompound：拉材料方案，有则弹层，4003 提示无资格，3003 直接进详情 */
async function goCompound(c) {
  const res = await getSynthesisMaterial({ play_id: c.id, classify: c.classify })
  const list = res.data || []
  materialsList.value = list
  if (list.length) {
    popClassify.value = c.classify
    showPop.value = true
  } else {
    router.push({
      path: '/pages/compound/schemeDetails',
      query: { play_id: c.id, classify: c.classify, grp: '' }
    })
  }
}

function selectScheme(m) {
  showPop.value = false
  router.push({
    path: '/pages/compound/schemeDetails',
    query: { play_id: m.play_id, classify: popClassify.value, grp: m.grp }
  })
}

let timer = null
onMounted(() => {
  configStore.tick()
  timer = setInterval(() => configStore.tick(), 1000)
  getCollectionList()
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* rpx → px：390 / 750 = 0.52 */
.ac-bg {
  min-height: 100vh;
  background: #101115;
  color: #f8f8f8;
  padding-top: calc(env(safe-area-inset-top) + 44px);
}

/* tab */
.ac-tabs-wrap {
  padding: 16.64px 23.92px 0;
}
.ac-tabs-scroll {
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
}
.ac-tabs-scroll::-webkit-scrollbar {
  display: none;
}
.ac-tabs-list {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.ac-tab-item {
  position: relative;
  margin-right: 32.24px;
  padding-bottom: 10.4px;
  font-size: 15.08px;
  color: #98999c;
  cursor: pointer;
  white-space: nowrap;
}
.ac-tab-item:last-child {
  margin-right: 0;
}
.ac-tab-text {
  font-size: 15.08px;
}
.ac-tab-item.active .ac-tab-text {
  color: #f4dcaa;
  font-weight: 700;
}
.ac-tab-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 30.16px;
  height: 2.08px;
  border-radius: 1.04px;
  background: #f4dcaa;
}

/* 卡片列表 */
.ac-list {
  padding: 21.84px 23.92px 0;
}
.ac-card {
  background: #030303;
  border: 0.52px solid #2a2318;
  border-radius: 12.48px;
  margin-bottom: 21.84px;
  overflow: hidden;
  cursor: pointer;
}
.ac-card-img {
  position: relative;
  width: 100%;
  height: 180.96px;
  overflow: hidden;
}
.ac-card-img-el {
  width: 100%;
  height: 180.96px;
  object-fit: cover;
  display: block;
}
.ac-img-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 22.88px;
  background: linear-gradient(180deg, rgba(3, 3, 3, 0), rgba(3, 3, 3, 0.96));
}
.ac-pill {
  position: absolute;
  left: 11.96px;
  top: 9.88px;
  height: 21.84px;
  display: flex;
  align-items: center;
  padding: 0 12.48px 0 9.36px;
  box-sizing: border-box;
  background: #302a22;
  border: 0.52px solid #8d7855;
  border-radius: 10.92px;
  z-index: 2;
}
.ac-pill-gray {
  background: #26262a;
  border-color: #55565c;
}
.ac-pill-gray .ac-pill-dot {
  background: #98999c;
}
.ac-pill-dot {
  width: 3.64px;
  height: 3.64px;
  border-radius: 50%;
  background: #f4dcaa;
  margin-right: 7.28px;
  flex-shrink: 0;
}
.ac-pill-text {
  font-size: 10.4px;
  color: #f4dcaa;
  white-space: nowrap;
}
.ac-pill-gray .ac-pill-text {
  color: #98999c;
}

.ac-card-body {
  padding: 11.96px 14.04px 24.96px;
}
.ac-card-title {
  margin: 0;
  font-size: 14.04px;
  color: #f8f8f8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ac-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 21.84px;
}
.ac-tags {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}
.ac-tag {
  height: 19.76px;
  line-height: 18.72px;
  padding: 0 9.36px;
  box-sizing: border-box;
  border: 0.52px solid #f4dcaa;
  border-radius: 9.88px;
  font-size: 10.4px;
  color: #f4dcaa;
  margin-right: 7.8px;
  white-space: nowrap;
  flex-shrink: 0;
}
.ac-tag:last-child {
  margin-right: 0;
}
.ac-price {
  font-size: 19.76px;
  color: #f4dcaa;
  margin-left: 10.4px;
  flex-shrink: 0;
}

/* 合成卡片 */
.ac-card-body-cp {
  position: relative;
}
.ac-card-desc {
  margin: 8.32px 0 0;
  font-size: 10.4px;
  color: #98999c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ac-card-progress {
  margin: 9.36px 0 0;
  font-size: 9.88px;
  color: #f4dcaa;
}
.ac-btn {
  position: absolute;
  right: 14.04px;
  bottom: 24.96px;
  width: 66.04px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4dcaa;
  border-radius: 13px;
  font-size: 11.96px;
  font-weight: 700;
  color: #261f15;
}
.ac-btn-disabled {
  background: #4b4640;
  color: #a9a49c;
}

/* 空态 */
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}
.empty-img {
  width: 130px;
}
.empty-text {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

/* 弹层 */
.pop-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}
.pop-panel {
  width: 100%;
  background: #1a1815;
  border-radius: 16px 16px 0 0;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
.pop-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.pop-title {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}
.pop-close {
  font-size: 15px;
  color: #98999c;
  cursor: pointer;
}
.scheme-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.scheme-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #232019;
  border: 0.5px solid #3a3327;
  border-radius: 10px;
}
.scheme-title {
  font-size: 12px;
  color: #f8f8f8;
}
.scheme-btn {
  font-size: 11px;
  color: #261f15;
  background: #f4dcaa;
  border-radius: 12px;
  padding: 4px 14px;
  cursor: pointer;
}

/* toast */
.toast-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast-box {
  background: rgba(20, 20, 20, 0.92);
  border: 0.5px solid #3a3327;
  border-radius: 10px;
  padding: 18px 26px;
}
.toast-text {
  font-size: 13px;
  color: #f8f8f8;
}

/* 底部占位 */
.ac-tabbar-placeholder {
  height: 104px;
}
</style>
