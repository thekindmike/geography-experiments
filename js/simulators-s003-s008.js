// ============================================================
//  地理实验平台 - 高中实验（s003-s008）
//  控制变量法升级版
// ============================================================

// ==================== s003 太阳高度角测量与正午太阳高度计算 ====================
function initS003Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#fef9c3';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#a16207;margin:0;">☀️ 太阳高度角测量与正午太阳高度计算（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：观测地点（厦门 φ=24.5°N）← 不变 &nbsp;|&nbsp;
        自变量：测量日期（太阳直射点δ）← 可调节 &nbsp;|&nbsp;
        因变量：正午太阳高度角 H ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#a16207;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#854d0e;line-height:1.7;">
            <li>观测地点（厦门）</li>
            <li>当地纬度 φ=24.5°N</li>
            <li>测量工具（标杆+卷尺）</li>
          </ul>
        </div>
        <div style="background:#f8fafc;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">测量日期（太阳直射点δ变化）</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">正午太阳高度角 H（°）、杆影长度（cm）</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="320" viewBox="0 0 500 320" style="background:#fef9c3;border-radius:8px;border:1px solid #fde047;">
            <text x="250" y="20" text-anchor="middle" fill="#a16207" font-size="12" font-weight="700">太阳高度角示意图</text>
            <!-- 地面 -->
            <line x1="50" y1="280" x2="450" y2="280" stroke="#92400e" stroke-width="2"/>
            <text x="250" y="300" text-anchor="middle" fill="#92400e" font-size="9">地面（水平面）</text>
            <!-- 标杆 -->
            <line x1="200" y1="280" x2="200" y2="180" stroke="#854d0e" stroke-width="4"/>
            <text x="190" y="230" fill="#854d0e" font-size="8">标杆 H=100cm</text>
            <!-- 太阳光线 -->
            <line x1="450" y1="80" x2="200" y2="280" stroke="#eab308" stroke-width="2" stroke-dasharray="4,2"/>
            <circle cx="460" cy="70" r="12" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
            <text x="460" y="74" text-anchor="middle" fill="#a16207" font-size="9" font-weight="700">☀️</text>
            <!-- 太阳高度角 -->
            <path d="M 230 280 A 30 30 0 0 0 250 260" fill="none" stroke="#dc2626" stroke-width="1.5"/>
            <text x="245" y="255" fill="#dc2626" font-size="8" font-weight="700">h</text>
            <!-- 杆影 -->
            <line x1="200" y1="280" x2="280" y2="280" stroke="#6b7280" stroke-width="2" stroke-dasharray="3,2"/>
            <text x="240" y="270" fill="#6b7280" font-size="8">杆影 L</text>
            <text x="250" y="150" text-anchor="middle" fill="#a16207" font-size="10">💡 公式：tan(h) = H / L</text>
            <text x="250" y="170" text-anchor="middle" fill="#a16207" font-size="9">H（太阳高度角）= 90° - |φ-δ|</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#fef9c3;color:#a16207;" onclick="s003Set('chunfen')">🌓 春分</button>
            <button class="sim-btn" style="background:#fef9c3;color:#a16207;" onclick="s003Set('xiatian')">☀️ 夏至</button>
            <button class="sim-btn" style="background:#fef9c3;color:#a16207;" onclick="s003Set('qiufen')">🍂 秋分</button>
            <button class="sim-btn" style="background:#fef9c3;color:#a16207;" onclick="s003Set('dongzhi')">❄️ 冬至</button>
            <button class="sim-btn sim-btn-primary" onclick="s003Calc()">📊 计算</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 调节自变量（日期/太阳直射点）</h4>
            <div style="margin-bottom:12px;">
              <label style="font-size:12px;color:#475569;display:block;margin-bottom:4px;">
                日期选择：<span id="s003Date">春分（3月21日）</span>
              </label>
              <input type="range" id="s003Slider" min="0" max="3" value="0" step="1"
                style="width:100%;accent-color:#eab308;" oninput="s003SliderUpdate()"/>
              <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;margin-top:1px;">
                <span>春分</span><span>夏至</span><span>秋分</span><span>冬至</span>
              </div>
            </div>
            <div style="background:#f1f5f9;border-radius:6px;padding:8px;font-size:11px;color:#475569;line-height:1.7;">
              📖 <strong>计算公式</strong><br/>
              H = 90° - |φ - δ|<br/>
              厦门 φ = 24.5°N<br/>
              δ（春分/秋分）= 0°<br/>
              δ（夏至）= 23.5°N<br/>
              δ（冬至）= 23.5°S
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 测量结果记录表</h4>
            <table class="data-table" id="s003TB">
              <thead><tr><th>日期</th><th>δ（°）</th><th>H（°）</th><th>杆影长（cm）</th></tr></thead>
              <tbody id="s003TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"计算"添加记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s003Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s003Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s003Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s003Con" class="conclusion-box"></div>
    </div>`;
  window._s003R=[];
  s003SliderUpdate();
}

const _s003Data=[
  {date:'春分（3月21日）',delta:0,desc:'太阳直射赤道'},
  {date:'夏至（6月22日）',delta:23.5,desc:'太阳直射北回归线'},
  {date:'秋分（9月23日）',delta:0,desc:'太阳直射赤道'},
  {date:'冬至（12月22日）',delta:-23.5,desc:'太阳直射南回归线'}
];

function s003SliderUpdate(){
  const idx=parseInt(document.getElementById('s003Slider')?.value||'0');
  const d=_s003Data[idx];
  const dateEl=document.getElementById('s003Date');
  if(dateEl) dateEl.textContent=d.date;
  window._s003CurIdx=idx;
}

function s003Set(season){
  const map={chunfen:0,xiatian:1,qiufen:2,dongzhi:3};
  const idx=map[season]!==undefined?map[season]:0;
  window._s003CurIdx=idx;
  const slider=document.getElementById('s003Slider');
  if(slider) slider.value=idx;
  s003SliderUpdate();
}

function s003Calc(){
  const idx=window._s003CurIdx!==undefined?window._s003CurIdx:0;
  const d=_s003Data[idx];
  const phi=24.5; // 厦门纬度
  const delta=d.delta;
  const H=90-Math.abs(phi-delta);
  const L=100/Math.tan(H*Math.PI/180); // 标杆100cm
  window._s003R=window._s003R||[];
  window._s003R.push({date:d.date,delta:delta.toFixed(1),H:H.toFixed(1),L:L.toFixed(1)});
  s003Rdr();
}

function s003Rdr(){
  const tb=document.getElementById('s003TBb');
  if(!tb)return;
  if(!window._s003R||window._s003R.length===0){
    tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"计算"添加记录</td></tr>';
    return;
  }
  tb.innerHTML=window._s003R.map(r=>`<tr><td>${r.date}</td><td>${r.delta}°</td><td>${r.H}°</td><td>${r.L} cm</td></tr>`).join('');
}

function s003Rec(){
  s003Calc();
}

function s003Ana(){
  const el=document.getElementById('s003Con');
  if(el){
    el.style.display='block';
    el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>正午太阳高度角季节变化</strong>：夏至日厦门正午太阳高度角最大（约89°），冬至日最小（约43°），两者相差约46°。</p>
    <p>2. <strong>杆影长度变化</strong>：太阳高度角越大，杆影越短。夏至日杆影最短，冬至日杆影最长。</p>
    <p>3. <strong>实际应用</strong>：①建筑物采光设计——厦门楼间距只需≥楼高×1.1（冬至日太阳高度角最小，此时能采光则全年都能采光）；②太阳能板安装角度——应调整为与当地太阳高度角互补（厦门约24.5°倾角）。</p>
    <p style="margin-top:8px;color:#a16207;">📌 本实验控制观测地点（厦门）和标杆高度不变，只改变测量日期（太阳直射点δ），观察正午太阳高度角的季节变化规律。</p>`;
  }
}

