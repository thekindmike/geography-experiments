// ============================================================
//  地理实验平台 - 附加实验（j004-j010, s001-s008）
//  控制变量法升级版
//  使用方法：在 index.html 中加载此文件（在 simulators-controlled.js 之后）
// ============================================================

// ==================== j004 等高线地形图判读实验 ====================
function initJ004Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f0fdf4';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#22c55e;margin:0;">⛰️ 等高线地形图判读实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：等高距（5米）、地图比例尺（1:10000） ← 不变 &nbsp;|&nbsp;
        自变量：地形部位选择 ← 可调节 &nbsp;|&nbsp;
        因变量：等高线形状、高程数值 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#166534;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#15803d;line-height:1.7;">
            <li>等高距（5米）</li>
            <li>地图比例尺（1:10000）</li>
            <li>基准海平面</li>
          </ul>
        </div>
        <div style="background:#f8fafc;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">地形部位选择（山顶/山脊/山谷/鞍部/陡崖）</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">等高线形状、高程数值（m）、坡度陡缓</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="320" viewBox="0 0 500 320" style="background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
            <text x="250" y="25" text-anchor="middle" fill="#166534" font-size="13" font-weight="700">等高线地形部位判读</text>
            <!-- 山顶 -->
            <circle cx="100" cy="160" r="35" fill="none" stroke="#ef4444" stroke-width="2"/>
            <circle cx="100" cy="160" r="25" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2,1"/>
            <circle cx="100" cy="160" r="15" fill="none" stroke="#ef4444" stroke-width="1.2"/>
            <text x="100" y="130" text-anchor="middle" fill="#ef4444" font-size="9" font-weight="700" style="cursor:pointer;" onclick="j004Select('山顶')">山顶 500m</text>
            <!-- 山脊 -->
            <path d="M 180 130 Q 250 100 320 140" stroke="#f59e0b" stroke-width="2.5" fill="none"/>
            <path d="M 180 140 Q 250 110 320 150" stroke="#f59e0b" stroke-width="1.8" fill="none" stroke-dasharray="2,1"/>
            <text x="250" y="90" text-anchor="middle" fill="#f59e0b" font-size="9" font-weight="700" style="cursor:pointer;" onclick="j004Select('山脊')">山脊 350m</text>
            <!-- 山谷 -->
            <path d="M 180 190 Q 250 220 320 200" stroke="#3b82f6" stroke-width="2.5" fill="none"/>
            <path d="M 180 200 Q 250 230 320 210" stroke="#3b82f6" stroke-width="1.8" fill="none" stroke-dasharray="2,1"/>
            <text x="250" y="250" text-anchor="middle" fill="#3b82f6" font-size="9" font-weight="700" style="cursor:pointer;" onclick="j004Select('山谷')">山谷 250m</text>
            <!-- 鞍部 -->
            <ellipse cx="400" cy="160" rx="30" ry="18" fill="none" stroke="#a855f7" stroke-width="2"/>
            <ellipse cx="400" cy="160" rx="22" ry="12" fill="none" stroke="#a855f7" stroke-width="1.5"/>
            <text x="400" y="135" text-anchor="middle" fill="#a855f7" font-size="9" font-weight="700" style="cursor:pointer;" onclick="j004Select('鞍部')">鞍部 380m</text>
            <!-- 陡崖 -->
            <line x1="60" y1="260" x2="60" y2="240" stroke="#6b7280" stroke-width="3"/>
            <line x1="65" y1="265" x2="65" y2="235" stroke="#6b7280" stroke-width="3"/>
            <line x1="70" y1="260" x2="70" y2="240" stroke="#6b7280" stroke-width="3"/>
            <text x="80" y="252" fill="#6b7280" font-size="9" font-weight="700" style="cursor:pointer;" onclick="j004Select('陡崖')">陡崖 420m</text>
            <text x="250" y="300" text-anchor="middle" fill="#166534" font-size="10">💡 点击地形部位名称查看等高线特征</text>
          </svg>
          <div id="j004Info" style="margin-top:10px;padding:10px;background:#f0fdf4;border-radius:6px;font-size:12px;color:#166534;line-height:1.7;">
            点击上方地形部位查看等高线特征
          </div>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn sim-btn-primary" onclick="j004Rec()">📝 记录当前数据</button>
            <button class="sim-btn" onclick="j004Reset()">🔄 重置</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 选择地形部位（自变量）</h4>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              <button class="sim-btn" style="background:#fef2f2;color:#dc2626;" onclick="j004Select('山顶')">山顶</button>
              <button class="sim-btn" style="background:#fffbeb;color:#d97706;" onclick="j004Select('山脊')">山脊</button>
              <button class="sim-btn" style="background:#eff6ff;color:#2563eb;" onclick="j004Select('山谷')">山谷</button>
              <button class="sim-btn" style="background:#faf5ff;color:#9333ea;" onclick="j004Select('鞍部')">鞍部</button>
              <button class="sim-btn" style="background:#f9fafb;color:#4b5563;" onclick="j004Select('陡崖')">陡崖</button>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 判读记录表</h4>
            <table class="data-table" id="j004TB">
              <thead><tr><th>序号</th><th>地形部位</th><th>等高线形状</th><th>高程（m）</th></tr></thead>
              <tbody id="j004TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录当前数据"添加</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="j004Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="j004Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="j004Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="j004Con" class="conclusion-box"></div>
    </div>`;
}

const _j004Data={
  山顶:{shape:'闭合圆圈，外低内高',h:'500',rule:'高程内高外低，闭合曲线'},
  山脊:{shape:'凸向低处（像低处的手指）',h:'350',rule:'等高线凸向低处为山脊'},
  山谷:{shape:'凸向高处（像高处的手指）',h:'250',rule:'等高线凸向高处为山谷（凸高为谷）'},
  鞍部:{shape:'8字形，两个山顶之间',h:'380',rule:'鞍部是两个山顶之间的低洼部位'},
  陡崖:{shape:'等高线重合或非常密集',h:'420',rule:'坡度极陡（>45°），多条等高线重合'}
};

function j004Select(name){
  window._j004Cur=name;
  const info=document.getElementById('j004Info');
  const d=_j004Data[name];
  if(info&&d) info.innerHTML=`<strong>${name}</strong>：等高线形状为「${d.shape}」，高程约${d.h}m。<br/>判读口诀：${d.rule}`;
}
function j004Rec(){
  const name=window._j004Cur||'未选择';
  const d=_j004Data[name];
  window._j004R=window._j004R||[];
  window._j004R.push({id:window._j004R.length+1,name:name,shape:d?d.shape:'--',h:d?d.h:'--'});
  j004Rdr();
}
function j004Rdr(){const tb=document.getElementById('j004TBb');if(!tb)return;if(!window._j004R||window._j004R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录当前数据"添加</td></tr>';return;}tb.innerHTML=window._j004R.map(r=>`<tr><td>${r.id}</td><td>${r.name}</td><td>${r.shape}</td><td>${r.h}</td></tr>`).join('');}
function j004Ana(){const el=document.getElementById('j004Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>等高线判读规律</strong>：①山顶——闭合圆圈，外低内高；②山脊——凸向低处；③山谷——凸向高处（凸高为谷）；④鞍部——两个山顶之间；⑤陡崖——等高线重合。</p>
    <p>2. <strong>坡度判断</strong>：等高线越密集，坡度越陡；越稀疏，坡度越缓。</p>
    <p>3. <strong>实际应用</strong>：修建公路选在山脊（坡度较缓）或山谷（水路方向）；水库坝址选在河谷狭窄处（陡崖附近）。</p>
    <p style="margin-top:8px;color:#22c55e;">📌 本实验控制等高距和比例尺不变，只改变观察的地形部位，总结等高线判读规律。</p>`;}}
