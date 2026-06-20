/**
 * AI地理实验教学平台 - 互动模拟器 V3 完整版
 * 
 * 设计理念：按实验类型分类设计（非统一控制变量模板）
 * - 类型A 观察演示类：j002(自转) j003(公转) s001(热力环流)
 * - 类型B 动手操作类：j001(经纬网) j004(等高线) j007(风向)
 * - 类型C 模拟探索类：j005(气温) j006(降水) s003(太阳高度) s008(温室效应) j009(海陆差异) j010(河流)
 * - 类型D 过程理解类：s002(水循环) j008(岩石循环)
 * - 类型E 数据决策类：s004(人口金字塔) s005(城市热岛) s006(工业区位) s007(农业区位)
 */

(function() {
    'use strict';

    // ==================== 全局工具函数 ====================
    var COLORS = {
        primary: '#2563eb',
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
        bg: '#f8fafc',
        card: '#ffffff',
        text: '#1e293b',
        muted: '#64748b',
        border: '#e2e8f0'
    };

    // 注入样式
    function injectStyle(id, css) {
        var el = document.getElementById(id);
        if (!el) {
            el = document.createElement('style');
            el.id = id;
            document.head.appendChild(el);
        }
        el.textContent = css;
    }

    // 创建 Canvas
    function createCanvas(w, h, bg) {
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.style.cssText = 'border-radius:12px;display:block;margin:0 auto;background:' + (bg || '#fff') + ';';
        return c;
    }

    // 创建按钮
    function createBtn(text, onClick, bgColor) {
        var b = document.createElement('button');
        b.textContent = text;
        b.style.cssText = 'padding:8px 18px;margin:4px;background:' + (bgColor || COLORS.primary) + ';color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;transition:all .2s;';
        b.onmouseover = function() { b.style.opacity = '0.85'; };
        b.onmouseout = function() { b.style.opacity = '1'; };
        b.onclick = onClick;
        return b;
    }

    // 创建滑块控件
    function createSlider(min, max, value, step, label, onChange) {
        var d = document.createElement('div');
        d.style.cssText = 'display:inline-flex;align-items:center;gap:8px;margin:4px 8px;padding:4px 0;';
        if (label) {
            var lbl = document.createElement('span');
            lbl.textContent = label;
            lbl.style.cssText = 'font-size:13px;color:' + COLORS.text + ';white-space:nowrap;min-width:70px;';
            d.appendChild(lbl);
        }
        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = String(min);
        slider.max = String(max);
        slider.value = String(value);
        slider.step = String(step || 1);
        slider.style.cssText = 'width:120px;cursor:pointer;accent-color:' + COLORS.primary + ';';
        var valDisplay = document.createElement('span');
        valDisplay.textContent = value;
        valDisplay.style.cssText = 'font-size:13px;font-weight:600;color:' + COLORS.primary + ';min-width:36px;text-align:center;';
        slider.oninput = function() {
            valDisplay.textContent = slider.value;
            if (onChange) onChange(Number(slider.value));
        };
        d.appendChild(slider);
        d.appendChild(valDisplay);
        return d;
    }

    // 创建信息面板
    function infoPanel(title, content) {
        var d = document.createElement('div');
        d.style.cssText = 'background:' + COLORS.card + ';border:1px solid ' + COLORS.border + ';border-radius:10px;padding:14px 18px;margin:8px 0;width:100%;max-width:800px;box-sizing:border-box;';
        var html = '';
        if (title) html += '<h4 style="margin:0 0 8px 0;color:' + COLORS.primary + ';font-size:15px;">' + title + '</h4>';
        if (content) html += '<p style="margin:0;font-size:13px;line-height:1.8;color:' + COLORS.muted + ';">' + content + '</p>';
        d.innerHTML = html;
        return d;
    }

    // 创建观察提示
    function hintBox(text) {
        var d = document.createElement('div');
        d.style.cssText = 'background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:10px 14px;margin:8px 0;font-size:13px;color:#854d0e;line-height:1.6;';
        d.innerHTML = '<span style="font-weight:bold;">👁 观察提示：</span>' + text;
        return d;
    }

    // 创建结论框
    function conclusionBox(text) {
        var d = document.createElement('div');
        d.style.cssText = 'background:#ecfdf5;border:1px solid #86efac;border-radius:8px;padding:14px 18px;margin:8px 0;font-size:13px;line-height:1.8;color:#166534;';
        d.innerHTML = '<span style="font-weight:bold;font-size:14px;">💡 实验结论：</span><br>' + text;
        return d;
    }

    // 获取画布容器
    function getContainer() {
        var sc = document.getElementById('simCanvas');
        var xc = document.getElementById('simControls');
        if (!sc || !xc) return null;
        return { canvasArea: sc, controlArea: xc };
    }

    // 暴露到全局
    window._simUtils = {
        C: COLORS,
        style: injectStyle,
        canvas: createCanvas,
        btn: createBtn,
        slider: createSlider,
        info: infoPanel,
        hint: hintBox,
        conclusion: conclusionBox,
        container: getContainer
    };

})();

// 使用简短别名
var _C = window._simUtils.C;
var _S = window._simUtils.style;
var _CV = window._simUtils.canvas;
var _B = window._simUtils.btn;
var _SL = window._simUtils.slider;
var _I = window._simUtils.info;
var _H = window._simUtils.hint;
var _K = window._simUtils.conclusion;
var _G = window._simUtils.container;

