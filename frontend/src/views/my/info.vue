<template>
  <!--
    原站 pages/my/info（金标准实测 2026-10-25，390x844，黑金 #101115，未登录态抓取）
    结构：nav(透明, back-white 24x24@(13,10), 标题16px bold #fff)
      → 行1 (0,60,390,62) bg#030303：头像 14px #fff @x16 + 头像图 61x29@(313,76) br2（未登录为空图）
      → 行2 (0,123,390,53)：昵称 + 箭头 arrow-right-black 6x11@(368)
      → 行3 (0,177,390,53)：手机号 + 箭头
    交互：头像点击→底部弹层（取消/重选/预览/完成，原站文案，布局为推断）；
          昵称点击→编辑弹层（取消/完成，推断）；保存走 /user/profile（原站真实端点）
  -->
  <div class="if-page">
    <div class="if-nav">
      <img class="if-nav__back" src="/assets/img/my/back-btn-white.png" alt="" @click="goBack" />
      <span class="if-nav__title">个人信息</span>
    </div>

    <div class="if-row if-row--avatar" @click="showAvatarPop = true">
      <span class="if-row__label">头像</span>
      <img v-if="avatarUrl" class="if-avatar-img" :src="avatarUrl" alt="" />
      <img v-else class="if-avatar-img if-avatar-img--empty" alt="" />
    </div>
    <div class="if-row" @click="openNickname">
      <span class="if-row__label">昵称</span>
      <span v-if="nickname" class="if-row__value">{{ nickname }}</span>
      <img class="if-row__arrow" src="/assets/img/my/arrow-right-black.webp" alt="" />
    </div>
    <div class="if-row" @click="showMobile">
      <span class="if-row__label">手机号</span>
      <span v-if="mobile" class="if-row__value">{{ hideMobile }}</span>
      <img class="if-row__arrow" src="/assets/img/my/arrow-right-black.webp" alt="" />
    </div>

    <!-- 头像编辑弹层（原站文案：取消/重选/预览/完成；布局推断） -->
    <div v-if="showAvatarPop" class="if-mask" @click.self="showAvatarPop = false">
      <div class="if-pop">
        <img v-if="previewUrl" class="if-pop__preview" :src="previewUrl" alt="" />
        <img v-else class="if-pop__preview if-pop__preview--empty" alt="" />
        <div class="if-pop__btns">
          <span class="if-pop__btn" @click="showAvatarPop = false">取消</span>
          <span class="if-pop__btn" @click="pickAvatar">重选</span>
          <span class="if-pop__btn" @click="previewAvatar">预览</span>
          <span class="if-pop__btn if-pop__btn--primary" @click="saveAvatar">完成</span>
        </div>
      </div>
    </div>
    <input ref="fileRef" type="file" accept="image/*" style="display: none" @change="onFileChange" />

    <!-- 昵称编辑弹层（推断布局） -->
    <div v-if="showNickPop" class="if-mask" @click.self="showNickPop = false">
      <div class="if-pop">
        <div class="if-pop__title">修改昵称</div>
        <input v-model="nickInput" class="if-pop__input" type="text" maxlength="20" placeholder="请输入昵称" />
        <div class="if-pop__btns">
          <span class="if-pop__btn" @click="showNickPop = false">取消</span>
          <span class="if-pop__btn if-pop__btn--primary" @click="saveNickname">完成</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { setProfile } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const userStore = useUserStore()

const avatarUrl = computed(() => userStore.userInfo?.avatar || '')
const nickname = computed(() => userStore.userInfo?.nickname || '')
const mobile = computed(() => userStore.userInfo?.mobile || '')

/** 原站 hideUrl filter：前5 + **** + 后5 掩码 */
const hideMobile = computed(() => {
  const v = mobile.value
  return v ? v.slice(0, 5) + '****' + v.slice(v.length - 5) : ''
})

const showAvatarPop = ref(false)
const showNickPop = ref(false)
const nickInput = ref('')
const fileRef = ref(null)
const pendingAvatar = ref('')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

function openNickname() {
  nickInput.value = nickname.value
  showNickPop.value = true
}

function showMobile() {
  /* 原站手机号行仅展示，无编辑交互 */
}

function pickAvatar() {
  fileRef.value && fileRef.value.click()
}

function onFileChange(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    pendingAvatar = String(reader.result)
  }
  reader.readAsDataURL(file)
}

/** 预览态头像：本地已选未保存时优先展示 */
const previewUrl = computed(() => pendingAvatar.value || avatarUrl.value)

function previewAvatar() {
  if (!pendingAvatar.value) toast('请先重选头像')
}

async function saveAvatar() {
  if (!pendingAvatar.value) {
    showAvatarPop.value = false
    return
  }
  await setProfile({ avatar: pendingAvatar.value })
  userStore.setUserInfo({ ...userStore.userInfo, avatar: pendingAvatar.value })
  pendingAvatar.value = ''
  showAvatarPop.value = false
  toast('设置成功')
}

async function saveNickname() {
  const v = nickInput.value.trim()
  if (!v) return toast('请输入昵称')
  await setProfile({ nickname: v })
  userStore.setUserInfo({ ...userStore.userInfo, nickname: v })
  showNickPop.value = false
  toast('设置成功')
}
</script>

<style scoped>
.if-page {
  min-height: 100vh;
  background: #101115;
}
.if-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  z-index: 10;
}
.if-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.if-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
.if-row {
  position: relative;
  margin: 60px 0 0;
  height: 62px;
  background: #030303;
  display: flex;
  align-items: center;
}
.if-row + .if-row {
  margin-top: 1px;
  height: 53px;
}
.if-row__label {
  margin-left: 16px;
  font-size: 14px;
  line-height: 15px;
  color: #fff;
}
.if-row__value {
  margin-left: auto;
  margin-right: 32px;
  font-size: 14px;
  line-height: 15px;
  color: #a59b88;
}
.if-avatar-img {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 61px;
  height: 29px;
  border-radius: 2px;
  object-fit: cover;
}
.if-row__arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  margin-top: -5.5px;
  width: 6px;
  height: 11px;
}
.if-mask {
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
.if-pop {
  width: 300px;
  background: #181713;
  border: 1px solid #655032;
  border-radius: 12px;
  padding: 20px 16px 16px;
}
.if-pop__title {
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
.if-pop__preview {
  display: block;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  object-fit: cover;
}
.if-pop__preview--empty {
  background: #f5f5f5;
}
.if-pop__input {
  width: 100%;
  height: 40px;
  margin-top: 16px;
  background: #030303;
  border: 1px solid #655032;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #fff;
  outline: none;
}
.if-pop__btns {
  display: flex;
  margin-top: 18px;
}
.if-pop__btn {
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
.if-pop__btn:first-child {
  margin-left: 0;
}
.if-pop__btn--primary {
  background: #211c14;
  color: #f4dcaa;
}
</style>
