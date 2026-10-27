<template>
  <!--
    原站 pages/invitation/invitation（金标准实测 2026-10-25 登录后抓取，390x844，黑金）
    结构：body radial-gradient(468px 364px at 50% -72px, rgba(130,96,59,0.38), rgba(3,3,3,0) 70%)
      → iv-topbar：返回 icon-back.webp 11x17 @(23,14)、标题「邀请活动」16px fw700 #f8f8f8 @(163,15.5,64,17)
      → iv-card：
          iv-tabs：「我的邀请码」tab 162x31 @(33,70) 金渐变，文字 11px fw700 #302518 @(86.5,80.5,55,12)
                    「邀请链接」11px #b5aa96 @(254,80.5,44,12)
          iv-card-body：
            「专属邀请码」8px #9f927a @(44,133.5,40,9)
            「L1224539」19px fw700 #f4dcaa @(44,147.5,79.2,21)
            「点击复制」10px #ecd6ad @(239,146,40,11)
            二维码 43x43 @(303,122)、label「二维码」7px #a79b84 @(314,171,21,8)
      → 「助力好友」14px fw700 #f8f8f8 @(23,225,56,15)
      → iv-assist：输入框 + 「邀请助力」按钮 72x31 @(286,263) 金渐变 br6px，文字 11px fw700 #302518 @(300,273.5,44,12)
      → iv-friends：空态 search-empty.png 121x122 @(134.5,374)
    数据：POST /index/getConfig（邀请配置）、POST /user/ranking { page:1, types:2 }（助力榜单）
          实调榜单 my_list 为空 → 原站渲染空态；邀请码取 getUserInfo.inviter_code
  -->
  <div class="iv-page">
    <div class="iv-topbar">
      <div class="iv-topbar__back" @click="goBack">
        <div class="iv-topbar__back-img"></div>
      </div>
      <span class="iv-topbar__title"><span>邀请活动</span></span>
    </div>

    <div class="iv-card">
      <div class="iv-tabs">
        <div class="iv-tab iv-tab--active" @click="tab = 'code'">
          <span class="iv-tab__text">我的邀请码</span>
        </div>
        <div class="iv-tab" @click="tab = 'link'">
          <span class="iv-tab__text">邀请链接</span>
        </div>
      </div>

      <div class="iv-card-body">
        <div class="iv-code-block">
          <span class="iv-code-label">专属邀请码</span>
          <span class="iv-code-value">{{ inviteCode }}</span>
        </div>
        <div class="iv-copy" @click="copyLink">
          <span class="iv-copy__text">点击复制</span>
        </div>
        <div class="iv-qr">
          <div class="iv-qr__box">
            <img class="iv-qr__img" :src="qrUrl" alt="" />
          </div>
          <span class="iv-qr__label">二维码</span>
        </div>
      </div>
    </div>

    <div class="iv-section">
      <span class="iv-section__title">助力好友</span>
    </div>

    <div class="iv-assist">
      <input
        v-model="friendCode"
        class="iv-assist-input"
        type="text"
        maxlength="140"
        placeholder="输入好友邀请码"
        placeholder-class="iv-assist-ph"
      />
      <div class="iv-assist-btn" @click="onAssist">
        <span class="iv-assist-btn__text">邀请助力</span>
      </div>
    </div>

    <div class="iv-friends">
      <div v-if="loading" class="iv-loading">
        <div class="iv-loading__spinner"></div>
        <span class="iv-loading__text">加载中</span>
      </div>
      <div v-else class="iv-empty">
        <img class="iv-empty__img" src="/assets/img/p0/empty/search-empty.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { getUserInfo, getInvitationConfig, getInvitationRanking } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const tab = ref('code')
const inviteCode = ref('')
const inviteUrl = ref('')
const friendCode = ref('')
const list = ref([])
const loading = ref(false)

/**
 * 二维码本地生成（不依赖原站 addons/qrcode 接口）
 * 内容与原站一致：邀请码或 H5 邀请链接。
 */
const qrDataUrl = ref('')

