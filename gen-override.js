// gen-override.js — 生成 sim-override.js
// 直接写出完整的覆盖文件，不依赖模板拼接

var fs = require('fs');
var path = require('path');
var outPath = path.join('E:/WorkBuddy/2026-06-20-01-37-08/geography-experiments/js', 'sim-override.js');

var lines = [];

function a(line) { lines.push(line); }

a('// sim-override.js');
a('// 覆盖 app.js 中的残次模拟器，并补充缺失的互动模拟器');
a('// 必须在 app.js 之后加载');
a('');
a('// ==================== 工具函数 ====================');
a('function _cv() { return document.getElementById("simCanvas"); }');
a('function _ct() { return document.getElementById("simControls"); }');
a('function _cl() { var c=_cv(); if(c)c.innerHTML=""; var d=_ct(); if(d)d.innerHTML=""; }');
a('');

// ===== j003 地球公转（覆盖占位符）=====
a('function initRevolutionSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#0f172a";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;";');
a('  d.innerHTML=\'<svg id="rvS" width="600" height="420" viewBox="0 0 600 420" style="max-width:100%;height:auto;">\'+');
a('    \'<circle cx="300" cy="210" r="35" fill="#fbbf24"/><text x="300" y="218" text-anchor="middle" fill="#92400e" font-size="12" font-weight="700">太阳</text>\'+');
a('    \'<ellipse cx="300" cy="210" rx="220" ry="90" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>\'+');
a('    \'<circle id="rvE" cx="520" cy="210" r="18" fill="#2563eb" stroke="#60a5fa" stroke-width="2"/>\'+');
a('    \'<line id="rvA" x1="520" y1="195" x2="520" y2="225" stroke="#fbbf24" stroke-width="2" transform="rotate(-23.5,520,210)"/>\'+');
a('    \'<line id="rvR" x1="300" y1="210" x2="520" y2="210" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.7"/>\'+');
a('    \'<text id="rvL" x="520" y="250" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="600"></text>\'+');
a('    \'<rect x="16" y="16" width="260" height="90" rx="8" fill="rgba(0,0,0,0.65)"/>\'+');
a('    \'<text id="rvDt" x="26" y="38" fill="#fbbf24" font-size="13" font-weight="600">节气：春分</text>\'+');
a('    \'<text id="rvDr" x="26" y="58" fill="#60a5fa" font-size="12">直射：赤道</text>\'+');
a('    \'<text id="rvSn" x="26" y="78" fill="#4ade80" font-size="12">季节</text>\'+');
a('    \'<text id="rvDn" x="26" y="98" fill="#fbbf24" font-size="12">昼夜</text>\'+');
a('    \'</svg>\'; c.appendChild(d);');
a('  var S=[{d:80,l:"春分(3月21日)",dr:"0°赤道",sn:"北春|南秋",dn:"昼夜平分"},{d:172,l:"夏至(6月22日)",dr:"23.5°N",sn:"北夏|南冬",dn:"北昼最长"},{d:266,l:"秋分(9月23日)",dr:"0°赤道",sn:"北秋|南春",dn:"昼夜平分"},{d:355,l:"冬至(12月22日)",dr:"23.5°S",sn:"北冬|南夏",dn:"北昼最短"}];');
a('  window._rd=80; window._rr=false;');
a('  function up(){');
a('    var a=(window._rd/365)*360,r=a*Math.PI/180;');
a('    var x=300+220*Math.cos(r-Math.PI/2),y=210+90*Math.sin(r-Math.PI/2);');
a('    var E=document.getElementById("rvE"); if(E){E.setAttribute("cx",x);E.setAttribute("cy",y);}');
a('    var R=document.getElementById("rvR"); if(R){R.setAttribute("x2",x);R.setAttribute("y2",y);}');
a('    var L=document.getElementById("rvL"); if(L){L.setAttribute("x",x);L.setAttribute("y",y+40);}');
a('    var c2=S[0],md=999; S.forEach(function(s2){var v=Math.abs(window._rd-s2.d);if(v<md){md=v;c2=s2;}});');
a('    var e=document.getElementById("rvDt"); if(e)e.textContent="节气："+c2.l;');
a('    var r2=document.getElementById("rvDr"); if(r2)r2.textContent="直射："+c2.dr;');
a('    var s2=document.getElementById("rvSn"); if(s2)s2.textContent="季节："+c2.sn;');
a('    var d2=document.getElementById("rvDn"); if(d2)d2.textContent="昼夜："+c2.dn;');
a('    if(L)L.textContent=c2.l;');
a('  }');
a('  window._ar=function(){if(!window._rr)return;window._rd+=1;if(window._rd>365)window._rd=1;up();setTimeout(window._ar,80);};');
a('  up();');
a('  var ct=_ct(); if(ct)ct.innerHTML=\'<button class="sim-btn" id="rvB" onclick="window._rr=!window._rr;if(window._rr)window._ar();else clearTimeout(window._ra);this.textContent=window._rr?\\\'⏸ 暂停\\\'':\\\'▶ 公转\\\'">▶ 公转</button><button class="sim-btn" onclick="window._rd=80;up();">↺ 春分</button><input type="range" min="1" max="365" value="80" id="rvSl" oninput="window._rd=parseInt(this.value);up();" style="width:100px;">\';');
a('}');
a('');