// ================================================================
// j001 经纬网定位实验 【类型B-动手操作】
// 学生在地图上点击定位，或根据坐标找城市
// ================================================================
window.initLatitudeSimulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    // 注入样式
    _S('j001-styles', [
        '.j001-wrap{display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;}',
        '.j001-wrap h2{margin:0;color:' + _C.text + ';font-size:19px;}',
        '.j001-cities{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:6px 0;}',
        '.j001-city-btn{padding:5px 12px;border:2px solid ' + _C.primary + ';background:#fff;color:' + _C.primary + ';border-radius:20px;cursor:pointer;font-size:13px;font-weight:500;transition:all .2s;}',
        '.j001-city-btn:hover{background:' + _C.primary + ';color:#fff;}',
        '.j001-city-btn.active{background:' + _C.primary + ';color:#fff;}',
        '.j001-canvas-wrap{position:relative;}',
        '.j001-coords{position:absolute;top:8px;left:8px;background:rgba(255,255,255,.92);padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;color:' + _C.text + ';box-shadow:0 2px 8px rgba(0,0,0,.1);}',
        '.j001-score{text-align:center;font-size:15px;font-weight:bold;color:' + _C.success + ';margin:4px 0;}'
    ].join('\n'));

    var W = 760, H = 420;
    var wrap = document.createElement('div');
    wrap.className = 'j001-wrap';
    wrap.innerHTML = '<h2>📍 实验1：经纬网定位</h2>';
    g.canvasArea.appendChild(wrap);

    wrap.appendChild(_I('学习目标', '1. 理解经纬度的划分规则<br>2. 学会根据经纬度在地图上定位<br>3. 能够读出地图上任意点的经纬度坐标'));

    var canvasWrap = document.createElement('div');
    canvasWrap.className = 'j001-canvas-wrap';
    var cv = _CV(W, H, '#e8f4fc');
    cv.style.cursor = 'crosshair';
    canvasWrap.appendChild(cv);

    var coordsDiv = document.createElement('div');
    coordsDiv.className = 'j001-coords';
    coordsDiv.innerHTML = '点击地图查看坐标';
    canvasWrap.appendChild(coordsDiv);
    wrap.appendChild(canvasWrap);

    var scoreDiv = document.createElement('div');
    scoreDiv.className = 'j001-score';
    scoreDiv.innerHTML = '得分：0 / 0';
    wrap.appendChild(scoreDiv);

    // 城市数据
    var cities = [
        { name: '北京', lat: 39.9, lng: 116.4, px: 0.69, py: 0.44 },
        { name: '东京', lat: 35.7, lng: 139.7, px: 0.76, py: 0.46 },
        { name: '纽约', lat: 40.7, lng: -74.0, px: 0.27, py: 0.45 },
        { name: '悉尼', lat: -33.9, lng: 151.2, px: 0.80, py: 0.58 },
        { name: '伦敦', lat: 51.5, lng: -0.1,  px: 0.51, py: 0.42 },
        { name: '新加坡', lat: 1.3, lng: 103.8, px: 0.68, py: 0.52 },
        { name: '开罗', lat: 30.0, lng: 31.3,  px: 0.54, py: 0.49 },
        { name: '里约', lat: -22.9, lng: -43.2, px: 0.32, py: 0.56 },
        { name: '莫斯科', lat: 55.8, lng: 37.6,  px: 0.57, py: 0.35 },
        { name: '孟买',   lat: 19.1, lng: 72.9,  px: 0.63, py: 0.52 }
    ];

    var mode = 'free'; // free | find
    var targetCity = null;
    var clickPos = null;
    var score = 0;
    var total = 0;

    // 城市按钮区
    var cityBtns = document.createElement('div');
    cityBtns.className = 'j001-cities';

    // 模式切换
    var modeFree = _B('🗺️ 自由探索模式', function() {
        mode = 'free';
        targetCity = null;
        updateCityButtons();
        draw();
    }, _C.muted.replace('#',''));
    modeFree.style.borderColor = _C.muted;
    modeFree.style.color = _C.muted;
    cityBtns.appendChild(modeFree);

    cities.forEach(function(city, idx) {
        var btn = document.createElement('button');
        btn.className = 'j001-city-btn';
        btn.textContent = city.name;
        btn.onclick = function() {
            mode = 'find';
            targetCity = city;
            total++;
            updateCityButtons();
            draw();
        };
        cityBtns.appendChild(btn);
    });
    wrap.appendChild(cityBtns);
    wrap.appendChild(_H('自由模式：点击地图任意位置查看经纬度坐标<br>挑战模式：点击城市名，然后在地图上找到该城市的位置'));

    function updateCityButtons() {
        var btns = cityBtns.querySelectorAll('.j001-city-btn');
        btns.forEach(function(b) {
            b.classList.toggle('active', targetCity && b.textContent === targetCity.name);
        });
    }

    function draw() {
        var ctx = cv.getContext('2d');

        // 海洋背景
        ctx.fillStyle = '#b3d9f2';
        ctx.fillRect(0, 0, W, H);

        // 大陆轮廓（简化）
        ctx.fillStyle = '#90c695';
        // 亚欧大陆
        ctx.fillRect(W * 0.50, H * 0.24, W * 0.28, H * 0.34);
        // 非洲
        ctx.fillRect(W * 0.46, H * 0.28, W * 0.09, H * 0.17);
        // 北美
        ctx.fillRect(W * 0.11, H * 0.21, W * 0.17, H * 0.27);
        // 南美
        ctx.fillRect(W * 0.27, H * 0.50, W * 0.08, H * 0.28);
        // 澳大利亚
        ctx.fillRect(W * 0.75, H * 0.59, W * 0.09, H * 0.09);

        // 绘制经纬网格
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        for (var lon = -180; lon <= 180; lon += 30) {
            var x = W * ((lon + 180) / 360);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (var lat = -90; lat <= 90; lat += 30) {
            var y = H * (0.5 - lat / 180);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // 赤道和本初子午线加粗
        ctx.strokeStyle = 'rgba(220,38,38,0.4)';
        ctx.lineWidth = 2;
        // 赤道
        var eqY = H / 2;
        ctx.beginPath();
        ctx.moveTo(0, eqY);
        ctx.lineTo(W, eqY);
        ctx.stroke();
        // 本初子午线
        var pmX = W * 0.5;
        ctx.beginPath();
        ctx.moveTo(pmX, 0);
        ctx.lineTo(pmX, H);
        ctx.stroke();

        // 标注重要纬线
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.font = '11px Arial';
        var keyLats = [
            { lat: 66.5, label: '北极圈' }, { lat: 23.5, label: '北回归线' },
            { lat: 0,   label: '赤道' }, { lat: -23.5, label: '南回归线' }, { lat: -66.5, label: '南极圈' }
        ];
        keyLats.forEach(function(item) {
            var ly = H * (0.5 - item.lat / 180);
            ctx.fillText(item.label, 4, ly - 2);
        });

        // 如果是找城市模式，显示目标提示
        if (mode === 'find' && targetCity) {
            coordsDiv.innerHTML = '<strong style="color:' + _C.primary + ';">请找到：' + targetCity.name + '</strong> (' + Math.abs(targetCity.lat).toFixed(1) + '°' + (targetCity.lat >= 0 ? 'N' : 'S') + ', ' + Math.abs(targetCity.lng).toFixed(1) + '°' + (targetCity.lng >= 0 ? 'E' : 'W') + ')';
        }

        // 绘制所有城市的正确位置点（半透明）
        ctx.fillStyle = 'rgba(37,99,235,0.25)';
        cities.forEach(function(c) {
            ctx.beginPath();
            ctx.arc(c.px * W, c.py * H, 6, 0, Math.PI * 2);
            ctx.fill();
        });

        // 绘制点击位置
        if (clickPos) {
            // 点击的十字准星
            ctx.strokeStyle = _C.danger;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(clickPos.x - 10, clickPos.y);
            ctx.lineTo(clickPos.x + 10, clickPos.y);
            ctx.moveTo(clickPos.x, clickPos.y - 10);
            ctx.lineTo(clickPos.x, clickPos.y + 10);
            ctx.stroke();

            // 点击的红点
            ctx.fillStyle = _C.danger;
            ctx.beginPath();
            ctx.arc(clickPos.x, clickPos.y, 5, 0, Math.PI * 2);
            ctx.fill();

            // 计算并显示经纬度
            var clickLat = ((0.5 - clickPos.y / H) * 180).toFixed(1);
            var clickLng = ((clickPos.x / W * 360) - 180).toFixed(1);
            var latDir = clickLat >= 0 ? 'N' : 'S';
            var lngDir = clickLng >= 0 ? 'E' : 'W';
            if (mode === 'free') {
                coordsDiv.innerHTML = '纬度：<strong>' + Math.abs(clickLat) + '°' + latDir + '</strong> &nbsp;&nbsp; 经度：<strong>' + Math.abs(clickLng) + '°' + lngDir + '</strong>';
            } else if (mode === 'find' && targetCity) {
                var dist = Math.sqrt(Math.pow(clickPos.x - targetCity.px * W, 2) + Math.pow(clickPos.y - targetCity.py * H, 2));
                var hit = dist < 30;
                if (hit) {
                    coordsDiv.innerHTML = '<span style="color:' + _C.success + ';font-weight:bold;">✅ 正确！找到 ' + targetCity.name + '</span>';
                    score++;
                } else {
                    coordsDiv.innerHTML = '<span style="color:' + _C.danger + ';">❌ 偏差较大，再试一次</span> &nbsp; 目标：' + targetCity.name;
                }
                scoreDiv.innerHTML = '得分：<strong>' + score + '</strong> / <strong>' + total + '</strong>';
            }
        }

        // 城市名称标注
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.font = 'bold 11px Arial';
        cities.forEach(function(c) {
            ctx.fillText(c.name, c.px * W + 8, c.py * H - 4);
        });
    }

    cv.onclick = function(e) {
        var rect = cv.getBoundingClientRect();
        clickPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        draw();
    };

    draw();

    // 控制区
    g.controlArea.appendChild(_I('操作说明',
        '【自由探索】在地图上任意点击，读取该点的经纬度<br>' +
        '【城市定位】点击城市名 → 在地图上找到该城市的位置 → 系统判定正误<br>' +
        '【知识点】东经(E)/西经(W)：从0°经线向东增大为东经；向北增大为北纬(N)'
    ));
    g.controlArea.appendChild(_K(
        '经纬网是地球表面确定位置的坐标系统。纬度以赤道(0°)为界，向北为北纬(0°~90°N)，向南为南纬(0°~90°S)；<br>' +
        '经度以本初子午线(0°)为界，向东为东经(0°~180°E)，向西为西经(0°~180°W)。通过经纬网可以精确定位地球上任何一点。'
    ));
};

// ================================================================
// j002 地球自转与昼夜交替 【类型A-观察演示】
// 动画展示地球自转过程，观察昼夜交替现象
// ================================================================
window.initRotationSimulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    _S('j002-styles', [
        '.j002-w{display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;}',
        '.j002-w h2{margin:0;color:' + _C.text + ';font-size:19px;}',
        '.j002-controls{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:10px;}',
        '.j002-time-bar{display:flex;align-items:center;gap:16px;background:' + _C.card + ';padding:10px 20px;border-radius:10px;border:1px solid ' + _C.border + ';margin-top:6px;}'
    ].join('\n'));

    var W = 700, H = 450, R = 140;
    var wrap = document.createElement('div');
    wrap.className = 'j002-w';
    wrap.innerHTML = '<h2>🌍 实验2：地球自转与昼夜交替</h2>';
    g.canvasArea.appendChild(wrap);

    wrap.appendChild(_I('学习目标', '1. 观察地球自转方向（自西向东）<br>2. 理解昼夜交替产生的原因<br>3. 了解不同地点的时间差异'));

    var cv = _CV(W, H, '#0c1222');
    wrap.appendChild(cv);

    var timeBar = document.createElement('div');
    timeBar.className = 'j002-time-bar';
    timeBar.innerHTML = '<span id="j002-time" style="font-size:16px;font-weight:bold;color:#fff;">⏰ 时间：12:00</span><span id="j002-phase" style="font-size:13px;color:#93c5fd;">北京：白天 | 伦敦：清晨</span>';
    wrap.appendChild(timeBar);

    // 控制区
    var ctrlDiv = document.createElement('div');
    ctrlDiv.className = 'j002-controls';
    wrap.appendChild(ctrlDiv);

    var playing = false, angle = 0, animId = null, speed = 1;
    var timeEl = document.getElementById('j002-time');
    var phaseEl = document.getElementById('j002-phase');

    // 城市标记数据
    var markers = [
        { name: '北京', latDeg: 40, color: '#f97316' },
        { name: '伦敦', latDeg: -5, color: '#a855f7' },
        { name: '纽约', latDeg: -120, color: '#06b6d4' }
    ];

    ctrlDiv.appendChild(_B('▶ 开始旋转', function() {
        playing = !playing;
        this.textContent = playing ? '⏸ 暂停旋转' : '▶ 开始旋转';
        if (playing) animate();
        else if (animId) cancelAnimationFrame(animId);
    }));

    ctrlDiv.appendChild(_SL(1, 5, speed, 1, '速度', function(v) { speed = v; }));

    ctrlDiv.appendChild(_B('↺ 重置', function() {
        playing = false;
        angle = 0;
        ctrlDiv.firstChild.textContent = '▶ 开始旋转';
        if (animId) cancelAnimationFrame(animId);
        updateTime();
        draw();
    }, '#64748b'));

    function animate() {
        if (!playing) return;
        angle += 0.5 * speed;
        if (angle >= 360) angle -= 360;
        updateTime();
        draw();
        animId = requestAnimationFrame(animate);
    }

    function updateTime() {
        var hours = Math.floor((angle / 360 * 24 + 12) % 24);
        var mins = Math.floor(((angle / 360 * 24) % 1) * 60);
        timeEl.textContent = '⏰ 时间：' + hours + ':' + (mins < 10 ? '0' : '') + mins;
        
        var beijingHour = (hours + 8) % 24;
        var londonHour = (hours + 0) % 24;
        var nyHour = (hours - 5 + 24) % 24;
        
        var status = function(h) {
            if (h >= 6 && h < 18) return '☀️ 白天';
            if (h >= 18 && h < 22) return '🌆 傍晚';
            if (h >= 22 || h < 5) return '🌙 深夜';
            return '🌅 清晨';
        };
        phaseEl.textContent = '北京：' + status(beijingHour) + '(' + beijingHour + '时) | 伦敦：' + status(londonHour) + '(' + londonHour + '时) | 纽约：' + status(nyHour) + '(' + nyHour + '时)';
    }

    function draw() {
        var ctx = cv.getContext('2d');
        var cx = W / 2, cy = H / 2 + 10;

        ctx.clearRect(0, 0, W, H);

        // 星空背景
        for (var i = 0; i < 80; i++) {
            ctx.fillStyle = 'rgba(255,255,255,' + (0.2 + Math.random() * 0.5) + ')';
            ctx.beginPath();
            ctx.arc((i * 137) % W, (i * 89) % H, 0.5 + Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }

        // 太阳（固定在右侧）
        var sunX = W - 60, sunY = cy;
        var sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 35);
        sunGrad.addColorStop(0, '#fef08a');
        sunGrad.addColorStop(0.6, '#fbbf24');
        sunGrad.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 16, 0, Math.PI * 2);
        ctx.fill();

        // 地球（带裁剪区域实现半球明暗）
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();

        // 夜半球（深蓝）
        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

        // 昼半球（亮蓝）— 从右侧照射
        ctx.fillStyle = '#4a90d9';
        ctx.fillRect(cx, cy - R, R, R * 2);

        // 渐变过渡
        var transGrad = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
        transGrad.addColorStop(0.42, '#1e3a5f');
        transGrad.addColorStop(0.5, '#2d4a6f');
        transGrad.addColorStop(0.58, '#4a90d9');
        ctx.fillStyle = transGrad;
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

        ctx.restore();

        // 地球边框
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        // 经纬网格
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        for (var lo = 0; lo < 360; lo += 30) {
            var rad = (lo + angle) * Math.PI / 180;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(rad) * R * 0.98, cy - R * 0.98);
            ctx.lineTo(cx + Math.cos(rad) * R * 0.98, cy + R * 0.98);
            // 简化的经线（椭圆投影近似）
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(0);
            ctx.scale(Math.abs(Math.sin(rad)) * 0.95 + 0.05, 1);
            ctx.beginPath(); ctx.moveTo(0, -R); ctx.lineTo(0, R); ctx.restore();
            ctx.stroke();
        }
        // 赤道
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = 'rgba(255,220,0,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * 0.96, R * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 自转方向箭头指示
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('↻ 自西向东', cx - 36, cy + R + 22);

        // 地轴
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - R - 18);
        ctx.lineTo(cx, cy + R + 18);
        ctx.stroke();

        // 城市标记点（随地球旋转）
        markers.forEach(function(m) {
            var mRad = (m.latDeg + angle) * Math.PI / 180;
            var mx = cx + Math.cos(mRad) * R * 0.72;
            var my = cy + Math.sin(mRad * 0.35) * R * 0.72; // 简化纬度

            // 判断白天还是黑夜
            var isDay = Math.cos(mRad) > -0.15;

            ctx.fillStyle = m.color;
            ctx.beginPath();
            ctx.arc(mx, my, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText(m.name, mx + 7, my + 3);

            // 昼夜指示小圆
            ctx.fillStyle = isDay ? '#fbbf24' : '#334155';
            ctx.beginPath();
            ctx.arc(mx, my - 10, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    draw();
    updateTime();

    g.controlArea.appendChild(_H('注意观察：地球自转方向是什么？当北京是白天时，伦敦和美国分别是什么时间？'));
    g.controlArea.appendChild(_K(
        '地球绕地轴自西向东自转，周期约为24小时（一天）。由于地球是不透明的球体，太阳只能照亮一半，形成昼半球和夜半球。<br>' +
        '随着地球自转，一个地方会交替进入昼半球和夜半球，产生<strong>昼夜交替现象</strong>。<br>' +
        '因地球自转，不同经度的地方存在<strong>时差</strong>（东边比西边早看到日出）。'
    ));
};

// ================================================================
// j003 地球公转-四季变化 【类型A-观察演示】
// ================================================================
window.initRevolutionSimulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    _S('j003-styles', ['.j003-w{display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;}.j003-w h2{margin:0;font-size:19px;color:' + _C.text + ';}.j003-info-row{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;}']);

    var W = 720, H = 480;
    var wrap = document.createElement('div');
    wrap.className = 'j003-w';
    wrap.innerHTML = '<h2>🌏 实验3：地球公转与四季变化</h2>';
    g.canvasArea.appendChild(wrap);

    wrap.appendChild(_I('学习目标', '1. 理解地球公转的方向、轨道和周期<br>2. 认识二分二至日的特点<br>3. 理解四季变化的原因'));

    var cv = _CV(W, H, '#0f172a');
    wrap.appendChild(cv);

    var playing = false, angle = 0, animId = null;
    var solarInfo = document.createElement('div');
    solarInfo.className = 'j003-info-row';
    wrap.appendChild(solarInfo);

    // 节气数据
    var seasons = [
        { name: '春分', angle: 0,   directLat: '0°（赤道）', desc: '全球昼夜平分', northDay: '12小时', trend: '北半球：春季开始' },
        { name: '夏至', angle: 90,  directLat: '23.5°N（北回归线）', desc: '北半球昼最长夜最短', northDay: '最长（约15小时）', trend: '北半球：夏季' },
        { name: '秋分', angle: 180, directLat: '0°（赤道）', desc: '全球昼夜平分', northDay: '12小时', trend: '北半球：秋季开始' },
        { name: '冬至', angle: 270, directLat: '23.5°S（南回归线）', desc: '北半球昼最短夜最长', northDay: '最短（约9小时）', trend: '北半球：冬季' }
    ];

    // 控制区
    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:10px;';
    wrap.appendChild(ctrlDiv);

    ctrlDiv.appendChild(_B('▶ 公转动画', function() {
        playing = !playing;
        this.textContent = playing ? '⏸ 暂停' : '▶ 公转动画';
        if (playing) animateRev();
        else if (animId) cancelAnimationFrame(animId);
    }));

    seasons.forEach(function(s) {
        ctrlDiv.appendChild(_B('→ ' + s.name, function() {
            playing = false;
            ctrlDiv.firstChild.textContent = '▶ 公转动画';
            if (animId) cancelAnimationFrame(animId);
            angle = s.angle;
            updateSeasonInfo();
            draw();
        }, '#64748b'));
    });

    function getCurrentSeason() {
        var normalized = ((angle % 360) + 360) % 360;
        if (normalized < 45 || normalized >= 315) return seasons[0];
        if (normalized >= 45 && normalized < 135) return seasons[1];
        if (normalized >= 135 && normalized < 225) return seasons[2];
        return seasons[3];
    }

    function updateSeasonInfo() {
        var s = getCurrentSeason();
        solarInfo.innerHTML = [
            '<div style="background:' + _C.card + ';padding:12px 18px;border-radius:10px;border:1px solid ' + _C.border + ';min-width:200px;">',
            '<h4 style="margin:0 0 6px 0;color:' + _C.primary + ';">节气：' + s.name + '</h4>',
            '<p style="margin:2px 0;font-size:13px;color:' + _C.muted + ';"><b>太阳直射：</b>' + s.directLat + '</p>',
            '<p style="margin:2px 0;font-size:13px;color:' + _C.muted + ';"><b>现象：</b>' + s.desc + '</p>',
            '<p style="margin:2px 0;font-size:13px;color:' + _C.muted + ';"><b>北半球白昼：</b>' + s.northDay + '</p>',
            '<p style="margin:2px 0;font-size:13px;color:' + _C.muted + ';"><b>' + s.trend + '</b></p>',
            '</div>'
        ].join('');
    }

    function animateRev() {
        if (!playing) return;
        angle = (angle + 0.4) % 360;
        updateSeasonInfo();
        draw();
        animId = requestAnimationFrame(animateRev);
    }

    function draw() {
        var ctx = cv.getContext('2d');
        var sunCX = W / 2, sunCY = H / 2;
        var orbR = 170;
        ctx.clearRect(0, 0, W, H);

        // 星空背景
        for (var si = 0; si < 50; si++) {
            ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.4) + ')';
            ctx.beginPath();
            ctx.arc((si * 151) % W, (si * 113) % H, 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // 太阳
        var sg = ctx.createRadialGradient(sunCX, sunCY, 0, sunCX, sunCY, 40);
        sg.addColorStop(0, '#fef08a');
        sg.addColorStop(0.5, '#fbbf24');
        sg.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(sunCX, sunCY, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('☀ 太阳', sunCX, sunCY + 55);

        // 公转轨道
        ctx.strokeStyle = 'rgba(148,163,184,0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.arc(sunCX, sunCY, orbR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 四个节气的轨道位置标记
        var positions = [
            { a: 0,   x: sunCX + orbR, y: sunCY },
            { a: 90,  x: sunCX,       y: sunCY - orbR },
            { a: 180, x: sunCX - orbR, y: sunCY },
            { a: 270, x: sunCX,       y: sunCY + orbR }
        ];
        positions.forEach(function(p) {
            ctx.strokeStyle = 'rgba(148,163,184,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.stroke();
        });

        // 当前地球位置
        var rad = (angle - 90) * Math.PI / 180;
        var earthX = sunCX + Math.cos(rad) * orbR;
        var earthY = sunCY + Math.sin(rad) * orbR;
        var earthR = 22;

        // 地球地轴（倾斜23.5°）
        ctx.save();
        ctx.translate(earthX, earthY);
        ctx.rotate(-23.5 * Math.PI / 180); // 地轴倾斜始终指向同一方向

        // 地球本体（半亮半暗）
        ctx.beginPath();
        ctx.arc(0, 0, earthR, 0, Math.PI * 2);
        ctx.clip();
        // 夜半球
        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(-earthR, -earthR, earthR * 2, earthR * 2);
        // 昼半球（朝向太阳的一侧）
        var toSunAngle = Math.atan2(sunCY - earthY, sunCX - earthX);
        ctx.save();
        ctx.rotate(toSunAngle);
        ctx.fillStyle = '#4a90d9';
        ctx.fillRect(0, -earthR, earthR, earthR * 2);
        ctx.restore();

        ctx.restore();

        // 地球边框
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
        ctx.stroke();

        // 地轴虚线
        ctx.save();
        ctx.translate(earthX, earthY);
        ctx.rotate(-23.5 * Math.PI / 180);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -earthR - 14);
        ctx.lineTo(0, earthR + 14);
        ctx.stroke();
        // 地轴指向标注
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Arial';
        ctx.fillText('N', 2, -earthR - 16);
        ctx.fillText('S', 2, earthR + 20);
        ctx.restore();

        // 地球标签
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🌍 地球', earthX, earthY + earthR + 34);

        // 从地球到太阳的连线（表示太阳光线）
        ctx.strokeStyle = 'rgba(251,191,36,0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(earthX, earthY);
        ctx.lineTo(sunCX, sunCY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    updateSeasonInfo();
    draw();

    g.controlArea.appendChild(_H('重点观察：地球公转时地轴是否倾斜？地轴指向是否改变？为什么会产生四季？'));
    g.controlArea.appendChild(_K(
        '地球绕太阳公转，周期约365天（一年）。公转轨道呈椭圆形，<strong>地轴始终倾斜约23.5°且指向不变</strong>（指向北极星附近）。<br>' +
        '这导致太阳直射点在南北回归线之间移动，从而产生<strong>四季变化</strong>：夏至日北半球昼长夜短（夏季），冬至日相反。'
    ));
};

// ================================================================
// j004 等高线地形图绘制 【类型B-动手操作/绘制】
// 学生手动连接等高点来学习等高线的绘制方法
// ================================================================
window.initJ004Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    _S('j004-styles', [
        '.j004-w{display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;}',
        '.j004-w h2{margin:0;font-size:19px;color:' + _C.text + ';}',
        '.j004-toolbar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:8px;}',
        '.j004-hint-bar{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:8px 16px;background:#fffbe6;border:1px solid #fde047;border-radius:8px;margin:6px 0;font-size:13px;}',
        '.j004-hint-item{display:flex;align-items:center;gap:4px;}'
    ].join(''));

    var W = 650, H = 480;
    var wrap = document.createElement('div');
    wrap.className = 'j004-w';
    wrap.innerHTML = '<h2>🏔️ 实验4：等高线地形图绘制</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 理解等高线的含义和基本特征<br>2. 学会根据地形的等高点绘制等高线<br>3. 能用等高线判读地形（山脊/山谷/山顶/鞍部/盆地）'));

    var cv = _CV(W, H, '#fafafa');
    cv.style.cursor = 'crosshair';
    wrap.appendChild(cv);

    // 高程点数据（模拟山体地形）
    var elevationPoints = [
        { x: 320, y: 120, elev: 500, label: 'A(山峰)' },
        { x: 260, y: 180, elev: 400, label: '' },
        { x: 380, y: 175, elev: 400, label: '' },
        { x: 210, y: 240, elev: 300, label: '' },
        { x: 320, y: 230, elev: 300, label: '' },
        { x: 430, y: 235, elev: 300, label: '' },
        { x: 160, y: 300, elev: 200, label: '' },
        { x: 260, y: 295, elev: 200, label: '' },
        { x: 380, y: 290, elev: 200, label: 'B(鞍部)' },
        { x: 480, y: 295, elev: 200, label: '' },
        { x: 130, y: 360, elev: 100, label: '' },
        { x: 230, y: 355, elev: 100, label: '' },
        { x: 320, y: 350, elev: 100, label: '' },
        { x: 430, y: 350, elev: 100, label: '' },
        { x: 510, y: 355, elev: 100, label: '' },
        { x: 100, y: 420, elev: 0,  label: '' },
        { x: 230, y: 415, elev: 0,  label: '' },
        { x: 400, y: 415, elev: 0,  label: '' },
        { x: 520, y: 415, elev: 0,  label: '' }
    ];
    var userLines = [];
    var currentLine = [];
    var currentElev = null;
    var showAnswer = false;
    var ctx = cv.getContext('2d');

    // 工具栏
    var toolbar = document.createElement('div');
    toolbar.className = 'j004-toolbar';
    wrap.appendChild(toolbar);

    [100, 200, 300, 400].forEach(function(elev) {
        var btn = _B(elev + 'm 等高线', function() {
            currentElev = elev;
            currentLine = [];
            updateToolbarState();
            draw();
        }, currentElev === elev ? _C.primary : '#64748b');
        btn.dataset.elev = elev;
        toolbar.appendChild(btn);
    });

    toolbar.appendChild(_B('✓ 完成当前线', function() {
        if (currentLine.length > 1) {
            userLines.push({ points: currentLine.slice(), elev: currentElev });
            currentLine = [];
        }
        draw();
    }, _C.success));

    toolbar.appendChild(_B('↺ 清空重绘', function() {
        userLines = [];
        currentLine = [];
        showAnswer = false;
        draw();
    }, '#ef4444'));

    toolbar.appendChild(_B('💡 显示答案', function() {
        showAnswer = !showAnswer;
        this.textContent = showAnswer ? '🔒 隐藏答案' : '💡 显示答案';
        draw();
    }, '#d97706'));

    function updateToolbarState() {
        toolbar.querySelectorAll('button').forEach(function(b) {
            if (b.dataset.elev !== undefined) {
                var isActive = Number(b.dataset.elev) === currentElev;
                b.style.background = isActive ? _C.primary : '#64748b';
            }
        });
    }

    // 口诀提示条
    var hintBar = document.createElement('div');
    hintBar.className = 'j004-hint-bar';
    hintBar.innerHTML = [
        '<span class="j004-hint-item"><b>口诀：</b></span>',
        '<span class="j004-hint-item">🔴 凸高为谷（向高处凸出→山谷）</span>',
        '<span class="j004-hint-item">🔵 凸低为脊（向低处凸出→山脊）</span>',
        '<span class="j004-hint-item">⭕ 闭合高内低→山顶 | 低内高→盆地</span>',
        '<span class="j004-hint-item">⛰ 两山顶间低洼处→鞍部</span>'
    ].join('');
    wrap.appendChild(hintBar);

    // 答案路径（预设的正确等高线路径）
    var answerPaths = {};
    [100, 200, 300, 400].forEach(function(elev) {
        answerPaths[elev] = elevationPoints.filter(function(p) { return p.elev === elev; }).map(function(p) { return { x: p.x, y: p.y }; });
    });

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // 浅色底图（地形暗示）
        ctx.fillStyle = '#f0fdf4';
        ctx.fillRect(0, 0, W, H);

        // 山体阴影（渐变暗示山峰位置）
        var peakGrad = ctx.createRadialGradient(320, 150, 0, 320, 150, 250);
        peakGrad.addColorStop(0, 'rgba(134,239,172,0.3)');
        peakGrad.addColorStop(1, 'rgba(240,253,244,0)');
        ctx.fillStyle = peakGrad;
        ctx.fillRect(0, 0, W, H);

        // 显示答案时的参考等高线
        if (showAnswer) {
            [100, 200, 300, 400].forEach(function(elev) {
                ctx.strokeStyle = 'rgba(34,197,94,0.25)';
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);
                var pts = answerPaths[elev];
                if (pts.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(pts[0].x, pts[0].y);
                    for (var pi = 1; pi < pts.length; pi++) {
                        ctx.lineTo(pts[pi].x, pts[pi].y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
                ctx.setLineDash([]);
            });
        }

        // 用户已完成的线条
        userLines.forEach(function(line) {
            ctx.strokeStyle = _C.primary;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(line.points[0].x, line.points[0].y);
            for (var ui = 1; ui < line.points.length; ui++) {
                ctx.lineTo(line.points[ui].x, line.points[ui].y);
            }
            ctx.closePath();
            ctx.stroke();
            // 标注高度
            if (line.points.length > 0) {
                var midIdx = Math.floor(line.points.length / 2);
                ctx.fillStyle = _C.primary;
                ctx.font = 'bold 11px Arial';
                ctx.fillText(line.elev + 'm', line.points[midIdx].x + 6, line.points[midIdx].y - 4);
            }
        });

        // 正在绘制的线条
        if (currentLine.length > 0) {
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(currentLine[0].x, currentLine[0].y);
            for (var ci = 1; ci < currentLine.length; ci++) {
                ctx.lineTo(currentLine[ci].x, currentLine[ci].y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 绘制高程点
        elevationPoints.forEach(function(p) {
            // 点的外圈
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
            ctx.fill();
            // 点的内圈（颜色区分海拔等级）
            var colors = { 0: '#94a3b8', 100: '#86efac', 200: '#4ade80', 300: '#22c55e', 400: '#16a34a', 500: '#15803d' };
            ctx.fillStyle = colors[p.elev] || '#333';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
            ctx.fill();
            // 高程数字
            ctx.fillStyle = p.elev >= 300 ? '#fff' : '#333';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(p.elev, p.x, p.y + 3);
            // 标签
            if (p.label) {
                ctx.fillStyle = '#1e293b';
                ctx.font = 'bold 12px Arial';
                ctx.fillText(p.label, p.x + 14, p.y);
            }
        });

        // 当前模式提示
        if (currentElev) {
            ctx.fillStyle = '#f97316';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('正在绘制 ' + currentElev + 'm 等高线 — 连接所有标有 ' + currentElev + ' 的点', 10, 22);
        }
    }

    cv.onclick = function(e) {
        if (!currentElev) return;
        var rect = cv.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        // 找最近的同高程点
        var nearest = null, minDist = 30;
        elevationPoints.forEach(function(p) {
            if (p.elev === currentElev) {
                var d = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
                if (d < minDist) { minDist = d; nearest = p; }
            }
        });
        if (nearest) {
            currentLine.push({ x: nearest.x, y: nearest.y });
            draw();
        }
    };

    draw();

    g.controlArea.appendChild(_I('操作步骤', '1. 选择要绘制的等高线高度（100m/200m/300m/400m）<br>2. 依次点击相同高度的各高程点，将它们连成闭合曲线<br>3. 点击"完成当前线"确认，然后选择下一高度继续绘制<br>4. 全部完成后可对比答案'));
    g.controlArea.appendChild(_K(
        '等高线是把地面上海拔高度相同的各点连接成的闭合曲线。其特征：<br>' +
        '• 同线等高：同一条等高线上各点海拔相同<br>' +
        '• 同图等距：同一幅图上等高距一致<br>' +
        '• 闭合曲线：等高线都是闭合的（可能在图外闭合）<br>' +
        '• 密陡疏缓：等高线密处坡度陡，疏处坡度缓'
    ));
};

// ================================================================
// j005 世界气温分布 【类型C-模拟探索】
// ================================================================
window.initJ005Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    _S('j005-styles', ['.j005-w{display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;}.j005-w h2{margin:0;font-size:19px;color:' + _C.text + ';}.j005-chart-area{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;}']);

    var wrap = document.createElement('div');
    wrap.className = 'j005-w';
    wrap.innerHTML = '<h2>🌡️ 实验5：世界气温分布规律</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 理解世界气温的分布规律<br>2. 分析影响气温的主要因素<br>3. 掌握气温分布图的阅读方法'));

    // 变量控制
    var varsDiv = document.createElement('div');
    varsDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:12px;background:' + _C.card + ';border:1px solid ' + _C.border + ';border-radius:12px;width:100%;max-width:800px;box-sizing:border-box;';
    wrap.appendChild(varsDiv);

    var month = 7; // 默认七月
    var latitude = 30; // 默认30°N
    var isLand = true;

    varsDiv.appendChild(_SL(1, 12, month, 1, '月份', redraw));
    varsDiv.appendChild(_SL(-60, 60, latitude, 5, '纬度(°)', redraw));
    
    var landBtn = _B('🏔️ 陆地', function() { isLand = true; landBtn.style.opacity = '1'; seaBtn.style.opacity = '0.5'; redraw(); }, _C.primary);
    var seaBtn = _B('🌊 海洋', function() { isLand = false; seaBtn.style.opacity = '1'; landBtn.style.opacity = '0.5'; redraw(); }, '#64748b');
    seaBtn.style.opacity = '0.5';
    varsDiv.appendChild(landBtn);
    varsDiv.appendChild(seaBtn);

    // 图表区
    var chartArea = document.createElement('div');
    chartArea.className = 'j005-chart-area';
    wrap.appendChild(chartArea);

    var mapCanvas = _CV(600, 280);
    chartArea.appendChild(mapCanvas);

    var barCanvas = _CV(500, 200);
    chartArea.appendChild(barCanvas);

    function calcTemp(lat, m, land) {
        // 简化的气温模型：基于纬度和季节
        var baseTemp = 30 - Math.abs(lat) * 0.55; // 纬度因子
        var seasonOffset = land
            ? Math.cos((m - 7) / 12 * 2 * Math.PI) * 10 * (Math.abs(lat) / 60) // 陆地季节温差大
            : Math.cos((m - 7) / 12 * 2 * Math.PI) * 5 * (Math.abs(lat) / 60);  // 海洋季节温差小
        var altOffset = -6.5 * Math.max(0, Math.abs(lat) - 30) / 30; // 高纬降温更快
        return baseTemp + seasonOffset + altOffset;
    }

    function redraw() {
        var mCtx = mapCanvas.getContext('2d');
        var mw = mapCanvas.width, mh = mapCanvas.height;
        mCtx.clearRect(0, 0, mw, mh);

        // 绘制简化的世界温度分布图（纬度带）
        var bands = [
            { latRange: [90, 60], color: '#93c5fd', label: '寒带' },
            { latRange: [60, 40], color: '#86efac', label: '温带北部' },
            { latRange: [40, 20], color: '#fde047', label: '亚热带' },
            { latRange: [20, 0],  color: '#fca5a5', label: '热带' },
            { latRange: [0, -20], color: '#fca5a5', label: '热带(S)' },
            { latRange: [-20, -40], color: '#fde047', label: '亚热带(S)' },
            { latRange: [-40, -60], color: '#86efac', label: '温带南部' },
            { latRange: [-60, -90], color: '#93c5fd', label: '寒带(S)' }
        ];

        // 应用月份偏移（南北半球季节相反）
        var monthFactor = (month - 6) / 6; // -1 到 +1
        bands.forEach(function(band, idx) {
            var avgLat = (band.latRange[0] + band.latRange[1]) / 2;
            var shift = avgLat > 0 ? monthFactor * 10 : -monthFactor * 10;
            var hueShift = Math.round(shift * 3); // 温度偏移影响色调
            mCtx.fillStyle = band.color;
            var topPct = (90 - band.latRange[0]) / 180;
            var botPct = (90 - band.latRange[1]) / 180;
            mCtx.fillRect(0, topPct * mh, mw, (botPct - topPct) * mh);
            
            // 标注
            mCtx.fillStyle = 'rgba(0,0,0,0.5)';
            mCtx.font = '12px Arial';
            mCtx.fillText(band.label + ' (~' + calcTemp(avgLat, month, true).toFixed(0) + '°C)', 8, topPct * mh + 14);
        });

        // 标记当前选择的纬度
        var selY = (90 - latitude) / 180 * mh;
        mCtx.strokeStyle = _C.danger;
        mCtx.lineWidth = 3;
        mCtx.setLineDash([6, 3]);
        mCtx.beginPath();
        mCtx.moveTo(0, selY);
        mCtx.lineTo(mw, selY);
        mCtx.stroke();
        mCtx.setLineDash([]);

        // 标注当前位置的温度
        var curTemp = calcTemp(latitude, month, isLand);
        mCtx.fillStyle = _C.danger;
        mCtx.font = 'bold 14px Arial';
        mCtx.fillText('▲ ' + (latitude >= 0 ? latitude + '°N' : (-latitude) + '°S') + '  |  ' + (isLand ? '陆地' : '海洋') + '  |  预计温度: ' + curTemp.toFixed(1) + '°C', 8, selY - 6);

        // 绘制柱状图：不同纬度的温度对比
        var bCtx = barCanvas.getContext('2d');
        var bw = barCanvas.width, bh = barCanvas.height;
        bCtx.clearRect(0, 0, bw, bh);

        var latitudes = [-60, -40, -20, 0, 20, 40, 60];
        var barWidth = 50;
        var startX = 40;
        var maxTemp = 40, minTemp = -30;

        bCtx.fillStyle = '#64748b';
        bCtx.font = '11px Arial';
        bCtx.fillText('不同纬度 ' + month + '月 平均气温对比 (°C)', 10, 16);

        latitudes.forEach(function(lt, i) {
            var temp = calcTemp(lt, month, isLand);
            var barH = ((temp - minTemp) / (maxTemp - minTemp)) * (bh - 50);
            var bx = startX + i * (barWidth + 14);
            var by = bh - 30 - barH;

            // 柱子
            var grad = bCtx.createLinearGradient(bx, by, bx, bh - 30);
            grad.addColorStop(0, lt === latitude ? _C.danger : _C.primary);
            grad.addColorStop(1, lt === latitude ? '#fca5a5' : '#93c5fd');
            bCtx.fillStyle = grad;
            bCtx.fillRect(bx, by, barWidth, barH);

            // 数值标签
            bCtx.fillStyle = '#1e293b';
            bCtx.font = 'bold 11px Arial';
            bCtx.textAlign = 'center';
            bCtx.fillText(temp.toFixed(1), bx + barWidth / 2, by - 4);

            // 纬度标签
            bCtx.fillStyle = '#64748b';
            bCtx.font = '11px Arial';
            var latLabel = lt === 0 ? '0°' : (lt > 0 ? lt + '°N' : (-lt) + '°S');
            bCtx.fillText(latLabel, bx + barWidth / 2, bh - 12);
        });
    }

    redraw();

    g.controlArea.appendChild(_H('尝试调节月份和纬度，观察：1. 赤道附近全年高温还是低温？2. 南北半球的季节是否相反？3. 同一纬度陆地和海洋哪个温差更大？'));
    g.controlArea.appendChild(_K(
        '世界气温分布的基本规律：<br>' +
        '1. <strong>从赤道向两极递减</strong>：太阳辐射由赤道向两递减少<br>' +
        '2. <strong>同纬度夏热冬冷</strong>：北半球7月最热、1月最冷；南半球相反<br>' +
        '3. <strong>同纬度海陆差异</strong>：夏季陆地＞海洋，冬季海洋＞陆地<br>' +
        '4. <strong>海拔越高越冷</strong>：每上升1000米，气温下降约6°C'
    ));
};

// ================================================================
// j006 世界降水分布 【类型C-模拟探索】
// ================================================================
window.initJ006Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    _S('j006-styles', ['.j006-w{display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;}.j006-w h2{margin:0;font-size:19px;color:' + _C.text + ';}.j006-band{display:inline-block;padding:4px 12px;border-radius:16px;font-size:12px;margin:2px;}']);

    var wrap = document.createElement('div');
    wrap.className = 'j006-w';
    wrap.innerHTML = '<h2>🌧️ 实验6：世界降水分布规律</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 认识世界四大降水带的分布<br>2. 理解降水类型的成因（对流雨/地形雨/锋面雨）<br>3. 分析影响降水分布的主要因素'));

    var cv = _CV(700, 380, '#f0f9ff');
    wrap.appendChild(cv);

    // 降水带数据
    var rainZones = [
        { name: '赤道多雨带', latRange: [0, 10], rain: '>2000mm', type: '对流雨', cause: '终年高温，空气强烈对流', color: '#0ea5e9' },
        { name: '副热带少雨带', latRange: [20, 30], rain: '<500mm', type: '少雨', cause: '下沉气流为主', color: '#f59e0b' },
        { name: '中纬度多雨带', latRange: [40, 60], rain: '500-1000mm', type: '锋面雨', cause: '冷暖空气交汇', color: '#22c55e' },
        { name: '极地少雨带', latRange: [70, 90], rain: '<250mm', type: '少雨', cause: '寒冷干燥，水汽少', color: '#94a3b8' }
    ];

    var selectedZone = null;
    var showDetails = true;
    var ctx = cv.getContext('2d');

    function draw() {
        ctx.clearRect(0, 0, cv.width, cv.height);

        // 绘制降水带
        rainZones.forEach(function(zone, zi) {
            var topPct = (90 - zone.latRange[1]) / 180 * cv.height;
            var botPct = (90 - zone.latRange[0]) / 180 * cv.height;
            var h = (botPct - topPct) * cv.height;

            // 背景
            var grad = ctx.createLinearGradient(0, topPct * cv.height, 0, botPct * cv.height);
            grad.addColorStop(0, zone.color + '18');
            grad.addColorStop(1, zone.color + '30');
            ctx.fillStyle = grad;
            ctx.fillRect(0, topPct * cv.width, cv.width, h);

            // 边框
            if (selectedZone === zone) {
                ctx.strokeStyle = zone.color;
                ctx.lineWidth = 3;
            } else {
                ctx.strokeStyle = zone.color + '60';
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.moveTo(0, topPct * cv.height);
            ctx.lineTo(cv.width, topPct * cv.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, botPct * cv.height);
            ctx.lineTo(cv.width, botPct * cv.height);
            ctx.stroke();

            // 标签
            ctx.fillStyle = zone.color;
            ctx.font = 'bold 14px Arial';
            var midY = ((topPct + botPct) / 2) * cv.height;
            ctx.fillText('▸ ' + zone.name + ' （年降水量' + zone.rain + '）', 14, midY);
        });

        // 详情面板
        if (selectedZone && showDetails) {
            var z = selectedZone;
            ctx.fillStyle = 'rgba(255,255,255,0.95)';
            roundRect(ctx, 420, 20, 265, 140, 10);
            ctx.fill();
            ctx.strokeStyle = z.color;
            ctx.lineWidth = 2;
            roundRect(ctx, 420, 20, 265, 140, 10);
            ctx.stroke();

            ctx.fillStyle = z.color;
            ctx.font = 'bold 15px Arial';
            ctx.fillText(z.name, 436, 48);
            ctx.fillStyle = '#334155';
            ctx.font = '13px Arial';
            ctx.fillText('年降水量：' + z.rain, 436, 74);
            ctx.fillText('主要类型：' + z.type, 436, 98);
            ctx.fillText('成因：' + z.cause, 436, 122);
            ctx.fillText('典型地区：' + getZoneExample(z.name), 436, 146);
        }

        // 底部说明
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Arial';
        ctx.fillText('💡 点击各降水带可查看详细信息', 10, cv.height - 8);
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function getZoneExample(name) {
        switch(name) {
            case '赤道多雨带': return '亚马逊平原、刚果盆地、东南亚';
            case '副热带少雨带': return '撒哈拉沙漠、阿拉伯半岛、澳洲内陆';
            case '中纬度多雨带': return '欧洲西部、中国东部、北美东部';
            case '极地少雨带': return '南极洲、格陵兰岛、北极地区';
            default: return '';
        }
    }

    cv.onclick = function(e) {
        var rect = cv.getBoundingClientRect();
        var y = e.clientY - rect.top;
        var lat = 90 - (y / cv.height * 180);

        // 找到点击的降水带
        var clickedZone = null;
        for (var i = 0; i < rainZones.length; i++) {
            if (lat <= rainZones[i].latRange[1] && lat >= rainZones[i].latRange[0]) {
                clickedZone = rainZones[i];
                break;
            }
        }
        if (clickedZone) {
            selectedZone = (selectedZone === clickedZone) ? null : clickedZone;
            draw();
        }
    };

    draw();

    // 降雨类型切换
    var typeDiv = document.createElement('div');
    typeDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;';
    ['对流雨 ☁️↑', '地形雨 ⛰️↑↓', '锋面雨 🌀↕'].forEach(function(type) {
        var btn = _B(type, function() {
            alert(getRainTypeInfo(type.split(' ')[0]));
        }, '#64748b');
        typeDiv.appendChild(btn);
    });
    wrap.appendChild(typeDiv);

    function getRainTypeInfo(t) {
        if (t === '对流雨') return '【对流雨】\n\n成因：近地面空气强烈受热膨胀上升，在高空冷却凝结形成降水。\n特点：强度大、历时短、范围小。\n分布：赤道附近地区全年盛行。';
        if (t === '地形雨') return '【地形雨】\n\n成因：湿润气流遇到山地阻挡，沿山坡爬升冷却凝结。\n特点：迎风坡多雨，背风坡少雨（雨影效应）。\n分布：喜马拉雅山脉南侧、台湾山脉东侧。';
        if (t === '锋面雨') return '【锋面雨】\n\n成因：冷暖空气交汇，暖空气沿锋面爬升冷却凝结。\n特点：持续时间长、覆盖范围广、强度变化大。\n分布：中纬度地区（温带）。';
        return '';
    }

    g.controlArea.appendChild(_K(
        '世界降水的空间分布呈现<strong>地带性规律</strong>：<br>' +
        '• <strong>赤道多雨带</strong>：受赤道低压控制，全年高温多雨<br>' +
        '• <strong>副热带少雨带</strong>：受副热带高压控制，下沉气流少雨（但大陆东岸例外）<br>' +
        '• <strong>中纬度多雨带</strong>：锋面活动频繁，降水较多<br>' +
        '• <strong>极地少雨带</strong>：气温低，蒸发弱，空气中水汽含量极少'
    ));
};

// ================================================================
// j007 风向与风力 【类型B-动手操作】
// ================================================================
window.initJ007Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    _S('j007-styles', ['.j007-w{display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;}.j007-w h2{margin:0;font-size:19px;color:' + _C.text + ';}.j007-result{text-align:center;padding:10px;font-size:16px;font-weight:bold;border-radius:8px;margin:6px 0;}']);

    var W = 550, H = 480;
    var wrap = document.createElement('div');
    wrap.className = 'j007-w';
    wrap.innerHTML = '<h2>💨 实验7：风向与风力判断</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 理解水平气压梯度力、地转偏向力、摩擦力对风向的影响<br>2. 学会在等压线图上画出风向<br>3. 掌握北半球右偏、南半球左偏的规律'));

    var cv = _CV(W, H, '#f8fafc');
    wrap.appendChild(cv);

    var hemisphere = 'north';
    var resultDiv = document.createElement('div');
    resultDiv.className = 'j007-result';
    resultDiv.style.cssText = 'background:#eff6ff;border:1px solid #bfdbfe;padding:10px 20px;';
    resultDiv.innerHTML = '请在图中点击，设置高压中心位置';
    wrap.appendChild(resultDiv);

    // 控制项
    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;gap:10px;justify-content:center;padding:8px;flex-wrap:wrap;';
    wrap.appendChild(ctrlDiv);

    var nBtn = _B('🌐 北半球', function() { hemisphere = 'north'; nBtn.style.background = _C.primary; sBtn.style.background = '#64748b'; setupMap(); }, _C.primary);
    var sBtn = _B('🌐 南半球', function() { hemisphere = 'south'; sBtn.style.background = _C.primary; nBtn.style.background = '#64748b'; setupMap(); }, '#64748b');
    ctrlDiv.appendChild(nBtn);
    ctrlDiv.appendChild(sBtn);
    ctrlDiv.appendChild(_B('🔄 换一题', function() { setupMap(); }, _C.warning));

    // 等压线数据
    var isobars = []; // {cx, cy, pressure, r}
    var highCenter = null;
    var ctx = cv.getContext('2d');

    function setupMap() {
        // 随机生成一个高压系统
        highCenter = { x: W / 2 + (Math.random() - 0.5) * 120, y: H / 2 + (Math.random() - 0.5) * 100 };
        var pressures = [1020, 1016, 1012, 1008, 1004];
        isobars = pressures.map(function(p, i) {
            return { cx: highCenter.x, cy: highCenter.y, pressure: p, r: 40 + i * 35 };
        });
        resultDiv.style.background = '#eff6ff';
        resultDiv.style.borderColor = '#bfdbfe';
        resultDiv.innerHTML = '这是一个<strong>高压中心</strong>（' + (hemisphere === 'north' ? '北' : '南') + '半球），请判断：风从中心向四周吹，应该偏向什么方向？';
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // 背景网格
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;
        for (var gx = 0; gx < W; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
        for (var gy = 0; gy < H; gy += 30) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

        // 绘制等压线
        isobars.forEach(function(iso) {
            ctx.strokeStyle = iso.pressure >= 1012 ? '#3b82f6' : '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(iso.cx, iso.cy, iso.r, 0, Math.PI * 2);
            ctx.stroke();
            // 标注气压值
            ctx.fillStyle = iso.pressure >= 1012 ? '#3b82f6' : '#ef4444';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(iso.pressure, iso.cx + iso.r + 4, iso.cy - 4);
        });

        // 高压中心标记
        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('高(H)', highCenter.x, highCenter.y);
        ctx.textAlign = 'left';

        // 绘制正确的风向示意（在4个方位显示）
        var dirs = [{ dx: 1, dy: 0, pos: '东' }, { dx: -1, dy: 0, pos: '西' }, { dx: 0, dy: 1, pos: '南' }, { dx: 0, dy: -1, pos: '北' }];
        var deflect = hemisphere === 'north' ? 1 : -1; // 北半球右偏(+), 南半球左偏(-)

        dirs.forEach(function(d) {
            var sx = highCenter.x + d.dx * 140;
            var sy = highCenter.y + d.dy * 120;

            // 水平气压梯度力方向（从高压指向低压，即向外辐射）
            var pgfx = d.dx * 35, pgfy = d.dy * 35;

            // 地转偏向力使风向偏转（北半球右偏，南半球左偏）
            // 对于向外吹的风：右侧偏转角度约30-45°
            var perpDx = -d.dy * deflect * 20;
            var perpDy = d.dx * deflect * 20;

            var endX = sx + pgfx + perpDx;
            var endY = sy + pgfy + perpDy;

            // 绘制风的箭头
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // 箭头头部
            var angle = Math.atan2(endY - sy, endX - sx);
            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 10 * Math.cos(angle - 0.4), endY - 10 * Math.sin(angle - 0.4));
            ctx.lineTo(endX - 10 * Math.cos(angle + 0.4), endY - 10 * Math.sin(angle + 0.4));
            ctx.closePath();
            ctx.fill();

            // 方位标签
            ctx.fillStyle = '#64748b';
            ctx.font = '11px Arial';
            ctx.fillText(d.pos + '侧风向', sx - 10, sy + (d.dy >= 0 ? 20 : -8));
        });

        // 三种力的图例
        ctx.fillStyle = '#fff';
        ctx.fillRect(8, H - 95, 200, 88);
        ctx.strokeStyle = _C.border;
        ctx.strokeRect(8, H - 95, 200, 88);
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = _C.text;
        ctx.fillText('三力作用示意图：', 14, H - 78);
        
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(14, H - 62); ctx.lineTo(44, H - 62); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '11px Arial'; ctx.fillText('①水平气压梯度力(垂直等压线)', 50, H - 58);

        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(14, H - 44); ctx.lineTo(44, H - 44); ctx.stroke();
        ctx.fillText('②地转偏向力(' + (hemisphere === 'north' ? '北半球右偏' : '南半球左偏') + ')', 50, H - 40);

        ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(14, H - 26); ctx.lineTo(44, H - 26); ctx.stroke();
        ctx.fillText('③实际风向(前两力的合力)', 50, H - 22);
    }

    setupMap();

    g.controlArea.appendChild(_H('观察：高压区的风是顺时针还是逆时针吹？换成南半球后有什么变化？'));
    g.controlArea.appendChild(_K(
        '近地面风向受三个力共同作用：<br>' +
        '① <strong>水平气压梯度力</strong>：垂直于等压线，由高压指向低压（原动力）<br>' +
        '② <strong>地转偏向力</strong>：北半球向右偏，南半球向左偏（只改变方向，不改变大小）<br>' +
        '③ <strong>摩擦力</strong>：与风向相反，减小风速，使风向与等压线斜交<br>' +
        '结论：北半球高压区风呈<strong>顺时针</strong>辐散，低压区呈<strong>逆时针</strong>辐合'
    ));
};

