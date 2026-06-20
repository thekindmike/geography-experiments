// ============================================================
//  地理实验平台 - 高中实验 s003-s008 控制变量法升级版
// ============================================================

// ==================== s003 太阳高度角测量与正午太阳高度计算 ====================
function initS003Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#fefce8';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#d97706;margin:0;">☀️ 太阳高度角测量实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：杆高（1.5m）、测量地点（厦门24.5°N） ← 不变 &nbsp;|&nbsp;
        自变量：日期（太阳直射点纬度δ） ← 可调节 &nbsp;|&nbsp;
        因变量：正午太阳高度角H、杆影长度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#a16207;line-height:1.7;">
            <li>杆高 H = 1.5m（固定）</li>
            <li>测量地点：厦门（24.5°N）</li>
            <li>测量时刻：当地正午</li>
          </ul>
        </div>
        <div style="background:#fefce8;border:1px solid #fbbf24;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#a16207;line-height:1.7;">
            日期（即太阳直射点纬度δ）<br/>可选：春分/夏至/秋分/冬至
          </div>
        </div>
        <div style="background:#fefce8;border:1px solid #60a5fa;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">
            正午太阳高度角H（°）<br/>杆影长度L（m）
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="320" viewBox="0 0 500 320" style="background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
            <text x="250" y="20" text-anchor="middle" fill="#92400e" font-size="12" font-weight="700">正午太阳高度角测量原理示意图</text>
            <!-- 地面 -->
            <line x1="50" y1="280" x2="450" y2="280" stroke="#a16207" stroke-width="2"/>
            <text x="455" y="284" fill="#a16207" font-size="9">地面</text>
            <!-- 标杆 -->
            <line x1="200" y1="280" x2="200" y2="160" stroke="#92400e" stroke-width="3"/>
            <circle cx="200" cy="160" r="4" fill="#92400e"/>
            <text x="185" y="155" fill="#92400e" font-size="9" font-weight="700">标杆 H=1.5m</text>
            <!-- 太阳光线 -->
            <line id="sunRay" x1="200" y1="160" x2="350" y2="280" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowsun)"/>
            <defs>
              <marker id="arrowsun" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b"/>
              </marker>
            </defs>
            <!-- 杆影 -->
            <line id="shadowLine" x1="200" y1="280" x2="350" y2="280" stroke="#6b7280" stroke-width="2" stroke-dasharray="4,2"/>
            <text x="355" y="276" fill="#6b7280" font-size="9">杆影 L</text>
            <!-- 角度标注 -->
            <path d="M 230 280 A 30 30 0 0 0 214 265" fill="none" stroke="#dc2626" stroke-width="1.5"/>
            <text x="236" y="262" fill="#dc2626" font-size="9">H = ?°</text>
            <text x="14" y="290" fill="#92400e" font-size="9" id="formulaText">公式：H = 90° - |φ-δ|</text>
            <text x="14" y="305" fill="#1d4ed" font-size="9" id="resultText">厦门夏至：H ≈ 89° | 杆影极短</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#fefce8;color:#d97706;border:1px solid #fde68a;" onclick="s003Set('spring')">🌸 春分</button>
            <button class="sim-btn" style="background:#fefce8;color:#d97706;border:1px solid #fde68a;" onclick="s003Set('summer')">☀️ 夏至</button>
            <button class="sim-btn" style="background:#fefce8;color:#d97706;border:1px solid #fde68a;" onclick="s003Set('autumn')">🍂 秋分</button>
            <button class="sim-btn" style="background:#fefce8;color:#d97706;border:1px solid #fde68a;" onclick="s003Set('winter')">❄️ 冬至</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 选择日期（自变量）</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="sim-btn" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a;text-align:left;padding:8px 10px;" onclick="s003Set('spring')">
                <div style="font-weight:700;font-size:12px;">🌸 春分（3月21日）</div>
                <div style="font-size:10px;color:#a16207;">δ=0° | H=65.5° | 杆影中等</div>
              </button>
              <button class="sim-btn" style="background:#fffbeb;color:#92400e;border:1px solid #fbbf24;text-align:left;padding:8px 10px;" onclick="s003Set('summer')">
                <div style="font-weight:700;font-size:12px;">☀️ 夏至（6月22日）</div>
                <div style="font-size:10px;color:#a16207;">δ=23.5°N | H≈89° | 杆影极短</div>
              </button>
              <button class="sim-btn" style="background:#fffbeb;color:#92400e;border:1px solid #fde68a;text-align:left;padding:8px 10px;" onclick="s003Set('autumn')">
                <div style="font-weight:700;font-size:12px;">🍂 秋分（9月23日）</div>
                <div style="font-size:10px;color:#a16207;">δ=0° | H=65.5° | 杆影中等</div>
              </button>
              <button class="sim-btn" style="background:#fffbeb;color:#92400e;border:1px solid #60a5fa;text-align:left;padding:8px 10px;" onclick="s003Set('winter')">
                <div style="font-weight:700;font-size:12px;">❄️ 冬至（12月22日）</div>
                <div style="font-size:10px;color:#a16207;">δ=23.5°S | H≈41° | 杆影很长</div>
              </button>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 测量记录表</h4>
            <table class="data-table" id="s003TB">
              <thead><tr><th>节气</th><th>直射点δ</th><th>H（°）</th><th>杆影长L（m）</th></tr></thead>
              <tbody id="s003TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击季节按钮自动记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s003Rec()">📝 记录当前</button>
              <button class="sim-btn sim-btn-success" onclick="s003Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s003Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s003Con" class="conclusion-box"></div>
    </div>`;
  window._s003R=[];
  s003Set('summer');
}

const _s003Data={
  spring:{delta:0,h:65.5,shadow:0.68},
  summer:{delta:23.5,h:89.0,shadow:0.03},
  autumn:{delta:0,h:65.5,shadow:0.68},
  winter:{delta:-23.5,h:41.0,shadow:1.71}
};

function s003Set(season){
  window._s003Cur=season;
  const d=_s003Data[season]; if(!d)return;
  const svg=document.getElementById('sunRay');
  const shadow=document.getElementById('shadowLine');
  // 根据H角调整太阳光线角度
  const angle=90-d.h; // 光线与地面夹角 = H
  const rad=angle*Math.PI/180;
  const x2=200+120*Math.cos(rad);
  const y2=280-120*Math.sin(rad);
  if(svg)svg.setAttribute('x2',x2);
  if(svg)svg.setAttribute('y2',y2);
  // 杆影长度
  const L=1.5/Math.tan(d.h*Math.PI/180);
  const sx=200+L*100; // 比例放大
  if(shadow){shadow.setAttribute('x2',Math.min(450,sx));}
  const ft=document.getElementById('formulaText');
  const rt=document.getElementById('resultText');
  if(ft)ft.textContent=`公式：H = 90° - |φ-δ| = 90° - |24.5-${d.delta}| = ${d.h.toFixed(1)}°`;
  if(rt)rt.textContent=`杆影长 L = ${L.toFixed(2)} m（H=${d.h.toFixed(1)}°）`;
}

function s003Rec(){
  window._s003R=window._s003R||[];
  const s=window._s003Cur||'summer';
  const d=_s003Data[s];
  const names={spring:'春分',summer:'夏至',autumn:'秋分',winter:'冬至'};
  const L=1.5/Math.tan(d.h*Math.PI/180);
  window._s003R.push({season:names[s],delta:d.delta,h:d.h.toFixed(1),shadow:L.toFixed(2)});
  s003Rdr();
}
function s003Rdr(){const tb=document.getElementById('s003TBb');if(!tb)return;if(window._s003R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击季节按钮自动记录</td></tr>';return;}tb.innerHTML=window._s003R.map(r=>`<tr><td>${r.season}</td><td>${r.delta}°</td><td>${r.h}</td><td>${r.shadow}</td></tr>`).join('');}
function s003Ana(){const el=document.getElementById('s003Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>正午太阳高度角计算公式</strong>：H = 90° - |φ - δ|，其中φ为当地纬度，δ为当日太阳直射点纬度。同半球取减号，异半球取加号。</p>
    <p>2. <strong>季节变化规律</strong>：厦门（24.5°N）夏至日H最大（≈89°），杆影极短，可能出现"立竿无影"；冬至日H最小（≈41°），杆影最长。</p>
    <p>3. <strong>纬度分布规律</strong>：正午太阳高度从太阳直射点向南北两侧递减。直射时H=90°（杆影长度为0）。</p>
    <p>4. <strong>实际应用</strong>：①建筑物采光设计（楼间距≥H×cotH）；②太阳能板安装角度（倾角≈90°-H）；③气温分布解释（H越大，单位面积获得辐射越多）。</p>
    <p style="margin-top:8px;color:#d97706;">📌 本实验控制杆高和测量地点不变，只改变日期（太阳直射点纬度），观察正午太阳高度角和杆影长度的变化规律。</p>`;}}
