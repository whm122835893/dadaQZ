<template>
  <!--
    原站 pages/login/login（chunk pages-login-login.543162da.js）
      装配 b597：render bde4 / logic dee4（桥 16fb）/ scope 5fa3e445
      结构：w-container.login-page#container
        → image.login-bg-img（/static/image/login-gold/login-bg.webp, aspectFill）
        → view.login-nav（占位，无内容）
        → view.brand：image.brand-logo + view.reg-btn(→pages/login/register) + text.brand-title×2 + text.brand-desc
        → view.form-wrap：
            input-row（手机）→ row-icon(mobile-gold) + row-input(u-input: loginType==1→form.account / 2→form2.mobile)
            loginType==2 → input-row（验证码）→ row-icon(safe-gold) + row-input(u-input form2.captcha + suffix: u-code + code-btn)
            loginType==1 → input-row（密码）→ row-icon(safe-gold) + row-input(u-input password + suffix forget-pwd)
            view.login-btn{active:loginActive} → text.login-btn-text「确认登录」
            view.switch-link → text.switch-text（1==loginType?「验证码登录」:「密码登录」）
            view.agreement：agree-check{checked} + agree-normal「我已阅读并同意」
                            + agree-link「用户协议」+ agree-normal「和」+ agree-link「隐私政策」
        → verificationUrl ? web-view : _（滑块验证，本项目未接入）
        → u-popup(verifyShow)（同上）
      逻辑（dee4）：
        data { checked, isSend, tips:"获取验证码", iptStyle, iptStyle_str:"color:#8B887D",
               loginType:2, ispwd:true, form:{account,password}, form2:{mobile,captcha},
               verifyShow, verificationUrl:"", inviter_code, checkAgree:true }
        computed loginActive = 1==loginType ? !!(form.account&&form.password) : !!(form2.mobile&&form2.captcha)
        onLoad({content}) → inviter_code = content
        toggleAgree / goBack / checkVerifyStatus
        getCode() → mobile? 11位? sendSms({mobile,event:"login"}) → $refs.uCode.start() : toast("请输入11位手机号") : toast("请输入手机号")
        loginChange() → checkForm() → login({...d, inviter_code}, loginType)
                        → setStorage(token) / isNewUser / $emit("loginStatus") / getUserInfo() → toast("登录成功") → switchTab index
        checkForm()：按 loginType 依次校验 account / password / mobile / captcha
      u-code（uView）：seconds=60、changeText="(重新发送 Xs)"、uniqueKey="login_page"、keepRunning
  -->
  <div id="container" class="login-page">
    <img class="login-bg-img" src="/assets/img/login/login-bg.webp" alt="" />

    <div class="login-nav"></div>

    <div class="brand">
      <img class="brand-logo" src="/assets/img/login/login-logo.webp" alt="" />
      <div class="reg-btn" @click="toRegister">
        <span class="reg-text">注册</span>
      </div>
      <span class="brand-title">遇见艺术</span>
      <span class="brand-title">收藏热爱</span>
      <span class="brand-desc">嗒嗒，让每一份热爱都有回响</span>
    </div>

    <div class="form-wrap">
      <!-- 手机号行（loginType 1/2 共用，绑定字段不同） -->
      <div class="input-row">
        <div class="row-icon">
          <img src="/assets/img/login/mobile-gold.webp" alt="" />
        </div>
        <div class="row-input">
          <!-- 原站 u-input type="number"：uni-app 返回字符串；Vue3 对 type=number 会自动转数字，
               故用 type="text"+inputmode="numeric" 保持数字键盘与字符串值语义一致 -->
          <input
            class="u-input"
            type="text"
            inputmode="numeric"
            maxlength="11"
            placeholder="请输入手机号"
            v-model="phone"
          />
        </div>
      </div>

      <!-- 验证码行（loginType==2） -->
      <div v-if="loginType === 2" class="input-row">
        <div class="row-icon">
          <img src="/assets/img/login/safe-gold.webp" alt="" />
        </div>
        <div class="row-input">
          <div class="row-input__line">
            <input class="u-input" type="text" inputmode="numeric" maxlength="6" placeholder="请输入验证码" v-model="form2.captcha" />
            <div class="code-btn" @click="getCode">{{ tips }}</div>
          </div>
        </div>
      </div>

      <!-- 密码行（loginType==1，原站 ispwd 恒为 true → 只渲染 password 输入） -->
      <div v-if="loginType === 1" class="input-row">
        <div class="row-icon">
          <img src="/assets/img/login/safe-gold.webp" alt="" />
        </div>
        <div class="row-input">
          <div class="row-input__line">
            <input class="u-input" type="password" placeholder="请输入密码" v-model="form.password" />
            <span class="forget-pwd" @click="toForgetPwd">忘记密码？</span>
          </div>
        </div>
      </div>

      <div class="login-btn" :class="{ active: loginActive }" @click="onLoginClick">
        <span class="login-btn-text">确认登录</span>
      </div>

      <div class="switch-link" @click="switchType">
        <span class="switch-text">{{ loginType === 1 ? '验证码登录' : '密码登录' }}</span>
      </div>

      <div class="agreement">
        <div class="agree-check" :class="{ checked: checkAgree }" @click.stop="toggleAgree">
          <span class="agree-tick"></span>
        </div>
        <span class="agree-normal">我已阅读并同意</span>
        <span class="agree-link" @click.stop="openAgreement('用户协议')">用户协议</span>
        <span class="agree-normal">和</span>
        <span class="agree-link" @click.stop="openAgreement('隐私政策')">隐私政策</span>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页（对应原站 pages/login/login）
 *   双模式：loginType=1 密码登录（/user/login）/ 2 验证码登录（/user/LoginForMobile，默认）
 *   短信：POST /sms/send  body { mobile, event:'login' }
 *   登录成功：写入 token → 拉取 userInfo → toast 登录成功 → 进入首页
 */
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { login, loginByCode, sendSms, getUserInfo } from '@/api'
import { toast } from '@/utils/toast'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

