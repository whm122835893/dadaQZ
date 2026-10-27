<template>
  <!--
    原站 pages/login/forgetPwd（chunk pages-login-forgetPwd.db0d127c.js）
      装配 b4c4：render c91a / logic c608（桥 32a8）/ scope 0270e746
      结构：w-container.au-page#container
        → image.au-bg（login-bg.webp，aspectFill）
        → u-status-bar
        → view.au-nav → view.au-nav-close @click=goBack（两条交叉线构成 X）
        → view.au-brand：image.au-logo + text.au-title×2 + text.au-desc
        → view.au-form：
            au-field（手机）au-icon(mobile-gold) + au-input(u-input maxlength 11) → form.mobile
            au-field（验证码）au-icon(safe-gold) + au-input(maxlength 6) → form.captcha
              + suffix u-code(seconds:60, changeText:"重新获取 Xs", uniqueKey:"forgetpwd_page")
              + view.au-code @click=checkVerifyStatus
            au-field（新密码）  au-icon(safe-gold) + au-input(password) → form.newpassword
            au-field（确认密码）au-icon(safe-gold) + au-input(password) → form.re_password
            view.au-submit{active:isFormValid} → text.au-submit-text「确认」
            fromSetPage ? _ : view.au-link → text.au-link-text「已有账户?去登录」
            fromSetPage ? _ : view.au-agree（au-check + 「登录即同意」+「用户协议」+「和」+「隐私协议」）
        → captchaStatus ? w-jy-verify : _（滑块验证，本项目未接入）
      逻辑（c608）：
        data { form{mobile,captcha,newpassword,re_password}, checkAgree:true, isSend:true,
               tips:"获取验证码", verifyShow, verificationUrl:"", fromSetPage:false, ... }
        computed isFormValid = 四项非空；captchaStatus（config store，未接入 → false）
        onLoad → 上一页 route 含 "my/setting"/"my/info" → fromSetPage=true
        goLogin → reLaunch('/pages/login/login')
        handleConfirm → !isFormValid 依次 toast（手机号/验证码/新密码/再次输入）
                        → 两次不一致 toast「两次输入的密码不一致」
                        → 不匹配 /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/
                          toast「密码内需同时包含数字、字母，长度在6-12之间」
                        → resetLoginPwd(form) → toast(res.msg) → 1.5s 后 reLaunch 登录页
        checkVerifyStatus → mobile? 11位? getCode() : toast「请输入11位手机号」 : toast「请输入手机号」
        getCode → sendSms({mobile, event:'resetpwd'}) → uCode.start()
  -->
  <div id="container" class="au-page">
    <img class="au-bg" src="/assets/img/login/login-bg.webp" alt="" />

    <div class="au-statusbar"></div>

    <div class="au-nav">
      <div class="au-nav-close" @click="goBack">
        <span class="au-close-line au-close-line-a"></span>
        <span class="au-close-line au-close-line-b"></span>
      </div>
    </div>

    <div class="au-brand">
      <img class="au-logo" src="/assets/img/login/login-logo.webp" alt="" />
      <span class="au-title">遇见艺术</span>
      <span class="au-title">收藏热爱</span>
      <span class="au-desc">嗒嗒，让每一份热爱都有回响</span>
    </div>

    <div class="au-form">
      <div class="au-field">
        <div class="au-icon">
          <img src="/assets/img/login/mobile-gold.webp" alt="" />
        </div>
        <div class="au-input">
          <input class="u-input" type="text" inputmode="numeric" maxlength="11" placeholder="请输入手机号" v-model="form.mobile" />
        </div>
      </div>

      <div class="au-field">
        <div class="au-icon">
          <img src="/assets/img/login/safe-gold.webp" alt="" />
        </div>
        <div class="au-input">
          <div class="au-input__line">
            <input class="u-input" type="text" inputmode="numeric" maxlength="6" placeholder="请输入验证码" v-model="form.captcha" />
            <div class="au-code" @click="checkVerifyStatus">{{ tips }}</div>
          </div>
        </div>
      </div>

      <div class="au-field">
        <div class="au-icon">
          <img src="/assets/img/login/safe-gold.webp" alt="" />
        </div>
        <div class="au-input">
          <input class="u-input" type="password" placeholder="请输入新密码" v-model="form.newpassword" />
        </div>
      </div>

      <div class="au-field">
        <div class="au-icon">
          <img src="/assets/img/login/safe-gold.webp" alt="" />
        </div>
        <div class="au-input">
          <input class="u-input" type="password" placeholder="请再次输入新密码" v-model="form.re_password" />
        </div>
      </div>

      <div class="au-submit" :class="{ active: isFormValid }" @click="handleConfirm">
        <span class="au-submit-text">确认</span>
      </div>

      <div v-if="!fromSetPage" class="au-link" @click="goLogin">
        <span class="au-link-text">已有账户?去登录</span>
      </div>

      <div v-if="!fromSetPage" class="au-agree">
        <div class="au-check" :class="{ checked: checkAgree }" @click.stop="toggleAgree">
          <span class="au-tick"></span>
        </div>
        <span class="au-agree-text">登录即同意</span>
        <span class="au-agree-link" @click.stop="openAgreement('用户协议')">用户协议</span>
        <span class="au-agree-text">和</span>
        <span class="au-agree-link" @click.stop="openAgreement('隐私协议')">隐私协议</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 忘记密码页（对应原站 pages/login/forgetPwd）
 *   短信：POST /sms/send  body { mobile, event:'resetpwd' }
 *   提交：POST /user/resetpwd  body { mobile, captcha, newpassword, re_password }
 *   密码规则：数字+字母组合，长度 6-12
 */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { sendSms, resetLoginPwd } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()

