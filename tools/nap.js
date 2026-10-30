// Nạp toàn bộ dữ liệu bài học (giống như trình duyệt nạp các file script) để các công cụ dùng.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const FILES = ['data.js', 'bai-lop1.js', 'bai-lop2.js', 'tri-tue.js', 'thu-thach.js'];
const src = FILES.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
module.exports = new Function(src + '\nfinalizeLessons(); return { vkey, allVoiceTexts, LESSONS, PH, SUBJECTS };')();
module.exports.FILES = FILES;
