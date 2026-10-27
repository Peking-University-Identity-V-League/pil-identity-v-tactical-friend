
import { dedAlert, dedAlertText, dedChainSvg, dedConclusion, dedLawBtn, dedLawBtnDouyin, dedLayouts, dedLegend, dedMapImage, dedMapTitle, dedMapTitleEn, dedMapWrap, dedProgress, dedResetBtn, dedRuleList, dedSteps, deduceView } from './core/dom.js';
import { TAC_LS_KEY, saveRegionSel } from './core/persist.js';
import { S } from './core/state.js';
import { cnNum, loadImageWithStatus, mountImageOverlays } from './core/utils.js';
import { MAPS_DATA } from './data/maps.js';
import { dedDataOf } from './shell.js';

import { translate } from './core/i18n.js';

export const { loading: dedLoading, error: dedImageError } =
  mountImageOverlays(dedMapWrap)




export function isValidLawUrl(url) {
  return typeof url === 'string' && /^https?:\/\/\S+$/.test(url.trim())
}

export function getLawUrls() {
  const urls = MAPS_DATA[S.currentMapId].law_urls
  return Array.isArray(urls) ? urls : []
}


export function updateLawBtn() {
  const urls = getLawUrls()
  dedLawBtn.classList.toggle('disabled', !isValidLawUrl(urls[0]))
  dedLawBtnDouyin.classList.toggle('disabled', !isValidLawUrl(urls[1]))
}

export function bindLawBtn(btn, idx) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    const url = getLawUrls()[idx]
    if (isValidLawUrl(url)) {
      window.open(url.trim(), '_blank')
    }
  })
}

bindLawBtn(dedLawBtn, 0)

bindLawBtn(dedLawBtnDouyin, 1)



// ------------------------------------------------------------

// ------------------------------------------------------------
export const posName = (map, id) => (map.ciphers[id] ? map.ciphers[id].name : `#${id}`);


