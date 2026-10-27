<template>
  <!--
    原站 components/mGoodsList（模块 86e8 script + 34c2 render，scope 04316528）
    三个 tab 的列表渲染：
      tabCurrent==0 寄售行 → 点击 toDetails 跳 /pages/market/detail?id=
      tabCurrent==1 求购行 → 右侧小按钮 出售中(禁用) / 立即出售|求购中
      tabCurrent==3 成交   → 顶部汇总卡（当前地板价 / 今日最高 / 今日最低 / 今日成交额 / 今日成交量）+ 成交行
    ★ 原站 bug 复刻：成交汇总卡「今日最低」取的是 today_highest_price（原站渲染写错）
  -->
  <div class="mgl-list">
    <!-- ============ tab0 寄售 ============ -->
    <template v-for="(item, i) in list" :key="'m' + i">
      <div v-show="tabCurrent === 0" class="mgl-row" @click="toDetails(item)">
        <div class="mgl-row-top">
          <div class="mgl-row-name">{{ product.name ? handleLang(product.name) : '' }}</div>
          <div class="mgl-row-tags">
            <div v-if="payTagText(item)" class="mgl-tag"><span class="mgl-tag__text">{{ payTagText(item) }}</span></div>
            <div class="mgl-tag"><span class="mgl-tag__text">{{ item.status == 1 ? '寄售中' : '锁定中' }}</span></div>
          </div>
          <div class="mgl-row-pricebox">
            <span class="mgl-row-price">¥ {{ item.price }}</span>
            <span class="mgl-row-arrow">›</span>
          </div>
        </div>
        <div class="mgl-row-bottom">
          <div class="mgl-row-code">#{{ item.collection_code }}</div>
          <div v-if="itemHash(item)" class="mgl-row-hash">交易hash: {{ itemHash(item) }}</div>
        </div>
        <div class="mgl-row-line"></div>
      </div>
    </template>

    <!-- ============ tab1 求购 ============ -->
    <template v-for="(item, i) in list2" :key="'beg' + i">
      <div v-show="tabCurrent === 1" class="mgl-row">
        <div class="mgl-row-top">
          <div class="mgl-row-name">{{ item.goods_name ? handleLang(item.goods_name) : '' }}</div>
          <img class="mgl-pay-icon" :src="'/static/icon/' + item.pay_way + '-m.png'" alt="" />
          <div class="mgl-row-flex"></div>
          <span class="mgl-row-price">¥ {{ item.price }}</span>
        </div>
        <div class="mgl-row-bottom">
          <div class="mgl-row-flex"></div>
          <div v-if="item.order_status == 4" class="z-btn btn-size-mm circle mgl-mini-btn mgl-mini-btn-disabled">出售中</div>
          <div
            v-else-if="item.order_status == 1"
            class="z-btn btn-size-mm circle mgl-mini-btn"
            :class="{ 'mgl-mini-btn--disabled': !item.is_sold }"
            @click="toSell(item)"
          >
            {{ item.is_sold ? '立即出售' : '求购中' }}
          </div>
        </div>
        <div class="mgl-row-line"></div>
      </div>
    </template>

    <!-- ============ tab3 成交：汇总卡 ============ -->
    <div v-show="tabCurrent === 3" class="mgl-summary">
      <div class="mgl-summary-item mgl-summary-item--first">
        <span class="mgl-summary-label">{{ info.current_consignment == 0 ? '当前最高限价' : '当前地板价' }}</span>
        <span class="mgl-summary-value">
          ¥ {{ info.current_consignment == 0 ? product.reprice_limit : info.floor_price + '.00' }}
        </span>
      </div>
      <div class="mgl-summary-item mgl-summary-item--row">
        <div class="mgl-summary-inline">
          <span class="mgl-summary-label mgl-tag">今日最高</span>
          <span class="mgl-summary-value">¥ {{ info.today_highest_price }} </span>
        </div>
        <div>
          <span class="mgl-summary-label mgl-summary-label--mt">今日成交额</span>
          <span class="mgl-summary-value">{{ info.today_amount }} 元</span>
        </div>
      </div>
      <div class="mgl-summary-item mgl-summary-item--row">
        <div class="mgl-summary-inline">
          <!-- ★ 原站 bug：「今日最低」渲染的是 today_highest_price -->
          <span class="mgl-summary-label mgl-tag">今日最低</span>
          <span class="mgl-summary-value">¥ {{ info.today_highest_price }} </span>
        </div>
        <div>
          <span class="mgl-summary-label">今日成交量</span>
          <span class="mgl-summary-value">{{ info.today_volume }} 笔</span>
        </div>
      </div>
    </div>

    <!-- ============ tab3 成交：成交行 ============ -->
    <template v-for="(item, i) in list" :key="'deal' + i">
      <div v-show="tabCurrent === 3" class="mgl-row">
        <div class="mgl-row-top">
          <div class="mgl-row-name">#{{ item.collection_code }}/{{ item.total_num }}</div>
          <div class="mgl-row-flex"></div>
          <span class="mgl-row-price">¥ {{ item.price }}</span>
        </div>
        <div class="mgl-row-bottom">
          <div class="mgl-row-code">{{ item.time }}</div>
          <div class="mgl-row-flex"></div>
          <div class="mgl-tag"><span class="mgl-tag__text">已成交</span></div>
        </div>
        <div class="mgl-row-line"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
