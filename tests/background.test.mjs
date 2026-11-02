import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = (await readFile(new URL('../background.js', import.meta.url), 'utf8')).replace("import { database } from './db.js';", '');
function setup() {
  const records = new Map(), opened = [];
  let listener, active = 1, focused = true, shots = 0, afterCapture;
  const store = { get: id => structuredClone(records.get(id)), add: job => records.set(job.id, structuredClone(job)), put: job => records.set(job.id, structuredClone(job)), delete: id => records.delete(id) };
  const chrome = {
    runtime: { onMessage: { addListener: fn => listener = fn }, getURL: path => `chrome-extension://test/${path}` },
    tabs: { query: async () => [{ id: active }], create: async args => opened.push(args), captureVisibleTab: async () => { shots++; afterCapture?.(); return 'data:image/png;base64,TEST'; } },
    windows: { get: async () => ({ focused }) }
  };
  vm.runInNewContext(source, { chrome, database: async (mode, fn) => fn(store), crypto: { randomUUID: () => 'job-1' }, setTimeout: fn => { fn(); }, Date });
  const send = (message, tabId = 1) => new Promise(resolve => listener(message, { tab: { id: tabId, windowId: 2, title: 'Example' } }, resolve));
  return { send, records, opened, setActive: id => active = id, setFocused: value => focused = value, setAfterCapture: fn => afterCapture = fn, shots: () => shots };
}
const start = app => app.send({ type: 'capture:start', width: 1200, height: 2600 });
const frame = app => app.send({ type: 'capture:frame', id: 'job-1', y: 0, viewportWidth: 1200, viewportHeight: 800 });
test('stores screenshot metadata and opens the correct editor', async () => {
  const app = setup(); assert.equal((await start(app)).ok, true);
  assert.equal((await frame(app)).count, 1);
  assert.equal(app.records.get('job-1').frames[0].viewportHeight, 800);
  assert.equal((await app.send({ type: 'capture:finish', id: 'job-1' })).ok, true);
  assert.match(app.opened[0].url, /editor.html\?id=job-1$/);
});
test('refuses screenshot when another tab or window is active', async () => {
  const app = setup(); await start(app); app.setActive(7);
  assert.equal((await frame(app)).ok, false); assert.equal(app.shots(), 0);
  app.setActive(1); app.setFocused(false);
  assert.equal((await frame(app)).ok, false); assert.equal(app.shots(), 0);
});
test('rejects screenshots if active tab changes during capture', async () => {
  const app = setup(); await start(app); app.setAfterCapture(() => app.setActive(9));
  assert.equal((await frame(app)).ok, false);
  assert.equal(app.records.get('job-1').frames.length, 0);
});
test('rejects operations from another tab and empty exports', async () => {
  const app = setup(); await start(app);
  assert.equal((await app.send({ type: 'capture:finish', id: 'job-1' }, 9)).ok, false);
  assert.equal((await app.send({ type: 'capture:finish', id: 'job-1' })).ok, false);
  assert.equal(app.opened.length, 0);
});
test('rolls back a moved frame and deletes cancelled captures', async () => {
  const app = setup(); await start(app); await frame(app);
  await app.send({ type: 'capture:discard', id: 'job-1' });
  assert.equal(app.records.get('job-1').frames.length, 0);
  await app.send({ type: 'capture:cancel', id: 'job-1' });
  assert.equal(app.records.size, 0);
});
test('does not add a section past the frame limit', async () => {
  const app = setup(); await start(app);
  for (let i = 0; i < 80; i++) assert.equal((await frame(app)).ok, true);
  assert.equal((await frame(app)).ok, false);
  assert.equal(app.records.get('job-1').frames.length, 80);
});
test('finishing early trims the stored height to captured content', async () => {
  const app = setup(); await start(app); await frame(app);
  assert.equal((await app.send({type:'capture:finish', id:'job-1'})).ok, true);
  assert.equal(app.records.get('job-1').height, 800);
  assert.equal(app.opened.length, 1);
});
test('finishing does not export an uncaptured gap', async () => {
  const app = setup(); await start(app); await frame(app);
  await app.send({type:'capture:frame',id:'job-1',y:1000,viewportWidth:1200,viewportHeight:800});
  assert.equal((await app.send({type:'capture:finish',id:'job-1'})).ok, false);
  assert.equal(app.opened.length, 0);
});