function s003Clr(){window._s003R=[];s003Rdr();const el=document.getElementById('s003Con');if(el)el.style.display='none';}


// ==================== s004 人口金字塔绘制与分析实验 ====================
function initS004Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f0fdf4';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#16a34a;margin:0;">📊 人口金字塔绘制与分析实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：横坐标比例（1%宽=10px）、年龄组距（5岁） ← 不变 &nbsp;|&nbsp;
        自变量：国家/地区选择 ← 可调节 &nbsp;|&nbsp;
        因变量：金字塔形状、人口老龄化指数 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#166534;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#15803d;line-height:1.7;">
            <li>年龄组距：5岁一组</li>
            <li>横坐标比例固定</li>
            <li>男女分色：蓝（男）/红（女）</li>
          </ul>
        </div>
        <div style="background:#f0fdf4;border:1px solid #4ade80;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#166534;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#15803d;line-height:1.7;">
            国家/地区选择<br/>（中国/日本/印度/尼日利亚）
          </div>
        </div>
        <div style="background:#f0fdf4;border:1px solid #f59e0b;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">
            金字塔形状类型<br/>少年儿童比重（%）<br/>老年人口比重（%）
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:400px;">
          <svg width="100%" height="360" viewBox="0 0 520 360" style="background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;" id="s004Svg">
            <text x="260" y="18" text-anchor="middle" fill="#166534" font-size="12" font-weight="700">人口金字塔（<tspan id="s004Country">中国2023</tspan>）</text>
            <text x="130" y="34" text-anchor="middle" fill="#1d4ed" font-size="9">男性（%）</text>
            <text x="390" y="34" text-anchor="middle" fill="#dc2626" font-size="9">女性（%）</text>
            <!-- 年龄轴 -->
            <text x="10" y="60" fill="#64748b" font-size="8">0-4岁</text>
            <text x="10" y="100" fill="#64748b" font-size="8">15-19岁</text>
            <text x="10" y="140" fill="#64748b" font-size="8">30-34岁</text>
            <text x="10" y="180" fill="#64748b" font-size="8">45-49岁</text>
            <text x="10" y="220" fill="#64748b" font-size="8">60-64岁</text>
            <text x="10" y="260" fill="#64748b" font-size="8">75-79岁</text>
            <text x="10" y="300" fill="#64748b" font-size="8">90+岁</text>
            <!-- 金字塔条形将通过JS动态生成 -->
            <g id="pyramidBars"></g>
            <text x="260" y="345" text-anchor="middle" fill="#166534" font-size="9" id="s004Type">类型：稳定型（即将转入老年型）</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;" onclick="s004Set('china')">🇨🇳 中国</button>
            <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;" onclick="s004Set('japan')">🇯🇵 日本</button>
            <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;" onclick="s004Set('india')">🇮🇳 印度</button>
            <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;" onclick="s004Set('nigeria')">🇳🇬 尼日利亚</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 选择国家（自变量）</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;text-align:left;padding:8px 10px;" onclick="s004Set('china')">
                <div style="font-weight:700;font-size:12px;">🇨🇳 中国（2023）</div>
                <div style="font-size:10px;color:#15803d;">稳定型→老年型 | 少儿38% 老年14%</div>
              </button>
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;text-align:left;padding:8px 10px;" onclick="s004Set('japan')">
                <div style="font-weight:700;font-size:12px;">🇯🇵 日本（2023）</div>
                <div style="font-size:10px;color:#15803d;">老年型（收缩型）| 少儿12% 老年29%</div>
              </button>
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;text-align:left;padding:8px 10px;" onclick="s004Set('india')">
                <div style="font-weight:700;font-size:12px;">🇮🇳 印度（2023）</div>
                <div style="font-size:10px;color:#15803d;">扩张型（年轻型）| 少儿37% 老年6%</div>
              </button>
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;text-align:left;padding:8px 10px;" onclick="s004Set('nigeria')">
                <div style="font-weight:700;font-size:12px;">🇳🇬 尼日利亚（2023）</div>
                <div style="font-size:10px;color:#15803d;">典型扩张型 | 少儿43% 老年3%</div>
              </button>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 人口数据分析表</h4>
            <table class="data-table" id="s004TB">
              <thead><tr><th>国家</th><th>类型</th><th>少儿比重</th><th>老年比重</th></tr></thead>
              <tbody id="s004TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击国家按钮添加数据</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s004Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s004Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s004Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s004Con" class="conclusion-box"></div>
    </div>`;
  window._s004R=[];
  // 默认绘制中国
  s004Set('china');
}

const _s004Data={
  china:{name:'中国2023',type:'稳定型→老年型',young:38,old:14,
    bars:[{age:'0-4',m:7.2,f:6.8},{age:'15-19',m:7.0,f:6.5},{age:'30-34',m:8.5,f:8.2},{age:'45-49',m:7.8,f:7.6},{age:'60-64',m:5.2,f:5.5},{age:'75-79',m:2.1,f:2.5},{age:'90+',m:0.3,f:0.5}]},
  japan:{name:'日本2023',type:'收缩型（老年型）',young:12,old:29,
    bars:[{age:'0-4',m:3.0,f:2.8},{age:'15-19',m:3.2,f:3.0},{age:'30-34',m:4.5,f:4.3},{age:'45-49',m:6.8,f:6.5},{age:'60-64',m:7.2,f:7.8},{age:'75-79',m:5.5,f:6.2},{age:'90+',m:1.8,f:2.5}]},
  india:{name:'印度2023',type:'扩张型（年轻型）',young:37,old:6,
    bars:[{age:'0-4',m:9.5,f:9.0},{age:'15-19',m:9.2,f:8.8},{age:'30-34',m:8.0,f:7.8},{age:'45-49',m:5.5,f:5.3},{age:'60-64',m:3.2,f:3.5},{age:'75-79',m:1.2,f:1.5},{age:'90+',m:0.3,f:0.4}]},
  nigeria:{name:'尼日利亚2023',type:'典型扩张型',young:43,old:3,
    bars:[{age:'0-4',m:11.0,f:10.5},{age:'15-19',m:10.2,f:9.8},{age:'30-34',m:8.5,f:8.2},{age:'45-49',m:5.8,f:5.5},{age:'60-64',m:2.8,f:3.0},{age:'75-79',m:0.8,f:0.9},{age:'90+',m:0.1,f:0.1}]}
};

function s004Set(country){
  window._s004Cur=country;
  const d=_s004Data[country]; if(!d)return;
  const svg=document.getElementById('pyramidBars');
  const ct=document.getElementById('s004Country');
  const ty=document.getElementById('s004Type');
  if(ct)ct.textContent=d.name;
  if(ty)ty.textContent=`类型：${d.type} | 少儿${d.young}% 老年${d.old}%`;
  if(!svg)return;
  // 绘制金字塔条形
  let html='';
  const yPositions=[50,90,130,170,210,250,290];
  d.bars.forEach((b,i)=>{
    const y=yPositions[i];
    const mw=b.m*4; // 放大系数
    const fw=b.f*4;
    // 男性条（左）
    html+=`<rect x="${250-mw}" y="${y}" width="${mw}" height="28" fill="#3b82f6" opacity="0.8"/>`;
    // 女性条（右）
    html+=`<rect x="250" y="${y}" width="${fw}" height="28" fill="#ef4444" opacity="0.8"/>`;
  });
  svg.innerHTML=html;
}

function s004Rec(){
  window._s004R=window._s004R||[];
  const c=window._s004Cur||'china';
  const d=_s004Data[c];
  window._s004R.push({country:d.name,type:d.type,young:d.young,old:d.old});
  s004Rdr();
}
function s004Rdr(){const tb=document.getElementById('s004TBb');if(!tb)return;if(window._s004R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击国家按钮添加数据</td></tr>';return;}tb.innerHTML=window._s004R.map(r=>`<tr><td>${r.country}</td><td>${r.type}</td><td>${r.young}%</td><td>${r.old}%</td></tr>`).join('');}
function s004Ana(){const el=document.getElementById('s004Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>人口金字塔三种类型</strong>：①扩张型（年轻型）——底部宽、顶部窄，少年儿童比重大（>40%），人口快速增长；②稳定型（成年型）——各年龄组比例较均匀，人口缓慢增长；③收缩型（老年型）——底部窄、顶部宽，老年人口比重大（>14%），人口负增长风险。</p>
    <p>2. <strong>中日印尼差异</strong>：尼日利亚为典型扩张型（少儿43%）；印度为扩张型（少儿37%）；中国为稳定型即将转入老年型（老年14%，超过联合国老龄化社会标准10%）；日本为典型收缩型（老年29%，严重老龄化）。</p>
    <p>3. <strong>人口红利</strong>：劳动年龄人口（15-64岁）比重大的时期称为"人口红利期"，有利于经济增长。中国目前正逐渐走出人口红利期，须应对老龄化挑战。</p>
    <p>4. <strong>政策启示</strong>：放开生育政策、延迟退休、健全养老保障体系、发展"银发经济"是应对老龄化的综合措施。</p>
    <p style="margin-top:8px;color:#16a34a;">📌 本实验控制年龄组距和绘图比例不变，只改变国家/地区，比较人口年龄结构类型的差异。</p>`;}}
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
        控制变量：照射强度（500W台灯）、照射时间（10min） ← 不变 &nbsp;|&nbsp;
        自变量：下垫面类型 ← 可调节 &nbsp;|&nbsp;
        因变量：升温幅度、最高温度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#dc2626;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#ef4444;line-height:1.7;">
            <li>照射强度：500W台灯</li>
            <li>照射时间：10分钟</li>
            <li>温度计型号一致</li>
          </ul>
        </div>
        <div style="background:#fef2f2;border:1px solid #f59e0b;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">
            下垫面类型<br/>（草地/裸土/水泥/水面）
          </div>
        </div>
        <div style="background:#fef2f2;border:1px solid #60a5fa;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#1e40af;line-height:1.7;">
            升温幅度（°C）<br/>最高温度（°C）<br/>降温速度
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="320" viewBox="0 0 500 320" style="background:#fff7ed;border-radius:8px;border:1px solid #fed7aa;">
            <text x="250" y="18" text-anchor="middle" fill="#ea580c" font-size="12" font-weight="700">不同下垫面温度变化曲线（模拟）</text>
            <!-- 坐标轴 -->
            <line x1="50" y1="290" x2="450" y2="290" stroke="#94a3b8" stroke-width="1.5"/>
            <line x1="50" y1="290" x2="50" y2="50" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="30" y="170" fill="#64748b" font-size="8" transform="rotate(-90,30,170)">温度（°C）</text>
            <text x="250" y="310" text-anchor="middle" fill="#64748b" font-size="8">时间（min）</text>
            <!-- 刻度 -->
            <text x="50" y="305" fill="#94a3b8" font-size="7">0</text>
            <text x="150" y="305" fill="#94a3b8" font-size="7">2.5</text>
            <text x="250" y="305" fill="#94a3b8" font-size="7">5</text>
            <text x="350" y="305" fill="#94a3b8" font-size="7">7.5</text>
            <text x="445" y="305" fill="#94a3b8" font-size="7">10</text>
            <text x="45" y="290" fill="#94a3b8" font-size="7">25</text>
            <text x="45" y="210" fill="#94a3b8" font-size="7">30</text>
            <text x="45" y="130" fill="#94a3b8" font-size="7">35</text>
            <text x="45" y="50" fill="#94a3b8" font-size="7">40</text>
            <!-- 曲线：草地 -->
            <polyline id="lineGrass" fill="none" stroke="#22c55e" stroke-width="2" stroke-linejoin="round"/>
            <!-- 曲线：裸土 -->
            <polyline id="lineSoil" fill="none" stroke="#a16207" stroke-width="2" stroke-linejoin="round"/>
            <!-- 曲线：水泥 -->
            <polyline id="lineCement" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linejoin="round"/>
            <!-- 曲线：水面 -->
            <polyline id="lineWater" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round" stroke-dasharray="4,2"/>
            <!-- 图例 -->
            <rect x="360" y="55" width="14" height="10" fill="#22c55e" rx="2"/><text x="380" y="63" fill="#166534" font-size="8">草地</text>
            <rect x="360" y="70" width="14" height="10" fill="#a16207" rx="2"/><text x="380" y="78" fill="#92400e" font-size="8">裸土</text>
            <rect x="360" y="85" width="14" height="10" fill="#6b7280" rx="2"/><text x="380" y="93" fill="#374151" font-size="8">水泥</text>
            <rect x="360" y="100" width="14" height="10" fill="#3b82f6" rx="2"/><text x="380" y="108" fill="#1d4ed" font-size="8">水面</text>
            <text x="250" y="160" text-anchor="middle" fill="#dc2626" font-size="9" font-weight="700" id="s005MaxTemp">水泥最高温：38.5°C | 草地最高温：30.2°C</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn sim-btn-primary" onclick="s005Draw()">📈 绘制温度曲线</button>
            <button class="sim-btn" style="background:#fef2f2;color:#dc2626;border:1px solid #fecaca;" onclick="s005Reset()">🔄 重置</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 选择下垫面（自变量）</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;text-align:center;" onclick="s005Select('cement')">
                <div style="font-weight:700;font-size:11px;">🏗️ 水泥地面</div>
                <div style="font-size:9px;color:#15803d;">比热容小，升温快</div>
              </button>
              <button class="sim-btn" style="background:#fefce8;color:#92400e;border:1px solid #fde68a;text-align:center;" onclick="s005Select('soil')">
                <div style="font-weight:700;font-size:11px;">🟤 裸土</div>
                <div style="font-size:9px;color:#a16207;">升温较快，保温一般</div>
              </button>
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;text-align:center;" onclick="s005Select('gras')">
                <div style="font-weight:700;font-size:11px;">🌱 草地</div>
                <div style="font-size:9px;color:#15803d;">蒸腾降温，升温慢</div>
              </button>
              <button class="sim-btn" style="background:#eff6ff;color:#1d4ed;border:1px solid #bfdbfe;text-align:center;" onclick="s005Select('water')">
                <div style="font-weight:700;font-size:11px;">💧 水面</div>
                <div style="font-size:9px;color:#2563eb;">比热容大，升温最慢</div>
              </button>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 温度观测记录表</h4>
            <table class="data-table" id="s005TB">
              <thead><tr><th>下垫面</th><th>初始温</th><th>最高温</th><th>升温幅度</th></tr></thead>
              <tbody id="s005TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"绘制温度曲线"自动记录</td></tr>
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

  // 温度数据（模拟）
  window._s005Temps={
    cement:[25,28,31,34,36,38.5,39,38,37,35.5],
    soil:[25,27.5,30,32.5,34.5,36,37,36.5,35.5,34],
    grass:[25,26,27,28,29,30,30.5,30,29.5,29],
    water:[25,25.5,26.5,27.5,28.5,29.5,30,30.5,30.5,30]
  };
  window._s005R=[];
  s005Draw();
}

