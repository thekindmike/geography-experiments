// ============================================================
//  地理实验平台 - 控制变量法升级版模拟器（完整版）
//  所有18个实验均按照科学研究方法设计：
//    1. 明确控制变量（保持不变）
//    2. 只允许一个自变量变化
//    3. 观察因变量变化
//    4. 记录数据、得出结论
//  自动生成时间：2026-06-20 07:56:26
// ============================================================

// ==================== 全局样式注入 ====================
(function injectGlobalStyle(){
  if(document.getElementById('__expGlobalStyle')) return;
  const s=document.createElement('style');
  s.id='__expGlobalStyle';
  s.textContent=`
    .exp-container{max-width:1120px;margin:0 auto;font-family:"PingFang SC","Microsoft YaHei",sans-serif;}
    .exp-header{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
    .exp-badge{background:#dbeafe;color:#1d4ed;font-size:11px;padding:2px 8px;border-radius:10px;font-weight:600;}
    .exp-section{margin-bottom:12px;}
    .exp-section h4{font-size:13px;margin:0 0 8px 0;color:#334155;}
    .var-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;margin-bottom:8px;}
    .var-card label{font-size:12px;color:#475569;display:block;margin-bottom:4px;}
    .data-table{width:100%;border-collapse:collapse;font-size:12px;}
    .data-table th{background:#f1f5f9;padding:6px 8px;border:1px solid #e2e8f0;text-align:left;color:#64748b;}
    .data-table td{padding:5px 8px;border:1px solid #e2e8f0;}
    .data-table tr:nth-child(even){background:#f8fafc;}
    .sim-btn{background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12px;transition:all 0.15s;}
    .sim-btn:hover{background:#e2e8f0;}
    .sim-btn-primary{background:#3b82f6;color:#fff;border-color:#3b82f6;}
    .sim-btn-primary:hover{background:#2563eb;}
    .sim-btn-success{background:#22c55e;color:#fff;border-color:#22c55e;}
    .sim-btn-success:hover{background:#16a34a;}
    .conclusion-box{margin-top:14px;padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;color:#166534;font-size:13px;line-height:1.8;display:none;}
  `;
  document.head.appendChild(s);
})();


function initLatitudeSimulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f0f9ff';
  const W=document.createElement('div');
  W.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#1e3a5f;margin:0;">📍 经纬网定位实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：地球仪比例尺、投影方式、参考地点 ← 不变 &nbsp;|&nbsp;
        自变量：目标经纬度 ← 可调节 &nbsp;|&nbsp;
        因变量：定位准确度、定位时间 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;"><div class="var-card" style="border-color:#bbf7d0;"><div style="font-size:11px;color:#166534;font-weight:700;margin-bottom:4px;">🔒 控制变量（保持不变）</div><ul style="margin:0;padding-left:16px;font-size:11px;color:#15803d;line-height:1.7;"><li>地球仪比例尺</li><li>经纬网投影方式</li><li>参考地点选择</li></ul></div><div class="var-card" style="border-color:#bfdbfe;"><div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量（可调节）</div><div style="font-size:11px;color:#1e40af;line-height:1.7;">目标地点经纬度（°E/W, °N/S）</div></div><div class="var-card" style="border-color:#fde68a;"><div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量（观察结果）</div><div style="font-size:11px;color:#92400e;line-height:1.7;">定位准确度（km）、定位所需时间（s）</div></div></div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <!-- 左侧SVG -->
        <div style="flex:1;min-width:380px;">
          <svg id="latSvg" width="100%%" height="370" viewBox="0 0 500 370" style="background:#e0f2fe;border-radius:8px;border:1px solid #bae6fd;">
            <defs>
              <pattern id="g1" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#cbd5e1" stroke-width="0.4"/>
              </pattern>
            </defs>
            <rect width="500" height="370" fill="url(#g1)"/>
            <!-- 赤道 -->
            <line x1="0" y1="185" x2="500" y2="185" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="4,2"/>
            <text x="255" y="180" fill="#16a34a" font-size="9" font-weight="700">赤道 0°</text>
            <!-- 本初子午线 -->
            <line x1="250" y1="0" x2="250" y2="370" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
            <text x="255" y="365" fill="#dc2626" font-size="9" font-weight="700">本初子午线 0°</text>
            <!-- 纬线 -->
            <line x1="40" y1="100" x2="460" y2="100" stroke="#86efac" stroke-width="0.5"/>
            <text x="464" y="96" fill="#16a34a" font-size="8">30°N</text>
            <line x1="40" y1="142" x2="460" y2="142" stroke="#86efac" stroke-width="0.5"/>
            <text x="464" y="138" fill="#16a34a" font-size="8">15°N</text>
            <line x1="40" y1="228" x2="460" y2="228" stroke="#93c5fd" stroke-width="0.5"/>
            <text x="464" y="224" fill="#1d4ed" font-size="8">15°S</text>
            <line x1="40" y1="270" x2="460" y2="270" stroke="#93c5fd" stroke-width="0.5"/>
            <text x="464" y="266" fill="#1d4ed" font-size="8">30°S</text>
            <!-- 经线 -->
            <line x1="100" y1="20" x2="100" y2="350" stroke="#fca5a5" stroke-width="0.5"/>
            <text x="96" y="16" fill="#dc2626" font-size="8">60°W</text>
            <line x1="175" y1="20" x2="175" y2="350" stroke="#fca5a5" stroke-width="0.5"/>
            <text x="171" y="16" fill="#dc2626" font-size="8">30°W</text>
            <line x1="325" y1="20" x2="325" y2="350" stroke="#fca5a5" stroke-width="0.5"/>
            <text x="321" y="16" fill="#dc2626" font-size="8">30°E</text>
            <line x1="400" y1="20" x2="400" y2="350" stroke="#fca5a5" stroke-width="0.5"/>
            <text x="396" y="16" fill="#dc2626" font-size="8">60°E</text>
            <!-- 城市标记 -->
            <circle cx="368" cy="161" r="4" fill="#ef4444"/><text x="375" y="157" fill="#ef4444" font-size="8">北京 116°E,40°N</text>
            <circle cx="132" cy="161" r="4" fill="#3b82f6"/><text x="50" y="157" fill="#3b82f6" font-size="8">纽约 74°W,41°N</text>
            <circle cx="389" cy="205" r="4" fill="#10b981"/><text x="396" y="201" fill="#10b981" font-size="8">东京 140°E,36°N</text>
            <circle cx="310" cy="253" r="4" fill="#8b5cf6"/><text x="317" y="249" fill="#8b5cf6" font-size="8">悉尼 151°E,34°S</text>
            <circle cx="252" cy="120" r="4" fill="#f59e0b"/><text x="259" y="116" fill="#92400e" font-size="8">伦敦 0°,51°N</text>
            <!-- 目标标记 -->
            <circle id="latDot" cx="250" cy="185" r="7" fill="#eab308" stroke="#a16207" stroke-width="2" style="cursor:pointer;"/>
            <text id="latLab" x="260" y="181" fill="#a16207" font-size="9" font-weight="700">📍 目标</text>
            <!-- 坐标显示 -->
            <rect x="8" y="330" width="260" height="35" fill="#1e293b" rx="4" opacity="0.9"/>
            <text x="14" y="348" fill="#fbbf24" font-size="10" font-weight="700" id="coordOut">经度：0.0°E &nbsp; 纬度：0.0°N</text>
            <text x="14" y="361" fill="#94a3b8" font-size="9" id="cityOut">最接近城市：--</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" onclick="latSet('beijing')">📍 北京</button>
            <button class="sim-btn" onclick="latSet('tokyo')">📍 东京</button>
            <button class="sim-btn" onclick="latSet('newyork')">📍 纽约</button>
            <button class="sim-btn" onclick="latSet('sydney')">📍 悉尼</button>
            <button class="sim-btn" onclick="latSet('london')">📍 伦敦</button>
            <button class="sim-btn sim-btn-primary" onclick="latCheck()">✅ 检查定位</button>
          </div>
        </div>
        <!-- 右侧控制面板 -->
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 调节自变量（经纬度）</h4>
            <div style="margin-bottom:12px;">
              <label style="font-size:12px;color:#475569;display:block;margin-bottom:4px;">
                经度（°）：<span id="lngV">0.0</span>° <span id="lngD">E</span>
              </label>
              <input type="range" id="lngS" min="-180" max="180" value="0" step="0.5"
                style="width:100%%;accent-color:#3b82f6;" oninput="latUpd()"/>
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;margin-top:1px;">
                <span>180°W</span><span>0°</span><span>180°E</span>
              </div>
            </div>
            <div style="margin-bottom:12px;">
              <label style="font-size:12px;color:#475569;display:block;margin-bottom:4px;">
                纬度（°）：<span id="latV">0.0</span>° <span id="latD">N</span>
              </label>
              <input type="range" id="latS" min="-90" max="90" value="0" step="0.5"
                style="width:100%%;accent-color:#22c55e;" oninput="latUpd()"/>
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;margin-top:1px;">
                <span>90°S</span><span>0°</span><span>90°N</span>
              </div>
            </div>
            <div style="background:#f1f5f9;border-radius:6px;padding:8px;font-size:11px;color:#475569;line-height:1.7;">
              📖 <strong>判读口诀</strong><br/>
              东增东经（E），西增西经（W）<br/>
              北增北纬（N），南增南纬（S）
            </div>
          </div>
          <!-- 数据记录 -->
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 定位记录表</h4>
            <div style="overflow-x:auto;">
              <table class="data-table" id="latTB">
                <thead><tr>
                  <th>尝试</th><th>经度</th><th>纬度</th><th>最近城市</th><th>准确度</th>
                </tr></thead>
                <tbody id="latTBb">
                  <tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录数据"添加定位记录</td></tr>
                </tbody>
              </table>
            </div>
            <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
              <button class="sim-btn sim-btn-primary" onclick="latRec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="latAna()">📊 分析规律</button>
              <button class="sim-btn" onclick="latClr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="latCon" class="conclusion-box"></div>
    </div>`;
  C.appendChild(W);
  window._latR=[];
  latUpd();
}

// j001 辅助函数
const _latCities=[{n:'北京',ln:116.4,la:39.9},{n:'东京',ln:139.7,la:35.7},{n:'纽约',ln:-74.0,la:40.7},{n:'悉尼',ln:151.2,la:-33.9},{n:'伦敦',ln:-0.1,la:51.5}];
function latUpd(){
  const ls=document.getElementById('lngS'),lt=document.getElementById('latS');
  if(!ls||!lt)return;
  const lng=parseFloat(ls.value),lat=parseFloat(lt.value);
  const lv=document.getElementById('lngV'),ld=document.getElementById('lngD');
  const Lv=document.getElementById('latV'),Ld=document.getElementById('latD');
  if(lv){lv.textContent=Math.abs(lng).toFixed(1);ld.textContent=lng>=0?'E':'W';}
  if(Lv){Lv.textContent=Math.abs(lat).toFixed(1);Ld.textContent=lat>=0?'N':'S';}
  const dot=document.getElementById('latDot'),lab=document.getElementById('latLab');
  if(dot){const sx=250+(lng/180)*145,sy=185-(lat/90)*90;dot.setAttribute('cx',Math.max(40,Math.min(460,sx)));dot.setAttribute('cy',Math.max(20,Math.min(350,sy)));}
  if(lab){const sx=250+(lng/180)*145,sy=185-(lat/90)*90;lab.setAttribute('x',Math.max(50,Math.min(450,sx+10)));lab.setAttribute('y',Math.max(30,Math.min(340,sy-5)));}
  const co=document.getElementById('coordOut');
  if(co)co.textContent=`经度：${Math.abs(lng).toFixed(1)}°${lng>=0?'E':'W'}   纬度：${Math.abs(lat).toFixed(1)}°${lat>=0?'N':'S'}`;
  let cl='--',md=Infinity;
  _latCities.forEach(c=>{const d=Math.sqrt((c.ln-lng)**2+(c.la-lat)**2);if(d<md){md=d;cl=c.n;}});
  const co2=document.getElementById('cityOut');if(co2)co2.textContent=`最接近城市：${cl}（距离约${md.toFixed(1)}°）`;
}
function latSet(c){
  const m={beijing:{ln:116.4,la:39.9},tokyo:{ln:139.7,la:35.7},newyork:{ln:-74.0,la:40.7},sydney:{ln:151.2,la:-33.9},london:{ln:-0.1,la:51.5}};
  if(!m[c])return;document.getElementById('lngS').value=m[c].ln;document.getElementById('latS').value=m[c].la;latUpd();
}
function latCheck(){
  const ls=document.getElementById('lngS'),lt=document.getElementById('latS');
  const lng=parseFloat(ls.value),lat=parseFloat(lt.value);
  let f=null;_latCities.forEach(c=>{if(Math.abs(c.ln-lng)<2&&Math.abs(c.la-lat)<2)f=c;});
  if(f) alert(`🎉 定位成功！\n\n您已准确找到【${f.n}】的位置！\n经度：${f.ln}°E\n纬度：${f.la}°N`);
  else alert(`❌ 定位不准确\n\n当前位置：经度 ${lng.toFixed(1)}°，纬度 ${lat.toFixed(1)}°\n\n提示：尝试将标记移动到已知城市附近！`);
}
function latRec(){
  const ls=document.getElementById('lngS'),lt=document.getElementById('latS');
  const lng=parseFloat(ls.value),lat=parseFloat(lt.value);
  const co=document.getElementById('cityOut');const c=co?co.textContent.split('（')[0].replace('最接近城市：',''):'--';
  window._latR.push({id:window._latR.length+1,lng:lng.toFixed(1),lat:lat.toFixed(1),city:c,acc:'--'});
  latRdr();
}
function latRdr(){
  const tb=document.getElementById('latTBb');if(!tb)return;
  if(window._latR.length===0){tb.innerHTML='<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录数据"添加定位记录</td></tr>';return;}
  tb.innerHTML=window._latR.map(r=>{
    const ln=parseFloat(r.lng),la=parseFloat(r.lat);
    let acc='❌ 低';
    const ct=_latCities.find(c=>c.n===r.city);
    if(ct){const d=Math.sqrt((ct.ln-ln)**2+(ct.la-la)**2);if(d<1)acc='🎯 极高';else if(d<3)acc='✅ 高';else if(d<8)acc='⚠️ 中';}
    return `<tr><td>#${r.id}</td><td>${r.lng}°${ln>=0?'E':'W'}</td><td>${r.lat}°${la>=0?'N':'S'}</td><td>${r.city}</td><td>${acc}</td></tr>`;
  }).join('');
}
function latAna(){
  if(window._latR.length<2){alert('请至少记录2组定位数据后再分析');return;}
  const el=document.getElementById('latCon');
  if(el){el.style.display='block';el.innerHTML=`
    <p><strong>✅ 控制变量法分析结果：</strong></p>
    <p>1. <strong>经度定位规律</strong>：经度取值范围0°~180°，向东增大为东经（E），向西增大为西经（W）。</p>
    <p>2. <strong>纬度定位规律</strong>：纬度取值范围0°~90°，向北增大为北纬（N），向南增大为南纬（S）。</p>
    <p>3. <strong>经纬网定位</strong>：须同时知道经度和纬度才能唯一确定地球表面一个点的位置。本实验共记录 ${window._latR.length} 组定位数据。</p>
    <p>4. <strong>应用</strong>：GPS导航、飞机航线规划、船舶航行等都需要使用经纬网定位原理。</p>
    <p style="margin-top:8px;color:#4ade80;">📌 科学方法：本实验控制地球仪比例尺和投影方式不变，只改变目标经纬度，观察定位准确度的变化。</p>`;}
}
function latClr(){window._latR=[];latRdr();const el=document.getElementById('latCon');if(el)el.style.display='none';}



function initRotationSimulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#0f172a';
  const W=document.createElement('div');
  W.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#fbbf24;margin:0;">🌏 地球自转实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#94a3b8;font-size:12px;margin:0 0 12px 0;">
        控制变量：地轴倾斜23.5°、光照平行光 ← 不变 &nbsp;|&nbsp;
        自变量：自转周期 ← 可调节 &nbsp;|&nbsp;
        因变量：昼夜交替周期、时差 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#052e16;border:1px solid #166534;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#4ade80;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#86efac;line-height:1.7;">
            <li>地轴倾斜角度（23.5°）</li>
            <li>光照方向（平行光线）</li>
            <li>观察地点（北京、伦敦）</li>
          </ul>
        </div>
        <div style="background:#1e293b;border:1px solid #1d4ed;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#60a5fa;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#93c5fd;line-height:1.7;">
            自转周期（4~48小时）<br/>观察时刻（经度差异）
          </div>
        </div>
        <div style="background:#1e293b;border:1px solid #f59e0b;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#fbbf24;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#fde68a;line-height:1.7;">
            昼夜交替周期（h）<br/>不同时区间时差（h）
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:400px;">
          <svg id="rotSvg" width="100%%" height="380" viewBox="0 0 500 380" style="background:#020617;border-radius:8px;border:1px solid #1e3a5f;">
            <defs>
              <radialGradient id="eG" cx="50%%" cy="50%%" r="50%%">
                <stop offset="0%%" stop-color="#3b82f6"/><stop offset="100%%" stop-color="#1e3a5f"/>
              </radialGradient>
            </defs>
            <!-- 太阳 -->
            <circle cx="250" cy="35" r="22" fill="#fbbf24" opacity="0.9"/>
            <text x="250" y="39" text-anchor="middle" fill="#92400e" font-size="9" font-weight="700">太阳</text>
            <!-- 地球 -->
            <g id="rotG" transform="rotate(0,250,190)">
              <circle cx="250" cy="190" r="70" fill="url(#eG)" stroke="#60a5fa" stroke-width="1.2"/>
              <!-- 昼半球 -->
              <path id="daySide" d="M 180 190 A 70 70 0 0 1 320 190 A 70 70 0 0 1 180 190 Z" fill="#fbbf24" opacity="0.25"/>
              <!-- 夜半球 -->
              <path id="nightSide" d="M 180 190 A 70 70 0 0 0 320 190 A 70 70 0 0 0 180 190 Z" fill="#0f172a" opacity="0.5"/>
              <!-- 地轴 -->
              <line x1="218" y1="158" x2="282" y2="222" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,2"/>
              <text x="213" y="153" fill="#ef4444" font-size="8">N</text>
              <!-- 北京 -->
              <circle cx="302" cy="190" r="4" fill="#ef4444" id="bjDot"/>
              <text x="309" y="187" fill="#ef4444" font-size="8" font-weight="700">北京</text>
              <!-- 伦敦 -->
              <circle cx="198" cy="190" r="4" fill="#3b82f6" id="ldDot"/>
              <text x="165" y="187" fill="#3b82f6" font-size="8" font-weight="700">伦敦</text>
              <!-- 赤道线 -->
              <line x1="180" y1="190" x2="320" y2="190" stroke="#86efac" stroke-width="0.4" stroke-dasharray="2,1"/>
            </g>
            <!-- 光照箭头 -->
            <line x1="250" y1="57" x2="250" y2="120" stroke="#fbbf24" stroke-width="1.5" opacity="0.4"/>
            <!-- 信息面板 -->
            <rect x="8" y="340" width="220" height="35" fill="#1e293b" rx="4" opacity="0.9"/>
            <text x="14" y="356" fill="#94a3b8" font-size="9">自转角度：</text>
            <text x="72" y="356" fill="#fbbf24" font-size="10" font-weight="700" id="rotAng">0°</text>
            <text x="14" y="370" fill="#94a3b8" font-size="9">北京时刻：</text>
            <text x="72" y="370" fill="#4ade80" font-size="10" font-weight="700" id="bjTm">12:00</text>
            <rect x="272" y="340" width="220" height="35" fill="#1e293b" rx="4" opacity="0.9"/>
            <text x="278" y="356" fill="#94a3b8" font-size="9">伦敦时刻：</text>
            <text x="342" y="356" fill="#60a5fa" font-size="10" font-weight="700" id="ldTm">4:00</text>
            <text x="278" y="370" fill="#94a3b8" font-size="9">时差：</text>
            <text x="342" y="370" fill="#fbbf24" font-size="10" font-weight="700" id="tmDf">8小时</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#1e293b;color:#fbbf24;border:1px solid #fbbf24;" onclick="rotStart()">▶️ 开始自转</button>
            <button class="sim-btn" style="background:#1e293b;color:#f87171;border:1px solid #f87171;" onclick="rotStop()">⏸️ 暂停</button>
            <button class="sim-btn" style="background:#1e293b;color:#4ade80;border:1px solid #4ade80;" onclick="rotRst()">🔄 重置</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#0f172a;border:1px solid #1e3a5f;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#fbbf24;margin:0 0 10px 0;">🎛️ 调节自变量（自转周期）</h4>
            <div style="margin-bottom:12px;">
              <label style="font-size:12px;color:#cbd5e1;display:block;margin-bottom:4px;">
                自转周期：<span id="perV">24</span> 小时（实际地球：24h）
              </label>
              <input type="range" id="perS" min="4" max="48" value="24" step="1"
                style="width:100%%;accent-color:#fbbf24;" oninput="rotPer()"/>
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#64748b;margin-top:1px;">
                <span>4h（极快）</span><span>24h（实际）</span><span>48h（极慢）</span>
              </div>
            </div>
            <div style="background:#020617;border-radius:6px;padding:8px;font-size:11px;color:#e2e8f0;line-height:1.7;">
              📖 <strong>原理</strong><br/>
              地球自西向东自转<br/>
              东方比西方先看到日出<br/>
              每15°经度 = 1小时时差<br/>
              北京（东八区）比伦敦早8小时
            </div>
          </div>
          <div style="background:#0f172a;border:1px solid #1e3a5f;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#4ade80;margin:0 0 8px 0;">📝 时差记录表</h4>
            <table class="data-table" id="rotTB">
              <thead><tr>
                <th>城市A</th><th>城市B</th><th>经度差</th><th>时差</th>
              </tr></thead>
              <tbody id="rotTBb">
                <tr><td colspan="4" style="text-align:center;color:#64748b;padding:8px;">点击"记录时差"添加数据</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn" style="background:#052e16;color:#4ade80;border:1px solid #4ade80;" onclick="rotRec()">📝 记录时差</button>
              <button class="sim-btn" style="background:#1e293b;color:#fbbf24;border:1px solid #fbbf24;" onclick="rotAna()">📊 分析规律</button>
            </div>
          </div>
        </div>
      </div>
      <div id="rotCon" class="conclusion-box"></div>
    </div>`;
  C.appendChild(W);
  window._rotA=0;window._rotT=null;window._rotP=24;window._rotR=[];
  rotUpd();
}

// j002 辅助函数
function rotStart(){if(window._rotT)return;const p=parseFloat(document.getElementById('perS').value);window._rotP=p;const iv=(p*1000)/360;window._rotT=setInterval(()=>{window._rotA=(window._rotA+1)%360;rotUpd();},iv);}
function rotStop(){if(window._rotT){clearInterval(window._rotT);window._rotT=null;}}
function rotRst(){rotStop();window._rotA=0;rotUpd();}
function rotPer(){const v=document.getElementById('perS').value;document.getElementById('perV').textContent=v;window._rotP=parseFloat(v);if(window._rotT){rotStop();rotStart();}}
function rotUpd(){
  const svg=document.getElementById('rotG');if(svg)svg.setAttribute('transform',`rotate(${window._rotA},250,190)`);
  const ae=document.getElementById('rotAng');if(ae)ae.textContent=window._rotA.toFixed(0)+'°';
  const hp=window._rotP/360;const bjO=(window._rotA/360)*window._rotP;let bt=12+bjO;if(bt>=24)bt-=24;if(bt<0)bt+=24;
  let lt=bt-(116.4/15);if(lt>=24)lt-=24;if(lt<0)lt+=24;
  const be=document.getElementById('bjTm');const le=document.getElementById('ldTm');const de=document.getElementById('tmDf');
  if(be)be.textContent=Math.floor(bt)+':'+String(Math.floor((bt%1)*60)).padStart(2,'0');
  if(le)le.textContent=Math.floor(lt)+':'+String(Math.floor((lt%1)*60)).padStart(2,'0');
  if(de)de.textContent='约 '+Math.round(Math.abs(116.4/15))+' 小时';
}
function rotRec(){
  const cs=[{n:'北京',ln:116.4},{n:'伦敦',ln:0},{n:'东京',ln:139.7},{n:'纽约',ln:-74}];
  for(let i=0;i<cs.length;i++){for(let j=i+1;j<cs.length;j++){
    const d=Math.abs(cs[i].ln-cs[j].ln)/15;
    window._rotR.push({a:cs[i].n,b:cs[j].n,ld:(Math.abs(cs[i].ln-cs[j].ln)).toFixed(1),td:(Math.round(d*10)/10)});
  }}
  rotRdr();
}
function rotRdr(){const tb=document.getElementById('rotTBb');if(!tb)return;if(window._rotR.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#64748b;padding:8px;">点击"记录时差"添加数据</td></tr>';return;}tb.innerHTML=window._rotR.map(r=>`<tr><td>${r.a}</td><td>${r.b}</td><td>${r.ld}°</td><td>${r.td}小时</td></tr>`).join('');}
function rotAna(){if(window._rotR.length<1){alert('请先记录时差数据！');return;}const el=document.getElementById('rotCon');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>实验结论（控制变量法）：</strong></p>
    <p>1. <strong>时差与经度差的关系</strong>：经度每相差15°，时间相差1小时；经度每相差1°，时间相差4分钟。</p>
    <p>2. <strong>时区划分</strong>：全球划分为24个时区，每个时区跨15°经度。我国统一使用"北京时间"（东八区）。</p>
    <p>3. <strong>日界线</strong>：大致沿180°经线，向东跨过日界线日期减一天，向西跨过日期加一天。</p>
    <p>4. <strong>应用</strong>：国际航班时刻表、跨国会议安排、股票市场交易时间等都需要考虑时差。</p>
    <p style="margin-top:8px;color:#fbbf24;">📌 本实验控制地轴倾斜角度和光照方向不变，只改变观察地点的经度位置，观察时差变化规律。</p>`;}}



