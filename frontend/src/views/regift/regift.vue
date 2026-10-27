<template>
  <!--
    原站 pages/regift/regift（浅色主题，背景 #f7f7f8）
      script 模块 6f4f
        data { userCollectionId, userCollection{product:{},user:{}}, loading,
               showConfirm, search{phone}, form{pay_password}, user{} }
        computed.product → userCollection.product
        onLoad({id})      → userCollectionId = id
        onShow / onPullDownRefresh → getInfo()
        getInfo()  → getUserCollectionDetails(userCollectionId) → userCollection = res.data
                     catch → 1500ms 后 backPage()
        inputChange() → debounce(searchUser, 500)
        searchUser() → search.phone ? searchUser(search) : user = {}
                     命中 → user = res.data；未命中 → toast「用户不存在」
        changeShowConfirm() → showConfirm = true
        submit()  → !user.id → showConfirm = false
                   → form.re_user_id = user.id; form.user_collection_id = userCollectionId
                   → showLoading('赠送中') → givingProduct(form)
                   → toast(res.msg) → 1500ms redirectTo('/pages/regift/record')
                   → finally form.pay_password = ''; showConfirm = false
      render 模块 ad94 / scope a5c22740
        w-container.page-bg#regift
          w-navbar(navType="default", title="转赠")
          .pa-16
            .bg-color-white.pa-8.br-12.flex     ← 藏品卡
              w-image(radius 12, 83×83, product.listimg)
              types != 1 → info-bar（名称 + 编号/总量）
              types == 1 → 仅名称
            「赠送价格」
            uni-input.inputClass（输入赠送价格）
            「选择用户」
            w-search-input（输入用户uid、手机号或钱包地址）
            user.id → .user-bar（头像 + 昵称 + 钱包地址）
            .action.plr-12.pt-24
              w-button(shape circle, disabled=!user.id) 「确认赠送」
            u-popup(round 12, center) → .auth-popup
              w-icon.close 「确认赠送给手机号为：xxx」
              「请输入操作密码」
              「忘记密码？」→ /pages/my/actionPwd/getCode?action=reset
              u-code-input(focus, dot, maxlength 6, borderColor transparent) @finish=submit
  -->
  <div id="regift" class="page-bg">
    <!-- 原站 w-navbar(u-navbar)：fixed、bgColor #fafafa、autoBack 渲染 w-icon，图标为图片 /static/icon/back-btn.png -->
    <div class="rg-navbar">
      <img class="rg-navbar__back" src="/assets/img/regift/back-btn.png" alt="" @click="goBack" />
      <span class="rg-navbar__title">转赠</span>
    </div>

    <!-- 原站 u-navbar fixed 的 placeholder 占位 44px -->
    <div class="pa-16 rg-body">
      <!-- 藏品卡 -->
      <div class="bg-color-white pa-8 br-12 flex">
        <div class="rg-goods__cover">
          <img class="rg-goods__img" :src="coverSrc" alt="" />
        </div>
        <!-- types != 1（盲盒）：名称 + 编号/总量 -->
        <div v-if="userCollection.types != 1" class="info-bar flex flex-dir-col flex-js-sb">
          <span class="text-overflow-2 font-size-16 font-color-dark font-w-500" style="width: 100%">
            {{ product.name }}
          </span>
          <div class="flex">
            <span class="font-size-10 font-color-minor">编号：#</span>
            <span class="font-size-16 font-color-dark">{{ userCollection.collection_code }}</span>
            <span class="font-size-10 font-color-minor">/{{ product.total_num }}</span>
          </div>
        </div>
        <!-- types == 1（普通藏品）：仅名称 -->
        <div v-else class="info-bar flex flex-ai-center">
          <span class="font-size-16 font-color-dark font-w-500">{{ product.name }}</span>
        </div>
      </div>

      <!-- 赠送价格 -->
      <div class="font-color-999 font-size-14 mt-12">赠送价格</div>
      <input
        v-model="form.price"
        class="mt-12 inputClass"
        type="text"
        placeholder="输入赠送价格"
        placeholder-class="rg-input__ph"
      />

      <!-- 选择用户 -->
      <div class="font-color-999 font-size-14 mt-12">选择用户</div>
      <!-- 原站 w-search-input：search3 图标 + 输入框 + 有值时 close4 清空 -->
      <div class="mt-12 rg-search">
        <img class="rg-search__icon" src="/assets/img/regift/search3.png" alt="" />
        <input
          v-model="search.phone"
          class="rg-search__input"
          type="text"
          placeholder="输入用户uid、手机号或钱包地址"
          placeholder-class="rg-input__ph"
          @input="inputChange"
          @keyup.enter="inputChange"
        />
        <img v-if="search.phone" class="rg-search__clear" src="/assets/img/regift/close4.png" alt="" @click="clearSearch" />
      </div>

      <!-- 命中用户卡片 -->
      <div v-if="user.id" class="user-bar pa-8 br-12 mt-24 pa-16 flex">
        <div class="rg-user__avatar">
          <img class="rg-user__avatar-img" :src="avatarSrc" alt="" />
        </div>
        <div class="pl-16 flex flex-1 ptb-4 flex-dir-col flex-js-sb">
          <span class="font-size-14 font-color-textPrimary font-w-500 rg-user__line">{{ user.nickname }}</span>
          <span class="font-size-12 text-overflow font-color-textPrimary rg-user__line">{{ user.ntf_url }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作条 -->
    <div class="action plr-12 pt-24">
      <div class="z-btn btn-size-lg btn-type-colorful circle" :class="{ disabled: !user.id }" @click="changeShowConfirm">
        确认赠送
      </div>
    </div>

    <!-- 原站 u-popup(round 12, mode center) → 操作密码弹窗 -->
    <div v-if="showConfirm" class="rg-popup-mask" @click.self="showConfirm = false">
      <div class="ptb-26 br-12 auth-popup">
        <img class="close" src="/assets/img/regift/close4.png" alt="" @click="showConfirm = false" />
        <div class="text-center font-color-dark font-size-14">确认赠送给手机号为：{{ user.mobile }}</div>
        <div class="pt-24 text-center font-color-dark font-size-16 font-w-500">请输入操作密码</div>
        <div class="font-color-textPrimary mt-8 font-size-12 text-center" @click="goResetPwd">忘记密码？</div>
        <div class="flex flex-center mt-30">
          <div class="u-code-input">
            <div v-for="(c, i) in codeChars" :key="i" class="u-code-input__item">
              <span v-if="codeChars[i]" class="u-code-input__item__dot"></span>
            </div>
            <input
              class="u-code-input__input"
              type="number"
              maxlength="6"
              :value="form.pay_password"
              @input="onCodeInput"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 发起转赠页（对应原站 pages/regift/regift）
 *   路由参数：id（user_collection.id）
 *   提交后跳转：/pages/regift/record（转赠记录，尚未实现）
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCollectionDetail, searchUser, givingProduct } from '@/api'
import { toast } from '@/utils/toast'
import { OSS_URL } from '@/config'