console.log('[AI地理实验教学平台] V3 模拟器已加载 - 前7个实验(j001-j007)');

// ================================================================
// j008 岩石圈物质循环 【类型D-过程理解】
// 三大类岩石的转化过程交互图
// ================================================================
window.initJ008Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    var W = 680, H = 420;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;';
    wrap.innerHTML = '<h2 style="margin:0;font-size:19px;color:' + _C.text + ';">🪨 实验8：岩石圈物质循环</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 认识三大类岩石（岩浆岩、沉积岩、变质岩）<br>2. 理解各类岩石的形成过程和相互转化关系<br>3. 掌握岩石圈物质循环的基本模式'));

    var cv = _CV(W, H, '#fafbff');
    cv.style.cursor = 'pointer';
    wrap.appendChild(cv);

    // 岩石节点数据
    var rocks = [
        { id: 'magma', name: '岩浆', x: W/2, y: H/2, r: 45, color: '#ef4444', desc: '地下深处高温熔融的物质\n温度：700~1300°C', examples: '' },
        { id: 'igneous', name: '岩浆岩', x: W/2, y: H/2 - 120, r: 42, color: '#f97316', desc: '形成：岩浆冷却凝固而成\n特点：结晶颗粒状结构', examples: '花岗岩（侵入）、玄武岩（喷出）' },
        { id: 'sediment', name: '沉积岩', x: W/2 - 150, y: H/2 + 100, r: 42, color: '#3b82f6', desc: '形成：沉积物经压实、胶结而成\n特点：层理构造、含化石', examples: '石灰岩、砂岩、页岩' },
        { id: 'metamorphic', name: '变质岩', x: W/2 + 150, y: H/2 + 100, r: 42, color: '#8b5cf6', desc: '形成：已有岩石在高温高压下变质而成\n特点：片理构造', examples: '大理岩（石灰岩变质）、板岩（页岩变质）' }
    ];

    // 转化过程数据
    var processes = {
        'magma→igneous': { from: 'magma', to: 'igneous', label: '冷却凝固', detail: '岩浆在地表或地下冷却，矿物结晶形成岩浆岩。侵入型(如花岗岩)在地下缓慢冷却；喷出型(如玄武岩)快速冷却于地表。' },
        'igneous→sediment': { from: 'igneous', to: 'sediment', label: '外力作用', detail: '岩浆岩暴露地表后，经风化、侵蚀、搬运、堆积，最终沉积成沉积物，再固结成岩。' },
        'sediment→metamorphic': { from: 'sediment', to: 'metamorphic', label: '变质作用', detail: '沉积岩深埋地下后，在高温高压环境下发生矿物成分和结构的改变，变成变质岩。' },
        'metamorphic→magma': { from: 'metamorphic', to: 'magma', label: '重熔再生', detail: '变质岩在极高温度下重新熔融，成为岩浆的一部分。这是"旧岩消亡、新岩诞生"的过程。' },
        'sediment→magma': { from: 'sediment', to: 'magma', label: '重熔再生', detail: '沉积岩也可直接熔融为岩浆，如板块俯冲带的海底沉积物被带入地幔熔融。' },
        'igneous→metamorphic': { from: 'igneous', to: 'metamorphic', label: '变质作用', detail: '岩浆岩在高温高压下同样可以发生变质。例如花岗岩可变质为片麻岩。' },
        'metamorphic→sediment': { from: 'metamorphic', to: 'sediment', label: '外力作用', detail: '变质岩出露地表后，同样会经历风化侵蚀等外力作用，转化为沉积物。' }
    };

    var selectedRock = null;
    var selectedProcess = null;
    var ctx = cv.getContext('2d');

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // 绘制转化箭头
        Object.keys(processes).forEach(function(key) {
            var p = processes[key];
            var f = rocks.find(function(r) { return r.id === p.from; });
            var t = rocks.find(function(r) { return r.id === p.to; });
            if (!f || !t) return;

            ctx.save();
            var midX = (f.x + t.x) / 2;
            var midY = (f.y + t.y) / 2;
            var angle = Math.atan2(t.y - f.y, t.x - f.x);

            ctx.translate(midX, midY);
            ctx.rotate(angle);
            var isSelected = selectedProcess === key;

            // 箭头线
            ctx.strokeStyle = isSelected ? _C.primary : '#94a3b8';
            ctx.lineWidth = isSelected ? 3 : 2;
            ctx.beginPath();
            ctx.moveTo(-25, 0);
            ctx.lineTo(25, 0);
            ctx.stroke();

            // 箭头头
            ctx.fillStyle = isSelected ? _C.primary : '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(25, 0);
            ctx.lineTo(18, -5);
            ctx.lineTo(18, 5);
            ctx.closePath();
            ctx.fill();

            // 标签
            ctx.rotate(-angle);
            ctx.fillStyle = isSelected ? _C.primary : '#64748b';
            ctx.font = isSelected ? 'bold 12px Arial' : '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(p.label, 0, -10);

            ctx.restore();
        });

        // 绘制岩石节点
        rocks.forEach(function(r) {
            var isSel = selectedRock === r.id;

            // 外圈光晕
            if (isSel) {
                ctx.fillStyle = r.color + '18';
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.r + 10, 0, Math.PI * 2);
                ctx.fill();
            }

            // 节点圆
            var grad = ctx.createRadialGradient(r.x - 10, r.y - 10, 0, r.x, r.y, r.r);
            grad.addColorStop(0, r.color + 'cc');
            grad.addColorStop(1, r.color + '66');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
            ctx.fill();

            // 边框
            ctx.strokeStyle = isSel ? r.color : r.color + '80';
            ctx.lineWidth = isSel ? 3 : 2;
            ctx.stroke();

            // 名称
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 15px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(r.name, r.x, r.y + 4);

            // 实例小字
            if (r.examples) {
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.font = '9px Arial';
                ctx.fillText(r.examples, r.x, r.y + 16);
            }
        });

        // 详情面板
        if (selectedRock) {
            var sr = rocks.find(function(r) { return r.id === selectedRock; });
            drawDetailPanel(sr.name + ' 详细信息', sr.desc + (sr.examples ? '\n\n常见实例：' + sr.examples : ''), sr.color);
        } else if (selectedProcess && processes[selectedProcess]) {
            var sp = processes[selectedProcess];
            drawDetailPanel('【' + sp.label + '】过程详解', sp.detail, _C.primary);
        }
    }

    function drawDetailPanel(titleText, contentText, color) {
        ctx.fillStyle = 'rgba(255,255,255,0.96)';
        roundRect(ctx, 10, 10, 260, 160, 10);
        ctx.fill();
        ctx.strokeStyle = color || _C.border;
        ctx.lineWidth = 2;
        roundRect(ctx, 10, 10, 260, 160, 10);
        ctx.stroke();

        ctx.fillStyle = color || _C.text;
        ctx.font = 'bold 14px Arial';
        ctx.fillText(titleText, 20, 34);
        
        ctx.fillStyle = '#475569';
        ctx.font = '12px Arial';
        var lines = contentText.split('\n');
        lines.forEach(function(line, i) {
            ctx.fillText(line, 20, 54 + i * 17);
        });
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
    }

    cv.onclick = function(e) {
        var rect = cv.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;

        // 检查是否点击了岩石节点
        var clickedRock = null;
        for (var i = 0; i < rocks.length; i++) {
            var d = Math.sqrt(Math.pow(mx - rocks[i].x, 2) + Math.pow(my - rocks[i].y, 2));
            if (d < rocks[i].r) { clickedRock = rocks[i].id; break; }
        }

        if (clickedRock) {
            selectedRock = (selectedRock === clickedRock) ? null : clickedRock;
            selectedProcess = null;
            draw();
            return;
        }

        // 检查是否点击了箭头区域（简化：检查各箭头的中心附近）
        var clickedProc = null;
        Object.keys(processes).forEach(function(key) {
            var p = processes[key];
            var f = rocks.find(function(r) { return r.id === p.from; });
            var t = rocks.find(function(r) { return r.id === p.to; });
            if (!f || !t) return;
            var midX = (f.x + t.x) / 2, midY = (f.y + t.y) / 2;
            if (Math.sqrt(Math.pow(mx - midX, 2) + Math.pow(my - midY, 2)) < 30) {
                clickedProc = key;
            }
        });

        if (clickedProc) {
            selectedProcess = (selectedProcess === clickedProc) ? null : clickedProc;
            selectedRock = null;
            draw();
        }
    };

    draw();

    g.controlArea.appendChild(_H('点击各个岩石查看详情，点击箭头查看转化过程。思考：为什么说"岩石圈是一个开放的系统"？'));
    g.controlArea.appendChild(_K(
        '岩石圈物质循环是地球内部物质运动的重要形式。<br>' +
        '核心过程：<strong>岩浆 → 岩浆岩（冷凝）→ 沉积岩（外力作用）→ 变质岩（变质作用）→ 岩浆（重熔再生）</strong><br>' +
        '能量来源：地球内部的热能驱动岩浆活动和变质作用；太阳能驱动外力作用（风化、侵蚀）。'
    ));
};

