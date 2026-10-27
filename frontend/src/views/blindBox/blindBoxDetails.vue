<template>
  <!--
    原站 pages/blindBox/blindBoxDetails（金标准实测 2026-10-25 登录后抓取，390x844，浅色 #f7f7f8）
    结构：container page-container page-bg
      → nav 44px 透明底：返回（back-btn.png 24x24 @(13,10)），标题为空（原站 span 为空）
      → product-card：
          media-card 360x214 @(15,67) bg #fff br26px
            main-button 56x31 @(30,82) bg #101014 br26px「嗒嗒精选」10px bold #fff
            desc-button 56x31 @(101,82) bg #f0f0f2 br26px「数字艺术」10px bold #111111
            描述 12px #73737b @(30,123,330,18)「一枚关于想象、链接与未来的数字艺术藏品」
            首发价格 10px #85868d @(30,169,40,15)
            ¥ 25px bold #111214 @(30,193,40,28)
            发行 / SUPPLY 10px #85868d @(30,236,165,15)；流通 / CIRCULATION @(195,228,165,15)
            -- 14px bold #111216 @(195,250,165,16)
      → 藏品故事卡 358x54 @(16,320) bg #fff br8px
          「藏品故事 / STORY」12px bold #111214 @(28,335,98,14)
    数据：POST /user_collection/user_collection/detail/ids/{id}
      实调（缺 query id）：{ code:0, msg:"收藏不存在或者已经被删除了", data:null }
  -->
  <div class="bd-page">
    <div class="bd-nav">
      <div class="bd-nav__back" @click="goBack">
        <div class="bd-nav__back-img"></div>
      </div>
    </div>

    <div class="bd-card">
      <div class="bd-media">
        <div class="bd-media__row">
          <span class="bd-media__main">嗒嗒精选</span>
          <span class="bd-media__desc">数字艺术</span>
        </div>
        <div class="bd-media__intro">一枚关于想象、链接与未来的数字艺术藏品</div>
        <div class="bd-media__price-row">
          <div class="bd-media__price-col">
            <div class="bd-media__label">首发价格</div>
            <div class="bd-media__price">¥</div>
          </div>
        </div>
        <div class="bd-media__public">
          <div class="bd-media__public-col">
            <div class="bd-media__label">发行 / SUPPLY</div>
            <div class="bd-media__value">{{ supply }}</div>
          </div>
          <div class="bd-media__public-col">
            <div class="bd-media__label">流通 / CIRCULATION</div>
            <div class="bd-media__value">{{ circulation }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bd-story">
      <div class="bd-story__title">藏品故事 / STORY</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBlindBoxDetail } from '@/api'

const route = useRoute()
const router = useRouter()
const supply = ref('--')
const circulation = ref('--')

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/blindBox/index')
}

onMounted(async () => {
  const id = route.query.id || ''
  try {
    const res = await getBlindBoxDetail(id)
    const d = res && res.data
    if (d) {
      const p = d.product || {}
      supply.value = p.total_num || '--'
      circulation.value = p.circulation_num || '--'
    }
  } catch (e) {
    /* 原站无数据时保持 -- */
  }
})
</script>

<style scoped>
.bd-page {
  min-height: 100vh;
  background: #f7f7f8;
}
.bd-nav {
  position: relative;
  height: 44px;
}
.bd-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.bd-nav__back-img {
  width: 24px;
  height: 24px;
  background: url('/assets/img/p0/icon/back-btn.png') no-repeat;
  background-size: 100% 100%;
}
.bd-card {
  margin-top: 23px;
  padding: 0 15px;
}
.bd-media {
  height: 214px;
  background: #fff;
  border-radius: 26px;
  padding: 15px;
}
.bd-media__row {
  display: flex;
  align-items: center;
}
.bd-media__main {
  width: 56px;
  height: 31px;
  border-radius: 26px;
  background: #101114;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 14px;
  font-weight: 700;
  color: #fff;
}
.bd-media__desc {
  margin-left: 15px;
  width: 56px;
  height: 31px;
  border-radius: 26px;
  background: #f0f0f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 14px;
  font-weight: 700;
  color: #111111;
}
.bd-media__name {
  margin-top: 10px;
  font-size: 15px;
  line-height: 20px;
  font-weight: 700;
  color: #111214;
}
.bd-media__intro {
  margin-top: 10px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: #73737b;
}
.bd-media__price-row {
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bd-media__label {
  font-size: 10px;
  line-height: 15px;
  font-weight: 400;
  color: #85868d;
}
.bd-media__price {
  margin-top: 9px;
  font-size: 25px;
  line-height: 28px;
  font-weight: 700;
  color: #111114;
}
.bd-media__public {
  margin-top: 7px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.bd-media__public-col {
  width: 50%;
}
.bd-media__value {
  margin-top: 7px;
  font-size: 14px;
  line-height: 16px;
  font-weight: 700;
  color: #111216;
}
.bd-story {
  margin: 39px 16px 0;
  height: 54px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}
.bd-story__title {
  display: inline-block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
  color: #111114;
}
</style>
