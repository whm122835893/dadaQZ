import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * 路由表 —— 严格对齐原站 uni-app 页面路径（hash 模式）
 * meta.title 取自原站 navigationBarTitleText
 * meta.bg / meta.light 取自原站 page style 的 backgroundColor / backgroundTextStyle
 */
const routes = [
  { path: '/', redirect: '/pages/index/index' },

  {
    path: '/pages/index/index',
    name: 'pages-index-index',
    component: () => import('@/views/index/index.vue'),
    meta: { title: '嗒嗒', bg: '#000000', light: true, tab: true }
  },

  /* 占位路由：后续按用户验收顺序逐页实现 */
  { path: '/pages/market/market', name: 'pages-market-market', component: () => import('@/views/market/market.vue'), meta: { title: '寄售', bg: '#060504', light: true, tab: true } },
  { path: '/pages/notice/notice', name: 'pages-notice-notice', component: () => import('@/views/notice/notice.vue'), meta: { title: '发现', bg: '#101115', light: true, tab: true } },
  { path: '/pages/activity/activity', name: 'pages-activity-activity', component: () => import('@/views/activity/activity.vue'), meta: { title: '活动', bg: '#101115', light: true, tab: true } },
  { path: '/pages/my/my', name: 'pages-my-my', component: () => import('@/views/my/my.vue'), meta: { title: '我的', bg: '#101115', light: true, tab: true } },

  { path: '/pages/login/login-pass', name: 'pages-login-login-pass', component: () => import('@/views/login/login-pass.vue'), meta: { title: '密码登录', bg: '#030303', light: true } },
  /* 登录首页（原站 pages/login/login，验证码登录为默认模式 loginType=2，可切密码登录；黑金主题） */
  { path: '/pages/login/login', name: 'pages-login-login', component: () => import('@/views/login/login.vue'), meta: { title: '登录', bg: '#030303', light: true } },
  /* 忘记密码页（原站 pages/login/forgetPwd；黑金主题，手机+验证码+新密码+确认密码四行） */
  { path: '/pages/login/forgetPwd', name: 'pages-login-forgetPwd', component: () => import('@/views/login/forgetPwd.vue'), meta: { title: '忘记密码', bg: '#030303', light: true } },
  /* 注册页（原站 pages/login/register；黑金主题，手机+验证码+密码+邀请码四行） */
  { path: '/pages/login/register', name: 'pages-login-register', component: () => import('@/views/login/register.vue'), meta: { title: '注册', bg: '#030303', light: true } },
  /* 验证码登录页（原站 pages/login/login-code，浅色旧版；蓝按钮 #1b53f7） */
  { path: '/pages/login/login-code', name: 'pages-login-login-code', component: () => import('@/views/login/loginCode.vue'), meta: { title: '验证码登录', bg: '#f7f7f8' } },

  /* 首页金刚区入口：签到/ 抽奖 / 藏品发售（2026-10-20 按反编译源码复刻） */
  { path: '/pages/sign/index', name: 'pages-sign-index', component: () => import('@/views/sign/index.vue'), meta: { title: '签到', bg: '#0a0a0a', light: true } },
  { path: '/pages/lottery/lottery', name: 'pages-lottery-lottery', component: () => import('@/views/lottery/lottery.vue'), meta: { title: '抽奖', bg: '#0a0a0a', light: true } },
  { path: '/pages/product/collection', name: 'pages-product-collection', component: () => import('@/views/product/collection.vue'), meta: { title: '藏品详情', bg: '#0a0a0a', light: true } },
  /* 盲盒开盒页（原站 goods_type==1 的藏品点击进入，浅色主题） */
  { path: '/pages/product/box', name: 'pages-product-box', component: () => import('@/views/product/box.vue'), meta: { title: '盲盒', bg: '#f7f7f8' } },
  /* 订单确认页（原站由藏品页/盲盒页 comfirmOrder 写入 sessionStorage.confirmOrder 后跳转） */
  { path: '/pages/order/orderSubmit', name: 'pages-order-orderSubmit', component: () => import('@/views/order/orderSubmit.vue'), meta: { title: '订单确认', bg: '#101115', light: true } },
  /* 订单列表页（原站 pages/order/list，一级 tabs 首发寄售/求购订单/委托订单） */
  { path: '/pages/order/list', name: 'pages-order-list', component: () => import('@/views/order/list.vue'), meta: { title: '我的订单', bg: '#101115', light: true } },
  /* 普通订单详情页（原站 pages/order/defaultDetail，query: {id, orderType}） */
  { path: '/pages/order/defaultDetail', name: 'pages-order-defaultDetail', component: () => import('@/views/order/defaultDetail.vue'), meta: { title: '订单详情', bg: '#101115', light: true } },
  /* 我的求购订单列表页（原站 pages/order/beg/list，query 无；浅色主题 #f7f7f8，4 个状态 tab） */
  { path: '/pages/order/beg/list', name: 'pages-order-beg-list', component: () => import('@/views/order/begList.vue'), meta: { title: '我的求购', bg: '#f7f7f8' } },
  /* 求购订单详情页（原站 pages/order/beg/info，query: {id}；浅色主题 #f7f7f8） */
  { path: '/pages/order/beg/info', name: 'pages-order-beg-info', component: () => import('@/views/order/begInfo.vue'), meta: { title: '订单详情', bg: '#f7f7f8' } },
  /* 我的委托订单列表页（原站 pages/order/entrust/list，query 无；浅色主题 #f7f7f8，4 个状态 tab） */
  { path: '/pages/order/entrust/list', name: 'pages-order-entrust-list', component: () => import('@/views/order/entrustList.vue'), meta: { title: '我的委托', bg: '#f7f7f8' } },
  /* 委托订单详情页（原站 pages/order/entrust/info，query: {id}；浅色主题 #f7f7f8） */
  { path: '/pages/order/entrust/info', name: 'pages-order-entrust-info', component: () => import('@/views/order/entrustInfo.vue'), meta: { title: '订单详情', bg: '#f7f7f8' } },
  /* 市场（寄售）订单详情页（原站 pages/order/marketDetail，query: {id}；浅色主题） */
  { path: '/pages/order/marketDetail', name: 'pages-order-marketDetail', component: () => import('@/views/order/marketDetail.vue'), meta: { title: '寄售详情', bg: '#f2f2f2' } },
  /* 市场寄售详情页（原站 pages/market/detail，query: {id=market_goods.id}；沉浸式主图 + 底部购买条） */
  { path: '/pages/market/detail', name: 'pages-market-detail', component: () => import('@/views/market/detail.vue'), meta: { title: '寄售详情', bg: '#101115', light: true } },
  /* 专辑列表页（原站 pages/market/marketGoodsList，query: {id=product.id, goodsType}；黑金主题，4 tab：寄售/求购/委托/成交） */
  { path: '/pages/market/marketGoodsList', name: 'pages-market-marketGoodsList', component: () => import('@/views/market/marketGoodsList.vue'), meta: { title: '专辑列表', bg: '#101115', light: true } },
  /* 发起求购页（原站 pages/market/submitBegBuy，query: {id}；黑金主题） */
  { path: '/pages/market/submitBegBuy', name: 'pages-market-submitBegBuy', component: () => import('@/views/market/submitBegBuy.vue'), meta: { title: '发起求购', bg: '#101115', light: true } },
  /* 发起委托页（原站 pages/market/submitEntrust，query: {id}；黑金主题，多预计收入/委托说明两卡） */
  { path: '/pages/market/submitEntrust', name: 'pages-market-submitEntrust', component: () => import('@/views/market/submitEntrust.vue'), meta: { title: '发起委托', bg: '#101115', light: true } },
  /* 以求购价出售页（原站 pages/market/sellBegBuy，query: {collection_id,pay_way,number}；浅色主题） */
  { path: '/pages/market/sellBegBuy', name: 'pages-market-sellBegBuy', component: () => import('@/views/market/sellBegBuy.vue'), meta: { title: '以求购价出售', bg: '#f7f7f8' } },
  /* 买卖详情页（原站 pages/market/sellInfo，query: {id=goods_id}；浅色主题 #f7f7f8，三 tab：成交记录/当前求购/当前寄售） */
  { path: '/pages/market/sellInfo', name: 'pages-market-sellInfo', component: () => import('@/views/market/sellInfo.vue'), meta: { title: '买卖详情', bg: '#f7f7f8' } },
  /* 转赠订单详情页（原站 pages/order/regiftDetail，query: {id, orderType}；浅色主题，order_type=19） */
  { path: '/pages/order/regiftDetail', name: 'pages-order-regiftDetail', component: () => import('@/views/order/regiftDetail.vue'), meta: { title: '转赠详情', bg: '#f7f7f8' } },
  /* 我的藏品页（原站 pages/myCollection/myCollection；黑金主题，四个 tab：藏品/盲盒/寄售/已售） */
  { path: '/pages/myCollection/myCollection', name: 'pages-myCollection-myCollection', component: () => import('@/views/myCollection/myCollection.vue'), meta: { title: '我的藏品', bg: '#101115', light: true } },
  /* 寄售发起页（原站 pages/consignments/consignments，query: {id, pageType}；黑金主题） */
  { path: '/pages/consignments/consignments', name: 'pages-consignments-consignments', component: () => import('@/views/consignments/consignments.vue'), meta: { title: '寄售藏品', bg: '#101115', light: true } },
  /* 我的寄售页（原站 pages/consignments/myConsignment；黑金主题，两级 tabs：藏品/盲盒 + 全部/寄售中/已成交） */
  { path: '/pages/consignments/myConsignment', name: 'pages-consignments-myConsignment', component: () => import('@/views/consignments/myConsignment.vue'), meta: { title: '我的寄售', bg: '#101115', light: true } },
  /* 市值排行榜页（原站 pages/marketCapRanking/marketCapRanking；浅色主题 #f7f7f8，榜单卡 + 排行说明弹窗） */
  { path: '/pages/marketCapRanking/marketCapRanking', name: 'pages-marketCapRanking-marketCapRanking', component: () => import('@/views/marketCapRanking/marketCapRanking.vue'), meta: { title: '市值排行榜', bg: '#f7f7f8' } },
  /* 发起转赠页（原站 pages/regift/regift，query: {id}；浅色主题） */
  { path: '/pages/regift/regift', name: 'pages-regift-regift', component: () => import('@/views/regift/regift.vue'), meta: { title: '转赠', bg: '#f7f7f8' } },
  /* 转赠记录页（原站 pages/regift/record；浅色主题，两个 tab：我转赠的/我收到的） */
  { path: '/pages/regift/record', name: 'pages-regift-record', component: () => import('@/views/regift/record.vue'), meta: { title: '转赠记录', bg: '#f7f7f8' } },
  /* 藏品详情页（原站 pages/myCollection/collectionDetails，query: {id}；沉浸式主图 + 状态操作条） */
  { path: '/pages/myCollection/collectionDetails', name: 'pages-myCollection-collectionDetails', component: () => import('@/views/myCollection/collectionDetails.vue'), meta: { title: '藏品详情', bg: '#101115', light: true } },

  /* 操作密码页（原站 pages/my/actionPwd/getCode，query: {action}；深色主题，scope 4f7f450a）
     action: reset=验证手机号 / set=校验当前操作密码 / 空=按用户是否已设密码自动分流 */
  { path: '/pages/my/actionPwd/getCode', name: 'pages-my-actionPwd-getCode', component: () => import('@/views/my/actionPwd/getCode.vue'), meta: { title: '操作密码', bg: '#101115', light: true } },
  /* 设置操作密码页（原站 pages/my/actionPwd/setPwd，query: {code}；深色主题，scope 4ca1f246） */
  { path: '/pages/my/actionPwd/setPwd', name: 'pages-my-actionPwd-setPwd', component: () => import('@/views/my/actionPwd/setPwd.vue'), meta: { title: '设置操作密码', bg: '#101115', light: true } },

  /* ===== P1 批次：我的模块 8 页（金标准实测 2026-10-25，均无底部 TabBar） ===== */
  /* 关于我们（原站 pages/my/about；浅色 #f7f7f8，品牌渐变卡 + 白色列表卡） */
  { path: '/pages/my/about', name: 'pages-my-about', component: () => import('@/views/my/about.vue'), meta: { title: '关于我们', bg: '#f7f7f8' } },
  /* 隐私设置（原站 pages/my/privacy；浅色 #f7f7f8，白卡 + 蓝开关 #1b64de 默认开） */
  { path: '/pages/my/privacy', name: 'pages-my-privacy', component: () => import('@/views/my/privacy.vue'), meta: { title: '隐私设置', bg: '#f7f7f8' } },
  /* 客服（原站 pages/my/service；黑金 #101115，金边卡两行复制） */
  { path: '/pages/my/service', name: 'pages-my-service', component: () => import('@/views/my/service.vue'), meta: { title: '客服', bg: '#101115', light: true } },
  /* 加入社群（原站 pages/my/join；浅色 #f7f7f8，满宽社群海报图） */
  { path: '/pages/my/join', name: 'pages-my-join', component: () => import('@/views/my/join.vue'), meta: { title: '加入社群', bg: '#f7f7f8' } },
  /* 设置（原站 pages/my/other-power；黑金 #101115，三组深色列表卡） */
  { path: '/pages/my/other-power', name: 'pages-my-other-power', component: () => import('@/views/my/otherPower.vue'), meta: { title: '设置', bg: '#101115', light: true } },
  /* 个人信息（原站 pages/my/info；黑金 #101115，头像/昵称/手机号三行） */
  { path: '/pages/my/info', name: 'pages-my-info', component: () => import('@/views/my/info.vue'), meta: { title: '个人信息', bg: '#101115', light: true } },
  /* 注销账号申请（原站 pages/my/cancellation；黑金 #101115，金边卡长文 + 勾选 + 确认按钮） */
  { path: '/pages/my/cancellation', name: 'pages-my-cancellation', component: () => import('@/views/my/cancellation.vue'), meta: { title: '注销账号申请', bg: '#101115', light: true } },
  /* 添加收货地址（原站 pages/my/address/edit；黑金 #101115，金边表单卡 + 默认开关 + 底部保存） */
  { path: '/pages/my/address/edit', name: 'pages-my-address-edit', component: () => import('@/views/my/addressEdit.vue'), meta: { title: '添加收货地址', bg: '#101115', light: true } },
  /* 流转记录（原站 pages/my/flowDoc；浅色 #f7f7f8，getRecord 空态：search-empty 居中） */
  { path: '/pages/my/flowDoc', name: 'pages-my-flowDoc', component: () => import('@/views/my/flowDoc.vue'), meta: { title: '流转记录', bg: '#f7f7f8' } },
  /* 会员中心（原站 pages/my/svip；浅色 #f7f7f8，320x240 权益图集 + vip_time 倒计时） */
  { path: '/pages/my/svip', name: 'pages-my-svip', component: () => import('@/views/my/svip.vue'), meta: { title: '会员中心', bg: '#f7f7f8' } },
  /* 我的钱包（原站 pages/wallet/wallet；黑金 #101115，易宝卡图 + 进入钱包跳 /wallet/yibao/openAccount） */
  { path: '/pages/wallet/wallet', name: 'pages-wallet-wallet', component: () => import('@/views/wallet/wallet.vue'), meta: { title: '我的钱包', bg: '#101115', light: true } },

  /* ===== P0 批次：13 个断链修复目标页 ===== */
  /* 实名认证（原站 pages/certification/certification；浅色 #f7f7f8 + verified-bg 顶部渐变背景） */
  { path: '/pages/certification/certification', name: 'pages-certification-certification', component: () => import('@/views/certification/certification.vue'), meta: { title: '实名认证', bg: '#f7f7f8' } },
  /* 收货地址列表（原站 pages/my/address/list；黑金 #101115，addr-empty-dark 空态） */
  { path: '/pages/my/address/list', name: 'pages-my-address-list', component: () => import('@/views/my/addressList.vue'), meta: { title: '收货地址', bg: '#101115', light: true } },
  /* 公告详情（原站 pages/notice/noticeDetails；query {id}，黑金 #101115，加载遮罩） */
  { path: '/pages/notice/noticeDetails', name: 'pages-notice-noticeDetails', component: () => import('@/views/notice/noticeDetails.vue'), meta: { title: '公告详情', bg: '#101115', light: true } },
  /* 公告搜索（原站 pages/notice/search；黑底 #101115 + 金边搜索框） */
  { path: '/pages/notice/search', name: 'pages-notice-search', component: () => import('@/views/notice/search.vue'), meta: { title: '搜索', bg: '#101115', light: true } },
  /* 寄售搜索（原站 pages/consignments/search；浅色 #f7f7f8 + 全部/藏品/盲盒 tab） */
  { path: '/pages/consignments/search', name: 'pages-consignments-search', component: () => import('@/views/consignments/search.vue'), meta: { title: '寄售搜索', bg: '#f7f7f8' } },
  /* 我的盲盒（原站 pages/blindBox/index；浅色 #f7f7f8 + product-bg-tz 背景图） */
  { path: '/pages/blindBox/index', name: 'pages-blindBox-index', component: () => import('@/views/blindBox/index.vue'), meta: { title: '我的盲盒', bg: '#f7f7f8' } },
  /* 盲盒详情（原站 pages/blindBox/blindBoxDetails；query {id}，浅色 #f7f7f8 白卡布局） */
  { path: '/pages/blindBox/blindBoxDetails', name: 'pages-blindBox-blindBoxDetails', component: () => import('@/views/blindBox/blindBoxDetails.vue'), meta: { title: '盲盒详情', bg: '#f7f7f8' } },
  /* 合成方案详情（原站 pages/compound/schemeDetails；黑金 #101115 + 底部固定「立即合成」） */
  { path: '/pages/compound/schemeDetails', name: 'pages-compound-schemeDetails', component: () => import('@/views/compound/schemeDetails.vue'), meta: { title: '方案详情', bg: '#101115', light: true } },
  /* 邀请好友助力（原站 pages/draw/InvitationFriendAssist/InvitationFriendAssist；浅灰 #f5f5f5） */
  { path: '/pages/draw/InvitationFriendAssist/InvitationFriendAssist', name: 'pages-draw-inviteAssist', component: () => import('@/views/draw/inviteAssist.vue'), meta: { title: '邀请好友助力', bg: '#f5f5f5' } },
  /* 下载 App（原站 pages/index/downloadApp；深紫渐变 + iOS/安卓下载按钮） */
  { path: '/pages/index/downloadApp', name: 'pages-index-downloadApp', component: () => import('@/views/index/downloadApp.vue'), meta: { title: '下载嗒嗒', bg: '#0d0b1f', light: true } },
  /* 邀请活动（原站 pages/invitation/invitation；黑金径向渐变 + 邀请码/二维码） */
  { path: '/pages/invitation/invitation', name: 'pages-invitation-invitation', component: () => import('@/views/invitation/invitation.vue'), meta: { title: '邀请活动', bg: '#101115', light: true } },
  /* 水晶商城（原站 pages/shop/shop；蓝色主题 top-bg 背景 + 龙晶兑换空态） */
  { path: '/pages/shop/shop', name: 'pages-shop-shop', component: () => import('@/views/shop/shop.vue'), meta: { title: '水晶商城', bg: '#f7f7f8' } },
  /* 水晶明细（原站 pages/shop/detailList；三 tab + 右上筛选 + 空态） */
  { path: '/pages/shop/detailList', name: 'pages-shop-detailList', component: () => import('@/views/shop/detailList.vue'), meta: { title: '水晶明细', bg: '#f7f7f8' } },
  /* 兑换记录（原站 pages/shop/record；导航栏 + 空态） */
  { path: '/pages/shop/record', name: 'pages-shop-record', component: () => import('@/views/shop/record.vue'), meta: { title: '兑换记录', bg: '#f7f7f8' } },
  /* 确认订单（原站 pages/shop/exchange；数据来自 storage('exchange')，无数据时空白） */
  { path: '/pages/shop/exchange', name: 'pages-shop-exchange', component: () => import('@/views/shop/exchange.vue'), meta: { title: '确认订单', bg: '#f7f7f8' } },
  /* 藏品详情（原站 pages/shop/detail/collection；goods_type=2） */
  { path: '/pages/shop/detail/collection', name: 'pages-shop-detail-collection', component: () => import('@/views/shop/detailCollection.vue'), meta: { title: '藏品详情', bg: '#f7f7f8' } },
  /* 盲盒详情（原站 pages/shop/detail/box；goods_type=1） */
  { path: '/pages/shop/detail/box', name: 'pages-shop-detail-box', component: () => import('@/views/shop/detailBox.vue'), meta: { title: '盲盒详情', bg: '#f7f7f8' } },
  /* 商品详情（原站 pages/shop/detail/goods；goods_type=3） */
  { path: '/pages/shop/detail/goods', name: 'pages-shop-detail-goods', component: () => import('@/views/shop/detailGoods.vue'), meta: { title: '商品详情', bg: '#f7f7f8' } },
  /* 活动中心（原站 pages/task/index；顶部四宫格 + 活动商城 + 底部 tabbar） */
  { path: '/pages/task/index', name: 'pages-task-index', component: () => import('@/views/task/index.vue'), meta: { title: '活动', bg: '#f7f7f8' } },

  /* ===== 公告 / 盲盒 / 抽签 三模块（2026-10-25） ===== */
  /* 消息（原站 pages/message/message；w-container 空壳页，白底 44px 原生导航） */
  { path: '/pages/message/message', name: 'pages-message-message', component: () => import('@/views/message/message.vue'), meta: { title: '消息', bg: '#ffffff', light: true } },
  /* 新闻详情（原站 pages/notice/newsDetails；query {id, category}，全屏 loading 遮罩 #f7f7f8） */
  { path: '/pages/notice/newsDetails', name: 'pages-notice-newsDetails', component: () => import('@/views/notice/newsDetails.vue'), meta: { title: '新闻发声', bg: '#f7f7f8' } },
  /* 辟谣详情（原站 pages/notice/wallDetails；query {id}，全屏 loading 遮罩 #f7f7f8） */
  { path: '/pages/notice/wallDetails', name: 'pages-notice-wallDetails', component: () => import('@/views/notice/wallDetails.vue'), meta: { title: '辟谣详情', bg: '#f7f7f8' } },
  /* 发表辟谣（原站 pages/notice/sendRumor；diy-nav + textarea + 匿名开关） */
  { path: '/pages/notice/sendRumor', name: 'pages-notice-sendRumor', component: () => import('@/views/notice/sendRumor.vue'), meta: { title: '发表', bg: '#ffffff', light: true } },
  /* 盲盒结果（原站 pages/blindBox/result；白卡 + 底部双按钮） */
  { path: '/pages/blindBox/result', name: 'pages-blindBox-result', component: () => import('@/views/blindBox/result.vue'), meta: { title: '盲盒结果', bg: '#f7f7f8' } },
  /* 盲盒结果2（原站 pages/blindBox/result2；藏品编号 + 底部双按钮） */
  { path: '/pages/blindBox/result2', name: 'pages-blindBox-result2', component: () => import('@/views/blindBox/result2.vue'), meta: { title: '盲盒结果', bg: '#f7f7f8' } },
  /* 开盒记录（原站 pages/blindBox/openRecord；query {id}，搜索空态） */
  { path: '/pages/blindBox/openRecord', name: 'pages-blindBox-openRecord', component: () => import('@/views/blindBox/openRecord.vue'), meta: { title: '开盒记录', bg: '#f7f7f8' } },
  /* 中签结果（原站 pages/draw/drawResult/drawResult；query {data}，全屏 loading 遮罩） */
  { path: '/pages/draw/drawResult/drawResult', name: 'pages-draw-drawResult', component: () => import('@/views/draw/drawResult.vue'), meta: { title: '中签结果', bg: '#f5f5f5', light: true } },
  /* 分享社群（原站 pages/draw/shareCommunityGroup/shareCommunityGroup；积分卡 + 规则卡 + 提交） */
  { path: '/pages/draw/shareCommunityGroup/shareCommunityGroup', name: 'pages-draw-shareCommunityGroup', component: () => import('@/views/draw/shareCommunityGroup.vue'), meta: { title: '分享', bg: '#f5f5f5', light: true } },
  /* 分享助力（原站 pages/draw/communityShare/communityShare；助力卡 + 记录空态 + 提交） */
  { path: '/pages/draw/communityShare/communityShare', name: 'pages-draw-communityShare', component: () => import('@/views/draw/communityShare.vue'), meta: { title: '分享', bg: '#f5f5f5', light: true } },
  /* 参与人数（原站 pages/draw/Leaderboard/Leaderboard；人数卡 + 底部邀请按钮） */
  { path: '/pages/draw/Leaderboard/Leaderboard', name: 'pages-draw-Leaderboard', component: () => import('@/views/draw/leaderboard.vue'), meta: { title: '参与人数', bg: '#f5f5f5', light: true } },

  /* ===== K线 / 抽签 / 抽奖 / 交易记录 批次（2026-10-25） ===== */
  /* K线行情详情（原站 pages/kline/info，query {id}；深色 u-navbar + 顶部 swiper + 6 项行情指标 + 底部双按钮） */
  { path: '/pages/kline/info', name: 'pages-kline-info', component: () => import('@/views/kline/info.vue'), meta: { title: '详情', bg: '#f7f7f8' } },
  /* K线购买页（原站 pages/kline/buy，query {id}；深色 u-navbar + 深灰主体 + 流通/相关公告/成交额 tab） */
  { path: '/pages/kline/buy', name: 'pages-kline-buy', component: () => import('@/views/kline/buy.vue'), meta: { title: '购买', bg: '#333333' } },
  /* 抽签活动（原站 pages/activity/draw，query {id}；纯黑底 + 时间线 4 格 + 抽签码/邀请区） */
  { path: '/pages/activity/draw', name: 'pages-activity-draw', component: () => import('@/views/activity/draw.vue'), meta: { title: '抽签活动', bg: '#111111', light: true } },
  /* 中奖记录（原站 pages/lottery/record，query {id}；黑金渐变双卡 + 奖品列表 + 空态抽奖记录） */
  { path: '/pages/lottery/record', name: 'pages-lottery-record', component: () => import('@/views/lottery/record.vue'), meta: { title: '中奖记录', bg: '#101115', light: true } },
  /* 活动规则（原站 pages/lottery/rule；浅色 #f7f7f8 + 白卡「规则详情」） */
  { path: '/pages/lottery/rule', name: 'pages-lottery-rule', component: () => import('@/views/lottery/rule.vue'), meta: { title: '活动规则', bg: '#f7f7f8' } },
  /* 成交记录（原站 pages/market/tradingInformation，query {id}；浅灰 + 顶部行情白卡 + 当前成交/当前寄售 tab） */
  { path: '/pages/market/tradingInformation', name: 'pages-market-tradingInformation', component: () => import('@/views/market/tradingInformation.vue'), meta: { title: '成交记录', bg: '#f5f5f5' } },

  /* ===== 合成 / 榜单 批次（2026-10-26） ===== */
  /* 合成首页（原站 pages/compound/compound；/synthesis/themeinfo 返回 null → 整页加载遮罩） */
  { path: '/pages/compound/compound', name: 'pages-compound-compound', component: () => import('@/views/compound/compound.vue'), meta: { title: '合成', bg: '#f7f7f8' } },
  /* 合成记录（原站 pages/compound/record；/synthesis/recordList total 0 → 空态插画） */
  { path: '/pages/compound/record', name: 'pages-compound-record', component: () => import('@/views/compound/record.vue'), meta: { title: '活动记录', bg: '#f7f7f8' } },
  /* 合成结果（原站 pages/compound/result；/synthesis/recordInfo「记录不存在」仍展示成功骨架） */
  { path: '/pages/compound/result', name: 'pages-compound-result', component: () => import('@/views/compound/result.vue'), meta: { title: '合成结果', bg: '#f7f7f8' } },
  /* 活动规则（原站 pages/rules/rules；无接口，卡内为空） */
  { path: '/pages/rules/rules', name: 'pages-rules-rules', component: () => import('@/views/rules/rules.vue'), meta: { title: '活动规则', bg: '#f7f7f8' } },
  /* 龙虎榜（原站 pages/rank/rankList；/user/newrank1 全空 → 空态） */
  { path: '/pages/rank/rankList', name: 'pages-rank-rankList', component: () => import('@/views/rank/rankList.vue'), meta: { title: '龙虎榜', bg: '#e9f1fc' } },
  /* 买入清单（原站 pages/rank/userBuy；/user/masterinfo data [] → 空列表） */
  { path: '/pages/rank/userBuy', name: 'pages-rank-userBuy', component: () => import('@/views/rank/userBuy.vue'), meta: { title: '买入清单', bg: '#f6f6f6' } },
  /* 大师动态（原站 pages/rank/masterRank；/user/masterlist data [] → 深棕空白页） */
  { path: '/pages/rank/masterRank', name: 'pages-rank-masterRank', component: () => import('@/views/rank/masterRank.vue'), meta: { title: '大师动态', bg: '#1a1002' } },
  /* 排行榜（原站 pages/leaderboard/leaderboard；/user/ranking my 空 → 底部「暂未上榜」） */
  { path: '/pages/leaderboard/leaderboard', name: 'pages-leaderboard-leaderboard', component: () => import('@/views/leaderboard/leaderboard.vue'), meta: { title: '排行榜', bg: '#f3f3f3' } },

  /* ===== 收尾批次：活动 / 工会 / 认证 / 分类 / 搜索 / 返佣 / webview（2026-10-26） ===== */
  /* 活动中心（原站 pages/activeSelected/activeSelected；/Activity/category 与 /activity/index 均无数据 → 空态插画） */
  { path: '/pages/activeSelected/activeSelected', name: 'pages-activeSelected-activeSelected', component: () => import('@/views/activity/activeSelected.vue'), meta: { title: '活动中心', bg: '#f7f7f8' } },
  /* 中签记录（原站 pages/activity/record；/draw/drawLog data [] → 空态插画） */
  { path: '/pages/activity/record', name: 'pages-activity-record', component: () => import('@/views/activity/record.vue'), meta: { title: '中签记录', bg: '#f7f7f8' } },
  /* 嗒嗒工会（原站 pages/union/tradeUnion；深色 d-bg 背景 + 公会未解锁态 + 权益卡） */
  { path: '/pages/union/tradeUnion', name: 'pages-union-tradeUnion', component: () => import('@/views/union/tradeUnion.vue'), meta: { title: '嗒嗒工会', bg: '#1a1002', light: true } },
  /* 工会排名（原站 pages/union/unionRank；/union/index/logs data [] → 仅表头） */
  { path: '/pages/union/unionRank', name: 'pages-union-unionRank', component: () => import('@/views/union/unionRank.vue'), meta: { title: '工会排名', bg: '#0a0a0a', light: true } },
  /* 工会成员排名（原站 pages/union/userRank；/union/user/logs「工会不存在」→ 仅表头） */
  { path: '/pages/union/userRank', name: 'pages-union-userRank', component: () => import('@/views/union/userRank.vue'), meta: { title: '工会成员排名', bg: '#0a0a0a', light: true } },
  /* 工会消息通知（原站 pages/union/news；/union/user/message 500 → 空白页） */
  { path: '/pages/union/news', name: 'pages-union-news', component: () => import('@/views/union/news.vue'), meta: { title: '消息通知', bg: '#0a0a0a', light: true } },
  /* 认证结果（原站 pages/certification/certificationStatus；测试账号为「实名认证失败」） */
  { path: '/pages/certification/certificationStatus', name: 'pages-certification-certificationStatus', component: () => import('@/views/certification/certificationStatus.vue'), meta: { title: '认证结果', bg: '#f7f7f8' } },
  /* 分类管理（原站 pages/market/categoryManager；我的分类三胶囊 + 空的其他分类） */
  { path: '/pages/market/categoryManager', name: 'pages-market-categoryManager', component: () => import('@/views/market/categoryManager.vue'), meta: { title: '分类', bg: '#f7f7f8' } },
  /* 搜索页（原站 pages/market/search；胶囊搜索框 + 数字藏品/盲盒切换） */
  { path: '/pages/market/search', name: 'pages-market-search', component: () => import('@/views/market/search.vue'), meta: { title: '搜索', bg: '#f7f7f8' } },
  /* 返佣概览（原站 pages/rebate/rebate；/user/commision_info 无响应 → 永久「加载中...」） */
  { path: '/pages/rebate/rebate', name: 'pages-rebate-rebate', component: () => import('@/views/rebate/rebate.vue'), meta: { title: '返佣', bg: '#f7f7f8' } },
  /* 被邀请人清单（原站 pages/rebate/rebateInviteDetail；/user/bei_yao_list 无响应 → 空表 + 空态插画） */
  { path: '/pages/rebate/rebateInviteDetail', name: 'pages-rebate-rebateInviteDetail', component: () => import('@/views/rebate/rebateInviteDetail.vue'), meta: { title: '被邀请人清单', bg: '#f7f7f8' } },
  /* 返佣排行榜（原站 pages/rebate/leaderboard；日/周/月 tab + 空态插画） */
  { path: '/pages/rebate/leaderboard', name: 'pages-rebate-leaderboard', component: () => import('@/views/rebate/leaderboard.vue'), meta: { title: '返佣排行榜', bg: '#f7f7f8' } },
  /* webview 壳页（原站 pages/webview/webview，支持 query url） */
  { path: '/pages/webview/webview', name: 'pages-webview-webview', component: () => import('@/views/webview/webview.vue'), meta: { title: '', bg: '#ffffff' } },
  /* webview 壳页（原站 pages/webview/webview-storage，支持 query url） */
  { path: '/pages/webview/webview-storage', name: 'pages-webview-webview-storage', component: () => import('@/views/webview/webviewStorage.vue'), meta: { title: '', bg: '#ffffff' } },
  /* 支付 webview 壳页（原站 pages/webview/pay-webview，支持 query url） */
  { path: '/pages/webview/pay-webview', name: 'pages-webview-pay-webview', component: () => import('@/views/webview/payWebview.vue'), meta: { title: '', bg: '#ffffff' } },
  /* iArt 超话（原站 pages/iart/index；内容区为空） */
  { path: '/pages/iart/index', name: 'pages-iart-index', component: () => import('@/views/iart/index.vue'), meta: { title: 'iArt超话', bg: '#f7f7f8' } },

  { path: '/:pathMatch(.*)*', redirect: '/pages/index/index' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router