/**
 * 市场专辑列表 —— 原站 mGoodsList
 *   props: tabCurrent(0 寄售 / 1 求购 / 3 成交) / list / info(成交汇总) / search / product
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/utils/toast'

const props = defineProps({
  tabCurrent: { type: Number, default: 0 },
  list: { type: Array, default: () => [] },
  info: { type: Object, default: () => ({}) },
  search: { type: Object, default: () => ({}) },
  product: { type: Object, default: () => ({}) }
})

const router = useRouter()

/** 原站 computed list2 = this.list || [] */
const list2 = computed(() => props.list || [])

/** 原站 handleLang → converter（中文站原样返回） */
function handleLang(s) {
  return s == null ? '' : s
}

/** 原站 toDetails：$u.route('/pages/market/detail', { id }) */
function toDetails(item) {
  router.push({ path: '/pages/market/detail', query: { id: item.id } })
}

/** 原站 toSell：sellBegBuy?buy_id&collection_id&pay_way&number=1 */
function toSell(item) {
  if (!props.product.is_has) {
    toast('当前未持有该藏品')
    return
  }
  router.push({
    path: '/pages/market/sellBegBuy',
    query: { buy_id: item.id, collection_id: props.product.id, pay_way: item.pay_way, number: 1 }
  })
}

/** 原站 payTagText：huifu→汇 / yibao→易 / 其他→空 */
function payTagText(item) {
  const way = item.pay_way || (item.income_type && item.income_type[0])
  if (way === 'huifu' || way === 'huifupay') return '汇'
  if (way === 'yibao') return '易'
  return ''
}

/** 原站 itemHash */
function itemHash(item) {
  return item.hash || item.tx_hash || item.user_hash || item.trade_hash || ''
}
</script>

<style scoped>
/* 原站 mgl-list scope 04316528 —— H5 编译后保留 px，以下为实测值 */
.mgl-list {
  display: block;
  padding: 0 18px;
}
.mgl-row {
  position: relative;
  padding: 11px 0 9px;
  border-bottom: 1px solid #2a2720;
}
.mgl-row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mgl-row-flex {
  flex: 1;
  min-width: 0;
}
.mgl-row-name {
  max-width: 124px;
  font-size: 11px;
  line-height: 16px;
  color: #f8f8f8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mgl-row-tags {
  display: flex;
  align-items: center;
}
.mgl-pay-icon {
  width: 13px;
  height: 12px;
  margin-left: 6px;
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
  line-height: 11px;
  color: #d9c399;
}
.mgl-row-pricebox {
  display: block;
  white-space: nowrap;
  font-size: 14px;
  line-height: 17px;
}
.mgl-row-price {
  display: inline;
  margin-left: 10px;
  font-size: 14px;
  color: #f4dcaa;
}
.mgl-row-arrow {
  display: inline;
  margin-left: 7px;
  font-size: 13px;
  color: #b19b77;
}
.mgl-row-bottom {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 7px;
}
.mgl-row-code {
  width: 38%;
  padding: 1px 6px;
  border-radius: 3px;
  background: #1b1b1b;
  font-size: 8px;
  line-height: 9px;
  color: #bdb5a8;
}
.mgl-row-hash {
  width: 62%;
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 3px;
  background: #1b1b1b;
  font-size: 8px;
  line-height: 9px;
  color: #928878;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mgl-row-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0.5px;
  background: #2a271f;
}

/* 小按钮（原站 w-button size="mm" + mgl-mini-btn） */
.z-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  text-align: center;
}
.btn-size-mm {
  height: 24px;
  font-size: 10px;
}
.circle {
  border-radius: 23px;
}
.mgl-mini-btn {
  font-size: 10px;
  width: 72px;
}
.mgl-mini-btn.z-btn {
  background: linear-gradient(135deg, #fae8bd, #cfaf72);
  color: #2f2413;
}
.mgl-mini-btn--disabled.z-btn {
  background: #23211c !important;
  color: #8d8474 !important;
}
.mgl-mini-btn-disabled.z-btn {
  background: #23211c !important;
  color: #8d8474 !important;
}

/* 成交汇总卡 */
.mgl-summary {
  padding: 5px;
  border-radius: 15px;
  background: #19170f;
  border: 0.5px solid #3a3225;
}
.mgl-summary .mgl-summary-item {
  margin-top: 10px;
}
.mgl-summary-item--first {
  border-bottom: 1px solid #2f281c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 6px;
  margin-top: 0 !important;
}
.mgl-summary-item--row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mgl-summary .mgl-summary-inline {
  display: flex;
  align-items: center;
}
.mgl-summary .mgl-summary-chip {
  padding: 2px 5px;
  border-radius: 3px;
  background: #2a2419;
  border: 0.5px solid #5c492d;
  font-size: 9px;
  color: #e0cfa9;
}
.mgl-summary .mgl-summary-num {
  margin-left: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #f4dcaa;
}
.mgl-summary .mgl-summary-label {
  font-size: 10px;
  color: #928878;
}
.mgl-summary-label--mt {
  margin-top: 5px;
}
.mgl-summary .mgl-summary-value {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 700;
  color: #f4dcaa;
  margin-left: 10px;
}
/* 汇总卡里的「今日最高 / 今日最低」标签：原站 .mgl-summary-label.mgl-tag
   （标签色 #928878 由 .mgl-summary-label 覆盖 .mgl-tag 的 #d9c399） */
.mgl-summary .mgl-summary-label.mgl-tag {
  margin-left: 0;
}
</style>
