<template>
  <div id="action-pwd" class="sp-page">
    <!-- 顶部导航（原站 w-navbar：navType=default, leftIcon=back-btn-white, titleStyle #fff） -->
    <div class="sp-navbar">
      <img class="sp-navbar__back" src="/assets/img/order/back-btn-white.webp" alt="" @click="goBack" />
      <span class="sp-navbar__title">设置操作密码</span>
    </div>

    <div class="plr-16">
      <!-- 原站 u--form(labelPosition left) + 两个 u-form-item(bg-color-item, padding 12rpx 30rpx) -->
      <div class="sp-form">
        <div class="title-text-style mb-6">新安全密码</div>
        <div class="bg-color-item sp-field">
          <input
            v-model="form.password"
            class="sp-field__input"
            type="password"
            maxlength="6"
            inputmode="numeric"
            placeholder="请输入操作密码"
            placeholder-class="sp-field__ph"
          />
        </div>

        <div class="title-text-style mt-12 mb-6">新安全密码</div>
        <div class="bg-color-item sp-field">
          <input
            v-model="form.re_password"
            class="sp-field__input"
            type="password"
            maxlength="6"
            inputmode="numeric"
            placeholder="请确认操作新密码"
            placeholder-class="sp-field__ph"
          />
        </div>
      </div>

      <!-- 原站 font-size-10 font-color-minor mt-12 + margin-left 30rpx -->
      <div class="font-size-10 font-color-minor sp-hint">请输入6位数字密码</div>
    </div>

    <!-- 原站 .action → w-button primary circle "确认"（disabled 由 form 校验决定） -->
    <div class="action">
      <button class="sp-btn" :disabled="disabled" @click="submit">确认</button>
    </div>

    <!-- 安全提示卡（原站 bg-color-item + title-text-style + desc-text-style） -->
    <div class="bg-color-item sp-tip">
      <div class="title-text-style">安全提示</div>
      <div class="desc-text-style sp-tip__desc">安全密码用于寄售、委托、求购等关键操作</div>
    </div>
  </div>
</template>

<script setup>
/**
 * my/actionPwd/setPwd —— 设置 / 修改操作密码
 *
 * 原站 chunk：pages-my-actionPwd-setPwd.6bb2dea2.js
 * 页面 scopeId：4ca1f246（logic 模块 a8a1 / render 在 0774a962 段）
 * 装配模块：ee8e
 *
 * 原站 render：
 *   w-container.plr-13#action-pwd
 *     w-navbar(navType default, leftIcon back-btn-white, title "设置操作密码", titleStyle #fff)
 *     v-uni-view.plr-16
 *       u--form(labelPosition left, model form, rules)
 *         title-text-style mb-6 " 新安全密码 "
 *         u-form-item.bg-color-item(padding 12rpx 30rpx, prop password)
 *           u--input(placeholder "请输入操作密码", color #000, border none, type password)
 *         title-text-style mt-12 mb-6 " 新安全密码 "        ← 原站两处标题文案相同（非笔误，保持原样）
 *         u-form-item.bg-color-item(padding 12rpx 30rpx, prop re_password)
 *           u--input(placeholder "请确认操作新密码", color #000, border none, type password)
 *       font-size-10 font-color-minor mt-12(margin-left 30rpx) "请输入6位数字密码"
 *     .action → w-button primary circle "确认"（disabled）
 *     bg-color-item(margin-top 60rpx, padding 30rpx)：
 *       title-text-style " 安全提示 " + desc-text-style(margin-top 11px) " 安全密码用于寄售、委托、求购等关键操作 "
 *
 * 原站 logic（模块 a8a1）：
 *   data: form{password:null, re_password:null, captcha:null}, rules（6位数字校验）
 *   computed.disabled: !isNaN(password) === false || !(password && password==re_password && length==6)
 *   onLoad({code}) → form.captcha = code
 *   submit: setActionPwd(form) → getUserInfo() → toast(msg) → 1500ms 后 navigateBack({delta:2})
 *
 * 页面 CSS（scope 4ca1f246）：
 *   uni-page-body / body{PAGE}{background-color:#101115;color:#fff}
 *   .bg-color-item{background-color:#211c15;border:1px solid #56462d}
 *   .title-text-style{color:#fff}                                  → 覆盖库中 #111216
 *   #action-pwd .action{padding-left:24rpx;padding-right:24rpx}
 *   #action-pwd .action{margin-top:60rpx;width:100%;padding-bottom:calc(48rpx + window-bottom)}
 */
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { setActionPwd } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