// ===== j005 气温观测 =====
a('function initTempSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#f0fdf4";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:12px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#166534;">🌡️ 虚拟气温观测</h3>\'+');
a('    \'<p style="margin:0;font-size:13px;color:#52525b;">点击下方时间按钮记录气温，生成日变化曲线</p>\'+');
a('    \'<svg id="tSvg" width="160" height="280" style="border:1px solid #bbf7d0;border-radius:12px;background:#fff;">\'+');
a('      \'<rect x="30" y="30" width="60" height="220" rx="30" fill="#fef2f2" stroke="#fca5a5" stroke-width="2"/><rect id="tFi" x="35" y="250" width="50" height="0" rx="20" fill="#ef4444"/>\'+');
a('      \'<text id="tVal" x="105" y="248" text-anchor="middle" fill="#dc2626" font-size="14" font-weight="700">0°C</text>\'+');
a('    \'</svg>\'+');
a('    \'<div id="tBtns" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">\'+');
a('      \'<button class="sim-btn" onclick="_rt(2)">02:00</button><button class="sim-btn" onclick="_rt(8)">08:00</button>\'+');
a('      \'<button class="sim-btn" onclick="_rt(14)">14:00</button><button class="sim-btn" onclick="_rt(20)">20:00</button>\'+');
a('    \'</div>\'+');
a('    \'<table id="tTbl" style="border-collapse:collapse;font-size:13px;background:#fff;width:100%;max-width:400px;"><thead><tr style="background:#166534;color:#fff;"><th style="padding:6px;">时间</th><th style="padding:6px;">℃</th></tr></thead><tbody id="tBod"></tbody></table>\'+');
a('    \'<button class="sim-btn" onclick="window._td=[];_ut();">清除</button>\';');
a('  c.appendChild(d); window._td=[];');
a('  window._rt=function(h){var t=(h===14?32:h===2?18:h===8?22:26)+(Math.random()*3-1.5);t=Math.round(t*10)/10;window._td.push({h:h,t:t});_ut();};');
a('  window._ut=function(){var b=document.getElementById("tBod");if(!b)return;b.innerHTML=window._td.map(function(v){return "<tr><td style=\'padding:6px;text-align:center;\'>"+v.h+":00</td><td style=\'padding:6px;text-align:center;font-weight:600;color:#dc2626;\'>"+v.t.toFixed(1)+"°C</td></tr>";}).join("");if(window._td.length>0){var l=window._td[window._td.length-1],h2=Math.min((l.t/40)*210,210);var f=document.getElementById("tFi");if(f){f.setAttribute("height",h2);f.setAttribute("y",250-h2+30);}var v=document.getElementById("tVal");if(v)v.textContent=l.t.toFixed(1)+"°C";}};');
a('}');
a('');

// ===== j006 降水量观测 =====
a('function initPrecipSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#eff6ff";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:12px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#1e40af;">🌧️ 虚拟降水量观测</h3>\'+');
a('    \'<svg id="pSvg" width="160" height="240" style="border:1px solid #bfdbfe;border-radius:12px;background:#fff;">\'+');
a('      \'<rect x="30" y="20" width="80" height="200" rx="8" fill="none" stroke="#3b82f6" stroke-width="2"/><rect id="pFi" x="35" y="220" width="70" height="0" rx="4" fill="#3b82f6" opacity="0.5"/><text id="pVal" x="80" y="130" text-anchor="middle" fill="#1e40af" font-size="18">0mm</text>\'+');
a('    \'</svg>\'+');
a('    \'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">\'+');
a('      \'<input type="range" id="pSld" min="0" max="200" value="0" style="width:150px;" oninput="_up()">\'+');
a('      \'<span id="pLbl" style="font-weight:600;color:#1e40af;">0 mm</span>\'+');
a('      \'<button class="sim-btn" onclick="_rp()">记录</button></div>\'+');
a('    \'<table style="border-collapse:collapse;font-size:13px;background:#fff;width:100%;max-width:400px;"><thead><tr style="background:#1e40af;color:#fff;"><th style="padding:6px;">月份</th><th style="padding:6px;">mm</th></tr></thead><tbody id="pBod"></tbody></table>\'+');
a('  c.appendChild(d); window._pd=[];');
a('  window._up=function(){var v=parseInt(document.getElementById("pSld").value);document.getElementById("pLbl").textContent=v+" mm";var h=Math.min((v/200)*200,200);document.getElementById("pFi").setAttribute("height",h);document.getElementById("pFi").setAttribute("y",220-h);document.getElementById("pVal").textContent=v+"mm";};');
a('  window._rp=function(){var v=parseInt(document.getElementById("pSld").value);window._pd.push({m:(window._pm||1),a:v});window._pm=(window._pm||1)%12+1;var b=document.getElementById("pBod");if(b)b.innerHTML=window._pd.map(function(x2){return "<tr><td style=\'padding:6px;text-align:center;\'>"+x2.m+"月</td><td style=\'padding:6px;text-align:center;font-weight:600;color:#1e40af;\'>"+x2.a+" mm</td></tr>";}).join("");};');
a('}');
a('');

