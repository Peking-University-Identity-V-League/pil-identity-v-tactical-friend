const DEFAULT_LOCALE = 'zh-CN';
const LOCALE_STORAGE_KEY = 'identityV.locale';
const SUPPORTED_LOCALES = [DEFAULT_LOCALE, 'en-US', 'vi-VN'];
export const SUPPORTED_LOCALE_LIST = SUPPORTED_LOCALES;

let activeLocale = DEFAULT_LOCALE;
let activeMessages = {};
let englishMessages = null;
let fallbackMessages = null;

function resolveLocale(requestedLocale) {
  const normalizedLocale = String(requestedLocale || '').toLowerCase();
  return SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === normalizedLocale)
    || SUPPORTED_LOCALES.find((locale) => normalizedLocale.startsWith(locale.slice(0, 2).toLowerCase()))
    || DEFAULT_LOCALE;
}

function readPreferredLocale() {
  const localeFromUrl = new URLSearchParams(window.location.search).get('lang');
  if (localeFromUrl) return localeFromUrl;
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY) || navigator.language;
  } catch {
    return navigator.language;
  }
}

function interpolate(template, parameters) {
  return template.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (placeholder, parameterName) => {
    if (!Object.hasOwn(parameters, parameterName)) return placeholder;
    return String(parameters[parameterName]);
  });
}

export function translate(messageKey, parameters = {}) {
  let template = activeMessages[messageKey];
  // 其它语言包缺键时回退中文
  if (typeof template !== 'string' && fallbackMessages) template = fallbackMessages[messageKey];
  if (typeof template !== 'string') {
    console.warn(`Missing translation: ${messageKey}`);
    return messageKey;
  }
  return interpolate(template, parameters);
}

// 非英语界面下，英文副标注一律取英语语言包中同一键的值
export function translateEn(messageKey, parameters = {}) {
  const source = activeLocale === 'en-US' ? activeMessages : (englishMessages || activeMessages);
  const template = source[messageKey];
  if (typeof template !== 'string') return translate(messageKey, parameters);
  return interpolate(template, parameters);
}

export function translateDocument(root = document) {
  document.title = translate('ui.title');
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-en]').forEach((element) => {
    // 副标注不重复主文案开头的 emoji / 符号
    element.textContent = translateEn(element.dataset.i18nEn).replace(/^[^\p{L}\p{N}]+\s*/u, '');
  });
  root.querySelectorAll('[data-i18n-attributes]').forEach((element) => {
    const attributeMappings = JSON.parse(element.dataset.i18nAttributes);
    Object.entries(attributeMappings).forEach(([attributeName, messageKey]) => {
      element.setAttribute(attributeName, translate(messageKey));
    });
  });
}

async function loadLocaleMessages(locale) {
  const assets = JSON.parse(document.getElementById('pil-assets')?.textContent || '{}');
  const assetURL = assets[`locales/${locale}.json`];
  const localeURL = new URL(assetURL || `./locales/${locale}.json`, window.location.href);
  const revision = document.querySelector('meta[name="pil-client-revision"]')?.content;
  if (!assetURL && /^[a-f0-9]{40}$/.test(revision || '')) localeURL.searchParams.set('v', revision);
  const response = await fetch(localeURL);
  if (!response.ok) throw new Error(`Unable to load locale: ${locale}`);
  return response.json();
}

export async function initializeI18n() {
  activeLocale = resolveLocale(readPreferredLocale());
  const needsEnglish = activeLocale !== 'en-US';
  const needsFallback = activeLocale !== DEFAULT_LOCALE;
  const [active, english, fallback] = await Promise.all([
    loadLocaleMessages(activeLocale),
    // 英文副标注需要英语语言包；加载失败时静默退回当前语言
    needsEnglish ? loadLocaleMessages('en-US').catch(() => null) : Promise.resolve(null),
    // 非中文语言包缺键时回退中文；加载失败时静默退回键名
    needsFallback ? loadLocaleMessages(DEFAULT_LOCALE).catch(() => null) : Promise.resolve(null),
  ]);
  activeMessages = active;
  englishMessages = english;
  fallbackMessages = fallback;
  document.documentElement.lang = activeLocale;
  translateDocument();
}

export function getActiveLocale() {
  return activeLocale;
}

export function changeLocale(requestedLocale) {
  const nextLocale = resolveLocale(requestedLocale);
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    window.location.reload();
  } catch {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('lang', nextLocale);
    window.location.assign(nextUrl);
  }
}
