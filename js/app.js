// ==================== 全局状态 ====================
let currentPage = 'home';
let currentGrade = null;
let isDemoMode = false;

// ==================== 页面路由 ====================
function showPage(page, params = {}) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // 更新导航激活状态
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    switch (page) {
        case 'home':
            document.getElementById('pageHome').classList.add('active');
            setActiveNav('home');
            renderHome();
            break;
        case 'junior':
            document.getElementById('pageJunior').classList.add('active');
            setActiveNav('junior');
            renderExperimentList('junior');
            break;
        case 'senior':
            document.getElementById('pageSenior').classList.add('active');
            setActiveNav('senior');
            renderExperimentList('senior');
            break;
        case 'detail':
            document.getElementById('pageDetail').classList.add('active');
            renderExperimentDetail(params.id);
            break;
        case 'interactive':
            document.getElementById('pageInteractive').classList.add('active');
            setActiveNav('interactive');
            renderInteractiveList();
            break;
        case 'simulator':
            document.getElementById('pageSimulator').classList.add('active');
            renderSimulator(params.id);
            break;
        case 'resources':
            document.getElementById('pageResources').classList.add('active');
            setActiveNav('resources');
            renderResources();
            break;
    }
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 关闭移动菜单
    document.getElementById('mobileMenu').classList.remove('open');
}

function setActiveNav(page) {
    const map = { home: 'home', junior: 'junior', senior: 'senior', interactive: 'interactive', resources: 'resources' };
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.page === (map[page] || page));
    });
}

// ==================== 首页渲染 ====================
function renderHome() {
    // 统计数字动画
    animateCounter('statJunior', EXPERIMENTS_DATA.junior.length);
    animateCounter('statSenior', EXPERIMENTS_DATA.senior.length);
    const interactiveCount = [...EXPERIMENTS_DATA.junior, ...EXPERIMENTS_DATA.senior]
        .filter(e => e.interactive).length;
    animateCounter('statInteractive', interactiveCount);

    // 推荐实验（各选2个）
    const recGrid = document.getElementById('recGrid');
    const recList = [
        ...EXPERIMENTS_DATA.junior.slice(0, 2),
        ...EXPERIMENTS_DATA.senior.slice(0, 2)
    ];
    recGrid.innerHTML = recList.map(exp => createExperimentCard(exp)).join('');
}

function animateCounter(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current;
    }, 30);
}

// ==================== 实验卡片生成 ====================
function createExperimentCard(exp) {
    const gradeLabel = exp.id.startsWith('j') ? '初中' : '高中';
    const gradeClass = exp.id.startsWith('j') ? 'junior' : 'senior';
    return `
    <div class="exp-card" onclick="showPage('detail', {id: '${exp.id}'})">
        <div class="exp-card-header">
            <span class="exp-card-grade">${gradeLabel}</span>
            <span class="exp-card-badge">${exp.difficulty}</span>
            <div class="exp-card-title">${exp.title}</div>
        </div>
        <div class="exp-card-body">
            <div class="exp-card-meta">
                <span class="exp-meta-item">📚 ${exp.grade}</span>
                <span class="exp-meta-item">⏱️ ${exp.duration}</span>
                ${exp.interactive ? '<span class="exp-meta-item">🎮 可互动</span>' : ''}
            </div>
            <div class="exp-card-desc">${exp.objectives[0]}</div>
        </div>
        <div class="exp-card-footer">
            <div class="exp-card-tags">
                <span class="exp-tag">${exp.category}</span>
            </div>
            <span class="exp-card-action">查看详情 →</span>
        </div>
    </div>`;
}

// ==================== 实验列表渲染 ====================
function renderExperimentList(grade) {
    currentGrade = grade;
    const gridId = grade === 'junior' ? 'juniorGrid' : 'seniorGrid';
    const grid = document.getElementById(gridId);
    const list = grade === 'junior' ? EXPERIMENTS_DATA.junior : EXPERIMENTS_DATA.senior;
    grid.innerHTML = list.map(exp => createExperimentCard(exp)).join('');
}

function filterExperiments(grade, category) {
    // 更新筛选按钮状态
    const filterId = grade === 'junior' ? 'juniorFilter' : 'seniorFilter';
    document.querySelectorAll(`#${filterId} .filter-btn`).forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });

    const gridId = grade === 'junior' ? 'juniorGrid' : 'seniorGrid';
    const grid = document.getElementById(gridId);
    const list = grade === 'junior' ? EXPERIMENTS_DATA.junior : EXPERIMENTS_DATA.senior;

    if (category === 'all') {
        grid.innerHTML = list.map(exp => createExperimentCard(exp)).join('');
    } else {
        const filtered = list.filter(exp => exp.category === category);
        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-500);">该分类下暂无实验，敬请期待。</div>';
        } else {
            grid.innerHTML = filtered.map(exp => createExperimentCard(exp)).join('');
        }
    }
}