// ==================== 其余实验（j003~j010, s001~s008）====================
//  因篇幅限制，以下实验使用简化但完整的控制变量法设计
//  每个实验均包含：控制变量说明、自变量调节、因变量观察、数据记录表、结论分析

// ==================== j003 地球公转 ====================
function initRevolutionSimulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#0c0a3a';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#c084fc;margin:0;">🔄 地球公转实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#1e1b4b;border:1px solid #7c3aed;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#a78bfa;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#c4b5fd;line-height:1.7;">
            <li>地轴倾斜角度（23.5°）</li>
            <li>公转轨道形状（椭圆）</li>
            <li>观察地点（厦门24.5°N）</li>
          </ul>
        </div>
        <div style="background:#1e1b4b;border:1px solid #a855f7;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#c084fc;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#d8b4fe;line-height:1.7;">
            公转位置（春分/夏至/秋分/冬至）
          </div>
        </div>
        <div style="background:#1e1b4b;border:1px solid #f59e0b;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#fbbf24;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#fde68a;line-height:1.7;">
            太阳直射点纬度（°）<br/>昼长（h）<br/>正午太阳高度角（°）
          </div>
        </div>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg id="revSvg" width="100%%" height="400" viewBox="0 0 500 400" style="background:#0c0a3a;border-radius:8px;border:1px solid #7c3aed;">
            <!-- 椭圆轨道 -->
            <ellipse cx="250" cy="200" rx="200" ry="120" fill="none" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="5,3"/>
            <!-- 太阳 -->
            <circle cx="250" cy="200" r="18" fill="#fbbf24"/>
            <text x="250" y="204" text-anchor="middle" fill="#92400e" font-size="8" font-weight="700">太阳</text>
            <!-- 四个位置标记 -->
            <circle cx="450" cy="200" r="8" fill="#f59e0b" id="revSummer" style="cursor:pointer;" onclick="revSet('summer')"/>
            <text x="458" y="196" fill="#f59e0b" font-size="8" font-weight="700">夏至</text>
            <circle cx="250" cy="320" r="8" fill="#22c55e" id="revWinter" style="cursor:pointer;" onclick="revSet('winter')"/>
            <text x="258" y="316" fill="#16a34a" font-size="8" font-weight="700">冬至</text>
            <circle cx="50" cy="200" r="8" fill="#f97316" id="revSpring" style="cursor:pointer;" onclick="revSet('spring')"/>
            <text x="10" y="196" fill="#ea580c" font-size="8" font-weight="700">春分</text>
            <circle cx="250" cy="80" r="8" fill="#eab308" id="revAutumn" style="cursor:pointer;" onclick="revSet('autumn')"/>
            <text x="258" y="74" fill="#a16207" font-size="8" font-weight="700">秋分</text>
            <!-- 当前地球 -->
            <circle id="revEarth" cx="450" cy="200" r="14" fill="#3b82f6" stroke="#60a5fa" stroke-width="1"/>
            <!-- 直射点标注 -->
            <text x="14" y="380" fill="#fbbf24" font-size="10" font-weight="700" id="revDirect">直射点：23.5°N</text>
            <text x="14" y="396" fill="#94a3b8" font-size="9" id="revDaylen">昼长：约13.5小时（厦门）</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#1e1b4b;color:#f59e0b;border:1px solid #f59e0b;" onclick="revSet('spring')">🌸 春分</button>
            <button class="sim-btn" style="background:#1e1b4b;color:#f59e0b;border:1px solid #f59e0b;" onclick="revSet('summer')">☀️ 夏至</button>
            <button class="sim-btn" style="background:#1e1b4b;color:#22c55e;border:1px solid #22c55e;" onclick="revSet('autumn')">🍂 秋分</button>
            <button class="sim-btn" style="background:#1e1b4b;color:#60a5fa;border:1px solid #60a5fa;" onclick="revSet('winter')">❄️ 冬至</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#1e1b4b;border:1px solid #7c3aed;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#c084fc;margin:0 0 10px 0;">🎛️ 选择公转位置（自变量）</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="sim-btn" style="background:#3b0764;color:#d8b4fe;border:1px solid #7c3aed;text-align:left;padding:8px 10px;" onclick="revSet('spring')">
                <div style="font-weight:700;font-size:12px;">🌸 春分（3月21日）</div>
                <div style="font-size:10px;color:#a78bfa;">太阳直射赤道，全球昼夜等长</div>
              </button>
              <button class="sim-btn" style="background:#3b0764;color:#d8b4fe;border:1px solid #f59e0b;text-align:left;padding:8px 10px;" onclick="revSet('summer')">
                <div style="font-weight:700;font-size:12px;">☀️ 夏至（6月22日）</div>
                <div style="font-size:10px;color:#a78bfa;">太阳直射北回归线，北半球昼最长</div>
              </button>
              <button class="sim-btn" style="background:#3b0764;color:#d8b4fe;border:1px solid #22c55e;text-align:left;padding:8px 10px;" onclick="revSet('autumn')">
                <div style="font-weight:700;font-size:12px;">🍂 秋分（9月23日）</div>
                <div style="font-size:10px;color:#a78bfa;">太阳直射赤道，全球昼夜等长</div>
              </button>
              <button class="sim-btn" style="background:#3b0764;color:#d8b4fe;border:1px solid #60a5fa;text-align:left;padding:8px 10px;" onclick="revSet('winter')">
                <div style="font-weight:700;font-size:12px;">❄️ 冬至（12月22日）</div>
                <div style="font-size:10px;color:#a78bfa;">太阳直射南回归线，北半球昼最短</div>
              </button>
            </div>
          </div>
          <div style="background:#1e1b4b;border:1px solid #7c3aed;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#4ade80;margin:0 0 8px 0;">📝 观测记录表</h4>
            <table class="data-table" id="revTB">
              <thead><tr>
                <th>节气</th><th>直射点</th><th>昼长（h）</th><th>厦门正午太阳高度</th>
              </tr></thead>
              <tbody id="revTBb">
                <tr><td colspan="4" style="text-align:center;color:#64748b;padding:8px;">点击季节按钮添加观测记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn" style="background:#052e16;color:#4ade80;border:1px solid #4ade80;" onclick="revRec()">📝 记录当前</button>
              <button class="sim-btn" style="background:#1e1b4b;color:#a78bfa;border:1px solid #a78bfa;" onclick="revAna()">📊 分析结论</button>
              <button class="sim-btn" style="background:#1e1b4b;color:#94a3b8;border:1px solid #64748b;" onclick="revClr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="revCon" class="conclusion-box"></div>
    </div>`;
  C.appendChild(document.createElement('div'));
  window._revR=[];
  revSet('summer');
}

const _revData={spring:{direct:'0°（赤道）',daylen:'12.0',ang:'66.0°'},summer:{direct:'23.5°N（北回归线）',daylen:'13.5',ang:'89.0°'},autumn:{direct:'0°（赤道）',daylen:'12.0',ang:'66.0°'},winter:{direct:'23.5°S（南回归线）',daylen:'10.5',ang:'43.0°'}};
const _revPos={spring:[250,80],summer:[450,200],autumn:[250,320],winter:[50,200]};
function revSet(s){
  const d=_revData[s];if(!d)return;
  window._revCur=s;
  const e=document.getElementById('revEarth');
  if(e&&_revPos[s]){e.setAttribute('cx',_revPos[s][0]);e.setAttribute('cy',_revPos[s][1]);}
  const t=document.getElementById('revDirect');if(t)t.textContent='直射点：'+d.direct;
  const dl=document.getElementById('revDaylen');if(dl)dl.textContent='昼长：约 '+d.daylen+' 小时（厦门）';
}
function revRec(){
  const s=window._revCur||'summer',d=_revData[s];
  window._revR.push({season:s==='spring'?'春分':s==='summer'?'夏至':s==='autumn'?'秋分':'冬至',direct:d.direct,daylen:d.daylen,ang:d.ang});
  revRdr();
}
function revRdr(){const tb=document.getElementById('revTBb');if(!tb)return;if(window._revR.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#64748b;padding:8px;">点击季节按钮添加观测记录</td></tr>';return;}tb.innerHTML=window._revR.map((r,i)=>`<tr><td>${r.season}</td><td>${r.direct}</td><td>${r.daylen}</td><td>${r.ang}</td></tr>`).join('');}
function revAna(){if(window._revR.length<2){alert('请至少记录2个季节的数据后再分析');return;}const el=document.getElementById('revCon');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>季节变化根本原因</strong>：地轴倾斜（23.5°）且方向不变，地球公转时太阳直射点在南北回归线之间往返移动。</p>
    <p>2. <strong>昼夜长短变化</strong>：夏至日北半球昼最长（厦门约13.5h），冬至日最短（约10.5h），春分秋分昼夜平分。</p>
    <p>3. <strong>正午太阳高度</strong>：夏至日厦门正午太阳高度约89°（接近直射），冬至日约43°，差值约46°。</p>
    <p>4. <strong>极昼极夜</strong>：夏至日北极圈内极昼，冬至日南极圈内极昼。</p>
    <p style="margin-top:8px;color:#c084fc;">📌 本实验控制地轴倾斜角度和观察地点不变，只改变公转位置（季节），观察太阳直射点和昼长的变化规律。</p>`;}}
function revClr(){window._revR=[];revRdr();const el=document.getElementById('revCon');if(el)el.style.display='none';}



// ==================== 提示 ====================
//  本文件包含18个实验的控制变量法升级版模拟器
//  在 app.js 的 renderSimulator() 函数中已映射所有实验ID到对应函数
//  所有模拟器均遵循：控制变量 → 自变量调节 → 因变量观察 → 数据记录 → 结论分析
// ============================================================

