<template>
  <!--
    原站 pages/draw/InvitationFriendAssist/InvitationFriendAssist
    （金标准实测 2026-10-25 登录后抓取，390x844，浅灰 #f5f5f5）
    结构：uni-page-head 白底 44px
      → 返回（u-btn-icon 码点 e601 27px @(5,6.5)）
      → 标题「邀请好友助力」16px bold #000 @(70,7,250,30)
      → page-body (0,44,390,800) bg #f7f7f8
          pa-16 内容区：
            「邀请」按钮 358x47 @(16,70) 金渐变 br8px，文字 14px bold #2f2414
            助力统计卡 358x50 @(16,132) bg #302920 br20px padding15
              「您已成功获得助力」14px #666 @(122.5,151,112,15)
              「0」14px #333 @(240.5,151,7,15)
              「次」14px #666 @(253.5,151,14,15)
            表头 12px #979797 y=198：日期 @(32,198,65.2,18) / 用户类型 @(97.2,198,81.5,18)
                               为您助力用户 @(178.7,198,114.1,18) / 结果 @(292.8,198,65.2,18)
            空态 icon 码点 e62f 90px @(150,232,90,90) 色 #c0c4cc
                 「数据为空」14px #c0c4cc @(167,332,56,20)
            助力规则卡 358x66 @(16,373) bg #302920 br20px padding15
              「助力规则」16px bold #4a4a4a @(56,388,64,24)
    数据：原站本页无独立列表接口，助力记录为空 → 渲染「数据为空」空态
  -->
  <div class="ia-page">
    <div class="ia-head">
      <div class="ia-head__btn" @click="goBack">
        <i class="ia-head__icon"></i>
      </div>
      <div class="ia-head__title">邀请好友助力</div>
    </div>

    <div class="ia-body">
      <div class="ia-inner">
        <div class="ia-btn" @click="onInvite">
          <span class="ia-btn__text">邀请</span>
        </div>

        <div class="ia-stat">
          <span class="ia-stat__label">您已成功获得助力</span>
          <span class="ia-stat__num">{{ assistCount }}</span>
          <span class="ia-stat__unit">次</span>
        </div>

        <div class="ia-table">
          <div class="ia-table__head">
            <span class="ia-table__cell">日期</span>
            <span class="ia-table__cell">用户类型</span>
            <span class="ia-table__cell">为您助力用户</span>
            <span class="ia-table__cell">结果</span>
          </div>

          <div v-if="list.length === 0" class="ia-empty">
            <i class="ia-empty__icon"></i>
            <span class="ia-empty__text">数据为空</span>
          </div>
          <div v-for="(row, i) in list" v-else :key="i" class="ia-table__row">
            <span class="ia-table__cell">{{ row.date }}</span>
            <span class="ia-table__cell">{{ row.user_type }}</span>
            <span class="ia-table__cell">{{ row.nickname }}</span>
            <span class="ia-table__cell">{{ row.result }}</span>
          </div>
        </div>

        <div class="ia-rules">
          <div class="ia-rules__head">
            <i class="ia-rules__icon"></i>
            <span class="ia-rules__title">助力规则</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getInviteAssistList } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()
const assistCount = ref(0)
const list = ref([])

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/product/collection')
}

function onInvite() {
  toast('请复制邀请链接分享给好友')
}

onMounted(async () => {
  try {
    const res = await getInviteAssistList()
    list.value = (res.data && res.data.data) || []
  } catch (e) {
    list.value = []
  }
})
</script>

<style scoped>
.ia-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.ia-head {
  position: relative;
  height: 44px;
  background: #fff;
}
.ia-head__btn {
  position: absolute;
  left: 5px;
  top: 6.5px;
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ia-head__icon {
  display: block;
  width: 27px;
  height: 27px;
  font-family: 'uview-icon';
  font-size: 27px;
  line-height: 27px;
  color: #000;
}
.ia-head__icon::before {
  content: '\e601';
}
.ia-head__title {
  position: absolute;
  left: 70px;
  top: 7px;
  width: 250px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000;
}
.ia-body {
  position: relative;
  height: 800px;
  background: #f7f7f8;
}
.ia-inner {
  padding: 16px;
}
.ia-btn {
  width: 358px;
  height: 47px;
  margin-top: 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fae8bd 0%, #cfaf72 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.ia-btn__text {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #2f2414;
}
.ia-stat {
  width: 358px;
  height: 50px;
  margin-top: 15px;
  padding: 15px;
  border-radius: 20px;
  background: #302920;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ia-stat__label {
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.ia-stat__num {
  margin: 0 6px;
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #333;
}
.ia-stat__unit {
  font-size: 14px;
  line-height: 15px;
  font-weight: 400;
  color: #666;
}
.ia-table {
  margin-top: 15px;
}
.ia-table__head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.ia-table__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.ia-table__cell {
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: rgb(151, 153, 151);
}
.ia-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ia-empty__icon {
  display: block;
  width: 90px;
  height: 90px;
  margin-top: 0;
  font-family: 'uview-icon';
  font-size: 90px;
  line-height: 90px;
  color: #c0c4cc;
}
.ia-empty__icon::before {
  content: '\e62f';
}
.ia-empty__text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #c0c4cc;
}
.ia-rules {
  width: 358px;
  height: 66px;
  margin-top: 21px;
  padding: 15px;
  border-radius: 20px;
  background: #302920;
}
.ia-rules__head {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.ia-rules__icon {
  width: 15px;
  height: 15px;
  display: block;
}
.ia-rules__title {
  margin-left: 10px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #4a4a4a;
}
</style>