export function deduce(map, marks) {
  const N = map.ciphers.length;
  const state = new Array(N).fill(null);
  const sources = new Array(N).fill(null);
  const steps = [];
  let contradiction = null;
  let contraFrozen = null; 

  
  const set = (id, value) => {
    if (state[id] !== null) return false;
    state[id] = value;
    return true;
  };

  
  const record = (rule, newly, value, scope) => {
    const stepNo = steps.length + 1;
    newly.forEach((p) => { sources[p] = stepNo; });
    steps.push({
      rule: rule.name,
      detail: rule.list,
      conclusions: newly.map((p) => ({ id: p, value, inferred: true })),
      scope,
    });
  };

  
  const flush = (rule, targets, value, scope) => {
    const newly = targets.filter((p) => set(p, value));
    if (newly.length === 0) return false;
    record(rule, newly, value, scope || { kind: 'circle', positions: [...rule.positions] });
    return true;
  };

  
  const pick = (ps, v) => ps.filter((p) => state[p] === v);

  
  for (const [k, v] of Object.entries(marks)) {
    const id = Number(k);
    if (map.ciphers[id] && !map.ciphers[id].locked) state[id] = v;
  }

  
  
  
  const runChain = (rule) => {
    const chain = rule.positions;
    if (!chain || chain.length < 2) return false;
    const edgeCount = rule.cyclic ? chain.length : chain.length - 1;
    
    for (let k = 0; k < edgeCount; k++) {
      const [a, b] = [chain[k], chain[(k + 1) % chain.length]];
      if (!contraFrozen && rule.mode === 'yes'
        && state[a] === 'yes' && state[b] === 'yes') {
        contradiction = translate("deduction.runChain", { name: rule.name, nameSecondary: posName(map, a), nameTertiary: posName(map, b) })
          + translate("deduction.runChainAlternate");
      }
      if (!contraFrozen && rule.mode === 'no'
        && state[a] === 'no' && state[b] === 'no') {
        contradiction = translate("deduction.runChain", { name: rule.name, nameSecondary: posName(map, a), nameTertiary: posName(map, b) })
          + translate("deduction.runChainThird");
      }
    }
    
    const want = rule.mode === 'yes' ? 'yes' : 'no';
    const give = rule.mode === 'yes' ? 'no' : 'yes';
    const targets = chain.filter((id, idx) => {
      const prev = chain[(idx - 1 + chain.length) % chain.length];
      const next = chain[(idx + 1) % chain.length];
      const hitPrev = (rule.cyclic || idx > 0) && state[prev] === want;
      const hitNext = (rule.cyclic || idx < chain.length - 1) && state[next] === want;
      return hitPrev || hitNext;
    });
    const newly = targets.filter((p) => set(p, give));
    if (newly.length === 0) return false;
    record(rule, newly, give, {
      kind: 'chain',
      positions: [...chain],
      cyclic: !!rule.cyclic,
    });
    return true;
  };

  
  const propagateCount = (rule, min, max, overNo, overYes, yesFirst = false) => {
    const yesIdx = pick(rule.positions, 'yes');
    const noIdx = pick(rule.positions, 'no');
    const unknown = pick(rule.positions, null);
    const checks = [
      [noIdx.length > rule.positions.length - min, overNo, noIdx.length],
      [yesIdx.length > max, overYes, yesIdx.length],
    ];
    if (yesFirst) checks.reverse();
    for (const [hit, msg, count] of checks) {
      if (hit) {
        if (!contraFrozen) contradiction = msg(count);
        return false;
      }
    }
    if (unknown.length === 0) return false;
    if (yesIdx.length === max) return flush(rule, unknown, 'no');
    if (noIdx.length === rule.positions.length - min) return flush(rule, unknown, 'yes');
    return false;
  };

  
  const propagate = () => {
    let anyNew = false;
    contraFrozen = contradiction;
    for (const rule of map.rules) {
      let changed = false;
      if (rule.kind === 'fixed') {
        changed = flush(rule, pick(rule.positions, null), 'yes');
      } else if (rule.kind === 'chain') {
        changed = runChain(rule);
      } else if (rule.kind === 'region') {
        
        changed = propagateCount(
          rule, rule.min, rule.max,
          (c) => translate("deduction.propagate", { list: rule.list, value: cnNum(rule.min) })
            + translate("deduction.propagateAlternate", { count: c }),
          (c) => translate("deduction.propagateThird", { list: rule.list, value: cnNum(rule.max) })
            + translate("deduction.propagateFourth", { count: c }),
        );
      } else if (rule.kind === 'exactly') {
        
        changed = propagateCount(
          rule, rule.n, rule.n,
          (c) => translate("deduction.propagateFifth", { list: rule.list, n: rule.n })
            + translate("deduction.propagateSixth", { count: c }),
          (c) => translate("deduction.propagateFifth", { list: rule.list, n: rule.n })
            + translate("deduction.propagateSeventh", { count: c }),
          true,
        );
      } else if (rule.kind === 'atLeast') {
        
        const [a, b] = rule.positions;
        if (state[a] === 'no' && state[b] === 'no') {
          if (!contraFrozen) {
            contradiction = translate("deduction.propagate", { list: rule.list, value: cnNum(rule.n) })
              + translate("deduction.propagateEighth");
          }
        } else {
          const other = state[a] === 'no' ? b : state[b] === 'no' ? a : null;
          if (other !== null) changed = flush(rule, [other], 'yes');
        }
      } else if (rule.kind === 'same') {
        
        const [a, b] = rule.positions;
        if (state[a] !== null && state[b] !== null && state[a] !== state[b]) {
          if (!contraFrozen) {
            contradiction = translate("deduction.propagateNinth", { list: rule.list })
              + translate("deduction.propagateTenth");
          }
        } else if (state[a] !== null && state[b] === null) {
          changed = flush(rule, [b], state[a]);
        } else if (state[b] !== null && state[a] === null) {
          changed = flush(rule, [a], state[b]);
        }
      } else if (rule.kind === 'atMost') {
        
        const yesIdx = pick(rule.positions, 'yes');
        if (yesIdx.length > rule.n) {
          if (!contraFrozen) {
            contradiction = translate("deduction.propagateThird", { list: rule.list, value: cnNum(rule.n) })
              + translate("deduction.propagateSeventh", { count: yesIdx.length });
          }
        } else if (yesIdx.length === rule.n) {
          changed = flush(rule, pick(rule.positions, null), 'no');
        }
      } else if (rule.kind === 'allAbsent') {
        
        if (rule.pres.every((p) => state[p] === 'no')) {
          changed = flush(rule,
            rule.targets.filter((p) => state[p] === null), 'yes');
        }
      } else if (rule.kind === 'implies') {
        
        const c = rule.cons;
        if (state[c] === 'no' && rule.pres.some((p) => state[p] === 'yes')) {
          if (!contraFrozen) {
            contradiction = translate("deduction.propagateEleventh", { name: rule.name, list: rule.list });
          }
        }
        if (rule.pres.some((p) => state[p] === 'yes') && state[c] === null) {
          changed = flush(rule, [c], 'yes');
        }
        if (state[c] === 'no') {
          changed = flush(rule, rule.pres.filter((p) => state[p] === null), 'no')
            || changed;
        }
      } else if (rule.kind === 'chainRun') {
        
        const ps = rule.positions;
        const chainScope = { kind: 'chainRun', positions: [...ps] };
        for (let k = 0; k + 2 < ps.length; k++) {
          if (state[ps[k]] === 'yes' && state[ps[k + 1]] === 'yes'
            && state[ps[k + 2]] === 'yes') {
            if (!contraFrozen) {
              contradiction = translate("deduction.propagateTwelfth", { name: rule.name, nameSecondary: posName(map, ps[k]) })
                + translate("deduction.propagateThirteenth", { name: posName(map, ps[k + 1]), nameSecondary: posName(map, ps[k + 2]) })
                + translate("deduction.propagateFourteenth");
            }
          }
        }
        for (let k = 0; k + 2 < ps.length; k++) {
          if (state[ps[k]] === 'yes' && state[ps[k + 1]] === 'yes'
            && state[ps[k + 2]] === null) {
            changed = flush(rule, [ps[k + 2]], 'no', chainScope) || changed;
          }
          if (state[ps[k + 1]] === 'yes' && state[ps[k + 2]] === 'yes'
            && state[ps[k]] === null) {
            changed = flush(rule, [ps[k]], 'no', chainScope) || changed;
          }
        }
      } else if (rule.kind === 'link') {
        
        const m = rule.marker;
        const mIn = rule.region.includes(m);
        const others = rule.region.filter((p) => p !== m);
        const cnt = pick(others, 'yes').length;   
        const unknown = pick(others, null);
        if (state[m] !== null) {
          
          const match = (state[m] === 'yes') === rule.positive;
          const target = match ? 3 : 2;
          const need = target - cnt - (mIn && state[m] === 'yes' ? 1 : 0);
          if (unknown.length === 0 && need !== 0 && !contraFrozen) {
            contradiction = translate("deduction.propagateEleventh", { name: rule.name, list: rule.list });
          }
          if (need === 0 && unknown.length > 0) {
            changed = flush(rule, unknown, 'no') || changed;
          } else if (need > 0 && need === unknown.length) {
            changed = flush(rule, unknown, 'yes') || changed;
          }
        } else if (unknown.length === 0) {
          
          
          
          
          const totalIfYes = cnt + (mIn ? 1 : 0); 
          const okYes = (totalIfYes === 3) === rule.positive; 
          const okNo = (cnt === 3) !== rule.positive;         
          if (okYes && !okNo) changed = flush(rule, [m], 'yes') || changed;
          else if (okNo && !okYes) changed = flush(rule, [m], 'no') || changed;
        }
      }
      if (changed) anyNew = true;
    }
    return anyNew;
  };

  
  const consistent = (cfg) =>
    state.every((s, i) => s === null || (s === 'yes') === cfg.includes(i));

  
  const runGlobal = () => {
    if (contradiction) return false;
    const candidates = map.configs
      .map((_, i) => i)
      .filter((i) => consistent(map.configs[i]));
    if (candidates.length === 0) return false;
    const groups = { yes: [], no: [] };
    for (let p = 0; p < N; p++) {
      if (state[p] !== null) continue;
      const inAll = candidates.every((ci) => map.configs[ci].includes(p));
      const inNone = candidates.every((ci) => !map.configs[ci].includes(p));
      if (inAll) groups.yes.push(p);
      else if (inNone) groups.no.push(p);
    }
    let anyNew = false;
    const rule = { name: translate("deduction.name"), list: translate("deduction.list") };
    for (const [value, group] of Object.entries(groups)) {
      if (group.length === 0) continue;
      group.forEach((p) => set(p, value));
      record(rule, group, value, { kind: 'circle', positions: [...group] });
      anyNew = true;
    }
    return anyNew;
  };

  
  
  
  let guard = 0;
  while (guard++ < 50) {
    let changed = false;
    while (propagate()) changed = true;
    if (runGlobal()) changed = true;
    if (!changed) break;
  }

  
  const candidates = map.configs
    .map((_, i) => i)
    .filter((i) => consistent(map.configs[i]));
  if (!contradiction && candidates.length === 0) {
    contradiction = translate("deduction.deduce", { count: cnNum(map.configs.length) })
      + translate("deduction.deduceAlternate");
  }

  return { state, marks, steps, contradiction, candidates, sources };
}

