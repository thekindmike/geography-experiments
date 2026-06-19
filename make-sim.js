// make-sim.js — 生成完整模拟器文件
// 用法：node make-sim.js

var fs = require('fs');
var path = require('path');
var out = path.join('E:/WorkBuddy/2026-06-20-01-37-08/geography-experiments/js', 'sim-complete.js');

var lines = [];
function a(line) { lines.push(line); }

a('// 地理实验互动模拟器 — 完整版');
a('// 加载说明：在 app.js 之后加载本文件，会覆盖残次模拟器并补充缺失的');
a('');
a('// ==================== 工具函数 ====================');
a('function _sc() { return document.getElementById("simCanvas"); }');
a('function _sd() { return document.getElementById("simControls"); }');
a('function _cl() { var c=_sc(); if(c) c.innerHTML=""; var d=_sd(); if(d) d.innerHTML=""; }');
a('');

// ===== j003 地球公转 =====
a('function initRevolutionSimulator() {');
a('  _cl(); var c=_sc(); c.style.background="#0f172a";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;";');
a('  d.innerHTML=\'<svg id="rvS" width="600" height="420" viewBox="0 0 600 420" style="max-width:100%;height:auto;">\'');
a('    +\'<circle cx="300" cy="210" r="35" fill="#fbbf24"/><text x="300" y="218" text-anchor="middle" fill="#92400e" font-size="12">太阳</text>\'');
a('    +\'<ellipse cx="300" cy="210" rx="220" ry="90" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>\'');
a('    +\'<circle id="rvE" cx="520" cy="210" r="18" fill="#2563eb" stroke="#60a5fa" stroke-width="2"/>\'');
a('    +\'<line id="rvA" x1="520" y1="195" x2="520" y2="225" stroke="#fbbf24" stroke-width="2" transform="rotate(-23.5,520,210)"/>\'');
a('    +\'<text id="rvL" x="520" y="250" text-anchor="middle" fill="#e2e8f0" font-size="13">春分</text>\'');
a('    +\'<rect x="16" y="16" width="260" height="90" rx="8" fill="rgba(0,0,0,0.65)"/>\'');
a('    +\'<text id="rvD" x="26" y="38" fill="#fbbf24" font-size="13">节气：春分</text>\'');
a('    +\'<text id="rvR" x="26" y="58" fill="#60a5fa" font-size="12">直射：赤道</text>\'');
a('    +\'<text id="rvS" x="26" y="78" fill="#4ade80" font-size="12">季节</text>\'');
a('  </svg>\'; c.appendChild(d);');
a('  var S=[{d:80,l:"春分(3月21日)",dr:"0°赤道",s:"北春|南秋",n:"昼夜平分"}');
a('         ,{d:172,l:"夏至(6月22日)",dr:"23.5°N",s:"北夏|南冬",n:"北昼最长"}');
a('         ,{d:266,l:"秋分(9月23日)",dr:"0°赤道",s:"北秋|南春",n:"昼夜平分"}');
a('         ,{d:355,l:"冬至(12月22日)",dr:"23.5°S",s:"北冬|南夏",n:"北昼最短"}];');
a('  window._rd=80; window._rr=false;');
a('  function up(){');
a('    var a2=(window._rd/365)*360,r=a2*Math.PI/180;');
a('    var x=300+220*Math.cos(r-Math.PI/2),y=210+90*Math.sin(r-Math.PI/2);');
a('    var E=document.getElementById("rvE"); if(E){E.setAttribute("cx",x);E.setAttribute("cy",y);}');
a('    var L=document.getElementById("rvL"); if(L){L.setAttribute("x",x);L.setAttribute("y",y+40);}');
a('    var c2=S[0],md=999; S.forEach(function(s2){var v=Math.abs(window._rd-s2.d);if(v<md){md=v;c2=s2;}});');
a('    var e=document.getElementById("rvD"); if(e)e.textContent="节气："+c2.l;');
a('    var r2=document.getElementById("rvR"); if(r2)r2.textContent="直射："+c2.dr;');
a('    var s2=document.getElementById("rvS"); if(s2)s2.textContent="季节："+c2.s+" | "+c2.n;');
a('    if(L)L.textContent=c2.l;');
a('  }');
a('  window._ar=function(){if(!window._rr)return;window._rd+=1;if(window._rd>365)window._rd=1;up();setTimeout(window._ar,80);};');
a('  up();');
a('  var ct=_sd(); if(ct)ct.innerHTML=\'<button class="sim-btn" id="rvB" onclick="window._rr=!window._rr;if(window._rr)window._ar();else clearTimeout(window._ra);this.textContent=window._rr?\\\'⏸ 暂停\\\'':\\\'▶ 公转\\\'">▶ 公转</button><button class="sim-btn" onclick="window._rd=80;up();">↺ 春分</button><input type="range" min="1" max="365" value="80" oninput="window._rd=parseInt(this.value);up();" style="width:100px;">\';');
a('}');
a('');