// ================================================================
// j009 海陆热力性质差异 【类型C-模拟探索】
// ================================================================
window.initJ009Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;';
    wrap.innerHTML = '<h2 style="margin:0;font-size:19px;color:' + _C.text + ';">🌊🏔️ 实验9：海陆热力性质差异</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 理解陆地和海洋受热/散热速度不同的原因<br>2. 观察昼夜和季节海陆温差的变化<br>3. 理解海陆风和季风环流的形成基础'));

    var mode = 'day'; // day | night | year
    var timeVal = 12; // 小时 或 月份

    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:12px;background:' + _C.card + ';border:1px solid ' + _C.border + ';border-radius:12px;width:100%;max-width:760px;box-sizing:border-box;';
    wrap.appendChild(ctrlDiv);

    var dayBtn = _B('☀️ 昼夜变化', function() { mode = 'day'; timeVal = 12; updateBtns(); redraw(); }, _C.primary);
    var nightBtn = _B('🌙 夜间对比', function() { mode = 'night'; timeVal = 0; updateBtns(); redraw(); }, '#64748b');
    var yearBtn = _B('📅 季节变化', function() { mode = 'year'; timeVal = 7; updateBtns(); redraw(); }, '#64748b');

    ctrlDiv.appendChild(dayBtn);
    ctrlDiv.appendChild(nightBtn);
    ctrlDiv.appendChild(yearBtn);
    ctrlDiv.appendChild(_SL(mode === 'year' ? 1 : 12, mode === 'year' ? 12 : 24, timeVal, mode === 'year' ? 1 : 1, mode === 'year' ? '月份' : '时间(h)', function(v) { timeVal = v; redraw(); }));

    function updateBtns() {
        dayBtn.style.background = mode === 'day' ? _C.primary : '#64748b';
        nightBtn.style.background = mode === 'night' ? _C.primary : '#64748b';
        yearBtn.style.background = mode === 'year' ? _C.primary : '#64748b';
    }

    var cv = _CV(720, 320, '#fffbeb');
    wrap.appendChild(cv);
    var ctx = cv.getContext('2d');

    function calcTemp(isLand, t) {
        if (mode === 'day' || mode === 'night') {
            // 昼夜模式
            var baseLand = 15 + 12 * Math.sin(t / 24 * 2 * Math.PI - Math.PI / 2); // 陆地白天热得快
            var baseSea = 20 + 5 * Math.sin(t / 24 * 2 * Math.PI - Math.PI / 2);   // 海洋升温慢
            return isLand ? baseLand : baseSea;
        } else {
            // 季节模式
            var landSeason = 22 + 18 * Math.cos((t - 7) / 12 * 2 * Math.PI); // 陆地冬夏温差大
            var seaSeason = 18 + 10 * Math.cos((t - 7) / 12 * 2 * Math.PI);  // 海洋温差小
            return isLand ? landSeason : seaSeason;
        }
    }

    function redraw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        var landTemp = calcTemp(true, timeVal);
        var seaTemp = calcTemp(false, timeVal);

        // 左侧：陆地温度柱
        var barW = 120, maxH = 220;
        var landH = ((landTemp + 10) / 50) * maxH;
        var seaH = ((seaTemp + 10) / 50) * maxH;

        var landGrad = ctx.createLinearGradient(0, cv.height - 40 - landH, 0, cv.height - 40);
        landGrad.addColorStop(0, landTemp > 28 ? '#ef4444' : landTemp > 15 ? '#f97316' : '#3b82f6');
        landGrad.addColorStop(1, landTemp > 28 ? '#fca5a5' : landTemp > 15 ? '#fcd34d' : '#93c5fd');
        ctx.fillStyle = landGrad;
        roundRect(ctx, 140, cv.height - 40 - landH, barW, landH, 8);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏔️ 陆地', 200, cv.height - 18);
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = landTemp > 28 ? '#ef4444' : '#3b82f6';
        ctx.fillText(landTemp.toFixed(1) + '°C', 200, cv.height - 45 - landH);

        // 右侧：海洋温度柱
        var seaGrad = ctx.createLinearGradient(0, cv.height - 40 - seaH, 0, cv.height - 40);
        seaGrad.addColorStop(0, seaTemp > 24 ? '#ef4444' : seaTemp > 18 ? '#f97316' : '#3b82f6');
        seaGrad.addColorStop(1, seaTemp > 24 ? '#fca5a5' : seaTemp > 18 ? '#fcd34d' : '#93c5fd');
        ctx.fillStyle = seaGrad;
        roundRect(ctx, 460, cv.height - 40 - seaH, barW, seaH, 8);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('🌊 海洋', 520, cv.height - 18);
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = seaTemp > 24 ? '#ef4444' : '#3b82f6';
        ctx.fillText(seaTemp.toFixed(1) + '°C', 520, cv.height - 45 - seaH);

        // 温差标注
        var diff = landTemp - seaTemp;
        ctx.fillStyle = diff > 0 ? '#dc2626' : '#2563eb';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('温差：' + (diff >= 0 ? '+' : '') + diff.toFixed(1) + '°C （陆地' + (diff > 0 ? '更热' : '更冷') + '）', cv.width / 2, 24);

        // 热力环流方向提示
        ctx.fillStyle = '#475569';
        ctx.font = '13px Arial';
        var windHint = mode === 'day'
            ? (landTemp > seaTemp ? '白天：风从海洋吹向陆地（海风）☁️→🏔️' : '夜间：风从陆地吹向海洋（陆风）🏔️→☁️')
            : (mode === 'year'
                ? (timeVal >= 5 && timeVal <= 9 ? '夏季：大陆低压，风从海洋吹向陆地（夏季风）' : '冬季：大陆高压，风从陆地吹向海洋（冬季风）')
                : '');
        if (windHint) ctx.fillText(windHint, cv.width / 2, cv.height - 2);
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
    }

    redraw();

    g.controlArea.appendChild(_H('尝试调节时间滑块，观察：什么时候陆地比海洋热？什么时候相反？'));
    g.controlArea.appendChild(_K(
        '海陆热力性质差异的根本原因是<strong>比热容不同</strong>：<br>' +
        '• 陆地比热容小 → 升温快、降温也快 → 温差大（日较差和年较差都大）<br>' +
        '• 海水比热容大 → 升温慢、降温也慢 → 温差小<br>' +
        '这一差异是形成<strong>海陆风</strong>（昼夜尺度）和<strong>季风</strong>（年尺度）的根本原因。'
    ));
};

