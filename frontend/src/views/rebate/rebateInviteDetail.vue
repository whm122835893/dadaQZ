<template>
  <!--
    原站 pages/rebate/rebateInviteDetail（被邀请人清单）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：body bg rgb(247,247,248)，页面 plr-5 pt-16 pb-16 font-size-8
            navbar 390x44 bg rgb(250,250,250)
              返回 back-btn.png 24x24 @(13,10)
              标题「被邀请人清单」15px bold rgb(51,51,51) @(150,16,90,16)
          → 表头行 @(0,44)：5 列，bd 1px solid rgb(248,147,...) 橙，高 48
              「昵称」34.6x48 @(5,60)
              「加入时间」69.1x48 @(39.6,60)
              「首次交易日期」86.3x48 @(108.8,60)
              「总交易金额」86.3x48 @(195.1,60)
              「本自然月交易金额」103.6x48 @(281.4,60)
          → 空态插画 121x122 @(134.5,212) search-empty.png
    端点：POST /user/bei_yao_list → 响应体为空
  -->
  <div class="ri-page">
    <div class="ri-nav">
      <div class="ri-nav__back" @click="goBack"></div>
      <span class="ri-nav__title">被邀请人清单</span>
    </div>

    <div class="ri-head">
      <div class="ri-head__col ri-head__col--nick">昵称</div>
      <div class="ri-head__col ri-head__col--join">加入时间</div>
      <div class="ri-head__col ri-head__col--first">首次交易日期</div>
      <div class="ri-head__col ri-head__col--all">总交易金额</div>
      <div class="ri-head__col ri-head__col--month">本自然月交易金额</div>
    </div>

    <div class="ri-empty">
      <div class="ri-empty__img"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBeiYaoList } from '@/api'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    await getBeiYaoList()
  } catch (e) {
    // 原站接口无响应，列表为空
  }
})
</script>

<style scoped>
.ri-page {
  position: relative;
  min-height: 100vh;
  padding: 44px 5px 16px;
  box-sizing: border-box;
  background: rgb(247, 247, 248);
  overflow: hidden;
}
.ri-nav {
  position: absolute;
  left: 0;
  top: 0;
  width: 390px;
  height: 44px;
  background: rgb(250, 250, 250);
}
.ri-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
  background: url('/static/icon/back-btn.png') no-repeat 0 0 / 24px 24px;
}
.ri-nav__title {
  position: absolute;
  left: 150px;
  top: 16px;
  width: 90px;
  height: 16px;
  font-size: 15px;
  font-weight: 700;
  line-height: 16px;
  color: rgb(51, 51, 51);
  text-align: center;
  white-space: nowrap;
}
/* 表头行 5 列 @(0,60)，高 48，橙色 1px 边框 */
.ri-head {
  position: absolute;
  left: 5px;
  top: 60px;
  width: 380px;
  height: 48px;
  display: flex;
}
.ri-head__col {
  height: 48px;
  box-sizing: border-box;
  border: 1px solid rgb(248, 147, 82);
  font-size: 12px;
  font-weight: 400;
  line-height: 48px;
  color: rgb(51, 51, 51);
  text-align: center;
  white-space: nowrap;
}
.ri-head__col--nick { width: 34.6px; }
.ri-head__col--join { width: 69.1px; }
.ri-head__col--first { width: 86.3px; }
.ri-head__col--all { width: 86.3px; }
.ri-head__col--month { width: 103.6px; }
/* 空态插画 121x122 @(134.5,212) */
.ri-empty {
  position: absolute;
  left: 134.5px;
  top: 212px;
  width: 121px;
  height: 122px;
}
.ri-empty__img {
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat 0 0 / 121px 122px;
}
</style>