// ==================== 实验详情渲染 ====================
function renderExperimentDetail(id) {
    const exp = getExperimentById(id);
    if (!exp) {
        document.getElementById('detailContainer').innerHTML = '<p>未找到该实验。</p>';
        return;
    }

    const gradeLabel = id.startsWith('j') ? '初中' : '高中';
    const difficultyClass = exp.difficulty.replace('（', '-').replace('）', '').replace('难度：', '');

    let html = `
    <div class="detail-back">
        <a href="#" onclick="event.preventDefault(); showPage('${id.startsWith('j') ? 'junior' : 'senior'}')">← 返回实验列表</a>
    </div>
    <div class="detail-header">
        <span class="exp-grade">${gradeLabel} · ${exp.grade}</span>
        <h1>${exp.title}</h1>
        <p class="exp-category">${exp.category}</p>
        <div class="detail-meta">
            <span class="detail-meta-item">⏱️ 时长：${exp.duration}</span>
            <span class="detail-meta-item">📊 难度：<span class="difficulty-badge difficulty-${exp.difficulty}">${exp.difficulty}</span></span>
            ${exp.interactive ? '<span class="detail-meta-item">🎮 含互动模拟</span>' : ''}
            ${exp.demoAvailable ? '<span class="detail-meta-item">📽️ 含演示模式</span>' : ''}
        </div>
    </div>

    <!-- 实验目的 -->
    <div class="detail-section">
        <h2><span class="section-icon">🎯</span> 实验目的</h2>
        <ul class="objectives-list">
            ${exp.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
    </div>

    <!-- 实验材料 -->
    <div class="detail-section">
        <h2><span class="section-icon">🧰</span> 实验材料</h2>
        <ul class="materials-list">
            ${exp.materials.map(m => `<li>${m}</li>`).join('')}
        </ul>
    </div>

    <!-- 实验步骤 -->
    <div class="detail-section">
        <h2><span class="section-icon">📋</span> 实验步骤</h2>
        <div class="steps-list">
            ${exp.steps.map(step => `
                <div class="step-item">
                    <div class="step-num">${step.step}</div>
                    <div class="step-content">
                        <p>${step.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <!-- 实验现象观察 -->
    <div class="detail-section">
        <h2><span class="section-icon">👁️</span> 实验现象与观察</h2>
        <div class="detail-quote">${exp.observation}</div>
    </div>

    <!-- 实验结论 -->
    <div class="detail-section">
        <h2><span class="section-icon">💡</span> 实验结论与拓展</h2>
        <div class="detail-quote">${exp.conclusion}</div>
    </div>`;

    // 教学提示
    if (exp.teachingTips && exp.teachingTips.length > 0) {
        html += `
        <div class="detail-section">
            <div class="detail-tips">
                <h3>💡 教学提示</h3>
                <ul>
                    ${exp.teachingTips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>`;
    }

    // 安全注意事项
    if (exp.safetyNotes) {
        html += `
        <div class="detail-section">
            <div class="safety-box">
                <h3>⚠️ 安全注意事项</h3>
                <p>${exp.safetyNotes}</p>
            </div>
        </div>`;
    }

    // 操作按钮
    html += `<div class="detail-actions">`;
    if (exp.interactive) {
        html += `<button class="btn btn-primary" onclick="showPage('simulator', {id: '${exp.id}'})">🎮 开始互动模拟</button>`;
    }
    if (exp.demoAvailable) {
        html += `<button class="btn btn-outline" onclick="enterDemoMode('${exp.id}')">📽️ 教师演示模式</button>`;
    }
    html += `<button class="btn btn-outline" onclick="printExperiment('${exp.id}')">🖨️ 打印实验报告</button>`;
    html += `</div>`;

    document.getElementById('detailContainer').innerHTML = html;
}

// ==================== 搜索功能 ====================
function toggleSearch() {
    const bar = document.getElementById('searchBar');
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) {
        document.getElementById('searchInput').focus();
    } else {
        document.getElementById('searchResults').classList.remove('open');
        document.getElementById('searchInput').value = '';
    }
}

function handleSearch(query) {
    const resultsEl = document.getElementById('searchResults');
    if (!query || query.trim().length < 1) {
        resultsEl.classList.remove('open');
        resultsEl.innerHTML = '';
        return;
    }

    const q = query.toLowerCase();
    const all = [...EXPERIMENTS_DATA.junior, ...EXPERIMENTS_DATA.senior];
    const results = all.filter(exp =>
        exp.title.toLowerCase().includes(q) ||
        exp.titleEn.toLowerCase().includes(q) ||
        exp.category.toLowerCase().includes(q) ||
        exp.objectives.some(obj => obj.toLowerCase().includes(q)) ||
        exp.grade.toLowerCase().includes(q)
    );

    resultsEl.classList.add('open');
    if (results.length === 0) {
        resultsEl.innerHTML = '<p style="padding:8px 0;color:var(--gray-500);font-size:13px;">未找到匹配的实验</p>';
        return;
    }

    resultsEl.innerHTML = results.map(exp => `
        <div class="search-result-item" style="padding:8px 0;cursor:pointer;border-bottom:1px solid var(--gray-100);" onclick="showPage('detail', {id:'${exp.id}'}); toggleSearch();">
            <span style="font-weight:600;color:var(--primary);">${exp.title}</span>
            <span style="font-size:12px;color:var(--gray-500);margin-left:8px;">${exp.id.startsWith('j') ? '初中' : '高中'} · ${exp.category}</span>
        </div>
    `).join('');
}

// ==================== 互动实验列表 ====================
function renderInteractiveList() {
    const grid = document.getElementById('interactiveGrid');
    const all = [...EXPERIMENTS_DATA.junior, ...EXPERIMENTS_DATA.senior];
    const interactiveList = all.filter(exp => exp.interactive);

    if (interactiveList.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-500);">暂无互动实验。</p>';
        return;
    }

    const icons = { drag: '🔄', simulation: '🧪', draw: '✏️', chart: '📊', map: '🗺️' };

    grid.innerHTML = interactiveList.map(exp => `
        <div class="interactive-card" onclick="showPage('simulator', {id: '${exp.id}'})">
            <div class="interactive-card-preview" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <span>${icons[exp.interactiveType] || '🔬'}</span>
            </div>
            <div class="interactive-card-body">
                <h3>${exp.title}</h3>
                <p>${exp.grade} · ${exp.category}</p>
            </div>
        </div>
    `).join('');
}

// ==================== 模拟器渲染 ====================
function renderSimulator(id) {
    const exp = getExperimentById(id);
    if (!exp) {
        document.getElementById('simulatorContainer').innerHTML = '<p>未找到该实验的互动模拟。</p>';
        return;
    }

    let html = `
    <div class="simulator-header">
        <h1>🧪 ${exp.title} — 互动模拟</h1>
        <div style="display:flex;gap:8px;">
            <button class="btn btn-outline btn-sm" onclick="toggleSimDemoMode('${id}')" id="simDemoBtn">🖥️ 教师演示模式</button>
            <button class="btn btn-outline btn-sm" onclick="showPage('detail', {id: '${id}'})">← 返回实验详情</button>
        </div>
    </div>
    <div class="simulator-canvas" id="simCanvas">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray-500);font-size:14px;" id="simPlaceholder">
            正在加载模拟器...
        </div>
    </div>
    <div class="simulator-controls" id="simControls"></div>
    `;

    document.getElementById('simulatorContainer').innerHTML = html;

    // 根据实验类型加载对应模拟器
    switch (id) {
        // 初中地理实验
        case 'j001': initLatitudeSimulator(); break;
        case 'j002': initRotationSimulator(); break;
        case 'j003': initRevolutionSimulator(); break;
        case 'j004': initContourSimulator(); break;
        case 'j005': initMarineEffectSimulator(); break;
        case 'j006': initGreenhouseEffectSimulator(); break;
        case 'j007': initSlopeTemperatureSimulator(); break;
        case 'j008': initContourModelSimulator(); break;
        case 'j009': initThermalDiffSimulator(); break;
        case 'j010': initRiverSimulator(); break;
        // 高中地理实验
        case 's001': initThermalSimulator(); break;
        case 's002': initWaterCycleSimulator(); break;
        case 's003': initPopulationSimulator(); break;
        case 's004': initHeatIslandSimulator(); break;
        case 's005': initGreenhouseSimulator(); break;
        case 's006': initFloodingSimulator(); break;
        case 's007': initLandformSimulator(); break;
        case 's008': initUrbanSimulator(); break;
        default:
            document.getElementById('simCanvas').innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;color:var(--gray-600);">
                    <div style="font-size:64px;">🚧</div>
                    <h3>该实验的互动模拟正在开发中</h3>
                    <p style="font-size:14px;color:var(--gray-500);">您可以先查看实验详情，了解实验步骤和原理</p>
                    <button class="btn btn-primary" onclick="showPage('detail', {id: '${id}'})">查看实验详情</button>
                </div>`;
    }
}

// ==================== 全局函数（供HTML内onclick调用）====================
window.moveMarker = function(lat, lng) {
    const svg = document.getElementById('latSvg');
    if (!svg) return;
    const marker = document.getElementById('latMarker');
    const label = document.getElementById('latLabel');
    const cx = 300, cy = 200, r = 150;
    const x = cx + (lng / 180) * r;
    const y = cy - (lat / 90) * r;
    if (marker) marker.setAttribute('cx', x);
    if (marker) marker.setAttribute('cy', y);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    const latD = document.getElementById('latDisplay');
    const lngD = document.getElementById('lngDisplay');
    if (latD) latD.textContent = `纬度：${Math.abs(lat).toFixed(1)}°${latDir}`;
    if (lngD) lngD.textContent = `经度：${Math.abs(lng).toFixed(1)}°${lngDir}`;
    if (label) {
        label.setAttribute('x', x + 15);
        label.setAttribute('y', y - 5);
    }
};

window.toggleRotation = function() {
    if (window._rotRunning) {
        cancelAnimationFrame(window._rotAnimId);
        window._rotRunning = false;
        const btn = document.getElementById('rotBtn');
        if (btn) btn.textContent = '▶️ 开始旋转';
    } else {
        window._rotRunning = true;
        const btn = document.getElementById('rotBtn');
        if (btn) btn.textContent = '⏸️ 暂停';
        animateRotation();
    }
};

window.resetRotation = function() {
    cancelAnimationFrame(window._rotAnimId);
    window._rotRunning = false;
    window._rotAngle = 0;
    const btn = document.getElementById('rotBtn');
    if (btn) btn.textContent = '▶️ 开始旋转';
    const tEl = document.getElementById('rotTime');
    const pEl = document.getElementById('rotPhase');
    if (tEl) tEl.textContent = '时间：正午12:00';
    if (pEl) pEl.textContent = '北京：白天 | 伦敦：清晨';
};

window.clearContour = function() {
    const c = document.getElementById('contourCanvas');
    if (!c) return;
    window._contourPoints = [];
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
};

