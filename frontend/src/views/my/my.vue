<template>
  <div class="my-gold-bg">
    <!-- 用户卡片 -->
    <div class="my-card">
      <div class="my-card-topbtn my-bell" @click="doAction({ title: '推送消息', type: 10, isAuth: true })">
        <img class="my-topbtn-img" src="/assets/img/my/icon-bell.webp" alt="" />
        <i class="my-bell-dot" />
      </div>
      <div class="my-card-topbtn my-setting" @click="toPage('/pages/my/other-power')">
        <img class="my-topbtn-img" src="/assets/img/my/icon-setting.webp" alt="" />
      </div>

      <div class="my-card-main">
        <div class="my-avatar" @click="toPage(isLogin ? '/pages/my/info' : '/pages/login/login')">
          <img v-if="isLogin && avatarUrl" class="my-avatar-img" :src="avatarUrl" alt="" />
          <template v-else>
            <img class="my-avatar-def my-avatar-head" src="/assets/img/my/avatar-head.webp" alt="" />
            <img class="my-avatar-def my-avatar-body" src="/assets/img/my/avatar-body.webp" alt="" />
          </template>
        </div>

        <div class="my-card-info">
          <div
            v-if="isLogin"
            class="my-name text-overflow"
            @click="toPage('/pages/my/info')"
          >
            {{ userInfo.nickname }}
          </div>
          <div v-else class="my-name" @click="toPage('/pages/login/login')">请登录</div>

          <div v-if="isLogin" class="my-uid" @click="copyInviteCode(userInfo.inviter_code)">
            UID:{{ userInfo.inviter_code }}
            <span class="my-uid-icon">📄</span>
          </div>

          <div
            v-if="isLogin"
            class="my-auth-tag"
            :class="{ 'no-auth': !userInfo.real_name_authentication }"
            @click="toPage('/pages/certification/certification')"
          >
            <span>{{ userInfo.real_name_authentication ? '✓ 实名' : '未实名' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="my-quick-row">
      <div
        class="my-quick"
        @click="doAction({ title: '我的钱包', url: '/pages/wallet/wallet', type: 0, isAuth: true })"
      >
        <div class="my-quick-icon">
          <img class="my-quick-img" src="/assets/img/my/icon-wallet.webp" alt="" />
        </div>
        <span class="my-quick-text">我的钱包</span>
        <i class="my-arrow" />
      </div>
      <div
        class="my-quick"
        @click="doAction({ title: '藏品订单', url: '/pages/order/list', type: 0, isAuth: true })"
      >
        <div class="my-quick-icon">
          <img class="my-quick-img" src="/assets/img/my/icon-orders.webp" alt="" />
        </div>
        <span class="my-quick-text">藏品订单</span>
        <i class="my-arrow" />
      </div>
    </div>

    <!-- 我的数字藏品 -->
    <div
      class="my-collect-entry"
      @click="doAction({ title: '我的数字藏品', url: '/pages/myCollection/myCollection', type: 0, isAuth: true })"
    >
      <img class="my-collect-icon" src="/assets/img/my/icon-collection.webp" alt="" />
      <span class="my-collect-text">我的数字藏品</span>
      <i class="my-arrow" />
    </div>

    <!-- 常用服务 -->
    <div class="my-services">
      <div class="my-services-title">常用服务</div>
      <div class="my-services-grid">
        <div
          v-for="(s, i) in services"
          :key="i"
          class="my-service"
          @click="doAction(s)"
        >
          <div class="my-service-icon">
            <img class="my-service-img" :src="s.image" alt="" />
          </div>
          <span class="my-service-text">{{ s.title }}</span>
        </div>
      </div>
    </div>

    <div class="my-tabbar-placeholder" />
    <TabBar current="/pages/my/my" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import { useUserStore } from '@/stores/user'
import { OSS_URL } from '@/config'

const router = useRouter()
const userStore = useUserStore()

const isLogin = computed(() => userStore.isLogin)
const userInfo = computed(() => userStore.userInfo || {})

/** 原站 computed avatar：默认头像替换为站点 logo，OSS 相对路径补全 */
const avatarUrl = computed(() => {
  const a = userInfo.value.avatar
  if (!a) return ''
  if (a === '/defautAvatar.png') return '/assets/img/my/logo.webp'
  if (/^https?:\/\//.test(a)) return a
  return OSS_URL + a
})

/** 原站 myGoldServices 配置 */
const services = [
  { title: '交易记录', image: '/assets/img/my/icon-trade.webp', url: '/pages/consignments/myConsignment', type: 0, isAuth: true },
  { title: '发货记录', image: '/assets/img/my/icon-shipping.webp', url: '', type: 10, isAuth: true },
  { title: '收货地址', image: '/assets/img/my/icon-address.webp', url: '/pages/my/address/list', type: 0, isAuth: true },
  { title: '在线客服', image: '/assets/img/my/icon-service.webp', url: '/pages/my/service', type: 0, isAuth: false }
]

/** 原站 toPage */
function toPage(url) {
  router.push(url)
}

/** 原站 copyInviteCode */
function copyInviteCode(code) {
  if (!code) return
  if (navigator.clipboard) navigator.clipboard.writeText(String(code))
  else {
    const ta = document.createElement('textarea')
    ta.value = String(code)
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

/**
 * 原站 doAction：
 *  type 0 = 站内跳转 | 1 = 打开 IM webview | 2 = 外链 | 3 = QQ 群 | 4 = navigateTo 客服 | 10 = toast「即将开放」
 *  isAuth=true 且未登录 → 触发登录浮层
 */
function doAction(opt) {
  const type = opt.type
  if (opt.isAuth && !isLogin.value) {
    userStore.loginDemo()
    return
  }
  if (type === 1) {
    const token = localStorage.getItem('token')
    if (!token) return
    window.open(`${import.meta.env.VITE_H5_DOMAIN || ''}/im?token=${token}`, '_blank')
    return
  }
  if (type === 0) {
    toPage(opt.url)
    return
  }
  if (type === 2) {
    window.location.href = opt.url
    return
  }
  if (type === 4) {
    toPage('/pages/my/service')
    return
  }
  if (type === 10) {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: '即将开放' }))
  }
}
</script>

<style scoped>
/* rpx → px：390 / 750 = 0.52 */
.my-gold-bg {
  min-height: 100vh;
  background: #101115;
  padding: 10.4px 23.92px 0;
  box-sizing: border-box;
}

/* 用户卡片 */
.my-card {
  position: relative;
  margin-top: 4.16px;
  padding: 31.2px 0 17.68px 14.04px;
  border-radius: 15.6px;
  background: #17150f;
  border: 1.04px solid #3e3526;
  box-sizing: border-box;
}
.my-card-topbtn {
  position: absolute;
  top: 11.96px;
  cursor: pointer;
}
.my-topbtn-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
.my-bell {
  right: 45.76px;
}
.my-setting {
  right: 9.88px;
}
.my-bell-dot {
  position: absolute;
  top: -3.12px;
  left: -3.64px;
  width: 4.16px;
  height: 4.16px;
  border-radius: 50%;
  background: #d6b573;
}
.my-card-main {
  display: flex;
  align-items: center;
}
.my-avatar {
  position: relative;
  width: 45.76px;
  height: 45.76px;
  border-radius: 50%;
  background: #2c251a;
  border: 1.04px solid #a88b56;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
}
.my-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.my-avatar-def {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.my-avatar-head {
  top: 17%;
  width: 25%;
  height: 25%;
}
.my-avatar-body {
  top: 48%;
  width: 46%;
  height: 25%;
}
.my-card-info {
  margin-left: 16.12px;
  min-width: 0;
}
.my-name {
  max-width: 208px;
  font-size: 17.16px;
  font-weight: 700;
  color: #fff0d3;
  line-height: 21.84px;
  cursor: pointer;
}
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.my-uid {
  margin-top: 5.2px;
  font-size: 9.88px;
  color: #a59b88;
  line-height: 13px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.my-uid-icon {
  font-size: 8px;
  margin-left: 2px;
  opacity: 0.6;
}
.my-auth-tag {
  margin-top: 7.28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 18.2px;
  padding: 0 9.88px;
  border-radius: 18.2px;
  background: #30281b;
  border: 1.04px solid #675435;
  font-size: 10.4px;
  color: #f4dcaa;
  cursor: pointer;
}
.my-auth-tag.no-auth {
  color: #a59b88;
}

/* 快捷入口 */
.my-quick-row {
  display: flex;
  justify-content: space-between;
  margin-top: 19.76px;
}
.my-quick {
  position: relative;
  display: flex;
  align-items: center;
  width: 164.84px;
  height: 59.8px;
  padding-left: 11.96px;
  border-radius: 15.6px;
  background: #030303;
  border: 1.04px solid #302a20;
  box-sizing: border-box;
  cursor: pointer;
}
.my-quick-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30.16px;
  height: 30.16px;
  border-radius: 6.24px;
  background: #211c14;
}
.my-quick-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
.my-quick-text {
  margin-left: 11.96px;
  font-size: 13px;
  color: #f4e7cc;
}
.my-arrow {
  position: absolute;
  right: 19.76px;
  top: 50%;
  width: 7.8px;
  height: 7.8px;
  border-top: 1.56px solid #a09581;
  border-right: 1.56px solid #a09581;
  transform: translateY(-50%) rotate(45deg);
}

/* 我的数字藏品 */
.my-collect-entry {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 18.2px;
  height: 56.16px;
  padding-left: 16.12px;
  border-radius: 15.6px;
  background: #030303;
  border: 1.04px solid #302a20;
  box-sizing: border-box;
  cursor: pointer;
}
.my-collect-icon {
  width: 17.16px;
  height: 16.12px;
  object-fit: contain;
}
.my-collect-text {
  margin-left: 11.96px;
  font-size: 13px;
  color: #f4dcaa;
}

/* 常用服务 */
.my-services {
  margin-top: 21.84px;
  padding: 11.96px 11.96px 15.6px;
  border-radius: 15.6px;
  background: #030303;
  box-sizing: border-box;
}
.my-services-title {
  padding-left: 4.16px;
  font-size: 10.92px;
  color: #a2957e;
}
.my-services-grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 13.52px;
}
.my-service {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33.33%;
  margin-bottom: 15.6px;
  cursor: pointer;
}
.my-service-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 21.84px;
}
.my-service-img {
  width: 21.84px;
  height: 21.84px;
  object-fit: contain;
}
.my-service-text {
  margin-top: 5.2px;
  font-size: 10.92px;
  color: #ded7c8;
}

/* 底部占位 */
.my-tabbar-placeholder {
  height: 104px;
}
</style>
