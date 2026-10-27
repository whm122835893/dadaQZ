<template>
  <!--
    原站 pages/my/cancellation（金标准实测 2026-10-25，390x844，黑金 #101115）
    结构：nav(透明, back-white 24x24@(13,10), 标题15px bold #fff)
      → 金边卡 (15,59,360,284) bg#181713 边1px #655032 br15
          v-html config.cancellation（p 14px/28px #fff，首行缩进由 &nbsp; 提供）
      → 勾选行 (52,734,286,18)：圆圈 16x16 bg#fff 边1px #c8c9cc + 文本12px #999
      → 确认按钮 (12,768,366,52) bg#211c14 边1px #201f1c br10 文本14px bold #f4dcaa
    交互：勾选后可注销（推断）；/user/delAccount（原站真实端点）→ 清除登录态回登录页
  -->
  <div class="cx-page">
    <div class="cx-nav">
      <img class="cx-nav__back" src="/assets/img/my/back-btn-white.png" alt="" @click="goBack" />
      <span class="cx-nav__title">注销账号申请</span>
    </div>

    <div class="cx-card" v-html="content" />

    <div class="cx-agree">
      <i class="cx-agree__circle" :class="{ 'cx-agree__circle--on': agreed }" @click="agreed = !agreed">
        <span v-if="agreed" class="uview-icon cx-agree__icon">&#xe807;</span>
      </i>
      <span class="cx-agree__text">我已阅读并知晓，愿意承担注销账户带来的后果。</span>
    </div>

    <div class="cx-btn" @click="confirmCancel">确认注销</div>

    <!-- 二次确认弹层（推断，对齐原站 u-modal 取消/确认文案） -->
    <div v-if="showModal" class="cx-mask" @click.self="showModal = false">
      <div class="cx-modal">
        <div class="cx-modal__text">确认注销账号？注销后所有数据将无法恢复。</div>
        <div class="cx-modal__btns">
          <span class="cx-modal__btn" @click="showModal = false">取消</span>
          <span class="cx-modal__btn cx-modal__btn--primary" @click="doCancel">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getConfig, delAccount } from '@/api'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/toast'

const router = useRouter()
const userStore = useUserStore()

const content = ref(
  '<p>&nbsp;帐号安全状态：&nbsp;</p><p>您的账号没有被盗风险及违规行为</p><p>&nbsp;帐号安全状态：&nbsp;</p><p>1、无法登录；&nbsp;</p><p>2、所有信息将用于删除和清理（包括加入社区、账户余额、发布动态、聊天记录等）；</p><p>3、绑定手机/微信/AppleID/人脸认证等将会解绑；&nbsp;</p><p>4、其他不限于以上所列举的你的账号的资产和权益。&nbsp;</p>'
)

getConfig().then((res) => {
  if (res.data && res.data.cancellation) content.value = res.data.cancellation
})

const agreed = ref(false)
const showModal = ref(false)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

function confirmCancel() {
  if (!agreed.value) return toast('请先勾选同意注销协议')
  showModal.value = true
}

async function doCancel() {
  showModal.value = false
  await delAccount()
  userStore.logout()
  toast('注销成功')
  setTimeout(() => router.replace('/pages/login/login'), 800)
}
</script>

<style scoped>
.cx-page {
  min-height: 100vh;
  background: #101115;
}
.cx-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  z-index: 10;
}
.cx-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.cx-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}
.cx-card {
  margin: 59px 15px 0;
  height: 284px;
  background: #181713;
  border: 1px solid #655032;
  border-radius: 15px;
  padding: 15px 15px 0;
  overflow: hidden;
}
.cx-card :deep(p) {
  margin: 0;
  font-size: 14px;
  line-height: 28px;
  color: #fff;
}
.cx-agree {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 92px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
.cx-agree__circle {
  position: relative;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #c8c9cc;
  box-sizing: border-box;
  cursor: pointer;
}
.cx-agree__circle--on {
  background: #cfaf72;
  border-color: #cfaf72;
}
.cx-agree__icon {
  position: absolute;
  left: 1px;
  top: 1px;
  width: 12px;
  height: 12px;
  font-size: 12px;
  line-height: 12px;
  color: #fff;
}
.cx-agree__text {
  margin-left: 8px;
  font-size: 12px;
  line-height: normal;
  color: #999;
}
.cx-btn {
  position: fixed;
  left: 12px;
  right: 12px;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  height: 52px;
  background: #211c14;
  border: 1px solid #201f1c;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #f4dcaa;
  cursor: pointer;
  z-index: 5;
}
.cx-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cx-modal {
  width: 300px;
  background: #181713;
  border: 1px solid #655032;
  border-radius: 12px;
  padding: 24px 20px 16px;
}
.cx-modal__text {
  font-size: 14px;
  line-height: 22px;
  color: #ede6d6;
  text-align: center;
}
.cx-modal__btns {
  display: flex;
  margin-top: 20px;
}
.cx-modal__btn {
  flex: 1;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 14px;
  color: #ede6d6;
  border: 1px solid #655032;
  border-radius: 19px;
  margin-left: 10px;
  cursor: pointer;
}
.cx-modal__btn:first-child {
  margin-left: 0;
}
.cx-modal__btn--primary {
  background: #211c14;
  color: #f4dcaa;
}
</style>