function s003Clr(){window._s003R=[];s003Rdr();const el=document.getElementById('s003Con');if(el)el.style.display='none';}

// ==================== s004 人口金字塔绘制与分析实验 ====================
function initS004Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f3e8ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#7c3aed;margin:0;">👥 人口金字塔绘制与分析实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：年龄分组方法（0-4岁，5岁一组）← 不变 &nbsp;|&nbsp;
        自变量：国家/地区发展阶段 ← 可调节 &nbsp;|&nbsp;
        因变量：金字塔形状、人口老龄化程度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#f3e8ff;border:1px solid #c4b5fd;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#6d28d9;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#7c3aed;line-height:1.7;">
            <li>年龄分组（5岁一组）</li>
            <li>性别分组（男左女右）</li>
            <li>绘图比例尺</li>
          </ul>
        </div>
        <div style="background:#f8fafc;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">国家/地区（不同发展阶段）</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">金字塔形状、老年人口比例（%）、少年儿童比例（%）</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="300" viewBox="0 0 500 300" style="background:#f3e8ff;border-radius:8px;border:1px solid #c4b5fd;">
            <text x="250" y="20" text-anchor="middle" fill="#6d28d9" font-size="12" font-weight="700">人口金字塔示意图（以尼日利亚为例）</text>
            <!-- 中线 -->
            <line x1="250" y1="40" x2="250" y2="290" stroke="#6b7280" stroke-width="0.5"/>
            <!-- 男性（左侧） -->
            <rect x="210" y="50" width="40" height="15" fill="#818cf8" rx="2"/><text x="205" y="61" text-anchor="end" fill="#4c1d95" font-size="7">0-4岁 8.5%</text>
            <rect x="180" y="70" width="70" height="15" fill="#818cf8" rx="2"/><text x="175" y="81" text-anchor="end" fill="#4c1d95" font-size="7">5-9岁 8.2%</text>
            <rect x="160" y="90" width="90" height="15" fill="#818cf8" rx="2"/><text x="155" y="101" text-anchor="end" fill="#4c1d95" font-size="7">10-14岁 7.8%</text>
            <rect x="170" y="110" width="80" height="15" fill="#818cf8" rx="2"/><text x="165" y="121" text-anchor="end" fill="#4c1d95" font-size="7">15-19岁 7.5%</text>
            <rect x="200" y="130" width="50" height="15" fill="#818cf8" rx="2"/><text x="195" y="141" text-anchor="end" fill="#4c1d95" font-size="7">20-24岁 6.8%</text>
            <rect x="220" y="150" width="30" height="15" fill="#818cf8" rx="2"/><text x="215" y="161" text-anchor="end" fill="#4c1d95" font-size="7">25-29岁 6.2%</text>
            <rect x="235" y="170" width="15" height="15" fill="#818cf8" rx="2"/><text x="250" y="181" text-anchor="start" fill="#4c1d95" font-size="7">30-34岁 5.5%</text>
            <!-- 女性（右侧） -->
            <rect x="250" y="50" width="40" height="15" fill="#c084fc" rx="2"/><text x="295" y="61" fill="#6b21a8" font-size="7">0-4岁 8.3%</text>
            <rect x="250" y="70" width="68" height="15" fill="#c084fc" rx="2"/><text x="322" y="81" fill="#6b21a8" font-size="7">5-9岁 8.0%</text>
            <rect x="250" y="90" width="88" height="15" fill="#c084fc" rx="2"/><text x="342" y="101" fill="#6b21a8" font-size="7">10-14岁 7.6%</text>
            <rect x="250" y="170" width="13" height="15" fill="#c084fc" rx="2"/><text x="268" y="181" fill="#6b21a8" font-size="7">30-34岁 5.3%</text>
            <text x="250" y="290" text-anchor="middle" fill="#6d28d9" font-size="9">💡 尼日利亚：扩张型（底部宽、少年儿童比重大）</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#f3e8ff;color:#6d28d9;" onclick="s004Select('尼日利亚')">📊 尼日利亚</button>
            <button class="sim-btn" style="background:#f3e8ff;color:#6d28d9;" onclick="s004Select('中国')">📊 中国</button>
            <button class="sim-btn" style="background:#f3e8ff;color:#6d28d9;" onclick="s004Select('日本')">📊 日本</button>
            <button class="sim-btn sim-btn-primary" onclick="s004Rec()">📝 记录数据</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 人口金字塔观察记录表</h4>
            <table class="data-table" id="s004TB">
              <thead><tr><th>国家/地区</th><th>金字塔类型</th><th>少年儿童（%）</th><th>老年人口（%）</th></tr></thead>
              <tbody id="s004TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击国家按钮添加观察记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s004Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s004Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s004Clr()">🗑️ 清空</button>
            </div>
          </div>
          <div id="s004Info" style="padding:12px;background:#f3e8ff;border-radius:6px;font-size:12px;color:#6d28d9;line-height:1.7;">
            选择国家/地区查看人口金字塔特征
          </div>
        </div>
      </div>
      <div id="s004Con" class="conclusion-box"></div>
    </div>`;
  window._s004R=[];
}

const _s004Data={
  '尼日利亚':{type:'扩张型（年轻型）',child:'43%',elder:'3%',desc:'底部极宽，出生率高，人口增长快'},
  '中国':{type:'稳定型（成年型）',child:'17%',elder:'14%',desc:'底部开始收窄，人口老龄化加速'},
  '日本':{type:'收缩型（老年型）',child:'12%',elder:'29%',desc:'底部很窄，超低生育率，人口负增长'}
};

function s004Select(country){
  window._s004Cur=country;
  const info=document.getElementById('s004Info');
  const d=_s004Data[country];
  if(info&&d) info.innerHTML=`<strong>${country}</strong><br/>金字塔类型：${d.type}<br/>少年儿童比例：${d.child}<br/>老年人口比例：${d.elder}<br/>说明：${d.desc}`;
}

function s004Rec(){
  window._s004R=window._s004R||[];
  Object.keys(_s004Data).forEach(country=>{
    const d=_s004Data[country];
    window._s004R.push({country:country,type:d.type,child:d.child,elder:d.elder});
  });
  s004Rdr();
}

function s004Rdr(){
  const tb=document.getElementById('s004TBb');
  if(!tb)return;
  if(!window._s004R||window._s004R.length===0){
    tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击国家按钮添加观察记录</td></tr>';
    return;
  }
  tb.innerHTML=window._s004R.map(r=>`<tr><td>${r.country}</td><td>${r.type}</td><td>${r.child}</td><td>${r.elder}</td></tr>`).join('');
}

function s004Ana(){
  const el=document.getElementById('s004Con');
  if(el){
    el.style.display='block';
    el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>人口金字塔类型</strong>：①扩张型（年轻型）——底部宽、顶部窄，少年儿童比重大，人口增长快（如尼日利亚）；②稳定型（成年型）——各年龄组比例相差不大，人口缓慢增长（如中国现阶段）；③收缩型（老年型）——底部窄、顶部宽，老年人口比重大，人口负增长（如日本）。</p>
    <p>2. <strong>人口老龄化</strong>：65岁以上人口占比≥7%为老龄化社会，≥14%为深度老龄化。日本已达29%，中国已超过14%，进入深度老龄化阶段。</p>
    <p>3. <strong>人口政策启示</strong>：人口老龄化会导致劳动力短缺、养老负担加重、经济增速放缓。中国放开三孩政策正是为了应对人口老龄化挑战。</p>
    <p style="margin-top:8px;color:#7c3aed;">📌 本实验控制年龄分组方法和绘图标准不变，只改变国家/地区，观察不同发展阶段的人口金字塔形状差异。</p>`;
  }
}

