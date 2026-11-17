import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source = await readFile(new URL('../editor.js', import.meta.url), 'utf8');
const start = source.indexOf('let zoomPercent');
const end = source.indexOf('new ResizeObserver', start);
function setup() {
  const nodes = Object.fromEntries(['zoom','zoomCustom','zoomFit','paper','viewport'].map(id=>[id,{value:'',style:{},setCustomValidity(value){this.error=value;},reportValidity(){},setAttribute(key,value){this[key]=value;}}]));
  nodes.viewport.clientWidth=1060;
  vm.runInNewContext(source.slice(start,end), {$: id=>nodes[id],ready:true,outputWidth:2000,outputHeight:3000,cropping:false,render(){}});
  nodes.zoomFit.onclick();
  return nodes;
}
test('slider updates zoom percentage and picture dimensions',()=>{
  const n=setup();n.zoom.value='200';n.zoom.oninput();
  assert.equal(n.zoomCustom.value,200);assert.equal(n.paper.style.width,'4000px');assert.equal(n.paper.style.height,'6000px');
});
test('custom zoom exceeds slider range and fit width restores automatic view',()=>{
  const n=setup();n.zoomCustom.value='350';n.zoomCustom.onchange();
  assert.equal(n.zoom.value,200);assert.equal(n.zoomCustom.value,350);assert.equal(n.paper.style.width,'7000px');
  n.zoomFit.onclick();assert.equal(n.zoomCustom.value,50);assert.equal(n.paper.style.width,'1000px');
});
test('invalid input preserves the previous valid zoom; Enter applies decimals',()=>{
  const n=setup();
  for(const value of ['', '0','-5','Infinity']){n.zoomCustom.value=value;n.zoomCustom.onchange();assert.ok(n.zoomCustom.error);assert.equal(n.paper.style.width,'1000px');}
  n.zoomCustom.value='225.5';n.zoomCustom.onkeydown({key:'Enter',preventDefault(){}});
  assert.equal(n.zoomCustom.error,'');assert.equal(n.paper.style.width,'4510px');
});
