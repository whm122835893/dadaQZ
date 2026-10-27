import { defineStore } from 'pinia'
import { MOCK_USER } from '@/api/mock'

const TOKEN_KEY = 'token'
const USER_KEY = 'tata_user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    userInfo: JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  }),
  getters: {
    isLogin: (s) => !!s.token,
    nickname: (s) => s.userInfo?.nickname || '',
    mobile: (s) => s.userInfo?.mobile || '',
    score: (s) => s.userInfo?.score || 0,
    money: (s) => s.userInfo?.money || '0.00',
    avatar: (s) => s.userInfo?.avatar || '/defautAvatar.png',
    realNameAuth: (s) => s.userInfo?.real_name_authentication === 1
  },
  actions: {
    setLogin(token, userInfo) {
      this.token = token
      this.userInfo = userInfo
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
    },
    setUserInfo(u) {
      this.userInfo = u
      localStorage.setItem(USER_KEY, JSON.stringify(u))
    },
    /** 演示模式：直接注入原站同款测试账号数据 */
    loginDemo() {
      this.setLogin(MOCK_USER.token, MOCK_USER)
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }
})

/** 供 request 拦截器同步读取（避免循环依赖） */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
