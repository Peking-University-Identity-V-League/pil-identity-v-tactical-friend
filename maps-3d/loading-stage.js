(() => {
  const root = document.getElementById('pil-loading');
  if (!root) return;
  const q = id => document.getElementById('pil-loading-' + id);
  let failed = false;
  const retry = async () => {
    const button = q('retry'); button.disabled = true;
    try {
      const paths = window.pilLoadingPaths(location.href, root.dataset.entryName);
      const entry = new URL(paths.canonicalEntry); entry.search = location.search;
      try { sessionStorage.setItem('pil.loading.reload:' + entry.pathname, '1'); } catch { /* storage can be disabled */ }
      const response = await fetch(entry, { cache: 'reload', credentials: 'same-origin', redirect: 'follow' });
      const target = new URL(response.url);
      await response.body?.cancel();
      if (!response.ok || !paths.expectedEntry(target) || !response.headers.get('content-type')?.includes('text/html')) throw Error('无法确认当前地图版本，请稍后重试。');
      target.search = location.search; target.hash = location.hash;
      if (target.href === location.href) location.reload(); else location.replace(target.href);
    } catch (error) {
      const message = error.message || '暂时无法获取当前地图，请重试。';
      fail(message); q('error').textContent = message;
    }
    finally { button.disabled = false; }
  };
  q('retry').addEventListener('click', retry);
  const fail = message => {
    if (failed) return; failed = true;
    root.hidden = false; root.dataset.stage = 'error'; q('step').textContent = '地图准备失败';
    q('error').hidden = false; q('error').textContent = message || '地图初始化失败，请重新载入。';
  };
  window.addEventListener('error', event => {
    if (event.target?.tagName === 'SCRIPT' && event.target.getAttribute('data-pil-optional') === 'telemetry') return;
    if (event.error || event.target?.tagName === 'SCRIPT') fail(event.error?.message || '地图脚本未能载入，请重新载入。');
  }, true);
  window.addEventListener('unhandledrejection', event => fail(event.reason?.message));
  window.addEventListener('endpoint-validation-failed', event => fail(event.detail?.message || event.detail?.error || '通行面校验准备失败，请重新载入。'));
  function update() {
    if (failed) return;
    if (window.viewerError) { fail(window.viewerError); return; }
    const viewer = window.viewerAPI?.stats(), measurement = window.measureAPI?.stats(), tactics = window.tacticsAPI?.stats();
    const collision = window.viewerAPI?.worldCollision?.();
    if (collision?.state === 'error') { fail(collision.error || '碰撞数据准备失败，请重新载入。'); return; }
    if (viewer?.loaded && viewer.navLoaded && measurement?.ready && tactics?.ready && collision?.state === 'ready') {
      performance.mark('pil-map-ready');
      root.dataset.stage = 'ready'; root.hidden = true; return;
    }
    q('step').textContent = !viewer?.loaded ? '正在准备三维模型' : !viewer.navLoaded || !measurement?.ready || !tactics?.ready ? '正在准备地图导航' : '正在准备全图碰撞';
    q('metrics').textContent = `模型：${viewer?.loaded ? '就绪' : '准备中'} · 导航：${viewer?.navLoaded && measurement?.ready && tactics?.ready ? '就绪' : '准备中'} · 碰撞：${collision?.state === 'ready' ? '就绪' : '准备中'}`;
    setTimeout(update, 200);
  }
  update();
})();
