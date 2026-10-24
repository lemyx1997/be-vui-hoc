// Tạo lại sw.js (UTF-8) với danh sách giọng đọc trong giong/ và số phiên bản lấy từ APP_VER trong app.js.
// Chạy sau mỗi lần sửa app: node tools/tao-sw.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const ver = /APP_VER = (\d+)/.exec(fs.readFileSync(path.join(root, 'app.js'), 'utf8'))[1];
const voices = fs.readdirSync(path.join(root, 'giong')).filter(f => f.endsWith('.mp3')).sort();
const fonts = fs.readdirSync(path.join(root, 'font')).filter(f => f.endsWith('.woff2')).sort();
const src = `// Giúp ứng dụng mở được khi không có mạng: lưu sẵn toàn bộ app, phông chữ và giọng đọc ngay lần đầu.
const CORE = 'be-vui-hoc-v${ver}';
const FILES = ['./', 'index.html', 'data.js', 'bai-lop1.js', 'bai-lop2.js', 'tri-tue.js', 'app.js', 'nhac.js', 'manifest.json', 'icon-192.png', 'icon-512.png',
  ${fonts.map(f => `'font/${f}'`).join(', ')},
${voices.map(f => `  'giong/${f}'`).join(',\n')},
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CORE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Ưu tiên bản mới trên mạng, mất mạng thì dùng bản đã lưu.
  // Chỉ lưu bản đầy đủ (mã 200): trình phát âm thanh hay tải từng đoạn (mã 206), loại này không lưu được.
  e.respondWith(fetch(req).then(r => {
    if (r.status === 200) { const copy = r.clone(); caches.open(CORE).then(c => c.put(req, copy)).catch(() => {}); }
    return r;
  }).catch(() => caches.match(req, { ignoreSearch: true })));
});
`;
fs.writeFileSync(path.join(root, 'sw.js'), src, 'utf8');
console.log(voices.length + ' giọng đọc, phiên bản ' + ver);
