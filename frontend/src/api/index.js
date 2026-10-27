import { post } from './request'
import {
  CONFIG,
  SERIES_LIST,
  AFFICHE_TYPE_LIST,
  BANNER_LIST,
  BLIND_BOX_LIST,
  AFFICHE_LIST,
  DIY_PAGE_HOME,
  MOCK_USER,
  MARKET_SERIES, MARKET_BOX_LIST,
  MARKET_LIST, MARKET_GOODS_DETAIL, MARKET_GOODS_LIST, MARKET_DETAIL_12152,
  MARKET_BEG_BUY_LIST, MARKET_ENTRUST_LIST, MARKET_TRADING_INFO,
  MARKET_TRAD_INFO, MARKET_SELL_BEG_INFO, ENTRUST_CHARGE_INFO,
  SELL_INFO_COUNTS, SELL_INFO_TRADE_LIST, SELL_INFO_BEG_BUY_LIST, SELL_INFO_CONSIGN_LIST,
  NOTICE_BANNER, AFFICHE_LIST_BY_CATEGORY, AFFICHE_DETAILS, SYNTHESIS_THEME,
  SIGN_CONFIG, SIGN_RECORD,
  LOTTERY_INFO, LOTTERY_STATISTICS,
  SALE_PRODUCT, SIGN_UP_INFO, DRAW_CODE_INFO, DRAW_LOTS_NOTICE,
  BLIND_BOX_DETAIL, BASE_PAY_LIST, ORDER_CREATED,
  ORDER_LIST, BATCH_ORDER_LIST, BEG_ORDER_LIST, ENTRUST_ORDER_LIST,
  getOrderDetailMock, getMarketOrderDetailMock, getRegiftOrderDetailMock,
  getMyCollectionMock, getMyConsignmentMock, LIKE_COLLECTION_LIST,
  USER_COLLECTION_DETAIL,
  SELL_CONFIG, SELL_PRODUCT_RESULT, getConsignDetailMock,
  getCollectionDetailMock, getCollectionNoWeitherMock, markConsignCanceled,
  getRegiftUserMock, GIVING_RESULT, getGiveRecordMock,
  getMarketCapRankingMock,
  /* P0 批次 */
  ADDRESS_LIST, INVITATION_CONFIG, INVITATION_RANKING, CRYSTAL_GOODS_LIST,
  CRYSTAL_DETAIL_LIST, CRYSTAL_EXCHANGE_RECORD, CRYSTAL_GOODS_INFO,
  MY_CONSIGNMENT_SEARCH, TASK_ENTRY_LIST, TASK_MALL_LIST, SYNTHESIS_PLAY_INFO,
  /* 公告 / 盲盒 / 抽签 三模块 */
  ANT_NEWS_CATEGORY, ANT_NEWS_LIST, ANT_NEWS_INFO,
  RUMOR_WALL_LIST, RUMOR_WALL_INFO, RUMOR_WALL_COMMENT,
  BLIND_BOX_OPEN_LOG, DRAW_QUALIFICATION, DRAW_LEADERBOARD,
  SHARE_DETAILS, HELP_RECORD, SHARE_RULE_HTML,
  /* K线 / 抽签 / 抽奖 / 交易记录 批次 */
  KLINE_INFO, KLINE_BUY, TRADING_INFORMATION, DRAW_ACTIVITY,
  LOTTERY_PRIZE_LIST, LOTTERY_DRAW_LOG,
  /* 合成 / 榜单 批次 */
  SYNTHESIS_RECORD_LIST, SYNTHESIS_RECORD_INFO,
  USER_NEW_RANK, USER_MASTER_INFO, USER_MASTER_LIST, USER_RANKING,
  /* 收尾批次：活动 / 工会 / 分类 / 搜索 / 返佣 */
  ACTIVITY_CATEGORY, ACTIVITY_INDEX, DRAW_LOG,
  UNION_MY_UNION, UNION_RANK_LOGS, UNION_USER_LOGS, UNION_MESSAGE,
  COMMISSION_INFO, BEI_YAO_LIST, COMMISSION_RANK,
  CATEGORY_SERIES_10, CATEGORY_SERIES_20, CUSTOM_SERIES_LIST } from './mock'

/** 是否启用本地 mock（后端未启动时自动降级，保证前端可独立预览） */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

function ok(data, msg = 'success') {
  return { code: 1, msg, time: String(Math.floor(Date.now() / 1000)), data }
}

/**
 * 带 mock 降级的请求封装
 * - VITE_USE_MOCK 开启：直接走本地 mock，不产生任何后端请求
 * - 关闭：请求真实后端，失败时降级到 mock，保证页面不白屏
 */
async function withMock(request, mockFn) {
  if (USE_MOCK) return mockFn()
  try {
    const res = await request()
    if (res && res.code === 1) return res
    return mockFn ? mockFn() : res
  } catch (e) {
    if (mockFn) return mockFn()
    throw e
  }
}

/* ---------------- 首页 ---------------- */

/** 基本配置 */
export function getConfig() {
  return withMock(
    () => post('/index/getConfig', { key: 'resell_collection,copyright,transfer_collection,appLogo,appBigLogo,pay_audit,app_version,appName,puzzleCaptcha,cancellation,pay_time_limit,h5_domain,draw_notice,credit_goods_dhxz,credit_goods_zysx,service_image,service_mobile,certification,consignment_sales,isAgreement,h5_invite_url,strategy,aboutus,ipa,base_apk,default_pay_type,fastOrder_check,batchBuy_check,normal_check,synthetic_check,service_email,draw_share_assrule,draw_code_rankrule,draw_lots_rule,draw_lots_notice,share_rule,score_helpdraw_sub,helpdraw_rule,draw_share_assimage,comm_desc,risk_warning,qq_team_num,olduser_dayhelp_num,purchase_sale_details' }),
    () => ok(CONFIG, '基本配置')
  )
}

/** 系列列表 */
export function getSeries(type = 10) {
  return withMock(
    () => post('/index/getSeries', {}, { params: { type } }),
    () => ok(SERIES_LIST, '系列')
  )
}

/** 公告分类字典 */
export function getAfficheTypeList() {
  return withMock(() => post('/index/affichetypelist'), () => ok(AFFICHE_TYPE_LIST, '查询成功'))
}

/** 首页 DIY 装修数据 */
export function getDiyPage() {
  return withMock(
    () => post('/diypage/index', {}, { addons: true }),
    () => ok(DIY_PAGE_HOME)
  )
}

/** 发售日历 / 盲盒列表 */
export function getBlindBoxList(params = {}) {
  const payload = {
    goods_type: params.goods_type ?? '',
    list_rows: params.list_rows ?? 30,
    page: params.page ?? 1,
    order: params.order ?? '',
    sort: params.sort ?? '',
    series_id: params.series_id ?? 0
  }
  return withMock(
    () => post('/box/blind_box/list', payload),
    () => ok(BLIND_BOX_LIST, '发售日历')
  )
}

/** 首页轮播 banner */
export function getBanner(type = 1) {
  return withMock(() => post('/banner/show/getBanner', { type }), () => ok(BANNER_LIST, 'banner列表'))
}

/** 公告列表 */
export function getAfficheList(params = {}) {
  const { category = 0, page = 1 } = params
  return withMock(
    () => post('/index/afficheList', params),
    () => {
      if (category) {
        const hit = AFFICHE_LIST_BY_CATEGORY[category]
        if (hit) return ok({ ...hit, per_page: 15, current_page: page, last_page: 1 }, '公告列表')
      }
      return ok(AFFICHE_LIST, '公告列表')
    }
  )
}

/** 合成活动主题与方案列表（原站 /synthesis/themeinfo thm=1） */
export function getSynthesisTheme(thm = 1) {
  return withMock(
    () => post('/synthesis/themeinfo', { thm }),
    () => ok(SYNTHESIS_THEME, 'successfully !!!')
  )
}

/** 合成材料方案（原站 /synthesis/material） */
export function getSynthesisMaterial(params = {}) {
  return withMock(
    () => post('/synthesis/material', params),
    () => ok({ data: [] }, 'successfully !!!')
  )
}

/** 公告页顶部横幅（原站 getComstomBanner） */
export function getNoticeBanner() {
  return withMock(
    () => post('/index/getComstomBanner'),
    () => ok(NOTICE_BANNER, '成功')
  )
}

/* ---------------- 用户 ---------------- */

export function login({ account, password }) {
  return withMock(
    () => post('/user/login', { account, password }),
    () => {
      if (account === '17587881293' && password === 'whm981004') {
        return ok({ userinfo: { ...MOCK_USER, is_exist: 1 } }, '登录成功')
      }
      return Promise.reject({ code: 0, msg: '账号或密码不正确', data: null })
    }
  )
}

/** 验证码登录 —— 原站 login(params, 2)（模块 fc5e）
 *  POST /user/LoginForMobile  body { mobile, captcha, inviter_code? }
 *  响应 data.userinfo { token, is_exist }（与密码登录同构） */
/** 注册 —— 原站 register（模块 fc5e）
 *  POST /user/register  body { mobile, code, password, inviter_code }
 *  页面（pages/login/register）registerChange；响应 data.userinfo { token, is_exist } */
