<template>
  <!--
    原站 pages/login/login-code（chunk pages-login-login-code.4bb8a79b.js）
      装配：render 9008 / logic 97db / scope a092e044（浅色旧版验证码登录页，与黑金 login 页并存）
      结构：w-container.page-bg.container#container
        → view.header → image.back-title(/static/icon/back-btn.webp) @click=goBack
        → view.illustration → image.illustration-image(/static/image/login/title-value.webp)
        → view.login-form
            input-group（staticStyle margin-top:31rpx）→ u-input(type text「请输入手机号」fontSize 14 color #333) → form2.mobile
                                                        （原站 @input 同时写 form.account）
            input-group → u-input「请输入验证码」maxlength 6 → form2.captcha
              + suffix u-code(seconds:60, changeText:"(重新发送 Xs)", uniqueKey:"login_page")
              + view("get-code " + (isSend? font-color-theme : font-color-minor)) @click=checkVerifyStatus
        → view.login-button @click=throttle(loginChange,500) → " 立即登录 "
        → view.login-link → text「没有账号？」+ text.link「去注册」
        → view.agreement → image.agreement-image(yes/no-checked-image.webp) @click 切换 checked
                          + 「登录即代表您同意」+「《用户协议》」+「与」+「《隐私政策》」
      逻辑（97db）：
        data { checked:false, isSend:true, tips:"获取验证码", loginType:2, form{account,password}, form2{mobile,captcha}, inviter_code }
        watch isAgreement（config store）→ checked = 1==isAgreement（immediate；mock isAgreement='1' → 默认勾选）
        checkForm：先校验 checked「请先勾选用户协议」，再按 loginType 校验 mobile / captcha
        loginChange → login(form2, 2) → 存 token → getUserInfo → toast 登录成功 → switchTab index
        ⚠ 原站遗留 bug：checkVerifyStatus 调用 this.sendCode()，而 methods 中**无 sendCode 定义**
          （只有 getCode）→ 点击「获取验证码」会抛 TypeError，无任何 UI 响应。
          本页照搬该行为（不补 sendCode），如实复刻原站。
      实测坐标（390×844，原站 live）：back-title y75 x35 31×31 / illustration y150 x45 301×58 /
        login-form y258 x45 300×192 / input-group y274 & y338 291×44 / login-button y402 x45 306×48 /
        login-link y469 x147 / agreement y554 x69 / agreement-image y555 x69 14×14
  -->
  <div id="container" class="page-bg container">
    <div class="header">
      <img class="back-title" src="/assets/img/login/back-btn.webp" alt="" @click="goBack" />
    </div>

    <div class="illustration">
      <img class="illustration-image" src="/assets/img/login/title-value.webp" alt="" />
    </div>

    <div class="login-form">
      <div class="input-group" style="margin-top: 16px">
        <input
          class="lc-input"
          type="text"
          inputmode="numeric"
          placeholder="请输入手机号"
          :value="form2.mobile || ''"
          @input="onPhoneInput"
        />
      </div>

      <div class="input-group">
        <div class="lc-line">
          <input
            class="lc-input"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="请输入验证码"
            v-model="form2.captcha"
          />
          <span class="get-code" :class="isSend ? 'font-color-theme' : 'font-color-minor'" @click="checkVerifyStatus">
            {{ tips }}
          </span>
        </div>
      </div>

      <!-- 原站实测：login-button 是 login-form 的最后一个子元素（block、宽 306 溢出 300 的 form，
           左对齐落点 x=45），而非 form 外的 flex 居中项 -->
      <div class="login-button" @click="onLoginClick"> 立即登录 </div>
    </div>

    <div class="login-link">
      <span>没有账号？</span>
      <span class="link" @click="toRegister">去注册</span>
    </div>

    <div class="agreement">
      <img
        class="agreement-image"
        :src="checked ? '/assets/img/login/yes-checked-image.webp' : '/assets/img/login/no-checked-image.webp'"
        alt=""
        @click="checked = !checked"
      />
      <span class="agreement-1">登录即代表您同意</span>
      <span class="agreement-color" @click.stop="openAgreement('用户协议')">《用户协议》</span>
      <span>与</span>
      <span class="agreement-color" @click.stop="openAgreement('隐私政策')">《隐私政策》</span>
    </div>
  </div>
</template>

<script setup>
/**
 * 验证码登录页（对应原站 pages/login/login-code，浅色旧版）
 *   登录：POST /user/LoginForMobile  body { mobile, captcha, inviter_code }
 *   短信：POST /sms/send  body { mobile, event:'login' }（原站 sendCode 缺失，点击获取验证码不生效）
 */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginByCode, getUserInfo } from '@/api'
