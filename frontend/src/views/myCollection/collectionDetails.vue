<template>
  <!--
    原站 pages/myCollection/collectionDetails
      script 模块 07de
        data { loading, id, details{}, product:{ goods_type:2, publisher:{} } }
        onLoad({id}) → this.id = id → getDetails()
        getDetails() → getUserCollectionDetails(id)
                      → product.goods_type = types   ⚠ types 覆盖 goods_type
                      → is_img_diff==1 时用顶层 name/img 覆盖 product.name/main_image/3d_url
      render 模块 6076 / 143368c6（scope 36603649）
        w-container.mcd-page#colection
          w-navbar(placeholder:false, title=pageTitle, leftIcon=back-btn-white, bgColor)
          .mcd-hero   背景大图 + 渐变遮罩 + 居中主图阴影块
          .mcd-meta   名称 + 发行徽标 + #编号徽标
          .mcd-cards
            goods_type==1 && collection_list.length → .mcd-card--section 盲盒藏品
            .mcd-card  创作者 / 认证时间 / 所属专辑 / 认证标识 / 合约地址
            product.introduce_image → 藏品详情（u-parse）
            .mcd-card--notice 购买须知（purchase_information 或 4 条默认文案）
          collection-detail-button
      mixin 72d9：滚动渐变导航栏（scrollTop>=200 → opacity 1；>=120 显示标题）
  -->
  <div id="colection" class="mcd-page">
    <!-- 滚动渐变导航栏（原站 w-navbar + mixin 72d9） -->
    <div class="mcd-navbar" :style="{ backgroundColor: bgColor() }">
      <img class="mcd-navbar__back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
      <span v-if="pageTitle" class="mcd-navbar__title">{{ pageTitle }}</span>
    </div>

    <!-- 主图区 -->
    <div class="mcd-hero">
      <div class="mcd-hero__bg" :style="product.main_image ? { backgroundImage: 'url(' + heroBgUrl + ')' } : {}"></div>
      <div class="mcd-hero__mask"></div>
      <div class="mcd-hero__main-shadow">
        <img class="mcd-hero__main" :src="heroMainUrl" alt="" />
      </div>
    </div>

    <!-- 名称 + 徽章 -->
    <div class="mcd-meta">
      <span class="mcd-meta__name">{{ product.name }}</span>
      <div class="mcd-meta__badges">
        <div class="mcd-flux-badge">
          <span class="mcd-flux-badge__title">发行</span>
          <div class="mcd-flux-badge__value-wrap">
            <span class="mcd-flux-badge__value">{{ product.total_num == null ? 0 : product.total_num }}份</span>
          </div>
        </div>
        <div v-if="details.collection_code" class="mcd-sn-badge">
          <span class="mcd-sn-badge__text">#{{ details.collection_code }}</span>
        </div>
      </div>
    </div>

    <!-- 卡片区 -->
    <div class="mcd-cards">
      <!-- 盲盒藏品区块（仅 goods_type==1 且有子藏品） -->
      <div v-if="product.goods_type == 1 && product.collection_list && product.collection_list.length" class="mcd-card mcd-card--section">
        <span class="mcd-card__section-title mcd-card__section-title--lg">盲盒藏品</span>
        <div class="mcd-box">
          <div v-for="(item, i) in product.collection_list" :key="i" class="mcd-box__item">
            <img class="mcd-box__thumb" :src="imgUrl(item.main_image)" alt="" />
            <div class="mcd-box__info">
              <span class="mcd-box__name">{{ item.name || product.name }}</span>
              <div class="mcd-box__meta">
                <div class="mcd-box__meta-text">
                  已售 <span class="mcd-box__meta-em">{{ item.sold_num || '--' }}</span> 份
                </div>
                <div class="mcd-box__meta-text">
                  共 <span class="mcd-box__meta-em">{{ product.total_num || '--' }}</span> 份
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 基础信息卡 -->
      <div class="mcd-card">
        <div class="mcd-row mcd-row--divider">
          <span class="mcd-row__title">创作者</span>
          <span class="mcd-row__value">{{ (product.publisher && product.publisher.name) || '--' }}</span>
        </div>
        <div class="mcd-row mcd-row--divider">
          <span class="mcd-row__title">认证时间</span>
          <span class="mcd-row__value">{{ details.cert_time || details.createtime || details.create_time || '--' }}</span>
        </div>
        <div class="mcd-row mcd-row--divider">
          <span class="mcd-row__title">所属专辑</span>
          <span class="mcd-row__value">{{
            details.series_name || (product.series && product.series.name) || product.series_name || '--'
          }}</span>
        </div>
        <div class="mcd-row mcd-row--divider">
          <span class="mcd-row__title">认证标识</span>
          <span class="mcd-row__value">{{ details.rz_code || '--' }}</span>
        </div>
        <div class="mcd-row">
          <span class="mcd-row__title">合约地址</span>
          <span class="mcd-row__value">{{ details.user_hash_text || details.user_hash || '--' }}</span>
        </div>
      </div>

      <!-- 藏品详情（富文本） -->
      <div v-if="product.introduce_image" class="mcd-card mcd-card--section">
        <span class="mcd-card__section-title mcd-card__section-title--lg">藏品详情</span>
        <div class="mcd-card__html" v-html="product.introduce_image"></div>
      </div>

      <!-- 购买须知 -->
      <div class="mcd-card mcd-card--notice">
        <span class="mcd-card__section-title mcd-card__section-title--lg">购买须知</span>
        <div v-if="product.purchase_information" class="mcd-notice-body__html" v-html="product.purchase_information"></div>
        <div v-else class="mcd-notice-body">
          <span v-for="(t, i) in DEFAULT_NOTICE" :key="i" class="mcd-notice-body__text">{{ t }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作条 -->
    <CollectionDetailButton :info="details" @refresh="getDetails" />
  </div>
</template>

<script setup>
/**
 * 藏品详情页（对应原站 pages/myCollection/collectionDetails）
 *   路由参数：id（user_collection.id）
 */
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCollectionDetail } from '@/api'
import { OSS_URL } from '@/config'
import CollectionDetailButton from '@/components/myCollection/CollectionDetailButton.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const id = ref(null)
const details = ref({})
const product = reactive({ goods_type: 2, publisher: {} })
const pageTitle = ref(null)
const opacity = ref(0)

