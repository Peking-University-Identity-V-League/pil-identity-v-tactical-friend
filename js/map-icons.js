import { COMMON_ICON_URL } from './data/items_common.js';

export const ROLE_ICON_URLS = {
  survivor: COMMON_ICON_URL.survivor,
  hunter: COMMON_ICON_URL.hunter,
};
export const CIPHER_ICON_URL = COMMON_ICON_URL.cipherMachine;

function createIconState(url, onLoad = null) {
  const state = { img: null, loaded: false, retryTimer: null };
  const load = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      state.img = img; state.loaded = true;
      if (state.retryTimer) clearTimeout(state.retryTimer);
      state.retryTimer = null;
      onLoad?.();
    };
    img.onerror = () => {
      state.loaded = false;
      if (state.retryTimer) clearTimeout(state.retryTimer);
      state.retryTimer = setTimeout(load, 3350);
    };
    img.src = url;
    if (img.complete && img.naturalWidth > 0) img.onload();
  };
  load();
  return state;
}

export const roleIcons = {
  survivor: createIconState(ROLE_ICON_URLS.survivor),
  hunter: createIconState(ROLE_ICON_URLS.hunter),
};
export const cipherIcon = createIconState(CIPHER_ICON_URL, () => { document.dispatchEvent(new Event("map-icon-cipher-loaded")); });
export const doorIcon = createIconState(COMMON_ICON_URL.escapeDoor);
