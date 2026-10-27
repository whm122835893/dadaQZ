#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成 dist-pub：把 dist 的图片资源按内容去重并压缩后内联进单个 index.html。

背景：边缘代理对同源并发请求存在随机 404 限制，静态多文件方案在手机端会间歇性白屏。
方案：把全部位图资源内联进 HTML（CSS 用 var(--ti-N)，JS 用 __T[N]），
      首屏只剩 1 个 HTML 请求 + 少量字体请求。

要点：
1. 图片按「原始字节 md5」去重，同一张图被引用 40 次也只内联 1 份。
2. PNG/JPG 统一转 WebP(q86, 带 alpha) 再内联，体积从 13MB 降到 ~4MB。
3. 字体（woff2）保持外链：@font-face 内 CSS 自定义属性不生效，内联会失效。
4. 动态拼接的路径（如 "/static/icon/" + x + ".png"）无法内联，保留外链。
5. dist 与 dist-pub 严格分离：dist 保持原始构建产物供像素级断言脚本使用。
"""
import base64
import hashlib
import io
import os
import re
import shutil
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'dist')
DST = os.path.join(ROOT, 'dist-pub')

RASTER_EXT = ('.png', '.jpg', '.jpeg', '.gif')
WEBP_Q = 86
# 内联后单张超过此大小则保持外链，避免个别大图把 HTML 撑爆
MAX_INLINE = 12 * 1024 * 1024

MIME = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2', '.woff': 'font/woff',
}


def log(msg):
    print(msg, flush=True)


# ---------------------------------------------------------------- 资源池
class ImagePool:
    """按内容去重的图片池：同一份字节只内联一次。"""

    def __init__(self, pub_dir):
        self.pub_dir = pub_dir
        self.items = []          # [data_uri, ...]
        self._by_hash = {}       # md5 -> index
        self._fonts = {}         # font url -> data uri
        self._ext_used = set()
        self.external = 0
        self.inlined = 0

    def _abs(self, url):
        return os.path.join(self.pub_dir, url.lstrip('/').split('?')[0])

    def _encode(self, path):
        """返回 (data_uri, 后缀)；无法压缩时回退原格式。"""
        raw = open(path, 'rb').read()
        ext = os.path.splitext(path)[1].lower()
        if ext in RASTER_EXT:
            try:
                im = Image.open(io.BytesIO(raw))
                buf = io.BytesIO()
                if im.mode in ('RGBA', 'LA', 'P'):
                    im = im.convert('RGBA')
                else:
                    im = im.convert('RGB')
                im.save(buf, 'WEBP', quality=WEBP_Q, method=6)
                out = buf.getvalue()
                if len(out) < len(raw):
                    return ('data:image/webp;base64,' +
                            base64.b64encode(out).decode()), 'webp'
            except Exception as exc:  # 非真实图片（如占位 0 字节文件）
                log('  [skip] %s (%s)' % (path, exc))
        mime = MIME.get(ext, 'application/octet-stream')
        return ('data:%s;base64,%s' % (mime, base64.b64encode(raw).decode())), ext

    def index_for(self, url):
        """返回内联下标；无法内联返回 None（调用方保留原始外链）。"""
        path = self._abs(url)
        if not os.path.isfile(path):
            return None
        raw = open(path, 'rb').read()
        key = hashlib.md5(raw).hexdigest()
        if key in self._by_hash:
            return self._by_hash[key]
        data_uri, ext = self._encode(path)
        if len(data_uri) > MAX_INLINE:
            self.external += 1
            return None
        idx = len(self.items)
        self.items.append(data_uri)
        self._by_hash[key] = idx
        self._ext_used.add(ext)
        self.inlined += 1
        return idx

    def font_data_uri(self, url):
        """字体：优先用子集化版本，失败则用原文件；返回 data URI 或 None。"""
        if url in self._fonts:
            return self._fonts[url]
        raw = open(self._abs(url), 'rb').read()
        subset = self._abs(url).replace('.woff2', '.subset.woff2')
        if os.path.isfile(subset):
            raw = open(subset, 'rb').read()
        data = 'data:font/woff2;base64,' + base64.b64encode(raw).decode()
        self._fonts[url] = data
        return data


# ---------------------------------------------------------------- CSS
CSS_URL = re.compile(r'url\(\s*(["\']?)([^"\')]+)\1\s*\)')
CSS_FONT = re.compile(r'@font-face\s*\{[^}]*\}', re.S)
FONT_URL = re.compile(r'url\(\s*(["\']?)([^"\')]+\.woff2)\1\s*\)')


def build_css(css, pool):
    """把 CSS 中的位图 url() 替换为 url(var(--ti-N))，字体 url() 内联为 data URI。

    注意：CSS 自定义属性在 @font-face 内不生效，所以字体不能用 var() 间接引用，
    必须直接写成 url(data:font/woff2;base64,...) —— 这种写法在 @font-face 内是合法的。
    """
    used = []

    def repl(m):
        quote, url = m.group(1), m.group(2)
        if url.startswith('data:') or url.startswith('http'):
            return m.group(0)
        low = url.lower()
        if not low.endswith(RASTER_EXT + ('.webp', '.svg')):
            return m.group(0)          # 字体等在下面单独处理
        idx = pool.index_for(url)
        if idx is None:
            return m.group(0)
        used.append(idx)
        return 'url(var(--ti-%d))' % idx

    def font_repl(m):
        quote, url = m.group(1), m.group(2)
        data = pool.font_data_uri(url)
        if data is None:
            return m.group(0)
        return 'url(%s)' % data

    css = FONT_URL.sub(font_repl, css)
    css = CSS_URL.sub(repl, css)
    return css, used


# ---------------------------------------------------------------- JS
JS_PATH = re.compile(
    r'(["\'])(/(?:assets|static)/[A-Za-z0-9_\-./]+\.(?:png|jpe?g|webp|gif))\1')
JS_DYN = re.compile(r'["\'](/(?:assets|static)/[A-Za-z0-9_\-./]+/)["\']')


def build_js(js, pool):
    """把 JS 中的绝对图片路径字面量替换为 __T[N] 查表引用。

    __T 不是独立的对象字面量，而是一个 getter 函数：运行时从 CSS 变量 --ti-N 读取。
    这样图片的 base64 只在 CSS 的 :root 变量表里存一份，
    避免「CSS 一份 + JS 一份」导致体积翻倍。
    """
    used = []

    def repl(m):
        quote, url = m.group(1), m.group(2)
        idx = pool.index_for(url)
        if idx is None:
            return m.group(0)
        used.append(idx)
        return '__T(%d)' % idx

    js = JS_PATH.sub(repl, js)
    dyn = len(JS_DYN.findall(js))
    return js, used, dyn


# ---------------------------------------------------------------- main
def main():
    if not os.path.isdir(SRC):
        sys.exit('缺少 dist 目录，请先执行 npx vite build')

    if os.path.isdir(DST):
        shutil.rmtree(DST)
    shutil.copytree(SRC, DST)

    # 字体子集化：必须在复制之后（子集脚本写入 dist-pub/assets/font）
    import subprocess
    subprocess.run([sys.executable, os.path.join(ROOT, 'subset_fonts.py')], check=True)

    html_path = os.path.join(DST, 'index.html')
    html = open(html_path, encoding='utf-8').read()

    css_path = os.path.join(DST, 'assets', 'app.css')
    js_path = os.path.join(DST, 'assets', 'app.js')
    css = open(css_path, encoding='utf-8').read()
    js = open(js_path, encoding='utf-8').read()

    pool = ImagePool(DST)
    new_css, css_used = build_css(css, pool)
    new_js, js_used, dyn = build_js(js, pool)

    # 资源池在 CSS/JS 两轮处理后才最终确定，表格统一在此处生成
    table = ''.join('--ti-%d:url("%s");' % (i, d) for i, d in enumerate(pool.items))
    new_css = ':root{%s}\n' % table + new_css
    # JS 侧不再重复存 base64，改为运行时从 CSS 变量读取
    js_table = ('var __T=function(i){return getComputedStyle(document.documentElement)'
                '.getPropertyValue("--ti-"+i).trim().replace(/^url\\(["\']?/,"").replace(/["\']?\\)$/,"")};')
    new_js = js_table + '\n' + new_js

    html = html.replace(
        '<link rel="stylesheet" crossorigin href="/assets/app.css">',
        '<style>%s</style>' % new_css)
    html = html.replace(
        '<script type="module" crossorigin src="/assets/app.js"></script>',
        '<script type="module">%s</script>' % new_js)
    # favicon 也内联，省一次请求
    fav = os.path.join(DST, 'favicon.png')
    if os.path.isfile(fav):
        data_uri, _ = pool._encode(fav)
        html = html.replace('href="/favicon.png"', 'href="%s"' % data_uri)

    open(html_path, 'w', encoding='utf-8').write(html)

    # 资源池里最终用到的下标才写入（避免无用内联）
    used = sorted(set(css_used) | set(js_used))
    log('图片池: 唯一 %d 张，CSS 引用 %d 处，JS 引用 %d 处，动态拼接 %d 处保持外链'
        % (len(pool.items), len(css_used), len(js_used), dyn))
    log('index.html 体积: %.1f MB' % (os.path.getsize(html_path) / 1024 / 1024))
    log('已写入 dist-pub')


if __name__ == '__main__':
    main()
