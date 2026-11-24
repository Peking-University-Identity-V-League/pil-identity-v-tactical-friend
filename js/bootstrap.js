import { changeLocale, getActiveLocale, initializeI18n, SUPPORTED_LOCALE_LIST, translate } from './core/i18n.js';
import { homeView } from './core/dom.js';
import { S } from './core/state.js';
import { initUpdatesUI } from './updates-ui.js';

const RESUME_VIEW_KEY = 'identityV.resumeView';

const LOCALE_DISPLAY_NAMES = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'vi-VN': 'Tiếng Việt',
};

function localeDisplayName(locale) {
  return LOCALE_DISPLAY_NAMES[locale] || locale;
}

async function startApplication() {
  await initializeI18n();
  initUpdatesUI();
  await import('./main.js');

  const requestedMap = new URLSearchParams(window.location.search).get('map');
  if (/^[0-8]$/.test(requestedMap || '')) {
    const { enterMap } = await import('./region.js');
    enterMap(Number(requestedMap));
    const clean = new URL(window.location.href);
    clean.searchParams.delete('map');
    history.replaceState(history.state, '', clean);
  } else {
    // 切换语言触发的整页刷新：恢复刷新前所在的地图与标签页
    let resume = null;
    try {
      resume = JSON.parse(sessionStorage.getItem(RESUME_VIEW_KEY) || 'null');
      sessionStorage.removeItem(RESUME_VIEW_KEY);
    } catch { /* sessionStorage 不可用时静默跳过 */ }
    if (resume && Number.isInteger(resume.map) && resume.map >= 0 && resume.map <= 8) {
      const { enterMap } = await import('./region.js');
      enterMap(resume.map);
      if (resume.tab === 'deduce' || resume.tab === 'region') {
        const { switchTab } = await import('./shell.js');
        switchTab(resume.tab);
      }
    }
  }

  const langBtn = document.getElementById('footerLangBtn');
  const langMenu = document.getElementById('footerLangMenu');
  if (!langBtn || !langMenu) return;

  const langCurrent = document.getElementById('footerLangCurrent');
  if (langCurrent) langCurrent.textContent = localeDisplayName(getActiveLocale());

  const renderLangMenu = () => {
    const current = getActiveLocale();
    langMenu.textContent = '';
    SUPPORTED_LOCALE_LIST.forEach((locale) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'footer-lang-option'
        + (locale === current ? ' active' : '');
      option.textContent = localeDisplayName(locale);
      option.setAttribute('role', 'menuitem');
      option.addEventListener('click', () => {
        if (locale !== current) {
          if (!homeView.classList.contains('active')) {
            try {
              sessionStorage.setItem(RESUME_VIEW_KEY,
                JSON.stringify({ map: S.currentMapId, tab: S.currentTab }));
            } catch { /* sessionStorage 不可用时放弃恢复 */ }
          }
          changeLocale(locale);
        }
        else langMenu.hidden = true;
      });
      langMenu.appendChild(option);
    });
  };

  const closeMenu = () => {
    langMenu.hidden = true;
    langBtn.setAttribute('aria-expanded', 'false');
  };

  langBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (langMenu.hidden) {
      renderLangMenu();
      langMenu.hidden = false;
      langBtn.setAttribute('aria-expanded', 'true');
    } else {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (langMenu.hidden) return;
    if (event.target.closest('.footer-lang') || event.target.closest('.header-lang')) return;
    closeMenu();
  });
}

// 深浅主题切换：localStorage 优先，默认暗色
const THEME_KEY = 'pil-theme';
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const root = document.documentElement;
  const apply = (theme) => {
    root.dataset.theme = theme;
    const toDark = theme !== 'dark';
    btn.textContent = toDark ? '☀️' : '🌙';
    btn.title = translate(toDark ? 'ui.theme.toDark' : 'ui.theme.toLight');
    btn.setAttribute('aria-label', btn.title);
  };
  apply(root.dataset.theme === 'light' ? 'light' : 'dark');
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 忽略隐私模式 */ }
    apply(next);
  });
}
initThemeToggle();

// 软键盘遮挡：iOS 键盘不压缩布局窗口，靠 visualViewport 把焦点输入框滚回可视区
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    const ae = document.activeElement;
    if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) {
      ae.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
}

startApplication().catch((error) => {
  console.error('Application initialization failed.', error);
});