export function register(params = {}) {
  return withMock(
    () => post('/user/register', params),
    () => ok({ userinfo: { ...MOCK_USER, is_exist: 0 } }, '注册成功')
  )
}

export function loginByCode(params = {}) {
  return withMock(
    () => post('/user/LoginForMobile', params),
    () => {
      const mobile = String(params.mobile || '')
      if (mobile.length !== 11 || !params.captcha) {
        return Promise.reject({ code: 0, msg: '验证码错误', data: null })
      }
      return ok({ userinfo: { ...MOCK_USER, is_exist: 1 } }, '登录成功')
    }
  )
}

/** 重置登录密码 —— 原站 resetLoginPwd（模块 fc5e）
 *  POST /user/resetpwd  body { mobile, captcha, newpassword, re_password }
 *  页面（pages/login/forgetPwd）handleConfirm */
export function resetLoginPwd(params = {}) {
  return withMock(
    () => post('/user/resetpwd', params),
    () => ok({}, '重置成功')
  )
}

export function getUserInfo() {
  return withMock(() => post('/user/getUserInfo'), () => ok(MOCK_USER, '个人信息'))
}

/* ---------------- 操作密码 / 短信（P0：my/actionPwd/getCode） ---------------- */

/** 发送短信验证码
 *  原站：POST /api/sms/send  body { mobile, event, verify_token? }
 *  event: resetpwd 重置操作密码 / login 登录 / register 注册 */
export function sendSms(params = {}) {
  return withMock(
    () => post('/sms/send', params),
    () => ok({}, '发送成功')
  )
}

/** 校验操作密码（原站拼写为 cehckPayPassword，非 typo 修正，保持原样）
 *  POST /api/user/checkPaypass  body { pay_password }
 *  响应 data.code 为下一步 setPwd 需要的凭证 */
export function cehckPayPassword(params = {}) {
  return withMock(
    () => post('/user/checkPaypass', params),
    () => ok({ code: 'MOCKCODE' }, '校验成功')
  )
}

/** 设置 / 修改操作密码
 *  POST /api/user/setPayPassword  body { pay_password, code? } */
export function setActionPwd(params = {}) {
  return withMock(
    () => post('/user/setPayPassword', params),
    () => ok({}, '设置成功')
  )
}

/* ---------------- 市场 ---------------- */

/** 市场藏品列表
 *  @param {{keywords?:string, market_type?:number, series_id?:number|string,
 *           page?:number, list_rows?:number, order?:string, sort?:string}} params */
export function getMarketList(params = {}) {
  return withMock(
    () => post('/market/market/getMarketList', { add_deal_num: true, ...params }),
    () => {
      const { market_type = 1, series_id = '', keywords = '' } = params
      // market_type=2（盲盒市场）仍走本接口（原站 changeMarketTab 恒设 goods_type=2），
      // 页面以 MarketCard 渲染；mock 返回盲盒商品
      if (market_type === 2) return ok(MARKET_BOX_LIST.data, '市场列表')
      // market_type 1=全部 3=权益资产（series_id=-2，mock 返回空）
      let list = MARKET_LIST
      if (market_type === 3) list = []
      if (keywords) {
        list = list.filter((x) => (x.name || '').includes(keywords))
      }
      if (series_id !== '' && series_id != null) {
        const sid = Number(series_id)
        if (sid > 0) list = list.filter((x) => x.series_id === sid)
        else if (sid === -2) list = []
      }
      return ok(list, '市场列表')
    }
  )
}

/** 盲盒市场列表（goods_type=1 盲盒 tab 走这条，原站 getMarketBoxList → /market/market/marketList；
 *  响应 { total, data }，getBoxList 按页追加） */
export function getMarketBoxList(params = {}) {
  return withMock(
    () => post('/market/market/marketList', params),
    () => {
      const { page = 1 } = params
      const data = page <= 1 ? MARKET_BOX_LIST.data : []
      return ok({ total: MARKET_BOX_LIST.total, data }, '盲盒市场列表')
    }
  )
}

/** 市场页系列（大区卡片 + 分类 tab 数据源） */
export function getMarketSeries() {
  return withMock(
    () => post('/index/series', { type: 10, page: 1, list_rows: 50 }),
    () => ok(MARKET_SERIES, '系列列表')
  )
}

/** 寄售（市场藏品）详情 —— 原站 getMarketDetails（模块 3fd1）
 *  POST /market/market/MarketDetail/ids/{id}
 *  页面（pages/market/detail）data.info；data.product 内嵌专辑详情，
 *  getInfo 里用顶层 price/goods_type 覆盖 product.price/product.goods_type */
export function getMarketDetails(id) {
  return withMock(
    () => post(`/market/market/MarketDetail/ids/${id}`),
    () => ok({ ...MARKET_DETAIL_12152, id: Number(id) || MARKET_DETAIL_12152.id }, '商品详情')
  )
}

/** 市场专辑商品详情 —— 原站 getMarketGoodsInfo（模块 3fd1）
 *  POST /market/market/marketGoodsDetail  body { id, type }
 *  页面（pages/market/marketGoodsList）头部专辑卡数据源 */
export function getMarketGoodsInfo(params = {}) {
  return withMock(
    () => post('/market/market/marketGoodsDetail', { type: '2', ...params }),
    () => ok(MARKET_GOODS_DETAIL, '操作成功')
  )
}

/** 市场专辑挂单列表 —— 原站 getMarketGoodsList（模块 3fd1）
 *  POST /market/market/getMarketGoodsListByGoodsId
 *  body { page, sort, order, type, keyword, id }
 *  页面（pages/market/marketGoodsList）4 tab 共用；type：2 寄售 / 3 求购 / 4 委托 / 5 成交 */
export function getMarketGoodsList(params = {}) {
  return withMock(
    () => post('/market/market/getMarketGoodsListByGoodsId', { page: 1, sort: 'price', order: 'asc', type: 2, keyword: '', id: '', ...params }),
    () => ok(MARKET_GOODS_LIST, '操作成功')
  )
}

/** 市值排行 —— 原站 ranking（模块 3fd1 / 页面 script 模块 3aa4）
 *  POST /user/ranking
 *  原站真实响应：{ code:1, msg:"查询成功", data:{ data:[], my:"", activityRule:"" } }
 *  原站页面取 `A.list = a.data`（整个对象）导致 _l 遍历 key 渲染出 data1/my1/activityRule1 脏数据；
 *  本地修正为 list = res.data.data（数组），并补全榜单条目字段，详见 api/mock.js 注释。 */
export function getMarketCapRanking() {
  return withMock(
    () => post('/user/ranking'),
    () => ok(getMarketCapRankingMock(), '查询成功')
  )
}

/** 求购列表 —— 原站 getBegBuyList（模块 48cc）
 *  POST /market/trade/begBuyList  body {page, sort, collection_id}
 *  页面（pages/market/marketGoodsList）求购 tab：data.data / data.per_page / data.total */
export function getBegBuyList(params = {}) {
  return withMock(
    () => post('/market/trade/begBuyList', { page: 1, sort: 'desc', ...params }),
    () => ok(MARKET_BEG_BUY_LIST, '订单信息')
  )
}

/** 委托（预付）列表 —— 原站 getEntrustList（模块 48cc）
 *  POST /market/Prepayment/PrepaymentListMain  body {page, sort, collection_id}
 *  页面（pages/market/marketGoodsList）委托 tab EntrustList：total_amount / total_number / data */
export function getEntrustList(params = {}) {
  return withMock(
    () => post('/market/Prepayment/PrepaymentListMain', { page: 1, sort: 'desc', ...params }),
    () => ok(MARKET_ENTRUST_LIST, '订单信息')
  )
}

/** 委托取消 —— 原站 entrustCancel（模块 48cc）
 *  POST /market/Prepayment/cancelOrder  body {order_id} */
export function entrustCancel(orderId) {
  return withMock(
    () => post('/market/Prepayment/cancelOrder', { order_id: orderId }),
    () => ok({}, '取消成功')
  )
}

/** 委托收费信息 —— 原站 getEntrustInfo（模块 48cc）
 *  POST /market/Prepayment/collectionDetail  body {collection_id}
 *  页面（pages/market/submitEntrust）data.chargeInfo：
 *    pay_platform_service_rate 综合服务费率 / low_price 当前委托低价
 *    low_price_text 中文大写 / share_proportion_rate 分销费率 / tips 委托说明(HTML) */
export function getEntrustInfo(collectionId) {
  return withMock(
    () => post('/market/Prepayment/collectionDetail', { collection_id: collectionId }),
    () => ok(ENTRUST_CHARGE_INFO, '查询成功')
  )
}

/** 发起委托下单 —— 原站 entrust（模块 48cc）
 *  POST /market/Prepayment/createOrder  body {number, price, pay_way, collection_id}
 *  页面（pages/market/submitEntrust）createOrder → 成功后 new Pay({order_type:31, pay_type:4}) */
export function entrust(params = {}) {
  return withMock(
    () => post('/market/Prepayment/createOrder', params),
    () => ok({ order_id: 30041, order_sn: '2026102410220012345678901234' }, '下单成功')
  )
}

