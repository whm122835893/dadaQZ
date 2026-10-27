<template>
  <!--
    原站 w-toast（scope 06d93b02）
      .w-toast
        .toast-title.font-size-16.font-w-bold.font-color-dark.text-center ← title
        .toast-content.pt-16.font-size-14.font-w-400 ← content
        .toast-action.font-size-14.flex.flex-js-sb
          z-btn ← cancelText（pain）
          z-btn ← submitText
    尺寸：width 291.2px / radius 15.6px / padding 14.56px 17.68px 24.96px
    .toast-action margin-top 58.24px；按钮 114.4×41.6px / radius 6.24px
  -->
  <div v-if="show" class="toast-mask" @click.self="$emit('change', false)">
    <div class="w-toast">
      <div class="toast-title font-size-16 font-w-bold font-color-dark text-center">{{ title }}</div>
      <div class="toast-content pt-16 font-size-14 font-w-400" :class="{ 'text-center': contentAlign === 'center' }">{{ content }}</div>
      <div class="toast-action font-size-14 flex flex-js-sb">
        <div class="z-btn btn-size-lg btn-type-colorful circle pain" @click="$emit('change', false)">
          {{ cancelText || '取消' }}
        </div>
        <div class="z-btn btn-size-lg btn-type-toast-btn circle" @click="$emit('action', true)">
          {{ submitText || '确定' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 通用提示弹窗（对应原站 w-toast）
 *   @action(true) 表示点了确认；@action(false) / @change 表示取消
 */
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  cancelText: { type: String, default: '' },
  submitText: { type: String, default: '' },
  contentAlign: { type: String, default: '' }
})
defineEmits(['change', 'action'])
</script>

<style scoped>
.toast-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.w-toast {
  width: 291.2px;
  background: #fff;
  border-radius: 15.6px;
  padding: 14.56px 17.68px 24.96px;
  box-sizing: border-box;
}
.w-toast > .toast-title {
  font-size: 16.64px;
  font-weight: 700;
  color: #333;
  text-align: center;
}
.w-toast > .toast-content {
  padding-top: 16.64px;
  font-size: 14.56px;
  font-weight: 400;
  color: #333;
  line-height: 1.5;
}
/* 原站 contentAlign="center" */
.w-toast > .toast-content.text-center {
  text-align: center;
}
.w-toast > .toast-action {
  display: flex;
  justify-content: space-between;
  margin-top: 58.24px;
  font-size: 14.56px;
}
.w-toast > .toast-action > .z-btn {
  height: 41.6px;
  width: 114.4px;
  border-radius: 6.24px;
  font-size: 14.56px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 10.4px;
}
/* 原站 btn-type-colorful（金色渐变） */
.w-toast > .toast-action > .z-btn.btn-type-colorful {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
/* 原站 btn-type-colorful.pain（素色） */
.w-toast > .toast-action > .z-btn.btn-type-colorful.pain {
  background: #f0f0f2;
  color: #000;
}
.z-btn.btn-type-toast-btn {
  background: #23262f;
  color: #fff;
}
</style>
