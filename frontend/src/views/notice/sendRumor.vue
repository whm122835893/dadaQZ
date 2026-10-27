<template>
  <!--
    原站 pages/notice/sendRumor（金标准实测 2026-10-25 登录后抓取，390x844）
    结构：container page-container diy（padding-top 44px，body 白底）
      → diy-nav 44px（bg #fff）：
          「取消」14px #333 @(16,12,28,20)
          「发表」按钮 54x29 @(320,7.5) bg #e3e3e3 br8px，文字 14px bold #666（disabled 态）
      → plr-16 内容：
          textarea 区（bg-color-item）：
            placeholder「请输入内容」15px #c0c4c4 @(27,55,336,70)
          上传区：
            图片方框 104x104（mt-16），内含图标 32x32 @(52,180.5) img.png
            「照片」10px #bababa @(58,215.5,20,11)
          匿名开关行（pt-32）：
            「匿名发表」14px #7a7a7a @(16,293,56,15)
            u-switch 34x18 @(85,291)：node 16x16 @(85,291) bg #fff；bg 24x16 @(93,291) bg #e6e6e6 br 0 100 100 0
    数据：POST /discover/rumor_wall/release { content, image[], is_anonymous }
          实调 { code:0, msg:"图片不能为空" }
  -->
  <div class="srp-page">
    <div class="srp-nav">
      <div class="srp-nav__row">
        <span class="srp-nav__cancel" @click="goBack">取消</span>
        <div class="srp-nav__submit" :class="{ 'srp-nav__submit--on': canSubmit }" @click="onSubmit">
          发表
        </div>
      </div>
    </div>

    <div class="srp-body">
      <div class="srp-textarea">
        <textarea
          v-model="content"
          class="srp-textarea__field"
          placeholder=""
          maxlength="-1"
        ></textarea>
        <span v-if="!content" class="srp-textarea__ph">请输入内容</span>
      </div>

      <div class="srp-upload">
        <div class="srp-upload__box" @click="onPickImage">
          <div class="srp-upload__icon"></div>
          <span class="srp-upload__label">照片</span>
        </div>
      </div>

      <div class="srp-switch-row">
        <span class="srp-switch-row__label">匿名发表</span>
        <div class="srp-switch" @click="anonymous = !anonymous">
          <div class="srp-switch__bg" :class="{ 'srp-switch__bg--on': anonymous }"></div>
          <div class="srp-switch__node" :class="{ 'srp-switch__node--on': anonymous }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { releaseRumorWall } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const content = ref('')
const anonymous = ref(false)
const images = ref([])

/** 原站「发表」按钮在内容为空时为 disabled 灰底 */
const canSubmit = computed(() => content.value.trim().length > 0)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/notice/notice')
}

function onPickImage() {
  toast('请选择图片')
}

async function onSubmit() {
  if (!canSubmit.value) {
    toast('请输入内容')
    return
  }
  try {
    const res = await releaseRumorWall({
      content: content.value,
      image: images.value,
      is_anonymous: anonymous.value ? 1 : 0
    })
    toast(res.msg || '发表成功')
  } catch (e) {
    toast('发表失败')
  }
}
</script>

<style scoped>
.srp-page {
  min-height: 100vh;
  background: #fff;
}
.srp-nav {
  position: relative;
  height: 44px;
  background: #fff;
}
.srp-nav__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
}
.srp-nav__cancel {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #333;
  cursor: pointer;
}
.srp-nav__submit {
  min-width: 54px;
  height: 29px;
  padding: 0 10px;
  border-radius: 8px;
  background: #e3e3e3;
  font-size: 14px;
  line-height: 29px;
  font-weight: 700;
  color: #666;
  text-align: center;
  cursor: pointer;
}
.srp-nav__submit--on {
  background: #141416;
  color: #fff;
}
.srp-body {
  padding: 0 16px;
}
.srp-textarea {
  position: relative;
  width: 358px;
  height: 92px;
  box-sizing: border-box;
  border: 1px solid #e7e7ea;
  border-radius: 20px;
  background: #fff;
}
.srp-textarea__field {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 336px;
  height: 70px;
  padding: 0;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  line-height: 21px;
  color: #111216;
  display: block;
}
.srp-textarea__ph {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 336px;
  height: 70px;
  font-size: 15px;
  line-height: 21px;
  font-weight: 400;
  color: #c0c4cc;
  pointer-events: none;
}
/* 原站 u-upload 358x120 @(16,136)，上传盒 104x104 @(16,152) margin-top 16px */
.srp-upload {
  height: 120px;
  box-sizing: border-box;
  display: flex;
}
.srp-upload__box {
  width: 104px;
  height: 104px;
  margin-top: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e7e7ea;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
}
.srp-upload__icon {
  width: 32px;
  height: 32px;
  background: url('/assets/img/m3/icon/img.png') no-repeat;
  background-size: 100% 100%;
}
.srp-upload__label {
  margin-top: 3px;
  font-size: 10px;
  line-height: 11px;
  font-weight: 400;
  color: #bababa;
}
/* 原站开关行：switch @(84,290,34,18)、node @(85,291)、bg @(93,291)；标签 @(16,293) */
.srp-switch-row {
  position: relative;
  height: 18px;
  margin-top: 32px;
}
.srp-switch-row__label {
  position: absolute;
  left: 0;
  top: 5px;
  width: 56px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #7a7a7a;
}
.srp-switch {
  position: absolute;
  left: 68px;
  top: 2px;
  width: 34px;
  height: 18px;
  border-radius: 100px;
  background: #e6e6e6;
  cursor: pointer;
}
.srp-switch__bg {
  position: absolute;
  left: 9px;
  top: 1px;
  width: 24px;
  height: 16px;
  border-radius: 0 100px 100px 0;
  background: #e6e6e6;
}
.srp-switch__bg--on {
  left: 0;
  border-radius: 100px 0 0 100px;
  background: #4478ff;
}
.srp-switch__node {
  position: absolute;
  left: 1px;
  top: 1px;
  width: 16px;
  height: 16px;
  border-radius: 100px;
  background: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}
.srp-switch__node--on {
  left: 18px;
}
</style>