/** 取消求购订单 —— 原站 cancelBegBuy（模块 48cc）
 *  POST /market/trade/cancelBegBuyOrder  body {order_id}
 *  页面（pages/order/beg/list）CancelBegOrder 弹窗确认后调用 */
export function cancelBegBuy(orderId) {
  return withMock(
    () => post('/market/trade/cancelBegBuyOrder', { order_id: orderId }),
    () => ok({}, '取消成功')
  )
}

/** 成交（交易信息）—— 原站 getSellInfo（模块 48cc）
 *  POST /market/trade/tradingInformation  body {status, page, goods_id}
 *  页面（pages/market/sellInfo）三 tab 共用；
 *    status=1 成交记录（list: time/collection_code/total_num/price）
 *    status=2 当前求购（list: price/number）
 *    status=3 当前寄售（list: price/number）
 *  响应 data 恒带 transaction_record_number / current_buying / current_consignment 三个计数 */
export function getSellInfo(params = {}) {
  const status = Number(params.status) || 1
  const page = Number(params.page) || 1
  const all =
    status === 2 ? SELL_INFO_BEG_BUY_LIST : status === 3 ? SELL_INFO_CONSIGN_LIST : SELL_INFO_TRADE_LIST
  /* 原站分页语义：每页 20 条，第二页起返回空数组（页面据此置 nomore） */
  const rows = page <= 1 ? all : []
  return withMock(
    () => post('/market/trade/tradingInformation', { status: 1, ...params }),
    /* 汇总字段沿用 MARKET_TRADING_INFO（marketGoodsList 成交 tab 已验收，floor_price/today_amount 等不可丢），
       list 与三计数按 sellInfo 页 status 分流 */
    () => ok({ ...MARKET_TRADING_INFO, ...SELL_INFO_COUNTS, list: rows }, '交易信息')
  )
}

/** 快捷下单 —— 原站 fastCreateOrder（模块 7db7）
 *  POST /order/pay/fastOrderNew  body {goods_id, key, pay_way}
 *  页面（pages/market/marketGoodsList）选择支付方式弹窗 → 确认 → 支付 */
export function fastCreateOrder(params = {}) {
  return withMock(
    () => post('/order/pay/fastOrderNew', params),
    () => ok({ order_sn: '2026102321050012345678901234', order_id: 30021 }, '下单成功')
  )
}

/* ---------------- 求购 / 求购价出售（市场购买链路） ---------------- */

/**
 * 求购专辑详情 —— 原站 getTradInfo（模块 48cc）
 *  POST /market/trade/collectionDetail  body { collection_id }
 *  页面（pages/market/submitBegBuy）data.info：
 *    id / name / listimg / reprice_limit / reprice_min_limit / reprice_beg_max_limit / max_buy_price
 *    floor_price { minprice, price_pro, tips, price_price_ratio, pay_platform_service_rate,
 *                  share_proportion_rate, platform_service_price, share_proportion_price,
 *                  real_price, low_price, low_price_text }
 */
export function getTradInfo(collectionId) {
  return withMock(
    () => post('/market/trade/collectionDetail', { collection_id: collectionId }),
    () => ok(MARKET_TRAD_INFO, '查询成功')
  )
}

/**
 * 创建求购订单 —— 原站 createTradOrder（模块 48cc）
 *  POST /market/trade/createBegBuyOrder  body { number, price, pay_way, collection_id }
 *  页面（pages/market/submitBegBuy）createOrder → 成功后拉起支付（order_type=11, pay_type=4）
 */
export function createTradOrder(params = {}) {
  return withMock(
    () => post('/market/trade/createBegBuyOrder', params),
    () => ok({ order_id: 30031, order_sn: '2026102410220012345678901234' }, '下单成功')
  )
}

/**
 * 求购价出售信息 —— 原站 getSellBegInfo（模块 48cc）
 *  POST /market/trade/getSellCollectionInfo  body { collection_id, pay_way, number }
 *  页面（pages/market/sellBegBuy）data.info：
 *    selected[] / user_collection_list[] / total_price / platform_service_rate
 *    / platform_service_price / estimated_income
 */
export function getSellBegInfo(params = {}) {
  return withMock(
    () => post('/market/trade/getSellCollectionInfo', params),
    () => ok(MARKET_SELL_BEG_INFO, '查询成功')
  )
}

/**
 * 以求购价出售 —— 原站 sell（模块 48cc）
 *  POST /market/trade/sell  body { sell_data(btoa), pay_way, pay_password }
 *  页面（pages/market/sellBegBuy）confim → 成功后跳 /pages/order/list
 */
export function sell(params = {}) {
  return withMock(
    () => post('/market/trade/sell', params),
    () => ok({ password_error: 0 }, '出售成功')
  )
}

/**
 * 收藏 / 取消收藏 —— 原站 isCollect（主包模块，navbar 心形图标 targetLike）
 *  is_like === 1 → /user_collection/user_collection/dellike
 *  否则            → /user_collection/user_collection/addlike
 *  body { types: goods_type, id: product.id }
 */
export function collectToggle(isLike, params = {}) {
  const url = isLike === 1 ? '/user_collection/user_collection/dellike' : '/user_collection/user_collection/addlike'
  return withMock(
    () => post(url, params),
    () => ok({}, isLike === 1 ? '取消收藏' : '收藏成功')
  )
}

/* ---------------- 签到（pages/sign/index） ---------------- */

/**
 * 签到配置
 * 反编译原站 logic 模块 4170：(0,r.getSignConfig)().then(a => e.config = a.data)
 * 字段：successions 连续天数 / integral 积分 / is_signin 今日是否已签
 */
export function getSignConfig() {
  return withMock(
    () => post('/signin/config'),
    () => ok(SIGN_CONFIG, '签到配置')
  )
}

/**
 * 签到记录
 * 原站用 moment(1e3 * a.time).format('YYYY-MM') 取月份，再把 data 的键拼成「月-日」
 */
export function getSignRecord() {
  return withMock(
    () => post('/signin/getSignRecord'),
    () => ok(SIGN_RECORD, '签到记录')
  )
}

/** 执行签到，原站：code === 1 → toast「签到成功」并重新 init */
export function doSign() {
  return withMock(
    () => post('/signin/dosign'),
    () => ok({ integral: 10, successions: (SIGN_CONFIG.successions || 0) + 1 }, '签到成功')
  )
}

/* ---------------- 抽奖（pages/lottery/lottery） ---------------- */

/**
 * 抽奖活动详情
 * 实调 2026-10-20：当前返回 { code:0, msg:"暂无抽奖活动" }，mock 提供完整活动数据供预览
 * @param {{id:number|string}} params
 */
export function getLotteryInfo(params = {}) {
  return withMock(
    () => post('/lottery/info', params),
    () => ok(LOTTERY_INFO, '抽奖详情')
  )
}

/** 抽奖记录 */
export function getLotteryRecord(params = {}) {
  return withMock(
    () => post('/lottery/record', params),
    () => ok([], '抽奖记录')
  )
}