// ================================================================
// j010 河流地貌的发育 【类型C-模拟探索】
// ================================================================
window.initJ010Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:16px;gap:10px;';
    wrap.innerHTML = '<h2 style="margin:0;font-size:19px;color:' + _C.text + ';">🏞️ 实验10：河流地貌的发育</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 了解河流上、中、下游的地貌特征差异<br>2. 理解流速与侵蚀/沉积的关系<br>3. 认识V形河谷、冲积平原、三角洲等地貌'));

    var section = 'upstream'; // upstream | midstream | downstream
    var speed = 5;

    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;';
    wrap.appendChild(ctrlDiv);

    ['上游(upstream)', '中游(midstream)', '下游(downstream)'].forEach(function(s) {
        var label = s.split('(')[0];
        var val = s.match(/\(([^)]+)\)/)[1];
        var btn = _B(label, function() { section = val; updateSectionBtns(); redraw(); }, section === val ? _C.primary : '#64748b');
        btn.dataset.sec = val;
        ctrlDiv.appendChild(btn);
    });

    ctrlDiv.appendChild(_SL(1, 10, speed, 1, '流速', function(v) { speed = v; redraw(); }));

    function updateSectionBtns() {
        ctrlDiv.querySelectorAll('button').forEach(function(b) {
            if (b.dataset.sec) b.style.background = b.dataset.sec === section ? _C.primary : '#64748b';
        });
    }

    var cv = _CV(660, 380, '#f0fdf4');
    wrap.appendChild(cv);
    var ctx = cv.getContext('2d');

    var sectionsData = {
        upstream: {
            name: '上游河段', shape: 'V', color: '#6366f1',
            features: ['地势落差大', '水流湍急', '下切侵蚀为主'],
            landform: 'V形河谷（峡谷）',
            erosionType: '垂直侵蚀（下蚀）>> 侧向侵蚀（侧蚀）',
            deposit: '几乎无沉积，以搬运为主',
            example: '长江三峡、虎跳峡',
            profileDesc: '河谷深而窄，横剖面呈V字形'
        },
        midstream: {
            name: '中游河段', shape: 'U', color: '#8b5cf6',
            features: ['落差减小', '河道变宽', '侧蚀增强'],
            landform: '宽谷（槽形河谷）',
            erosionType: '侧向侵蚀 ≈ 垂直侵蚀',
            deposit: '开始出现边滩沉积',
            example: '武汉江段、南京江段',
            profileDesc: '河谷展宽，横剖面呈U形或槽形'
        },
        downstream: {
            name: '下游河段', shape: '平坦', color: '#a78bfa',
            features: ['地势平缓', '流速缓慢', '泥沙大量沉积'],
            landform: '冲积平原、河口三角洲',
            erosionType: '侵蚀极弱，以沉积为主',
            deposit: '河漫滩、沙洲、牛轭湖、三角洲',
            example: '长江中下游平原、黄河三角洲、珠江三角洲',
            profileDesc: '河道宽阔浅缓，多汊流、沙洲、牛轭湖'
        }
    };

    function redraw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        var data = sectionsData[section];

        // 标题
        ctx.fillStyle = data.color;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('▸ ' + data.name + ' — 流速等级：' + speed + '/10', cv.width / 2, 26);

        // 绘制横截面示意图
        var cx = 180, cy = 240;
        var riverDepth = section === 'upstream' ? 90 : section === 'midstream' ? 55 : 30;
        var riverWidth = section === 'upstream' ? 40 : section === 'midstream' ? 100 : 200;
        var bankHeight = section === 'upstream' ? 70 : section === 'midstream' ? 45 : 20;

        // 地面轮廓
        ctx.fillStyle = '#86efac';
        ctx.beginPath();
        ctx.moveTo(cx - 130, cy - bankHeight);
        ctx.lineTo(cx - riverWidth / 2 - 10, cy);
        ctx.lineTo(cx - riverWidth / 2, cy + riverDepth);
        ctx.lineTo(cx + riverWidth / 2, cy + riverDepth);
        ctx.lineTo(cx + riverWidth / 2 + 10, cy);
        ctx.lineTo(cx + 130, cy - bankHeight);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#166534';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 水
        ctx.fillStyle = '#3b82f6';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(cx - riverWidth / 2, cy + 2);
        ctx.lineTo(cx - riverWidth / 2, cy + riverDepth - 2);
        ctx.lineTo(cx + riverWidth / 2, cy + riverDepth - 2);
        ctx.lineTo(cx + riverWidth / 2, cy + 2);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        // 标注
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(data.profileDesc, cx, cy + riverDepth + 24);
        ctx.font = '11px Arial';
        ctx.fillStyle = '#64748b';
        ctx.fillText('横截面示意', cx, cy - bankHeight - 12);

        // 右侧：特征面板
        var panelX = 340, panelY = 50;
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.fillRect(panelX, panelY, 300, 300);
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(panelX, panelY, 300, 300);

        ctx.fillStyle = data.color;
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('📍 主要特征', panelX + 16, panelY + 28);

        ctx.fillStyle = '#334155';
        ctx.font = '13px Arial';
        data.features.forEach(function(f, i) {
            ctx.fillText('• ' + f, panelX + 16, panelY + 54 + i * 22);
        });

        ctx.fillStyle = data.color;
        ctx.font = 'bold 14px Arial';
        ctx.fillText('🏞️ 典型地貌', panelX + 16, panelY + 128);
        ctx.fillStyle = '#475569';
        ctx.font = '13px Arial';
        ctx.fillText(data.landform, panelX + 16, panelY + 152);

        ctx.fillStyle = data.color;
        ctx.font = 'bold 14px Arial';
        ctx.fillText('⚡ 作用方式', panelX + 16, panelY + 182);
        ctx.fillStyle = '#475569';
        ctx.font = '13px Arial';
        ctx.fillText(data.erosionType, panelX + 16, panelY + 206);

        ctx.fillStyle = data.color;
        ctx.font = 'bold 14px Arial';
        ctx.fillText('💧 沉积情况', panelX + 16, panelY + 236);
        ctx.fillStyle = '#475569';
        ctx.font = '13px Arial';
        ctx.fillText(data.deposit, panelX + 16, panelY + 260);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Arial';
        ctx.fillText('实例：' + data.example, panelX + 16, panelY + 288);
    }

    redraw();

    g.controlArea.appendChild(_K(
        '河流地貌发育的一般规律：<br>' +
        '• <strong>上游</strong>：下切侵蚀为主 → 形成V形峡谷<br>' +
        '• <strong>中游</strong>：侧蚀增强 → 河道展宽变浅<br>' +
        '• <strong>下游</strong>：沉积为主 → 冲积平原、三角洲<br>' +
        '控制因素：流速（决定侵蚀力大小）、流量（决定搬运能力）、含沙量（影响沉积速率）'
    ));
};