/* ---------------- 原站 data ---------------- */
const loading = ref(false)
const form = reactive({ password: null, re_password: null, captcha: null })

/* ---------------- 原站 onLoad({code}) ---------------- */
form.captcha = router.currentRoute.value.query.code || null

/* ---------------- 原站 computed.disabled ----------------
 * 原站：!!Number.isNaN(Number(password)) || !(password && password==re_password && 6==password.length)
 * 注意 Number(null) = 0（非 NaN），故空值时第一项为 false，靠第二项拦截 */
const disabled = computed(() => {
  const p = form.password
  const isNum = !Number.isNaN(Number(p))
  const same = p && p === form.re_password && String(p).length === 6
  return !isNum || !same
})

/* ---------------- 原站 methods ---------------- */
function submit() {
  if (disabled.value) return
  setActionPwd({ ...form })
    .then((res) => {
      // 原站成功后刷新用户信息，再 toast 并延迟 1500ms 返回两层
      try { userStore.setUserInfo({ ...(userStore.userInfo || {}), pay_password: 1 }) } catch (e) {}
      setTimeout(() => router.back(), 1500)
      return res
    })
    .catch(() => {})
}

function goBack() {
  router.back()
}
</script>

<style scoped>
/**
 * 对齐原站 scope 4ca1f246，rpx × 0.52 后一律向下取整
 * 深色主题：页面底 #101115 / 卡片 #211c15 + 边框 #56462d / title 白字
 */
.sp-page {
  min-height: 100vh;
  background: #101115;
  color: #fff;
  padding-bottom: 24px;
}

/* 原子类（原站全局原子库，本页按需落地） */
.plr-16 {
  padding-left: 16px;
  padding-right: 16px;
}
.font-size-10 {
  font-size: 10px;
}
.font-color-minor {
  color: #7a7a7a;
}
.mt-12 {
  margin-top: 12px;
}
.mb-6 {
  margin-bottom: 6px;
}

/* 原站 .bg-color-item：库内两处定义，最后一处（深色）生效 */
.bg-color-item {
  background-color: #211c15;
  border: 1px solid #56462d;
  border-radius: 20px;
}

/* 原站 .title-text-style：库内 #111216，本页覆盖为 #fff */
.title-text-style {
  font-weight: 700;
  font-size: 12px;
  color: #fff;
}
.desc-text-style {
  font-weight: 400;
  font-size: 10px;
  color: #85868d;
}

/* 顶部导航（原站 w-navbar：44px 高 + 13,10 白色返回键） */
.sp-navbar {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 13px;
}
.sp-navbar__back {
  width: 24px;
  height: 24px;
}
.sp-navbar__title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  line-height: 22px;
}

/* 原站 u-form-item.bg-color-item：padding 12rpx 30rpx = 6px 15px */
.sp-field {
  padding: 6px 15px;
}
.sp-field__input {
  width: 100%;
  height: 24px;
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  font-size: 15px;
  line-height: 24px;
}
.sp-field__ph {
  color: #7a7a7a;
}

/* 原站 hint：font-size-10 font-color-minor mt-12 + margin-left 30rpx = 15px */
.sp-hint {
  margin-left: 15px;
}

/* 原站 #action-pwd .action：margin-top 60rpx=31px, padding 0 24rpx=12px,
   padding-bottom calc(48rpx=24px + window-bottom) */
.action {
  margin-top: 31px;
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}
/* 原站 w-button primary circle：深色主题下金色主按钮 */
.sp-btn {
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
.sp-btn:disabled {
  background: #3a3323;
  color: #7a6c4a;
  cursor: not-allowed;
}

/* 原站安全提示卡：margin-top 60rpx=31px, padding 30rpx=15px */
.sp-tip {
  margin-top: 31px;
  padding: 15px;
}
/* 原站 desc 上边距写死 11px（非 rpx），保持原样 */
.sp-tip__desc {
  margin-top: 11px;
}
</style>
