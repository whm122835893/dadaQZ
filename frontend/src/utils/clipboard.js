/** 剪贴板复制 —— 对齐原站 `$tools.copyText`（uni.setClipboardData + toast） */
import { toast } from './toast'

export async function copyText(text) {
  const value = String(text == null ? '' : text)
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    toast('复制成功')
  } catch (e) {
    toast('复制失败')
  }
}