# dadaQZ · 嗒嗒艺术（DADA ART）数字藏品平台复刻

像素级复刻 `dadaqif.hfeyusheng.top`，**109 个原站页面 100% 覆盖**，前后端均可独立运行。

- **技术栈**：Vue 3 + Vite 5 + axios + Pinia（hash 路由）
- **数据层**：全量本地 mock（`src/api/mock.js`），**无任何原站接口依赖**
- **外链**：**0** —— 全部图片/字体/CSS/JS 已本地化或内联，二维码本地生成

## 目录结构

```
tata/
├── frontend/              # 前端（Vue3 + Vite）
│   ├── src/
│   │   ├── api/           # 接口封装 + 全量 mock 数据
│   │   ├── components/    # 公共组件（TabBar 等）
│   │   ├── views/         # 34 个业务目录，109 个页面
│   │   ├── router/        # 路由表（111 条）
│   │   ├── stores/        # Pinia
│   │   └── styles/        # 全局样式
│   ├── public/            # 本地化的图片/字体/静态资源
│   ├── build_pub.py       # 生成单文件自包含发布版
│   ├── subset_fonts.py    # 字体子集化（1MB → 160KB）
│   └── serve.py           # 本地静态服务（含 gzip 预压缩）
├── database/
│   └── 数据库设计文档.md
└── docs/
    ├── 01-原站侦查报告.md
    ├── 02-API接口文档.md        # 含全部接口实调响应与踩坑记录
    ├── 03-页面清单与实现进度.md
    └── preview/                 # 线上实拍截图
```

## 本地运行

```bash
cd frontend
npm install
npm run dev          # 开发模式（默认 http://localhost:5173）
```

Mock 默认开启（`VITE_USE_MOCK !== 'false'`），**无需后端即可跑通全部页面**。

## 构建与发布

```bash
cd frontend
npx vite build       # → dist/
python3 build_pub.py # → dist-pub/index.html（单文件自包含，7.5MB）
python3 serve.py     # 本地静态服务
```

`build_pub.py` 会把全部位图按内容 md5 去重、转 WebP(q86) 后内联进单个 HTML，
字体子集化后同样内联 —— 整页只需 **1 个 HTTP 请求、0 外链**。

## 验收基线

| 项 | 结果 |
|---|---|
| 页面覆盖 | 原站 109 页 / 已实现 109 页 / 100% |
| 全站路由冒烟 | 110 条，FAIL COUNT = 0 |
| 外部请求 | 全站 110 页实测 **0** |
| 破图 | **0** |
| 像素级断言 | 753 项全 PASS |

## 说明

- `docs/02-API接口文档.md` 记录了全部接口的**原站实调响应**、DOM 金标准与踩坑过程，
  是理解本项目实现细节的主要依据。
- 公告/上架等业务数据取自原站实调快照，原站后续变更时需重新抓取更新 mock。
