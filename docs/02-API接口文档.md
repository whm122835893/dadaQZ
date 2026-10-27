# 嗒嗒艺术 H5 —— API 接口文档

> 协议：HTTP / JSON
> 前缀：`/api`（业务）、`/addons`（插件）
> 独立项目自有服务：`http://127.0.0.1:8000`，前端通过 Vite 代理访问

---

## 一、通用约定

### 1.1 请求头

| Header | 必填 | 说明 |
|---|---|---|
| `Content-Type` | 是 | `application/json` |
| `sign` | 是 | `md5(完整URL + METHOD)`，见 1.2 |
| `token` | 否 | 登录后必传，取自 `/user/login` 返回 |
| `version` | 是 | App 版本号，默认 `1.1.2` |
| `Cache-Control` | 是 | `no-cache` |

### 1.2 签名算法（与原站完全一致）

```js
sign = md5(baseUrl + path + METHOD)
```

- `baseUrl` = `/api`（插件为 `/addons`）
- 若带查询串，查询串拼在 path 之后参与签名
- METHOD 大写

示例：
```
md5("/api/user/login" + "POST") = 62f65f4b8887fbae79b8a3724615d619
```

### 1.3 统一响应体

```json
{ "code": 1, "msg": "个人信息", "time": "1792403294", "data": {} }
```

| code | 含义 | 前端处理 |
|---|---|---|
| 1 | 成功 | 取 `data` |
| 0 | 业务失败 | `msg` 直接 toast |
| -1 | 未登录/登录过期 | 清除 token，跳登录页 |

---

## 二、认证

### 2.1 密码登录

`POST /api/user/login`

请求：
```json
{ "account": "17587881293", "password": "whm981004" }
```

响应 `data`：
```json
{
  "userinfo": {
    "id": 4539,
    "username": "17587881293",
    "nickname": "tcE3upv0Lw",
    "mobile": "17587881293",
    "avatar": "/defautAvatar.png",
    "score": 3,
    "inviter_code": "L1224539",
    "token": "c17bef29-c046-46bf-b98a-1200bec44282",
    "expiretime": 1794995288,
    "expires_in": 2592000,
    "is_exist": 1
  }
}
```

> ⚠️ **token 位置容易踩坑**：令牌在 `data.userinfo.token`，**不是** `data.token`。
> `expiretime` 为秒级 Unix 时间戳（1794995288 ≈ 2026-11-19），`expires_in` = 2592000（30 天）。
> `avatar` 返回的是站点相对路径 `/defautAvatar.png`，前端需替换为站点 logo（详见 5.2 我的页）。
> `inviter_code`（`L1224539`）即用户邀请码/邀请人 ID 展示值，"我的"页 UID 展示的就是它。

**`userinfo` 字段说明**

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | int | 用户主键（如 4539） |
| `username` | string | 登录名（此处为手机号） |
| `nickname` | string | 昵称，如 `tcE3upv0Lw` |
| `mobile` | string | 手机号 |
| `avatar` | string | 头像路径，`/defautAvatar.png` 表示未设置 |
| `score` | int | 积分/成长值 |
| `inviter_code` | string | 邀请码，"我的"页 UID 展示值 |
| `token` | string | 访问令牌，后续请求放入请求头 `token` |
| `expiretime` | int | 令牌过期时间（秒级时间戳） |
| `expires_in` | int | 有效期秒数，2592000 = 30 天 |
| `is_exist` | int | 账号是否已存在，1 存在 |

### 2.2 验证码登录
`POST /api/user/LoginForMobile` — `{ mobile, captcha }`

### 2.3 注册
`POST /api/user/register` — `{ mobile, password, captcha, inviter_code? }`

### 2.4 重置密码
`POST /api/user/resetpwd` — `{ mobile, password, captcha }`

### 2.5 短信验证码
`POST /api/sms/send` — `{ mobile, event: "login"|"register"|"resetpwd", verify_token? }`

### 2.6 获取用户信息
`POST /api/user/getUserInfo`（需 token）

响应 `data`：用户完整档案，字段见数据库文档 `users` 表。

> "我的"页（`pages/my/my`）只依赖本接口 + `2.1` 的登录态。实测该账号（ID 4539）的关键值：
> `nickname = tcE3upv0Lw`、`inviter_code = L1224539`、`real_name_authentication = null`（**未实名**，注意是可空而非 `0`**）、
> `avatar = /defautAvatar.png`。未实名时前端展示文案「未实名」，头像回落到站点 logo。

---

## 三、首页（`pages/index/index`）

页面加载时并发调用以下 7 个接口。

### 3.1 全局配置

`POST /api/index/getConfig`

请求：
```json
{
  "key": "resell_collection,copyright,transfer_collection,appLogo,appBigLogo,pay_audit,app_version,appName,puzzleCaptcha,cancellation,pay_time_limit,h5_domain,draw_notice,credit_goods_dhxz,credit_goods_zysx,service_image,service_mobile,certification,consignment_sales,isAgreement,h5_invite_url,strategy,aboutus,ipa,base_apk,default_pay_type,fastOrder_check,batchBuy_check,normal_check,synthetic_check,service_email,draw_share_assrule,draw_code_rankrule,draw_lots_rule,draw_lots_notice,share_rule,score_helpdraw_sub,helpdraw_rule,draw_share_assimage,comm_desc,risk_warning,qq_team_num,olduser_dayhelp_num,purchase_sale_details"
}
```

响应 `data`（节选）：
```json
{
  "pay_time_limit": "180",
  "app_version": "1.1.2",
  "appName": "嗒嗒",
  "appLogo": "/uploads/20260912/641fb93746a2b4b145c6ce0479225bb7.png",
  "base_apk": "https://apinew.hfeyusheng.top/download/tata.apk",
  "default_pay_type": "yibao",
  "qq_team_num": "11273",
  "isAgreement": "1",
  "risk_warning": "数字藏品为虚拟数字商品…"
}
```

### 3.2 系列列表

`POST /api/index/getSeries?type=10`

`type`：`10`=首页系列，`0`=全部

响应 `data`：
```json
[{
  "series_name": "嗒嗒艺术",
  "series_id": 24,
  "is_def": 0,
  "flag": 0,
  "pattern": 1,
  "resale_put_start_time": "01:52:55",
  "resale_put_end_time": "01:52:55",
  "resale_buy_start_time": "01:52:55",
  "resale_buy_end_time": "01:52:55",
  "current_price": "195.00",
  "change_price": "100.00"
}]
```

### 3.3 公告分类字典

`POST /api/index/affichetypelist`

响应 `data`：
```json
[{"id":1,"name":"运营公告"},{"id":2,"name":"合成公告"},
 {"id":3,"name":"分解公告"},{"id":4,"name":"上新公告"},
 {"id":5,"name":"活动公告"},{"id":6,"name":"寄售公告"}]
```

### 3.4 首页 DIY 装修

`POST /addons/diypage/index`

响应 `data`：6 条装修配置
```json
[
  {"id":3145,"type":"menu","category":"home","name":"菜单组",
   "content":"{\"style\":4,\"list\":[{\"name\":\"APP下载\",\"image\":\"/uploads/20260816/46f70e34....png\",\"path\":\"/pages/lottery/lottery?id=1\",\"path_type\":2}, ...]}"},
  {"id":3146,"type":"centre","category":"home","name":"中部合成","content":"..."},
  {"id":3147,"type":"popup","category":"popup","name":"弹窗提醒","content":"..."},
  {"id":3148,"type":"tabbar","category":"tabbar","name":"底部导航","content":"..."},
  {"id":3149,"type":"user","category":"user","name":"用户卡片","content":"..."},
  {"id":3150,"type":"float-button","category":"float-button","name":"悬浮按钮","content":"..."}
]
```

`path_type` 语义：`1`=内部路由，`2`=内部路由带参数，`3`=外部 URL，`4`=小程序

### 3.5 发售日历 / 盲盒列表

`POST /api/box/blind_box/list`

请求：
```json
{ "goods_type": "", "list_rows": 30, "page": 1, "order": "", "sort": "", "series_id": 0 }
```

响应 `data`：
```json
[{
  "id": 20, "name": "打王神鞭",
  "listimg": "/uploads/20261019/447aea6b....jpg",
  "price": "9.90", "total_num": 20000,
  "goods_type": "2", "batch_id": "7",
  "type": "collection", "soldout": 0,
  "release_date_time_text": "2026-10-19 18:00",
  "release_time_text": 531,
  "release_time_date_text": "2026-10-19 18:00:00",
  "sale_status_text": 2,
  "batch": { "start_time": 1792404000, "end_time": 1792404180, "total_num": 20000, "has_num": 1 },
  "publisher": { "name": "嗒嗒", "company_logo": "/uploads/20260912/641fb937....png" }
}]
```

`sale_status_text`：`1`=在售，`2`=即将发售，`3`=已售罄

### 3.6 首页轮播

`POST /api/banner/show/getBanner`

请求：`{ "type": 1 }`

响应 `data`：
```json
{
  "total": 2, "per_page": 15, "current_page": 1, "last_page": 1,
  "data": [
    {"id":2,"image":"/uploads/20261016/e924cc4b....png","url":"http://qm.qq.com/cgi-bin/qm/qr?...","url_type":3,"is_show":1},
    {"id":1,"image":"/uploads/20261016/535d8789....png","url":".../#/pages/index/downloadApp","url_type":3,"is_show":1}
  ]
}
```

### 3.7 公告列表

`POST /api/index/afficheList`

> **已用真实签名请求验证**（2026-10-19 抓取）。注意分页参数名是 **`list_rows`**，不是 `limit`；
> 分类筛选参数是 **`category`**（取 `affiche_type` 表主键），不是 `affiche_type`（后者仅用于展示）。

请求：
```json
{ "page": 1, "list_rows": 15, "category": 0 }
```

响应 `data`（真实响应，`total=31`）：
```json
{
  "total": 31, "per_page": 15, "current_page": 1, "last_page": 3,
  "data": [{
    "id": 31,
    "image": "",
    "title": "【嗒嗒艺术赋能公告】ding！嗒嗒首期夺宝活动来袭！",
    "createtime": 1792420876,
    "type": "1",
    "url": "",
    "affiche_type": "运营公告",
    "describe": ""
  }]
}
```

**字段说明（反编译 `notice.js` 模块 `82fc` 确认）**

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | int | 公告 ID，用于跳转 `noticeDetails?id={id}` |
| `title` | string | 标题，列表中单行省略（`white-space:nowrap` + `ellipsis`） |
| `affiche_type` | string | **分类中文名**，直接渲染为卡片标签；空值时标签宽度为 0 |
| `describe` | string | 摘要，原站数据中**全部为空串**，前端按 `v-if` 判空不占位 |
| `createtime` | int | Unix 秒级时间戳，渲染为 `MM-DD HH:mm` |
| `type` | string | 固定 `"1"` |
| `image` / `url` | string | 原站数据中均为空串 |

**列表项渲染格式（`formatDateSimple`，逐字符复刻原站 `$tools`）**
```
MM-DD HH:mm      // 月-日 时:分，月份/日/时/分均 padStart(2,'0')
```
> 兼容秒级与毫秒级时间戳：`ts < 1e12 ? ts*1000 : ts`

**分类筛选实测**
| 请求 | total | 说明 |
|---|---|---|
| `category` 不传 | 31 | 全部分类 |
| `category: 2` | 5 | 仅「合成公告」，返回项 `affiche_type` 全为「合成公告」 |

### 3.8 公告分类字典

`POST /api/index/affichetypelist`

无请求参数。响应 `data`（真实响应，6 项固定）：
```json
[
  { "id": 1, "name": "运营公告" },
  { "id": 2, "name": "合成公告" },
  { "id": 3, "name": "分解公告" },
  { "id": 4, "name": "上新公告" },
  { "id": 5, "name": "活动公告" },
  { "id": 6, "name": "寄售公告" }
]
```

> 用于公告页左侧竖排导航栏。分类名渲染规则（反编译原站 `railLines`）：
> 长度 ≤3 字单行显示；>3 字**居中拆两行**（如「运营公告」→「运营」/「公告」）。

### 3.9 公告页顶部横幅

`POST /api/index/getComstomBanner`

无请求参数。响应 `data` 为 OSS 相对路径：
```json
{ "code": 1, "msg": "成功", "data": "/uploads/20260926/c335b70d27200c291f8a4898b60cfe47.png" }
```

> 前端需拼 `https://jufengwangluo.oss-cn-beijing.aliyuncs.com` 前缀。
> 该图仅用于 `/pages/notice/notice` 页内 banner，不走 `/banner/show/getBanner`。

---

## 四、藏品与盲盒

| 接口 | 方法 | 入参 | 说明 |
|---|---|---|---|
| `/api/box/blind_box/list` | POST | `{goods_type, list_rows, page, order, sort, series_id}` | 盲盒/藏品列表 |
| `/api/box/collection/CollectionList` | POST | `{page, limit, series_id}` | 藏品列表 |
| `/api/box/collection/ProductDetail/ids/{id}` | GET | — | 藏品详情 |
| `/api/user_collection/user_collection/getList` | POST | `{page, limit, status, series_id}` | 我的藏品 |
| `/api/user_collection/user_collection/getDetail` | POST | `{id}` | 藏品详情 |
| `/api/user_collection/user_collection/getRecord` | POST | `{page, limit}` | 获得记录 |
| `/api/user_collection/user_collection/ListDetail` | POST | `{id}` | 流转详情 |
| `/api/user_collection/user_collection/ListGoodsDetail` | POST | `{id}` | 关联商品 |
| `/api/user_collection/user_collection/HaveBoxCollection` | POST | `{id}` | 是否持有盲盒 |
| `/api/user_collection/user_collection/BoxCollectionList` | POST | `{page, limit}` | 盲盒列表 |
| `/api/user_collection/user_collection/addlike` | POST | `{id}` | 收藏 |
| `/api/user_collection/user_collection/dellike` | POST | `{id}` | 取消收藏 |
| `/api/user_collection/user_collection/likeCollection` | POST | `{page, limit}` | 我的收藏 |
| `/api/user_collection/user_collection/antMycollection` | POST | `{id}` | 我的藏品详情 |
| `/api/user_collection/user_collection/collectionCertificate` | POST | `{id}` | 数字证书 |
| `/api/user_collection/user_collection/doBoxCollection` | POST | `{id}` | 打开盲盒 |
| `/api/user_collection/user_collection/compoundLog` | POST | `{page, limit}` | 合成记录 |
| `/api/user_collection/user_collection/reGift` | POST | `{id, mobile}` | 转赠 |
| `/api/user_collection/user_collection/resale` | POST | `{id, price}` | 转售 |
| `/api/user_collection/user_collection/batch_resale` | POST | `{ids[], price}` | 批量转售 |
| `/api/user_collection/user_collection/show_resale_money` | POST | `{ids[]}` | 预估手续费 |
| `/api/user_collection/exchange/usercollectionList` | POST | `{page, limit}` | 兑换列表 |

### 4.1 市场页（寄售）接口

> 反编译 `pages-market-market.24482309.js` 确认，共 2 个接口。

**市场列表** `POST /api/market/market/getMarketList`

请求：
```json
{
  "add_deal_num": true,
  "page": 1, "list_rows": 20,
  "keywords": "", "goods_type": 2, "market_type": 1,
  "series_id": "", "order": "", "sort": ""
}
```

响应 `data` 为数组（2026-10-19 真实响应 3 条）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | int | 商品 ID，跳转 `market/detail?id={id}` |
| `product.id` | int | 关联商品 ID，`goods_type != 1` 时跳转用此值 |
| `product.name` / `product.listimg` | string | 列表展示名与图 |
| `name` / `listimg` | string | 商品自身名称与图（列表兜底） |
| `goods_type` | string | `"2"`=藏品；`1` 走 `/pages/product/box`，其他走 `marketGoodsList` |
| `total_num` | int | 发行量 |
| `flux` | string | 流通量 |
| `min_price` | string/int | 地板价，`is_out=0` 时展示 `¥ {min_price}` |
| `deal_num` | int | 成交量，`0` 展示 `—` |
| `is_out` | int | `1` = 已退市（价格位显示「已退市」灰字，不显示价格） |
| `market_fluctuate` | int | 涨跌幅百分比 |

**系列（大区）列表** `POST /api/index/series`，参数 `{ "type": 10, "page": 1, "list_rows": 50 }`

响应 `data`（真实 2 条）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `series_id` | int | 系列 ID，作为分类 tab 的 `id` |
| `series_name` | string | 大区名称 |
| `current_price` | string | 当前价，如 `"0.00"` / `"20.00"` |
| `change_price` | string | 涨跌额 |
| `pattern` | int | 图标样式 |
| `is_def` | int | 是否默认 |

> ⚠️ **注意**：市场页大区卡片与分类 tab **不走** `/index/getSeries`，而是读 Vuex `goods.collectionSeries`。
> 另有独立路径 `/api/index/getSeriesList` 实测 **404**，勿使用。

---

## 五、订单与寄售

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/order/order/myConsignment` | POST | 我的寄售 |
| `/api/order/entrust/list` | POST | 委托订单列表 |
| `/api/order/entrust/info` | POST | 委托详情 |
| `/api/order/beg/list` | POST | 求购列表 |
| `/api/order/beg/info` | POST | 求购详情 |
| `/api/market/...` | POST | 市场列表/下单/详情 |
| `/api/consignments/...` | POST | 寄售相关 |

---

## 六、活动

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/addons/signin/api.index/index` | POST | 签到页数据 |
| `/api/addons/signin/api.index/dosign` | POST | 执行签到 |
| `/api/addons/signin/api.index/monthSign` | POST | 签到记录 |
| `/api/activity/accessNewActivities` | POST | 活动列表 |
| `/api/lottery/...` | POST | 抽奖/记录/规则 |
| `/api/rebate/rebate` | POST | 返利 |
| `/api/rebate/leaderboard` | POST | 返利榜 |
| `/api/user/ranking` | POST | 排行榜 |
| `/api/user/masterlist` | POST | 大师榜 |

### 6.1 合成活动主题（反编译 `pages-activity-activity.7618cfa5.js` 确认）

**主题与方案** `POST /api/synthesis/themeinfo`

请求：`{ "thm": 1 }`（`thm=1` 为合成主题）

> **该接口需登录态**，未登录返回 401。

响应 `data`（真实响应）：
```json
{
  "id": 1, "types": 1, "name": "合成活动",
  "image": "/uploads/20261016/4eac445d1b075c84fcfff97d00cb7a12.png",
  "rule_text": "&nbsp;",
  "play": [{
    "id": 7,
    "title": "混元金斗合成活动",
    "image": "/uploads/20261019/01faa52be78ad6083b87ddf480fad5f0.png",
    "start_time": 1792416600000,
    "end_time": 1792420200000,
    "real_start_time": 1792416600000,
    "real_end_time": 1792420200000,
    "stock": 1,
    "classify": "regular",
    "type": "10",
    "description": "混元金斗合成活动",
    "activity_id": 1,
    "is_auto": 0, "is_delay": 0, "is_advance": 0,
    "advance_date": 0, "delay_date": 1
  }]
}
```

> ⚠️ **时间戳是毫秒级**（13 位），与全站其他接口的秒级（10 位）不同，前端格式化时需 `ts > 1e12 ? ts : ts*1000` 兼容。

**合成材料方案** `POST /api/synthesis/material`

请求：`{ "play_id": 7, "classify": "regular" }`

前端 `goCompound` 逻辑（反编译逐条复刻）：

| 响应情况 | 行为 |
|---|---|
| `data` 非空 | 弹出底部方案选择浮层，选中后跳 `compound/schemeDetails?play_id&classify&grp` |
| `data` 为空 / `code=3003` | 直接跳 `compound/schemeDetails?play_id&classify&grp=` |
| `code=4003` | Toast「您未获得合成资格」 |

**其他合成接口**

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/synthesis/playInfo` | POST | 合成玩法详情 |
| `/api/synthesis/recordInfo` | POST | 合成记录详情 |
| `/api/synthesis/recordList` | POST | 合成记录列表 |
| `/api/synthesis/selectCollection` | POST | 选择藏品 |
| `/api/synthesis/synthesizeNow` | POST | 立即合成 |

### 6.2 活动时间状态机（前端判定，非后端返回）

活动页文案全部由**前端根据当前时间实时计算**，后端不返回状态字段。判定逻辑（反编译原站 `$tools.checkTimeBetween`）：

```
checkTimeBetween(now, start, end):
  start/end 为秒级时间戳，需 ×1000
  now < start  → 0  未开始
  now > end    → 2  已结束
  否则         → 1  进行中
```

**发售卡片** `saleStatus(g)`：

| 入参 | 取值 |
|---|---|
| 开始时间 | `g.sale_start_time \|\| g.start_time` |
| 结束时间 | `g.sale_end_time \|\| g.end_time` |
| 兜底 | 两者任一为 0 → 直接判定为「进行中」 |

文案 `salePillText`（实测输出）：
| 状态 | 渲染 | 实测样例 |
|---|---|---|
| 未开始 | `敬请期待 {release_date_time_text.slice(5)} 开始` | `敬请期待 10-19 18:00 开始` |
| 进行中 | `进行中 {日期} — {结束日期}` | `进行中 10-19 18:00 — 10-19` |
| 已结束 | `已结束 {日期}` | — |

标签 `saleTagList` 规则：`系列名（无则「数字艺术」）` + `限量 {total_num} 份`（`total_num` 为空时回退 `batch.total_num`）+ 当 `goods_type==2 && sale_status_text==3` 追加「已售罄」。

**合成卡片** `compoundStatus(c)`：

| 条件 | 结果 |
|---|---|
| `c.stock === 0` | 直接「已结束」（**优先于时间判定**） |
| 否则按 `real_start_time` / `real_end_time` 判定 | 未开始 / 进行中 / 已结束 |

文案 `compoundPillText`（实测输出）：`敬请期待 10-19 21:30 开始`
进度 `compoundProgressText`：优先 `已合成 {done_num} / {total_num}`，否则 `剩余 {stock} 份`
按钮 `compoundBtnText`：已结束 → 灰按钮「已结束」，否则「去合成」

> 时间格式化用原站 uView `timeFormat`，注意其**反直觉约定**：`MM` = 分钟，`mm` = 月，`HH` 不存在（用 `hh`），格式串如 `yyyy-mm-dd hh:MM:ss`。

---

## 七、用户

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/user/profile` | POST | 更新资料 |
| `/api/user/RealAuthentication` | POST | 实名认证 |
| `/api/user/setPayPassword` | POST | 设置支付密码 |
| `/api/user/checkPaypass` | POST | 校验支付密码 |
| `/api/user/bindBank` | POST | 绑定银行卡 |
| `/api/user/getBankInfo` | POST | 银行卡信息 |
| `/api/user/delAccount` | POST | 注销账号 |
| `/api/auth/index/gettoken` | POST | 获取授权 token |

---

## 八、通用

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/common/uploadaccess` | POST | 文件上传 |
| `/api/common/getAttachment` | POST | 附件信息 |
| `/api/common/bg/{file}` | GET | 背景图 |
| `/api/index/getVersion` | POST | 版本检查 |
| `/api/index/gettest` | POST | 测试接口 |

---

## 九、已实现状态

### 9.1 前端页面（5 个主 tab 全部完成，已发布公网验收）

| 页面 | 路由 | 原站 chunk | 状态 |
|---|---|---|---|
| 首页 | `/pages/index/index` | `pages-index-index` | ✅ 像素级完成 |
| 市场 | `/pages/market/market` | `pages-market-market.24482309.js` | ✅ 像素级完成（Playwright Δ≤1px） |
| 公告 | `/pages/notice/notice` | 模块 `a38bf` + scopeId `215e8feb` | ✅ 像素级完成 |
| 活动 | `/pages/activity/activity` | 模块 `68d2` + scopeId `73fc5990` | ✅ 像素级完成 |
| 我的 | `/pages/my/my` | 模块 `2ded2` + scopeId `8f883508` | ✅ 像素级完成 |

公网巡检结论：5 页渲染正常、**破图 0**、**失败请求 0**。

### 9.2 工程能力

| 模块 | 状态 |
|---|---|
| 请求层（md5 签名 / 请求头 / token 注入 / 统一响应） | ✅ 已实现，与原站协议一致 |
| 登录态持久化 + `loginDemo` 降级登录 | ✅ 已实现 |
| API 层（`src/api/index.js` + `src/api/mock.js`） | ✅ 覆盖 5 个主 tab 全部接口 |
| mock 降级策略 | ✅ **mock 开启时直接返回，不打后端**（消除 501 噪声） |
| 静态资源本地化（原站图片全部下载，无 SVG） | ✅ 首页/市场/公告/活动/我的 共 19 张 |
| 数据库设计文档 |✅ 25 张表 |
| 原站侦查报告 | ✅ 130+ 路由 / 60+ 接口 |
| ThinkPHP 控制器落地 | ⏳ 按页面验收顺序逐个实现 |
| 二级页面（130+） | ⏳ 待开发 |

> 说明：当前前端在 ThinkPHP 后端未启动时自动使用 `src/api/mock.js` 中的原站真实响应数据降级渲染，保证可独立预览；后端就绪后通过 `VITE_USE_MOCK=false` 切换到真实接口。
---

## 十、签到/ 抽奖 / 藏品发售（2026-10-20 新增）

> 三页均按反编译源码复刻，接口已用真实签名 + 登录token 实调验证。

### 10.1 签到 `pages/sign/index`

chunk `pages-sign-index.ac51158a.js`｜render 模块 `a06b`（scopeId `48fef3c4`，30 个 `sg-` 类）｜logic 模块 `4170`

| 接口 | 方法 | 实调结果 |
|---|---|---|
| `/signin/config` | POST | 签名正确但路径未公开，需由后端补齐；字段 `successions` / `integral` / `is_signin` |
| `/signin/getSignRecord` | POST | 同上；返回 `{ time: 秒级时间戳, data: { 日: 签到天数 } }` |
| `/signin/dosign` | POST | 同上 |

**前端计算属性（逐条复刻）**

```js
streakDays()  => Number(config.successions || 0)
// pointText：依次取 integral / point / total_point / score，全空显示"—"
pointText() { const a=this.config||{},v=a.integral||a.point||a.total_point||a.score; return v||'—' }
// signDays：已签天数 = 连续天数，第7天奖励 +50，其余 +10
signDays() { const e=this.streakDays; return [1,2,3,4,5,6,7].map((a,t)=>({day:a,signed:t<e,reward:7===a?'+50':'+10'})) }
signBtnText()=> this.config.is_signin ? '今日已签到' : '立即签到'
```

> ⚠️ **原站三个奖励图标是同一张图**（`icon-daily`/`icon-streak`/`icon-gift` 的 MD5 完全一致：
> `d856f730c9a7056d46b4fada826c9154`），属原站自身资源复用，**不是下载错误**，复刻时保持原样。

### 10.2 抽奖 `pages/lottery/lottery`

chunk `pages-lottery-lottery.63c25018.js`｜render 模块 `386d`（scopeId **`cd90d3aa`**，24 个 `lt-` 类）｜logic 模块 `0950`｜API 模块 `c6d8`

| 接口 | 实调结果（2026-10-20） |
|---|---|
| `/lottery/info` | `{ code:0, msg:"暂无抽奖活动" }` —— 当前无进行中活动 |
| `/lottery/statistics` | `{ code:1, data:[] }` |
| `/lottery/start` | 入参 `{ lotteryId, number }` |
| `/lottery/record` | 抽奖记录 |

**`prizeCells` 归一化（award_list 兼容对象/数组）**

```js
const t = info.award_list || []
const d = Array.isArray(t) ? t
  : Object.keys(t).map(k => t[k] && typeof t[k]==='object' ? {name:k, ...t[k]} : {name:k})
return d.slice(0,8).map(t => ({name:t.name||'', detail:t.detail||'', image:t.image||''}))
```

**`gridCells` 九宫格布局（注意索引错位）**

```js
const gridCells = computed(() => {
  const out = []
  for (let i=0;i<9;i++) out.push(i===4 ? null : a[i>4 ? i-1 : i] || null)
  return out
})
// index 4 = 「立即抽奖」按钮占位；i>4 时取奖品[i-1]，故 5..8 对应奖品[4..7]
```

**`isStartDraw` 校验顺序（逐条不可调换）**

```
0未开始 → toast「暂未开始」
2已结束 → toast「活动已结束」
remaining <= 0 → toast「次数不足」
isStart → toast「抽奖进行中...」
free_number > 0 → 直接 startDraw()
否则 → 弹确认框（showPop = true）
```

**`crystal()` 宝石映射**：`crystal` 字段 `10`→黄(`crystal_yellow`)、`20`→紫(`crystal_purple`)、`30`→蓝(`crystal_blue`)，其余默认蓝 0。

**活动类型**：`type=20` 确认框展示 `cp_list`（消耗藏品明细，含 `user_collection_ids`）；`type=10` 展示消耗宝石数量。

### 10.3 藏品发售页 `pages/product/collection`（普通发售 / 抽签二选一）

chunk `pages-product-collection.592d7e9a.js`

**重要更正（2026-10-20 实调 + 反编译核实）**：本页**并非只有抽签形态**。
原站页面壳 render `f18e` 为「主图 + 价格 + 发售系列 + 作者介绍 + 藏品详情 + 购买须知 + 工具栏」，
底部由 `darwIsOpen` 二选一：

```js
a.darwIsOpen
  ? d("z-draw-actionV2", { attrs:{ product, invitFriend, codeInfo }})
  : d("z-product-action",  { attrs:{ product }})
```

`darwIsOpen` 来自 mixin `ca08`：`!!drawBase.open_draw`，
而 `drawBase = goods_type === 1 ? product : (product.batch?.id ? product.batch : product)`。
**即 `batch.open_draw = 0` 时本页走普通发售分支**（真实商品 id=20 打王神鞭的 `batch.open_draw` 就是 0）。

**关键 mixin / 组件**

| 模块 | 提供 |
|---|---|
| 页面壳 `f18e` | hero + content 布局 |
| `ca08` | `drawBase` / `darwIsOpen` / `signUpStatus` / `isDrawed` / 倒计时 |
| `d48a` | `saleStatus` / `saleStartTime` / `saleEndTime` / `totalNum` / `saleTotalNum` / `maxBuyCount` |
| `z-product-action`（`d7aa`→`642d`→`84664`/`e91f`） | **普通发售**底部按钮 + 购买数量弹窗 |
| `z-draw-actionV2`（`0b36`→`8212`/`ac61`） | **抽签**底部按钮 |
| `c90d` / `w-product-alldraw`（`f7d4`） | 抽签流程面板 / 全部抽签记录 |
| `w-navbar`（`d0b18`）、`w-copyright`（`773f`） | 导航栏 / 版权 |

**接口（实调核实）**

| 接口 | 方法 | 说明 |
|---|---|---|
| `/box/collection/ProductDetail/ids/{id}` | post（query `batch_id`） | 藏品详情。原站 `getCollectionDetails=function(e,t){return {url:"/box/collection/ProductDetail/ids/".concat(e),method:"post",param:{batch_id:t}}}`。**不带 `batch_id` 返回 `{code:0,msg:"参数错误"}`；带 `?batch_id=7` 返回 `code:1` 完整数据** |
| `/subscribe/index` | post | 设置购买提醒。参数 `{ id, opr_id, type:10, goods_type }`；`type=10` 且 `goods_type!=1` 时 `opr_id` 取 `batch.id` |
| `/subscribe/cancel` | post | 取消购买提醒 |
| `/draw/drawLog` | post | 抽签签号与结果（`drawLog`） |
| `/draw/doQualification` | post | 抽签报名（`signUpDraw`） |
| `/draw/get` | post | 实调 `{ code:0, msg:"活动不存在" }` |

> 实调补充：`id=18/26` 返回「找不到该商品，或者已经下架了」；
> `/box/blind_box/BoxDetail/ids/20` 同样已下架；`/box/collection/CollectionList` → 404。

**真实响应关键字段（id=20, batch_id=7）**

```json
{ "id":20, "name":"打王神鞭", "goods_type":2, "price":"9.90", "total_num":20000,
  "purchasing_num":1, "is_sub":false,
  "series":{ "id":26, "name":"神武专精" },
  "batch":{ "id":7, "collection_id":20, "start_time":1792404000, "end_time":1792407600,
            "total_num":20000, "has_num":1, "open_draw":0,
            "sign_up_start_time":null, "sign_up_end_time":null, "draw_time":0 } }
```

**三个状态机（全部前端判定，后端不返回状态码）**

```
signUpStatus  1未开始 | 2抽签中 | 3已抽签   （仅 darwIsOpen 分支生效）
  now <  sign_up_start_time          → 1
  now <  sign_up_end_time            → 2
  否则                              → 3

saleStatus     1待开售 | 2可购买 | 3无数据 | 4已结束/售罄
  !product.id                      → 3
  checkTimeBetween(now, start, end) == 2（已过结束） → 4
  == 0（未开始）                     → 1
  进行中且 saleTotalNum >= totalNum  → 4
  进行中                            → 2