window.generateContour = function() {
    alert('等高线自动生成功能需要更复杂的算法实现。\n\n教学中建议：\n1. 用笔在纸上手绘等高线\n2. 观察相邻点之间的高度变化趋势\n3. 相同高度的点连线即为等高线');
};

window.showContourAnswer = function() {
    alert('请用橡皮泥制作山体模型，用水准法获取等高线。\n\n判断口诀：\n• 凸高为谷（等高线向高处凸出是山谷）\n• 凸低为脊（等高线向低处凸出是山脊）\n• 闭合高内低：山顶\n• 闭合低内高：盆地');
};

window.toggleThermal = function() {
    if (window._thermalRunning) {
        cancelAnimationFrame(window._thermalAnimId);
        window._thermalRunning = false;
        const btn = document.getElementById('thermalBtn');
        if (btn) btn.textContent = '▶️ 开始模拟';
    } else {
        window._thermalRunning = true;
        const btn = document.getElementById('thermalBtn');
        if (btn) btn.textContent = '⏸️ 暂停';
        animateThermal();
    }
};

window.resetThermal = function() {
    cancelAnimationFrame(window._thermalAnimId);
    window._thermalRunning = false;
    window._thermalT = 0;
    const btn = document.getElementById('thermalBtn');
    if (btn) btn.textContent = '▶️ 开始模拟';
};

// ==================== 经纬网定位模拟器 ====================
function initLatitudeSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#0f172a';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;position:relative;';

    container.innerHTML = `
        <svg id="latSvg" width="600" height="400" viewBox="0 0 600 400" style="max-width:100%;height:auto;">
            <!-- 地球轮廓 -->
            <circle cx="300" cy="200" r="150" fill="#1e40af" stroke="#60a5fa" stroke-width="2"/>
            <!-- 赤道 -->
            <line x1="150" y1="200" x2="450" y2="200" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8,4"/>
            <text x="455" y="205" fill="#fbbf24" font-size="13">赤道 0°</text>
            <!-- 北回归线 -->
            <line x1="164" y1="155" x2="436" y2="155" stroke="#f97316" stroke-width="1" stroke-dasharray="4,4"/>
            <text x="440" y="152" fill="#f97316" font-size="11">北回归线 23.5°N</text>
            <!-- 南回归线 -->
            <line x1="164" y1="245" x2="436" y2="245" stroke="#f97316" stroke-width="1" stroke-dasharray="4,4"/>
            <text x="440" y="242" fill="#f97316" font-size="11">南回归线 23.5°S</text>
            <!-- 经度线（椭圆表示） -->
            <ellipse cx="300" cy="200" rx="150" ry="60" fill="none" stroke="#93c5fd" stroke-width="1" stroke-dasharray="4,4"/>
            <!-- 可拖拽标记 -->
            <circle id="latMarker" cx="300" cy="200" r="8" fill="#ef4444" stroke="#fff" stroke-width="2" style="cursor:grab;"/>
            <text id="latLabel" x="320" y="195" fill="#fff" font-size="13" font-weight="700">📍 北京</text>
            <!-- 坐标显示面板 -->
            <rect x="20" y="20" width="190" height="65" rx="8" fill="rgba(0,0,0,0.7)"/>
            <text x="30" y="42" fill="#fff" font-size="13" font-weight="600">当前位置坐标</text>
            <text id="latDisplay" x="30" y="62" fill="#60a5fa" font-size="14" font-weight="700">纬度：0.0°N</text>
            <text id="lngDisplay" x="30" y="80" fill="#60a5fa" font-size="14" font-weight="700">经度：0.0°E</text>
            <!-- 操作提示 -->
            <text x="300" y="385" text-anchor="middle" fill="#94a3b8" font-size="12">← 拖动红色标记点，观察经纬度坐标变化 →</text>
        </svg>
    `;

    canvas.appendChild(container);

    // 拖拽逻辑
    const svg = document.getElementById('latSvg');
    const marker = document.getElementById('latMarker');
    if (!svg || !marker) return;
    let isDragging = false;

    function getMousePos(e) {
        const rect = svg.getBoundingClientRect();
        const scaleX = 600 / rect.width;
        const scaleY = 400 / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function startDrag(e) {
        const pos = getMousePos(e);
        const mx = parseFloat(marker.getAttribute('cx'));
        const my = parseFloat(marker.getAttribute('cy'));
        if (Math.sqrt((pos.x - mx) ** 2 + (pos.y - my) ** 2) < 25) {
            isDragging = true;
            marker.style.cursor = 'grabbing';
        }
    }

    function doDrag(e) {
        if (!isDragging) return;
        const pos = getMousePos(e);
        let x = pos.x, y = pos.y;
        const cx = 300, cy = 200, r = 150;
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) {
            const angle = Math.atan2(dy, dx);
            x = cx + r * Math.cos(angle);
            y = cy + r * Math.sin(angle);
        }
        marker.setAttribute('cx', x);
        marker.setAttribute('cy', y);

        const lat = ((cy - y) / r * 90).toFixed(1);
        const lng = ((x - cx) / r * 180).toFixed(1);
        const latDir = lat >= 0 ? 'N' : 'S';
        const lngDir = lng >= 0 ? 'E' : 'W';

        const latD = document.getElementById('latDisplay');
        const lngD = document.getElementById('lngDisplay');
        const label = document.getElementById('latLabel');
        if (latD) latD.textContent = `纬度：${Math.abs(lat).toFixed(1)}°${latDir}`;
        if (lngD) lngD.textContent = `经度：${Math.abs(lng).toFixed(1)}°${lngDir}`;
        if (label) {
            label.setAttribute('x', Math.min(x + 15, 550));
            label.setAttribute('y', y - 5);
        }
    }

    function stopDrag() {
        isDragging = false;
        if (marker) marker.style.cursor = 'grab';
    }

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', doDrag);
    svg.addEventListener('mouseup', stopDrag);
    svg.addEventListener('mouseleave', stopDrag);
    svg.addEventListener('touchstart', e => { e.preventDefault(); startDrag(e.touches[0]); }, { passive: false });
    svg.addEventListener('touchmove', e => { e.preventDefault(); doDrag(e.touches[0]); }, { passive: false });
    svg.addEventListener('touchend', stopDrag);

    // 控制面板
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <span style="font-size:13px;font-weight:500;color:var(--gray-600);">快速定位：</span>
            <button class="sim-btn" onclick="moveMarker(39.9, 116.4)">北京</button>
            <button class="sim-btn" onclick="moveMarker(35.7, 139.7)">东京</button>
            <button class="sim-btn" onclick="moveMarker(-33.9, 151.2)">悉尼</button>
            <button class="sim-btn" onclick="moveMarker(90, 0)">北极点</button>
            <button class="sim-btn" onclick="moveMarker(0, 0)">赤道·本初子午线</button>
        `;
    }
}

// ==================== 地球自转模拟器 ====================
function initRotationSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#0f172a';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;';

    container.innerHTML = `
        <svg id="rotSvg" width="600" height="400" viewBox="0 0 600 400" style="max-width:100%;height:auto;">
            <defs>
                <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1"/>
                    <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0"/>
                </linearGradient>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#fff"/>
                </marker>
            </defs>
            <!-- 太阳光束 -->
            <rect x="0" y="120" width="250" height="160" fill="url(#sunGrad)" opacity="0.25"/>
            <!-- 太阳 -->
            <circle cx="40" cy="200" r="30" fill="#fbbf24"/>
            <text x="40" y="210" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="600">太阳</text>
            <!-- 地球 -->
            <circle id="earth" cx="420" cy="200" r="55" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2"/>
            <!-- 城市标记 -->
            <circle id="beijingDot" cx="420" cy="178" r="5" fill="#ef4444"/>
            <text x="432" y="175" fill="#ef4444" font-size="12" font-weight="700">北京</text>
            <circle id="londonDot" cx="403" cy="225" r="5" fill="#10b981"/>
            <text x="408" y="248" fill="#10b981" font-size="12" font-weight="700">伦敦</text>
            <!-- 昼夜区域（用两个半圆表示） -->
            <path id="dayArc" d="M 420 145 A 55 55 0 0 1 420 255 A 55 55 0 0 0 420 145" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.4)" stroke-width="1"/>
            <path id="nightArc" d="M 420 145 A 55 55 0 0 0 420 255 A 55 55 0 0 1 420 145" fill="rgba(15,23,42,0.4)"/>
            <!-- 旋转方向箭头 -->
            <path d="M 420 140 A 18 18 0 0 1 406 150" fill="none" stroke="#fff" stroke-width="2" marker-end="url(#arrowhead)"/>
            <text x="420" y="135" text-anchor="middle" fill="#fff" font-size="11">自西向东旋转</text>
            <!-- 信息面板 -->
            <rect x="20" y="20" width="210" height="90" rx="8" fill="rgba(0,0,0,0.65)"/>
            <text x="30" y="44" fill="#fff" font-size="14" font-weight="700">🌍 地球自转模拟</text>
            <text id="rotTime" x="30" y="66" fill="#60a5fa" font-size="14" font-weight="700">地球自转角度：0°</text>
            <text id="rotPhase" x="30" y="88" fill="#fbbf24" font-size="12">北京：白天 ☀️ | 伦敦：清晨</text>
            <text x="30" y="106" fill="#94a3b8" font-size="11">1格 ≈ 1小时（示意）</text>
        </svg>
    `;

    canvas.appendChild(container);

    // 动画状态（挂载到window，方便toggleRotation访问）
    window._rotAngle = 0;
    window._rotAnimId = null;
    window._rotRunning = false;

    // 控制面板
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <button class="sim-btn" id="rotBtn" onclick="window.toggleRotation()">▶️ 开始旋转</button>
            <button class="sim-btn" onclick="window.resetRotation()">↺ 重置</button>
            <span style="font-size:13px;color:var(--gray-600);margin-left:8px;">观察提示：注意北京和伦敦的昼夜变化</span>
        `;
    }
}

