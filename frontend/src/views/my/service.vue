<template>
  <!--
    原站 pages/my/service（金标准实测 2026-10-25，390x844，黑金 #101115）
    结构：nav(透明, back-white 24x24@(13,10), 标题15px bold #fff)
      → 金边卡 (16,56,358,108) bg#181713 边1px #655032 br12
          两行 h53：文本15px #ede6d6 @x17 + 复制图标 e663 20px #cfaf72（间隔20px）
    数据：getConfig().service_mobile / service_email（原站实测值 '#' / '1'）
  -->
  <div class="sv-page">
    <div class="sv-nav">
      <img class="sv-nav__back" src="/assets/img/my/back-btn-white.png" alt="" @click="goBack" />
      <span class="sv-nav__title">客服</span>
    </div>

    <div class="sv-card">
      <div class="sv-row">
        <span class="sv-row__text">客服：{{ config.service_mobile }}</span>
        <span class="uview-icon sv-row__copy" @click="doCopy(config.service_mobile)">&#xe663;</span>
      </div>
      <div class="sv-row">
        <span class="sv-row__text">客服邮箱：{{ config.service_email }}</span>
        <span class="uview-icon sv-row__copy" @click="doCopy(config.service_email)">&#xe663;</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getConfig } from '@/api'
import { copyText } from '@/utils/clipboard'
import { toast } from '@/utils/toast'

const router = useRouter()
const config = reactive({ service_mobile: '#', service_email: '1' })

getConfig().then((res) => {
  const d = res.data || {}
  if (d.service_mobile !== undefined) config.service_mobile = d.service_mobile
  if (d.service_email !== undefined) config.service_email = d.service_email
})

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

async function doCopy(text) {
  await copyText(String(text))
  toast('复制成功')
}
</script>

<style scoped>
.sv-page {
  min-height: 100vh;
  background: #101115;
}
.sv-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  z-index: 10;
}
.sv-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.sv-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}
.sv-card {
  margin: 56px 16px 0;
  height: 108px;
  background: #181713;
  border: 1px solid #655032;
  border-radius: 12px;
}
.sv-row {
  height: 53px;
  margin-top: 1px;
  display: flex;
  align-items: center;
}
.sv-row:first-child {
  margin-top: 0;
}
.sv-row__text {
  font-size: 15px;
  line-height: normal;
  color: #ede6d6;
}
.sv-row__copy {
  margin-left: 20px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  line-height: 20px;
  color: #cfaf72;
  cursor: pointer;
}
</style>