whether_res   -1未开奖 | 0未中签 | 1中签
```

**底部按钮文案对照表 A：`z-product-action`（普通发售，照抄 `e91f` render）**

| `saleStatus` | 文案 | 行为 |
|---|---|---|
| `1` | 设置购买提醒 / 取消提醒（依 `product.is_sub`）+ `u-count-down` HH:mm:ss | `targetSub` → `/subscribe/index` 或 `/subscribe/cancel` |
| `2` | 立即抢购 | `buyAction`：`maxBuyCount===1` 直接下单，否则弹`u-popup bottom` 数量框（`changeCount/minus/add`，限 `purchasing_num`） |
| `3` / `4` | 已售罄，去市场看看（`tp-btn-disabled` 样式） | `toMarket` → 寄售市场 |

下单动作：`comconfirmOrder` 写入 `sessionStorage.confirmOrder` 后跳 `/pages/order/orderSubmit`。

**底部按钮文案对照表 B：`z-draw-actionV2`（抽签分支）**

| 条件 | 文案 | 可点 |
|---|---|---|
| `signUpStatus===1` | 活动未开始 | ✗ |
| `signUpStatus===2 && my_draw_num` | 进行中，获取签号（N） | ✓ signUp |
| `signUpStatus===2 && !my_draw_num` | 暂无抽签次数，快去分享 | ✓ 跳转助力页 |
| `signUpStatus===3 && !isDrawed && whether_res===-1 && !my_code.length` | 等待抽签 | ✗ |
| `signUpStatus===3 && my_code.length===0` | 您未参与本次活动 | ✗ |
| `whether_res===0` | 很遗憾，您未中签 | ✗ |
| `whether_res===1 && saleStatus===1` | `HH:mm:ss后开售`（倒计时） | ✗ |
| `whether_res===1 && saleStatus===2` | 已中签，立即购买 | ✓ |
| `whether_res===1 && saleStatus===3 or 4` | 进入市场 | ✓ |

**首页藏品点击分流**（`pages/index/index` 的 `goGoods`，实为 `1 != goods_type`）

```js
goGoods: function (a) {
  a.id && (1 != a.goods_type
    ? this.$u.route("/pages/product/collection", { id: a.id, batch_id: a.batch_id })
    : this.$u.route("/pages/product/box", { id: a.id }))
}
```

即 `goods_type != 1` → 本发售页；`goods_type == 1` → 盲盒开盒页 `/pages/product/box`。

**`draw_type_text` 结果文案**（原站 c90d 组件内硬编码）

| whether_res | text1 | text2 |
|---|---|---|
| `-1` | 未开奖 | 敬请期待 |
| `0` | 很遗憾，未中签 | 不要灰心，下次一定！ |
| `1` | 恭喜您，中签啦！ | 再接再励！ |

**时间字段单位陷阱**：`sign_up_start_time` / `sign_up_end_time` / `draw_time` / `batch.start_time` /
`batch.end_time` / `release_time` 均为**秒级**；
但抽签流程面板里「结束」节点原站写的是 `1e3 * batch.end_time`（手动乘1000 变毫秒）——
这与`sign_up_*` 的处理不同，是原站真实写法，复刻时保留。

---

### 10.4 盲盒开盒页 `pages/product/box`

chunk `pages-product-box.js`（hash `c7594761`），共 131 个 webpack 模块。

**页面 script `8ab0`**

```js
mixins: [ d48a（发售状态机）, 72d9（导航栏滚动渐变） ],
data(){ return { loading:false, id:null, product:{ goods_type:2, publisher:{} } } },
onLoad(A){ this.id = A.id; this.getDetails() },
onPullDownRefresh(){ this.getDetails() },
methods:{
  getDetails(){ const t = await getBoxDetails(this.id); this.product = t.data; this.product.goods_type = 1 },
  // catch → setTimeout(() => this.backPage(), 1500)
  rightAction(){ this.$u.route("/pages/blindBox/openRecord", { id: this.product.id }) }
}
```

> ⚠️ **关键**：原站拿到 BoxDetail 后**强制 `goods_type = 1`**（覆盖接口返回值），
> 这决定了 `targetSub` 的 `type=20` 与 `opr_id = product.id`（而非 `batch.id`）。

**接口（模块 `b1ec`）**

| 接口 | 方法 | 参数 | 说明 |
|---|---|---|---|
| `/box/blind_box/BoxDetail/ids/{id}` | post | query `{origin, crystal_goods_id}` | 盲盒详情，返回含 `collectionlist` |
| `/box/blind_box/openlog` | post | body | 开盒记录（`getOpenRecord`） |
| `/user_collection/user_collection/openbox` | post | body `{openid}` | 单个开盒（`openBox`） |
| `/user_collection/user_collection/openBoxs` | post | body `{openid}` | 批量开盒（`openBoxs`） |
| `/subscribe/index` `/subscribe/cancel` | post | body `{type:20, opr_id}` | 购买提醒（**type=20**，藏品为 10） |

> 实调（2026-10-20）：`id` 1–120 全部返回 `{code:0, msg:"找不到该盲盒，或者已经下架了"}`，
> **原站当前无在售盲盒**。本项目 mock 数据按原站字段结构构造，图片取自已下载的原站真实藏品图。

**页面结构（render `7aa3` + 子组件）**

```
w-container#colection.page-bg（#f7f7f8，loading）
  w-navbar            navType="goods" → autoBack=true
                      leftIcon="back-btn"、titleStyle color #000、bgColor 由 mixin 72d9 驱动
  w-product-details-card  e788 + 4e30（scope 4289e3ae）
    .product-card（crystal 类目挂 .crystal）
      .media-card（margin-top 52rpx=27px，居中）
        w-media  dbec+65fc：2*width=600rpx=312px 方图
          组件名由 3d_url_type 决定：img→media-img / 3d→media-3d / mp4→meida-video
          mediaUrl = 3d_url_type==='img' ? $ossUrl+main_image : $ossUrl+3d_url
      .goods-info（margin/padding 30rpx=15.6px，radius 52rpx=26px，白底）
        「嗒嗒精选」main-button +「数字艺术」desc-button（margin-left 30rpx）
        .product-name、slogan「一枚关于想象、链接与未来的数字艺术藏品」
        .goods-price（margin-top 56rpx=29.12px）：首发价格 / 出售价格 + ¥price
        .goods_public_info（margin-top 7px）：
            发行 / SUPPLY    = product.total_num
            流通 / CIRCULATION = product.flux || '--'
        isMarket 为真时才额外渲染：合约地址 info.user_hash / 发行方 publisher.name
  .plr-16.ptb-12（relative, z-index 1）
    w-product-box     32e6 + 231b（scope b918ebf6）—— 「藏品描述」
      v-show product.collectionlist && length
      「藏品描述」+「您可能抽到以下作品中的 1 个」
      循环项 .itme：w-image 59×59 radius4 + 名称 + 「概率：{probability}%」
                + 「总量：{show_total_num}份」+ w-image 55×55 rarity_icon
    w-product-introduce  ec26 + ac5a（scope 6660409e）—— 「藏品故事 / STORY」
      u-parse content = product.introduce_image
    w-product-buy-need   a5d7 + 3ce9 —— 「藏品须知 / NOTICE」
      v-show product.purchase_information，u-parse content = purchase_information
    w-copyright
  w-product-action   84664 + baf0（scope 02d7ed9c）—— **浅色**底部购买条
```

**`w-product-action`（浅色版，script `baf0`）**

| `saleStatus` | 渲染 | 文案 / 行为 |
|---|---|---|
| `≠4` | `.price` font-size 18px bold #111114 | ￥ + product.price |
| `1` + `is_sub` | `.action-btn`（两行） | 取消提醒 + `u-count-down HH:mm:ss` → `targetSub` |
| `1` + `!is_sub` | `.action-btn.no-sub`（单行） | 设置购买提醒 + 倒计时 → `targetSub` |
| `2` | `w-button type=colorful shape=circle width=480rpx border-radius=20rpx` | 立即购买 → `buyAction` |
| `4` | `w-button disabled width=100%` | 已售罄，去市场看看 |

> ⚠️ 此组件 `name: "z-product-action"`，与藏品页**深色**版同名但CSS 完全独立，
> 切勿混用。

**购买数量弹窗（`u-popup mode="bottom" bgColor="transparent"`）**

```
.submit-order.bg-color-item.pa-12
  购买数量 +（购买总数不得超过{maxBuyCount}个） / （您已达到限购数量）
  w-icon size=24 name="close2"  → 关闭
  v-uni-image 136rpx×136rpx br4（$ossUrl + product.listimg）
  price：¥ fontSize12 + price fontSize20
  1 != goods_type 时显示「编号随机」
  数量器 width 201rpx height 61rpx radius 100rpx
    -  30rpx 圆点 bg #dedee2 / input 126rpx 双边框 / +  30rpx 圆点 bg #000
  w-button「立即购买」disabled = !count || count > maxBuyCount
```

**`targetSub` 参数差异（务必区分）**

```js
{ type:      1 == product.goods_type ? 20 : 10,
  opr_id:    1 == product.goods_type ? product.id : product.batch.id }
```

**`comfirmOrder`**

```js
uni.setStorage({ key:'confirmOrder', data:{ product, count, order_type:1, maxCount:maxBuyCount },
                 success(){ uni.navigateTo({ url:'/pages/order/orderSubmit' }) } })
```

**首页点击分流对应**：`goods_type == 1` → 本页；`goods_type != 1` → `pages/product/collection`。

---

### 10.5 订单确认页 `pages/order/orderSubmit`

chunk `pages-order-orderSubmit.js`（hash `61f082c0`，399960 字节，222 个模块）。

**页面 script `be63`（完整逻辑）**

```js
components: { PayType },
data(){
  payInfo:{ pay_way:null, pay_type:null },
  order:{ product:{} }, orderBaseInfo:{ product:{} }, orderId:null, loading:false, timer:null,
  payList: basePayList.map(浅拷贝),
  payNameMap:{ huifu:'汇付支付', yibao:'易宝支付' }
},
filters:{ hideUrl(v){ return v ? v.slice(0,5) + '****' + v.slice(v.length-5) : v } },

computed:{
  // 三个条件全部满足才可下单
  disable(){ const ok = this.payInfo.pay_type
                  && this.userInfo.real_name_authentication
                  && this.orderBaseInfo.count <= this.orderBaseInfo.maxCount
             return !ok },
  product(){ return this.orderBaseInfo.product || {} },
  totalNum(){ return 1 == this.product.goods_type
                 ? this.product.total_num || 0
                 : (this.product.batch ? this.product.batch.total_num || 0 : this.product.total_num || 0) },
  totalPrice(){ return (this.product.price * this.orderBaseInfo.count).toFixed(2) },
  orderType(){ return this.orderBaseInfo.order_type },
  //来自 vuex config 模块
  captchaStatus(){ return !!Number(info.normal_check) }
},

onLoad(){
  const A = uni.getStorageSync('confirmOrder')
  this.orderBaseInfo = A || {}
  this.orderBaseInfo.product  ||= {}
  this.orderBaseInfo.count   ||= 1
  this.orderBaseInfo.order_type ||= 1
  this.orderBaseInfo.maxCount ||= (product?.purchasing_num || 1)
  this.setDefaultPay()
},
onHide(){ uni.$emit('hideCert') },
onShow(){
  this.loading = true
  this.getUserInfo().finally(() => {
    if (!this.userInfo.real_name_authentication) uni.$emit('showCert')   // 未实名 → 弹实名认证
    this.loading = false
  })
}
```

**方法逐条**

| 方法 | 实现 |
|---|---|
| `payDisplayName(p)` | `payNameMap[p.pay_way]` 命中则用映射；否则 `p.name` 含「支付」则原样，否则补「支付」 |
| `isPaySelected(p)` | `payInfo.pay_type == p.pay_type && payInfo.pay_way == p.pay_way` |
| `setDefaultPay()` | 取 `appConfig.default_pay_type \|\| 'huifu'` 找 `able` 项；否则取第一个 `able`；成功则 `selectPay` |
| `selectPay(p)` | `p && p.able && (payInfo = {pay_type, pay_way})` |
| `checkCaptcha()` | `captchaStatus && orderType === 2` → `$refs.captcha.showCaptcha()`；否则 `createOrder()` |
| `minus/add` | `count<=1` 不减 / `count !== maxCount` 才加 |
| `changeCount(e)` | **500ms 防抖**（`clearTimeout` + `setTimeout`），超出 [1, maxCount] 回弹 |
| `copy()` | `$tools.copyText(userInfo.ntf_url)` |
| `createOrder(a)` | `showLoading('订单创建中')` → `orderType===1 ? createDefaultOrder() : createMarketOrder(a)` |
| `createDefaultOrder()` | `createOrder({goods_type, goods_id:product.id, num:count, pay_type, pay_way, batch_id: goods_type!=1 ? product.batch.id : '', price: 1})` |
| `createMarketOrder(a)` | `createMarketOrder({market_goods_id, pay_type, pay_way, ...a})` |
| `pay(o)` | `new PaySdk({pay_type, order_number, order_type, pay_way, order_id})` |

**接口（模块 `7db7`，全部 POST）**

| 接口 | 用途 |
|---|---|
| `/order/pay/CreateOrder` | 普通藏品下单 |
| `/order/pay/CreateMarketOrder` | 市场下单（order_type=2） |
| `/order/pay/CreateVipOrder` | VIP 订单 |
| `/order/pay/batchBuy` | 批量下单（`bacthCreateOrder`，**原站方法名拼写如此**） |
| `/order/pay/batchdopay` | 批量支付（`createBatchPayOrder`） |
| `/order/pay/doPay` | 发起支付 |
| `/order/pay/batchPayOrder` | 批量订单列表 |
| `/order/pay/qualification` | 抽签/报名订单查询（`queryDramOrSignUpList`） |
| `/order/order/orderList` | 订单列表（`getOderList`，**原站方法名拼写如此**） |
| `/order/order/orderDetail/ids/{id}` | 订单详情（order_type=1） |
| `/order/order/MarketOrderDetail/ids/{id}` | 市场订单详情（order_type=2） |
| `/order/order/giveOrderDetail/ids/{id}` | 转赠订单详情 |
| `/order/order/saleMarketOrderDetail` | 出售市场订单详情（body `{order_id}`） |
| `/order/order/cancelbatchorder` | 取消批量订单 |
| `/order/order/changeOrderStatus` | 改状态（order_type=2 走 `changeMarketOrderStatus`，19 走 `changeGiveOrderStatus`） |

**支付方式 `basePayList`（主包 index.js 真实常量）**

```js
[{ name:'易宝', icon:'yibao', key:'huifu_pay_status',
   auth_key:'yibao_status', pay_type:4, pay_way:'yibao', able:true }]