// 地球自转动画函数（全局）
window.animateRotation = function() {
    if (!window._rotRunning) return;
    const angle = window._rotAngle;
    const dayArc = document.getElementById('dayArc');
    const nightArc = document.getElementById('nightArc');

    // 用旋转角度决定白天区域的绘制
    // 地球自西向东转，相当于白天区域从东向西扫
    const startAngle = (angle - 90) * Math.PI / 180;  // 白天起始角度
    const endAngle = (angle + 90) * Math.PI / 180;    // 白天结束角度
    const cx = 420, cy = 200, r = 55;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    // 白天弧（面向太阳的一侧）
    dayArc.setAttribute('d', `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`);
    // 黑夜弧（背对太阳的一侧）
    nightArc.setAttribute('d', `M ${cx} ${cy} L ${x2} ${y2} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`);

    // 更新信息
    const hours = Math.floor((angle / 360) * 24);
    const mins = Math.floor(((angle / 360) * 24 - hours) * 60);
    const timeStr = `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}`;
    const tEl = document.getElementById('rotTime');
    if (tEl) tEl.textContent = `地球自转角度：${angle}°  ≈ 当地时刻 ${timeStr}`;

    // 判断北京（东经116°，对应在地球上角度约 +116/360*360 = 116° 从本初子午线向东）
    // 简化：北京在地球东侧，伦敦在西侧
    const beijingPhase = (angle + 116) % 360;
    const londonPhase = (angle + 0) % 360;
    const beijingDay = beijingPhase > 90 && beijingPhase < 270;
    const londonDay = londonPhase > 90 && londonPhase < 270;
    const pEl = document.getElementById('rotPhase');
    if (pEl) pEl.textContent = `北京：${beijingDay ? '白天 ☀️' : '黑夜 🌙'} | 伦敦：${londonDay ? '白天 ☀️' : '黑夜 🌙'}`;

    window._rotAngle = (window._rotAngle + 1) % 360;
    window._rotAnimId = requestAnimationFrame(window.animateRotation);
};


