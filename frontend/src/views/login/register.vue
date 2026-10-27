<template>
  <!--
    原站 pages/login/register（chunk pages-login-register.10d354bd.js）
      装配 0da6：render 60c7 / logic 5efb（桥 cd5f）/ scope 1178b7ad
      结构：w-container.au-page#container
        → image.au-bg（login-bg.webp, aspectFill）
        → view.au-nav（占位，无关闭叉）
        → view.au-brand：image.au-logo + text.au-title×2 + text.au-desc
        → view.au-form：
            au-field（手机）  au-icon(mobile-gold) + au-input(maxlength 11「请输入手机号」) → form.mobile
            au-field（验证码）au-icon(safe-gold)   + au-input(maxlength 6「请输入验证码」)  → form.code
              + suffix u-code(seconds:60, changeText:"(重新发送 Xs)", uniqueKey:"register_page")
              + view.au-code @click=checkVerifyStatus
            au-field（密码）  au-icon(safe-gold)   + au-input(password「请输入密码」) → form.password
              + suffix w-icon(ispwd?eye-off:eye-fill, #9B998F, 18) @click=ispwd=!ispwd（form.password 非空时）
            au-field（邀请码）au-icon(invite-gold) + au-input(text「请输入邀请码」) → form.inviter_code
            view.au-submit{active: mobile&&code&&password} → text.au-submit-text「注册」
            view.au-link @click=goBack → text.au-link-text「已有账号，去登录」
            view.au-agree：au-check{checked} + 「我已阅读」+「《用户协议》」+「和」+「《隐私保护协议》」
        → captchaStatus ? w-jy-verify : _（滑块验证，本项目未接入）
      逻辑（5efb）：
        data { checked:false, isSend:true, tips:"获取验证码", ispwd:true,
               form:{mobile,password,code,inviter_code}, verifyShow, iptStyle_str:"color:#838383" }
        watch isAgreement（config store）→ checked = 1==isAgreement（immediate）
        onLoad({content}) → form.inviter_code = content || getStorageSync('invite_code')
        goBack → inviter_code ? redirectTo('/pages/login/login?content=xxx') : redirectTo('/pages/login/login')
        checkVerifyStatus / getCode（sendSms event:'register'）/ registerChange
        checkForm：mobile → code → password → 密码规则校验
        registerChange → register(form) → 存 token → getUserInfo → loginSuccess（toast + 回登录页）
      注：原站 w-icon 的 eye-off/eye-fill 指向 /static/icon/*.png，该资源在原站亦 404（image error → isErr）
          → 实际不渲染任何图标；本项目照搬：img @error 后移除（v-if），视觉与原站一致
  -->
  <div id="container" class="au-page">
    <img class="au-bg" src="/assets/img/login/login-bg.webp" alt="" />

    <div class="au-nav"></div>

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
          <input
            class="u-input"
            type="text"
            inputmode="numeric"
            maxlength="11"
            placeholder="请输入手机号"
            v-model="form.mobile"
          />
        </div>
      </div>

      <div class="au-field">
        <div class="au-icon">
          <img src="/assets/img/login/safe-gold.webp" alt="" />
        </div>
        <div class="au-input">
          <div class="au-input__line">
            <input
              class="u-input"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="请输入验证码"
              v-model="form.code"
            />
            <div class="au-code" @click="checkVerifyStatus">{{ tips }}</div>
          </div>
        </div>
      </div>

      <div class="au-field">
        <div class="au-icon">
          <img src="/assets/img/login/safe-gold.webp" alt="" />
        </div>
        <div class="au-input">
          <div class="au-input__line">
            <input
              class="u-input"
              :type="ispwdRef ? 'password' : 'text'"
              placeholder="请输入密码"
              v-model="form.password"
            />
            <!-- 原站 w-icon eye-off / eye-fill（/static/icon/*.png，原站 404 → 不渲染） -->
            <img
              v-if="form.password && !eyeErr"
              class="au-eye"
              :src="ispwdRef ? '/assets/img/icon/eye-off.png' : '/assets/img/icon/eye-fill.png'"
              alt=""
              @error="eyeErr = true"
              @click="ispwdRef = !ispwdRef"
            />
          </div>
        </div>
      </div>

      <div class="au-field">
        <div class="au-icon">
          <img src="/assets/img/login/invite-gold.webp" alt="" />
        </div>
        <div class="au-input">
          <input class="u-input" type="text" placeholder="请输入邀请码" v-model="form.inviter_code" />
        </div>
      </div>

      <div class="au-submit" :class="{ active: !!form.mobile && !!form.code && !!form.password }" @click="onRegisterClick">
        <span class="au-submit-text">注册</span>
      </div>

      <div class="au-link" @click="goBack">
        <span class="au-link-text">已有账号，去登录</span>
      </div>

      <div class="au-agree">
        <div class="au-check" :class="{ checked: checked }" @click.stop="checked = !checked">
          <span class="au-tick"></span>
        </div>
        <span class="au-agree-text">我已阅读</span>
        <span class="au-agree-link" @click.stop="openAgreement('用户协议')">《用户协议》</span>
        <span class="au-agree-text">和</span>
        <span class="au-agree-link" @click.stop="openAgreement('隐私政策')">《隐私保护协议》</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 注册页（对应原站 pages/login/register）
 *   短信：POST /sms/send  body { mobile, event:'register' }
 *   提交：POST /user/register  body { mobile, code, password, inviter_code }
 *   密码规则：数字+字母组合，长度 6-12
 */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sendSms, register as registerApi, getUserInfo } from '@/api'
