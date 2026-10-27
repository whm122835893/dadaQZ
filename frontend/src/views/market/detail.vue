<template>
  <!--
    原站 pages/market/detail（寄售详情）
      script 模块 3fd1
        data { id, loading, info, opacity, pageTitle, bgColorType:"black" }
        onLoad({id}) → this.id = id → getInfo()
        getInfo() → getMarketDetails(id)
                    → this.info = a.data
                    → this.info.product.goods_type = a.data.goods_type
                    → this.info.product.price = a.data.price
                    catch → setTimeout(backPage, 1500)
        computed
          product    = {...info.product, price: info.price, goods_type: info.goods_type,
                        name: is_img_diff==1 ? info.name : info.product.name,
                        main_image: is_img_diff==1 ? info.img : info.product.main_image,
                        "3d_url": is_img_diff==1 ? info.img : info.product["3d_url"]}
          code       = info.user_collection.collection_code
          heroBg     = {backgroundImage: url($ossUrl + product.main_image)}
          fluxCount  = product.total_num == null ? 0 : product.total_num
          creatorName= product.publisher && product.publisher.name || "--"
          certTime   = info.user_collection && info.user_collection.cert_time || "--"
          noticeContent = product.purchase_information || ""
          bgColor    = "black"==bgColorType ? rgba(51,51,51,opacity) : rgba(255,255,255,opacity)
        scrollChange：opacity = scrollTop>=200 ? 1 : scrollTop/200；
                      pageTitle = product.name && scrollTop>=120 ? product.name : null
        previewMain：uni.previewImage({urls:[product.main_image]})
      render 模块（scope 1ea24c40）
        w-container.mcd-page#market-details
          w-navbar(placeholder:false, title=pageTitle, leftIcon=back-btn-white, bgColor)
          .mcd-hero / .mcd-meta / .mcd-cards（创作者 / 认证时间 / 藏品详情 / 购买须知）
          w-market-action(:info=info)
  -->
  <div id="market-details" class="mcd-page">
    <!-- 滚动渐变导航栏（原站 w-navbar + mixin 72d9） -->
    <div class="mcd-navbar" :style="{ backgroundColor: bgColor }">
      <img class="mcd-navbar__back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
      <span v-if="pageTitle" class="mcd-navbar__title">{{ pageTitle }}</span>
    </div>

    <!-- 主图区 -->
    <div class="mcd-hero">
      <div class="mcd-hero__bg" :style="heroBg"></div>
      <div class="mcd-hero__mask"></div>
      <div class="mcd-hero__main-shadow">
        <img class="mcd-hero__main" :src="heroMainUrl" alt="" @click="previewMain" />
      </div>
    </div>

    <!-- 名称 + 徽章 -->
    <div class="mcd-meta">
      <span class="mcd-meta__name">{{ product.name }}</span>
      <div class="mcd-meta__badges">
        <div class="mcd-flux-badge">
          <span class="mcd-flux-badge__title">发行</span>
          <div class="mcd-flux-badge__value-wrap">
            <span class="mcd-flux-badge__value">{{ fluxCount }}份</span>
          </div>
        </div>
        <div v-if="code" class="mcd-sn-badge">
          <span class="mcd-sn-badge__text">#{{ code }}</span>
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

      <!-- 基础信息卡（创作者 / 认证时间） -->
      <div class="mcd-card">
        <div class="mcd-row mcd-row--divider">
          <span class="mcd-row__title">创作者</span>
          <span class="mcd-row__value">{{ creatorName }}</span>
        </div>
        <div class="mcd-row">
          <span class="mcd-row__title">认证时间</span>
          <span class="mcd-row__value">{{ certTime }}</span>
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
        <div v-if="noticeContent" class="mcd-notice-body__html" v-html="noticeContent"></div>
        <div v-else class="mcd-notice-body">
          <span v-for="(t, i) in DEFAULT_NOTICE" :key="i" class="mcd-notice-body__text">{{ t }}</span>
        </div>
      </div>
    </div>

    <!-- 底部购买条 -->
    <MarketAction :info="info" />
  </div>
</template>

<script setup>
/**
 * 市场寄售详情页（对应原站 pages/market/detail）
 *   路由参数：id（market_goods.id，即寄售单 id）
 *   链路：market 行点击 → marketGoodsList 行点击 → 本页 → 立即购买 → orderSubmit
 */
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMarketDetails } from '@/api'
import { OSS_URL } from '@/config'
import MarketAction from '@/components/market/MarketAction.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const id = ref(null)
const info = ref({})
const opacity = ref(0)
const pageTitle = ref(null)
const bgColorType = ref('black')

