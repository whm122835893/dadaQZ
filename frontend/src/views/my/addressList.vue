<template>
  <!--
    原站 pages/my/address/list（金标准实测 2026-10-25 登录后抓取，390x844，黑金 #101115）
    结构：container page-container pa-16
      → nav 44px：返回（back-btn-white.png 24x24 @(13,10)）、标题「收货地址」15px bold #fff @(165,15.5,60,16)
      → addr-empty（mt-120 纵向居中）：
          addr-empty-dark.webp 121x102 @(134.5,184)
          「暂无收货地址哦～」12px #999 @(147,305,96,14)
          「去添加收货地址」按钮 137x34 @(126.5,336) 金渐变 br17px，文字 12px bold #2f2414
    数据：POST /user/address_list → 实调 { code:1, msg:"地址列表", data:[] } → 空态
  -->
  <div class="al-page">
    <div class="al-container">
      <div class="al-nav">
        <div class="al-nav__back" @click="goBack">
          <div class="al-nav__back-img"></div>
        </div>
        <span class="al-nav__title"><span>收货地址</span></span>
      </div>

      <div class="al-empty">
        <img class="al-empty__img" src="/assets/img/p0/empty/addr-empty-dark.webp" alt="" />
        <span class="al-empty__text">暂无收货地址哦～</span>
        <div class="al-empty__btn" @click="goAdd">
          <span class="al-empty__btn-text">去添加收货地址</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAddressList } from '@/api'

const router = useRouter()
const list = ref([])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

/** 去添加收货地址（原站 pages/my/address/edit） */
function goAdd() {
  router.push('/pages/my/address/edit')
}

onMounted(async () => {
  try {
    const res = await getAddressList()
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  }
})
</script>

<style scoped>
.al-page {
  position: relative;
  min-height: 100vh;
  background: #101115;
}
.al-container {
  position: relative;
  min-height: 100vh;
  padding: 16px 16px 0;
}
/* 原站 u-navbar 的返回键与标题相对页面定位（back 13,10；标题水平居中 y=15.5），
   与 pa-16 容器内 nav 盒（16,16,358,44）是两套定位上下文，故 nav 设为 static */
.al-nav {
  position: static;
  height: 44px;
}
.al-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.al-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn-white.png') no-repeat;
  background-size: 100% 100%;
}
.al-nav__title {
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
.al-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #fff;
}.al-empty {
  margin-top: 124px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 135px;
}
.al-empty__img {
  width: 121px;
  height: 102px;
  display: block;
}
.al-empty__text {
  margin-top: 19px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 400;
  color: #999;
}
.al-empty__btn {
  margin-top: 17px;
  min-width: 137px;
  height: 34px;
  padding: 0 10px;
  border-radius: 17px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.al-empty__btn-text {
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
  color: #2f2414;
}
</style>
