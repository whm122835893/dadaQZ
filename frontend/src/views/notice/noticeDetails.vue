<template>
  <!--
    原站 pages/notice/noticeDetails（金标准实测 2026-10-26，390×844）
    结构：container page-container plr-16
      → u-navbar（fixed + placeholder 44px；title「公告详情」15px/700 #fff；leftIcon back-btn-white）
      → .pt-10
          标题 .font-size-16.font-w-bold.mb-10   → 16px/700 #C4B494，下边距 10px
          标签+日期 .flex.flex-ai-center.font-size-12
              标签 .mr-4.font-w-500  → 12px/500 #666
              日期 .font-color-999    → 12px #999
          正文卡 .flex.flex-dir-col.plr-20.ptb-12.br-12
              margin-top 15.6px(30rpx)；background #181713；color #fff
              border 1rpx solid #655032；border-radius 12.48px；padding 12px 20px
              内含正文 rich-text + 底部风险提示 .tips（12px #666，行高 24px）
    数据：POST /index/afficheDetail/ids/{id}
      带真实 id → { code:1, msg:"详情", data:{ title, content(HTML), createtime, affiche_type_id } }
      ids/undefined 或已删除 id → { code:0, msg:"这条消失不见了", data:null }
      标签文案来自 URL query 的 category（原站 a.category），不在接口响应里。
  -->
  <div class="nd-page">
    <!-- 原站 u-navbar（fixed + placeholder） -->
    <div class="nd-navbar-placeholder" />
    <div class="nd-navbar">
      <div class="nd-navbar-left" @click="goBack">
        <img class="nd-navbar-back" src="/assets/img/order/back-btn-white.webp" alt="" />
      </div>
      <span class="nd-navbar-title">公告详情</span>
    </div>

    <!-- 原站 u-loading-page：fixed inset:0，居中 spinner 19px + 「加载中...」12px -->
    <div v-if="loading" class="nd-mask">
      <div class="nd-mask__spinner" />
      <span class="nd-mask__text">加载中...</span>
    </div>

    <template v-else-if="detail">
      <div class="nd-content">
        <!-- 标题 -->
        <div class="nd-title">{{ detail.title }}</div>

        <!-- 标签 + 日期 -->
        <div class="nd-meta">
          <span class="nd-tag">{{ tagText }}</span>
          <span class="nd-date">{{ formatDate(detail.createtime) }}</span>
        </div>

        <!-- 正文卡片 -->
        <div class="nd-body">
          <div class="nd-richtext" v-html="detail.content || ''" />

          <!-- 原站 .tips 风险提示（固定文案，位于卡片内底部） -->
          <div class="nd-tips">
            <div class="nd-tips-section">
              <div class="nd-tips-title">【嗒嗒风险提示】：</div>
              <div class="nd-tips-text">
                嗒嗒发售的数字藏品仅具备收藏欣赏价值，官方对藏品价格不构成任何指导意义，请谨慎购买，严防炒作。
              </div>
            </div>
            <div class="nd-tips-section">
              <div class="nd-tips-title">【嗒嗒郑重提醒广大用户】：</div>
              <div class="nd-tips-text">
                平台对于使用第三方工具锁单、抢单，以平台的名义进行承诺收益、承诺回购、非法集资、非法吸收公共存款，为了非法目的进行拉人头、要求缴纳入门费、团队计酬返利等涉嫌传销的行为或故意从事任何对本平台、平台用户或服务的修行品和不良影响的违法行为持零容忍态度，一经发现将采取封号、冻结等措施。请大家规范抢购，不要轻信此类第三方工具或任何非官方的抢购信息，避免造成个人财产损失！根据国家反洗钱、反诈骗等法律法规规定，特提醒广大用户严格遵守国家法律法规，严禁在平台进行洗钱、诈骗、赌博、非法集资、非法吸收公共存款、非法交易、传销等违法行为，否则一经平台查实，将对您的嗒嗒账号作出封禁、冻结等处理，并移交国家司法机关追究其法律责任。
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 原站接口返回 code:0（ids/undefined 或已删除 id）→ msg「这条消失不见了」 -->
    <div v-else class="nd-empty">
      <p class="nd-empty-text">这条消失不见了</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAfficheDetail } from '@/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const detail = ref(null)

/** 标签文案来自 URL query 的 category（原站 a.category），接口不返回 */
const tagText = computed(() => {
  const q = route.query.category
  if (q) return String(q)
  if (detail.value?.affiche_type) return detail.value.affiche_type
  return ''
})

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  if (isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/notice/notice')
}

onMounted(async () => {
  const id = route.query.id || ''
  try {
    const res = await getAfficheDetail(id)
    detail.value = res && res.code === 1 && res.data ? res.data : null
  } catch (e) {
    detail.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.nd-page {
  position: relative;
  min-height: 100vh;
  background: #101115;
  color: #fff;
  padding: 0 16px;
}

/* ============ u-navbar（fixed + placeholder 44px） ============ */
.nd-navbar-placeholder {
  height: 44px;
}
.nd-navbar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  height: 44px;
  z-index: 11;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nd-navbar-left {
  position: absolute;
  left: 0;
  top: 0;
  height: 44px;
  padding: 0 13px;
  display: flex;
  align-items: center;
}
.nd-navbar-back {
  width: 24px;
  height: 24px;
}
.nd-navbar-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  line-height: 22px;
}

/* ============ 内容区 ============ */
.nd-content {
  padding-top: 10px;
}
.nd-title {
  font-size: 16px;
  font-weight: 700;
  color: #c4b494;
  margin-bottom: 10px;
  line-height: 24px;
}
.nd-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  height: 18px;
}
.nd-tag {
  margin-right: 4px;
  font-weight: 500;
  color: #666;
}
.nd-date {
  color: #999;
}

/* 正文卡片 */
.nd-body {
  margin-top: 15.6px;
  background: #181713;
  color: #fff;
  border: 0.5px solid #655032;
  border-radius: 12.48px;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
}
.nd-richtext {
  font-size: 14px;
  line-height: 24px;
  word-break: break-word;
}
.nd-richtext :deep(p) {
  margin: 0;
}
.nd-richtext :deep(ul),
.nd-richtext :deep(ol) {
  margin: 0;
  padding-left: 20px;
}

/* 风险提示 */
.nd-tips {
  margin-top: 20px;
}
.nd-tips-section {
  margin-top: 20px;
}
.nd-tips-section:first-child {
  margin-top: 0;
}
.nd-tips-title {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  line-height: 24px;
}
.nd-tips-text {
  font-size: 12px;
  font-weight: 300;
  color: #666;
  line-height: 24px;
}

/* 空态（原站 code:0 提示） */
.nd-empty {
  padding-top: 120px;
  text-align: center;
}
.nd-empty-text {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: #666;
}

/* ============ 加载遮罩 ============ */
.nd-mask {
  position: fixed;
  inset: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
.nd-mask__spinner {
  width: 19px;
  height: 19px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: #c8c8c8;
  border-radius: 50%;
  animation: ndSpin 1.2s linear infinite;
}
@keyframes ndSpin {
  to {
    transform: rotate(360deg);
  }
}
.nd-mask__text {
  margin-top: 8px;
  font-size: 12px;
  line-height: 16px;
  color: #c8c8c8;
}
</style>
