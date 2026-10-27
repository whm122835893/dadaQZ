<template>
  <div id="action-pwd" class="ap-page">
    <!-- 顶部导航（原站 w-navbar：navType=default, leftIcon=back-btn-white, titleStyle #fff） -->
    <div class="ap-navbar">
      <img class="ap-navbar__back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
      <span class="ap-navbar__title">{{ title }}</span>
    </div>

    <!-- action=set：输入当前操作密码 -->
    <div v-if="action === 'set'" class="flex flex-dir-col flex-ai-center ptb-80">
      <span class="font-color-convention font-size-14 pb-24">输入当前操作密码</span>
      <!-- 6 位密码点输入框（原站 u-code-input：dot maxlength=6 borderColor=transparent） -->
      <div class="ap-code" @click="focusPwd">
        <span v-for="(d, i) in pwdDots" :key="i" class="ap-code__item" :class="{ 'ap-code__item--on': i === oldPwd.length }">
          <i v-if="oldPwd[i]" class="ap-code__dot" />
        </span>
        <input
          ref="pwdInput"
          v-model="oldPwd"
          class="ap-code__input"
          type="password"
          maxlength="6"
          inputmode="numeric"
          @input="onPwdInput"
        />
      </div>
      <span class="font-size-10 font-color-textPrimary mt-24" @click="reset">忘记密码？</span>
    </div>

    <!-- action=reset：验证手机号 -->
    <div v-if="action === 'reset'" class="plr-18 ap-reset">
      <div class="mobile-inp font-size-14 bg-color-item ap-inp">{{ userInfo.mobile || '' }}</div>
      <div class="flex ptb-12 mt-20 flex-js-sb flex-ai-center code bg-color-item ap-inp">
        <input
          v-model="code"
          class="font-size-14 ap-code__field"
          maxlength="6"
          inputmode="numeric"
          placeholder="请输入验证码"
          placeholder-style="color:#ABABAB"
        />
        <span class="font-color-textPrimary font-size-14 ap-code__btn" @click="checkVerifyStatus">
          {{ countDown === 0 ? '发送验证码' : countDown + '后重新发送' }}
        </span>
      </div>
    </div>

    <!-- action=reset：确认按钮（原站 .action，w-button primary circle） -->
    <div v-if="action === 'reset'" class="action">
      <button class="ap-btn" :disabled="!code" @click="submit">确认</button>
    </div>

    <!-- 安全提示卡（原站 bg-color-item + title-text-style + desc-text-style） -->
    <div class="bg-color-item ap-tip">
      <div class="title-text-style">安全提示</div>
      <div class="desc-text-style ap-tip__desc">安全密码用于寄售、委托、求购等关键操作</div>
    </div>
  </div>
</template>

<script setup>
/**
 * my/actionPwd/getCode —— 操作密码校验 / 手机验证
 *
 * 原站 chunk：pages-my-actionPwd-getCode.2ba5dffb.js
 * 页面 scopeId：4f7f450a（logic 模块 cef5 / render 14808 / CSS b2f3）
 * 装配模块：c1f7
 *
 * 原站 render（scope 4f7f450a）：
 *   w-container#action-pwd
 *     w-navbar(navType default, leftIcon back-btn-white, titleStyle #fff)
 *     [action=set] flex flex-dir-col flex-ai-center ptb-80
 *                   "输入当前操作密码"(font-color-convention font-size-14 pb-24)
 *                   u-code-input(dot, maxlength 6, borderColor transparent) → verifyPwd
 *                   "忘记密码？"(font-size-10 font-color-textPrimary mt-24) → reset()
 *     [action=reset] plr-18(margin-top 80rpx)
 *                   mobile-inp(disabled, 只读) → userInfo.mobile
 *                   code 行：input(6位) + "发送验证码"/"N后重新发送" → checkVerifyStatus
 *     [action=reset] .action → w-button primary circle "确认"（disabled 当 !code）→ submit
 *     bg-color-item 卡：title-text-style "安全提示" + desc-text-style "安全密码用于寄售、委托、求购等关键操作"
 *
 * 原站 logic（模块 cef5）：
 *   data: loading, oldPwd, isChange, title:"设置操作密码", action, code, countDown, timer, verifyShow, verificationUrl
 *   onLoad({action}) → checkRoute(action)
 *   checkRoute:
 *     "reset" → title="验证手机号"
 *     "set"   → title="修改操作密码"
 *     ""(默认) → getUserInfo() → pay_password ? "set" : "reset" → redirectTo 自身
 *   sendCode({mobile, event:"resetpwd", ...}) → sendSms
 *   startCountDown → 60s 倒计时
 *   verifyPwd → cehckPayPassword({pay_password: oldPwd}) → toNext(res.data.code)
 *   submit(code) → navigateTo /pages/my/actionPwd/setPwd?code=
 *   reset() → route getCode?action=reset
 *
 * 页面背景：深色主题（.bg-color-item 最终定义为 #211c15 + 1px #56462d，
 * .font-color-textPrimary 最终定义为 #f4dcaa 金色）
 */
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { sendSms, cehckPayPassword, getUserInfo } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