// ===== j007 风向风速观测 =====
a('function initWindSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#f0fdf4";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#166534;">💨 虚拟风向风速观测</h3>\'+');
a('    \'<svg id="wSvg" width="280" height="280" style="background:#fff;border-radius:50%;border:2px solid #bbf7d0;">\'+');
a('      \'<circle cx="140" cy="140" r="120" fill="#f0fdf4"/><text x="140" y="32" text-anchor="middle" fill="#52525b" font-size="12">N</text><text x="258" y="144" text-anchor="middle" fill="#52525b" font-size="12">E</text><text x="140" y="268" text-anchor="middle" fill="#52525b" font-size="12">S</text><text x="22" y="144" text-anchor="middle" fill="#52525b" font-size="12">W</text>\'+');
a('      \'<g id="wVn" transform="rotate(0,140,140)"><polygon points="140,60 152,120 140,100 128,120" fill="#dc2626"/><polygon points="140,220 152,160 140,180 128,160" fill="#374151"/><circle cx="140" cy="140" r="8" fill="#fbbf24"/></g></svg>\'+');
a('    \'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">\'+');
a('      \'<input type="range" min="0" max="360" value="0" id="wDir" style="width:120px;" oninput="_uw1()">\'+');
a('      \'<span id="wDirL" style="font-weight:600;color:#166534;">北风</span>\'+');
a('      \'<input type="range" min="0" max="12" value="0" id="wSpd" style="width:100px;" oninput="_uw2()">\'+');
a('      \'<span id="wSpdL" style="font-weight:600;color:#1e40af;">0级</span></div>\'+');
a('    \'<button class="sim-btn" onclick="_rw()">记录观测</button>\'+');
a('    \'<table style="border-collapse:collapse;font-size:13px;background:#fff;width:100%;max-width:400px;"><thead><tr style="background:#166534;color:#fff;"><th style="padding:6px;">风向</th><th style="padding:6px;">风速</th></tr></thead><tbody id="wBod"></tbody></table>\';');
a('  c.appendChild(d);');
a('  var D=["北风","东北风","东风","东南风","南风","西南风","西风","西北风"];');
a('  window._uw1=function(){var d2=parseInt(document.getElementById("wDir").value),i=Math.round(d2/45)%8;document.getElementById("wVn").setAttribute("transform","rotate("+d2+",140,140)");document.getElementById("wDirL").textContent=D[i];};');
a('  window._uw2=function(){var s=parseInt(document.getElementById("wSpd").value),L=["0级","1级","2级","3级","4级","5级","6级","7级","8级","9级","10级","11级","12级"];document.getElementById("wSpdL").textContent=L[s]||s+"级";};');
a('  window._rw=function(){var d2=parseInt(document.getElementById("wDir").value),s=parseInt(document.getElementById("wSpd").value),i=Math.round(d2/45)%8;window._wd=window._wd||[];window._wd.push({d:D[i],s:s});var b=document.getElementById("wBod");if(b)b.innerHTML=window._wd.map(function(v2){return "<tr><td>"+v2.d+"</td><td>"+v2.s+"级</td></tr>";}).join("");};');
a('}');
a('');

