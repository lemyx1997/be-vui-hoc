// Tạo file giọng đọc mp3 cho mọi câu trong data.js (chỉ tạo câu còn thiếu).
// Chạy: node tools/tao-giong.js
// Giọng lấy từ Google Dịch (tiếng Việt: tl=vi, tiếng Anh: tl=en); câu dài được cắt đoạn rồi nối lại.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const { vkey, allVoiceTexts } = require('./nap.js');
const dir = path.join(root, 'giong');
fs.mkdirSync(dir, { recursive: true });

function chunks(t) {
  if (t.length <= 180) return [t];
  const parts = t.match(/[^.?!,]+[.?!,]*\s*/g), out = [];
  let cur = '';
  for (const p of parts) { if ((cur + p).length > 180 && cur) { out.push(cur.trim()); cur = ''; } cur += p; }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
async function tts(text, lang) {
  const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + lang + '&q=' + encodeURIComponent(text);
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://translate.google.com/' } });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    await new Promise(s => setTimeout(s, 1500 * (i + 1)));
  }
  throw new Error('Không tải được: ' + text);
}

(async () => {
  const texts = allVoiceTexts();
  let made = 0;
  for (const s of texts) {
    const file = path.join(dir, vkey(s) + '.mp3');
    if (fs.existsSync(file)) continue;
    const en = s.startsWith('en:'), t = en ? s.slice(3) : s;
    const bufs = [];
    for (const c of chunks(t)) { bufs.push(await tts(c, en ? 'en' : 'vi')); await new Promise(r => setTimeout(r, 250)); }
    fs.writeFileSync(file, Buffer.concat(bufs));
    made++;
  }
  // Xoá file giọng không còn dùng
  const keep = new Set(texts.map(s => vkey(s) + '.mp3'));
  const old = fs.readdirSync(dir).filter(f => f.endsWith('.mp3') && !keep.has(f));
  old.forEach(f => fs.unlinkSync(path.join(dir, f)));
  console.log('Tổng ' + texts.length + ' câu, mới tạo ' + made + ', xoá ' + old.length);
})();
