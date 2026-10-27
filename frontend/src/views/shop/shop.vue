<template>
  <!--
    原站 pages/shop/shop（金标准实测 2026-10-25 登录后抓取，390x844，龙晶商城「蓝色」主题）
    结构：container shop-container-blue，背景 top-bg.webp 铺满
      → nav 44px 透明：返回（back-btn2.png 24x24 @(13,10)）、标题「龙晶商店」15px bold #fff @(165,15.5,60,16)
      → my-type-num：icon-image.webp 26x26 @(29,75)、「我的龙晶」17px fw500 #fff @(61,75.5,68,25)
      → crystal-num「0」37px fw700 #fff @(0,101,390,43)
      → rule-v：rule-image.webp 30x100 @(360,97)（右侧竖排规则入口）
      → gi-info：
          get-image.webp 41x42 @(31,185.5)、「获取龙晶」16px fw700 #000 @(85,194.5,64,24)
          info-image.webp 41x42 @(215,185.5)、「龙晶详情」16px fw700 #000 @(269,194.5,64,24)
      → 「龙晶兑换藏品」17px fw800 #000 @(29,256,102,25)，左侧竖条 (16,260,3,17)
      → 空态 search-empty.png 121x122 @(134.5,367)
    数据：POST /crystal_goods/list { type:"10", page:1, crystal_type:"blue" }
          实调 total:0 → 原站渲染空态
    交互（原站 chunk pages-shop-shop.4006e97b.js）：
      → 「获取龙晶」(get-v) 点击 = refresh() 重新拉列表
      → 「龙晶详情」(info-v) 点击 = $u.route('/pages/shop/record')
      → 「规则」竖图 (rule-v) 点击 = $u.route('/pages/rules/rules', {type:3})
    主题（原站 getTitle / getleftIcon / getcrystal_num，onLoad query 的 type 决定）：
      blue   → 龙晶，back-btn2.png，crystal_blue
      purple → 水晶，back-btn.png，crystal_purple
      yellow → 凤羽，back-btn-blank.png，crystal_yellow
  -->
  <div class="sh-page" :class="`sh-page--${crystalType}`">
    <div class="sh-nav">
      <div class="sh-nav__back" @click="goBack">
        <div class="sh-nav__back-img" :style="{ backgroundImage: `url('${backIcon}')` }"></div>
      </div>
      <span class="sh-nav__title"><span>{{ title }}商店</span></span>
    </div>

    <div class="sh-mine">
      <img class="sh-mine__icon" :src="`/assets/img/p0/image/shop/${crystalType}/icon-image.webp`" alt="" />
      <span class="sh-mine__title">我的{{ title }}</span>
    </div>

    <div class="sh-num">{{ crystalNum }}</div>

    <img class="sh-rule" :src="`/assets/img/p0/image/shop/${crystalType}/rule-image.webp`" alt="" @click="goRules" />

    <div class="sh-info">
      <div class="sh-info__item" @click="refresh">
        <img class="sh-info__icon" :src="`/assets/img/p0/image/shop/${crystalType}/get-image.webp`" alt="" />
        <span class="sh-info__title">获取{{ title }}</span>
      </div>
      <div class="sh-info__item" @click="goRecord">
        <img class="sh-info__icon" :src="`/assets/img/p0/image/shop/${crystalType}/info-image.webp`" alt="" />
        <span class="sh-info__title">{{ title }}详情</span>
      </div>
    </div>

    <div class="sh-section">
      <span class="sh-section__bar"></span>
      <span class="sh-section__title">{{ title }}兑换藏品</span>
    </div>

    <div class="sh-shop">
      <div class="sh-list">
        <div v-if="loading" class="sh-loading">
          <div class="sh-loading__spinner"></div>
          <span class="sh-loading__text">加载中</span>
        </div>
        <div v-else-if="list.length === 0" class="sh-empty">
          <img class="sh-empty__img" src="/assets/img/p0/empty/search-empty.png" alt="" />
        </div>
        <div v-for="item in list" v-else :key="item.id" class="sh-item">
          <img class="sh-item__img" :src="item.image" alt="" />
          <span class="sh-item__name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCrystalGoodsList, getUserInfo } from '@/api'

const router = useRouter()
const route = useRoute()

/** 原站 onLoad(A) { this.param.crystal_type = A.type ? A.type : 'blue' } */
const crystalType = ref(route.query.type || 'blue')

/** 原站 getTitle：yellow→凤羽，blue→龙晶，其余→水晶 */
const title = computed(() => {
  if (crystalType.value === 'yellow') return '凤羽'
  if (crystalType.value === 'blue') return '龙晶'
  return '水晶'
})