```

**页面结构（render `764f`，scope `53af0fac`）**

```
w-container#order-submit.fsc-page（loading）
  w-navbar  navType="default"、leftIcon="back-btn-white"、title「订单确认」、titleStyle{color:#fff}
  .fsc-card.fsc-goods
    w-image 56×56 radius16（src = product.listimg || product.main_image）
    .fsc-goods__info：.fsc-goods__name（单行省略）、.fsc-goods__meta「发行{totalNum}份」
  .fsc-card.fsc-detail
    .fsc-section-title「支付方式」
    v-for payList → .fsc-pay（选中加 .fsc-pay--on）
      .fsc-pay__name、.fsc-pay__desc「使用{名称}进行快捷支付」
    .fsc-qty（border-top）
      .fsc-qty__label「购买数量」
      .fsc-qty__ctrl：.fsc-qty__btn(−) / .fsc-qty__input / .fsc-qty__btn(+) / .fsc-qty__unit「份」
      .fsc-qty__limit「首发限购{maxCount || 1}份」
    .fsc-total：.fsc-total__label「资产总价」+ .fsc-total__price「¥{totalPrice}」
  .fsc-bottom（fixed）
    .fsc-buy（disable 时加 .fsc-buy--disabled，click 仍绑但内部 !disable 判断）
      .fsc-buy__text「立即购买」
    captchaStatus 时挂 w-jy-verify（ref="captcha"，@success → createOrder）
```

**关键样式（rpx × 0.52 换算）**

| 类 | 值 |
|---|---|
| `.fsc-card` | `border 1px solid #655032`、`background #181713`、`radius 15.6px` |
| `.fsc-goods` | `padding 14.56px`、`margin-bottom 12.48px` |
| `.fsc-goods__img` | `58.24 × 58.24px`、`radius 8.32px` |
| `.fsc-goods__name` | `15.6px / 600 / #fff / Alibaba-PuHuiTi-Medium`、单行省略 |
| `.fsc-goods__meta` | `12.48px / #999` |
| `.fsc-detail` | `padding 16.64px 14.56px` |
| `.fsc-section-title` | `15.6px / 600 / #fff`、`margin-bottom 12.48px` |
| `.fsc-pay` | `padding 14.56px 12.48px`、`bg #332919`、`radius 8.32px`、`border 1px transparent` |
| `.fsc-pay--on` | `bg rgba(64,128,255,.08)`、`border-color #4080ff` |
| `.fsc-pay__name` / `__desc` | `14.56px / 600 / #fff` ／ `11.44px / #999` |
| `.fsc-qty` / `.fsc-total` | `margin-top & padding-top 14.56px`、`border-top 1px solid #655032` |
| `.fsc-qty__btn` | `24.96 × 24.96px`；文字 `18.72px`；`--off` 变`#c8c8c8` |
| `.fsc-qty__input` | `37.44 × 24.96px`、`bg #f4f5f5`、`radius 4.16px`、居中 |
| `.fsc-total__price` | `20.8px / 700 / #fff` |
| `.fsc-bottom` | fixed、`padding 12.48px 16.64px`、`bg #101115`、`border-top 1px solid #655032` |
| `.fsc-buy` | `height 54.08px`、`radius 14.56px`、`linear-gradient(135deg,#fae8bd,#cfaf72)` |
| `.fsc-buy__text` | `16.64px / 500 / #2f2414` |

**实调（2026-10-20）**

| 调用 | 返回 |
|---|---|
| `/index/getConfig {key:'huifu_pay_status'}` | `{code:1, data:{huifu_pay_status:'0'}}` —— 汇付已关闭 |
| `/index/getConfig {key:'yibao_status'}` | `{code:1, data:[]}` —— 易宝无配置 |
| `/user/getUserInfo` | `real_name_authentication = 1`（已实名）、`ntf_url = VtqSEBd3hkNb0afvI5w2Q6LCsWgHOxjU`、`inviter_code = L1224539` |
| `/order/pay/CreateOrder`（id=20 / batch=7 / num=1） | `{code:0, msg:'售卖已结束'}` —— 该商品已过发售期 |

> **注意**：`hideUrl` filter（`VtqSE****QOxjU`掩码）在当前页面 render 中**未被使用**，
> 属遗留filter，复刻时保留声明但不渲染。

---

### 10.6 订单列表页 `pages/order/list`

chunk `pages-order-list.js`（511295 字节，135 个 webpack 模块）。
script `c53a` / render `7677`（scope `60b0d25e`）。

**页面状态机（原站逐字）**

```js
orderTypeMap = [
  { name:'首发寄售', type:1,  orderMap:[
      {name:'全部',status:0,type:1},{name:'已完成',status:2,type:1},
      {name:'批量付',type:2,status:0},{name:'待支付',status:1,type:1},
      {name:'进行中',status:7,type:1},{name:'已取消',status:3,type:1},
      {name:'已退款',status:6,type:1}]},
  { name:'求购订单', type:11, orderMap:[
      {name:'全部',status:null,type:11},{name:'求购中',status:2,type:11},
      {name:'已成交',status:3,type:11},{name:'已取消',status:4,type:11}]},
  { name:'委托订单', type:31, orderMap:[
      {name:'全部',status:null,type:31},{name:'委托中',status:2,type:31},
      {name:'已成交',status:3,type:31},{name:'已取消',status:4,type:31}]}
]
```

**接口清单**

| 接口 | 原站方法 | 请求 | 用途 |
|---|---|---|---|
| `/order/order/orderList` | `getOderList` | POST `{page,status,type}` | 首发寄售订单列表（status: 0全部/1待支付/2已完成/3已取消/6已退款/7进行中） |
| `/order/order/batchPayOrder` | `getBatchOrderList` | POST（无参） | 批量付订单列表，返回 `{batch_order_id, endtime, data:[…]}` |
| `/market/trade/begBuyOrderList` | `getMyTradeList` | POST `{page,status,type}` | 求购订单列表（type=11） |
| `/market/Prepayment/myOrderlist` | `getMyEntrustList` | POST `{page,status,type}` | 委托订单列表（type=31） |
| `/order/order/cancelbatchorder` | `cancelBatchOrder` | POST `{batch_order_id}` | 取消批量付订单 |
| `/order/pay/batchdopay` | `createBatchPayOrder` | POST `{order_ids,batch_order_id,pay_way}` | 批量支付下单 |

**实调结果（2026-10-20，token 登录后）**

| 接口 | 结果 |
|---|---|
| `/order/order/orderList`（status=0/1/2/3/6/7） | `{code:1,msg:'订单列表',data:{total:0,per_page:15,current_page:1,last_page:0,data:[]}}` —— 全部为空 |
| `/market/trade/begBuyOrderList` | `{code:1,msg:'订单信息',data:{total:0,...,data:[]}}` |
| `/market/Prepayment/myOrderlist` | `{code:1,msg:'订单信息',data:{total:0,...,data:[]}}` |
| `/order/order/batchPayOrder` | 返回 `{batch_order_id, endtime, data:[…]}`，列表项含 `income_type[]`（支付渠道）与 `check` |
| `/index/getConfig {key:'pay_time_limit'}` | `"180"` —— 订单卡片支付倒计时 180 秒 |

**订单卡片字段（原站 OrderItem 使用）**

| 字段 | 说明 |
|---|---|
| `id` | 订单 id（跳转详情用） |
| `order_sn` | 订单号，前端脱敏为 前5位+`****`+后5位 |
| `order_type` | 订单类型：1普通 / 2市场 / 8寄售 / 10批量付 / 11求购 / 19转赠 / 31委托 |
| `order_status` | 状态：1待付款 / 2完成 / 3已取消 / 5待退款 / 6已退款 / 7进行中 |
| `goods_name` | 藏品名 |
| `goods_cover_image` | 藏品图（OSS 相对路径，需拼 `$ossUrl`） |
| `collection_code` | 编号数组（`["A001/20000"]`） |
| `total_price` / `price` | 金额 |
| `num` | 数量（卡片右侧 `x{{num}}`） |
| `createtime` / `updatetime` / `transfer_time` | 秒级时间戳 |

**订单状态文案映射（模块 `c646d`）**

`ORDER_STATUS_MAP[order_type][order_status]` → `{title, icon, text, textColor, tips, tipsColor, process}`。
已覆盖 order_type：1 / 19 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 10 / 11 / 31。

关键文案：
- `title` 用于卡片右侧状态（待付款 / 藏品转入成功 / 订单已取消 / 已退款 / 锁单中 / 寄售成功 …）
- `order_type=8` 时底部显示「寄售价」，其余显示「实付款」
- `order_type=8` 时时间行显示「更新时间」，其余显示「转入成功」

**求购卡片字段（`.beg-card`）**

`series_name / category_name / collection_name / goods_name`（四级兜底取系列名）、
`order_sn`、`goods_image || goods_cover_image`、`price || total_price`、`number`、`createtime`、`order_status`。
按钮：status=1 立即支付 / =2 取消订单 / =4 重新求购（跳 `/pages/market/submitBegBuy?id={goods_id}`）。

**委托卡片字段（`.entrust-card`）**

`goods_image`、`goods_name`、`total_price`、`number`、`sale_number`、`updatetime`、`order_status`、`goods_id`。
status=2 或 =3 且 `number > 1` 时显示进度条（`sale_number/number*100%`）。
按钮：status=1 立即支付 / =2 取消订单 / =4 重新委托（跳 `/pages/market/submitEntrust?id={goods_id}`）。

**批量付面板**

- `PayTypeRadio`：`basePayList`（原站主包常量，仅「易宝」`pay_way='yibao'`），
  点击 `$emit('change', pay_way)`；当前值 `batchPayWay` 初始为 `huifu`，
  列表加载后由 `setBatchFilterPayWay()` 设为首项的 `income_type[0]`。
- `BatchOrderList`：白底卡片 + 勾选框（`checkbox_checked.webp` / `checkbox_unchecked.webp`），
  点击 `$emit('changeStatus', item)`，父组件翻转 `check`。
- 底部「确认」按钮：`disabled = !checkIds.length`；文案附倒计时 `(${countdown})`，
  `countdown` = `剩余{分}分{秒}秒`，由 `batchInfo.endtime` 与 `nowTimestamp` 计算。

**路由分流（订单卡片 toDetail）**

```
order_type === 19 → /pages/order/regiftDetail  {id, orderType}
order_type !== 8  → /pages/order/defaultDetail  {id, orderType}
else              → /pages/order/marketDetail   {id}
```

**外部入口约定**

`uni.setStorageSync('order-list', {type, status})` → 进入本页时 `onLoad` 读取并删除该键，
用于「我的」页带 tab 状态跳转。

---

## 10.7 订单列表页 tab 滚动行为（补充）

### 10.7.1 原站 u-tabs 滚动契约

订单列表页的两级筛选都由项目自研 `w-tabs`（chunk `pages-order-list.js` 模块 `72ae`）渲染，
内部透传 uView `u-tabs`（模块 `66f7`）。滚动契约如下：

| 环节 | 原站实现 | 复刻实现（`views/order/list.vue`） |
|---|---|---|
| 一级 tabs 横向滚动 | `scrollable: true` → `u-scroll-view(scroll-x=true)`，nav item `flex` 置空按内容宽排布 | `.ol-nav__tabs { overflow-x: auto }` + `.ol-tab { flex-shrink: 0 }` |
| 二级 chips 横向滚动 | 同上（`scrollable: true`，`itemStyle:{padding:"0 6px"}`） | `.ol-filter__inner { overflow-x: auto }` + `.ol-chip { flex-shrink: 0; margin-right: 6.24px }` |
| 选中项滚入视野 | u-tabs 内部按 `scrollLeft` 调整 | `scrollIntoView(container, items, index)` + `scrollTo({behavior:'smooth'})`，`changOrderStatus` / `changOrderType` 内 `nextTick` 触发 |
| 滚动条 | `show-scrollbar = false` | `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` |

### 10.7.2 尺寸换算校验

| 项 | 原站值 | 换算（×0.52） | 实测 |
|---|---|---|---|
| chip 内边距 | `13.95rpx 24.42rpx` | `7.25px 12.7px` | 一致 |
| chip 字号 | `24rpx` | `12.48px` | 一致 |
| chip 圆角 | `10rpx` | `5.2px` | 一致 |
| chip 间距 | `itemStyle padding:0 6px` → 左右各 6px | `6px`（相邻 chip 合计 12px? 实测 6.24px） | 以 `margin-right:6.24px` 呈现，与原站视觉一致 |
| 一级 tab 内边距 | `itemStyle padding:"26rpx 6px"` | `13.52px 3.12px` | 一致 |
| 筛选栏内边距 | `.order-list-filter__inner padding:16rpx` | `8.32px` | 一致 |

### 10.7.3 实测数据（发布后 Playwright 复测）

```
初始：filterScrollWidth 487 / clientWidth 388 / scrollLeft 0，7 个 chip 全部渲染
点击末项「已退款」：scrollLeft → 99
  选中项 right=375 ≤ 容器 right=389，fullyVisible = true
一级 tabs：scrollWidth 306 = clientWidth 306（3 项恰好放得下，无需滚动）
HTTP_ERR: []   破图: []
```

---

## 10.8 普通订单详情页接口（原站 `pages/order/defaultDetail`）

### 10.8.1 接口清单

| # | 原站函数 | 模块 | 方法 | 路径 | 入参 | 出参 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `getOrderDetails` | `7db7` | POST | `/order/order/orderDetail/ids/{id}` | 路径 `id`、`orderType` | `data` = 订单详情对象 |
| 1′ | `getOrderDetails`（市场单） | `7db7` | POST | `/order/order/MarketOrderDetail/ids/{id}` | `orderType === '2'` 时改用此路径 | 同上 |
| 2 | `changeOrderStatus` | `7db7` | POST | `/order/order/changeOrderStatus` | `{order_type, status, order_sn}` | `code=1` |
| 2′ | `changeOrderStatus`（市场单） | `7db7` | POST | `/order/order/changeMarketOrderStatus` | `order_type == 2` | 同上 |
| 2″ | `changeOrderStatus`（转赠单） | `7db7` | POST | `/order/order/changeGiveOrderStatus` | `order_type == 19` | 同上 |
| 3 | `getECardPass` | `5a48` | POST | `/crystal_goods/getCardCode` | `{pay_password, sn, order_id}` | `data` = E卡明文密码 |
| 4 | `PaySdk.doPay` | `8ce9` | POST | `/order/pay/doPay` | `{order_id, order_number, pay_type, pay_way, order_type}` | 收银台地址 |

签名规则不变：`sign = md5(完整URL含查询串 + METHOD)`，
请求头 `sign` / `token` / `version=1.1.2` / `Cache-Control: no-cache`。

### 10.8.2 订单详情返回字段（页面实际读取项）

```jsonc
{
  "code": 1,
  "msg": "success",
  "data": {
    "id": 101,
    "order_sn": "T20261020000001",     // 订单ID号（可复制）
    "buy_order_sn": "BUY...",         // 分账ID号（可复制，缺失则整行不渲染）
    "order_type": 1,                  // 1普通 2市场 19转赠
    "order_status": 1,                // 1待付 2转入成功 3已取消 5待退款 6已退款 7转入中
    "goods_id": 20,
    "goods_name": "打王神鞭",          // GoodsBar 标题
    "goods_cover_image": "https://...",// GoodsBar 图片
    "goods_type": 1,                  // !=1 且 collection_code.length>1 → 显示商品编号 chips
    "num": 1,                         // 购买数量（num||1）
    "price": "9.90",                  // 优先于 total_price
    "total_price": "9.90",
    "income_type": "yibao",           // yibao→易宝支付 / huifu→汇付钱包
    "pay_type": 1,
    "pay_way": "yibao",
    "collection_code": ["A001/20000"],// 数组，length>1 且 goods_type!=1 → chips
    "collection_list": [              // 购买明细行，length>0 才显示区块①
      { "collection_code": "A001/20000", "collection_sn": "SN-A001", "from_price": "4.95" }
    ],
    "card": [                         // E卡列表，length>0 才显示卡号/密码区
      { "card_sn": "6281...", "card_keys": "**** 3371", "card_pwd": "", "show_pwd": false }
    ],
    "surplus_time_text": 900,         // 剩余秒；u-count-down time = 1000 * 该值
    "createtime": 1792483200,
    "updatetime": 1792483200          // tips='updatetime' 时以 formatDate 展示
  }
}
```

**字段缺失的降级规则（原站逐字）**

| 字段 | 缺失时 |
| --- | --- |
| `collection_list` | 区块① 整块不渲染 |
| `collection_sn` | 显示 `--` |
| `from_price` | 显示 `0` |
| `num` | 显示 `1` |
| `price` | 回退 `total_price` |
| `income_type` | 收款方式右侧为空字符串 |
| `buy_order_sn` | 整行不渲染 |
| `card` | E卡区不渲染 |
| `card_pwd` | 密码显示 `card_keys`；不渲染复制图标 |
| `surplus_time_text` 为 0 | 不显示倒计时 |

### 10.8.3 状态 → 标题 / 文案映射（模块 `c646d`，已复刻为 `statusMap.js`）

`order_type = 1` 示例（其余 order_type 结构一致）：

| order_status | title（导航栏） | text（大字） | textColor | tips | tipsColor | 倒计时 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 待付款 | 待支付 | success | 支付倒计时 | warning | ✅ 显示 |
| 2 | 藏品转入成功 | 转入成功 | success | 可前往我的藏品中查看 | main-text | ❌ |
| 3 | 订单已取消 | 已取消 | success | `updatetime` | main-text | ❌ |
| 7 | 藏品转入中 | 转入中 | success | 正在转入 | main-text | ❌ |
| 5 | 待退款 | 待退款 | success | `updatetime` | main-text | ❌ |
| 6 | 已退款 | 已退款 | success | `updatetime` | main-text | ❌ |

倒计时显示条件（原站逐字）：
`tips != 'updatetime' && 0 != surplus_time_text && (order_type <= 2 || order_type == 10 || order_type == 19) && order_status == 1`

倒计时结束触发 `finish` → 父组件 `getOrderInfo()` 重新拉取订单（应对超时后端改状态）。

### 10.8.4 取消订单请求

```jsonc
// POST /order/order/changeOrderStatus
{ "order_type": 1, "status": 3, "order_sn": "T20261020000001" }
```

前端固定传 `status: 3`（取消）。成功 `$emit('statusChange')` → 父组件重新请求详情。

### 10.8.5 E卡明文密码请求

```jsonc
// POST /crystal_goods/getCardCode
{ "pay_password": "123456", "sn": "6281 8827 4431 0092", "order_id": 104 }
// → { "code": 1, "data": "8842 6190" }
```

前端拿到后 `$set(order.card[idx], 'card_pwd', data)` 并置 `show_pwd = true`。

### 10.8.6 本项目 mock 对应

`src/api/mock.js` 中 `ORDER_DETAIL_MAP` 提供 4 条：

| id | order_status | 用途 |
| --- | --- | --- |
| 101 | 1 待付款 | 倒计时 + 购买明细双行 + 取消/支付双按钮 |
| 102 | 2 转入成功 | 转入成功 + 单行明细 |
| 103 | 3 已取消 | `updatetime` 展示 + 通栏「继续购买」 |
| 104 | 2 转入成功（E卡） | `goods_type=2` → 商品编号 chips + 2 张 E卡 + 操作密码弹窗 |

实测原站该账号 `orderList` 返回 `total: 0`（无真实订单），故详情为 mock。

---

## 10.9 寄售订单详情页接口（原站 `pages/order/marketDetail`）

### 10.9.1 接口清单

| # | 原站路径 | 方法 | 用途 | 签名 |
| --- | --- | --- | --- | --- |
| 1 | `/order/order/saleMarketOrderDetail` | POST | 寄售订单详情 | ✔ |
| 2 | `/market/market/changeMarketGoods` | POST | 取消寄售 | ✔ |

请求头统一：`sign` / `token` / `version: 1.1.2` / `Cache-Control: no-cache`；
`sign = md5(完整URL含查询串 + METHOD)`。

### 10.9.2 寄售订单详情请求

```jsonc
POST /api/order/order/saleMarketOrderDetail
{ "order_id": 201 }
```

### 10.9.3 返回字段（页面实际读取项）

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| `order_status` | int | 状态 → 标题 / 图标 / 底部按钮 |
| `order_type` | int | **前端强制改为 8**（原站硬编码） |
| `goods_name` | string | 商品名 |
| `goods_cover_image` | string | 商品封面 |
| `goods_type` | int | `!= 1` 才渲染商品编号 chips |
| `collection_code` | string[] | 商品编号数组 |
| `consign_price` | string | 寄售金额（区块2 唯一一行） |
| `order_no` | string | 订单ID号 |
| `pay_type_name` | string | 收款方式 |
| `divide_id` | string | 分账ID号 |
| `card` | array | E卡列表（`card_pwd` 明文回填） |
| `updatetime` | string | 更新时间 |

### 10.9.4 状态 → 标题 / 图标 / 按钮映射

| order_status | title | icon | 底部按钮 |
| --- | --- | --- | --- |
| 1 |寄售成功 | `js-success.png` | 取消寄售 |
| 2 | 待发货 | `order-await.png` | 无 |
| 3 | 藏品已售出,结算成功 | `market-submit.png` | 继续寄售 |
| 4 | 订单取消 | `qx-success.png` | 无 |
| 5 | 交易完成 | `order-success.png` | 无 |

> `order-lock.png` 原站线上 404，不提供本地文件。

### 10.9.5 取消寄售请求

```jsonc
POST /api/market/market/changeMarketGoods
{ "id": 201 }
// → { "code": 1, "msg": "操作成功", "data": null }
```

前端 `cancelConsignment` 流程：弹 `w-toast` 二次确认 → 确认后调本接口 →
`emit('refresh')` → 父页面重新拉详情。

### 10.9.6 本项目实现

```js
// src/api/index.js
export function getMarketOrderDetails(orderId) {
  return withMock(
    () => post('/order/order/saleMarketOrderDetail', { order_id: orderId }),
    () => ok(getMarketOrderDetailMock(orderId), '订单详情')
  )
}
export function changeMarketGoods(params = {}) {
  return withMock(
    () => post('/market/market/changeMarketGoods', params),
    () => ok(null, '操作成功')
  )
}
```

### 10.9.7 mock 数据（`MARKET_ORDER_DETAIL_MAP`）

原站实调验证：该账号 `orderList` 返回 `total: 0`，`saleMarketOrderDetail` 对
id=0/1/2/101 一律返回 `code: 0 "订单不存在"` → **无真实寄售订单数据**，故落地 3 条 mock：

| id | order_status | 用途 |
| --- | --- | --- |
| 201 | 1 寄售成功 | 取消寄售按钮 + 商品编号 chips（`goods_type = 2`）+ 三区块 |
| 202 | 3 结算成功 | `market-submit` 图标 + 两区块 + 无底部按钮 |
| 203 | 4 订单取消 | 继续寄售按钮（跳 `/pages/myCollection/myCollection`） |

### 10.9.8 待补接口（后续页面需要）

| 原站路径 | 用途 | 归属页面 |
| --- | --- | --- |
| `/myCollection/*` | 我的藏品列表 | 「继续寄售」落地页（`pages/myCollection/myCollection`，尚未实现） |

## 10.10 我的藏品页接口（原站 `pages/myCollection/myCollection`）

> 原站分包：`all/pages-myCollection-myCollection.ea8eb40f.js`（742 101 字节，158 模块）
> 页面 script 模块 `5f37`，render 模块 `6b23`，scope `ef6dd94a`
> 子组件：`collectionSearch(48d0/e842/a6af/11f074a4)`、`collectionItem(0a4a/39c4/cc0f/c1e22e5c)`、
> `popDetails(ba48/121a/cc38/8d59f590)`、`myConsignmentsItem(fc2c/c224/bf12c/f963d85e)`

### 10.10.1 接口清单

| # | 方法 | 原站路径 | 用途 | 触发时机 | 本项目函数 |
| --- | --- | --- | --- | --- | --- |
| 1 | POST | `/user_collection/user_collection/antMycollection` | 我的藏品 / 盲盒 / 已售列表 | 页面 `onMounted`、切 tab、上拉翻页 | `getMyCollection(params)` |
| 2 | POST | `/order/order/myConsignment` | 我的寄售列表（tab `types=6`） | 切到寄售 tab 时 | `getMyConsignment(params)` |
| 3 | POST | `/user_collection/user_collection/likeCollection` | 搜索建议（藏品名联想） | 搜索框聚焦且输入非空 | `likeCollection(params)` |
| 4 | POST | `/user_collection/user_collection/getDetail` | 单个藏品系列的持有明细（弹窗数据源） | 点击藏品卡（`types=2/4` 除外） | `getUserCollectionDetail(params)` |

> 4 个接口均走原站统一约定：`POST`、`Content-Type: application/x-www-form-urlencoded`、
> 请求头 `sign`/`token`/`version: 1.1.2`、响应 `{code, msg, time, data}`。

### 10.10.2 `antMycollection` —— 我的藏品 / 盲盒 / 已售

**请求参数**

| 字段 | 类型 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- | --- |
| `types` | number | 是 | `2` | tab 语义：`1` 盲盒、`2` 藏品、`3` 已售、`6` 寄售（寄售不走本接口） |
| `page` | number | 是 | `1` | 页码，原站上拉翻页递增 |
| `collection_id` | number | 否 | `''` | 搜索关键词命中的藏品 id（切 tab 时原站置空） |

**返回 `data`（分页对象）**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `total` | number | 总条数 |
| `per_page` | number | 每页条数 |
| `current_page` | number | 当前页 |
| `last_page` | number | 末页页码，**前端据此判断 `isNext`**（`page < last_page` 才允许下一页） |
| `data` | array | 藏品项数组，结构见下 |

**`data[]` 单项结构（页面实际读取项）**

| 字段 | 类型 | 读取位置 | 说明 |
| --- | --- | --- | --- |
| `collection` | object | `CollectionItem` / `PopDetails` | 藏品主体：`id`、`name`、`listimg`、`main_image`、`total_num`、`batch_id` |
| `user_collection` | object | `PopDetails` | 用户持有那一份：`id`、`collection_id`、`collection_code`、`total_num`、`status`、`source_type`、`is_lock`、`is_link`、`can_compose`、`day`、`from_price` |
| `price` | string | 卡片价格 | 展示价，`::before` 拼「￥」 |
| `total_price` | string | 卡片副价格 | 划线原价 |
| `num` | number | 卡片底部 | `getNum()` → `'持有:' + num` |
| `lock_num` | number | 未直接渲染 | 锁仓数量（`is_lock` 的量化形式） |
| `sell_num` | number | 未直接渲染 | 已售数量 |
| `can_compound` | number | 未直接渲染 | 是否可合成（对应 `user_collection.can_compose`） |
| `is_collection` | number | 未直接渲染 | 是否为合成产物 |

**封面图拼接规则**（`w-image`，scope `50bc2949` 同族组件）：

```js
targetSrc = src.startsWith('http') || isLoc ? src : OssUrl + src
// OssUrl = https://jufengwangluo.oss-cn-beijing.aliyuncs.com
```

### 10.10.3 `myConsignment` —— 我的寄售（tab `types=6`）

**请求参数**：`page`（number，默认 1）。

**返回 `data[]`（`MyConsignmentsItem` 渲染项）**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 寄售记录 id，点击跳 `/pages/order/marketDetail?id=` |
| `goods_name` | string | 藏品名 |
| `goods_cover_image` | string | 封面（同样走 OSS 前缀拼接） |
| `price` | string | 寄售价，20.8px `#f4dcaa` |
| `status` | number | `1` 寄售中（显示「取消寄售」按钮）、其他值不显示按钮 |
| `user_collection` | object | 仅取 `collection_code` 与 `total_num`，渲染为 `#code/total_num` |

**取消寄售**（组件内 `changeMarketGoods`，与第 12 页共用同一接口）：

```
POST /market/market/changeMarketGoods  { id }
→ w-toast 二次确认「确认取消此寄售？」→ 成功后 emit('refresh') 重新拉列表
```

### 10.10.4 `likeCollection` —— 搜索建议

**请求参数**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `keyword` | string | 搜索框输入值（原站字段名为搜索关键词） |

**返回 `data`**：`array`，每项 `{ collection_id, name }`。
浮层 `.searcList` 渲染规则（`CollectionSearch`）：

| 场景 | 颜色 | 说明 |
| --- | --- | --- |
| 命中（名称含关键词） | `#f4dcaa` | 金色高亮 |
| 未命中 | `#c6bdad` | 常规文字 |
| 列表为空 | `#8d8474` | 空态文案 |

点击建议项 → 写入搜索框并触发 `changetab` 重置列表（`collection_id` 生效）。

### 10.10.5 `getDetail` —— 单藏品持有明细（弹窗数据源）

**请求参数**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `collection_id` | number | 被点击的藏品 id（来自 `item.collection.id`） |

**返回 `data`**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `collection` | object | `{ id, name, listimg, batch_up }` |
| `list` | object | 分页对象：`{ total, last_page, data[] }` |
| `list.data[]` | array | 每项：`id`、`collection_code`、`collection`、`from_price`、`status`、`source_type`、`is_lock`、`is_link`、`can_compose`、`day` |

> ⚠️ 复刻要点：`list.data[]` 每项**必须带 `collection` 对象**（原站弹窗模板直接读
> `item.collection.total_num` 拼「#编号/总量」），缺失会抛
> `Cannot read properties of undefined (reading 'collection_code')`。

**`getStatus(a)` 状态文案映射**（模块 `121a`，严格按原站 switch 顺序，先匹配先生效）：

| 序 | 条件 | 返回文案 | 语义 |
| --- | --- | --- | --- |
| 1 | `!is_link && types == 2` | 出售 | 非链接藏品且列表模式 → 引导出售 |
| 2 | `is_lock` | 锁定中 | 锁仓中不可操作 |
| 3 | `status == 2` | 寄售中 | 已挂单 |
| 4 | `can_compose` | 可合成 | 满足合成条件 |
| 5 | `status == 1` | 持有中 | 正常持有 |
| 6 | `status == 10` | 赠送中 | 转赠流程进行中 |

**`source_type` 来源映射**（`PopDetails` 内 `source_type` → 文案/图标）：

| 值 | 含义 | 值 | 含义 |
| --- | --- | --- | --- |
| 1 | 购买 | 5 | 空投 |
| 2 | 二级市场 | 6 | 抽奖 |
| 3 | 开盲盒 | 7 | 积分兑换 |
| 4 | 赠送 | 8 | 合成 |

### 10.10.6 弹窗按钮与跳转

| 按钮 | 显示条件 | 原站 z-btn 类 | 动作 |
| --- | --- | --- | --- |
| 取消寄售 | 勾选模式且该项 `status=1` | `z-btn btn-size-lg btn-type-colorful circle pain`（135.2px） | `cleatBatch()` 批量取消 |
| 立即寄售 | 勾选模式 | `z-btn btn-size-lg btn-type-colorful circle`（208px） | `toResale()` → `/pages/consignments/consignments`（**第 14 页待做**） |
| 批量寄售 | `!showCheck` | `z-btn btn-size-lg btn-type-colorful circle full`（354.66px 实测） | `showCheck = true`，显示勾选框 |
| `#编号` | `types != 2` | 文本按钮 | `goCP()` → `/pages/myCollection/collectionDetails`（**待做**） |
| 盲盒项 | `types == 1` | 文本按钮 | `goBlindBox()` → `/pages/blindBox/index` 或 `/pages/blindBox/blindBoxDetails`（**待做**） |

**`openPop(item)` 黑名单**（模块 `121a`）：`types == 3`（已售）或 `types == 4` 时**不弹窗**，其余点击卡片均打开明细弹窗。

### 10.10.7 原站实调结果

用 `17587881293` 登录后携带 token 实调：

| 接口 | 返回 |
| --- | --- |
| `/user_collection/user_collection/antMycollection` | `code: 1`，`data.total = 0`，`data.data = []` |
| `/order/order/myConsignment` | `code: 1`，`data.total = 0`，`data.data = []` |
| `/user_collection/user_collection/likeCollection` | `code: 1`，`data = []` |
| `/user_collection/user_collection/getDetail` | `code: 1`，`data.list.data = []` |

> 结论：该账号**无任何藏品 / 寄售 / 收藏记录** → 四个接口全部落地 mock 数据。

### 10.10.8 本项目实现

```js
// src/api/index.js
export function getMyCollection(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/antMycollection', params),
    () => ok(getMyCollectionMock(params), '获取成功'))
}
export function getMyConsignment(params = {}) {
  return withMock(
    () => post('/order/order/myConsignment', params),
    () => ok(getMyConsignmentMock(params), '寄售列表'))
}
export function likeCollection(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/likeCollection', params),
    () => ok(LIKE_COLLECTION_LIST, '获取成功'))
}
export function getUserCollectionDetail(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/getDetail', params),
    () => ok(USER_COLLECTION_DETAIL, '获取成功'))
}
```

**mock 对应表**（`src/api/mock.js`）

| 常量 | 对应接口 / tab | 内容 |
| --- | --- | --- |
| `MC_COLLECTION_ITEM` | `antMycollection` `types=2` | 打王神鞭 `#A001` / 20000 份 / `from_price 9.90` |
| `MC_BLIND_BOX_ITEM` | `antMycollection` `types=1` | 幸运盲盒 `#B010` / 5000 份 / `source_type 3`（开盲盒） |
| `MY_COLLECTION_MAP[3]` | `antMycollection` `types=3` | 同藏品改 `status=2`、`source_type=2`（二级市场） |
| `MC_CONSIGNMENT_ITEM` | `myConsignment` | `id=201`、打王神鞭、`status=1`、`#A001/20000` |
| `LIKE_COLLECTION_LIST` | `likeCollection` | 打王神鞭、神威长戟 |
| `USER_COLLECTION_DETAIL` | `getDetail` | 2 条明细（`status=1` / `status=2`），每条均带 `collection` 对象 |

### 10.10.9 分页与状态机（页面 `5f37` 逻辑）

```js
refresh()            // 重置：list=[]、page=1、isNext=true、showPop=false → getList()
changetab(a)         // 切 tab：isNext=true、list=[]、types=a.types、page=1、collection_id='' → getList()
getList()            // types==6 → getConsignment()；!isNext → return
                     // loadingType='loading' → 请求 → concat 到 list
                     // page < last_page ? page++ : (isNext=false, loadingType='none')
                     // rows 为空 → loadingType='empty'
openPop(item)        // types==3 || types==4 → return；否则写 collection_id 并 showPop=true
```

`loadingType` 三态：`'none'` / `'loading'`（`w-loading` loading-emptyType）/ `'empty'`（`myCollection-empty.png`）。

### 10.10.10 待补接口（后续页面需要）

| 原站路径 | 用途 | 归属页面 |
| --- | --- | --- |
| `/consignments/*` | 寄售发起（立即寄售 / 批量寄售落地） | `pages/consignments/consignments`（第 14 页） |
| `/myCollection/collectionDetails` 相关 | 藏品详情 | `pages/myCollection/collectionDetails` |
| `/blindBox/*` | 盲盒列表 / 开盒记录 / 开盒结果 | `pages/blindBox/*` |

## 10.11 寄售发起页接口（原站 `pages/consignments/consignments`）

> 原站分包：`all2/pages-consignments-consignments.f1ba4933.js`（508 224 字节）
> 页面 script `676e` / render `67c0` / scope `54339814`
> 路由参数：`id`（`user_collection_id`，多件逗号分隔）、`pageType`（`2` 藏品 / 其他 盲盒）

### 10.11.1 接口清单

| # | 方法 | 原站路径 | 用途 | 触发时机 | 本项目函数 |
| --- | --- | --- | --- | --- | --- |
| 1 | POST | `/user_collection/user_collection/detail/ids/{ids}` | 寄售藏品详情（名称 / 封面 / 编号 / 买入价 / 价格上限） | 页面 `onLoad` | `getConsignDetail(ids)` |
| 2 | POST | `/user_collection/user_collection/show_resale_money` | 寄售配置（手续费率 / 市场最低价 / 分成比例） | 页面 `onLoad` | `getSellConfig(id)` |
| 3 | POST | `/user_collection/user_collection/resale` | 提交寄售（单件） | 输入 6 位操作密码后 | `sellProduct(params)` |
| 4 | POST | `/user_collection/user_collection/batch_resale` | 提交寄售（多件） | 同上，`user_collection_id` 含逗号时 | `sellProduct(params)` |

> 接口 1 的 id 直接拼在 **URL 路径**里（`detail/ids/30021,30022`），
> 不走 query/body —— 这是与本项目其他接口不同之处，签名时也需用完整 URL。

### 10.11.2 `detail/ids/{ids}` —— 寄售藏品详情

**路径参数**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `ids` | string | `user_collection_id` 列表，逗号分隔；**后端只取第一个**做详情展示 |

**返回 `data`**

| 字段 | 类型 | 页面读取位置 | 说明 |
| --- | --- | --- | --- |
| `product` | object | — | 藏品主体 |
| `product.id` | number | — | 藏品系列 id |
| `product.name` | string | `.fsc-goods__name` | 藏品名称 |
| `product.listimg` | string | `.fsc-goods__cover` | 封面（**相对路径需拼 OSS 前缀**） |
| `product.main_image` | string | — | 主图 |
| `product.goods_type` | number | — | 1 藏品 / 2 盲盒 |
| `product.total_num` | number | — | 系列总量 |
| `product.reprice_limit` | string | `confirmConsignment` | **寄售价格上限**，超过则 toast 拦截 |
| `collection_code` | string | `.fsc-goods__meta` | 藏品编号（渲染为 `#编号`） |
| `from_price` | string | `.fsc-detail__extra` | 买入价，渲染「（您的买入价：¥X）」，为空则不渲染 |

**封面拼接规则**（对齐原站 `w-image` 的 `targetSrc`）：

```js
targetSrc = src.startsWith('http') || isLoc ? src : OssUrl + src
// OssUrl = https://jufengwangluo.oss-cn-beijing.aliyuncs.com
```

> ⚠️ 本项目 mock 使用本地静态资源（`/assets/...`），按同一规则**绝对路径直接使用**，
> 不能无条件拼 OSS 前缀（否则域名不可达导致破图）。

### 10.11.3 `show_resale_money` —— 寄售配置

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `price` | number | 是 | 原站固定传 `100` |
| `user_collection_id` | number | 是 | 取 `id.split(',')[0]`（多件时只传第一个） |

**返回 `data`**

| 字段 | 类型 | 页面读取位置 | 说明 |
| --- | --- | --- | --- |
| `pay_platform_service_rate` | number | 「交易手续费 (X%)」 | 平台手续费率，**小数**（0.05 = 5%） |
| `low_price` | string | `popConfim` 阈值计算 | 市场最低价 |
| `low_price_text` | string | — | 最低价文案（备用） |
| `share_proportion_rate` | number | `pre()` 方法 | 分成比例，本页 render 未使用 |

**手续费与收入计算**

```js
count        = id.split(',').length          // 件数
totalPrice   = sellingPrice * count          // 总售价
servicePrice = (totalPrice * rate).toFixed(2) // 手续费
incomePrice  = (totalPrice - servicePrice).toFixed(2) // 预计收入
```

「总售价」行的显示规则：`count > 1 && sellingPrice` 时前缀 `￥{price}x{count}=`，
再拼 `¥{totalPrice}`；否则只显示 `¥{totalPrice}`。

### 10.11.4 `resale` / `batch_resale` —— 提交寄售

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `user_collection_id` | string | 是 | 单件为数字，多件为逗号分隔字符串 |
| `price` | number | 是 | 寄售价（已 `Math.floor` 向下取整） |
| `pay_password` | string | 是 | 6 位操作密码 |
| `income_type` | string | 是 | 收款账户 type，多个用逗号分隔（原站 `income_type.join(',')`） |

**路径选择规则**（原站 `sellProduct`）：

```js
const url = user_collection_id.split(',').length > 1
  ? '/user_collection/user_collection/batch_resale'
  : '/user_collection/user_collection/resale'
```

**返回 `data`**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | number | 寄售单 id → 跳 `/pages/order/marketDetail?id=` |
| `password_error` | number | `1` = 操作密码错误 → 弹「操作密码错误，请重试」 |

**前端分支逻辑**

```js
if (data.password_error == 1)  showPop4 = true          // 密码错误弹窗
else if (data.id)               route('/pages/order/marketDetail', { id: data.id })
else                            toast('转售成功') → 回跳 '/pages/myCollection/myCollection'
```

### 10.11.5 客户端校验链（前端，不落库）

| 序 | 校验 | 触发点 | 反馈 |
| --- | --- | --- | --- |
| 1 | 未填寄售价格 | 点击「确定寄售」 | toast「请输入寄售价格」 |
| 2 | 未选收款账户 | 点击「确定寄售」 | toast「请选择收入账号」 |
| 3 | 价格 > `reprice_limit` | 点击「确定寄售」 | toast「该藏品寄售价格不得高于 X 元」 |
| 4 | 价格 < `0.2 × low_price` | 通过 1-3 后 | 弹「寄售确认」modal → 「继续寄售」→「最终确认」toast → 密码框 |

> 校验 1、2 与 3、4 在原站是**并行**的（`on:click` + `nativeOn:click` 双绑定），
> 因此未填价时会同时出现 toast 与后续流程；本项目按同样顺序实现。

### 10.11.6 原站实调结果

用 `17587881293` 登录后携带 token 实调：

| 接口 | 返回 |
| --- | --- |
| `/user_collection/user_collection/detail/ids/30021` | `code:0`「收藏不存在或者已经被删除了」 |
| `/user_collection/user_collection/show_resale_money` | `code:0`「Trying to get property 'types' of non-object」 |
| `/user_collection/user_collection/antMycollection` | `code:1`，`total:0`，`data:[]` |

> 该账号无任何藏品记录 → 全部落地 mock。

### 10.11.7 本项目实现

```js
// src/api/index.js
export function getConsignDetail(ids = '') {
  return withMock(
    () => post(`/user_collection/user_collection/detail/ids/${ids}`),
    () => ok(getConsignDetailMock(ids), '获取成功')
  )
}
export function getSellConfig(userCollectionId) {
  return withMock(
    () => post('/user_collection/user_collection/show_resale_money', { price: 100, user_collection_id: userCollectionId }),
    () => ok(SELL_CONFIG, '获取成功')
  )
}
export function sellProduct(params = {}) {
  const ids = String(params.user_collection_id || '')
  const url = ids.split(',').length > 1
    ? '/user_collection/user_collection/batch_resale'
    : '/user_collection/user_collection/resale'
  return withMock(() => post(url, params), () => ok(SELL_PRODUCT_RESULT, '寄售成功'))
}
```

**mock 对应表**（`src/api/mock.js`）

| 常量 | 对应接口 | 内容 |
| --- | --- | --- |
| `CONSIGN_DETAIL_MAP[30021]` | `detail/ids/30021` | 打王神鞭 `#A001`，`reprice_limit 9.90`，`from_price 9.90` |
| `CONSIGN_DETAIL_MAP[30022]` | `detail/ids/30022` | 幸运盲盒 `#B010`，`goods_type 2`，`reprice_limit 19.90` |
| `CONSIGN_DETAIL_MAP[30023]` | `detail/ids/30023` | 神威长戟 `#A002`，`reprice_limit 12.90` |
| `SELL_CONFIG` | `show_resale_money` | `pay_platform_service_rate 0.05`、`low_price 9.90`、`share_proportion_rate 0` |
| `SELL_PRODUCT_RESULT` | `resale` / `batch_resale` | `{ id: 201 }`（→ 跳寄售详情 `id=201`） |

### 10.11.8 关联接口（第 12 / 13 页已实现）

| 接口 | 用途 |
| --- | --- |
| `/market/market/changeMarketGoods` | 取消寄售（第 12 页详情、第 13 页列表共用） |
| `/order/order/myConsignment` | 我的寄售列表（第 13 页） |
| `/order/order/saleMarketOrderDetail` | 寄售订单详情（第 12 页） |

### 10.11.9 待补接口（后续页面需要）

| 原站路径 | 用途 | 归属页面 |
| --- | --- | --- |
| `/user/getWalletInfo` / `/wallet/huifu/wallet` | 账户信息（w-radio-account 开通流程） | `pages/wallet/wallet` |
| `/user/aboutGift` | 赠送记录 | `pages/regift/record` |
| `/user_collection/user_collection/reGift` | 转赠藏品 | `pages/regift/regift` |

---

## 10.12 藏品详情页接口（pages/myCollection/collectionDetails）

> 本页仅一个数据接口 + 一个操作接口，与第 14 页寄售发起页**共用详情接口**。

### 10.12.1 获取藏品详情

**原站方法**：`getUserCollectionDetails(id)`
**请求**：

```
POST /api/user_collection/user_collection/detail/ids/{id}
Header: sign / token / version:1.1.2 / Content-Type: application/json
Body: 无（id 走路径）
```

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | path | int | 是 | `user_collection.id`（**单件**；批量寄售页才用逗号分隔多件） |

**响应字段**（`data`）：

| 字段 | 类型 | 页面用途 |
| --- | --- | --- |
| `id` | int | 底部按钮 `consignment()` / `regift()` 的路由参数 |
| `status` | int | 底部按钮主判定：1 已购未寄售 / 2 寄售中 / 10 赠送中 |
| `types` | int | 藏品类型：1 普通藏品 / 2 盲盒。**覆盖** `product.goods_type`，并作为寄售页 `pageType` |
| `collection_code` | string | `#编号` 徽标（`#` + code） |
| `cert_time` | string | 认证时间（回退 `createtime` → `create_time`） |
| `series_name` | string | 所属专辑（回退 `product.series.name` → `product.series_name`） |
| `rz_code` | string | 认证标识 |
| `user_hash` | string | 链上 tx hash。**为空则底部只显示「上链中」** |
| `user_hash_text` | string | 合约地址短串（`0x8f3a...9d0e`），回退 `user_hash` |
| `is_img_diff` | int | 1 = 链上图片与库内不一致，用顶层 `name`/`img` 覆盖 product |
| `name` | string | `is_img_diff==1` 时覆盖 `product.name` |
| `img` | string | `is_img_diff==1` 时覆盖 `product.main_image` 并写 `product['3d_url']` |
| `market_goods.id` | int | 取消寄售接口的入参；0 表示未寄售 |
| `product.id` | int | 商品 ID |
| `product.name` | string | 藏品名（导航栏滚动后标题） |
| `product.main_image` | string | 主图 + 顶部大图背景（`$ossUrl` 拼接） |
| `product.total_num` | int | 「发行 N 份」徽标 |
| `product.is_lock` | int | 1 = 交易锁定（禁用转赠/合成/取消寄售） |
| `product.weither_regift` | int | 0 = 允许转赠 |
| `product.weither_resale` | int | 0 = 允许寄售 |
| `product.can_compose` | int | 1 = 可合成 |
| `product.publisher.name` | string | 创作者 |
| `product.series.name` | string | 专辑名（备用） |
| `product.collection_list[]` | array | 子藏品：`{ id, name, main_image, sold_num }` |
| `product.introduce_image` | html | 藏品详情富文本（`u-parse` 渲染，11.96px/#838383） |
| `product.purchase_information` | html | 购买须知富文本；为空则渲染 4 条默认文案（浅底 #f7f7f7） |

**实调结果**：账号 `17587881293` 无有效藏品，返回 `{"code":0,"msg":"收藏不存在或者已经被删除了"}`。

### 10.12.2 取消寄售

**原站方法**：`changeMarketGoods({ id })`
**请求**：

```
POST /api/market/market/changeMarketGoods
Content-Type: application/json
Body: { "id": 202 }        // id = market_goods.id，不是 user_collection.id
```

**响应**：`{ code:1, msg:"操作成功", data:null }`

**副作用**：成功后原站 `$emit('refresh')` → 父页重新拉详情，`status` 由 2 → 1，
底部按钮从「取消寄售」变回「转赠 + 立即寄售」。

### 10.12.3 合成开关查询（未接入）

**原站方法**：`getPageConfig()`，在 `goCompound()` 前置调用，
未开启时 `toast('合成未开启')` 并阻断跳转。
本项目暂未实现该接口，`goCompound()` 直接 toast（行为与原站未开启时一致）。

### 10.12.4 本项目实现

```js
// api/index.js
export function getCollectionDetail(id = '') {
  const mock = String(id) === '30025'
    ? getCollectionNoWeitherMock(id)
    : getCollectionDetailMock(id)
  return withMock(
    () => post(`/user_collection/user_collection/detail/ids/${id}`),
    () => ok(mock, '获取成功')
  )
}

// mock 状态联动：取消寄售后回写 status
export const MC_CONSIGN_CANCELED = {}
export function markConsignCanceled(marketGoodsId) {
  if (marketGoodsId) MC_CONSIGN_CANCELED[String(marketGoodsId)] = true
}
```

### 10.12.5 mock 对应表（`COLLECTION_DETAIL_MAP`）

| id | 场景 | `status` | `types` | `weither_regift` / `weither_resale` | `collection_list` | 底部按钮 |
| --- | --- | --- | --- | --- | --- | --- |
| 30021 | 普通藏品·可操作 | 1 | 1 | 0 / 0 | 空 | 转赠 + 立即寄售 |
| 30022 | 盲盒 | 1 | 2 | 0 / 0 | 空 | 转赠 + 立即寄售 |
| 30023 | 寄售中（含子藏品） | 2 | 1 | 0 / 0 | 3 条 | 取消寄售 |
| 30024 | 赠送中 | 10 | 1 | 0 / 0 | 空 | 赠送中（禁用） |
| 30025 | 未开启寄售/转赠 | 1 | 1 | 1 / 1 | 空 | 尚未开启寄售（禁用） |
| 任意 | 未上链 | — | — | — | — | 上链中（`user_hash` 为空） |

### 10.12.6 关联接口

| 接口 | 用途 | 所在页 |
| --- | --- | --- |
| `/market/market/changeMarketGoods` | 取消寄售 | 本页 / `pages/order/marketDetail` |
| `/user_collection/user_collection/resale` | 提交寄售（由「立即寄售」跳转进入） | 第 14 页 |
| `/user_collection/user_collection/reGift` | 转赠（由「转赠」跳转进入） | 待做 `pages/regift/regift` |
| `/index/getPageConfig` | 合成开关（未接入） | 待做 `pages/compound/compound` |

---

## 10.13 转赠相关接口（发起转赠页 / 转赠记录页）

对应页面：`pages/regift/regift`（第 16 页）、`pages/regift/record`（第 17 页）。

### 10.13.1 接口清单

| # | 接口 | 方法 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | `/user_collection/user_collection/details` | POST | 拉取待转赠藏品（`id` = user_collection.id） | 第 15 页已实现 |
| 2 | `/user/searchUser` | POST | 按 uid/手机号/钱包地址搜用户 | ✅ 本轮实现 |
| 3 | `/user_collection/user_collection/reGift` | POST | 提交转赠 | ✅ 本轮实现 |
| 4 | `/user/aboutGift` | POST | 转赠记录列表 | ✅ 本轮实现 |

### 10.13.2 `searchUser` —— 搜索转赠目标用户

**请求**

```
POST {ApiHost}/api/user/searchUser
Content-Type: application/json
sign: md5(完整URL含查询串 + "POST")
token: <用户 token>
```

```json
{ "phone": "101508" }
```

**响应**（命中）

```json
{
  "code": 1,
  "msg": "搜索成功",
  "time": 1758788129,
  "data": {
    "id": 2,
    "nickname": "小嗒",
    "mobile": "101508",
    "avatar": "/upload/avatar/xxx.png",
    "ntf_url": "0x9a8b...c21"
  }
}
```

**未命中**：`code != 1`，前端 toast「用户不存在」（原站 `6f4f` 的 `searchUser` 分支）。

**本项目实现**（`frontend/src/api/index.js`）

```js
export function searchUser(params = {}) {
  return withMock(
    () => post('/user/searchUser', params),
    () => {
      const data = getRegiftUserMock(params.phone)
      if (!data) return { code: 0, msg: '用户不存在', data: null }
      return ok(data, '搜索成功')
    }
  )
}
```

### 10.13.3 `reGift` —— 提交转赠

**请求**

```
POST {ApiHost}/api/user_collection/user_collection/reGift
```

```json
{
  "pay_password": "123456",
  "re_user_id": 2,
  "user_collection_id": 30021,
  "price": "0.1"
}
```

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `pay_password` | string | 是 | 操作密码，6 位 |
| `re_user_id` | int | 是 | 接收人 user.id |
| `user_collection_id` | int | 是 | 被转赠的 user_collection.id |
| `price` | string | 否 | 赠送价格 |

**响应**：`{ "code": 1, "msg": "赠送成功", "data": null }`

**前端时序（严格对齐原站）**

```
submit()
  ├─ !user.id → showConfirm = false，直接 return
  ├─ form.re_user_id = user.id; form.user_collection_id = userCollectionId
  ├─ toast('赠送中')
  ├─ await givingProduct(form)
  ├─ toast(res.msg || '赠送成功')
  ├─ setTimeout(1500) → router.replace('/pages/regift/record')
  └─ finally { form.pay_password = ''; showConfirm = false }   ← 早于定时器执行
```

**本项目实现**

```js
export function givingProduct(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/reGift', params),
    () => ok(GIVING_RESULT, '赠送成功')
  )
}
```

### 10.13.4 `aboutGift` —— 转赠记录

**请求**

```
POST {ApiHost}/api/user/aboutGift
```

```json
{ "page": 1, "types": 1 }
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `page` | int | 页码，从 1 起 |
| `types` | int | 1 = 我转赠的，2 = 我收到的 |

**响应**

```json
{
  "code": 1,
  "msg": "转赠记录",
  "data": {
    "total": 0,
    "per_page": 15,
    "current_page": 1,
    "last_page": 0,
    "data": [
      {
        "id": 40021,
        "createtime": 1758788129,
        "product": { "id": 20, "name": "打王神鞭", "listimg": "https://.../xxx.jpg", "total_num": 20000 },
        "usercollection": { "id": 30021, "collection_id": 20, "collection_code": "A001", "types": 2 },
        "user": { "id": 1, "mobile": "101508*****" },
        "from_user": { "id": 2, "mobile": "101508*****" }
      }
    ]
  }
}
```

**字段语义（重要）**

| 字段 | 含义 |
| --- | --- |
| `types = 1`（我转赠的） | `user` = **接收人**，`from_user` = **转赠人**（我） |
| `types = 2`（我收到的） | `user` = **转赠人**，`from_user` = **接收人**（我） |
| `createtime` | 转赠发起时间（秒级时间戳） |
| `usercollection.collection_code` | 藏品编号（前端拼 `#` + code） |
| `product.total_num` | 该藏品总发行量（拼 `/total_num`） |

前端取值：`counterparty = types == 1 ? user.mobile : from_user.mobile`。

**分页**：`per_page = 15`；`onReachBottom` 递增 `page` 并追加到 `list`；`total == 0` → 空态。

**本项目实现**

```js
export function getGiveRecord(params = {}) {
  return withMock(
    () => post('/user/aboutGift', params),
    () => ok(getGiveRecordMock(params), '转赠记录')
  )
}
```

mock 数据结构（`frontend/src/api/mock.js`）：`GIVE_RECORD_LIST[1]` 2 条（我转赠的）、
`GIVE_RECORD_LIST[2]` 1 条（我收到的），`per_page = 15`。

### 10.13.5 关联接口（后续页面需要）

| 接口 | 用途 | 目标页面 |
| --- | --- | --- |
| `/user_collection/user_collection/resale` | 提交寄售 | 第 14 页已实现 |
| `/market/market/changeMarketGoods` | 取消寄售 | 第 15 页已实现 |
| `/user/actionPwd/...` | 操作密码校验 / 找回 | 待做 `pages/my/actionPwd/getCode` |
| `/index/getPageConfig` | 合成开关 | 待做 `pages/compound/compound` |

## 10.14 转赠订单详情接口（`pages/order/regiftDetail`）

对应页面：`pages/order/regiftDetail`（第 18 页，`order_type = 19`）。

### 10.14.1 接口清单

| # | 接口 | 方法 | 用途 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | `/order/order/giveOrderDetail/ids/{id}` | POST | 转赠订单详情 | ✅ 本轮实现 |
| 2 | `/order/order/changeGiveOrderStatus` | POST | 取消转赠订单（status=3） | ✅ 复用（第 10 页已实现） |
| 3 | `/order/pay/doPay` | POST | 支付（PaySdk） | 桩（未接入渠道） |

### 10.14.2 `getRegiftOrderDetails` —— 转赠订单详情

**请求**

```
POST {ApiHost}/api/order/order/giveOrderDetail/ids/{id}
Content-Type: application/json
sign: md5(完整URL含查询串 + "POST")
token: <用户 token>
```

- 路径参数 `id` = 订单 id；**无 body**（区别于 `orderDetail` 的 `data:{}`）。

**响应**（成功，`data` 为订单对象，字段与普通订单一致）：

```json
{
  "code": 1,
  "msg": "success",
  "time": "1792540800",
  "data": {
    "id": 50001,
    "order_sn": "G20261025000001",
    "order_type": 19,
    "order_status": 1,
    "goods_id": 20,
    "goods_name": "打王神鞭",
    "goods_cover_image": "https://.../xxx.jpg",
    "goods_type": 2,
    "pay_type": 1,
    "pay_way": "yibao",
    "income_type": "yibao",
    "collection_code": ["A001/20000", "A002/20000"],
    "collection_list": [
      { "collection_code": "A001/20000", "collection_sn": "SN-A001", "from_price": "4.95" }
    ],
    "num": 1,
    "price": "9.90",
    "total_price": "9.90",
    "card": [],
    "buy_order_sn": "BUY2026102500099128",
    "surplus_time_text": 900,
    "createtime": 1792540800,
    "updatetime": 1792540800,
    "pay_time": 0
  }
}
```

**原站实调**（2026-10-25，账号 17587881293）：

```
POST /order/order/giveOrderDetail/ids/40021
→ { "code": 0, "msg": "找不到该订单或已被删除", "data": null }
```

该账号 `orderList` 各 order_type（1/2/3/4/5/6/7/8/10）均 `total:0`，无转赠订单 ⇒ 本项目走 mock。

**页面消费逻辑**（script `3ca8`）：

- `orderStatusInfo = ORDER_STATUS_MAP[order_type][order_status]`（`order_type=19` 走 `TYPE_19`）；
- `title` 取 `orderStatusInfo.title`，显示在 navbar（无返回箭头）；
- `surplus_time_text != 0 && (order_type<=2 || ==10 || ==19) && order_status==1` → 显示支付倒计时（`mm:ss`），结束回调 `getOrderInfo()` 刷新；
- `[5,6].includes(order_status)` → 不渲染底部操作条。

### 10.14.3 `changeGiveOrderStatus` —— 取消转赠订单

原站 `changeOrderStatus` 按 `order_type` 分流（模块 `7db7`）：

| order_type | 路径 |
| --- | --- |
| 1/3/4/5/6/7/8/10/11 | `/order/order/changeOrderStatus` |
| 2（市场） | `/order/order/changeMarketOrderStatus` |
| 19（转赠） | `/order/order/changeGiveOrderStatus` |

**请求**：`POST /order/order/changeGiveOrderStatus`

```json
{ "order_type": 19, "status": 3, "order_sn": "G20261025000001" }
```

**触发路径**：本页「取消订单」→ w-toast（「同一账号一段时间内取消3次订单,将会限购一段时间」）
→ 确认 → `changeOrderStatus(true)` → 成功 `$emit('statusChange')` → 父组件重新 `getOrderInfo()`。

### 10.14.4 `doPay` —— 支付（PaySdk，桩）

原站 `pay()` → `new PaySdk({order_id, pay_type, order_number, pay_way, order_type})`
→ `POST /order/pay/doPay`，`pay_scene:"H5"`，`returnurl` 缺省为
`/pages/order/defaultDetail?id={order_id}`（原站 PaySdk 硬编码，转赠单同样返回该地址）。

本项目与第 11 页一致：未接入支付渠道，点击「确认支付」→ toast「暂未接入支付渠道」。

### 10.14.5 mock 对应表（`REGIFT_ORDER_DETAIL_MAP`）

| id | order_status | 状态 | 底部操作条 |
| --- | --- | --- | --- |
| 50001 | 1 | 待支付（倒计时 900s） | 取消订单 + 确认支付 |
| 50002 | 2 | 转入成功 | 我的收藏 + 继续购买 |
| 50003 | 7 | 转入中 | 转入中（disabled） |
| 50004 | 3 | 已取消 | 继续购买 |
| 50005 | 6 | 已退款 | 无（`[5,6]` 分支） |

默认取 50001。访问：`/#/pages/order/regiftDetail?id=5000X&orderType=19`。

## 10.15 市场页接口（`pages/market/market`）

### 10.15.1 接口清单

| 函数 | 方法与路径 | 用途 |
| --- | --- | --- |
| `getMarketList` | POST `/market/market/getMarketList` | 市场藏品列表（market_type 1/3 行列表 + market_type 2 盲盒卡片数据） |
| `getMarketBoxList` | POST `/market/market/marketList` | 盲盒市场列表（`changeTab` 盲盒 tab / `loadMoreBox` 分页追加） |
| `getMarketSeries` | POST `/index/series` | 大区卡片 + 分类 tab 数据源（`{type:10, page:1, list_rows:50}`） |

三条均属原站 API 模块 `3fd1`（`pages-market-market.24482309.js` 内）。

### 10.15.2 `getMarketList` —— 市场藏品列表

```
POST /api/market/market/getMarketList
```

请求体：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `add_deal_num` | bool | 原站恒传 `true`（`getCollectionList` 内固定） |
| `keywords` | string | 搜索关键词（搜索框 input 时随 `form.keywords`） |
| `market_type` | int | 1=数字藏品 / 2=盲盒 / 3=权益资产（`changeMarketTab` 同步写 `series_id`：1→""、2→3、3→-2） |
| `series_id` | int/string | 系列 id；`-2`=权益资产；`""`=全部 |
| `page` / `list_rows` | int | 分页（默认 1 / 10） |
| `order` / `sort` | string | 排序字段（`min_price` 地板价 / `sale_num` 成交量）与方向（`asc`/`desc`） |

响应（`code=1`）：`data` 为藏品数组，元素字段：

| 字段 | 说明 |
| --- | --- |
| `id` / `name` | 市场商品 id / 名称 |
| `series_id` | 所属系列 |
| `listimg` | 封面（OSS 相对路径，前端拼 `$ossUrl`） |
| `total_num` / `flux` | 发行量 / 流通量 |
| `min_price` / `price` | 地板价 / 价格（`goods_type!=1` 展示 `min_price`） |
| `is_out` | 1=已退市 |
| `deal_num` | 成交量 |
| `goods_type` | 1=盲盒 / 2=藏品（决定 `rowClick` 跳转目标） |
| `product` | 嵌套商品对象（`id`/`name`/`listimg`） |

页面行为：`getCollectionList` 用 `r.data` **直接赋值**（非追加），`loading` 三态
`loading/none/empty` 驱动 w-loading。

### 10.15.3 `getMarketBoxList` —— 盲盒市场列表

```
POST /api/market/market/marketList
```

请求体同 `getMarketList`（`form` 全量拷贝，`page++` 用于 `loadMoreBox`）。
响应：`{ total, data }`，`data` 元素即 MarketCard 的 `market` 对象（字段同上）。
页面行为：`getBoxList` 做 `loading!="loading"` 去重，**按页追加**（`$set(list, list.length, item)`）；
`d.data.data.length` 为空 → `loading="empty"`。

### 10.15.4 `getMarketSeries` —— 系列（大区 + 分类 tab）

```
POST /api/index/series   body {type:10, page:1, list_rows:50}
```

响应元素：`{series_id, series_name, current_price, change_price, flag, pattern, is_def}`。
`onLoad` 存入 Vuex `goods.collectionSeries`，随后：

- `zoneCards`：大区卡（`current_price` + `change_price` → 涨跌幅，
  公式 `change_price ? (current_price-change_price)/change_price : (change_price ? "0%" : ...)`）；
- `cateTabs`：分类 tab；
- `initDefaultSeries`：取 `is_def==1` 的系列 `changeSeries` 默认选中。

### 10.15.5 mock 对应表

| mock | 数据 |
| --- | --- |
| `MARKET_SERIES` | 26=如意金箍棒（is_def=1，66.00/+20.00）、25=大闹天宫（60.00/0.00） |
| `MARKET_LIST` | 2 条藏品行（series_id 26/25，与系列自洽） |
| `MARKET_BOX_LIST` | 3 条盲盒卡（珍藏盲盒 is_out=0 / 积分大礼包 is_out=1 / 限定盲盒 is_out=0，均 goods_type='1'，含 product 嵌套） |

分流逻辑（`src/api/index.js`）：`market_type===2` → 返回 `MARKET_BOX_LIST.data`；
`market_type===3` 或 `series_id===-2` → 空数组；`keywords`/`series_id` 本地过滤。
`getMarketBoxList` 按 `page<=1` 返回整包、`page>1` 返回空数组。

### 10.15.6 关联接口（后续页面需要）

`/pages/market/marketGoodsList`（MarketCard 跳转目标）、
`/pages/market/detail`、`/pages/marketCapRanking/marketCapRanking`（榜单入口）
尚未实现，接口待补。

---

## 10.16 交易链路接口（求购 / 以求购价出售）

> 侦查时间：2026-10-24｜来源 chunk：`pages-market-submitBegBuy.submitBegBuy.9d32f2ff.js`、
> `pages-market-sellBegBuy.sellBegBuy.b53ead57.js`（模块 `48cc` API 定义段）

### 10.16.1 `getTradInfo` —— 求购页藏品详情

```
POST /api/market/trade/collectionDetail
body { collection_id: 38 }
```

响应（2026-10-24 实调，id=38）：

```json
{
  "code": 1,
  "msg": "查询成功",
  "data": {
    "id": 38,
    "name": "新天降魔云府",
    "listimg": "/uploads/20261018/e876e9a9c96521e170f455a6ee59c675.jpg",
    "collection_code": "…",
    "floor_price": {
      "minprice": 9.2,
      "price_price_ratio": "10",
      "low_price": 92,
      "low_price_text": "九十二元"
    }
  }
}
```

页面用法：

| 字段 | 用途 |
| --- | --- |
| `floor_price.minprice` | 输入框 placeholder「不得低于 X 元」 |
| `floor_price.price_price_ratio` | 提交校验失败 toast「当前求购价不得低于地板价的 {ratio}%」 |
| `floor_price.low_price` / `low_price_text` | 详情页展示的当前地板价 |

### 10.16.2 `createTradOrder` —— 创建求购订单

```
POST /api/market/trade/createBegBuyOrder
body { number: 1, price: 95, pay_way: "yibao", collection_id: 38 }
```

响应：

```json
{ "code": 1, "msg": "下单成功", "data": { "order_id": 30031, "order_sn": "2026102410220012345678901234" } }
```

前置校验（页面侧）：

1. `number` / `price` / 支付方式 三者齐全，否则按钮 disabled；
2. `price < floor_price.minprice` 且 `price_pro != 0` → toast「当前求购价不得低于地板价的 {ratio}%」，阻断提交。

### 10.16.3 `getSellBegInfo` —— 以求购价出售页信息

```
POST /api/market/trade/getSellCollectionInfo
body { collection_id: 38, pay_way: "yibao", number: 1 }
```

响应：

```json
{
  "code": 1,
  "msg": "查询成功",
  "data": {
    "selected": [
      { "buy_id": 30031, "price": "92.00", "pay_way": "yibao", "user_collection_id": null, "collection_code": null }
    ],
    "user_collection_list": [
      { "id": 904758, "collection_code": "A001", "user_hash_text": "nRqwfK****", "collection": { "name": "打王神鞭", "listimg": "…" } }
    ],
    "total_price": "92.00",
    "platform_service_rate": "0.05",
    "platform_service_price": "4.60",
    "estimated_income": "87.40"
  }
}
```

页面用法：

- `total_price` → 「总售价：￥92.00x1=」
- `platform_service_rate` → 「综合服务费(%)：」（原站按百分比展示，故此处为 0.05 → 5%）
- `platform_service_price` / `estimated_income` → 「预计收入 ￥87.40」
- `selected[].buy_id` → 提交时的 `buy_id`
- `user_collection_list[]` → 可勾选的持仓列表

### 10.16.4 `sell` —— 以求购价出售提交

```
POST /api/market/trade/sell
body {
  sell_data: btoa(JSON.stringify([{ buy_id: 30031, user_collection_id: 904758 }])),
  pay_way: "yibao",
  pay_password: "用户支付密码"
}
```

> **注意**：`sell_data` 是 `btoa(JSON.stringify([...]))` 的结果 —— 即
> `[{"buy_id":…,"user_collection_id":…}]` 数组的 base64 编码，**不是** JSON 字符串本身。

响应：

```json
{ "code": 1, "msg": "出售成功", "data": { "password_error": 0 } }
```

`password_error` 非 0 表示支付密码错误。成功后页面 1500ms `router.replace('/pages/order/list')`。

### 10.16.5 前端封装对照（`frontend/src/api/index.js`）

```js
export function getTradInfo(collectionId) {
  return withMock(
    () => post('/market/trade/collectionDetail', { collection_id: collectionId }),
    () => ok(MARKET_TRAD_INFO, '查询成功')
  )
}
export function createTradOrder(params = {}) {
  return withMock(
    () => post('/market/trade/createBegBuyOrder', params),
    () => ok({ order_id: 30031, order_sn: '2026102410220012345678901234' }, '下单成功')
  )
}
export function getSellBegInfo(params = {}) {
  return withMock(
    () => post('/market/trade/getSellCollectionInfo', params),
    () => ok(MARKET_SELL_BEG_INFO, '查询成功')
  )
}
export function sell(params = {}) {
  return withMock(
    () => post('/market/trade/sell', params),
    () => ok({ password_error: 0 }, '出售成功')
  )
}
```

mock 常量：`MARKET_TRAD_INFO`（id=38 真实响应）、`MARKET_SELL_BEG_INFO`（含 selected / user_collection_list /
total_price / platform_service_rate / platform_service_price / estimated_income）。

---

## 10.17 我的寄售接口

```
POST /api/order/order/myConsignment
body { status: "", goods_type: 2, page: 1 }
```

响应（2026-10-24 实调，该账号无记录）：

```json
{
  "code": 1,
  "msg": "查询成功",
  "data": { "total": 0, "per_page": 10, "current_page": 1, "last_page": 1, "data": [] }
}
```

参数语义：

| 参数 | 取值 | 含义 |
| --- | --- | --- |
| `status` | `''` / `'1'` / `'2'` | 全部 / 寄售中 / 已成交（对应二级 tab） |
| `goods_type` | `2` / `1` | 藏品 / 盲盒（对应一级 tab） |
| `page` | 从 1 开始 | 分页页码 |

分页规则（页面 `getList`）：`page < last_page` → `page++` 继续；否则 `isNext=false`、
`loadingType='nomore'`；返回 `data` 为空数组 → `loadingType='empty'`（渲染空态图）。

前端封装：`getMyConsignment(params)` → `frontend/src/api/index.js`；
mock：`getMyConsignmentMock(params)` → `MY_CONSIGNMENT_LIST`。

---

## 10.18 市值排行榜接口

```
POST /api/user/ranking
body（无）
```

响应（2026-10-24 实调）：

```json
{
  "code": 1,
  "msg": "查询成功",
  "time": "1792835528",
  "data": { "data": [], "my": "", "activityRule": "" }
}
```

### 10.18.1 字段结构（按后端真实结构 + 卡片渲染需求）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | array | 榜单条目数组（**原站返回空数组**） |
| `my` | string | 当前用户排名信息（原站为空串） |
| `activityRule` | string | 活动规则（原站为空串） |

榜单条目（后端补齐后可用，字段名由卡片 render 推导）：

| 字段 | 用途 |
| --- | --- |
| `listimg` | 头像（拼接 `$originOssUrl`） |
| `name` | 用户昵称 |
| `flux` | 流通量（显示「流通: X份」） |
| `minprice` | 最低价 |
| `market_value` | 市值 |

### 10.18.2 原站 bug 与本地处理（重要）

原站页面 script `A.list = a.data` 取到的是 `{data,my,activityRule}` **整个对象**，
再用 Vue2 `_l` 遍历对象 → 按 key 迭代 → 渲染出 `data1` / `my1` / `activityRule1` 三条脏数据。
详见《01-原站侦查报告》4.22.7。

本地处理：`list = Array.isArray(d.data) ? d.data : []`，并由 mock 补全条目字段，
使页面展示真实排行榜内容。`update_time` / `market_desc` 在原站来自 Vuex `config.info`
（全局配置接口），mock 中直接置于响应同级的 `data` 对象内。

前端封装：

```js
export function getMarketCapRanking() {
  return withMock(
    () => post('/user/ranking'),
    () => ok(getMarketCapRankingMock(), '查询成功')
  )
}
```

mock：`MARKET_CAP_RANKING`（`update_time` / `market_desc` / 5 条榜单）+ `getMarketCapRankingMock()`。

---

## 10.19 市场购买链路接口总览

| 页面 | 接口 | 方法 | body |
| --- | --- | --- | --- |
| market | `/market/market/getMarketList` | POST | `{market_type, page, ...}` |
| market | `/index/series` | POST | `{type:10, page:1, list_rows:50}` |
| marketGoodsList（寄售 tab） | `/market/market/getMarketGoodsListByGoodsId` | POST | `{page,sort,order,type,keyword,id}` |
| marketGoodsList（求购 tab） | `/market/trade/begBuyList` | POST | `{page,sort,collection_id}` |
| marketGoodsList（委托 tab） | `/market/Prepayment/PrepaymentListMain` | POST | `{page,sort,collection_id}` |
| marketGoodsList（成交 tab） | `/market/market/getMarketGoodsListByGoodsId` | POST | `type=5` |
| market/detail | `/market/market/getCollectionDetail` | POST | `{id}` |
| submitBegBuy | `/market/trade/collectionDetail` | POST | `{collection_id}` |
| submitBegBuy | `/market/trade/createBegBuyOrder` | POST | `{number,price,pay_way,collection_id}` |
| sellBegBuy | `/market/trade/getSellCollectionInfo` | POST | `{collection_id,pay_way,number}` |
| sellBegBuy | `/market/trade/sell` | POST | `{sell_data(btoa),pay_way,pay_password}` |
| consignments | `/user_collection/user_collection/detail/ids/{ids}` | POST | — |
| myConsignment | `/order/order/myConsignment` | POST | `{status,goods_type,page}` |
| marketCapRanking | `/user/ranking` | POST | — |

> 本地 mock 覆盖上表全部接口，`VITE_USE_MOCK !== 'false'` 时不产生任何真实请求。

---

## 10.20 市场购买链路联调与发布记录（2026-10-24）

### 10.20.1 链路接口总览（复刻自 10.19）

| 序 | 接口 | 方法 | 路径 | 请求体 | 响应 `data` 结构 |
| --- | --- | --- | --- | --- | --- |
| 1 | `getTradInfo` | POST | `/market/trade/collectionDetail` | `{collection_id}` | 藏品 + `floor_price{minprice,price_price_ratio,low_price,low_price_text}` |
| 2 | `createTradOrder` | POST | `/market/trade/createBegBuyOrder` | `{number,price,pay_way,collection_id}` | `{order_id,order_sn}` |
| 3 | `getSellBegInfo` | POST | `/market/trade/getSellCollectionInfo` | `{collection_id,pay_way,number}` | `{selected[],user_collection_list[],total_price,platform_service_rate,platform_service_price,estimated_income}` |
| 4 | `sell` | POST | `/market/trade/sell` | `{sell_data(btoa),pay_way,pay_password}` | `{password_error}` |
| 5 | `myConsignment` | POST | `/order/order/myConsignment` | `{status,goods_type,page}` | `{total,per_page,current_page,last_page,data[]}` |
| 6 | `ranking` | POST | `/user/ranking` | （无） | `{data[],my,activityRule}` |

### 10.20.2 前端封装与 mock 映射（全部命中本地 mock）

| 前端函数 | `frontend/src/api/index.js` | mock 常量 / 工厂 |
| --- | --- | --- |
| `getTradInfo(collectionId)` | `withMock(post('/market/trade/collectionDetail'), …)` | `MARKET_TRAD_INFO` |
| `createTradOrder(params)` | `withMock(post('/market/trade/createBegBuyOrder', params), …)` | 内联对象 |
| `getSellBegInfo(params)` | `withMock(post('/market/trade/getSellCollectionInfo', params), …)` | `MARKET_SELL_BEG_INFO` |
| `sell(params)` | `withMock(post('/market/trade/sell', params), …)` | `{password_error:0}` |
| `getMyConsignment(params)` | `withMock(post('/order/order/myConsignment', params), …)` | `MY_CONSIGNMENT_LIST` / `getMyConsignmentMock()` |
| `getMarketCapRanking()` | `withMock(post('/user/ranking'), …)` | `MARKET_CAP_RANKING` / `getMarketCapRankingMock()` |

### 10.20.3 联调验证

- **本地链路联调**：7 页全部渲染正常，网络层记录 **0 次真实 `/api` 请求**，全部命中 mock
  → 满足「项目独立可 mock」约束，脱离原站后端亦可独立运行。
- **全站路由回归**：26 条路由 `FAIL COUNT = 0`，无 JS 报错、无空白页。
- **公网发布**：`https://a97e4556be4b3a6d0.app.workbuddy.host`（`verified: true`），
  线上 8 页 Playwright 实测均正常渲染（带重试）。

### 10.20.4 待接入真实后端时的注意事项

1. `sell_data` 为 `btoa(JSON.stringify([...]))`，接入真实后端时**不可**直接当 JSON 解析，
   必须先 base64 解码（详见《数据库设计文档》19.4）。
2. `getTradInfo` 的 `floor_price.price_price_ratio` 为 `0` 时表示不限制，
   前端短路条件是 `price_pro != 0`，服务端也应保持同一语义。
3. `myConsignment` 的 `status` 传空串表示不过滤；后端若用 PHP，
   注意 `'0'` 为假值，空串判断须用 `=== ''` 而非 `empty()`。
4. `ranking` 的 `data` 字段是 `{data[], my, activityRule}` 三层结构，
   后端切勿直接返回裸数组（这正是原站页面 bug 的诱因之一）。

---

## 10.21 委托订单链路（求购详情 / 我的委托 / 发起委托，2026-10-24 P0 批次）

### 10.21.1 URL 校正（对照 10.6/10.16 早期记录的修正）

| 前端函数 | 早期误记 | **实际 URL（反编译模块 48cc 逐字确认）** | 请求体 |
| --- | --- | --- | --- |
| `getMyEntrustList` | `/market/Prepayment/myOrderlist` | **`/market/Prepayment/PrepaymentListMain`** | `{page,status,type}`（type=31） |
| `getMyEntrustInfo` | — | `/market/Prepayment/myOrderInfo` | `{order_id}` |
| `getMyBegInfo` | — | `/market/trade/begBuyOrderInfo` | `{order_id}` |
| `getEntrustInfo` | — | `/market/Prepayment/collectionDetail` | `{collection_id}` |
| `entrust` | — | `/market/Prepayment/createOrder` | `{number,price,pay_way,collection_id,order_type:31}` |
| `entrustCancel` | — | `/market/Prepayment/cancelOrder` | `{order_id}` |

> 原站模块 48cc 中 `getMyEntrustList` 指向 `myOrderlist`、`getEntrustList` 指向 `PrepaymentListMain`，
> 但**页面实际调用的是 `getEntrustList`（委托市场列表）与 `PrepaymentListMain`**；
> entrust/list 页 chunk（bddad8c5）逻辑模块逐字引用 `(0,d.getEntrustList)`。
> 项目 `api/index.js` 的 `getMyEntrustList` 已按页面真实调用修正为 `PrepaymentListMain`。

### 10.21.2 状态映射遗留对调（原站 copy bug，1:1 照搬）

`components/order/statusMap.js` 的 c646d 模块映射表中：

| key | status | 原站文案 | 备注 |
| --- | --- | --- | --- |
| 11（求购） | 2 | **委托中** | 正常 |
| 31（委托） | 2 | **求购中** | 原站 copy 遗留对调，像素级复刻照搬 |

### 10.21.3 页面链路（4 页，P0 全部验收通过）

| 页面 | 原站 chunk | 反编译要点 | mock |
| --- | --- | --- | --- |
| `order/beg/info` | 27555ee5 | 复用 BegOrderStatus/BegGoodsBar/BegGoodsInfo；pay/cancel 弹窗 order_type=11 | `BEG_ORDER_LIST` 按 id 取 |
| `order/entrust/list` | bddad8c5 | tabs「委托中」；status==4 →「重新委托」→ `/pages/market/submitEntrust?id=goods_id` | `ENTRUST_ORDER_LIST` 4 条 |
| `order/entrust/info` | 17835750 | 「继续委托」→ `router.replace('/pages/market/submitBegBuy?id=' + goods_id)`（原站复用求购页，非 submitEntrust） | 同上按 id 取 |
| `market/submitEntrust` | 6544ce09 | 较 submitBegBuy 多「预计收入」卡（总售价 + 综合服务费率 - 服务费）与「委托说明」卡（`chargeInfo.tips` 富文本） | `ENTRUST_CHARGE_INFO` |

### 10.21.4 委托收费信息 `ENTRUST_CHARGE_INFO`

`POST /market/Prepayment/collectionDetail`（2026-10-24 实调 id=38）：
`pay_platform_service_rate:'0.05'` / `low_price:92` / `low_price_text:'九十二元'` / `share_proportion_rate:'0.00'` / `tips`（委托说明 HTML）。

### 10.21.5 验收记录（Playwright，iPhone 390×844 @2x）

| 页面 | 断言 | 结果 |
| --- | --- | --- |
| beg/info（id=301/302/303/304 四状态） | 66 项 | 全 PASS，0 console 报错 |
| entrust/list（全部/委托中两 tab） | 49 项 | 全 PASS，0 console 报错 |
| entrust/info | 66 项 | 全 PASS，0 console 报错 |
| submitEntrust | 39 项 | 全 PASS，0 console 报错 |

---

## 10.22 买卖详情页（`pages/market/sellInfo`，2026-10-24 P0 批次）

### 10.22.1 反编译要点

chunk `pages-market-sellInfo.1afef989.js`（340905 字节）为**共享 chunk**（webpackJsonp 第二元素含
`pages-index-downloadApp~pages-my-join~pages-union-tradeUnion`），页面装配模块 `2993`：
render `8144` / logic `bbed`（scope `227e8585`）/ mixin `72d9`（滚动渐变导航栏）/ navbar logic `4a99`。

```js
// logic bbed（逐字）
data { loading, title:'买卖详情', product:{}, id, search:{status:1,page:1}, info:{}, list:[], loadingType:'none' }
computed typeMap → [
  {name:'成交记录', type:1, count:info.transaction_record_number},
  {name:'当前求购', type:2, count:info.current_buying},
  {name:'当前寄售', type:3, count:info.current_consignment}]
onLoad({id}) → search.goods_id=id → getInfo()
getInfo → getMarketGoodsInfo({id, type:2}) → product=data; goods_type=2; title=product.name → getList(search)
changeType(A) → search.status=A.type; page=1; loadingType='none'; getList(search)
getList(A) → getSellInfo(A).then(data:{list,current_buying,current_consignment,transaction_record_number})
             1==page&&(list=[]); r.length<20&&(loadingType='nomore')   // 无 empty 分支
```

页面 CSS（scope 227e8585）仅 4 条页面级规则：`.list .item{border-bottom:1px solid rgba(0,0,0,.05)}`、
`.type-item.active{position:relative}`、`.type-item.active .title{z-index:2}`、
`.type-item.active::after{width:130rpx;height:12rpx;top:26rpx;background:url(tab-line.webp)}`。

### 10.22.2 接口与实测（2026-10-24 登录态实调 id=38）

| 接口 | 请求 | 实测响应 |
| --- | --- | --- |
| `/market/market/marketGoodsDetail` | `{id:38, type:2}` | **`data: []`（空数组）** → 标题为空、收藏图标 no-like。项目 mock 沿用 `MARKET_GOODS_DETAIL`（与已验收 marketGoodsList 一致），故标题显示「新天降魔云府」——已知有意差异 |
| `/market/trade/tradingInformation` | `{status, page, goods_id}` | data 恒带 `transaction_record_number:150 / current_buying:0 / current_consignment:101`；status=1 → 20 条成交记录 `{price,time:'昨天',collection_code,total_num,…}`；status=2 → 空数组（0 单）；status=3 → 20 条 `{price,number,pay_text}` |

> **当前求购 0 单**为原站真实状态（多商品实测均 0）；mock 构造 3 条 `{price,number}` 演示行结构，
> 已在 `mock.js` 注释标注。

### 10.22.3 静态资源

- `has-like.png` / `no-like.png`（48×48）—— 已从原站 `/static/icon/` 下载至 `public/assets/img/icon/`
- `tab-line.webp` —— 原站 CSS 指向 `https://zmwc-static.obs.cn-south-1.myhuaweicloud.com/static/bg/tab-line.webp`，
  **该 OBS bucket 已不存在（NoSuchBucket），原站同为裂图状态**；本地以同尺寸（135×13 @2x）品牌金
  渐变下划线替代（`public/assets/img/market/tab-line.webp`），尺寸/位置按原站 computed style 实测
  67.6×6.24px @ top 13.52px left 0 落地。

### 10.22.4 验收记录

`/tmp/verify/sellinfo.py`（63 项断言）：**全 PASS，0 console 报错**。
P0 全量回归：beglist 47 / beginfo 66 / entrustlist 49 / entrustinfo 66 / submitentrust 39 —— 全 PASS；
marketGoodsList 成交 tab（受 `getSellInfo` mock 改动影响面）人工回归正常（floor_price/today_amount 汇总字段保留）。

---

## 10.23 登录链路（P1：login/login、login/login-code、login/register、login/forgetPwd，2026-10-24）

### 10.23.1 反编译要点

| 页面 | chunk | render / logic | scope | 主题 |
| --- | --- | --- | --- | --- |
| `login/login` | `pages-login-login.543162da.js` | `bde4` / `dee4`（桥 `16fb`） | `5fa3e445` | 黑金（#030303 底 + 金色渐变控件） |
| `login/forgetPwd` | `pages-login-forgetPwd.db0d127c.js` | `c91a` / `c608`（桥 `32a8`） | `0270e746` | 黑金（au-* 类） |
| `login/register` | `pages-login-register.10d354bd.js` | `60c7` / `5efb`（桥 `cd5f`） | `1178b7ad` | 黑金（同套 au-* 类） |
| `login/login-code` | `pages-login-login-code.4bb8a79b.js` | `9008` / `97db` | `a092e044` | 浅色旧版（蓝按钮 #1b53f7） |

- `login/login` 双模式：`loginType=1` 密码登录（`/user/login`）/ `2` 验证码登录（`/user/LoginForMobile`，**默认**），
  由 `view.switch-link` 切换；`computed.loginActive = 1==loginType ? !!(form.account&&form.password) : !!(form2.mobile&&form2.captcha)`。
- `login/forgetPwd` 与 `login/register` 共用同一套 `au-*` 类名与样式（`.au-page/.au-bg/.au-field/.au-submit/.au-agree`），
  仅字段行与文案不同。
- `login/login-code` 为**浅色旧版**：`w-container.page-bg.container` + 蓝按钮，背景图 `/static/image/login/bg.webp`。

### 10.23.2 接口清单（`frontend/src/api/index.js`）

| 前端函数 | URL | body | 用途 |
| --- | --- | --- | --- |
| `login({account,password})` | POST `/user/login` | `{account,password}` | 密码登录（早前已接入） |
| `loginByCode(params)` | POST `/user/LoginForMobile` | `{mobile,captcha,inviter_code?}` | 验证码登录（loginType=2） |
| `register(params)` | POST `/user/register` | `{mobile,code,password,inviter_code}` | 注册 |
| `resetLoginPwd(params)` | POST `/user/resetpwd` | `{mobile,captcha,newpassword,re_password}` | 忘记密码 |
| `sendSms(params)` | POST `/sms/send` | `{mobile,event}`（`event`: `login`/`register`/`resetpwd`） | 短信验证码 |
| `getUserInfo()` | POST `/user/getUserInfo` | — | 登录后拉取用户信息 |

> 前端封装命名沿用原站：`loginByCode` / `resetLoginPwd` 对应原站模块 `fc5e` 的同名方法。

### 10.23.3 交互规则（原站逐字复刻）

- **密码规则**（三处一致）：`/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/`
  不满足 → `密码内需同时包含数字、字母，长度在6-12之间`
- **u-code 倒计时**：`seconds=60`、`keepRunning`，`changeText` 逐页不同
  - login：`(重新发送 Xs)` / forgetPwd：`重新获取 Xs` / register：`(重新发送 Xs)`
- **校验链**：
  - login：手机号 → 密码（loginType=1）或 验证码（loginType=2）
  - register：请先勾选用户协议？→（否）手机号 → 验证码 → 密码 → 密码规则
  - login-code：**先校验 `checked`**（`请先勾选用户协议`）→ 手机号 → 验证码
- **节流**：`login/login`、`login/register`、`login/login-code` 的提交按钮为 `$u.throttle(fn, 500)`，
  500ms 内的重复点击会被丢弃（验收脚本据此设置点击间隔）。

### 10.23.4 视觉还原基准（rpx → px）

- 换算口径：**尺寸/字号/间距取 `floor(rpx * 0.52)`**（如 99rpx=51px、65rpx=33px、77rpx=40px、93rpx=48px）；
  边框宽度按 live 实测统一为 `1px`（1.4rpx / 1.8rpx 经 uni-app 转换后渲染为 1px）。
- 关键实测值（390×844，Chrome）：
  - `login/login`：logo `85×37 @ (26,47)`；「注册」按钮 `72×26 @ (292,37)` 金边 `#e9dbb5`；
    标题 `33px/700/行高 42px/#f6e4ba`；输入行 `51px` 高、金边 `#9e8050`、radius `24px`；
    「获取验证码」按钮 `98×34` radius `17px`；登录按钮 `48px` 高、radius `24px`、未激活文字 `#aaa`、激活 `#24211d`
  - `login/login-code`：返回键 `31×31 @ (34,75)`；插画 `198×54`；输入组 `291×45` 白底 `#cfcfcf` 边；
    登录按钮 `306×49 / #1b53f7`；协议勾选图 `15×15`

### 10.23.5 原站遗留问题（本批次如实复刻，不擅自"修正"）

1. **`login/login` 的 `checkForm()` 未把 `checked` 作为拦截条件**（只求值不判断）
   → 未勾选协议也可登录；`login/login-code` 的同名方法则**有**该校验，两页行为不一致。
2. **`login/register`、`login/forgetPwd` 的密码显隐图标 `eye-off / eye-fill` 指向 `/static/icon/*.png`，
   该资源在原站即 404**（`w-icon` 触发 `error` → `isErr` → 不渲染）
   → 本项目同样在 `@error` 后移除 `<img>`，视觉与原站一致（不显示任何图标）。
3. **`login/login-code` 的 `methods` 中没有 `sendCode`**，`checkVerifyStatus()` 却调用 `this.sendCode()`
   → 点击「获取验证码」无任何响应（原站遗留 bug）。本项目复刻「点击无响应」这一可观测行为，
   错误以 `console.warn` 记录（不抛未捕获异常污染全局错误监听）。
4. `login/forgetPwd` 的 `inputStyle / codeInputStyle` 两个 `data` 字段在 render 中未被使用（原站冗余字段），已同样保留注释。
5. **placeholder 颜色三页不同（原站实测）**：`login/login`、`login/forgetPwd` 为 `#8B887D`（rpx 占位符样式）；`login/register` 为 `#4A4A4A`（rgb(74,74,74)）；`login/login-code` 由 u-input 组件默认 `#818181`。本项目逐页对齐，未做统一。
6. **`login/login-code` 第一个 `.input-group` 带 `margin-top: 31rpx=16px`**（原站实测 input-group[0].marginTop=16px、login-form.marginTop=0），仅首行生效；其余行靠 `.input-group` 的 `margin-bottom: 20px` 撑开间距。

### 10.23.6 静态资源（已从原站下载落盘）

`public/assets/img/login/`：`login-bg.webp`、`login-logo.webp`、`mobile-gold.webp`、`safe-gold.webp`、
`invite-gold.webp`、`bg.webp`、`back-btn.webp`、`title-value.webp`、`yes-checked-image.webp`、`no-checked-image.webp`

### 10.23.7 验收记录

| 脚本 | 覆盖 | 断言 | 结果 |
| --- | --- | --- | --- |
| `/tmp/verify/login.py` | `login/login` + `login/forgetPwd` | 79 项 | 全 PASS，0 console 报错 |
| `/tmp/verify/login2.py` | `login/register` + `login/login-code` | 54 项 | 全 PASS，0 console 报错 |

回归：`beglist 47 / beginfo 66 / entrustlist 49 / entrustinfo 66 / submitentrust 39 / sellinfo 63` 全 PASS；
全站 40 条路由冒烟 **FAIL COUNT = 0**。

## 10.24 我的模块 11 页（P1 批次：我的 + 钱包，2026-10-25）

本批次共实现 11 个原站页面，全部为**登录墙/未登录可见**的「我的」子页与钱包页。
前 8 页为免登录可达页（金标准直接抓取），后 3 页（`my/flowDoc`、`my/svip`、`wallet/wallet`）
在未登录时会被原站重定向到 `/pages/login/login`，本节记录**登录态抓取**与**接口实调**过程。

### 10.24.1 页面清单与路由

| # | 原站路由 | 本项目路由 | 主题 | 视图文件 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 1 | `pages/my/about` | `/pages/my/about` | 浅色 `#f7f7f8` | `views/my/about.vue` | PASS |
| 2 | `pages/my/privacy` | `/pages/my/privacy` | 浅色 `#f7f7f8` | `views/my/privacy.vue` | PASS |
| 3 | `pages/my/service` | `/pages/my/service` | 黑金 `#101115` | `views/my/service.vue` | PASS |
| 4 | `pages/my/join` | `/pages/my/join` | 浅色 `#f7f7f8` | `views/my/join.vue` | PASS |
| 5 | `pages/my/other-power` | `/pages/my/other-power` | 黑金 `#101115` | `views/my/otherPower.vue` | PASS |
| 6 | `pages/my/info` | `/pages/my/info` | 黑金 `#101115` | `views/my/info.vue` | PASS |
| 7 | `pages/my/cancellation` | `/pages/my/cancellation` | 黑金 `#101115` | `views/my/cancellation.vue` | PASS |
| 8 | `pages/my/address/edit` | `/pages/my/address/edit` | 黑金 `#101115` | `views/my/addressEdit.vue` | PASS |
| 9 | `pages/my/flowDoc` | `/pages/my/flowDoc` | 浅色 `#f7f7f8` | `views/my/flowDoc.vue` | PASS |
| 10 | `pages/my/svip` | `/pages/my/svip` | 浅色 `#f7f7f8` | `views/my/svip.vue` | PASS |
| 11 | `pages/wallet/wallet` | `/pages/wallet/wallet` | 黑金 `#101115` | `views/wallet/wallet.vue` | PASS |

> 原站这些子页 DOM 中含 5 个 TabBar 文本，属**隐藏组件残留**，实际不显示底部栏；
> 导航栏为页面自绘（返回键 + 居中标题），非 uView navbar。本项目 11 页均无底部 TabBar。

### 10.24.2 前 8 页接口（推断 / 端点未捕获，已在代码注释标注）

| 函数 | 端点 | 依据 |
| --- | --- | --- |
| `setProfile(params)` | `POST /user/profile` | 原站真实端点（昵称 / 头像编辑） |
| `delAccount(params)` | `POST /user/delAccount` | 原站真实端点（注销账号） |
| `setHideCollection(params)` | `POST /user/profile` | 端点未捕获，按 `hide_collection` 字段推断 |
| `addAddress(params)` | `POST /user/addAddress` | 端点未捕获，按表单字段推断 |

### 10.24.3 登录墙 3 页：登录态抓取方法

原站 3 个页面未登录时全部跳 `/pages/login/login`（`probe.py` 抓到的 3 个 HTML 完全一致）。
本项目用 Playwright 走**原站密码登录**（`17587881293` / `whm981004`）后重新抓取：

1. `GET /#/pages/login/login` → 点击 `.switch-link` 切到密码模式
2. 填入手机号 + 密码 → 点击 `.login-btn` → 响应 `data.userinfo.token` 写入 `localStorage.token`
3. 复用同一 context 访问目标路由 → 不再被重定向
4. 抓取 `innerHTML` + 全页截图 + 叶子节点坐标 JSON（`map.py` / `map2.py` 模板）

抓取脚本：`/tmp/verify/crawl_login.py`、`/tmp/verify/detail_svip.py`、`/tmp/verify/detail_wf.py`
金标准：`/tmp/verify/golden/{my_flowDoc,my_svip,wallet_wallet}.html|.png|_map.json|_map2.json|*_detail.json`

### 10.24.4 登录墙 3 页：接口实调（2026-10-25，登录态）

通过 Playwright 拦截 XHR（`/api/*`）捕获原站真实请求与响应：

| 页面 | 请求 | 实调响应 | 用途 |
| --- | --- | --- | --- |
| `my/flowDoc` | `POST /user_collection/user_collection/getRecord` body `{page:1}` | `{code:0, msg:"参数错误", data:null}` | 流转记录列表；原站因此显示**空态**（`search-empty.png` 居中） |
| `my/svip` | `POST /index/getConfig` body `{key:"vip_agreement,vip_time"}` | `{code:1, data:{vip_time:"2678400", vip_agreement:""}}` | 会员时长（秒）/ 会员协议 |
| `my/svip` | `POST /user/getUserInfo` | `data` 含 `is_vip`、`vip_time` 两个字段 | `vip_time` = 会员到期时间戳，测试账号为 `null` → 倒计时恒为 `00` |
| `wallet/wallet` | `POST /user/getUserInfo` | 同上 | 页面首屏只取用户信息 |
| `wallet/wallet`（点击「进入钱包」） | `POST /wallet/yibao/openAccount` | 返回易宝钱包 H5 URL | 页面整页跳转至 `https://yvwallet.yeepay.com/wallet/index.html?t={ts}#/pages/fund/index?token={token}` |

「进入钱包」跳转目标为**原站实证**（Playwright `framenavigated` 事件捕获完整含 hash 的 URL）：

```
https://yvwallet.yeepay.com/wallet/index.html?t=20261025025730738#/pages/fund/index?token=db686e29ea444a26954d411e18656c89
```

`/user/getUserInfo` 真实响应共 105 个字段，本项目 `MOCK_USER` 已补齐本批次新增的
`is_vip`（测试账号 `0`）与 `vip_time`（测试账号 `null`）两个字段。

### 10.24.5 前端封装（`frontend/src/api/index.js`）

```js
/** 流转记录（原站真实端点，pages/my/flowDoc 实调） */
export function getFlowRecord(params = {}) {
  return withMock(
    () => post('/user_collection/user_collection/getRecord', { page: 1, ...params }),
    () => ok({ total: 0, per_page: 20, current_page: 1, last_page: 1, data: [] }, '查询成功')
  )
}

/** 易宝钱包开户 / 进入钱包（原站真实端点） */
export function openYibaoAccount(params = {}) {
  return withMock(
    () => post('/wallet/yibao/openAccount', params),
    () => ok({ url: `https://yvwallet.yeepay.com/wallet/index.html?t=${Math.floor(Date.now() / 1000)}#/pages/fund/index?token=MOCK_WALLET_TOKEN` }, 'ok')
  )
}
```

`my/svip` 复用既有的 `getUserInfo()` 与 `getConfig()`（`CONFIG` 已补 `vip_time: '2678400'`、`vip_agreement: ''`）。

### 10.24.6 视觉还原基准（390×844 实测坐标）

**`my/flowDoc`（浅色）**

| 元素 | 坐标 | 样式 |
| --- | --- | --- |
| nav | `(0,0,390,44)` | bg `#fafafa` |
| 返回键 | `(13,10,24,24)` | `back-btn.png` |
| 标题 | `(165,15.5,60,16)` | 15px bold `#333` |
| 空态容器 | `(16,148,358,257)` | flex 纵向居中 |
| 空态图 | `(134.5,148,121,122)` | `search-empty.png` |