function s004Clr(){window._s004R=[];s004Rdr();const el=document.getElementById('s004Con');if(el)el.style.display='none';}

// ==================== s005 城市热岛效应模拟实验 ====================
function initS005Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#fef2f2';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#dc2626;margin:0;">🌇 城市热岛效应模拟实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：照射时间（10分钟）、光照强度 ← 不变 &nbsp;|&nbsp;
        自变量：下垫面类型 ← 可调节 &nbsp;|&nbsp;
        因变量：升温速度、最高温度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#dc2626;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#dc2626;line-height:1.7;">
            <li>照射时间（10分钟）</li>
            <li>光照强度（500W台灯）</li>
            <li>温度计规格</li>
          </ul>
        </div>
        <div style="background:#f8fafc;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">下垫面类型（草地/裸土/混凝土）</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">升温速度（°C/min）、最高温度（°C）</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="300" viewBox="0 0 500 300" style="background:#fef2f2;border-radius:8px;border:1px solid #fecaca;">
            <text x="250" y="20" text-anchor="middle" fill="#dc2626" font-size="12" font-weight="700">不同下垫面升温曲线（模拟）</text>
            <!-- 坐标轴 -->
            <line x1="50" y1="260" x2="450" y2="260" stroke="#6b7280" stroke-width="1"/>
            <line x1="50" y1="260" x2="50" y2="40" stroke="#6b7280" stroke-width="1"/>
            <text x="250" y="290" text-anchor="middle" fill="#64748b" font-size="8">时间（分钟）</text>
            <text x="30" y="150" text-anchor="middle" fill="#64748b" font-size="8" transform="rotate(-90 30 150)">温度（°C）</text>
            <!-- 草地升温曲线 -->
            <polyline points="50,240 110,230 170,222 230,218 290,216 350,214 410,214" fill="none" stroke="#22c55e" stroke-width="2"/>
            <circle cx="410" cy="214" r="3" fill="#22c55e"/><text x="418" y="218" fill="#16a34a" font-size="8">草地（最高32°C）</text>
            <!-- 裸土升温曲线 -->
            <polyline points="50,242 110,228 170,220 230,215 290,212 350,210 410,210" fill="none" stroke="#a16207" stroke-width="2"/>
            <circle cx="410" cy="210" r="3" fill="#a16207"/><text x="418" y="214" fill="#854d0e" font-size="8">裸土（最高35°C）</text>
            <!-- 混凝土升温曲线 -->
            <polyline points="50,245 110,228 170,218 230,210 290,205 350,200 410,198" fill="none" stroke="#6b7280" stroke-width="2"/>
            <circle cx="410" cy="198" r="3" fill="#6b7280"/><text x="418" y="202" fill="#374151" font-size="8">混凝土（最高45°C）</text>
            <text x="250" y="280" text-anchor="middle" fill="#dc2626" font-size="9">💡 混凝土升温最快、温度最高 → 城市热岛效应</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#dcfce7;color:#16a34a;" onclick="s005Select('草地')">🌿 草地</button>
            <button class="sim-btn" style="background:#fef9c3;color:#a16207;" onclick="s005Select('裸土')">🟤 裸土</button>
            <button class="sim-btn" style="background:#f1f5f9;color:#374151;" onclick="s005Select('混凝土')">🏗️ 混凝土</button>
            <button class="sim-btn sim-btn-primary" onclick="s005Rec()">📝 记录数据</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div id="s005Info" style="padding:12px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;font-size:12px;color:#dc2626;line-height:1.7;">
            选择下垫面类型查看升温特征
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 下垫面温度记录表</h4>
            <table class="data-table" id="s005TB">
              <thead><tr><th>下垫面</th><th>升温速度（°C/min）</th><th>最高温度（°C）</th><th>比草地高（°C）</th></tr></thead>
              <tbody id="s005TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击下垫面按钮添加记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s005Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s005Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s005Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s005Con" class="conclusion-box"></div>
    </div>`;
  window._s005R=[];
}

const _s005Data={
  '草地':{speed:0.4,maxTemp:32,desc:'比热容大，蒸发散热，升温慢'},
  '裸土':{speed:0.6,maxTemp:35,desc:'比热容中等，升温较快'},
  '混凝土':{speed:1.2,maxTemp:45,desc:'比热容小，吸热快、散热慢，升温最快'}
};

function s005Select(surface){
  window._s005Cur=surface;
  const info=document.getElementById('s005Info');
  const d=_s005Data[surface];
  if(info&&d){
    const diff=(d.maxTemp-32).toFixed(1);
    info.innerHTML=`<strong>${surface}</strong><br/>升温速度：${d.speed}°C/min<br/>最高温度：${d.maxTemp}°C<br/>比草地高：${diff}°C<br/>说明：${d.desc}`;
  }
}

function s005Rec(){
  window._s005R=window._s005R||[];
  Object.keys(_s005Data).forEach(surface=>{
    const d=_s005Data[surface];
    const diff=(d.maxTemp-32).toFixed(1);
    window._s005R.push({surface:surface,speed:d.speed,maxTemp:d.maxTemp,diff:diff});
  });
  s005Rdr();
}

function s005Rdr(){
  const tb=document.getElementById('s005TBb');
  if(!tb)return;
  if(!window._s005R||window._s005R.length===0){
    tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击下垫面按钮添加记录</td></tr>';
    return;
  }
  tb.innerHTML=window._s005R.map(r=>`<tr><td>${r.surface}</td><td>${r.speed}</td><td>${r.maxTemp}</td><td>${r.diff}</td></tr>`).join('');
}

function s005Ana(){
  const el=document.getElementById('s005Con');
  if(el){
    el.style.display='block';
    el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>下垫面性质差异</strong>：混凝土（城市道路、建筑）比热容小，吸热快、散热慢，温度最高；草地有蒸腾作用，能降温，温度最低。这是城市热岛效应的核心成因。</p>
    <p>2. <strong>城市热岛效应</strong>：城市气温明显高于周围郊区，形成"热岛"。夏季厦门城市中心比环岛路（沿海）高2-3°C。</p>
    <p>3. <strong>缓解措施</strong>：①增加城市绿地和水体（"冷岛"效应）；②推广浅色屋顶（反射太阳辐射）；③优化城市空间布局（建设通风廊道）；④减少人为热源（推广新能源汽车）。</p>
    <p style="margin-top:8px;color:#dc2626;">📌 本实验控制照射时间和光照强度不变，只改变下垫面类型，观察不同下垫面的升温差异，揭示城市热岛效应的成因。</p>`;
  }
}

