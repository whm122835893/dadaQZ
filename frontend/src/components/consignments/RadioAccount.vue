<template>
  <!--
    原站 w-radio-account
      script 模块 e54c（name: "w-radio-account"）
        computed.account → [{ image:'/static/icon/yibao-image.webp', name:'易宝支付',
                              type:'yibao', describe:'', isOpen:userInfo.yibao_status, isShowOpen:true }]
        data → { type:[], servicePriceText:'', servicePop:false }
        mounted → 取 appConfig.default_pay_type 匹配已开通账户 → type=[type] → $emit('changeIncome', type)
        changeType(a) → 已选则移除；未开通(isOpen=0)不选；否则 push → $emit('changeIncome', type)
      render 模块 b5a3（scope 91a2c07e）
        .w-radio-account
          .font-size-14.font-color-black.font-w-bold ← "收款账户"
          v-for account → .item (.item-action 选中)
            img (30rpx × 28rpx, margin-right 18rpx, mode widthFix)
            .font-size-12.font-color-black.font-w-500 (.item-action-font) ← account.name
            .flex-1
            .flex-center
              .font-size-12.font-color-describe.mr-8.font-w-500 ← account.describe
              [isOpen==0] .goOpen (v-show=isShowOpen) @click.stop → openPay ← "去开通"
              [否则] w-icon(name = 选中?"checked-icon-blue":"uncheck-icon", size 18)
  -->
  <div class="w-radio-account">
    <div class="font-size-14 font-color-black font-w-bold">收款账户</div>

    <div
      v-for="(a, i) in account"
      :key="i"
      class="item"
      :class="{ 'item-action': type.includes(a.type) }"
      @click="changeType(a)"
    >
      <img class="acc-icon" :src="a.image" mode="widthFix" alt="" />
      <span class="font-size-12 font-color-black font-w-500" :class="{ 'item-action-font': type.includes(a.type) }">
        {{ a.name }}
      </span>
      <span class="flex-1" />
      <span class="flex-center">
        <span class="font-size-12 font-color-describe mr-8 font-w-500" :class="{ 'item-action-font': type.includes(a.type) }">
          {{ a.describe }}
        </span>
        <template v-if="a.isOpen == 0">
          <span v-show="a.isShowOpen" class="goOpen" @click.stop="openPay(a.type)">去开通</span>
        </template>
        <img v-else class="acc-check" :src="type.includes(a.type) ? CHECKED : UNCHECKED" alt="" />
      </span>
    </div>
  </div>
</template>

<script setup>
/**
 * 收款账户选择（对应原站 w-radio-account）
 *   - 账户列表固定为「易宝支付」，是否已开通由 userInfo.yibao_status 决定
 *   - 选中项通过 changeIncome 事件向外抛出（数组，元素为 type 字符串）
 */
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  /** 已开通的收款账户类型列表（对应原站 userInfo.yibao_status） */
  userInfo: { type: Object, default: () => ({}) },
  /** 默认支付方式（对应原站 appConfig.default_pay_type） */
  defaultPayType: { type: String, default: 'yibao' }
})
const emit = defineEmits(['changeIncome'])

const CHECKED = '/assets/img/consignments/checked-icon-blue.png'
const UNCHECKED = '/assets/img/consignments/uncheck-icon.png'

/** 已选中的账户 type 数组 */
const type = ref([])

const account = computed(() => {
  return [
    {
      image: '/assets/img/consignments/yibao-image.webp',
      name: '易宝支付',
      type: 'yibao',
      describe: '',
      isOpen: props.userInfo.yibao_status,
      isShowOpen: true
    }
  ]
})

onMounted(() => {
  const hit = account.value.filter((a) => a.type === props.defaultPayType && a.isOpen != 0)
  type.value = hit.length ? [hit[0].type] : []
  emit('changeIncome', type.value)
})

/** 原站 changeType：已选则取消，未开通不选，否则加入 */
function changeType(a) {
  if (type.value.includes(a.type)) {
    type.value = type.value.filter((x) => x !== a.type)
  } else if (a.isOpen != 0) {
    type.value.push(a.type)
  }
  emit('changeIncome', type.value)
}

/** 原站 openPay：开通支付账户（易宝走 redirect_url 跳转） */
function openPay(t) {
  if (t === 'yibao') {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: '请前往 App 开通易宝支付' }))
  }
}
</script>

<style scoped>
/* 原站 scope 91a2c07e（.w-radio-account） */
/* 布局工具类（原站全局原子类，此处按需补齐） */
.flex {
  display: flex;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-1 {
  flex: 1;
}
.font-size-12 {
  font-size: 12.48px;
}
.font-size-14 {
  font-size: 14.56px;
}
.font-w-500 {
  font-weight: 500;
}
.font-w-bold {
  font-weight: 700;
}
.font-color-black {
  color: #23262f;
}
.font-color-describe {
  color: #85868d;
}
.mr-8 {
  margin-right: 8.32px;
}
.acc-icon {
  width: 15.6px;
  height: 14.56px;
  margin-right: 9.36px;
}
.acc-check {
  width: 18.72px;
  height: 19.44px;
}
.w-radio-account {
  background-color: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 20.8px;
  padding: 12.48px;
  margin-bottom: 12.48px;
}
.w-radio-account > .item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 24.44px;
}
.w-radio-account .goOpen {
  padding: 2.08px 8.32px;
  text-align: center;
  line-height: 20.8px;
  border-radius: 26px;
  background: #141416;
  color: #fff;
  font-size: 12.48px;
}
</style>