import { toast } from '@/utils/toast'
import { useUserStore } from '@/stores/user'
import { useConfigStore } from '@/stores/config'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const configStore = useConfigStore()

/** 原站 data */
const form = reactive({ mobile: null, password: null, code: null, inviter_code: null })
const checked = ref(false)
const isSend = ref(true)
const tips = ref('获取验证码')
const ispwdRef = ref(true)
const eyeErr = ref(false)

/** 原站 watch isAgreement（immediate）→ checked = 1 == isAgreement */
const isAgreement = computed(() => configStore.config.isAgreement)
onMounted(() => {
  checked.value = String(isAgreement.value) === '1'
  /** 原站 onLoad({content}) → inviter_code = content || getStorageSync('invite_code') */
  const content = route.query.content
  form.inviter_code = content || localStorage.getItem('invite_code') || null
})

/** 原站 u-code：seconds=60 / changeText="(重新发送 Xs)" */
const SECONDS = 60
let timer = null
function startCode() {
  isSend.value = false
  let n = SECONDS
  tips.value = `(重新发送 ${n}s)`
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
    tips.value = `(重新发送 ${n}s)`
  }, 1000)
}

/** 原站 goBack */
function goBack() {
  if (form.inviter_code) router.replace(`/pages/login/login?content=${form.inviter_code}`)
  else router.replace('/pages/login/login')
}

function openAgreement(name) {
  const path = name === '用户协议' ? '/index/index/usageterms' : '/index/index/agreement'
  console.log('[register] toWebview →', path, name)
  toast(`《${name}》待接入`)
}

/** 原站 getCode → sendSms({mobile, event:'register'}) */
function getCode() {
  isSend.value = true
  sendSms({ mobile: form.mobile, event: 'register' })
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

/** 原站 checkForm */
function checkForm() {
  if (!form.mobile) {
    toast('请输入手机号')
    return false
  }
  if (!form.code) {
    toast('请输入验证码')
    return false
  }
  if (!form.password) {
    toast('请输入登录密码')
    return false
  }
  if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/.test(form.password)) {
    toast('密码内需同时包含数字、字母，长度在6-12之间')
    return false
  }
  return true
}

/** 原站 registerChange（uView throttle 500ms） */
let lastClick = 0
async function onRegisterClick() {
  const now = Date.now()
  if (now - lastClick < 500) return
  lastClick = now
  if (!checkForm()) return
  try {
    const res = await registerApi({ ...form })
    const ui = (res && res.data && res.data.userinfo) || res.data || {}
    userStore.setLogin(ui.token, ui)
    try {
      const u = await getUserInfo()
      if (u && u.data) userStore.setUserInfo(u.data)
    } catch (e) {
      /* ignore */
    }
    toast((res && res.msg) || '注册成功')
    goBack()
  } catch (e) {
    toast((e && e.msg) || '注册失败')
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 原站 scope 1178b7ad 页面级规则（与 forgetPwd 的 0270e746 同套 au-* 规则，实测值逐项一致）
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
/* 原站 register 页面 placeholder 实测 rgb(74,74,74)=#4A4A4A（与 login/login-code 的 #8B887D 不同，照搬） */
.u-input::placeholder {
  color: #4a4a4a;
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
/* 原站 w-icon name=eye-off / eye-fill，size=18 → 36rpx=18px，color #9B998F
   注意：/static/icon/eye-*.png 在原站即 404（image error → isErr → 不渲染），本项目同样在 @error 后移除 */
.au-eye {
  width: 18px;
  height: 18px;
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
