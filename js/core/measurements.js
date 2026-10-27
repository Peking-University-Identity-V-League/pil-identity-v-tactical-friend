// JSON stores each segment's copy of its route configuration. Reconnect those
// copies per board after loading; different routes may have the same legacy lid.
export function restoreMeasureReferences(boards) {
  for (const board of Object.values(boards)) {
    const routes = new Map();
    for (const measure of board.measures || []) {
      if (measure.chain == null || !measure.lc) continue;
      if (!routes.has(measure.chain)) routes.set(measure.chain, measure.lc);
      measure.lc = routes.get(measure.chain);
    }
  }
}

export function measureIdCounters(boards) {
  const counters = { route: 0, config: 0, buff: 0 };
  const include = (key, id) => {
    if (Number.isSafeInteger(id) && id > counters[key]) counters[key] = id;
  };
  for (const board of Object.values(boards)) {
    for (const measure of board.measures || []) {
      include('route', measure.chain);
      include('config', measure.lc?.lid);
      for (const buff of measure.lc?.buffs || []) {
        include('buff', buff.id);
        include('buff', buff.linkId);
      }
    }
  }
  return counters;
}

export function measureBaseAt(config, index) {
  return config.bases.find((base) => base.from <= index && base.to > index)
    || config.bases[0];
}

// Distances are in metres. A timed bonus starts on arrival at its first vertex,
// and its clock keeps running through segments where it does not apply.
export function simulateMovement(distances, config, applies = () => true) {
  const n = distances.length;
  const buffs = config.buffs
    .map((buff) => ({ ...buff,
      from: Math.max(0, Math.min(n, buff.from ?? 0)),
      to: Math.max(0, Math.min(n, buff.to ?? n)) }))
    .filter((buff) => buff.to > buff.from);
  const arrival = [0];
  const out = [];
  let time = 0;
  for (let i = 0; i < n; i++) {
    const dist = distances[i];
    const base = measureBaseAt(config, i);
    const inDomain = buffs.filter((buff) => !base.fixed
      && buff.from <= i && buff.to >= i + 1 && applies(buff, base));
    const segment = { dist, t: 0, t0: dist / base.speed, parts: [] };
    let rest = dist;
    while (rest > 1e-9) {
      const active = inDomain.filter((buff) =>
        !buff.duration || time < arrival[buff.from] + buff.duration - 1e-9);
      const addMult = Math.max(0.01, 1 + active.filter((buff) => !buff.postMult)
        .reduce((sum, buff) => sum + ((buff.mult ?? 1) - 1), 0));
      const mult = active.filter((buff) => buff.postMult)
        .reduce((product, buff) => product * (buff.mult ?? 1), addMult);
      const speed = base.speed * mult;
      let duration = rest / speed;
      for (const buff of active) {
        if (!buff.duration) continue;
        const remaining = arrival[buff.from] + buff.duration - time;
        if (remaining < duration) duration = Math.max(0, remaining);
      }
      const distance = speed * duration;
      const last = segment.parts[segment.parts.length - 1];
      if (last && Math.abs(last.v - speed) < 1e-9) {
        last.dist += distance;
        last.t += duration;
      } else {
        segment.parts.push({ dist: distance, t: duration, v: speed, pct: (mult - 1) * 100 });
      }
      segment.t += duration;
      time += duration;
      rest -= distance;
    }
    arrival[i + 1] = time;
    out.push(segment);
  }
  return {
    total: time,
    t0: out.reduce((sum, segment) => sum + segment.t0, 0),
    dist: distances.reduce((sum, dist) => sum + dist, 0),
    arrival, segs: out,
  };
}