// ------------------------------------------------------------

// ------------------------------------------------------------
export const STEP_NUMS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩',
  '⑪', '⑫', '⑬', '⑭', '⑮'];

export const stepNum = (n) => (n >= 1 && n <= STEP_NUMS.length ? STEP_NUMS[n - 1] : `${n}`);


export const DED_LEGEND = [
  { label: translate("deduction.label"), dot: 'lg-yes' },
  { label: translate("deduction.labelAlternate"), dot: 'lg-no' },
  { label: translate("deduction.labelThird"), dot: 'lg-inf-yes' },
  { label: translate("deduction.labelFourth"), dot: 'lg-inf-no' },
];


export const ICON_BOLT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
  + '<path d="M13.2 2.3 5.4 13.4c-.3.4 0 1 .5 1h4.6l-1.7 7c-.1.5.5.8.9.4'
  + 'l8.6-11.4c.3-.4 0-1-.5-1h-4.7l1.5-6.7c.1-.5-.5-.8-.9-.4Z"/></svg>';

export const ICON_CROSS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"'
  + ' stroke-width="3" stroke-linecap="round" aria-hidden="true">'
  + '<path d="M6 6l12 12M18 6L6 18"/></svg>';

export const ICON_LOCK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
  + '<path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0'
  + ' 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z"/></svg>';