/** 原站购买须知默认文案（4 条，顺序固定） */
const DEFAULT_NOTICE = [
  '为更好服务平台的各位用户，特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各不相同，请各位用户务必仔细阅读并同意相关规则后进行相应操作，以免造成不必要的损失。',
  '1.依照我国法律要求，特定条件下的数字藏品的二次交易不支持任何形式的变相炒作，我们坚决反对数字藏品炒作、场外交易、欺诈，或以任何其他非法、侵权方式使用的违规行为，请大家注意甄别上述涉嫌网络欺诈的行为及其相关风险。',
  '2.数字藏品为虚拟数字商品，仅限18周岁以上，60周岁以下且实名认证的中国大陆用户购买。',
  '3.本商品一经售出不支持退货。'
]

/** 原站 w-image 的 targetSrc 规则：绝对地址直接用，其余补 OSS 前缀 */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/')) return src
  return OSS_URL + src
}
const heroBgUrl = computed(() => imgUrl(product.main_image))
const heroMainUrl = computed(() => imgUrl(product.main_image))

/** mixin 72d9：滚动渐变导航栏 */
const bgColor = () => `rgba(51, 51, 51, ${opacity.value})`

function scrollChange(t) {
  opacity.value = t >= 200 ? 1 : t / 200
  pageTitle.value = product.name && t >= 120 ? product.name : null
}
function onScroll(e) {
  scrollChange(e.target.scrollTop || document.documentElement.scrollTop || 0)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/myCollection/myCollection')
}