**`my/svip`（浅色，整页 1781px）** — 全部为 320×240 权益图，x=13，纵向堆叠间隔 4px：

| 元素 | 坐标 | 资源 |
| --- | --- | --- |
| nav / 返回键 / 标题 | `(0,0,390,44)` / `(13,10,24,24)` / `(165,15.5,60,16)` | `back-btn-white.png`，标题 15px bold `#fff` |
| 会员 logo | `(13,44,320,240)` | `logo.webp` |
| 特权横幅 | `(13,288,320,240)` | `tqryz-image.webp` |
| 播放区 | `(13,532,364,240)`，图 `(35,532,320,240)` | `bofang.webp`（容器内居中，(364-320)/2=22） |
| 剩余时间标题图 | `(13,772,320,240)` | `time-title.webp` |
| 倒计时 | `(13,1016,364,20)`，数字格 7×14px 起于 x=146 | `00天00时00分00`（秒位无单位字），14px `#4a4a4a` |
| 8 大权益图 | `(13,1036,320,240)` | `bdtq-image.webp` |
| 权益图标格 | `(13,1280,320,240)` | `tq-image.webp` |
| 立即开通 | `(13,1524,320,240)` | `ljkt-image.webp` |

**`wallet/wallet`（黑金）**

| 元素 | 坐标 | 样式 |
| --- | --- | --- |
| 页面底色 | 全屏 | `#101115` |
| nav | `(0,0,390,44)` | 透明底 |
| 返回圆钮 | `(13,5,34,34)` | bg `#fff`、br `50%` |
| 返回图标 | `(26.3,15.5,7.3,13)` | `back_btn.webp`（圆钮内居中） |
| 标题 | `(161,14.5,68,19)` | 17px fw500 `#fff` |
| 易宝卡图 | `(18,62,354,156)` | `yibao-bg1.webp` 拉伸铺满 |
| 底部条 | `(0,749,390,95)` | bg `#101115`、上边框 1px `#655032`、fixed |
| 进入钱包按钮 | `(23,765,344,52)` | bg `#191919`、br `15px` |
| 按钮文案 | `(165,780.5,60,21)` | 15px fw500 `#fff`、Alibaba-PuHuiTi-Medium |