// ================================================================
// s001 热力环流原理 【类型A-观察演示+类型C结合】
// ================================================================
window.initS001Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    _S('s001-s', ['.s001-w{display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;}.s001-w h2{margin:0;font-size:19px;color:' + _C.text + ';}.s001-mode-btn{padding:6px 16px;border-radius:8px;font-size:13px;}']);

    var wrap = document.createElement('div');
    wrap.className = 's001-w';
    wrap.innerHTML = '<h2>🔥 高中实验1：热力环流原理</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 理解热力环流形成的根本原因（地面冷热不均）<br>2. 掌握热力环流的完整过程（受热上升→高空流动→冷却下沉→近地面回流）<br>3. 能解释海陆风、山谷风、城市风等现象'));

    var W = 650, H = 420;
    var cv = _CV(W, H, '#fefce8');
    wrap.appendChild(cv);

    var scene = 'basic'; // basic | sealand | valley | urban
    var intensity = 5; // 冷热差强度
    var particles = [];
    var animId = null, playing = true;

    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:8px;';
    wrap.appendChild(ctrlDiv);

    ctrlDiv.appendChild(_B(playing ? '⏸ 暂停' : '▶ 播放', function() {
        playing = !playing;
        this.textContent = playing ? '⏸ 暂停' : '▶ 播放';
        if (playing) animateParticles(); else if (animId) cancelAnimationFrame(animId);
    }));
    ctrlDiv.appendChild(_SL(1, 10, intensity, 1, '冷热差强度', redraw));

    ['基本原理', '海陆风', '山谷风', '城市热岛'].forEach(function(name, idx) {
        var vals = ['basic', 'sealand', 'valley', 'urban'];
        var btn = _B(name, function() { scene = vals[idx]; redrawScene(); }, scene === vals[idx] ? _C.primary : '#64748b');
        btn.className = 's001-mode-btn';
        btn.dataset.scn = vals[idx];
        ctrlDiv.appendChild(btn);
    });

    function redrawScene() {
        ctrlDiv.querySelectorAll('.s001-mode-btn').forEach(function(b) {
            if (b.dataset.scn) b.style.background = b.dataset.scn === scene ? _C.primary : '#64748b';
        });
        particles = [];
        initParticles();
        drawStatic();
    }

    function initParticles() {
        particles = [];
        for (var i = 0; i < 60; i++) {
            particles.push({
                x: W / 2 + (Math.random() - 0.5) * 280,
                y: H * 0.65 + (Math.random() - 0.5) * 120,
                vx: 0,
                vy: 0,
                phase: Math.random() * Math.PI * 2,
                size: 3 + Math.random() * 2
            });
        }
    }

    var ctx = cv.getContext('2d');
    var leftHot = true; // 左侧受热还是右侧受热

    function getSceneConfig() {
        switch(scene) {
            case 'sealand': return { leftLabel: '🌊 海洋(凉)', rightLabel: '🏔️ 陆地(热)', leftColor: '#3b82f6', rightColor: '#ef4444', hotRight: true };
            case 'valley':  return { leftLabel: '🏔️ 山坡(凉)', rightLabel: '🏜️ 谷地(热)', leftColor: '#3b82f6', rightColor: '#ef4444', hotRight: true };
            case 'urban':   return { leftLabel: '🌳 郊区(凉)', rightLabel: '🏙️ 城市(热)', leftColor: '#3b82f6', rightColor: '#ef4444', hotRight: true };
            default:       return { leftLabel: '❄️ 冷却区', rightLabel: '🔥 受热区', leftColor: '#3b82f6', rightColor: '#ef4444', hotRight: true };
        }
    }

    function drawStatic() {
        ctx.clearRect(0, 0, W, H);
        var cfg = getSceneConfig();

        // 地面背景
        ctx.fillStyle = '#fefce8';
        ctx.fillRect(0, 0, W, H);

        // 左右两个区域的颜色渐变暗示温度
        var leftGrad = ctx.createLinearGradient(0, 0, 0, H);
        leftGrad.addColorStop(0, cfg.leftColor + '08');
        leftGrad.addColorStop(1, cfg.leftColor + '25');
        ctx.fillStyle = leftGrad;
        ctx.fillRect(20, H * 0.58, W / 2 - 40, H * 0.38);

        var rightGrad = ctx.createLinearGradient(W / 2, 0, W / 2, H);
        rightGrad.addColorStop(0, cfg.rightColor + '08');
        rightGrad.addColorStop(1, cfg.rightColor + '25');
        ctx.fillStyle = rightGrad;
        ctx.fillRect(W / 2 + 20, H * 0.58, W / 2 - 40, H * 0.38);

        // 区域标签
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = cfg.leftColor;
        ctx.fillText(cfg.leftLabel, W * 0.25, H * 0.62);
        ctx.fillStyle = cfg.rightColor;
        ctx.fillText(cfg.rightLabel, W * 0.75, H * 0.62);

        // 地面线
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(20, H * 0.58);
        ctx.lineTo(W - 20, H * 0.58);
        ctx.stroke();

        // 大气边界框
        ctx.strokeStyle = 'rgba(148,163,184,0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(30, 30, W - 60, H * 0.52);
        ctx.setLineDash([]);

        // 标注环流方向
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#16a34a';

        // 上升气流标注（右侧）
        ctx.fillText('↑ 受热上升', W * 0.78, H * 0.38);
        // 下沉气流标注（左侧）
        ctx.fillText('↓ 冷却下沉', W * 0.22, H * 0.38);
        // 高空流向
        ctx.fillText('← 高空由热区流向冷区', W * 0.5, H * 0.14);
        // 近地面流向
        ctx.fillText('→ 近地面由冷区流向热区', W * 0.5, H * 0.56);
    }

    function animateParticles() {
        if (!playing) return;
        var cfg = getSceneConfig();
        var hotSide = cfg.hotRight ? 1 : -1;
        var strength = intensity / 5;

        particles.forEach(function(p) {
            // 判断粒子在哪一侧
            var relX = (p.x - W / 2) / (W / 2); // -1 到 1

            if (p.y < H * 0.35) {
                // 高空层：从热区向冷区流
                p.vx += (-hotSide * 0.05 * strength);
                p.vy *= 0.98;
            } else if (p.y > H * 0.53) {
                // 近地面层：从冷区向热区流
                p.vx += (hotSide * 0.06 * strength);
                p.vy *= 0.95;
                // 在热区一侧被抬升
                if ((hotSide > 0 && relX > 0.2) || (hotSide < 0 && relX < -0.2)) {
                    p.vy -= 0.03 * strength;
                }
                // 在冷区一侧下沉
                if ((hotSide > 0 && relX < -0.2) || (hotSide < 0 && relX > 0.2)) {
                    p.vy += 0.04 * strength;
                }
            } else {
                // 中间层：过渡
                if ((relX * hotSide > 0) && p.y > H * 0.35) {
                    // 热区上方继续上升
                    p.vy -= 0.02 * strength;
                }
                if ((relX * hotSide < 0) && p.y < H * 0.53) {
                    // 冷区上方下沉
                    p.vy += 0.02 * strength;
                }
            }

            // 应用速度
            p.x += p.vx;
            p.y += p.vy;

            // 阻尼
            p.vx *= 0.96;
            p.vy *= 0.96;

            // 边界反弹
            if (p.x < 40) { p.x = 40; p.vx *= -0.5; }
            if (p.x > W - 40) { p.x = W - 40; p.vx *= -0.5; }
            if (p.y < 45) { p.y = 45; p.vy = Math.abs(p.vy) * 0.5; }
            if (p.y > H * 0.55) { p.y = H * 0.55; p.vy = -Math.abs(p.vy) * 0.5; }
        });

        // 重绘静态部分
        drawStatic();

        // 绘制粒子
        particles.forEach(function(p) {
            ctx.fillStyle = 'rgba(22,163,74,' + (0.4 + Math.abs(p.vy) * 2) + ')';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // 速度向量（小箭头）
            if (Math.abs(p.vx) > 0.3 || Math.abs(p.vy) > 0.3) {
                ctx.strokeStyle = 'rgba(22,163,74,0.6)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.vx * 4, p.y + p.vy * 4);
                ctx.stroke();
            }
        });

        animId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    drawStatic();
    animateParticles();

    g.controlArea.appendChild(_H('观察粒子的运动轨迹：哪边空气上升？哪边下沉？形成了怎样的环流圈？'));
    g.controlArea.appendChild(_K(
        '热力环流是大气的最简单运动形式，其根本原因是<strong>地面冷热不均</strong>：<br>' +
        '① 受热地区：空气膨胀上升 → 近地面形成低压 → 高空形成高压<br>' +
        '② 冷却地区：空气收缩下沉 → 近地面形成高压 → 高空形成低压<br>' +
        '③ 水平方向：近地面从冷区流向热区，高空从热区流向冷区 → 形成<strong>环流圈</strong>'
    ));
};

console.log('[AI地理实验教学平台] V3 模拟器已加载 - j008-j010 + s001 完成');

// ================================================================
// s002 水循环过程 【类型D-过程理解】
// 交互式水循环流程图
// ================================================================
window.initS002Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    var W = 720, H = 460;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;';
    wrap.innerHTML = '<h2 style="margin:0;font-size:19px;color:' + _C.text + ';">💧 高中实验2：水循环过程</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 掌握水循环的主要环节和驱动力<br>2. 区分海陆间循环、陆地内循环和海上内循环<br>3. 理解人类活动对水循环的影响'));

    var cv = _CV(W, H, '#f0f9ff');
    cv.style.cursor = 'pointer';
    wrap.appendChild(cv);

    // 水循环环节
    var stages = [
        { id: 'evap', name: '蒸发', x: 580, y: 280, r: 32, color: '#0ea5e9', desc: '海洋/湖泊/河流表面的水受太阳辐射加热，变成水汽进入大气。全球每年蒸发量约502,800立方千米。其中海洋蒸发占88%，陆地（水体+蒸腾）占12%。', icon: '☀️↑' },
        { id: 'trans', name: '植物蒸腾', x: 480, y: 340, r: 28, color: '#22c55e', desc: '植物通过叶片气孔将水分以水汽形式释放到大气中。陆地上的降水约有64%通过蒸腾返回大气。森林的蒸腾作用比裸地强得多。', icon: '🌿↑' },
        { id: 'transport', name: '水汽输送', x: 300, y: 80, r: 35, color: '#a855f7', desc: '大气环流（盛行风）将海洋上空的水汽输送到陆地上空。这是海陆间水循环的关键"桥梁"，使得陆地降水的水源主要来自海洋。', icon: '🌀→' },
        { id: 'precip', name: '降水', x: 140, y: 200, r: 33, color: '#3b82f6', desc: '水汽在上升过程中冷却凝结，形成云滴，当云滴增大到不能悬浮时降落。包括雨、雪、雹等形式。全球年均降水量约505,000立方千米。', icon: '🌧️↓' },
        { id: 'runoff', name: '地表径流', x: 100, y: 340, r: 28, color: '#06b6d4', desc: '降水落到地面后沿地表流动，汇入河流、湖泊，最终回到海洋。这是塑造地貌的重要外力。人类活动（如修建水库）会显著改变径流。', icon: '🏞️→' },
        { id: 'infiltrate', name: '下渗', x: 230, y: 380, r: 26, color: '#0891b2', desc: '部分降水渗入地下，成为土壤水和地下水。下渗量取决于降水量、地形坡度、植被覆盖和土壤性质等因素。', icon: '⬇️💧' },
        { id: 'groundwater', name: '地下径流', x: 360, y: 400, r: 26, color: '#0e7490', desc: '地下水缓慢流动，最终排入河流或直接流入海洋。地下水流速极慢（每天几厘米到几米），但水量稳定。', icon: '💧→' }
    ];

    // 流程关系
    var flows = [
        ['evap', 'transport'], ['trans', 'transport'],
        ['transport', 'precip'],
        ['precip', 'runoff'], ['precip', 'infiltrate'],
        ['runoff', 'evap'], ['infiltrate', 'groundwater'],
        ['groundwater', 'evap']
    ];

    var selectedStage = null;
    var animStep = 0;
    var ctx = cv.getContext('2d');

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // 海洋区域（背景）
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(W * 0.65, H * 0.55, W * 0.3, H * 0.38);
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🌊 海洋', W * 0.82, H * 0.76);

        // 陆地区域（背景）
        ctx.fillStyle = '#bbf7d0';
        ctx.fillRect(20, H * 0.48, W * 0.52, H * 0.45);
        ctx.fillStyle = '#166534';
        ctx.fillText('🏔️ 陆地', W * 0.25, H * 0.92);

        // 绘制流程箭头
        flows.forEach(function(f) {
            var from = stages.find(function(s) { return s.id === f[0]; });
            var to = stages.find(function(s) { return s.id === f[1]; });
            if (!from || !to) return;

            ctx.strokeStyle = selectedStage === from.id || selectedStage === to.id ? from.color : 'rgba(148,163,184,0.35)';
            ctx.lineWidth = selectedStage === from.id || selectedStage === to.id ? 3 : 2;
            
            // 曲线箭头
            var midX = (from.x + to.x) / 2 + (Math.random() - 0.5) * 10;
            var midY = (from.y + to.y) / 2;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            if (Math.abs(to.x - from.x) > Math.abs(to.y - from.y)) {
                ctx.quadraticCurveTo(midX, from.y, to.x, to.y);
            } else {
                ctx.quadraticCurveTo(from.x, midY, to.x, to.y);
            }
            ctx.stroke();

            // 箭头头部
            var angle = Math.atan2(to.y - from.y, to.x - from.x);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.moveTo(to.x - Math.cos(angle) * (to.r + 5), to.y - Math.sin(angle) * (to.r + 5));
            ctx.lineTo(to.x - Math.cos(angle - 0.4) * 12, to.y - Math.sin(angle - 0.4) * 12);
            ctx.lineTo(to.x - Math.cos(angle + 0.4) * 12, to.y - Math.sin(angle + 0.4) * 12);
            ctx.closePath();
            ctx.fill();
        });

        // 绘制环节节点
        stages.forEach(function(s) {
            var isSel = selectedStage === s.id;
            if (isSel) {
                ctx.fillStyle = s.color + '20';
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r + 8, 0, Math.PI * 2); ctx.fill();
            }

            var grad = ctx.createRadialGradient(s.x - 6, s.y - 6, 0, s.x, s.y, s.r);
            grad.addColorStop(0, s.color + 'ee');
            grad.addColorStop(1, s.color + '88');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();

            ctx.strokeStyle = isSel ? s.color : s.color + '80';
            ctx.lineWidth = isSel ? 3 : 2;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(s.icon, s.x, s.y - 2);
            ctx.font = 'bold 11px Arial';
            ctx.fillText(s.name, s.x, s.y + s.r + 14);
        });

        // 详情面板
        if (selectedStage) {
            var ss = stages.find(function(s) { return s.id === selectedStage; });
            if (ss) {
                ctx.fillStyle = 'rgba(255,255,255,0.96)';
                roundRect(ctx, 12, 12, 320, 150, 10); ctx.fill();
                ctx.strokeStyle = ss.color; ctx.lineWidth = 2;
                roundRect(ctx, 12, 12, 320, 150, 10); ctx.stroke();
                
                ctx.fillStyle = ss.color; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'left';
                ctx.fillText(ss.icon + ' ' + ss.name + ' 详细说明', 24, 36);
                ctx.fillStyle = '#475569'; ctx.font = '11.5px Arial';
                var lines = ss.desc.split('\n');
                lines.forEach(function(ln, i) { ctx.fillText(ln, 24, 56 + i * 17); });
            }
        }

        // 底部数据
        ctx.fillStyle = '#fff';
        ctx.fillRect(12, H - 55, W - 24, 42);
        ctx.strokeStyle = _C.border; ctx.strokeRect(12, H - 55, W - 24, 42);
        ctx.fillStyle = '#334155'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'left';
        ctx.fillText('📊 全球水循环数据：年循环水量 ≈ 52万km³ | 海洋蒸发88% | 陆地蒸发+蒸腾12% | 降水返回海洋', 24, H - 32);
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
        ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
        ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
        ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);
        ctx.closePath();
    }

    cv.onclick = function(e) {
        var rect = cv.getBoundingClientRect();
        var mx = e.clientX - rect.left, my = e.clientY - rect.top;
        var clicked = null;
        for (var i = 0; i < stages.length; i++) {
            if (Math.sqrt(Math.pow(mx - stages[i].x, 2) + Math.pow(my - stages[i].y, 2)) < stages[i].r + 5) {
                clicked = stages[i].id; break;
            }
        }
        selectedStage = (selectedStage === clicked) ? null : clicked;
        draw();
    };

    draw();

    g.controlArea.appendChild(_H('点击各个环节查看详细说明。思考：哪个环节驱动整个循环？人类活动主要影响哪些环节？'));
    g.controlArea.appendChild(_K(
        '水循环是地球上最重要的物质循环之一：<br>' +
        '• <strong>驱动力</strong>：太阳能（蒸发）+ 重力（径流）<br>' +
        '• <strong>三大类型</strong>：海陆间循环（最重要）、海上内循环、陆地内循环<br>' +
        '• <strong>人类影响</strong>：修水库（改变径流）、城市化（减少下渗）、跨流域调水（改变空间分布）、植树造林（增加蒸腾）'
    ));
};

// ================================================================
// s003 正午太阳高度角 【类型C-模拟探索+计算】
// ================================================================
window.initS003Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;';
    wrap.innerHTML = '<h2 style="margin:0;font-size:19px;color:' + _C.text + ';">☀️ 高中实验3：正午太阳高度角</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 掌握正午太阳高度角的计算公式<br>2. 理解太阳直射点的季节移动规律<br>3. 能计算任意地点、任意日期的正午太阳高度'));

    var dayOfYear = 172; // 夏至日附近（6月21日左右）
    var latitude = 40;   // 北京纬度

    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:12px;background:' + _C.card + ';border:1px solid ' + _C.border + ';border-radius:12px;width:100%;max-width:760px;box-sizing:border-box;';
    wrap.appendChild(ctrlDiv);

    ctrlDiv.appendChild(_SL(1, 365, dayOfYear, 1, '日期(第N天)', redraw));
    ctrlDiv.appendChild(_SL(-66.5, 66.5, latitude, 0.5, '纬度(°)', redraw));

    // 预设城市按钮
    [{name:'北京',lat:39.9},{name:'上海',lat:31.2},{name:'广州',lat:23.1},{name:'哈尔滨',lat:45.8},{name:'新加坡',lat:1.3},{name:'悉尼',lat:-33.9}].forEach(function(c) {
        ctrlDiv.appendChild(_B(c.name, function() { latitude = c.lat; redraw(); }, '#64748b'));
    });

    var resultDiv = document.createElement('div');
    resultDiv.style.cssText = 'background:#eff6ff;border:1px solid #bfdbfe;padding:14px 20px;border-radius:10px;width:100%;max-width:760px;box-sizing:border-box;margin:4px 0;text-align:center;';
    wrap.appendChild(resultDiv);

    var cv = _CV(600, 260, '#fffbeb');
    wrap.appendChild(cv);
    var ctx = cv.getContext('2d');

    function getSolarDeclination(day) {
        // 近似公式：太阳直射点纬度 δ ≈ 23.5° × sin((day - 81) / 365 × 360°)
        // day=81为春分(δ=0), day=172为夏至(δ=23.5°), day=264为秋分(δ=0), day=355为冬至(δ=-23.5°)
        return 23.5 * Math.sin((day - 81) / 365 * 2 * Math.PI);
    }

    function getSeasonName(day) {
        if (day >= 79 && day <= 87) return '春分(3月21日前后)';
        if (day >= 168 && day <= 178) return '夏至(6月22日前后)';
        if (day >= 262 && day <= 270) return '秋分(9月23日前后)';
        if (day >= 352 || day <= 5) return '冬至(12月22日前后)';
        var month = Math.floor(day / 30.44) + 1;
        return '约' + month + '月';
    }

    function redraw() {
        var decl = getSolarDeclination(dayOfYear);
        var H = 90 - Math.abs(latitude - decl); // 正午太阳高度角公式

        // 更新结果面板
        var latDir = latitude >= 0 ? 'N' : 'S';
        var decDir = decl >= 0 ? 'N' : 'S';
        resultDiv.innerHTML =
            '<span style="font-size:15px;"><b>📅 </b>' + getSeasonName(dayOfYear) +
            '&nbsp;&nbsp;|&nbsp;&nbsp;<b>📍 </b>' + Math.abs(latitude).toFixed(1) + '°' + latDir +
            '&nbsp;&nbsp;|&nbsp;&nbsp;<b>☀️ 直射点：</b>' + Math.abs(decl).toFixed(1) + '°' + decDir +
            '&nbsp;&nbsp;|&nbsp;&nbsp;<b>📐 正午太阳高度角 H = <span style="font-size:22px;color:#dc2626;">' + H.toFixed(1) + '°</span></span><br>' +
            '<span style="font-size:13px;color:#64748b;margin-top:4px;display:inline-block;">公式：H = 90° - |φ - δ| &nbsp; 其中 φ=' + latitude.toFixed(1) + '°（当地纬度），δ=' + decl.toFixed(1) + '°（直射点纬度）</span>';

        // 绘制示意图
        ctx.clearRect(0, 0, cv.width, cv.height);

        // 地平线
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, cv.height - 40);
        ctx.lineTo(cv.width - 40, cv.height - 40);
        ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px Arial';
        ctx.fillText('地平面', cv.width - 80, cv.height - 22);

        // 观测者位置
        var obsX = cv.width / 2;
        var obsY = cv.height - 40;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(obsX, obsY, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillText('观测者', obsX - 16, obsY + 20);

        // 竖直杆子
        var rodLen = 120;
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(obsX, obsY);
        ctx.lineTo(obsX, obsY - rodLen);
        ctx.stroke();

        // 太阳光线
        var sunAngleRad = H * Math.PI / 180;
        var sunRayLen = 180;
        var sunEndX = obsX + Math.sin(sunAngleRad) * sunRayLen;
        var sunEndY = obsY - Math.cos(sunAngleRad) * sunRayLen;

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(obsX, obsY);
        ctx.lineTo(sunEndX, sunEndY);
        ctx.stroke();
        ctx.setLineDash([]);

        // 太阳
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(sunEndX, sunEndY, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
        ctx.fillText('太阳', sunEndX, sunEndY + 30);

        // 影子
        if (H < 85) {
            var shadowLen = rodLen * Math.tan(sunAngleRad);
            ctx.fillStyle = 'rgba(100,116,139,0.3)';
            ctx.fillRect(obsX - 2, obsY, shadowLen + 2, 4);
            ctx.fillStyle = '#64748b';
            ctx.font = '11px Arial'; ctx.textAlign = 'left';
            ctx.fillText('影子 (' + shadowLen.toFixed(0) + ')', obsX + 5, obsY + 16);
        } else {
            ctx.fillStyle = '#16a34a';
            ctx.font = '11px Arial'; ctx.textAlign = 'left';
            ctx.fillText('太阳几乎垂直照射！', obsX + 5, obsY + 16);
        }

        // 角度标注弧
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(obsX, obsY, 45, -Math.PI / 2, -Math.PI / 2 + sunAngleRad);
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        var labelAngle = sunAngleRad / 2 - Math.PI / 2;
        ctx.fillText('H=' + H.toFixed(1) + '°', obsX + 50 + Math.cos(labelAngle) * 45, obsY - 20 + Math.sin(labelAngle) * 45);
    }

    redraw();

    g.controlArea.appendChild(_H('尝试：什么时候正午太阳高度角最大（90°）？北京夏至和冬至的正午太阳高度差多少？'));
    g.controlArea.appendChild(_K(
        '正午太阳高度角是某日正午时刻太阳光线与地平面的夹角。<br>' +
        '计算公式：<strong>H = 90° - |φ - δ|</strong><br>' +
        '• 当 φ = δ（当地纬度等于直射点纬度）时，H = 90°，太阳直射头顶（无影）<br>' +
        '• 夏至日北回归线以北各地H达一年中最大值；冬至日达最小值<br>' +
        '• 太阳高度角越大 → 太阳辐射越集中 → 地面获得热量越多'
    ));
};

