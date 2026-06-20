// ============================================================
//  地理实验平台 - 剩余实验（j009, j010, s001-s008）
//  控制变量法升级版
// ============================================================

// ==================== j009 土壤剖面观察实验 ====================
function initJ009Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#fefce8';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#92400e;margin:0;">🟤 土壤剖面观察实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：观察方法、比色卡标准 ← 不变 &nbsp;|&nbsp;
        自变量：土壤层次 ← 可调节 &nbsp;|&nbsp;
        因变量：颜色、质地、有机质 ← 观察结果
      </p>
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px;">
        <div style="font-size:13px;color:#92400e;font-weight:700;margin-bottom:12px;text-align:center;">土壤剖面层次示意图</div>
        <div style="display:flex;flex-direction:column;gap:3px;">
          <div style="padding:10px;background:#8b4513;color:#fff;border-radius:4px;cursor:pointer;" onclick="j009Select('O层')">
            <div style="font-weight:700;font-size:12px;">O层（枯枝落叶层）</div>
            <div style="font-size:10px;opacity:0.9;margin-top:2px;">颜色：棕黑色 | 质地：松散 | 有机质：约80%</div>
          </div>
          <div style="padding:10px;background:#3a2718;color:#fff;border-radius:4px;cursor:pointer;" onclick="j009Select('A层')">
            <div style="font-weight:700;font-size:12px;">A层（腐殖质层）</div>
            <div style="font-size:10px;opacity:0.9;margin-top:2px;">颜色：暗黑色 | 质地：壤土 | 有机质：约5%</div>
          </div>
          <div style="padding:10px;background:#c4a97d;color:#334155;border-radius:4px;cursor:pointer;" onclick="j009Select('E层')">
            <div style="font-weight:700;font-size:12px;">E层（淋溶层）</div>
            <div style="font-size:10px;opacity:0.9;margin-top:2px;">颜色：浅黄色 | 质地：砂壤 | 有机质：约1%</div>
          </div>
          <div style="padding:10px;background:#5c4033;color:#fff;border-radius:4px;cursor:pointer;" onclick="j009Select('B层')">
            <div style="font-weight:700;font-size:12px;">B层（淀积层）</div>
            <div style="font-size:10px;opacity:0.9;margin-top:2px;">颜色：棕红色 | 质地：黏土 | 有机质：约0.5%</div>
          </div>
          <div style="padding:10px;background:#d4a76a;color:#334155;border-radius:4px;cursor:pointer;" onclick="j009Select('C层')">
            <div style="font-weight:700;font-size:12px;">C层（母质层）</div>
            <div style="font-size:10px;opacity:0.9;margin-top:2px;">颜色：杂色 | 质地：碎石 | 有机质：约0%</div>
          </div>
        </div>
        <div id="j009Info" style="margin-top:12px;padding:10px;background:#fefce8;border-radius:6px;font-size:12px;color:#92400e;line-height:1.7;">
          点击上方土壤层次查看详细特征
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 土壤观察记录表</h4>
            <table class="data-table" id="j009TB">
              <thead><tr><th>层次</th><th>颜色</th><th>质地</th><th>有机质</th></tr></thead>
              <tbody id="j009TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击土壤层次添加观察记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="j009Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="j009Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="j009Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="j009Con" class="conclusion-box"></div>
    </div>`;
  window._j009R=[];
}

const _j009Data={
  'O层':{color:'棕黑色',texture:'松散',om:'约80%',ph:'5.5',desc:'未分解的枯枝落叶，像地毯覆盖地表'},
  'A层':{color:'暗黑色',texture:'壤土',om:'约5%',ph:'5.8',desc:'有机质丰富，肥力最高，植物根系密集'},
  'E层':{color:'浅黄色',texture:'砂壤',om:'约1%',ph:'5.2',desc:'矿物质淋失，颜色较浅，透气性好'},
  'B层':{color:'棕红色',texture:'黏土',om:'约0.5%',ph:'5.0',desc:'上层淋溶物质淀积，质地黏重'},
  'C层':{color:'杂色',texture:'碎石',om:'约0%',ph:'5.5',desc:'风化物，未成土，坚硬不易挖掘'}
};

function j009Select(layer){
  window._j009Cur=layer;
  const info=document.getElementById('j009Info');
  const d=_j009Data[layer];
  if(info&&d) info.innerHTML=`<strong>${layer}</strong><br/>颜色：${d.color} | 质地：${d.texture} | 有机质：${d.om}<br/>pH：${d.ph} | 说明：${d.desc}`;
}
function j009Rec(){
  window._j009R=window._j009R||[];
  Object.keys(_j009Data).forEach(layer=>{
    const d=_j009Data[layer];
    window._j009R.push({layer:layer,color:d.color,texture:d.texture,om:d.om});
  });
  j009Rdr();
}
function j009Rdr(){const tb=document.getElementById('j009TBb');if(!tb)return;if(window._j009R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击土壤层次添加观察记录</td></tr>';return;}tb.innerHTML=window._j009R.map((r,i)=>`<tr><td>${r.layer}</td><td>${r.color}</td><td>${r.texture}</td><td>${r.om}</td></tr>`).join('');}
function j009Ana(){const el=document.getElementById('j009Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>土壤剖面分层</strong>：典型土壤剖面有O、A、E、B、C、R（基岩）六层。森林土壤的O层和A层较厚。</p>
    <p>2. <strong>有机质作用</strong>：有机质（腐殖质）能改善土壤结构、提高保水性、增加肥力。A层有机质含量最高。</p>
    <p>3. <strong>土壤形成因素</strong>：气候（温度、降水）、生物（植物、微生物）、地形、母质、时间共同作用下形成土壤。</p>
    <p style="margin-top:8px;color:#92400e;">📌 本实验控制观察方法和比色卡标准不变，只改变观察的土壤层次，分析各层特征差异。</p>`;}}
