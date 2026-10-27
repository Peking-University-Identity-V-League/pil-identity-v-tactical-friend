
import { homeMapGrid } from './core/dom.js';
import { MAPS_DATA } from './data/maps.js';
import { bindSelDisplay, enterMap } from './region.js';

import { translate } from './core/i18n.js';

export function initParticles() {
  const container = document.getElementById('particles');
  const colors = ['#6366f1', '#f472b6', '#fbbf24', '#8b5cf6', '#34d399'];
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
    card.innerHTML = translate('application.homeMapCard', {
      mapImage: map.mapImage,
      mapName: map.mapName,
      mapIcon: icons[index],
      englishMapName: map.mapNameEn,
    })
    card.addEventListener('click', () => enterMap(index))
    const thumb = card.querySelector('.home-card-img')
    thumb.onerror = () => { thumb.style.display = 'none' }
    homeMapGrid.appendChild(card)
  })
}


// ------------------------------------------------------------

// ------------------------------------------------------------

bindSelDisplay();
initHomePage()
