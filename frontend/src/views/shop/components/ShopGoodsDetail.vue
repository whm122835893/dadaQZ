<template>
  <!--
    商城商品详情页公共组件（复刻原站 pages/shop/detail/{collection|box|goods}）
    三页共用同一接口 POST /crystal_goods/info，仅参数与 goods_type 不同：
      collection: { goods_id: id, id: collection_id, batch_id }  goods_type=2（藏品）
      box:       { goods_id: id, id: blind_box_id }              goods_type=1（盲盒）
      goods:     { goods_id: id }                                goods_type=3（商品）
    原站行为：接口失败（如 code=0「商品不存在」）→ catch 后 setTimeout 1500ms 调 backPage() 回退上一页。
    原站数据现状：商城无上架商品，crystal_goods/list total=0，
      故实调 /crystal_goods/info 返回 { code:0, msg:"商品不存在", data:null }，
      原站三页均 1.5s 后跳回首页 —— 复刻保持一致。
  -->
  <div class="sd-page" :class="`sd-page--${type}`">
    <template v-if="product.id">
      <div class="sd-nav">
        <div class="sd-nav__back" @click="goBack">
          <div class="sd-nav__back-img"></div>
        </div>
        <span class="sd-nav__title"><span>{{ pageTitle }}</span></span>
      </div>

      <!-- 主图 + 名称 + 价格 -->
      <div class="sd-card">
        <img class="sd-card__img" :src="product.main_image" alt="" />
        <div class="sd-card__tags">
          <span class="sd-card__tag sd-card__tag--main">嗒嗒精选</span>
          <span class="sd-card__tag sd-card__tag--desc">数字艺术</span>
        </div>
        <span class="sd-card__name">{{ product.name }}</span>
        <span class="sd-card__slogan">一枚关于想象、链接与未来的数字艺术藏品</span>
        <div class="sd-card__price-row">
          <span class="sd-card__price-label">首发价格</span>
          <span class="sd-card__price">¥ {{ product.price }}</span>
        </div>
      </div>

      <!-- 发行 / 流通 -->
      <div class="sd-card">
        <div class="sd-card__two">
          <div class="sd-card__col">
            <span class="sd-card__desc">发行 / SUPPLY</span>
            <span class="sd-card__title">{{ product.total_num }}</span>
          </div>
          <div class="sd-card__col">
            <span class="sd-card__desc">流通 / CIRCULATION</span>
            <span class="sd-card__title">{{ product.flux || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 合约地址 / 发行方 -->
      <div class="sd-card">
        <div class="sd-card__two">
          <div class="sd-card__col">
            <span class="sd-card__desc">合约地址 / CONTRACT</span>
            <span class="sd-card__title">{{ info.user_hash }}</span>
          </div>
          <div class="sd-card__col">
            <span class="sd-card__desc">发行方 / STUDIO</span>
            <span class="sd-card__title">{{ product.publisher && product.publisher.name }}</span>
          </div>
        </div>
      </div>

      <!-- 藏品故事 -->
      <div class="sd-card sd-card--introduce">
        <span class="sd-card__story-title">藏品故事 / STORY</span>
        <span class="sd-card__story-text">{{ product.introduce_image }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCrystalGoodsInfo } from '@/api'

const props = defineProps({
  type: { type: String, required: true } // collection | box | goods
})

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const info = ref({ product: {} })

const pageTitle = computed(() => {
  if (props.type === 'collection') return '藏品详情'
  if (props.type === 'box') return '盲盒详情'
  return '商品详情'
})

const product = computed(() => info.value.product || {})

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

function backPage() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

async function getDetails() {
  loading.value = true
  const q = route.query || {}
  const params = { goods_id: q.id }
  if (props.type === 'collection') {
    params.id = q.collection_id
    params.batch_id = q.batch_id
  } else if (props.type === 'box') {
    params.id = q.blind_box_id
  }
  try {
    const res = await getCrystalGoodsInfo(params)
    if (!res || res.code !== 1 || !res.data) throw new Error('商品不存在')
    const data = res.data
    info.value = {
      ...data,
      product: {
        ...data,
        goods_type: props.type === 'collection' ? 2 : props.type === 'box' ? 1 : 3,
        crystal: {
          crystal_type: data.crystal_type,
          crystal_price: data.crystal_number,
          stock: data.stock
        },
        listimg: data.list_image,
        name: data.goods_name,
        main_image: data.main_image
      }
    }
  } catch (e) {
    // 原站：接口失败后 1.5s 回退上一页
    setTimeout(backPage, 1500)
  } finally {
    loading.value = false
  }
}

onMounted(getDetails)
</script>

<style scoped>
.sd-page {
  min-height: 100vh;
  background: #f7f7f8;
  padding-bottom: 40px;
}
.sd-nav {
  position: relative;
  height: 44px;
}
.sd-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.sd-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.sd-nav__title {
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
.sd-nav__title > span {
  display: inline-block;
  font-size: 15px;
  line-height: 16px;
  font-weight: 700;
  color: #333;
}
.sd-card {
  margin: 0 16px 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e7e7ea;
  border-radius: 8px;
}
.sd-card__img {
  width: 100%;
  display: block;
  border-radius: 8px;
}
.sd-card__tags {
  margin-top: 12px;
  display: flex;
  align-items: center;
}
.sd-card__tag {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 10px;
  font-weight: 700;
  line-height: 14px;
}
.sd-card__tag--main {
  background: #101114;
  color: #fff;
}
.sd-card__tag--desc {
  margin-left: 15px;
  background: #f0f0f2;
  color: #111;
}
.sd-card__name {
  display: block;
  margin-top: 12px;
  font-size: 15px;
  line-height: 21px;
  font-weight: 700;
  color: #111216;
}
.sd-card__slogan {
  display: block;
  margin-top: 7px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: #73737b;
}
.sd-card__price-row {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sd-card__price-label {
  font-size: 10px;
  line-height: 14px;
  color: #85868d;
}
.sd-card__price {
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #111216;
}
.sd-card__two {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sd-card__col {
  width: 50%;
}
.sd-card__desc {
  display: block;
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: #85868d;
}
.sd-card__title {
  display: block;
  margin-top: 7px;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: #111216;
}
.sd-card--introduce {
  border: none;
}
.sd-card__story-title {
  display: block;
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #111216;
}
.sd-card__story-text {
  display: block;
  margin-top: 12px;
  font-size: 12px;
  line-height: 18px;
  color: #999;
}
</style>