// ===== j008 岩石识别 =====
a('function initRockSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#fefce8";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:12px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#92400e;">🪨 岩石标本识别</h3><div id="rQ" style="width:100%;max-width:600px;"></div><div id="rR" style="font-size:14px;padding:8px 16px;border-radius:8px;"></div><button class="sim-btn" onclick="_sr()">开始新测验</button>\';');
a('  c.appendChild(d); window._sr=function(){');
a('    var R=[{n:"花岗岩",t:"岩浆岩(侵入)",c:"肉红色，颗粒粗，有明显矿物结晶"},{n:"玄武岩",t:"岩浆岩(喷出)",c:"黑色，颗粒细，常有气孔"}],idx=Math.floor(Math.random()*2),Q=R[idx],opts=[Q.t];');
a('    while(opts.length<3){var t2=["岩浆岩(侵入)","岩浆岩(喷出)","沉积岩","变质岩"][Math.floor(Math.random()*4)];if(opts.indexOf(t2)===-1)opts.push(t2);}');
a('    opts.sort(function(){return Math.random()-0.5;});');
a('    var q=document.getElementById("rQ"); q.innerHTML="<div style=\'background:#fff;padding:16px;border-radius:12px;border:2px solid #f59e0b;\'><div style=\'font-size:40px;text-align:center;\'>🪨</div><p style=\'font-weight:600;color:#92400e;\'>"+Q.n+"</p><p style=\'font-size:13px;color:#52525b;\'>"+Q.c+"</p><div style=\'display:flex;flex-direction:column;gap:8px;margin-top:10px;\'>"+opts.map(function(o,i2){return "<button style=\'padding:10px 16px;border:2px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;text-align:left;font-size:14px;\' onclick=\'chr(this,\""+o+"\",\""+Q.t+"\")\'>"+String.fromCharCode(65+i2)+". "+o+"</button>";}).join("")+"</div></div>";');
a('    var r=document.getElementById("rR"); r.textContent=""; r.style.background="transparent";');
a('  };');
a('  window.chr=function(btn,sel,correct){var r=document.getElementById("rR"),btns=document.querySelectorAll("#rQ button"); btns.forEach(function(b2){b2.disabled=true;}); if(sel===correct){r.textContent="✅ 正确！"+correct; r.style.background="#dcfce7"; r.style.color="#166534";} else {r.textContent="❌ 不正确。正确答案："+correct; r.style.background="#fee2e2"; r.style.color="#991b1b";}};');
a('  window._sr();');
a('}');
a('');

// ===== j009 土壤剖面 =====
a('function initSoilSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#fefce8";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:12px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#92400e;">🏔️ 土壤剖面观察</h3>\'+');
a('    \'<svg id="slSvg" width="600" height="360" style="max-width:100%;height:auto;background:#fff;border-radius:12px;border:1px solid #f59e0b;">\'+');
a('      \'<rect x="0" y="40" width="600" height="30" fill="#22c55e"/><text x="300" y="60" text-anchor="middle" fill="#fff" font-size="12">地面</text>\'+');
a('      \'<rect id="slO" x="50" y="70" width="500" height="35" fill="#92400e" opacity="0.7" style="cursor:pointer;" onclick="shSl(\\'O\')"/><text x="300" y="92" text-anchor="middle" fill="#fff" font-size="13">O 枯枝落叶层</text>\'+');
a('      \'<rect id="slA" x="50" y="105" width="500" height="45" fill="#3f2502" opacity="0.8" style="cursor:pointer;" onclick="shSl(\\'A\')"/><text x="300" y="132" text-anchor="middle" fill="#fff" font-size="13">A 腐殖质层</text>\'+');
a('      \'<rect id="slB" x="50" y="150" width="500" height="80" fill="#a16207" opacity="0.8" style="cursor:pointer;" onclick="shSl(\\'B\')"/><text x="300" y="195" text-anchor="middle" fill="#fff" font-size="13">B 淀积层</text>\'+');
a('      \'<rect id="slC" x="50" y="230" width="500" height="50" fill="#a8a29b" opacity="0.7" style="cursor:pointer;" onclick="shSl(\\'C\')"/><text x="300" y="260" text-anchor="middle" fill="#fff" font-size="13">C 母质层</text>\'+');
a('      \'<rect id="slR" x="50" y="280" width="500" height="40" fill="#374151" opacity="0.9" style="cursor:pointer;" onclick="shSl(\\'R\')"/><text x="300" y="305" text-anchor="middle" fill="#fff" font-size="13">R 基岩层</text>\'+');
a('    \'</svg>\'+');
a('    \'<div id="slInfo" style="display:none;max-width:600px;width:100%;background:#fff;padding:16px;border-radius:12px;border:1px solid #f59e0b;"></div>\';');
a('  c.appendChild(d);');
a('  window._sld={O:{t:"O 枯枝落叶层",d:"由枯枝落叶堆积而成，未完全分解。含水量高，是土壤有机质主要来源。"},A:{t:"A 腐殖质层",d:"有机质与矿物混合，腐殖质丰富，肥力最高。"},B:{t:"B 淀积层",d:"从上层淋溶物质在此淀积。结构较紧实，肥力低于A层。"},C:{t:"C 母质层",d:"岩石风化碎屑，尚未成土。"},R:{t:"R 基岩层",d:"完整基岩。植物根系无法穿透。"}};');
a('  window.shSl=function(l){var i=document.getElementById("slInfo"),w=window._sld[l];if(!i||!w)return;i.style.display="block";i.innerHTML="<h4 style=\'margin:0 0 8px 0;color:#92400e;\'>"+w.t+"</h4><p style=\'margin:0;font-size:13px;color:#52525b;line-height:1.6;\'>"+w.d+"</p>";["O","A","B","C","R"].forEach(function(l2){var el=document.getElementById("sl"+l2);if(el){el.style.stroke=(l2===l)?"#f59e0b":"none";el.style.strokeWidth=(l2===l)?"3":"0";}});};');
a('}');
a('');

