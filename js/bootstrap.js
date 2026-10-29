import { changeLocale, getActiveLocale, initializeI18n, SUPPORTED_LOCALE_LIST } from './core/i18n.js';

const LOCALE_DISPLAY_NAMES = {
  'zh-CN': '简体中文',
};

function localeDisplayName(locale) {
  return LOCALE_DISPLAY_NAMES[locale] || locale;
}

async function startApplication() {
  await initializeI18n();
  await import('./main.js');

  const langBtn = document.getElementById('footerLangBtn');
  const langMenu = document.getElementById('footerLangMenu');
  if (!langBtn || !langMenu) return;

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
        if (locale !== current) changeLocale(locale);
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
    if (event.target.closest('.footer-lang')) return;
    closeMenu();
  });
}

startApplication().catch((error) => {
  console.error('Application initialization failed.', error);
});