const route = useRoute()
const router = useRouter()

const userCollectionId = ref(null)
const userCollection = ref({ product: {}, user: {} })
const loading = ref(false)
const showConfirm = ref(false)
const search = reactive({ phone: '' })
const form = reactive({ pay_password: '', price: '' })
const user = ref({})

/** 原站 computed.product → userCollection.product */
const product = computed(() => userCollection.value.product || {})

/** 原站 w-image 的 targetSrc 规则 */
function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith('/')) return src
  return OSS_URL + src
}
const coverSrc = computed(() => imgUrl(product.value.listimg))
const avatarSrc = computed(() => imgUrl(user.value.avatar))

/** 原站 u-code-input：6 格，填满触发 finish → submit */
const codeChars = computed(() => Array.from({ length: 6 }, (_, i) => form.pay_password[i] || ''))

function onCodeInput(e) {
  const v = String(e.target.value || '').replace(/\D/g, '').slice(0, 6)
  form.pay_password = v
  e.target.value = v
  if (v.length === 6) submit()
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/myCollection/collectionDetails?id=' + userCollectionId.value)
}

function goResetPwd() {
  router.push({ path: '/pages/my/actionPwd/getCode', query: { action: 'reset' } })
}

async function getInfo() {
  loading.value = true
  try {
    const res = await getCollectionDetail(userCollectionId.value)
    userCollection.value = res.data || {}
  } catch (e) {
    /* 原站 catch：1500ms 后返回上一页 */
    setTimeout(() => goBack(), 1500)
  } finally {
    loading.value = false
  }
}