// ==================== 等高线模拟器 ====================
function initContourSimulator() {
    const canvas = document.getElementById('simCanvas');
    canvas.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;';

    container.innerHTML = `
        <p style="margin-bottom:16px;font-size:14px;color:var(--gray-600);">在下方画布上点击添加等高点，系统将自动生成等高线地形图</p>
        <canvas id="contourCanvas" width="560" height="350" style="border:2px solid var(--gray-200);border-radius:var(--radius);background:#f0fdf4;cursor:crosshair;max-width:100%;"></canvas>
        <p style="margin-top:12px;font-size:13px;color:var(--gray-500);">点击画布添加等高点 | 等高距：50m</p>
    `;

    canvas.appendChild(container);

    const controls = document.getElementById('simControls');
    controls.innerHTML = `
        <button class="sim-btn" onclick="clearContour()">🗑️ 清除画布</button>
        <button class="sim-btn" onclick="generateContour()">📐 生成等高线</button>
        <button class="sim-btn" onclick="showContourAnswer()">✅ 显示地形</button>
        <label style="margin-left:8px;">等高距：</label>
        <select id="contourInterval" style="padding:4px 8px;border:1px solid var(--gray-200);border-radius:4px;">
            <option value="50">50m</option>
            <option value="100">100m</option>
            <option value="200">200m</option>
        </select>
    `;

    // 简单绘图逻辑
    const c = document.getElementById('contourCanvas');
    const ctx = c.getContext('2d');
    let points = [];

    c.addEventListener('click', e => {
        const rect = c.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        points.push({ x, y });
        drawContourPoints();
    });

    function drawContourPoints() {
        ctx.clearRect(0, 0, c.width, c.height);
        // 绘制网格
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < c.width; i += 20) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, c.height); ctx.stroke();
        }
        for (let i = 0; i < c.height; i += 20) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(c.width, i); ctx.stroke();
        }
        // 绘制点
        points.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${i * 40}, 70%, 50%)`;
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '11px sans-serif';
            ctx.fillText(`P${i + 1}`, p.x + 8, p.y - 8);
        });
    }

    window.clearContour = function () {
        points = [];
        ctx.clearRect(0, 0, c.width, c.height);
        drawContourPoints();
    };

    window.generateContour = function () {
        alert('等高线自动生成功能需要更复杂的算法实现。\n\n教学中建议：\n1. 用笔在纸上手绘等高线\n2. 观察相邻点之间的高度变化趋势\n3. 相同高度的点连线即为等高线');
    };

    window.showContourAnswer = function () {
        alert('请用橡皮泥制作山体模型，用水准法获取等高线。\n\n判断口诀：\n• 凸高为谷（等高线向高处凸出是山谷）\n• 凸低为脊（等高线向低处凸出是山脊）\n• 闭合高内低：山顶\n• 闭合低内高：盆地');
    };
}

// ==================== 热力环流模拟器 ====================
function initThermalSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#f0f9ff';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;';

    container.innerHTML = `
        <svg id="thermalSvg" width="600" height="380" viewBox="0 0 600 380" style="max-width:100%;height:auto;background:#f0f9ff;border-radius:var(--radius);">
            <rect x="100" y="80" width="400" height="220" fill="none" stroke="#475569" stroke-width="3" rx="4"/>
            <rect x="100" y="280" width="400" height="20" fill="#a16207" rx="2"/>
            <rect x="120" y="220" width="80" height="80" fill="#dc2626" opacity="0.5" rx="4"/>
            <text x="160" y="270" text-anchor="middle" fill="#fff" font-size="12" font-weight="600">🔥 热水区（受热）</text>
            <rect x="400" y="220" width="80" height="80" fill="#2563eb" opacity="0.35" rx="4"/>
            <text x="440" y="270" text-anchor="middle" fill="#1e3a5f" font-size="12" font-weight="600">🧊 冰块区（冷却）</text>
            <!-- 粒子（用circle元素） -->
            <circle id="tp1" cx="160" cy="240" r="4" fill="#64748b" opacity="0.9"/>
            <circle id="tp2" cx="180" cy="245" r="4" fill="#64748b" opacity="0.7"/>
            <circle id="tp3" cx="140" cy="250" r="4" fill="#64748b" opacity="0.8"/>
            <circle id="tp4" cx="420" cy="240" r="4" fill="#64748b" opacity="0.9"/>
            <circle id="tp5" cx="440" cy="245" r="4" fill="#64748b" opacity="0.7"/>
            <!-- 气流方向指示 -->
            <path d="M 200 150 Q 300 90 400 150" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8,4" opacity="0.6"/>
            <polygon points="400,150 394,146 394,154" fill="#ef4444" opacity="0.6"/>
            <text x="300" y="85" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="600">热空气上升 → 高空流向冷区</text>
            <path d="M 400 270 Q 300 320 200 270" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="8,4" opacity="0.6"/>
            <polygon points="200,270 206,266 206,274" fill="#3b82f6" opacity="0.6"/>
            <text x="300" y="345" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="600">冷空气下沉 → 近地面流回热区</text>
            <!-- 信息面板 -->
            <rect x="100" y="20" width="400" height="44" rx="8" fill="rgba(255,255,255,0.92)" stroke="#e2e8f0"/>
            <text x="300" y="46" text-anchor="middle" fill="#1e3a5f" font-size="15" font-weight="700">🌡️ 热力环流模拟（烟雾示踪法）</text>
        </svg>
    `;

    canvas.appendChild(container);

    // 动画状态
    window._thermalT = 0;
    window._thermalParticles = [
        { el: 'tp1', sx: 160, sy: 240, phase: 0 },
        { el: 'tp2', sx: 180, sy: 245, phase: 0.5 },
        { el: 'tp3', sx: 140, sy: 250, phase: 1.0 },
        { el: 'tp4', sx: 420, sy: 240, phase: 1.5 },
        { el: 'tp5', sx: 440, sy: 245, phase: 2.0 }
    ];

    // 控制面板
    const controls = document.getElementById('simControls');
    if (controls) {
        controls.innerHTML = `
            <button class="sim-btn" id="thermalBtn" onclick="window.toggleThermal()">▶️ 开始模拟</button>
            <button class="sim-btn" onclick="window.resetThermal()">↺ 重置</button>
            <span style="font-size:13px;color:var(--gray-600);margin-left:8px;">观察粒子运动方向，理解热力环流</span>
        `;
    }
}

// 热力环流动画（全局）
window.animateThermal = function() {
    if (!window._thermalRunning) return;
    const t = window._thermalT;
    const particles = window._thermalParticles;

    particles.forEach(p => {
        const el = document.getElementById(p.el);
        if (!el) return;
        // 粒子运动路径：从热水区上升 → 高空流向冰块区 → 下沉 → 近地面流回
        const cycle = t * 0.3 + p.phase;
        const phase = cycle % 4;  // 0:上升, 1:高空流, 2:下沉, 3:近地面流
        let x, y;
        if (phase < 1) {
            // 上升
            const f = phase;
            x = p.sx + (p.sx - 130) * f * 0.5;
            y = p.sy - 60 * f;
        } else if (phase < 2) {
            // 高空流向右侧
            const f = phase - 1;
            x = p.sx + (430 - p.sx) * f;
            y = p.sy - 60 + 10 * f;
        } else if (phase < 3) {
            // 下沉
            const f = phase - 2;
            x = 430 + (p.sx + 260 - 430) * f * 0.5;
            y = (p.sy - 50) + 60 * f;
        } else {
            // 近地面流回
            const f = phase - 3;
            x = (p.sx + 260) - (p.sx + 260 - p.sx) * f;
            y = p.sy + 10 * f * 0.3;
        }
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
    });

    window._thermalT += 0.02;
    window._thermalAnimId = requestAnimationFrame(window.animateThermal);
};


// ==================== 水循环模拟器 ====================
function initWaterCycleSimulator() {
    const canvas = document.getElementById('simCanvas');
    canvas.innerHTML = '';
    canvas.style.background = '#f0f9ff';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;';

    container.innerHTML = `
        <svg id="waterSvg" width="600" height="400" style="max-width:100%;height:auto;">
            <!-- 背景 -->
            <rect width="600" height="400" fill="#e0f2fe"/>
            <!-- 海洋 -->
            <rect x="0" y="280" width="600" height="120" fill="#0ea5e9" opacity="0.6"/>
            <text x="300" y="350" text-anchor="middle" fill="#0c4a6e" font-size="14" font-weight="600">海洋（蒸发源）</text>
            <!-- 陆地 -->
            <rect x="50" y="260" width="120" height="40" fill="#a16207"/>
            <text x="110" y="285" text-anchor="middle" fill="#fff" font-size="11">陆地</text>
            <!-- 蒸发箭头 -->
            <path id="evapArrow" d="M 300 280 L 300 180" fill="none" stroke="#0ea5e9" stroke-width="2" marker-end="url(#waterArrow)"/>
            <!-- 水汽输送箭头 -->
            <path id="transArrow" d="M 320 160 L 450 160" fill="none" stroke="#6366f1" stroke-width="2" marker-end="url(#waterArrow)"/>
            <!-- 降水箭头 -->
            <path id="precArrow" d="M 470 160 L 470 260" fill="none" stroke="#3b82f6" stroke-width="2" marker-end="url(#waterArrow)"/>
            <!-- 地表径流箭头 -->
            <path id="runoffArrow" d="M 470 280 Q 350 290 200 285" fill="none" stroke="#0284c7" stroke-width="2" marker-end="url(#waterArrow)"/>
            <!-- 箭头标记 -->
            <defs>
                <marker id="waterArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#6366f1"/>
                </marker>
            </defs>
            <!-- 环节标签 -->
            <text x="300" y="170" text-anchor="middle" fill="#0369a1" font-size="12" font-weight="600">蒸发 ↑</text>
            <text x="390" y="155" text-anchor="middle" fill="#4338ca" font-size="12" font-weight="600">→ 水汽输送</text>
            <text x="490" y="230" text-anchor="middle" fill="#1d4ed8" font-size="12" font-weight="600">↓ 降水</text>
            <text x="320" y="310" text-anchor="middle" fill="#0c4a6e" font-size="12" font-weight="600">地表径流 →</text>
            <!-- 标题 -->
            <rect x="20" y="20" width="180" height="36" rx="8" fill="rgba(255,255,255,.9)" stroke="#bae6fd"/>
            <text x="110" y="44" text-anchor="middle" fill="#0c4a6e" font-size="14" font-weight="700">水循环示意图</text>
        </svg>
    `;

    canvas.appendChild(container);

    const controls = document.getElementById('simControls');
    controls.innerHTML = `
        <span style="font-size:13px;color:var(--gray-600);">水循环各环节示意：蒸发 → 水汽输送 → 降水 → 地表径流（可循环）</span>
        <button class="sim-btn" onclick="alert('水循环各环节说明：\\n1. 蒸发：太阳辐射使水变成水蒸气\\n2. 水汽输送：大气运动把水汽带到各地\\n3. 降水：水汽凝结降落（雨、雪、冰雹）\\n4. 地表径流：水沿地面流动返回海洋\\n5. 下渗：水渗入地下成为地下水')">📖 各环节说明</button>
    `;
}

// ==================== 全局数据集（供模拟器使用）====================
window.japanData = {
    male: [2.0, 2.2, 2.5, 3.0, 3.5, 4.0, 4.2, 4.0, 3.8, 3.5, 3.2, 3.0, 2.8, 2.5, 2.0, 1.5, 1.2],
    female: [1.9, 2.1, 2.4, 2.9, 3.4, 3.9, 4.2, 4.1, 4.0, 3.8, 3.6, 3.5, 3.4, 3.2, 2.8, 2.2, 2.0]
};
window.nigeriaData = {
    male: [8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3],
    female: [7.8, 7.3, 6.8, 6.3, 5.8, 5.3, 4.8, 4.3, 3.8, 3.3, 2.8, 2.3, 1.8, 1.3, 0.8, 0.4, 0.2]
};
window.chinaData = {
    male: [4.2, 4.5, 4.8, 4.5, 4.2, 3.8, 3.5, 3.2, 3.0, 2.7, 2.3, 2.0, 1.6, 1.2, 0.8, 0.5, 0.4],
    female: [3.8, 4.1, 4.4, 4.2, 4.0, 3.7, 3.4, 3.1, 2.9, 2.6, 2.2, 2.0, 1.7, 1.4, 1.0, 0.7, 0.6]
};

// ==================== 人口金字塔模拟器 ====================
function initPopulationSimulator() {
    const canvas = document.getElementById('simCanvas');
    canvas.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;';

    container.innerHTML = `
        <p style="margin-bottom:12px;font-size:14px;color:var(--gray-600);">选择国家或地区，查看其人口金字塔形状</p>
        <canvas id="pyramidCanvas" width="560" height="350" style="border:1px solid var(--gray-200);border-radius:var(--radius);background:#fff;max-width:100%;"></canvas>
    `;

    canvas.appendChild(container);

    // 绘制人口金字塔
    function drawPyramid(data, title) {
        const c = document.getElementById('pyramidCanvas');
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);

        // 标题
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, 280, 25);

        // 坐标轴
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(280, 35);
        ctx.lineTo(280, 330);
        ctx.stroke();

        // 年龄组
        const ageGroups = ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'];
        const barHeight = 16;
        const maxWidth = 120;

        ageGroups.forEach((age, i) => {
            const y = 40 + i * (barHeight + 2);

            // 年龄标签
            ctx.fillStyle = '#475569';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(age, 275, y + barHeight / 2 + 3);

            // 男性条（左）
            const maleVal = data.male[i] || 0;
            const maleWidth = (maleVal / 100) * maxWidth;
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(280 - maleWidth, y, maleWidth, barHeight);
            ctx.fillStyle = '#1e40af';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(maleVal + '%', 278 - maleWidth, y + barHeight / 2 + 3);

            // 女性条（右）
            const femaleVal = data.female[i] || 0;
            const femaleWidth = (femaleVal / 100) * maxWidth;
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(281, y, femaleWidth, barHeight);
            ctx.fillStyle = '#9d174d';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(femaleVal + '%', 283 + femaleWidth, y + barHeight / 2 + 3);
        });

        // 图例
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(20, 335, 12, 12);
        ctx.fillStyle = '#1e3a5f';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('男性', 36, 346);

        ctx.fillStyle = '#ec4899';
        ctx.fillRect(80, 335, 12, 12);
        ctx.fillStyle = '#1e3a5f';
        ctx.fillText('女性', 96, 346);
    }

    // 示例数据（中国2020年近似数据）
    const chinaData = {
        male: [4.2, 4.5, 4.8, 4.5, 4.2, 3.8, 3.5, 3.2, 3.0, 2.7, 2.3, 2.0, 1.6, 1.2, 0.8, 0.5, 0.4],
        female: [3.8, 4.1, 4.4, 4.2, 4.0, 3.7, 3.4, 3.1, 2.9, 2.6, 2.2, 2.0, 1.7, 1.4, 1.0, 0.7, 0.6]
    };

    drawPyramid(chinaData, '中国人口金字塔（近似2020年数据）');

    const controls = document.getElementById('simControls');
    controls.innerHTML = `
        <label>选择国家/地区：</label>
        <button class="sim-btn active" onclick="drawPyramid(chinaData, '中国人口金字塔（近似2020年数据）'); setActiveSimBtn(this)">中国</button>
        <button class="sim-btn" onclick="drawPyramid(japanData, '日本人口金字塔（老龄化型）'); setActiveSimBtn(this)">日本</button>
        <button class="sim-btn" onclick="drawPyramid(nigeriaData, '尼日利亚人口金字塔（扩张型）'); setActiveSimBtn(this)">尼日利亚</button>
    `;

    // 日本数据（老龄化型）
    window.japanData = {
        male: [2.0, 2.2, 2.5, 3.0, 3.5, 4.0, 4.2, 4.0, 3.8, 3.5, 3.2, 3.0, 2.8, 2.5, 2.0, 1.5, 1.2],
        female: [1.9, 2.1, 2.4, 2.9, 3.4, 3.9, 4.2, 4.1, 4.0, 3.8, 3.6, 3.5, 3.4, 3.2, 2.8, 2.2, 2.0]
    };

    // 尼日利亚数据（扩张型）
    window.nigeriaData = {
        male: [8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.3],
        female: [7.8, 7.3, 6.8, 6.3, 5.8, 5.3, 4.8, 4.3, 3.8, 3.3, 2.8, 2.3, 1.8, 1.3, 0.8, 0.4, 0.2]
    };

    // 将函数和数据集挂载到window，供HTML中的onclick调用
    window.drawPyramid = drawPyramid;
    window.setActiveSimBtn = function (el) {
        if (!el || !el.parentElement) return;
        el.parentElement.querySelectorAll('.sim-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
    };
    window.japanData = japanData;
    window.nigeriaData = nigeriaData;
}

// ==================== 城市热岛模拟器 ====================
function initHeatIslandSimulator() {
    const canvas = document.getElementById('simCanvas');
    canvas.innerHTML = '';
    canvas.style.background = '#fefce8';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;';

    container.innerHTML = `
        <p style="margin-bottom:12px;font-size:14px;color:var(--gray-600);">调节城市绿地比例，观察热岛效应的变化</p>
        <canvas id="heatCanvas" width="560" height="320" style="border:1px solid var(--gray-200);border-radius:var(--radius);max-width:100%;"></canvas>
        <div style="margin-top:12px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;">
            <span style="font-size:13px;color:var(--gray-600);">温度色标：</span>
            <span style="font-size:12px;">🔵 低温 &lt;28°C</span>
            <span style="font-size:12px;">🟢 适中 28-32°C</span>
            <span style="font-size:12px;">🟡 偏高 32-35°C</span>
            <span style="font-size:12px;">🔴 高温 &gt;35°C</span>
        </div>
    `;

    canvas.appendChild(container);

    function drawHeatMap(greenRatio) {
        const c = document.getElementById('heatCanvas');
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);

        const gridSize = 20;
        const cols = Math.floor(c.width / gridSize);
        const rows = Math.floor(c.height / gridSize);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * gridSize;
                const y = row * gridSize;

                // 随机决定是否为绿地（根据greenRatio）
                const isGreen = Math.random() < greenRatio;

                // 温度计算：城市中心温度高，绿地温度低
                const centerX = c.width / 2;
                const centerY = c.height / 2;
                const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
                const tempBase = 35 - (dist / maxDist) * 8; // 中心35°C，边缘27°C
                const temp = isGreen ? tempBase - 4 : tempBase;

                // 颜色映射
                let color;
                if (temp < 28) color = '#1d4ed8';      // 蓝
                else if (temp < 32) color = '#16a34a';  // 绿
                else if (temp < 35) color = '#eab308';  // 黄
                else color = '#dc2626';                   // 红

                ctx.fillStyle = color;
                ctx.fillRect(x, y, gridSize, gridSize);
            }
        }

        // 标注
        ctx.fillStyle = 'rgba(0,0,0,.7)';
        ctx.fillRect(10, 10, 200, 30);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`绿地比例：${(greenRatio * 100).toFixed(0)}%  |  城市中心最高温：约${35 - (greenRatio * 3)}°C`, 16, 30);
    }

    drawHeatMap(0.1);

    const controls = document.getElementById('simControls');
    controls.innerHTML = `
        <label>绿地比例：</label>
        <input type="range" id="greenRange" min="0.05" max="0.8" step="0.05" value="0.1" oninput="drawHeatMap(parseFloat(this.value))" style="width:150px;">
        <span id="greenValue" style="font-size:13px;font-weight:500;color:var(--primary);">10%</span>
        <button class="sim-btn" onclick="drawHeatMap(0.1)">🔄 重新生成</button>
    `;

    document.getElementById('greenRange').addEventListener('input', function () {
        document.getElementById('greenValue').textContent = (this.value * 100).toFixed(0) + '%';
    });
}

// ==================== 温室效应模拟器 ====================
function initGreenhouseSimulator() {
    const canvas = document.getElementById('simCanvas');
    canvas.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;';

    container.innerHTML = `
        <p style="margin-bottom:12px;font-size:14px;color:var(--gray-600);">对比普通空气与二氧化碳空气的升温效果</p>
        <canvas id="greenhouseCanvas" width="560" height="300" style="border:1px solid var(--gray-200);border-radius:var(--radius);background:#fff;max-width:100%;"></canvas>
    `;

    canvas.appendChild(container);

    // 绘制对比折线图
    function drawGreenhouseChart() {
        const c = document.getElementById('greenhouseCanvas');
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);

        const padding = { top: 40, right: 40, bottom: 50, left: 50 };
        const chartW = c.width - padding.left - padding.right;
        const chartH = c.height - padding.top - padding.bottom;

        // 模拟数据（时间分钟 vs 温度°C）
        const time = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        const normalAir = [22, 23, 24, 25, 26, 27, 27.5, 28, 28.5, 29, 29.5];
        const co2Air = [22, 24, 26, 28, 30, 32, 33, 34, 35, 35.5, 36];

        // 坐标轴
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, c.height - padding.bottom);
        ctx.lineTo(c.width - padding.right, c.height - padding.bottom);
        ctx.stroke();

        // Y轴标签
        ctx.fillStyle = '#475569';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        for (let t = 20; t <= 38; t += 2) {
            const y = padding.top + chartH - ((t - 20) / 18) * chartH;
            ctx.fillText(t + '°C', padding.left - 5, y + 3);
            ctx.strokeStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(c.width - padding.right, y);
            ctx.stroke();
        }

        // X轴标签
        ctx.textAlign = 'center';
        time.forEach((t, i) => {
            const x = padding.left + (i / (time.length - 1)) * chartW;
            ctx.fillText(t + 'min', x, c.height - padding.bottom + 20);
        });

        // 标题
        ctx.fillStyle = '#1e3a5f';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('二氧化碳对温度影响对比（模拟数据）', c.width / 2, 25);

        // 绘制普通空气曲线
        drawLine(time, normalAir, '#3b82f6', '普通空气');
        // 绘制二氧化碳曲线
        drawLine(time, co2Air, '#dc2626', '含二氧化碳空气');

        function drawLine(xData, yData, color, label) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            xData.forEach((xVal, i) => {
                const x = padding.left + (i / (xData.length - 1)) * chartW;
                const y = padding.top + chartH - ((yData[i] - 20) / 18) * chartH;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // 图例
            const legendX = padding.left + 20 + (color === '#dc2626' ? 150 : 0);
            ctx.fillStyle = color;
            ctx.fillRect(legendX, padding.top - 20, 16, 3);
            ctx.fillStyle = '#475569';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(label, legendX + 22, padding.top - 16);
        }
    }

    drawGreenhouseChart();

    const controls = document.getElementById('simControls');
    controls.innerHTML = `
        <span style="font-size:13px;color:var(--gray-600);">图表说明：在相同光照条件下，含二氧化碳的空气升温更快、温度更高</span>
        <button class="sim-btn" onclick="drawGreenhouseChart()">🔄 刷新图表</button>
    `;
}

// ==================== 地球公转模拟器（暂未实现）====================
function initRevolutionSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = '';
    canvas.style.background = '#0f172a';
    const d = document.createElement('div');
    d.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:16px;';
    d.innerHTML = '<svg id="rvS" width="600" height="420" viewBox="0 0 600 420" style="max-width:100%;height:auto;">' +
        '<circle cx="300" cy="210" r="35" fill="#fbbf24"/><text x="300" y="218" text-anchor="middle" fill="#92400e" font-size="12" font-weight="700">太阳</text>' +
        '<ellipse cx="300" cy="210" rx="220" ry="90" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>' +
        '<circle id="rvE" cx="520" cy="210" r="18" fill="#2563eb" stroke="#60a5fa" stroke-width="2"/>' +
        '<line id="rvA" x1="520" y1="195" x2="520" y2="225" stroke="#fbbf24" stroke-width="2" transform="rotate(-23.5,520,210)"/>' +
        '<line id="rvR" x1="300" y1="210" x2="520" y2="210" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6,3" opacity="0.7"/>' +
        '<text id="rvL" x="520" y="250" text-anchor="middle" fill="#e2e8f0" font-size="13" font-weight="600"></text>' +
        '<rect x="16" y="16" width="260" height="90" rx="8" fill="rgba(0,0,0,0.65)"/>' +
        '<text id="rvD" x="26" y="38" fill="#fbbf24" font-size="13" font-weight="600">节气：春分</text>' +
        '<text id="rvRd" x="26" y="58" fill="#60a5fa" font-size="12">直射：赤道</text>' +
        '<text id="rvS" x="26" y="78" fill="#4ade80" font-size="12">季节</text>' +
        '<text id="rvN" x="26" y="98" fill="#fbbf24" font-size="12">昼夜</text>' +
        '</svg>';
    canvas.appendChild(d);

    const S = [{d:80,l:"春分(3月21日)",dr:"0°赤道",sn:"北春|南秋",n:"昼夜平分"},{d:172,l:"夏至(6月22日)",dr:"23.5°N",sn:"北夏|南冬",n:"北昼最长"},{d:266,l:"秋分(9月23日)",dr:"0°赤道",sn:"北秋|南春",n:"昼夜平分"},{d:355,l:"冬至(12月22日)",dr:"23.5°S",sn:"北冬|南夏",n:"北昼最短"}];
    window._rd = 80; window._rr = false;
    function up() {
        const a = (window._rd/365)*360, r = a*Math.PI/180;
        const x = 300+220*Math.cos(r-Math.PI/2), y = 210+90*Math.sin(r-Math.PI/2);
        const E = document.getElementById('rvE'); if(E){E.setAttribute('cx',x);E.setAttribute('cy',y);}
        const R = document.getElementById('rvR'); if(R){R.setAttribute('x2',x);R.setAttribute('y2',y);}
        const L = document.getElementById('rvL'); if(L){L.setAttribute('x',x);L.setAttribute('y',y+40);}
        let c = S[0], md = 999; S.forEach(s2 => { const v = Math.abs(window._rd-s2.d); if(v<md){md=v;c=s2;}});
        const e = document.getElementById('rvD'); if(e) e.textContent = '节气：' + c.l;
        const r2 = document.getElementById('rvRd'); if(r2) r2.textContent = '直射：' + c.dr;
        const s2 = document.getElementById('rvS'); if(s2) s2.textContent = '季节：' + c.sn;
        const n = document.getElementById('rvN'); if(n) n.textContent = '昼夜：' + c.n;
        if(L) L.textContent = c.l;
    }
    window._ar = function() { if(!window._rr) return; window._rd+=1; if(window._rd>365) window._rd=1; up(); setTimeout(window._ar, 80); };
    up();
    const ct = document.getElementById('simControls');
    if(ct) ct.innerHTML = '<button class="sim-btn" id="rvB" onclick="window._rr=!window._rr;if(window._rr)window._ar();else clearTimeout(window._ra);this.textContent=window._rr?\'⏸ 暂停\':\'▶ 公转\'">▶ 公转</button>' +
        '<button class="sim-btn" onclick="window._rd=80;up();">↺ 春分</button>' +
        '<input type="range" min="1" max="365" value="80" id="rvSl" oninput="window._rd=parseInt(this.value);up();" style="width:100px;">';
}

// ==================== 河流地貌模拟器（暂未实现）====================
function initRiverSimulator() {
    const canvas = document.getElementById('simCanvas');
    if (!canvas) return;
    canvas.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;color:var(--gray-600);">
            <div style="font-size:64px;">🏞️</div>
            <h3>河流地貌模拟器</h3>
            <p style="font-size:14px;color:var(--gray-500);max-width:400px;text-align:center;">
                本实验模拟器正在开发中。请先查看实验详情，了解河流侵蚀、搬运和堆积作用。
            </p>
            <button class="btn btn-primary" onclick="showPage('detail', {id: 'j010'})">查看实验详情</button>
        </div>`;
}