/** 发起抽奖。原站 lotteryStartApi({ lotteryId, number }) */
export function startLottery(params = {}) {
  return withMock(
    () => post('/lottery/start', params),
    () => ok([{ id: 1, name: '稀有藏品', image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg', detail: '限量 1 份' }], '抽奖成功')
  )
}

/** 抽奖统计（实调返回 data: []） */
export function getLotteryStatistics(params = {}) {
  return withMock(
    () => post('/lottery/statistics', params),
    () => ok(LOTTERY_STATISTICS, '抽奖统计')
  )
}

/* ---------------- 藏品发售 / 抽签（pages/product/collection） ---------------- */

/**
 * 藏品详情，原站 getCollectionDetails → /box/collection/ProductDetail/ids/{id}
 * 注意：原站为 post + query param batch_id；不带 batch_id 会返回「参数错误」
 * @param {{id:number|string, batch_id?:number|string}} params
 */
export function getProductDetail(params = {}) {
  const { id, batch_id: batchId } = params
  return withMock(
    () => post(`/box/collection/ProductDetail/ids/${id}`, { batch_id: batchId }),
    () => ok(SALE_PRODUCT, '藏品详情')
  )
}

/**
 * 设置购买提醒（原站 subscribe → /subscribe/index）
 * 参数：{ id, opr_id, type:10, goods_type }，type=10 且 goods_type!=1 时 opr_id 为 batch.id
 */
export function subscribe(params = {}) {
  return withMock(
    () => post('/subscribe/index', params),
    () => ok({ msg: '设置成功' }, '设置提醒')
  )
}

/**
 * 取消购买提醒（原站 cancelSubscribe → /subscribe/cancel）
 */
export function cancelSubscribe(params = {}) {
  return withMock(
    () => post('/subscribe/cancel', params),
    () => ok({ msg: '已取消' }, '取消提醒')
  )
}

/* ---------------- 下单（pages/order/orderSubmit） ---------------- */

/**
 * 支付方式列表 —— 原站 config.basePayList（主包 index.js 中的真实常量）
 * 实调 `/index/getConfig {key:'huifu_pay_status'}` 返回 `"0"`，即汇付已关闭
 */
export function getPayList() {
  return withMock(
    () => post('/index/getConfig', { key: 'huifu_pay_status' }),
    () => ok(BASE_PAY_LIST, '基本配置')
  )
}

/**
 * 创建普通藏品订单，原站 createOrder → /order/pay/CreateOrder
 * body：{ goods_type, goods_id, num, pay_type, pay_way, batch_id, price:1 }
 * 实调（id=20/batch=7）：返回 `{code:0, msg:"售卖已结束"}`
 */
export function createOrder(params = {}) {
  return withMock(
    () => post('/order/pay/CreateOrder', params),
    () => ok(ORDER_CREATED, '下单成功')
  )
}

/**
 * 创建市场订单，原站 createMarketOrder → /order/pay/CreateMarketOrder
 * body 额外含market_goods_id（order_type=2 时走这条）
 */
export function createMarketOrder(params = {}) {
  return withMock(
    () => post('/order/pay/CreateMarketOrder', params),
    () => ok(ORDER_CREATED, '下单成功')
  )
}

/** 订单列表，原站 getOderList → /order/order/orderList（注意原站方法名拼写 Oder） */
export function getOrderList(params = {}) {
  return withMock(
    () => post('/order/order/orderList', params),
    // mock 端模拟后端按 status 过滤（status=0 表示全部）
    () => {
      const st = params.status
      const rows =
        st === 0 || st === undefined || st === null
          ? ORDER_LIST.data
          : ORDER_LIST.data.filter((o) => o.order_status === st)
      return ok({ ...ORDER_LIST, total: rows.length, data: rows }, '订单列表')
    }
  )
}

/** 批量付订单列表，原站 getBatchOrderList → /order/order/batchPayOrder */
export function getBatchOrderList() {
  return withMock(
    () => post('/order/order/batchPayOrder'),
    () => ok(BATCH_ORDER_LIST, '批量付订单')
  )
}

/** 取消批量付订单，原站 cancelBatchOrder → /order/order/cancelbatchorder */
export function cancelBatchOrder(params = {}) {
  return withMock(
    () => post('/order/order/cancelbatchorder', params),
    () => ok(null, '取消成功')
  )
}

/** 批量支付下单，原站 createBatchPayOrder → /order/pay/batchdopay */
export function createBatchPayOrder(params = {}) {
  return withMock(
    () => post('/order/pay/batchdopay', params),
    () => ok({ order_id: 1, order_sn: 'T20261020000001', order_type: 10 }, '下单成功')
  )
}

/** 求购订单列表，原站 getMyTradeList → /market/trade/begBuyOrderList */
export function getMyTradeList(params = {}) {
  return withMock(
    () => post('/market/trade/begBuyOrderList', params),
    // mock 端模拟后端按 status 过滤（status=null 表示全部；求购中2/已成交3/已取消4）
    () => {
      const st = params.status
      const rows =
        st === null || st === undefined || st === 0
          ? BEG_ORDER_LIST.data
          : BEG_ORDER_LIST.data.filter((o) => o.order_status === st)
      return ok({ ...BEG_ORDER_LIST, total: rows.length, data: rows }, '订单信息')
    }
  )
}

/** 求购订单详情，原站 getMyBegInfo → /market/trade/begBuyOrderInfo
 *  页面（pages/order/beg/info）onLoad 后调用；mock 端按 id 从 BEG_ORDER_LIST 取 */
export function getMyBegInfo(orderId) {
  return withMock(
    () => post('/market/trade/begBuyOrderInfo', { order_id: orderId }),
    () => {
      const row = BEG_ORDER_LIST.data.find((o) => String(o.id) === String(orderId))
      return ok(row || {}, '订单信息')
    }
  )
}

/** 委托订单列表，原站 getMyEntrustList → /market/Prepayment/PrepaymentListMain
 *  页面（pages/order/entrust/list）onLoad 后调用；mock 端按 status 过滤 ENTRUST_ORDER_LIST */
export function getMyEntrustList(params = {}) {
  return withMock(
    () => post('/market/Prepayment/PrepaymentListMain', params),
    () => {
      const status = params.status
      const rows = status
        ? ENTRUST_ORDER_LIST.data.filter((o) => String(o.order_status) === String(status))
        : ENTRUST_ORDER_LIST.data
      return ok({ ...ENTRUST_ORDER_LIST, data: rows }, '订单信息')
    }
  )
}

/** 委托订单详情，原站 getMyEntrustInfo → /market/Prepayment/myOrderInfo
 *  页面（pages/order/entrust/info）onLoad 后调用；mock 端按 id 从 ENTRUST_ORDER_LIST 取 */
export function getMyEntrustInfo(orderId) {
  return withMock(
    () => post('/market/Prepayment/myOrderInfo', orderId),
    () => {
      const row = ENTRUST_ORDER_LIST.data.find((o) => String(o.id) === String(orderId))
      return ok(row || {}, '订单信息')
    }
  )
}

/** 订单详情，原站 getOrderDetails → /order/order/orderDetail/ids/{id}（order_type=2 走 MarketOrderDetail） */
export function getOrderDetail(id, orderType = 1) {
  const path = orderType === '2' || orderType === 2 ? '/order/order/MarketOrderDetail/ids/' : '/order/order/orderDetail/ids/'
  return withMock(
    () => post(path + id),
    () => ok(getOrderDetailMock(id), '订单详情')
  )
}

/**
 * 变更订单状态，原站 `changeOrderStatus`（模块 7db7）
 * 按 order_type 分流三条接口：
 *   1/3/4/5/6/7/8/10/11 → /order/order/changeOrderStatus
 *   2（市场）           → /order/order/changeMarketOrderStatus
 *   19（转赠）          → /order/order/changeGiveOrderStatus
 */
export function changeOrderStatus(params = {}) {
  const type = Number(params.order_type)
  const path = type === 2
    ? '/order/order/changeMarketOrderStatus'
    : type === 19
      ? '/order/order/changeGiveOrderStatus'
      : '/order/order/changeOrderStatus'
  return withMock(
    () => post(path, params),
    () => ok(null, '操作成功')
  )
}

/**
 * 市场（寄售）订单详情，原站 getMarketOrderDetails（模块 7db7）
 *   POST /order/order/saleMarketOrderDetail  body { order_id }
 *   实调（2026-10-25）：该账号无寄售订单，接口返回 code 0「订单不存在」→ 走 mock
 */
export function getMarketOrderDetails(orderId) {
  return withMock(
    () => post('/order/order/saleMarketOrderDetail', { order_id: orderId }),
    () => ok(getMarketOrderDetailMock(orderId), '订单详情')
  )
}

/**
 * 转赠订单详情，原站 getRegiftOrderDetails（模块 7db7）
 *   POST /order/order/giveOrderDetail/ids/{id}  （无 body，id 拼在 URL 上）
 *   实调（2026-10-25）：POST /order/order/giveOrderDetail/ids/40021
 *     → {code:0, msg:"找不到该订单或已被删除", data:null}（该账号无转赠订单）→ 走 mock
 *   入口：订单列表 OrderItem.toDetail 中 order_type == 19 时跳本页
 *     （query: { id, orderType }，见 all2/pages-order-list.8eca8ff0.js 模块 927f）
 */
export function getRegiftOrderDetails(orderId) {
  return withMock(
    () => post(`/order/order/giveOrderDetail/ids/${orderId}`),
    () => ok(getRegiftOrderDetailMock(orderId), '订单详情')
  )
}

/**
 * 取消寄售，原站 changeMarketGoods（模块 3fd1，pages/blindBox/blindBoxDetails.js 内）
 *   POST /market/market/changeMarketGoods  body { id }
 */
export function changeMarketGoods(params = {}) {
  return withMock(
    () => post('/market/market/changeMarketGoods', params),
    () => {
      markConsignCanceled(params.id)
      return ok(null, '操作成功')
    }
  )
}

/** E卡密码，原站 getECardPass → /crystal_goods/getCardCode */export function getECardPass(params = {}) {
  return withMock(
    () => post('/crystal_goods/getCardCode', params),
    () => ok('8842 6190', '获取成功')
  )
}

/** 批量下单，原站 bacthCreateOrder → /order/pay/batchBuy */
export function batchCreateOrder(params = {}) {
  return withMock(
    () => post('/order/pay/batchBuy', params),
    () => ok(null, '下单成功')
  )
}

/** 盲目盒接口（pages/product/box、pages/blindBox/*） ---------------- */

/**
 * 盲盒详情，原站 getBoxDetails → /box/blind_box/BoxDetail/ids/{id}
 * post + query param { origin, crystal_goods_id }
 * 实调（2026-10-20）：id 1-120 全部返回「找不到该盲盒，或者已经下架了」，原站当前无在售盲盒
 */
export function getBoxDetail(params = {}) {
  const { id, origin, crystal_goods_id: crystalGoodsId } = params
  return withMock(
    () => post(`/box/blind_box/BoxDetail/ids/${id}`, { origin, crystal_goods_id: crystalGoodsId }),
    () => ok(BLIND_BOX_DETAIL, '盲盒详情')
  )
}

/**
 * 开盒记录（原站 getOpenRecord → /box/blind_box/openlog）
 * body { blind_box_id, page, list_rows }
 * 实调 2026-10-25：{ code:1, msg:"开盲盒记录", data:{ total:0, per_page:"20", current_page:1, last_page:0, data:[] } }
 */
export function getOpenRecord(params = {}) {
  const payload = {
    blind_box_id: params.blind_box_id ?? '',
    page: params.page ?? 1,
    list_rows: params.list_rows ?? 20
  }
  return withMock(
    () => post('/box/blind_box/openlog', payload),
    () => ok(BLIND_BOX_OPEN_LOG, '开盲盒记录')
  )
}

/** 单个开盒，原站 openBox → /user_collection/user_collection/openbox（body { openid }） */
export function openBox(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/openbox', params),
    () => ok(null, '开盒成功')
  )
}

/** 批量开盒，原站 openBoxs → /user_collection/user_collection/openBoxs（body { openid }） */
export function openBoxs(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/openBoxs', params),
    () => ok(null, '开盒成功')
  )
}

/**
 * 抽签报名，原站 signUpDraw({ goods_id, goods_type, helpucode?, newuser? })
 */
export function signUpDraw(params = {}) {
  return withMock(
    () => post('/draw/doQualification', params),
    () => ok(SIGN_UP_INFO, '报名成功')
  )
}

/**
 * 抽签结果/签号查询，原站 drawLog → /draw/drawLog({ id })
 * 返回 { whether_res: -1未开奖/0未中签/1中签, my_code: [], my_draw_num }
 */
export function getDrawLog(params = {}) {
  return withMock(
    () => post('/draw/drawLog', params),
    () => ok(DRAW_CODE_INFO, '抽签结果')
  )
}

/**
 * 活动信息 /draw/get（原站 pages/draw/Leaderboard 使用）
 * 实调 2026-10-25：{ code:0, msg:"活动不存在" } → 参与人数 0
 */
export function getDrawInfo(params = {}) {
  const payload = { id: params.id ?? '' }
  return withMock(
    () => post('/draw/get', payload),
    () => ok(DRAW_LEADERBOARD, '活动不存在')
  )
}

/** 抽签说明（配置项，来自 /index/getConfig 的 draw_lots_notice） */
export function getDrawLotsNotice() {
  return withMock(
    () => post('/index/getConfig'),
    () => ok({ draw_lots_notice: DRAW_LOTS_NOTICE }, '抽签说明')
  )
}

/* ---------------- 我的藏品页 pages/myCollection/myCollection ---------------- */

/**
 * 我的藏品列表（原站 antMycollection）
 * POST /user_collection/user_collection/antMycollection
 * 参数：{ types, page, collection_id? }
 *   types: 2 藏品 / 1 盲盒 / 3 已售（6 寄售走 myConsignment）
 * 返回：{ total, per_page, current_page, last_page, data: [] }
 */
export function getMyCollection(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/antMycollection', params),
    () => ok(getMyCollectionMock(params), '获取成功')
  )
}

