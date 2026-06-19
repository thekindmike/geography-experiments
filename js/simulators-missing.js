// ==================== 补充模拟器函数 ====================
// 为所有尚未配置模拟器的实验添加交互功能

// ==================== j005 海陆分布对气压带的影响 ====================
function initMarineEffectSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#f0f9ff';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🌊 海陆分布对气压带的影响</h3>
        <div style="display:flex;gap:20px;width:100%;max-width:900px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:400px;">
                <svg id="marineSvg" width="400" height="300" viewBox="0 0 400 300" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <!-- 海陆分布示意图 -->
                    <rect x="0" y="0" width="400" height="300" fill="#e0f2fe"/>
                    <!-- 陆地 -->
                    <path d="M 50 50 L 180 50 L 180 250 L 50 250 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/>
                    <text x="115" y="155" text-anchor="middle" fill="#166534" font-size="14" font-weight="700">陆地</text>
                    <text x="115" y="175" text-anchor="middle" fill="#166534" font-size="11">比热容小</text>
                    <!-- 海洋 -->
                    <path d="M 220 50 L 350 50 L 350 250 L 220 250 Z" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
                    <text x="285" y="155" text-anchor="middle" fill="#1e40af" font-size="14" font-weight="700">海洋</text>
                    <text x="285" y="175" text-anchor="middle" fill="#1e40af" font-size="11">比热容大</text>
                    <!-- 太阳 -->
                    <circle cx="200" cy="30" r="20" fill="#fbbf24"/>
                    <text x="200" y="35" text-anchor="middle" fill="#92400e" font-size="11" font-weight="700">太阳</text>
                    <!-- 箭头：太阳辐射 -->
                    <line x1="200" y1="50" x2="115" y2="50" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowYellow)"/>
                    <line x1="200" y1="50" x2="285" y2="50" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowYellow)"/>
                    <!-- 温度显示 -->
                    <text id="landTemp" x="115" y="220" text-anchor="middle" fill="#dc2626" font-size="18" font-weight="700">28°C</text>
                    <text id="seaTemp" x="285" y="220" text-anchor="middle" fill="#2563eb" font-size="18" font-weight="700">25°C</text>
                    <!-- 气压 -->
                    <text id="landPress" x="115" y="245" text-anchor="middle" fill="#7c3aed" font-size="13">气压：低</text>
                    <text id="seaPress" x="285" y="245" text-anchor="middle" fill="#7c3aed" font-size="13">气压：高</text>
                    <!-- 风向 -->
                    <path id="windArrow" d="M 200 150 L 170 150" stroke="#ef4444" stroke-width="3" marker-end="url(#arrowRed)" opacity="0"/>
                    <text id="windLabel" x="200" y="140" text-anchor="middle" fill="#ef4444" font-size="12" opacity="0">海风→</text>
                    <defs>
                        <marker id="arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#f59e0b"/>
                        </marker>
                        <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#ef4444"/>
                        </marker>
                    </defs>
                </svg>
            </div>
            <div style="flex:1;min-width:300px;">
                <div id="marineChart" style="width:100%;height:300px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;">
                    <canvas id="marineCanvas" width="350" height="280" style="max-width:100%;"></canvas>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    // 绘制温度对比图表
    function drawMarineChart(landT, seaT) {
        const c = document.getElementById('marineCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const times = ['6:00', '9:00', '12:00', '15:00', '18:00', '21:00'];
        const landData = [22, 25, 28, 27, 24, 22];
        const seaData = [22, 23, 25, 26, 25, 23];
        
        const padding = {top: 30, right: 20, bottom: 40, left: 45};
        const chartW = c.width - padding.left - padding.right;
        const chartH = c.height - padding.top - padding.bottom;
        
        // 网格线
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const y = padding.top + (i / 10) * chartH;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(c.width - padding.right, y);
            ctx.stroke();
        }
        
        // 坐标轴
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, c.height - padding.bottom);
        ctx.lineTo(c.width - padding.right, c.height - padding.bottom);
        ctx.stroke();
        
        // 标签
        ctx.fillStyle = '#475569';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        times.forEach((t, i) => {
            const x = padding.left + (i / (times.length - 1)) * chartW;
            ctx.fillText(t, x, c.height - padding.bottom + 15);
        });
        
        ctx.textAlign = 'right';
        for (let t = 20; t <= 30; t += 2) {
            const y = padding.top + chartH - ((t - 20) / 10) * chartH;
            ctx.fillText(t + '°', padding.left - 5, y + 4);
        }
        
        // 标题
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('海陆气温日变化对比', c.width / 2, 18);
        
        // 绘制曲线
        function drawLine(data, color, label) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            data.forEach((val, i) => {
                const x = padding.left + (i / (data.length - 1)) * chartW;
                const y = padding.top + chartH - ((val - 20) / 10) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            
            // 图例
            const lx = padding.left + 20 + (color === '#dc2626' ? 0 : 100);
            ctx.fillStyle = color;
            ctx.fillRect(lx, padding.top - 10, 14, 3);
            ctx.fillStyle = '#475569';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(label, lx + 18, padding.top - 7);
        }
        
        drawLine(landData, '#dc2626', '陆地');
        drawLine(seaData, '#2563eb', '海洋');
    }
    
    drawMarineChart();
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;color:var(--gray-600);">白天：陆地升温快→气压低→海风吹向陆地</span>
            <button class="sim-btn" onclick="toggleMarineMode()">🌙 切换夜间模式</button>
            <button class="sim-btn" onclick="resetMarineSim()">🔄 重置</button>
        `;
    }
    
    window._marineNight = false;
    window.toggleMarineMode = function() {
        window._marineNight = !window._marineNight;
        const landT = document.getElementById('landTemp');
        const seaT = document.getElementById('seaTemp');
        const landP = document.getElementById('landPress');
        const seaP = document.getElementById('seaPress');
        const windA = document.getElementById('windArrow');
        const windL = document.getElementById('windLabel');
        
        if (window._marineNight) {
            landT.textContent = '18°C';
            seaT.textContent = '22°C';
            landP.textContent = '气压：高';
            seaP.textContent = '气压：低';
            windA.setAttribute('d', 'M 200 150 L 230 150');
            windA.setAttribute('opacity', '1');
            windL.textContent = '←陆风';
            windL.setAttribute('opacity', '1');
            if (controls) controls.querySelector('button').textContent = '☀️ 切换白天模式';
        } else {
            landT.textContent = '28°C';
            seaT.textContent = '25°C';
            landP.textContent = '气压：低';
            seaP.textContent = '气压：高';
            windA.setAttribute('d', 'M 200 150 L 170 150');
            windA.setAttribute('opacity', '1');
            windL.textContent = '海风→';
            windL.setAttribute('opacity', '1');
            if (controls) controls.querySelector('button').textContent = '🌙 切换夜间模式';
        }
    };
    
    window.resetMarineSim = function() {
        window._marineNight = false;
        const landT = document.getElementById('landTemp');
        const seaT = document.getElementById('seaTemp');
        if (landT) landT.textContent = '28°C';
        if (seaT) seaT.textContent = '25°C';
        const landP = document.getElementById('landPress');
        const seaP = document.getElementById('seaPress');
        if (landP) landP.textContent = '气压：低';
        if (seaP) seaP.textContent = '气压：高';
        const windA = document.getElementById('windArrow');
        if (windA) windA.setAttribute('opacity', '0');
        const windL = document.getElementById('windLabel');
        if (windL) windL.setAttribute('opacity', '0');
        if (controls) controls.querySelector('button').textContent = '🌙 切换夜间模式';
    };
}

// ==================== j006 模拟温室效应 ====================
function initGreenhouseEffectSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#f0fdf4';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🏠 模拟温室效应实验</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:900px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:380px;">
                <canvas id="greenhouseCanvas" width="380" height="320" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
            </div>
            <div style="flex:1;min-width:300px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">⚙️ 实验设置</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
                            <input type="checkbox" id="ghCO2" checked> 加入二氧化碳
                        </label>
                        <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
                            <input type="checkbox" id="ghGlass"> 覆盖玻璃板（模拟温室）
                        </label>
                        <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
                            <input type="checkbox" id="ghSun" checked> 打开光源
                        </label>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📊 实时温度</h4>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <div style="background:#fef2f2;padding:8px;border-radius:6px;text-align:center;">
                            <div style="font-size:11px;color:#991b1b;">普通空气</div>
                            <div id="tempNormal" style="font-size:22px;font-weight:700;color:#dc2626;">25°C</div>
                        </div>
                        <div style="background:#f0fdf4;padding:8px;border-radius:6px;text-align:center;">
                            <div style="font-size:11px;color:#166534;">含CO₂空气</div>
                            <div id="tempCO2" style="font-size:22px;font-weight:700;color:#16a34a;">25°C</div>
                        </div>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📝 实验记录</h4>
                    <div id="ghLog" style="font-size:12px;color:#475569;max-height:100px;overflow:auto;line-height:1.6;"></div>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    // 绘制温室实验示意图
    function drawGreenhouse() {
        const c = document.getElementById('greenhouseCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const hasGlass = document.getElementById('ghGlass')?.checked;
        const hasCO2 = document.getElementById('ghCO2')?.checked;
        const hasSun = document.getElementById('ghSun')?.checked;
        
        // 地面
        ctx.fillStyle = '#a3a3a3';
        ctx.fillRect(0, 220, c.width, 100);
        ctx.fillStyle = '#7cb342';
        ctx.fillRect(0, 220, c.width, 5);
        
        // 玻璃罩
        if (hasGlass) {
            ctx.strokeStyle = '#93c5fd';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5;
            ctx.strokeRect(40, 80, 300, 140);
            ctx.fillStyle = '#93c5fd';
            ctx.globalAlpha = 0.1;
            ctx.fillRect(40, 80, 300, 140);
            ctx.globalAlpha = 1;
            
            // CO2标记
            if (hasCO2) {
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('CO₂', 60, 110);
                // CO2分子示意
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.arc(80 + i * 50, 140 + Math.sin(i) * 10, 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#ef4444';
                    ctx.fill();
                }
            }
        }
        
        // 太阳光
        if (hasSun) {
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(190, 30, 15, 0, Math.PI * 2);
            ctx.fill();
            // 光线
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(130 + i * 30, 50);
                ctx.lineTo(130 + i * 30, 80);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            
            // 透射/反射箭头
            ctx.fillStyle = '#f59e0b';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            if (hasGlass) {
                ctx.fillText('透过', 190, 75);
                // 红外线反射
                ctx.strokeStyle = '#ef4444';
                ctx.setLineDash([5, 3]);
                ctx.beginPath();
                ctx.moveTo(190, 180);
                ctx.lineTo(190, 220);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillText('被阻挡', 210, 200);
            }
        }
        
        // 温度计
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(320, 120, 8, 80);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(316, 116, 36, 88);
        ctx.fillStyle = '#334155';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('T', 326, 115);
    }
    
    drawGreenhouse();
    
    // 温度模拟
    let tempN = 25, tempC = 25;
    const log = document.getElementById('ghLog');
    function updateTemps() {
        const hasGlass = document.getElementById('ghGlass')?.checked;
        const hasCO2 = document.getElementById('ghCO2')?.checked;
        const hasSun = document.getElementById('ghSun')?.checked;
        
        if (hasSun) {
            tempN += hasGlass ? 0.5 : 0.3;
            tempC += (hasGlass && hasCO2) ? 0.8 : 0.3;
        } else {
            tempN -= 0.2;
            tempC -= 0.2;
        }
        
        tempN = Math.max(20, Math.min(50, tempN));
        tempC = Math.max(20, Math.min(50, tempC));
        
        const nEl = document.getElementById('tempNormal');
        const cEl = document.getElementById('tempCO2');
        if (nEl) nEl.textContent = tempN.toFixed(1) + '°C';
        if (cEl) cEl.textContent = tempC.toFixed(1) + '°C';
        
        drawGreenhouse();
        
        if (log && Math.abs(tempC - tempN) > 2 && log.children.length < 10) {
            const entry = document.createElement('div');
            entry.textContent = `温差 ${(tempC - tempN).toFixed(1)}°C | CO₂${hasCO2 ? '有' : '无'} | 玻璃${hasGlass ? '有' : '无'}`;
            log.prepend(entry);
        }
    }
    
    window._ghTimer = setInterval(updateTemps, 1000);
    
    // 绑定复选框事件
    ['ghCO2', 'ghGlass', 'ghSun'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', () => { drawGreenhouse(); });
    });
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <button class="sim-btn" onclick="clearInterval(window._ghTimer);document.getElementById('tempNormal').textContent='25°C';document.getElementById('tempCO2').textContent='25°C';tempN=25;tempC=25;drawGreenhouse();">🔄 重置温度</button>
            <span style="font-size:13px;color:var(--gray-600);">提示：勾选「覆盖玻璃板」和「加入二氧化碳」观察温度升高</span>
        `;
    }
}