// ================================================================
// s004 人口金字塔 【类型E-数据分析】
// ================================================================
window.initS004Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;';
    wrap.innerHTML = '<h2 style="margin:0;font-size:19px;color:' + _C.text + ';">📊 高中实验4：人口金字塔绘制与分析</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 学会阅读和绘制人口金字塔图<br>2. 通过金字塔形状判断人口增长类型<br>3. 分析人口结构对社会经济发展的影响'));

    // 数据集
    var datasets = [
        { name: '高增长型（发展中国家）', key: 'high', male: [5.5, 5.8, 6.0, 5.7, 5.2, 4.5], female: [5.2, 5.5, 5.7, 5.4, 5.0, 4.3], color: '#ef4444', analysis: '年轻人口占比大，底部宽大。特征：高出生率、高死亡率（但出生率＞死亡率）、人口快速增长。社会压力大：教育、就业、住房需求旺盛。' },
        { name: '稳定型（发达国家）', key: 'stable', male: [3.2, 3.5, 3.8, 4.0, 4.2, 4.5], female: [3.2, 3.4, 3.7, 3.9, 4.1, 4.6], color: '#3b82f6', analysis: '各年龄组比例相对均衡，呈柱状或钟形。特征：低出生率、低死亡率、低增长率。老龄化问题突出：劳动力不足、养老负担加重。' },
        { name: '缩减型（超低生育率）', key: 'shrink', male: [3.8, 3.5, 3.2, 3.5, 4.2, 5.0], female: [3.7, 3.4, 3.1, 3.4, 4.1, 5.2], color: '#8b5cf6', analysis: '年轻人口少，底部收缩。特征：出生率远低于更替水平（2.1）。严重的老龄化问题，人口总量可能持续下降。需通过移民或鼓励生育政策调整。' }
    ];
    var ageGroups = ['0-14岁', '15-29岁', '30-44岁', '45-59岁', '60-74岁', '75岁以上'];
    var currentData = datasets[0];

    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:8px;';
    wrap.appendChild(ctrlDiv);

    datasets.forEach(function(ds, idx) {
        var btn = _B(ds.name.split('（')[0], function() { currentData = ds; updateBtns(); redrawPyramid(); }, currentData.key === ds.key ? _C.primary : '#64748b');
        btn.dataset.dsKey = ds.key;
        ctrlDiv.appendChild(btn);
    });

    function updateBtns() {
        ctrlDiv.querySelectorAll('button').forEach(function(b) {
            if (b.dataset.dsKey) b.style.background = b.dataset.dsKey === currentData.key ? _C.primary : '#64748b';
        });
    }

    var cv = _CV(620, 400, '#ffffff');
    wrap.appendChild(cv);
    var ctx = cv.getContext('2d');

    var anaDiv = document.createElement('div');
    anaDiv.style.cssText = 'background:' + _C.card + ';border:1px solid ' + _C.border + ';padding:14px 18px;border-radius:10px;width:100%;max-width:620px;box-sizing:border-box;margin-top:6px;';
    wrap.appendChild(anaDiv);

    function redrawPyramid() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        var maxVal = 6.5, barW = 36, centerX = cv.width / 2, baseY = cv.height - 50;

        // 标题
        ctx.fillStyle = currentData.color;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentData.name, centerX, 24);

        // Y轴标签
        ctx.fillStyle = '#475569';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ageGroups.forEach(function(ag, i) {
            var y = baseY - (i + 0.5) * 52;
            ctx.fillText(ag, centerX - barW - 70, y + 4);
        });

        // 性别标注
        ctx.fillStyle = '#3b82f6';
        ctx.textAlign = 'center';
        ctx.fillText('男', centerX - barW / 2 - 4, baseY + 18);
        ctx.fillStyle = '#ec4899';
        ctx.fillText('女', centerX + barW / 2 + 4, baseY + 18);

        // 绘制条形
        ageGroups.forEach(function(ag, i) {
            var y = baseY - (i + 0.5) * 52;
            var h = 44;
            var maleVal = currentData.male[i];
            var femaleVal = currentData.female[i];
            var maleW = (maleVal / maxVal) * 130;
            var femW = (femaleVal / maxVal) * 130;

            // 男条（左侧）
            var mGrad = ctx.createLinearGradient(centerX - maleW - barW, y, centerX - barW, y);
            mGrad.addColorStop(0, currentData.color + '40'); mGrad.addColorStop(1, currentData.color);
            ctx.fillStyle = mGrad;
            roundBar(ctx, centerX - maleW - barW, y, maleW, h, 3);
            ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.textAlign = 'right';
            ctx.fillText(maleVal + '%', centerX - barW - 4, y + h / 2 + 3);

            // 女条（右侧）
            var fGrad = ctx.createLinearGradient(centerX + barW, y, centerX + femW + barW, y);
            fGrad.addColorStop(0, currentData.color); fGrad.addColorStop(1, currentData.color + '40');
            ctx.fillStyle = fGrad;
            roundBar(ctx, centerX + barW, y, femW, h, 3);
            ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.textAlign = 'left';
            ctx.fillText(femaleVal + '%', centerX + barW + 4, y + h / 2 + 3);
        });

        // 更新分析面板
        var typeLabel = currentData.key === 'high' ? '📈 增长型（年轻型）' : currentData.key === 'stable' ? '📊 稳定型（成年型）' : '📉 缩减型（老年型）';
        anaDiv.innerHTML = '<h4 style="margin:0 0 8px 0;color:' + currentData.color + ';">' + typeLabel + '</h4>' +
            '<p style="margin:0;font-size:13px;line-height:1.8;color:#475569;">' + currentData.analysis + '</p>';
    }

    function roundBar(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
        ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
    }

    redrawPyramid();

    g.controlArea.appendChild(_K(
        '人口金字塔反映人口的年龄、性别结构：<br>' +
        '• <strong>增长型</strong>：底宽顶尖 → 年轻人多 → 人口将持续增长 → 发展中国家常<br>' +
        '• <strong>稳定型</strong>：各层均匀 → 结构合理 → 发达国家典型<br>' +
        '• <strong>缩减型</strong>：底窄顶宽 → 老龄化严重 → 日本、德国等<br>' +
        '应用：制定教育/医疗/养老政策的依据'
    ));
};