export function markKind(pos, value, userMark) {
  if (pos.locked) return ['locked', ICON_LOCK, translate("deduction.states.guaranteed")];
  const inferred = value !== null && userMark === undefined;
  if (value === 'yes') {
    return inferred
      ? ['inf-yes', ICON_BOLT, translate("deduction.entriesTwo")]
      : ['user-yes', ICON_BOLT, translate("deduction.entriesTwoAlternate")];
  }
  if (value === 'no') {
    return inferred
      ? ['inf-no', ICON_CROSS, translate("deduction.entriesTwoThird")]
      : ['user-no', ICON_CROSS, translate("deduction.entriesTwoFourth")];
  }
  return ['unknown', '', translate("deduction.entriesTwoFifth")];
}


export const dedImageState = { url: null, timer: null };

export function loadDedMapImage() {
  const [mw, mh] = S.dedMap.mapSize;
  dedMapWrap.style.aspectRatio = `${mw} / ${mh}`; 
  loadImageWithStatus({
    url: S.dedMap.mapImage,
    img: dedMapImage,
    loading: dedLoading,
    error: dedImageError,
    state: dedImageState,
    onReady: (w, h) => {
      dedMapWrap.style.aspectRatio = `${w} / ${h}`;
    },
  });
}


export function enterDeduce() {
  const map = dedDataOf(S.currentMapId);
  if (!map) return;
  if (S.dedMap !== map) {
    S.dedMap = map;
    S.dedMarks = {};
    S.dedSelectedStep = null;
    dedMapTitle.textContent = MAPS_DATA[S.currentMapId].mapName;
    dedMapTitleEn.textContent = MAPS_DATA[S.currentMapId].mapNameEn;
    loadDedMapImage();
    
    dedLegend.innerHTML = DED_LEGEND.map((item) =>
      `<div class="legend-item">
        <span class="legend-dot ${item.dot}"></span><span>${item.label}</span>
      </div>`).join('');
    dedRuleList.innerHTML = map.ruleBook.map((r) =>
      `<li><span class="rule-title">${r.title}</span>`
      + `<span class="rule-text"> — ${r.text}</span></li>`).join('');
  }
  
  try {
    const pd = JSON.parse(localStorage.getItem(TAC_LS_KEY) || 'null');
    if (pd && pd.dedMarks && pd.dedMarks[S.currentMapId]) S.dedMarks = pd.dedMarks[S.currentMapId];
  } catch (err) {  }
  renderDeduction();
}