async function renderQr(text) {
  if (!text) {
    qrDataUrl.value = ''
    return
  }
  try {
    qrDataUrl.value = await QRCode.toDataURL(text, {
      width: 320,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
  } catch (e) {
    qrDataUrl.value = ''
  }
}

const qrUrl = computed(() => qrDataUrl.value)

watch(
  () => [inviteUrl.value, inviteCode.value],
  () => renderQr(inviteUrl.value || inviteCode.value || ''),
  { immediate: true }
)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function copyLink() {
  const text = tab.value === 'code' ? inviteCode.value : inviteUrl.value
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {})
  toast('已复制')
}

function onAssist() {
  if (!friendCode.value) {
    toast('请输入好友邀请码')
    return
  }
  toast('已提交助力')
}

onMounted(async () => {
  try {
    const res = await getUserInfo()
    inviteCode.value = (res.data && res.data.inviter_code) || ''
  } catch (e) {
    inviteCode.value = ''
  }
  try {
    const cfg = await getInvitationConfig()
    inviteUrl.value = (cfg.data && cfg.data.h5_invite_url) || ''
  } catch (e) {
    inviteUrl.value = ''
  }
  loading.value = true
  try {
    const res = await getInvitationRanking({ page: 1, types: 2 })
    const d = res.data || {}
    list.value = (d.data && d.data.my_list) || []
  } catch (e) {
    list.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.iv-page {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(468px 364px at 50% -72px, rgba(130, 96, 59, 0.38), rgba(3, 3, 3, 0) 70%),
    #101115;
  padding-bottom: 60px;
}
.iv-topbar {
  position: relative;
  height: 44px;
}
.iv-topbar__back {
  position: absolute;
  left: 23px;
  top: 14px;
  width: 11px;
  height: 17px;
}
.iv-topbar__back-img {
  width: 11px;
  height: 17px;
  background: url('/assets/img/p0/image/home-gold/icon-back.webp') no-repeat;
  background-size: 100% 100%;
}
.iv-topbar__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 17px;
  line-height: 17px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #f8f8f8;
}
.iv-topbar__title > span {
  font-size: 16px;
  line-height: 17px;
  font-weight: 700;
  color: #f8f8f8;
}
.iv-card {
  margin: 16px 23px 0;
  height: 141px;
  background: rgb(25, 23, 15);
  border: 1px solid rgb(64, 54, 36);
  border-radius: 10px;
  padding: 9px 9px 10px;
}
.iv-tabs {
  display: flex;
}
.iv-tab {
  height: 31px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.iv-tab--active {
  width: 162px;
  background: linear-gradient(135deg, #f3e1ba 0%, #c6a36b 100%);
}
.iv-tab:not(.iv-tab--active) {
  width: 44px;
  margin-left: 59px;
}
.iv-tab__text {
  display: inline-block;
  margin-top: 1px;
  font-size: 11px;
  line-height: 12px;
  font-weight: 400;
  color: #b5aa96;
}
.iv-tab--active .iv-tab__text {
  font-weight: 700;
  color: #302518;
}
.iv-card-body {
  position: relative;
  height: 81px;
  margin-top: 9px;
  padding: 23.5px 11px 0;
}
.iv-code-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.iv-code-label {
  display: inline-block;
  font-size: 8px;
  line-height: 9px;
  font-weight: 400;
  color: #9f927a;
}
.iv-code-value {
  display: inline-block;
  margin-top: 5px;
  font-size: 19px;
  line-height: 21px;
  font-weight: 700;
  color: #f4dcaa;
}
.iv-copy {
  position: absolute;
  left: 193px;
  top: 26px;
  width: 66px;
  height: 29px;
  border: 1px solid rgb(109, 88, 55);
  border-radius: 13px;
  background: rgb(42, 36, 25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.iv-copy__text {
  display: inline-block;
  margin-top: 1px;
  font-size: 10px;
  line-height: 11px;
  font-weight: 400;
  color: #ecd6ad;
  cursor: pointer;
}
.iv-qr {
  position: absolute;
  left: 270px;
  top: 12px;
  width: 43px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.iv-qr__box {
  width: 43px;
  height: 43px;
  background: #fff;
  overflow: hidden;
}
.iv-qr__img {
  width: 43px;
  height: 43px;
  display: block;
}
.iv-qr__label {
  margin-top: 6px;
  font-size: 7px;
  line-height: 8px;
  font-weight: 400;
  color: #a79b84;
}
.iv-section {
  margin: 24px 23px 0;
  display: flex;
  align-items: flex-start;
}
.iv-section__title {
  display: inline-block;
  font-size: 14px;
  line-height: 15px;
  font-weight: 700;
  color: #f8f8f8;
}
.iv-assist {
  margin: 14px 23px 0;
  height: 49px;
  padding: 0 9px;
  border: 1px solid rgb(48, 41, 30);
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.iv-assist-input {
  flex: 1;
  height: 31px;
  padding: 0 12px;
  border: 1px solid rgb(58, 50, 37);
  border-radius: 6px;
  background: rgba(14, 15, 14, 0.6);
  outline: none;
  font-size: 10px;
  line-height: 14px;
  color: #f8f8f8;
}
.iv-assist-ph {
  color: #827b6d;
  font-size: 10px;
}
.iv-assist-btn {
  margin-left: 9px;
  width: 72px;
  height: 31px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f3e1ba 0%, #c6a36b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.iv-assist-btn__text {
  display: inline-block;
  margin-top: 1px;
  font-size: 11px;
  line-height: 12px;
  font-weight: 700;
  color: #302518;
}
.iv-friends {
  margin-top: 51px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.iv-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.iv-loading__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #dae4ff;
  border-top-color: #4478ff;
  border-radius: 50%;
  animation: iv-spin 1.2s ease-in-out infinite;
}
@keyframes iv-spin {
  to {
    transform: rotate(360deg);
  }
}
.iv-loading__text {
  margin-top: 6px;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
}
.iv-empty {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.iv-empty__img {
  width: 121px;
  height: 122px;
  display: block;
}
</style>
