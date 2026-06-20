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

// ==================== 教学资源页面 ====================
function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;

    const resources = [
        // === 模板类 ===
        {
            icon: '📝',
            title: '实验报告模板',
            desc: '通用地理实验报告模板，包含实验目的、材料、步骤、现象观察、结论分析等完整结构',
            tags: ['Word', '可编辑'],
            color: '#3b82f6',
            action: 'downloadTemplate',
            detail: '适用于本平台所有18个实验。包含：\n• 实验基本信息区\n• 实验目的与假设\n• 实验步骤记录表\n• 数据/现象记录区\n• 结论与分析框\n• 思考与拓展题\n• 教师评语栏'
        },
        {
            icon: '📊',
            title: '数据记录表格',
            desc: '各实验专用数据记录表（控制变量记录、观测数据、测量结果等）',
            tags: ['Excel', '18套'],
            color: '#10b981',
            action: 'downloadDataSheet',
            detail: '为每个实验量身定制：\n• 经纬网定位：坐标记录表\n• 地球自转：昼夜变化时间记录\n• 等高线绘制：高程点数据表\n• 气温分布：温度对比表\n• 降水分布：降水量统计表\n• 热力环流：气流方向记录\n• 太阳高度角：角度计算表\n• 人口金字塔：人口数据表'
        },
        // === 教学PPT类 ===
        {
            icon: '📽️',
            title: '教学课件合集',
            desc: '初中+高中全部实验的教学PPT，含动画演示、课堂互动环节设计',
            tags: ['PPTX', '18套'],
            color: '#8b5cf6',
            action: 'viewPptList',
            detail: '按课程标准设计的教学课件：\n• 七年级上册：地球与地图（6个实验）\n• 七年级下册：天气与气候（3个实验）\n• 高中必修一：自然地理基础（5个实验）\n• 高中必修二：人文地理（4个实验）\n每套PPT包含：导入情境→知识讲解→互动演示→学生操作→总结归纳→课后作业'
        },
        {
            icon: '🎬',
            title: '微课视频推荐',
            desc: '精选国内外优质地理实验教学视频，涵盖所有实验主题',
            tags: ['视频', '免费'],
            color: '#ef4444',
            action: 'viewVideoList',
            detail: '精选视频资源：\n• 【B站】地理老师李永乐系列\n• 【国家中小学智慧教育平台】同步课程\n• 【TED-Ed】地球科学动画短片\n• 【PhET官方】模拟器使用教程\n• 【中国科普博览】地理实验演示\n每个视频附推荐理由和使用建议'
        },
        // === 安全指南类 ===
        {
            icon: '⚠️',
            title: '实验安全指南',
            desc: '地理实验室安全规范、器材使用注意事项、应急处理流程',
            tags: ['PDF', '必读'],
            color: '#f59e0b',
            action: 'viewSafetyGuide',
            detail: '安全规范内容：\n• 实验室基本守则（10条）\n• 常用器材安全使用（地球仪、温度计、烧杯等）\n• 化学试剂安全（如涉及）\n• 用电安全规范\n• 户外考察安全须知\n• 应急处理流程图（烫伤、割伤、火灾等）\n• 安全检查清单（课前/课中/课后）'
        },
        // === 器材清单类 ===
        {
            icon: '🧰',
            title: '实验器材清单',
            desc: '全套地理实验所需器材目录，含型号规格、采购渠道、替代方案',
            tags: ['Excel', '完整版'],
            color: '#06b6d4',
            action: 'viewEquipmentList',
            detail: '器材分类清单：\n【基础器材】地球仪、地图集、经纬网板、直尺、圆规、量角器\n【演示器材】三球仪（日地月运行仪）、等高线模型、地形沙盘\n【观测器材】温度计、湿度计、气压计、风向标、雨量筒\n【制作材料】橡皮泥、泡沫板、LED灯、导线、电池\n【数字化设备】投影仪、交互白板、平板电脑\n每项标注：建议数量、参考价格、替代方案、维护方法'
        },
        // === 课程标准类 ===
        {
            icon: '📚',
            title: '课程标准对照表',
            desc: '2022版新课标与本平台实验的一一对应关系，便于备课和教学评估',
            tags: ['PDF', '新课标'],
            color: '#ec4899',
            action: 'viewStandardMap',
            detail: '对照内容：\n• 初中地理核心素养：区域认知、综合思维、地理实践力、人地协调观\n• 高中地理必修1：宇宙中的地球、自然环境中的物质运动与能量交换\n• 高中地理必修2：产业布局、交通、环境与发展\n每个实验标注：对应课标条目、考查能力维度、学业质量水平'
        },
        // === 备考复习类 ===
        {
            icon: '🎯',
            title: '考点速查手册',
            desc: '初高中地理实验相关考点的快速复习资料，含典型例题和易错点',
            tags: ['PDF', '中考/高考'],
            color: '#14b8a6',
            action: 'viewExamGuide',
            detail: '考点整理：\n【初中重点】经纬度判读、昼夜长短计算、等高线判读、气温降水图表分析\n【高中重点】热力环流应用、太阳高度角计算、人口金字塔分析、区位因素评价\n每考点包含：核心公式/规律 → 典型例题（含解析）→ 易错警示 → 变式训练'
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
                <button class="btn btn-primary btn-sm" onclick="showResourceDetail('${r.action}', \`${r.detail.replace(/`/g, '\\`').replace(/\n/g, '\\n')}\`, '${r.title}')">查看详情</button>
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
.resource-detail-content { background:#fff; border-radius:16px; max-width:600px;width:90%;max-height:80vh;overflow-y:auto;padding:32px;box-shadow:0 20px 60px rgba(0,0,0,.2); animation:slideUp .3s ease; }
.resource-detail-content h2 { font-size:22px; margin-bottom:16px; color:#1e293b; }
.resource-detail-content pre { background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:14px;line-height:1.8;color:#334155;white-space:pre-wrap;margin-top:12px; }
@keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
@keyframes slideUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
`;
        document.head.appendChild(style);
    }
}

// 显示资源详情弹窗
window.showResourceDetail = function(action, detail, title) {
    // 移除已有弹窗
    const existing = document.getElementById('resourceDetailModal');
    if (existing) existing.remove();

    let bodyContent = '';
    if (action === 'downloadTemplate') {
        bodyContent = `
            <p>以下为<strong>${title}</strong>的详细内容：</p>
            <pre>${detail}</pre>
            <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
                <button class="btn btn-primary" onclick="alert('模板下载功能开发中，请稍后再试。\n\n提示：您可以在"软著申请"目录下找到相关文档模板。')">📥 下载 Word 版</button>
                <button class="btn btn-outline" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button>
            </div>`;
    } else if (action === 'downloadDataSheet') {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;display:flex;gap:12px;"><button class="btn btn-primary" onclick="alert('数据表格下载功能开发中。\\n\\n提示：每个实验的模拟器中都包含内置的数据记录功能，可直接在实验过程中填写。')">📥 下载 Excel 套件</button><button class="btn btn-outline" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    } else if (action === 'viewSafetyGuide') {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;display:flex;gap:12px;"><button class="btn btn-primary" onclick="alert('安全指南下载功能开发中。')">📥 下载 PDF</button><button class="btn btn-outline" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    } else {
        bodyContent = `<p>以下为<strong>${title}</strong>的详细内容：</p><pre>${detail}</pre><div style="margin-top:20px;"><button class="btn btn-outline" onclick="document.getElementById('resourceDetailModal').remove()">关闭</button></div>`;
    }

    const modal = document.createElement('div');
    modal.id = 'resourceDetailModal';
    modal.className = 'resource-detail-modal';
    modal.innerHTML = `<div class="resource-detail-content"><h2>${action === 'downloadTemplate' ? '📝' : action === 'downloadDataSheet' ? '📊' : action === 'viewPptList' ? '📽️' : action === 'viewVideoList' ? '🎬' : action === 'viewSafetyGuide' ? '⚠️' : action === 'viewEquipmentList' ? '🧰' : action === 'viewStandardMap' ? '📚' : '🎯'} ${title}</h2>${bodyContent}</div>`;
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    document.body.appendChild(modal);
};

