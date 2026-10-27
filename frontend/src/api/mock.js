/**
 * 本地 Mock 数据 —— 全部取自原站真实接口响应（见 docs/_recon_raw/home_apis.json）
 * 本项目独立运行，不依赖原站任何服务。
 * ThinkPHP 后端就绪后，api/index.js 会自动切换到真实后端。
 */

export const CONFIG = {
  pay_time_limit: '180',
  app_version: '1.1.2',
  service_mobile: '#',
  service_image: '/assets/img/641fb93746a2b4b145c6ce0479225bb7.png',
  h5_domain: '/',
  resell_collection: '1',
  transfer_collection: '1',
  h5_invite_url: '/#/pages/login/register?a=1',
  appLogo: '/assets/img/641fb93746a2b4b145c6ce0479225bb7.png',
  appBigLogo: '/assets/img/641fb93746a2b4b145c6ce0479225bb7.png',
  appName: '嗒嗒',
  puzzleCaptcha: '0',
  copyright: '[]',
  certification: '',
  cancellation:
    '<p>&nbsp;帐号安全状态：&nbsp;</p><p>您的账号没有被盗风险及违规行为</p><p>&nbsp;帐号安全状态：&nbsp;</p><p>1、无法登录；&nbsp;</p><p>2、所有信息将用于删除和清理（包括加入社区、账户余额、发布动态、聊天记录等）；</p><p>3、绑定手机/微信/AppleID/人脸认证等将会解绑；&nbsp;</p><p>4、其他不限于以上所列举的你的账号的资产和权益。&nbsp;</p>',
  consignment_sales: '<br />',
  isAgreement: '1',
  /* 原站实调（2026-10-25 POST /index/getConfig {key:"vip_agreement,vip_time"}）
     vip_time=2678400（会员时长 31 天，秒）；会员中心 svip 页数据源 */
  vip_time: '2678400',
  vip_agreement: '',
  strategy: '',
  base_apk: '/download/tata.apk',
  ipa: '/download/tata.mobileconfig',
  aboutus: '',
  fastOrder_check: '0',
  batchBuy_check: '0',
  normal_check: '0',
  synthetic_check: '0',
  service_email: '1',
  olduser_dayhelp_num: '1',
  score_helpdraw_sub: '20',
  draw_lots_rule: '',
  draw_code_rankrule: '',
  helpdraw_rule: '',
  draw_lots_notice: '',
  share_rule: '<p>1.111</p><p>2.222</p>',
  draw_share_assimage: '',
  draw_share_assrule: '',
  risk_warning:
    '数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。',
  qq_team_num: '11273',
  purchase_sale_details: '1',
  default_pay_type: 'yibao',
  pay_audit: '0'
}

export const SERIES_LIST = [
  {
    series_name: '嗒嗒艺术',
    series_id: 24,
    is_def: 0,
    flag: 0,
    pattern: 1,
    resale_put_start_time: '01:52:55',
    resale_put_end_time: '01:52:55',
    resale_buy_start_time: '01:52:55',
    resale_buy_end_time: '01:52:55',
    current_price: '195.00',
    change_price: '100.00'
  }
]

export const AFFICHE_TYPE_LIST = [
  { id: 1, name: '运营公告' },
  { id: 2, name: '合成公告' },
  { id: 3, name: '分解公告' },
  { id: 4, name: '上新公告' },
  { id: 5, name: '活动公告' },
  { id: 6, name: '寄售公告' }
]

export const BANNER_LIST = {
  total: 2,
  per_page: 15,
  current_page: 1,
  last_page: 1,
  data: [
    {
      id: 2,
      image: '/assets/img/e924cc4b107e7a81ea9e81d8ed011ac9.png',
      url: 'http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=b0_eBZrTy6yBLSfiUJawjykv9ZEU3OCs&authKey=%2BQeJ1k2DYeU%2FYlVG3DvDtYis27am7nl8QB4e%2Bart9gp9cPda5VBePjrEAlja3aIG&noverify=0&group_code=1040721187',
      url_type: 3,
      is_show: 1
    },
    {
      id: 1,
      image: '/assets/img/535d8789aa3ce292689dcdc50da2b3d9.png',
      url: '/#/pages/index/downloadApp',
      url_type: 3,
      is_show: 1
    }
  ]
}

export const BLIND_BOX_LIST = [
  {
    id: 20,
    name: '打王神鞭',
    listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
    select_status: 0,
    price: '9.90',
    main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
    total_num: 20000,
    release_time: 1792404000,
    end_time: 1792404180,
    total_num_batch: 20000,
    release_date_time_text: '2026-10-19 18:00',
    createtime: 1792401933,
    type: 'collection',
    goods_type: '2',
    batch_id: '7',
    soldout: 0,
    fictitious_stock: 0,
    open_draw: 0,
    issuer_id: '0',
    flux: 0,
    total_num_show: 0,
    batch: { start_time: 1792404000, end_time: 1792404180, total_num: 20000, has_num: 1 },
    publisher: { name: '嗒嗒', company_logo: '/assets/img/641fb93746a2b4b145c6ce0479225bb7.png' },
    sale_status_text: 2,
    release_time_text: 531,
    release_time_date_text: '2026-10-19 18:00:00'
  }
]

/**
 * 支付方式列表 —— 原站 config.basePayList（index.js 中的真实常量）
 * [{ name:"易宝", icon:"yibao", key:"huifu_pay_status",
 *    auth_key:"yibao_status", pay_type:4, pay_way:"yibao", able:true }]
 *
 * 实调（2026-10-20）：`/index/getConfig {key:"huifu_pay_status"}` 返回
 * `{ huifu_pay_status:"0" }`（汇付关闭），`yibao_status` 返回 `[]`（无配置）。
 * 即原站当前**无可用支付通道**，下单按钮会因disable=true 而禁用。
 * 保留 able:true 以便联调时可见完整交互，实际可用性由 createOrder 返回码决定。
 */
export const BASE_PAY_LIST = [
  {
    name: '易宝',
    icon: 'yibao',
    key: 'huifu_pay_status',
    auth_key: 'yibao_status',
    pay_type: 4,
    pay_way: 'yibao',
    able: true
  }
]

/**
 * 盲盒详情 —— 原站 /box/blind_box/BoxDetail/ids/{id}
 *
 * ⚠️ 实调说明（2026-10-20）：原站盲盒 id 1–120 全部返回
 * 「找不到该盲盒，或者已经下架了」，当前无在售盲盒。
 * 故此处按原站字段结构 + 本项目已下载的原站真实藏品图构造，
 * 字段名与结构严格对齐反编译得到的 w-product-* 组件。
 *
 * 结构来源：chunk pages-product-box.js 的
 *   w-product-details-card(e788) / w-product-box(32e6) /
 *   w-product-introduce(ec26) / w-product-buy-need(a5d7) / w-product-action(84664)
 */
export const BLIND_BOX_DETAIL = {
  id: 20,
  name: '嗒嗒神武盲盒',
  goods_type: 1,
  '3d_url_type': 'img',
  '3d_url': '',
  main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  price: '9.90',
  total_num: 20000,
  flux: 0,
  purchasing_num: 5,
  sale_total_num: 0,
  release_time: 1792404000,
  end_time: 1792500000,
  is_sub: false,
  is_like: 0,
  crystal: 0,
  introduce_image:
    '<p>「嗒嗒神武盲盒」内置 4 款原创数字艺术藏品，<br>开盒后随机获得其中 1 款，编号随机分配。</p>',
  purchase_information:
    '<p>数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。</p>',
  publisher: {
    name: '嗒嗒',
    company_logo: '/uploads/20260912/641fb93746a2b4b145c6ce0479225bb7.png'
  },
  series: { id: 26, name: '神武专精' },
  /** 原站 w-product-box：可能抽到的作品（概率之和应为 100） */
  collectionlist: [
    {
      id: 20,
      name: '打王神鞭',
      listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      rarity_icon: '',
      probability: 40,
      show_total_num: 5000
    },
    {
      id: 18,
      name: '大闹天宫',
      listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      rarity_icon: '',
      probability: 30,
      show_total_num: 4000
    },
    {
      id: 26,
      name: '如意金箍棒',
      listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
      rarity_icon: '',
      probability: 20,
      show_total_num: 3000
    },
    {
      id: 27,
      name: '嗒卡',
      listimg: '/assets/img/market/447aea6b59117568a722045f1b20e199.jpg',
      rarity_icon: '',
      probability: 10,
      show_total_num: 2000
    }
  ]
}

/*
 * 本地 Mock 数据 —— 全部取自原站真实接口响应（见 docs/_recon_raw/home_apis.json）
 * 本项目独立运行，不依赖原站任何服务。
 * ThinkPHP 后端就绪后，api/index.js 会自动切换到真实后端。
 */


export const DIY_PAGE_HOME = [
  {
    id: 3145,
    type: 'menu',
    category: 'home',
    name: '菜单组',
    decorate_id: 2,
    content: JSON.stringify({
      name: '',
      style: 4,
      list: [
        { image: '/assets/img/46f70e3432e66698d04c227647f275b7.png', path: '/pages/lottery/lottery?id=1', name: 'APP下载', path_name: '', path_type: 2 },
        { name: '每日签到', image: '/assets/img/8e18e5c4ec6cc00a25aaa72445e47a57.png', path: '/pages/sign/index', path_name: '', path_type: 2 },
        { image: '/assets/img/44c52513339ab05ad43b99581d72460c.png', path: '/pages/invitation/invitation', name: '邀请好友', path_name: '', path_type: 2 },
        { image: '/assets/img/df110a316e49e2fe6ee49e467d1261a8.png', path: 'https://qm.qq.com/q/6YMsmDPSBa', name: '加入社群', path_name: '', path_type: 2 },
        { image: '/assets/img/a80c2e65946ebe354949fd4274fdb784.png', path: 'https://qm.qq.com/q/DPDbkvROWA', name: '联系客服', path_name: '', path_type: 2 }
      ]
    })
  },
  {
    id: 3146,
    type: 'centre',
    category: 'home',
    name: '中部合成',
    decorate_id: 2,
    content: JSON.stringify({
      name: '',
      style: 5,
      list: [
        { image: '', path: '/pages/compound/compound', name: '中部合成', path_name: '合成藏品', path_type: 1 }
      ]
    })
  },
  {
    id: 3147,
    type: 'popup',
    category: 'popup',
    name: '弹窗提醒',
    decorate_id: 2,
    content: JSON.stringify({
      list: [{ name: '', style: 1, image: '', btnimage: '', path: '', path_name: '', path_type: 1 }]
    })
  },
  {
    id: 3148,
    type: 'tabbar',
    category: 'tabbar',
    name: '底部导航',
    decorate_id: 2,
    content: JSON.stringify({
      style: 1,
      color: '#6D727B',
      activeColor: '',
      bgcolor: '#1F221D',
      list: [
        { name: '首页', image: '', activeImage: '', path: '/pages/index/index', path_name: '首页', path_type: 1 },
        { name: '我的', image: '', activeImage: '', path: '/pages/my/my', path_name: '我的', path_type: 1 }
      ]
    })
  },
  {
    id: 3149,
    type: 'user',
    category: 'user',
    name: '用户卡片',
    decorate_id: 2,
    content: JSON.stringify({ name: '用户卡片', image: '', style: 2, color: '#151714' })
  },
  {
    id: 3150,
    type: 'float-button',
    category: 'float-button',
    name: '悬浮按钮',
    decorate_id: 2,
    content: JSON.stringify({ image: '', list: [] })
  }
]

/** 当前登录用户（原站真实用户 4539 数据） */
export const MOCK_USER = {
  id: 4539,
  group_id: 0,
  username: '17587881293',
  nickname: 'tcE3upv0Lw',
  email: '',
  mobile: '17587881293',
  avatar: '/defautAvatar.png',
  level: 1,
  gender: 1,
  birthday: null,
  bio: '',
  money: '0.00',
  agent_money: null,
  score: 3,
  successions: 1,
  maxsuccessions: 1,
  prevtime: 1792385382,
  logintime: 1792403288,
  loginip: '43.143.213.81',
  loginfailure: 0,
  joinip: '117.136.113.97',
  jointime: 1792223485,
  createtime: 1792223485,
  updatetime: 1792403288,
  token: 'c17bef29-c046-46bf-b98a-1200bec44282',
  status: 'normal',
  verification: { email: 0, mobile: 0 },
  inviter_user_id: 0,
  inviter_code: 'L1224539',
  yao_count: 0,
  yao_count_uptime: 0,
  // 原站实调（2026-10-20）：real_name_authentication = 1（已实名）
  real_name_authentication: 1,
  ntf_url: 'VtqSEBd3hkNb0afvI5w2Q6LCsWgHOxjU',
  real_name: '王*绵',
  id_card: '520******838',
  id_card_front: null,
  id_card_back: null,
  collection_total_price: null,
  collection_num: 0,
  blind_box_num: 0,
  freeze: 0,
  buy_collection_total_price: null,
  ali_openid: null,
  option_pass: null,
  is_white: 0,
  service_price: '0.00',
  recharge_price: '0.00',
  xin_count: 0,
  pay_password: 0,
  inviter_status: 0,
  ll_id: null,
  virtual: 0,
  market_open: 1,
  person_intro: null,
  has_bank: 0,
  yttime: null,
  crystal_yellow: 0,
  crystal_purple: 0,
  crystal_blue: 0,
  share_status: 0,
  share_success_time: null,
  real_name_time: 1792223520,
  first_buy_time: 0,
  huifu_service_charge: 0,
  sandpay_service_charge: 0,
  invite_type: 1,
  yibao_status: 1,
  tipay_status: 0,
  sandpay_status: 0,
  show_wallet: 1,
  /* 原站实调（2026-10-24 /user/getUserInfo）：批量求购出售开关为 0
     → 专辑列表页求购 tab 不显示「批量出售」按钮 */
  is_batch_beg_sell: 0,
  is_exist: 1,
  expiretime: 1794995288,
  expires_in: 2592000,
  /* 原站实调（2026-10-25 /user/getUserInfo）：测试账号未开通会员
     is_vip=0、vip_time=null（会员到期时间戳）→ svip 页倒计时恒为 00 */
  is_vip: 0,
  vip_time: null
}
/* ==================== 市场页 mock（取自原站 /api/market/market/getMarketList 真实响应） ==================== */

/** 系列：市场页 cateTabs 与 zoneCards 的数据源（原站 Vuex goods.collectionSeries ← /index/series）。
 *  series_id 与下方 MARKET_LIST 对齐（26=如意金箍棒系 / 25=大闹天宫系）；
 *  is_def=1 触发原站 initDefaultSeries 的默认系列选中 */
export const MARKET_SERIES = [
  {
    series_id: 26,
    series_name: '如意金箍棒',
    current_price: '66.00',
    change_price: '20.00',
    flag: 0,
    pattern: 1,
    is_def: 1
  },
  {
    series_id: 25,
    series_name: '大闹天宫',
    current_price: '60.00',
    change_price: '0.00',
    flag: 0,
    pattern: 1,
    is_def: 0
  }
]

/** 盲盒市场列表（market_type=2 → getMarketBoxList，原站 /market/market/marketList；
 *  响应结构 { total, data }，getBoxList 按页追加） */
export const MARKET_BOX_LIST = {
  total: 3,
  data: [
    {
      id: 101,
      name: '珍藏盲盒',
      series_id: 3,
      goods_type: '1',
      total_num: 500,
      flux: '500',
      deal_num: 12,
      min_price: '99.00',
      price: '99.00',
      is_out: 0,
      product: {
        id: 101,
        name: '珍藏盲盒',
        listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
        total_num: 500
      }
    },
    {
      id: 102,
      name: '积分大礼包',
      series_id: 3,
      goods_type: '1',
      total_num: 200,
      flux: '200',
      deal_num: 0,
      min_price: '20.00',
      price: '20.00',
      is_out: 1,
      product: {
        id: 102,
        name: '积分大礼包',
        listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
        total_num: 200
      }
    },
    {
      id: 103,
      name: '限定盲盒',
      series_id: 3,
      goods_type: '1',
      total_num: 1000,
      flux: '1000',
      deal_num: 56,
      min_price: '158.00',
      price: '158.00',
      is_out: 0,
      product: {
        id: 103,
        name: '限定盲盒',
        listimg: '/assets/img/market/447aea6b59117568a722045f1b20e199.jpg',
        total_num: 1000
      }
    }
  ]
}