async function getDetails() {
  loading.value = true
  /* 切换藏品时先清空，避免上一件的 collection_list / introduce_image 残留 */
  Object.keys(product).forEach((k) => delete product[k])
  Object.assign(product, { goods_type: 2, publisher: {} })
  details.value = {}
  try {
    const res = await getCollectionDetail(id.value)
    const d = res.data || {}
    details.value = d
    Object.assign(product, d.product || {})
    /* 原站：types 覆盖 goods_type */
    product.goods_type = d.types
    if (product.is_img_diff == 1) {
      product.name = d.name
      product.main_image = d.img
      product['3d_url'] = d.img
    }
  } catch (e) {
    /* 原站 catch 只关 loading */
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  id.value = route.query.id
  getDetails()
  window.addEventListener('scroll', onScroll, { passive: true })
})
/* 同一路由不同 id（列表内连续切换藏品）时重新拉数据，对齐原站 onLoad 语义 */
watch(
  () => route.query.id,
  (v) => {
    if (v !== id.value) {
      id.value = v
      pageTitle.value = null
      opacity.value = 0
      getDetails()
    }
  }
)
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
#colection {
  background: #101115;
  min-height: 100vh;
  padding-bottom: calc(env(safe-area-inset-bottom) + 82.68px);
}

/* ============ 原站 w-navbar + mixin 72d9 渐变 ============ */
.mcd-navbar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 100;
  height: 44px;
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mcd-navbar__back {
  position: absolute;
  left: 12.48px;
  top: 50%;
  transform: translateY(-50%);
  width: 24.96px;
  height: 24.96px;
}
.mcd-navbar__title {
  font-size: 15.6px;
  font-weight: bold;
  color: #fff;
}

/* ============ 主图区 ============ */
.mcd-hero {
  position: relative;
  width: 100%;
  height: 360.36px;
  overflow: visible;
}
.mcd-hero__bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  z-index: 0;
}
.mcd-hero__mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(rgba(0, 0, 0, 0.7), #000);
}
.mcd-hero__main-shadow {
  position: absolute;
  top: 103.48px;
  left: 50%;
  z-index: 10;
  width: 126.88px;
  height: 126.88px;
  margin-left: -63.44px;
  border-radius: 14.56px;
  box-shadow: 0 0 17.68px rgba(0, 0, 0, 0.6);
  background: transparent;
}
.mcd-hero__main {
  width: 100%;
  height: 100%;
  border-radius: 14.56px;
  overflow: hidden;
  background: #f5f5f5;
  display: block;
}