// ===== j010 河流地貌（覆盖占位符）=====
a('function initRiverSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#eff6ff";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#1e40af;">🏞️ 河流地貌模拟</h3>\'+');
a('    \'<svg id="rrSvg" width="600" height="320" style="max-width:100%;height:auto;background:#fff;border-radius:12px;">\'+');
a('      \'<path d="M 50 160 Q 120 80 200 160" fill="none" stroke="#1e40af" stroke-width="8" opacity="0.7"/><text x="120" y="110" text-anchor="middle" fill="#1e40af" font-size="12" font-weight="600">上游：V型谷（侵蚀）</text>\'+');
a('      \'<path d="M 200 160 C 280 140 340 200 420 160" fill="none" stroke="#2563eb" stroke-width="10" opacity="0.6"/><text x="310" y="220" text-anchor="middle" fill="#2563eb" font-size="12" font-weight="600">中游：河曲（侧蚀+堆积）</text>\'+');
a('      \'<path d="M 420 160 Q 480 170 540 185 L 580 185" fill="none" stroke="#60a5fa" stroke-width="18" opacity="0.5"/><text x="520" y="250" text-anchor="middle" fill="#0284c7" font-size="12" font-weight="600">下游：三角洲（堆积）</text>\'+');
a('      \'<circle id="rrP1" cx="80" cy="165" r="4" fill="#1e40af" opacity="0.8"/><circle id="rrP2" cx="300" cy="170" r="4" fill="#2563eb" opacity="0.8"/><circle id="rrP3" cx="500" cy="185" r="4" fill="#16a34a" opacity="0.8"/>\'+');
a('    \'</svg>\'+');
a('    \'<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">\'+');
a('      \'<button class="sim-btn" id="rrB" onclick="_tr()">▶️ 开始流动</button>\'+');
a('      \'<button class="sim-btn" onclick="window._rrt=0;window._rrr=false;document.getElementById(\'rrB\').textContent=\'▶️ 开始流动\';">↺ 重置</button>\'+');
a('    \'</div>\';');
a('  c.appendChild(d); window._rrt=0; window._rrr=false;');
a('  window._tr=function(){window._rrr=!window._rrr;document.getElementById("rrB").textContent=window._rrr?"⏸ 暂停":"▶️ 开始流动";if(window._rrr)_ar2();};');
a('  function _ar2(){if(!window._rrr)return;window._rrt+=0.03;var t=window._rrt;var p1=document.getElementById("rrP1");if(p1)p1.setAttribute("cy",140+Math.abs(Math.sin(t))*40);var p2=document.getElementById("rrP2");if(p2)p2.setAttribute("cx",300+Math.sin(t*2)*40);var p3=document.getElementById("rrP3");if(p3){p3.setAttribute("cx",500+Math.sin(t*3)*15);p3.setAttribute("cy",185+Math.abs(Math.cos(t*2))*10);}requestAnimationFrame(_ar2);}');
a('}');
a('');