function s005Clr(){window._s005R=[];s005Rdr();const el=document.getElementById('s005Con');if(el)el.style.display='none';}

// ==================== s006 工业区位选择分析实验 ====================
function initS006Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f0f9ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#0369a1;margin:0;">🏭 工业区位选择分析实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：评价区域（某城市）、评价因子体系 ← 不变 &nbsp;|&nbsp;
        自变量：工业类型 ← 可调节 &nbsp;|&nbsp;
        因变量：最优厂址得分 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#0369a1;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#0c4a6;line-height:1.7;">
            <li>评价区域（某城市）</li>
            <li>评价因子（原料、能源、市场、交通、劳动力、环境）</li>
            <li>评分标准（1-5分）</li>
          </ul>
        </div>
        <div style="background:#f8fafc;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">工业类型（不同区位需求）</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">最优厂址总得分、最优先区位因子</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <div style="padding:20px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">
            <div style="font-size:14px;color:#0369a1;margin-bottom:16px;font-weight:700;text-align:center;">工业区位因子评分矩阵</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
              <div style="padding:10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;cursor:pointer;" onclick="s006Select('饮料厂')">
                <div style="font-weight:700;color:#0369a1;margin-bottom:4px;font-size:12px;">🥤 饮料厂</div>
                <div style="font-size:10px;color:#0c4a6;">市场指向型</div>
                <div style="font-size:10px;color:#0369a1;margin-top:2px;">最优：城市近郊</div>
              </div>
              <div style="padding:10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;cursor:pointer;" onclick="s006Select('钢铁厂')">
                <div style="font-weight:700;color:#0369a1;margin-bottom:4px;font-size:12px;">⚙️ 钢铁厂</div>
                <div style="font-size:10px;color:#0c4a6;">原料/动力指向型</div>
                <div style="font-size:10px;color:#0369a1;margin-top:2px;">最优：矿区/港口</div>
              </div>
              <div style="padding:10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;cursor:pointer;" onclick="s006Select('电子厂')">
                <div style="font-weight:700;color:#0369a1;margin-bottom:4px;font-size:12px;">💻 电子厂</div>
                <div style="font-size:10px;color:#0c4a6;">技术指向型</div>
                <div style="font-size:10px;color:#0369a1;margin-top:2px;">最优：高新区</div>
              </div>
            </div>
          </div>
          <div id="s006Info" style="margin-top:12px;padding:12px;background:#f0f9ff;border-radius:6px;font-size:12px;color:#0369a1;line-height:1.7;">
            点击工业类型查看区位选择分析
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 工业区位评价记录表</h4>
            <table class="data-table" id="s006TB">
              <thead><tr><th>工业类型</th><th>最优厂址</th><th>主要区位因子</th><th>总评分</th></tr></thead>
              <tbody id="s006TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击工业类型卡片添加记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s006Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s006Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s006Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s006Con" class="conclusion-box"></div>
    </div>`;
  window._s006R=[];
}

const _s006Data={
  '饮料厂':{location:'城市近郊',factor:'市场',score:4.5,type:'市场指向型'},
  '钢铁厂':{location:'矿区或港口',factor:'原料/能源',score:4.0,type:'原料指向型'},
  '电子厂':{location:'高新技术产业开发区',factor:'高素质人才',score:4.8,type:'技术指向型'}
};

function s006Select(industry){
  window._s006Cur=industry;
  const info=document.getElementById('s006Info');
  const d=_s006Data[industry];
  if(info&&d) info.innerHTML=`<strong>${industry}</strong>（${d.type}）<br/>最优厂址：${d.location}<br/>主要区位因子：${d.factor}<br/>综合评价得分：${d.score}分<br/><br/>💡 饮料厂产品运输成本高、易变质，须接近消费市场；钢铁厂原料（铁矿石）运输量大，倾向接近原料地或交通便利的港口；电子厂需要高素质人才，集中在科教资源密集区。`;
}

function s006Rec(){
  window._s006R=window._s006R||[];
  Object.keys(_s006Data).forEach(industry=>{
    const d=_s006Data[industry];
    window._s006R.push({industry:industry,location:d.location,factor:d.factor,score:d.score});
  });
  s006Rdr();
}

function s006Rdr(){
  const tb=document.getElementById('s006TBb');
  if(!tb)return;
  if(!window._s006R||window._s006R.length===0){
    tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击工业类型卡片添加记录</td></tr>';
    return;
  }
  tb.innerHTML=window._s006R.map(r=>`<tr><td>${r.industry}</td><td>${r.location}</td><td>${r.factor}</td><td>${r.score}</td></tr>`).join('');
}

function s006Ana(){
  const el=document.getElementById('s006Con');
  if(el){
    el.style.display='block';
    el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>工业区位因子</strong>：自然因素（土地、水源、原料、能源）；经济因素（市场、交通、劳动力、科技）；社会因素（政策、个人偏好）；环境因素（污染、生态）。</p>
    <p>2. <strong>工业类型与区位偏好</strong>：①原料指向型（制糖、水产品加工）——接近原料产地；②市场指向型（啤酒、家具）——接近消费市场；③动力指向型（电解铝）——接近能源基地；④劳动力指向型（纺织、电子装配）——劳动力丰富且廉价地区；⑤技术指向型（集成电路、生物制药）——高素质人才密集区。</p>
    <p>3. <strong>区位因素的变化</strong>：随着科技进步和交通改善，原料对工业区位的影响减弱，市场和人才的影响增强。厦门的优势在于港口条件优越、对外开放早，适合发展电子信息、现代物流等产业。</p>
    <p style="margin-top:8px;color:#0369a1;">📌 本实验控制评价区域和评分标准不变，只改变工业类型，分析不同工业的区位选择规律。</p>`;
  }
}

