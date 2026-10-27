<template>
  <!--
    原站 pages/my/address/edit（金标准实测 2026-10-25，390x844，黑金 #101115）
    结构：nav(透明, back-white 24x24@(13,10), 标题15px bold #fff)
      → 金边卡 (16,60,358,237) bg#181713 边1px #655032 br12
          四行 h55（rel y8 起）：label 14px #999 @x33 列宽93 + 输入 (126,y+15,231,24)
          input 14px/26px #fff，placeholder #8e8e93
      → 默认地址卡 (16,313,358,52)：文本14px #999 @x33 + 开关 42x22@(315,328)
          OFF：track #3a3a40 knob 20x20 白 @left1；ON：track #1b64de knob right21（推断）
      → 保存按钮 (16,773,358,47) bg#211c14 br23 文本14px bold #f4dcaa（fixed 底部24）
    交互：所在地区→底部三列地区选择器（region 数据为 mock，待接原站数据源）；
          保存→/user/addAddress（推断端点）
  -->
  <div class="ae-page">
    <div class="ae-nav">
      <img class="ae-nav__back" src="/assets/img/my/back-btn-white.png" alt="" @click="goBack" />
      <span class="ae-nav__title">添加收货地址</span>
    </div>

    <div class="ae-form">
      <div v-for="(f, i) in fields" :key="i" class="ae-row">
        <span class="ae-row__label">{{ f.label }}</span>
        <input
          class="ae-row__input"
          :type="f.type"
          :maxlength="f.maxlength"
          :placeholder="f.placeholder"
          :readonly="f.readonly"
          v-model="form[f.key]"
          @click="f.pick && openRegion()"
        />
      </div>
    </div>

    <div class="ae-default">
      <span class="ae-default__text">设置默认收货地址</span>
      <div class="ae-switch" :class="{ 'ae-switch--on': form.is_default }" @click="form.is_default = form.is_default ? 0 : 1">
        <i class="ae-switch__knob" />
      </div>
    </div>

    <div class="ae-btn" @click="save">保存</div>

    <!-- 地区选择器（u-picker 形态，mock 数据） -->
    <div v-if="showRegion" class="ae-mask" @click.self="showRegion = false">
      <div class="ae-picker">
        <div class="ae-picker__head">
          <span class="ae-picker__cancel" @click="showRegion = false">取消</span>
          <span class="ae-picker__title">所在地区</span>
          <span class="ae-picker__ok" @click="confirmRegion">确定</span>
        </div>
        <div class="ae-picker__cols">
          <div class="ae-picker__col">
            <div
              v-for="p in regions"
              :key="p.name"
              class="ae-picker__item"
              :class="{ 'ae-picker__item--on': p === regionP }"
              @click="regionP = p"
            >
              {{ p.name }}
            </div>
          </div>
          <div class="ae-picker__col">
            <div
              v-for="c in regionP.children"
              :key="c.name"
              class="ae-picker__item"
              :class="{ 'ae-picker__item--on': c === regionC }"
              @click="regionC = c"
            >
              {{ c.name }}
            </div>
          </div>
          <div class="ae-picker__col">
            <div
              v-for="d in regionC.children"
              :key="d"
              class="ae-picker__item"
              :class="{ 'ae-picker__item--on': d === regionD }"
              @click="regionD = d"
            >
              {{ d }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { addAddress } from '@/api'
import { toast } from '@/utils/toast'

const router = useRouter()

const fields = [
  { key: 'name', label: '收货人', placeholder: '请输入姓名', type: 'text', maxlength: 20 },
  { key: 'mobile', label: '手机号码', placeholder: '请输入手机号', type: 'text', maxlength: 11 },
  { key: 'region', label: '所在地区', placeholder: '请选择市区', type: 'text', maxlength: 30, readonly: true, pick: true },
  { key: 'address', label: '详细地址', placeholder: '街道 小区 门牌号等', type: 'text', maxlength: 60 }
]

const form = reactive({ name: '', mobile: '', region: '', address: '', is_default: 0 })

/** 地区 mock 数据（原站 region 数据源待接入，先以内置精简数据支撑交互） */
const regions = ref([
  { name: '北京市', children: [{ name: '北京市', children: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区'] }] },
  { name: '上海市', children: [{ name: '上海市', children: ['黄浦区', '徐汇区', '静安区', '浦东新区'] }] },
  { name: '广东省', children: [
    { name: '广州市', children: ['天河区', '越秀区', '海珠区', '白云区'] },
    { name: '深圳市', children: ['南山区', '福田区', '罗湖区', '宝安区'] }
  ] },
  { name: '浙江省', children: [{ name: '杭州市', children: ['西湖区', '上城区', '拱墅区', '滨江区'] }] },
  { name: '四川省', children: [{ name: '成都市', children: ['锦江区', '青羊区', '武侯区', '高新区'] }] }
])
const regionP = ref(regions.value[0])
const regionC = ref(regions.value[0].children[0])
const regionD = ref(regions.value[0].children[0].children[0])
const showRegion = ref(false)

function openRegion() {
  showRegion.value = true
}

function confirmRegion() {
  form.region = `${regionP.value.name} ${regionC.value.name} ${regionD.value}`
  showRegion.value = false
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/pages/my/my')
}

async function save() {
  if (!form.name.trim()) return toast('请输入姓名')
  if (!/^1\d{10}$/.test(form.mobile.trim())) return toast('请输入正确的手机号')
  if (!form.region.trim()) return toast('请选择市区')
  if (!form.address.trim()) return toast('请输入详细地址')
  await addAddress({ ...form })
  toast('添加成功')
  setTimeout(() => router.back(), 800)
}
</script>

<style scoped>
.ae-page {
  min-height: 100vh;
  background: #101115;
}
.ae-nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  z-index: 10;
}
.ae-nav__back {
  position: absolute;
  left: 13px;
  top: 10px;
  width: 24px;
  height: 24px;
}
.ae-nav__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}
.ae-form {
  margin: 60px 16px 0;
  height: 237px;
  background: #181713;
  border: 1px solid #655032;
  border-radius: 12px;
  padding: 8px 16px 0;
}
.ae-row {
  height: 55px;
  display: flex;
  align-items: center;
}
.ae-row__label {
  width: 93px;
  font-size: 14px;
  line-height: 15px;
  color: #999;
}
.ae-row__input {
  width: 231px;
  height: 24px;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 26px;
  color: #fff;
}
.ae-row__input::placeholder {
  color: #8e8e93;
}
.ae-default {
  position: relative;
  margin: 16px 16px 0;
  height: 52px;
  padding-top: 2px;
  background: #181713;
  border: 1px solid #655032;
  border-radius: 12px;
  display: flex;
  align-items: center;
}
.ae-default__text {
  margin-left: 16px;
  font-size: 14px;
  line-height: 15px;
  color: #999;
}
.ae-switch {
  position: absolute;
  right: 16px;
  top: 50%;
  margin-top: -11px;
  width: 42px;
  height: 22px;
  border-radius: 100px;
  background: #3a3a40;
  border: 1px solid rgba(0, 0, 0, 0);
  transition: background 0.2s;
  cursor: pointer;
}
.ae-switch--on {
  background: #1b64de;
}
.ae-switch__knob {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 20px;
  height: 20px;
  border-radius: 100px;
  background: #fff;
  transition: left 0.2s;
}
.ae-switch--on .ae-switch__knob {
  left: 21px;
}
.ae-btn {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  height: 47px;
  background: #211c14;
  border-radius: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #f4dcaa;
  cursor: pointer;
  z-index: 5;
}
.ae-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}
.ae-picker {
  width: 100%;
  background: #181713;
  border-top: 1px solid #655032;
  border-radius: 12px 12px 0 0;
}
.ae-picker__head {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
.ae-picker__cancel {
  font-size: 14px;
  color: #999;
}
.ae-picker__title {
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
}
.ae-picker__ok {
  font-size: 14px;
  color: #cfaf72;
}
.ae-picker__cols {
  display: flex;
  height: 220px;
  border-top: 1px solid rgba(101, 80, 50, 0.4);
}
.ae-picker__col {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
.ae-picker__item {
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 14px;
  color: #ede6d6;
}
.ae-picker__item--on {
  color: #cfaf72;
  font-weight: bold;
}
</style>
