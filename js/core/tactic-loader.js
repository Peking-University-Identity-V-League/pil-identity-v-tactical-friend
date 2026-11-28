// tactic.js 是全站最大的模块，首屏主页用不到。
// 这里提供同名异步包装：首次调用时才动态加载 tactic.js，
// 之后复用同一模块实例；调用方按原顺序调用即按原顺序执行。
let tacticModulePromise = null;

export function loadTactic() {
  if (!tacticModulePromise) tacticModulePromise = import('../tactic/index.js');
  return tacticModulePromise;
}

export function enterTactic(...args) {
  loadTactic().then((module) => module.enterTactic(...args));
}

export function renderTacCiphers(...args) {
  loadTactic().then((module) => module.renderTacCiphers(...args));
}

export function tacResetTransient(...args) {
  loadTactic().then((module) => module.tacResetTransient(...args));
}
