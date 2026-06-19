// fix-types.js — 精确修复 interactiveType（从文件末尾倒序替换，避免偏移问题）
var fs = require('fs');
var path = require('path');

var file = path.join('E:/WorkBuddy/2026-06-20-01-37-08/geography-experiments/js', 'experiments-data.js');
var lines = fs.readFileSync(file, 'utf8').split('\n');

var fixes = {
  'j007': '"measure"',
  'j008': '"quiz"',
  'j009': '"explore"',
  's003': '"measure"',
  's007': '"map"'
};

// 先找到每个 id 所在行，以及其后的 interactiveType 行
var edits = []; // {lineIdx, newLine}

for (var id in fixes) {
  var idLine = -1;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('id: "' + id + '"') !== -1) {
      idLine = i;
      break;
    }
  }
  if (idLine === -1) { console.log('NOT FOUND: ' + id); continue; }

  // 从 idLine 往后找 interactiveType:
  for (var j = idLine + 1; j < lines.length; j++) {
    if (lines[j].indexOf('interactiveType:') !== -1) {
      var indent = lines[j].match(/^\s*/)[0];
      edits.push({ lineIdx: j, newLine: indent + 'interactiveType: ' + fixes[id] + ',' });
      console.log('Will fix ' + id + ' at line ' + (j+1) + ': ' + lines[j].trim() + ' -> ' + fixes[id]);
      break;
    }
  }
}

// 倒序排列，从后往前替换（这样行号不会变化）
edits.sort(function(a, b) { return b.lineIdx - a.lineIdx; });
edits.forEach(function(edit) {
  lines[edit.lineIdx] = edit.newLine;
});

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done! ' + edits.length + ' lines fixed.');
