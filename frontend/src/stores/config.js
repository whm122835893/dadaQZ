import { defineStore } from 'pinia'
import { CONFIG } from '@/api/mock'

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: { ...CONFIG },
    diyHome: [],
    seriesList: [],
    loaded: false,
    nowTimestamp: Date.now()
  }),
  getters: {
    appName: (s) => s.config.appName || '嗒嗒',
    logo: (s) => s.config.appLogo || '',
    qqTeamNum: (s) => s.config.qq_team_num || '',
    riskWarning: (s) => s.config.risk_warning || ''
  },
  actions: {
    setConfig(c) { this.config = { ...this.config, ...c } },
    setDiyHome(v) { this.diyHome = v },
    setSeries(v) { this.seriesList = v },
    setLoaded() { this.loaded = true },
    tick() { this.nowTimestamp = Date.now() }
  }
})
