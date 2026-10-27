<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>

  <!-- 全局轻提示（对齐原站 uni.showToast({icon:'none'})） -->
  <div v-if="toastState.show" class="g-toast" @click="closeToast">
    <div class="g-toast-box">
      <span class="g-toast-text">{{ toastState.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { toastState, closeToast } from '@/utils/toast'
</script>

<style>
.g-toast {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.g-toast-box {
  max-width: 70%;
  padding: 10px 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.78);
  pointer-events: auto;
}
.g-toast-text {
  font-size: 13px;
  color: #fff;
  text-align: center;
  line-height: 1.5;
}
</style>