// ===== s002 水循环（覆盖静态版）=====
a('function initWaterCycleSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#f0f9ff";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#0c4a6e;">💧 水循环互动模拟</h3>\'+');
a('    \'<svg id="wcSvg" width="600" height="380" style="max-width:100%;height:auto;background:#e0f2fe;border-radius:12px;">\'+');
a('      \'<rect x="0" y="270" width="600" height="110" fill="#0ea5e9" opacity="0.5"/><text x="300" y="350" text-anchor="middle" fill="#0c4a6e" font-size="13">🌊 海洋</text>\'+');
a('      \'<circle id="wc1" cx="300" cy="100" r="24" fill="#fbbf24" opacity="0.8" style="cursor:pointer;" onclick="hlWc(\\'evap\')"/><text x="300" y="104" text-anchor="middle" fill="#92400e" font-size="11">①蒸发</text>\'+');
a('      \'<circle id="wc2" cx="420" cy="140" r="24" fill="#6366f1" opacity="0.8" style="cursor:pointer;" onclick="hlWc(\\'trans\')"/><text x="420" y="144" text-anchor="middle" fill="#fff" font-size="11">②输送</text>\'+');
a('      \'<circle id="wc3" cx="420" cy="240" r="24" fill="#3b82f6" opacity="0.8" style="cursor:pointer;" onclick="hlWc(\'prec\')"/><text x="420" y="244" text-anchor="middle" fill="#fff" font-size="11">③降水</text>\'+');
a('      \'<circle id="wc4" cx="300" cy="280" r="24" fill="#0284c7" opacity="0.8" style="cursor:pointer;" onclick="hlWc(\'runoff\')"/><text x="300" y="284" text-anchor="middle" fill="#fff" font-size="11">④径流</text>\'+');
a('      \'<circle id="wc5" cx="180" cy="200" r="24" fill="#16a34a" opacity="0.8" style="cursor:pointer;" onclick="hlWc(\'infilt\')"/><text x="180" y="204" text-anchor="middle" fill="#fff" font-size="11">⑤下渗</text>\'+');
a('    \'</svg>\'+');
a('    \'<div id="wcInfo" style="display:none;max-width:600px;width:100%;background:#fff;padding:14px;border-radius:10px;border:1px solid #bae6fd;"></div>\';');
a('  c.appendChild(d);');
a('  window._wci={evap:{t:"① 蒸发",d:"太阳照射使水面受热，水分子变成水蒸气上升。"},trans:{t:"② 水汽输送",d:"大气运动将水汽从海洋输送到陆地。"},prec:{t:"③ 降水",d:"水汽冷却凝结，形成雨雪降落地面。"},runoff:{t:"④ 地表径流",d:"水沿地面流动，形成江河，返回海洋。"},infilt:{t:"⑤ 下渗",d:"部分水渗入地下，成为地下水。"}};');
a('  window.hlWc=function(s){var i=document.getElementById("wcInfo"),w=window._wci[s];if(!i||!w)return;i.style.display="block";i.innerHTML="<h4 style=\'margin:0 0 6px 0;color:#0c4a6e;\'>"+w.t+"</h4><p style=\'margin:0;font-size:13px;color:#52525b;line-height:1.6;\'>"+w.d+"</p>";};');
a('}');
a('');

// ===== s003 太阳高度角 =====
a('function initSolarAngleSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#f0fdf4";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#166534;">☀️ 太阳高度角测量</h3>\'+');
a('    \'<svg id="sSvg" width="500" height="360" style="max-width:100%;height:auto;background:#e0f2fe;border-radius:12px;">\'+');
a('      \'<line x1="50" y1="300" x2="450" y2="300" stroke="#92400e" stroke-width="2"/><text x="250" y="320" text-anchor="middle" fill="#92400e" font-size="11">地平线</text>\'+');
a('      \'<circle id="sunD" cx="250" cy="100" r="20" fill="#fbbf24" style="cursor:grab;"/><text x="250" y="105" text-anchor="middle" fill="#92400e" font-size="11" font-weight="700">☀️</text>\'+');
a('      \'<line id="sLn" x1="250" y1="300" x2="250" y2="100" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6,3"/><text id="sAng" x="210" y="270" fill="#dc2626" font-size="14" font-weight="700">h = ?°</text>\'+');
a('      \'<rect x="16" y="16" width="280" height="48" rx="8" fill="rgba(255,255,255,0.95)" stroke="#bae6fd"/><text x="26" y="38" fill="#0c4a6e" font-size="12" font-weight="600">h = 90° - |φ - δ|</text>\'+');
a('    \'</svg>\'+');
a('    \'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">\'+');
a('      \'<label>纬度φ：</label><input type="range" id="phiS" min="-60" max="60" value="40" oninput="_us()"><span id="phiL">40°N</span>\'+');
a('      \'<label>赤纬δ：</label><input type="range" id="dltS" min="-23.5" max="23.5" step="0.5" value="16.5" oninput="_us()"><span id="dltL">16.5°N</span></div>\'+');
a('    \'<div id="sRst" style="max-width:500px;background:#fff;padding:12px;border-radius:10px;border:1px solid #bbf7d0;font-size:13px;"></div>\';');
a('  c.appendChild(d);');
a('  window._us=function(){var phi=parseFloat(document.getElementById("phiS").value),dlt=parseFloat(document.getElementById("dltS").value),h=90-Math.abs(phi-dlt);h=Math.max(0,Math.min(h,90));document.getElementById("phiL").textContent=(phi>=0?phi.toFixed(1)+"°N":Math.abs(phi).toFixed(1)+"°S");document.getElementById("dltL").textContent=(dlt>=0?dlt.toFixed(1)+"°N":Math.abs(dlt).toFixed(1)+"°S");document.getElementById("sAng").textContent="h = "+h.toFixed(1)+"°";var r=document.getElementById("sRst");if(r)r.innerHTML="📍 计算结果：h = "+h.toFixed(1)+"°<br>📐 验算：h = 90° - |"+phi+" - ("+dlt+")| = "+h.toFixed(1)+"°";var sun=document.getElementById("sunD");if(sun){var sy=300-(h/90)*200;sun.setAttribute("cy",sy);document.getElementById("sLn").setAttribute("y2",sy);}};');
a('  window._us();');
a('}');
a('');