/**
 * 我的寄售列表（原站 myConsignment）
 * POST /order/order/myConsignment
 * 参数：{ status, goods_type, page }
 */
export function getMyConsignment(params = {}) {
  return withMock(
    () => post('/order/order/myConsignment', params),
    () => ok(getMyConsignmentMock(params), '寄售列表')
  )
}

/**
 * 藏品搜索建议（原站 likeCollection）
 * POST /user_collection/user_collection/likeCollection  { keyword }
 */
export function likeCollection(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/likeCollection', params),
    () => ok(LIKE_COLLECTION_LIST, '获取成功')
  )
}

/**
 * 用户藏品详情（popDetails 内调用）
 * POST /user_collection/user_collection/getDetail  { collection_id, types, page }
 */
export function getUserCollectionDetail(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/getDetail', params),
    () => ok(USER_COLLECTION_DETAIL, '获取成功')
  )
}

/* ==================== 第 14 页：寄售发起页 ==================== */

/**
 * 寄售详情（原站 getUserCollectionDetails）
 * POST /user_collection/user_collection/detail/ids/{id1,id2}
 * 传逗号分隔的多份 id（批量寄售时多件同系列）
 */
export function getConsignDetail(ids = '') {
  return withMock(
    () => post(`/user_collection/user_collection/detail/ids/${ids}`),
    () => ok(getConsignDetailMock(ids), '获取成功')
  )
}

/**
 * 寄售配置（原站 getSellConfig）
 * POST /user_collection/user_collection/show_resale_money
 * 参数：{ price: 100, user_collection_id }
 */
export function getSellConfig(userCollectionId) {
  return withMock(
    () => post('/user_collection/user_collection/show_resale_money', { price: 100, user_collection_id: userCollectionId }),
    () => ok(SELL_CONFIG, '获取成功')
  )
}

/**
 * 确认寄售（原站 sellProduct）
 * POST /user_collection/user_collection/resale          单件
 * POST /user_collection/user_collection/batch_resale    多件（user_collection_id 含逗号）
 * 参数：{ user_collection_id, price, pay_password, income_type }
 */
export function sellProduct(params = {}) {
  const ids = String(params.user_collection_id || '')
  const url = ids.split(',').length > 1
    ? '/user_collection/user_collection/batch_resale'
    : '/user_collection/user_collection/resale'
  return withMock(
    () => post(url, params),
    () => ok(SELL_PRODUCT_RESULT, '寄售成功')
  )
}

/* ==================== 第 15 页：藏品详情页 ==================== */

/**
 * 藏品详情（原站 getUserCollectionDetails，与寄售页共用同一接口）
 * POST /user_collection/user_collection/detail/ids/{id}
 *   路径参数 id = user_collection.id
 *   前端按 id 分流 mock：30021 普通藏品可寄售 / 30022 盲盒 / 30023 寄售中（取消寄售）
 *   30024 赠送中 / 30025 未开启寄售（禁用态）
 */
export function getCollectionDetail(id = '') {
  const mock = String(id) === '30025' ? getCollectionNoWeitherMock(id) : getCollectionDetailMock(id)
  return withMock(
    () => post(`/user_collection/user_collection/detail/ids/${id}`),
    () => ok(mock, '获取成功')
  )
}

/* ==================== 第 16 页：发起转赠页 ==================== */

/**
 * 搜索用户（原站 searchUser，模块 fc5e）
 * POST /user/ParamsToUser   body { phone }
 *   phone 支持 uid / 手机号 / 钱包地址
 */
export function searchUser(params = {}) {
  return withMock(
    () => post('/user/ParamsToUser', params),
    () => {
      const data = getRegiftUserMock(params.phone)
      return data ? ok(data, '用户列表') : { code: 0, msg: '用户不存在', data: null }
    }
  )
}

/**
 * 确认转赠（原站 givingProduct，模块 0167）
 * POST /user_collection/user_collection/reGift
 * body { pay_password, re_user_id, user_collection_id, price }
 */
export function givingProduct(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/reGift', params),
    () => ok(GIVING_RESULT, '赠送成功')
  )
}

/* ==================== 第 17 页：转赠记录页 ==================== */

/**
 * 转赠记录（原站 getGiveRecord，模块 0167）
 * POST /user/aboutGift   body { page, types }
 *   types=1 我转赠的；types=2 我收到的
 *   响应 data { total, per_page, current_page, last_page, data: [] }
 */
export function getGiveRecord(params = {}) {
  return withMock(
    () => post('/user/aboutGift', params),
    () => ok(getGiveRecordMock(params), '转赠记录')
  )
}

/* ==================== P1 批次：我的模块（about/privacy/service/join/other-power/info/cancellation/address-edit） ==================== */

/**
 * 更新个人资料（原站真实端点）
 * POST /user/profile   body { nickname? , avatar? , ... }
 */
export function setProfile(params = {}) {
  return withMock(
    () => post('/user/profile', params),
    () => ok({}, '设置成功')
  )
}

/**
 * 注销账号（原站真实端点）
 * POST /user/delAccount
 */
export function delAccount(params = {}) {
  return withMock(
    () => post('/user/delAccount', params),
    () => ok({}, '注销成功')
  )
}

/**
 * 隐私设置-对外隐藏所有藏品
 * 原站端点未在反编译产物中捕获，按 /user/profile 携带 hide_collection 字段推断
 */
export function setHideCollection(params = {}) {
  return withMock(
    () => post('/user/profile', params),
    () => ok({}, '设置成功')
  )
}

/**
 * 保存收货地址
 * 原站端点未捕获，推断 POST /user/addAddress
 * body { name, mobile, region, address, is_default }
 */
export function addAddress(params = {}) {
  return withMock(
    () => post('/user/addAddress', params),
    () => ok({}, '添加成功')
  )
}

/* ==================== P1 批次：流转记录 / 会员中心 / 我的钱包 ==================== */

/**
 * 流转记录（原站真实端点，pages/my/flowDoc 实调）
 * POST /user_collection/user_collection/getRecord  body { page }
 * 实调（2026-10-25，测试账号）：{ code:0, msg:"参数错误" }（原站还需 types 等参数），
 * 页面据此显示空态（search-empty.png）→ mock 与原站行为对齐返回空列表
 */
export function getFlowRecord(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/getRecord', { page: 1, ...params }),
    () => ok({ total: 0, per_page: 20, current_page: 1, last_page: 1, data: [] }, '查询成功')
  )
}