function j004Reset(){window._j004R=[];j004Rdr();}
function j004Clr(){j004Reset();const el=document.getElementById('j004Con');if(el)el.style.display='none';}

// ==================== j005 气温观测与记录实验 ====================
function initJ005Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#fef2f2';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#ef4444;margin:0;">🌡️ 气温观测与记录实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：观测地点（厦门）、温度计规格 ← 不变 &nbsp;|&nbsp;
        自变量：观测时间 ← 可调节 &nbsp;|&nbsp;
        因变量：气温数值、日较差 ← 观察结果
      </p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="300" viewBox="0 0 500 300" style="background:#fef2f2;border-radius:8px;border:1px solid #fecaca;">
            <text x="250" y="20" text-anchor="middle" fill="#dc2626" font-size="12" font-weight="700">气温日变化曲线（厦门夏季示例）</text>
            <polyline points="60,260 170,250 280,120 390,200" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linejoin="round"/>
            <circle cx="60" cy="260" r="4" fill="#ef4444"/><text x="60" y="280" text-anchor="middle" fill="#dc2626" font-size="9">2:00 24.5°</text>
            <circle cx="170" cy="250" r="4" fill="#ef4444"/><text x="170" y="245" text-anchor="middle" fill="#dc2626" font-size="9">8:00 26.8°</text>
            <circle cx="280" cy="120" r="5" fill="#dc2626"/><text x="280" y="110" text-anchor="middle" fill="#dc2626" font-size="10" font-weight="700">14:00 33.2°</text>
            <circle cx="390" cy="200" r="4" fill="#ef4444"/><text x="390" y="195" text-anchor="middle" fill="#dc2626" font-size="9">20:00 28.1°</text>
            <line x1="60" y1="120" x2="390" y2="120" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,2"/>
            <text x="400" y="124" fill="#94a3b8" font-size="8">最高温</text>
            <line x1="60" y1="260" x2="390" y2="260" stroke="#94a3b8" stroke-width="0.5" stroke-dasharray="3,2"/>
            <text x="400" y="264" fill="#94a3b8" font-size="8">最低温</text>
            <text x="250" y="290" text-anchor="middle" fill="#92400e" font-size="10">💡 最高气温出现在14时，最低气温在日出前后</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn sim-btn-primary" onclick="j005Rec()">📝 记录当前数据</button>
            <button class="sim-btn" onclick="j005Reset()">🔄 重置</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">📝 观测记录表</h4>
            <table class="data-table" id="j005TB">
              <thead><tr><th>序号</th><th>观测时间</th><th>气温（°C）</th><th>日较差（°C）</th></tr></thead>
              <tbody id="j005TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录当前数据"添加</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="j005Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="j005Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="j005Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="j005Con" class="conclusion-box"></div>
    </div>`;
  window._j005R=[];
  j005Rec(); // 自动记录示例数据
}

const _j005Data=[
  {time:'2:00',temp:24.5},
  {time:'8:00',temp:26.8},
  {time:'14:00',temp:33.2},
  {time:'20:00',temp:28.1}
];

function j005Rec(){
  window._j005R=window._j005R||[];
  _j005Data.forEach(d=>{
    window._j005R.push({id:window._j005R.length+1,time:d.time,temp:d.temp,range:(33.2-24.5).toFixed(1)});
  });
  j005Rdr();
}
function j005Rdr(){const tb=document.getElementById('j005TBb');if(!tb)return;if(window._j005R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录当前数据"添加</td></tr>';return;}tb.innerHTML=window._j005R.map(r=>`<tr><td>${r.id}</td><td>${r.time}</td><td>${r.temp}</td><td>${r.range}</td></tr>`).join('');}
function j005Ana(){const el=document.getElementById('j005Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>气温日变化规律</strong>：一天中最高气温出现在14时左右（午后2时），最低气温出现在日出前后。这是因为地面储存热量需要时间。</p>
    <p>2. <strong>气温年变化规律</strong>：北半球陆地最热月为7月，最冷月为1月；海洋最热月为8月，最冷月为2月（滞后约1个月）。</p>
    <p>3. <strong>气温日较差</strong>：厦门夏季气温日较差约8.7°C（33.2-24.5）。沙漠地区日较差更大，海洋地区日较差更小。</p>
    <p style="margin-top:8px;color:#ef4444;">📌 本实验控制观测地点和温度计规格不变，只改变观测时间，观察气温变化规律。</p>`;}}