// ===== s006 工业区位 =====
a('function initIndustrySimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#f8fafc";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#0f172a;">🏭 工业区位选择模拟</h3>\'+');
a('    \'<svg id="iSvg" width="560" height="360" style="max-width:100%;height:auto;border-radius:12px;border:1px solid #cbd5e1;background:#f0fdf4;">\'+');
a('      \'<rect id="zT" x="80" y="60" width="120" height="100" fill="#dbeafe" rx="4" style="cursor:pointer;" onclick="slInd(\\'T\')"/><text x="140" y="115" text-anchor="middle" fill="#1e40af" font-size="11">🚛 交通枢纽</text>\'+');
a('      \'<rect id="zL" x="260" y="60" width="120" height="100" fill="#fef3c7" rx="4" style="cursor:pointer;" onclick="slInd(\\'L\')"/><text x="320" y="115" text-anchor="middle" fill="#92400e" font-size="11">👷 劳动力</text>\'+');
a('      \'<rect id="zM" x="420" y="60" width="120" height="100" fill="#fce7f3" rx="4" style="cursor:pointer;" onclick="slInd(\'M\')"/><text x="480" y="115" text-anchor="middle" fill="#9d174d" font-size="11">🛒 市场</text>\'+');
a('      \'<rect id="zE" x="80" y="220" width="120" height="100" fill="#f3e8ff" rx="4" style="cursor:pointer;" onclick="slInd(\'E\')"/><text x="140" y="275" text-anchor="middle" fill="#6b21a8" font-size="11">⚡ 能源</text>\'+');
a('      \'<rect id="zT2" x="260" y="220" width="120" height="100" fill="#e0f2fe" rx="4" style="cursor:pointer;" onclick="slInd(\'T2\')"/><text x="320" y="275" text-anchor="middle" fill="#0c4a6e" font-size="11">🔬 高新技术</text>\'+');
a('      \'<g id="fIcon" style="cursor:grab;"><rect x="195" y="185" width="50" height="30" fill="#6b7280" rx="3"/><polygon points="195,185 220,170 245,185" fill="#374151"/><text x="220" y="205" text-anchor="middle" fill="#fff" font-size="9">工厂</text></g>\'+');
a('    \'</svg>\'+');
a('    \'<div id="iRst" style="max-width:560px;width:100%;background:#fff;padding:14px;border-radius:10px;border:1px solid #e2e8f0;font-size:13px;"></div>\';');
a('  c.appendChild(d);');
a('  window.slInd=function(z){var S={T:{t:9,l:5,m:6,e:5,tech:4},L:{t:5,l:9,m:5,e:4,tech:3},M:{t:7,l:5,m:9,e:4,tech:5},E:{t:3,l:4,m:4,e:9,tech:3},T2:{t:5,l:3,m:6,e:4,tech:9}};var s=S[z];if(!s)return;var div=document.getElementById("iRst");if(!div)return;var bars="";Object.keys(s).forEach(function(k){var L={t:"运输",l:"劳动力",m:"市场",e:"能源",tech:"技术"}[k];bars+="<div style=\'display:flex;align-items:center;gap:8px;margin:4px 0;\'><span style=\'width:60px;font-size:12px;\'>"+L+"</span><div style=\'flex:1;height:14px;background:#f1f5f9;border-radius:7px;overflow:hidden;\'><div style=\'height:100%;width:"+s[k]*10+"%;background:#3b82f6;border-radius:7px;\'></div></div><span style=\'font-size:12px;font-weight:600;\'>"+s[k]+"</span></div>";});var ttl=Object.keys(s).reduce(function(a,k2){return a+s[k2];},0);div.innerHTML="📊 区位评分（"+(z==="T"?"交通枢纽区":z==="L"?"劳动力丰富区":z==="M"?"市场邻近区":z==="E"?"能源充足区":"高新技术区")+"）<br>"+bars+"<div style=\'margin-top:8px;padding-top:8px;border-top:1px solid #e2e8f0;font-weight:700;color:#0c4a6e;\'>综合得分："+ttl+"/50（"+(ttl>=35?"⭐⭐⭐ 最优":ttl>=28?"⭐⭐ 较优":"⭐ 一般")+"）</div>";["T","L","M","E","T2"].forEach(function(k2){var el=document.getElementById("z"+k2);if(el)el.style.stroke=(k2===z)?"#f59e0b":"none";});};');
a('  window.slInd("T");');
a('}');
a('');

