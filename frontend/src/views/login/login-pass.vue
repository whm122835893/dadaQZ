<template>
  <div class="lp">
    <div class="lp__bar">
      <span class="lp__back" @click="$router.back()">‹</span>
      <span class="lp__title">密码登录</span>
    </div>
    <form class="lp__form" @submit.prevent="submit">
      <input v-model="form.account" class="lp__input" type="tel" placeholder="请输入手机号" placeholder-class="lp__ph" />
      <div class="lp__pwd">
        <input v-model="form.password" class="lp__input" :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" placeholder-class="lp__ph" />
        <span class="lp__eye" @click="showPwd = !showPwd">{{ showPwd ? '隐藏' : '显示' }}</span>
      </div>
      <label class="lp__agree" @click="checked = !checked">
        <span class="lp__checkbox" :class="{ 'is-on': checked }">{{ checked ? '✓' : '' }}</span>
        <span>我已阅读并同意</span>
        <a class="lp__link" @click.stop="toast('《用户协议》《隐私政策》待实现')">《用户协议》《隐私政策》</a>
      </label>
      <p v-if="err" class="lp__err">{{ err }}</p>
      <button class="lp__submit" :disabled="loading">{{ loading ? '登录中…' : '登录' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ account: '', password: '' })
const checked = ref(false)
const showPwd = ref(false)
const loading = ref(false)
const err = ref('')

function toast(t) { window.alert(t) }

async function submit() {
  err.value = ''
  if (!form.account) { err.value = '请输入手机号'; return }
  if (!form.password) { err.value = '请输入登录密码'; return }
  if (!checked.value) { err.value = '请阅读并同意用户协议'; return }
  loading.value = true
  try {
    const res = await login({ account: form.account, password: form.password })
    const ui = res.data.userinfo || res.data
    userStore.setLogin(ui.token, ui)
    window.alert('登录成功')
    router.replace('/pages/index/index')
  } catch (e) {
    err.value = e?.msg || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.lp { min-height: 100%; background: #030303; }
.lp__bar {
  display: flex; align-items: center; height: 44px; padding: 0 12px;
  background: #030303;
}
.lp__back { font-size: 22px; color: #ddd; cursor: pointer; }
.lp__title { flex: 1; text-align: center; font-size: 16px; color: #fff; }
.lp__form { padding: 24px 20px; }
.lp__input {
  width: 100%; height: 50px; padding: 0 14px; margin-bottom: 14px;
  font-size: 15px; color: #fff; background: #141414;
  border: 1px solid #CFCFCF; border-radius: 10px; outline: none;
}
.lp__ph { color: #818181; font-size: 14px; }
.lp__pwd { position: relative; }
.lp__eye {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  font-size: 12px; color: #999; cursor: pointer;
}
.lp__agree {
  display: flex; align-items: center; flex-wrap: wrap; gap: 4px;
  margin: 6px 0 18px; font-size: 12px; color: #999; cursor: pointer;
}
.lp__checkbox {
  width: 15px; height: 15px; display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; color: #030303; border: 1px solid #666; border-radius: 50%;
}
.lp__checkbox.is-on { background: #c8a45c; border-color: #c8a45c; }
.lp__link { color: #c8a45c; }
.lp__err { margin: 0 0 12px; font-size: 12px; color: #ff6b6b; }
.lp__submit {
  width: 100%; height: 46px; font-size: 16px; color: #1a1508;
  background: linear-gradient(90deg, #e6cf9a, #c8a45c);
  border: 0; border-radius: 23px; cursor: pointer;
}
.lp__submit:disabled { opacity: .6; }
</style>