/** 原站购买须知默认文案（4 条，与 pages/myCollection/collectionDetails 同源） */
const DEFAULT_NOTICE = [
  '为更好服务平台的各位用户，特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各不相同，请各位用户务必仔细阅读并同意相关规则后进行相应操作，以免造成不必要的损失。',
  '1.依照我国法律要求，特定条件下的数字藏品的二次交易不支持任何形式的变相炒作，我们坚决反对数字藏品炒作、场外交易、欺诈，或以任何其他非法、侵权方式使用的违规行为，请大家注意甄别上述涉嫌网络欺诈的行为及其相关风险。',
  '2.数字藏品为虚拟数字商品，仅限18周岁以上，60周岁以下且实名认证的中国大陆用户购买。',
  '3.本商品一经售出不支持退货。'
]

/** 原站 w-image 的 targetSrc 规则：
 *  targetSrc = src.startsWith('http') || isLoc ? src : OssUrl + src
 *  即 /uploads 等业务图补 OSS 前缀，本地静态资源（/assets、/static）直接用 */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/static') || src.startsWith('/assets')) return src
  return OSS_URL + src
}

/** 原站 computed.product：info.product 打平，price/goods_type 用顶层值覆盖 */
const product = computed(() => {
  const p = (info.value && info.value.product) || {}
  const top = info.value || {}
  return {
    ...p,
    price: top.price,
    goods_type: top.goods_type,
    name: p.is_img_diff == 1 ? top.name : p.name,
    main_image: p.is_img_diff == 1 ? top.img : p.main_image,
    '3d_url': p.is_img_diff == 1 ? top.img : p['3d_url']
  }
})
const code = computed(() => (info.value.user_collection && info.value.user_collection.collection_code) || '')
const heroBg = computed(() => (product.value.main_image ? { backgroundImage: 'url(' + imgUrl(product.value.main_image) + ')' } : {}))
const heroMainUrl = computed(() => imgUrl(product.value.main_image))
const fluxCount = computed(() => (product.value.total_num == null ? 0 : product.value.total_num))
const creatorName = computed(() => (product.value.publisher && product.value.publisher.name) || '--')
const certTime = computed(() => (info.value.user_collection && info.value.user_collection.cert_time) || '--')
const noticeContent = computed(() => product.value.purchase_information || '')
const bgColor = computed(() => (bgColorType.value === 'black' ? `rgba(51, 51, 51, ${opacity.value})` : `rgba(255, 255, 255, ${opacity.value})`))

/** mixin 72d9：滚动渐变导航栏 */
function scrollChange(t) {
  opacity.value = t >= 200 ? 1 : t / 200
  pageTitle.value = product.value.name && t >= 120 ? product.value.name : null
}
function onScroll(e) {
  scrollChange(e.target.scrollTop || document.documentElement.scrollTop || 0)
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/market/market')
}

/** previewMain：原站 uni.previewImage({urls:[main_image]}) */
function previewMain() {
  if (product.value.main_image) window.open(imgUrl(product.value.main_image), '_blank')
}

async function getInfo() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getMarketDetails(id.value)
    const d = res.data || {}
    info.value = d
    /* 原站 getInfo：product.goods_type / product.price 用顶层值覆盖 */
    if (d.product) {
      d.product.goods_type = d.goods_type
      d.product.price = d.price
    }
  } catch (e) {
    /* 原站 catch：1.5s 后返回上一页 */
    setTimeout(goBack, 1500)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  id.value = route.query.id
  getInfo()
  window.addEventListener('scroll', onScroll, { passive: true })
})
/* 同一路由不同 id（列表内连续切换寄售单）时重新拉数据，对齐原站 onLoad 语义 */
watch(
  () => route.query.id,
  (v) => {
    if (v !== id.value) {
      id.value = v
      pageTitle.value = null
      opacity.value = 0
      getInfo()
    }
  }
)
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* 原站 mcd-* 源码即 px 值（H5 编译后原样），以下逐项对齐原站实测（iPhone 390） */
#market-details {
  background: #101115;
  min-height: 100vh;
  padding-bottom: 72px;
  /* 原站 page 级：fs 15 / color #4a4a4a / lh normal（子元素均显式覆盖，此处对齐容器 computed） */
  font-size: 15px;
  color: #4a4a4a;
  line-height: normal;
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
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
}
.mcd-navbar__title {
  font-size: 15.6px;
  font-weight: bold;
  color: #fff;
  line-height: normal;
}

/* ============ 主图区 ============ */
.mcd-hero {
  position: relative;
  width: 100%;
  height: 360px;
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
  top: 103px;
  left: 50%;
  z-index: 10;
  width: 126px;
  height: 126px;
  margin-left: -63px;
  border-radius: 14px;
  box-shadow: 0 0 17px rgba(0, 0, 0, 0.6);
  background: transparent;
}
.mcd-hero__main {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #f5f5f5;
  display: block;
  object-fit: cover;
  cursor: pointer;
}