function s005Draw(){
  const temps=window._s005Temps;
  // 绘制四条曲线
  ['cement','soil','gras','water'].forEach(key=>{
    const el=document.getElementById('line'+key.charAt(0).toUpperCase()+key.slice(1));
    if(!el)return;
    let pts='';
    temps[key].forEach((t,i)=>{
      const x=50+i*44.4;
      const y=290-(t-25)*16;
      pts+=`${x},${y} `;
    });
    el.setAttribute('points',pts.trim());
  });
  // 更新最高温标注
  const mt=document.getElementById('s005MaxTemp');
  if(mt)mt.textContent=`水泥最高：39°C | 草地最高：30.5°C | 温差：8.5°C`;
}

function s005Select(type){
  window._s005Cur=type;
}

function s005Rec(){
  window._s005R=window._s005R||[];
  const t=window._s005Temps;
  ['cement','soil','gras','water'].forEach(key=>{
    const arr=t[key];
    const name={cement:'水泥地面',soil:'裸土',gras:'草地',water:'水面'}[key];
    window._s005R.push({type:name,init:arr[0],max:Math.max(...arr),rise:(Math.max(...arr)-arr[0]).toFixed(1)});
  });
  s005Rdr();
}
function s005Rdr(){const tb=document.getElementById('s005TBb');if(!tb)return;if(window._s005R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"绘制温度曲线"自动记录</td></tr>';return;}tb.innerHTML=window._s005R.map(r=>`<tr><td>${r.type}</td><td>${r.init}°C</td><td>${r.max}°C</td><td>${r.rise}°C</td></tr>`).join('');}
function s005Reset(){window._s005R=[];s005Rdr();}
function s005Ana(){const el=document.getElementById('s005Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>热岛效应成因</strong>：城市下垫面（混凝土、沥青）比热容小，白天吸热快、温度高；城市人工热源多（空调、交通、工业）；建筑物密集通风不良；大气污染物吸热量大。以上因素共同导致城市温度比郊区高2-5°C，形成"热岛效应"。</p>
    <p>2. <strong>下垫面影响规律</strong>：比热容越大，升温越慢、最高温越低。本实验模拟结果：水面升温最慢（比热容最大），草地次之（植被蒸腾降温），裸土较快，水泥地面升温最快（比热容最小）。</p>
    <p>3. <strong>缓解措施</strong>：①增加城市绿地和水体（"冷岛效应"抵消热岛）；②推广浅色屋面（反射更多太阳辐射）；③优化城市通风廊道（促进热量扩散）；④减少人为热源（清洁能源替代）。</p>
    <p>4. <strong>厦门实践</strong>：厦门通过"海绵城市"建设（增加绿地水体）、环岛路防风林带（通风廊道）、建筑立面浅色化等措施，有效缓解了城市热岛效应。</p>
    <p style="margin-top:8px;color:#dc2626;">📌 本实验控制照射强度和时间不变，只改变下垫面类型，观察温度变化规律的差异。水泥地面升温最快，代表城市；草地/水面升温慢，代表绿地水体对热岛的缓解作用。</p>`;}}
function s005Clr(){window._s005R=[];s005Rdr();const el=document.getElementById('s005Con');if(el)el.style.display='none';}


// ==================== s006 工业区位选择分析实验 ====================
function initS006Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#faf5ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#7c3aed;margin:0;">🏭 工业区位选择分析实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：待选工业类型、评价因子体系 ← 不变 &nbsp;|&nbsp;
        自变量：候选厂址（A/B/C三处） ← 可调节 &nbsp;|&nbsp;
        因变量：总分、最优选址 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#faf5ff;border:1px solid #c4b5fd;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#6d28d9;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#7c3aed;line-height:1.7;">
            <li>评价因子：原料、市场、能源、劳动力、交通、环境</li>
            <li>各因子满分均为10分</li>
            <li>工业类型固定（饮料/钢铁/电子）</li>
          </ul>
        </div>
        <div style="background:#faf5ff;border:1px solid #a78bfa;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#6d28d9;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#7c3aed;line-height:1.7;">
            候选厂址（A/B/C)<br/>选择不同工业类型
          </div>
        </div>
        <div style="background:#faf5ff;border:1px solid #f59e0b;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">
            各因子评分（分）<br/>总分（分）<br/>最优选址
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="340" viewBox="0 0 500 340" style="background:#faf5ff;border-radius:8px;border:1px solid #c4b5fd;">
            <text x="250" y="18" text-anchor="middle" fill="#6d28d9" font-size="12" font-weight="700">工业区位评价雷达图（<tspan id="s006Title">饮料厂</tspan>）</text>
            <!-- 雷达图网格 -->
            <g id="radarGrid">
              <polygon points="250,60 403,170 403,290 250,330 97,290 97,170" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
              <polygon points="250,100 343,183 343,267 250,300 157,267 157,183" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
              <polygon points="250,140 283,197 283,243 250,270 217,243 217,197" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
            </g>
            <!-- 轴线 -->
            <line x1="250" y1="170" x2="250" y2="60" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="250" y="50" text-anchor="middle" fill="#6d28d9" font-size="8" font-weight="700">原料</text>
            <line x1="343" y1="197" x2="403" y2="170" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="455" y="165" fill="#6d28d9" font-size="8" font-weight="700">市场</text>
            <line x1="343" y1="243" x2="403" y2="290" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="455" y="300" fill="#6d28d9" font-size="8" font-weight="700">能源</text>
            <line x1="250" y1="270" x2="250" y2="330" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="250" y="340" text-anchor="middle" fill="#6d28d9" font-size="8" font-weight="700">劳动力</text>
            <line x1="157" y1="243" x2="97" y2="290" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="45" y="300" fill="#6d28d9" font-size="8" font-weight="700">交通</text>
            <line x1="157" y1="197" x2="97" y2="170" stroke="#94a3b8" stroke-width="0.8"/>
            <text x="45" y="165" fill="#6d28d9" font-size="8" font-weight="700">环境</text>
            <!-- 雷达图数据区 -->
            <polygon id="radarA" points="250,60 403,170 403,290 250,330 97,290 97,170" fill="#ef444420" stroke="#ef4444" stroke-width="1.5" opacity="0"/>
            <polygon id="radarB" points="250,60 403,170 403,290 250,330 97,290 97,170" fill="#3b82f620" stroke="#3b82f6" stroke-width="1.5" opacity="0"/>
            <polygon id="radarC" points="250,60 403,170 403,290 250,330 97,290 97,170" fill="#22c55e20" stroke="#22c55e" stroke-width="1.5" opacity="0"/>
            <text x="250" y="165" text-anchor="middle" fill="#dc2626" font-size="9" font-weight="700" id="s006Result">请选择工业类型查看评分</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#faf5ff;color:#7c3aed;border:1px solid #c4b5fd;" onclick="s006Set('drink')">🥤 饮料厂</button>
            <button class="sim-btn" style="background:#faf5ff;color:#7c3aed;border:1px solid #c4b5fd;" onclick="s006Set('steel')">⚙️ 钢铁厂</button>
            <button class="sim-btn" style="background:#faf5ff;color:#7c3aed;border:1px solid #c4b5fd;" onclick="s006Set('tech')">💻 电子厂</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 选择工业类型（自变量）</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="sim-btn" style="background:#faf5ff;color:#6d28d9;text-align:left;padding:8px 10px;" onclick="s006Set('drink')">
                <div style="font-weight:700;font-size:12px;">🥤 饮料厂（市场指向型）</div>
                <div style="font-size:10px;color:#7c3aed;">产品运输不便，须接近消费市场</div>
              </button>
              <button class="sim-btn" style="background:#faf5ff;color:#6d28d9;text-align:left;padding:8px 10px;" onclick="s006Set('steel')">
                <div style="font-weight:700;font-size:12px;">⚙️ 钢铁厂（原料/动力指向型）</div>
                <div style="font-size:10px;color:#7c3aed;">原料和产品均笨重，须接近原料地或交通干线</div>
              </button>
              <button class="sim-btn" style="background:#faf5ff;color:#6d28d9;text-align:left;padding:8px 10px;" onclick="s006Set('tech')">
                <div style="font-weight:700;font-size:12px;">💻 高科技电子厂（技术指向型）</div>
                <div style="font-size:10px;color:#7c3aed;">须接近高等院校和科研机构，高素质人才密集区</div>
              </button>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 厂址评分表</h4>
            <table class="data-table" id="s006TB">
              <thead><tr><th>厂址</th><th>原料</th><th>市场</th><th>交通</th><th>总分</th></tr></thead>
              <tbody id="s006TBb">
                <tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:8px;">选择工业类型后显示评分</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s006Rec()">📝 记录评分</button>
              <button class="sim-btn sim-btn-success" onclick="s006Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s006Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s006Con" class="conclusion-box"></div>
    </div>`;
  window._s006R=[];
  s006Set('drink');
}

const _s006Data={
  drink:{
    name:'饮料厂',
    A:{raw:3,market:10,energy:7,labor:6,trans:8,env:7,tot:41},
    B:{raw:6,market:8,energy:7,labor:7,trans:9,env:6,tot:43},
    C:{raw:4,market:9,energy:8,labor:5,trans:7,env:8,tot:41}
  },
  steel:{
    name:'钢铁厂',
    A:{raw:10,market:5,energy:9,labor:6,trans:8,env:3,tot:41},
    B:{raw:7,market:7,energy:7,labor:7,trans:9,env:4,tot:41},
    C:{raw:8,market:6,energy:10,labor:5,trans:7,env:2,tot:38}
  },
  tech:{
    name:'电子厂',
    A:{raw:5,market:8,energy:6,labor:9,trans:7,env:6,tot:41},
    B:{raw:4,market:9,energy:5,labor:10,trans:8,env:7,tot:43},
    C:{raw:3,market:7,energy:6,labor:8,trans:9,env:5,tot:38}
  }
};

function s006Set(type){
  window._s006Cur=type;
  const d=_s006Data[type]; if(!d)return;
  const t=document.getElementById('s006Title');
  if(t)t.textContent=d.name+'——厂址评分';
  // 更新表格
  const tb=document.getElementById('s006TBb');
  if(tb)tb.innerHTML=`<tr>
    <td>A址</td><td>${d.A.raw}</td><td>${d.A.market}</td><td>${d.A.trans}</td><td><strong>${d.A.tot}</strong></td>
  </tr><tr>
    <td>B址</td><td>${d.B.raw}</td><td>${d.B.market}</td><td>${d.B.trans}</td><td><strong>${d.B.tot}</strong></td>
  </tr><tr>
    <td>C址</td><td>${d.C.raw}</td><td>${d.C.market}</td><td>${d.C.trans}</td><td><strong>${d.C.tot}</strong></td>
  </tr>`;
  const rt=document.getElementById('s006Result');
  const best=d.A.tot>=d.B.tot&&d.A.tot>=d.C.tot?'A':d.B.tot>=d.C.tot?'B':'C';
  if(rt)rt.textContent=`最优选址：${best}址（总分${Math.max(d.A.tot,d.B.tot,d.C.tot)}分）`;
}

function s006Rec(){
  window._s006R=window._s006R||[];
  const t=window._s006Cur||'drink';
  const d=_s006Data[t];
  const best=d.A.tot>=d.B.tot&&d.A.tot>=d.C.tot?'A':d.B.tot>=d.C.tot?'B':'C';
  window._s006R.push({type:d.name,best:best,score:Math.max(d.A.tot,d.B.tot,d.C.tot)});
  s006Rdr();
}
function s006Rdr(){const tb=document.getElementById('s006TBb');if(!tb)return;if(window._s006R.length===0){tb.innerHTML='<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:8px;">选择工业类型后显示评分</td></tr>';return;}tb.innerHTML=window._s006R.map(r=>`<tr><td>${r.type}</td><td>${r.best}址</td><td>${r.score}</td><td colspan="2">已记录</td></tr>`).join('');}
function s006Ana(){const el=document.getElementById('s006Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>工业区位因子</strong>：①自然因素（土地、水源、原料、能源）；②经济因素（市场、交通、劳动力、科技）；③社会因素（政策、个人偏好、工业惯性）；④环境因素（污染型工业须远离居民区）。</p>
    <p>2. <strong>工业类型与区位偏好</strong>：①原料指向型（制糖、水产品）——接近原料地；②市场指向型（饮料、家具）——接近消费市场；③动力指向型（电解铝）——接近能源基地；④劳动力指向型（纺织、电子装配）——接近廉价劳动力丰富地区；⑤技术指向型（集成电路、生物制药）——接近高教和科研机构密集区。</p>
    <p>3. <strong>厦门工业区位优势</strong>：港口条件优越（交通便利）、对外开放早（政策优势）、毗邻台湾（合作优势）、环境优美（适宜高新技术产业），适合发展电子信息、现代物流、高端制造等产业。</p>
    <p>4. <strong>工业4.0趋势</strong>：智能制造、个性化定制、数据驱动决策成为新趋势，工业区位对高素质人才和高速信息基础设施的依赖显著增强。</p>
    <p style="margin-top:8px;color:#7c3aed;">📌 本实验控制评价因子体系和满分标准不变，只改变工业类型，观察不同工业类型的区位偏好差异，学习因地制宜选择工业区位的方法。</p>`;}}
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
        控制变量：作物种类（水稻）、种植密度 ← 不变 &nbsp;|&nbsp;
        自变量：土壤类型、灌溉方式 ← 可调节 &nbsp;|&nbsp;
        因变量：发芽率、株高、产量 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#166534;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#15803d;line-height:1.7;">
            <li>作物种类：水稻</li>
            <li>种植密度：相同</li>
            <li>光照时间：相同</li>
          </ul>
        </div>
        <div style="background:#f0fdf4;border:1px solid #4ade80;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#166534;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#15803d;line-height:1.7;">
            土壤类型（砂土/黏土/壤土）<br/>灌溉方式（漫灌/喷灌/滴灌）
          </div>
        </div>
        <div style="background:#f0fdf4;border:1px solid #f59e0b;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">
            发芽率（%）<br/>株高（cm）<br/>产量（kg/亩）
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="320" viewBox="0 0 500 320" style="background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
            <text x="250" y="18" text-anchor="middle" fill="#166534" font-size="12" font-weight="700">不同土壤与灌溉方式的作物生长对比</text>
            <!-- 土壤类型图示 -->
            <rect x="40" y="50" width="140" height="100" fill="#fefce8" rx="8" stroke="#a16207" stroke-width="1.5"/>
            <text x="110" y="80" text-anchor="middle" fill="#92400e" font-size="10" font-weight="700">砂土</text>
            <text x="110" y="98" text-anchor="middle" fill="#a16207" font-size="8">保水性差</text>
            <text x="110" y="112" text-anchor="middle" fill="#a16207" font-size="8">通气性优</text>
            <text x="110" y="130" text-anchor="middle" fill="#dc2626" font-size="8">⚠️ 产量较低</text>
            <rect x="200" y="50" width="140" height="100" fill="#f0f9ff" rx="8" stroke="#3b82f6" stroke-width="1.5"/>
            <text x="270" y="80" text-anchor="middle" fill="#1d4ed" font-size="10" font-weight="700">黏土</text>
            <text x="270" y="98" text-anchor="middle" fill="#2563eb" font-size="8">保水性优</text>
            <text x="270" y="112" text-anchor="middle" fill="#2563eb" font-size="8">通气性差</text>
            <text x="270" y="130" text-anchor="middle" fill="#dc2626" font-size="8">⚠️ 排水不良</text>
            <rect x="360" y="50" width="140" height="100" fill="#f0fdf4" rx="8" stroke="#22c55e" stroke-width="1.5"/>
            <text x="430" y="80" text-anchor="middle" fill="#166534" font-size="10" font-weight="700">壤土</text>
            <text x="430" y="98" text-anchor="middle" fill="#15803d" font-size="8">砂黏比例适中</text>
            <text x="430" y="112" text-anchor="middle" fill="#15803d" font-size="8">保水通气均优</text>
            <text x="430" y="130" text-anchor="middle" fill="#16a34a" font-size="8">✅ 产量最高</text>
            <!-- 灌溉方式 -->
            <rect x="40" y="170" width="140" height="100" fill="#eff6ff" rx="8" stroke="#60a5fa" stroke-width="1.5"/>
            <text x="110" y="200" text-anchor="middle" fill="#1d4ed" font-size="10" font-weight="700">漫灌</text>
            <text x="110" y="220" text-anchor="middle" fill="#64748b" font-size="8">水利用率：40%</text>
            <text x="110" y="234" text-anchor="middle" fill="#dc2626" font-size="8">⚠️ 浪费严重</text>
            <rect x="200" y="170" width="140" height="100" fill="#eff6ff" rx="8" stroke="#60a5fa" stroke-width="1.5"/>
            <text x="270" y="200" text-anchor="middle" fill="#1d4ed" font-size="10" font-weight="700">喷灌</text>
            <text x="270" y="220" text-anchor="middle" fill="#64748b" font-size="8">水利用率：70%</text>
            <text x="270" y="234" text-anchor="middle" fill="#16a34a" font-size="8">✅ 效率较好</text>
            <rect x="360" y="170" width="140" height="100" fill="#eff6ff" rx="8" stroke="#60a5fa" stroke-width="1.5"/>
            <text x="430" y="200" text-anchor="middle" fill="#1d4ed" font-size="10" font-weight="700">滴灌</text>
            <text x="430" y="220" text-anchor="middle" fill="#64748b" font-size="8">水利用率：90%</text>
            <text x="430" y="234" text-anchor="middle" fill="#16a34a" font-size="8">✅ 节水最优</text>
            <text x="250" y="300" text-anchor="middle" fill="#166534" font-size="9" id="s007Result">点击按钮查看农业技术改良效果</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;" onclick="s007Set('soil')">🌱 土壤改良对比</button>
            <button class="sim-btn" style="background:#f0fdf4;color:#166534;border:1px solid #bbf7d0;" onclick="s007Set('irrig')">💧 灌溉技术对比</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 选择实验组别（自变量）</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;text-align:left;padding:8px 10px;" onclick="s007Set('soil')">
                <div style="font-weight:700;font-size:12px;">🌱 土壤类型对比</div>
                <div style="font-size:10px;color:#15803d;">比较砂土/黏土/壤土对作物生长的影响</div>
              </button>
              <button class="sim-btn" style="background:#eff6ff;color:#1d4ed;text-align:left;padding:8px 10px;" onclick="s007Set('irrig')">
                <div style="font-weight:700;font-size:12px;">💧 灌溉方式对比</div>
                <div style="font-size:10px;color:#2563eb;">比较漫灌/喷灌/滴灌的水利用效率</div>
              </button>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 农业生产记录表</h4>
            <table class="data-table" id="s007TB">
              <thead><tr><th>处理</th><th>发芽率</th><th>株高</th><th>产量</th></tr></thead>
              <tbody id="s007TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击实验按钮添加数据</td></tr>
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

const _s007SoilData=[
  {type:'砂土',ger:65,height:75,yield:320},
  {type:'黏土',ger:70,height:80,yield:380},
  {type:'壤土',ger:85,height:95,yield:480}
];
const _s007IrrigData=[
  {type:'漫灌',util:40,height:80,yield:380},
  {type:'喷灌',util:70,height:90,yield:440},
  {type:'滴灌',util:90,height:98,yield:510}
];

function s007Set(group){
  window._s007Cur=group;
  const rt=document.getElementById('s007Result');
  if(group==='soil'&&rt)rt.textContent='土壤改良：壤土产量最高（480kg/亩），砂土最低（320kg/亩）';
  if(group==='irrig'&&rt)rt.textContent='灌溉改良：滴灌水利用率90%，产量最高（510kg/亩）';
}

function s007Rec(){
  window._s007R=window._s007R||[];
  _s007SoilData.forEach(d=>window._s007R.push({type:d.type,ger:d.ger,height:d.height,yield:d.yield}));
  _s007IrrigData.forEach(d=>window._s007R.push({type:d.type,ger:'--',height:d.height,yield:d.yield}));
  s007Rdr();
}
function s007Rdr(){const tb=document.getElementById('s007TBb');if(!tb)return;if(window._s007R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击实验按钮添加数据</td></tr>';return;}tb.innerHTML=window._s007R.map(r=>`<tr><td>${r.type}</td><td>${r.ger}</td><td>${r.height}</td><td>${r.yield}</td></tr>`).join('');}
function s007Ana(){const el=document.getElementById('s007Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>农业区位自然因素</strong>：气候（光照、热量、降水）、地形（平坦利于耕作）、土壤（肥力、质地）、水源（灌溉保障）是决定农业生产的基本因素。壤土（砂黏比例适中）是最适宜农业的土壤类型。</p>
    <p>2. <strong>农业技术改良</strong>：①温室技术（控制温度，反季节生产）；②滴灌技术（精准供水，水利用率从40%提升至90%）；③转基因技术（抗虫、抗旱、高产）；④生态农业（良性循环，减少化肥农药使用）。</p>
    <p>3. <strong>厦门特色农业</strong>：厦门属于亚热带季风气候，适合发展亚热带水果（火龙果、香蕉）、蔬菜大棚、水产养殖等。现代农业产业园通过"设施农业+智慧农业"大幅提高土地产出率。</p>
    <p>4. <strong>国家在粮食安全中的战略</strong>：严守18亿亩耕地红线、建设高标准农田、推广良种良法、发展智慧农业，是保障粮食安全的核心举措。</p>
    <p style="margin-top:8px;color:#16a34a;">📌 本实验控制作物种类和种植密度不变，只改变土壤类型和灌溉方式，观察农业技术改良对作物产量的影响。壤土+滴灌组合产量最高，是现代农业推荐方案。</p>`;}}
function s007Clr(){window._s007R=[];s007Rdr();const el=document.getElementById('s007Con');if(el)el.style.display='none';}


// ==================== s008 全球气候变化与温室效应模拟实验 ====================
function initS008Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#eff6ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#1d4ed;margin:0;">🌍 全球气候变化与温室效应模拟实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：照射强度（500W台灯）、照射时间（20min） ← 不变 &nbsp;|&nbsp;
        自变量：CO₂浓度 ← 可调节（正常/加倍） &nbsp;|&nbsp;
        因变量：升温幅度、最高温度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;">
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🔒 控制变量</div>
          <ul style="margin:0;padding-left:16px;font-size:11px;color:#2563eb;line-height:1.7;">
            <li>照射强度：500W</li>
            <li>照射时间：20分钟</li>
            <li>盒子大小、密封性一致</li>
          </ul>
        </div>
        <div style="background:#eff6ff;border:1px solid #3b82f6;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#1d4ed;font-weight:700;margin-bottom:4px;">🎛️ 自变量</div>
          <div style="font-size:11px;color:#2563eb;line-height:1.7;">
            CO₂浓度<br/>（正常350ppm / 加倍700ppm）
          </div>
        </div>
        <div style="background:#eff6ff;border:1px solid #f59e0b;border-radius:8px;padding:10px;">
          <div style="font-size:11px;color:#92400e;font-weight:700;margin-bottom:4px;">👁️ 因变量</div>
          <div style="font-size:11px;color:#92400e;line-height:1.7;">
            升温幅度（°C）<br/>最高温度（°C）<br/>保温效果（降温速度）
          </div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:380px;">
          <svg width="100%" height="320" viewBox="0 0 500 320" style="background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
            <text x="250" y="18" text-anchor="middle" fill="#1d4ed" font-size="12" font-weight="700">温室效应实验：不同CO₂浓度下温度变化</text>
            <!-- 坐标轴 -->
            <line x1="60" y1="290" x2="460" y2="290" stroke="#94a3b8" stroke-width="1.5"/>
            <line x1="60" y1="290" x2="60" y2="50" stroke="#94a3b8" stroke-width="1.5"/>
            <text x="250" y="315" text-anchor="middle" fill="#64748b" font-size="8">时间（min）</text>
            <text x="55" y="170" fill="#64748b" font-size="8" transform="rotate(-90,55,170)">温度（°C）</text>
            <!-- 刻度 -->
            <text x="60" y="300" fill="#94a3b8" font-size="7">25</text>
            <text x="60" y="230" fill="#94a3b8" font-size="7">27.5</text>
            <text x="60" y="160" fill="#94a3b8" font-size="7">30</text>
            <text x="60" y="90" fill="#94a3b8" font-size="7">32.5</text>
            <text x="60" y="55" fill="#94a3b8" font-size="7">35</text>
            <!-- 时间刻度 -->
            <text x="60" y="305" fill="#94a3b8" font-size="7">0</text>
            <text x="143" y="305" fill="#94a3b8" font-size="7">5</text>
            <text x="226" y="305" fill="#94a3b8" font-size="7">10</text>
            <text x="310" y="305" fill="#94a3b8" font-size="7">15</text>
            <text x="393" y="305" fill="#94a3b8" font-size="7">20</text>
            <!-- 正常CO2曲线 -->
            <polyline id="lineNormal" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linejoin="round"
              points="60,230 143,207 226,190 310,175 393,165 460,175"/>
            <!-- 加倍CO2曲线 -->
            <polyline id="lineDouble" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="6,3"
              points="60,230 143,200 226,178 310,158 393,142 460,150"/>
            <!-- 图例 -->
            <rect x="360" y="55" width="14" height="10" fill="#22c55e" rx="2"/><text x="380" y="63" fill="#166534" font-size="8">正常CO₂（350ppm）</text>
            <rect x="360" y="70" width="14" height="10" fill="none" stroke="#ef4444" stroke-width="1.5" rx="2"/><text x="380" y="78" fill="#dc2626" font-size="8">CO₂加倍（700ppm）</text>
            <text x="250" y="40" text-anchor="middle" fill="#1d4ed" font-size="9" font-weight="700" id="s008Result">CO₂加倍时升温更快、最高温更高、降温更慢</text>
          </svg>
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="sim-btn sim-btn-primary" onclick="s008Draw()">📈 绘制温度曲线</button>
            <button class="sim-btn" style="background:#eff6ff;color:#1d4ed;border:1px solid #bfdbfe;" onclick="s008Reset()">🔄 重置</button>
          </div>
        </div>
        <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:10px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 10px 0;">🎛️ 调节CO₂浓度（自变量）</h4>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="sim-btn" style="background:#f0fdf4;color:#166534;text-align:left;padding:8px 10px;" onclick="s008Select('normal')">
                <div style="font-weight:700;font-size:12px;">🟢 正常CO₂（350ppm）</div>
                <div style="font-size:10px;color:#15803d;">当前大气CO₂浓度水平</div>
              </button>
              <button class="sim-btn" style="background:#fef2f2;color:#dc2626;text-align:left;padding:8px 10px;" onclick="s008Select('double')">
                <div style="font-weight:700;font-size:12px;">🔴 CO₂加倍（700ppm）</div>
                <div style="font-size:10px;color:#ef4444;">模拟2100年预估CO₂浓度</div>
              </button>
            </div>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 温室效应实验记录表</h4>
            <table class="data-table" id="s008TB">
              <thead><tr><th>CO₂浓度</th><th>升温幅度</th><th>最高温</th><th>现象</th></tr></thead>
              <tbody id="s008TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"绘制温度曲线"添加数据</td></tr>
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

  window._s008Normal=[25,25.8,26.9,28.3,29.8,30.5,30.2,29.8,29.2,28.7,28.3,28.1,27.9,27.7,27.6,27.5,27.5,27.6,27.7,28.0,28.3];
  window._s008Double=[25,26.5,28.2,30.1,32.0,33.2,33.5,33.2,32.8,32.3,32.0,31.8,31.7,31.6,31.6,31.7,31.8,32.0,32.2,32.5,32.8];
  window._s008R=[];
  s008Draw();
}

function s008Draw(){
  // 绘制正常CO2曲线
  const pts1=window._s008Normal.map((t,i)=>`${60+i*20},${290-(t-25)*16}`).join(' ');
  const el1=document.getElementById('lineNormal');
  if(el1)el1.setAttribute('points',pts1);
  // 绘制加倍CO2曲线
  const pts2=window._s008Double.map((t,i)=>`${60+i*20},${290-(t-25)*16}`).join(' ');
  const el2=document.getElementById('lineDouble');
  if(el2)el2.setAttribute('points',pts2);
  const rt=document.getElementById('s008Result');
  if(rt)rt.textContent=`正常CO₂升温3.2°C | CO₂加倍升温5.0°C | 加倍时保温效果明显更强`;
}

function s008Select(type){
  window._s008Cur=type;
  const rt=document.getElementById('s008Result');
  if(rt)rt.textContent=type==='double'?'⚠️ CO₂加倍：升温更快、最高温更高、降温更慢！':'正常CO₂浓度：升温较缓，保温效果一般';
}

function s008Rec(){
  window._s008R=window._s008R||[];
  const n=window._s008Normal;
  const d=window._s008Double;
  window._s008R.push({
    co2:'350ppm（正常）',
    rise:(Math.max(...n)-n[0]).toFixed(1),
    max:Math.max(...n).toFixed(1),
    desc:'升温较缓'
  });
  window._s008R.push({
    co2:'700ppm（加倍）',
    rise:(Math.max(...d)-d[0]).toFixed(1),
    max:Math.max(...d).toFixed(1),
    desc:'升温显著'
  });
  s008Rdr();
}
function s008Rdr(){const tb=document.getElementById('s008TBb');if(!tb)return;if(window._s008R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击"绘制温度曲线"添加数据</td></tr>';return;}tb.innerHTML=window._s008R.map(r=>`<tr><td>${r.co2}</td><td>${r.rise}°C</td><td>${r.max}°C</td><td>${r.desc}</td></tr>`).join('');}
function s008Reset(){window._s008R=[];s008Rdr();}
function s008Ana(){const el=document.getElementById('s008Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>温室效应原理</strong>：太阳短波辐射穿过大气层到达地面，地面吸热后向外发射长波辐射（红外）。CO₂、CH₄、N₂O等温室气体能强烈吸收长波辐射，并向各方向重新辐射（其中一部分返回地面），使地球表面温度升高，类似温室玻璃的保温作用。</p>
    <p>2. <strong>CO₂浓度与温室效应强度</strong>：CO₂浓度越高，吸收长波辐射的能力越强，保温效果越显著。实验模拟显示：CO₂加倍时，升温幅度（5.0°C）明显高于正常浓度（3.2°C）。</p>
    <p>3. <strong>全球气候变化后果</strong>：①冰川融化、海平面上升（威胁沿海城市）；②极端天气事件增多（高温、暴雨、干旱、台风）；③生态系统紊乱（物种灭绝、珊瑚白化）；④农业产量波动（高纬度可能增产，低纬度普遍减产）。</p>
    <p>4. <strong>应对措施</strong>：①减排（发展清洁能源、提高能源效率、碳捕获与封存）；②增汇（植树造林、保护森林、恢复湿地）；③适应（建设韧性城市、调整农业结构）；④国际合作（《巴黎协定》：控制全球升温在2°C以内，争取1.5°C）。</p>
    <p>5. <strong>中国承诺</strong>：CO₂排放力争2030年前达到峰值（碳达峰），2060年前实现净零排放（碳中和）。厦门作为低碳试点城市，正在大力发展海上风电、光伏发电、电动公交等低碳产业。</p>
    <p style="margin-top:8px;color:#1d4ed;">📌 本实验控制照射强度和时间不变，只改变CO₂浓度，观察温室效应强度差异。CO₂加倍使地球升温幅度增加约56%，验证了温室气体排放控制的重要性。</p>`;}}
function s008Clr(){window._s008R=[];s008Rdr();const el=document.getElementById('s008Con');if(el)el.style.display='none';}

console.log('✅ s003-s008 模拟器已加载');
