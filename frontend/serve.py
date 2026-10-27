# -*- coding: utf-8 -*-
"""多线程静态服务器（发布用）。

设计要点：
1. `python3 -m http.server` 是单线程的，浏览器并发加载多个资源时会排队；
   此处用 ThreadingHTTPServer 避免源站侧的并发瓶颈。
2. 补齐 webp/woff2 的 MIME 映射（否则浏览器拒绝解析）。
3. SPA history fallback：任意无扩展名路径都回落到 index.html，
   否则 /login、/market 等前端路由直接访问会 404。
4. 目录路径（含根路径 /）直接返回 index.html 内容，
   不能走父类的 send_head()，它会对目录发 301 重定向到自身形成循环，
   边缘网关会把循环表现为随机 404。
5. HTTP/1.1 keep-alive：默认 HTTP/1.0 每请求新建 TCP 连接，
   边缘网关在高并发下会把连接建立失败误报为 404。
6. 预压缩 gzip：index.html 内联了大量 base64 图片，传输体积大，
   开启 gzip 可显著降低移动端首屏耗时与网关侧出错概率。
7. Cache-Control：让边缘节点有机会缓存静态资源，减少回源。
"""
import gzip
import io
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(ROOT, 'dist-pub')

MIME = {
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.html': 'text/html; charset=utf-8',
}

# 需要 gzip 预压缩的文本类型
GZIP_EXT = {'.html', '.js', '.css', '.json', '.svg'}


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, **MIME}
    protocol_version = 'HTTP/1.1'

    def end_headers(self):
        self.send_header('Cache-Control', 'public, max-age=600')
        super().end_headers()

    # ---------- gzip ----------
    def _accepts_gzip(self):
        return 'gzip' in (self.headers.get('Accept-Encoding') or '').lower()

    def _gz_path(self, path):
        gz = path + '.gz'
        return gz if os.path.exists(gz) else None

    def _serve_index(self):
        index = os.path.join(PUB, 'index.html')
        if not os.path.exists(index):
            return super().send_head()
        with open(index, 'rb') as fh:
            data = fh.read()
        ctype = 'text/html; charset=utf-8'
        gz = self._gz_path(index)
        if gz and self._accepts_gzip():
            with open(gz, 'rb') as fh:
                data = fh.read()
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            return io.BytesIO(data)
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        return io.BytesIO(data)

    def send_head(self):
        path = self.translate_path(self.path.split('?')[0])
        if os.path.isdir(path):
            return self._serve_index()
        if os.path.exists(path):
            ext = os.path.splitext(path)[1].lower()
            gz = self._gz_path(path) if ext in GZIP_EXT else None
            if gz and self._accepts_gzip():
                with open(gz, 'rb') as fh:
                    data = fh.read()
                self.send_response(200)
                self.send_header('Content-Type', self.extensions_map.get(ext, 'application/octet-stream'))
                self.send_header('Content-Encoding', 'gzip')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                return io.BytesIO(data)
            return super().send_head()
        if os.path.splitext(self.path)[1] == '':
            return self._serve_index()
        return super().send_head()

    def log_message(self, *args):
        pass


def build_gzip():
    """为 dist-pub 中的文本资源生成 .gz 预压缩文件。"""
    n = 0
    for base, _, files in os.walk(PUB):
        for f in files:
            if os.path.splitext(f)[1].lower() not in GZIP_EXT:
                continue
            p = os.path.join(base, f)
            with open(p, 'rb') as fh:
                raw = fh.read()
            with gzip.open(p + '.gz', 'wb', compresslevel=6) as gz:
                gz.write(raw)
            n += 1
    print('gzip 预压缩: %d 个文件' % n)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '0'))
    if '--port' in sys.argv:
        port = int(sys.argv[sys.argv.index('--port') + 1])
    if not port:
        port = 8000
    build_gzip()
    os.chdir(PUB)
    ThreadingHTTPServer(('0.0.0.0', port), Handler).serve_forever()