// ==================== j007 测定气温与坡向关系 ====================
function initSlopeTemperatureSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#fffbeb';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🌡️ 测定气温与坡向、坡度关系</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:950px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:420px;">
                <svg id="slopeSvg" width="420" height="340" viewBox="0 0 420 340" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <!-- 山坡 -->
                    <polygon points="50,280 370,280 320,120 100,120" fill="#a3e635" stroke="#4d7c0f" stroke-width="2"/>
                    <!-- 南坡（向阳） -->
                    <polygon points="100,120 320,120 370,280 50,280" fill="#fef08c" stroke="none" opacity="0.3"/>
                    <!-- 北坡 -->
                    <polygon points="100,120 320,120 320,120 100,120" fill="#1e40af" opacity="0.2"/>
                    <!-- 太阳 -->
                    <circle cx="350" cy="50" r="22" fill="#fbbf24"/>
                    <g id="sunRays">
                        <line x1="340" y1="72" x2="320" y2="110" stroke="#fbbf24" stroke-width="2" opacity="0.7"/>
                        <line x1="350" y1="72" x2="350" y2="115" stroke="#fbbf24" stroke-width="2" opacity="0.7"/>
                        <line x1="360" y1="72" x2="380" y2="110" stroke="#fbbf24" stroke-width="2" opacity="0.7"/>
                    </g>
                    <text x="350" y="56" text-anchor="middle" fill="#92400e" font-size="11" font-weight="700">太阳</text>
                    <!-- 角度标注 -->
                    <text x="210" y="105" text-anchor="middle" fill="#dc2626" font-size="12" font-weight="600" id="slopeAngle">坡度：26.6°</text>
                    <!-- 温度计位置 -->
                    <g id="thermoSouth">
                        <rect x="155" y="180" width="10" height="50" fill="#ef4444" rx="2"/>
                        <rect x="150" y="175" width="20" height="60" fill="none" stroke="#334155" stroke-width="2" rx="3"/>
                        <text x="160" y="250" text-anchor="middle" fill="#dc2626" font-size="11" font-weight="600" id="tempS">南坡 28°C</text>
                    </g>
                    <g id="thermoNorth">
                        <rect x="255" y="200" width="10" height="40" fill="#3b82f6" rx="2"/>
                        <rect x="250" y="195" width="20" height="50" fill="none" stroke="#334155" stroke-width="2" rx="3"/>
                        <text x="260" y="260" text-anchor="middle" fill="#2563eb" font-size="11" font-weight="600" id="tempN">北坡 22°C</text>
                    </g>
                    <!-- 光照箭头 -->
                    <path d="M 320 110 L 280 160" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowS)" opacity="0.8"/>
                    <path d="M 120 110 L 280 200" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4,4" opacity="0.5"/>
                    <defs>
                        <marker id="arrowS" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#f59e0b"/>
                        </marker>
                    </defs>
                </svg>
            </div>
            <div style="flex:1;min-width:300px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">⚙️ 参数设置</h4>
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <div>
                            <label style="font-size:13px;color:#475569;">坡度角：<span id="slopeVal">26.6</span>°</label>
                            <input type="range" id="slopeSlider" min="5" max="45" value="26.6" step="0.1" style="width:100%;margin-top:4px;">
                        </div>
                        <div>
                            <label style="font-size:13px;color:#475569;">季节</label>
                            <select id="seasonSelect" style="width:100%;margin-top:4px;padding:4px;border-radius:4px;border:1px solid #cbd5e1;">
                                <option value="summer">夏季（太阳高度角大）</option>
                                <option value="winter" selected>冬季（太阳高度角小）</option>
                                <option value="spring">春秋分</option>
                            </select>
                        </div>
                        <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
                            <input type="checkbox" id="showRay" checked> 显示太阳光线
                        </label>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">📊 数据记录表</h4>
                    <table style="width:100%;font-size:12px;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f1f5f9;">
                                <th style="padding:6px;border:1px solid #e2e8f0;">坡向</th>
                                <th style="padding:6px;border:1px solid #e2e8f0;">坡度</th>
                                <th style="padding:6px;border:1px solid #e2e8f0;">温度(°C)</th>
                                <th style="padding:6px;border:1px solid #e2e8f0;">温差</th>
                            </tr>
                        </thead>
                        <tbody id="slopeTable">
                            <tr>
                                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;">南坡</td>
                                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;" id="recSlope">26.6°</td>
                                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;color:#dc2626;" id="recSTemp">28.0</td>
                                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;" rowspan="2" id="recDiff">6.0°C</td>
                            </tr>
                            <tr>
                                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;">北坡</td>
                                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;" id="recNSlope">26.6°</td>
                                <td style="padding:6px;border:1px solid #e2e8f0;text-align:center;color:#2563eb;" id="recNTemp">22.0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    function updateSlope() {
        const slope = parseFloat(document.getElementById('slopeSlider').value);
        const season = document.getElementById('seasonSelect').value;
        
        document.getElementById('slopeVal').textContent = slope.toFixed(1);
        const angleEl = document.getElementById('slopeAngle');
        if (angleEl) angleEl.textContent = '坡度：' + slope.toFixed(1) + '°';
        
        // 根据季节和坡度计算温度
        let baseS, baseN;
        if (season === 'summer') { baseS = 35; baseN = 28; }
        else if (season === 'winter') { baseS = 28; baseN = 22; }
        else { baseS = 30; baseN = 25; }
        
        // 坡度影响：坡度越大，南坡接受阳光越多
        const factor = (slope - 15) / 30;
        const tempS = baseS + factor * 5;
        const tempN = baseN - factor * 3;
        const diff = tempS - tempN;
        
        document.getElementById('tempS').textContent = '南坡 ' + tempS.toFixed(1) + '°C';
        document.getElementById('tempN').textContent = '北坡 ' + tempN.toFixed(1) + '°C';
        document.getElementById('recSlope').textContent = slope.toFixed(1) + '°';
        document.getElementById('recNSlope').textContent = slope.toFixed(1) + '°';
        document.getElementById('recSTemp').textContent = tempS.toFixed(1);
        document.getElementById('recNTemp').textContent = tempN.toFixed(1);
        document.getElementById('recDiff').textContent = diff.toFixed(1) + '°C';
        
        // 更新SVG中的坡度表示
        const svg = document.getElementById('slopeSvg');
        if (svg) {
            // 调整山形
            const topX = 210;
            const topY = 120;
            const slopeH = 160;
            const slopeW = 140 + slope * 2;
            const poly = svg.querySelector('polygon');
            if (poly) {
                poly.setAttribute('points', 
                    (topX - slopeW/2) + ',' + (topY + slopeH) + ' ' +
                    (topX + slopeW/2) + ',' + (topY + slopeH) + ' ' +
                    (topX + slopeW/3) + ',' + topY + ' ' +
                    (topX - slopeW/3) + ',' + topY);
            }
        }
        
        // 太阳光线显示/隐藏
        const rays = document.getElementById('sunRays');
        if (rays) rays.style.display = document.getElementById('showRay').checked ? 'block' : 'none';
    }
    
    document.getElementById('slopeSlider').addEventListener('input', updateSlope);
    document.getElementById('seasonSelect').addEventListener('change', updateSlope);
    document.getElementById('showRay').addEventListener('change', updateSlope);
    
    updateSlope();
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;color:var(--gray-600);">调整坡度和季节，观察南坡与北坡的温度差异</span>
            <button class="sim-btn" onclick="alert('实验结论：南坡温度高于北坡，坡度越大温差越明显。北半球南坡为向阳坡，北坡为背阴坡。')">📝 查看结论</button>
        `;
    }
}

// ==================== j008 制作等高线模型 ====================
function initContourModelSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#f8fafc';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🏔️ 制作等高线模型</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:950px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:420px;">
                <canvas id="contourModelCanvas" width="420" height="340" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
            </div>
            <div style="flex:1;min-width:300px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">⚙️ 地形设置</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div>
                            <label style="font-size:13px;color:#475569;">地形类型</label>
                            <select id="terrainType" style="width:100%;margin-top:4px;padding:4px;border-radius:4px;border:1px solid #cbd5e1;">
                                <option value="hill">山丘</option>
                                <option value="mountain">山峰</option>
                                <option value="valley">山谷</option>
                                <option value="ridge">山脊</option>
                                <option value="basin">盆地</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-size:13px;color:#475569;">等高距：<span id="levelVal">50</span>m</label>
                            <input type="range" id="levelSlider" min="20" max="100" value="50" step="10" style="width:100%;margin-top:4px;">
                        </div>
                        <div>
                            <label style="font-size:13px;color:#475569;">高度：<span id="heightVal">300</span>m</label>
                            <input type="range" id="heightSlider" min="100" max="800" value="300" step="50" style="width:100%;margin-top:4px;">
                        </div>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">📋 等高线图</h4>
                    <canvas id="contourLineCanvas" width="300" height="200" style="width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:4px;"></canvas>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    function drawTerrain() {
        const c = document.getElementById('contourModelCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const type = document.getElementById('terrainType').value;
        const height = parseInt(document.getElementById('heightSlider').value);
        const level = parseInt(document.getElementById('levelSlider').value);
        
        // 绘制3D地形透视图
        const cx = 210, cy = 200, scale = 1.2;
        
        // 绘制等高线层（从下往上）
        const levels = Math.floor(height / level);
        for (let i = levels; i >= 0; i--) {
            const h = i * level;
            const radius = Math.max(10, 80 - i * (60 / Math.max(levels, 1)));
            const yOffset = i * (60 / Math.max(levels, 1)) * 0.7;
            
            // 等高线圆环
            ctx.beginPath();
            ctx.ellipse(cx, cy - yOffset, radius * scale, radius * 0.6 * scale, 0, 0, Math.PI * 2);
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // 填充
            ctx.fillStyle = i % 2 === 0 ? '#dcfce7' : '#bbf7d0';
            ctx.fill();
            
            // 高度标注
            if (i % 2 === 0 || i === levels) {
                ctx.fillStyle = '#166534';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(h + 'm', cx + radius * scale + 5, cy - yOffset + 3);
            }
        }
        
        // 山顶标记
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(cx, cy - (levels * 60 / Math.max(levels, 1)) * 0.7, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('▲' + height + 'm', cx, cy - (levels * 60 / Math.max(levels, 1)) * 0.7 - 10);
    }
    
    function drawContourLines() {
        const c = document.getElementById('contourLineCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const type = document.getElementById('terrainType').value;
        const height = parseInt(document.getElementById('heightSlider').value);
        const level = parseInt(document.getElementById('levelSlider').value);
        
        // 绘制平面等高线图
        const cx = 150, cy = 100, scale = 0.8;
        const levels = Math.floor(height / level);
        
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = '#f0fdf4';
        
        for (let i = 0; i <= levels; i++) {
            const radius = Math.max(5, 60 - i * (50 / Math.max(levels, 1)));
            ctx.beginPath();
            ctx.arc(cx, cy, radius * scale, 0, Math.PI * 2);
            if (i > 0) ctx.fill();
            ctx.stroke();
        }
        
        // 示坡线
        for (let i = 0; i <= levels; i++) {
            const radius = Math.max(5, 60 - i * (50 / Math.max(levels, 1)));
            const angle = Math.PI / 4 + i * 0.5;
            const x1 = cx + Math.cos(angle) * radius * scale;
            const y1 = cy + Math.sin(angle) * radius * scale;
            const x2 = cx + Math.cos(angle) * (radius * scale + 8);
            const y2 = cy + Math.sin(angle) * (radius * scale + 8);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // 标注
        ctx.fillStyle = '#166534';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= levels; i += 2) {
            const h = i * level;
            const radius = Math.max(5, 60 - i * (50 / Math.max(levels, 1)));
            ctx.fillText(h + 'm', cx - radius * scale - 3, cy + 3);
        }
    }
    
    // 绑定事件
    ['terrainType', 'levelSlider', 'heightSlider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => {
            if (id === 'levelSlider') document.getElementById('levelVal').textContent = document.getElementById('levelSlider').value;
            if (id === 'heightSlider') document.getElementById('heightVal').textContent = document.getElementById('heightSlider').value;
            drawTerrain();
            drawContourLines();
        });
        if (el) el.addEventListener('change', () => {
            drawTerrain();
            drawContourLines();
        });
    });
    
    drawTerrain();
    drawContourLines();
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;color:var(--gray-600);">选择地形类型，调整参数，观察等高线变化规律</span>
            <button class="sim-btn" onclick="drawTerrain();drawContourLines();">🔄 刷新</button>
        `;
    }
}