export function toggleDedMark(id) {
  const pos = S.dedMap.ciphers[id];
  if (!pos || pos.locked) return;
  const cur = S.dedMarks[id];
  if (cur === undefined) S.dedMarks[id] = 'yes';
  else if (cur === 'yes') S.dedMarks[id] = 'no';
  else delete S.dedMarks[id];
  S.dedSelectedStep = null;
  renderDeduction();
  saveRegionSel() 
}

export function renderDeduction() {
  const d = deduce(S.dedMap, S.dedMarks);
  deduceView.classList.toggle('dimmed', !!d.contradiction);
  dedAlert.style.display = d.contradiction ? '' : 'none';
  dedAlertText.textContent = d.contradiction || '';
  renderDedTopBar(d);
  renderDedMap(d);
  renderDedSteps(d);
  renderDedLayouts(d);
}


export function renderDedTopBar(d) {
  const total = S.dedMap.configs[0].length;
  const yesCount = d.state.filter((s) => s === 'yes').length;
  const bars = Array.from({ length: total }, (_, i) =>
    `<i class="${i < yesCount ? 'on' : ''}"></i>`).join('');
  dedProgress.innerHTML =
    `<span class="ded-progress-num">${yesCount}<small> / ${total}</small></span>`
    + `<span class="ded-progress-bars">${bars}</span>`;

  const locked = !d.contradiction && d.candidates.length === 1;
  dedConclusion.className = 'ded-conclusion'
    + (d.contradiction ? ' bad' : locked ? ' gold' : '');
  if (d.contradiction) {
    dedConclusion.textContent = translate("deduction.renderDedTopBar");
  } else if (locked) {
    dedConclusion.textContent = translate("deduction.renderDedTopBarAlternate", { value: d.candidates[0] + 1 });
  } else {
    dedConclusion.innerHTML = translate("deduction.renderDedTopBarThird")
      + translate("deduction.renderDedTopBarFourth", { count: d.candidates.length, countSecondary: S.dedMap.configs.length });
  }
}


export function renderDedMap(d) {
  const [mw, mh] = S.dedMap.mapSize;

  
  dedMapWrap.querySelectorAll('.ded-marker, .scope-ring').forEach((el) => el.remove());
  dedChainSvg.innerHTML = '';
  dedChainSvg.setAttribute('viewBox', `0 0 ${mw} ${mh}`);

  
  const scope = S.dedSelectedStep !== null && d.steps[S.dedSelectedStep]
    ? d.steps[S.dedSelectedStep].scope
    : null;
  
  if (scope && (scope.kind === 'chain' || scope.kind === 'chainRun')
    && scope.positions) {
    const pts = scope.positions
      .map((id) => S.dedMap.ciphers[id].location.join(','));
    if (scope.cyclic) pts.push(pts[0]); 
    const points = pts.join(' ');
    dedChainSvg.innerHTML =
      `<polyline points="${points}" fill="none" stroke="rgba(244, 114, 182, 0.8)"
        stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round"
        stroke-linejoin="round" class="chain-line"/>`;
  }

  
  const ringIds = scope && scope.kind === 'circle' ? scope.positions : [];
  for (const id of ringIds) {
    const [x, y] = S.dedMap.ciphers[id].location;
    const ring = document.createElement('span');
    ring.className = 'scope-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.style.left = `${(x / mw) * 100}%`;
    ring.style.top = `${(y / mh) * 100}%`;
    dedMapWrap.appendChild(ring);
  }

  
  S.dedMap.ciphers.forEach((pos, id) => {
    const [kind, icon, stateText] = markKind(pos, d.state[id], d.marks[id]);
    const [x, y] = pos.location;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `ded-marker ${kind}`;
    btn.disabled = !!pos.locked;
    btn.style.left = `${(x / mw) * 100}%`;
    btn.style.top = `${(y / mh) * 100}%`;
    btn.title = `${pos.name}·${stateText}`;
    btn.setAttribute('aria-label', translate("deduction.renderDedMap", { name: pos.name, stateText: stateText }));
    btn.innerHTML =
      `<span class="ded-marker-circle">${icon}</span>`
      + `<span class="ded-marker-label">${pos.name}</span>`;
    btn.addEventListener('click', () => toggleDedMark(id));
    dedMapWrap.appendChild(btn);
  });
}