/** 原站 data */
const loginType = ref(2)
const ispwd = ref(true)
const form = reactive({ account: null, password: null })
const form2 = reactive({ mobile: null, captcha: null })
const tips = ref('获取验证码')
const isSend = ref(true)
const checked = ref(true)
const checkAgree = ref(true)
const inviter_code = ref(null)

/** 手机号两个模式共用输入框：loginType==1 写 form.account，==2 写 form2.mobile */
const phone = computed({
  get: () => (loginType.value === 1 ? form.account : form2.mobile) || '',
  set: (v) => {
    if (loginType.value === 1) form.account = v
    else form2.mobile = v
  }
})

/** 原站 computed.loginActive */
const loginActive = computed(() =>
  loginType.value === 1 ? !!(form.account && form.password) : !!(form2.mobile && form2.captcha)
)

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

/** 原站 getCode() */
function getCode() {
  const mobile = form2.mobile
  if (!mobile) return toast('请输入手机号')
  if (String(mobile).length !== 11) return toast('请输入11位手机号')
  isSend.value = true
  sendSms({ mobile, event: 'login' })
    .then(() => {
      startCode()
      toast('发送成功')
    })
    .catch((e) => toast((e && e.msg) || '发送失败'))
}

/** 原站 switch-link → loginType = 1==loginType ? 2 : 1 */
function switchType() {
  loginType.value = loginType.value === 1 ? 2 : 1
}

/** 原站 toggleAgree */
function toggleAgree() {
  checkAgree.value = !checkAgree.value
  checked.value = checkAgree.value
}

/** 原站 $u.route('pages/login/register') / ('pages/login/forgetPwd') */
function toRegister() {
  router.push('/pages/login/register')
}
function toForgetPwd() {
  router.push('/pages/login/forgetPwd')
}

/** 原站 toWebview('/index/index/usageterms','用户协议') / ('/index/index/agreement','隐私协议')
 *  本项目未接入 webview 页，保持与既有页面一致：toast + console 记录目标 */
function openAgreement(name) {
  const path = name === '用户协议' ? '/index/index/usageterms' : '/index/index/agreement'
  console.log('[login] toWebview →', path, name)
  toast(`《${name}》待接入`)
}

