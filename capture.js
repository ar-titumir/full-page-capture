(() => {
  if (window.__fullPageCaptureInstalled) return;
  window.__fullPageCaptureInstalled = true;
  let session;
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const send = async message => {
    const result = await chrome.runtime.sendMessage(message);
    if (!result?.ok) throw new Error(result?.error || 'The extension stopped responding.');
    return result;
  };
  chrome.runtime.onMessage.addListener((m, sender, reply) => {
    if (m.type !== 'start') return;
    if (session) { reply({ ok: false, error: 'A capture is already open on this page.' }); return; }
    start(m.mode).then(() => reply({ ok: true }), e => { cleanup(); reply({ ok: false, error: e.message }); });
    return true;
  });
  async function start(mode) {
    const root = document.documentElement;
    const width = root.clientWidth;
    const height = Math.max(root.scrollHeight, document.body?.scrollHeight || 0, innerHeight);
    if (root.scrollWidth > width + 4) throw new Error('This page scrolls horizontally. Narrow its content or zoom out before capturing.');
    if (height > 100000) throw new Error('This page is too tall (over 100,000 CSS pixels). Capture a shorter page.');
    session = { mode, width, height, vw: innerWidth, vh: innerHeight, x: scrollX, y: scrollY, covered: 0, hidden: [], cancelled: false, finishRequested: false, busy: false };
    session.style = document.createElement('style');
    session.style.textContent = 'html{scroll-behavior:auto!important;scroll-snap-type:none!important}body{scroll-snap-type:none!important}*{animation-play-state:paused!important;transition:none!important}';
    root.append(session.style);
    const result = await send({ type: 'capture:start', width, height });
    session.id = result.id;
    const host = document.createElement('div');
    host.style.cssText = 'all:initial!important;position:fixed!important;bottom:22px!important;left:50%!important;transform:translateX(-50%)!important;z-index:2147483647!important;';
    session.host = host;
    const shadow = host.attachShadow({ mode: 'closed' });
    shadow.innerHTML = `<style>*{box-sizing:border-box}.bar{font:13px system-ui;color:#fff;background:#18243b;border:1px solid #41516e;border-radius:16px;padding:15px 18px;box-shadow:0 8px 40px #0005;min-width:420px;max-width:90vw}.title{font-weight:700;margin-bottom:7px}.status{color:#d0daee;margin-bottom:12px;max-width:550px;line-height:1.5}button{font:600 12px system-ui;border:0;border-radius:7px;padding:9px 12px;margin-right:6px;background:#6677f3;color:white;cursor:pointer}button.secondary{background:#34435e}button:disabled{opacity:.45;cursor:default}</style><div class="bar"><div class="title">▣ &nbsp; Full Page Capture · ${mode === 'auto' ? 'Automatic' : 'Manual'}</div><div class="status" role="status"></div><button id="take">Capture section</button><button id="next">Scroll to next</button><button id="done">Edit capture</button><button id="cancel" class="secondary">Cancel</button></div>`;
    root.append(host);
    session.ui = shadow;
    shadow.getElementById('take').onclick = () => run(capture);
    shadow.getElementById('next').onclick = () => {
      scrollTo(0, Math.max(0, session.covered - 80));
      status('Capture this section when the page is ready.');
    };
    shadow.getElementById('done').textContent = 'Finish capture';
    shadow.getElementById('done').onclick = () => { session.finishRequested = true; status('Finishing capture…'); if (!session.busy) run(finish); };
    shadow.getElementById('cancel').onclick = () => { session.cancelled = true; if (!session.busy) cancel(); };
    scrollTo(0, 0);
    status('Start at the top. Scroll with overlap between sections, or use “Scroll to next”.');
    if (mode === 'auto') setTimeout(() => { if (!session || session.finishRequested) return; run(async () => {
      while (session && !session.cancelled && !session.finishRequested && session.covered < session.height) {
        scrollTo(0, Math.max(0, session.covered - (session.covered ? 80 : 0)));
        await delay(400);
        if (session.cancelled || session.finishRequested) break;
        const before = session.covered;
        await capture();
        if (session.covered <= before) throw new Error('The page stopped scrolling. This site may use a nested scroll container.');
      }
      if (!session.cancelled) await finish();
    }); }, 250);
  }
  function status(text) {
    if (!session) return;
    session.ui.querySelector('.status').textContent = text;
    for (const id of ['take', 'next']) session.ui.getElementById(id).disabled = session.busy || session.finishRequested;
    session.ui.getElementById('done').disabled = session.finishRequested;
  }
  async function run(task) {
    if (!session || session.busy) return;
    session.busy = true;
    status('Capturing… Keep this tab active.');
    try { await task(); }
    catch (e) { if (session) { session.mode = 'manual'; session.finishRequested = false; status(e.message + ' You can retry, finish, or cancel.'); } }
    finally {
      if (session) {
        session.busy = false;
        status(session.ui.querySelector('.status').textContent);
        if (session.cancelled) await cancel();
        else if (session.finishRequested) await run(finish);
      }
    }
  }
  async function capture() {
    const s = session;
    if (s.cancelled) return;
    if (innerWidth !== s.vw || innerHeight !== s.vh || document.documentElement.clientWidth !== s.width) throw new Error('Window size or zoom changed. Cancel and start again.');
    if (Math.abs(scrollX) > 1) throw new Error('Scroll all the way to the left first.');
    const y = Math.max(0, scrollY);
    if (y > s.covered + 1) throw new Error(`There is an uncaptured gap. Scroll up to ${Math.floor(s.covered)} px or use “Scroll to next”.`);
    if (s.covered && y + innerHeight <= s.covered + 1) throw new Error('Scroll down to capture a new section.');
    if (s.covered) {
      for (const element of document.querySelectorAll('body *')) {
        const pos = getComputedStyle(element).position;
        if ((pos === 'fixed' || pos === 'sticky') && element.getBoundingClientRect().height < innerHeight * .6 && !s.hidden.some(h => h.el === element)) {
          s.hidden.push({ el: element, value: element.style.getPropertyValue('visibility'), priority: element.style.getPropertyPriority('visibility') });
          element.style.setProperty('visibility', 'hidden', 'important');
        }
      }
    }
    s.host.style.setProperty('visibility', 'hidden', 'important');
    const prevent = event => { if (event.type !== 'keydown' || ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) event.preventDefault(); };
    for (const type of ['wheel', 'touchmove', 'keydown']) window.addEventListener(type, prevent, { passive: false, capture: true });
    try {
      await delay(180);
      if (Math.abs(scrollY - y) > 1) throw new Error('The page moved. Retry this section after scrolling stops.');
      await send({ type: 'capture:frame', id: s.id, y, viewportWidth: innerWidth, viewportHeight: innerHeight });
      if (Math.abs(scrollY - y) > 1) {
        await send({ type: 'capture:discard', id: s.id });
        throw new Error('The page moved during capture. Retry this section after scrolling stops.');
      }
      s.covered = Math.min(s.height, y + innerHeight);
      status(`${Math.round(s.covered / s.height * 100)}% captured · ${Math.round(s.covered).toLocaleString()} / ${s.height.toLocaleString()} px${s.covered >= s.height ? ' · Ready to edit.' : ''}`);
    } finally {
      s.host.style.setProperty('visibility', 'visible', 'important');
      for (const type of ['wheel', 'touchmove', 'keydown']) window.removeEventListener(type, prevent, true);
    }
  }
  async function finish() {
    if (!session.covered) { scrollTo(0, 0); await delay(200); await capture(); }
    if (session.cancelled) return;
    await send({ type: 'capture:finish', id: session.id });
    cleanup();
  }
  async function cancel() {
    const id = session?.id;
    cleanup();
    if (id) await send({ type: 'capture:cancel', id }).catch(() => {});
  }
  function cleanup() {
    if (!session) return;
    const s = session;
    for (const { el, value, priority } of s.hidden) { if (value) el.style.setProperty('visibility', value, priority); else el.style.removeProperty('visibility'); }
    s.host?.remove();
    scrollTo(s.x, s.y);
    s.style?.remove();
    session = null;
  }
})();