// ==================== j009 海陆热力性质差异（BSTN实验） ====================
function initThermalDiffSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#eff6ff';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🌡️ 海陆热力性质差异实验（BSTN实验）</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:900px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:400px;">
                <canvas id="bstnCanvas" width="400" height="300" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
            </div>
            <div style="flex:1;min-width:300px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">📊 温度曲线</h4>
                    <canvas id="bstnChart" width="300" height="180" style="width:100%;"></canvas>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📝 实验记录</h4>
                    <div style="font-size:12px;line-height:1.8;">
                        <div>沙土升温速度：<span id="sandRate" style="color:#dc2626;font-weight:700;">快</span></div>
                        <div>水升温速度：<span id="waterRate" style="color:#2563eb;font-weight:700;">慢</span></div>
                        <div>最高温度差：<span id="maxDiff" style="color:#7c3aed;font-weight:700;">8°C</span></div>
                        <div>结论：<span id="bstnConclusion" style="color:#16a34a;font-weight:700;">陆地升温快</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    const sandTemps = [], waterTemps = [];
    let currentTime = 0;
    const totalTime = 60;
    
    function drawBSTN() {
        const c = document.getElementById('bstnCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        // 绘制实验装置
        // 沙土容器
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(30, 120, 140, 100);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 120, 140, 100);
        ctx.fillStyle = '#d97706';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('沙土（陆地）', 100, 115);
        
        // 水容器
        ctx.fillStyle = '#dbeafe';
        ctx.fillRect(230, 120, 140, 100);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.strokeRect(230, 120, 140, 100);
        ctx.fillStyle = '#2563eb';
        ctx.fillText('水（海洋）', 300, 115);
        
        // 温度计
        function drawThermo(x, y, temp, color) {
            ctx.fillStyle = color;
            const h = (temp - 20) * 3;
            ctx.fillRect(x, y - h, 8, h);
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x - 2, y - 80, 12, 85);
            ctx.fillStyle = '#334155';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(temp.toFixed(1) + '°C', x + 12, y - h);
        }
        
        const sandT = 20 + (currentTime / totalTime) * 15 * 1.5;
        const waterT = 20 + (currentTime / totalTime) * 15 * 0.8;
        
        drawThermo(80, 220, sandT, '#ef4444');
        drawThermo(280, 220, waterT, '#3b82f6');
        
        sandTemps.push(sandT);
        waterTemps.push(waterT);
        
        // 灯光
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(200, 60, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('热源（模拟太阳）', 200, 95);
        
        // 光线
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(130, 78);
        ctx.lineTo(100, 120);
        ctx.moveTo(270, 78);
        ctx.lineTo(300, 120);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 时间
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('时间：' + currentTime + '分钟', 200, 280);
    }
    
    function drawBSTNChart() {
        const c = document.getElementById('bstnChart');
        if (!c || sandTemps.length < 2) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const padding = {top: 20, right: 15, bottom: 30, left: 40};
        const chartW = c.width - padding.left - padding.right;
        const chartH = c.height - padding.top - padding.bottom;
        
        // 坐标轴
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, c.height - padding.bottom);
        ctx.lineTo(c.width - padding.right, c.height - padding.bottom);
        ctx.stroke();
        
        // 刻度
        ctx.fillStyle = '#64748b';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'right';
        for (let t = 20; t <= 40; t += 5) {
            const y = padding.top + chartH - ((t - 20) / 20) * chartH;
            ctx.fillText(t + '°', padding.left - 3, y + 3);
        }
        
        // 绘制曲线
        function plotLine(data, color) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            data.forEach((val, i) => {
                const x = padding.left + (i / (Math.max(data.length - 1, 1))) * chartW;
                const y = padding.top + chartH - ((val - 20) / 20) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }
        
        plotLine(sandTemps, '#ef4444');
        plotLine(waterTemps, '#3b82f6');
        
        // 图例
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(padding.left + 5, padding.top + 5, 12, 3);
        ctx.fillStyle = '#334155';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('沙土', padding.left + 20, padding.top + 8);
        
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(padding.left + 55, padding.top + 5, 12, 3);
        ctx.fillStyle = '#334155';
        ctx.fillText('水', padding.left + 70, padding.top + 8);
        
        // X轴标签
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText('时间（分钟）', c.width / 2, c.height - 5);
    }
    
    drawBSTN();
    
    // 动画
    window._bstnTimer = setInterval(() => {
        if (currentTime < totalTime) {
            currentTime++;
            drawBSTN();
            drawBSTNChart();
            
            if (sandTemps.length > 0 && waterTemps.length > 0) {
                const diff = sandTemps[sandTemps.length - 1] - waterTemps[waterTemps.length - 1];
                document.getElementById('maxDiff').textContent = diff.toFixed(1) + '°C';
            }
        }
    }, 800);
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <button class="sim-btn" onclick="clearInterval(window._bstnTimer);sandTemps.length=0;waterTemps.length=0;currentTime=0;drawBSTN();">🔄 重新开始</button>
            <span style="font-size:13px;color:var(--gray-600);">实验说明：沙土（陆地）升温快于水（海洋）</span>
        `;
    }
}

// ==================== j010 河流地貌模拟器（增强版） ====================
function initRiverSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#f0f9ff';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🏞️ 河流地貌模拟器</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:950px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:450px;">
                <canvas id="riverCanvas" width="450" height="320" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
            </div>
            <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">⚙️ 模拟控制</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div>
                            <label style="font-size:13px;color:#475569;">河流流速：<span id="riverSpeedVal">中</span></label>
                            <input type="range" id="riverSpeed" min="1" max="3" value="2" style="width:100%;margin-top:4px;">
                        </div>
                        <div>
                            <label style="font-size:13px;color:#475569;">地质类型</label>
                            <select id="geologyType" style="width:100%;margin-top:4px;padding:4px;border-radius:4px;border:1px solid #cbd5e1;">
                                <option value="soft">松软沉积岩</option>
                                <option value="hard">坚硬花岗岩</option>
                                <option value="mixed">软硬相间</option>
                            </select>
                        </div>
                        <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
                            <input type="checkbox" id="showLabels" checked> 显示地貌名称
                        </label>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📋 地貌知识</h4>
                    <div id="landformInfo" style="font-size:12px;color:#334155;line-height:1.8;">
                        <b>侵蚀作用：</b>V型河谷、瀑布<br>
                        <b>堆积作用：</b>冲积扇、三角洲<br>
                        <b>曲流：</b>凹岸侵蚀、凸岸堆积
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    function drawRiver() {
        const c = document.getElementById('riverCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const speed = parseInt(document.getElementById('riverSpeed').value);
        const geology = document.getElementById('geologyType').value;
        const showL = document.getElementById('showLabels').checked;
        
        // 绘制河流
        // 上游：V型谷
        ctx.fillStyle = '#86efac';
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(150, 160);
        ctx.lineTo(50, 270);
        ctx.closePath();
        ctx.fill();
        
        // 河道
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3 + speed;
        ctx.beginPath();
        // 上游
        ctx.moveTo(50, 50);
        ctx.bezierCurveTo(100, 120, 130, 180, 180, 200);
        // 中游（曲流）
        ctx.bezierCurveTo(230, 220, 200, 260, 250, 240);
        ctx.bezierCurveTo(300, 220, 270, 180, 320, 200);
        // 下游
        ctx.bezierCurveTo(370, 220, 380, 250, 400, 260);
        ctx.stroke();
        
        // 侵蚀标注
        ctx.fillStyle = '#dc2626';
        ctx.font = '11px sans-serif';
        if (showL) {
            ctx.fillText('侵蚀（V型谷）', 60, 45);
            ctx.fillText('凹岸侵蚀', 220, 235);
            ctx.fillText('凸岸堆积', 280, 210);
        }
        
        // 堆积地貌
        ctx.fillStyle = '#a3e635';
        // 冲积扇
        ctx.beginPath();
        ctx.moveTo(50, 270);
        ctx.quadraticCurveTo(80, 290, 50, 310);
        ctx.quadraticCurveTo(20, 290, 50, 270);
        ctx.fill();
        if (showL) {
            ctx.fillStyle = '#166534';
            ctx.font = '10px sans-serif';
            ctx.fillText('冲积扇', 55, 300);
        }
        
        // 三角洲
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(380, 260);
        ctx.lineTo(400, 260);
        ctx.lineTo(395, 290);
        ctx.lineTo(370, 285);
        ctx.closePath();
        ctx.fill();
        if (showL) {
            ctx.fillStyle = '#92400e';
            ctx.font = '10px sans-serif';
            ctx.fillText('三角洲', 385, 285);
        }
        
        // 瀑布
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(140, 150);
        ctx.lineTo(140, 170);
        ctx.lineTo(150, 170);
        ctx.stroke();
        if (showL) {
            ctx.fillStyle = '#7c3aed';
            ctx.font = '10px sans-serif';
            ctx.fillText('瀑布', 145, 145);
        }
        
        // 根据地质类型调整
        if (geology === 'hard') {
            ctx.fillStyle = '#78716c';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('坚硬岩石→瀑布发育', 150, 30);
        } else if (geology === 'mixed') {
            ctx.fillStyle = '#78716c';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('软硬相间→阶地发育', 150, 30);
        }
    }
    
    // 绑定事件
    ['riverSpeed', 'geologyType', 'showLabels'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input' in el ? 'input' : 'change', drawRiver);
    });
    
    document.getElementById('riverSpeed').addEventListener('input', function() {
        const v = parseInt(this.value);
        document.getElementById('riverSpeedVal').textContent = v === 1 ? '慢' : v === 2 ? '中' : '快';
        drawRiver();
    });
    
    drawRiver();
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <button class="sim-btn" onclick="drawRiver()">🔄 刷新</button>
            <span style="font-size:13px;color:var(--gray-600);">提示：调整流速和地质类型观察不同地貌发育</span>
        `;
    }
}

