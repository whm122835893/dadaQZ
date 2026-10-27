/**
 * 全局轻提示 —— 对齐原站 uni.showToast({ icon: 'none', title })
 * icon 为 none 时不显示图标，仅显示文字；2秒后自动关闭。
 */
import { ref } from 'vue'

export const toastState = ref({ show: false, text: '' })

let timer = null

export function toast(title, duration = 2000) {
  toastState.value = { show: true, text: title || '' }
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    toastState.value.show = false
  }, duration)
}

export function closeToast() {
  if (timer) clearTimeout(timer)
  toastState.value.show = false
}