export function splitDedRule(step) {
  const sep = step.rule.indexOf(' · ');
  return sep > 0
    ? { kind: step.rule.slice(0, sep), rest: step.rule.slice(sep + 3) }
    : { kind: step.rule, rest: step.detail || null };
}


export function renderDedSteps(d) {
  if (d.steps.length === 0) {
    dedSteps.innerHTML = `<p class="ded-empty">${S.dedMap.emptyHint}</p>`;
    return;
  }
  dedSteps.innerHTML = '';
  d.steps.forEach((step, i) => {
    const { kind, rest } = splitDedRule(step);
    const li = document.createElement('li');
    li.className = 'ded-step' + (S.dedSelectedStep === i ? ' active' : '');
    const conclusions = step.conclusions.map((c, j) =>
      `${j > 0 ? translate("deduction.conclusions") : ''}`
      + `<span class="${c.value === 'yes' ? 'c-yes' : 'c-no'}">`
      + `${posName(S.dedMap, c.id)}${c.value === 'yes' ? translate("deduction.states.present") : translate("deduction.states.absent")}</span>`
    ).join('');
    li.innerHTML =
      translate("deduction.renderDedSteps", { value: S.dedSelectedStep === i, valueSecondary: stepNum(i + 1), kind: kind, valueTertiary: rest ? `<span class="ded-step-rest">${rest}</span>` : '', conclusions: conclusions });
    li.querySelector('button').addEventListener('click', () => {
      S.dedSelectedStep = S.dedSelectedStep === i ? null : i;
      renderDeduction();
    });
    dedSteps.appendChild(li);
  });
}


export function renderDedLayouts(d) {
  dedLayouts.innerHTML = '';
  S.dedMap.configs.forEach((cfg, ci) => {
    const excluded = !!d.contradiction || !d.candidates.includes(ci);
    const unique = !d.contradiction
      && d.candidates.length === 1 && d.candidates[0] === ci;
    const li = document.createElement('li');
    li.className = 'ded-layout' + (excluded ? ' excluded' : '');
    const names = cfg.map((p) => {
      const userMark = d.marks[p];
      const s = d.state[p];
      
      const cls = userMark === 'yes' ? 'm-yes'
        : userMark === 'no' ? 'm-no'
        : s === 'yes' ? 'i-yes'
        : s === 'no' ? 'i-no' : '';
      return `<span class="${cls}"${userMark ? translate("deduction.names") : ''}>`
        + `${posName(S.dedMap, p)}</span>`;
    }).join('');
    li.innerHTML =
      translate("deduction.renderDedLayouts", { value: unique ? ' unique' : '', valueSecondary: ci + 1 })
      + `<span class="ded-layout-names"
          style="grid-template-columns:repeat(${cfg.length}, minmax(0, 1fr))">
          ${names}</span>`;
    dedLayouts.appendChild(li);
  });
}


export function resetDedMarks() {
  S.dedMarks = {};
  S.dedSelectedStep = null;
  renderDeduction();
}

dedResetBtn.addEventListener('click', resetDedMarks);
