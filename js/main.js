
import { homeMapGrid } from './core/dom.js';
import { MAPS_DATA } from './data/maps.js';
import { enterMap } from './region.js';
import { bindSelDisplay } from './region-settings.js';
import { translate } from './core/i18n.js';

export function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#9e1b32', '#c9a063', '#c0485c', '#ddbe8c', '#c9962e'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.68 + 1.34;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 15 + 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

initParticles();


export function initHomePage() {
  const icons = ['🏭', '🏥', '⛪', '🏖️', '🎡', '🏠', '🏮', '🏯', '🌲']
  MAPS_DATA.forEach((map, index) => {
    const card = document.createElement('div')
    card.className = 'home-card'
    card.innerHTML = `
      <div class="home-card-img-wrap">
        <img class="home-card-img" src="images/home-thumb/${index}.webp" alt="${map.mapName}" loading="lazy" decoding="async" />
        <div class="home-card-icon">${icons[index]}</div>
      </div>
      <div class="home-card-info">
        <div class="home-card-name-group">
          <div class="home-card-name">${map.mapName}</div>
          <div class="home-card-name-en">${map.mapNameEn}</div>
        </div>
        <div class="home-card-enter">${translate('ui.home.enter')} ›</div>
      </div>
    `
    card.addEventListener('click', () => enterMap(index))
    const thumb = card.querySelector('.home-card-img')
    // 本地缩略图缺失时回退原图，再失败才隐藏
    thumb.onerror = () => {
      if (!thumb.dataset.fallback) {
        thumb.dataset.fallback = '1';
        thumb.src = map.mapImage;
      } else { thumb.style.display = 'none' }
    }
    homeMapGrid.appendChild(card)
  })
}


// ------------------------------------------------------------

// ------------------------------------------------------------

bindSelDisplay();
initHomePage()