// ===== j005 气温观测 =====
a('function initTempSimulator() {');
a('  _cl(); var c=_sc(); c.style.background="#f0fdf4";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:12px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#166534;">🌡️ 虚拟气温观测</h3>\'');
a('  +\'<svg id="tSvg" width="160" height="300" style="border:1px solid #bbf7d0;border-radius:12px;background:#fff;">\'');
a('    +\'<rect x="30" y="30" width="60" height="240" rx="30" fill="#fef2f2" stroke="#fca5a5" stroke-width="2"/><rect id="tFi" x="35" y="260" width="50" height="0" rx="20" fill="#ef4444"/><text id="tVal" x="105" y="258" text-anchor="middle" fill="#dc2626" font-size="14">0°C</text></svg>\'');
a('  +\'<div id="tBtns" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">\'');
a('    +\'<button class="sim-btn" onclick="_rT(2)">02:00</button><button class="sim-btn" onclick="_rT(8)">08:00</button>\'');
a('    +\'<button class="sim-btn" onclick="_rT(14)">14:00</button><button class="sim-btn" onclick="_rT(20)">20:00</button>\'');
a('  +\'</div><table id="tTbl" style="border-collapse:collapse;font-size:13px;background:#fff;width:100%;max-width:400px;"><thead><tr style="background:#166534;color:#fff;"><th style="padding:6px;">时间</th><th style="padding:6px;">℃</th></tr></thead><tbody id="tBod"></tbody></table>\'');
a('  +\'<canvas id="tCht" width="500" height="200" style="border:1px solid #bbf7d0;border-radius:8px;background:#fff;max-width:100%;"></canvas>\'');
a('  +\'<button class="sim-btn" onclick="window._td=[];_upT();">清除</button>\';');
a('  c.appendChild(d); window._td=[];');
a('  window._rT=function(h){var b=h===14?32:h===2?18:h===8?22:26; var t=b+(Math.random()*3-1.5); t=Math.round(t*10)/10; window._td.push({h:h,t:t}); _upT();};');
a('  function _upT(){');
a('    var b=document.getElementById("tBod"); if(!b)return;');
a('    b.innerHTML=window._td.map(function(v){return "<tr><td>"+v.h+":00</td><td>"+v.t.toFixed(1)+"°C</td></tr>";}).join("");');
a('    if(window._td.length>0){var l=window._td[window._td.length-1],h2=Math.min((l.t/40)*230,230);document.getElementById("tFi").setAttribute("height",h2);document.getElementById("tFi").setAttribute("y",260-h2+30);document.getElementById("tVal").textContent=l.t.toFixed(1)+"°C";}');
a('  }');
a('}');
a('');