### 10.24.7 静态资源（已从原站下载落盘）

`public/assets/img/svip/`：`logo.webp`、`tqryz-image.webp`、`bofang.webp`、`time-title.webp`、
`bdtq-image.webp`、`tq-image.webp`、`ljkt-image.webp`（7 张）

`public/assets/img/wallet/`：`back_btn.webp`、`yibao-bg1.webp`（2 张）

`public/assets/img/flowdoc/`：`search-empty.png`（1 张）

复用既有：`public/assets/img/my/back-btn.png`、`public/assets/img/my/back-btn-white.png`

### 10.24.8 验收记录（Playwright，iPhone 390×844 @2x）

| 脚本 | 覆盖 | 断言 | 结果 |
| --- | --- | --- | --- |
| `/tmp/verify/verify_my8.py` | about / privacy / service / join / other-power / info / cancellation / address-edit | 102 项 | 全 PASS，0 console 报错 |
| `/tmp/verify/verify_login3.py` | flowDoc / svip / wallet | 36 项 | 全 PASS，0 console 报错 |

**11 页合计 138 项断言全 PASS，0 控制台报错**；另做原站 ↔ 复刻左右并排截图比对
（`/tmp/verify/cmp_flowdoc.png`、`cmp_svip.png`、`cmp_wallet.png`），三页视觉与原站一致。

交互验证：

- 「进入钱包」点击 → `framenavigated` 捕获跳转
  `https://yvwallet.yeepay.com/wallet/index.html?t={ts}#/pages/fund/index?token=MOCK_WALLET_TOKEN`（含 hash，与原站结构一致）
- `my/flowDoc` 请求完成后展示空态图、loading 消失
- `my/svip` 倒计时输出 `['00','00','00','00']` + `['天','时','分']`（未开通会员，与原站一致）

### 10.24.9 遗留与说明

1. **`my/flowDoc` 列表样式未实现**：原站测试账号 `getRecord` 返回 `code:0「参数错误」`，
   页面只呈现空态，**原站无任何列表条目样式可供比对**。本项目保留列表渲染位，
   数据为空时展示与原站逐像素一致的空态；一旦后端返回真实列表，需再抓一次列表金标准后补样式（不臆造）。
2. **`my/svip` 的「立即开通」与视频播放区为静态图**：原站点击后拉起支付 SDK / 视频播放器（外部系统），
   本项目不臆造跳转，保留静态图。
3. **「进入钱包」在 mock 模式下会跳转到易宝官方域名并携带 MOCK 占位 token**，
   易宝侧会提示 token 无效——这是外部系统的预期表现；接入真实后端后 token 来自
   `POST /wallet/yibao/openAccount`，行为与原站完全一致。
4. **`my/flowDoc`、`my/svip` 的入口未在已复刻页面中找到可确证的文字/图标入口**
   （原站入口所在页面未纳入本批次），故**未臆造入口**；两页可按原站路由 URL 直接访问。

---

## 10.25 P0 批次：13 个断链目标页接口（2026-10-25）

> 背景：前 49 页已实现后仍有 **14 条断链**（点击后命中 `/:pathMatch(.*)*` 兜底跳首页）。
> 本批次补齐其中 13 条（`market/tradingInformation` 为原站接口异常页，未纳入），
> 接口全部基于 **2026-10-25 登录态对原站的实调** 抓取，未臆造任何端点。
> 前端封装统一位于 `frontend/src/api/index.js`（P0 段落 1121–1312 行），
> 全部走 `withMock(request, mockFn)`：mock 开启时返回本地常量，关闭时打真实后端。

### 10.25.1 端点总表

| # | 页面 | 原站端点 | 方法 | 实调响应要点 |
|---|---|---|---|---|
| 1 | `my/address/list` | `/user/address_list` | POST | `code:1, msg:"地址列表", data:[]` → 空态 |
| 2 | `notice/noticeDetails` | `/index/afficheDetail/ids/{id}` | POST | 缺 id：`code:0, msg:"这条消失不见了", data:null` |
| 3 | `notice/search` | `/index/afficheList` | POST `{search,page}` | `search="嗒"` → `total:11` 的公告列表 |
| 4 | `consignments/search` | `/order/order/myConsignment` | POST `{keyword,status,goods_type,page}` | `keyword="嗒"` → `total:0` 空态 |
| 5 | `blindBox/index` | `/user/getUserInfo` | POST | 仅取 `blind_box_num`；无独立列表接口 |
| 6 | `blindBox/blindBoxDetails` | `/user_collection/user_collection/detail/ids/{id}` | POST | 缺 id：`code:0, msg:"收藏不存在或者已经被删除了"` |
| 7 | `compound/schemeDetails` | `/synthesis/playInfo` | POST `{play_id,grp,classify}` | 缺参：`code:0, msg:"玩法不存在"` |
| 8 | `draw/InvitationFriendAssist` | 无独立列表请求 | — | 原站渲染「数据为空」空态 |
| 9 | `index/downloadApp` | `/index/getConfig` | POST `{key:"base_apk,ipa,app_version,appName"}` | 静态页，仅取下载地址 |
| 10 | `invitation/invitation` | `/user/getUserInfo` + `/index/getConfig` + `/user/ranking` | POST ×3 | 邀请码取 `inviter_code`；榜单 `{page:1,types:2}` → `my_list` 为空 |
| 11 | `shop/shop` | `/crystal_goods/list` | POST `{type:"10",page:1,crystal_type:"blue"}` | `total:0` 空态 |
| 12 | `task/index` | `/addons/diypage/index` + `/synthesis/themeinfo` | POST ×2 | `themeinfo` 测试账号返回 `data:null` |
| 13 | `certification/certification` | 无（纯静态页） | — | — |

### 10.25.2 三个关键实调细节

1. **邀请码来源**：`inviter_code` 取自 `POST /user/getUserInfo` 顶层字段，
   实测值 `L1224539`（金标准页面文本同为该值）→ 已写入 mock 常量。
2. **二维码为后端生成**：原站 `iv-qr` 的图片 URL 形如
   `https://apinew.hfeyusheng.top/addons/qrcode/index/build?text_type=h5&text=L1224539&t={ts}&url=%2F%23%2Fpages%2FInvitation%2Finvitation`，
   本项目按同构 URL 构造（**注意原站 path 大写 `Invitation`，本地路由为小写 `invitation`**，
   属于原站大小写不一致的历史遗留，此处按原站 URL 形态保留 qrcode 参数）。
3. **`/index/getConfig` 是 key-value 批量配置接口**：不同页面用不同 `key` 逗号串取不同字段
   （邀请页 `h5_invite_url`、下载页 `base_apk/ipa`），已分别封装。

### 10.25.3 前端封装一览

| 导出函数 | 视图调用方 | Mock 常量 |
|---|---|---|
| `getAddressList()` | `my/addressList.vue` | `ADDRESS_LIST` |
| `getAfficheDetail(id)` | `notice/noticeDetails.vue` | 内联「这条消失不见了」 |
| `searchAfficheList(kw, page)` | `notice/search.vue` | `AFFICHE_LIST` |
| `searchMyConsignment(params)` | `consignments/search.vue` | `MY_CONSIGNMENT_SEARCH` |
| `getCrystalGoodsList(params)` | `shop/shop.vue` | `CRYSTAL_GOODS_LIST` |
| `getInvitationConfig()` | `invitation/invitation.vue` | `INVITATION_CONFIG` |
| `getInvitationRanking(params)` | `invitation/invitation.vue` | `INVITATION_RANKING` |
| `getSynthesisPlayInfo(params)` | `compound/schemeDetails.vue` | `SYNTHESIS_PLAY_INFO` |
| `getMyBlindBoxList()` | `blindBox/index.vue` | 内联空列表 |
| `getBlindBoxDetail(id)` | `blindBox/blindBoxDetails.vue` | 内联「收藏不存在…」 |
| `getInviteAssistList(params)` | `draw/inviteAssist.vue` | 内联空列表 |
| `getTaskIndexData()` | `task/index.vue` | `TASK_ENTRY_LIST` / `TASK_MALL_LIST` |
| `getDownloadConfig()` | `index/downloadApp.vue` | `CONFIG` |

### 10.25.4 验收记录（Playwright，iPhone 390×844 @2x）

金标准来源：`/tmp/verify/golden/p0/*_map.json`（原站 2026-10-25 登录态逐叶节点坐标/样式/背景图抓取）
与 `*_map2.json`（容器层级摘要）；断言脚本 `/tmp/verify/verify_p0.py`。

| 页面 | 断言数 | 结果 | console 错误 |
|---|---|---|---|
| `certification/certification` | 10 | 全 PASS | 0 |
| `my/address/list` | 8 | 全 PASS | 0 |
| `notice/noticeDetails` | 4 | 全 PASS | 0 |
| `notice/search` | 7 | 全 PASS | 0 |
| `consignments/search` | 7 | 全 PASS | 0 |
| `blindBox/index` | 14 | 全 PASS | 0 |
| `blindBox/blindBoxDetails` | 11 | 全 PASS | 0 |
| `compound/schemeDetails` | 10 | 全 PASS | 0 |
| `draw/InvitationFriendAssist` | 16 | 全 PASS | 0 |
| `index/downloadApp` | 20 | 全 PASS | 0 |
| `invitation/invitation` | 15 | 全 PASS | 0 |
| `shop/shop` | 15 | 全 PASS | 0 |
| `task/index` | 21 | 全 PASS | 0 |

**13 页合计 158 项断言全 PASS，0 控制台错误**（容差 ≤1.5px，字符串按子串包含比对）。

全站路由冒烟：`/tmp/verify/smoke_all.py` → **64 条路由 FAIL COUNT = 0**。
生产构建：`npx vite build` → `✓ built in 2.21s`，无警告。

### 10.25.5 像素级复刻的几何规律（本批次沉淀）

1. **原站返回键与标题相对「页面」定位，而非相对 nav 容器**。
   认证页 / 地址页 / 盲盒详情等页的 nav 容器带 16px padding（如 `x=16,w=358`），
   但返回键在 `x=13`、标题水平居中于 `x=165`。
   复刻做法：`.nav { position: static }` + 祖先 `position: relative`，
   让返回键/标题脱离 nav 的定位上下文，两者同时成立。
2. **inline 元素的高度由 font-size 决定，而非 line-height**。
   金标准中 `span` 的高度为 23/16/15/14 等值，必须 `display: inline-block` + 显式 `line-height`。
3. **图标必须用真实字形**。`public/assets/font/uview-icon.woff2` 的 cmap 已用 fontTools 校验，
   含本批次所需全部码点（`e60e` 返回 / `e601` 助力 / `e62f` 空态 / `e881` iOS /
   `e67d` 安卓 / `e605` 箭头），因此统一 `@font-face { font-family:'uview-icon' }` + `::before content`，
   而非 fallback 字形；同时用 `display:block` + 显式宽高控制盒子尺寸。
4. **原站的几何怪癖须原样保留**（不"修正"）：
   - 公告搜索页「搜索」按钮 `x=378, w=28`，溢出视口右缘；
   - 寄售搜索页搜索框 299px 宽、「搜索」按钮 `x=354.5`；
   - 邀请页 tab `162×31`（非内容自适应）、邀请码块相对卡体内缩 12px；
   - 下载页 tag 胶囊两行不规则换行（宽 100/122/111，y=321/321/353）。
5. **`background` 简写会覆盖 `background-color`**：下载页需要同时断言
   `background-color: rgb(13,11,31)` 与渐变图，必须拆成 `background-color` + `background-image` 两行。
6. **flex 容器内的 `space-around` / `space-between` 会重排子项位置**：
   商城页两个入口的 `x`（31 / 215）与活动商城两个商品的 `x`（14 / 193）
   需改用 `flex-start` + 固定 margin / `gap` 才能复刻原站坐标。

### 10.25.6 下载页（index/downloadApp）结构重构记录

第 4 节验收达成 158/0 后，通过原站↔复刻并排对比图（`docs/verify/p0-compare/cmp_da.png`）
发现下载页存在**结构性差异**（并非坐标误差），因此按原站 `download_app.html` 的真实 DOM 层级
做了一次整体重构，重构后重新验收仍保持 20/20 PASS。

**原站关键结构层（复刻已补齐）**：

| 结构层 | 几何（390 宽视口） | 复刻实现 |
|---|---|---|
| `logo-card` 白色半透明圆角卡片 | `left=148.5, top=95.5, 93×93`, `rgba(255,255,255,.14)`, `br=22px` | `.da-logo__card` |
| `logo` 图标本体 | `78×78`, `br=10px` | `.da-logo__img` |
| `brand__dot` 品牌名前圆点 | `4×4`, `#ffd854` | `.da-brand__dot` |
| `tag` 胶囊标签 | 固定宽 `100 / 122 / 111`，两行 `y=321 / 321 / 353` | `.da-tag` + `nth-child` 宽度 |
| `panel` 白色 10% 面板 | `left=20, top=408, 350×299`, `br=20px`, `padding=26px 18px 16px` | `.da-panel` |
| 按钮图标方框 | `40×40`, `br=12px`, `rgba(255,255,255,.18)` | `.da-btn__icon-box` |
| 按钮箭头圆形底座 | `29×29` 圆形 | `.da-btn__arrow-box` |
| `tip` 黄色提示条 | `margin-top=17px, 314×38`, `rgba(255,216,84,.12)`, 边框 `rgba(255,216,84,.3)`, `br=10px` | `.da-warn` |
| `footer` 包裹 | `absolute, top=733` | `.da-footer` |

**重构中修正的 2 条断言**：`.da-warn` 存在 `1px` 边框，原写 `padding: 0 12px` 使图标起点落在
`38+1+12=51`（断言期望 50）。改为 `padding: 0 11px` 后图标 `x=50`、文字 `x=50+12+6=68`，
与金标准一致。最终回归：**158 PASS / 0 FAIL**、64 路由冒烟 `FAIL COUNT = 0`、`vite build ✓ built in 2.09s`。

**教训**：像素级验收的断言只覆盖"数值坐标"，无法覆盖"层级结构缺失"。
对比图是发现此类差异的唯一有效手段，应在每个批次收尾时逐页人工过图。

---

## 10.26 商城批次：6 个页面接口（`pages/shop/*`，2026-10-25）

本批次补齐商城模块剩余 6 个页面（`shop/detailList`、`shop/detail/collection`、`shop/detail/box`、
`shop/detail/goods`、`shop/record`、`shop/exchange`），并修正 `shop/shop` 的跳转与主题参数支持。
所有端点均取自原站 `static/js/pages-shop-*.js` chunk 逆向 + 登录态实调双重确认。

### 10.26.1 端点总表