function s006Clr(){window._s006R=[];s006Rdr();const el=document.getElementById('s006Con');if(el)el.style.display='none';}

// ==================== s007 农业区位因素与农业技术改良实验 ====================
function initS007Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f0fdf4';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#16a34a;margin:0;">🌾 农业区位因素与农业技术改良实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：作物种类（小麦）、生长周期 ← 不变 &nbsp;|&nbsp;
        自变量：土壤类型 + 栽培技术 ← 可调节 &nbsp;|&nbsp;
        因变量：发芽率、株高、长势评分 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#15803d;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#166534;line-height:1.7;">
            <li>作物种类（小麦）</li>
            <li>生长周期（2周）</li>
            <li>浇水量（定时定量）</li>
          </ul>
        </div>
        <div style="background:#f8fafc;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">土壤类型（砂土/黏土/壤土）+ 技术（滴灌/温室）</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">发芽率（%）、株高（cm）、长势评分（1-5分）</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="280" viewBox="0 0 500 280" style="background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
            <text x="250" y="20" text-anchor="middle" fill="#15803d" font-size="12" font-weight="700">不同土壤与技术条件下作物生长对比</text>
            <!-- 砂土 -->
            <rect x="40" y="50" width="120" height="180" fill="#e5e7eb" rx="4" stroke="#9ca3af" stroke-width="1"/>
            <text x="100" y="40" text-anchor="middle" fill="#6b7280" font-size="9" font-weight="700">砂土</text>
            <text x="100" y="245" text-anchor="middle" fill="#15803d" font-size="8">发芽率：60%</text>
            <text x="100" y="258" text-anchor="middle" fill="#15803d" font-size="8">株高：12cm | 评分：2分</text>
            <!-- 黏土 -->
            <rect x="190" y="50" width="120" height="180" fill="#78716c" rx="4" stroke="#57534e" stroke-width="1"/>
            <text x="250" y="40" text-anchor="middle" fill="#78716c" font-size="9" font-weight="700">黏土</text>
            <text x="250" y="245" text-anchor="middle" fill="#15803d" font-size="8">发芽率：70%</text>
            <text x="250" y="258" text-anchor="middle" fill="#15803d" font-size="8">株高：15cm | 评分：3分</text>
            <!-- 壤土 -->
            <rect x="340" y="50" width="120" height="180" fill="#a1a1aa" rx="4" stroke="#71717a" stroke-width="1"/>
            <text x="400" y="40" text-anchor="middle" fill="#52525b" font-size="9" font-weight="700">壤土（最佳）</text>
            <text x="400" y="245" text-anchor="middle" fill="#15803d" font-size="8">发芽率：92%</text>
            <text x="400" y="258" text-anchor="middle" fill="#15803d" font-size="8">株高：22cm | 评分：5分</text>
            <text x="250" y="275" text-anchor="middle" fill="#16a34a" font-size="9">💡 壤土砂黏比例适中，保水保肥性好，最适合作物生长</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#f0fdf4;color:#15803d;" onclick="s007Select('砂土')">🟫 砂土</button>
            <button class="sim-btn" style="background:#f0fdf4;color:#15803d;" onclick="s007Select('黏土')">🟤 黏土</button>
            <button class="sim-btn" style="background:#f0fdf4;color:#15803d;" onclick="s007Select('壤土')">🟢 壤土</button>
            <button class="sim-btn sim-btn-primary" onclick="s007Rec()">📝 记录数据</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div id="s007Info" style="padding:12px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:12px;color:#15803d;line-height:1.7;">
            选择土壤类型查看作物生长特征
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 农业实验观察记录表</h4>
            <table class="data-table" id="s007TB">
              <thead><tr><th>土壤类型</th><th>发芽率（%）</th><th>株高（cm）</th><th>长势评分</th></tr></thead>
              <tbody id="s007TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击土壤类型按钮添加记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s007Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s007Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s007Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s007Con" class="conclusion-box"></div>
    </div>`;
  window._s007R=[];
}

const _s007Data={
  '砂土':{germination:60,height:12,score:2,desc:'保水性差，养分少，生长较差'},
  '黏土':{germination:70,height:15,score:3,desc:'保水性强但通气性差，生长一般'},
  '壤土':{germination:92,height:22,score:5,desc:'砂黏比例适中，保水保肥，生长最好'}
};

function s007Select(soil){
  window._s007Cur=soil;
  const info=document.getElementById('s007Info');
  const d=_s007Data[soil];
  if(info&&d) info.innerHTML=`<strong>${soil}</strong><br/>发芽率：${d.germination}%<br/>株高：${d.height} cm<br/>长势评分：${d.score}分<br/>说明：${d.desc}`;
}

function s007Rec(){
  window._s007R=window._s007R||[];
  Object.keys(_s007Data).forEach(soil=>{
    const d=_s007Data[soil];
    window._s007R.push({soil:soil,germination:d.germination,height:d.height,score:d.score});
  });
  s007Rdr();
}

function s007Rdr(){
  const tb=document.getElementById('s007TBb');
  if(!tb)return;
  if(!window._s007R||window._s007R.length===0){
    tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击土壤类型按钮添加记录</td></tr>';
    return;
  }
  tb.innerHTML=window._s007R.map(r=>`<tr><td>${r.soil}</td><td>${r.germination}</td><td>${r.height}</td><td>${r.score}</td></tr>`).join('');
}

function s007Ana(){
  const el=document.getElementById('s007Con');
  if(el){
    el.style.display='block';
    el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>土壤类型对农业的影响</strong>：壤土（砂黏比例适中）最适合作物生长，保水保肥性好；砂土保水性差，须频繁灌溉；黏土通气性差，须改良（掺砂、施有机肥）。</p>
    <p>2. <strong>农业技术改良</strong>：①温室技术——调节温度，使作物摆脱季节限制；②滴灌技术——提高水分利用效率，适合干旱地区；③有机肥施用——改良土壤结构，提高肥力；④基因改良——提高抗逆性（抗虫、抗旱）。</p>
    <p>3. <strong>福建农业特色</strong>：福建多丘陵山地，耕地资源有限，须发展设施农业（大棚）、立体农业（茶园梯坎）、生态农业（稻渔综合种养）。同安的现代化农业园区就是农业区位因素与技术改良相结合的典型案例。</p>
    <p style="margin-top:8px;color:#16a34a;">📌 本实验控制作物种类和浇水量不变，只改变土壤类型和栽培技术，观察对作物生长的影响，理解农业技术改良的意义。</p>`;
  }
}