/* ---------------- 原站 data ---------------- */
const loading = ref(false)
const oldPwd = ref('')
const title = ref('设置操作密码')
const action = ref('')
const code = ref('')
const countDown = ref(0)
let timer = null

const pwdInput = ref(null)
const userInfo = computed(() => userStore.userInfo || {})

/* 6 位密码点（u-code-input dot 模式的等价实现） */
const pwdDots = [0, 1, 2, 3, 4, 5]

/* ---------------- 原站 computed（captchaStatus） ----------------
 * 原站 captchaStatus 来自 vuex config.info.puzzleCaptcha。
 * 本地无验证码组件，w-jy-verify 用等价提示替代，captchaStatus 恒 false。 */

/* ---------------- 原站 onLoad ---------------- */
function checkRoute(a) {
  action.value = a
  if (a === 'reset') {
    title.value = '验证手机号'
  } else if (a === 'set') {
    title.value = '修改操作密码'
  } else {
    // 原站默认态：取用户信息判断是否已设置过操作密码，再 redirect 到自身
    loading.value = true
    ensureLogin()
      .then(() => getUserInfo())
      .then((res) => {
        const next = res && res.data && res.data.pay_password ? 'set' : 'reset'
        router.replace('/pages/my/actionPwd/getCode?action=' + next)
      })
      .catch(() => {
        router.replace('/pages/my/actionPwd/getCode?action=reset')
      })
      .finally(() => { loading.value = false })
  }
}

/** 原站 isAuth 守卫：未登录先走演示登录，保证 userInfo.mobile 可用 */
function ensureLogin() {
  if (userStore.isLogin) return Promise.resolve()
  userStore.loginDemo()
  return Promise.resolve()
}

checkRoute(router.currentRoute.value.query.action || '')

/* 原站 uni-app 行为：页面被 redirectTo / navigateTo 重新导航时 onLoad 会再次触发。
 * SPA 下同页 query 变化不会重建组件，故用 watch 对齐（自动分流、忘记密码均走这条路）。 */
watch(
  () => router.currentRoute.value.query.action,
  (a) => { checkRoute(a || '') }
)

/* ---------------- 原站 methods ---------------- */

/** 发送验证码（原站 sendCode） */
function sendCode(extra = {}) {
  if (countDown.value) return
  sendSms({ mobile: userInfo.value.mobile, event: 'resetpwd', ...extra })
    .then(() => { startCountDown() })
    .catch(() => {})
}

/** 原站 checkVerifyStatus：captchaStatus 为真时先出验证码，否则直接发送 */
function checkVerifyStatus() {
  // 本地未接入极验/鼎信 captcha，等价走直接发送分支
  sendCode()
}

/** 原站 startCountDown：60s 倒计时 */
function startCountDown() {
  if (timer) clearInterval(timer)
  countDown.value = 60
  timer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) clearInterval(timer)
  }, 1000)
}

/** 原站 verifyPwd：校验当前操作密码，通过后带 code 跳 setPwd */
function verifyPwd() {
  cehckPayPassword({ pay_password: oldPwd.value })
    .then((res) => { toNext((res && res.data && res.data.code) || '') })
    .catch(() => {})
}

/** 原站 toNext */
function toNext(c) {
  router.push('/pages/my/actionPwd/setPwd?code=' + c)
}

/** 原站 submit：确认手机号验证码 → setPwd */
function submit() {
  toNext(code.value)
}

/** 原站 reset：忘记密码 → 回到手机验证分支 */
function reset() {
  router.push('/pages/my/actionPwd/getCode?action=reset')
}

function goBack() {
  router.back()
}

function focusPwd() {
  if (pwdInput.value) pwdInput.value.focus()
}

/** 6 位输满即自动校验（原站 u-code-input finish 事件） */
function onPwdInput() {
  oldPwd.value = String(oldPwd.value || '').replace(/\D/g, '').slice(0, 6)
  if (oldPwd.value.length === 6) verifyPwd()
}

