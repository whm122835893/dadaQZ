import axios from 'axios'
import SparkMD5 from 'spark-md5'
import { getToken, clearToken } from '@/stores/user'

/**
 * 请求层 —— 严格对齐原站协议
 * 1. 完整 URL = API_BASE + path（不含域名，本地走 vite 代理）
 * 2. sign = md5(完整URL + METHOD)
 * 3. 统一响应包 { code, msg, time, data }
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const ADDONS_BASE = import.meta.env.VITE_ADDONS_BASE || '/addons'
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.1.2'

/** 拼接用于签名的完整 URL（与原站 md5(url+method) 中的 url 保持一致口径） */
function buildSignUrl(path, addons = false) {
  return (addons ? ADDONS_BASE : API_BASE) + path
}

export function sign(path, method, addons = false) {
  return SparkMD5.hash(buildSignUrl(path, addons) + String(method).toUpperCase())
}

const instance = axios.create({
  // 统一由 baseURL 拼接前缀：普通接口走 /api，插件接口走绝对路径
  baseURL: API_BASE,
  timeout: 25000,
  headers: { 'Cache-Control': 'no-cache' }
})

instance.interceptors.request.use((config) => {
  const method = (config.method || 'get').toUpperCase()
  const path = config.url
  const addons = config.__addons === true
  const fullPath = buildSignUrl(path, addons)

  config.headers['sign'] = sign(path, method, addons)
  config.headers['version'] = APP_VERSION
  config.headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) config.headers['token'] = token

  // 查询串也参与签名（与原站 x += "?" + qs 逻辑一致）
  if (config.params && Object.keys(config.params).length > 0) {
    const qs = Object.keys(config.params)
      .map((k) => `${k}=${config.params[k]}`)
      .join('&')
    fullPath += '?' + qs
    config.headers['sign'] = SparkMD5.hash(fullPath + method)
  }

  // baseURL 交由 axios 处理，这里仅保留展示用途
  config.__full = fullPath
  return config
})

instance.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 1) return body
      if (body.code === -1 || body.code === 401) {
        clearToken()
        window.location.hash = '#/pages/login/login'
      }
      return Promise.reject(body)
    }
    return body
  },
  (err) => Promise.reject(err)
)

/** GET */
export function get(url, params, opts = {}) {
  if (opts.addons) {
    return instance.get(ADDONS_BASE + url, { params, __addons: true, baseURL: '' })
  }
  return instance.get(url, { params })
}

/** POST */
export function post(url, data, opts = {}) {
  if (opts.addons) {
    // addons 走独立前缀，需绕开 axios baseURL
    return instance.post(ADDONS_BASE + url, data ?? {}, { __addons: true, baseURL: '' })
  }
  return instance.post(url, data ?? {})
}

export default instance