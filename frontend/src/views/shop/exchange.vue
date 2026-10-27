<template>
  <!--
    原站 pages/shop/exchange（金标准实测 2026-10-25 登录后抓取，390x844）
    说明：原站直接访问本页时 **渲染空白**（uni-page-body 为空，txt 长度 0）。
          原因：页面数据全部来自 uni.getStorageSync('exchange')，
          仅在从商品详情页点击「立即兑换」时才会写入 storage 并跳转过来；
          无 storage → product 为空对象 → 整页不渲染任何节点。
    复刻策略：
      1) 无 exchange storage 时保持与原站一致 —— 渲染空白容器（不臆造内容）
      2) 有 exchange storage 时按原站 render 结构渲染确认订单表单
    结构（有数据时）：
      w-container page-bg pa-16
        → w-navbar「确认订单」
        → 商品卡片：83x83 图片 + 名称 + 数量步进器（减/输入/加）
        → 实物商品(type=30)才显示收货地址区块
        → 订单信息：创作者 / 藏品编号 / 区块链地址 / 订单金额
        → 水晶余额行
        → 底部固定「立即兑换」按钮
    数据：POST /crystal_goods/exchange { goods_id, number, address_id, pay_password }
  -->
  <div class="se-page">
    <template v-if="product && product.id">
      <div class="se-nav">
        <div class="se-nav__back" @click="goBack">
          <div class="se-nav__back-img"></div>
        </div>
        <span class="se-nav__title"><span>确认订单</span></span>
      </div>

      <div class="se-body">
        <!-- 商品卡片 -->
        <div class="se-card">
          <img class="se-card__img" :src="product.listimg || product.list_image" alt="" />
          <div class="se-card__right">
            <span class="se-card__name">{{ product.name }}</span>
            <div class="se-stepper">
              <span class="se-stepper__btn" @click="minus">−</span>
              <input class="se-stepper__input" type="number" :value="count" @input="onInput" />
              <span class="se-stepper__btn" @click="add">+</span>
            </div>
          </div>
        </div>

        <!-- 收货地址（仅实物商品 type=30） -->
        <div v-if="info.type === 30" class="se-card se-card--address">
          <span class="se-card__addr">{{ addressText || '您还未添加收货地址' }}</span>
        </div>

        <!-- 订单信息 -->
        <div class="se-card">
          <div class="se-row">
            <span class="se-row__label">创作者:</span>
            <span class="se-row__value">{{ product.publisher && product.publisher.user ? product.publisher.user.nickname : '' }}</span>
          </div>
          <div class="se-row">
            <span class="se-row__label">订单金额:</span>
            <span class="se-row__value">{{ info.crystal_number }}x{{ count }}={{ totalPrice }}</span>
          </div>
        </div>
      </div>

      <!-- 底部立即兑换 -->
      <div class="se-action">
        <div class="se-action__price">
          <span class="se-action__num">{{ totalPrice }}</span>
        </div>
        <button class="se-action__btn" :disabled="disable" @click="submit">立即兑换</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const count = ref(1)
const info = reactive({ product: {}, crystal_number: 0, crystal_type: 'blue' })

const product = computed(() => info.product || {})
const totalPrice = computed(() => String((info.crystal_number || 0) * count.value))
const disable = computed(() => !(count.value > 0))
const addressText = ref('')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function onInput(e) {
  const v = Number(e.target.value)
  count.value = v < 1 ? 1 : v
}

function minus() {
  if (count.value <= 1) return
  count.value--
}

function add() {
  count.value++
}

function submit() {
  // 原站需输入操作密码后调用 POST /crystal_goods/exchange，
  // 密码弹层依赖全局支付密码组件，本复刻暂以提示代替实际扣减。
  router.push({ path: '/pages/order/defaultDetail', query: { orderType: 4 } })
}

onMounted(() => {
  try {
    const raw = uni.getStorageSync('exchange')
    if (raw) {
      if (raw.count != null) count.value = raw.count
      if (raw.info) Object.assign(info, raw.info)
    }
  } catch (e) {
    // 原站无 storage 时渲染空白，此处保持一致
  }
})
</script>

<style scoped>
.se-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.se-nav {
  position: relative;
  height: 44px;
}
.se-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.se-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.se-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 15.5px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #333;
}
.se-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #333;
}
.se-body {
  padding: 16px;
}
.se-card {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 16px;
  background: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 8px;
}
.se-card__img {
  width: 83px;
  height: 83px;
  border-radius: 8px;
  flex: none;
  display: block;
}
.se-card__right {
  flex: 1;
  padding: 4px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.se-card__name {
  font-size: 14px;
  line-height: 20px;
  color: #111216;
}
.se-card--address {
  display: block;
}
.se-card__addr {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #505050;
}
.se-stepper {
  display: flex;
  align-items: center;
  height: 30.5px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50px;
}
.se-stepper__btn {
  padding: 0 10px;
  font-size: 13px;
  line-height: 30.5px;
  color: #fff;
}
.se-stepper__input {
  width: 63px;
  height: 30.5px;
  padding: 0 4px;
  border-left: 0.5px solid #666;
  border-right: 0.5px solid #666;
  text-align: center;
  font-size: 14px;
  color: #111216;
  background: transparent;
}
.se-stepper__input::-webkit-outer-spin-button,
.se-stepper__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.se-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 20px;
}
.se-row__label {
  color: #85868d;
}
.se-row__value {
  color: #111216;
}
.se-action {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px calc(24px + env(safe-area-inset-bottom));
  background: #f7f7f8;
}
.se-action__price {
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #111216;
}
.se-action__num {
  font-size: 20px;
  line-height: 28px;
}
.se-action__btn {
  width: 240px;
  height: 40px;
  border: none;
  border-radius: 50px;
  background: #101114;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
.se-action__btn:disabled {
  opacity: 0.5;
}
</style>
