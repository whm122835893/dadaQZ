<template>
  <div class="ph">
    <div class="ph__bar">
      <span class="ph__back" @click="$router.back()">‹</span>
      <span class="ph__title">{{ title }}</span>
    </div>
    <div class="ph__body">
      <p class="ph__text">「{{ title }}」页面待实现</p>
      <p class="ph__hint">按约定顺序，待上一页验收后开始复刻</p>
    </div>
    <TabBar :current="routePath" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()
const title = computed(() => route.meta.title || '页面')
const routePath = computed(() => route.path)
</script>

<style scoped>
.ph { min-height: 100%; padding-bottom: 70px; background: #0a0a0a; }
.ph__bar {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  background: #111;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.ph__back { font-size: 22px; color: #ddd; cursor: pointer; }
.ph__title { flex: 1; text-align: center; font-size: 16px; color: #fff; }
.ph__body { padding: 80px 20px; text-align: center; }
.ph__text { margin: 0; font-size: 15px; color: #ddd; }
.ph__hint { margin: 8px 0 0; font-size: 12px; color: #666; }
</style>