/* ============ 名称 + 徽章 ============ */
.mcd-meta {
  margin-top: -112.32px;
  position: relative;
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 31.72px;
}
.mcd-meta__name {
  max-width: 100%;
  font-size: 20.8px;
  font-weight: 700;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Bold, -apple-system, sans-serif;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mcd-meta__badges {
  margin-top: 10.4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -5.72px;
  margin-bottom: -5.72px;
  flex-wrap: wrap;
}
.mcd-meta__badges > * {
  margin-right: 5.72px;
  margin-bottom: 5.72px;
}
.mcd-flux-badge {
  height: 24.96px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}
.mcd-flux-badge__title {
  width: 34.32px;
  height: 24.96px;
  line-height: 24.96px;
  text-align: center;
  font-size: 11.96px;
  color: #847765;
  font-family: Alibaba-PuHuiTi-Regular, -apple-system, sans-serif;
  background: #e1dac7;
  border-radius: 2.6px 0 0 2.6px;
}
.mcd-flux-badge__value-wrap {
  height: 24.96px;
  padding: 0 7.8px;
  display: flex;
  align-items: center;
  background: #faf7ed;
  border-radius: 0 2.6px 2.6px 0;
  box-sizing: border-box;
}
.mcd-flux-badge__value {
  font-size: 11.96px;
  color: #847765;
  font-family: Alibaba-PuHuiTi-Regular, -apple-system, sans-serif;
  white-space: nowrap;
}
.mcd-sn-badge {
  height: 24.96px;
  padding: 0 7.8px;
  display: flex;
  align-items: center;
  background: #faf7ed;
  border-radius: 2.6px;
  box-sizing: border-box;
}
.mcd-sn-badge__text {
  font-size: 11.96px;
  color: #847765;
  font-family: Alibaba-PuHuiTi-Regular, -apple-system, sans-serif;
  white-space: nowrap;
}

/* ============ 卡片区 ============ */
.mcd-cards {
  margin-top: 16.12px;
  padding: 0 16.12px 20.8px;
  display: flex;
  flex-direction: column;
}
.mcd-cards > * + * {
  margin-top: 11.96px;
}
.mcd-card {
  background: #181713;
  border-radius: 14.56px;
  overflow: hidden;
  z-index: 2;
}
.mcd-card--section,
.mcd-card--notice {
  padding: 20.8px 24.96px;
  box-sizing: border-box;
}
.mcd-row {
  min-height: 63.96px;
  padding: 0 24.96px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.mcd-row > * + * {
  margin-top: 11.96px;
}
.mcd-row--divider {
  position: relative;
}
.mcd-row--divider::after {
  content: '';
  position: absolute;
  left: 24.96px;
  right: 24.96px;
  bottom: 0;
  height: 1px;
  background: #352d20;
}
.mcd-row__title {
  flex-shrink: 0;
  font-size: 14.56px;
  font-weight: 500;
  color: #ccc;
  font-family: Alibaba-PuHuiTi-Medium, -apple-system, sans-serif;
}
.mcd-row__value {
  flex: 1;
  min-width: 0;
  text-align: right;
  font-size: 14.56px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, -apple-system, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mcd-card__section-title {
  display: block;
  font-size: 14.56px;
  color: #fff;
  font-family: Alibaba-PuHuiTi-Regular, -apple-system, sans-serif;
  margin-bottom: 7.8px;
}
.mcd-card__section-title--lg {
  font-size: 16.12px;
  font-weight: 700;
  font-family: Alibaba-PuHuiTi-Bold, -apple-system, sans-serif;
  margin-bottom: 10.4px;
}
.mcd-card__html {
  font-size: 11.96px;
  color: #838383;
  line-height: 1.5;
}
.mcd-card__html :deep(p) {
  font-size: 11.96px;
  color: #838383;
  line-height: 1.5;
  margin: 0 0 7.8px;
}
.mcd-card__html :deep(p:last-child) {
  margin-bottom: 0;
}

/* 盲盒藏品 */
.mcd-box__item {
  display: flex;
  align-items: center;
  padding: 5.72px;
  background: #f7f7f7;
  border-radius: 7.8px;
  box-sizing: border-box;
}
.mcd-box__item > * + * {
  margin-left: 7.8px;
}
.mcd-box__thumb {
  width: 71.76px;
  height: 71.76px;
  border-radius: 6.24px;
  background: #fff;
  flex-shrink: 0;
  object-fit: cover;
}
.mcd-box__info {
  flex: 1;
  min-width: 0;
  height: 60.32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4.16px 0;
  box-sizing: border-box;
}
.mcd-box__name {
  font-size: 13px;
  font-weight: 500;
  color: #191919;
  font-family: Alibaba-PuHuiTi-Medium, -apple-system, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mcd-box__meta {
  display: flex;
  align-items: center;
}
.mcd-box__meta > * + * {
  margin-left: 16.12px;
}
.mcd-box__meta-text {
  font-size: 11.96px;
  color: #999;
  font-family: Alibaba-PuHuiTi-Regular, -apple-system, sans-serif;
}
.mcd-box__meta-em {
  color: #191919;
}

/* 购买须知 */
.mcd-notice-body {
  background: #f7f7f7;
  border-radius: 10.4px;
  padding: 7.8px;
  display: flex;
  flex-direction: column;
}
.mcd-notice-body > * + * {
  margin-top: 5.72px;
}
.mcd-notice-body__text {
  font-size: 11.96px;
  color: #666;
  font-family: Alibaba-PuHuiTi-Regular, -apple-system, sans-serif;
  line-height: 1.5;
}
.mcd-notice-body__html {
  background: #302a22;
  border-radius: 10.4px;
  padding: 7.8px;
  font-size: 11.96px;
  color: #999;
  line-height: 1.5;
}
.mcd-notice-body__html :deep(p) {
  font-size: 11.96px;
  color: #999;
  line-height: 1.5;
  margin: 0 0 5.72px;
}
.mcd-notice-body__html :deep(p:last-child) {
  margin-bottom: 0;
}
</style>