/** 原站 inputChange → debounce(searchUser, 500) */
let timer = null
function inputChange() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(searchUserFn, 500)
}

async function searchUserFn() {
  if (!search.phone) {
    user.value = {}
    return
  }
  const res = await searchUser({ phone: search.phone })
  if (res && res.data) user.value = res.data
  else toast('用户不存在')
}

/** 原站 w-search-input 的 clear：清空 input 与 change */
function clearSearch() {
  search.phone = ''
  user.value = {}
}

function changeShowConfirm() {
  showConfirm.value = true
}

async function submit() {
  if (!user.value.id) {
    showConfirm.value = false
    return
  }
  form.re_user_id = user.value.id
  form.user_collection_id = userCollectionId.value
  toast('赠送中')
  try {
    const res = await givingProduct({
      pay_password: form.pay_password,
      re_user_id: form.re_user_id,
      user_collection_id: form.user_collection_id,
      price: form.price
    })
    toast(res.msg || '赠送成功')
    setTimeout(() => router.replace('/pages/regift/record'), 1500)
  } finally {
    /* 原站 finally：清空操作密码并关闭弹窗 */
    form.pay_password = ''
    showConfirm.value = false
  }
}

onMounted(() => {
  userCollectionId.value = route.query.id
  getInfo()
})
</script>