| # | 端点 | 方法 | 请求体 | 页面 | 实调响应 |
|---|---|---|---|---|---|
| 1 | `/crystal_goods/list` | POST | `{ type:"10", page:1, crystal_type:"blue" }` | `shop/shop` | `code:1`，`data:{total:0,per_page:15,current_page:1,last_page:0,data:[]}` |
| 2 | `/crystal_goods/crystalDetail` | POST | `{ page, cat, type, m }` | `shop/detailList` | `code:1`，`data` 同上（全 0） |
| 3 | `/crystal_goods/exchangeRecord` | POST | `{ page:1 }` | `shop/record` | `code:1`，`data` 同上（全 0） |
| 4 | `/crystal_goods/info` | POST | `{ goods_id, id, batch_id, blind_box_id }` | `shop/detail/{collection\|box\|goods}` | `code:0`，`msg:"商品不存在"`，`data:null` |
| 5 | `/crystal_goods/exchange` | POST | 兑换提交 | `shop/exchange` 提交动作 | 原站无商品故未触发 |
| 6 | `/crystal_goods/getCardCode` | POST | `{ id }` | E 卡密码（`order/defaultDetail` 复用） | 已有封装 `getECardPass` |

域名与请求头（沿用全站统一约定）：

- 基础域名 `https://apinew.hfeyusheng.top/api`（**注意**：与页面域名 `dadaqif.hfeyusheng.top` 不同）
- 请求头仅需 `token` + `version: 1.1.2` + `Content-Type: application/json`
- **原站实际不携带 `sign` 头**（对 `md5(path + METHOD)` 逐条反推均不匹配，Playwright 捕获到的 sign 头全为 `None`），
  故复刻不生成签名，登录后直接带 token 调用即可

### 10.26.2 登录细节：token 在 `data.userinfo.token`

原站登录 `POST /user/login`，body 为 `{ account, password, inviter_code }`（**不是** `username`）：

```json
{ "code": 1, "data": { "userinfo": { "token": "…", "id": 38, … } } }
```

踩坑记录：初次探测取 `data.token` 得到 `None`，导致后续所有接口返回「请登录后操作」；
正确路径是 `data.userinfo.token`。账号 `17587881293` / `whm981004` 实调可用。

### 10.26.3 `crystalDetail` 的三组筛选参数

| 参数 | 取值 | 含义 |
|---|---|---|
| `cat` | `""` / `"1"` / `"-1"` | 全部 / 水晶获取 / 水晶消耗 |
| `type` | `""` / `"yellow"` / `"purple"` / `"blue"` | 种类筛选（黄 / 紫 / 蓝水晶） |
| `m` | 月份字符串 | 时间筛选 |

原站 tab 与筛选图标的实调几何：nav 起点 `x=62`、item 宽 `104px`、下划线 `left = 62 + i*104 + 43`
（对应原站 `transform: translate(43px)`），文字 span 宽度随内容自适应（30 / 60 / 60）。

### 10.26.4 三个详情页的参数映射

三个页面共用同一端点 `/crystal_goods/info`，仅参数与 `goods_type` 不同：

| 页面 | 参数 | goods_type |
|---|---|---|
| `shop/detail/collection` | `{ goods_id, id: collection_id, batch_id }` | 2 |
| `shop/detail/box` | `{ goods_id, id: blind_box_id }` | 1 |
| `shop/detail/goods` | `{ goods_id }` | 3 |

**原站当前无上架商品**，三个端点均返回 `code:0 / 商品不存在`，原站 `catch` 后执行
`setTimeout(backPage, 1500)` 回退上一页（抓取时抓到的是首页）。复刻保持同一行为：
`catch` → `setTimeout(backPage, 1500)`，不做任何内容臆造。

### 10.26.5 `shop/exchange` 的数据来源：本地 storage

原站不调接口取兑换商品，而是读 `uni.getStorageSync('exchange')` → `{ count, info }`。
**无 storage 时原站渲染完全空白**（文本长度 0），因此复刻用 `v-if="product && product.id"` 控制整块渲染，
空白态与原站严格一致，而不是画一个占位表单。

### 10.26.6 `shop/shop` 的 chunk 逆向结论（修正先入为主的判断）

从 `static/js/pages-shop-*.js` 提取的组件 options 中虽定义了 `tabList` / `tabList2`，
但 **render 函数里并未渲染 u-tabs** —— 原站 UI 上没有 tab，单列表结构才是真实的。
据此放弃"重构双 tab"方案，仅做两处修正：

1. `info-v`（龙晶详情）点击 → `$u.route('/pages/shop/record')`
2. `get-v`（获取龙晶）点击 → `refresh()`；`rule-v` 点击 → `$u.route('/pages/rules/rules', { type: 3 })`

### 10.26.7 水晶主题映射

原站按 `crystal_type` 切换标题 / 返回键 / 装饰图：

| crystal_type | 标题 | 返回键 | 装饰图 |
|---|---|---|---|
| `yellow` | 凤羽 | `back-btn-blank.png` | `crystal_yellow` |
| `blue` | 龙晶 | `back-btn2.png` | `crystal_blue` |
| 其他（默认） | 水晶 | `back-btn.png` | `crystal_purple` |

对应原站 `getTitle` / `getleftIcon` / `getcrystal_num` 三个函数。复刻在
`views/shop/shop.vue` 中以 `crystalType` 计算属性 + `:src` 动态绑定实现。

### 10.26.8 前端封装一览（`frontend/src/api/index.js`）

| 封装 | 端点 | Mock 常量 |
|---|---|---|
| `getCrystalGoodsList` | `/crystal_goods/list` | `CRYSTAL_GOODS_LIST` |
| `getCrystalDetailList` | `/crystal_goods/crystalDetail` | `CRYSTAL_DETAIL_LIST` |
| `getCrystalExchangeRecord` | `/crystal_goods/exchangeRecord` | `CRYSTAL_EXCHANGE_RECORD` |
| `getCrystalGoodsInfo` | `/crystal_goods/info` | `CRYSTAL_GOODS_INFO`（null） |
| `getECardPass` | `/crystal_goods/getCardCode` | — |

Mock 层的 `CRYSTAL_GOODS_INFO` 刻意返回 `{ code:0, msg:'商品不存在' }`，
与原站在无商品时的响应完全一致，保证 mock 模式下同样触发 1.5s 回退。

### 10.26.9 验收记录（Playwright，iPhone 390×844 @2x）

断言脚本 `/tmp/verify/verify_shop.py`，金标准 `/tmp/verify/golden/shop/*_map.json`
（2026-10-25 抓取）。容差 ≤1.5px，字符串按子串包含比对。

| 页面 | 断言数 | PASS | FAIL | 控制台错误 |
|---|---|---|---|---|
| `shop/shop` | 17 | 17 | 0 | 0 |
| `shop/detailList` | 11 | 11 | 0 | 0 |
| `shop/record` | 5 | 5 | 0 | 0 |
| `shop/exchange` | 1 | 1 | 0 | 0 |
| **合计** | **34** | **34** | **0** | **0** |

三个详情页因原站无商品而回退首页，**不做像素断言**（金标准本身即首页，无法作为基准），
仅做结构与参数复刻 + 路由可达性验证。

全量回归：P0 批次 `158 PASS / 0 FAIL`；全站路由冒烟 `68 条 FAIL COUNT = 0`；
`npx vite build` → `✓ built in 2.16s`。

### 10.26.10 本批次沉淀

1. **原站 chunk 逆向优先于 data 定义**。`tabList`/`tabList2` 出现在 data 里不代表 UI 渲染了 tab，
   必须核对 render 函数，否则会凭空多出一排 tab（臆造）。
2. **原站「空页」也是规范的一部分**。`shop/exchange` 无 storage 时空白、三个详情页无商品时 1.5s 回退，
   都按原站复刻，不补占位内容。
3. **404 资源要用等价物替代**。原站 `right3.png`（记录页右箭头）实为 404，
   改用已校验字形图标的 `uview-icon` `e603 arrow-rightward`（见 §10.25.5 第 3 条）。
4. **u-tabs 类横向 tab 优先用绝对定位复刻**。flex 均分会把文字 span 拉伸到 item 满宽，
   导致文字 `x` 与宽度双双偏离原站，必须 `left: 62 + i*104` 硬定位。
5. **竖条 / 下划线颜色需二次核对**。原站 `.sh-section__bar` 实为 `#1b53f8`（非 `#4a4a4a`），
   首轮断言按错误值写导致 FAIL，已按金标准修正。

---

## 10.27 公告 / 盲盒 / 抽签批次：11 个页面接口（`pages/message`、`pages/notice`、`pages/blindBox`、`pages/draw`，2026-10-25）

本批次覆盖原站三大业务域的 11 个页面。**原站当前无任何业务数据**（新闻列表 `total:0`、
辟谣墙 `total:0`、开盒记录 `total:0`、抽签活动 `code:0`），因此本批次大量页面在原站就是
**空态 / 永久 loading / 空白页** —— 复刻时严格按原站现状还原，不臆造内容。

### 10.27.1 端点总表

| 端点 | 方法 | 页面 | 实调响应（2026-10-25 登录态） |
|---|---|---|---|
| `/discover/ant_news/category` | POST | `notice/notice`（已有） | `code:1` → `[{id:2,name:"陕西数字化进程"}]` |
| `/discover/ant_news/list` | POST | `notice/notice`（已有） | `code:1` → `total:0` |
| `/discover/ant_news/info` | POST | `notice/newsDetails` | `code:1` → **`data:null`** |
| `/discover/rumor_wall/list` | POST | `notice/notice`（已有） | `code:1` → `total:0` |
| `/discover/rumor_wall/info` | POST | `notice/wallDetails` | `code:1` → **`data:null`** |
| `/discover/rumor_wall/getcomment` | POST | `notice/wallDetails` | `code:1` → `total:0` |
| `/discover/rumor_wall/release` | POST | `notice/sendRumor` | `code:0, msg:"图片不能为空"` |
| `/discover/rumor_wall/comment` | POST | `notice/wallDetails`（评论） | `code:0, msg:"辟谣ID不能为空"` |
| `/box/blind_box/openlog` | POST | `blindBox/openRecord` | `code:1, msg:"开盲盒记录"` → `data:{total:0,per_page:"20",...}` |
| `/user_collection/user_collection/openbox` | POST | `blindBox/result` | `code:0, msg:"参数错误,请检查APP是否为最新版本"` |
| `/draw/draw` | POST | `draw/InvitationFriendAssist`（已有） | `code:0, msg:"活动不存在"` |
| `/draw/get` | POST | `draw/Leaderboard` | `code:0, msg:"活动不存在"` |
| `/draw/get_qualification`（`getDrawQualification`） | POST | `draw/drawResult` | `code:0` |
| `/score/get_my_share_details` | POST | `draw/communityShare`、`draw/shareCommunityGroup` | `code:1` → **`data:null`** |
| `/score/help_record`（`getHelpRecord`） | POST | `draw/communityShare` | `code:1` → `data:null` |
| `/index/getConfig`（`getShareRule`） | POST | `draw/shareCommunityGroup`（规则正文） | `data.share_rule = "<p>1.111</p><p>2.222</p>"` |
| `/score/share` | POST | `draw/communityShare` | **非 JSON 响应**（原站该接口已废弃） |

### 10.27.2 关键实调细节

1. **`data:null` ≠ 接口失败**。`ant_news/info`、`rumor_wall/info`、`score/get_my_share_details`
   三个接口均返回 `code:1` 但 `data:null`。这对应原站「详情页因为没有数据而一直转圈」的现状，
   复刻必须保留 loading 遮罩而不能渲染空列表。
2. **`per_page` 是字符串**。`/box/blind_box/openlog` 返回 `per_page:"20"`（字符串）而非数字，
   前端 mock 需保持字符串类型以免与原站响应结构漂移。
3. **`rumor_wall/release` 与 `comment` 是无鉴权副作用的 POST**，仅做参数校验（"图片不能为空" /
   "辟谣ID不能为空"），可用于验证表单校验逻辑，不落库。
4. **`/score/share` 返回非 JSON**（实测为 HTML/空体），原站该入口已不可用，
   `draw/communityShare` 的「分享图片」按钮改为纯前端提示。

### 10.27.3 两种导航栏形态（本批次最重要的视觉区分）

原站同批 11 页使用了**三种**导航实现，混用会导致像素偏差：

| 形态 | 实现 | 返回图标 | 标题 | 使用页面 |
|---|---|---|---|---|
| **uni 原生导航** | `uni-page-head` | `uview-icon` `e601`，27×27 @(5,6.5) | 16px bold @(70,7,250,30) | `message`、`drawResult`、`communityShare`、`shareCommunityGroup`、`Leaderboard` |
| **w-navbar 自定义** | `w-navbar` 44px | `back-btn.png` 24×24 @(13,10) | 15px bold #333 @(165,15.5,60,16) | `blindBox/result`、`result2`、`openRecord` |
| **diy-nav 自定义** | `diy-nav` 44px | 无返回图标 | 左「取消」14px @(16,12,28,20)，右「发表」按钮 54×29 @(320,7.5) | `sendRumor` |

其中 `blindBox` 三页导航底色为 `#fafafa`（其余为 `#fff`）。

### 10.27.4 `u-loading-page` 的 74.8px 偏移

原站 `u-loading-page` 是 `position:fixed; inset:0` + flex 居中，但 `u-loading-page__warpper`
自带下偏移，导致 spinner 整体**偏上约 74.8px**：

- `newsDetails`：spinner 26.6px @(181.7, 319.7)，text 12px #c8c8c8 @(172.5, 355.5)
- `wallDetails`：spinner 25.7px @(182.2, 320.2)
- `drawResult`：spinner 26.8px @(181.6, 319.6)

复刻统一用 `padding-bottom: 154.8px`（= 74.8 × 2）还原该偏移。

### 10.27.5 三模块页面清单与实测坐标

**公告模块（4 页）**

| 页面 | 路由 | 关键实测坐标 |
|---|---|---|
| `message/message` | `/pages/message/message` | 原站 chunk 仅 966 字节，body 完全空白，仅 `uni-page-head` 44px |
| `notice/newsDetails` | `/pages/notice/newsDetails` | 全屏 loading 遮罩 390×844，spinner 26.6px @(181.7,319.7) |
| `notice/wallDetails` | `/pages/notice/wallDetails` | 同上，spinner 25.7px @(182.2,320.2) |
| `notice/sendRumor` | `/pages/notice/sendRumor` | diy-nav；文本框 358×92 @(16,44) br20；上传盒 104×104 @(16,152) br20 bd1px；开关 node @(85,291) / bg @(93,291) |

**盲盒模块（3 页）**

| 页面 | 路由 | 关键实测坐标 |
|---|---|---|
| `blindBox/result` | `/pages/blindBox/result` | 白卡 358.8×? @(15.6,44) br9.36px；footer 88px @(0,756)；按钮 166×47 @(21,776.5) / @(187,776.5) |
| `blindBox/result2` | `/pages/blindBox/result2` | 「藏品编号：」12px #999 @(162,102,66,18)；「#」@(222,105,6,14)；footer 同上，按钮 @(21/197,776.5) |
| `blindBox/openRecord` | `/pages/blindBox/openRecord` | 空态图 `search-empty.png` 121×122 @(134.5,60) |

**抽签模块（4 页）**

| 页面 | 路由 | 关键实测坐标 |
|---|---|---|
| `draw/drawResult` | `/pages/draw/drawResult/drawResult` | nav 44 + 全屏 loading，spinner 26.8px @(181.6,319.6) |
| `draw/communityShare` | `/pages/draw/communityShare/communityShare` | 助力卡 358×56 @(16,60)；表头 y=304；空态 icon 90px @(150,358)；规则卡 358×66 @(16,504)；提交 352×47 @(19.5,782) |
| `draw/shareCommunityGroup` | `/pages/draw/shareCommunityGroup/shareCommunityGroup` | 积分卡 358×56 @(16,60)；规则卡 358×94 @(16,343)；提交 358×45 @(16,453) |
| `draw/Leaderboard` | `/pages/draw/Leaderboard/Leaderboard` | 人数卡 390×56 @(0,60)；u-gap 122px；白底 390×92 @(0,752)；按钮 374.4×47 @(7.8,767) |

### 10.27.6 前端封装一览（`frontend/src/api/index.js`）

新增 12 个：

```js
getAntNewsCategory()          // GET/POST /discover/ant_news/category
getAntNewsList(payload)       // /discover/ant_news/list
getAntNewsInfo(payload)       // /discover/ant_news/info
getRumorWallList(payload)     // /discover/rumor_wall/list
getRumorWallInfo(payload)     // /discover/rumor_wall/info
getRumorWallComment(payload)  // /discover/rumor_wall/getcomment
postRumorWallComment(payload) // /discover/rumor_wall/comment
releaseRumorWall(payload)     // /discover/rumor_wall/release
getDrawQualification(payload) // 中签结果查询
getMyShareDetails()           // /score/get_my_share_details
getHelpRecord()               // 助力记录
getShareRule()                // /index/getConfig
```

增强已有 2 个：`getOpenRecord`（补 `list_rows:20` 与正确的 mock 结构）、
`getDrawInfo`（补 `id` 入参与 `DRAW_LEADERBOARD` mock）。

Mock 常量新增 12 个（`frontend/src/api/mock.js`）：`ANT_NEWS_CATEGORY`、`ANT_NEWS_LIST`、
`ANT_NEWS_INFO`、`RUMOR_WALL_LIST`、`RUMOR_WALL_INFO`、`RUMOR_WALL_COMMENT`、
`BLIND_BOX_OPEN_LOG`、`DRAW_QUALIFICATION`、`DRAW_LEADERBOARD`、`SHARE_DETAILS`、
`HELP_RECORD`、`SHARE_RULE_HTML`。

### 10.27.7 静态资源（已从原站下载落盘）

| 文件 | 尺寸 | 用途 |
|---|---|---|
| `public/assets/img/m3/icon/img.png` | 64×64 | 发表页上传图标 |
| `public/assets/img/m3/icon/IconAdd.webp` | 16×16 | 分享页上传格加号 |
| `public/assets/img/m3/icon/back-btn.png` | 48×48 | 盲盒三页返回箭头 |
| `public/assets/img/m3/empty/search-empty.png` | 17072 B | 开盒记录空态图 |

### 10.27.8 验收记录（Playwright，iPhone 390×844 @2x）

| 页面 | 断言数 | 结果 |
|---|---|---|
| `message/message` | 4 | PASS |
| `notice/newsDetails` | 4 | PASS |
| `notice/wallDetails` | 4 | PASS |
| `notice/sendRumor` | 10 | PASS |
| `blindBox/result` | 10 | PASS |
| `blindBox/result2` | 9 | PASS |
| `blindBox/openRecord` | 5 | PASS |
| `draw/drawResult` | 7 | PASS |
| `draw/communityShare` | 22 | PASS |
| `draw/shareCommunityGroup` | 20 | PASS |
| `draw/Leaderboard` | 11 | PASS |
| **合计** | **106** | **106 PASS / 0 FAIL** |

对比图（11 张，原站 | 复刻并排）：`docs/verify/p0-compare/cmp_m3_*.png`。

全量回归：P0 批次 `158 PASS / 0 FAIL`；商城批次 `34 PASS / 0 FAIL`；
全站路由冒烟 `80 条 FAIL COUNT = 0`；`npx vite build` → `✓ built in 2.30s`。

### 10.27.9 本批次沉淀

1. **原站空态同样是规范**。`message` 页 chunk 仅 966 字节（只有 `w-container` 空壳），
   详情页因 `data:null` 永久 loading —— 这些都要 1:1 还原，不能"优化"成友好空态。
2. **中文全角宽度会因字体回退产生 3.5px 级偏差**。原站渲染环境与本地 Times New Roman 回退下，
   「您已成功获得助力」宽度 115.5 vs 112。解决办法是给该元素显式 `width` 并让后续兄弟元素
   `position:absolute` 硬定位，而不是依赖 flex 排布的自然流。
3. **相邻 margin 会折叠，需用 padding 制造间距**。原站 `.scg-table__head` 的 `mb-16` 与
   `.boxShadow` 的 `mt-5` 折叠后只生效 16px，导致规则卡 y 偏差 5px。
   改用固定高度容器（34px）承载表头后精确落位。
4. **原站 `.content` 常是 flex 居中而非绝对定位**。`blindBox/result2` 的「藏品编号：#」
   实测块宽 66px 且 `justify-content:center`，`(390-66)/2 = 162` 即其 x 起点；
   先前用 `position:absolute; left:162` 叠加 padding-top 导致 y 偏移 44px。
5. **按钮内 68px 宽装 4 个 14px 汉字会换行**。原站 `.pa-6` 的 padding 在 68px 容器内放不下，
   需去掉水平 padding 并用 `line-height:30px` + `white-space:nowrap` 保证单行。

---

## 10.28 K线 / 抽签 / 抽奖 / 交易记录批次：6 个页面接口（`pages/kline`、`pages/activity/draw`、`pages/lottery`、`pages/market/tradingInformation`，2026-10-25）

> 本批次接口逆向方式与前几批次不同：**chunk 反编译失效，改用 Playwright 网络抓包直取权威端点**。
> 详见 §10.28.2。

### 10.28.1 端点总表

| # | 页面 | 方法 | 端点 | 请求 body | 实调结果 |
|---|---|---|---|---|---|
| 1 | `pages/kline/info` | POST | `/market/market/marketGoodsDetail` | `{ type:"2", id }` | `code 500`（该页实为商城缓存数据，不主动请求） |
| 2 | `pages/kline/buy` | POST | `/market/market/marketGoodsDetail` | `{ type:"2", id }` | 同上 |
| 3 | `pages/market/tradingInformation` | POST | `/market/trade/tradingInformation` | `{ page:1, sort:"price", id, status:1, goods_id }` | `code 1`，`today_highest_price="7.00"`、`today_lowest_price="7.00"`、`list:[]` |
| 4 | `pages/activity/draw` | POST | `/draw/get` | `{ id }` | `code 0`，`msg:"活动不存在"`，`data:null` |
| 5 | `pages/activity/draw` | POST | `/draw/drawRecord` | `{ id }` | `code 1`，`data:[]` |
| 6 | `pages/lottery/record` | POST | `/lottery/statistics` | `{ lottery_id }` | `code 1`，2 个奖品（嗒嗒会员卡 / 曜匣资格卡），`num:0` |
| 7 | `pages/lottery/record` | POST | `/lottery/record` | `{ type:10, lottery_id, page }` | `code 1`，`total 0`，`data:[]` |
| 8 | `pages/lottery/rule` | POST | `/index/getConfig` | — | `code 1`，`share_rule = "<p>1.111</p><p>2.222</p>"` |

### 10.28.2 逆向方法转折：网络抓包 > chunk grep

前几批次的逆向靠 `grep` 压缩 chunk 里的 API 路径，本批次**完全失效**：

- `kline/info`、`kline/buy` 的 chunk 被混淆拆散，grep 不到任何端点字符串；
- `lottery/rule` 同理。

改用 Playwright 监听 `page.on("request")` / `page.on("response")`，只记录
`resource_type in ("xhr","fetch")` 的请求，直接得到权威 URL、post_data 与响应体，一次性拿下 8 个端点。

**踩坑：`page.goto(整页URL)` 会复用 SPA 内存态**，导致后续页面的接口不重复触发、抓包数量异常少。
必须改用页内 SPA 路由切换：

```python
page.evaluate(f"location.hash = '#{path}'")
page.wait_for_timeout(3000)
```

**结论沉淀**：接口逆向的优先级应为「网络抓包 > 运行时 hook > chunk grep」，
chunk grep 只在无浏览器环境时作为兜底。

### 10.28.3 原站请求头的最终形态

本批次实测确认，原站 XHR **只带 3 个头**：

```
token: <data.userinfo.token>
version: 1.1.2
Content-Type: application/json
```

**不带 `sign` 头**（此前批次推测需要 sign，实测证伪）。登录 token 仍在 `data.userinfo.token`。

### 10.28.4 四种导航栏形态（本批次最重要的视觉区分）

| 形态 | 特征 | 用例 |
|---|---|---|
| uni 原生导航 `uni-page-head` | 白底 44px，返回 icon 27px @(5,6.5)，标题 16px bold @(70,7,250,30) | 历史批次 |
| `w-navbar` 自定义 | 返回 `back-btn.png` 24×24 @(13,10)，标题 15px bold @(165,15.5,60,16) | `lottery/rule` |
| `diy-nav` 自定义 | sendRumor 专用 | `notice/sendRumor` |
| **本批 `u-navbar` 深色** | `rgb(35,39,68)` 44px，标题 15px bold #fff 居中 @(180,15.5,30,16)，右上操作 12px #fff @(329,13,48,18) | `kline/info`、`kline/buy`、`tradingInformation`、`lottery/record` |

`u-navbar` 内部结构（实测）：

- 左侧返回：`div` 24×24 @(13,10)，`background-image: url(/static/icon/back-btn-white.png)`
  （`kline/info` 用 `back-btn2.png`，`activity/draw` 用 iconfont `uicon-arrow-left` 20×20 @(13,12)）
- 标题：`uni-text` 宽 208px 居中，内 `span` 实际宽 30/60/64px
- 右侧操作：`u-navbar__content__right` 74×44 @(316,0)，内操作文字 @(329,13,48,18)

### 10.28.5 六页实测坐标表

| 页面 | 元素 | x | y | w | h | 其他 |
|---|---|---|---|---|---|---|
| kline/info | `.ki-nav` | 0 | 0 | 390 | 44 | bg `rgb(35,39,68)` |
| kline/info | `.ki-swiper` | 0 | 44 | 390 | 191 | 图片 364×179 @(13,52) br10px |
| kline/info | `.ki-tabs` | 0 | 399 | 390 | 21 | **absolute top:399px** |
| kline/info | `.ki-tabs__line` | 34.5 | 415 | 35 | 3 | bg `/static/bg/vector.png` |
| kline/info | `.ki-bottom` | 16 | 793.5 | 149 | 39 | **absolute bottom:12px**，br26px |
| kline/buy | `.kb-swiper` 图片 | 16 | 44 | 358 | 179 | br10px |
| kline/buy | `.kb-body` | 0 | 224 | 390 | — | **absolute top:224px**，bg `rgb(51,51,51)` |
| kline/buy | `.kb-tabs__item` | 16/58/130 | 273 | 30/60/45 | 16 | `top:0`（kb-body 224 + price-row 49） |
| activity/draw | `.ad-card` | 15 | 62 | 360 | 98 | bg `rgb(29,29,32)` br15px bd 1px `rgb(68,68,68)` |
| activity/draw | `.ad-tl-item` | 15 / 198.6 | 216 / 277 | 176.4 | 46 | bg `rgb(32,32,36)` br13px |
| activity/draw | `.ad-code` | 15 | 353 | 357 | 123 | **margin-top:30px** |
| activity/draw | `.ad-invite` | 15 | 531 | 360 | 123 | bg `rgb(28,28,32)` br15px |
| activity/draw | `.ad-rule` | 15 | 669 | 360 | 71 | — |
| activity/draw | `.ad-toast` | 142.5 | 402.5 | 105 | 39 | bg `rgba(17,17,17,0.7)` br5px |
| lottery/record | `.lr-prize__thumb` | 44 | 168 | 52 | 52 | 圆形，**left:12px; top:8px** |
| lottery/record | `.lr-prize__meta` | 108 | 176 | — | — | **left:76px; top:16px** |
| lottery/record | `.lr-table-head` | — | 462.5 | — | — | **top:111.5px** |
| lottery/rule | `.lrul-card` | 16 | 59 | 358 | 675.2 | bg `#fff` br12px bd 1px `rgb(231,231,234)` |
| lottery/rule | `.lrul-card__title` | 161 | 85 | 68 | 19 | **absolute left:145px; top:26px; width:68px** |
| market/tradingInformation | `.ti-card` | 17 | 52 | 356 | 122 | bg `#fff` br9px |
| market/tradingInformation | `.ti-stat--volume .ti-stat__value` | 246.1 | — | — | 16 | **height/line-height 16px; margin-top 6px** |
| market/tradingInformation | `.ti-currency` | — | 99 | — | — | **top:-13px**（row2 起点 112） |

### 10.28.6 `lottery/rule` 页的正文与四角装饰（本次实测修正）

原站 `pages/lottery/rule`：

- 卡片内容容器 `#_root` 实测 **`innerHTML` 为空**（虽然 `/index/getConfig` 的 `share_rule` 有值），
  故该页**只渲染「规则详情」标题**，不渲染正文 —— 复刻必须照此实现，不能"贴心地"把 `share_rule` 渲染出来。
- 卡片四角的淡粉装饰来自 `.content` 的 **`::before` / `::after` 伪元素**，不是真实 DOM 节点：

```css
.content::before { content:''; position:absolute; left:271px; top:0; width:85px; height:45px;
                   background:url(/static/cj/21.webp) 0 0/100% 100%; }
.content::after  { content:''; position:absolute; left:0; top:628.188px; width:85px; height:45px;
                   background:url(/static/cj/22.webp) 0 0/100% 100%; }
```

- 标题行 `uni-text` 两侧各有一个 23×6 的 `uni-image`（`background-image: none`，即**不渲染**），
  故只需还原文字本身。

### 10.28.7 `tradingInformation` 背景图的确切参数

原站 `.market-bg` 实测：`background-size: 100%`、`background-repeat: no-repeat`、
`background-position: 0% 0%`、底色 `rgb(245,245,245)`。

即 750×570 的 `page-bg.webp` 按宽度 390 等比缩放为 390×296.4，**渐变只覆盖页面上部**，
下方为纯 `rgb(245,245,245)`。若误用 `cover` 会让渐变延伸到页面中部（复刻初版即如此，已修正）。

### 10.28.8 原站的「视觉 bug」也是规范

| 位置 | 现象 | 判定 |
|---|---|---|
| `kline/info`「藏品名称」 | 白字落在浅灰底上，实测不可见 | 原站即如此，照抄 |
| `kline/buy`「112.34CNY」 | `rgb(51,51,51)` 与卡片底色同色，不可见 | 原站即如此，照抄 |
| `activity/draw`「每成功邀请 ␣ 位新用户」 | 中间数字为空（`invite_per_code` 为空串） | 原站即如此，留白 |

**不应「修正」原站的视觉缺陷，也不应「补全」原站缺失的数据。**

### 10.28.9 前端封装一览（`frontend/src/api/index.js`）

| 封装函数 | 端点 | Mock 常量 |
|---|---|---|
| `getKlineInfo(params)` | `/market/market/marketGoodsDetail` | `KLINE_INFO` |
| `getKlineBuy(params)` | `/market/market/marketGoodsDetail` | `KLINE_BUY` |
| `getTradingInformation(params)` | `/market/trade/tradingInformation` | `TRADING_INFORMATION` |
| `getDrawActivity(params)` | `/draw/get` | `DRAW_ACTIVITY` |
| `getDrawActivityRecord(params)` | `/draw/drawRecord` | `[]` |
| `getLotteryPrizeList(params)` | `/lottery/statistics` | `LOTTERY_PRIZE_LIST` |
| `getLotteryDrawLog(params)` | `/lottery/record` | `LOTTERY_DRAW_LOG` |
| `getLotteryRule()` | `/index/getConfig` | `SHARE_RULE_HTML` |

6 个 Mock 常量位于 `frontend/src/api/mock.js`（`KLINE_INFO` / `KLINE_BUY` / `TRADING_INFORMATION` /
`DRAW_ACTIVITY` / `LOTTERY_PRIZE_LIST` / `LOTTERY_DRAW_LOG`）。

### 10.28.10 静态资源（已从原站下载落盘 `frontend/public/`）

| 路径 | 用途 | 大小 |
|---|---|---|
| `static/icon/back-btn2.png` | kline/info 返回图标（48×48） | 400 B |
| `static/icon/back-btn.png` | lottery/rule 返回图标 | 761 B |
| `static/icon/back-btn-white.png` | kline/buy / tradingInformation / lottery/record 返回图标 | 306 B |
| `static/bg/vector.png` | kline/info tab 指示线 | 216 B |
| `static/bg/page-bg.webp` | tradingInformation 页面背景（750×570） | 53.9 KB |
| `static/empty/search-empty.png` | tradingInformation 空态（121×122） | 17.1 KB |
| `static/cj/21.webp` | lottery/rule 卡片右上角装饰 | 2.6 KB |
| `static/cj/22.webp` | lottery/rule 卡片左下角装饰 | 2.5 KB |
| `assets/img/draw/top_logo1.webp` | activity/draw 卡片 logo | 29.4 KB |
| `assets/img/kline/goods.png` | kline 双图之二（加入官方社群 banner） | 481 KB |
| `assets/img/kline/goods2.png` | kline 首图（双瑞首发 banner） | 3.39 MB |
| `assets/img/lottery/lottery-1.jpg` | 奖品缩略图 1 | 138.7 KB |
| `assets/img/lottery/lottery-2.jpg` | 奖品缩略图 2 | 320.4 KB |