/**
 * 易宝钱包开户 / 进入钱包（原站真实端点，pages/wallet/wallet 点击「进入钱包」实调）
 * POST /wallet/yibao/openAccount
 * 实调（2026-10-25）：返回后页面跳转易宝钱包 H5：
 *   https://yvwallet.yeepay.com/wallet/index.html?t={ts}#/pages/fund/index?token={token}
 * mock 返回同构 URL（MOCK 占位 token，跳转后由易宝侧提示无效，属外部系统预期行为）
 */
export function openYibaoAccount(params = {}) {
  return withMock(
    () => post('/wallet/yibao/openAccount', params),
    () => ok({
      url: `https://yvwallet.yeepay.com/wallet/index.html?t=${Math.floor(Date.now() / 1000)}#/pages/fund/index?token=MOCK_WALLET_TOKEN`
    }, 'ok')
  )
}

/* ==================== P0 批次：13 个断链目标页接口 ==================== */

/**
 * 收货地址列表（原站真实端点，pages/my/address/list 实调 2026-10-25）
 * POST /user/address_list
 * 实调：{ code:1, msg:"地址列表", data:[] } → 原站渲染 addr-empty-dark.webp 空态
 */
export function getAddressList() {
  return withMock(
    () => post('/user/address_list'),
    () => ok(ADDRESS_LIST, '地址列表')
  )
}

/**
 * 公告详情（原站真实端点，pages/notice/noticeDetails 实调 2026-10-26）
 * POST /index/afficheDetail/ids/{id}
 * 实调（带真实 id=59）：{ code:1, msg:"详情", data:{ id, title, content(HTML), createtime, affiche_type_id, ... } }
 * 实调（ids/undefined 或已删除 id）：{ code:0, msg:"这条消失不见了", data:null }
 */
export function getAfficheDetail(id = '') {
  return withMock(
    () => post(`/index/afficheDetail/ids/${id}`),
    () => {
      const hit = AFFICHE_DETAILS[String(id)]
      if (hit) return ok(hit, '详情')
      return {
        code: 0,
        msg: '这条消失不见了',
        time: String(Math.floor(Date.now() / 1000)),
        data: null
      }
    }
  )
}

/**
 * 公告搜索（原站真实端点，pages/notice/search 输入关键词实调 2026-10-25）
 * POST /index/afficheList  body { search, page }
 * 实调（search="嗒"）：{ code:1, msg:"公告列表", data:{ total:11, per_page:15, current_page:1, last_page:1, data:[...] } }
 */
export function searchAfficheList(keyword = '', page = 1) {
  return withMock(
    () => post('/index/afficheList', { search: keyword, page }),
    () => {
      const base = AFFICHE_LIST_BY_CATEGORY[0] || AFFICHE_LIST
      const kw = String(keyword).trim()
      const data = kw
        ? (base.data || []).filter((it) => (it.title || '').includes(kw))
        : (base.data || [])
      return ok({ ...base, total: data.length, current_page: page, last_page: 1, data }, '公告列表')
    }
  )
}

/**
 * 寄售搜索（原站真实端点，pages/consignments/search 输入关键词实调 2026-10-25）
 * POST /order/order/myConsignment  body { keyword, status, goods_type, page }
 * 实调（keyword="嗒"）：{ code:1, msg:"寄售列表", data:{ total:0, per_page:10, current_page:1, last_page:0, data:[] } }
 */
export function searchMyConsignment(params = {}) {
  const payload = {
    keyword: params.keyword ?? '',
    status: params.status ?? '',
    goods_type: params.goods_type ?? '',
    page: params.page ?? 1
  }
  return withMock(
    () => post('/order/order/myConsignment', payload),
    () => ok(MY_CONSIGNMENT_SEARCH, '寄售列表')
  )
}

/**
 * 龙晶商城列表（原站真实端点，pages/shop/shop 实调 2026-10-25）
 * POST /crystal_goods/list  body { type:"10", page:1, crystal_type:"blue" }
 * 实调：{ code:1, msg:"successfully !!!", data:{ total:0, per_page:15, current_page:1, last_page:0, data:[] } }
 */
export function getCrystalGoodsList(params = {}) {
  const payload = {
    type: params.type ?? '10',
    page: params.page ?? 1,
    crystal_type: params.crystal_type ?? 'blue'
  }
  return withMock(
    () => post('/crystal_goods/list', payload),
    () => ok(CRYSTAL_GOODS_LIST, 'successfully !!!')
  )
}

/**
 * 水晶明细列表（原站真实端点，pages/shop/detailList 实调 2026-10-25）
 * POST /crystal_goods/crystalDetail  body { page, cat, type, m }
 *   cat = "" | "1"（水晶获取）| "-1"（水晶消耗）
 *   type = "" | "yellow" | "purple" | "blue"（种类筛选）
 *   m = 时间筛选（月份字符串）
 * 实调：{ code:1, msg:"successfully !!!", data:{ total:0, per_page:15, current_page:1, last_page:0, data:[] } }
 */
export function getCrystalDetailList(params = {}) {
  const payload = {
    page: params.page ?? 1,
    cat: params.cat ?? '',
    type: params.type ?? '',
    m: params.m ?? ''
  }
  return withMock(
    () => post('/crystal_goods/crystalDetail', payload),
    () => ok(CRYSTAL_DETAIL_LIST, 'successfully !!!')
  )
}

/**
 * 水晶兑换记录（原站真实端点，pages/shop/record 实调 2026-10-25）
 * POST /crystal_goods/exchangeRecord  body { page }
 * 实调：{ code:1, msg:"successfully !!!", data:{ total:0, per_page:15, current_page:1, last_page:0, data:[] } }
 */
export function getCrystalExchangeRecord(params = {}) {
  const payload = { page: params.page ?? 1 }
  return withMock(
    () => post('/crystal_goods/exchangeRecord', payload),
    () => ok(CRYSTAL_EXCHANGE_RECORD, 'successfully !!!')
  )
}

/**
 * 水晶商品详情（原站真实端点，pages/shop/detail/{collection|box|goods} 实调 2026-10-25）
 * POST /crystal_goods/info  body { goods_id, id, batch_id, blind_box_id }
 * 实调：{ code:0, msg:"商品不存在", data:null } → 原站 catch 后 1.5s backPage() 回退
 */
export function getCrystalGoodsInfo(params = {}) {
  const payload = {}
  if (params.goods_id != null) payload.goods_id = params.goods_id
  if (params.id != null) payload.id = params.id
  if (params.batch_id != null) payload.batch_id = params.batch_id
  if (params.blind_box_id != null) payload.blind_box_id = params.blind_box_id
  return withMock(
    () => post('/crystal_goods/info', payload),
    () => ({ code: 0, msg: '商品不存在', time: String(Math.floor(Date.now() / 1000)), data: CRYSTAL_GOODS_INFO })
  )
}

/**
 * 邀请活动配置（原站真实端点，pages/invitation/invitation 实调 2026-10-25）
 * POST /index/getConfig
 *   key = "sharebg,copyright,sharebtn1,sharerulebtn,sharerulebg,share_bac_iamge,invitation_bg_color,h5_invite_url"
 */
export function getInvitationConfig() {
  return withMock(
    () => post('/index/getConfig', {
      key: 'sharebg,copyright,sharebtn1,sharerulebtn,sharerulebg,share_bac_iamge,invitation_bg_color,h5_invite_url'
    }),
    () => ok(INVITATION_CONFIG, '基本配置')
  )
}

/**
 * 邀请活动助力榜单（原站真实端点，pages/invitation/invitation 实调 2026-10-25）
 * POST /user/ranking  body { page:1, types:2 }
 */
export function getInvitationRanking(params = {}) {
  const payload = { page: params.page ?? 1, types: params.types ?? 2 }
  return withMock(
    () => post('/user/ranking', payload),
    () => ok(INVITATION_RANKING, '查询成功')
  )
}

/**
 * 合成方案详情（原站真实端点，pages/compound/schemeDetails 实调 2026-10-25）
 * POST /synthesis/playInfo  body { play_id, grp, classify }
 * 实调（缺 query）：{ code:0, msg:"玩法不存在", data:null }
 */
export function getSynthesisPlayInfo(params = {}) {
  const payload = {
    play_id: params.play_id ?? '',
    grp: params.grp ?? '',
    classify: params.classify ?? ''
  }
  return withMock(
    () => post('/synthesis/playInfo', payload),
    () => ({ code: 0, msg: '玩法不存在', time: String(Math.floor(Date.now() / 1000)), data: SYNTHESIS_PLAY_INFO })
  )
}

/**
 * 我的盲盒列表（原站 pages/blindBox/index 实调 2026-10-25）
 * 该页原站仅调 /user/getUserInfo，盲盒数量取自 user.blind_box_num；
 * 列表渲染由前端按 blind_box_num 派生，无独立列表接口 → mock 返回空数组
 */
export function getMyBlindBoxList() {
  return withMock(
    () => post('/box/blind_box/my_list'),
    () => ok({ total: 0, per_page: 20, current_page: 1, last_page: 0, data: [] }, '查询成功')
  )
}