function j005Reset(){window._j005R=[];j005Rdr();}
function j005Clr(){j005Reset();const el=document.getElementById('j005Con');if(el)el.style.display='none';}

// ==================== j006 降水量观测实验 ====================
function initJ006Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#eff6ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#3b82f6;margin:0;">🌧️ 降水量观测实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：雨量器口径（20cm）、观测地点 ← 不变 &nbsp;|&nbsp;
        自变量：月份（1~12月） ← 可调节 &nbsp;|&nbsp;
        因变量：月降水量、年降水量 ← 观察结果
      </p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="320" viewBox="0 0 500 320" style="background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
            <text x="250" y="20" text-anchor="middle" fill="#1d4ed" font-size="12" font-weight="700">厦门月降水量柱状图（mm）</text>
            <rect x="15" y="200" width="25" height="60" fill="#93c5fd" rx="2"/><text x="27" y="196" text-anchor="middle" fill="#1e40af" font-size="8">45</text>
            <rect x="45" y="185" width="25" height="75" fill="#93c5fd" rx="2"/><text x="57" y="181" text-anchor="middle" fill="#1e40af" font-size="8">68</text>
            <rect x="75" y="162" width="25" height="98" fill="#93c5fd" rx="2"/><text x="87" y="158" text-anchor="middle" fill="#1e40af" font-size="8">95</text>
            <rect x="105" y="140" width="25" height="120" fill="#93c5fd" rx="2"/><text x="117" y="136" text-anchor="middle" fill="#1e40af" font-size="8">128</text>
            <rect x="135" y="95" width="25" height="165" fill="#3b82f6" rx="2"/><text x="147" y="91" text-anchor="middle" fill="#1e40af" font-size="8">185</text>
            <rect x="165" y="40" width="25" height="220" fill="#1d4ed" rx="2"/><text x="177" y="36" text-anchor="middle" fill="#1e40af" font-size="9" font-weight="700">240</text>
            <rect x="195" y="130" width="25" height="130" fill="#60a5fa" rx="2"/><text x="207" y="126" text-anchor="middle" fill="#1e40af" font-size="8">150</text>
            <rect x="225" y="142" width="25" height="118" fill="#60a5fa" rx="2"/><text x="237" y="138" text-anchor="middle" fill="#1e40af" font-size="8">132</text>
            <rect x="255" y="164" width="25" height="96" fill="#93c5fd" rx="2"/><text x="267" y="160" text-anchor="middle" fill="#1e40af" font-size="8">98</text>
            <rect x="285" y="194" width="25" height="66" fill="#93c5fd" rx="2"/><text x="297" y="190" text-anchor="middle" fill="#1e40af" font-size="8">56</text>
            <rect x="315" y="204" width="25" height="56" fill="#93c5fd" rx="2"/><text x="327" y="200" text-anchor="middle" fill="#1e40af" font-size="8">42</text>
            <rect x="345" y="208" width="25" height="52" fill="#93c5fd" rx="2"/><text x="357" y="204" text-anchor="middle" fill="#1e40af" font-size="8">38</text>
            <text x="27" y="290" text-anchor="middle" fill="#64748b" font-size="8">1月</text>
            <text x="87" y="290" text-anchor="middle" fill="#64748b" font-size="8">4月</text>
            <text x="147" y="290" text-anchor="middle" fill="#64748b" font-size="8">7月</text>
            <text x="207" y="290" text-anchor="middle" fill="#64748b" font-size="8">10月</text>
            <text x="357" y="290" text-anchor="middle" fill="#64748b" font-size="8">12月</text>
            <text x="250" y="310" text-anchor="middle" fill="#1d4ed" font-size="10">💡 厦门降水集中在5-9月（雨季），年降水量约1500mm</text>
          </svg>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 降水量记录表</h4>
            <div style="overflow-x:auto;">
              <table class="data-table" id="j006TB">
                <thead><tr><th>月份</th><th>降水量（mm）</th><th>季节</th></tr></thead>
                <tbody id="j006TBb">
                  <tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录数据"添加</td></tr>
                </tbody>
              </table>
            </div>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="j006Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="j006Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="j006Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="j006Con" class="conclusion-box"></div>
    </div>`;
  window._j006R=[];
}

const _j006Months=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
const _j006Values=[45,68,95,128,185,240,150,132,98,56,42,38];

function j006Rec(){
  window._j006R=window._j006R||[];
  for(let i=0;i<12;i++){
    window._j006R.push({month:_j006Months[i],val:_j006Values[i],season:i>=4&&i<=8?'雨季':'旱季'});
  }
  j006Rdr();
}
function j006Rdr(){const tb=document.getElementById('j006TBb');if(!tb)return;if(window._j006R.length===0){tb.innerHTML='<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:8px;">点击"记录数据"添加</td></tr>';return;}tb.innerHTML=window._j006R.map((r,i)=>`<tr><td>${r.month}</td><td>${r.val}</td><td>${r.season}</td></tr>`).join('');}
function j006Ana(){const el=document.getElementById('j006Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>降水季节变化</strong>：厦门属于亚热带季风气候，降水集中在5-9月（雨季），占全年降水量的60%以上；10月-次年4月为旱季，降水较少。</p>
    <p>2. <strong>年降水量</strong>：厦门年降水量约1500mm，属于湿润地区（>800mm/年）。</p>
    <p>3. <strong>降水与农业</strong>：雨季与水热同期，有利于农作物生长；但雨季易发生洪涝，旱季需灌溉。</p>
    <p style="margin-top:8px;color:#3b82f6;">📌 本实验控制雨量器规格和观测地点不变，只改变观测月份，分析降水季节分配规律。</p>`;}}