**下载失败**：`https://zmwc-static.obs.cn-south-1.myhuaweicloud.com/static/icon/line.webp`
（kline/buy 激活 tab 的下划线底图，OBS 域名不可达）。已在 CSS 中保留 `url()` 引用，
文件缺失仅导致该下划线不显示，**不影响任何断言**。

### 10.28.11 验收记录（Playwright，iPhone 390×844 @2x）

脚本：`/tmp/verify/verify_m4.py`（124 项断言）、`/tmp/verify/net_m4b.py`（网络抓包）、
`/tmp/verify/mkcmp_m4.py`（生成对比图）。

| 页面 | 断言 | 结果 | 控制台错误 |
|---|---|---|---|
| `kline/info` | 30 | 30 PASS / 0 FAIL | 0 |
| `kline/buy` | 15 | 15 PASS / 0 FAIL | 0 |
| `activity/draw` | 34 | 34 PASS / 0 FAIL | 0 |
| `lottery/record` | 23 | 23 PASS / 0 FAIL | 0 |
| `lottery/rule` | 6 | 6 PASS / 0 FAIL | 0 |
| `market/tradingInformation` | 16 | 16 PASS / 0 FAIL | 0 |
| **合计** | **124** | **124 PASS / 0 FAIL** | **0** |

对比图（6 张，左=原站、右=复刻）：`docs/verify/p0-compare/cmp_m4_*.png`
（`cmp_m4_kline_info.png`、`cmp_m4_kline_buy.png`、`cmp_m4_activity_draw.png`、
`cmp_m4_lottery_record.png`、`cmp_m4_lottery_rule.png`、`cmp_m4_tradingInfo.png`）。

**对比图人工核对额外发现并修复的 4 处差异**（断言测不到，需肉眼比对）：

1. kline 首图错误 —— 原站默认展示「双瑞首发」banner，复刻首图误为「加入官方社群」。
   修正：`KLINE_INFO.images[0]` / `KLINE_BUY.images[0]` → `goods2.png`。
2. `activity/draw` 邀请数字 —— 原站中间数字为空，复刻显示 `0`。
   修正：`invite_per_code` mock 值改为 `''`。
3. `lottery/rule` 多出正文 —— 原站卡内无正文，复刻多出 `1.111 / 2.222`。
   修正：移除 `v-html` 正文渲染，并补上 `::before`/`::after` 四角装饰（21.webp / 22.webp）。
4. `tradingInformation` 背景渐变范围过长 —— 原站仅覆盖上部 296px。
   修正：`background-size: 100% auto` + `no-repeat` + `0% 0%`。

### 10.28.12 全量回归与本批次沉淀

全量回归：

| 项 | 结果 |
|---|---|
| P0 批次 | 158 PASS / 0 FAIL |
| 商城批次 | 34 PASS / 0 FAIL |
| 公告/盲盒/抽签批次 | 106 PASS / 0 FAIL |
| 我的/登录批次 | 102 PASS / 0 FAIL |
| 流水/SVIP/钱包批次 | 36 PASS / 0 FAIL |
| **本批（K线/抽签/抽奖/交易记录）** | **124 PASS / 0 FAIL** |
| **断言总计** | **560 PASS / 0 FAIL** |
| 全站路由冒烟 | 86 条，FAIL COUNT = 0 |
| `vite build` | ✓ built in 2.21s |

本批次沉淀：

1. **接口逆向优先级：网络抓包 > 运行时 hook > chunk grep**。压缩混淆会让路径字符串被拆散，
   grep 必然落空；浏览器里监听 `request`/`response` 事件是唯一稳定解法。
2. **SPA 页内路由切换才能触发独立请求**。`page.goto` 复用内存态会导致接口不重复触发，
   必须用 `location.hash = '#/pages/xxx'`。
3. **原站 XHR 不带 `sign` 头**，只需 `token` + `version` + `Content-Type`（此前推测被证伪）。
4. **装饰可能藏在伪元素里**。`lottery/rule` 的四角淡粉图案不在 DOM 中，
   必须读 `getComputedStyle(el, '::before')` 才能发现。
5. **原站「有值但不渲染」很常见**。`share_rule` 有内容但 `#_root` 为空 —— 此时不渲染才是正确复刻。
6. **`background-size: cover` 是万能错**。原站多用 `100%`（按宽度等比），
   需逐页读 `backgroundSize` 实测值。
7. **肉眼比对是断言的补充而非替代**。本批 124 项断言全 PASS 的前提下，
   对比图仍暴露 4 处真实差异（首图顺序、空数字、多余正文、渐变范围）。

---

## 10.29 合成 / 榜单批次：8 个页面接口（`pages/compound`、`pages/rules`、`pages/rank`、`pages/leaderboard`，2026-10-26）

> 本批次延续 §10.28.2 的**网络抓包法**（`page.on("request"/"response")` + 页内 `location.hash` 切换），
> 一次性拿下 7 个业务端点。8 个页面中有 **6 个是空态 / 异常态**，这是原站的真实形态，复刻必须照抄。

### 10.29.1 端点总表

| # | 页面 | 方法 | 端点 | 请求 body | 实调结果 |
|---|---|---|---|---|---|
| 1 | `pages/compound/compound` | POST | `/synthesis/themeinfo` | `{ thm:0 }` | `code 1`，`msg:""`，`data:null` |
| 2 | `pages/compound/record` | POST | `/synthesis/recordList` | `{ page:1 }` | `code 1`，`total:0`，`data:[]` |
| 3 | `pages/compound/result` | POST | `/synthesis/recordInfo` | `{}` | **`code 0`**，`msg:"记录不存在"`，`data:null` |
| 4 | `pages/rank/rankList` | POST | `/user/newrank1` | `{}` | `code 1`，`{ headUser:[], list:[], rank1:[], rank2:[] }` |
| 5 | `pages/rank/userBuy` | POST | `/user/masterinfo` | `{}` | `code 1`，`data:[]` |
| 6 | `pages/rank/masterRank` | POST | `/user/masterlist` | `{ page:1 }` | `code 1`，`data:[]` |
| 7 | `pages/leaderboard/leaderboard` | POST | `/user/ranking` | `{ types:1 }` | `code 1`，`{ data:[], my:"", activityRule:"" }` |

补充：`/user/getUserInfo` 在每次路由切换后被自动调用一次（非本批页面特有，通用行为）。

### 10.29.2 原站「有值但接口失败也照常渲染」

`compound/result` 的 `/synthesis/recordInfo` 返回 **`code 0`「记录不存在」**，
但原站**依然完整渲染成功态骨架**（礼盒图 + 「恭喜您合成成功」+ 提示卡 + 底部双按钮）。

> 复刻要点：**接口失败不等于页面空白**。`result.vue` 中 `getSynthesisRecordInfo` 的 catch
> 分支必须静默吞掉错误，UI 一动不动。

### 10.29.3 `synthesis/themeinfo` 的 `thm` 参数

同一端点在原站有两个取值：

| 调用方 | `thm` | 用途 |
|---|---|---|
| `pages/compound/compound`（合成首页） | `0` | 主题概览 → 实调 `data:null` |
| 合成方案详情 `pages/compound/schemeDetails`（P0 批次已有） | `1` | 方案列表 |

前端封装 `getSynthesisTheme(thm = 1)` 复用同一函数，合成首页显式传 `getSynthesisTheme(0)`。

### 10.29.4 八页实测坐标表（390×844，iPhone @2x）

| 页面 | 关键元素 | 坐标 (x, y, w, h) | 背景 / 颜色 |
|---|---|---|---|
| `compound/compound` | `.cc-loading` 遮罩 | (172.5, 323.5, 45, 47) | 页底 `rgb(247,247,248)` |
| | spinner | (185.5, 323.5, 19, 19) | opacity 渐变动画 |
| | 「加载中...」 | (172.5, 352.5, 45, 18) | 12px `rgb(200,200,200)` |
| `compound/record` | `.cr-nav` | (0, 0, 390, 44) | `rgb(250,250,250)` |
| | 返回 `back-btn.png` | (13, 10, 24, 24) | |
| | 标题「活动记录」 | (165, 16, 60, 16) | 15px bold `rgb(51,51,51)` |
| | 空态插画 | (134.5, 148, 121, 122) | `search-empty.png` |
| `rules/rules` | `.rr-card` | (15, 59, 360, 422) | `#fff`，br 12px，bd 1px `rgb(231,231,234)`，卡内全空 |
| `compound/result` | `.crs-box` 礼盒 | (90, 64, 210, 162) | `result-box.webp` |
| | 「恭喜您合成成功」 | (135.5, 296, 119, 23) | 18px `rgb(3,139,255)`，**书法体 YouSheBiaoTiHei** |
| | 提示卡 | (16, 350, 358, 128) | `#fff` br 15px |
| | 卡内文字 | (126.8, 382, 136.5, 19) | 13px bold `rgb(85,85,85)` |
| | 分割装饰 | (33, 419, 324, 15) | 内联 base64 webp |
| | 底部条 | (0, 775, 390, 69) | `#fff` br 20px |
| | 「水晶商城」/「再合一次」 | (21, 786, 166, 47) / (203, 786, 166, 47) | `rgb(240,240,242)` / `rgb(33,28,20)` |
| `rank/rankList` | `.rl-page` | (0, 0, 390, 880) | `rgb(247,247,248)`（**见 §10.29.6**） |
| | 返回 `back-btn-white.png` | (13, 10, 24, 24) | |
| | 顶部装饰 | (97.5, 208, 195, 79) | `rank-time-bg.webp` |
| | 装饰内文字 | (142.5, 234, 105, 15) | 14px bold `#fff` |
| | 榜单卡 | (16, 287, 353, 593) | `rank-list-bg.webp`，br 8px |
| | 表头 排名/用户/市场影响力 | (16,294,94,15) / (110,294,131,15) / (241,294,128,15) | 10px `#fff` |
| | 问号图标 | (328, 294.5, 14, 14) | `q.png` |
| | 空态插画 | (132, 332, 121, 122) | `search-empty.png` |
| `rank/userBuy` | `.ub-nav` | (0, 0, 390, 44) | 返回 `back-btn2.png` (13,10,24,24) |
| | 标题「买入清单」 | (165, 16, 60, 16) | 15px bold `#fff` |
| | `.ub-list` 白卡 | (13, 77, 364, 740) | `#fff` br 12px |
| `rank/masterRank` | 整页 | (0, 0, 390, 844) | `rgb(26,16,2)` 纯深棕 |
| | 返回 `back-btn-white.png` | (13, 10, 24, 24) | |
| | 标题「大师动态」 | (165, 16, 60, 16) | 15px bold `#fff` |
| `leaderboard/leaderboard` | `.lb-page` | (0, 0, 390, 844) | `rgb(243,243,243)` + `qd-bg.webp` |
| | 返回 `back-btn-gray.png` | (13, 12.5, 19, 19) | |
| | 榜单区 | (18, 238, 354, 358) | |
| | 装饰条 | (120.5, 264, 149, 37) | `sx-time-bg.webp`，文字 13px bold `#fff` |
| | 表头 排名/用户/魅力值 | (36,301,55,18) / (91,301,201.8,18) / (292.8,301,61.2,18) | 12px bold `rgb(70,66,76)` |
| | 问号图标 | (342, 303, 12, 12) | `bangzhu.webp` |
| | 空态插画 | (134.5, 339, 121, 122) | `search-empty.png` |
| | 底部蓝条 | (0, 596, 390, 83) | `rgb(75,148,255)` |
| | 头像 / 昵称 / 数值 | (29,618,39,39) / (75,617,10,17) / (75,642,10,16) | 默认头像 base64 落盘 |
| | 「暂未上榜」 | (309, 628, 52, 19) | 13px bold `#fff` |

### 10.29.5 前端封装一览（`frontend/src/api/index.js`）

| 函数 | 端点 | 默认 body | Mock 常量 |
|---|---|---|---|
| `getSynthesisTheme(thm)` | `/synthesis/themeinfo` | `{ thm }` | `SYNTHESIS_THEME`（**沿用已有**，thm=1 方案列表） |
| `getSynthesisRecordList(params)` | `/synthesis/recordList` | `{ page:1, ...params }` | `SYNTHESIS_RECORD_LIST` |
| `getSynthesisRecordInfo(params)` | `/synthesis/recordInfo` | `params` | `SYNTHESIS_RECORD_INFO`（`data:null`） |
| `getUserNewRank(params)` | `/user/newrank1` | `params` | `USER_NEW_RANK` |
| `getUserMasterInfo(params)` | `/user/masterinfo` | `params` | `USER_MASTER_INFO`（`[]`） |
| `getUserMasterList(params)` | `/user/masterlist` | `{ page:1, ...params }` | `USER_MASTER_LIST`（`[]`） |
| `getUserRanking(params)` | `/user/ranking` | `{ types:1, ...params }` | `USER_RANKING`（`{data:[],my:"",activityRule:""}`） |

> 注意：`getSynthesisTheme` 原已存在（thm=1，合成方案详情用），本批**复用**，
> 不再重复导出 —— 曾因重复导出导致 `vite build` 失败。

### 10.29.6 龙虎榜整页背景的真相（断言测不到，靠对比图发现）

原站 `.rank` 元素的 `background-image` 明确是 `/static/bg/dragonTigerList1.webp`（596×1290，
`background-size: 100%`）。但**原站截图整页是浅灰白 `rgb(247,247,248)`，完全没有牛头**。

原因：`.rank` 内部有一个 `.container.page-container.page-bg` 子元素，
其 `background-color: rgb(247,247,248)` **不透明**，尺寸 390×880 **整页覆盖**了父级的背景图。

> 复刻要点：**背景图存在 ≠ 背景图可见**。必须看父子层叠关系 + 不透明底色。
> 若直接照抄 `background-image`，复刻会出现整页牛头，与原站差异高达 **40% 强差异像素**。
> 修正方案：`.rl-page` 只保留 `background: rgb(247,247,248)`，不铺牛头图。

同理 `rank/userBuy` 与 `leaderboard/leaderboard` 使用同一张 `qd-bg.webp`，
该页背景图**可见**（`background-size: 100%`），照抄即可。

### 10.29.7 「恭喜您合成成功」使用书法体 YouSheBiaoTiHei

原站该行 DOM 为：

```html
<uni-view style="color: rgb(3, 139, 255); font-size: 18px; font-family: YouSheBiaoTiHei; margin-bottom: 31px;">恭喜您合成成功</uni-view>
```

- `font-weight` 实测 **400**（不是粗体）
- 字体族 `YouSheBiaoTiHei`（禹卫书法体黑），原站文件 `/static/font/YouSheBiaoTiHei-2.ttf`（1.35MB）

**处理方式**（与项目既有 `Alibaba-PuHuiTi` 字体处理一致）：

1. 从原站下载 `YouSheBiaoTiHei-2.ttf`（1,414,784 字节）；
2. 用 `fontTools.subset` 按用字子集化为 woff2（仅「恭喜您合成成功」7 字 → **1,084 字节**）：
   ```bash
   python3 -m fontTools.subset YouSheBiaoTiHei-2.ttf \
     --text="恭喜您合成成功" --output-file=public/assets/font/YouSheBiaoTiHei.woff2 \
     --flavor=woff2 --layout-features='' --hinting
   ```
3. 在 `global.css` 增补 `@font-face`，页面按需 `font-family: YouSheBiaoTiHei, serif`。

修正前该行文字宽 126px（溢出 119px 容器并换行），修正后与原站一致（单行居中）。

### 10.29.8 静态资源（已从原站下载落盘 `frontend/public/`）

| 路径 | 体积 | 用途 |
|---|---|---|
| `static/bg/dragonTigerList1.webp` | 21.8KB | 龙虎榜整页背景（**实际被遮挡，未使用**） |
| `static/image/rank/rank-time-bg.webp` | 13.3KB | 龙虎榜顶部牛角装饰条 |
| `static/bg/rank-list-bg.webp` | 10.8KB | 龙虎榜榜单卡（深色斜纹） |
| `static/icon/q.png` | 1.0KB | 龙虎榜问号图标 |
| `static/image/leaderboard/qd-bg.webp` | 38.9KB | 排行榜 / 买入清单背景（可见） |
| `static/icon/back-btn-gray.png` | 1.8KB | 排行榜返回图标 |
| `static/image/leaderboard/sx-time-bg.webp` | 4.7KB | 排行榜顶部装饰条 |
| `static/image/leaderboard/bangzhu.webp` | 554B | 排行榜问号图标 |
| `static/compose/result-box.webp` | 48.8KB | 合成结果礼盒图 |
| `assets/img/m5/leaderboard_0.jpg` | 2.7KB | 默认头像（运行时 base64 提取落盘） |
| `assets/img/m5/compound_result_0.webp` | 2.4KB | 合成结果分割装饰（运行时 base64 提取落盘） |
| `assets/font/YouSheBiaoTiHei.woff2` | 1.1KB | 书法体子集（新增） |

### 10.29.9 验收记录（Playwright，iPhone 390×844 @2x）

脚本：`/tmp/verify/verify_m5.py`（63 项断言）、`/tmp/verify/net_m5.py`（网络抓包）、
`/tmp/verify/shot_m5.py`（金标准）、`/tmp/verify/probe_m5c.py`（几何探测）、
`/tmp/verify/mkcmp_m5.py`（对比图）、`/tmp/verify/diff_m5.py`（像素差异热力图）。

| 页面 | 断言 | 结果 | 控制台错误 |
|---|---|---|---|
| `compound/compound` | 4 | 4 PASS / 0 FAIL | 0 |
| `compound/record` | 6 | 6 PASS / 0 FAIL | 0 |
| `rules/rules` | 5 | 5 PASS / 0 FAIL | 0 |
| `compound/result` | 12 | 12 PASS / 0 FAIL | 0 |
| `rank/rankList` | 11 | 11 PASS / 0 FAIL | 0 |
| `rank/userBuy` | 5 | 5 PASS / 0 FAIL | 0 |
| `rank/masterRank` | 4 | 4 PASS / 0 FAIL | 0 |
| `leaderboard/leaderboard` | 16 | 16 PASS / 0 FAIL | 0 |
| **合计** | **63** | **63 PASS / 0 FAIL** | **0** |

对比图（8 张，左=原站、右=复刻）：`docs/verify/p0-compare/cmp_m5_*.png`
差异热力图：`docs/verify/p0-compare/diff_m5_*.png`

**对比图人工核对额外发现并修复的 5 处差异**（断言测不到）：

| # | 页面 | 问题 | 修正 |
|---|---|---|---|
| 1 | `rank/rankList` | 整页铺了牛头背景图，原站是浅灰白 | 见 §10.29.6，`.rl-page` 改为纯色 |
| 2 | `rank/rankList` | 装饰条文字顶到容器顶端（y=208） | 原站文字实际在 y=234，改为绝对定位 `top:26px` |
| 3 | `compound/result` | 「恭喜您合成成功」被加粗 + 换行成两行 | 原站 fw=400 + 书法体，见 §10.29.7 |
| 4 | `compound/result` | 卡内文字与分割线整体偏移 1px | 修正 1px 边框补偿（`left/top` 减 1） |
| 5 | `leaderboard/leaderboard` | 装饰条文字溢出条外、底栏「暂未上榜」右对齐 | 原站文字居中且不换行；`is_sahngban` 为 `text-align:left` |

### 10.29.10 全量回归与本批次沉淀

全量回归：

| 项 | 结果 |
|---|---|
| P0 批次 | 158 PASS / 0 FAIL |
| 商城批次 | 34 PASS / 0 FAIL |
| 公告/盲盒/抽签批次 | 106 PASS / 0 FAIL |
| 我的/登录批次 | 102 PASS / 0 FAIL |
| 流水/SVIP/钱包批次 | 36 PASS / 0 FAIL |
| K线/抽签/抽奖/交易记录批次 | 124 PASS / 0 FAIL |
| **本批（合成/榜单）** | **63 PASS / 0 FAIL** |
| **断言总计** | **623 PASS / 0 FAIL** |
| 全站路由冒烟 | 94 条，FAIL COUNT = 0 |
| `vite build` | ✓ built in 2.51s |

本批次沉淀：

1. **「接口失败」与「页面空白」是两件事**。`/synthesis/recordInfo` 返回 `code 0` 时原站仍渲染完整成功态骨架，
   catch 分支必须静默，不能 `v-if` 切换到空态。
2. **`background-image` 存在 ≠ 可见**。龙虎榜牛头图被父容器内的不透明 `.page-container` 整页覆盖，
   照抄背景图会产生 40% 的像素差异。**必须看父子层叠关系**。
3. **原站用书法体做标题**。`YouSheBiaoTiHei` 需从原站下载并子集化（1.35MB → 1.1KB），
   字体族用错会导致文字宽度差 10px 并换行。
4. **对比图要做「像素差异热力图」量化**。`ImageChops.difference` + 阈值化能把
   「肉眼难辨」变成「差异行号区间」，快速定位是位置错还是渲染差。修复前后强差异率：
   rankList 3.92% → 0.48%，leaderboard 0.68% → 0.30%。
5. **截图必须统一 `full_page`**。原站金标准是视口截图（390×844），复刻若用 `full_page=True`
   会截出 880px 高的整页，人工对比时会产生「整块位移」的假差异。差异率一度虚高到 39.95%。
6. **`text-align` 与元素宽度的关系要按原站 DOM 抄**。原站 `is_sahngban` 是 `text-align:start`，
   复刻写成 `right` 会让文字右移 1~2px。

---

## 10.30 收尾批次：16 个页面接口（`pages/activity`、`pages/union`、`pages/rebate`、`pages/market`、`pages/webview`，2026-10-26）

> 本批次覆盖原站路由表中**最后 16 个未实现页面**，至此 109 个原站页面全部复刻完成。
> 侦察脚本 `/tmp/verify/recon_m6.py`、验收脚本 `/tmp/verify/verify_m6.py`（130 断言）、
> 对比图 `/tmp/verify/mkcmp_m6.py`、热力图 `/tmp/verify/diff_m6.py`。
>
> **本批次的 16 页中有 11 页是空态 / 异常态页面** —— 这是原站测试账号的真实状态，
> 复刻一律照抄，不补内容、不臆造列表。

### 10.30.1 端点总表

| # | 页面 | 方法 | 端点 | 请求 body | 实调结果 |
|---|---|---|---|---|---|
| 1 | `pages/activeSelected/activeSelected` | POST | `/Activity/category` | `{}` | `code 1`，`data:[]` |
| 2 | `pages/activeSelected/activeSelected` | POST | `/activity/index` | `{page:1,limit:10,category_id:1}` | `code 1`，`total:0`，`data:[]` |
| 3 | `pages/activity/record` | POST | `/draw/drawLog` | `{}` | `code 1`，`data:[]` |
| 4 | `pages/union/tradeUnion` | POST | `/union/user/myunion` | `{}` | `code 1`，`data:{config,my}`，`my.is_join=0` |
| 5 | `pages/union/unionRank` | POST | `/union/index/logs` | `{types:1,page:1,pageSize:15}` | `code 1`，`data:[]` |
| 6 | `pages/union/userRank` | POST | `/union/user/logs` | `{types:1}` | **`code 0`**，`msg:"工会不存在"`，`data:null` |
| 7 | `pages/union/news` | POST | `/union/user/message` | `{}` | **`code 500`**，`msg:"An error occurred"` |
| 8 | `pages/union/news` | POST | `/union/user/myunion` | `{}` | `code 1`（页面同时并发此请求） |
| 9 | `pages/market/categoryManager` | POST | `/index/getSeries?type=10` | `{}` | `code 1`，`data:[{series_name:"潜龙聚财",series_id:28}]` |
| 10 | `pages/market/categoryManager` | POST | `/index/getSeries?type=20` | `{}` | `code 1`，`data:[]` |
| 11 | `pages/market/categoryManager` | POST | `/index/customSeriesList` | `{}` | `code 1`，`data:{custom_series:[],platform_series:[]}` |
| 12 | `pages/rebate/rebate` | POST | `/user/commision_info` | `{}` | **响应体为空**（连接中断） |
| 13 | `pages/rebate/rebateInviteDetail` | POST | `/user/bei_yao_list` | `{}` | **响应体为空** |
| 14 | `pages/rebate/leaderboard` | POST | `/user/commison_rank` | `{type:1}` | **响应体为空** |
| 15 | `pages/certification/certificationStatus` | — | 无 | — | 纯展示页（读本地 storage） |
| 16 | `pages/market/search` | — | 无 | — | 纯前端筛选页 |
| 17 | `pages/webview/webview` | — | 无 | — | webview 壳页（读 `query.url`） |
| 18 | `pages/webview/webview-storage` | — | 无 | — | webview 壳页（读 `query.url`） |
| 19 | `pages/webview/pay-webview` | — | 无 | — | webview 壳页（读 `query.url`） |
| 20 | `pages/iart/index` | — | 无 | — | 原生 `uni-page-head` 空壳页 |

补充：`/user/getUserInfo` 在每次路由切换后被自动调用一次（通用行为，非本批特有）。

**三个返佣端点（`commision_info` / `bei_yao_list` / `commison_rank`）响应体为空**，
原站表现为 `u-loading-page` 永久遮罩。复刻按原站行为保留永久 loading，不改成错误页。

### 10.30.2 前端封装一览（`frontend/src/api/index.js`）

本批次新增 12 个 API 封装 + 15 个 mock 常量：

```js
// 活动
export function getActivityCategory()              // POST /Activity/category
export function getActivityIndex(params = {})       // POST /activity/index
export function getActivityDrawLog(params = {})     // POST /draw/drawLog  ← 注意：与已有 getDrawLog（抽签结果）同名冲突，已改名
// 工会
export function getUnionMyUnion(params = {})        // POST /union/user/myunion
export function getUnionRankLogs(params = {})       // POST /union/index/logs
export function getUnionUserLogs(params = {})       // POST /union/user/logs
export function getUnionMessage(params = {})        // POST /union/user/message
// 返佣
export function getCommissionInfo(params = {})      // POST /user/commision_info
export function getBeiYaoList(params = {})          // POST /user/bei_yao_list
export function getCommissionRank(params = {})      // POST /user/commison_rank
// 分类
export function getCategorySeries(type = 10)       // POST /index/getSeries?type=
export function getCustomSeriesList(params = {})    // POST /index/customSeriesList
```

> **命名冲突教训**：原站 `/draw/drawLog` 同时被「抽签结果」（带 `id` 参数）与
> 「中签记录」（无参数）两个页面复用，已有函数 `getDrawLog` 被占用，
> 新函数改名 `getActivityDrawLog`，并同步修正 `views/activity/record.vue` 的 import。

Mock 常量（`frontend/src/api/mock.js`）：`ACTIVITY_CATEGORY`、`ACTIVITY_INDEX`、`DRAW_LOG`、
`UNION_MY_UNION`、`UNION_RANK_LOGS`、`UNION_USER_LOGS`、`UNION_MESSAGE`、`COMMISSION_INFO`、
`BEI_YAO_LIST`、`COMMISSION_RANK`、`CATEGORY_SERIES_10`、`CATEGORY_SERIES_20`、`CUSTOM_SERIES_LIST`。

### 10.30.3 原站「有数据但不渲染」：`market/categoryManager`

`/index/getSeries?type=10` **确实返回了数据**（`潜龙聚财`，`series_id:28`），
但原站「其他分类」区是一个**空容器**（360×20，`@16,164`），不渲染任何分类项。

> 复刻要点：照抄视觉结果 —— 保留「其他分类」标题 + 下方空容器，**不要**因为接口有数据就渲染出分类芯片。

### 10.30.4 原站 404 资源回落：`activeSelected` 的两张 banner

`/static/bg/active-banner-bg1.webp` 与 `active-banner-bg2.webp` 在原站 OBS 上**已 404**
（下载得到 321 字节的 XML 错误体）。浏览器把破损 `<img>` 回落到 uView 的
`u-image__error` 占位块：**33×33 圆角块**，`background: rgb(243,244,246)`，
内含 `\ue624` 感叹号图标（16×16，`rgb(96,98,102)`）与白色文案。

> 复刻要点：不臆造 banner 文案图，直接复刻原站的**回落表现**（占位块 + 感叹号）。
> 这比放一张自造的图更接近原站真实观感。

### 10.30.5 原站 `uni-page-head` 的返回图标字体：`unibtn`

`certification/certificationStatus`、`iart/index`、3 个 webview 页使用原生
`uni-page-head`，其返回箭头是 `<i class="uni-btn-icon">`，内容为 `\e601`，
computed `font-family` = **`unibtn`**（uni-app 内置图标字体，非 uView 的 `uview-icon`）。

该字体在原站 **以 base64 内嵌在主 CSS**（`/static/index.e8e070f7.css`）中，
且是 `streamiconfont` 子集（仅 8 个码位：`e600/e601/e602/e604/e605/e606/e650/e651`）。

提取与落地流程：

```bash
# 1. 从主 CSS 正则提取 base64 → 2408 字节 TTF
python3 - <<'EOF'
import urllib.request, re, base64
css = urllib.request.urlopen('https://dadaqif.hfeyusheng.top/static/index.e8e070f7.css').read().decode()
m = re.search(r'font-family:unibtn;src:url\("data:application/octet-stream;base64,([^"]+)"\)', css)
open('/tmp/verify/unibtn.bin','wb').write(base64.b64decode(m.group(1)))
EOF

# 2. 转 woff2（无需子集化，本身只有 8 个码位）
python3 -c "
from fontTools.ttLib import TTFont
f=TTFont('/tmp/verify/unibtn.bin'); f.flavor='woff2'
f.save('/workspace/tata/frontend/public/assets/font/unibtn.woff2')"
# → 1188 字节
```

`global.css` 新增：

```css
@font-face {
  font-family: unibtn;
  src: url('/assets/font/unibtn.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
```

并给 5 处图标（`.cs-pagehead__icon` / `.ia-pagehead__icon` / `.wv-pagehead__icon`×3）
显式指定 `font-family: unibtn`。

> **效果**：补字体前 `webview` / `iart_index` 的返回箭头位置正确但字形缺失，
> 热力图左上角有明显亮点；补字体后两页**强差异像素直接归零（0.01% → 0.00%）**。
> 注意 `<i>` 元素宽度由字形决定，必须显式 `width:27px; height:27px; overflow:hidden` 才不会塌缩。

### 10.30.6 内联 base64 图标的提取法

工会权益卡的 3 个图标（手续费减免 44×44、公会成员人数 44×44、分割线 318×0.5）
在原站**不是独立 URL**，而是内联 `data:image/webp;base64,...` 写在 HTML 的
`style="background-image: url(&quot;data:image/webp;base64,...&quot;)"` 中。

提取流程（`/tmp/verify/recon_m6.py` 内置）：

```python
re.findall(r'background-image:\s*url\(&quot;data:image/webp;base64,([^&]+)&quot;\)', html)
# → 落盘 golden/m6/_inline_0..5.webp（每个资源出现 2 次：div 的 background + img 的 src）
```

> 注意 `&quot;` 是 HTML 转义，直接用 `"` 正则会漏。

### 10.30.7 十六页实测坐标表（390×844，iPhone @2x）

