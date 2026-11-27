// js/core/polyfills.js
// 兼容旧内核（Android WebView < Chrome98 / iOS < 15.4 等）缺失的现代 API。
// 全部用「先探测、缺失才补」的守卫写法：新内核直接走原生，行为零变化。

// 1) Object.hasOwn（ES2022）
if (!Object.hasOwn) {
  Object.hasOwn = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
}

// 2) Array.prototype.at（ES2022，负索引）
if (!Array.prototype.at) {
  Array.prototype.at = function (n) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    return (n >= 0 && n < this.length) ? this[n] : undefined;
  };
}

// 3) findLast / findLastIndex（ES2023）
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function (predicate, thisArg) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, this[i], i, this)) return this[i];
    }
    return undefined;
  };
}
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function (predicate, thisArg) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate.call(thisArg, this[i], i, this)) return i;
    }
    return -1;
  };
}

// 4) structuredClone（ES2022）
// 本项目只用它克隆「可 JSON 序列化」的纯数据（persist 的 regions/marks/rot、
// anim 配置、board.measures），JSON 往返即可覆盖；若未来要克隆 Date/Map/Set/循环引用，
// 再替换成完整的 structuredClone ponyfill。
if (typeof structuredClone !== 'function') {
  globalThis.structuredClone = function (value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  };
}
