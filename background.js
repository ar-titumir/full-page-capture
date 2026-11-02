import { database } from './db.js';
let lastCapture = 0;
let busy = false;
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (!sender.tab || !message.type?.startsWith('capture:')) return;
  handle(message, sender.tab).then(result => respond({ ok: true, ...result }), error => respond({ ok: false, error: error.message }));
  return true;
});
async function handle(m, tab) {
  if (m.type === 'capture:start') {
    const id = crypto.randomUUID();
    await database('readwrite', s => s.add({ id, tabId: tab.id, title: tab.title, created: Date.now(), frames: [], width: m.width, height: m.height }));
    return { id };
  }
  const job = await database('readonly', s => s.get(m.id));
  if (!job || job.tabId !== tab.id) throw new Error('Capture session expired. Start a new capture.');
  if (m.type === 'capture:discard') {
    job.frames.pop();
    await database('readwrite', s => s.put(job));
    return {};
  }
  if (m.type === 'capture:cancel') {
    await database('readwrite', s => s.delete(m.id));
    return {};
  }
  if (m.type === 'capture:finish') {
    if (!job.frames.length) throw new Error('Capture at least one section first.');
    let covered = 0;
    for (const frame of job.frames) {
      if (frame.y > covered + 1) throw new Error('Capture contains a gap. Capture the missing section first.');
      covered = Math.max(covered, frame.y + frame.viewportHeight);
    }
    job.height = Math.min(job.height, covered);
    await database('readwrite', s => s.put(job));
    await chrome.tabs.create({ url: chrome.runtime.getURL(`editor.html?id=${job.id}`) });
    return {};
  }
  if (m.type === 'capture:frame') {
    if (busy) throw new Error('Another capture is in progress. Please try again.');
    busy = true;
    try {
      await new Promise(r => setTimeout(r, Math.max(0, 600 - (Date.now() - lastCapture))));
      const [active] = await chrome.tabs.query({ active: true, windowId: tab.windowId });
      const win = await chrome.windows.get(tab.windowId);
      if (active?.id !== tab.id || !win.focused) throw new Error('Keep the page and its Chrome window active while capturing.');
      lastCapture = Date.now();
      const data = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
      const [after] = await chrome.tabs.query({ active: true, windowId: tab.windowId });
      if (after?.id !== tab.id) throw new Error('The active tab changed. Please retry this section.');
      if (job.frames.length >= 80) throw new Error('Maximum 80 sections per capture.');
      job.frames.push({ data, y: m.y, viewportWidth: m.viewportWidth, viewportHeight: m.viewportHeight });
      await database('readwrite', s => s.put(job));
      return { count: job.frames.length };
    } finally { busy = false; }
  }
}
