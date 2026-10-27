<template>
  <!--
    原站 pages/marketCapRanking/marketCapRanking（市值排行榜，浅色主题）
      script 模块（chunk pages-marketCapRanking-marketCapRanking.831bf341.js）
        data:
          show   = false            ← 排行说明弹窗开关
          list   = []               ← 榜单数据（getList 赋值）
          loading = true
        onLoad → getList()
        getList() → ranking() → A.list = a.data（详见 api/index.js 注释：原站此处有脏数据 bug）
        computed.info → mapState('config')['info']（update_time / market_desc）
      render（scope a3aa3682）
        w-container
          w-navbar(leftIconColor #fff, autoBack, bgColor unset)
          v-uni-view.content_box  (padding 0 32rpx; position absolute; top 220rpx)
            行1：flex flex-ai-center flex-js-sb
              左：font-color-white font-size-12 → "每日" + info.update_time + "更新"
              右：flex flex-ai-center @click show=!0
                u-icon(name = localBgUrl + "icon_question.png")
                v-uni-view.font-color-white.font-size-12.ml-2 → "排行说明"
            u-gap(height 15)
            v-uni-scroll-view(height calc(100vh - 300rpx))
              w-marketCapRanking(list)      ← 榜单卡片组件（scope 2c26f6ac）
              w-loading（loading||list.length 时不渲染）
          u-modal(width 540rpx, title "市值排行榜规则", confirmText "知道了", confirmColor #165DFF)
            u-parse(content = handleLang(info.market_desc))
  -->
  <div class="rank-page">
    <!-- 顶部导航（原站 w-navbar：透明背景 + 白色返回箭头） -->
    <div class="rank-navbar">
      <img class="rank-navbar__back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
    </div>

    <!-- 内容区（原站 .content_box：padding 0 32rpx，top 220rpx 绝对定位） -->
    <div class="content_box">
      <!-- 头部行：更新说明 + 排行说明入口 -->
      <div class="rank-head">
        <span class="rank-head__update">每日{{ info.update_time }}更新</span>
        <div class="rank-head__help" @click="show = true">
          <img class="rank-head__icon" src="/assets/img/rank/icon_question.png" alt="" />
          <span class="rank-head__help-text">排行说明</span>
        </div>
      </div>

      <div class="u-gap"></div>

      <!-- 榜单列表（原站 w-marketCapRanking 组件根节点带 .mt-12 = 24rpx = 12.48px 上边距） -->
      <div class="rank-list">
        <div class="rank-list__inner mt-12">
        <div
          v-for="(item, index) in list"
          :key="item.id ?? index"
          class="ranking_box"
          :style="{ backgroundColor: index < 3 ? '#B0A6A0' : '#fff' }"
        >
          <!-- 名次：前 3 名显示奖牌，其余显示序号 -->
          <div class="number_box">
            <img
              v-if="index < 3"
              class="pay_icon"
              :src="`/assets/img/rank/${runkingImages[index]}`"
              alt=""
            />
            <span v-else class="number_box__text">{{ index + 1 }}</span>
          </div>

          <!-- 用户：头像 + 昵称 -->
          <div class="user_box">
            <img class="photo" :src="imgUrl(item.listimg)" alt="" />
            <span class="user_box__name">{{ item.name }}</span>
          </div>

          <!-- 流通量 + 最低价 -->
          <div class="liu_box">
            <div class="rank-tag">
              <span class="rank-tag__name">流通:</span>
              <span class="rank-tag__value">{{ item.flux }}份</span>
            </div>
            <div class="liu_box__min">最低价:{{ item.minprice }}</div>
          </div>

          <!-- 市值 -->
          <div class="shizhi_box">
            <span class="shizhi_box__label">市值</span>
            <span class="shizhi_box__value">{{ item.market_value }}</span>
          </div>
        </div>

        <!-- 空态（原站 w-loading type=empty emptyType=search emptyTop=200） -->
        <div v-if="!loading && !list.length" class="rank-empty">
          <img class="rank-empty__img" src="/assets/img/empty/search-empty.png" alt="" />
        </div>
        <div v-else-if="loading" class="rank-loading">加载中...</div>
        </div>
      </div>
    </div>

    <!-- 排行说明弹窗（原站 u-modal） -->
    <div v-if="show" class="rank-modal" @click.self="show = false">
      <div class="rank-modal__box">
        <div class="rank-modal__title">市值排行榜规则</div>
        <div class="rank-modal__body">
          <div class="rank-modal__scroll" v-html="info.market_desc"></div>
        </div>
        <div class="rank-modal__actions">
          <div class="rank-modal__btn" @click="show = false">知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 市值排行榜页（对应原站 pages/marketCapRanking/marketCapRanking）
 *   - 浅色主题（页面底 #f7f7f8）
 *   - 数据来源：POST /user/ranking
 *   - 原站榜单组件 w-marketCapRanking（scope 2c26f6ac）逐节点复刻
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMarketCapRanking } from '@/api'

const router = useRouter()

const show = ref(false)
const loading = ref(true)
const list = ref([])

/** 榜单配置信息（原站来自 vuex config.info） */
const info = ref({
  update_time: '10-24 10:00',
  market_desc: '<p>市值排行榜按持有藏品的市场流通总价值实时计算，每 24 小时更新一次。</p>'
})

/** 前三名奖牌图（对应原站 runkingImages） */
const runkingImages = {
  0: 'ranking_one.png',
  1: 'ranking_two.png',
  2: 'ranking_three.png'
}

/** 头像地址（原站 $originOssUrl + listimg） */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/assets') || src.startsWith('/static')) return src
  return src
}