function j006Clr(){window._j006R=[];j006Rdr();const el=document.getElementById('j006Con');if(el)el.style.display='none';}

// ==================== j007 风向风速观测实验 ====================
function initJ007Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f5f3ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#8b5cf6;margin:0;">💨 风向风速观测实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：观测地点（厦门）、观测高度 ← 不变 &nbsp;|&nbsp;
        自变量：天气状况 ← 可调节 &nbsp;|&nbsp;
        因变量：风向、风速 ← 观察结果
      </p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <div style="padding:20px;text-align:center;">
            <div style="font-size:14px;color:#7c3aed;margin-bottom:16px;font-weight:700;">风向风速观测模拟</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">
              <div style="padding:12px;background:#ede9fe;border:1px solid #c4b5fd;border-radius:8px;cursor:pointer;" onclick="j007Select('晴天')">
                <div style="font-weight:700;color:#6d28d9;margin-bottom:6px;">☀️ 晴天</div>
                <div style="font-size:12px;color:#7c3aed;">东南风 3级</div>
                <div style="font-size:10px;color:#a78bfa;margin-top:4px;">波形微起</div>
              </div>
              <div style="padding:12px;background:#ede9fe;border:1px solid #c4b5fd;border-radius:8px;cursor:pointer;" onclick="j007Select('阴天')">
                <div style="font-weight:700;color:#6d28d9;margin-bottom:6px;">☁️ 阴天</div>
                <div style="font-size:12px;color:#7c3aed;">东风 4级</div>
                <div style="font-size:10px;color:#a78bfa;margin-top:4px;">树枝摇晃</div>
              </div>
              <div style="padding:12px;background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;cursor:pointer;" onclick="j007Select('台风')">
                <div style="font-weight:700;color:#dc2626;margin-bottom:6px;">🌀 台风</div>
                <div style="font-size:12px;color:#ef4444;">东北风 10级</div>
                <div style="font-size:10px;color:#f87171;margin-top:4px;">树木拔起！</div>
              </div>
            </div>
            <div id="j007Info" style="padding:12px;background:#f5f3ff;border-radius:6px;font-size:12px;color:#6d28d9;text-align:left;line-height:1.7;">
              选择天气状况查看风向风速特征
            </div>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 风向风速记录表</h4>
            <table class="data-table" id="j007TB">
              <thead><tr><th>天气</th><th>风向</th><th>风速（级）</th><th>蒲福风级描述</th></tr></thead>
              <tbody id="j007TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击左侧天气卡片添加记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="j007Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="j007Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="j007Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="j007Con" class="conclusion-box"></div>
    </div>`;
  window._j007R=[];
}

const _j007Data=[
  {cond:'晴天',wind:'SE',speed:3,desc:'东南风3级，波形微起'},
  {cond:'阴天',wind:'E',speed:4,desc:'东风4级，树枝摇晃'},
  {cond:'台风',wind:'NE',speed:10,desc:'东北风10级，树木拔起！'}
];

function j007Select(cond){
  window._j007Cur=cond;
  const info=document.getElementById('j007Info');
  const d=_j007Data.find(x=>x.cond===cond);
  if(info&&d) info.innerHTML=`<strong>${cond}</strong>：<br/>风向：${d.wind}（${d.wind==='SE'?'东南风':d.wind==='E'?'东风':'东北风'}）<br/>风速：${d.speed}级<br/>描述：${d.desc}`;
}
function j007Rec(){
  window._j007R=window._j007R||[];
  _j007Data.forEach(d=>{
    window._j007R.push({id:window._j007R.length+1,cond:d.cond,wind:d.wind,speed:d.speed,desc:d.desc});
  });
  j007Rdr();
}
function j007Rdr(){const tb=document.getElementById('j007TBb');if(!tb)return;if(window._j007R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击左侧天气卡片添加记录</td></tr>';return;}tb.innerHTML=window._j007R.map(r=>`<tr><td>${r.cond}</td><td>${r.wind}</td><td>${r.speed}</td><td>${r.desc}</td></tr>`).join('');}
function j007Ana(){const el=document.getElementById('j007Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>风向表示法</strong>：风向指风的<strong>来向</strong>而非去向。例如"东南风"表示风从东南方向吹来，向西北方向吹去。</p>
    <p>2. <strong>厦门主导风向</strong>：厦门属于季风气候，夏季主导风向为东南风（从海洋吹向陆地），冬季主导风向为东北风。</p>
    <p>3. <strong>蒲福风级</strong>：0级烟直上，1级烟稍斜，2级树叶响，3级旗飘动... 台风（10级以上）风力极强，需停课停工。</p>
    <p style="margin-top:8px;color:#8b5cf6;">📌 本实验控制观测地点和高度不变，只改变天气状况，观察风向风速的变化规律。</p>`;}}