import { toast } from '@/utils/toast'
import { useUserStore } from '@/stores/user'
import { useConfigStore } from '@/stores/config'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const configStore = useConfigStore()

/** 原站 data */
const form = reactive({ account: null, password: null })
const form2 = reactive({ mobile: null, captcha: null })
const checked = ref(false)
const isSend = ref(true)
const tips = ref('获取验证码')
const loginType = ref(2)
const inviter_code = ref(null)

/** 原站 watch isAgreement（immediate） */
const isAgreement = computed(() => configStore.config.isAgreement)
onMounted(() => {
  checked.value = String(isAgreement.value) === '1'
  const content = route.query.content
  if (content) inviter_code.value = content
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

/** 原站 u-input @input：同时写 form.account（v-model 写 form2.mobile） */
function onPhoneInput(e) {
  const v = e.target.value
  form2.mobile = v
  form.account = v
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/login/login')
}

function toRegister() {
  router.push('/pages/login/register')
}

function openAgreement(name) {
  const path = name === '用户协议' ? '/index/index/usageterms' : '/index/index/agreement'
  console.log('[login-code] toWebview →', path, name)
  toast(`《${name}》待接入`)
}

/** 原站 getCode（methods 中存在，但 checkVerifyStatus 未调用它——原站遗留 bug） */
function getCode() {
  isSend.value = true
  startCode()
  toast('发送成功')
}

/** 原站 checkVerifyStatus：调用的是 **methods 中不存在的 sendCode**（原站遗留 bug，getCode 存在却未被调用）
 *  → 点击「获取验证码」在原站无任何响应（且抛 TypeError）。
 *  本页照搬「点击无响应」这一可观测行为，错误以 warn 记录而非未捕获异常（避免污染全局错误监听）。 */
function checkVerifyStatus() {
  const mobile = form2.mobile
  if (!mobile) return toast('请输入手机号')
  if (String(mobile).length !== 11) return toast('请输入11位手机号')
  try {
    /* 与原站一致：调用未定义的 sendCode */
    sendCode()
  } catch (e) {
    console.warn('[login-code] 原站遗留 bug：checkVerifyStatus 调用未定义的 sendCode()', e && e.message)
  }
}

/* 故意不定义 sendCode（对齐原站 methods 缺失）；getCode 亦如原站一样不被 checkVerifyStatus 调用 */
function sendCode() {
  throw new TypeError('sendCode is not a function')
}

/** 原站 checkForm */
function checkForm() {
  if (!checked.value) {
    toast('请先勾选用户协议')
    return false
  }
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

/** 原站 loginChange（uView throttle 500ms） */
let lastClick = 0
async function onLoginClick() {
  const now = Date.now()
  if (now - lastClick < 500) return
  lastClick = now
  if (!checkForm()) return
  try {
    const res = await loginByCode({ mobile: form2.mobile, captcha: form2.captcha, inviter_code: inviter_code.value })
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
/* 原站 scope a092e044 页面级规则（浅色旧版）
   口径：与原站 live 实测（390×844 Chrome）逐项核对，尺寸/字号/间距取 floor(rpx * 0.52)
   （60rpx=31px、380rpx=197px、103rpx=53px、560rpx=291px、86rpx=44px、589rpx=306px…） */
.page-bg {
  background: #f7f7f8;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-image: url('/assets/img/login/bg.webp');
  background-repeat: no-repeat;
  background-size: 100%;
}
/* .header：实测 0×0（内容仅 absolute 的返回键），居中于 flex 容器 */
.header {
  position: relative;
}
/* .back-title：absolute left -309rpx=-160px（相对 0 宽居中 header）top 145rpx=75px；60rpx=31px
   实测落点 x=35 y=75 */
.back-title {
  position: absolute;
  left: -160px;
  top: 75px;
  width: 31px;
  height: 31px;
  cursor: pointer;
}
/* .illustration：margin-top 290rpx=150px / margin-bottom 50px
   实测容器高 58px（= image 53px + inline-block 基线间隙 5px）；间隙随字体度量浮动，此处按实测锁定高度 */
.illustration {
  margin-bottom: 50px;
  margin-top: 150px;
  height: 58px;
}
/* .illustration-image：380rpx×103rpx = 197×53px；margin-right 201rpx=104px；display inline-block */
.illustration-image {
  width: 197px;
  height: 53px;
  margin-right: 104px;
  display: inline-block;
}
.login-form {
  width: 100%;
  max-width: 300px;
}
/* .input-group：560rpx×86rpx = 291×44px；padding 0 38rpx=19px；radius 20rpx=10px；border 2px #cfcfcf */
.input-group {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 0 19px;
  width: 291px;
  height: 44px;
  background: #fff;
  border-radius: 10px;
  border: 2px solid #cfcfcf;
  box-sizing: border-box;
}
/* 实测：原站 u-input 组件 x=66 w=249 padding 0 9px，内部 input 元素 161px + suffix(get-code) 70px 紧贴无间距
   （161 + 70 = 231 = 249 - 2×9），故 get-code 落点 x=236。本项目以此结构复刻。 */
.lc-line {
  display: flex;
  align-items: center;
  width: 249px;
  padding: 0 9px;
  box-sizing: border-box;
  min-width: 0;
}
/* 原站 u-input：fontSize 14 / color #333 / placeholderStyle color:#818181；实测组件高 36px */
.lc-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  width: 100%;
  min-width: 0;
  height: 36px;
  font-size: 14px;
  color: #333;
  line-height: 36px;
  -webkit-appearance: none;
}
.lc-input::placeholder {
  color: #818181;
}
/* .get-code：28rpx=14px 700；颜色随 isSend 在 font-color-theme(#333)/font-color-minor(#7a7a7a) 间切换 */
.get-code {
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
  margin-left: 0;
  cursor: pointer;
  line-height: normal;
}
.font-color-theme {
  color: #333;
}
.font-color-minor {
  color: #7a7a7a;
}
/* .login-button：589rpx×94rpx = 306×48px；#1b53f7；radius 20rpx=10px；30rpx=15px/700/#fff；line-height 94rpx=48px */
.login-button {
  width: 306px;
  height: 48px;
  background: #1b53f7;
  border-radius: 10px;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  /* 实测 button 左边缘与 login-form 左边缘同为 x=45；按 306px 宽在 flex 居中容器计算应为 42，故补 3px 对齐实测 */
}
/* .login-link：24rpx=12px 700 #1b53f7；margin-top 38rpx=19px */
.login-link {
  text-align: center;
  font-weight: 700;
  font-size: 12px;
  color: #1b53f7;
  margin-top: 19px;
}
.link {
  color: #1b53f7;
  text-decoration: underline;
  cursor: pointer;
}
/* .agreement：margin-top 130rpx=67px；22rpx=11px 500 #7f7f7f；margin-bottom 96rpx=49px */
.agreement {
  margin-top: 67px;
  text-align: center;
  font-weight: 500;
  font-size: 11px;
  color: #7f7f7f;
  display: flex;
  align-items: center;
  margin-bottom: 49px;
  white-space: nowrap;
}
.agreement-image {
  width: 14px;
  height: 14px;
  cursor: pointer;
  flex-shrink: 0;
}
.agreement-1 {
  margin-left: 7px;
}
.agreement-color {
  color: #3578fc;
  cursor: pointer;
}
</style>
