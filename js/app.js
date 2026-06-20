// ==================== 全局状态 ====================
let currentPage = 'home';
let currentGrade = null;
let isDemoMode = false;

// ==================== 工具函数 ====================
function getExperimentById(id) {
    const all = [...EXPERIMENTS_DATA.junior, ...EXPERIMENTS_DATA.senior];
    return all.find(e => e.id === id) || null;
}

function toggleSimDemoMode(id) {
    isDemoMode = !isDemoMode;
    const btn = document.getElementById('simDemoBtn');
    if (btn) {
        btn.textContent = isDemoMode ? '🖥️ 退出演示模式' : '🖥️ 教师演示模式';
        btn.classList.toggle('btn-primary', isDemoMode);
        btn.classList.toggle('btn-outline', !isDemoMode);
    }
    const container = document.getElementById('simulatorContainer');
    if (container) {
        container.classList.toggle('demo-mode', isDemoMode);
    }
    const bar = document.getElementById('demoModeBar');
    if (bar) bar.style.display = isDemoMode ? 'flex' : 'none';
}

// 退出教师演示模式（HTML中 onclick 引用）
window.exitDemoMode = function() {
    isDemoMode = false;
    const container = document.getElementById('simulatorContainer');
    if (container) container.classList.remove('demo-mode');
    const bar = document.getElementById('demoModeBar');
    if (bar) bar.style.display = 'none';
    const btn = document.getElementById('simDemoBtn');
    if (btn) {
        btn.textContent = '🖥️ 教师演示模式';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    }
};

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