// ===== j006 降水量观测 =====
a('function initPrecipSimulator() {');
a('  _cl(); var c=_sc(); c.style.background="#eff6ff";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:12px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#1e40af;">🌧️ 虚拟降水量观测</h3>\'');
a('  +\'<svg id="pSvg" width="160" height="240" style="border:1px solid #bfdbfe;border-radius:12px;background:#fff;">\'');
a('    +\'<rect x="30" y="20" width="80" height="200" rx="8" fill="none" stroke="#3b82f6" stroke-width="2"/><rect id="pFi" x="35" y="220" width="70" height="0" rx="4" fill="#3b82f6" opacity="0.5"/><text id="pVal" x="80" y="130" text-anchor="middle" fill="#1e40af" font-size="18">0mm</text></svg>\'');
a('  +\'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">\'');
a('    +\'<input type="range" id="pSld" min="0" max="200" value="0" style="width:150px;" oninput="_upP()">\'');
a('    +\'<span id="pLbl" style="font-weight:600;color:#1e40af;">0 mm</span>\'');
a('    +\'<button class="sim-btn" onclick="_rP()">记录</button></div>\'');
a('  +\'<table style="border-collapse:collapse;font-size:13px;background:#fff;width:100%;max-width:400px;"><thead><tr style="background:#1e40af;color:#fff;"><th style="padding:6px;">月份</th><th style="padding:6px;">mm</th></tr></thead><tbody id="pBod"></tbody></table>\'');
a('  c.appendChild(d); window._pd=[];');
a('  window._upP=function(){var v=parseInt(document.getElementById("pSld").value);document.getElementById("pLbl").textContent=v+" mm";var h=Math.min((v/200)*200,200);document.getElementById("pFi").setAttribute("height",h);document.getElementById("pFi").setAttribute("y",220-h+20);document.getElementById("pVal").textContent=v+"mm";};');
a('  window._rP=function(){var v=parseInt(document.getElementById("pSld").value);window._pd.push({m:(window._pm||1),a:v});window._pm=(window._pm||1)%12+1;var b=document.getElementById("pBod");if(b)b.innerHTML=window._pd.map(function(x2){return "<tr><td>"+x2.m+"月</td><td>"+x2.a+"mm</td></tr>";}).join("");};');
a('}');
a('');

// ===== j007 风向风速观测 =====
a('function initWindSimulator() {');
a('  _cl(); var c=_sc(); c.style.background="#f0fdf4";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#166534;">💨 虚拟风向风速观测</h3>\'');
a('  +\'<svg id="wSvg" width="280" height="280" style="background:#fff;border-radius:50%;border:2px solid #bbf7d0;">\'');
a('    +\'<circle cx="140" cy="140" r="120" fill="#f0fdf4"/><text x="140" y="32" text-anchor="middle" fill="#52525b" font-size="12">N</text><text x="258" y="144" text-anchor="middle" fill="#52525b" font-size="12">E</text>\'');
a('    +\'<g id="wVn" transform="rotate(0,140,140)"><polygon points="140,60 152,120 140,100 128,120" fill="#dc2626"/><polygon points="140,220 152,160 140,180 128,160" fill="#374151"/><circle cx="140" cy="140" r="8" fill="#fbbf24"/></g></svg>\'');
a('  +\'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">\'');
a('    +\'<input type="range" min="0" max="360" value="0" id="wDir" style="width:120px;" oninput="_upWD()">\'');
a('    +\'<span id="wDirL" style="font-weight:600;color:#166534;">北风</span>\'');
a('    +\'<input type="range" min="0" max="12" value="0" id="wSpd" style="width:100px;" oninput="_upWS()">\'');
a('    +\'<span id="wSpdL" style="font-weight:600;color:#1e40af;">0级</span></div>\'');
a('  +\'<button class="sim-btn" onclick="_rW()">记录</button>\'');
a('  +\'<table style="border-collapse:collapse;font-size:13px;background:#fff;width:100%;max-width:400px;"><thead><tr style="background:#166534;color:#fff;"><th style="padding:6px;">风向</th><th style="padding:6px;">风速</th></tr></thead><tbody id="wBod"></tbody></table>\'');
a('  c.appendChild(d);');
a('  var D=["北风","东北风","东风","东南风","南风","西南风","西风","西北风"];');
a('  window._upWD=function(){var d2=parseInt(document.getElementById("wDir").value),i=Math.round(d2/45)%8;document.getElementById("wVn").setAttribute("transform","rotate("+d2+",140,140)");document.getElementById("wDirL").textContent=D[i];};');
a('  window._upWS=function(){var s=parseInt(document.getElementById("wSpd").value);var L=["0级","1级","2级","3级","4级","5级","6级","7级","8级","9级","10级","11级","12级"];document.getElementById("wSpdL").textContent=L[s]||s+"级";};');
a('  window._rW=function(){var d2=parseInt(document.getElementById("wDir").value),s=parseInt(document.getElementById("wSpd").value),i=Math.round(d2/45)%8;window._wd=window._wd||[];window._wd.push({d:D[i],s:s});var b=document.getElementById("wBod");if(b)b.innerHTML=window._wd.map(function(v2){return "<tr><td>"+v2.d+"</td><td>"+v2.s+"级</td></tr>";}).join("");};');
a('}');
a('');

// 写入文件
fs.writeFileSync(out, lines.join('\n'), 'utf8');
console.log('Wrote', lines.length, 'lines to', out);
