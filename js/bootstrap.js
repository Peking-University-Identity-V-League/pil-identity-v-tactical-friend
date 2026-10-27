import { initializeI18n } from './core/i18n.js';

async function startApplication() {
  await initializeI18n();
  await import('./main.js');
}

startApplication().catch((error) => {
  console.error('Application initialization failed.', error);
});