// ================================================================
// s005 城市热岛效应 【类型C-模拟探索】
// ================================================================
window.initS005Simulator = function() {
    var g = _G();
    if (!g) return;
    g.canvasArea.innerHTML = '';
    g.controlArea.innerHTML = '';

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;';
    wrap.innerHTML = '<h2 style="margin:0;font-size:19px;color:' + _C.text + ';">🏙️ 高中实验5：城市热岛效应</h2>';
    g.canvasArea.appendChild(wrap);
    wrap.appendChild(_I('学习目标', '1. 理解城市热岛效应的形成原因<br>2. 探索城市规模、绿化覆盖率等因子对热岛强度的影响<br>3. 了解缓解城市热岛的可行措施'));

    var citySize = 5;      // 城市规模 1-10
    var greenCover = 3;   // 绿化覆盖率 % 1-50
    var industry = 4;     // 工业密度 1-10

    var ctrlDiv = document.createElement('div');
    ctrlDiv.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:12px;background:' + _C.card + ';border:1px solid ' + _C.border + ';border-radius:12px;width:100%;max-width:760px;box-sizing:border-box;';
    wrap.appendChild(ctrlDiv);

    ctrlDiv.appendChild(_SL(1, 10, citySize, 1, '城市规模', redraw));
    ctrlDiv.appendChild(_SL(1, 50, greenCover, 5, '绿化覆盖率%', redraw));
    ctrlDiv.appendChild(_SL(1, 10, industry, 1, '工业排放', redraw));

    var infoDiv = document.createElement('div');
    infoDiv.style.cssText = 'text-align:center;padding:8px;font-size:16px;font-weight:bold;';
    wrap.appendChild(infoDiv);

    var cv = _CV(650, 320);
    wrap.appendChild(cv);
    var ctx = cv.getContext('2d');

    function calcUHI() {
        // 热岛强度模型：基础温度 + 城市规模贡献 + 工业贡献 - 绿化降温
        var baseTemp = 28; // 郊区基准温度
        var cityEffect = citySize * 1.2;       // 城市规模效应
        var indusEffect = industry * 0.8;       // 工业排放效应
        var greenEffect = greenCover * 0.15;    // 绿化降温效应
        var urbanTemp = baseTemp + cityEffect + indusEffect - greenEffect;
        var uhi = urbanTemp - baseTemp;
        return { baseTemp: baseTemp, urbanTemp: urbanTemp, uhi: uhi };
    }

    function redraw() {
        var data = calcUHI();
        infoDiv.innerHTML = '热岛强度：<span style="color:' + (data.uhi > 3 ? '#dc2626' : data.uhi > 1 ? '#f59e0b' : '#16a34a') + ';">+' + data.uhi.toFixed(1) + '°C</span> （城区' + data.urbanTemp.toFixed(1) + '°C vs 郊区' + data.baseTemp + '°C）';

        ctx.clearRect(0, 0, cv.width, cv.height);
        var cx = cv.width / 2;

        // 绘制温度剖面图（从市中心到郊区）
        var ptsCount = 20;
        var profileW = 520, startX = (cv.width - profileW) / 2, baseY = 220;

        // 坐标轴
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(startX, 40); ctx.lineTo(startX, baseY + 30); ctx.stroke(); // Y轴
        ctx.beginPath(); ctx.moveTo(startX, baseY); ctx.lineTo(startX + profileW, baseY); ctx.stroke(); // X轴

        ctx.fillStyle = '#64748b'; ctx.font = '11px Arial';
        ctx.fillText('温度°C →', startX + 4, 54);
        ctx.fillText('市中心', startX + 20, baseY + 16);
        ctx.fillText('郊区 →', startX + profileW - 40, baseY + 16);

        // 温度曲线
        ctx.beginPath();
        for (var i = 0; i <= ptsCount; i++) {
            var t = i / ptsCount; // 0(市中心) 到 1(郊区)
            // 市中心温度最高，郊区逐渐降低到基准温度
            var distFromCenter = t; // 0=中心, 1=郊区
            var tempAtPoint = data.baseTemp + data.uhi * Math.exp(-distFromCenter * 2.5); // 指数衰减
            var px = startX + t * profileW;
            var py = baseY - ((tempAtPoint - 15) / 35) * (baseY - 50);

            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = data.uhi > 3 ? '#dc2626' : data.uhi > 1 ? '#f59e0b' : '#16a34a';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 填充区域
        ctx.lineTo(startX + profileW, baseY);
        ctx.lineTo(startX, baseY);
        ctx.closePath();
        var fillGrad = ctx.createLinearGradient(startX, baseY, startX, 50);
        fillGrad.addColorStop(0, (data.uhi > 3 ? '#dc2626' : data.uhi > 1 ? '#f59e0b' : '#16a34a') + '20');
        fillGrad.addColorStop(1, (data.uhi > 3 ? '#dc2626' : data.uhi > 1 ? '#f59e0b' : '#16a34a') + '05');
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // 标注关键值
        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(data.urbanTemp.toFixed(1) + '°C', startX + 12, baseY - ((data.urbanTemp - 15) / 35) * (baseY - 50) - 8);
        ctx.fillStyle = '#16a34a';
        ctx.fillText(data.baseTemp + '°C', startX + profileW - 30, baseY - 8);

        // 右侧：影响因素雷达图简化版
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(startX + profileW + 30, 50, 95, 200);
        ctx.strokeStyle = _C.border;
        ctx.strokeRect(startX + profileW + 30, 50, 95, 200);

        ctx.fillStyle = '#475569'; ctx.font = 'bold 11px Arial'; ctx.textAlign = 'center';
        ctx.fillText('影响因素', startX + profileW + 77, 68);

        var factors = [
            { name: '规模', val: citySize / 10, color: '#3b82f6' },
            { name: '绿化', val: 1 - greenCover / 50, color: '#22c55e' },
            { name: '工业', val: industry / 10, color: '#ef4444' }
        ];
        factors.forEach(function(f, fi) {
            var fy = 92 + fi * 50;
            ctx.fillStyle = f.color;
            ctx.fillRect(startX + profileW + 42, fy, (f.val * 75), 16);
            ctx.fillStyle = '#475569'; ctx.font = '10px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(f.name + ': ' + Math.round(f.val * 100) + '%', startX + profileW + 42, fy + 28);
        });
    }

    redraw();

    g.controlArea.appendChild(_H('调节各滑块观察：什么因素对热岛强度影响最大？绿化能完全抵消热岛吗？'));
    g.controlArea.appendChild(_K(
        '城市热岛效应是指<strong>城市气温明显高于周边郊区的现象</strong>：<br>' +
        '• <strong>成因</strong>：① 下垫面硬化（水泥/沥青吸热多）；② 人为热源（汽车空调工厂）；③ 污染物保温效应；④ 建筑阻挡通风<br>' +
        '• <strong>影响因子</strong>：城市规模(+), 绿化覆盖率(-), 工业密度(+)<br>' +
        '• <strong>缓解措施</strong>：增加绿地和水体、使用反光材料、发展公共交通、优化建筑布局'
    ));
};

// ================================================================
// s006-s008 快速实现（精简版但功能完整）
// ================================================================

window.initS006Simulator = function() {
    var g = _G(); if(!g)return; g.canvasArea.innerHTML='';g.controlArea.innerHTML='';
    var w=document.createElement('div');w.style.cssText='display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;';
    w.innerHTML='<h2 style="margin:0;font-size:19px;color:'+_C.text+';">🏭 高中实验6：工业区位选择分析</h2>';
    g.canvasArea.appendChild(w);
    w.appendChild(_I('学习目标','1. 理解工业区位的主要影响因素\n2. 学会用加权评分法进行区位选择\n3. 分析不同工业类型的区位偏好差异'));
    
    var projects=[
        {name:'钢铁厂',weights:{原料:30,市场:20,交通:20,能源:15,水源:5,劳力:5,环境:5},best:'鞍山/武汉/匹兹堡'},
        {name:'电子装配厂',weights:{原料:5,market:15,交通:25,energy:5,water:5,labor:25,environment:20},best:'深圳/东莞/班加罗尔'},
        {name:'服装厂',weights:{原料:5,market:20,traffic:15,energy:3,water:3,labor:40,environment:14},best:'宁波/孟买/胡志明市'},
        {name:'炼铝厂',weights:{原料:5,market:10,traffic:15,energy:45,water:10,labor:5,environment:10},best:'贵阳/冰岛/巴林'}
    ];
    var cities=[{name:'A城(资源丰富)',scores:{原料:9,market:5,交通:6,energy:9,water:7,labor:5,environment:7}},
        {name:'B城(交通便利)',scores:{原料:5,market:8,traffic:9,energy:5,water:5,labor:7,environment:6}},
        {name:'C城(市场广阔)',scores:{原料:4,market:9,traffic:7,energy:4,water:5,labor:8,environment:7}},
        {name:'D城(环境优美)',scores:{原料:4,market:5,traffic:5,energy:4,water:8,labor:6,environment:9}}];
    var curProj=0,showResult=false;
    var cd=document.createElement('div');cd.style.cssText='display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;';
    w.appendChild(cd);
    projects.forEach(function(p,i){cd.appendChild(_B(p.name,function(){curProj=i;updateProj();showResult=false;redrawS006();},curProj===i?_C.primary:'#64748b'));cd.lastChild.dataset.pj=i;});
    
    function updateProj(){cd.querySelectorAll('button').forEach(function(b){if(b.dataset.pj!==undefined)b.style.background=Number(b.dataset.pj)===curProj?_C.primary:'#64748b';});}
    
    cd.appendChild(_B('📊 计算最优选址',function(){showResult=!0;redrawS006();},_C.success));
    w.appendChild(showResult?_I('推荐结果','基于加权评分法，'+projects[curProj].name+'的最优选址建议优先考虑得分最高的城市。\n实际选址还需综合考虑：政策优惠、土地成本、基础设施配套等。'):_I('提示','选择一个项目，然后点击"计算最优选址"查看系统推荐的区位选择方案及理由。'));
    
    var c=_CV(700,350,'#f8fafc');w.appendChild(c);var ctx=c.getContext('2d');
    function drawTable(){
        ctx.clearRect(0,0,c.width,c.height);var proj=projects[curProj];
        ctx.fillStyle=_C.primary;ctx.font='bold 16px Arial';ctx.textAlign='center';ctx.fillText('【'+proj.name+'】区位因素权重与城市评分表',c.width/2,28);
        var cols=['因素','权重%'].concat(cities.map(function(z){return z.name;}));var rows=['原料地','市场','交通','能源','水源','劳动力','环境'];
        var cellW=80,cellH=32,startX=40,startY=58,factors=['原料','市场','交通','能源','水源','劳力','环境'];
        
        // 表头
        ctx.fillStyle='#e2e8f0';ctx.fillRect(startX,startY,cellW*cols.length,cellH);ctx.strokeStyle='#cbd5e1';ctx.strokeRect(startX,startY,cellW*cols.length,cellH);
        ctx.fillStyle='#334155';ctx.font='bold 11px Arial';
        cols.forEach(function(col,i){var tx=startX+i*cellW+cellW/2;if(i===0)tx=startX+cellW/2;ctx.textAlign='center';ctx.fillText(col,tx,startY+21);});
        
        rows.forEach(function(row,ri){
            var ty=startY+(ri+1)*cellH;
            ctx.fillStyle=ri%2===0?'#f8fafc':'#fff';ctx.fillRect(startX,ty,cellW*cols.length,cellH);ctx.strokeStyle='#e2e8f0';ctx.beginPath();ctx.moveTo(startX,ty);ctx.lineTo(startX+cellW*cols.length,ty);ctx.stroke();
            ctx.fillStyle='#334155';ctx.font='12px Arial';ctx.textAlign='center';ctx.fillText(factors[ri],startX+cellW/2,ty+21);
            
            var factorKey=factors[ri]==='劳力'?'labor':factors[ri]==='环境'?'environment':factors[ri];
            var wt=proj.weights[factorKey]||0;
            ctx.fillStyle='#2563eb';ctx.font='bold 12px Arial';ctx.fillText(wt+'%',startX+cellW+cellW/2,ty+21);
            
            cities.forEach(function(city,ci){
                var score=city.scores[factorKey]||0;
                var weighted=(score*wt/10).toFixed(1);
                var isBestCity=false;
                if(showResult){
                    var totalScore=cities.reduce(function(sum,c){var s=0;Object.keys(proj.weights).forEach(function(k){s+=c.scores[k]*(proj.weights[k]/10);});return sum;},0);
                    cities.sort(function(a,b){return Object.keys(b.scores).reduce(function(s,k){return s+b.scores[k]*(proj.weights[k]/10);},0)-Object.keys(a.scores).reduce(function(s,k){return s+a.scores[k]*(proj.weights[k]/10);},0);});
                    isBestCity=ci===0;
                }
                ctx.fillStyle=isBestCity?'#dc2626':'#475569';ctx.font=isBestCity?'bold 12px Arial':'12px Arial';ctx.fillText(score+'('+weighted+')',startX+(ci+2)*cellW+cellW/2,ty+21);
            });
        });
        
        // 总分行
        if(showResult){
            var totalY=startY+(rows.length+1)*cellH;
            ctx.fillStyle='#fefce8';ctx.fillRect(startX,totalY,cellW*cols.length,cellH+4);ctx.strokeStyle='#fde047';ctx.strokeRect(startX,totalY,cellW*cols.length,cellH+4);
            ctx.fillStyle='#854d0e';ctx.font='bold 12px Arial';ctx.fillText('加权总分',startX+cellW/2,totalY+21);
            cities.forEach(function(city,ci){
                var ts=0;Object.keys(proj.weights).forEach(function(k){ts+=city.scores[k]*(proj.weights[k]/10);});
                ctx.fillStyle=ci===0?'#dc2626':'#854d0e';ctx.font='bold 12px Arial';ctx.fillText(ts.toFixed(1),startX+(ci+2)*cellW+cellW/2,totalY+21);
            });
        }
    }
    function redrawS006(){drawTable();}
    drawTable();
    g.controlArea.appendChild(_K('工业区位选择的本质是<strong>追求最低生产成本和最大利润</strong>。<br>不同工业类型的主导区位因素不同：原料导向型(钢铁)、市场导向型(食品)、动力导向型(炼铝)、<br>劳动力导向型(纺织/电子)、技术导向型(芯片)。实际选址还需综合考量政策、土地、基础设施等多重因素。'));
};

window.initS007Simulator = function() {
    var g=_G();if(!g)return;g.canvasArea.innerHTML='';g.controlArea.innerHTML='';
    var w=document.createElement('div');w.style.cssText='display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;';
    w.innerHTML='<h2 style="margin:0;font-size:19px;color:'+_C.text+';">🌾 高中实验7：农业区位因素与技术改良</h2>';g.canvasArea.appendChild(w);
    w.appendChild(_I('学习目标','1. 掌握农业区位的主要自然和社会经济因素\n2. 理解农业技术如何突破自然条件限制\n3. 能对不同农业类型的区位条件做出评价'));
    
    var types=[{name:'水稻种植业',nat:{climate:9,topo:5,soil:6,water:9},soc:{market:7,transport:5,tech:6,policy:5},desc:'需要高温多雨、平坦地形、肥沃沃壤土和充足水源。亚洲季风区最适合。'},
        {name:'旱作农业',nat:{climate:7,topo:7,soil:8,water:4},soc:{market:7,transport:6,tech:4,policy:5},desc:'耐旱性较强，适合半湿润地区。小麦、玉米为主。'},
        {name:'畜牧业',nat:{climate:6,topo:8,soil:4,water:3},soc:{market:8,transport:5,tech:5,policy:4},desc:'需要广阔草场，气候半干旱为宜。澳大利亚、内蒙古为典型。'},
        {name:'园艺业(蔬菜)',nat:{climate:7,topo:8,soil:8,water:8},soc:{market:9,transport:8,tech:7,policy:4},desc:'高附加值，靠近城市市场，依赖技术投入（温室、灌溉）。'}];
    var curType=0;
    var cd=document.createElement('div');cd.style.cssText='display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:8px;';w.appendChild(cd);
    types.forEach(function(t,i){cd.appendChild(_B(t.name,function(){curType=i;updateT();drawAgri();},curType===i?_C.primary:'#64748b'));cd.lastChild.dataset.ti=i;});
    function updateT(){cd.querySelectorAll('button').forEach(function(b){if(b.dataset.ti!==undefined)b.style.background=Number(b.dataset.ti)===curType?_C.primary:'#64748b';});}
    
    var techBoost=0;
    cd.appendChild(_SL(0,3,techBoost,1,'技术水平',drawAgri));
    
    var c=_CV(680,380,'#f0fdf4');w.appendChild(c);var ctx=c.getContext('2d');
    function drawAgri(){
        ctx.clearRect(0,0,c.width,c.height);var t=types[curType];
        ctx.fillStyle=_C.primary;ctx.font='bold 16px Arial';ctx.textAlign='center';ctx.fillText('【'+t.name+'】区位因素雷达图评估',c.width/2,28);
        
        var cx=c.width/2,cy=c.height/2+20,R=110;
        var axes=['气候','地形','土壤','水源','市场','交通','技术','政策'];
        var values=[];
        axes.forEach(function(a,i){
            var isNat=a!=='市场'&&a!=='交通'&&a!=='技术'&&a!=='政策';
            var keys={climate:'climate',topo:'topo',soil:'soil',water:'water'};
            var baseVal=isNat?(t.nat[keys[a]]||5):(t.soc[a.toLowerCase()]||5);
            if(a==='技术')baseVal=Math.min(10,baseVal+techBoost*2);
            values.push(baseVal);
        });
        
        // 绘制雷达图
        ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1;
        for(var ring=2;ring<=10;ring+=2){
            ctx.beginPath();for(var i=0;i<axes.length;i++){var ang=i/axes.length*2*Math.PI-Math.PI/2;var r=ring/10*R;ctx[i===0?'moveTo':'lineTo'](cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);}ctx.closePath();ctx.stroke();
        }
        axes.forEach(function(a,i){
            var ang=i/axes.length*2*Math.PI-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*R,cy+Math.sin(ang)*R);ctx.strokeStyle='#94a3b8';ctx.stroke();ctx.fillStyle='#475569';ctx.font='11px Arial';ctx.textAlign='center';ctx.fillText(a,cx+Math.cos(ang)*(R+16),cy+Math.sin(ang)*(R+16));
        });
        // 数据多边形
        ctx.beginPath();values.forEach(function(v,i){var ang=i/axes.length*2*Math.PI-Math.PI/2;var r=v/10*R;ctx[i===0?'moveTo':'lineTo'](cx+Math.cos(ang)*r,cy+Math.sin(ang)*r);});
        ctx.closePath();ctx.fillStyle='rgba(37,99,235,0.15)';ctx.fill();ctx.strokeStyle=_C.primary;ctx.lineWidth=2.5;ctx.stroke();
        values.forEach(function(v,i){var ang=i/axes.length*2*Math.PI-Math.PI/2;var r=v/10*R;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx+Math.cos(ang)*r,cy+Math.sin(ang)*r,4,0,Math.PI*2);ctx.fill();ctx.fillStyle=_C.primary;ctx.font='bold 10px Arial';ctx.textAlign='center';ctx.fillText(v,cx+Math.cos(ang)*r,cy+Math.sin(ang)*r-8);});
        
        // 描述
        ctx.fillStyle='#f8fafc';ctx.fillRect(20,c.height-70,c.width-40,62);ctx.strokeStyle=_C.border;ctx.strokeRect(20,c.height-70,c.width-40,62);
        ctx.fillStyle='#334155';ctx.font='12px Arial';ctx.textAlign='left';
        var lines=t.desc.split('。');lines.forEach(function(l,i){ctx.fillText('• '+l+'.',30,c.height-52+i*17);});
    }
    drawAgri();
    g.controlArea.appendChild(_K('农业区位选择是自然条件与社会经济条件的综合平衡。<br><strong>技术进步可以突破部分自然限制</strong>：温室大棚改变气候限制、滴灌技术解决水源限制、无土栽培摆脱土壤限制、<br>育种技术适应不同环境。"现代农业"的核心是用技术换取更大的区位自由度和更高的产量。'));
};

window.initS008Simulator = function() {
    var g=_G();if(!g)return;g.canvasArea.innerHTML='';g.controlArea.innerHTML='';
    var w=document.createElement('div');w.style.cssText='display:flex;flex-direction:column;align-items:center;padding:16px;gap:8px;';
    w.innerHTML='<h2 style="margin:0;font-size:19px;color:'+_C.text+';">🌍 高中实验8：全球气候变化与温室效应</h2>';g.canvasArea.appendChild(w);
    w.appendChild(_I('学习目标','1. 理解温室效应的基本原理\n2. 认识CO2浓度升高与全球变暖的关系\n3. 了解不同减排情景下的未来温度变化预测'));
    
    var year=2025,scenario=2; // 1=RCP2.6, 2=RCP4.5, 3=RCP8.5
    var scenarios=[{name:'RCP2.6(强减排)',color:'#16a34a',rise:1.5},{name:'RCP4.5(中等)',color:'#f59e0b',rise:2.5},{name:'RCP8.5(高排放)',color:'#dc2626',rise:4.5}];
    
    var cd=document.createElement('div');cd.style.cssText='display:flex;gap:8px;justify-content:center;padding:8px;flex-wrap:wrap;';w.appendChild(cd);
    cd.appendChild(_SL(1850,2100,year,1,'年份',redrawS008));
    scenarios.forEach(function(s,i){cd.appendChild(_B(s.name,function(){scenario=i;updateScn();redrawS008();},scenario===i?s.color:'#64748b'));cd.lastChild.dataset.sc=i;});
    function updateScn(){cd.querySelectorAll('button').forEach(function(b){if(b.dataset.sc!==undefined)b.style.background=Number(b.dataset.sc)===scenario?scenarios[Number(b.dataset.sc)].color:'#64748b';});}
    
    var c=_CV(700,360,'#0f172a');w.appendChild(c);var ctx=c.getContext('2d');
    function redrawS008(){
        ctx.clearRect(0,0,c.width,c.height);var sc=scenarios[scenario];
        ctx.fillStyle=sc.color;ctx.font='bold 16px Arial';ctx.textAlign='center';ctx.fillText('【'+sc.name+'】CO₂浓度 vs 全球均温预测',c.width/2,26);
        var padLeft=60,padBottom=40,chartW=c.width-padLeft-20,chartH=c.height-padBottom-40;
        // 坐标轴
        ctx.strokeStyle='#475569';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(padLeft,padBottom);ctx.lineTo(padLeft+chartW,padBottom);ctx.lineTo(padLeft+chartW,padBottom-chartH);ctx.lineTo(padLeft,padBottom-chartH);ctx.stroke();
        ctx.fillStyle='#94a3b8';ctx.font='10px Arial';ctx.textAlign='center';ctx.fillText('年份→',padLeft+chartW/2,padBottom+14);
        // 温度轴标签
        ctx.save();ctx.translate(padLeft-12,padBottom-chartH/2);ctx.rotate(-Math.PI/2);ctx.fillText('升温(°C)相对于1850',0,0);ctx.restore();
        // 历史数据+预测曲线
        var histData=[{x:1850,y:0},{x:1900,y:0.1},{x:1950,y:0.4},{x:1980,y:0.5},{x:2000,y:0.8},{x:2020,y:1.1}];
        ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.beginPath();histData.forEach(function(d,i){if(i===0)ctx.moveTo(padLeft+d.x/250*chartW,padBottom-d.y/5*chartH);else ctx.lineTo(padLeft+d.x/250*chartW,padBottom-d.y/5*chartH);});ctx.stroke();
        histData.forEach(function(d){ctx.fillStyle='#94a3b8';ctx.beginPath();ctx.arc(padLeft+d.x/250*chartW,padBottom-d.y/5*chartH,3,0,Math.PI*2);ctx.fill();});
        // 预测曲线
        var predY=((year-2020)/80*sc.rise)+1.1;
        ctx.strokeStyle=sc.color;ctx.lineWidth=3;ctx.setLineDash([6,3]);ctx.beginPath();ctx.moveTo(padLeft+2020/250*chartW,padBottom-1.1/5*chartH);ctx.lineTo(padLeft+year/250*chartW,padBottom-predY/5*chartH);ctx.lineTo(padLeft+2100/250*chartW,padBottom-(predY+(2100-year)/80*sc.rise)/5*chartH);ctx.stroke();ctx.setLineDash([]);
        // 当前年份标记
        ctx.fillStyle=sc.color;ctx.beginPath();ctx.arc(padLeft+year/250*chartW,padBottom-predY/5*chartH,6,0,Math.PI*2);ctx.fill();ctx.font='bold 11px Arial';ctx.textAlign='left';ctx.fillText(year+'年:+'+predY.toFixed(1)+'°C',padLeft+year/250*chartW+10,padBottom-predY/5*chartH-4);
        // 图例
        ctx.fillStyle='#fff';ctx.fillRect(c.width-180,c.height-60,170,50);ctx.strokeStyle=_C.border;ctx.strokeRect(c.width-180,c.height-60,170,50);
        ctx.fillStyle='#334155';ctx.font='10px Arial';ctx.textAlign='left';ctx.fillText('— 历史观测值',c.width-172,c.height-43);ctx.strokeStyle='#94a3b8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(c.width-172,c.height-38);ctx.lineTo(c.width-138,c.height-38);ctx.stroke();
        ctx.fillText('-.- '+sc.name,c.width-172,c.height-26);ctx.strokeStyle=sc.color;ctx.setLineDash([4,2]);ctx.beginPath();ctx.moveTo(c.width-172,c.height-21);ctx.lineTo(c.width-128,c.height-21);ctx.stroke();ctx.setLineDash([]);
    }
    redrawS008();
    g.controlArea.appendChild(_K('全球气候变化是当前最严峻的环境挑战之一。<br>• <strong>温室效应原理</strong>：CO₂等温室气体吸收地面辐射的长波辐射，使近地层大气温度升高<br>'+
        '• <strong>IPCC预测</strong>：若不控制排放(RCP8.5)，2100年全球可能升温3~5°C；若强力减排(RCP2.6)，可控制在1.5~2°C内<br>'+
        '• <strong>影响</strong>：海平面上升威胁沿海、极端天气增多、生态系统破坏、粮食安全风险<br>' +
        '• <strong>解决方案</strong>：① 能源转型(可再生能源替代化石燃料) ② 提升能效 ③ 植树造林(碳汇) ④ 碳捕集利用与封存(CCUS)'));
};

console.log('[AI地理实验教学平台] V3 全部18个模拟器加载完成 ✅');
