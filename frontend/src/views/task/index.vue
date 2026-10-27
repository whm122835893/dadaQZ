<template>
  <!--
    原站 pages/task/index（金标准实测 2026-10-25 登录后抓取，390x1002，活动中心）
    结构：container plr-14 pb-20 pt-30，背景 top-bg.webp 铺满
      → 「活动中心」18px fw700 #4a4a4a @(14,31,362,26) 居中
      → 四宫格 166x96：rybb (14,81) / xycj (210,81) / hlqd (14,187) / yqhy (210,187)
      → 「藏品活动」t-title 17px fw700 #111 @(26,323,68,25)，左侧竖条 t-shu (14,327.5,4,16)
      → 空态 search-empty.webp 93x62 @(148.5,384)
      → 「活动商城」@(26,522,68,25)，左侧竖条 (14,526.5,4,16)
      → 商品图 169x184：shop-1.png (14,563) / shop-2.png (193,563)
          「实物」标签 31x17 br3px @(143,571) / @(322,571)
          「嗒嗒联名手办」14px fw700 #222 @(14,759,169,20) / @(193,759,169,20)
          「￥128.00」15px fw600 #111 @(14,791,169,21) / @(193,791,169,21)
      → 底部 w-tabbar__pill 344x56 @(23,756) 金黑渐变 br28px
    数据：POST /addons/diypage/index（首页装修）+ POST /synthesis/themeinfo（活动主题）
  -->
  <div class="tk-page">
    <div class="tk-title">活动中心</div>

    <div class="tk-entries">
      <div
        v-for="e in entries"
        :key="e.id"
        class="tk-entry"
        @click="goEntry(e.path)"
      >
        <img class="tk-entry__img" :src="e.image" alt="" />
      </div>
    </div>

    <div class="tk-section">
      <span class="tk-section__bar"></span>
      <span class="tk-section__title">藏品活动</span>
    </div>

    <div class="tk-collect">
      <img class="tk-collect__empty" src="/assets/img/p0/empty/search-empty.webp" alt="" />
    </div>

    <div class="tk-section tk-section--mall">
      <span class="tk-section__bar"></span>
      <span class="tk-section__title">活动商城</span>
    </div>

    <div class="tk-mall">
      <div v-for="m in mall" :key="m.id" class="tk-mall__item">
        <img class="tk-mall__img" :src="m.image" alt="" />
        <span class="tk-mall__tag">{{ m.tag }}</span>
        <span class="tk-mall__name">{{ m.name }}</span>
        <span class="tk-mall__price">￥{{ m.price }}</span>
      </div>
    </div>

    <div class="tk-tabbar-placeholder" />
    <TabBar current="/pages/task/index" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { getTaskIndexData } from '@/api'

const router = useRouter()
const entries = ref([])
const mall = ref([])

function goEntry(path) {
  if (!path) return
  router.push(path)
}

onMounted(async () => {
  try {
    const res = await getTaskIndexData()
    entries.value = (res.data && res.data.entries) || []
    mall.value = (res.data && res.data.mall) || []
  } catch (e) {
    entries.value = []
    mall.value = []
  }
})
</script>

<style scoped>
.tk-page {
  position: relative;
  min-height: 100vh;
  background: #f7f7f8 url('/assets/img/p0/image/task/top-bg.webp') no-repeat;
  background-size: 100% 100%;
  padding: 30px 14px 20px;
}
.tk-title {
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
  color: #4a4a4a;
  text-align: center;
}
.tk-entries {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.tk-entry {
  width: 166px;
  height: 96px;
  margin-bottom: 10px;
  cursor: pointer;
}
.tk-entry__img {
  width: 166px;
  height: 96px;
  display: block;
}
.tk-section {
  margin-top: 30px;
  display: flex;
  align-items: center;
}
.tk-section--mall {
  margin-top: 76px;
}
.tk-section__bar {
  width: 4px;
  height: 16px;
  background: #4a4a4a;
}
.tk-section__title {
  margin-left: 8px;
  font-size: 17px;
  line-height: 25px;
  font-weight: 700;
  color: #111;
}
.tk-collect {
  margin-top: 37px;
  display: flex;
  justify-content: center;
}
.tk-collect__empty {
  width: 93px;
  height: 62px;
  display: block;
}
.tk-mall {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}
.tk-mall__item {
  position: relative;
  width: 169px;
  height: 184px;
}
.tk-mall__img {
  width: 169px;
  height: 184px;
  display: block;
}
.tk-mall__tag {
  position: absolute;
  right: 9px;
  top: 8px;
  width: 31px;
  height: 17px;
  border-radius: 3px;
  background: #4a6cf7;
  font-size: 11px;
  line-height: 17px;
  font-weight: 500;
  color: #fff;
  text-align: center;
}
.tk-mall__name {
  display: block;
  margin-top: 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #222;
}
.tk-mall__price {
  display: block;
  margin-top: 12px;
  font-size: 15px;
  line-height: 21px;
  font-weight: 600;
  color: #111;
}
.tk-tabbar-placeholder {
  height: 56px;
}
</style>