// ==================== 教师演示模式 ====================
function enterDemoMode(expId) {
    isDemoMode = true;
    document.getElementById('demoModeBar').classList.add('open');
    // 进入详情页的大字体模式
    showPage('detail', { id: expId });
    document.body.classList.add('demo-mode');

    // 注入演示模式样式
    if (!document.getElementById('demoStyle')) {
        const style = document.createElement('style');
        style.id = 'demoStyle';
        style.textContent = `
            .demo-mode .detail-header { padding: 48px 32px; font-size: 1.2em; }
            .demo-mode .detail-section { padding: 32px; font-size: 1.1em; }
            .demo-mode .detail-section h2 { font-size: 24px; }
            .demo-mode .objectives-list li,
            .demo-mode .step-content p,
            .demo-mode .detail-quote { font-size: 16px; }
            .demo-mode .exp-card-title { font-size: 22px; }
        `;
        document.head.appendChild(style);
    }
}

function exitDemoMode() {
    isDemoMode = false;
    document.getElementById('demoModeBar').classList.remove('open');
    document.body.classList.remove('demo-mode');
    const style = document.getElementById('demoStyle');
    if (style) style.remove();
    const btn = document.getElementById('simDemoBtn');
    if (btn) btn.textContent = '🖥️ 教师演示模式';
}

