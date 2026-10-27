<template>
  <!--
    原站 w-modal（type = "toast-btn"）
      scope 471d5780
        .w-modal
          .toast-title  ← title
          .toast-content ← 默认插槽
          .toast-action
            z-btn ← cancelText
            z-btn ← submitText
      尺寸：width 312px / padding-top 14.56px / padding 17.68px 两侧 / padding-bottom 24.96px
      .toast-action margin-top 58.24px
      .toast-action > .z-btn height 41.6px / width 124.8px / border-radius 6.24px
  -->
  <div v-if="show" class="modal-mask" @click.self="$emit('change', false)">
    <div class="w-modal">
      <div class="toast-title">{{ title }}</div>
      <div class="toast-content">
        <slot />
      </div>
      <div class="toast-action">
        <div class="z-btn btn-size-lg btn-type-colorful circle pain" @click="$emit('change', false)">
          {{ cancelText || '取消' }}
        </div>
        <div class="z-btn btn-size-lg btn-type-toast-btn circle" @click="$emit('confirm')">
          {{ submitText || '确定' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 通用模态弹窗（对应原站 w-modal，type="toast-btn"）
 */
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  cancelText: { type: String, default: '' },
  submitText: { type: String, default: '' }
})
defineEmits(['change', 'confirm'])
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.w-modal {
  width: 312px;
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 16.64px;
  padding: 14.56px 17.68px 24.96px;
  position: relative;
  box-sizing: border-box;
}
.w-modal > .toast-title {
  font-size: 16.64px;
  font-weight: 700;
  color: #23262f;
  text-align: center;
}
.w-modal > .toast-action {
  display: flex;
  justify-content: space-between;
  margin-top: 58.24px;
}
.w-modal > .toast-action > .z-btn {
  height: 41.6px;
  width: 124.8px;
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
.w-modal > .toast-action > .z-btn.btn-type-colorful {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2414;
  background-size: contain;
}
/* 原站 btn-type-colorful.pain（素色） */
.w-modal > .toast-action > .z-btn.btn-type-colorful.pain {
  background: #f0f0f2;
  color: #000;
}
.z-btn.btn-type-toast-btn {
  background: #23262f;
  color: #fff;
}
</style>