onBeforeRouteLeave(() => {
  if (timer) clearInterval(timer)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/**
 * 对齐原站 scope 4f7f450a（CSS 模块 b2f3），rpx × 0.52 后一律向下取整
 * 页面专属（原站 CSS 末尾段）：
 *   uni-page-body / body{PAGE}{background-color:#101115;color:#fff}   → 深色页面底
 *   .bg-color-item{background-color:#211c15;border:1px solid #56462d} → 深色卡片（覆盖库中白卡定义）
 *   #action-pwd .u-code-input__item{background-color:#fff;width:84rpx!important;height:84rpx!important}
 *   #action-pwd .mobile-inp{padding:12rpx 0;height:64rpx;color:#ababab}
 *   #action-pwd .action{margin-top:90rpx;width:100%;padding-bottom:calc(48rpx + window-bottom)}
 *   .font-color-textPrimary{color:#f4dcaa}                            → 金色（覆盖库中 #333）
 */
.ap-page {
  min-height: 100vh;
  background: #101115;
  color: #fff;
  padding-bottom: 24px;
}

/* 原子类（原站全局原子库，本页按需落地；rpx×0.52 向下取整） */
.flex {
  display: flex;
}
.flex-dir-col {
  flex-direction: column;
}
.flex-ai-center {
  align-items: center;
}
.flex-js-sb {
  justify-content: space-between;
}
.font-size-10 {
  font-size: 10px;
}
.font-size-14 {
  font-size: 14px;
}
.font-color-convention {
  color: #4a4a4a;
}
/* .font-color-textPrimary 在原站 CSS 中出现两次（#333 → #f4dcaa），后者覆盖前者 */
.font-color-textPrimary {
  color: #f4dcaa;
}
/* ptb-80 = 160rpx */
.ptb-80 {
  padding-top: 83px;
  padding-bottom: 83px;
}
/* pb-24 = 24rpx */
.pb-24 {
  padding-bottom: 12px;
}
/* mt-24 = 24rpx */
.mt-24 {
  margin-top: 12px;
}
/* mt-20 = 20rpx */
.mt-20 {
  margin-top: 10px;
}
/* ptb-12 = 12rpx */
.ptb-12 {
  padding-top: 6px;
  padding-bottom: 6px;
}
/* plr-18 = 18rpx */
.plr-18 {
  padding-left: 9px;
  padding-right: 9px;
}

/* 原站 .bg-color-item：库内三处定义，最后一处（深色）生效 */
.bg-color-item {
  background-color: #211c15;
  border: 1px solid #56462d;
  border-radius: 20px;
}

/* 原站 .title-text-style / .desc-text-style */
.title-text-style {
  font-weight: 700;
  font-size: 12px;
  color: #111216;
}
.desc-text-style {
  font-weight: 400;
  font-size: 10px;
  color: #85868d;
}

/* 顶部导航（原站 w-navbar：44px 高 + 13,10 白色返回键） */
.ap-navbar {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 13px;
}
.ap-navbar__back {
  width: 24px;
  height: 24px;
}
.ap-navbar__title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  line-height: 22px;
}

/* 原站 #action-pwd .u-code-input__item：84rpx=43px，圆角 16rpx=8px，白底 */
.ap-code {
  position: relative;
  display: flex;
  gap: 8px;
  cursor: pointer;
}
.ap-code__item {
  width: 43px;
  height: 43px;
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ap-code__item--on {
  box-shadow: 0 0 0 1px #f4dcaa;
}
.ap-code__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #101115;
}
.ap-code__input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  border: none;
  outline: none;
}
.ap-code__field {
  flex: 1;
  min-width: 0;
  height: 21px;
  border: none;
  outline: none;
  background: transparent;
  color: #f4dcaa;
}
.ap-code__btn {
  flex: none;
  white-space: nowrap;
  cursor: pointer;
}

/* 原站 #action-pwd .mobile-inp：padding 12rpx 0, height 64rpx=33px, color #ababab */
.mobile-inp {
  padding: 6px 0;
  height: 33px;
  color: #ababab;
}

/* 原站 reset 分支：plr-18 + margin-top 80rpx = 41px */
.ap-reset {
  margin-top: 41px;
}
/* 原站 code 行：height 100rpx = 52px, padding 0 30rpx = 15px */
.ap-inp {
  padding: 0 15px;
}
.code {
  height: 52px;
}

/* 原站 #action-pwd .action：margin-top 90rpx=46px, padding 0 36rpx=18px,
   padding-bottom calc(48rpx=24px + window-bottom) */
.action {
  margin-top: 46px;
  width: 100%;
  padding-left: 18px;
  padding-right: 18px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}
/* 原站 w-button primary circle：黑底圆角胶囊（深色主题下用金色主按钮） */
.ap-btn {
  width: 100%;
  height: 41px;
  border: none;
  border-radius: 50px;
  background: #f4dcaa;
  color: #101115;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ap-btn:disabled {
  background: #3a3323;
  color: #7a6c4a;
  cursor: not-allowed;
}

/* 原站安全提示卡：margin 30rpx=15px, margin-top 60rpx=31px, padding 30rpx=15px */
.ap-tip {
  margin: 15px;
  margin-top: 31px;
  padding: 15px;
}
/* 原站 desc 上边距写死 11px（非 rpx），保持原样 */
.ap-tip__desc {
  margin-top: 11px;
}
</style>
