<template>
  <!--
    原站 pages/market/search（搜索页）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：body bg rgb(247,247,248)
            diy-nav 390x44 bg rgb(250,250,250)，页面 padding-top 44px
              返回 back-btn.png 24x24 @(16,10)
              搜索框 312x37 @(62,3.5) bg #fff br100px bd 1px solid #fff，pad 6px 9px
                放大镜图标 search3.png 24x24 @(72,10)
                placeholder「请输入内容」15px rgb(192,196,204) @(100,9,264,26)
          → 类型切换
              「数字藏品」16px rgb(51,51,51) @(136,62,64,24) active
              「盲盒」14px rgb(122,122,122) @(226,63.5,28,21)
    端点：输入关键字后才请求（本次未输入，原站无请求）
  -->
  <div class="ms-page">
    <div class="ms-nav">
      <div class="ms-nav__back" @click="goBack"></div>
      <div class="ms-search">
        <div class="ms-search__icon"></div>
        <input class="ms-search__input" type="search" v-model="keyword" placeholder="请输入内容" />
      </div>
    </div>

    <div class="ms-type">
      <span class="ms-type__item ms-type__item--on" @click="curType = 'collection'">数字藏品</span>
      <span class="ms-type__item" @click="curType = 'box'">盲盒</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')
const curType = ref('collection')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}
</script>

<style scoped>
.ms-page {
  position: relative;
  min-height: 100vh;
  padding-top: 44px;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.ms-nav {
  position: absolute;
  left: 0;
  top: 0;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
  display: flex;
  align-items: center;
}
.ms-nav__back {
  position: absolute;
  left: 16px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat 0 0 / 24px 24px;
}
/* 搜索框 312x37 @(62,3.5) */
.ms-search {
  position: absolute;
  left: 62px;
  top: 3.5px;
  width: 312px;
  height: 37px;
  padding: 6px 9px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #fff;
  border-radius: 100px;
}
.ms-search__icon {
  width: 24px;
  height: 24px;
  flex: none;
  background: url('/static/icon/search3.png') no-repeat 0 0 / 24px 24px;
}
.ms-search__input {
  flex: 1;
  min-width: 0;
  margin-left: 4px;
  border: none;
  outline: none;
  background: transparent;
  height: 26px;
  font-size: 15px;
  line-height: 26px;
  color: #000;
  text-align: left;
}
.ms-search__input::placeholder {
  color: rgb(192, 196, 204);
}
/* 类型切换 */
.ms-type {
  position: absolute;
  left: 0;
  top: 44px;
  width: 390px;
  height: 45px;
  display: flex;
  justify-content: center;
  gap: 26px;
  align-items: flex-start;
  padding-top: 18px;
}
.ms-type__item {
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: rgb(122, 122, 122);
  white-space: nowrap;
}
.ms-type__item--on {
  font-size: 16px;
  line-height: 24px;
  color: rgb(51, 51, 51);
}
</style>
