#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""字体子集化：只保留本项目实际用到的字符，把三个中文字体从 ~1MB 压到几十 KB。

1. 扫描 src/ 下所有源码与 mock 数据，收集出现过的字符集合
2. 用 fontTools.subset 做子集化（保留拉丁字母、数字、常用标点）
3. 输出到 dist-pub/assets/font/*.subset.woff2

注意：中文字体子集化后若出现未收录字符，浏览器会 fallback 到系统字体，
      因此字符集必须覆盖全部静态文案与 mock 返回值。
"""
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
FONT_SRC = os.path.join(ROOT, 'dist', 'assets', 'font')
FONT_DST = os.path.join(ROOT, 'dist-pub', 'assets', 'font')

# 基础字符集：ASCII + 常用中文标点 + 货币符号
BASE = ''.join(chr(c) for c in range(0x20, 0x7f))
BASE += '　、。〈〉《》「」『』【】〔〕〖〗！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～＠￥％＃＆＊－／＝＋￥'
BASE += '·—…‰′″℃№™©®®°±×÷≈≠≤≥∞√∑∏∫µΩπ①②③④⑤⑥⑦⑧⑨⑩ⅠⅡⅢⅣⅤ'
BASE += '←↑→↓↔↕⤴⤵⇄⇅⌁⌂©®™ℹ️①②③④⑤⑥⑦⑧⑨⑩'
BASE += '←→↑↓↗↘↙↖⌚⌛⏰⏳✅❌❗⚠️⭐🌟💎🔥🎁🎉🏆🎰🎲🎯🎨🎬🎤🎧📱💰💳💎📈📉📊📦📮📨📩✉️'
BASE += '🏅🥇🥈🥉🏅💎💍👑👤👥🧑🤝🙏💪🎂🍰🎂⚽🏀🏈⚾🎾🏐🎳🏆🥇🚗🏠🏢🌆🌇🌃🌌🌠☀🌙⛅'

TEXT_EXT = ('.vue', '.js', '.json', '.css', '.html', '.ts')


def collect_chars():
    chars = set(BASE)
    n = 0
    for base, _, files in os.walk(SRC):
        for f in files:
            if not f.lower().endswith(TEXT_EXT):
                continue
            p = os.path.join(base, f)
            try:
                with open(p, encoding='utf-8') as fh:
                    chars.update(fh.read())
            except Exception:
                continue
            n += 1
    return chars, n


def main():
    chars, n = collect_chars()
    # 只保留可打印字符
    chars = {c for c in chars if c.isprintable() and c not in '\n\r\t'}
    text = ''.join(sorted(chars))
    print('扫描 %d 个源文件，字符集 %d 个字符' % (n, len(chars)))

    os.makedirs(FONT_DST, exist_ok=True)
    total_in = total_out = 0
    for f in sorted(os.listdir(FONT_SRC)):
        if not f.endswith('.woff2'):
            continue
        src = os.path.join(FONT_SRC, f)
        size_in = os.path.getsize(src)
        # 图标字体（uview-icon / unibtn）用的是私有区码位，源码里查不到，
        # 子集化会把字形清空 —— 这类字体直接原样复制。
        if 'icon' in f.lower() or 'unibtn' in f.lower():
            dst = os.path.join(FONT_DST, f)
            with open(src, 'rb') as fin, open(dst, 'wb') as fout:
                fout.write(fin.read())
            total_in += size_in
            total_out += size_in
            print('  %-40s %6d KB -> %5d KB (图标字体，原样复制)' % (f, size_in // 1024, size_in // 1024))
            continue
        dst = os.path.join(FONT_DST, f.replace('.woff2', '.subset.woff2'))
        cmd = ['pyftsubset', src,
               '--text=%s' % text,
               '--flavor=woff2',
               '--output-file=%s' % dst,
               '--layout-features=*',
               '--no-hinting',
               '--desubroutinize']
        try:
            subprocess.run(cmd, check=True, capture_output=True)
        except FileNotFoundError:
            sys.exit('缺少 pyftsubset，请先 pip install fonttools brotli')
        except subprocess.CalledProcessError as e:
            print('  [skip] %s: %s' % (f, e.stderr.decode()[:120]))
            continue
        size_out = os.path.getsize(dst)
        total_in += size_in
        total_out += size_out
        print('  %-40s %6d KB -> %5d KB' % (f, size_in // 1024, size_out // 1024))
    print('合计 %d KB -> %d KB' % (total_in // 1024, total_out // 1024))


if __name__ == '__main__':
    main()