function j009Clr(){window._j009R=[];j009Rdr();const el=document.getElementById('j009Con');if(el)el.style.display='none';}

// ==================== j010 河流地貌观察实验 ====================
function initJ010Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f0f9ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#0c4a6;margin:0;">🏞️ 河流地貌观察实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：托盘坡度（15°）、沙子类型 ← 不变 &nbsp;|&nbsp;
        自变量：水量大小 ← 可调节 &nbsp;|&nbsp;
        因变量：地貌形态、河道弯曲度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;cursor:pointer;" onclick="j010Select('小水量')">
          <div style="font-weight:700;color:#0c4a6;margin-bottom:6px;">💧 小水量（5ml/s）</div>
          <div style="font-size:11px;color:#0369a1;line-height:1.6;">侵蚀：V形河谷<br/>堆积：少量堆积<br/>河道：较直</div>
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;cursor:pointer;" onclick="j010Select('中水量')">
          <div style="font-weight:700;color:#0c4a6;margin-bottom:6px;">💧💧 中水量（15ml/s）</div>
          <div style="font-size:11px;color:#0369a1;line-height:1.6;">侵蚀：深宽河谷<br/>堆积：河漫滩<br/>河道：开始弯曲</div>
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;cursor:pointer;" onclick="j010Select('大水量')">
          <div style="font-weight:700;color:#0c4a6;margin-bottom:6px;">💧💧💧 大水量（30ml/s）</div>
          <div style="font-size:11px;color:#0369a1;line-height:1.6;">侵蚀：峡谷地貌<br/>堆积：三角洲<br/>河道：河曲发达</div>
        </div>
      </div>
      <div id="j010Info" style="padding:12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:12px;color:#0c4a6;line-height:1.7;margin-bottom:16px;">
        选择水量大小查看河流地貌变化
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 地貌观察记录表</h4>
            <table class="data-table" id="j010TB">
              <thead><tr><th>水量</th><th>侵蚀地貌</th><th>堆积地貌</th><th>河道特征</th></tr></thead>
              <tbody id="j010TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击水量卡片添加观察记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="j010Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="j010Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="j010Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="j010Con" class="conclusion-box"></div>
    </div>`;
  window._j010R=[];
}

const _j010Data={
  '小水量':{erosion:'V形河谷',deposit:'少量堆积',curve:'河道较直',desc:'水流能量小，以下蚀为主'},
  '中水量':{erosion:'深宽河谷',deposit:'河漫滩',curve:'河道开始弯曲',desc:'侧蚀增强，凹岸侵蚀、凸岸堆积'},
  '大水量':{erosion:'峡谷地貌',deposit:'三角洲',curve:'河曲发达',desc:'搬运能力强，下游堆积形成三角洲'}
};

function j010Select(water){
  window._j010Cur=water;
  const info=document.getElementById('j010Info');
  const d=_j010Data[water];
  if(info&&d) info.innerHTML=`<strong>${water}</strong><br/>侵蚀地貌：${d.erosion}<br/>堆积地貌：${d.deposit}<br/>河道特征：${d.curve}<br/>说明：${d.desc}`;
}
function j010Rec(){
  window._j010R=window._j010R||[];
  Object.keys(_j010Data).forEach(water=>{
    const d=_j010Data[water];
    window._j010R.push({water:water,erosion:d.erosion,deposit:d.deposit,curve:d.curve});
  });
  j010Rdr();
}
function j010Rdr(){const tb=document.getElementById('j010TBb');if(!tb)return;if(window._j010R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击水量卡片添加观察记录</td></tr>';return;}tb.innerHTML=window._j010R.map((r,i)=>`<tr><td>${r.water}</td><td>${r.erosion}</td><td>${r.deposit}</td><td>${r.curve}</td></tr>`).join('');}
function j010Ana(){const el=document.getElementById('j010Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>河流上游</strong>：水流能量大，以<strong>下蚀</strong>为主，形成V形河谷，谷坡陡峭。</p>
    <p>2. <strong>河流中游</strong>：水流能量减弱，<strong>侧蚀</strong>增强，河道弯曲（河曲），凹岸侵蚀、凸岸堆积。</p>
    <p>3. <strong>河流下游</strong>：水流能量进一步减弱，以<strong>堆积</strong>为主，形成河漫滩、冲积平原、三角洲。</p>
    <p>4. <strong>应用</strong>：凹岸（侵蚀）适合建港口；凸岸（堆积）适合建居民区、开垦农田。</p>
    <p style="margin-top:8px;color:#0c4a6;">📌 本实验控制托盘坡度和沙子类型不变，只改变水量大小，观察河流地貌的变化规律。</p>`;}}
