import test from 'node:test';
import assert from 'node:assert/strict';
import { resizeDimensions } from '../resize.js';
test('locked ratio derives height from width and original dimensions', () => {
  assert.deepEqual(resizeDimensions('550', '999', true, 1100, 2573), {width:550,height:1287,valid:true});
  assert.equal(resizeDimensions('1100', '999', true, 1100, 2573).height, 2573);
});
test('unlocked ratio accepts independent width and height', () => {
  assert.deepEqual(resizeDimensions('550', '700', false, 1100, 2573), {width:550,height:700,valid:true});
});
test('rejects empty, fractional, negative, nonfinite and oversized dimensions', () => {
  for (const width of ['', '0', '-1', '2.5', 'NaN', 'Infinity', '30001']) {
    assert.equal(resizeDimensions(width, 100, false, 1100, 2573).valid, false, width);
  }
  assert.equal(resizeDimensions(100, '', false, 1100, 2573).valid, false);
  assert.equal(resizeDimensions(10000, 10000, false, 1100, 2573).valid, false);
  assert.equal(resizeDimensions(30000, 1, true, 1100, 2573).valid, false);
});
test('tiny proportional images retain at least one pixel', () => {
  assert.deepEqual(resizeDimensions(1, 0, true, 2000, 1), {width:1,height:1,valid:true});
});