// ==================== 模拟器页面演示模式切换 ====================
function toggleSimDemoMode(expId) {
    if (isDemoMode) {
        exitDemoMode();
    } else {
        isDemoMode = true;
        document.getElementById('demoModeBar').classList.add('open');
        document.body.classList.add('demo-mode');
        
        // 为模拟器页面注入演示模式样式
        if (!document.getElementById('demoStyle')) {
            const style = document.createElement('style');
            style.id = 'demoStyle';
            style.textContent = `
                .demo-mode .simulator-header { padding: 32px 24px; font-size: 1.4em; background: #1e3a5f; color: #fff; }
                .demo-mode .simulator-header h1 { color: #fff; font-size: 1.4em; }
                .demo-mode .simulator-header .btn { font-size: 14px; padding: 10px 20px; }
                .demo-mode #simCanvas { transform: scale(1.05); transform-origin: center center; }
                .demo-mode #simControls { padding: 20px; font-size: 1.1em; }
                .demo-mode #simControls .sim-btn { font-size: 16px; padding: 12px 24px; }
                .demo-mode h3 { font-size: 1.5em !important; }
                .demo-mode h4 { font-size: 1.2em !important; }
                .demo-mode label, .demo-mode select, .demo-mode input { font-size: 1.1em !important; }
                .demo-mode table { font-size: 1.1em; }
                .demo-mode canvas { max-width: 100% !important; height: auto !important; }
            `;
            document.head.appendChild(style);
        }
        
        const btn = document.getElementById('simDemoBtn');
        if (btn) btn.textContent = '🖥️ 退出演示模式';
    }
}

