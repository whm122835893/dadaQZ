<template>
  <!--
    原站页面 render `6b23`（scope `ef6dd94a`）
      w-container.mc-page
        collectionSearch @changetab @changeSearch @closeSearch
        [types==6] v-uni-view.plr-16.mt-16
            myConsignmentsItem(item, goods_type=2) @refresh
        [types!=6] v-uni-view.flex.flex-js-sb.flex-w.plr-16.mt-16
            collectionItem(item, types) @click → openPop
        popDetails(id=collection_id, types=param.types) v-model=showPop
        w-loading(type=loadingType, emptyType="myCollection", emptyTop="100")
  -->
  <div class="mc-page">
    <CollectionSearch
      :types="param.types"
      @changetab="changetab"
      @change-search="changeSearch"
      @close-search="closeSearch"
    />

    <!-- types == 6 寄售：竖向列表 -->
    <div v-if="param.types == 6" class="plr-16 mt-16">
      <MyConsignmentsItem
        v-for="(item, i) in list"
        :key="i"
        :item="item"
        :goods_type="2"
        @refresh="refresh"
      />
    </div>

    <!-- 其他 tab：藏品网格 -->
    <div v-else class="flex flex-js-sb flex-w plr-16 mt-16">
      <CollectionItem
        v-for="(item, i) in list"
        :key="i"
        :item="item"
        :types="param.types"
        @click="openPop(item)"
      />
    </div>

    <PopDetails
      :id="collection_id"
      :types="param.types"
      :show-pop="showPop"
      @change="showPop = $event"
    />

    <!-- 原站 w-loading：emptyType="myCollection" emptyTop="100" -->
    <div v-if="loadingType === 'loading'" class="mc-loading">
      <div class="mc-loading-spinner" />
      <div class="mc-loading-text">加载中</div>
    </div>
    <div v-else-if="loadingType === 'empty'" class="mc-empty">
      <img class="mc-empty-img" src="/assets/img/myCollection/empty.png" alt="" />
    </div>
  </div>
</template>

<script setup>
/**
 * 我的藏品页 —— 原站 `pages/myCollection/myCollection`
 *
 * 反编译：chunk `pages-myCollection-myCollection.ea8eb40f.js`（742101 字节，158 模块）
 *   页面 script `5f37` / render `6b23` / scope `ef6dd94a`
 *   子组件：
 *     collectionSearch    48d0 → e842(script) / a6af(render) / scope 11f074a4
 *     collectionItem      0a4a → 39c4(script) / cc0f(render) / scope c1e22e5c
 *     popDetails          ba48 → 121a(script) / cc38(render) / scope 8d59f590
 *     myConsignmentsItem  fc2c → c224(script) / bf12c(render) / scope f963d85e
 *
 * 原站 script `5f37` 逐字逻辑：
 *   data: { loadingType:'none', showPop:false, isNext:true, list:[],
 *           param:{ types:2, page:1 }, collection_id:'' }
 *   onLoad()      → this.refresh()
 *   refresh()     → loadingType='none'; showPop=false; isNext=true; list=[];
 *                   param.page=1; getList()
 *   changetab(a)  → isNext=true; list=[]; param.types=a.types; param.page=1;
 *                   param.collection_id=''; getList()
 *   getList()     → if (param.types == 6) return getConsignment()
 *                   isNext && ( loadingType='loading',
 *                     antMycollection(param).then(res => {
 *                       stopPullDownRefresh();
 *                       list = list.concat(res.data.data);
 *                       param.page < res.data.last_page ? param.page++ :
 *                          ( isNext=false, loadingType='none' );
 *                       !res.data.data.length && (loadingType='empty');
 *                     }).catch(() => loadingType='none') )
 *   getConsignment() → isNext && ( myConsignment({status:'',goods_type:2,page:param.page})
 *                     .then(res => { list=concat; page<last_page ? page++ :
 *                        (isNext=false, loadingType='nomore');
 *                       !data.length && (loadingType='empty') }) )
 *   changeSearch(a)→ isNext=true; list=[]; param.collection_id=a; param.page=1; getList()
 *   closeSearch() → param.collection_id=''; refresh()
 *   openPop(a)    → if (param.types != 3 && param.types != 4) {
 *                      collection_id = a.collection.id; showPop = true }
 *   onPullDownRefresh() → refresh()
 *   onReachBottom()    → getList()
 *
 * 注：原站 getConsignment 里用的是 this.page++（笔误，this.page 未定义），
 *     本项目按 last_page 正确递增 page，不改变业务表现。
 *
 * ★ 原站实调（2026-10-21）该账号 antMycollection / myConsignment 均返回 total:0，
 *   故本页数据全部走 mock（见 api/mock.js）。
 */