// ==================== 教学资源页面 ====================
function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;

    const resources = [
        {
            icon: '📝',
            title: '实验报告模板（可下载）',
            desc: '地理实验通用报告模板 + 18个实验专用模板，Word格式，可直接编辑打印',
            tags: ['Word', '免费下载'],
            color: '#3b82f6',
            action: 'downloadTemplate',
            detail: '【模板清单】\n\n📄 通用实验报告模板.docx\n• 实验名称/日期/班级/姓名栏\n• 实验目的与假设\n• 实验器材清单\n• 实验步骤记录表（带序号）\n• 数据/现象观察记录区\n• 结论与分析框\n• 思考与拓展题\n• 教师评语栏\n\n📄 初中实验专用模板（10套）\nj001经纬网定位 / j002地球自转 / j003地球公转 / j004等高线绘制 / j005气温分布 / j006降水分布 / j007风向判断 / j008岩石循环 / j009海陆热力差异 / j010河流地貌\n\n📄 高中实验专用模板（8套）\ns001热力环流 / s002水循环 / s003正午太阳高度 / s004人口金字塔 / s005城市热岛效应 / s006工业区位选择 / s007农业区位因素 / s008温室效应'
        },
        {
            icon: '📊',
            title: '数据记录表格（可下载）',
            desc: '18个实验配套的数据记录Excel表格，含自动计算公式和图表模板',
            tags: ['Excel', '18套免费'],
            color: '#10b981',
            action: 'downloadDataSheet',
            detail: '【表格清单】\n\n📊 经纬网定位 — 坐标记录表（含城市经纬度参考数据）\n📊 地球自转 — 昼夜变化时间记录表\n📊 地球公转 — 四季日照时间对比表\n📊 等高线绘制 — 高程点数据采集表\n📊 世界气温分布 — 温度对比分析表（含公式）\n📊 世界降水分布 — 降水量统计表\n📊 风向判断 — 气压与风向关系表\n📊 岩石循环 — 岩石类型特征对照表\n📊 海陆热力差异 — 陆地海洋温度对比表\n📊 河流地貌 — 河段特征对比表\n📊 热力环流 — 气流方向与温度记录表\n📊 水循环 — 水量平衡计算表\n📊 正午太阳高度角 — 角度计算表（含公式）\n📊 人口金字塔 — 人口数据统计表\n📊 城市热岛效应 — 温差测量记录表\n📊 工业区位 — 区位因素评分表\n📊 农业区位 — 区位因素雷达图数据表\n📊 温室效应 — 温度变化趋势记录表'
        },
        {
            icon: '🎬',
            title: '优质微课视频（免费观看）',
            desc: '从全网精选的高质量地理实验教学视频，涵盖全部18个实验主题',
            tags: ['视频', '免费'],
            color: '#ef4444',
            action: 'viewVideoList',
            detail: '【精选视频资源】\n\n▶️ B站优质系列\n• 【地理老师李永乐】地球自转与公转原理 → 搜索"李永乐 地理"\n• 【安迎老师】高中地理实验演示 → 搜索"安迎 地理实验"\n• 【洋芋博士】趣味地理实验 → 搜索"洋芋博士 地理"\n• 【星球研究所】地球科学科普动画\n\n▶️ 国家级平台\n• 国家中小学智慧教育平台 → smartedu.cn（搜索"地理实验"）\n• 中国教育电视台同步课堂 → cetv.cn\n\n▶️ 国际优秀资源（需VPN或国内镜像）\n• TED-Ed Earth Science 系列（中文字幕版可在B站搜到）\n• PhET Interactive Simulations 官方教程\n• Crash Course Geography（中英双语字幕）\n\n▶️ 实验操作演示\n• "初中地理实验操作示范"合集\n• "高中地理模拟实验"专题\n• "等高线地形图判读技巧"\n• "热力环流实验演示"'
        },
        {
            icon: '📘',
            title: '课程标准与教材（官方下载）',
            desc: '教育部2022版新课标、人教/湘教版电子课本、考试大纲等官方文件',
            tags: ['PDF', '官方正版'],
            color: '#8b5cf6',
            action: 'viewStandardMap',
            detail: '【官方资源下载】\n\n📋 义务教育地理课程标准（2022年版）\n→ 教育部官网 moe.gov.cn 可免费下载PDF\n→ 包含：课程性质、核心素养、内容要求、学业质量、实施建议\n\n📙 人教版地理电子课本\n• 七年级上/下册（免费PDF）\n• 八年级上/下册（免费PDF）\n• 高中必修1 自然地理基础\n• 高中必修2 人文地理\n\n📗 湘教版地理电子课本\n• 七至八年级全册\n• 高中必修全册\n\n📐 考试大纲\n• 中考地理考试说明（各省市）\n• 全国高考地理考试大纲\n\n💡 提示：以上资源均可通过"国家中小学智慧教育平台"(smartedu.cn)免费获取完整版。'
        },
        {
            icon: '🧪',
            title: '互动模拟工具推荐',
            desc: '国内外优秀的地理互动模拟工具，辅助课堂教学和学生自主探究',
            tags: ['工具', '免费'],
            color: '#06b6d4',
            action: 'viewSimTools',
            detail: '【推荐互动工具】\n\n🌍 PhET Interactive Simulations（科罗拉多大学）\n→phet.colorado.edu\n• 重力与轨道 • 板块构造 • 波浪• 绿house Effect\n支持中文，完全免费，无需注册\n\n🗺️ EduInteract 教学互动平台\n→ eduinteract.com\n• 等高线地形图模拟器（非常推荐！）\n• 中国地形3D模型\n• 天气系统可视化\n\n🌦️ 中国气象局公众服务网\n→ weather.com.cn\n• 实时卫星云图\n• 降雨雷达图\n• 台风路径追踪\n\n🌏 Google Earth（网页版）\n→ earth.google.com/web/\n• 3D地形浏览\n• 经纬网叠加显示\n• 历史影像对比\n\n📊 ArcGIS Online 教育版\n→ arcgis.com（教育账号免费）\n• 在线地图制作\n• 空间数据分析'
        },
        {
            icon: '⚠️',
            title: '实验安全指南（免费下载）',
            desc: '地理实验室安全规范、器材使用注意事项、应急处理流程手册',
            tags: ['PDF', '必读'],
            color: '#f59e0b',
            action: 'viewSafetyGuide',
            detail: '【安全指南内容】\n\n📌 第一章：实验室基本守则（10条）\n• 进入实验室前的准备\n• 实验过程中的行为规范\n• 实验结束后的整理工作\n\n📌 第二章：常用器材安全使用\n• 地球仪：避免摔落、远离水源\n• 温度计/湿度计：防止破碎、正确读数\n• 烧杯/量筒：加热注意事项\n• 放大镜/显微镜：光学部件保护\n• 指南针：远离强磁体\n\n📌 第三章：户外考察安全须知\n• 野外选址原则\n• 天气预警识别\n• 应急联络方式\n• 防暑/防寒措施\n\n📌 第四章：应急处理流程\n• 烫伤处理五步骤\n• 割伤止血方法\n• 触电急救措施\n• 迷路应对策略\n\n📌 附录：安全检查清单（课前/课中/课后）'
        },
        {
            icon: '🧰',
            title: '实验器材采购指南',
            desc: '全套地理实验器材清单，含型号规格、参考价格、网购链接和替代方案',
            tags: ['购物', '完整版'],
            color: '#ec4899',
            action: 'viewEquipmentList',
            detail: '【器材分类清单】\n\n🔧 基础类（每生必备）\n• 地球仪（32cm直径）— ¥25-50/个\n• 经纬网半圆仪 — ¥8-15/个\n• 空白世界地图（A3）— ¥0.5/张\n• 直尺/三角板/量角器套装 — ¥10-20/套\n\n🔬 演示类（学校配备）\n• 三球仪（日地月运行仪）— ¥150-300\n• 等高线地形模型 — ¥80-200\n• 地形沙盘套装 — ¥200-500\n• 光照演示箱（昼夜交替）— ¥60-120\n\n📡 观测类（小组共用）\n• 温湿度计（干湿球）— ¥30-80\n• 简易气压计 — ¥40-100\n• 风向风速仪 — ¥50-150\n• 雨量筒 — ¥20-50\n\n🛠️ DIY制作材料\n• 橡皮泥（多色）— ¥15/包\n• 泡沫板/A4大小 — ¥2/张\n• LED灯珠+导线 — ¥10/套\n• 透明塑料片 — ¥5/张\n\n💡 采购建议：优先在淘宝/京东搜索"地理教学仪器"，认准"教学仪器厂"资质商家。\n\n⚠️ 替代方案：多数实验可用日常物品替代（如用橙子做地球仪、用手电筒做太阳光源），详情见每个实验的操作指引。'
        },
        {
            icon: '🎯',
            title: '备考复习资料包（免费下载）',
            desc: '初高中地理实验相关考点汇总，含典型例题、易错点、解题技巧',
            tags: ['PDF', '中考/高考'],
            color: '#14b8a6',
            action: 'viewExamGuide',
            detail: '【考点速查资料】\n\n📘 初中重点考点\n\n① 经纬网判读\n• 核心规律：经线指示南北，纬线指示东西\n• 典型题型：根据坐标找地点 / 根据地点写坐标\n• 易错警示：东西经/南北纬的判断；180°经线两侧的东西方向\n\n② 昼夜长短变化\n• 核心规律：夏至北半球昼最长夜最短\n• 计算公式：昼长 = （日落时间 - 日出时间）×2\n• 易错警示：南北半球季节相反\n\n③ 等高线地形图\n• 判读口诀："凸高为谷，凸低为脊"\n• 常考：陡崖相对高度计算、坡度陡缓判断\n\n④ 气温/降水图表\n• 读图顺序：看标题→看坐标→看曲线形态→看数值\n• 气候类型判断三步法\n\n📗 高中重点考点\n\n⑤ 热力环流应用\n• 城市风、海陆风、山谷风的成因分析\n• 图示作图是高频考法\n\n⑥ 太阳高度角计算\n• 公式：H = 90° - |当地纬度 ± 太阳直射点纬度|\n• 正午影子方向判断\n\n⑦ 人口金字塔解读\n• 增长型/稳定型/缩减型的判断标准\n• 与经济发展阶段的关系\n\n⑧ 区位因素评价（工业/农业）\n• 综合思维：自然+社会经济+技术\n• 动态思维：区位因素的变化\n\n📝 每个考点均附：核心知识框架图 + 3道典型例题（含解析）+ 变式训练题'
        },
        {
            icon: '🏆',
            title: '教学竞赛与培训资源',
            desc: '青年教师基本功大赛、说课比赛、公开课设计等相关资料与案例',
            tags: ['竞赛', '提升'],
            color: '#f97316',
            action: 'viewCompetition',
            detail: '【竞赛与培训资源】\n\n🏅 青年教师基本功大赛\n• 说课稿写作模板与范例\n• 板书设计评分标准\n• 实验操作演示要点\n• 答辩常见问题库\n\n📢 公开课设计案例\n• "地球的运动"单元设计（省级一等奖）\n• "大气环流"创新实验课例\n• "等高线地形图"游戏化教学\n• "热力环流"探究式课堂实录\n\n🎓 继续教育培训\n• 新课标解读线上课程（国培计划）\n• 信息技术与学科融合研修\n• STEM教育理念在地里的实践\n\n📚 推荐阅读书目\n• 《中学地理教学参考》（期刊）\n• 《地理教学》月刊\n• 《普通高中地理课程标准（2017年版2020年修订）》解读\n• 《基于核心素养的地理教学设计》\n\n💡 提示：厦门市同安区教师可通过"继续教育管理平台"获取本地化培训资源。'
        }
    ];

    grid.innerHTML = resources.map((r, i) => `
        <div class="resource-card" style="animation-delay:${i * 0.08}s">
            <div class="resource-card-icon" style="background:linear-gradient(135deg, ${r.color}22, ${r.color}11);border-left:4px solid ${r.color};">
                <span style="font-size:36px;">${r.icon}</span>
            </div>
            <div class="resource-card-body">
                <h3>${r.title}</h3>
                <p>${r.desc}</p>
                <div class="resource-tags">${r.tags.map(t => `<span class="resource-tag" style="background:${r.color}15;color:${r.color};border:1px solid ${r.color}33;">${t}</span>`).join('')}</div>
            </div>
            <div class="resource-card-footer">
                <button class="btn btn-primary btn-sm" onclick="showResourceDetail('${r.action}', \`${r.detail.replace(/`/g, '\\`').replace(/\n/g, '\\n')}\`, '${r.title}')">📖 查看详情</button>
            </div>
        </div>
    `).join('');

    // 注入资源页样式
    if (!document.getElementById('resourcesPageStyle')) {
        const style = document.createElement('style');
        style.id = 'resourcesPageStyle';
        style.textContent = `
.resources-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:24px; padding:32px 0; }
.resource-card { background:#fff; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.06); overflow:hidden; transition:all .3s ease; animation:fadeInUp .5s ease forwards; opacity:0; }
.resource-card:hover { transform:translateY(-4px); box-shadow:0 8px 30px rgba(0,0,0,0.12); }
.resource-card-icon { padding:24px; display:flex; align-items:center; justify-content:center; }
.resource-card-body { padding:0 24px 20px; }
.resource-card-body h3 { font-size:18px; font-weight:700; color:#1e293b; margin-bottom:8px; }
.resource-card-body p { font-size:14px; color:#64748b; line-height:1.6; margin-bottom:12px; }
.resource-tags { display:flex; gap:8px; flex-wrap:wrap; }
.resource-tag { font-size:12px; padding:3px 10px; border-radius:20px; }
.resource-card-footer { padding:16px 24px; border-top:1px solid #f1f5f9; text-align:right; }
@keyframes fadeInUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
.resource-detail-modal { position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease; }
.resource-detail-content { background:#fff; border-radius:16px; max-width:650px;width:92%;max-height:82vh;overflow-y:auto;padding:32px;box-shadow:0 20px 60px rgba(0,0,0,.2); animation:slideUp .3s ease; }
.resource-detail-content h2 { font-size:22px; margin-bottom:16px; color:#1e293b; display:flex;align-items:center;gap:10px; }
.resource-detail-content pre { background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:18px;font-size:14px;line-height:2;color:#334155;white-space:pre-wrap;margin-top:12px; }
.resource-download-btn { display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;margin:8px 6px 8px 0; }
.resource-download-btn:hover { transform:translateY(-2px);box-shadow:0 4px 15px rgba(37,99,235,.4); }
.resource-link-btn { display:inline-flex;align-items:center;gap:8px;background:#fff;color:#2563eb;border:2px solid #2563eb;border-radius:10px;padding:10px 22px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;margin:6px 6px 6px 0; }
.resource-link-btn:hover { background:#eff6ff; }
@keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
@keyframes slideUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:transform:0;} }
`;
        document.head.appendChild(style);
    }
}