| 页面 | 关键元素 | 坐标 | 样式 |
|---|---|---|---|
| `activeSelected` | 返回 / 标题 | (13,10,24,24) / (165,16,60,16) | 15px bold `rgb(51,51,51)` |
| | 入口卡 1 / 卡 2 | (16,60,170,66) / (204,60,170,66) | 背景图 404 → 回落占位块 |
| | 「最新活动」/「抽奖中心」 | (93.5,82,60,22) / (281.5,82,60,22) | 15px 白 |
| | 感叹号图标 | (57,85,16,16) / (245,85,16,16) | `\ue624`，`rgb(96,98,102)` |
| | tab 指示条 | (16,131,30,5) | `u-tabs__wrapper__nav__line` |
| | 空态插画 | (134.5,242,121,122) | — |
| `activity/record` | 标题 | (165,16,60,16) | 15px bold |
| | 空容器 | (16,44,358,32) | br12px pa16px，无背景色 |
| | 空态插画 | (134.5,284,121,122) | — |
| `union/tradeUnion` | 深色背景 | `d-bg.webp` 750×650，`100% auto` no-repeat | 底色 `rgb(246,246,246)` |
| | 公会排行 / 工会商城 / 消息通知 | 图标 (347,31) / (17,82) / (347,98)，均 26×26 | `rank/ghsc/ding.webp` |
| | 大锁 / 小锁 | (166.5,103,57,57) / (187,122,16,19) | `lock.webp` / `lock-1.webp` |
| | 「您的公会未解锁」 | (139,172,112,24) | 16px bold 白 |
| | 提示语 | (101.8,212,186.5,18) | 12px 白 |
| | tab 文字 ×3 | (33,290) / (163,290) / (293,290)，各 64×24 | 16px |
| | tab 指示条 | (55,320,20,3) | 白 |
| | 权益卡 | (17,357,356,191.5) | 白底 br10px **pad26px** |
| | 手续费减免图标 / 标题 | (125,388.5,44,44) / (185,383,80,24) | 16px bold 黑 |
| | **分割线** | **(43,441,318,0.5)** | `margin:20px 0`，内联 webp |
| | 成员图标 / 标题 / 说明 | (43,481,44,44) / (103,466.5,244,24) / (103,504.5,244,18) | 说明 12px `rgb(102,102,102)` |
| `union/unionRank` | 标题 | (165,16,60,16) | 15px bold 白 |
| | 表头「排名/工会/荣誉值」 | (32,80,62,18) / (94,80,24,18) / (118,80,240,18) | 12px `rgb(255,255,255)` |
| | 说明图标 | (346,83,12,12) | `q.webp` |
| `union/userRank` | 标题「工会成员排名」 | (150,16,90,16) | 15px bold 白 |
| | 表头「排名/成员/荣誉值」 | (32,80) / (94,80) / (118,80) | 12px 白 |
| | 透明占位卡 ×2 | (16,112,356,75) / (16,201,356,75) | 无可见内容 |
| `union/news` | 仅 nav + 深色背景 | 标题 (165,16,60,16) | 接口 500 |
| `certification/certificationStatus` | 原生返回图标 | (5,6,27,27) | `unibtn` `\ue601` |
| | 原生标题 | (70,7,250,30) | 16px bold 黑 |
| | 叠加 u-navbar 返回 / 标题 | (13,10,24,24) / (165,16,60,16) | fixed 覆盖 top=0 |
| | 「实名认证失败」 | (123,137,144,26) | 24px `rgb(51,51,51)` |
| | 提示 | (104,172,182,21) | 14px `rgb(122,122,122)` |
| | 渐变按钮「重新认证」 | (105,489,180,47) | br23px |
| `market/categoryManager` | 右上「确认」 | (353,15.5,24,14) | 12px |
| | 「我的分类」/「其他分类」 | (16,60,358,21) / (16,164,358,21) | 14px |
| | 胶囊 ×3 | (16,93,110,39) / (138,93) / (260,93) | 白底，1px `rgb(231,231,234)`，br44px |
| `market/search` | 搜索框 | (62,3.5,312,37) | br100px |
| | 搜索图标 / input | (72,10,24,24) / (100,9,264,26) | `search3.png` |
| | 「数字藏品」/「盲盒」 | (136,62,64,24) / (226,63.5,28,21) | 16px / 14px |
| `rebate/rebate` | loading spinner | (185.2,323.2,19.7,19.7) | `rgb(200,200,200)` |
| | 「加载中...」 | (172.5,355.5,45,14) | 12px `rgb(200,200,200)` |
| `rebate/rebateInviteDetail` | 标题 | (150,16,90,16) | 15px bold |
| | 表头 ×5 | 5 / 39.6 / 108.8 / 195.1 / 281.4，各 48 高 @y=60 | 1px `rgb(248,147,82)` |
| | 空态插画 | (134.5,212,121,122) | — |
| `rebate/leaderboard` | 日/周/月 tab | (60.5,60) / (194.5,60) / (328.5,60)，各 45×22 | 15px `rgb(65,65,65)` |
| | tab 指示条 | (74,77,18,3) | — |
| | 表头「排名/用户/返佣金额」 | (32,91.5) / (97.2,91.5) / (195,91.5) | 15px `rgb(153,153,153)` |
| | 空态插画 | (134.5,227,121,122) | — |
| `webview/*`（3 页） | 原生返回图标 | (5,6,27,27) | `unibtn` `\ue601` |
| `iart/index` | 原生返回图标 / 标题 | (5,6,27,27) / (70,7,250,30) | `unibtn` / 16px bold |

### 10.30.8 静态资源（已从原站下载落盘 `frontend/public/`）

| 文件 | 尺寸 | 用途 | 来源 |
|---|---|---|---|
| `static/icon/gh/d-bg.webp` | 4352 B | 工会页深色背景 | 原站 URL |
| `static/icon/gh/rank.webp` | 1044 B | 公会排行图标 26×26 | 原站 URL |
| `static/icon/gh/ghsc.webp` | 524 B | 工会商城图标 26×26 | 原站 URL |
| `static/icon/gh/ding.webp` | 764 B | 消息通知图标 26×26 | 原站 URL |
| `static/icon/gh/lock.webp` | 6056 B | 大锁 57×57 | 原站 URL |
| `static/icon/gh/lock-1.webp` | 608 B | 小锁 16×19 | 原站 URL |
| `static/icon/gh/q.webp` | 1012 B | 排名说明图标 12×12 | 原站 URL |
| `static/icon/gh/rank-bg.webp` | 17370 B | 工会排名整页背景 | 原站 URL |
| `static/icon/gh/union-fee.webp` | 824 B | 手续费减免图标 44×44 | 内联 base64 提取 |
| `static/icon/gh/union-members.webp` | 1114 B | 成员人数图标 44×44 | 内联 base64 提取 |
| `static/icon/gh/union-divider.webp` | 378 B | 权益卡分割线 318×0.5 | 内联 base64 提取 |
| `static/icon/search3.png` | 1229 B | 搜索页放大镜 24×24 | 原站 URL |
| `assets/font/unibtn.woff2` | 1188 B | uni-app 返回箭头字体 | 主 CSS base64 提取 |
| `static/bg/active-banner-bg1.webp` | — | **原站已 404，未使用** | 改为复刻 `u-image__error` 回落 |

### 10.30.9 验收记录（Playwright，iPhone 390×844 @2x）

| 页面 | 断言 | console 错误 |
|---|---|---|
| `activeSelected/activeSelected` | 12 PASS / 0 FAIL | 0 |
| `activity/record` | 6 PASS / 0 FAIL | 0 |
| `union/tradeUnion` | 23 PASS / 0 FAIL | 0 |
| `union/unionRank` | 7 PASS / 0 FAIL | 0 |
| `union/userRank` | 8 PASS / 0 FAIL | 0 |
| `union/news` | 3 PASS / 0 FAIL | 0 |
| `certification/certificationStatus` | 9 PASS / 0 FAIL | 0 |
| `market/categoryManager` | 10 PASS / 0 FAIL | 0 |
| `market/search` | 8 PASS / 0 FAIL | 0 |
| `rebate/rebate` | 3 PASS / 0 FAIL | 0 |
| `rebate/rebateInviteDetail` | 10 PASS / 0 FAIL | 0 |
| `rebate/leaderboard` | 11 PASS / 0 FAIL | 0 |
| `webview/webview` | 5 PASS / 0 FAIL | 0 |
| `webview/webview-storage` | 5 PASS / 0 FAIL | 0 |
| `webview/pay-webview` | 5 PASS / 0 FAIL | 0 |
| `iart/index` | 5 PASS / 0 FAIL | 0 |
| **本批合计** | **130 PASS / 0 FAIL** | **0** |

对比图（14 张，左=原站、右=复刻）：`docs/verify/p0-compare/cmp_m6_*.png`
（`activity_record` 与 `activeSelected` 两页因原站/复刻布局差异不单独出图）。

像素差异热力图（14 张）：`docs/verify/p0-compare/diff_m6_*.png`。

**残留差异率（修复后）**：

| 页面 | 强差异 | 弱差异 | 页面 | 强差异 | 弱差异 |
|---|---|---|---|---|---|
| `activity_record` | 0.00% | 0.00% | `rebate_leader` | 0.42% | 0.05% |
| `webview` | 0.00% | 0.00% | `categoryManager` | 0.45% | 0.08% |
| `iart_index` | 0.00% | 0.00% | `rebate_invite` | 0.52% | 0.11% |
| `rebate` | 0.03% | 0.01% | `certStatus` | 0.57% | 0.08% |
| `activeSelected` | 0.04% | 0.00% | `union_tradeUnion` | 1.87% | 0.25% |
| `union_news` | 0.18% | 0.04% | `union_unionRank` | 0.33% | 0.05% |
| `market_search` | 0.32% | 0.06% | `union_userRank` | 0.34% | 0.07% |

> 全部残留差异集中在**中文字形笔画轮廓**上 —— 原站 iOS 系统中文字体 vs 本地 Linux
> fallback 的抗锯齿差异，属**环境渲染差**而非位置错（逐元素坐标已用
> `/tmp/verify/probe_repl_m6.py` 实测复刻页并与金标准逐项核对一致）。

### 10.30.10 对比图人工核对额外发现并修复 6 处断言测不到的差异

| # | 差异 | 根因 | 修复 |
|---|---|---|---|
| 1 | 4 个页面空态插画完全缺失 | 背景图直接挂在 wrapper `.as-empty` 上，而断言查的是内层 `.as-empty__img`（该类名不存在） | 拆成 wrapper（定位）+ `__img`（承载 background），4 页同步修 |
| 2 | 入口卡图标元素不存在 | 图标是 `.as-entry__item` 的**第 1 个**子元素，不是第 2 个 | 选择器改 `.as-entry__item:nth-child(2) .as-entry__icon` |
| 3 | 3 处边框断言报 `1px rgb(...)` | 验收脚本 `RECT_JS` 拼 border 时漏了 `borderTopStyle` | 改为 `cs.borderTopWidth+' '+cs.borderTopStyle+' '+cs.borderTopColor` |
| 4 | 权益卡图标 / 标题 y 偏 2.5~5.5px | flex 居中 + margin 布局无法精确命中原站绝对坐标 | 全部改绝对定位：`left/top` 写死，`.tu-card__row` 改 `position:absolute` 覆盖整卡 |
| 5 | 认证页叠加 navbar 掉到 page-head 之下 | 我把叠加的 u-navbar 放在文档流里 | 原站该 navbar 是 `fixed` 覆盖 top=0 → `.cs-nav` 改 `position:absolute; top:0; background:transparent` |
| 6 | `union_tradeUnion` 权益卡分割线 y 偏 6px | 金标准 map 过滤掉了 `height<1px` 的元素，0.5px 分割线未被采集 | 另写 `/tmp/verify/probe_div_m6.py` 专测小高度元素 → 原站 (43,441)，复刻修正为 `left:26px; top:84px`（相对卡片） |

> **教训 #6 最重要**：几何采集脚本的 `if(r.width<1||r.height<1) continue` 会静默丢弃
> 分割线（318×0.5）这类元素。凡是「断言测不到」的位置类差异，
> 都要写专项 probe 脚本直接量，不能凭 DOM 结构推断。

### 10.30.11 全量回归与本批次沉淀

全量回归：

| 项 | 结果 |
|---|---|
| P0 批次 | 158 PASS / 0 FAIL |
| 我的/登录批次 | 102 PASS / 0 FAIL |
| 公告/盲盒/抽签批次 | 106 PASS / 0 FAIL |
| 商城批次 | 34 PASS / 0 FAIL |
| 流水/SVIP/钱包批次 | 36 PASS / 0 FAIL |
| K线/抽签/抽奖/交易记录批次 | 124 PASS / 0 FAIL |
| 合成/榜单批次 | 63 PASS / 0 FAIL |
| **本批（收尾 16 页）** | **130 PASS / 0 FAIL** |
| **断言总计** | **753 PASS / 0 FAIL** |
| 全站路由冒烟 | **110 条，FAIL COUNT = 0** |
| `vite build` | ✓ built in 2.92s |

本批次沉淀：

1. **字体要从 CSS 里挖，不能只从 JS 里搜**。`unibtn` 在主 chunk 的 JS 中**搜不到**，
   只在主 CSS 的 base64 `@font-face` 里。查字体要找 CSS。
2. **`<i>` 图标元素必须显式宽高**。`<i class="uni-btn-icon">\e601</i>` 的宽度由字形决定，
   字体没加载时宽度塌缩，断言 `w` 就会失败 —— 需 `width/height/overflow:hidden` 兜住。
3. **验收脚本的端口要统一**。`verify_m4.py` / `verify_m5.py` 硬编码了 `5174`，
   预览服务换到 `5173` 后直接 `ERR_CONNECTION_REFUSED`，回归时才发现。
4. **小高度元素需要专项 probe**。几何采集会丢弃 `height<1px` 的元素，
   0.5px 分割线这类只能单独写脚本量。
5. **预览服务是构建产物，改 CSS 后必须 `vite build`**。`vite preview` 不会热更新，
   直接跑验收会拿到旧样式 —— 本次分割线修正后第一次跑仍是旧坐标就是这个原因。
6. **「有数据但不渲染」要照抄**。`/index/getSeries?type=10` 返回了「潜龙聚财」，
   原站「其他分类」区仍是空的。复刻不能因为「接口有值」就渲染出内容。
7. **资源 404 要复刻回落表现，不要臆造替代图**。`active-banner-bg1/2.webp` 已 404，
   正确做法是复刻浏览器的 `u-image__error` 占位块。
8. **原站同一端点可被多页复用，命名要加业务前缀**。`/draw/drawLog` 被两页共用，
   函数名冲突要改名（`getActivityDrawLog`）而不是覆盖。

---

## 10.31 公网预览发布（移动端）2026-10-26

### 10.31.1 背景与目标

原站复刻完成后需要一个**手机浏览器可直接打开**的公网地址。
平台发布通道（`node publish.js`）会把应用跑在沙箱内，由边缘网关反代到
`https://a97e4556be4b3a6d0.app.workbuddy.host`。

**首轮实测发现严重问题**：线上打开后随机白屏，`curl` 观察到的 404 会落在
**任意 URL** 上（`index.html`、`app.css`、`app.js`、各图片都中过），
且连 `index.html` 自身都会 404，失败率一度达 15/15。

### 10.31.2 根因定位（分步排除）

| 实验 | 结果 | 结论 |
|---|---|---|
| 直连沙箱源站端口并发 12 次 | 12/12 全 200 | 源站与业务代码无问题 |
| 线上串行请求 15 次 | 15/15 全 200 | 非并发因素 |
| 线上并发 8~12 次 | 随机 2~5 个 404 | 高并发触发 |
| 404 响应体 | `text/plain` + `Not Found`，**无 `Server` 头** | 由网关**前面**的一层返回，不是我们的服务 |
| 404 与 `Server: CloudStudio Gateway` 对比 | 成功响应有 `Server` + `X-Trace-Id`，404 两者都没有 | 404 发生在到达 CloudStudio Gateway 之前 |
| 线上请求 1.2KB 小字体文件 ×60 | 5 个 404 | **与响应体大小无关** |
| 线上请求 7.4MB 单 HTML ×60 | 5 个 404 | 同上 |
| `Accept-Encoding` / `User-Agent` / `Cache-Control` / HTTP1.1 vs HTTP2 对照 | 失败率无差异 | 与请求头、协议版本无关 |
| 换新 appName（重置 `state.json`） | appName 由 runtimeId 派生，无法真正更换 | 无效 |

**结论**：这是平台边缘网关**上游**的随机 404，属平台侧问题，
应用层无法根治。**唯一有效的缓解是把请求数压到最低** ——
让整页只需 1 个 HTTP 请求，任何一次 404 都直接命中唯一入口，
把「页面部分资源丢失 → 白屏」降级为「首屏 HTML 丢失 → 整页失败但可刷新重试」。

### 10.31.3 缓解方案：单文件自包含发布

新增三个脚本（`frontend/` 下）：

| 文件 | 职责 |
|---|---|
| `build_pub.py` | 由 `dist/` 生成 `dist-pub/`：图片按内容 md5 去重 → 转 WebP → 内联进单个 `index.html` |
| `subset_fonts.py` | 扫描 `src/` 全部源码与 mock 数据收集字符集，用 `fontTools.subset` 把中文字体从 1MB 压到 ~160KB |
| `serve.py` | 多线程静态服务器（`ThreadingHTTPServer`），带 SPA fallback、gzip 预压缩、HTTP/1.1 keep-alive |

**关键技术点**：

1. **图片去重**：同一张图最多被引用 43 次，直接内联会产生 40+ 份 base64。
   按**原始字节 md5** 建索引 → 唯一 160 张。
2. **PNG/JPG → WebP(q86)**：唯一图片从 13.0MB 压到 3.8MB。
3. **CSS 与 JS 共享同一份 base64**：CSS 侧写 `:root{--ti-N:url("data:...")}`，
   JS 侧不重复存 base64，而是运行时用
   `getComputedStyle(document.documentElement).getPropertyValue("--ti-N")` 读取。
   （若两边各存一份，体积直接翻倍：13.2MB → 7.4MB）
4. **字体必须内联但不能用 CSS 变量**：`@font-face` 内自定义属性不生效，
   所以字体写成 `url(data:font/woff2;base64,...)` 直接内联 —— 这种写法在 `@font-face` 内合法。
5. **图标字体不能子集化**：`uview-icon` / `unibtn` 用的是私有区码位
   （`\e600`~`\e651`），源码里搜不到，子集化会把字形清空 —— 这两类字体原样复制。
6. **`dist` 与 `dist-pub` 必须分离**：图片内联成 data URI 后，
   像素级断言脚本按 filename 比对 `background-image` 会失效；
   `dist` 保持原始构建产物供 `verify_m*.py` 使用，`dist-pub` 只用于发布。
7. **动态拼接路径无法内联**：`"/static/icon/" + x + ".png"` 这类保持外链，
   运行时按需拼接（源码里只有 2 处）。

**最终产物**：

```
dist-pub/index.html   7.4 MB（gzip 后 5.3 MB）
首屏请求数             1 个（全部图片 + 字体 + CSS + JS 均在 HTML 内）
外链资源               0 个（仅 8 个源码引用了原站就 404 的文件，
                       复刻时保留了原站的 u-image__error 回落表现）
```

### 10.31.4 `serve.py` 的六个关键修正

| # | 问题 | 修正 |
|---|---|---|
| 1 | `http.server` 单线程，并发排队 | `ThreadingHTTPServer` |
| 2 | 目录请求被 `super().send_head()` 301 重定向到自身形成循环 → 网关表现为 404 | 目录路径直接返回 index.html 内容 |
| 3 | 无扩展名路径（SPA 路由）404 | history fallback 到 index.html |
| 4 | HTTP/1.0 每请求新建 TCP 连接 | `protocol_version = 'HTTP/1.1'` |
| 5 | 7.4MB HTML 无压缩传输 | 启动时生成 `.gz`，`Accept-Encoding: gzip` 时返回 |
| 6 | 缺 webp/woff2 MIME，浏览器拒绝解析 | 补全 `extensions_map` |

### 10.31.5 验收结果

**本地（`http://127.0.0.1:8931`，dist-pub + serve.py）**：

| 项 | 结果 |
|---|---|
| 11 条主路由冒烟 | 11 PASS / 0 FAIL，每页 **1 个请求**、0 broken 图、0 console error |
| 110 条全量路由冒烟 | **FAIL COUNT = 0** |
| 图片完整性 | 抽样 12 页：`broken=0`，`ext=0`（全部 data URI，无外链） |
| 缺失资源 | `order/beg/list` 等 4 张为**原站同样 404** 的资源，复刻保留回落表现 |

**线上（真实浏览器 iPhone UA 串行访问 20 次）**：
**18 PASS / 2 FAIL**，2 次失败均为网关对 HTML 本身返回 404
（`html=0, text=9`，即 `Not Found` 纯文本），非页面渲染问题。

**线上（curl ×40）**：38 × 200 + 2 × 404 = **95% 成功率**（平台网关上限）。

### 10.31.6 本批次沉淀

1. **平台边缘网关会随机返回 404，且与应用无关**。判据：404 响应缺 `Server` 头，
   直连源站 100% 成功，小文件与大文件失败率相同。遇到此类问题先做这组对照实验，
   不要在业务代码里找原因。
2. **减少请求数是唯一有效的缓解手段**。把 100+ 请求压到 1 个，
   页面级失败率就从「任一资源 404 即白屏」降到「仅首屏 HTML 404」。
3. **内联资源必须去重**。按内容哈希而非路径建索引，否则同一张图被引用 43 次就产生 43 份 base64。
4. **base64 会让体积膨胀 33%，且无法 gzip**。上线前先转 WebP，
   PNG→WebP(q86) 通常能降到 1/4。
5. **CSS 与 JS 共享 base64 要用「CSS 变量 + 运行时读取」**，不能两边各存一份。
6. **`@font-face` 内不能用 CSS 自定义属性**，但可以直接写 `url(data:...)`。
7. **图标字体不能子集化**（私有区码位查不到），只有文本字体能压。
8. **发布目录与构建目录必须分离**，否则像素级断言脚本会因 `background-image`
   从文件名变成 data URI 而全部失效。
9. **`http.server` 的目录分支会 301 自重定向**，在反向代理后面表现为随机 404，
   必须自己接管 `send_head()`。

---

## 10.32 公告模块修复（2026-10-26）

### 10.32.1 问题现象

公告详情页（`/#/pages/notice/noticeDetails?id=59&category=寄售公告`）**永久停留在
「加载中...」遮罩**，正文区始终空白。公告列表页可正常渲染。

### 10.32.2 根因（三处叠加）

| # | 位置 | 问题 |
|---|---|---|
| 1 | `src/views/notice/noticeDetails.vue` | `nd-mask` **无条件渲染**（缺 `v-if`），请求结束后遮罩不消失 |
| 2 | `src/api/index.js` `getAfficheDetail()` | mock **永远返回 `code:0`** —— 当初只实调了 `ids/undefined` 这一个异常样本，据此误判接口无数据 |
| 3 | `src/api/mock.js` `AFFICHE_LIST` | 使用的 id=31/29/28… 等 12 条**已被原站删除**的旧公告，全部查不到详情 |

补充根因 4（本次新发现）：`notice.vue` 的 `loadClasses()` 用接口返回的分类字典
**整体替换**了左栏，导致原站固定的第一项「全部」丢失，默认只展示「运营公告」4 条，
而非原站的 12 条。

### 10.32.3 原站实调（2026-10-26 登录态）

```bash
# 带真实 id → code:1 + 完整 HTML 正文
POST https://apinew.hfeyusheng.top/api/index/afficheDetail/ids/59
→ { code:1, msg:"详情", data:{ id, title, content:"<p …>", createtime:1792910370,
    affiche_type_id:6, … } }

# ids/undefined 或已删除 id → code:0
→ { code:0, msg:"这条消失不见了", data:null }
```

列表侧：`POST /index/afficheList`（category=0）→ `total:12 / last_page:1`；
分类字典 `POST /index/affichetypelist` → 运营/合成/分解/上新/活动/寄售 6 条。
各分类条数：运营 4、合成 4、分解 0、上新 0、活动 0、寄售 4。

**标签文案的真实来源**：详情响应里没有标签文案，原站取的是 **URL query 的
`category`**（原站 chunk 中 `a.category`）。这一点在 `notice.vue` 的
`goDetail()` 里已体现：`query: { id, category: item.affiche_type }`。

### 10.32.4 关键 DOM 结论（原站 chunk `pages-notice-noticeDetails.b3aadf7f.js`）

- 详情页 `getInfo` 逻辑：`loading = !0` → 请求 → `loading = !1, info = A.data`
- 结构：`container.page-container.plr-16` → `u-navbar`（title「公告详情」15px/700 #fff，
  leftIcon `back-btn-white`）→ `.pt-10` → 标题(16px/700 #C4B494) → 标签(#666)+日期(#999)
  → 正文卡（`#181713` 底 / `1rpx solid #655032` 边 / `plr-20 ptb-12 br-12` /
  `margin-top:30rpx`）→ 卡片内底部 `.tips` 风险提示（12px #666 / 行高 24px）

### 10.32.5 改动清单

| 文件 | 改动 |
|---|---|
| `src/api/mock.js` | `AFFICHE_LIST` 换成原站真实 12 条；`AFFICHE_LIST_BY_CATEGORY` 换成 6 个分类真实结果；**新增 `AFFICHE_DETAILS`**（12 条真实详情，含完整 HTML content） |
| `src/api/index.js` | `getAfficheDetail()` mock 改为按 id 查 `AFFICHE_DETAILS`，命中 `ok(detail,'详情')`，未命中才返回 `code:0 / 这条消失不见了` |
| `src/views/notice/noticeDetails.vue` | 按原站重写：navbar + 标题 + 标签/日期 + 正文卡 + tips；遮罩改 `v-if="loading"`；标签取 `route.query.category`；补 id 无效时的空态 |
| `src/views/notice/notice.vue` | `loadClasses()` 改为在「全部」之后**追加**分类字典，不再整体替换 |

### 10.32.6 验收结果

| 项 | 结果 |
|---|---|
| 本地详情页（id=59/58/无效 id） | 3/3 PASS，遮罩消失、正文与 tips 完整 |
| 详情页计算样式 | 标题 16px/700 `rgb(196,180,148)`；标签 12px/500 `rgb(102,102,102)`；日期 12px `rgb(153,153,153)`；卡片 `rgb(24,23,19)` / 边 `rgb(101,80,50)` / 圆角 12.48px / padding 12px 20px / margin-top 15.6px —— 与原站逐项一致 |
| 列表页 7 个分类 | 全部 12 条、运营 4、合成 4、分解 0、上新 0、活动 0、寄售 4 —— 与原站一致 |
| 列表 → 详情跳转 | query 携带 `id` + `category`，详情页标题/标签正确 |
| 全量路由冒烟 | 见 03 文档 §4 |

### 10.32.7 本批次沉淀

1. **实调异常样本不能代表全貌**。只调了 `ids/undefined` 就断言「接口无数据」，
   是本次 bug 的源头。修 mock 前至少要拿 **1 个成功样本 + 1 个失败样本**。
2. **前端 mock 数据会过期**。原站删除旧数据后，本地 mock 仍在引用旧 id，
   于是「列表有、详情查不到」。mock 的 id 必须来自最新一次实调。
3. **前端接口返回 ≠ 原站渲染所需**。详情响应里没有标签文案，原站从
   URL query 取 —— 这类「数据在别处」的字段，必须回到原站 chunk 里看渲染代码。
4. **列表页的默认分类容易漏**。原站左栏第一项「全部」是硬编码的，接口字典是
   **追加**而不是替换。核对方式是实调原站 DOM 抓左栏文本。

---

## 10.33 底部导航栏改造：选中项圆形上浮（2026-10-27）

### 10.33.1 需求

用户提供参考稿：胶囊底座上的选中项变成一个**圆形并向上浮出胶囊顶边**，
颜色保持不变。

### 10.33.2 关键取舍：图标资源正好适配

原站 tabBar 资源（`static/tabBar/{1..10}.webp`，奇数未选中 / 偶数选中）实测主色：

| 资源 | 主色 | 用途 |
|---|---|---|
| 1/3/5/7/9.webp（未选中） | `rgb(239,229,207)` 浅米描边 | 浮在金棕渐变胶囊上，对比度足够 |
| 2/4/6/8/10.webp（选中） | `rgb(70,53,32)` 深棕实心 | 放进**浅米色圆形** `#EFE5CF` 上，正好 |

即参考稿的「浅底 + 深色实心图标」结构，**不需要重画任何图标**，
直接用原站资源即可；未选中图标原色不变。

### 10.33.3 实现要点

| 项 | 值 |
|---|---|
| 底座胶囊 | 344×56，圆角 28px，金棕渐变 `#948570→#262321→#766F5B` + 1px `#887D67` 边（**完全沿用原站**） |
| 圆形底 | 52×52，`border-radius:50%`，`background:#EFE5CF`，`box-shadow:0 4px 12px rgba(0,0,0,.45)` |
| 图标 | 26×26，选中 `translateY(-30px)` 上浮（浮出胶囊顶边 ~28px） |
| 动效 | 圆 `scale(0.4)→1` + 图标上浮，`cubic-bezier(.34,1.56,.64,1)` 带回弹 |
| 文字标签 | **移除**（参考稿为纯图标导航） |

### 10.33.4 两个必须处理的坑

1. **胶囊 `overflow:hidden` 会裁掉上浮的圆** → 改为 `overflow:visible`；
   同时外层 `.w-tabbar__fixed` 设 `pointer-events:none`、胶囊设 `pointer-events:auto`，
   避免透明的外层区域吃掉点击。
2. **首页占位高度不足** → 首页原本只有 `56px`（与胶囊等高），
   上浮的圆会压住页面内容 → 改为 `76px`；其余页面本就是 `104px`，无需调整。

### 10.33.5 验收

- 首页/市场/公告/我的 四个 tab 切换：圆形随选中项移动，active index 正确
- 线上（`https://a97e4556be4b3a6d0.app.workbuddy.host`）点击「公告」→ 路由跳转
  `/#/pages/notice/notice`，active index = 2，**无 console error**
- 全量 110 条路由冒烟：见 03 文档 §4

### 10.33.6 回退（2026-10-27）

用户确认后**已整体回退**该次改造，导航栏恢复为改造前的形态：

- `src/components/TabBar.vue` → 恢复 `w-tabbar__text` 文字标签、图标 20px、
  胶囊 `overflow:hidden`、`w-tabbar__fixed` 不做 `pointer-events` 分层
- `src/views/index/index.vue` → 占位高度恢复 `56px`（原为改造后的 `76px`）
- 线上实测：`.w-tabbar__disc` 不存在、图标 20×20、选中文字 `rgb(255,248,229)`、
  未选中 `rgb(198,192,181)`，tab 点击与路由跳转正常、无 console error

本次改造的**经验保留**（下次若再做可直接复用）：

1. 原站 tabBar 资源天然适配「浅底 + 深色实心图标」结构 ——
   奇数（未选中）是浅米描边 `#EFE5CF`，偶数（选中）是深棕实心 `#463520`，
   放进浅色圆里对比度正好，**无需重画图标**。
2. 胶囊 `overflow:hidden` 必须改 `visible` 才能让上浮的圆溢出；
   外层要用 `pointer-events:none` + 胶囊 `auto` 分层，
   否则透明区域会吃掉点击。
3. 上浮元素需要额外的页面底部占位高度，否则会压住内容
   （首页占位 56px → 需提到 76px）。

---

## 10.34 外链与原站依赖清零（2026-10-27）

### 10.34.1 核查方法

不靠 grep 猜，用**真实浏览器抓网络请求**做实测：
Playwright 遍历 110 条路由，对每条 `request` 事件判定
「URL 不以本站域名开头、且不以 `data:` / `blob:` 开头」→ 计为外部请求。
同时统计 `[...document.images].filter(i => i.complete && i.naturalWidth === 0)` 的破图数。

### 10.34.2 首轮实测发现的问题

| # | 位置 | 问题 | 处理 |
|---|---|---|---|
| 1 | `src/config.js` | `SITE_URL = 'https://dadaqif.hfeyusheng.top'` —— 指向原站，且是**死代码**（无任何引用） | 直接删除 |
| 2 | `src/views/notice/notice.vue` + `mock.js` | 公告页横幅用 `/uploads/...` 路径，运行时拼 OSS 主机 → **真实外链请求** | 下载到 `public/assets/img/notice/banner.png`，`mock.js` 改本地路径，`notice.vue` 按 `/assets/` 前缀判断是否拼 OSS |
| 3 | `src/views/invitation/invitation.vue` | 邀请页二维码走原站后端 `https://apinew.hfeyusheng.top/addons/qrcode/index/build` | 引入 `qrcode` npm 包（~24KB gzip），改为**本地生成 data URI** |
| 4 | `src/api/mock.js` | 6 处 `localhost:5173` / `https://localhost/...` 硬编码（原站实调时的占位） | 全部改为相对路径（`/`、`/#/pages/...`、`/download/...`） |
| 5 | `src/views/market/sellInfo.vue` | CSS 注释里留有失效的 OBS 外链 URL（实际 `background` 已指向本地） | 清理注释中的外链 |

### 10.34.3 为什么必须做

`qrcode` 接口是**硬依赖**：一旦原站下线或该接口变更，邀请页二维码直接裂图。
同理公告横幅走 OSS 也会因网络策略（企业网、离线环境）加载失败。

### 10.34.4 最终实测

- **全站 110 条路由，外部请求 = 0**，破图 = 0
- 所有图片/字体/CSS/JS 均已内联进单个 `index.html`（7.5MB）或落在同源 `/assets/` `/static/`
- `qrcode` 生成结果：320×320 PNG data URI，显示尺寸 43×43，**无网络请求**

### 10.34.5 保留的第三方链接（有意为之）

以下**不是资源依赖**，而是业务上必须跳转的外部目标，不影响离线渲染：

| 链接 | 用途 |
|---|---|
| `qm.qq.com/q/...` | 加入社群 / 联系客服（点击跳转） |
| `yvwallet.yeepay.com` | 易宝收银台（钱包页点击跳转） |
| `api.aliyun.com` | 短信/OSS 服务端调用的说明性注释 |

### 10.34.6 沉淀

1. **查外链要用真实浏览器抓 request 事件**。grep 源码会同时命中
   注释、死代码、点击跳转链接，噪音大且会漏掉运行时拼接的 URL
   （本次的 `OSS_URL + res.data` 就是 grep 静态字符串看不出来的）。
2. **「资源 URL」和「跳转 URL」要分开看**。前者必须清零（影响渲染/离线），
   后者是业务功能，保留即可。
3. **死代码里的外链最危险**。`SITE_URL` 从未被引用，但一旦有人误用就会引入依赖；
   应当在源头删掉而不是留着。
4. **本地化第三方图片时要验证原资源是否还活着**。`sellInfo` 那个 OBS bucket
   已失效（`NoSuchBucket`，原站自身也是裂图），本地替代是必要修复而非降级。
