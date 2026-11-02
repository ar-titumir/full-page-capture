import { database } from './db.js';
import { resizeDimensions } from './resize.js';
const $ = id => document.getElementById(id);
const base = $('base'), ink = $('ink');
const ctx = ink.getContext('2d');
let strokes = [], undone = [], current = null, ready = false, dirty = false;
let tool = 'pen', job, imageScale = 1;
let outputWidth = 0, outputHeight = 0, validSize = false;
let original, cropArea = { x: 0, y: 0 }, cropping = false, cropStart = null, selection = null;
const palettes = ['#f4c542', '#fb7185', '#55cfa0', '#60a5fa', '#a78bfa', '#1e293b'];
const settings = { pen: [100, 5], highlight: [35, 28], rectangle: [100, 5], arrow: [100, 5] };
const notify = text => $('status').textContent = text;
function controls() {
  $('undo').disabled = !strokes.length;
  $('redo').disabled = !undone.length;
  $('clear').disabled = !strokes.length;
  $('copy').disabled = $('save').disabled = !ready || !validSize || cropping;
  $('crop').disabled = !ready || cropping;
  $('restoreCrop').disabled = !ready || cropping || (cropArea.x === 0 && cropArea.y === 0 && base.width === original?.width && base.height === original?.height);
}
function cropMode(enabled) {
  cropping = enabled; cropStart = selection = null;
  $('applyCrop').hidden = $('cancelCrop').hidden = !enabled;
  $('applyCrop').disabled = true;
  $('cropHelp').textContent = enabled ? 'Drag across the image to select an area, then apply. Scroll to select a different section.' : 'Trim your image by selecting an area.';
  render();
}
function setCrop(area) {
  cropArea = area;
  base.width = ink.width = area.width; base.height = ink.height = area.height;
  base.getContext('2d').drawImage(original, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
  $('resizeWidth').value = area.width; $('resizeHeight').value = area.height;
  cropMode(false); updateSize(); dirty = true;
}
$('crop').onclick = () => cropMode(true);
$('cancelCrop').onclick = () => cropMode(false);
$('applyCrop').onclick = () => { if (selection?.width > 0 && selection?.height > 0) setCrop({ ...selection }); };
$('restoreCrop').onclick = () => setCrop({ x: 0, y: 0, width: original.width, height: original.height });
function updateSize() {
  if (!ready) return;
  $('resizeHeight').disabled = $('keepAspect').checked;
  const size = resizeDimensions($('resizeWidth').value, $('resizeHeight').value, $('keepAspect').checked, base.width, base.height);
  if ($('keepAspect').checked) $('resizeHeight').value = Number.isInteger(size.width) && size.width > 0 ? size.height : '';
  validSize = size.valid;
  $('resizeHelp').textContent = validSize
    ? ($('keepAspect').checked ? 'Height adjusts automatically. Applies to copy and save.' : 'Width and height are independent. Applies to copy and save.')
    : 'Enter whole pixels from 1–30,000, up to 40 megapixels total.';
  $('resizeHelp').classList.toggle('error', !validSize);
  $('resizeWidth').setAttribute('aria-invalid', String(!validSize));
  $('resizeHeight').setAttribute('aria-invalid', String(!validSize));
  if (validSize) {
    outputWidth = size.width; outputHeight = size.height;
    $('dimensions').textContent = `${outputWidth.toLocaleString()} × ${outputHeight.toLocaleString()} px · ${job.frames.length} sections`;
    zoom();
  }
  controls();
}
for (const id of ['resizeWidth', 'resizeHeight']) $(id).oninput = () => { updateSize(); dirty = true; };
$('keepAspect').onchange = () => { updateSize(); dirty = true; };
$('resetSize').onclick = () => {
  $('resizeWidth').value = base.width; $('resizeHeight').value = base.height;
  updateSize(); dirty = true;
};
for (const color of palettes) {
  const button = document.createElement('button');
  button.className = 'swatch'; button.style.background = color; button.title = color; button.setAttribute('aria-label', `Use ${color}`);
  button.onclick = () => { $('color').value = color; updateColors(); };
  $('swatches').append(button);
}
function updateColors() { [...$('swatches').children].forEach((b, i) => b.classList.toggle('active', palettes[i] === $('color').value)); }
$('color').oninput = updateColors;
updateColors();
for (const button of document.querySelectorAll('[data-tool]')) button.onclick = () => {
  if (cropping) cropMode(false);
  settings[tool] = [Number($('opacity').value), Number($('thickness').value)];
  tool = button.dataset.tool;
  document.querySelectorAll('[data-tool]').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  [$('opacity').value, $('thickness').value] = settings[tool];
  labels();
};
function labels() { $('opacityValue').textContent = `${$('opacity').value}%`; $('thicknessValue').textContent = `${$('thickness').value} px`; }
$('opacity').oninput = $('thickness').oninput = labels;
function draw(context, stroke) {
  const points = stroke.points, a = points[0], b = points[points.length - 1];
  context.save(); context.globalAlpha = stroke.opacity;
  context.strokeStyle = context.fillStyle = stroke.color;
  context.lineWidth = stroke.width; context.lineCap = 'round'; context.lineJoin = 'round';
  context.beginPath();
  if (stroke.tool === 'rectangle') context.rect(a.x, a.y, b.x - a.x, b.y - a.y);
  else if (stroke.tool === 'arrow') {
    const angle = Math.atan2(b.y - a.y, b.x - a.x), head = Math.max(12 * imageScale, stroke.width * 3);
    context.moveTo(a.x, a.y); context.lineTo(b.x, b.y);
    context.moveTo(b.x - head * Math.cos(angle - Math.PI / 6), b.y - head * Math.sin(angle - Math.PI / 6));
    context.lineTo(b.x, b.y); context.lineTo(b.x - head * Math.cos(angle + Math.PI / 6), b.y - head * Math.sin(angle + Math.PI / 6));
  } else if (points.length === 1) {
    context.arc(a.x, a.y, stroke.width / 2, 0, Math.PI * 2); context.fill(); context.restore(); return;
  } else {
    context.moveTo(a.x, a.y);
    for (const point of points.slice(1)) context.lineTo(point.x, point.y);
  }
  context.stroke(); context.restore();
}
function render() {
  ctx.clearRect(0, 0, ink.width, ink.height);
  ctx.save(); ctx.translate(-cropArea.x, -cropArea.y);
  for (const stroke of strokes) draw(ctx, stroke);
  if (current) draw(ctx, current);
  ctx.restore();
  if (cropping && selection) {
    const x = selection.x - cropArea.x, y = selection.y - cropArea.y, w = selection.width, h = selection.height;
    ctx.save(); ctx.fillStyle = '#17253b88';
    ctx.fillRect(0, 0, ink.width, y); ctx.fillRect(0, y + h, ink.width, ink.height - y - h);
    ctx.fillRect(0, y, x, h); ctx.fillRect(x + w, y, ink.width - x - w, h);
    ctx.strokeStyle = '#5365e8'; ctx.lineWidth = 2; ctx.setLineDash([8, 5]); ctx.strokeRect(x, y, w, h); ctx.restore();
  }
  controls();
}
function point(event) {
  const rect = ink.getBoundingClientRect();
  return { x: cropArea.x + Math.max(0, Math.min(ink.width, (event.clientX - rect.left) * ink.width / rect.width)), y: cropArea.y + Math.max(0, Math.min(ink.height, (event.clientY - rect.top) * ink.height / rect.height)) };
}
ink.onpointerdown = event => {
  if (!ready || event.button !== 0 || current) return;
  ink.setPointerCapture(event.pointerId);
  if (cropping) { cropStart = point(event); selection = null; $('applyCrop').disabled = true; render(); return; }
  current = { tool, color: $('color').value, opacity: Number($('opacity').value) / 100, width: Number($('thickness').value) * imageScale, points: [point(event)] };
  render();
};
ink.onpointermove = event => {
  if (cropping && cropStart) {
    const p = point(event);
    const x = Math.round(Math.min(cropStart.x, p.x)), y = Math.round(Math.min(cropStart.y, p.y));
    selection = { x, y, width: Math.round(Math.max(cropStart.x, p.x)) - x, height: Math.round(Math.max(cropStart.y, p.y)) - y };
    $('applyCrop').disabled = !selection.width || !selection.height;
    $('cropHelp').textContent = `${selection.width} × ${selection.height} px selected. Apply crop or drag again.`;
    render(); return;
  }
  if (!current) return;
  const p = point(event), first = current.points[0];
  if (event.shiftKey) {
    if (current.tool === 'rectangle') { const side = Math.max(Math.abs(p.x - first.x), Math.abs(p.y - first.y)); p.x = first.x + Math.sign(p.x - first.x) * side; p.y = first.y + Math.sign(p.y - first.y) * side; }
    else if (Math.abs(p.x - first.x) > Math.abs(p.y - first.y)) p.y = first.y; else p.x = first.x;
  }
  if (['rectangle', 'arrow'].includes(current.tool)) current.points = [first, p];
  else current.points.push(p);
  render();
};
ink.onpointerup = () => { cropStart = null; if (current) { strokes.push(current); current = null; undone = []; dirty = true; render(); } };
ink.onpointercancel = ink.onlostpointercapture = () => { cropStart = null; if (current) { current = null; render(); } };
$('undo').onclick = () => { if (strokes.length) { undone.push(strokes.pop()); dirty = true; render(); } };
$('redo').onclick = () => { if (undone.length) { strokes.push(undone.pop()); dirty = true; render(); } };
$('clear').onclick = () => { if (strokes.length && confirm('Clear all annotations?')) { strokes = []; undone = []; dirty = true; render(); } };
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && cropping) { cropMode(false); return; }
  if (['INPUT', 'SELECT'].includes(document.activeElement.tagName)) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); (e.shiftKey ? $('redo') : $('undo')).click(); }
});
window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
function zoom() {
  if (!ready) return;
  const factor = $('zoom').value === 'fit' ? Math.min(1, Math.max(100, $('viewport').clientWidth - 60) / outputWidth) : Number($('zoom').value);
  $('paper').style.width = `${outputWidth * factor}px`; $('paper').style.height = `${outputHeight * factor}px`;
}
$('zoom').onchange = zoom;
new ResizeObserver(zoom).observe($('viewport'));
async function png() {
  if (!ready || !validSize) throw new Error('Enter valid image dimensions before exporting.');
  const canvas = document.createElement('canvas'); canvas.width = outputWidth; canvas.height = outputHeight;
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  context.scale(outputWidth / base.width, outputHeight / base.height);
  context.drawImage(base, 0, 0);
  context.translate(-cropArea.x, -cropArea.y);
  for (const stroke of strokes) draw(context, stroke);
  try { return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Unable to encode this image.')), 'image/png')); }
  finally { canvas.width = canvas.height = 1; }
}
$('save').onclick = async () => {
  try {
    notify('Preparing PNG…');
    const url = URL.createObjectURL(await png());
    const link = document.createElement('a'); link.href = url;
    link.download = `${(job.title || 'full-page-capture').replace(/[<>:"/\\|?*\x00-\x1f]/g, '-').slice(0, 90)}.png`;
    link.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    dirty = false; notify('PNG download started.');
  } catch (e) { notify(`Save failed: ${e.message}`); }
};
$('copy').onclick = async () => {
  try {
    const blob = png();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    dirty = false; notify('Image copied. Paste it into your chat, document, or image editor.');
  } catch (e) { notify(`Copy failed: ${e.message}. You can save the PNG instead.`); }
};
async function load() {
  controls();
  const id = new URL(location.href).searchParams.get('id');
  job = id ? await database('readonly', s => s.get(id)) : null;
  if (!job?.frames.length) { $('paper').hidden = true; $('empty').hidden = false; notify('Start a new capture using the extension toolbar.'); return; }
  const firstBlob = await (await fetch(job.frames[0].data)).blob();
  const firstImage = await createImageBitmap(firstBlob);
  const nativeScale = firstImage.width / job.frames[0].viewportWidth;
  firstImage.close();
  const rawWidth = Math.round(job.width * nativeScale), rawHeight = Math.round(job.height * nativeScale);
  const reduction = Math.min(1, 30000 / rawWidth, 30000 / rawHeight, Math.sqrt(40000000 / (rawWidth * rawHeight)));
  imageScale = nativeScale * reduction;
  base.width = ink.width = Math.max(1, Math.round(job.width * imageScale));
  base.height = ink.height = Math.max(1, Math.round(job.height * imageScale));
  const context = base.getContext('2d'); context.fillStyle = 'white'; context.fillRect(0, 0, base.width, base.height);
  let covered = 0;
  for (const [index, frame] of job.frames.entries()) {
    notify(`Stitching section ${index + 1} of ${job.frames.length}…`);
    const bitmap = await createImageBitmap(await (await fetch(frame.data)).blob());
    const scaleX = bitmap.width / frame.viewportWidth, scaleY = bitmap.height / frame.viewportHeight;
    const start = Math.max(covered, frame.y), end = Math.min(job.height, frame.y + frame.viewportHeight);
    if (frame.y > covered + 1) { bitmap.close(); throw new Error('Capture contains a gap. Start again and overlap each section.'); }
    if (end > start) {
      const top = Math.round(start * imageScale), bottom = Math.round(end * imageScale);
      context.drawImage(bitmap, 0, (start - frame.y) * scaleY, job.width * scaleX, (end - start) * scaleY, 0, top, base.width, bottom - top);
    }
    bitmap.close(); covered = Math.max(covered, end);
  }
  if (covered < job.height - 1) throw new Error('Capture is incomplete. Please start a new capture.');
  original = document.createElement('canvas'); original.width = base.width; original.height = base.height;
  original.getContext('2d').drawImage(base, 0, 0);
  cropArea = { x: 0, y: 0, width: base.width, height: base.height };
  ready = true; $('subtitle').textContent = job.title;
  $('resizeWidth').value = base.width; $('resizeHeight').value = base.height;
  $('resizeWidth').disabled = $('keepAspect').disabled = $('resetSize').disabled = false;
  updateSize();
  zoom(); render(); notify(reduction < 1 ? 'Ready. This large capture was scaled down to fit browser image limits.' : 'Ready to annotate. Choose a tool and draw on your capture.');
}
load().catch(e => { notify(`Unable to open capture: ${e.message}`); $('dimensions').textContent = 'Capture unavailable'; });
