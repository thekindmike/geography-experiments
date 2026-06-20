const fs = require('fs');
const path = require('path');

// 配置
const SOURCE_FILES = [
    'js/experiments-data.js',
    'js/app.js',
    'css/style.css',
    'index.html',
    'js/simulators-controlled.js',
    'js/simulators-j004-j008.js',
    'js/simulators-s001-s002.js',
    'js/simulators-s003-s008.js'
];

const OUTPUT_FILE = '软著申请/源代码文档.txt';
const LINES_PER_PAGE = 50;
const PAGES_FRONT = 30;  // 前30页
const PAGES_BACK = 30;    // 后30页
const TOTAL_PAGES = PAGES_FRONT + PAGES_BACK;

// 读取所有源代码
function readAllSourceCode() {
    let allLines = [];
    let fileIndex = 0;

    SOURCE_FILES.forEach(file => {
        if (!fs.existsSync(file)) {
            console.log(`⚠️  文件不存在: ${file}`);
            return;
        }

        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        // 添加文件分隔符
        if (fileIndex > 0) {
            allLines.push('');
            allLines.push('');
        }
        allLines.push(`// ============ 文件: ${file} ============`);
        allLines.push('');
        
        // 添加代码行
        lines.forEach(line => {
            allLines.push(line);
        });

        fileIndex++;
    });

    return allLines;
}

// 生成源代码文档
function generateSourceCodeDoc() {
    console.log('开始生成源代码文档...\n');

    // 读取所有源代码
    const allLines = readAllSourceCode();
    const totalLines = allLines.length;
    console.log(`📊 总代码行数: ${totalLines}`);

    // 计算需要的行数
    const neededLines = TOTAL_PAGES * LINES_PER_PAGE;
    console.log(`📋 需要行数: ${neededLines} (${TOTAL_PAGES}页 × ${LINES_PER_PAGE}行)`);

    // 如果代码行数不足，补充空行
    let sourceLines = [];
    if (totalLines >= neededLines) {
        // 代码充足：取前1500行 + 后1500行
        const frontLines = allLines.slice(0, PAGES_FRONT * LINES_PER_PAGE);
        const backLines = allLines.slice(-PAGES_BACK * LINES_PER_PAGE);
        sourceLines = [...frontLines, ...backLines];
        console.log(`✅ 代码充足，取前${PAGES_FRONT * LINES_PER_PAGE}行 + 后${PAGES_BACK * LINES_PER_PAGE}行`);
    } else {
        // 代码不足：全部代码 + 补充空行
        sourceLines = [...allLines];
        while (sourceLines.length < neededLines) {
            sourceLines.push('');
        }
        console.log(`⚠️  代码不足，已补充空行至${neededLines}行`);
    }

    // 生成文档内容
    let docContent = '';
    docContent += '初高中地理实验教学平台 V1.0\n';
    docContent += '计算机软件著作权登记源代码文档\n';
    docContent += '========================================\n\n';

    // 分页
    for (let page = 1; page <= TOTAL_PAGES; page++) {
        const startLine = (page - 1) * LINES_PER_PAGE;
        const endLine = startLine + LINES_PER_PAGE;
        const pageLines = sourceLines.slice(startLine, endLine);

        // 添加页眉
        docContent += `第 ${page} 页 / 共 ${TOTAL_PAGES} 页\n`;
        docContent += `软件名称：初高中地理实验教学平台  V1.0\n`;
        docContent += '========================================\n';

        // 添加代码行（带行号）
        pageLines.forEach((line, index) => {
            const lineNum = (page - 1) * LINES_PER_PAGE + index + 1;
            docContent += `${lineNum.toString().padStart(4, ' ')}: ${line}\n`;
        });

        // 添加页脚
        docContent += '========================================\n';
        docContent += `第 ${page} 页 / 共 ${TOTAL_PAGES} 页\n\n`;
    }

    // 写入文件
    fs.writeFileSync(OUTPUT_FILE, docContent, 'utf8');
    console.log(`\n✅ 源代码文档已生成: ${OUTPUT_FILE}`);
    console.log(`📄 文档大小: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)}KB`);
}

// 执行
generateSourceCodeDoc();
