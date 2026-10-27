<template>
  <!--
    原站 pages/leaderboard/leaderboard（排行榜）
    金标准实测 2026-10-26 登录后抓取，390x844
    结构：整页 390x844
            背景 rgb(243,243,243) + /static/image/leaderboard/qd-bg.webp (size 100%, no-repeat)
            返回 back-btn-gray.png 19x19 @(13,12.5)
            顶部留白 228px（u-gap 10px + 占位 228px）
      → 榜单区 354x358 @(18,238)
            「榜单每10分钟刷新」装饰条 149x37 @(120.5,264)
               bg /static/image/leaderboard/sx-time-bg.webp (size 100%)
               文字 13px bold #fff 居中
            表头行 354x18 @(18,301)
              「排名」12px bold rgb(70,66,76) @(36,301,55,18) 居中
              「用户」12px bold @(91,301,201.8,18) 居中
              「魅力值」12px bold @(292.8,301,61.2,18) 右对齐
              问号图标 12x12 @(342,303) /static/image/leaderboard/bangzhu.webp
            空态区 354x257 @(18,339)
              插画 121x122 @(134.5,339) /static/empty/search-empty.png
      → 底部蓝条 390x83 @(0,596) bg rgb(75,148,255)
            头像 39x39 @(29,618) 圆形（默认头像 base64 落盘为 assets/img/m5/leaderboard_0.jpg）
            昵称「--」15px bold #fff @(75,617,10,17)
            「0」13px bold #fff @(75,642,10,16)
            「暂未上榜」13px bold #fff @(309,628,52,19)
    端点：POST /user/ranking { types:1 } → { data:[], my:"", activityRule:"" }
  -->
  <div class="lb-page">
    <div class="lb-back" @click="goBack"></div>

    <div class="lb-list">
      <div class="lb-banner">
        <span class="lb-banner__text">榜单每10分钟刷新</span>
      </div>

      <div class="lb-head">
        <span class="lb-head__col lb-head__col--rank">排名</span>
        <span class="lb-head__col lb-head__col--user">用户</span>
        <span class="lb-head__col lb-head__col--value">魅力值</span>
        <div class="lb-head__q"></div>
      </div>

      <div class="lb-body">
        <div class="lb-empty__img"></div>
      </div>
    </div>

    <div class="lb-bottom">
      <div class="lb-my">
        <div class="lb-my__avatar"></div>
        <div class="lb-my__meta">
          <div class="lb-my__name">{{ my.nickname }}</div>
          <div class="lb-my__num">{{ my.value }}</div>
        </div>
      </div>
      <div class="lb-my__state">{{ my.state }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserRanking } from '@/api'

const router = useRouter()
const my = reactive({ nickname: '--', value: '0', state: '暂未上榜' })

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/index/index')
}

onMounted(async () => {
  try {
    const res = await getUserRanking({ types: 1 })
    const d = res.data || {}
    if (d.my) {
      my.nickname = d.my.nickname || '--'
      my.value = d.my.value === undefined ? '0' : String(d.my.value)
      my.state = d.my.state || '暂未上榜'
    }
  } catch (e) {
    // 原站接口返回空数据，保持默认「-- / 0 / 暂未上榜」
  }
})
</script>

<style scoped>
.lb-page {
  position: relative;
  min-height: 100vh;
  background: rgb(243, 243, 243);
  background-image: url('/static/image/leaderboard/qd-bg.webp');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: 0% 0%;
  overflow: hidden;
}
.lb-back {
  position: absolute;
  left: 13px;
  top: 12.5px;
  width: 19px;
  height: 19px;
  background: url('/static/icon/back-btn-gray.png') no-repeat 0 0 / 100% 100%;
}
/* 榜单区 354x358 @(18,238) */
.lb-list {
  position: absolute;
  left: 18px;
  top: 238px;
  width: 354px;
  height: 358px;
}
/* 装饰条 149x37 @(120.5,264)
   原站 .pdsx-num-v 为 flex-center，文字垂直居中（实测文字行 y≈275~289） */
.lb-banner {
  position: absolute;
  left: 102.5px;
  top: 26px;
  width: 149px;
  height: 37px;
  background: url('/static/image/leaderboard/sx-time-bg.webp') no-repeat 0 0 / 100% auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-banner__text {
  display: block;
  font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
  white-space: nowrap;
}
/* 表头行 354x18 @(18,301) */
.lb-head {
  position: absolute;
  left: 18px;
  top: 63px;
  width: 318px;
  height: 18px;
  display: flex;
  align-items: center;
}
.lb-head__col {
  font-size: 12px;
  font-weight: 700;
  color: rgb(70, 66, 76);
}
.lb-head__col--rank {
  width: 55px;
  text-align: center;
}
.lb-head__col--user {
  width: 201.8px;
  text-align: center;
}
.lb-head__col--value {
  width: 61.2px;
  text-align: right;
  /* 原站「魅力值」文字右边缘在 339，其后 15px 留给问号图标 */
  padding-right: 15px;
  box-sizing: border-box;
}
.lb-head__q {
  position: absolute;
  left: 306px;
  top: 2px;
  width: 12px;
  height: 12px;
  background: url('/static/image/leaderboard/bangzhu.webp') no-repeat 0 0 / 100% 100%;
}
/* 空态区 354x257 @(18,339) */
.lb-body {
  position: absolute;
  left: 0;
  top: 101px;
  width: 354px;
  height: 257px;
}
.lb-empty__img {
  position: absolute;
  left: 116.5px;
  top: 0;
  width: 121px;
  height: 122px;
  background: url('/static/empty/search-empty.png') no-repeat 0 0 / 100% 100%;
}
/* 底部蓝条 390x83 @(0,596) */
.lb-bottom {
  position: absolute;
  left: 0;
  top: 596px;
  width: 390px;
  height: 83px;
  background: rgb(75, 148, 255);
  display: flex;
  align-items: center;
}
.lb-my {
  position: absolute;
  left: 29px;
  top: 21px;
  width: 56px;
  height: 41px;
  display: flex;
  align-items: center;
}
.lb-my__avatar {
  flex: none;
  width: 39px;
  height: 39px;
  border-radius: 50%;
  background: url('/assets/img/m5/leaderboard_0.jpg') no-repeat center / 39px 39px;
}
/* 原站 meta 容器 10x41 @(75,617)：昵称顶对齐，数值下移 25px */
.lb-my__meta {
  position: relative;
  flex: none;
  margin-left: 7px;
  width: 10px;
  height: 41px;
}
.lb-my__name {
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 17px;
  font-size: 15px;
  font-weight: 700;
  line-height: 17px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
}
.lb-my__num {
  position: absolute;
  left: 0;
  top: 25px;
  width: 10px;
  height: 16px;
  font-size: 13px;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
}
.lb-my__state {
  position: absolute;
  left: 309px;
  top: 32px;
  width: 52px;
  height: 19px;
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  color: #fff;
  text-align: left;
  white-space: nowrap;
}
</style>