/** 原站 data */
const form = reactive({ mobile: '', captcha: '', newpassword: '', re_password: '' })
const checkAgree = ref(true)
const isSend = ref(true)
const tips = ref('获取验证码')
const fromSetPage = ref(false)

/** 原站 computed.isFormValid */
const isFormValid = computed(
  () =>
    !!form.mobile &&
    form.mobile.trim() !== '' &&
    !!form.captcha &&
    form.captcha.trim() !== '' &&
    !!form.newpassword &&
    form.newpassword.trim() !== '' &&
    !!form.re_password &&
    form.re_password.trim() !== ''
)

/** 原站 u-code：seconds=60 / changeText="重新获取 Xs" */
const SECONDS = 60
let timer = null
function startCode() {
  isSend.value = false
  let n = SECONDS
  tips.value = `重新获取 ${n}s`
  clearInterval(timer)
  timer = window.setInterval(() => {
    n -= 1
    if (n <= 0) {
      clearInterval(timer)
      timer = null
      tips.value = '获取验证码'
      isSend.value = true
      return
    }
    tips.value = `重新获取 ${n}s`
  }, 1000)
}

/** 原站 onLoad：上一页为 my/setting 或 my/info 时 fromSetPage=true（隐藏「去登录」与协议行） */
onMounted(() => {
  const back = (window.history && window.history.state && window.history.state.back) || ''
  fromSetPage.value = String(back).includes('my/info') || String(back).includes('my/setting')
})

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/login/login')
}

/** 原站 goLogin → reLaunch('/pages/login/login') */
function goLogin() {
  router.replace('/pages/login/login')
}

function toggleAgree() {
  checkAgree.value = !checkAgree.value
}

/** 原站 toWebview（本项目未接入 webview 页，保持既有惯例：toast + console） */
function openAgreement(name) {
  const path = name === '用户协议' ? '/index/index/usageterms' : '/index/index/agreement'
  console.log('[forgetPwd] toWebview →', path, name)
  toast(`《${name}》待接入`)
}

/** 原站 getCode → sendSms({mobile, event:'resetpwd'}) */
function getCode() {
  isSend.value = true
  sendSms({ mobile: form.mobile, event: 'resetpwd' })
    .then(() => {
      startCode()
      toast('发送成功')
    })
    .catch((e) => toast((e && e.msg) || '发送失败'))
}