/** 市场藏品列表 */
export const MARKET_LIST = [
  {
    name: '如意金箍棒',
    series_id: 26,
    id: 26,
    listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
    total_num: 500,
    reprice_limit: '88.00',
    collection_level: '',
    openresale_time: 1792420513,
    flag: 0,
    deal_num: 0,
    flux: '422',
    market_fluctuate: -25,
    min_price: 66,
    is_out: 0,
    new_time: 1792420513,
    goods_type: '2',
    product: {
      id: 26,
      name: '如意金箍棒',
      listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      total_num: 500
    }
  },
  {
    name: '打王神鞭',
    series_id: 26,
    id: 20,
    listimg: '/assets/img/market/447aea6b59117568a722045f1b20e199.jpg',
    total_num: 20000,
    reprice_limit: '20.00',
    collection_level: '',
    openresale_time: 1792408880,
    flag: 0,
    deal_num: 1,
    flux: '20000',
    market_fluctuate: 0,
    min_price: '20.00',
    is_out: 1,
    new_time: 1792408880,
    goods_type: '2',
    product: {
      id: 20,
      name: '打王神鞭',
      listimg: '/assets/img/market/447aea6b59117568a722045f1b20e199.jpg',
      total_num: 20000
    }
  },
  {
    name: '大闹天宫',
    series_id: 25,
    id: 18,
    listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
    total_num: 500,
    reprice_limit: '158.00',
    collection_level: '',
    openresale_time: 1792400133,
    flag: 0,
    deal_num: 0,
    flux: '289',
    market_fluctuate: -56.52,
    min_price: 60,
    is_out: 0,
    new_time: 1792400133,
    goods_type: '2',
    product: {
      id: 18,
      name: '大闹天宫',
      listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
      total_num: 500
    }
  }
]

/** 市场专辑商品详情 —— 原站 /market/market/marketGoodsDetail（body {id,type}，id=38 真实响应） */
export const MARKET_GOODS_DETAIL = {
  id: 38,
  issuer_id: 0,
  flux: 1000,
  face_status: 0,
  series_id: 26,
  name: '新天降魔云府',
  introduce_image: '',
  main_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg?image_process=resize,l_420',
  total_num: 1000,
  price: 39.9,
  sale_total_num: 10,
  release_time: 1792662180,
  ant_chain: null,
  purchasing_num: 10,
  buyneed: null,
  listimg: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
  soldout: 0,
  '3d_url_type': 'img',
  '3d_url': '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
  purchase_information:
    '                数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。            ',
  batch_pay: 0,
  batch_pay_num: 0,
  collection_level: '',
  is_img_diff: 0,
  reprice_limit: '9999.00',
  is_like: 0,
  sell: 101,
  is_has: 0,
  yibao_count: 0,
  huifu_count: 0,
  buy: 0,
  ll_count: 0,
  batch_sell: 1,
  key: 'ad384432a444cba8657c84ed2b242dee',
  prepaymen_pay: 0,
  max_price: 1000,
  hot_count: 0,
  issuer: null,
  series: { id: 26, name: '潜龙聚财', pattern: 1, resale_put_start_time: '20:56:04', resale_put_end_time: '20:56:04', resale_buy_start_time: '20:56:04', resale_buy_end_time: '20:56:04', resale_status: 0 },
  batch: { id: 11, collection_id: 38, start_time: 1792666800, end_time: 1792670400, num_list: '', purchase_quantity: 1, total_num: 1000, zuzao_id: 0, sale_total_num: 10, front_display: 1, fictitious_stock: 0, createtime: 1792662466, updatetime: 1792662466, open_draw: 0, sign_up_start_time: null, sign_up_end_time: null, draw_virtual_num: 0, draw_time: 0, draw_user_num: 0, sign_up_user_num: 0, riority_status: 1, riority_time: 1792663200, weigh: 11, title: '1' }
}

/** 市场专辑挂单列表 —— 原站 /market/market/getMarketGoodsListByGoodsId
 *  body {page, sort, order, type, keyword, id}；data.list[] 取前 12 条真实数据（价格升序） */