<style scoped>
.page-bg {
  background: #f7f7f8;
  min-height: 100vh;
}
/* 原站 w-navbar(u-navbar)：内容高 44px，标题 30rpx/#333/bold */
.rg-navbar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  background: #fafafa;
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
}
.rg-navbar__back {
  position: absolute;
  left: 13px;
  top: calc(env(safe-area-inset-top) + 10px);
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.rg-navbar__title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

/* ============ 工具类（原站 scope a5c22740 内定义） ============ */
.flex {
  display: flex;
}
.flex-ai-center {
  align-items: center;
}
.flex-js-sb {
  justify-content: space-between;
}
.flex-dir-col {
  flex-direction: column;
}
.flex-center {
  justify-content: center;
  align-items: center;
}
.flex-1 {
  flex-grow: 1;
}
.pa-16 {
  padding: 16.64px;
}
/* 原站 u-navbar fixed placeholder：44px */
.rg-body {
  padding-top: 60.64px;
}
.pa-8 {
  padding: 8.32px;
}
.plr-12 {
  padding-left: 12.48px;
  padding-right: 12.48px;
}
.pt-24 {
  padding-top: 24.96px;
}
.ptb-4 {
  padding-top: 4.16px;
  padding-bottom: 4.16px;
}
.ptb-26 {
  padding-top: 27.04px;
  padding-bottom: 27.04px;
}
.pl-16 {
  padding-left: 16.64px;
}
.mt-8 {
  margin-top: 8.32px;
}
.mt-12 {
  margin-top: 12.48px;
}
.mt-24 {
  margin-top: 24.96px;
}
.mt-30 {
  margin-top: 31.2px;
}
.br-12 {
  border-radius: 12.48px;
}
.text-center {
  text-align: center;
}
.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-overflow-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.bg-color-white {
  background-color: #fff;
}
.font-color-dark {
  color: #333;
}
.font-color-textPrimary {
  color: #333;
}
.font-color-minor {
  color: #7a7a7a;
}
.font-color-999 {
  color: #999;
}
.font-size-10 {
  font-size: 10.4px;
}
.font-size-12 {
  font-size: 12.48px;
}
.font-size-14 {
  font-size: 14.56px;
}
.font-size-16 {
  font-size: 16.64px;
}
.font-w-500 {
  font-weight: 500;
}

/* ============ 藏品卡 ============ */
/* 原站 w-image：width=2*83 rpx=166rpx=86.32px？→ 实际 u-image width=2*width rpx = 166rpx = 86.32px */
.rg-goods__cover {
  width: 86.32px;
  height: 86.32px;
  border-radius: 12.48px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
}
.rg-goods__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* 原站 .info-bar：types != 1 时上下分布 */
.info-bar {
  padding-top: 8.32px;
  padding-bottom: 8.32px;
  padding-left: 16.64px;
  flex-grow: 1;
  min-width: 0;
}

/* ============ 赠送价格输入框（原站 .inputClass） ============ */
.inputClass {
  width: 357.76px;
  height: 45.76px;
  background: #fff;
  border-radius: 6.24px;
  padding: 10.4px 12.48px;
  border: 0.52px solid #eaeaea;
  color: #000;
  box-sizing: border-box;
  font-size: 14.56px;
  outline: none;
  display: block;
}
.rg-input__ph {
  color: #999;
  font-size: 16.64px;
}

/* ============ 搜索框（原站 w-search-input） ============ */
.rg-search {
  display: flex;
  align-items: center;
  background: #fff;
  border: 0.52px solid #eaeaea;
  border-radius: 6.24px;
  padding: 5.2px 6.24px;
  height: 45.76px;
  box-sizing: border-box;
}
.rg-search__icon {
  width: 24.96px;
  height: 24.96px;
  flex-shrink: 0;
}
.rg-search__input {
  margin-left: 4.16px;
  margin-right: 4.16px;
  flex: 1;
  min-width: 0;
  font-size: 16.64px;
  color: #333;
  outline: none;
  border: none;
  background: transparent;
  height: 100%;
}
.rg-search__clear {
  width: 24.96px;
  height: 24.96px;
  flex-shrink: 0;
  cursor: pointer;
}

/* ============ 用户卡 ============ */
.user-bar {
  background: #fff;
  border-radius: 12.48px;
}
.rg-user__avatar {
  width: 27.04px;
  height: 27.04px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
}
.rg-user__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.rg-user__line {
  max-width: 249.6px;
}

/* ============ 底部操作条 ============ */
.action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 390px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 24.96px);
  background: #f7f7f8;
}
.action .z-btn {
  height: 47.84px;
  font-size: 14.56px;
  font-weight: bold;
  border-radius: 23.92px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 10.4px;
  white-space: nowrap;
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
.action .z-btn.disabled {
  background: #e3e3e3;
  color: #666;
  cursor: not-allowed;
}

/* ============ 操作密码弹窗（原站 u-popup + .auth-popup） ============ */
.rg-popup-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-popup {
  position: relative;
  width: 340.08px;
  background-color: #fff;
  border-radius: 12.48px;
}
.auth-popup .close {
  position: absolute;
  right: 0;
  top: -41.6px;
  z-index: 2;
  width: 24.96px;
  height: 24.96px;
}
.u-code-input {
  display: flex;
  gap: 10.4px;
  position: relative;
}
.u-code-input__item {
  background-color: #ececec;
  width: 43.68px;
  height: 43.68px;
  border-radius: 8.32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.u-code-input__item__dot {
  width: 7px;
  height: 7px;
  border-radius: 100px;
  background-color: #606266;
}
.u-code-input__input {
  position: absolute;
  left: -390px;
  width: 780px;
  top: 0;
  background-color: initial;
  text-align: left;
  height: 43.68px;
  opacity: 0;
}
</style>