/** 原站 checkVerifyStatus */
function checkVerifyStatus() {
  if (!form.mobile) return toast('请输入手机号')
  if (String(form.mobile).length !== 11) return toast('请输入11位手机号')
  getCode()
}

/** 原站 handleConfirm */
function handleConfirm() {
  if (!isFormValid.value) {
    if (!form.mobile) return toast('请输入手机号')
    if (!form.captcha) return toast('请输入验证码')
    if (!form.newpassword) return toast('请输入新密码')
    return toast('请再次输入新密码')
  }
  if (form.newpassword !== form.re_password) return toast('两次输入的密码不一致')
  /* 原站密码规则（逐字） */
  if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/.test(form.newpassword)) {
    return toast('密码内需同时包含数字、字母，长度在6-12之间')
  }
  resetLoginPwd({ ...form })
    .then((res) => {
      toast((res && res.msg) || '重置成功')
      setTimeout(() => router.replace('/pages/login/login'), 1500)
    })
    .catch((e) => toast((e && e.msg) || '重置失败'))
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 原站 scope 0270e746 页面级规则
   口径与原站 live 实测（390×844 Chrome）逐项核对：
     - 尺寸/字号/间距：floor(rpx * 0.52)（99rpx=51px、65rpx=33px、93rpx=48px、77rpx=40px…）
     - 边框：实测 computed 均为 1px
     - uni-text 组件自带 margin-top（.au-title 15px / .au-desc 17px），显式补齐
     - .au-submit-text 未激活为 #aaa（激活态才 #24211d） */