import { onMounted, ref } from 'vue'
import { getMyCollection, getMyConsignment } from '@/api'
import CollectionSearch from '@/components/myCollection/CollectionSearch.vue'
import CollectionItem from '@/components/myCollection/CollectionItem.vue'
import MyConsignmentsItem from '@/components/myCollection/MyConsignmentsItem.vue'
import PopDetails from '@/components/myCollection/PopDetails.vue'

const loadingType = ref('none')
const showPop = ref(false)
const isNext = ref(true)
const list = ref([])
const param = ref({ types: 2, page: 1 })
const collection_id = ref('')

function refresh() {
  loadingType.value = 'none'
  showPop.value = false
  isNext.value = true
  list.value = []
  param.value.page = 1
  getList()
}

function changetab(a) {
  isNext.value = true
  list.value = []
  param.value.types = a.types
  param.value.page = 1
  param.value.collection_id = ''
  getList()
}

function getList() {
  if (param.value.types == 6) return getConsignment()
  if (!isNext.value) return
  loadingType.value = 'loading'
  getMyCollection({ ...param.value })
    .then((res) => {
      const d = res.data || {}
      const rows = d.data || []
      list.value = list.value.concat(rows)
      if (param.value.page < (d.last_page || 1)) {
        param.value.page++
      } else {
        isNext.value = false
        loadingType.value = 'none'
      }
      if (!rows.length) loadingType.value = 'empty'
    })
    .catch(() => {
      loadingType.value = 'none'
    })
}

function getConsignment() {
  if (!isNext.value) return
  loadingType.value = 'loading'
  getMyConsignment({ status: '', goods_type: 2, page: param.value.page })
    .then((res) => {
      const d = res.data || {}
      const rows = d.data || []
      list.value = list.value.concat(rows)
      if (param.value.page < (d.last_page || 1)) {
        param.value.page++
      } else {
        isNext.value = false
        loadingType.value = 'none'
      }
      if (!rows.length) loadingType.value = 'empty'
    })
    .catch(() => {
      loadingType.value = 'none'
    })
}

function changeSearch(id) {
  isNext.value = true
  list.value = []
  param.value.collection_id = id
  param.value.page = 1
  getList()
}

function closeSearch() {
  param.value.collection_id = ''
  refresh()
}

/** 原站 openPop：types 3（已售）/ 4 不弹详情 */
function openPop(item) {
  if (param.value.types == 3 || param.value.types == 4) return
  collection_id.value = item.collection.id
  showPop.value = true
}

onMounted(refresh)
</script>

<style scoped>
/* 原站 scope ef6dd94a */
/* uni-page-body：radial-gradient(468px 364px at 50% -140px, rgba(130,96,59,.38), rgba(3,3,3,0) 70%), #101115 */
.mc-page {
  min-height: 100vh;
  color: #f8f8f8;
  background: radial-gradient(468px 364px at 50% -140px, rgba(130, 96, 59, 0.38), rgba(3, 3, 3, 0) 70%),
    #101115;
  background-attachment: fixed;
}
.plr-16 {
  padding-left: 16.64px;
  padding-right: 16.64px;
}
.mt-16 {
  margin-top: 16.64px;
}
.flex {
  display: flex;
}
.flex-js-sb {
  justify-content: space-between;
}
.flex-w {
  flex-wrap: wrap;
}

/* w-loading 加载态 */
.mc-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200px;
}
.mc-loading-spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid rgba(244, 220, 170, 0.25);
  border-top-color: #f4dcaa;
  animation: mc-spin 0.8s linear infinite;
}
@keyframes mc-spin {
  to {
    transform: rotate(360deg);
  }
}
.mc-loading-text {
  margin-top: 12.48px;
  font-size: 12.48px;
  color: #8d8474;
}

/* w-loading 空态：emptyType="myCollection" emptyTop="100" */
.mc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 200px;
  padding-bottom: 135.2px;
}
.mc-empty-img {
  width: 117px;
  height: 117px;
}
</style>