/**
 * 盲盒详情（原站真实端点，pages/blindBox/blindBoxDetails 实调 2026-10-25）
 * POST /user_collection/user_collection/detail/ids/{id}
 * 实调（缺 query id）：{ code:0, msg:"收藏不存在或者已经被删除了", data:null }
 */
export function getBlindBoxDetail(id = '') {
  return withMock(
    () => post(`/user_collection/user_collection/detail/ids/${id}`),
    () => ({
      code: 0,
      msg: '收藏不存在或者已经被删除了',
      time: String(Math.floor(Date.now() / 1000)),
      data: null
    })
  )
}

/**
 * 邀请好友助力记录（原站 pages/draw/InvitationFriendAssist/InvitationFriendAssist 实调 2026-10-25）
 * 该页原站无独立列表请求（助力数据由 URL 参数携带的助力上下文决定），
 * 实测渲染为「数据为空」空态 → mock 返回空列表
 */
export function getInviteAssistList(params = {}) {
  return withMock(
    () => post('/draw/assist/list', params),
    () => ok({ total: 0, per_page: 20, current_page: 1, last_page: 0, data: [] }, '查询成功')
  )
}

/**
 * 活动中心任务入口与商城商品（原站 pages/task/index 实调 2026-10-25）
 * POST /addons/diypage/index（首页装修，含任务页四宫格配置）
 * POST /synthesis/themeinfo（活动主题，测试账号返回 data:null）
 */
export function getTaskIndexData() {
  return withMock(
    () => post('/diypage/index', {}, { addons: true }),
    () => ok({ entries: TASK_ENTRY_LIST, mall: TASK_MALL_LIST }, '查询成功')
  )
}

/**
 * App 下载页配置（原站 pages/index/downloadApp 实调 2026-10-25）
 * 该页为纯静态页，原站仅调 /user/getUserInfo；
 * 下载地址取自 /index/getConfig 的 base_apk / ipa 字段
 */
export function getDownloadConfig() {
  return withMock(
    () => post('/index/getConfig', { key: 'base_apk,ipa,app_version,appName' }),
    () => ok({
      base_apk: CONFIG.base_apk,
      ipa: CONFIG.ipa,
      app_version: CONFIG.app_version,
      appName: CONFIG.appName
    }, '基本配置')
  )
}

/* ============================================================
 * 公告 / 盲盒 / 抽签 三模块（2026-10-25 登录态实调）
 * ============================================================ */

/**
 * 公告分类（原站 pages/notice/newsDetails 实调 2026-10-25）
 * POST /discover/ant_news/category
 * 实调：[{ id:2, name:"陕西数字化进程" }]
 */
export function getAntNewsCategory() {
  return withMock(
    () => post('/discover/ant_news/category'),
    () => ok(ANT_NEWS_CATEGORY, 'successfully !!!')
  )
}

/**
 * 公告列表（原站 pages/notice/newsDetails 模块）
 * POST /discover/ant_news/list  body { page }
 * 实调：{ total:0, per_page:15, current_page:1, last_page:0, data:[] }
 */
export function getAntNewsList(params = {}) {
  const payload = { page: params.page ?? 1 }
  if (params.category != null) payload.category = params.category
  return withMock(
    () => post('/discover/ant_news/list', payload),
    () => ok(ANT_NEWS_LIST, 'successfully !!!')
  )
}

/**
 * 公告详情（原站 pages/notice/newsDetails 实调 2026-10-25）
 * POST /discover/ant_news/info  body { id }
 * 实调：{ code:1, data:null } → 原站渲染「加载中...」遮罩（info 为空不渲染正文）
 */
export function getAntNewsInfo(params = {}) {
  const payload = { id: params.id ?? '' }
  return withMock(
    () => post('/discover/ant_news/info', payload),
    () => ok(ANT_NEWS_INFO, 'successfully !!!')
  )
}

/**
 * 辟谣墙列表（原站 pages/notice/wallDetails 实调 2026-10-25）
 * POST /discover/rumor_wall/list  body { page }
 * 实调：{ total:0, ... }
 */
export function getRumorWallList(params = {}) {
  const payload = { page: params.page ?? 1 }
  return withMock(
    () => post('/discover/rumor_wall/list', payload),
    () => ok(RUMOR_WALL_LIST, 'successfully !!!')
  )
}

/**
 * 辟谣墙详情（原站 pages/notice/wallDetails 实调 2026-10-25）
 * POST /discover/rumor_wall/info  body { id }
 * 实调：{ code:1, data:null }
 */
export function getRumorWallInfo(params = {}) {
  const payload = { id: params.id ?? '' }
  return withMock(
    () => post('/discover/rumor_wall/info', payload),
    () => ok(RUMOR_WALL_INFO, 'successfully !!!')
  )
}

/**
 * 辟谣墙评论（原站 pages/notice/wallDetails 实调 2026-10-25）
 * POST /discover/rumor_wall/getcomment  body { id, page }
 * 实调：{ total:0, ... }
 */
export function getRumorWallComment(params = {}) {
  const payload = { id: params.id ?? '', page: params.page ?? 1 }
  return withMock(
    () => post('/discover/rumor_wall/getcomment', payload),
    () => ok(RUMOR_WALL_COMMENT, 'successfully !!!')
  )
}

/**
 * 发表评论（原站 pages/notice/wallDetails）
 * POST /discover/rumor_wall/comment  body { id, content }
 * 实调：{ code:0, msg:"辟谣ID不能为空" }
 */
export function postRumorWallComment(params = {}) {
  const payload = { id: params.id ?? '', content: params.content ?? '' }
  return withMock(
    () => post('/discover/rumor_wall/comment', payload),
    () => ({ code: 0, msg: '辟谣ID不能为空', time: String(Math.floor(Date.now() / 1000)), data: null })
  )
}

/**
 * 发表辟谣（原站 pages/notice/sendRumor 实调 2026-10-25）
 * POST /discover/rumor_wall/release  body { content, image[], is_anonymous }
 * 实调：{ code:0, msg:"图片不能为空" }（缺图片时原站报此错）
 */
export function releaseRumorWall(params = {}) {
  const payload = {
    content: params.content ?? '',
    image: params.image ?? [],
    is_anonymous: params.is_anonymous ?? 0
  }
  return withMock(
    () => post('/discover/rumor_wall/release', payload),
    () => ({ code: 0, msg: '图片不能为空', time: String(Math.floor(Date.now() / 1000)), data: null })
  )
}

/**
 * 抽签资格/结果（原站 pages/draw/drawResult/drawResult 实调 2026-10-25）
 * POST /draw/get  body { form }
 * 实调：{ code:0, msg:"活动不存在" } → 原站保持 loading 遮罩
 */
export function getDrawQualification(params = {}) {
  const payload = { form: params.form ?? {} }
  return withMock(
    () => post('/draw/get', payload),
    () => ({ code: 0, msg: '活动不存在', time: String(Math.floor(Date.now() / 1000)), data: DRAW_QUALIFICATION })
  )
}

/**
 * 社群分享详情（原站 pages/draw/shareCommunityGroup 实调 2026-10-25）
 * POST /score/get_my_share_details
 * 实调：{ code:1, data:null }
 */
export function getMyShareDetails() {
  return withMock(
    () => post('/score/get_my_share_details'),
    () => ok(SHARE_DETAILS, 'successfully !!!')
  )
}

/**
 * 助力记录（原站 pages/draw/communityShare）
 * POST /score/get_my_share_details → 实调 data:null
 */
export function getHelpRecord() {
  return withMock(
    () => post('/score/get_my_share_details'),
    () => ok(HELP_RECORD, 'successfully !!!')
  )
}

/**
 * 社群规则文案（原站 pages/draw/shareCommunityGroup）
 * POST /index/getConfig { key:"share_rule" } → 实调 "<p>1.111</p><p>2.222</p>"
 */
export function getShareRule() {
  return withMock(
    () => post('/index/getConfig', { key: 'share_rule' }),
    () => ok({ share_rule: SHARE_RULE_HTML }, '基本配置')
  )
}

/* ============================================================
 * K线 / 抽签 / 抽奖 / 交易记录 批次（2026-10-25 实调原站）
 * ============================================================ */

/**
 * K线行情详情 —— 原站 pages/kline/info
 * 该页不主动发请求（数据来自商城页缓存的 marketGoods），
 * 实调 /market/market/marketGoodsDetail {id:1} → code 500，
 * 故 mock 提供完整行情数据（比太 / 112.34CNY / -0.53% / 6 项指标）。
 */
export function getKlineInfo(params = {}) {
  return withMock(
    () => post('/market/market/marketGoodsDetail', { type: '2', ...params }),
    () => ok(KLINE_INFO, '操作成功')
  )
}

/**
 * K线购买页 —— 原站 pages/kline/buy
 * 与 info 页共用 market 缓存数据（凤吹晚霞 / 112.34CNY / -0.53%）。
 */
export function getKlineBuy(params = {}) {
  return withMock(
    () => post('/market/market/marketGoodsDetail', { type: '2', ...params }),
    () => ok(KLINE_BUY, '操作成功')
  )
}