/** 拉取榜单 */
function getList() {
  loading.value = true
  getMarketCapRanking()
    .then((res) => {
      const d = res.data || {}
      // 原站取整个 a.data（对象）导致脏数据，这里取 data 数组（详见 api/index.js 注释）
      list.value = Array.isArray(d.data) ? d.data : []
      if (d.update_time) info.value.update_time = d.update_time
      if (d.market_desc) info.value.market_desc = d.market_desc
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/market/market')
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
/*
 * 原站 scope a3aa3682（页面）+ 2c26f6ac（榜单卡片）
 * 盒模型已用 Playwright 实测原站逐项核对：
 *   .content_box  0,114 390x721  padding 0 16px
 *   .u-gap        16,132 358x15
 *   .ranking_box  16,159 346x62  padding 12px 8px 9px 4px  margin-bottom 12px
 *   .number_box   20,175 31x34
 *   .user_box     56,171 141x41
 *   .photo        56,171 41x41
 *   .liu_box      209,174 93x36
 *   .shizhi_box   302,183 52x18
 */
.rank-page {
  min-height: 100vh;
  background: #f7f7f8;
  position: relative;
}

/* 顶部导航 */
.rank-navbar {
  position: relative;
  height: 44px;
}
.rank-navbar__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}

/* 内容区 */
.content_box {
  padding: 0 16px;
  width: 100%;
  position: absolute;
  top: 114px;
  left: 0;
}

/* 头部行 */
.rank-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.rank-head__update {
  font-size: 12px;
  line-height: 18px;
  color: #fff;
}
.rank-head__help {
  display: flex;
  align-items: center;
}
.rank-head__icon {
  width: 14px;
  height: 14px;
}
.rank-head__help-text {
  margin-left: 2px;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
}

/* 间隔 */
.u-gap {
  height: 15px;
}

/* 榜单列表 */
.rank-list {
  /* 原站 scroll-view 高度 calc(100vh - 300rpx) = calc(100vh - 156px) */
  height: calc(100vh - 156px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.rank-list__inner {
  margin-top: 12px;
}

/* 榜单卡片 */
.ranking_box {
  width: calc(100% - 12px);
  padding: 12px 8px 9px 4px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

/* 名次 */
.number_box {
  width: 31px;
  margin-right: 5px;
  text-align: center;
}
.pay_icon {
  width: 31px;
  height: 31px;
}
.number_box__text {
  display: block;
  font-weight: 700;
  color: #23262f;
}

/* 用户 */
.user_box {
  width: 141px;
  margin-right: 12px;
  display: flex;
  align-items: center;
}
.photo {
  min-width: 41px;
  max-width: 41px;
  height: 41px;
  border-radius: 50%;
  object-fit: cover;
}
.user_box__name {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #23262f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 流通量 + 最低价 */
.liu_box {
  width: 93px;
  display: flex;
  flex-direction: column;
}
/* w-tag（tag-size-default）：name 为内联底图 + value 浅色底 */
.rank-tag {
  display: flex;
  align-items: center;
  height: 17px;
}
.rank-tag__name {
  position: relative;
  z-index: 2;
  width: 45px;
  height: 17px;
  background: url('/assets/img/tag_tag_name_bg.webp') no-repeat;
  background-size: 100% 100%;
  font-size: 9px;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rank-tag__value {
  position: relative;
  z-index: 1;
  left: -12px;
  height: 17px;
  line-height: 12px;
  padding-left: 15px;
  background: #faf0e7;
  border-radius: 0 3px 3px 0;
  font-size: 9px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}
.liu_box__min {
  margin-top: 4px;
  font-size: 10px;
  line-height: 15px;
  color: #23262f;
}

/* 市值 */
.shizhi_box {
  width: 52px;
  display: flex;
  flex-direction: column;
  text-align: right;
}
.shizhi_box__label {
  font-size: 12px;
  line-height: 18px;
  color: #23262f;
}
.shizhi_box__value {
  font-size: 12px;
  line-height: 18px;
  color: #23262f;
}

/* 空态 */
.rank-empty {
  display: flex;
  justify-content: center;
  padding-top: 104px;
}
.rank-empty__img {
  width: 121px;
  height: 122px;
}
.rank-loading {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 20px 0;
}

/* 排行说明弹窗（原站 u-modal width 540rpx = 280.8px） */
.rank-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.rank-modal__box {
  width: 280.8px;
  background: #fff;
  border-radius: 12.48px;
  overflow: hidden;
}
.rank-modal__title {
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #23262f;
  border-bottom: 1px solid #f0f0f0;
}
.rank-modal__body {
  padding: 16px 16px 0;
}
.rank-modal__scroll {
  max-height: 60vh;
  overflow-y: auto;
  font-size: 13px;
  line-height: 20px;
  color: #666;
}
.rank-modal__scroll :deep(p) {
  margin: 0 0 10px;
}
.rank-modal__actions {
  padding: 16px;
}
.rank-modal__btn {
  height: 41.6px;
  line-height: 41.6px;
  text-align: center;
  border-radius: 6.24px;
  background: #165dff;
  color: #fff;
  font-size: 15px;
}
</style>