export const MARKET_GOODS_LIST = {
  list: [
    { id: 12152, collection_code: 202, price: 92, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 12153, collection_code: 287, price: 92, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 11956, collection_code: 649, price: 95, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 12154, collection_code: 933, price: 95, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 12155, collection_code: 951, price: 95, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 12156, collection_code: 975, price: 95, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 11960, collection_code: 640, price: 96, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 11950, collection_code: 638, price: 99, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 11951, collection_code: 987, price: 99, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 11952, collection_code: 988, price: 99, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 11953, collection_code: 993, price: 99, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' },
    { id: 11954, collection_code: 997, price: 99, total_num: 1000, series_id: 26, is_img_diff: 0, status: 1, income_type: ['yibao'], img: '', name: '' }
  ],
  count: 0,
  ltnum: 0
}

/** 寄售（市场藏品）详情 —— 原站 /market/market/MarketDetail/ids/{id}（id=12152 真实响应）
 *  页面 data.info；product 内嵌专辑详情（price/goods_type 由 getInfo 用顶层值覆盖） */
export const MARKET_DETAIL_12152 = {
  id: 12152,
  sale_user_id: 1102,
  sale_user_nickname: null,
  sale_user_collection_id: 904758,
  series_id: 26,
  goods_type: 2,
  goods_id: 38,
  price: 92,
  status: 1,
  sale_time: null,
  buy_user_id: 0,
  pay_platform_service_rate: '0.05',
  platform_service_price: '4.60',
  creator_service_price: '0.00',
  real_income: '87.40',
  createtime: 1792749399,
  updatetime: 1792749399,
  deleted: 0,
  buy_version: 1,
  order_sn: '2026102317563955555454637269',
  goods_name: '新天降魔云府',
  goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
  series_name: '潜龙聚财',
  income_type: 'yibao',
  dt_ret: null,
  batch_order_id: 0,
  product: {
    id: 38,
    series_id: 26,
    issuer_id: 0,
    flux: 1000,
    price: 92,
    name: '新天降魔云府',
    main_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
    introduce_image: '',
    total_num: 1000,
    types: 1,
    compound_num: 1,
    release_time: 1792662180,
    sale_total_num: 10,
    '3d_url_type': 'img',
    '3d_url': '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
    purchase_information:
      '                数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。            ',
    listimg: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
    creator_id: 1,
    is_img_diff: 0,
    is_like: 0,
    publisher: {
      name: '嗒嗒',
      company_logo: '/uploads/20260912/641fb93746a2b4b145c6ce0479225bb7.png',
      user: { id: '1', collection_brand_id: '0', nickname: '嗒嗒艺术', avatar: '/uploads/20261016/4eac445d1b075c84fcfff97d00cb7a12.png', title: '', info: '', weigh: '1' }
    },
    imageinfo: [],
    issuer: null,
    goods_type: 2
  },
  user: { id: 1102, nickname: 'db****', avatar: '/defautAvatar.png', mobile: '155****9163', url: '/u/1102' },
  img: '',
  name: '',
  rush_status: 0,
  buy_status: 1,
  user_collection: { id: 904758, collection_code: 202, user_hash_text: 'nRqwfK****', user_hash: 'nRqwfK****', zuzhao_info_id: null, task_id: null, rz_code: 163745, task: null },
  pay_text: 0
}


/** 求购 tab 数据 —— 原站 /market/trade/begBuyList（id=38 真实响应：空列表）
 *  页面（pages/market/marketGoodsList）getBegList：data.data / data.per_page / data.total */
export const MARKET_BEG_BUY_LIST = {
  current_page: 1,
  data: [],
  last_page: 0,
  per_page: 0,
  total: 0
}

/** 委托 tab 数据 —— 原站 /market/Prepayment/PrepaymentListMain（id=38 真实响应：无委托）
 *  页面（pages/market/marketGoodsList）EntrustList.getList：total_amount / total_number / data */
export const MARKET_ENTRUST_LIST = {
  data: [],
  total_amount: 0,
  total_number: 0,
  per_page: 20,
  total: 0,
  current_page: 1
}

/** 成交 tab 数据 —— 原站 /market/trade/tradingInformation（id=38 真实响应，2026-10-23 抓取）
 *  页面（pages/market/marketGoodsList）getSellList：data.list + 汇总字段
 *  dealInfo = {current_buying, current_consignment, transaction_record_number, floor_price,
 *               today_amount, today_volume, today_highest_price, today_lowest_price} */
export const MARKET_TRADING_INFO = {
  "transaction_record_number": 150, "current_buying": 0, "current_consignment": 101, "floor_price": 92, "today_amount": 9321, "today_volume": 150, "today_highest_price": 89, "today_lowest_price": 2,
  list: [
    {"price": "84.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905474, "time_raw": 1792754174, "collection_code": 918, "total_num": 1000, "pay_text": 0},
    {"price": "82.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904989, "time_raw": 1792754152, "collection_code": 433, "total_num": 1000, "pay_text": 0},
    {"price": "85.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904996, "time_raw": 1792754137, "collection_code": 440, "total_num": 1000, "pay_text": 0},
    {"price": "89.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905126, "time_raw": 1792754112, "collection_code": 570, "total_num": 1000, "pay_text": 0},
    {"price": "84.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904569, "time_raw": 1792754084, "collection_code": 13, "total_num": 1000, "pay_text": 0},
    {"price": "87.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905312, "time_raw": 1792754080, "collection_code": 756, "total_num": 1000, "pay_text": 0},
    {"price": "86.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904669, "time_raw": 1792754059, "collection_code": 113, "total_num": 1000, "pay_text": 0},
    {"price": "83.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904963, "time_raw": 1792754058, "collection_code": 407, "total_num": 1000, "pay_text": 0},
    {"price": "87.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905016, "time_raw": 1792754024, "collection_code": 460, "total_num": 1000, "pay_text": 0},
    {"price": "88.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904875, "time_raw": 1792754018, "collection_code": 319, "total_num": 1000, "pay_text": 0},
    {"price": "89.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904838, "time_raw": 1792753980, "collection_code": 282, "total_num": 1000, "pay_text": 0},
    {"price": "87.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904646, "time_raw": 1792753974, "collection_code": 90, "total_num": 1000, "pay_text": 0},
    {"price": "86.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905414, "time_raw": 1792753958, "collection_code": 858, "total_num": 1000, "pay_text": 0},
    {"price": "84.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904593, "time_raw": 1792753955, "collection_code": 37, "total_num": 1000, "pay_text": 0},
    {"price": "82.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904805, "time_raw": 1792753917, "collection_code": 249, "total_num": 1000, "pay_text": 0},
    {"price": "82.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905386, "time_raw": 1792753852, "collection_code": 830, "total_num": 1000, "pay_text": 0},
    {"price": "86.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905477, "time_raw": 1792753839, "collection_code": 921, "total_num": 1000, "pay_text": 0},
    {"price": "88.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904714, "time_raw": 1792753830, "collection_code": 158, "total_num": 1000, "pay_text": 0},
    {"price": "83.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 904804, "time_raw": 1792753814, "collection_code": 248, "total_num": 1000, "pay_text": 0},
    {"price": "83.00", "goods_id": 38, "goods_name": "新天降魔云府", "goods_cover_image": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg", "time": "2小时前", "user_collection_id": 905304, "time_raw": 1792753798, "collection_code": 748, "total_num": 1000, "pay_text": 0},
  ]
}

/**
 * 求购专辑详情 —— 原站 /market/trade/collectionDetail
 *  页面（pages/market/submitBegBuy）data.info（2026-10-24 实调 id=38 真实响应）
 *  floor_price = 地板价规则：minprice 求购价下限 / price_price_ratio 下限百分比
 *  low_price = 当前地板价 / low_price_text 中文大写
 */
export const MARKET_TRAD_INFO = {
  id: 38,
  name: '新天降魔云府',
  listimg: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
  reprice_limit: 999999999,
  reprice_min_limit: '0.00',
  reprice_beg_max_limit: '0.00',
  max_buy_price: 999999999,
  floor_price: {
    minprice: 9.2,
    price_pro: 1,
    tips: '为保护寄售市场整体用户权益，寄售出价下限为昨日平均成交价10%，若低于最低限价或高于最高限价藏品将无法寄售，敬请知悉！',
    price_price_ratio: '10',
    pay_platform_service_rate: '0.05',
    share_proportion_rate: '0.00',
    platform_service_price: '0.05',
    share_proportion_price: '0.00',
    real_price: '0.95',
    low_price: 92,
    low_price_text: '九十二元'
  }
}

/**
 * 委托收费信息 —— 原站 /market/Prepayment/collectionDetail
 *  页面（pages/market/submitEntrust）data.chargeInfo（2026-10-24 实调 id=38 真实响应）
 *    pay_platform_service_rate 综合服务费率 / low_price 当前委托低价
 *    low_price_text 中文大写 / share_proportion_rate 分销费率 / tips 委托说明(HTML)
 */
export const ENTRUST_CHARGE_INFO = {
  pay_platform_service_rate: '0.05',
  low_price: 92,
  low_price_text: '九十二元',
  share_proportion_rate: '0.00',
  tips: '<p>1. 委托成功后，藏品将进入委托市场，按委托价格等待买家购买；</p><p>2. 委托期间藏品不可转赠、不可再次寄售，可随时取消委托；</p><p>3. 委托成交后收取综合服务费，费率以页面展示为准。</p>'
}

/**
 * 买卖详情三 tab 数据 —— 原站 /market/trade/tradingInformation（2026-10-24 实调 id=38 真实响应）
 *  页面（pages/market/sellInfo）getList：data.list + 三个汇总计数
 *    transaction_record_number 成交记录总数 / current_buying 当前求购数 / current_consignment 当前寄售数
 *  status=1 成交记录：list[] = { price, goods_id, goods_name, goods_cover_image,
 *                               time("昨天"), user_collection_id, time_raw, collection_code, total_num, pay_text }
 *  status=2 当前求购：list[] = { price, number, pay_text }（原站 id=38 实测为 0 单，此处构造 3 条演示行结构）
 *  status=3 当前寄售：list[] = { price, number, pay_text }
 */
export const SELL_INFO_COUNTS = {
  transaction_record_number: 150,
  current_buying: 3,
  current_consignment: 101
}

/** 成交记录（status=1，20 条，原站真实响应逐字搬运） */
export const SELL_INFO_TRADE_LIST = [
  { price: '84.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905474, time_raw: 1792754174, collection_code: 918, total_num: 1000, pay_text: 0 },
  { price: '82.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904989, time_raw: 1792754152, collection_code: 433, total_num: 1000, pay_text: 0 },
  { price: '85.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904996, time_raw: 1792754137, collection_code: 440, total_num: 1000, pay_text: 0 },
  { price: '89.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905126, time_raw: 1792754112, collection_code: 570, total_num: 1000, pay_text: 0 },
  { price: '84.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904569, time_raw: 1792754084, collection_code: 13, total_num: 1000, pay_text: 0 },
  { price: '87.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905312, time_raw: 1792754080, collection_code: 756, total_num: 1000, pay_text: 0 },
  { price: '86.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904669, time_raw: 1792754059, collection_code: 113, total_num: 1000, pay_text: 0 },
  { price: '83.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904963, time_raw: 1792754058, collection_code: 407, total_num: 1000, pay_text: 0 },
  { price: '87.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905016, time_raw: 1792754024, collection_code: 460, total_num: 1000, pay_text: 0 },
  { price: '88.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904875, time_raw: 1792754018, collection_code: 319, total_num: 1000, pay_text: 0 },
  { price: '89.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904838, time_raw: 1792753980, collection_code: 282, total_num: 1000, pay_text: 0 },
  { price: '87.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904646, time_raw: 1792753974, collection_code: 90, total_num: 1000, pay_text: 0 },
  { price: '86.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905414, time_raw: 1792753958, collection_code: 858, total_num: 1000, pay_text: 0 },
  { price: '84.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904593, time_raw: 1792753955, collection_code: 37, total_num: 1000, pay_text: 0 },
  { price: '82.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904805, time_raw: 1792753917, collection_code: 249, total_num: 1000, pay_text: 0 },
  { price: '82.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905386, time_raw: 1792753852, collection_code: 830, total_num: 1000, pay_text: 0 },
  { price: '86.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905477, time_raw: 1792753839, collection_code: 921, total_num: 1000, pay_text: 0 },
  { price: '88.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904714, time_raw: 1792753830, collection_code: 158, total_num: 1000, pay_text: 0 },
  { price: '83.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 904804, time_raw: 1792753814, collection_code: 248, total_num: 1000, pay_text: 0 },
  { price: '83.00', goods_id: 38, goods_name: '新天降魔云府', goods_cover_image: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg', time: '昨天', user_collection_id: 905304, time_raw: 1792753798, collection_code: 748, total_num: 1000, pay_text: 0 }
]

/** 当前求购（status=2，原站实测 0 单，构造 3 条保持 tab 可演示） */
export const SELL_INFO_BEG_BUY_LIST = [
  { price: '88.00', number: 3, pay_text: 0 },
  { price: '92.00', number: 2, pay_text: 0 },
  { price: '96.00', number: 1, pay_text: 0 }
]

/** 当前寄售（status=3，20 条，原站真实响应逐字搬运） */
export const SELL_INFO_CONSIGN_LIST = [
  { price: '99.00', number: 5, pay_text: 0 },
  { price: '95.00', number: 4, pay_text: 0 },
  { price: '96.00', number: 1, pay_text: 0 },
  { price: '110.00', number: 4, pay_text: 0 },
  { price: '128.00', number: 6, pay_text: 0 },
  { price: '130.00', number: 5, pay_text: 0 },
  { price: '158.00', number: 5, pay_text: 0 },
  { price: '145.00', number: 1, pay_text: 0 },
  { price: '188.00', number: 6, pay_text: 0 },
  { price: '178.00', number: 3, pay_text: 0 },
  { price: '166.00', number: 2, pay_text: 0 },
  { price: '195.00', number: 1, pay_text: 0 },
  { price: '193.00', number: 1, pay_text: 0 },
  { price: '200.00', number: 8, pay_text: 0 },
  { price: '1000.00', number: 4, pay_text: 0 },
  { price: '388.00', number: 3, pay_text: 0 },
  { price: '218.00', number: 5, pay_text: 0 },
  { price: '220.00', number: 2, pay_text: 0 },
  { price: '222.00', number: 4, pay_text: 0 },
  { price: '225.00', number: 2, pay_text: 0 }
]

/**
 * 以求购价出售信息 —— 原站 /market/trade/getSellCollectionInfo
 *  页面（pages/market/sellBegBuy）data.info
 *    selected[]            可成交的求购单（需与之绑定自己的藏品 user_collection_id）
 *    user_collection_list[] 我持有的藏品候选（弹窗勾选）
 *    total_price           总售价 / platform_service_rate 综合服务费率(%)
 *    platform_service_price 综合服务费 / estimated_income 预计收入
 */
export const MARKET_SELL_BEG_INFO = {
  selected: [
    {
      id: 30041,
      user_collection_id: null,
      name: '新天降魔云府',
      listimg: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
      collection_code: 918,
      total_num: 1000,
      count: 1,
      price: '92.00',
      pay_way: 'yibao'
    }
  ],
  user_collection_list: [
    {
      id: 905474,
      name: '新天降魔云府',
      listimg: '/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg',
      collection_code: 918,
      total_num: 1000,
      count: 1,
      price: '92.00',
      pay_way: 'yibao',
      check: false
    }
  ],
  total_price: '92.00',
  platform_service_rate: '0.05',
  platform_service_price: '4.60',
  estimated_income: '87.40'
}
/**
 * 公告列表 —— 原站真实响应（2026-10-26 实调 /index/afficheList）
 * category=0 → total 12 / last_page 1；各分类：运营 4、合成 4、分解 0、上新 0、活动 0、寄售 4
 */
export const AFFICHE_LIST = {
  "total": 12,
  "per_page": 15,
  "current_page": 1,
  "last_page": 1,
  "data": [
    {
      "id": 59,
      "image": "",
      "title": "【嗒嗒艺术寄售公告】《2026喜糖》寄售公告",
      "createtime": 1792910370,
      "type": "1",
      "url": "",
      "affiche_type": "寄售公告",
      "describe": ""
    },
    {
      "id": 58,
      "image": "",
      "title": "【嗒嗒艺术求购公告】《末日凤凰》开启求购！",
      "createtime": 1792852417,
      "type": "1",
      "url": "",
      "affiche_type": "运营公告",
      "describe": ""
    },
    {
      "id": 57,
      "image": "",
      "title": "【嗒嗒艺术合成公告】新的起点！《嗒嗒浴火重生》合成活动来袭！",
      "createtime": 1792849292,
      "type": "1",
      "url": "",
      "affiche_type": "合成公告",
      "describe": ""
    },
    {
      "id": 56,
      "image": "",
      "title": "【嗒嗒艺术寄售公告】《末日凤凰》寄售公告",
      "createtime": 1792841777,
      "type": "1",
      "url": "",
      "affiche_type": "寄售公告",
      "describe": ""
    },
    {
      "id": 55,
      "image": "",
      "title": "全新开始！全民福利《2026喜糖》来袭！",
      "createtime": 1792835800,
      "type": "1",
      "url": "",
      "affiche_type": "合成公告",
      "describe": ""
    },
    {
      "id": 54,
      "image": "",
      "title": "【嗒嗒艺术寄售公告】《喜从天降》寄售公告",
      "createtime": 1792832141,
      "type": "1",
      "url": "",
      "affiche_type": "寄售公告",
      "describe": ""
    },
    {
      "id": 53,
      "image": "",
      "title": "【嗒嗒艺术置换公告】《嗒嗒重生》自动置换公告！",
      "createtime": 1792832030,
      "type": "1",
      "url": "",
      "affiche_type": "运营公告",
      "describe": ""
    },
    {
      "id": 52,
      "image": "",
      "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》提升寄售限价",
      "createtime": 1792831683,
      "type": "1",
      "url": "",
      "affiche_type": "运营公告",
      "describe": ""
    },
    {
      "id": 51,
      "image": "",
      "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》提升寄售限价",
      "createtime": 1792830077,
      "type": "1",
      "url": "",
      "affiche_type": "运营公告",
      "describe": ""
    },
    {
      "id": 50,
      "image": "",
      "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》开启寄售",
      "createtime": 1792824945,
      "type": "1",
      "url": "",
      "affiche_type": "寄售公告",
      "describe": ""
    },
    {
      "id": 49,
      "image": "",
      "title": "【嗒嗒艺术合成公告】《喜从天降》合成活动来袭！",
      "createtime": 1792823635,
      "type": "1",
      "url": "",
      "affiche_type": "合成公告",
      "describe": ""
    },
    {
      "id": 48,
      "image": "",
      "title": "【嗒嗒艺术合成公告】《嗒嗒重生》合成活动来袭！",
      "createtime": 1792817933,
      "type": "1",
      "url": "",
      "affiche_type": "合成公告",
      "describe": ""
    }
  ]
}

/** 各分类筛选后的真实响应（category=1..6） */
export const AFFICHE_LIST_BY_CATEGORY = {
  1: {
    "total": 4,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 58,
        "image": "",
        "title": "【嗒嗒艺术求购公告】《末日凤凰》开启求购！",
        "createtime": 1792852417,
        "type": "1",
        "url": "",
        "affiche_type": "运营公告",
        "describe": ""
      },
      {
        "id": 53,
        "image": "",
        "title": "【嗒嗒艺术置换公告】《嗒嗒重生》自动置换公告！",
        "createtime": 1792832030,
        "type": "1",
        "url": "",
        "affiche_type": "运营公告",
        "describe": ""
      },
      {
        "id": 52,
        "image": "",
        "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》提升寄售限价",
        "createtime": 1792831683,
        "type": "1",
        "url": "",
        "affiche_type": "运营公告",
        "describe": ""
      },
      {
        "id": 51,
        "image": "",
        "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》提升寄售限价",
        "createtime": 1792830077,
        "type": "1",
        "url": "",
        "affiche_type": "运营公告",
        "describe": ""
      }
    ]
  },
  2: {
    "total": 4,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 57,
        "image": "",
        "title": "【嗒嗒艺术合成公告】新的起点！《嗒嗒浴火重生》合成活动来袭！",
        "createtime": 1792849292,
        "type": "1",
        "url": "",
        "affiche_type": "合成公告",
        "describe": ""
      },
      {
        "id": 55,
        "image": "",
        "title": "全新开始！全民福利《2026喜糖》来袭！",
        "createtime": 1792835800,
        "type": "1",
        "url": "",
        "affiche_type": "合成公告",
        "describe": ""
      },
      {
        "id": 49,
        "image": "",
        "title": "【嗒嗒艺术合成公告】《喜从天降》合成活动来袭！",
        "createtime": 1792823635,
        "type": "1",
        "url": "",
        "affiche_type": "合成公告",
        "describe": ""
      },
      {
        "id": 48,
        "image": "",
        "title": "【嗒嗒艺术合成公告】《嗒嗒重生》合成活动来袭！",
        "createtime": 1792817933,
        "type": "1",
        "url": "",
        "affiche_type": "合成公告",
        "describe": ""
      }
    ]
  },
  3: {
    "total": 0,
    "per_page": 15,
    "current_page": 1,
    "last_page": 0,
    "data": []
  },
  4: {
    "total": 0,
    "per_page": 15,
    "current_page": 1,
    "last_page": 0,
    "data": []
  },
  5: {
    "total": 0,
    "per_page": 15,
    "current_page": 1,
    "last_page": 0,
    "data": []
  },
  6: {
    "total": 4,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1,
    "data": [
      {
        "id": 59,
        "image": "",
        "title": "【嗒嗒艺术寄售公告】《2026喜糖》寄售公告",
        "createtime": 1792910370,
        "type": "1",
        "url": "",
        "affiche_type": "寄售公告",
        "describe": ""
      },
      {
        "id": 56,
        "image": "",
        "title": "【嗒嗒艺术寄售公告】《末日凤凰》寄售公告",
        "createtime": 1792841777,
        "type": "1",
        "url": "",
        "affiche_type": "寄售公告",
        "describe": ""
      },
      {
        "id": 54,
        "image": "",
        "title": "【嗒嗒艺术寄售公告】《喜从天降》寄售公告",
        "createtime": 1792832141,
        "type": "1",
        "url": "",
        "affiche_type": "寄售公告",
        "describe": ""
      },
      {
        "id": 50,
        "image": "",
        "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》开启寄售",
        "createtime": 1792824945,
        "type": "1",
        "url": "",
        "affiche_type": "寄售公告",
        "describe": ""
      }
    ]
  },
}

/**
 * 公告详情 —— 原站真实响应（2026-10-26 实调 /index/afficheDetail/ids/{id}）
 * 注意：标签文案来自 URL query 的 category（原站 a.category），不在详情响应里；
 *      详情响应用 affiche_type_id 表示分类（2=合成 6=寄售 等）。
 */
export const AFFICHE_DETAILS = {
  "59": {
    "id": 59,
    "collection_ids": "",
    "title": "【嗒嗒艺术寄售公告】《2026喜糖》寄售公告",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">藏品《2026喜糖》将于2026年10月25日14:45开启寄售，届时限价<strong><span style=\"color:#E53333;\">¥15</span></strong>。</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br />敬请用户知悉！<br /><br /></span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792910370,
    "updatetime": 1792910609,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792910257,
    "status": 1,
    "top": 0,
    "affiche_type_id": 6,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "58": {
    "id": 58,
    "collection_ids": "",
    "title": "【嗒嗒艺术求购公告】《末日凤凰》开启求购！",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">藏品<strong><span style=\"color:#E53333;\">《末日凤凰》</span></strong>将于公告发出后开启求购，届时限价<strong><span style=\"color:#E53333;\">¥10</span></strong>。</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br />敬请用户知悉！<br /></span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792852417,
    "updatetime": 1792852417,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792852382,
    "status": 1,
    "top": 0,
    "affiche_type_id": 1,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "57": {
    "id": 57,
    "collection_ids": "",
    "title": "【嗒嗒艺术合成公告】新的起点！《嗒嗒浴火重生》合成活动来袭！",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">玩家每消耗<strong><span style=\"color:#E53333;\">5份</span></strong><strong><span style=\"color:#E53333;\">「嗒嗒会员卡」</span></strong>+<strong><span style=\"color:#E53333;\">1份「末日凤凰」</span></strong> ，即可合成<strong><span style=\"color:#E53333;\">1份「嗒嗒浴火重生」</span></strong>藏品，<strong><span style=\"color:#E53333;\">本次限量合成2000次</span></strong><strong><span style=\"color:#E53333;\">，最大合成2000份；可多次合成。</span></strong></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><span style=\"color:#e53333;\"><b><br /></b></span>合成时间：<strong><span style=\"color:#E53333;\">2026年10月24日22:00-10月25日0:00</span></strong></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><span style=\"color:#e53333;\"><b><br /></b></span>1）藏品「嗒嗒浴火重生」将在12小时内开放寄售。</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /><br /></span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792849292,
    "updatetime": 1792849292,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792849170,
    "status": 1,
    "top": 0,
    "affiche_type_id": 2,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "56": {
    "id": 56,
    "collection_ids": "",
    "title": "【嗒嗒艺术寄售公告】《末日凤凰》寄售公告",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">藏品<strong><span style=\"color:#E53333;\">《末日凤凰》</span></strong>将于2026年10月24日19:45开启寄售，届时限价<strong><span style=\"color:#E53333;\">¥10</span></strong>。</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br />敬请用户知悉！<br /><br /></span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792841777,
    "updatetime": 1792841842,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792841691,
    "status": 1,
    "top": 0,
    "affiche_type_id": 6,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "55": {
    "id": 55,
    "collection_ids": "",
    "title": "全新开始！全民福利《2026喜糖》来袭！",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">新的起航！新的开始！打不死我的必将使我更加强大！<br /><br />合成目标：<span style=\"color:#E53333;\"><strong>《2026喜糖》*1</strong></span><br /><br />合成资格：<strong><span style=\"color:#E53333;\">在快照时间内每持有</span></strong><span style=\"color:#E53333;\"><strong>《喜从天降》*5</strong></span><strong><span style=\"color:#E53333;\">，可获得一次合成资格，单ID限一份。</span></strong><br /><br />快照时间：2026年10月24日19：30—10月24日20:00<br />合成材料：<br /><br /><strong><span style=\"color:#E53333;\">《喜从天降》*2+《2026喜糖合成资格卡》*1</span></strong><br /><br />合成时间：2026年10月24日20：30—10月24日21:00<br /><br />最大合成数量：<span style=\"color:#E53333;\"><strong>1200份</strong></span><br /><br />通道二<br /><br />合成目标：<span style=\"color:#E53333;\"><strong>《2026喜糖》*1</strong></span><br /><br />合成资格：<span style=\"color:#E53333;\"><strong>在快照时间内每净买入《喜从天降》*3，可获得一次合成资格，可叠加。</strong></span><br /><br />快照时间：2026年10月24日18:30—10月24日19:00<br /><br />合成材料：<br /><br /><strong><span style=\"color:#E53333;\">《喜从天降》*2+《2026喜糖合成资格卡》*1</span></strong><br /><br />合成时间：2026年10月24日20：30—10月24日21:00<br /><br />注：《2026喜糖》将在活动结束后开放寄售！<br />《喜从天降》活动预告！（？变？？）<br />1. 本次合成未消耗的《喜从天降》仍可参与后续活动。<br />2. 本次合成未消耗的《2026喜糖合成资格卡》将不再开放寄售及参与其他活动<br /><br /></span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792835800,
    "updatetime": 1792835800,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792835491,
    "status": 1,
    "top": 0,
    "affiche_type_id": 2,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "54": {
    "id": 54,
    "collection_ids": "",
    "title": "【嗒嗒艺术寄售公告】《喜从天降》寄售公告",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">合成藏品<strong><span style=\"color:#E53333;\">《喜从天降》</span></strong>自将于17:00开启寄售；<strong><span style=\"color:#E53333;\">首次寄售限价5元同步开启委托功能</span></strong>后续根据市场运营逐步调整，望用户知悉！</span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792832141,
    "updatetime": 1792832141,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792832103,
    "status": 1,
    "top": 0,
    "affiche_type_id": 6,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "53": {
    "id": 53,
    "collection_ids": "",
    "title": "【嗒嗒艺术置换公告】《嗒嗒重生》自动置换公告！",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">《嗒嗒重生》下架置换活动！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /><strong><span style=\"color:#E53333;\">《嗒嗒重生》</span></strong>下架<strong><span style=\"color:#E53333;\">1:50</span></strong>置换为<strong><span style=\"color:#E53333;\">《末日凤凰》</span></strong><br /><br /><br />敬请各位用户知悉！谢谢！<br /><br /></span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792832030,
    "updatetime": 1792832030,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792831975,
    "status": 1,
    "top": 0,
    "affiche_type_id": 1,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "52": {
    "id": 52,
    "collection_ids": "",
    "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》提升寄售限价",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">合成藏品<strong><span style=\"color:#E53333;\">《嗒嗒重生》</span></strong>自公告发出后提升寄售限价；<strong><span style=\"color:#E53333;\">寄售限价400元</span></strong>后续根据市场运营逐步调整，望用户知悉！</span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792831683,
    "updatetime": 1792831683,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792831672,
    "status": 1,
    "top": 0,
    "affiche_type_id": 1,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "51": {
    "id": 51,
    "collection_ids": "",
    "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》提升寄售限价",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">合成藏品<strong><span style=\"color:#E53333;\">《嗒嗒重生》</span></strong>自公告发出后提升寄售限价；<strong><span style=\"color:#E53333;\">首次寄售限价200元</span></strong>后续根据市场运营逐步调整，望用户知悉！</span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792830077,
    "updatetime": 1792830077,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792830054,
    "status": 1,
    "top": 0,
    "affiche_type_id": 1,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "50": {
    "id": 50,
    "collection_ids": "",
    "title": "【嗒嗒艺术寄售公告】《嗒嗒重生》开启寄售",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">合成藏品<strong><span style=\"color:#E53333;\">《嗒嗒重生》</span></strong>自公告发出后开启寄售；<strong><span style=\"color:#E53333;\">首次寄售限价100元</span></strong>后续根据市场运营逐步调整，望用户知悉！</span></p>",
    "type": "1",
    "image": "",
    "createtime": 1792824945,
    "updatetime": 1792824945,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792824870,
    "status": 1,
    "top": 0,
    "affiche_type_id": 6,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "49": {
    "id": 49,
    "collection_ids": "",
    "title": "【嗒嗒艺术合成公告】《喜从天降》合成活动来袭！",
    "describe": "",
    "content": "<p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\">您好！</span></p><p style=\"text-wrap:wrap;\"><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-wrap:wrap;text-align:center;\"><strong>嗒嗒艺术平台全新藏品《喜从天降》合成活动将于<span style=\"color:#E53333;\">2026年10月24日15:00</span>正式开启，详细如下，敬请知悉！</strong></p><p style=\"text-wrap:wrap;text-align:center;\"><strong><br /></strong></p><div style=\"text-wrap:wrap;text-align:center;\"><span style=\"background-color:#9933E5;\">⭐全新数字资产《喜从天降》合成活动⭐</span></div><br style=\"text-wrap:wrap;\" /><ul style=\"text-wrap:wrap;\"><li>合成目标：<strong><span style=\"color:#E53333;\">《喜从天降》*15</span></strong></li></ul><br style=\"text-wrap:wrap;\" /><ul style=\"text-wrap:wrap;\"><li>合成材料：<strong><span style=\"color:#E53333;\">《新天降魔云府》*1</span></strong></li></ul><strong style=\"text-wrap:wrap;\"><span style=\"color:#E53333;\"></span></strong><br style=\"text-wrap:wrap;\" /><ul style=\"text-wrap:wrap;\"><li>最大合成数量：<strong><span style=\"color:#E53333;\">400</span></strong><strong><span style=\"color:#E53333;\">份（可多次合成）</span></strong></li></ul><br style=\"text-wrap:wrap;\" /><span style=\"text-wrap:wrap;\">合成活动时间：2026年10月24日15:00-15:30</span><br style=\"text-wrap:wrap;\" /><span style=\"text-wrap:wrap;\">·注:</span><br style=\"text-wrap:wrap;\" /><span style=\"text-wrap:wrap;\">1. 合成结束剩余藏品《新天降魔云府》将关闭寄售不在后续运营；</span><br style=\"text-wrap:wrap;\" /><span style=\"text-wrap:wrap;\">2.《喜从天降》具体流通量以合成结束为准；</span><br style=\"text-wrap:wrap;\" /><span style=\"text-wrap:wrap;\">3.《喜从天降》最大发行量6000份。</span><br style=\"text-wrap:wrap;\" /><span style=\"text-wrap:wrap;\">嗒嗒数字艺术官方</span>",
    "type": "1",
    "image": "",
    "createtime": 1792823635,
    "updatetime": 1792823635,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792823528,
    "status": 1,
    "top": 0,
    "affiche_type_id": 2,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  },
  "48": {
    "id": 48,
    "collection_ids": "",
    "title": "【嗒嗒艺术合成公告】《嗒嗒重生》合成活动来袭！",
    "describe": "",
    "content": "<p><span style=\"font-size:14px;\">尊敬的嗒嗒用户：</span></p><p><span style=\"font-size:14px;\"><br /></span></p><p><span style=\"font-size:14px;\">您好！</span></p><p><span style=\"font-size:14px;\"><br /></span></p><p style=\"text-align:center;\"><strong>嗒嗒艺术平台全新藏品《嗒嗒重生》合成活动将于<span style=\"color:#E53333;\">2026年10月24日13:30</span>正式开启，详细如下，敬请知悉！</strong></p><p style=\"text-align:center;\"><strong><br /></strong></p><div style=\"text-align:center;\"><span style=\"background-color:#9933E5;\">⭐全新数字资产《嗒嗒重生》合成活动⭐</span></div><br /><ul><li>合成目标：<strong><span style=\"color:#E53333;\">《嗒嗒重生》*1</span></strong></li></ul><br /><ul><li>合成材料：<strong><span style=\"color:#E53333;\">《新天降魔云府》*3</span></strong></li></ul><strong><span style=\"color:#E53333;\"></span></strong><br /><ul><li>最大合成数量：<strong><span style=\"color:#E53333;\">200份（可多次合成）</span></strong></li></ul><br />合成活动时间：2026年10月24日13:30-14:00<br />·注:<br />1. 合成结束剩余藏品《新天降魔云府》依旧保持市场运营；<br />2.《嗒嗒重生》具体流通量以合成结束为准；<br />3.《嗒嗒重生》最大发行量1000份。<br />嗒嗒数字艺术官方<br />",
    "type": "1",
    "image": "",
    "createtime": 1792817933,
    "updatetime": 1792817933,
    "url": "",
    "read": 0,
    "sort": 0,
    "publish_time": 1792817540,
    "status": 1,
    "top": 0,
    "affiche_type_id": 2,
    "image_type": null,
    "is_wxpusher": 1,
    "collection": []
  }
}

/** 公告页顶部横幅（原站 /index/getComstomBanner） */
export const NOTICE_BANNER = '/assets/img/notice/banner.png'

/** 合成活动主题（原站 /synthesis/themeinfo thm=1 真实响应） */
export const SYNTHESIS_THEME = {
  id: 1,
  types: 1,
  name: '合成活动',
  image: '/assets/img/activity/theme.jpg',
  rule_text: '&nbsp;',
  play: [
    {
      id: 7,
      title: '混元金斗合成活动',
      image: '/assets/img/activity/01faa52be78ad6083b87ddf480fad5f0.png',
      start_time: 1792416600000,
      end_time: 1792420200000,
      activity_id: 1,
      description: '混元金斗合成活动',
      is_auto: 0,
      is_delay: 0,
      is_advance: 0,
      advance_date: 0,
      delay_date: 1,
      real_start_time: 1792416600000,
      real_end_time: 1792420200000,
      stock: 1,
      classify: 'regular',
      type: '10'
    },
    {
      id: 8,
      title: '如意金箍棒合成活动',
      image: '/assets/img/activity/d94194860b48adf69ca862963cfadcb6.jpg',
      start_time: 1792414200000,
      end_time: 1792416023000,
      activity_id: 1,
      description: '如意金箍棒合成活动',
      is_auto: 0,
      is_delay: 0,
      is_advance: 0,
      advance_date: 0,
      delay_date: 1,
      real_start_time: 1792414200000,
      real_end_time: 1792416023000,
      stock: 1,
      classify: 'regular',
      type: '10'
    }
  ]
}


/* ============================================================
 * 签到页 pages/sign/index
 * 反编译：pages-sign-index.ac51158a.js  模块 4170(logic) + 9df8/a06b(render)
 * 接口：getSignConfig / getSignRecord / sign（模块 fc5e，路径在原站 chunk 内联）
 * ============================================================ */

export const SIGN_CONFIG = {
  /** 已连续签到天数 */
  successions: 3,
  /** 累计积分（前端依次取 integral / point / total_point / score，都取不到显示"—"） */
  integral: 128,
  /** 今日是否已签到：1=已签到 */
  is_signin: 0
}

/** getSignRecord 返回：{ "2026-10-18": 3, "2026-10-19": 1 }，键是当月日 */
export const SIGN_RECORD = {
  time: 1792472705,
  data: { 18: 3, 19: 1 }
}

/* ============================================================
 * 抽奖页 pages/lottery/lottery
 * 反编译：pages-lottery-lottery.63c25018.js
 *   主 render模块 386d（scopeId cd90d3aa，24 个 lt- 类）
 *   logic 模块 0950   API 模块 c6d8
 * 接口实调（2026-10-20）：
 *   /lottery/info       → { code:0, msg:"暂无抽奖活动" }（当前无进行中活动）
 *   /lottery/statistics → { code:1, data:[] }
 * ============================================================ */

export const LOTTERY_INFO = {
  id: 1,
  /** 活动类型：10=消耗积分 20=消耗指定藏品 */
  type: 20,
  start_time: 1792380000,
  end_time: 1792981200,
  /** 剩余抽奖次数 */
  remaining: 5,
  /** 免费次数（>0 时点击直接抽，不弹确认框） */
  free_number: 0,
  /** 每抽消耗积分 */
  integral_1: 10,
  /** 消耗的藏品明细（type=20 时展示） */
  collection_json: '',
  /** 需消耗的藏品 id 串 */
  cp_list: [
    { name: '打王神鞭', user_collection_ids: [10021, 10022] }
  ],
  /** 四色宝石数量：10=黄 20=紫 30=蓝 */
  crystal: '10',
  crystal_blue: 120,
  crystal_purple: 60,
  crystal_yellow: 88,
  /** 奖品池：对象或数组均兼容，前端 prizeCells 归一化后取前 8 个 */
  award_list: [
    { name: '稀有藏品', detail: '限量 1 份', image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg' },
    { name: '珍藏盲盒', detail: '', image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg' },
    { name: '积分大礼包', detail: '', image: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg' },
    { name: '优惠券', detail: '', image: '/assets/img/activity/01faa52be78ad6083b87ddf480fad5f0.png' },
    { name: '抽取机会', detail: '', image: '/assets/img/activity/d94194860b48adf69ca862963cfadcb6.jpg' },
    { name: '谢谢参与', detail: '', image: '/assets/img/activity/theme.jpg' }
  ],
  /** 活动说明（HTML，存 lotteryRule，由 u-parse 渲染） */
  content:
    '<p>1. 活动期间每日可参与抽奖，消耗藏品或积分获取抽奖次数。</p><p>2. 奖品由系统随机发放， prize_list 见页面展示。</p><p>3. 中奖记录可在「中奖记录」中查询。</p><p>4. 如遇异常请联系客服处理。</p>',
  lotteryList: [{ msg: '幸运抽奖' }]
}

export const LOTTERY_STATISTICS = []

/* ============================================================
 * 藏品发售页 pages/product/collection
 * 反编译：pages-product-collection.592d7e9a.js
 *   页面壳 render = f18e（主图/状态/工具条/信息卡）
 *   页面逻辑 = 0a25
 *   mixin ca08 → drawBase / darwIsOpen / signUpStatus / isDrawed / countDown
 *   mixin d48a → saleStatus / saleStartTime / saleEndTime / totalNum / saleTotalNum
 *   mixin 72d9 → 滚动透明度
 *   底部二选一：darwIsOpen ? z-draw-actionV2(0b36) : z-product-action(d7aa)
 *   draw_type_text：-1未开奖 / 0未中签 / 1中签
 *
 * ★ 真实数据（2026-10-20 实调 /box/collection/ProductDetail/ids/20?batch_id=7）：
 *   batch.open_draw = 0 → 该商品走【普通发售】分支（底部为 z-product-action）
 * ============================================================ */

/** 藏品详情 —— 真实接口返回（id=20 打王神鞭 / batch_id=7） */
export const SALE_PRODUCT = {
  id: 20,
  name: '打王神鞭',
  series_id: 26,
  /** 原站 getDetails 后强制 a.product.goods_type = 2 */
  goods_type: 2,
  main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  '3d_url': '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  '3d_url_type': 'img',
  price: '9.90',
  total_num: 20000,
  total_num_show: 0,
  sale_total_num: '',
  release_time: 1792401900,
  release_time_date_text: '2026-10-19 18:00:00',
  sale_status_text: 3,
  /** 限购数量（决定底部是「立即购买」还是弹数量选择框） */
  purchasing_num: 1,
  is_like: 0,
  is_sub: false,
  soldout: 0,
  hasStock: 1,
  /** 藏品详情（u-parse 渲染），真实为空 */
  introduce_image: '',
  /** 购买须知（u-parse 渲染） */
  purchase_information:
    '数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满18周岁，并小于60周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。请勿对数字藏品进行炒作、场外交易、欺诈，或以任何其他非法方式进行使用。',
  /** 作者介绍 → 取 publisher.name */
  publisher: {
    name: '嗒嗒',
    company_logo: '/uploads/20260912/641fb93746a2b4b145c6ce0479225bb7.png'
  },
  /** 发售系列 → 取 series.name */
  series: {
    id: 26,
    name: '神武专精'
  },
  /** 批次（盲盒） */
  batch: {
    id: 7,
    collection_id: 20,
    start_time: 1792404000,
    end_time: 1792407600,
    total_num: 20000,
    sale_total_num: 0,
    has_num: 1,
    /** ★ 原站 darwIsOpen 判定字段：0 → 普通发售（不显示抽签流程） */
    open_draw: 0,
    sign_up_start_time: null,
    sign_up_end_time: null,
    draw_time: 0,
    purchase_quantity: 1
  }
}

/** signUpDraw 返回：抽签成功后的签号 */
export const SIGN_UP_INFO = { code: 'No.20261020-8823' }

/** drawLog 返回：{ whether_res: -1|0|1, my_code: [签号], my_draw_num: 签号序号 } */
export const DRAW_CODE_INFO = {
  whether_res: -1,
  my_code: [],
  my_draw_num: 0
}

/** 抽签说明（弹窗，u-parse 渲染） */
export const DRAW_LOTS_NOTICE =
  '<p>1. 抽签时间为藏品发售前，活动期间每个账号可参与一次。</p><p>2. 系统将随机抽取中签用户，中签名单以系统随机结果为准。</p><p>3. 中签用户需在规定时间内完成购买，逾期视为放弃。</p>'

/**
 * 创建订单成功返回 —— 原站 /order/pay/CreateOrder
 * 前端只用data.order_sn / data.order_id 去调起支付
 */
export const ORDER_CREATED = {
  order_id: 1,
  order_sn: 'T20261020000001'
}

/* ---------------- 订单列表（pages/order/list） ---------------- */

/**
 * 订单列表 —— 原站 /order/order/orderList
 * 实调（2026-10-20，token 登录后）：total=0，per_page=15，current_page=1，last_page=0
 * 即原站该账号当前无任何订单数据，页面会走「暂无订单数据」空态。
 * 本 mock 保留原站字段结构（goods_name / order_sn / total_price / order_status /
 * order_type / createtime / goods_cover_image / collection_code / num），
 * 以便前端结构与原站完全一致。
 */
export const ORDER_LIST = {
  total: 3,
  per_page: 15,
  current_page: 1,
  last_page: 1,
  data: [
    {
      id: 101,
      order_sn: 'T20261020000001',
      order_type: 1,
      order_status: 1,
      goods_id: 20,
      goods_name: '打王神鞭',
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      collection_code: ['A001/20000', 'A002/20000'],
      total_price: '9.90',
      price: '9.90',
      num: 1,
      createtime: 1792483200,
      updatetime: 1792483200,
      transfer_time: 0
    },
    {
      id: 102,
      order_sn: 'T20261019000002',
      order_type: 1,
      order_status: 2,
      goods_id: 26,
      goods_name: '凌霄宝殿',
      goods_cover_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      collection_code: ['B010/5000'],
      total_price: '19.90',
      price: '19.90',
      num: 2,
      createtime: 1792406400,
      updatetime: 1792406400,
      transfer_time: 1792407000
    },
    {
      id: 103,
      order_sn: 'T20261018000003',
      order_type: 1,
      order_status: 3,
      goods_id: 18,
      goods_name: '神威无敌',
      goods_cover_image: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
      collection_code: ['C001/10000'],
      total_price: '9.90',
      price: '9.90',
      num: 1,
      createtime: 1792320000,
      updatetime: 1792320600,
      transfer_time: 0
    }
  ]
}

/**
 * 批量付订单 —— 原站 /order/order/batchPayOrder
 * 返回 { batch_order_id, endtime, data: [...] }
 * 列表项含 income_type（支付渠道数组）、check（是否勾选，默认全选）
 */
export const BATCH_ORDER_LIST = {
  batch_order_id: 88,
  /** 批付截止时间：当前时间 + 15 分钟（原站为秒级时间戳，倒计时实时递减） */
  endtime: Math.floor(Date.now() / 1000) + 900,
  data: [
    {
      id: 201,
      order_sn: 'T20261020000101',
      goods_id: 20,
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      total_price: '9.90',
      total_num: 20000,
      collection_code: 'A001',
      createtime: 1792483200,
      income_type: ['yibao'],
      check: true
    },
    {
      id: 202,
      order_sn: 'T20261020000102',
      goods_id: 26,
      goods_cover_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      total_price: '19.90',
      total_num: 5000,
      collection_code: 'B010',
      createtime: 1792483200,
      income_type: ['yibao'],
      check: true
    }
  ]
}

/** 求购订单 —— 原站 /market/trade/begBuyOrderList（type=11） */
export const BEG_ORDER_LIST = {
  total: 4,
  per_page: 15,
  current_page: 1,
  last_page: 1,
  data: [
    {
      id: 301,
      order_sn: 'T20261020000201',
      order_type: 11,
      order_status: 1,
      goods_id: 20,
      goods_name: '打王神鞭',
      series_name: '神武专精',
      goods_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      price: '9.90',
      total_price: '9.90',
      number: 1,
      sale_number: 0,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792483200
    },
    {
      id: 302,
      order_sn: 'T20261020000202',
      order_type: 11,
      order_status: 2,
      goods_id: 21,
      goods_name: '九霄环佩',
      series_name: '神武专精',
      goods_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      price: '19.90',
      total_price: '39.80',
      number: 2,
      sale_number: 1,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792570000
    },
    {
      id: 303,
      order_sn: 'T20261020000203',
      order_type: 11,
      order_status: 3,
      goods_id: 22,
      goods_name: '山河社稷图',
      series_name: '上古神器',
      goods_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      price: '29.90',
      total_price: '89.70',
      number: 3,
      sale_number: 3,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792656000
    },
    {
      id: 304,
      order_sn: 'T20261020000204',
      order_type: 11,
      order_status: 4,
      goods_id: 23,
      goods_name: '打王神鞭',
      series_name: '神武专精',
      goods_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      price: '9.90',
      total_price: '9.90',
      number: 1,
      sale_number: 0,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792742000
    }
  ]
}

/** 委托订单 —— 原站 getMyEntrustList → /market/Prepayment/PrepaymentListMain（order_type=31）
 *  四条各覆盖一个 tab：1 待支付 / 2 委托中（number>1 走进度条）/ 3 已成交 / 4 已取消 */
export const ENTRUST_ORDER_LIST = {
  total: 4,
  per_page: 15,
  current_page: 1,
  last_page: 1,
  data: [
    {
      id: 401,
      order_sn: 'T20261020000301',
      order_type: 31,
      order_status: 1,
      goods_id: 26,
      goods_name: '凌霄宝殿',
      series_name: '上古神器',
      goods_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      goods_cover_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      price: '19.90',
      total_price: '19.90',
      number: 1,
      sale_number: 0,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792483200
    },
    {
      id: 402,
      order_sn: 'T20261020000302',
      order_type: 31,
      order_status: 2,
      goods_id: 27,
      goods_name: '山河社稷图',
      series_name: '上古神器',
      goods_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      price: '29.90',
      total_price: '149.50',
      number: 5,
      sale_number: 3,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792570000
    },
    {
      id: 403,
      order_sn: 'T20261020000303',
      order_type: 31,
      order_status: 3,
      goods_id: 28,
      goods_name: '九霄环佩',
      series_name: '神武专精',
      goods_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      goods_cover_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      price: '19.90',
      total_price: '39.80',
      number: 2,
      sale_number: 2,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792656000
    },
    {
      id: 404,
      order_sn: 'T20261020000304',
      order_type: 31,
      order_status: 4,
      goods_id: 29,
      goods_name: '打王神鞭',
      series_name: '神武专精',
      goods_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      price: '9.90',
      total_price: '9.90',
      number: 1,
      sale_number: 0,
      pay_way: 'yibao',
      createtime: 1792483200,
      updatetime: 1792742000
    }
  ]
}

/**
 * 订单详情 —— 原站 `/order/order/orderDetail/ids/{id}`
 *
 * 字段严格对齐原站 render `3038` 及其 4 个子组件（OrderStatus/GoodsBar/GoodsInfo/OrderAction）
 * 的实际读取项，不多不少：
 *   OrderStatus : order_type / order_status / surplus_time_text / updatetime
 *   GoodsBar    : goods_cover_image / goods_name
 *   GoodsInfo   : order_type / collection_list[] / num / price / total_price
 *                 goods_type / collection_code[] / order_sn / income_type
 *                 buy_order_sn / card[](card_sn, card_keys, card_pwd, show_pwd)
 *   OrderAction : order_status / id / pay_type / pay_way / order_sn
 *                 / total_price / price
 * 说明：该账号在原站实调 `orderList` 返回 total:0，无真实订单，故详情为 mock。
 */
const DETAIL_BASE = {
  order_type: 1,
  goods_id: 20,
  goods_name: '打王神鞭',
  goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  goods_type: 1,
  pay_type: 1,
  pay_way: 'yibao',
  income_type: 'yibao',
  collection_code: ['A001/20000'],
  collection_list: [],
  num: 1,
  card: [],
  buy_order_sn: 'BUY2026102000099887',
  createtime: 1792483200,
  updatetime: 1792483200,
  pay_time: 0
}

/** 三种状态各一条，便于验收 status=1/2/3 三个操作区分支 */
export const ORDER_DETAIL_MAP = {
  101: {
    ...DETAIL_BASE,
    id: 101,
    order_sn: 'T20261020000001',
    order_status: 1,
    price: '9.90',
    total_price: '9.90',
    /** 剩余支付秒数（原站为「剩余秒」，前端 u-count-down time=1000*该值） */
    surplus_time_text: 900,
    collection_code: ['A001/20000', 'A002/20000'],
    collection_list: [
      { collection_code: 'A001/20000', collection_sn: 'SN-A001', from_price: '4.95' },
      { collection_code: 'A002/20000', collection_sn: 'SN-A002', from_price: '4.95' }
    ]
  },
  102: {
    ...DETAIL_BASE,
    id: 102,
    order_sn: 'T20261019000002',
    order_status: 2,
    goods_id: 26,
    goods_name: '凌霄宝殿',
    goods_cover_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
    price: '19.90',
    total_price: '19.90',
    surplus_time_text: 0,
    collection_code: ['B010/5000'],
    collection_list: [
      { collection_code: 'B010/5000', collection_sn: 'SN-B010', from_price: '19.90' }
    ]
  },
  103: {
    ...DETAIL_BASE,
    id: 103,
    order_sn: 'T20261018000003',
    order_status: 3,
    goods_id: 31,
    goods_name: '九霄神雷',
    goods_cover_image: '/assets/img/collection/back_btn.webp',
    price: '0.01',
    total_price: '0.01',
    surplus_time_text: 0,
    collection_code: ['C001/8888'],
    collection_list: [
      { collection_code: 'C001/8888', collection_sn: 'SN-C001', from_price: '0.01' }
    ]
  },
  /** E卡形态订单（order.card 有值，goods_type≠1 走商品编号 chips 分支） */
  104: {
    ...DETAIL_BASE,
    id: 104,
    order_sn: 'T20261017000004',
    order_status: 2,
    goods_type: 2,
    goods_name: '灵能E卡 · 至尊礼包',
    price: '88.00',
    total_price: '88.00',
    surplus_time_text: 0,
    collection_code: ['EC001/100', 'EC002/100'],
    collection_list: [
      { collection_code: 'EC001/100', collection_sn: 'SN-EC001', from_price: '44.00' },
      { collection_code: 'EC002/100', collection_sn: 'SN-EC002', from_price: '44.00' }
    ],
    card: [
      { card_sn: '6281 8827 4431 0092', card_keys: '**** **** **** 3371', card_pwd: '', show_pwd: false },
      { card_sn: '6281 8827 4431 0093', card_keys: '**** **** **** 3372', card_pwd: '', show_pwd: false }
    ]
  }
}

/** 默认取 101（待付款，含倒计时与购买明细双行） */
export function getOrderDetailMock(id = 101) {
  const key = Number(id)
  return JSON.parse(JSON.stringify(ORDER_DETAIL_MAP[key] || ORDER_DETAIL_MAP[101]))
}

/**
 * 市场（寄售）订单详情 —— 原站 `getMarketOrderDetails`
 *   POST /order/order/saleMarketOrderDetail  body { order_id }
 *   实调（2026-10-25）：该账号 `orderList` total=0，`saleMarketOrderDetail` 一律
 *   返回「订单不存在」（code 0），故此处为 mock。
 *
 * 页面 script `52c4` 拿到数据后**强制** `info.order_type = 8`：
 *   - GoodsInfo 区块1（购买明细）不渲染
 *   - 区块2 不显示「购买数量」，只显示「寄售金额」
 *   - 区块3 商品编号 chips 仍渲染（goods_type != 1 且 collection_code.length > 1）
 *   - 区块4 订单信息始终渲染
 */
const MARKET_DETAIL_BASE = {
  order_type: 8,
  goods_id: 26,
  goods_name: '凌霄宝殿',
  goods_cover_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
  goods_type: 1,
  pay_type: 1,
  pay_way: 'yibao',
  income_type: 'yibao',
  collection_code: ['B010/5000'],
  collection_list: [],
  num: 1,
  card: [],
  buy_order_sn: 'BUY2026102500044126',
  sale_user_collection_id: 3021,
  createtime: 1792540800,
  updatetime: 1792540800
}

export const MARKET_ORDER_DETAIL_MAP = {
  /** order_status = 1 寄售成功 → 底部「取消寄售」；goods_type≠1 且编号>1 → 渲染商品编号 chips */
  201: {
    ...MARKET_DETAIL_BASE,
    id: 201,
    order_sn: 'T20261025000001',
    order_status: 1,
    goods_type: 2,
    price: '19.90',
    total_price: '19.90',
    collection_code: ['B010/5000', 'B011/5000'],
    collection_list: [
      { collection_code: 'B010/5000', collection_sn: 'SN-B010', from_price: '19.90' }
    ]
  },
  /** order_status = 2 藏品已售出,结算成功 → 无底部按钮 */
  202: {
    ...MARKET_DETAIL_BASE,
    id: 202,
    order_sn: 'T20261024000002',
    order_status: 2,
    price: '29.90',
    total_price: '29.90',
    collection_code: ['B020/5000'],
    collection_list: [
      { collection_code: 'B020/5000', collection_sn: 'SN-B020', from_price: '29.90' }
    ]
  },
  /** order_status = 3 订单取消 → 底部「继续寄售」 */
  203: {
    ...MARKET_DETAIL_BASE,
    id: 203,
    order_sn: 'T20261023000003',
    order_status: 3,
    price: '9.90',
    total_price: '9.90',
    collection_code: ['B030/5000'],
    collection_list: [
      { collection_code: 'B030/5000', collection_sn: 'SN-B030', from_price: '9.90' }
    ]
  }
}

/** 默认取 201（寄售成功，含「取消寄售」按钮与商品编号 chips） */
export function getMarketOrderDetailMock(id = 201) {
  const key = Number(id)
  return JSON.parse(JSON.stringify(MARKET_ORDER_DETAIL_MAP[key] || MARKET_ORDER_DETAIL_MAP[201]))
}

/* ============================================================
 * 转赠订单详情页 pages/order/regiftDetail（第 18 页）
 * 反编译：all2/pages-order-regiftDetail.dee640c4.js
 *   页面 script 3ca8 / render adce / scope 3c9fc44c
 *   接口 `7db7`：getRegiftOrderDetails → POST /order/order/giveOrderDetail/ids/{id}
 *
 * ★ 原站实调（2026-10-25，账号 17587881293）：
 *   POST /order/order/giveOrderDetail/ids/40021
 *     → {code:0, msg:"找不到该订单或已被删除", data:null}
 *   orderList 遍历 order_type 1/2/3/4/5/6/7/8/10 均 total:0
 *   ⇒ 该账号无转赠订单，故此处为 mock。
 *
 * 转赠订单 order_type = 19（由订单列表 OrderItem.toDetail 分发确认，
 *   见 all2/pages-order-list.8eca8ff0.js 模块 927f：
 *   19 == order_type → /pages/order/regiftDetail）
 *
 * ORDER_STATUS_MAP[19]（原站 statusMap 模块 c646d）：
 *   1 待付款（待支付 + 支付倒计时）→ 取消订单 + 确认支付
 *   2 藏品转入成功              → 我的收藏 + 继续购买
 *   3 订单已取消                → 继续购买
 *   5 待退款 / 6 已退款          → 无底部操作条（[5,6] 不渲染 OrderAction）
 *   7 藏品转入中                → 转入中（disabled）
 * ============================================================ */

const REGIFT_DETAIL_BASE = {
  order_type: 19,
  goods_id: 20,
  goods_name: '打王神鞭',
  goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  goods_type: 2,
  pay_type: 1,
  pay_way: 'yibao',
  income_type: 'yibao',
  collection_code: ['A001/20000'],
  collection_list: [],
  num: 1,
  card: [],
  buy_order_sn: 'BUY2026102500099128',
  createtime: 1792540800,
  updatetime: 1792540800,
  pay_time: 0
}

export const REGIFT_ORDER_DETAIL_MAP = {
  /** order_status = 1 待支付：倒计时 + 取消订单/确认支付 */
  50001: {
    ...REGIFT_DETAIL_BASE,
    id: 50001,
    order_sn: 'G20261025000001',
    order_status: 1,
    price: '9.90',
    total_price: '9.90',
    /** 剩余支付秒数（u-count-down time = 1000 × 该值，格式 mm:ss） */
    surplus_time_text: 900,
    collection_code: ['A001/20000', 'A002/20000'],
    collection_list: [
      { collection_code: 'A001/20000', collection_sn: 'SN-A001', from_price: '4.95' },
      { collection_code: 'A002/20000', collection_sn: 'SN-A002', from_price: '4.95' }
    ]
  },
  /** order_status = 2 转入成功：我的收藏 + 继续购买 */
  50002: {
    ...REGIFT_DETAIL_BASE,
    id: 50002,
    order_sn: 'G20261024000002',
    order_status: 2,
    goods_id: 26,
    goods_name: '凌霄宝殿',
    goods_cover_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
    price: '19.90',
    total_price: '19.90',
    surplus_time_text: 0,
    collection_code: ['B010/5000'],
    collection_list: [
      { collection_code: 'B010/5000', collection_sn: 'SN-B010', from_price: '19.90' }
    ]
  },
  /** order_status = 7 转入中：转入中（disabled 按钮） */
  50003: {
    ...REGIFT_DETAIL_BASE,
    id: 50003,
    order_sn: 'G20261023000003',
    order_status: 7,
    price: '29.90',
    total_price: '29.90',
    surplus_time_text: 0,
    collection_code: ['C001/8888'],
    collection_list: [
      { collection_code: 'C001/8888', collection_sn: 'SN-C001', from_price: '29.90' }
    ]
  },
  /** order_status = 3 已取消：继续购买 */
  50004: {
    ...REGIFT_DETAIL_BASE,
    id: 50004,
    order_sn: 'G20261022000004',
    order_status: 3,
    goods_id: 31,
    goods_name: '九霄神雷',
    goods_cover_image: '/assets/img/collection/back_btn.webp',
    price: '0.01',
    total_price: '0.01',
    surplus_time_text: 0,
    collection_code: ['D001/6666'],
    collection_list: [
      { collection_code: 'D001/6666', collection_sn: 'SN-D001', from_price: '0.01' }
    ]
  },
  /** order_status = 6 已退款：无底部操作条（[5,6] 分支） */
  50005: {
    ...REGIFT_DETAIL_BASE,
    id: 50005,
    order_sn: 'G20261021000005',
    order_status: 6,
    price: '39.90',
    total_price: '39.90',
    surplus_time_text: 0,
    collection_code: ['E001/7777'],
    collection_list: [
      { collection_code: 'E001/7777', collection_sn: 'SN-E001', from_price: '39.90' }
    ]
  }
}

/** 默认取 50001（待支付，含支付倒计时与「取消订单 / 确认支付」双按钮） */
export function getRegiftOrderDetailMock(id = 50001) {
  const key = Number(id)
  return JSON.parse(JSON.stringify(REGIFT_ORDER_DETAIL_MAP[key] || REGIFT_ORDER_DETAIL_MAP[50001]))
}

/* ============================================================
 * 我的藏品页 pages/myCollection/myCollection（第 13 页）
 * 反编译：pages-myCollection-myCollection.ea8eb40f.js
 *   页面 script 5f37 / render 6b23 / scope ef6dd94a
 *   子组件：
 *     collectionSearch    48d0 → e842(script) / a6af(render) / scope 11f074a4
 *     collectionItem      0a4a → 39c4(script) / cc0f(render) / scope c1e22e5c
 *     popDetails          ba48 → 121a(script) / cc38(render) / scope 8d59f590
 *     myConsignmentsItem  fc2c → c224(script) / bf12c(render) / scope f963d85e
 *
 * ★ 原站实调（2026-10-21，账号 17587881293）：
 *   /user_collection/user_collection/antMycollection → total:0, data:[]
 *   /order/order/myConsignment                       → total:0, data:[]
 *   /user_collection/user_collection/likeCollection   → data:[]
 *   ⇒ 该账号无任何藏品/寄售记录，故全部走 mock。
 *
 * 四个 tab（collectionSearch.tabList）：
 *   藏品 types=2 / 盲盒 types=1 / 寄售 types=6 / 已售 types=3
 * ============================================================ */

/** 藏品卡（collectionItem）—— types=2 藏品 / types=3 已售 */
const MC_COLLECTION_ITEM = {
  collection: {
    id: 20,
    name: '打王神鞭',
    listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
    main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
    total_num: 20000,
    batch_id: 7
  },
  /** user_collection：用户持有的那一份（编号 / 状态 / 来源） */
  user_collection: {
    id: 30021,
    collection_id: 20,
    collection_code: 'A001',
    total_num: 20000,
    status: 1,
    source_type: 1,
    is_lock: 0,
    is_link: 0,
    can_compose: 0,
    day: 26,
    from_price: '9.90'
  },
  price: '9.90',
  total_price: '9.90',
  num: 1,
  lock_num: 0,
  sell_num: 0,
  can_compound: 0,
  is_collection: 0
}

/** 盲盒卡（collectionItem，types=1 分支） */
const MC_BLIND_BOX_ITEM = {
  collection: {
    id: 21,
    name: '幸运盲盒',
    listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
    main_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
    total_num: 5000,
    batch_id: 8
  },
  user_collection: {
    id: 30022,
    collection_id: 21,
    collection_code: 'B010',
    total_num: 5000,
    status: 1,
    source_type: 3,
    is_lock: 0,
    is_link: 0,
    can_compose: 0,
    day: 12,
    from_price: '19.90'
  },
  price: '19.90',
  total_price: '19.90',
  num: 1,
  lock_num: 0,
  sell_num: 0,
  can_compound: 0,
  is_collection: 0
}

/** 寄售列表项（myConsignmentsItem，types=6） */
const MC_CONSIGNMENT_ITEM = {
  id: 201,
  goods_name: '打王神鞭',
  goods_cover_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
  price: '9.90',
  status: 1,
  user_collection: {
    id: 30021,
    collection_code: 'A001',
    total_num: 20000
  }
}

/** antMycollection 分页返回 */
export const MY_COLLECTION_MAP = {
  2: { list: [MC_COLLECTION_ITEM, { ...MC_COLLECTION_ITEM, collection: { ...MC_COLLECTION_ITEM.collection, id: 22, name: '神威长戟', listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg' }, user_collection: { ...MC_COLLECTION_ITEM.user_collection, id: 30023, collection_id: 22, collection_code: 'A002' } }] },
  1: { list: [MC_BLIND_BOX_ITEM] },
  3: { list: [{ ...MC_COLLECTION_ITEM, user_collection: { ...MC_COLLECTION_ITEM.user_collection, status: 2, source_type: 2 } }] }
}

/** myConsignment 分页返回 */
export const MY_CONSIGNMENT_LIST = { list: [MC_CONSIGNMENT_ITEM] }

/**
 * 用户藏品详情（原站 user_collection_Detail → getDetail）
 * popDetails 内使用：list.data[] 每项含 collection 对象与 collection_code / status / day 等
 */
export const USER_COLLECTION_DETAIL = {
  collection: {
    id: 20,
    name: '打王神鞭',
    listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
    batch_up: 1
  },
  list: {
    total: 2,
    last_page: 1,
    data: [
      {
        id: 30021,
        collection_code: 'A001',
        collection: { id: 20, name: '打王神鞭', total_num: 20000 },
        from_price: '9.90',
        status: 1,
        source_type: 1,
        is_lock: 0,
        is_link: 0,
        can_compose: 0,
        day: 26
      },
      {
        id: 30023,
        collection_code: 'A002',
        collection: { id: 22, name: '神威长戟', total_num: 12000 },
        from_price: '12.90',
        status: 2,
        source_type: 2,
        is_lock: 0,
        is_link: 0,
        can_compose: 0,
        day: 8
      }
    ]
  }
}

/** likeCollection 搜索建议 */
export const LIKE_COLLECTION_LIST = [
  { collection_id: 20, name: '打王神鞭' },
  { collection_id: 22, name: '神威长戟' }
]

/** 我的藏品列表（原站 antMycollection） */
export function getMyCollectionMock(params = {}) {
  const types = Number(params.types ?? 2)
  const page = Number(params.page ?? 1)
  const conf = MY_COLLECTION_MAP[types] || MY_COLLECTION_MAP[2]
  const perPage = 15
  const total = conf.list.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const slice = page <= 1 ? conf.list : []
  return {
    total,
    per_page: perPage,
    current_page: page,
    last_page: lastPage,
    data: slice
  }
}

/** 我的寄售列表（原站 myConsignment） */
export function getMyConsignmentMock(params = {}) {
  const page = Number(params.page ?? 1)
  const perPage = 10
  const total = MY_CONSIGNMENT_LIST.list.length
  return {
    total,
    per_page: perPage,
    current_page: page,
    last_page: 1,
    data: page <= 1 ? MY_CONSIGNMENT_LIST.list : []
  }
}

/* ==================== 第 14 页：寄售发起页 pages/consignments/consignments ==================== */

/**
 * 原站接口：GET_USER_COLLECTION_DETAIL
 * POST /user_collection/user_collection/detail/ids/{id1,id2}
 * 传逗号分隔的多份 id（批量寄售时多件同系列）
 * 返回结构：{ product: { id, name, listimg, reprice_limit, goods_type }, collection_code, from_price }
 */
export const CONSIGN_DETAIL_MAP = {
  30021: {
    product: {
      id: 20,
      name: '打王神鞭',
      listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      goods_type: 1,
      total_num: 20000,
      reprice_limit: '9.90'
    },
    collection_code: 'A001',
    from_price: '9.90'
  },
  30022: {
    product: {
      id: 21,
      name: '幸运盲盒',
      listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      main_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      goods_type: 2,
      total_num: 5000,
      reprice_limit: '19.90'
    },
    collection_code: 'B010',
    from_price: '19.90'
  },
  30023: {
    product: {
      id: 22,
      name: '神威长戟',
      listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
      main_image: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
      goods_type: 1,
      total_num: 12000,
      reprice_limit: '12.90'
    },
    collection_code: 'A002',
    from_price: '12.90'
  }
}

/**
 * 原站接口：GET_SELL_CONFIG
 * POST /user_collection/user_collection/show_resale_money  { price, user_collection_id }
 * 返回：pay_platform_service_rate 平台手续费率、low_price 市场最低价、
 *      low_price_text、share_proportion_rate 分成比例
 */
export const SELL_CONFIG = {
  pay_platform_service_rate: 0.05,
  low_price: '9.90',
  low_price_text: '9.90',
  share_proportion_rate: 0
}

/**
 * 原站接口：SELL_PRODUCT
 * POST /user_collection/user_collection/resale          （单件）
 * POST /user_collection/user_collection/batch_resale    （多件，id 含逗号）
 * 参数：{ user_collection_id, price, pay_password, income_type }
 * 返回：{ id }（寄售单 id） 或 { password_error: 1 }（操作密码错误）
 */
export const SELL_PRODUCT_RESULT = { id: 201 }

/** 收款账户（w-radio-account 内 appConfig.default_pay_type = 'yibao'） */
export const PAY_ACCOUNT = {
  image: '/assets/img/consignments/yibao-image.webp',
  name: '易宝支付',
  type: 'yibao',
  describe: '',
  isOpen: 1,
  isShowOpen: true
}

/** 寄售页详情 mock：按逗号分隔的 id 列表取第一份（与原站 getDetail 一致） */
export function getConsignDetailMock(ids = '') {
  const list = String(ids).split(',').filter(Boolean)
  const first = CONSIGN_DETAIL_MAP[list[0]] || CONSIGN_DETAIL_MAP[30021]
  return { ...first }
}

/* ==================== 第 15 页：藏品详情页 pages/myCollection/collectionDetails ==================== */

/**
 * 原站接口：GET_USER_COLLECTION_DETAILS（第 15 页专用别名，与寄售页同一接口）
 * POST /user_collection/user_collection/detail/ids/{id}
 * 返回（本页用到的字段）：
 *   id / status（1 已购未寄售 · 2 寄售中 · 10 赠送中）
 *   types（覆盖 product.goods_type：1 普通藏品 / 2 盲盒）
 *   collection_code 编号 / cert_time 认证时间 / series_name 所属专辑
 *   rz_code 认证标识 / user_hash 合约地址 / user_hash_text 合约地址(短)
 *   is_img_diff（1 时用顶层 name/img 覆盖 product）
 *   market_goods { id } 寄售单（取消寄售用）
 *   product{
 *     id, name, main_image, listimg, total_num 发行份数,
 *     is_lock 锁定标记, weither_regift 允许转赠, weither_resale 允许寄售,
 *     can_compose 可合成, publisher{name} 创作者, series{name} 专辑,
 *     collection_list[] 盲盒子藏品, introduce_image 藏品详情富文本,
 *     purchase_information 购买须知富文本
 *   }
 */
export const COLLECTION_DETAIL_MAP = {
  /* 普通藏品 · 已购未寄售 → 底部出「转赠 / 立即寄售」 */
  30021: {
    id: 30021,
    status: 1,
    types: 1,
    collection_code: 'A001',
    cert_time: '2025-03-18',
    series_name: '封神榜·法宝系列',
    rz_code: 'RZ-2025-0318-0001',
    user_hash: '0x8f3a2c1b9d7e4f6051827364a5b8c9d0e1f2a3b4c',
    user_hash_text: '0x8f3a...9d0e',
    market_goods: { id: 0 },
    is_img_diff: 0,
    name: '',
    img: '',
    product: {
      id: 20,
      name: '打王神鞭',
      main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      total_num: 20000,
      is_lock: 0,
      weither_regift: 0,
      weither_resale: 0,
      can_compose: 0,
      is_img_diff: 0,
      publisher: { id: 7, name: '非同艺术' },
      series: { id: 3, name: '封神榜·法宝系列' },
      collection_list: [],
      introduce_image:
        '<p>打王神鞭，取材自《封神演义》中姜子牙手中神兵。整体以青铜錾刻工艺成型，纹路取自商周饕餮，握处包覆玄铁，寓意镇守四方、护佑平安。</p><p>本藏品采用链上唯一编号，藏品详情页所展示图片为实物拍摄，因拍摄光线差异略有色差，以实际交付为准。</p>',
      purchase_information: ''
    }
  },
  /* 盲盒 · 已购未寄售（types=2，不渲染盲盒藏品区块）→ 「转赠 / 立即寄售」 */
  30022: {
    id: 30022,
    status: 1,
    types: 2,
    collection_code: 'B010',
    cert_time: '2025-04-02',
    series_name: '潮玩盲盒季',
    rz_code: 'RZ-2025-0402-0010',
    user_hash: '0x2b7e91d4c0a856f3e24b19c7d80f5a63c18e4d92',
    user_hash_text: '0x2b7e...4d92',
    market_goods: { id: 0 },
    is_img_diff: 0,
    name: '',
    img: '',
    product: {
      id: 21,
      name: '幸运盲盒',
      main_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
      total_num: 5000,
      is_lock: 0,
      weither_regift: 0,
      weither_resale: 0,
      can_compose: 0,
      is_img_diff: 0,
      publisher: { id: 9, name: '潮玩研究所' },
      series: { id: 5, name: '潮玩盲盒季' },
      collection_list: [],
      introduce_image: '',
      purchase_information: ''
    }
  },
  /* 普通藏品 · 寄售中 → 底部出「取消寄售」 */
  30023: {
    id: 30023,
    status: 2,
    types: 1,
    collection_code: 'A002',
    cert_time: '2025-05-21',
    series_name: '山海经·异兽篇',
    rz_code: 'RZ-2025-0521-0002',
    user_hash: '0x7d4e0b93f26a1c85d3b74e0f9125ac68b04d7e13',
    user_hash_text: '0x7d4e...7e13',
    market_goods: { id: 202 },
    is_img_diff: 0,
    name: '',
    img: '',
    product: {
      id: 22,
      name: '神威长戟',
      main_image: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
      listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
      total_num: 12000,
      is_lock: 0,
      weither_regift: 0,
      weither_resale: 0,
      can_compose: 0,
      is_img_diff: 0,
      publisher: { id: 7, name: '非同艺术' },
      series: { id: 8, name: '山海经·异兽篇' },
      collection_list: [
        { id: 2201, name: '白泽·灵兽', main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg', sold_num: 4200 },
        { id: 2202, name: '九尾·天狐', main_image: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg', sold_num: 3860 },
        { id: 2203, name: '穷奇·凶兽', main_image: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg', sold_num: 2940 }
      ],
      introduce_image: '',
      purchase_information: ''
    }
  },
  /* 赠送中（status=10）→ 底部「赠送中」禁用 */
  30024: {
    id: 30024,
    status: 10,
    types: 1,
    collection_code: 'A003',
    cert_time: '2025-06-11',
    series_name: '山海经·异兽篇',
    rz_code: 'RZ-2025-0611-0003',
    user_hash: '0x1a9c6f42e8b035d7f92c4a08b1d6e5739c2a4f80',
    user_hash_text: '0x1a9c...4f80',
    market_goods: { id: 0 },
    is_img_diff: 0,
    name: '',
    img: '',
    product: {
      id: 23,
      name: '灵山玉符',
      main_image: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
      total_num: 8000,
      is_lock: 0,
      weither_regift: 0,
      weither_resale: 0,
      can_compose: 0,
      is_img_diff: 0,
      publisher: { id: 7, name: '非同艺术' },
      series: { id: 8, name: '山海经·异兽篇' },
      collection_list: [],
      introduce_image: '',
      purchase_information: ''
    }
  }
}

/** 藏品详情 mock：按 user_collection_id 取，未命中回落到 30021 */
export function getCollectionDetailMock(id = '') {
  const base = COLLECTION_DETAIL_MAP[id] || COLLECTION_DETAIL_MAP[30021]
  /* 取消寄售后原站会重新拉取，status 由 2 变 1、market_goods 清空 */
  const override = MC_CONSIGN_CANCELED[String(base.market_goods?.id)]
  if (override) {
    return { ...base, status: 1, market_goods: { id: 0 }, product: { ...base.product, weither_regift: 0, weither_resale: 0 } }
  }
  return base
}

/**
 * 取消寄售状态覆盖表：market_goods.id → true
 * （原站取消成功后藏品回到 status 1、可再次寄售/转赠）
 */
export const MC_CONSIGN_CANCELED = {}

/** 标记某寄售单已取消（供 changeMarketGoods 的 mock 调用） */
export function markConsignCanceled(marketGoodsId) {
  if (marketGoodsId) MC_CONSIGN_CANCELED[String(marketGoodsId)] = true
}

/** 未开启寄售/转赠（底部出「尚未开启寄售」禁用态） */
export function getCollectionNoWeitherMock(id = '') {
  const base = getCollectionDetailMock(id)
  return {
    ...base,
    product: { ...base.product, weither_regift: 1, weither_resale: 1, can_compose: 0 }
  }
}

/* ==================== 第 16 页：发起转赠页 pages/regift/regift ==================== */

/**
 * 原站接口：SEARCH_USER
 * POST /user/ParamsToUser   body { phone }
 *   phone 支持「用户 uid / 手机号 / 钱包地址」三种输入
 * 返回：{ id, nickname, avatar, mobile(打码), ntf_url(钱包地址), nft_url, url }
 *
 * 原站实调（账号 17587881293 登录后）：
 *   body { phone:'175' } → code:1
 *   { id:1, nickname:'tcCXepzumG', avatar:'/defautAvatar.png',
 *     mobile:'101508*****', ntf_url:null, nft_url:null, url:'/u/1' }
 */
export const REGIFT_USER = {
  id: 1,
  nickname: 'tcCXepzumG',
  avatar: '/defautAvatar.png',
  mobile: '101508*****',
  ntf_url: null,
  nft_url: null,
  url: '/u/1'
}

/**
 * 原站接口：GIVING_PRODUCT
 * POST /user_collection/user_collection/reGift
 * body { pay_password, re_user_id, user_collection_id, price }
 * 返回：{ code:1, msg:'赠送成功' }
 *
 * 原站实调（错误操作密码）：{ code:0, msg:'密码错误' }
 */
export const GIVING_RESULT = { id: 30021, status: 10 }

/** 搜索用户 mock：按输入串匹配，命中返回 REGIFT_USER，否则返回 null（前端 toast「用户不存在」） */
export function getRegiftUserMock(key = '') {
  const k = String(key).trim()
  if (!k) return null
  return { ...REGIFT_USER }
}

/* ==================== 第 17 页：转赠记录页 ==================== */

/**
 * 原站接口：GET_GIVE_RECORD
 * POST /user/aboutGift   body { page, types }
 *   types=1 我转赠的；types=2 我收到的
 *   返回：{ code:1, msg:'转赠记录', data:{ total, per_page:15, current_page:1, last_page:0, data:[] } }
 *
 * 原站实调（账号 17587881293）：types=1/2 均返回 total:0, data:[]（该账号无转赠记录）
 * 本地 mock 提供样例数据用于版式验收，字段与原站响应结构一致
 */
const GIVE_RECORD_ITEM = {
  id: 40021,
  product: {
    id: 20,
    name: '打王神鞭',
    listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg',
    total_num: 20000
  },
  usercollection: {
    id: 30021,
    collection_id: 20,
    collection_code: 'A001',
    types: 2
  },
  user: { id: 1, mobile: '101508*****' },
  from_user: { id: 2, mobile: '101508*****' },
  createtime: 1758788129
}

const GIVE_RECORD_LIST = {
  1: [
    { ...GIVE_RECORD_ITEM, id: 40021 },
    {
      ...GIVE_RECORD_ITEM,
      id: 40022,
      product: {
        id: 21,
        name: '幸运盲盒',
        listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg',
        total_num: 5000
      },
      usercollection: { id: 30022, collection_id: 21, collection_code: 'B010', types: 1 },
      createtime: 1758700000
    }
  ],
  2: [
    {
      ...GIVE_RECORD_ITEM,
      id: 40023,
      product: {
        id: 22,
        name: '神威长戟',
        listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg',
        total_num: 12000
      },
      usercollection: { id: 30023, collection_id: 22, collection_code: 'A002', types: 2 },
      createtime: 1758600000
    }
  ]
}

/** 转赠记录 mock：按 types 返回分页结构 */
export function getGiveRecordMock(params = {}) {
  const types = Number(params.types ?? 1)
  const page = Number(params.page ?? 1)
  const perPage = 15
  const all = GIVE_RECORD_LIST[types] || []
  const total = all.length
  const slice = page <= 1 ? all : []
  return {
    total,
    per_page: perPage,
    current_page: page,
    last_page: Math.max(1, Math.ceil(total / perPage)),
    data: slice
  }
}

/* ==================== 市场榜单页：pages/marketCapRanking/marketCapRanking ==================== */

/**
 * 市值排行榜 mock
 *
 * 原站接口：POST /user/ranking
 *   真实响应（2026-10-24 实调）：
 *   { code:1, msg:"查询成功", data:{ data:[], my:"", activityRule:"" } }
 *
 * 原站页面 script 模块 3aa4：`A.list = a.data`，即 list 直接取到整个
 *   { data, my, activityRule } 对象；随后 <w-marketCapRanking :list="A.list">
 *   用 Vue2 `_l` 遍历该对象 → 按对象 key 迭代 → key 分别为 'data'/'my'/'activityRule'
 *   → 渲染出 "data1"/"my1"/"activityRule1" 三条脏数据。
 *   （Vue2 `_l` 对非数组对象取 `Object.keys`，且 renderList 内 index 从 0 计，
 *     原站把 index 与 key 混用，故序号显示为 key+1。）
 *   同时 `localBgUrl` 在原站 04bb（env.js）中根本未定义，
 *   导致奖牌图 src = "undefinedranking_one.png"、问号图 src = "undefinedicon_question.png"，
 *   均为 404，页面直接显示破图文字。
 *
 * 本地 mock 策略：
 *   1) 修正 list 取值 → list = res.data.data（数组），与原站渲染模板 _l(list) 兼容；
 *   2) 补全原站后端尚未填充的榜单条目字段（listimg / name / flux / minprice / market_value），
 *      使页面可展示真实排行榜内容而非脏数据；
 *   3) 用等价 SVG 奖牌 / 问号图标替代原站 404 资源（见 public/assets/img/rank/）。
 */
export const MARKET_CAP_RANKING = {
  update_time: '10-24 10:00',
  market_desc:
    '<p>1. 市值排行榜按持有藏品的市场流通总价值（最低价 × 流通量）实时计算，每 24 小时更新一次。</p>' +
    '<p>2. 流通量指该用户当前持有并处于可流通状态的藏品数量。</p>' +
    '<p>3. 最低价取该藏品在市场中的当前最低挂单价，无挂单时显示上一笔成交价。</p>' +
    '<p>4. 榜单仅展示前 50 名，同一用户多次持有按合计计算。</p>',
  list: [
    { id: 1, listimg: '/assets/img/market/e876e9a9c96521e170f455a6ee59c675.jpg', name: '嗒嗒艺术', flux: 128, minprice: '92.00', market_value: '11776.00' },
    { id: 2, listimg: '/assets/img/market/d94194860b48adf69ca862963cfadcb6.jpg', name: '打王神鞭', flux: 96, minprice: '58.00', market_value: '5568.00' },
    { id: 3, listimg: '/assets/img/market/f3d290a4bec3d9000f0f225114c91d65.jpg', name: '幸运盲盒', flux: 210, minprice: '19.90', market_value: '4179.00' },
    { id: 4, listimg: '/assets/img/447aea6b59117568a722045f1b20e199.jpg', name: '星际探险家', flux: 65, minprice: '39.00', market_value: '2535.00' },
    { id: 5, listimg: '/assets/img/market/e876e9a9c96521e170f455a6ee59c675.jpg', name: '数字藏品收藏家', flux: 30, minprice: '9.90', market_value: '297.00' }
  ]
}

/** 市值排行榜 mock：返回原站接口包络 */
export function getMarketCapRankingMock() {
  return {
    update_time: MARKET_CAP_RANKING.update_time,
    market_desc: MARKET_CAP_RANKING.market_desc,
    data: MARKET_CAP_RANKING.list,
    my: '',
    activityRule: ''
  }
}

/* ==================== P0 批次：13 个断链目标页 ==================== */

/**
 * 收货地址列表（原站 pages/my/address/list 实调 2026-10-25）
 * POST /user/address_list  → { code:1, msg:"地址列表", data:[] }
 * 测试账号无任何地址 → 原站渲染 addr-empty-dark.webp 空态
 */
export const ADDRESS_LIST = []

/**
 * 邀请活动页配置（原站 pages/invitation/invitation 实调 2026-10-25）
 * POST /index/getConfig
 *   key = "sharebg,copyright,sharebtn1,sharerulebtn,sharerulebg,share_bac_iamge,invitation_bg_color,h5_invite_url"
 * 实调返回：
 *   sharerulebg /uploads/20231114/c0a345d0...png
 *   sharebg     /uploads/20231126/d23fe436...jpg
 *   share_bac_iamge /uploads/20231114/fa1ac4cc...png
 *   sharerulebtn /uploads/20231114/18f96bb2...png
 *   copyright   [{"img":"/uploads/20230526/e7be6538...png","name":"","link":""}]
 *   sharebtn1   /uploads/20231114/c0a345d07/uploads/20231020/0c60e9d2....png
 *   h5_invite_url ...
 * 邀请码来源：getUserInfo.inviter_code = 'L1224539'（原站二维码文本同此值）
 */
export const INVITATION_CONFIG = {
  sharerulebg: '/uploads/20231114/c0a345d07adca03eee9438e2c40c0d56.png',
  sharebg: '/uploads/20231126/d23fe4362f81894576e3450fe7367072.jpg',
  share_bac_iamge: '/uploads/20231114/fa1ac4cca83e655a89628dcb25723097.png',
  sharerulebtn: '/uploads/20231114/18f96bb2dcecd57608ec08ca24a7563f.png',
  copyright: '[{"img":"/uploads/20230526/e7be653897e0e7338a849a2cfc52522f.png","name":"","link":""}]',
  sharebtn1: '/uploads/20231114/c0a345d07/uploads/20231020/0c60e9d22e3232cc0193598b42c8cf59.png',
  h5_invite_url: '/#/pages/login/register?a=1',
  invitation_bg_color: ''
}

/**
 * 邀请活动页榜单（原站 pages/invitation/invitation 实调 2026-10-25）
 * POST /user/ranking  body { page:1, types:2 }
 * 实调返回 { data:{ my_list:[], vip_time_num:0, real_name_num:0, wallet_num:0, yx_num:0, total_num:0, buy_num:0 }, my:"", activityRule:"" }
 * → 原站「助力好友」区块渲染 search-empty.png 空态
 */
export const INVITATION_RANKING = {
  data: {
    my_list: [],
    vip_time_num: 0,
    real_name_num: 0,
    wallet_num: 0,
    yx_num: 0,
    total_num: 0,
    buy_num: 0
  },
  my: '',
  activityRule: ''
}

/**
 * 龙晶商城列表（原站 pages/shop/shop 实调 2026-10-25）
 * POST /crystal_goods/list  body { type:"10", page:1, crystal_type:"blue" }
 * 实调返回 { total:0, per_page:15, current_page:1, last_page:0, data:[] }
 * → 原站「龙晶兑换藏品」区块渲染 search-empty.png 空态
 */
export const CRYSTAL_GOODS_LIST = {
  total: 0,
  per_page: 15,
  current_page: 1,
  last_page: 0,
  data: []
}

/**
 * 水晶明细（原站 pages/shop/detailList 实调 2026-10-25）
 * POST /crystal_goods/crystalDetail  body { page:1, cat:"", type:"", m:"" }
 * 实调返回 { total:0, per_page:15, current_page:1, last_page:0, data:[] }
 * → 原站渲染 w-loading 空态（search-empty.png 121x122）
 */
export const CRYSTAL_DETAIL_LIST = {
  total: 0,
  per_page: 15,
  current_page: 1,
  last_page: 0,
  data: []
}

/**
 * 兑换记录（原站 pages/shop/record 实调 2026-10-25）
 * POST /crystal_goods/exchangeRecord  body { page:1 }
 * 实调返回 { total:0, per_page:15, current_page:1, last_page:0, data:[] }
 * → 原站渲染 w-loading 空态（search-empty.png 121x122 @134.5,268）
 */
export const CRYSTAL_EXCHANGE_RECORD = {
  total: 0,
  per_page: 15,
  current_page: 1,
  last_page: 0,
  data: []
}

/**
 * 水晶商品详情（原站 pages/shop/detail/{collection|box|goods} 实调 2026-10-25）
 * POST /crystal_goods/info  body { goods_id:"1", id:"1" }
 * 实调返回 { code:0, msg:"商品不存在", data:null }
 * → 原站 catch 后 1.5s 调用 backPage() 回退上一页
 */
export const CRYSTAL_GOODS_INFO = null

/**
 * 我的寄售列表（原站 pages/consignments/search 实调 2026-10-25）
 * POST /order/order/myConsignment  body { keyword, status:"", goods_type:"", page:1 }
 * 实调返回 { total:0, per_page:10, current_page:1, last_page:0, data:[] }
 * → 原站寄售搜索页列表区为空
 */
export const MY_CONSIGNMENT_SEARCH = {
  total: 0,
  per_page: 10,
  current_page: 1,
  last_page: 0,
  data: []
}

/**
 * 活动中心任务分类图（原站 pages/task/index 实调 2026-10-25）
 * POST /addons/diypage/index → 首页装修数据（category:"home"）
 * 原站任务页顶部四宫格（荣誉榜单 / 幸运抽奖 / 好礼签到 / 邀请好友）
 * 图片取自原站 static/image/task/{rybb,xycj,hlqd,yqhy}-image.png
 */
export const TASK_ENTRY_LIST = [
  { id: 1, image: '/assets/img/p0/image/task/rybb-image.png', name: '荣誉榜单', path: '/pages/marketCapRanking/marketCapRanking' },
  { id: 2, image: '/assets/img/p0/image/task/xycj-image.png', name: '幸运抽奖', path: '/pages/lottery/lottery' },
  { id: 3, image: '/assets/img/p0/image/task/hlqd-image.png', name: '好礼签到', path: '/pages/sign/index' },
  { id: 4, image: '/assets/img/p0/image/task/yqhy-image.png', name: '邀请好友', path: '/pages/invitation/invitation' }
]

/**
 * 活动中心「活动商城」商品（原站 pages/task/index 实调 2026-10-25）
 * 原站实调返回 2 件实物商品（嗒嗒联名手办 ￥128.00），配图 shop-1.png / shop-2.png
 */
export const TASK_MALL_LIST = [
  { id: 1, image: '/assets/img/p0/icon/shop-1.png', name: '嗒嗒联名手办', price: '128.00', tag: '实物' },
  { id: 2, image: '/assets/img/p0/icon/shop-2.png', name: '嗒嗒联名手办', price: '128.00', tag: '实物' }
]

/**
 * 合成方案详情（原站 pages/compound/schemeDetails 实调 2026-10-25）
 * POST /synthesis/playInfo  body { play_id:"", grp:"", classify:"" }
 * 实调返回 { code:0, msg:"玩法不存在", data:null }（缺 query 参数）
 * → 原站渲染「兑换材料」空区块
 */
export const SYNTHESIS_PLAY_INFO = null

/* ============================================================
 * 公告 / 盲盒 / 抽签 三模块 Mock（2026-10-25 登录态实调）
 * ============================================================ */

/**
 * 公告分类（原站 pages/notice/newsDetails 依赖）
 * POST /discover/ant_news/category → [{ id:2, name:"陕西数字化进程" }]
 */
export const ANT_NEWS_CATEGORY = [{ id: 2, name: '陕西数字化进程' }]

/**
 * 公告列表（原站 pages/notice/newsDetails 所属模块）
 * POST /discover/ant_news/list { page } → 实调 total:0
 */
export const ANT_NEWS_LIST = { total: 0, per_page: 15, current_page: 1, last_page: 0, data: [] }

/**
 * 公告详情（原站 pages/notice/newsDetails）
 * POST /discover/ant_news/info { id } → 实调 data:null
 */
export const ANT_NEWS_INFO = null

/**
 * 辟谣墙列表（原站 pages/notice/wallDetails）
 * POST /discover/rumor_wall/list { page } → 实调 total:0
 */
export const RUMOR_WALL_LIST = { total: 0, per_page: 15, current_page: 1, last_page: 0, data: [] }

/**
 * 辟谣墙详情（原站 pages/notice/wallDetails）
 * POST /discover/rumor_wall/info { id } → 实调 data:null
 */
export const RUMOR_WALL_INFO = null

/**
 * 辟谣墙评论（原站 pages/notice/wallDetails）
 * POST /discover/rumor_wall/getcomment { id, page } → 实调 total:0
 */
export const RUMOR_WALL_COMMENT = { total: 0, per_page: 15, current_page: 1, last_page: 0, data: [] }

/**
 * 开盒记录（原站 pages/blindBox/openRecord）
 * POST /box/blind_box/openlog { blind_box_id, page, list_rows } → 实调 total:0
 */
export const BLIND_BOX_OPEN_LOG = { total: 0, per_page: '20', current_page: 1, last_page: 0, data: [] }

/**
 * 抽签结果（原站 pages/draw/drawResult/drawResult）
 * POST /draw/get { form } → 实调 { code:0, msg:"活动不存在" }
 */
export const DRAW_QUALIFICATION = { success_code: [] }

/**
 * 抽签榜单（原站 pages/draw/Leaderboard/Leaderboard）
 * POST /draw/get → 参与人数 0
 */
export const DRAW_LEADERBOARD = { count: 0, list: [] }

/**
 * 分享社群详情（原站 pages/draw/shareCommunityGroup）
 * POST /score/get_my_share_details → 实调 data:null
 */
export const SHARE_DETAILS = null

/**
 * 助力记录（原站 pages/draw/communityShare）
 * POST /score/get_my_share_details → 实调 data:null
 */
export const HELP_RECORD = null

/**
 * 社群规则文案（原站 /index/getConfig 的 share_rule 字段）
 * 实调值 "<p>1.111</p><p>2.222</p>"
 */
export const SHARE_RULE_HTML = '<p>1.111</p><p>2.222</p>'

/* ============================================================
 * K线 / 抽签 / 抽奖 / 交易记录 批次（2026-10-25 实调原站）
 * ============================================================ */

/**
 * K线行情详情（pages/kline/info）
 * 原站该页不发请求——数据来自商城页 market 缓存的 marketGoods（见 chunk：
 * pages-kline-info 中 product 传入 w-navbar 的 product 属性）。
 * 实调 /market/market/marketGoodsDetail {id:1} → code 500，
 * 故 mock 提供完整行情字段供本地预览。
 */
export const KLINE_INFO = {
  id: 1,
  name: '比太',
  /** 藏品名称占位标题（该页顶部暗色背景内的白色 16px 文案） */
  title: '藏品名称',
  /** 当前价 */
  price: '112.34',
  /** 涨跌幅（%） */
  change_rate: '-0.53%',
  /** 品牌/系列 */
  brand: '嗒嗒',
  /** 图片（swiper 两张；首图为原站默认展示的「双瑞首发」banner） */
  images: [
    '/assets/img/kline/goods2.png',
    '/assets/img/kline/goods.png'
  ],
  /** 6 项行情指标（顺序即原站展示顺序） */
  metrics: [
    { label: '流通：', value: '30000' },
    { label: '最近5min成交量：', value: '30000' },
    { label: '24h最高：', value: '30000' },
    { label: '最近1h成交量：', value: '30000' },
    { label: '24h最低：', value: '30000' },
    { label: '今日成交量：', value: '30000' }
  ],
  /** 顶部二级 tab（横向可滚动，寄售在屏幕外 x=453） */
  tabs: ['行情', '相关公告', '成交记录', '换手榜', '寄售'],
  /** 是否已关注 */
  is_like: false
}

/**
 * K线购买页（pages/kline/buy）
 * 原站同样复用 market 缓存，实调 marketGoodsDetail → code 500。
 */
export const KLINE_BUY = {
  id: 1,
  name: '凤吹晚霞',
  brand: '嗒嗒',
  price: '112.34',
  change_rate: '-0.53%',
  images: [
    '/assets/img/kline/goods2.png',
    '/assets/img/kline/goods.png'
  ],
  /** 三个切换 tab：流通 / 相关公告 / 成交额 */
  tabs: ['流通', '相关公告', '成交额']
}

/**
 * 交易信息（pages/market/tradingInformation）
 * 实调 2026-10-25 POST /market/trade/tradingInformation
 *   body {page:1, sort:"price", id:"1", status:1, goods_id:"1"}
 *   → { list:[], transaction_record_number:0, current_buying:0,
 *       current_consignment:0, floor_price:0, today_amount:0,
 *       today_volume:0, today_highest_price:"7.00", today_lowest_price:"7.00" }
 */
export const TRADING_INFORMATION = {
  list: [],
  transaction_record_number: 0,
  current_buying: 0,
  current_consignment: 0,
  floor_price: 0,
  today_amount: 0,
  today_volume: 0,
  today_highest_price: '7.00',
  today_lowest_price: '7.00'
}

/**
 * 抽签活动（pages/activity/draw）
 * 实调 POST /draw/get → { code:0, msg:"活动不存在", data:null }
 * POST /draw/drawRecord → { code:1, data:[] }
 * POST /user/ranking {page:1,types:2} → my_list 空、参与人数 0
 */
export const DRAW_ACTIVITY = {
  /** 活动是否有效（false → 页面展示 toast「活动不存在」） */
  exists: false,
  /** 顶部卡片文案 */
  card_title: '限定发售抽签',
  card_desc: '公平参与 · 结果可查',
  /** 抽签发售时间线 4 格 */
  timeline: [
    { key: '01', title: '抽签开始时间' },
    { key: '02', title: '抽签结束时间' },
    { key: '03', title: '抽签公布时间' },
    { key: '04', title: '藏品购买时间' }
  ],
  /** 我的抽签码 */
  draw_code: '',
  /** 中签码 */
  win_code: '',
  /** 已成功邀请人数 */
  invite_count: 0,
  /** 每成功邀请 N 位新用户可得 1 个抽签码（原站该值为空，故中间数字留白） */
  invite_per_code: '',
  /** 规则标题 */
  rule_title: '抽签码获取规则'
}

/**
 * 中奖记录（pages/lottery/record）
 * 实调 POST /lottery/statistics {lottery_id:"1"} →
 *   data: [{id:12,type:"10",num:0,name:"嗒嗒会员卡",image:"..."},
 *          {id:14,type:"10",num:0,name:"曜匣资格卡",image:"..."}]
 * POST /lottery/record {type:10,lottery_id:"1",page:1} → data:[] (total 0)
 */
export const LOTTERY_PRIZE_LIST = [
  {
    id: 12,
    type: '10',
    num: 0,
    name: '嗒嗒会员卡',
    image: '/assets/img/lottery/lottery-1.jpg',
    lottery_image: '/assets/img/lottery/lottery-1.jpg'
  },
  {
    id: 14,
    type: '10',
    num: 0,
    name: '曜匣资格卡',
    image: '/assets/img/lottery/lottery-2.jpg',
    lottery_image: '/assets/img/lottery/lottery-2.jpg'
  }
]

/** 抽奖记录（lottery/record 下方卡片），实调为空 */
export const LOTTERY_DRAW_LOG = { total: 0, per_page: 15, current_page: 1, last_page: 0, data: [] }

/* ==================== 合成 / 榜单批次（2026-10-26） ==================== */

/**
 * 合成记录列表（pages/compound/record）
 * 实调 POST /synthesis/recordList {page:1} → total 0，data 为空数组
 */
export const SYNTHESIS_RECORD_LIST = { total: 0, per_page: 15, current_page: 1, last_page: 0, data: [] }

/**
 * 合成结果详情（pages/compound/result）
 * 实调 POST /synthesis/recordInfo → { code:0, msg:"记录不存在", data:null }
 * 原站在记录不存在时仍展示成功态骨架，不渲染记录详情。
 */
export const SYNTHESIS_RECORD_INFO = null

/**
 * 龙虎榜（pages/rank/rankList）
 * 实调 POST /user/newrank1 → { headUser:[], list:[], rank1:[], rank2:[] }
 */
export const USER_NEW_RANK = { headUser: [], list: [], rank1: [], rank2: [] }

/**
 * 大师信息（pages/rank/userBuy）
 * 实调 POST /user/masterinfo → { code:1, data:[] }
 */
export const USER_MASTER_INFO = []

/**
 * 大师动态列表（pages/rank/masterRank）
 * 实调 POST /user/masterlist {page:1} → { code:1, data:[] }
 */
export const USER_MASTER_LIST = []

/**
 * 排行榜（pages/leaderboard/leaderboard）
 * 实调 POST /user/ranking {types:1} → { data:[], my:"", activityRule:"" }
 */
export const USER_RANKING = { data: [], my: '', activityRule: '' }

/* ==================== 收尾批次（活动 / 工会 / 认证 / 分类 / 搜索 / 返佣 / webview） ==================== */

/**
 * 活动分类（pages/activeSelected/activeSelected）
 * 实调 POST /Activity/category → { code:1, data:[] }
 */
export const ACTIVITY_CATEGORY = []

/**
 * 活动列表（pages/activeSelected/activeSelected）
 * 实调 POST /activity/index {page:1,limit:10,category_id:1} → { total:0, data:[] }
 */
export const ACTIVITY_INDEX = { total: 0, per_page: 10, current_page: 1, last_page: 0, data: [] }

/**
 * 中签记录（pages/activity/record）
 * 实调 POST /draw/drawLog → { code:1, data:[] }
 */
export const DRAW_LOG = []

/**
 * 我的公会（pages/union/tradeUnion、pages/union/news）
 * 实调 POST /union/user/myunion → { code:1, data:{ config:{...}, my:{...} } }
 * 测试账号 is_join=0（未解锁公会），页面走「未解锁」分支。
 */
export const UNION_MY_UNION = {
  config: {
    user_num: 20,
    have_rate: 1.88,
    be_invite_back_rate: 1,
    have_be_invite_back_rate: 0.88,
    manager_user_rate: 1,
    user_rate: 2
  },
  my: {
    id: 4539,
    avatar: '',
    nickname: 'tcE3upv0Lw',
    mobile: '17587881293',
    is_join: 0,
    sort: '暂无排名',
    power: 0,
    is_manager: 0
  }
}

/**
 * 工会排行榜（pages/union/unionRank）
 * 实调 POST /union/index/logs {types:1,page:1,pageSize:15} → { code:1, data:[] }
 */
export const UNION_RANK_LOGS = []

/**
 * 工会成员排行榜（pages/union/userRank）
 * 实调 POST /union/user/logs {types:1} → { code:0, msg:"工会不存在", data:null }
 */
export const UNION_USER_LOGS = null

/**
 * 工会消息通知（pages/union/news）
 * 实调 POST /union/user/message → { code:500, msg:"An error occurred", data:null }
 */
export const UNION_MESSAGE = null

/**
 * 返佣概览（pages/rebate/rebate）
 * 实调 POST /user/commision_info → 响应体为空（无返回数据），页面永久停留在「加载中...」
 */
export const COMMISSION_INFO = null

/**
 * 被邀请人清单（pages/rebate/rebateInviteDetail）
 * 实调 POST /user/bei_yao_list → 响应体为空
 */
export const BEI_YAO_LIST = null

/**
 * 返佣排行榜（pages/rebate/leaderboard）
 * 实调 POST /user/commison_rank {type:1} → 响应体为空
 */
export const COMMISSION_RANK = null

/**
 * 分类页系列（pages/market/categoryManager）
 * 实调 POST /index/getSeries?type=10 → [{ series_name:"潜龙聚财", series_id:28, ... }]
 *      POST /index/getSeries?type=20 → []
 *      POST /index/customSeriesList → { custom_series:[], platform_series:[] }
 */
export const CATEGORY_SERIES_10 = [
  {
    series_name: '潜龙聚财',
    series_id: 28,
    is_def: 0,
    flag: 0,
    pattern: 1,
    resale_put_start_time: '21:47:47',
    resale_put_end_time: '21:47:47',
    resale_buy_start_time: '21:47:47',
    resale_buy_end_time: '21:47:47',
    current_price: '0.00',
    change_price: '0.00'
  }
]
export const CATEGORY_SERIES_20 = []
export const CUSTOM_SERIES_LIST = { custom_series: [], platform_series: [] }