/**
 * 交易信息 —— 原站 pages/market/tradingInformation
 * POST /market/trade/tradingInformation
 *   body { page, sort, id, status, goods_id }
 * 实调：today_highest_price / today_lowest_price 均为 "7.00"，list 为空。
 */
export function getTradingInformation(params = {}) {
  return withMock(
    () => post('/market/trade/tradingInformation', {
      page: 1, sort: 'price', id: '', status: 1, goods_id: '', ...params
    }),
    () => ok(TRADING_INFORMATION, '交易信息')
  )
}

/**
 * 抽签活动详情 —— 原站 pages/activity/draw
 * POST /draw/get { id } → 实调 { code:0, msg:"活动不存在", data:null }
 * mock 返回 exists:false，页面据此展示 toast「活动不存在」。
 */
export function getDrawActivity(params = {}) {
  return withMock(
    () => post('/draw/get', { id: params.id ?? '' }),
    () => ok(DRAW_ACTIVITY, '活动不存在')
  )
}

/**
 * 我的抽签记录 —— 原站 pages/activity/draw
 * POST /draw/drawRecord → 实调 { code:1, data:[] }
 */
export function getDrawActivityRecord(params = {}) {
  return withMock(
    () => post('/draw/drawRecord', params),
    () => ok([], '获取成功')
  )
}

/**
 * 中奖记录页奖品列表 —— 原站 pages/lottery/record
 * POST /lottery/statistics { lottery_id } → 实调返回 2 个奖品
 */
export function getLotteryPrizeList(params = {}) {
  return withMock(
    () => post('/lottery/statistics', { lottery_id: params.lottery_id ?? '' }),
    () => ok(LOTTERY_PRIZE_LIST, 'successfully !!!')
  )
}

/**
 * 抽奖记录 —— 原站 pages/lottery/record 下方卡片
 * POST /lottery/record { type, lottery_id, page } → 实调 total 0
 */
export function getLotteryDrawLog(params = {}) {
  return withMock(
    () => post('/lottery/record', { type: 10, page: 1, ...params }),
    () => ok(LOTTERY_DRAW_LOG, 'successfully !!!')
  )
}

/**
 * 活动规则 —— 原站 pages/lottery/rule
 * 内容取自 /index/getConfig 的 share_rule 字段（实调 "<p>1.111</p><p>2.222</p>"）。
 */
export function getLotteryRule() {
  return withMock(
    () => post('/index/getConfig'),
    () => ok({ share_rule: SHARE_RULE_HTML }, '基本配置')
  )
}

/* ==================== 合成 / 榜单批次（2026-10-26） ==================== */

/**
 * 合成记录列表 —— 原站 pages/compound/record
 * POST /synthesis/recordList { page } → 实调 total 0，data []
 */
export function getSynthesisRecordList(params = {}) {
  return withMock(
    () => post('/synthesis/recordList', { page: 1, ...params }),
    () => ok(SYNTHESIS_RECORD_LIST, 'successfully !!!')
  )
}

/**
 * 合成结果详情 —— 原站 pages/compound/result
 * POST /synthesis/recordInfo → 实调 { code:0, msg:"记录不存在", data:null }
 */
export function getSynthesisRecordInfo(params = {}) {
  return withMock(
    () => post('/synthesis/recordInfo', params),
    () => ok(SYNTHESIS_RECORD_INFO, '记录不存在')
  )
}

/**
 * 龙虎榜 —— 原站 pages/rank/rankList
 * POST /user/newrank1 → 实调 { headUser:[], list:[], rank1:[], rank2:[] }
 */
export function getUserNewRank(params = {}) {
  return withMock(
    () => post('/user/newrank1', params),
    () => ok(USER_NEW_RANK, '成功')
  )
}

/**
 * 大师信息 —— 原站 pages/rank/userBuy
 * POST /user/masterinfo → 实调 { code:1, data:[] }
 */
export function getUserMasterInfo(params = {}) {
  return withMock(
    () => post('/user/masterinfo', params),
    () => ok(USER_MASTER_INFO, '成功')
  )
}

/**
 * 大师动态列表 —— 原站 pages/rank/masterRank
 * POST /user/masterlist { page } → 实调 { code:1, data:[] }
 */
export function getUserMasterList(params = {}) {
  return withMock(
    () => post('/user/masterlist', { page: 1, ...params }),
    () => ok(USER_MASTER_LIST, '成功')
  )
}

/**
 * 排行榜 —— 原站 pages/leaderboard/leaderboard
 * POST /user/ranking { types } → 实调 { data:[], my:"", activityRule:"" }
 */
export function getUserRanking(params = {}) {
  return withMock(
    () => post('/user/ranking', { types: 1, ...params }),
    () => ok(USER_RANKING, '查询成功')
  )
}

/* ==================== 收尾批次：活动 / 工会 / 分类 / 搜索 / 返佣 ==================== */

/**
 * 活动分类 —— 原站 pages/activeSelected/activeSelected
 * POST /Activity/category → 实调 { code:1, data:[] }
 */
export function getActivityCategory() {
  return withMock(
    () => post('/Activity/category', {}),
    () => ok(ACTIVITY_CATEGORY, '分类列表')
  )
}

/**
 * 活动列表 —— 原站 pages/activeSelected/activeSelected
 * POST /activity/index { page, limit, category_id } → 实调 total 0，data []
 */
export function getActivityIndex(params = {}) {
  return withMock(
    () => post('/activity/index', { page: 1, limit: 10, category_id: 1, ...params }),
    () => ok(ACTIVITY_INDEX, '请求成功')
  )
}

/**
 * 中签记录 —— 原站 pages/activity/record
 * POST /draw/drawLog → 实调 { code:1, data:[] }
 */
export function getActivityDrawLog(params = {}) {
  return withMock(
    () => post('/draw/drawLog', params),
    () => ok(DRAW_LOG, '获取成功')
  )
}

/**
 * 我的公会 —— 原站 pages/union/tradeUnion、pages/union/news
 * POST /union/user/myunion → 实调 { code:1, data:{ config, my } }，测试账号 is_join=0
 */
export function getUnionMyUnion(params = {}) {
  return withMock(
    () => post('/union/user/myunion', params),
    () => ok(UNION_MY_UNION, '成功')
  )
}

/**
 * 工会排行榜 —— 原站 pages/union/unionRank
 * POST /union/index/logs { types, page, pageSize } → 实调 { code:1, data:[] }
 */
export function getUnionRankLogs(params = {}) {
  return withMock(
    () => post('/union/index/logs', { types: 1, page: 1, pageSize: 15, ...params }),
    () => ok(UNION_RANK_LOGS, '工会排行榜')
  )
}

/**
 * 工会成员排行榜 —— 原站 pages/union/userRank
 * POST /union/user/logs { types } → 实调 { code:0, msg:"工会不存在", data:null }
 */
export function getUnionUserLogs(params = {}) {
  return withMock(
    () => post('/union/user/logs', { types: 1, ...params }),
    () => ok(UNION_USER_LOGS, '工会不存在')
  )
}

/**
 * 工会消息通知 —— 原站 pages/union/news
 * POST /union/user/message → 实调 { code:500, msg:"An error occurred", data:null }
 */
export function getUnionMessage(params = {}) {
  return withMock(
    () => post('/union/user/message', params),
    () => ok(UNION_MESSAGE, 'An error occurred')
  )
}

/**
 * 返佣概览 —— 原站 pages/rebate/rebate
 * POST /user/commision_info → 实调响应体为空，页面永久「加载中...」
 */
export function getCommissionInfo(params = {}) {
  return withMock(
    () => post('/user/commision_info', params),
    () => ok(COMMISSION_INFO, 'successfully !!!')
  )
}

/**
 * 被邀请人清单 —— 原站 pages/rebate/rebateInviteDetail
 * POST /user/bei_yao_list → 实调响应体为空
 */
export function getBeiYaoList(params = {}) {
  return withMock(
    () => post('/user/bei_yao_list', params),
    () => ok(BEI_YAO_LIST, 'successfully !!!')
  )
}

/**
 * 返佣排行榜 —— 原站 pages/rebate/leaderboard
 * POST /user/commison_rank { type } → 实调响应体为空（type: 1 日 / 2 周 / 3 月）
 */
export function getCommissionRank(params = {}) {
  return withMock(
    () => post('/user/commison_rank', { type: 1, ...params }),
    () => ok(COMMISSION_RANK, 'successfully !!!')
  )
}

/**
 * 分类系列 —— 原站 pages/market/categoryManager
 * POST /index/getSeries?type=10 → 实调 [{ series_name:"潜龙聚财", series_id:28, ... }]
 */
export function getCategorySeries(type = 10) {
  return withMock(
    () => post(`/index/getSeries?type=${type}`, {}),
    () => ok(type === 10 ? CATEGORY_SERIES_10 : CATEGORY_SERIES_20, '系列')
  )
}

/**
 * 自定义分类列表 —— 原站 pages/market/categoryManager
 * POST /index/customSeriesList → 实调 { custom_series:[], platform_series:[] }
 */
export function getCustomSeriesList(params = {}) {
  return withMock(
    () => post('/index/customSeriesList', params),
    () => ok(CUSTOM_SERIES_LIST, 'successfully!!!')
  )
}
