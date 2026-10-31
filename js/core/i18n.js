const DEFAULT_LOCALE = 'zh-CN';
const LOCALE_STORAGE_KEY = 'identityV.locale';
const SUPPORTED_LOCALES = [DEFAULT_LOCALE];
export const SUPPORTED_LOCALE_LIST = SUPPORTED_LOCALES;

let activeLocale = DEFAULT_LOCALE;
let activeMessages = {};

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
  const template = activeMessages[messageKey];
  if (typeof template !== 'string') {
    console.warn(`Missing translation: ${messageKey}`);
    return messageKey;
  }
  return interpolate(template, parameters);
}

export function translateDocument(root = document) {
  document.title = translate('ui.application.title');
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-attributes]').forEach((element) => {
    const attributeMappings = JSON.parse(element.dataset.i18nAttributes);
    Object.entries(attributeMappings).forEach(([attributeName, messageKey]) => {
      element.setAttribute(attributeName, translate(messageKey));
    });
  });
}

export async function initializeI18n() {
  activeLocale = resolveLocale(readPreferredLocale());
  const assets = JSON.parse(document.getElementById('pil-assets')?.textContent || '{}');
  const assetURL = assets[`locales/${activeLocale}.json`];
  const localeURL = new URL(assetURL || `./locales/${activeLocale}.json`, window.location.href);
  const revision = document.querySelector('meta[name="pil-client-revision"]')?.content;
  if (!assetURL && /^[a-f0-9]{40}$/.test(revision || '')) localeURL.searchParams.set('v', revision);
  const response = await fetch(localeURL);
  if (!response.ok) throw new Error(`Unable to load locale: ${activeLocale}`);
  activeMessages = await response.json();
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
