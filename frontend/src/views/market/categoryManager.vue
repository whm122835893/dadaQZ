<template>
  <!--
    原站 pages/market/categoryManager（分类管理）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：body bg rgb(247,247,248)
            navbar 390x44 bg rgb(250,250,250)
              返回 back-btn.png 24x24 @(13,10)
              标题「分类」15px bold rgb(51,51,51) @(180,16,30,16)
              右侧「确认」12px rgb(51,51,51) @(353,15.5,24,14)
          → 「我的分类」14px rgb(51,51,51) @(16,60,358,21)
          → 三个胶囊 110x39 @(16,93) / @(138,93) / @(260,93)
              bg #fff，bd 1px solid rgb(231,231,234)，br 44px，pad 8px 12px
              文字 14px rgb(51,51,51) 居中：「我的关注」「推荐」「全部」
          → 「其他分类」14px rgb(51,51,51) @(16,164,358,21)
    端点：POST /index/getSeries?type=10 → [{series_name:"潜龙聚财",...}]
          POST /index/getSeries?type=20 → []
          POST /index/customSeriesList → { custom_series:[], platform_series:[] }
  -->
  <div class="cm-page">
    <div class="cm-nav">
      <div class="cm-nav__back" @click="goBack"></div>
      <span class="cm-nav__title">分类</span>
      <span class="cm-nav__confirm" @click="onConfirm">确认</span>
    </div>

    <div class="cm-body">
      <div class="cm-label">我的分类</div>
      <div class="cm-chips">
        <div class="cm-chip" :class="{ 'cm-chip--on': chip.on }" v-for="chip in myChips" :key="chip.text">
          <span class="cm-chip__text">{{ chip.text }}</span>
        </div>
      </div>

      <div class="cm-label cm-label--other">其他分类</div>
      <!--
        原站此处是一个空的 flex 容器：尽管 /index/getSeries?type=10 返回了
        「潜龙聚财」系列，原站并未把它渲染到「其他分类」区，故复刻保持为空。
      -->
      <div class="cm-other"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCategorySeries, getCustomSeriesList } from '@/api'

const router = useRouter()

const myChips = ref([
  { text: '我的关注', on: true },
  { text: '推荐', on: false },
  { text: '全部', on: false }
])
function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function onConfirm() {
  router.back()
}

onMounted(async () => {
  try {
    await Promise.all([getCategorySeries(10), getCategorySeries(20), getCustomSeriesList()])
  } catch (e) {
    // 原站接口异常时保持空列表
  }
})
</script>

<style scoped>
.cm-page {
  position: relative;
  min-height: 100vh;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.cm-nav {
  position: relative;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.cm-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat 0 0 / 24px 24px;
}
.cm-nav__title {
  position: absolute;
  left: 180px;
  top: 16px;
  width: 30px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: rgb(51, 51, 51);
  text-align: center;
}
.cm-nav__confirm {
  position: absolute;
  left: 353px;
  top: 15.5px;
  width: 24px;
  height: 14px;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: rgb(51, 51, 51);
  text-align: center;
}
.cm-body {
  position: absolute;
  left: 0;
  top: 44px;
  width: 390px;
  padding: 16px;
}
.cm-label {
  width: 358px;
  height: 21px;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgb(51, 51, 51);
}
.cm-label--other {
  margin-top: 32px;
}
/* 三个胶囊 110x39 @(16,93) / (138,93) / (260,93) */
.cm-chips {
  width: 358px;
  height: 39px;
  margin-top: 12px;
  display: flex;
  gap: 12px;
}
.cm-chip {
  width: 110px;
  height: 39px;
  padding: 8px 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid rgb(231, 231, 234);
  border-radius: 44px;
}
.cm-chip__text {
  flex: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgb(51, 51, 51);
  text-align: center;
  white-space: nowrap;
}
.cm-other {
  width: 358px;
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.cm-other__item {
  padding: 8px 12px;
  background: #fff;
  border: 1px solid rgb(231, 231, 234);
  border-radius: 44px;
  font-size: 14px;
  line-height: 21px;
  color: rgb(51, 51, 51);
}
</style>
