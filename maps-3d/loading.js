// Classic script: the runtime's import map must remain the first module map.
(() => {
  const q = id => document.getElementById('pil-loading-' + id);
  let attempt = 0, controller, paths = null, reloadEntry = false;
  const versionError = message => Object.assign(Error(message), { versionMismatch: true });
  const mb = value => (value / 1000000).toFixed(1) + ' MB';
  function fail(error) {
    document.getElementById('pil-loading').dataset.stage = 'error';
    q('step').textContent = '地图下载失败';
    q('error').hidden = false;
    q('error').textContent = error.message || '连接中断，请重新下载。';
    reloadEntry = Boolean(error.versionMismatch);
    q('retry').textContent = reloadEntry ? '重新载入地图' : '重试下载';
  }
  async function start() {
    const current = ++attempt;
    controller?.abort(); controller = new AbortController();
    let reader;
    try {
      const config = JSON.parse(q('config').textContent);
      let url;
      try {
        const candidatePaths = window.pilLoadingPaths(location.href, config.entryName);
        url = candidatePaths.runtimeURL(config.runtime, config.sha256);
        paths = candidatePaths;
      } catch { throw versionError('地图版本或入口信息无效，请重新载入。'); }
      const total = Number.isSafeInteger(config.bytes) && config.bytes > 0 ? config.bytes : null;
      document.getElementById('pil-loading').dataset.stage = 'download';
      reloadEntry = false;
      q('error').hidden = true; q('step').textContent = '地图数据下载';
      q('retry').textContent = '重新下载';
      q('progress').value = 0; q('metrics').textContent = '正在连接地图资源…';
      performance.mark('pil-map-download-start');
      let forceReload = current > 1;
      try { const key = 'pil.loading.reload:' + paths.canonicalEntry.pathname; forceReload ||= sessionStorage.getItem(key) === '1'; sessionStorage.removeItem(key); } catch { /* storage can be disabled */ }
      let response = await fetch(url, { cache: forceReload ? 'reload' : 'default', credentials: 'same-origin', signal: controller.signal });
      if (response.status === 404 || response.status === 410) throw versionError('此地图版本已更新，请重新载入地图获取当前版本。');
      if (!response.ok) throw Error('地图资源暂时不可用（HTTP ' + response.status + '），请重试。');
      try { paths.runtimeURL(response.url, config.sha256); } catch { throw versionError('地图资源跳转地址无效，请重新载入。'); }
      if (!response.headers.get('content-type')?.includes('text/html')) throw Error('服务器未返回地图页面，请重试或联系管理员。');
      if (!response.body) throw Error('浏览器不支持读取地图下载进度，请更新浏览器。');
      reader = response.body.getReader();
      response = null;
      let received = 0, chunks = [];
      while (true) {
        const { value, done } = await reader.read();
        if (current !== attempt) return;
        if (done) break;
        chunks.push(value); received += value.byteLength;
        if (received > 110 * 1024 * 1024 || (total && received > total)) throw versionError('地图资源大小与当前版本不符，请重新载入地图。');
        if (total) {
          q('progress').value = received / total * 100;
          q('metrics').textContent = `地图数据下载 ${Math.floor(received / total * 100)}% · ${mb(received)} / ${mb(total)}`;
        } else {
          q('progress').removeAttribute('value');
          q('metrics').textContent = '地图数据已接收 ' + mb(received);
        }
      }
      reader.releaseLock(); reader = null;
      if (total && received !== total) throw versionError('地图下载不完整，请重新载入地图。');
      performance.mark('pil-map-download-complete');
      q('step').textContent = '地图数据下载完成，正在校验';
      let bytes = new Uint8Array(received), offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      chunks = [];
      const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2, '0')).join('');
      if (hash !== config.sha256) throw versionError('地图版本校验失败，请重新载入地图；持续失败请联系管理员。');
      performance.mark('pil-map-download-verified');
      if (current !== attempt) return;
      q('step').textContent = '下载完成，正在准备模型与导航';
      q('progress').removeAttribute('value');
      // Give the verified-download state a frame before parsing the full map.
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (current !== attempt) return;
      // Parse bounded strings rather than retaining an extra 50 MB HTML string.
      const decoder = new TextDecoder('utf-8', { fatal: true });
      performance.mark('pil-map-runtime-parse-start');
      document.open();
      for (let i = 0; i < bytes.length; i += 256 * 1024) document.write(decoder.decode(bytes.subarray(i, i + 256 * 1024), { stream: true }));
      document.write(decoder.decode()); bytes = null; document.close();
      performance.mark('pil-map-runtime-written');
    } catch (error) {
      if (current === attempt && error.name !== 'AbortError') fail(error);
    } finally { try { await reader?.cancel(); } catch { /* cancelled request */ } }
  }
  q('retry').addEventListener('click', async () => {
    if (!reloadEntry) { start(); return; }
    if (!paths) { location.reload(); return; }
    try { sessionStorage.setItem('pil.loading.reload:' + paths.canonicalEntry.pathname, '1'); } catch { /* storage can be disabled */ }
    const button = q('retry'); button.disabled = true;
    q('step').textContent = '正在获取当前地图版本';
    try {
      const entry = new URL(paths.canonicalEntry); entry.search = location.search;
      // Refresh a possibly cached stable-entry redirect before navigating.
      const response = await fetch(entry, { cache: 'reload', credentials: 'same-origin', redirect: 'follow' });
      const target = new URL(response.url);
      const allowed = paths.expectedEntry(target);
      const html = response.headers.get('content-type')?.includes('text/html');
      await response.body?.cancel();
      if (!response.ok || !allowed || !html) throw versionError('无法确认当前地图版本，请重新载入或联系管理员。');
      target.search = location.search; target.hash = location.hash;
      if (target.href === location.href) location.reload(); else location.replace(target.href);
    } catch (error) {
      fail(versionError(error.message || '暂时无法连接当前地图入口，请重新载入。'));
    } finally { button.disabled = false; }
  });
  start();
})();
