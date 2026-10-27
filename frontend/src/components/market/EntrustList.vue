<template>
  <!--
    原站 components/EntrustList（模块 ee24 script + 7526 render，scope 5a1087c1）
    委托（预付）tab：
      顶部汇总条：委托总金额：X元；委托总数：Y份
      列表行：藏品名 + 「委托中」标签 + ￥价格 / 委托数量 + 委托类型
    父组件通过 ref 调用 getList(search) 拉数据（原站 this.$refs.entrustList.getList）
  -->
  <div class="mgl-entrust">
    <div class="mgl-entrust__summary">委托总金额：{{ total_amount }}元；委托总数：{{ total_number }}份 </div>

    <div v-if="list.length" class="mgl-entrust__rows">
      <div v-for="(item, i) in list" :key="i" class="mgl-entrust__row">
        <div class="mgl-entrust__rowinner">
          <div class="mgl-entrust__namebox">
            <div class="mgl-entrust__titlerow">
              <div class="mgl-entrust__title">
                <span> {{ product.name ? handleLang(product.name) : '' }} </span>
                <span class="mgl-tag"><span class="mgl-tag__text">委托中</span></span>
              </div>
              <div class="mgl-entrust__price">￥{{ item.price }}</div>
            </div>
            <div class="mgl-entrust__meta">
              <div class="mgl-entrust__num"> 委托数量 {{ item.total_nums }} </div>
              <div class="mgl-entrust__type"> 委托类型： <span>委托</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mgl-entrust__spacer"></div>
  </div>
</template>

<script setup>
/**
 * 委托列表 —— 原站 EntrustList
 *   props: id(专辑 id) / product
 *   暴露 getList(search) 供父组件（专辑列表页）调用
 */
import { ref } from 'vue'
import { getEntrustList } from '@/api'

const props = defineProps({
  id: { type: [String, Number], default: null },
  product: { type: Object, default: () => ({}) }
})

const search = ref({ page: 1, sort: 'desc' })
const list = ref([])
const total_amount = ref(0)
const total_number = ref(0)

/** 原站 handleLang */
function handleLang(s) {
  return s == null ? '' : s
}

/** 原站 getList：POST /market/Prepayment/PrepaymentListMain */
async function getList(params = {}) {
  const p = { page: 1, sort: 'desc', ...params }
  search.value = p
  const res = await getEntrustList(p)
  const d = (res && res.data) || {}
  total_amount.value = d.total_amount || 0
  total_number.value = d.total_number || 0
  if (p.page === 1) list.value = []
  const rows = d.data || []
  if (rows.length) search.value = p
  list.value = list.value.concat(rows)
  return list.value
}

/** 原站 init：父组件切到委托 tab 时带 collection_id 调用 */
function init(collectionId) {
  search.value.collection_id = collectionId
  search.value.page = 1
  return getList(search.value)
}

defineExpose({ getList, init })
</script>

<style scoped>
/* 原站 EntrustList scope 5a1087c1 —— H5 编译后 px 实测值 */
.mgl-entrust__summary {
  background-color: #191711;
  margin-left: 15.6px;
  margin-right: 15.6px;
  border-radius: 10.4px;
  padding: 5.2px;
  text-align: center;
  font-size: 13px;
  margin-bottom: 10.4px;
  font-weight: bold;
}
.mgl-entrust__row {
  margin: 0 15.6px;
}
.mgl-entrust__rowinner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10.4px 15.6px;
  border-bottom: 1px solid #29261f;
}
.mgl-entrust__namebox {
  width: 100%;
}
.mgl-entrust__titlerow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mgl-entrust__title {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 13px;
  color: #fff;
}
.mgl-entrust__price {
  font-weight: bold;
  font-size: 13px;
  color: #fff;
}
.mgl-entrust__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15.6px;
  font-size: 12px;
}
.mgl-entrust__num {
  font-weight: bold;
  font-size: 10px;
  color: #a89e8d;
}
.mgl-entrust__type {
  font-weight: 400;
  font-size: 10px;
  color: #a89e8d;
}
.mgl-tag {
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 4px;
  background: #25200f;
  border: 0.5px solid #6c5737;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mgl-tag__text {
  font-size: 8px;
  color: #d9c399;
}
.mgl-entrust__spacer {
  height: 62.4px;
}
</style>
