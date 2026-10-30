// Tạo lại sw.js (UTF-8) với danh sách giọng đọc trong giong/ và số phiên bản lấy từ APP_VER trong app.js.
// Chạy sau mỗi lần sửa app: node tools/tao-sw.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const ver = /APP_VER = (\d+)/.exec(fs.readFileSync(path.join(root, 'app.js'), 'utf8'))[1];
const voices = fs.readdirSync(path.join(root, 'giong')).filter(f => f.endsWith('.mp3')).sort();
const fonts = fs.readdirSync(path.join(root, 'font')).filter(f => f.endsWith('.woff2')).sort();
const src = `// Giúp ứng dụng cài được và mở được khi không có mạng.
// Bước cài chỉ tải phần lõi (nhẹ, vài trăm KB) để điện thoại cho cài ngay;
// giọng đọc được tải dần phía sau, file nào lỗi thì bỏ qua và tải lại lần sau.
const CORE = 'be-vui-hoc-v${ver}';
const VOICE = 'be-vui-hoc-giong';   // tên file giọng đọc không đổi theo phiên bản nên giữ lại qua các lần cập nhật
const FILES = ['./', 'index.html', 'data.js', 'bai-lop1.js', 'bai-lop2.js', 'tri-tue.js', 'thu-thach.js', 'app.js', 'nhac.js', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable.png',
  ${fonts.map(f => `'font/${f}'`).join(', ')}];
const VOICES = [
${voices.map(f => `  '${f.slice(0, -4)}'`).join(',\n')},
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CORE && k !== VOICE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Tải dần giọng đọc còn thiếu, mỗi lần 6 file; xoá file không còn dùng.
// Trang gửi tin "voices" khi đã mở xong (không chạy trong bước kích hoạt, vì lúc đó trang phải chờ).
async function cacheVoices() {
  const c = await caches.open(VOICE), want = new Set(VOICES.map(v => new URL('giong/' + v + '.mp3', self.registration.scope).href));
  const have = new Set((await c.keys()).map(r => r.url));
  for (const u of have) if (!want.has(u)) await c.delete(u);
  const todo = [...want].filter(u => !have.has(u));
  for (let i = 0; i < todo.length; i += 6) {
    await Promise.all(todo.slice(i, i + 6).map(u => fetch(u).then(r => r.status === 200 && c.put(u, r)).catch(() => {})));
  }
}
self.addEventListener('message', e => {
  if (e.data === 'voices') e.waitUntil(cacheVoices());
  if (e.data === 'count') e.waitUntil(caches.open(VOICE).then(c => c.keys()).then(k => e.source.postMessage({ voices: k.length, total: VOICES.length })));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  // Giọng đọc: lấy bản đã lưu trước (nhanh, không cần mạng), chưa có thì tải rồi lưu lại.
  // Chỉ lưu bản đầy đủ (mã 200): trình phát âm thanh hay tải từng đoạn (mã 206), loại này không lưu được.
  if (url.pathname.includes('/giong/')) {
    e.respondWith(caches.open(VOICE).then(c => c.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
      if (r.status === 200) c.put(req, r.clone()).catch(() => {});
      return r;
    }))));
    return;
  }
  // Phần còn lại: ưu tiên bản mới trên mạng, mất mạng thì dùng bản đã lưu.
  e.respondWith(fetch(req).then(r => {
    if (r.status === 200) { const copy = r.clone(); caches.open(CORE).then(c => c.put(req, copy)).catch(() => {}); }
    return r;
  }).catch(() => caches.match(req, { ignoreSearch: true })));
});
`;
fs.writeFileSync(path.join(root, 'sw.js'), src, 'utf8');
console.log(voices.length + ' giọng đọc, phiên bản ' + ver);