/** 原站 checkForm()：按 loginType 依次校验 */
function checkForm() {
  if (!form.account && loginType.value === 1) {
    toast('请输入手机号')
    return false
  }
  if (!form.password && loginType.value === 1) {
    toast('请输入登录密码')
    return false
  }
  if (!form2.mobile && loginType.value === 2) {
    toast('请输入手机号')
    return false
  }
  if (!form2.captcha && loginType.value === 2) {
    toast('请输入验证码')
    return false
  }
  return true
}

/** 原站 loginChange()（uView throttle 500ms 防重复点击） */
let lastClick = 0
async function onLoginClick() {
  const now = Date.now()
  if (now - lastClick < 500) return
  lastClick = now
  if (!checkForm()) return
  const payload =
    loginType.value === 1
      ? { account: form.account, password: form.password }
      : { mobile: form2.mobile, captcha: form2.captcha }
  try {
    const res = loginType.value === 1 ? await login(payload) : await loginByCode(payload)
    const ui = (res && res.data && res.data.userinfo) || res.data || {}
    userStore.setLogin(ui.token, ui)
    try {
      const u = await getUserInfo()
      if (u && u.data) userStore.setUserInfo(u.data)
    } catch (e) {
      /* ignore */
    }
    toast('登录成功')
    router.replace('/pages/index/index')
  } catch (e) {
    toast((e && e.msg) || '登录失败')
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 原站 scope 5fa3e445 页面级规则
   换算口径（与原站 live 实测逐项核对，390×844 Chrome）：
     - 尺寸/字号/间距：rpx → floor(rpx * 0.52)（如 99rpx=51px、65rpx=33px、77rpx=40px）
     - 边框宽度：实测 computed 均为 1px（1.4rpx / 1.8rpx 经 uni-app 转换后渲染为 1px），不再保留小数
     - 原站 uni-text 组件自带 margin-top（.brand-title 15px / .brand-desc 17px），已在下方显式补齐 */
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}
/* .login-bg-img：absolute 居中铺满 */
.login-bg-img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  min-height: 100vh;
  z-index: 0;
  object-fit: cover;
}
/* .login-nav：92rpx=47px，padding 0 34rpx=17px */
.login-nav {
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
/* .brand：padding 0 50rpx=26px */
.brand {
  position: relative;
  z-index: 2;
  padding: 0 26px;
  box-sizing: border-box;
}
/* .brand-logo：165rpx×72rpx = 85×37px */
.brand-logo {
  display: block;
  width: 85px;
  height: 37px;
  margin-top: 0;
}
/* .reg-btn：right 51rpx=26px / top -21rpx=-10px；139rpx×50rpx=72×26px；radius 25rpx=13px */
.reg-btn {
  position: absolute;
  right: 26px;
  top: -10px;
  width: 72px;
  height: 26px;
  background-color: #0a0b0a;
  border: 1px solid #e9dbb5;
  border-radius: 13px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.reg-text {
  font-size: 13px;
  font-weight: 400;
  color: #f6e4ba;
  line-height: 1;
}
/* .brand-title：65rpx=33px / 700 / line-height 82rpx=42px / letter-spacing 1rpx=0.5px
   margin-top 15px：原站 uni-text 组件自带（实测 .brand-title 计算 margin-top=15px） */
.brand-title {
  display: block;
  font-size: 33px;
  font-weight: 700;
  line-height: 42px;
  color: #f6e4ba;
  letter-spacing: 0.5px;
  margin-top: 15px;
}
/* 原站实测：第二个 .brand-title（y=141）紧接第一行底部（99+42），不带 15px 间距 */
.brand-title + .brand-title {
  margin-top: 0;
}
/* .brand-desc：26rpx=13px；margin-top 17px（原站 uni-text 组件自带，实测） */
.brand-desc {
  display: block;
  font-size: 13px;
  font-weight: 400;
  color: #f6e4ba;
  margin-top: 17px;
}
/* .form-wrap：absolute top 50%，padding 0 51rpx=26px */
.form-wrap {
  position: absolute;
  left: 0;
  top: 50%;
  z-index: 2;
  width: 100%;
  padding: 0 26px;
  box-sizing: border-box;
}
/* .input-row：99rpx=51px；padding 0 34rpx 0 42rpx = 0 17px 0 21px；radius 48rpx=24px */
.input-row {
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
/* .input-row { margin-top: 25rpx=13px }
   原站实测：form-wrap 为 absolute（BFC）且其 top 固定，首个 input-row 计算 margin-top 为 0
   （实测 y=422 与 form-wrap 顶边齐平），第二行起才带 13px（y=486）。
   本项目以相邻兄弟选择器复刻该像素结果。 */
.input-row + .input-row {
  margin-top: 13px;
}
/* .row-icon：35rpx×46rpx = 18×23px；内嵌 icon 30rpx=15px */
/* 原站 .row-icon：display block（实测 img 紧贴左上 x=48 y=436，不做居中） */
.row-icon {
  width: 18px;
  height: 23px;
  position: relative;
  flex-shrink: 0;
  display: block;
}
.row-icon img {
  width: 15px;
  display: block;
}
/* .row-input：flex 1，margin-left 14rpx=7px */
.row-input {
  flex: 1;
  margin-left: 7px;
  min-width: 0;
}
.row-input__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}
/* 原站 u-input（color #F6E4BA / fontSize 13 / placeholderStyle color:#8B887D）+ 页面覆盖
   .u-input{background-color:initial!important;padding:0!important}；实测高度 24px */
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
}
.u-input::-webkit-outer-spin-button,
.u-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* .forget-pwd：25rpx=13px #847765 */
.forget-pwd {
  font-weight: 400;
  font-size: 13px;
  color: #847765;
  flex-shrink: 0;
  margin-left: 8px;
  cursor: pointer;
  line-height: 1;
}
/* .code-btn：190rpx×67rpx = 98×34px；radius 34rpx=17px */
.code-btn {
  width: 98px;
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
  flex-shrink: 0;
  margin-left: 8px;
  cursor: pointer;
  line-height: 1;
}
/* .login-btn：93rpx=48px；radius 47rpx=24px；margin-top 77rpx=40px */
.login-btn {
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
/* .login-btn.active → 金色渐变 */
.login-btn.active {
  background: linear-gradient(135deg, #f9e8c4, #d4b68a 28%, #ffefd4 56%, #d9bc8e);
  border: 1px solid #f6e4ba;
}
/* .login-btn-text：32rpx=16px / 700 / 未激活 #aaa（实测）；激活时 #24211d */
.login-btn-text {
  font-size: 16px;
  font-weight: 700;
  color: #aaa;
  line-height: 1;
}
.login-btn.active .login-btn-text {
  color: #24211d;
}
/* .switch-link：margin-top 23rpx=11px */
.switch-link {
  margin-top: 11px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
/* 原站实测 .switch-text 高度 19px（line-height normal，非 :1） */
.switch-text {
  font-size: 13px;
  font-weight: 400;
  color: #f6e4ba;
  text-decoration-line: underline;
  line-height: normal;
}
/* .agreement：margin-top 61rpx=31px */
.agreement {
  margin-top: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* .agree-check：33rpx=17px 圆；margin-right 32rpx=16px */
.agree-check {
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
/* .agree-tick：14rpx×8rpx = 7×4px 对勾；rotate(-45deg) 后外接框实测 7.78×7.78 */
.agree-tick {
  display: none;
  width: 7px;
  height: 4px;
  border-left: 1px solid #f6e4ba;
  border-bottom: 1px solid #f6e4ba;
  transform: rotate(-45deg);
  margin-top: -1px;
}
.agree-check.checked .agree-tick {
  display: block;
}
/* 原站实测 .agree-normal / .agree-link 高度 16px（line-height normal） */
.agree-normal {
  font-size: 11px;
  color: #9b998f;
  line-height: normal;
}
.agree-link {
  font-size: 11px;
  color: #f6e4ba;
  line-height: normal;
  cursor: pointer;
}
</style>