// ==================== 打印实验报告 ====================
function printExperiment(id) {
    const exp = getExperimentById(id);
    if (!exp) return;

    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${exp.title} - 实验报告</title>
            <style>
                body { font-family: "SimSun", "宋体", serif; padding: 40px; line-height: 1.8; }
                h1 { text-align: center; font-size: 22px; margin-bottom: 20px; }
                h2 { font-size: 16px; border-left: 4px solid #2563eb; padding-left: 8px; margin: 20px 0 10px; }
                .meta { display: flex; gap: 24px; margin-bottom: 20px; font-size: 14px; }
                .meta span { padding: 4px 12px; background: #f0f9ff; border-radius: 4px; }
                ol, ul { padding-left: 24px; }
                li { margin-bottom: 6px; }
                .conclusion { background: #f0f9ff; padding: 12px 16px; border-radius: 4px; margin: 12px 0; }
                .signature { margin-top: 40px; display: flex; justify-content: space-between; }
                @media print {
                    body { padding: 20px; }
                }
            </style>
        </head>
        <body>
            <h1>地理实验报告</h1>
            <div class="meta">
                <span>实验名称：${exp.title}</span>
                <span>适用年级：${exp.grade}</span>
                <span>预计时长：${exp.duration}</span>
            </div>
            <h2>一、实验目的</h2>
            <ol>${exp.objectives.map(o => `<li>${o}</li>`).join('')}</ol>
            <h2>二、实验材料</h2>
            <ul>${exp.materials.map(m => `<li>${m}</li>`).join('')}</ul>
            <h2>三、实验步骤</h2>
            <ol>${exp.steps.map(s => `<li>${s.description}</li>`).join('')}</ol>
            <h2>四、实验现象记录</h2>
            <div style="border:1px solid #ccc;min-height:80px;padding:8px;margin:8px 0;"></div>
            <h2>五、实验结论</h2>
            <div class="conclusion">${exp.conclusion}</div>
            <h2>六、问题与思考</h2>
            <div style="border:1px solid #ccc;min-height:60px;padding:8px;margin:8px 0;"></div>
            <div class="signature">
                <div>班级：__________ 姓名：__________</div>
                <div>日期：__________ 评分：__________</div>
            </div>
        </body>
        </html>
    `);
    printWin.document.close();
    setTimeout(() => printWin.print(), 500);
}

// ==================== 教学资源渲染 ====================
function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    const resources = [
        { icon: '📄', title: '实验报告模板（标准版）', desc: '适用于所有地理实验的标准实验报告模板，含实验目的、步骤、现象记录、结论等栏目。', type: 'Word文档', action: () => alert('实验报告模板下载功能正在开发中') },
        { icon: '📊', title: '实验数据记录表', desc: '气温、降水量、风向风速等气象观测专用数据记录表，可直接打印使用。', type: 'Excel表格', action: () => alert('数据记录表下载功能正在开发中') },
        { icon: '🎓', title: '地理实验安全指南', desc: '初中和高中地理实验安全操作规范，含危险化学品使用、高温操作、户外实践等安全提示。', type: 'PDF文档', action: () => alert('安全指南查看功能正在开发中') },
        { icon: '📽️', title: '实验演示PPT模板', desc: '适用于课堂教学的地理实验演示PPT模板，含标准版式和动画效果。', type: 'PPT模板', action: () => alert('PPT模板下载功能正在开发中') },
        { icon: '🗺️', title: '中国典型地貌图谱', desc: '收集中国各类典型地貌（喀斯特、丹霞、风蚀、冰川等）高清图片及说明，辅助地貌观察实验。', type: '图片集', action: () => alert('地貌图谱查看功能正在开发中') },
        { icon: '📚', title: '地理实验课程标准对照表', desc: '初高中地理实验与课程标准的对照表，帮助教师把握实验教学要求。', type: '参考文档', action: () => alert('课程标准对照表查看功能正在开发中') },
    ];

    grid.innerHTML = resources.map(r => `
        <div class="resource-card">
            <div class="resource-icon">${r.icon}</div>
            <h3>${r.title}</h3>
            <p>${r.desc}</p>
            <div class="resource-meta">
                <span class="resource-type">${r.type}</span>
                <button class="btn btn-sm btn-outline" onclick="this.parentElement.parentElement.click()">下载</button>
            </div>
        </div>
    `).join('');

    // 绑定点击事件
    grid.querySelectorAll('.resource-card').forEach((card, i) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => resources[i].action());
    });
}

// ==================== 移动端菜单 ====================
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// ==================== 滚动处理 ====================
window.addEventListener('scroll', () => {
    const btn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    renderHome();

    // 关闭搜索栏当点击外部
    document.addEventListener('click', (e) => {
        const searchBar = document.getElementById('searchBar');
        if (!e.target.closest('.header-actions') && !e.target.closest('#searchBar')) {
            searchBar.classList.remove('open');
            document.getElementById('searchResults').classList.remove('open');
        }
    });
});