function s007Clr(){window._s007R=[];s007Rdr();const el=document.getElementById('s007Con');if(el)el.style.display='none';}

// ==================== s008 全球气候变化与温室效应模拟实验 ====================
function initS008Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#fef3c7';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#b45309;margin:0;">🌍 全球气候变化与温室效应模拟实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：照射强度、照射时间 ← 不变 &nbsp;|&nbsp;
        自变量：盒内气体成分（普通空气/CO₂）← 可调节 &nbsp;|&nbsp;
        因变量：升温速度、最高温度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#b45309;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#92400e;line-height:1.7;">
            <li>照射强度（500W台灯）</li>
            <li>照射时间（20分钟）</li>
            <li>塑料盒规格</li>
          </ul>
        </div>
        <div style="background:#f8fafc;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">盒内气体成分（普通空气 / CO₂浓度加倍）</div>
        </div>
        <div style="background:#f8fafc;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">升温速度（°C/min）、最高温度（°C）、保温效果</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="300" viewBox="0 0 500 300" style="background:#fef3c7;border-radius:8px;border:1px solid #fcd34d;">
            <text x="250" y="20" text-anchor="middle" fill="#b45309" font-size="12" font-weight="700">温室效应模拟——温度对比曲线</text>
            <!-- 坐标轴 -->
            <line x1="50" y1="260" x2="450" y2="260" stroke="#6b7280" stroke-width="1"/>
            <line x1="50" y1="260" x2="50" y2="40" stroke="#6b7280" stroke-width="1"/>
            <text x="250" y="290" text-anchor="middle" fill="#64748b" font-size="8">时间（分钟）</text>
            <text x="30" y="150" text-anchor="middle" fill="#64748b" font-size="8" transform="rotate(-90 30 150)">温度（°C）</text>
            <!-- 普通空气升温曲线 -->
            <polyline points="50,250 110,245 170,242 230,240 290,239 350,238 410,238" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
            <circle cx="410" cy="238" r="3" fill="#3b82f6"/><text x="418" y="242" fill="#1d4ed" font-size="8">普通空气（最高28°C）</text>
            <!-- CO2盒升温曲线 -->
            <polyline points="50,250 110,242 170,236 230,230 290,225 350,220 410,218" fill="none" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="410" cy="218" r="3" fill="#ef4444"/><text x="418" y="222" fill="#dc2626" font-size="8">CO₂盒（最高38°C）</text>
            <!-- 温差标注 -->
            <line x1="410" y1="238" x2="410" y2="218" stroke="#92400e" stroke-width="1.5" stroke-dasharray="2,1"/>
            <text x="430" y="228" fill="#92400e" font-size="8" font-weight="700">温差 10°C</text>
            <text x="250" y="280" text-anchor="middle" fill="#b45309" font-size="9">💡 CO₂盒升温更快、温度更高 → 温室效应增强</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#eff6ff;color:#1d4ed;" onclick="s008Select('普通空气')">🌬️ 普通空气</button>
            <button class="sim-btn" style="background:#fef2f2;color:#dc2626;" onclick="s008Select('CO₂')">🏭 CO₂浓度加倍</button>
            <button class="sim-btn sim-btn-primary" onclick="s008Rec()">📝 记录数据</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div id="s008Info" style="padding:12px;background:#fef3c7;border:1px solid #fcd34d;border-radius:6px;font-size:12px;color:#b45309;line-height:1.7;">
            选择气体成分查看温室效应特征
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 温室效应模拟记录表</h4>
            <table class="data-table" id="s008TB">
              <thead><tr><th>气体成分</th><th>升温速度（°C/min）</th><th>最高温度（°C）</th><th>保温效果</th></tr></thead>
              <tbody id="s008TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击气体成分按钮添加记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s008Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s008Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s008Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s008Con" class="conclusion-box"></div>
    </div>`;
  window._s008R=[];
}

const _s008Data={
  '普通空气':{speed:0.2,maxTemp:28,retain:'一般',desc:'允许太阳短波辐射进入，地面长波辐射部分逸出'},
  'CO₂':{speed:0.6,maxTemp:38,retain:'很强',desc:'CO₂吸收地面长波辐射并向各方向重新辐射，增强保温效果'}
};

function s008Select(gas){
  window._s008Cur=gas;
  const info=document.getElementById('s008Info');
  const d=_s008Data[gas];
  if(info&&d) info.innerHTML=`<strong>${gas}</strong><br/>升温速度：${d.speed}°C/min<br/>最高温度：${d.maxTemp}°C<br/>保温效果：${d.retain}<br/>说明：${d.desc}<br/><br/>💡 <strong>温室效应原理</strong>：太阳短波辐射能穿过CO₂到达地面，地面长波辐射被CO₂吸收并向各方向重新辐射（其中一部分返回地面），使地面保温。`;
}

function s008Rec(){
  window._s008R=window._s008R||[];
  Object.keys(_s008Data).forEach(gas=>{
    const d=_s008Data[gas];
    window._s008R.push({gas:gas,speed:d.speed,maxTemp:d.maxTemp,retain:d.retain});
  });
  s008Rdr();
}

function s008Rdr(){
  const tb=document.getElementById('s008TBb');
  if(!tb)return;
  if(!window._s008R||window._s008R.length===0){
    tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击气体成分按钮添加记录</td></tr>';
    return;
  }
  tb.innerHTML=window._s008R.map(r=>`<tr><td>${r.gas}</td><td>${r.speed}</td><td>${r.maxTemp}</td><td>${r.retain}</td></tr>`).join('');
}

function s008Ana(){
  const el=document.getElementById('s008Con');
  if(el){
    el.style.display='block';
    el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>温室效应原理</strong>：CO₂等温室气体能透过太阳短波辐射（使地面升温），但吸收地面长波辐射并向各方向重新辐射（其中一部分返回地面），就像温室玻璃一样使地面保温。</p>
    <p>2. <strong>人类活动的影响</strong>：自工业革命以来，人类大量燃烧化石燃料（煤、石油、天然气）、砍伐森林，导致大气中CO₂浓度从约280ppm飙升至超过420ppm，温室效应异常增强，引起全球气候变暖。</p>
    <p>3. <strong>气候变暖的后果</strong>：冰川融化→海平面上升→沿海城市被淹；极端天气事件（高温、暴雨、干旱）增多；生态系统紊乱→生物多样性减少；农业生产格局改变等。</p>
    <p>4. <strong>应对措施</strong>：①减缓（Mitigation）——减少温室气体排放（发展清洁能源、提高能源效率、碳捕集与封存）；②适应（Adaptation）——建设韧性城市、调整农业结构；③国际协作——《巴黎协定》目标：将全球升温控制在2°C以内，力争1.5°C。中国提出"碳达峰、碳中和"目标，体现负责任大国担当。</p>
    <p style="margin-top:8px;color:#b45309;">📌 本实验控制照射强度和照射时间不变，只改变盒内气体成分，观察温室效应的增强现象，理解全球气候变暖的机制。</p>`;
  }
}

function s008Clr(){window._s008R=[];s008Rdr();const el=document.getElementById('s008Con');if(el)el.style.display='none';}

console.log('✅ s003-s008 模拟器已加载');