// ==================== s003 人口分布影响因素（图表模拟器） ====================
function initPopulationSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#faf5ff';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">👥 人口分布影响因素——交互图表</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:950px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:420px;">
                <canvas id="popChartCanvas" width="420" height="300" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
            </div>
            <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">📊 图表类型</h4>
                    <div style="display:flex;flex-direction:column;gap:6px;">
                        <button class="sim-btn" onclick="drawPopChart('bar')" style="font-size:12px;">📊 柱状图：各大洲人口</button>
                        <button class="sim-btn" onclick="drawPopChart('pie')" style="font-size:12px;">🥧 饼图：人口比例</button>
                        <button class="sim-btn" onclick="drawPopChart('scatter')" style="font-size:12px;">📈 散点图：海拔与人口密度</button>
                        <button class="sim-btn" onclick="drawPopChart('density')" style="font-size:12px;">🗺️ 伪密度图：纬度与人口</button>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📝 影响因素</h4>
                    <div style="font-size:12px;color:#334155;line-height:2;">
                        <div>① 自然条件：气候、地形、水源</div>
                        <div>② 经济发展水平</div>
                        <div>③ 历史与政策</div>
                        <div>④ 交通与区位</div>
                        <div id="popInsight" style="margin-top:8px;padding:6px;background:#f0f9ff;border-radius:4px;font-size:11px;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    window.drawPopChart = function(type) {
        const c = document.getElementById('popChartCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const insight = document.getElementById('popInsight');
        
        if (type === 'bar') {
            // 各大洲人口柱状图
            const data = [
                {label: '亚洲', val: 4640, color: '#ef4444'},
                {label: '非洲', val: 1400, color: '#f59e0b'},
                {label: '欧洲', val: 748, color: '#3b82f6'},
                {label: '北美', val: 592, color: '#10b981'},
                {label: '南美', val: 434, color: '#8b5cf6'},
                {label: '大洋洲', val: 44, color: '#ec4899'}
            ];
            
            const padding = {top: 30, right: 20, bottom: 50, left: 50};
            const chartW = c.width - padding.left - padding.right;
            const chartH = c.height - padding.top - padding.bottom;
            const barW = chartW / data.length * 0.7;
            const gap = chartW / data.length * 0.3;
            
            // 坐标轴
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top);
            ctx.lineTo(padding.left, c.height - padding.bottom);
            ctx.lineTo(c.width - padding.right, c.height - padding.bottom);
            ctx.stroke();
            
            // 柱状图
            data.forEach((d, i) => {
                const x = padding.left + i * (barW + gap) + gap / 2;
                const barH = (d.val / 5000) * chartH;
                const y = c.height - padding.bottom - barH;
                
                ctx.fillStyle = d.color;
                ctx.fillRect(x, y, barW, barH);
                
                // 标签
                ctx.fillStyle = '#334155';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(d.label, x + barW / 2, c.height - padding.bottom + 15);
                ctx.fillText(d.val + 'M', x + barW / 2, y - 5);
            });
            
            // 标题
            ctx.fillStyle = '#1e3a5f';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('各大洲人口（百万，2024年）', c.width / 2, 18);
            
            if (insight) insight.textContent = '结论：亚洲人口最多，占世界人口约58%';
        }
        
        if (type === 'scatter') {
            // 海拔与人口密度散点图
            const points = [
                {x: 50, y: 500, label: '沿海平原'},
                {x: 200, y: 400, label: '丘陵'},
                {x: 500, y: 200, label: '高原'},
                {x: 1000, y: 50, label: '高山'},
                {x: 300, y: 300, label: '盆地'},
                {x: 100, y: 450, label: '三角洲'}
            ];
            
            const padding = {top: 30, right: 20, bottom: 50, left: 50};
            const chartW = c.width - padding.left - padding.right;
            const chartH = c.height - padding.top - padding.bottom;
            
            // 坐标轴
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(padding.left, padding.top);
            ctx.lineTo(padding.left, c.height - padding.bottom);
            ctx.lineTo(c.width - padding.right, c.height - padding.bottom);
            ctx.stroke();
            
            // 标签
            ctx.fillStyle = '#64748b';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('海拔（m）', c.width / 2, c.height - 5);
            ctx.save();
            ctx.translate(15, c.height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('人口密度（人/km²）', 0, 0);
            ctx.restore();
            
            // 散点
            points.forEach(p => {
                const px = padding.left + (p.x / 1500) * chartW;
                const py = c.height - padding.bottom - (p.y / 600) * chartH;
                
                ctx.fillStyle = '#7c3aed';
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#334155';
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(p.label, px + 8, py);
            });
            
            // 标题
            ctx.fillStyle = '#1e3a5f';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('海拔与人口密度关系', c.width / 2, 18);
            
            if (insight) insight.textContent = '结论：海拔越低，人口密度一般越高（平原地区更适宜居住）';
        }
        
        if (type === 'pie') {
            // 饼图
            const data = [
                {label: '亚洲', val: 58, color: '#ef4444'},
                {label: '非洲', val: 18, color: '#f59e0b'},
                {label: '欧洲', val: 9, color: '#3b82f6'},
                {label: '北美', val: 7, color: '#10b981'},
                {label: '南美', val: 6, color: '#8b5cf6'},
                {label: '其他', val: 2, color: '#94a3b8'}
            ];
            
            const cx = c.width / 2, cy = c.height / 2 + 10, r = 100;
            let startAngle = -Math.PI / 2;
            
            data.forEach(d => {
                const endAngle = startAngle + (d.val / 100) * Math.PI * 2;
                ctx.fillStyle = d.color;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, startAngle, endAngle);
                ctx.closePath();
                ctx.fill();
                
                // 标签
                const midAngle = startAngle + (endAngle - startAngle) / 2;
                const lx = cx + Math.cos(midAngle) * (r * 0.7);
                const ly = cy + Math.sin(midAngle) * (r * 0.7);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(d.label, lx, ly - 6);
                ctx.fillText(d.val + '%', lx, ly + 8);
                
                startAngle = endAngle;
            });
            
            // 标题
            ctx.fillStyle = '#1e3a5f';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('世界人口各大洲占比', c.width / 2, 18);
            
            if (insight) insight.textContent = '结论：亚洲和非洲合计占世界人口的76%';
        }
    };
    
    // 默认绘制柱状图
    setTimeout(() => drawPopChart('bar'), 100);
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;color:var(--gray-600);">点击按钮切换不同图表类型，探索人口分布规律</span>
            <button class="sim-btn" onclick="drawPopChart('bar')">🔄 刷新</button>
        `;
    }
}

// ==================== s006 城市内涝模拟 ====================
function initFloodingSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#eff6ff';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🌧️ 城市内涝模拟实验</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:950px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:420px;">
                <canvas id="floodCanvas" width="420" height="320" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
            </div>
            <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">⚙️ 模拟参数</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div>
                            <label style="font-size:13px;color:#475569;">降雨量：<span id="rainVal">50</span>mm/h</label>
                            <input type="range" id="rainSlider" min="10" max="150" value="50" style="width:100%;margin-top:4px;">
                        </div>
                        <div>
                            <label style="font-size:13px;color:#475569;">透水面积比例：<span id="permeableVal">40</span>%</label>
                            <input type="range" id="permeableSlider" min="0" max="100" value="40" style="width:100%;margin-top:4px;">
                        </div>
                        <div>
                            <label style="font-size:13px;color:#475569;">排水能力</label>
                            <select id="drainSelect" style="width:100%;margin-top:4px;padding:4px;border-radius:4px;border:1px solid #cbd5e1;">
                                <option value="low">弱（老旧城区）</option>
                                <option value="medium" selected>中（普通城区）</option>
                                <option value="high">强（新城区）</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📊 内涝评估</h4>
                    <div style="font-size:12px;color:#334155;line-height:2;">
                        <div>积水深度：<span id="floodDepth" style="color:#dc2626;font-weight:700;">0 mm</span></div>
                        <div>淹没面积：<span id="floodArea" style="color:#ea580c;font-weight:700;">0%</span></div>
                        <div>风险等级：<span id="floodRisk" style="background:#16a34a;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;">低</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    function drawFlood() {
        const c = document.getElementById('floodCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const rain = parseInt(document.getElementById('rainSlider').value);
        const perm = parseInt(document.getElementById('permeableSlider').value);
        const drain = document.getElementById('drainSelect').value;
        
        document.getElementById('rainVal').textContent = rain;
        document.getElementById('permeableVal').textContent = perm;
        
        // 城市网格
        const gridSize = 60;
        const cols = 6, rows = 4;
        
        for (let r = 0; r < rows; r++) {
            for (let col = 0; col < cols; col++) {
                const x = 30 + col * (gridSize + 5);
                const y = 30 + r * (gridSize + 5);
                
                // 判断是否为透水地面
                const isPermeable = (r * cols + col + 7) % 5 < perm / 20;
                
                // 积水深度计算
                let waterH = 0;
                if (!isPermeable) {
                    const drainFactor = drain === 'high' ? 0.3 : drain === 'medium' ? 0.6 : 1.0;
                    waterH = Math.max(0, (rain - perm * 0.5) * drainFactor - 20);
                }
                
                // 绘制地面
                ctx.fillStyle = isPermeable ? '#a3e635' : '#94a3b8';
                ctx.fillRect(x, y, gridSize, gridSize);
                ctx.strokeStyle = '#64748b';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(x, y, gridSize, gridSize);
                
                // 绘制积水
                if (waterH > 0) {
                    const waterAlpha = Math.min(0.7, waterH / 100);
                    ctx.fillStyle = 'rgba(59, 130, 246, ' + waterAlpha + ')';
                    const wh = (waterH / 150) * gridSize;
                    ctx.fillRect(x + 2, y + gridSize - wh, gridSize - 4, wh);
                }
                
                // 建筑物
                if (!isPermeable && (r * cols + col) % 3 !== 0) {
                    ctx.fillStyle = '#475569';
                    ctx.fillRect(x + 15, y + 15, 30, 30);
                }
            }
        }
        
        // 更新内涝评估
        const depth = Math.max(0, (rain - perm * 0.5) * (drain === 'high' ? 0.3 : drain === 'medium' ? 0.6 : 1.0) - 20);
        const area = Math.max(0, 100 - perm - (drain === 'high' ? 30 : drain === 'medium' ? 10 : 0));
        let risk = '低', riskColor = '#16a34a';
        if (depth > 50) { risk = '高'; riskColor = '#dc2626'; }
        else if (depth > 20) { risk = '中'; riskColor = '#f59e0b'; }
        
        document.getElementById('floodDepth').textContent = Math.max(0, Math.round(depth)) + ' mm';
        document.getElementById('floodArea').textContent = Math.min(100, Math.round(area)) + '%';
        const riskEl = document.getElementById('floodRisk');
        riskEl.textContent = risk;
        riskEl.style.background = riskColor;
        
        // 标题
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('城市内涝模拟（颜色越深积水越多）', c.width / 2, 18);
    }
    
    // 绑定事件
    document.getElementById('rainSlider').addEventListener('input', drawFlood);
    document.getElementById('permeableSlider').addEventListener('input', drawFlood);
    document.getElementById('drainSelect').addEventListener('change', drawFlood);
    
    drawFlood();
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;color:var(--gray-600);">调整参数观察内涝程度变化，找出缓解内涝的方法</span>
            <button class="sim-btn" onclick="drawFlood()">🔄 刷新</button>
        `;
    }
}