function j007Clr(){window._j007R=[];j007Rdr();const el=document.getElementById('j007Con');if(el)el.style.display='none';}

// ==================== j008 岩石标本观察与识别实验 ====================
function initJ008Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#fefce8';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#92400e;margin:0;">🪨 岩石标本观察与识别实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：观察工具（放大镜/小刀）、测试标准 ← 不变 &nbsp;|&nbsp;
        自变量：岩石类型 ← 可调节 &nbsp;|&nbsp;
        因变量：颜色、结构、硬度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;padding:10px;">
        <div style="padding:12px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;cursor:pointer;text-align:center;" onclick="j008Select('花岗岩')">
          <div style="font-weight:700;color:#92400e;margin-bottom:6px;">花岗岩</div>
          <div style="font-size:11px;color:#92400e;">岩浆岩（侵入岩）</div>
          <div style="margin-top:8px;padding:8px;background:#fffbeb;border-radius:4px;">
            <div style="font-size:10px;color:#92400e;">晶体颗粒结构</div>
            <div style="font-size:10px;color:#16a34a;margin-top:2px;">硬度：7（较硬）</div>
          </div>
        </div>
        <div style="padding:12px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;cursor:pointer;text-align:center;" onclick="j008Select('玄武岩')">
          <div style="font-weight:700;color:#92400e;margin-bottom:6px;">玄武岩</div>
          <div style="font-size:11px;color:#92400e;">岩浆岩（喷出岩）</div>
          <div style="margin-top:8px;padding:8px;background:#fffbeb;border-radius:4px;">
            <div style="font-size:10px;color:#92400e;">气孔构造</div>
            <div style="font-size:10px;color:#16a34a;margin-top:2px;">硬度：6</div>
          </div>
        </div>
        <div style="padding:12px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;cursor:pointer;text-align:center;" onclick="j008Select('砂岩')">
          <div style="font-weight:700;color:#92400e;margin-bottom:6px;">砂岩</div>
          <div style="font-size:11px;color:#92400e;">沉积岩</div>
          <div style="margin-top:8px;padding:8px;background:#fffbeb;border-radius:4px;">
            <div style="font-size:10px;color:#92400e;">砂粒胶结结构</div>
            <div style="font-size:10px;color:#16a34a;margin-top:2px;">硬度：4（较软）</div>
          </div>
        </div>
        <div style="padding:12px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;cursor:pointer;text-align:center;" onclick="j008Select('石灰岩')">
          <div style="font-weight:700;color:#92400e;margin-bottom:6px;">石灰岩</div>
          <div style="font-size:11px;color:#92400e;">沉积岩</div>
          <div style="margin-top:8px;padding:8px;background:#fffbeb;border-radius:4px;">
            <div style="font-size:10px;color:#92400e;">碎屑结构</div>
            <div style="font-size:10px;color:#dc2626;margin-top:2px;">⚡ 稀盐酸起泡！</div>
          </div>
        </div>
        <div style="padding:12px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;cursor:pointer;text-align:center;" onclick="j008Select('大理岩')">
          <div style="font-weight:700;color:#92400e;margin-bottom:6px;">大理岩</div>
          <div style="font-size:11px;color:#92400e;">变质岩</div>
          <div style="margin-top:8px;padding:8px;background:#fffbeb;border-radius:4px;">
            <div style="font-size:10px;color:#92400e;">致密块状结构</div>
            <div style="font-size:10px;color:#dc2626;margin-top:2px;">⚡ 稀盐酸起泡！</div>
          </div>
        </div>
      </div>
      <div id="j008Info" style="margin:10px;padding:12px;background:#fefce8;border-radius:6px;font-size:12px;color:#92400e;line-height:1.7;text-align:left;">
        点击上方岩石标本查看详细特征
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 岩石观察记录表</h4>
            <table class="data-table" id="j008TB">
              <thead><tr><th>岩石</th><th>类型</th><th>颜色</th><th>稀盐酸反应</th></tr></thead>
              <tbody id="j008TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击岩石标本添加观察记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="j008Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="j008Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="j008Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="j008Con" class="conclusion-box"></div>
    </div>`;
  window._j008R=[];
}

const _j008Data=[
  {name:'花岗岩',type:'岩浆岩（侵入岩）',color:'肉红色',texture:'晶体颗粒结构',hard:7,hcl:'无气泡'},
  {name:'玄武岩',type:'岩浆岩（喷出岩）',color:'黑色',texture:'气孔构造',hard:6,hcl:'无气泡'},
  {name:'砂岩',type:'沉积岩',color:'黄褐色',texture:'砂粒胶结',hard:4,hcl:'无气泡'},
  {name:'石灰岩',type:'沉积岩',color:'灰色',texture:'碎屑结构',hard:3,hcl:'⚡ 产生气泡！'},
  {name:'大理岩',type:'变质岩',color:'白色带花纹',texture:'致密块状',hard:3,hcl:'⚡ 产生气泡！'}
];

function j008Select(name){
  window._j008Cur=name;
  const info=document.getElementById('j008Info');
  const r=_j008Data.find(x=>x.name===name);
  if(info&&r) info.innerHTML=`<strong>${r.name}</strong>（${r.type}）<br/>颜色：${r.color} | 结构：${r.texture} | 硬度：${r.hard}<br/>稀盐酸反应：${r.hcl}<br/><br/><strong>💡 识别要点</strong>：岩浆岩有晶体/气孔；沉积岩有层理/化石；变质岩结构致密。石灰岩和大理岩含CaCO₃，遇稀盐酸产生CO₂气泡。`;
}
function j008Rec(){
  window._j008R=window._j008R||[];
  _j008Data.forEach(r=>{
    window._j008R.push({id:window._j008R.length+1,name:r.name,type:r.type,color:r.color,hcl:r.hcl});
  });
  j008Rdr();
}
function j008Rdr(){const tb=document.getElementById('j008TBb');if(!tb)return;if(window._j008R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击岩石标本添加观察记录</td></tr>';return;}tb.innerHTML=window._j008R.map(r=>`<tr><td>${r.name}</td><td>${r.type}</td><td>${r.color}</td><td>${r.hcl}</td></tr>`).join('');}
function j008Ana(){const el=document.getElementById('j008Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>三大类岩石特征</strong>：①岩浆岩——有晶体颗粒或气孔构造；②沉积岩——有层理构造，可能含化石；③变质岩——结构致密，往往有定向排列的矿物。</p>
    <p>2. <strong>石灰岩识别</strong>：滴加稀盐酸产生气泡（CaCO₃+2HCl→CaCl₂+H₂O+CO₂↑）是识别石灰岩和大理岩的重要方法。</p>
    <p>3. <strong>岩石圈物质循环</strong>：岩浆岩→风化侵蚀→沉积岩→变质作用→变质岩→重熔再生→岩浆，这一过程需要漫长地质年代。</p>
    <p style="margin-top:8px;color:#92400e;">📌 本实验控制观察工具和测试标准不变，只改变岩石类型，观察不同岩石的特征差异。</p>`;}}
function j008Clr(){window._j008R=[];j008Rdr();const el=document.getElementById('j008Con');if(el)el.style.display='none';}

console.log('✅ j004-j008 模拟器已加载');