function j010Clr(){window._j010R=[];j010Rdr();const el=document.getElementById('j010Con');if(el)el.style.display='none';}

// ==================== s001 大气热力环流实验 ====================
function initS001Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#ecfeff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#06b6d4;margin:0;">🌊 大气热力环流实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：玻璃缸大小、薄膜密封性 ← 不变 &nbsp;|&nbsp;
        自变量：地面温差 ← 可调节 &nbsp;|&nbsp;
        因变量：烟雾流动方向、环流速度 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:8px;padding:12px;cursor:pointer;" onclick="s001Select(5)">
          <div style="font-weight:700;color:#0e7490;margin-bottom:6px;">🌡️ 温差 5°C</div>
          <div style="font-size:11px;color:#155e75;line-height:1.6;">烟雾缓慢上升<br/>环流速度：慢<br/>适合初次观察</div>
        </div>
        <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:8px;padding:12px;cursor:pointer;" onclick="s001Select(10)">
          <div style="font-weight:700;color:#0e7490;margin-bottom:6px;">🌡️ 温差 10°C</div>
          <div style="font-size:11px;color:#155e75;line-height:1.6;">烟雾中等速度流动<br/>环流速度：中<br/>现象较明显</div>
        </div>
        <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:8px;padding:12px;cursor:pointer;" onclick="s001Select(15)">
          <div style="font-weight:700;color:#0e7490;margin-bottom:6px;">🌡️ 温差 15°C</div>
          <div style="font-size:11px;color:#155e75;line-height:1.6;">烟雾快速流动<br/>环流速度：快<br/>现象非常明显</div>
        </div>
      </div>
      <div style="padding:16px;background:#ecfeff;border:1px solid #a5f3fc;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:#0e7490;font-weight:700;margin-bottom:8px;text-align:center;">热力环流示意图</div>
        <div style="display:flex;justify-content:center;align-items:center;gap:40px;flex-wrap:wrap;">
          <div style="text-align:center;">
            <div style="font-size:40px;margin-bottom:4px;">🔥</div>
            <div style="font-size:11px;color:#dc2626;font-weight:700;">热水（受热区）</div>
            <div style="font-size:10px;color:#92400e;">空气上升 → 近地面低压</div>
          </div>
          <div style="font-size:24px;color:#06b6d4;">→</div>
          <div style="text-align:center;">
            <div style="font-size:40px;margin-bottom:4px;">🧊</div>
            <div style="font-size:11px;color:#2563eb;font-weight:700;">冰块（冷却区）</div>
            <div style="font-size:10px;color:#1d4ed;">空气下沉 → 近地面高压</div>
          </div>
        </div>
        <div style="margin-top:12px;padding:8px;background:#ccfbf1;border-radius:6px;font-size:11px;color:#134e4a;line-height:1.7;text-align:center;">
          💡 <strong>原理</strong>：地面热 → 空气上升 → 高空高压 → 向冷区流动 → 冷区下沉 → 近地面流回热区 → 形成环流
        </div>
      </div>
      <div id="s001Info" style="padding:12px;background:#ecfeff;border:1px solid #a5f3fc;border-radius:6px;font-size:12px;color:#0e7490;line-height:1.7;margin-bottom:16px;">
        选择地面温差查看热力环流现象
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 热力环流记录表</h4>
            <table class="data-table" id="s001TB">
              <thead><tr><th>温差（°C）</th><th>烟雾流动</th><th>环流速度</th></tr></thead>
              <tbody id="s001TBb">
                <tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:8px;">点击温差卡片添加观察记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s001Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s001Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s001Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s001Con" class="conclusion-box"></div>
    </div>`;
  window._s001R=[];
}

function s001Select(temp){
  window._s001Cur=temp;
  const info=document.getElementById('s001Info');
  const speed=temp<=5?'慢':temp<=10?'中':'快';
  const desc=temp<=5?'烟雾缓慢上升后向冷区流动，环流圈清晰可见':temp<=10?'环流速度适中，烟雾轨迹明显':'环流快速形成，现象非常明显，适合课堂演示';
  if(info) info.innerHTML=`<strong>地面温差：${temp}°C</strong><br/>环流速度：${speed}<br/>观察描述：${desc}<br/><br/><strong>💡 实际案例</strong>：城市风（城市热岛效应）、海陆风（白天吹海风，夜间吹陆风）、山谷风（白天吹谷风，夜间吹山风）`;
}
function s001Rec(){
  window._s001R=window._s001R||[];
  [5,10,15].forEach(temp=>{
    const speed=temp<=5?'慢':temp<=10?'中':'快';
    window._s001R.push({temp:temp,speed:speed,desc:'已观察'});
  });
  s001Rdr();
}
function s001Rdr(){const tb=document.getElementById('s001TBb');if(!tb)return;if(window._s001R.length===0){tb.innerHTML='<tr><td colspan="3" style="text-align:center;color:#94a3b8;padding:8px;">点击温差卡片添加观察记录</td></tr>';return;}tb.innerHTML=window._s001R.map((r,i)=>`<tr><td>${r.temp}°C</td><td>${r.speed}</td><td>${r.desc}</td></tr>`).join('');}
function s001Ana(){const el=document.getElementById('s001Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>热力环流成因</strong>：地面冷热不均 → 空气垂直运动 → 同一水平面产生气压差 → 空气从高压流向低压 → 形成环流。</p>
    <p>2. <strong>温差与环流强度</strong>：地面温差越大，空气上升/下沉越强烈，热力环流速度越快，现象越明显。</p>
    <p>3. <strong>实际案例</strong>：①城市风——城市温度高（热岛效应），空气上升，郊区空气下沉补充，形成从郊区吹向城市的热力环流；②海陆风——白天陆地升温快（低压），海洋升温慢（高压），吹海风；夜间相反，吹陆风。</p>
    <p style="margin-top:8px;color:#06b6d4;">📌 本实验控制玻璃缸大小和薄膜密封性不变，只改变地面温差，观察热力环流的速度变化规律。</p>`;}}