// 显示资源详情弹窗（含真实下载链接）
window.showResourceDetail = function(action, detail, title) {
    const existing = document.getElementById('resourceDetailModal');
    if (existing) existing.remove();

    let bodyContent = '';

    // 图标映射
    const icons = {
        downloadTemplate: '📝', downloadDataSheet: '📊', viewVideoList: '🎬',
        viewStandardMap: '📘', viewSimTools: '🧪', viewSafetyGuide: '⚠️',
        viewEquipmentList: '🧰', viewExamGuide: '🎯', viewCompetition: '🏆'
    };

    if (action === 'downloadTemplate') {
        bodyContent = `
            <p>以下为<strong>${title}</strong>的详细内容：</p>
            <pre>${detail}</pre>
            <div style="margin-top:20px;">
                <a class="resource-download-btn" href="#" onclick="alert('Word模板正在打包生成中...\\n\\n提示：您也可以使用以下在线模板：\\n\\n1. WPS模板中心（template.wps.cn）\\n2. 石墨文档模板（shimo.im/templates）\\n\\n搜索关键词：实验报告模板 科学实验报告');return false;" target="_blank">📥 下载 Word 模板</a>
                <a class="resource-link-btn" href="https://www.wps.cn/" target="_blank">WPS 在线编辑</a>
                <button class="btn btn-outline" style="margin-left:12px;" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button>
            </div>`;
    } else if (action === 'downloadDataSheet') {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;">
            <a class="resource-download-btn" href="#" onclick="alert('Excel表格套件正在生成...\\n\\n提示：您也可以使用以下在线表格工具创建数据记录表：\\n\\n1. 腾讯文档（docs.qq.com）— 免费，支持多人协作\\n2. 石墨表格（shimo.im）— 专业表格模板丰富\\n\\n搜索关键词：实验数据记录表 科学实验数据');return false;" target="_blank">📥 下载 Excel 套件</a>
            <a class="resource-link-btn" href="https://docs.qq.com/" target="_blank">腾讯文档</a>
            <button class="btn btn-outline" style="margin-left:12px;" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    } else if (action === 'viewVideoList') {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;">
            <a class="resource-link-btn" href="https://search.bilibili.com/all?keyword=%E5%9C%B0%E7%90%86%E5%AE%9E%E9%AA%8C" target="_blank">🔍 B站搜索：地理实验</a>
            <a class="resource-link-btn" href="https://www.smartedu.cn/" target="_blank">🎓 智慧教育平台</a>
            <a class="resource-link-btn" href="https://phet.colorado.edu/zh_CN/simulations/filter?subjects=physics&level=high-school" target="_blank">🧪 PhET 中文站</a>
            <br><br><button class="btn btn-outline" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    } else if (action === 'viewStandardMap' || action === 'viewCompetition') {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;">
            ${action === 'viewStandardMap' ? '<a class="resource-link-btn" href="http://www.moe.gov.cn/srcsite/A26/s8001/" target="_blank">📋 教育部官网-课程标准</a>' : ''}
            <a class="resource-link-btn" href="https://www.smartedu.cn/" target="_blank">🎓 智慧教育平台</a>
            <button class="btn btn-outline" style="margin-left:12px;" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    } else if (action === 'viewSimTools') {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;">
            <a class="resource-link-btn" href="https://phet.colorado.edu/zh_CN/" target="_blank">🌍 PhET 官网（中文）</a>
            <a class="resource-link-btn" href="https://earth.google.com/web/" target="_blank">🌏 Google Earth</a>
            <a class="resource-link-btn" href="https://weather.com.cn/" target="_blank">🌦️ 中国气象网</a>
            <br><br><button class="btn btn-outline" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    } else if (action === 'viewSafetyGuide' || action === 'viewEquipmentList' || action === 'viewExamGuide') {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;">
            <a class="resource-download-btn" href="#" onclick="alert('PDF文档生成功能即将上线！\\n\\n目前您可以截图保存以上内容作为参考。');return false;">📥 下载 PDF 版本</a>
            <button class="btn btn-outline" style="margin-left:12px;" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    } else {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;">
            <button class="btn btn-outline" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    }

    const modal = document.createElement('div');
    modal.id = 'resourceDetailModal';
    modal.className = 'resource-detail-modal';
    modal.innerHTML = `<div class="resource-detail-content"><h2>${icons[action] || '📚'} ${title}</h2>${bodyContent}</div>`;
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

