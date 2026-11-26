import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

// 语言包值中的 {@key} 引用（与 js/core/i18n.js 的 REFERENCE_PATTERN 同步）必须能在本语言包内解析到存在的键
const LOCALES = ['zh-CN', 'en-US', 'vi-VN'];
const REFERENCE_PATTERN = /\{@([A-Za-z0-9_.-]+)\}/g;

test('every {@key} reference in locale files resolves within the same pack', () => {
  for (const locale of LOCALES) {
    const file = path.join(import.meta.dirname, '..', '..', 'locales', `${locale}.json`);
    const messages = JSON.parse(fs.readFileSync(file, 'utf8'));
    let count = 0;
    for (const [key, value] of Object.entries(messages)) {
      if (typeof value !== 'string') continue;
      for (const match of value.matchAll(REFERENCE_PATTERN)) {
        count++;
        assert.ok(
          Object.hasOwn(messages, match[1]),
          `${locale}: "${key}" references missing key "${match[1]}"`
        );
      }
    }
    assert.ok(count > 0, `${locale}: expected at least one {@key} reference`);
  }
});
