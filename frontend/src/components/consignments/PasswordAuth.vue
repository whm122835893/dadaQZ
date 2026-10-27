<template>
  <!--
    原站 password-authentification
      script 模块 8565（由 2ef9 render 引用）
        props: show(Boolean), price(String|Number), payType(Array), type('price'|'exchange')
        data: pwd
      render 模块 2ef9（scope ccfbc0c8）
        u-popup(show, mode center, round 10) @close → $emit('change', false)
          .pwd_pop_con.pa-14.font-color-black
            .flex.flex-js-sb.flex-ai-center
              w-icon(name="close2", size 28) @click → $emit('change', false)
              .set.font-color-999.font-w-bold @click → /pages/my/actionPwd/getCode ← "设置操作密码"
            .title.font-w-500 ← "请输入操作密码"
            [type=="price"] .price.font-size-14 ← price（::before 自动加 "￥"）
            [type=="exchange"] .flex-center.font-size-24.mt-12.font-w-500.font-color-black
            .ipt-pwd
              u-code-input(focus, dot, size 42) @finish → $emit('finish', pwd)
  -->
  <div v-if="show" class="pwd-mask" @click.self="$emit('change', false)">
    <div class="pwd_pop_con pa-14">
      <div class="flex flex-js-sb flex-ai-center">
        <img class="pwd-close" src="/assets/img/consignments/close2.png" alt="" @click="$emit('change', false)" />
        <span class="set font-color-999 font-w-bold" @click="goSetPwd">设置操作密码</span>
      </div>
      <div class="title font-w-500">请输入操作密码</div>
      <div v-if="type === 'price'" class="price font-size-14">{{ price }}</div>

      <div class="ipt-pwd">
        <div class="code-input">
          <input
            v-for="i in 6"
            :key="i"
            class="code-item"
            type="text"
            maxlength="1"
            :value="pwd[i - 1] ? '●' : ''"
            readonly
          />
        </div>
        <input
          ref="realInput"
          class="real-input"
          type="password"
          inputmode="numeric"
          maxlength="6"
          :value="pwd"
          @input="onInput"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 操作密码输入弹窗（对应原站 password-authentification）
 *   - 6 位密码，点满 6 位自动 $emit('finish', pwd)
 *   - 顶部「设置操作密码」跳 /pages/my/actionPwd/getCode
 */
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  show: { type: Boolean, default: false },
  price: { type: [String, Number], default: '' },
  payType: { type: [Array, String], default: () => [] },
  type: { type: String, default: 'price' }
})
const emit = defineEmits(['change', 'finish'])

const router = useRouter()
const pwd = ref('')
const realInput = ref(null)

watch(
  () => props.show,
  (v) => {
    if (v) {
      pwd.value = ''
      nextTick(() => realInput.value && realInput.value.focus())
    }
  }
)

function onInput(e) {
  const val = (e.target.value || '').replace(/\D/g, '').slice(0, 6)
  pwd.value = val
  e.target.value = val
  if (val.length === 6) emit('finish', val)
}

function goSetPwd() {
  router.push('/pages/my/actionPwd/getCode')
}
</script>

<style scoped>
/* 原站 scope ccfbc0c8（.pwd_pop_con） */
/* 布局工具类（原站全局原子类，此处按需补齐） */
.flex {
  display: flex;
}
.flex-js-sb {
  justify-content: space-between;
}
.flex-ai-center {
  align-items: center;
}
.font-size-14 {
  font-size: 14.56px;
}
.font-w-500 {
  font-weight: 500;
}
.font-color-999 {
  color: #999;
}
.pa-14 {
  padding: 14.56px;
}
.pwd-mask {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pwd_pop_con {
  width: 312px;
  background: #fff;
  border-radius: 10.4px;
  padding: 12.48px;
  box-sizing: border-box;
}
.pwd_pop_con > .title {
  width: 100%;
  text-align: center;
  margin-top: 16.64px;
  font-size: 16.64px;
  font-weight: 500;
  color: #333;
}
.pwd_pop_con > .price {
  width: 100%;
  text-align: center;
  margin-top: 12.48px;
  font-size: 24.96px;
  font-weight: 500;
  color: #ff416c;
}
.pwd_pop_con > .price::before {
  content: '￥';
  font-size: 12.48px;
}
.pwd-close {
  width: 29.12px;
  height: 29.12px;
}
.set {
  font-size: 12.48px;
  color: #999;
}
.pwd_pop_con > .ipt-pwd {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12.48px;
}
.code-input {
  display: flex;
  align-items: center;
  justify-content: center;
}
.code-item {
  width: 40px;
  height: 42px;
  margin: 0 2.08px;
  background-color: #f2f2f2;
  border-radius: 8.32px;
  text-align: center;
  font-size: 20.8px;
  color: #111216;
  box-sizing: border-box;
}
.real-input {
  position: absolute;
  opacity: 0;
  width: 200px;
  height: 42px;
}
</style>