function s001Clr(){window._s001R=[];s001Rdr();const el=document.getElementById('s001Con');if(el)el.style.display='none';}

// ==================== s002 水循环模拟实验 ====================
function initS002Simulator(){
  const C=document.getElementById('simCanvas'); if(!C)return;
  C.innerHTML=''; C.style.background='#f0f9ff';
  C.innerHTML=`
    <div class="exp-container">
      <div class="exp-header">
        <h3 style="color:#0ea5e9;margin:0;">💧 水循环模拟实验（控制变量法）</h3>
        <span class="exp-badge">控制变量法实验</span>
      </div>
      <p style="color:#64748b;font-size:12px;margin:0 0 12px 0;">
        控制变量：盒子大小、水量（2cm深） ← 不变 &nbsp;|&nbsp;
        自变量：加热强度 ← 可调节 &nbsp;|&nbsp;
        因变量：蒸发量、凝结水量 ← 观察结果
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-bottom:16px;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;cursor:pointer;" onclick="s002Select(0)">
          <div style="font-weight:700;color:#1d4ed;margin-bottom:6px;">☀️ 无照射</div>
          <div style="font-size:11px;color:#0369a1;">蒸发：0.5 ml/h<br/>凝结：0.3 ml/h</div>
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;cursor:pointer;" onclick="s002Select(100)">
          <div style="font-weight:700;color:#1d4ed;margin-bottom:6px;">💡 弱光（100W）</div>
          <div style="font-size:11px;color:#0369a1;">蒸发：2.1 ml/h<br/>凝结：1.8 ml/h</div>
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;cursor:pointer;" onclick="s002Select(200)">
          <div style="font-weight:700;color:#1d4ed;margin-bottom:6px;">🔆 中光（200W）</div>
          <div style="font-size:11px;color:#0369a1;">蒸发：5.3 ml/h<br/>凝结：4.2 ml/h</div>
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px;cursor:pointer;" onclick="s002Select(500)">
          <div style="font-weight:700;color:#1d4ed;margin-bottom:6px;">🔥 强光（500W）</div>
          <div style="font-size:11px;color:#0369a1;">蒸发：10.8 ml/h<br/>凝结：8.5 ml/h</div>
        </div>
      </div>
      <div style="padding:16px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;margin-bottom:16px;">
        <div style="font-size:12px;color:#0c4a6;font-weight:700;margin-bottom:8px;text-align:center;">水循环示意图</div>
        <div style="display:flex;justify-content:space-around;align-items:center;flex-wrap:wrap;gap:10px;">
          <div style="text-align:center;">
            <div style="font-size:11px;color:#1d4ed;font-weight:700;">蒸发 ↑</div>
            <div style="font-size:11px;color:#0369a1;">海洋/湖泊</div>
          </div>
          <div style="font-size:20px;color:#0ea5e9;">→</div>
          <div style="text-align:center;">
            <div style="font-size:11px;color:#1d4ed;font-weight:700;">水汽输送 →</div>
            <div style="font-size:11px;color:#0369a1;">大气运动</div>
          </div>
          <div style="font-size:20px;color:#0ea5e9;">→</div>
          <div style="text-align:center;">
            <div style="font-size:11px;color:#dc2626;font-weight:700;">降水 ↓</div>
            <div style="font-size:11px;color:#92400e;">云层凝结</div>
          </div>
          <div style="font-size:20px;color:#0ea5e9;">→</div>
          <div style="text-align:center;">
            <div style="font-size:11px;color:#16a34a;font-weight:700;">径流 →</div>
            <div style="font-size:11px;color:#15803d;">地表/地下径流</div>
          </div>
        </div>
      </div>
      <div id="s002Info" style="padding:12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:12px;color:#0c4a6;line-height:1.7;margin-bottom:16px;">
        选择加热强度查看水循环各环节强度
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:280px;">
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;">
            <h4 style="font-size:13px;color:#334155;margin:0 0 8px 0;">📝 水循环记录表</h4>
            <table class="data-table" id="s002TB">
              <thead><tr><th>加热强度</th><th>蒸发量（ml/h）</th><th>凝结水量（ml/h）</th><th>径流量（ml/h）</th></tr></thead>
              <tbody id="s002TBb">
                <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击加热强度卡片添加观察记录</td></tr>
              </tbody>
            </table>
            <div style="margin-top:8px;display:flex;gap:6px;">
              <button class="sim-btn sim-btn-primary" onclick="s002Rec()">📝 记录数据</button>
              <button class="sim-btn sim-btn-success" onclick="s002Ana()">📊 分析规律</button>
              <button class="sim-btn" onclick="s002Clr()">🗑️ 清空</button>
            </div>
          </div>
        </div>
      </div>
      <div id="s002Con" class="conclusion-box"></div>
    </div>`;
  window._s002R=[];
}