.au-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #030303;
}
.au-page {
  box-sizing: border-box;
  padding-bottom: 31px;
  overflow: hidden;
}
/* .au-bg：100vw × 216.66vw（实测 390 × 845） */
.au-bg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 216.66vw;
  min-height: 100vh;
  z-index: 0;
  object-fit: cover;
}
/* 原站 u-status-bar：占位状态栏高度 */
.au-statusbar {
  position: relative;
  z-index: 2;
  height: env(safe-area-inset-top);
}
/* .au-nav：92rpx=47px，padding 0 34rpx=17px */
.au-nav {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 47px;
  padding: 0 17px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* .au-nav-close：left 34rpx=17px / bottom 24rpx=12px；26rpx=13px */
.au-nav-close {
  position: absolute;
  left: 17px;
  bottom: 12px;
  width: 13px;
  height: 13px;
  cursor: pointer;
}
/* .au-close-line：left -4rpx=-2px top 11rpx=5px；34rpx×3rpx=17×1px；radius 2rpx=1px */
.au-close-line {
  position: absolute;
  left: -2px;
  top: 5px;
  width: 17px;
  height: 1px;
  border-radius: 1px;
  background-color: #fff;
}
.au-close-line-a {
  transform: rotate(45deg);
}
.au-close-line-b {
  transform: rotate(-45deg);
}
/* .au-brand：padding 0 50rpx=26px */
.au-brand {
  position: relative;
  z-index: 2;
  padding: 0 26px;
  box-sizing: border-box;
}
.au-logo {
  display: block;
  width: 85px;
  height: 37px;
}
/* .au-title：65rpx=33px / 700 / line-height 82rpx=42px / ls 1rpx=0.5px / margin-top 15px（uni-text 自带） */
.au-title {
  display: block;
  font-size: 33px;
  font-weight: 700;
  line-height: 42px;
  color: #f6e4ba;
  letter-spacing: 0.5px;
  margin-top: 15px;
}
.au-title + .au-title {
  margin-top: 0;
}
/* .au-desc：26rpx=13px；margin-top 17px（uni-text 自带） */
.au-desc {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: #f6e4ba;
  margin-top: 17px;
}
/* .au-form：padding 0 51rpx=26px；margin-top 12vh（实测 101.28px） */
.au-form {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 0 26px;
  margin-top: 12vh;
  box-sizing: border-box;
}
/* .au-field：99rpx=51px；padding 0 34rpx 0 42rpx = 0 17px 0 21px；radius 48rpx=24px */
.au-field {
  width: 100%;
  height: 51px;
  background: linear-gradient(303deg, #1f1d18, #101211 28%, #191919 65%, #252521);
  border: 1px solid #9e8050;
  border-radius: 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 17px 0 21px;
  overflow: hidden;
}
/* 实测首个 .au-field 紧贴 .au-form 顶边（y=320.27），后续行带 13px */
.au-field + .au-field {
  margin-top: 13px;
}
/* .au-icon：35rpx×46rpx = 18×23px（display block，img 紧贴左上） */
.au-icon {
  width: 18px;
  height: 23px;
  position: relative;
  flex-shrink: 0;
  display: block;
}
.au-icon img {
  width: 15px;
  display: block;
}
/* .au-input：flex 1，margin-left 14rpx=7px；实测高度 24px */
.au-input {
  flex: 1;
  margin-left: 7px;
  min-width: 0;
}
.au-input__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}
/* 原站 u-input：fontSize 13 / color #F6E4BA / placeholderStyle "color: #8B887D; font-size: 26rpx"
   + 页面 .u-input{background-color:initial!important;padding:0!important} */
.u-input {
  background-color: transparent !important;
  padding: 0 !important;
  border: none;
  outline: none;
  width: 100%;
  min-width: 0;
  height: 24px;
  font-size: 13px;
  color: #f6e4ba;
  line-height: 24px;
  -webkit-appearance: none;
}
.u-input::placeholder {
  color: #8b887d;
  font-size: 13px;
}
.u-input::-webkit-outer-spin-button,
.u-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* .au-code：min-width 190rpx=98px / max-width 300rpx=156px / padding 0 26rpx=13px；
   height 67rpx=34px；radius 34rpx=17px；25rpx=13px/700；line-height 13px */
.au-code {
  width: auto;
  min-width: 98px;
  max-width: 156px;
  padding: 0 13px;
  white-space: nowrap;
  height: 34px;
  border-radius: 17px;
  background: linear-gradient(135deg, #f9e8c4, #d4b68a 28%, #ffefd4 56%, #d9bc8e);
  border: 1px solid #f6e4ba;
  box-sizing: border-box;
  color: #28201e;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 13px;
  flex-shrink: 0;
  margin-left: 8px;
  cursor: pointer;
}
/* .au-submit：93rpx=48px；radius 47rpx=24px；margin-top 77rpx=40px */
.au-submit {
  width: 100%;
  height: 48px;
  background: #2b2a26;
  border: 1px solid #2b2a26;
  border-radius: 24px;
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  cursor: pointer;
}
.au-submit.active {
  background: linear-gradient(135deg, #f9e8c4, #d4b68a 28%, #ffefd4 56%, #d9bc8e);
  border: 1px solid #f6e4ba;
}
/* .au-submit-text：32rpx=16px / 700 / 未激活 #aaa（实测）；line-height 16px */
.au-submit-text {
  font-size: 16px;
  font-weight: 700;
  color: #aaa;
  line-height: 16px;
}
.au-submit.active .au-submit-text {
  color: #24211d;
}
/* .au-link：margin-top 23rpx=11px */
.au-link {
  margin-top: 11px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.au-link-text {
  font-size: 13px;
  font-weight: 400;
  color: #f6e4ba;
  text-decoration-line: underline;
  line-height: normal;
}
/* .au-agree：margin-top 61rpx=31px */
.au-agree {
  margin-top: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.au-check {
  width: 17px;
  height: 17px;
  border: 1px solid #c1bfb4;
  border-radius: 50%;
  box-sizing: border-box;
  margin-right: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.au-tick {
  display: none;
  width: 7px;
  height: 4px;
  border-left: 1px solid #f6e4ba;
  border-bottom: 1px solid #f6e4ba;
  transform: rotate(-45deg);
  margin-top: -1px;
}
.au-check.checked .au-tick {
  display: block;
}
.au-agree-text {
  font-size: 11px;
  color: #9b998f;
  line-height: normal;
}
.au-agree-link {
  font-size: 11px;
  color: #f6e4ba;
  line-height: normal;
  cursor: pointer;
}
</style>