/* ============ 名称 + 徽章 ============ */
.mcd-meta {
  margin-top: -112px;
  position: relative;
  z-index: 11;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 31px;
}
.mcd-meta__name {
  max-width: 100%;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Bold', -apple-system, sans-serif;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: normal;
}
.mcd-meta__badges {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -5px;
  margin-bottom: -5px;
  flex-wrap: wrap;
}
.mcd-meta__badges > * {
  margin-right: 5px;
  margin-bottom: 5px;
}
.mcd-flux-badge {
  height: 24px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}
.mcd-flux-badge__title {
  width: 34px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 11px;
  color: #847765;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  background: #e1dac7;
  border-radius: 2px 0 0 2px;
}
.mcd-flux-badge__value-wrap {
  height: 24px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  background: #faf7ed;
  border-radius: 0 2px 2px 0;
  box-sizing: border-box;
}
.mcd-flux-badge__value {
  font-size: 11px;
  color: #847765;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  white-space: nowrap;
  line-height: normal;
}
.mcd-sn-badge {
  height: 24px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  background: #faf7ed;
  border-radius: 2px;
  box-sizing: border-box;
}
.mcd-sn-badge__text {
  font-size: 11px;
  color: #847765;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  white-space: nowrap;
  line-height: normal;
}

/* ============ 卡片区 ============ */
.mcd-cards {
  margin-top: 16px;
  padding: 0 16px 20px;
  display: flex;
  flex-direction: column;
}
.mcd-cards > * + * {
  margin-top: 11px;
}
.mcd-card {
  background: #181713;
  border-radius: 14px;
  overflow: hidden;
  z-index: 2;
}
.mcd-card--section,
.mcd-card--notice {
  padding: 20px 24px;
  box-sizing: border-box;
}
.mcd-row {
  min-height: 63px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.mcd-row > * + * {
  margin-top: 11px;
}
.mcd-row--divider {
  position: relative;
}
.mcd-row--divider::after {
  content: '';
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 0;
  height: 1px;
  background: #352d20;
}
.mcd-row__title {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
  font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, sans-serif;
  line-height: normal;
}
.mcd-row__value {
  flex: 1;
  min-width: 0;
  text-align: right;
  font-size: 14px;
  color: #999;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: normal;
}
.mcd-card__section-title {
  display: block;
  font-size: 14px;
  color: #fff;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  margin-bottom: 7px;
  line-height: normal;
}
.mcd-card__section-title--lg {
  font-size: 16px;
  font-weight: 700;
  font-family: 'Alibaba-PuHuiTi-Bold', -apple-system, sans-serif;
  margin-bottom: 10px;
  line-height: normal;
}
.mcd-card__html {
  font-size: 11px;
  color: #838383;
  line-height: 1.5;
}
.mcd-card__html :deep(p) {
  font-size: 11px;
  color: #838383;
  line-height: 1.5;
  margin: 0 0 7px;
}
.mcd-card__html :deep(p:last-child) {
  margin-bottom: 0;
}

/* 盲盒藏品 */
.mcd-box__item {
  display: flex;
  align-items: center;
  padding: 5px;
  background: #f7f7f7;
  border-radius: 7px;
  box-sizing: border-box;
}
.mcd-box__item > * + * {
  margin-left: 7px;
}
.mcd-box__thumb {
  width: 71px;
  height: 71px;
  border-radius: 6px;
  background: #fff;
  flex-shrink: 0;
  object-fit: cover;
}
.mcd-box__info {
  flex: 1;
  min-width: 0;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
  box-sizing: border-box;
}
.mcd-box__name {
  font-size: 13px;
  font-weight: 500;
  color: #191919;
  font-family: 'Alibaba-PuHuiTi-Medium', -apple-system, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: normal;
}
.mcd-box__meta {
  display: flex;
  align-items: center;
}
.mcd-box__meta > * + * {
  margin-left: 16px;
}
.mcd-box__meta-text {
  font-size: 11px;
  color: #999;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  line-height: normal;
}
.mcd-box__meta-em {
  color: #191919;
}

/* 购买须知 */
.mcd-notice-body {
  background: #f7f7f7;
  border-radius: 10px;
  padding: 7px;
  display: flex;
  flex-direction: column;
}
.mcd-notice-body > * + * {
  margin-top: 5px;
}
.mcd-notice-body__text {
  font-size: 11px;
  color: #666;
  font-family: 'Alibaba-PuHuiTi-Regular', -apple-system, sans-serif;
  line-height: 1.5;
}
.mcd-notice-body__html {
  background: #302a22;
  border-radius: 10px;
  padding: 7px;
  font-size: 11px;
  color: #999;
  line-height: 1.5;
}
.mcd-notice-body__html :deep(p) {
  font-size: 11px;
  color: #999;
  line-height: 1.5;
  margin: 0 0 5px;
}
.mcd-notice-body__html :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