// ===== s007 农业区位 =====
a('function initAgricultureSimulator() {');
a('  _cl(); var c=_cv(); c.style.background="#fefce8";');
a('  var d=document.createElement("div"); d.style.cssText="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;overflow-y:auto;";');
a('  d.innerHTML=\'<h3 style="margin:0;color:#92400e;">🌾 农业区位因素模拟</h3>\'+');
a('    \'<div id="aScore" style="font-size:18px;font-weight:700;color:#166534;padding:12px 24px;background:#dcfce7;border-radius:12px;">综合适宜性：? 分</div>\'+');
a('    \'<div style="width:100%;max-width:560px;display:flex;flex-direction:column;gap:10px;">\'+');
a('      \'<div style="display:flex;align-items:center;gap:8px;"><label style="width:80px;font-size:13px;">🌡️ 气候：</label><input type="range" min="1" max="10" value="5" id="aClim" oninput="_ua()"><span id="aClimL">5</span></div>\'+');
a('      \'<div style="display:flex;align-items:center;gap:8px;"><label style="width:80px;font-size:13px;">🏔️ 地形：</label><input type="range" min="1" max="10" value="5" id="aTerr" oninput="_ua()"><span id="aTerrL">5</span></div>\'+');
a('      \'<div style="display:flex;align-items:center;gap:8px;"><label style="width:80px;font-size:13px;">💧 水源：</label><input type="range" min="1" max="10" value="5" id="aWat" oninput="_ua()"><span id="aWatL">5</span></div>\'+');
a('      \'<div style="display:flex;align-items:center;gap:8px;"><label style="width:80px;font-size:13px;">🌱 土壤：</label><input type="range" min="1" max="10" value="5" id="aSoil" oninput="_ua()"><span id="aSoilL">5</span></div>\'+');
a('      \'<div style="display:flex;align-items:center;gap:8px;"><label style="width:80px;font-size:13px;">🚜 机械化：</label><input type="range" min="1" max="10" value="5" id="aMech" oninput="_ua()"><span id="aMechL">5</span></div>\'+');
a('    \'</div>\'+');
a('    \'<div id="aDesc" style="max-width:560px;width:100%;background:#fff;padding:14px;border-radius:10px;border:1px solid #f59e0b;font-size:13px;line-height:1.6;"></div>\';');
a('  c.appendChild(d);');
a('  window._ua=function(){var c2=parseInt(document.getElementById("aClim").value),t2=parseInt(document.getElementById("aTerr").value),w2=parseInt(document.getElementById("aWat").value),s2=parseInt(document.getElementById("aSoil").value),m2=parseInt(document.getElementById("aMech").value),ttl=Math.round((c2+t2+w2+s2+m2)/5);document.getElementById("aClimL").textContent=c2;document.getElementById("aTerrL").textContent=t2;document.getElementById("aWatL").textContent=w2;document.getElementById("aSoilL").textContent=s2;document.getElementById("aMechL").textContent=m2;var sc=document.getElementById("aScore");if(sc)sc.textContent="综合适宜性："+ttl+" 分（"+(ttl>=8?"🌾 非常适宜":ttl>=6?"🌱 较适宜":ttl>=4?"🌡️ 一般适宜":"🔴 不适宜")+"）";var desc=document.getElementById("aDesc");if(desc){var tips="";if(c2<5)tips+="气候偏冷/干，需温室或选耐寒作物。";if(t2<5)tips+="地形坡度大，适宜梯田或林业。";if(w2<5)tips+="水源不足，需灌溉设施。";desc.innerHTML="📋 <strong>评估说明：</strong>五项因素平均分 "+ttl+"/10。<br>"+(tips||"各项条件均衡，适宜性较好。");}};');
a('  window._ua();');
a('}');
a('');

// 写入文件
var fullCode = lines.join('\n');
fs.writeFileSync(outPath, fullCode, 'utf8');
console.log('Done! Wrote', lines.length, 'lines ->', outPath);