// ==================== s007 地貌观察模拟器 ====================
function initLandformSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#fefce8';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🗻 地貌观察模拟器</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:950px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:450px;">
                <canvas id="landformCanvas" width="450" height="320" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);cursor:pointer;"></canvas>
            </div>
            <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">🗺️ 地貌类型</h4>
                    <div style="display:flex;flex-direction:column;gap:6px;">
                        <button class="sim-btn" onclick="showLandform('karst')" style="font-size:12px;text-align:left;">🪨 喀斯特地貌</button>
                        <button class="sim-btn" onclick="showLandform('danxia')" style="font-size:12px;text-align:left;">🔶 丹霞地貌</button>
                        <button class="sim-btn" onclick="showLandform('wind')" style="font-size:12px;text-align:left;">🌪️ 风蚀地貌</button>
                        <button class="sim-btn" onclick="showLandform('glacier')" style="font-size:12px;text-align:left;">❄️ 冰川地貌</button>
                        <button class="sim-btn" onclick="showLandform('volcano')" style="font-size:12px;text-align:left;">🌋 火山地貌</button>
                        <button class="sim-btn" onclick="showLandform('coast')" style="font-size:12px;text-align:left;">🌊 海岸地貌</button>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📝 地貌信息</h4>
                    <div id="landformInfo" style="font-size:12px;color:#334155;line-height:1.8;">
                        点击左侧按钮查看不同地貌类型
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    const landformData = {
        karst: {
            name: '喀斯特地貌',
            desc: '水对可溶性岩石（石灰岩）进行化学溶蚀而形成的地貌。',
            features: '溶洞、石林、天坑、地下河',
            example: '中国：桂林山水、云南石林',
            process: '溶蚀→侵蚀→塌陷→堆积'
        },
        danxia: {
            name: '丹霞地貌',
            desc: '红色砂砾岩经长期风化、流水侵蚀形成的赤壁丹崖地貌。',
            features: '红色陡崖、方山、奇峰、赤壁',
            example: '中国：广东丹霞山、张掖丹霞',
            process: '沉积→抬升→风化→侵蚀'
        },
        wind: {
            name: '风蚀地貌',
            desc: '风力对地表物质进行吹蚀和磨蚀作用形成的地貌。',
            features: '风蚀蘑菇、雅丹、戈壁、沙丘',
            example: '中国：新疆魔鬼城、敦煌雅丹',
            process: '吹蚀→磨蚀→搬运→堆积'
        },
        glacier: {
            name: '冰川地貌',
            desc: '冰川运动对地表进行侵蚀、搬运和堆积而形成的地貌。',
            features: 'U型谷、冰斗、角峰、冰碛丘陵',
            example: '中国：喜马拉雅山脉、四川海螺沟',
            process: '冰川侵蚀→搬运→堆积→退缩'
        },
        volcano: {
            name: '火山地貌',
            desc: '火山喷发物堆积形成的地貌，包括火山锥、熔岩台地等。',
            features: '火山锥、火山口、熔岩台地、温泉',
            example: '中国：长白山天池、五大连池',
            process: '岩浆活动→喷发→堆积→冷却'
        },
        coast: {
            name: '海岸地貌',
            desc: '波浪、潮汐、海流等海洋动力作用形成的地貌。',
            features: '海蚀崖、海蚀柱、沙滩、三角洲',
            example: '中国：鼓浪屿、三亚亚龙湾',
            process: '海蚀→海积→潮汐作用→生物作用'
        }
    };
    
    window.showLandform = function(type) {
        const data = landformData[type];
        if (!data) return;
        
        // 更新信息面板
        const info = document.getElementById('landformInfo');
        if (info) {
            info.innerHTML = `
                <b>名称：</b>${data.name}<br>
                <b>定义：</b>${data.desc}<br>
                <b>典型特征：</b>${data.features}<br>
                <b>中国实例：</b>${data.example}<br>
                <b>形成过程：</b>${data.process}
            `;
        }
        
        // 绘制地貌示意图
        const c = document.getElementById('landformCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        // 根据类型绘制示意
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data.name + '——示意图', c.width / 2, 30);
        
        if (type === 'karst') {
            // 喀斯特：石林
            ctx.fillStyle = '#a3a3a3';
            for (let i = 0; i < 8; i++) {
                const x = 80 + i * 50;
                const h = 60 + Math.sin(i * 1.5) * 40;
                ctx.beginPath();
                ctx.moveTo(x - 15, 280);
                ctx.lineTo(x, 280 - h);
                ctx.lineTo(x + 15, 280);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = '#15803d';
            ctx.font = '11px sans-serif';
            ctx.fillText('石林', 225, 150);
        } else if (type === 'danxia') {
            // 丹霞：红色陡崖
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(80, 280);
            ctx.lineTo(100, 100);
            ctx.lineTo(300, 100);
            ctx.lineTo(320, 280);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fbbf24';
            ctx.font = '11px sans-serif';
            ctx.fillText('赤壁丹崖', 200, 200);
        } else if (type === 'wind') {
            // 风蚀蘑菇
            ctx.fillStyle = '#a3a3a3';
            ctx.beginPath();
            ctx.moveTo(180, 280);
            ctx.lineTo(200, 150);
            ctx.lineTo(260, 140);
            ctx.lineTo(240, 280);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
            ctx.font = '11px sans-serif';
            ctx.fillText('风蚀蘑菇', 220, 200);
        } else if (type === 'glacier') {
            // U型谷
            ctx.fillStyle = '#93c5fd';
            ctx.beginPath();
            ctx.moveTo(60, 280);
            ctx.quadraticCurveTo(150, 180, 225, 280);
            ctx.quadraticCurveTo(300, 180, 390, 280);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#3b82f6';
            ctx.font = '11px sans-serif';
            ctx.fillText('U型谷', 225, 240);
        } else if (type === 'volcano') {
            // 火山
            ctx.fillStyle = '#78716c';
            ctx.beginPath();
            ctx.moveTo(100, 280);
            ctx.lineTo(225, 100);
            ctx.lineTo(350, 280);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(225, 100, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fbbf24';
            ctx.font = '11px sans-serif';
            ctx.fillText('火山锥', 225, 150);
        } else if (type === 'coast') {
            // 海蚀崖
            ctx.fillStyle = '#a3a3a3';
            ctx.beginPath();
            ctx.moveTo(60, 280);
            ctx.lineTo(60, 150);
            ctx.lineTo(120, 150);
            ctx.lineTo(120, 280);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#60a5fa';
            ctx.fillRect(120, 240, 270, 40);
            ctx.fillStyle = '#1e40af';
            ctx.font = '11px sans-serif';
            ctx.fillText('海蚀崖', 90, 220);
            ctx.fillText('海滩', 260, 270);
        }
    };
    
    // 默认显示喀斯特
    setTimeout(() => showLandform('karst'), 100);
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;color:var(--gray-600);">点击按钮切换不同地貌类型，观察地貌特征</span>
            <button class="sim-btn" onclick="showLandform('karst')">🔄 重置</button>
        `;
    }
}

// ==================== s008 城市空间模拟器 ====================
function initUrbanSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#f1f5f9';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;overflow:auto;';
    
    wrapper.innerHTML = `
        <h3 style="color:#1e3a5f;margin-bottom:12px;">🏙️ 城市空间结构模拟器</h3>
        <div style="display:flex;gap:16px;width:100%;max-width:950px;flex-wrap:wrap;justify-content:center;">
            <div style="flex:1;min-width:420px;">
                <canvas id="urbanCanvas" width="420" height="320" style="background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
            </div>
            <div style="flex:1;min-width:280px;display:flex;flex-direction:column;gap:12px;">
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 10px 0;font-size:15px;">⚙️ 城市参数</h4>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div>
                            <label style="font-size:13px;color:#475569;">城市规模：<span id="citySizeVal">中</span></label>
                            <input type="range" id="citySize" min="1" max="3" value="2" style="width:100%;margin-top:4px;">
                        </div>
                        <div>
                            <label style="font-size:13px;color:#475569;">交通布局</label>
                            <select id="transLayout" style="width:100%;margin-top:4px;padding:4px;border-radius:4px;border:1px solid #cbd5e1;">
                                <option value="grid">网格状</option>
                                <option value="radial">放射状</option>
                                <option value="mixed">混合式</option>
                            </select>
                        </div>
                        <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
                            <input type="checkbox" id="showAF" checked> 显示功能区
                        </label>
                    </div>
                </div>
                <div style="background:#fff;border-radius:8px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="color:#1e3a5f;margin:0 0 8px 0;font-size:15px;">📋 功能区说明</h4>
                    <div style="font-size:11px;color:#334155;line-height:1.8;">
                        <span style="display:inline-block;width:10px;height:10px;background:#ef4444;border-radius:2px;"></span> 商业区（CBD）<br>
                        <span style="display:inline-block;width:10px;height:10px;background:#3b82f6;border-radius:2px;"></span> 住宅区<br>
                        <span style="display:inline-block;width:10px;height:10px;background:#a3a3a3;border-radius:2px;"></span> 工业区<br>
                        <span style="display:inline-block;width:10px;height:10px;background:#a3e635;border-radius:2px;"></span> 绿地
                    </div>
                </div>
            </div>
        </div>
    `;
    
    canvas.appendChild(wrapper);
    
    function drawUrban() {
        const c = document.getElementById('urbanCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        
        const size = parseInt(document.getElementById('citySize').value);
        const layout = document.getElementById('transLayout').value;
        const showAF = document.getElementById('showAF').checked;
        
        const citySize = size === 1 ? 0.7 : size === 2 ? 1.0 : 1.3;
        const cx = 210, cy = 160;
        
        // 绘制背景（绿地）
        ctx.fillStyle = '#a3e635';
        ctx.fillRect(0, 0, c.width, c.height);
        
        // 绘制交通线路
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        if (layout === 'grid') {
            for (let i = 0; i < 6; i++) {
                const x = 50 + i * 70;
                ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, 290); ctx.stroke();
                const y = 30 + i * 50;
                ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(390, y); ctx.stroke();
            }
        } else if (layout === 'radial') {
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * 150, cy + Math.sin(angle) * 150);
                ctx.stroke();
            }
            for (let r = 1; r <= 3; r++) {
                ctx.beginPath();
                ctx.arc(cx, cy, r * 50, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            // 混合式
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, 30); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, 290); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(30, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(390, cy); ctx.stroke();
            for (let r = 1; r <= 3; r++) {
                ctx.beginPath();
                ctx.arc(cx, cy, r * 50, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        // 绘制功能区
        if (showAF) {
            // 商业区（市中心）
            ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.beginPath();
            ctx.arc(cx, cy, 25 * citySize, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('CBD', cx, cy + 3);
            
            // 住宅区
            ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = cx + Math.cos(angle) * (50 * citySize);
                const y = cy + Math.sin(angle) * (50 * citySize);
                ctx.beginPath();
                ctx.arc(x, y, 15 * citySize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // 工业区
            ctx.fillStyle = 'rgba(163, 163, 163, 0.6)';
            for (let i = 0; i < 4; i++) {
                const x = 60 + i * 100;
                const y = 250;
                ctx.fillRect(x, y - 15, 30 * citySize, 20 * citySize);
            }
        }
        
        // 标题
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('城市空间结构示意图（' + (size === 1 ? '小城市' : size === 2 ? '中等城市' : '大城市') + '）', c.width / 2, 18);
    }
    
    // 绑定事件
    document.getElementById('citySize').addEventListener('input', function() {
        const v = parseInt(this.value);
        document.getElementById('citySizeVal').textContent = v === 1 ? '小' : v === 2 ? '中' : '大';
        drawUrban();
    });
    document.getElementById('transLayout').addEventListener('change', drawUrban);
    document.getElementById('showAF').addEventListener('change', drawUrban);
    
    drawUrban();
    
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;color:var(--gray-600);">调整参数观察城市空间结构变化</span>
            <button class="sim-btn" onclick="drawUrban()">🔄 刷新</button>
        `;
    }
}

