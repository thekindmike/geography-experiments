const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 需要混淆的 JS 文件
const filesToObfuscate = [
    'js/app.js',
    'js/experiments-data.js',
    'js/simulators-controlled.js',
    'js/simulators-j004-j008.js',
    'js/simulators-s001-s002.js',
    'js/simulators-s003-s008.js'
];

// 混淆配置（平衡保护强度和性能）
const obfuscationOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 4000,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 5,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.75,
    stringArrayEncoding: ['rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 5,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 5,
    stringArrayWrappersType: 'function',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
};

// 创建输出目录
const outputDir = 'js/obfuscated';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('开始混淆代码...\n');

filesToObfuscate.forEach(file => {
    if (!fs.existsSync(file)) {
        console.log(`⚠️  文件不存在: ${file}`);
        return;
    }

    const code = fs.readFileSync(file, 'utf8');
    const fileName = path.basename(file);
    const outputPath = path.join(outputDir, fileName);

    console.log(`🔄 正在混淆: ${fileName}`);

    try {
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
        fs.writeFileSync(outputPath, obfuscatedCode.getObfuscatedCode());
        const originalSize = (code.length / 1024).toFixed(2);
        const obfuscatedSize = (fs.readFileSync(outputPath, 'utf8').length / 1024).toFixed(2);
        console.log(`✅ 完成: ${fileName} (${originalSize}KB → ${obfuscatedSize}KB)\n`);
    } catch (err) {
        console.log(`❌ 混淆失败: ${fileName}`);
        console.log(`   错误: ${err.message}\n`);
    }
});

console.log('混淆完成！混淆后的文件在 js/obfuscated/ 目录');
console.log('请修改 index.html 引用这些混淆后的文件。');
