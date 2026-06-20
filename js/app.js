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
        // 初中地理实验（j001-j010）
        case 'j001': initLatitudeSimulator(); break;
        case 'j002': initRotationSimulator(); break;
        case 'j003': initRevolutionSimulator(); break;
        case 'j004': initJ004Simulator(); break;
        case 'j005': initJ005Simulator(); break;
        case 'j006': initJ006Simulator(); break;
        case 'j007': initJ007Simulator(); break;
        case 'j008': initJ008Simulator(); break;
        case 'j009': initJ009Simulator(); break;
        case 'j010': initJ010Simulator(); break;
        // 高中地理实验（s001-s008）
        case 's001': initS001Simulator(); break;
        case 's002': initS002Simulator(); break;
        case 's003': initS003Simulator(); break;
        case 's004': initS004Simulator(); break;
        case 's005': initS005Simulator(); break;
        case 's006': initS006Simulator(); break;
        case 's007': initS007Simulator(); break;
        case 's008': initS008Simulator(); break;
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

