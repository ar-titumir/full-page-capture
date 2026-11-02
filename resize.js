export function resizeDimensions(width, height, keepAspect, originalWidth, originalHeight) {
  const w = Number(width);
  const h = keepAspect && Number.isInteger(w) && w > 0
    ? Math.max(1, Math.round(w * originalHeight / originalWidth)) : Number(height);
  const valid = Number.isInteger(w) && Number.isInteger(h) && w > 0 && h > 0
    && w <= 30000 && h <= 30000 && w * h <= 40000000;
  return { width: w, height: h, valid };
}