const _s002Data={
  0:{evap:0.5,cond:0.3,run:0.1},
  100:{evap:2.1,cond:1.8,run:0.5},
  200:{evap:5.3,cond:4.2,run:1.2},
  500:{evap:10.8,cond:8.5,run:3.5}
};

function s002Select(watt){
  window._s002Cur=watt;
  const info=document.getElementById('s002Info');
  const d=_s002Data[watt];
  if(info&&d) info.innerHTML=`<strong>加热强度：${watt}W</strong><br/>蒸发量：${d.evap} ml/h<br/>凝结水量：${d.cond} ml/h<br/>径流量：${d.run} ml/h<br/><br/><strong>💡 规律</strong>：加热强度越大，蒸发、凝结、径流各环节越活跃，水循环速度越快。`;
}
function s002Rec(){
  window._s002R=window._s002R||[];
  Object.keys(_s002Data).forEach(watt=>{
    const d=_s002Data[watt];
    window._s002R.push({watt:watt+'W',evap:d.evap,cond:d.cond,run:d.run});
  });
  s002Rdr();
}
function s002Rdr(){const tb=document.getElementById('s002TBb');if(!tb)return;if(window._s002R.length===0){tb.innerHTML='<tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:8px;">点击加热强度卡片添加观察记录</td></tr>';return;}tb.innerHTML=window._s002R.map((r,i)=>`<tr><td>${r.watt}</td><td>${r.evap}</td><td>${r.cond}</td><td>${r.run}</td></tr>`).join('');}
function s002Ana(){const el=document.getElementById('s002Con');if(el){el.style.display='block';el.innerHTML=`
    <p>✅ <strong>控制变量法分析结论：</strong></p>
    <p>1. <strong>水循环动力</strong>：太阳辐射是水循环的主要能量来源，重力是水分向下运动（降水、下渗、径流）的原因。</p>
    <p>2. <strong>加热强度影响</strong>：加热强度越大，蒸发量越大，水汽输送越多，降水量越多，径流量越大——水循环各环节相互关联，同步增强。</p>
    <p>3. <strong>水循环类型</strong>：①海陆间循环（大循环）——的水量最大，使陆地获得淡水资源补给；②海上内循环；③陆地内循环。</p>
    <p>4. <strong>人类活动影响</strong>：城市化（下渗减少、地表径流增加）、跨流域调水（南水北调）、人工增雨等。</p>
    <p style="margin-top:8px;color:#0ea5e9;">📌 本实验控制盒子大小和水量不变，只改变加热强度，观察水循环各环节的变化规律。</p>`;}}
function s002Clr(){window._s002R=[];s002Rdr();const el=document.getElementById('s002Con');if(el)el.style.display='none';}

console.log('✅ s001-s002 模拟器已加载');
