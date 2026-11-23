import { translate } from './i18n.js';


// ------------------------------------------------------------



// ------------------------------------------------------------
// 数字显示：必须惰性翻译。本模块经 dom.js 被 bootstrap 静态引用，模块加载时语言包尚未就绪，
// 若在模块顶层固化 translate 结果会冻结成裸键名
const CN_NUM_KEYS = ["numbers.zero", "numbers.one", "numbers.two", "numbers.three", "numbers.four", "numbers.five", "numbers.six", "numbers.seven", "numbers.eight", "numbers.nine", "numbers.ten"];

export const cnNum = (n) => (CN_NUM_KEYS[n] != null ? translate(CN_NUM_KEYS[n]) : String(n));

      

// ------------------------------------------------------------

// ------------------------------------------------------------
export const $ = (id) => document.getElementById(id)


export function mountImageOverlays(container) {
  container.insertAdjacentHTML('afterbegin',
    '<div class="loading-overlay">'
    + '<div class="loading-spinner"></div>'
    + '<div class="loading-text">' + translate("ui.map.mountImageOverlays.run") + '</div>'
    + '</div>')
  container.insertAdjacentHTML('beforeend',
    '<div class="image-error" style="display:none">'
    + '<span>' + translate("ui.map.mountImageOverlays.false") + '</span>'
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
