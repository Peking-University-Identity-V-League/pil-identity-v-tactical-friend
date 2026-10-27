import { translate } from './i18n.js';


// ------------------------------------------------------------



// ------------------------------------------------------------
export const CN_NUM = [translate("numbers.zero"), translate("numbers.one"), translate("numbers.two"), translate("numbers.three"), translate("numbers.four"), translate("numbers.five"), translate("numbers.six"), translate("numbers.seven"), translate("numbers.eight"), translate("numbers.nine"), translate("numbers.ten")];

export const cnNum = (n) => CN_NUM[n] ?? String(n);

      

// ------------------------------------------------------------

// ------------------------------------------------------------
export const $ = (id) => document.getElementById(id)


export function mountImageOverlays(container) {
  container.insertAdjacentHTML('afterbegin',
    '<div class="loading-overlay">'
    + '<div class="loading-spinner"></div>'
    + translate("application.mountImageOverlays")
    + '</div>')
  container.insertAdjacentHTML('beforeend',
    '<div class="image-error" style="display:none">'
    + translate("application.mountImageOverlaysAlternate")
    + '</div>')
  return {
    loading: container.querySelector('.loading-overlay'),
    error: container.querySelector('.image-error'),
  }
}



export function loadImageWithStatus(opts) {
  const { url, img, loading, error, state, crossOrigin, onReady, onFail } = opts
  loading.style.display = 'flex'
  error.style.display = 'none'
  img.style.visibility = 'hidden'

  if (state.timer) { clearTimeout(state.timer); state.timer = null }
  state.url = url

  const preload = new Image()
  if (crossOrigin) preload.crossOrigin = 'anonymous'
  preload.onload = () => {
    if (state.url !== url) return
    if (crossOrigin) img.crossOrigin = 'anonymous'
    img.src = url
    loading.style.display = 'none'
    img.style.visibility = 'visible'
    if (onReady) onReady(preload.naturalWidth, preload.naturalHeight)
  }
  preload.onerror = () => {
    if (state.url !== url) return
    loading.style.display = 'none'
    error.style.display = 'flex'
    if (onFail) onFail()
    state.timer = setTimeout(() => loadImageWithStatus(opts), 5000)
  }
  preload.src = url
}
