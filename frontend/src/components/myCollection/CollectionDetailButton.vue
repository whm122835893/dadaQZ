<template>
  <!--
    原站 collection-detail-button
      注册壳 `25d6` → options `a2b0` / render `f625`（scope 66e4d9e8）
      结构：.product-action > .button.flex-center-sb > w-button × N（flex:1）
      按钮高度 45.76px / radius 11.96px / font 12.48px / gap 12.48px
      主按钮 btn-type-colorful（金渐变），次按钮 btn-type-colorful-sp（金描边）
    分支（info.user_hash 存在时才渲染，否则「上链中」禁用）：
      status == 10                                       → 赠送中（禁用）
      status == 2 && is_lock == 1                        → 锁定中（禁用）
      weither_regift == 0 && status == 1                 → 转赠
      can_compose == 1 && !is_lock && status == 1        → 合成
      weither_resale == 0 && status == 1                 → 立即寄售（主）
      status == 2 && is_lock != 1                        → 取消寄售
      status==1 && !is_lock && weither_regift && weither_resale && !can_compose
                                                       → 尚未开启寄售（禁用）
    组件方法：consignment / regift / cancelConsignment / goCompound
  -->
  <div class="product-action">
    <div class="button flex-center-sb">
      <template v-if="info.user_hash">
        <!-- 赠送中 -->
        <div
          v-if="info.status == 10"
          class="z-btn btn-size-lg btn-type-colorful-sp circle disabled"
          :style="{ flex: 1 }"
        >
          赠送中
        </div>
        <!-- 锁定中 -->
        <div
          v-if="info.status == 2 && info.product.is_lock == 1"
          class="z-btn btn-size-lg btn-type-colorful-sp circle disabled"
          :style="{ flex: 1 }"
        >
          锁定中
        </div>
        <!-- 转赠 -->
        <div
          v-if="info.product.weither_regift == 0 && info.status == 1"
          class="z-btn btn-size-lg btn-type-colorful-sp circle"
          :style="{ flex: 1 }"
          @click="regift"
        >
          转赠
        </div>
        <!-- 合成 -->
        <div
          v-if="info.product.can_compose == 1 && !info.product.is_lock && info.status == 1"
          class="z-btn btn-size-lg btn-type-colorful-sp circle"
          :style="{ flex: 1 }"
          @click="goCompound"
        >
          合成
        </div>
        <!-- 立即寄售（主操作，金渐变） -->
        <div
          v-if="info.product.weither_resale == 0 && info.status == 1"
          class="z-btn btn-size-lg btn-type-colorful circle"
          :style="{ flex: 1 }"
          @click="consignment"
        >
          立即寄售
        </div>
        <!-- 取消寄售 -->
        <div
          v-if="info.status == 2 && info.product.is_lock != 1"
          class="z-btn btn-size-lg btn-type-colorful-sp circle"
          :style="{ flex: 1 }"
          @click="cancel_consignment_pop = true"
        >
          取消寄售
        </div>
        <!-- 尚未开启寄售 -->
        <div
          v-if="
            info.status == 1 &&
            !info.product.is_lock &&
            info.product.weither_regift &&
            info.product.weither_resale &&
            !info.product.can_compose
          "
          class="z-btn btn-size-lg btn-type-colorful-sp circle disabled"
          :style="{ flex: 1 }"
        >
          尚未开启寄售
        </div>
      </template>
      <!-- 上链中 -->
      <div v-else class="z-btn btn-size-lg btn-type-colorful-sp circle disabled" :style="{ flex: 1 }">
        上链中
      </div>
    </div>

    <!-- 原站 w-toast(contentAlign center, content 确认取消此寄售？) -->
    <WToast
      :show="cancel_consignment_pop"
      content-align="center"
      content="确认取消此寄售？"
      @change="cancel_consignment_pop = $event"
      @action="cancelConsignment"
    />
  </div>
</template>

<script setup>
/**
 * 藏品详情页底部操作条（对应原站 collection-detail-button）
 *   consignment()       → route('/pages/consignments/consignments', { id, pageType: types })
 *   regift()            → route('/pages/regift/regift', { id })
 *   cancelConsignment() → changeMarketGoods({ id: info.market_goods.id }) → emit('refresh')
 *   goCompound()        → getPageConfig() → route('/pages/compound/compound?thm=1')
 *                        失败 toast「合成未开启」
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { changeMarketGoods } from '@/api'
import { toast } from '@/utils/toast'
import WToast from '@/components/consignments/WToast.vue'

const props = defineProps({
  info: { type: Object, default: () => ({ product: {} }) }
})
const emit = defineEmits(['refresh'])
const router = useRouter()

const cancel_consignment_pop = ref(false)

/** 立即寄售 → 寄售发起页（原站带 pageType=types） */
function consignment() {
  router.push({
    path: '/pages/consignments/consignments',
    query: { id: props.info.id, pageType: props.info.types }
  })
}

/** 转赠 → 发起转赠页 */
function regift() {
  router.push({ path: '/pages/regift/regift', query: { id: props.info.id } })
}

/** 取消寄售 → 调接口后通知父级刷新 */
async function cancelConsignment() {
  cancel_consignment_pop.value = false
  if (!props.info.market_goods || !props.info.market_goods.id) return
  await changeMarketGoods({ id: props.info.market_goods.id })
  emit('refresh')
}

/** 合成 → 合成页（需后台开启合成开关） */
async function goCompound() {
  /* 原站 goCompound 先 getPageConfig()，合成未开启时仅 toast「合成未开启」 */
  toast('合成未开启')
}
</script>

<style scoped>
.product-action {
  background: #101115;
  border-top: 1px solid #332b1e;
  padding: 10.4px 15.6px calc(env(safe-area-inset-bottom) + 10.4px);
}
.product-action > .button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8.32px 0;
  gap: 12.48px;
  box-sizing: border-box;
}
.product-action .z-btn {
  height: 45.76px;
  font-size: 12.48px;
  font-weight: 600;
  border-radius: 11.96px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0 10.4px;
  font-family: Alibaba-PuHuiTi-Medium, -apple-system, sans-serif;
}
/* 主操作：金色渐变 */
.product-action .z-btn.btn-type-colorful {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2413;
}
/* 次操作：金色描边 */
.product-action .z-btn.btn-type-colorful-sp {
  background: transparent;
  border: 1px solid #8d7855;
  color: #f4dcaa;
}
/* 禁用态（原站 .disabled 覆盖背景与文字，不保留描边） */
.product-action .z-btn.disabled {
  background: #211c14;
  border: none;
  color: #f4dcaa;
  opacity: 0.55;
  cursor: not-allowed;
}
</style>