/** 原站 getleftIcon：yellow→back-btn-blank，blue→back-btn2，其余→back-btn */
const backIcon = computed(() => {
  if (crystalType.value === 'yellow') return '/assets/img/p0/icon/back-btn-blank.png'
  if (crystalType.value === 'blue') return '/assets/img/p0/icon/back-btn2.png'
  return '/assets/img/p0/icon/back-btn.png'
})

const crystalNum = ref(0)
const list = ref([])
const loading = ref(false)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

/** 原站 info-v onClick → $u.route('/pages/shop/record') */
function goRecord() {
  router.push('/pages/shop/record')
}

/** 原站 rule-v onClick → $u.route('/pages/rules/rules', { type:3 }) */
function goRules() {
  router.push({ path: '/pages/rules/rules', query: { type: 3 } })
}

async function refresh() {
  loading.value = true
  list.value = []
  try {
    const res = await getCrystalGoodsList({ type: '10', page: 1, crystal_type: crystalType.value })
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await getUserInfo()
    const key = `crystal_${crystalType.value}`
    crystalNum.value = Number((res.data && res.data[key]) || 0)
  } catch (e) {
    crystalNum.value = 0
  }
  refresh()
})
</script>

<style scoped>
.sh-page {
  position: relative;
  min-height: 100vh;
  background: #f7f7f8 url('/assets/img/p0/image/shop/blue/top-bg.webp') no-repeat;
  background-size: 100% 100%;
  padding-bottom: 40px;
}
/* 原站 shop-container-{crystal_type} 主题背景（chunk CSS 逐主题定义） */
.sh-page--blue {
  background-color: #f5f5f5;
  background-image: url('/assets/img/p0/image/shop/blue/top-bg.webp');
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.sh-page--purple {
  background-color: #f5f5f5;
  background-image: url('/assets/img/p0/image/shop/purple/top-bg.webp');
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.sh-page--yellow {
  background-color: #fff0e5;
  background-image: url('/assets/img/p0/image/shop/yellow/top-bg.webp');
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.sh-nav {
  position: relative;
  height: 44px;
}
.sh-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.sh-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn2.png') no-repeat;
  background-size: 100% 100%;
}
.sh-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.sh-nav__title > span {
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #fff;
}
.sh-mine {
  position: absolute;
  left: 29px;
  top: 75px;
  display: flex;
  align-items: center;
}
.sh-mine__icon {
  width: 26px;
  height: 26px;
  display: block;
}
.sh-mine__title {
  margin-left: 6px;
  font-size: 17px;
  line-height: 25px;
  font-weight: 500;
  color: #fff;
}
.sh-num {
  position: absolute;
  left: 0;
  top: 101px;
  width: 390px;
  height: 43px;
  font-size: 37px;
  line-height: 43px;
  font-weight: 700;
  color: #fff;
  text-align: center;
}
.sh-rule {
  position: absolute;
  left: 360px;
  top: 97px;
  width: 30px;
  height: 100px;
  display: block;
}
.sh-info {
  position: absolute;
  left: 17px;
  top: 173px;
  width: 356px;
  height: 67px;
  background: #fff;
  box-shadow: 0 0 25px 2px rgba(149, 153, 173, 0.19);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.sh-info__item {
  display: flex;
  align-items: center;
}
.sh-info__item:first-child {
  margin-left: 14px;
}
.sh-info__item:last-child {
  margin-left: 66px;
}
.sh-info__icon {
  width: 41px;
  height: 42px;
  display: block;
}
.sh-info__title {
  margin-left: 13px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #000;
}
.sh-section {
  position: absolute;
  left: 16px;
  top: 256px;
  display: flex;
  align-items: center;
}
.sh-section__bar {
  width: 3px;
  height: 17px;
  background: #1b53f8;
}
.sh-section__title {
  margin-left: 10px;
  font-size: 17px;
  line-height: 25px;
  font-weight: 800;
  color: #000;
}
.sh-shop {
  position: absolute;
  left: 0;
  right: 0;
  top: 281px;
  height: 563px;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
}
.sh-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 33px;
}
.sh-loading {
  margin-top: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sh-loading__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #dae4ff;
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: sh-spin 1.2s ease-in-out infinite;
}
@keyframes sh-spin {
  to {
    transform: rotate(360deg);
  }
}
.sh-loading__text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
}
.sh-empty {
  margin-top: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sh-empty__img {
  width: 121px;
  height: 122px;
  display: block;
}
.sh-item {
  margin: 16px;
}
.sh-item__img {
  width: 100%;
  display: block;
}
.sh-item__name {
  display: block;
  margin-top: 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #222;
}
</style>
