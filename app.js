'use strict';
// Bé Vui Học – phần điều khiển: hồ sơ bé, nhiệm vụ mỗi ngày, các trò chơi, khu vườn, khu phụ huynh.
const APP_VER = 3;
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const today = () => ymd(new Date());
const dayAdd = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return ymd(d); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = a => a[Math.random() * a.length | 0];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ───── Dữ liệu lưu trên máy (localStorage) ─────
const KEY = 'bvh';
let DB = load();
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.kids) return d; } catch (e) {}
  return { v: 1, kids: [], cur: null, set: { limit: 15, music: true, slow: false } };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {} }
const kid = () => DB.kids.find(k => k.id === DB.cur);
function touch(k) { k.upd = Date.now(); save(); }

finalizeLessons();
const LESSON = {}, QUESTION = {};
for (const st in LESSONS) for (const sub in LESSONS[st]) for (const L of LESSONS[st][sub]) { LESSON[L.id] = L; L.qs.forEach(q => { QUESTION[q.id] = q; }); }
const subjOf = id => SUBJECTS.find(s => s.id === id);
const lessonsOf = (k, sub) => (LESSONS[k.stage] || LESSONS[1])[sub] || [];
const unlocked = (k, L) => L.idx === 0 || !!k.done[lessonsOf(k, L.sub)[L.idx - 1].id];
const totalStars = k => Object.values(k.done).reduce((a, b) => a + b, 0) + Object.values(k.tt || {}).reduce((a, z) => a + z.s, 0);
// Đảo Trí Tuệ: cấp độ (lv 1–3), số lượt đã chơi (n), số sao kiếm được (s) của từng khu
const zoneOf = id => ZONES.find(Z => Z.id === id);
const ttOf = (k, id) => (k.tt || (k.tt = {}))[id] || (k.tt[id] = { lv: 1, n: 0, s: 0 });
const LV_ICON = ['🌱', '🌿', '🌳'];
function zoneToday() { const oz = ZONES.filter(Z => Z.open); return oz[Math.floor(Date.now() / 864e5) % oz.length].id; }
const secsToday = k => k.days[today()] || 0;
function nextLesson(k, sub) {
  const ls = lessonsOf(k, sub);
  const nd = ls.find(L => !k.done[L.id]);
  if (nd) return nd;
  // Học hết rồi thì ôn bài ít sao nhất
  return ls.slice().sort((a, b) => k.done[a.id] - k.done[b.id])[0];
}

// ───── Âm thanh ─────
// Dùng MỘT máy phát cho cả app (điện thoại hay chặn máy phát mới tạo).
// say() nhận một câu hoặc nhiều câu, trả về lời hứa: xong khi đọc hết hoặc bị câu khác chen ngang.
const voice = new Audio(); voice.preload = 'auto';
let vq = [], voiceDone = null, vtok = 0, sayP = Promise.resolve();
function say(s) {
  vq = (Array.isArray(s) ? s : [s]).filter(Boolean); voice.pause(); vtok++;
  if (voiceDone) { const d = voiceDone; voiceDone = null; d(); }
  const tok = vtok;
  return sayP = new Promise(res => { voiceDone = res; playNext(tok); });
}
function hush() { vq = []; voice.pause(); vtok++; if (voiceDone) { const d = voiceDone; voiceDone = null; d(); } duck(false); }
function playNext(tok) {
  if (tok !== vtok) return;
  const s = vq.shift();
  if (!s) { duck(false); const d = voiceDone; voiceDone = null; if (d) d(); return; }
  duck(true);
  const next = () => playNext(tok);
  voice.onended = next; voice.onerror = next;
  voice.src = 'giong/' + vkey(s) + '.mp3'; voice.muted = false;
  voice.preservesPitch = true; voice.defaultPlaybackRate = voice.playbackRate = DB.set.slow ? .82 : 1;
  voice.play().catch(e => { if (e.name !== 'AbortError') next(); });
}
// Lần chạm đầu: "mở khoá" máy phát để các câu sau không bị điện thoại chặn
addEventListener('pointerdown', function unlock() {
  removeEventListener('pointerdown', unlock);
  if (!voice.src) { voice.src = 'giong/' + vkey(PH.praise[1]) + '.mp3'; voice.muted = true; const d = () => { voice.pause(); voice.muted = false; }; voice.play().then(d, d); }
});
function duck(on) { if (window.NhacNen && DB.set.music && musicOn) NhacNen.setVolume(on ? .1 : .3); }
function beep(ok) {
  try {
    const c = NhacNen.getCtx(), t = c.currentTime;
    (ok ? [660, 880, 1320] : [240, 190]).forEach((f, i) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = f; o.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(.12, t + i * .09); g.gain.exponentialRampToValueAtTime(.001, t + i * .09 + .25); o.start(t + i * .09); o.stop(t + i * .09 + .3);
    });
  } catch (e) {}
}
let musicOn = false;
function startMusic() { if (DB.set.music && !musicOn && window.NhacNen) { NhacNen.start('sangtao'); NhacNen.setVolume(.3); musicOn = true; } }
function toggleMusic() {
  DB.set.music = !DB.set.music; save();
  if (DB.set.music) startMusic(); else if (window.NhacNen) { NhacNen.stop(); musicOn = false; }
  $('hmMusic').style.opacity = DB.set.music ? 1 : .4;
}
addEventListener('pointerdown', startMusic);

// ───── Chuyển màn hình ─────
let cur = '';
function show(id) {
  document.querySelectorAll('.scr').forEach(s => s.classList.toggle('on', s.id === id));
  cur = id; $(id).scrollTop = 0;
}
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { hush(); b.dataset.go === 'home' ? goHome() : goWho(); });
function overlay(html, acts) {
  $('ovBox').innerHTML = html + '<div class="acts"></div>';
  const box = $('ovBox').querySelector('.acts');
  acts.forEach(a => { const b = el('button', 'btn ' + (a.cls || ''), a.t); b.onclick = () => { $('ov').classList.remove('on'); a.fn && a.fn(); }; box.appendChild(b); });
  $('ov').classList.add('on');
}
function shake(e) { e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake'); }

// ───── Chọn bé ─────
function goWho() {
  const box = $('kids'); box.innerHTML = '';
  DB.kids.forEach(k => {
    const b = el('button', 'card kid', `<div class="av">${k.av}</div><div class="nm">${esc(k.name)}</div><div class="st">⭐ ${totalStars(k)} · ${STAGES[k.stage - 1].sub}</div>`);
    b.onclick = () => { DB.cur = k.id; save(); goHome(true); };
    box.appendChild(b);
  });
  if (DB.kids.length < 4) {
    const b = el('button', 'card kid add', '<div class="av">➕</div><div class="nm">Thêm bé</div><div class="st">Bố mẹ tạo giúp bé</div>');
    b.onclick = goNew; box.appendChild(b);
  }
  show('who');
  if (DB.kids.length) say(PH.who);
}
$('toParent').onclick = () => gate(goParent);

let nk = {};
function goNew() {
  nk = { av: AVATARS.find(a => !DB.kids.some(k => k.av === a)) || AVATARS[0], stage: 1 };
  $('nkName').value = '';
  const avs = $('nkAv'); avs.innerHTML = '';
  AVATARS.forEach(a => { const b = el('button', a === nk.av ? 'sel' : '', a); b.onclick = () => { nk.av = a; avs.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); }; avs.appendChild(b); });
  stageChips($('nkStage'), nk.stage, s => { nk.stage = s; });
  show('newkid');
}
function stageChips(box, sel, onPick) {
  box.innerHTML = '';
  STAGES.forEach(s => {
    const b = el('button', s.id === sel ? 'sel' : '', `${s.name}: ${s.sub}<small>${s.open ? 'Đã có bài học' : 'Sắp có'}</small>`);
    b.disabled = !s.open;
    b.onclick = () => { onPick(s.id); box.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); };
    box.appendChild(b);
  });
}
$('nkSave').onclick = () => {
  const name = $('nkName').value.trim();
  if (!name) { shake($('nkName')); $('nkName').focus(); return; }
  const k = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, av: nk.av, stage: nk.stage,
    done: {}, wrong: {}, days: {}, streak: { n: 0, last: '' }, badges: [], off: [], mission: null, upd: Date.now() };
  DB.kids.push(k); DB.cur = k.id; save(); goHome(true);
};

// ───── Trang chủ của bé + nhiệm vụ hôm nay ─────
function ensureMission(k) {
  const tton = !k.off.includes('tt');
  if (k.mission && k.mission.date === today()) {
    // Nhiệm vụ đã tạo hôm nay từ trước khi có Đảo Trí Tuệ: thêm một lượt chơi đảo
    if (tton && !k.mission.items.some(it => it.k === 't')) { k.mission.items.push({ k: 't', id: zoneToday() }); k.mission.done.push(false); touch(k); }
    return;
  }
  const subs = SUBJECTS.map(s => s.id).filter(s => !k.off.includes(s));
  const rot = Math.floor(Date.now() / 864e5) % Math.max(subs.length, 1);
  const order = subs.slice(rot).concat(subs.slice(0, rot)).slice(0, tton ? 2 : 3);
  const items = order.map(s => ({ k: 'l', id: nextLesson(k, s).id }));
  if (tton) items.push({ k: 't', id: zoneToday() });
  if (Object.keys(k.wrong).length >= 2) items.push({ k: 'r' });
  k.mission = { date: today(), items, done: items.map(() => false) };
  touch(k);
}
function goHome(greet) {
  const k = kid(); if (!k) return goWho();
  ensureMission(k);
  $('hmAv').textContent = k.av; $('hmName').textContent = k.name;
  $('mStage').textContent = STAGES[k.stage - 1].sub;
  $('hmStars').textContent = '⭐ ' + totalStars(k);
  $('hmStreak').textContent = '🔥 ' + (k.streak.last === today() || k.streak.last === dayAdd(today(), -1) ? k.streak.n : 0);
  $('hmMusic').style.opacity = DB.set.music ? 1 : .4;
  const ml = $('mList'); ml.innerHTML = '';
  k.mission.items.forEach((it, i) => {
    let html;
    if (it.k === 'r') html = '<span class="e">🔁</span><span class="t">Ôn tập<small>Câu bé chưa nhớ</small></span>';
    else if (it.k === 't') { const Z = zoneOf(it.id); html = `<span class="e">${Z.icon}</span><span class="t">${Z.name}<small>🏝️ Đảo Trí Tuệ</small></span>`; }
    else { const L = LESSON[it.id], S = subjOf(L.sub); html = `<span class="e">${L.icon}</span><span class="t">${esc(L.title)}<small>${S.icon} ${S.name}</small></span>`; }
    const b = el('button', 'mi' + (k.mission.done[i] ? ' done' : ''), html);
    b.onclick = () => startItem(i);
    ml.appendChild(b);
  });
  const allDone = k.mission.done.every(Boolean);
  $('mGo').innerHTML = allDone ? '🎉 Xong nhiệm vụ!' : '▶ Bắt đầu';
  $('mGo').className = 'btn' + (allDone ? ' green' : '');
  $('mTime').style.width = Math.min(100, secsToday(k) / (DB.set.limit * 60) * 100) + '%';
  const sb = $('subs'); sb.innerHTML = '';
  SUBJECTS.forEach(S => {
    const ls = lessonsOf(k, S.id), d = ls.filter(L => k.done[L.id]).length, off = k.off.includes(S.id);
    const b = el('button', 'card subj' + (off ? ' off' : ''), `<div class="e">${S.icon}</div><div class="n">${S.name}</div><div class="p">${d}/${ls.length} bài</div>`);
    b.style.setProperty('--c', S.color);
    b.onclick = () => { if (off) return shake(b); say(S.say); goMap(S.id); };
    sb.appendChild(b);
  });
  const ttoff = k.off.includes('tt');
  const tb = el('button', 'card subj' + (ttoff ? ' off' : ''), '<div class="e">🏝️</div><div class="n">Đảo Trí Tuệ</div><div class="p">Rèn tư duy</div>');
  tb.style.setProperty('--c', '#2ec4b6'); tb.onclick = () => (ttoff ? shake(tb) : goIsland()); sb.appendChild(tb);
  const g = el('button', 'card subj', `<div class="e">${petOf(totalStars(k)).e}</div><div class="n">Khu vườn</div><div class="p">Bạn nhỏ của bé</div>`);
  g.style.setProperty('--c', '#ffcf4a'); g.onclick = goGarden; sb.appendChild(g);
  show('home');
  if (greet) say(allDone ? PH.missionDone : [PH.hello, PH.mission]);
}
$('hmSwitch').onclick = () => { hush(); goWho(); };
$('hmMusic').onclick = toggleMusic;
$('mGo').onclick = () => {
  const k = kid(), i = k.mission.done.indexOf(false);
  if (i < 0) { say(PH.missionDone); return; }
  startItem(i);
};
function startItem(i) {
  const it = kid().mission.items[i];
  if (it.k === 'r') startReview(i); else if (it.k === 't') startZone(it.id, i); else startLesson(LESSON[it.id], i);
}

// Giới hạn thời gian mỗi ngày: hết giờ thì nhắc nhẹ, bố mẹ có thể cho chơi thêm
function timeOk(go) {
  const k = kid();
  if (secsToday(k) < DB.set.limit * 60 || k.extra === today()) return true;
  say(PH.timeUp);
  overlay(`<div class="e">🌙</div><p>${PH.timeUp}</p>`, [
    { t: '🏠 Về nhà', fn: goHome },
    { t: '👨‍👩‍👧 Bố mẹ cho chơi thêm', cls: 'ghost small', fn: () => gate(() => { k.extra = today(); touch(k); go(); }) },
  ]);
  return false;
}

// ───── Bản đồ bài học của một môn ─────
let mapSub = '';
function goMap(sub) {
  mapSub = sub;
  const k = kid(), S = subjOf(sub), box = $('path');
  $('mapTitle').textContent = S.icon + ' ' + S.name;
  box.innerHTML = '';
  const nxt = lessonsOf(k, sub).find(L => !k.done[L.id]);
  lessonsOf(k, sub).forEach(L => {
    const st = k.done[L.id] || 0, open = unlocked(k, L);
    const b = el('button', 'card lsn' + (open ? '' : ' lock') + (L === nxt ? ' next' : ''),
      `<span class="bub">${open ? L.icon : '🔒'}</span><span><div class="t">${L.idx + 1}. ${esc(L.title)}</div><div class="s">${'⭐'.repeat(st)}${'☆'.repeat(3 - st)}</div></span>`);
    b.style.setProperty('--c', S.color + '55');
    b.onclick = () => { if (!open) { shake(b); say(PH.locked); return; } startLesson(L, -1); };
    box.appendChild(b);
  });
  show('map');
}

// ───── Đảo Trí Tuệ: 7 khu, mỗi khu là một vùng kỹ năng ─────
function goIsland() {
  const k = kid(), box = $('zones'); box.innerHTML = '';
  ZONES.forEach(Z => {
    const z = ttOf(k, Z.id);
    const b = el('button', 'card subj zone' + (Z.open ? '' : ' lock'),
      `<div class="e">${Z.icon}</div><div class="n">${Z.name}</div><div class="p">${Z.open ? LV_ICON[z.lv - 1] + ' Cấp ' + z.lv : '🔒 Sắp mở'}</div>`);
    b.style.setProperty('--c', Z.color);
    b.onclick = () => { if (!Z.open) { shake(b); say(TTPH.soon); return; } startZone(Z.id, -1); };
    box.appendChild(b);
  });
  show('island'); say(TTPH.island);
}
function startZone(zid, mi) {
  if (!timeOk(() => startZone(zid, mi))) return;
  const Z = zoneOf(zid);
  P = { zone: zid, qs: Z.make(ttOf(kid(), zid).lv), i: 0, mist: 0, mi, ok: [] };
  show('play'); renderQ(true); say([Z.say].concat(P.q.say));
}

// ───── Màn chơi ─────
let P = null;
function startLesson(L, mi) {
  if (!timeOk(() => startLesson(L, mi))) return;
  P = { L, qs: L.qs, i: 0, mist: 0, mi, ok: [] };
  show('play'); renderQ(true); say([L.say].concat(P.q.say));
}
function startReview(mi) {
  const k = kid();
  if (!timeOk(() => startReview(mi))) return;
  const ids = Object.keys(k.wrong).filter(id => QUESTION[id]).sort((a, b) => k.wrong[b] - k.wrong[a]).slice(0, 6);
  if (!ids.length) { k.mission.done[mi] = true; touch(k); return goHome(); }
  P = { review: true, qs: ids.map(id => QUESTION[id]), i: 0, mist: 0, mi, ok: [] };
  show('play'); renderQ(true); say([PH.review].concat(P.q.say));
}
$('pExit').onclick = () => { hush(); P = null; goHome(); };
$('pRe').onclick = () => { if (P && P.q) say(P.q.say); };

function textOf(s) { return (Array.isArray(s) ? s : [s]).map(x => x.startsWith('en:') ? '🔊' : x).join(' '); }
function graphemes(s) { return window.Intl && Intl.Segmenter ? [...new Intl.Segmenter().segment(s)].length : Array.from(s).length; }
const SHAPE_COLORS = ['#ff8a5c', '#4fb6ff', '#7ccf5a', '#b58cff', '#ffc531', '#ff7bc0'];
function shapeSvg(name) {
  const c = rnd(SHAPE_COLORS);
  const sh = { tron: `<circle cx="50" cy="50" r="42"/>`, vuong: `<rect x="12" y="12" width="76" height="76" rx="4"/>`,
    tamgiac: `<polygon points="50,10 92,88 8,88"/>`, chunhat: `<rect x="4" y="26" width="92" height="50" rx="4"/>` }[name];
  return `<svg viewBox="0 0 100 100" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width="3">${sh}</svg>`;
}
// Vẽ một đáp án/thẻ: hình khối, ô màu, hình + chữ, chữ cái, số, hình đơn
function itemHtml(o) {
  if (typeof o === 'object') return `<span class="e">${o.e}</span><span class="t">${esc(o.t)}</span>`;
  if (o.startsWith('shape:')) return shapeSvg(o.slice(6));
  if (o.startsWith('color:')) return `<span class="blob" style="background:${o.slice(6)}"></span>`;
  if (o.startsWith('clock:')) { const [hh, mm] = o.slice(6).split(':'); return clockSvg(+hh, +mm); }
  // "tf:scaleX(-1)|🦒" là hình bị lật/xoay
  if (o.startsWith('tf:')) { const [t, e] = o.slice(3).split('|'); return `<span class="tfe" style="transform:${t}">${e}</span>`; }
  return esc(o);
}
function itemKind(o) {
  if (typeof o === 'object') return 'wide';
  if (/^(shape|color|clock|tf):/.test(o)) return '';
  if (/^\d+$/.test(o)) return 'num';
  if (/^\p{L}{1,4}$/u.test(o.normalize('NFC'))) return 'letter';
  if (/[\p{L}\d]/u.test(o)) return 'text';
  return graphemes(o) > 1 ? 'group' : '';
}
// Mặt đồng hồ kim: kim giờ ngắn, kim phút dài
function clockSvg(h, m) {
  const hand = (deg, len, w, c) => { const a = (deg - 90) * Math.PI / 180; return `<line x1="50" y1="50" x2="${50 + len * Math.cos(a)}" y2="${50 + len * Math.sin(a)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
  let nums = '';
  for (let i = 1; i <= 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; nums += `<text x="${50 + 36 * Math.cos(a)}" y="${50 + 36 * Math.sin(a)}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="#3b2f2a">${i}</text>`; }
  return `<svg viewBox="0 0 100 100" class="clock"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#ffb547" stroke-width="5"/>${nums}${hand((h % 12 + m / 60) * 30, 22, 5, '#3b2f2a')}${hand(m * 6, 32, 3, '#ff6b6b')}<circle cx="50" cy="50" r="3.5" fill="#3b2f2a"/></svg>`;
}

function renderQ(silent) {
  const q = P.q = P.qs[P.i];
  P.tries = 0; P.qMist = 0; P.lock = false;
  const dots = $('pDots'); dots.innerHTML = '';
  P.qs.forEach((_, i) => dots.appendChild(el('i', i < P.i ? 'ok' : i === P.i ? 'cur' : '')));
  const st = $('pStage'); st.innerHTML = '';
  // Câu xếp chữ / điền chữ: chỉ hiện phần hướng dẫn, phần sau dấu ":" là đáp án nên chỉ đọc to
  st.appendChild(el('div', 'prompt', esc(q.cap || (q.t === 'order' ? textOf(q.say).split(':')[0] : textOf(q.say)))));
  if (q.show) st.appendChild(showEl(q.show, q));
  ({ pick: renderPick, match: renderMatch, trace: renderTrace, order: renderOrder, memo: renderMemo, gone: renderGone, simon: renderSimon, draw: renderDraw })[q.t](st, q);
  if (!silent) say(q.say);
}
function showEl(s, q) {
  const w = el('div', 'show');
  if (s.count) w.appendChild(el('div', 'card count', Array(s.count[1]).fill(`<span>${s.count[0]}</span>`).join('')));
  else if (s.big) w.appendChild(el('div', 'card big', esc(s.big)));
  else if (s.pic) w.appendChild(el('div', 'card pic', `<div class="e">${s.pic[0]}</div>${s.pic[1] ? `<div class="w">${esc(s.pic[1])}</div>` : ''}`));
  else if (s.scene) w.appendChild(el('div', 'card scene', s.scene));
  else if (s.ear) { const b = el('button', 'ear', '🔊'); b.onclick = () => say(q.say); w.appendChild(b); }
  else if (s.eq) w.appendChild(el('div', 'card eq', esc(s.eq)));
  else if (s.word) w.appendChild(el('div', 'card wordc', esc(s.word)));
  else if (s.read) w.appendChild(el('div', 'card readc', esc(s.read)));
  else if (s.clock) w.appendChild(el('div', 'card clockc', clockSvg(s.clock[0], s.clock[1])));
  else if (s.seq) w.appendChild(el('div', 'card seq', s.seq.map(x => x === '?' ? '<span class="qm">?</span>' : `<span>${x}</span>`).join('')));
  else if (s.sum) w.appendChild(el('div', 'card sum', `<span>${s.sum[0].repeat(s.sum[1])}</span><b>➕</b><span>${s.sum[0].repeat(s.sum[2])}</span>`));
  else if (s.mix) w.appendChild(el('div', 'card sum', `<span class="blob" style="background:${s.mix[0]}"></span><b>➕</b><span class="blob" style="background:${s.mix[1]}"></span><b>=</b><span class="qm">?</span>`));
  else if (s.shadow) w.appendChild(el('div', 'card pic', `<div class="e shadow">${s.shadow}</div>`));
  else if (s.pos) {
    // Lưới 3×3: vật mốc ở giữa, hình cần hỏi ở trên/dưới/trái/phải
    const g = el('div', 'card posg');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) g.appendChild(el('span', '', r === 1 && c === 1 ? s.pos[1] : r === s.pos[2][0] && c === s.pos[2][1] ? s.pos[0] : ''));
    w.appendChild(g);
  }
  return w;
}

// ───── Gõ nhạc theo bạn Cú: xem dãy nốt sáng lên rồi gõ lại đúng thứ tự ─────
const PADS = [['#ff6b6b', 523], ['#4fb6ff', 659], ['#7ccf5a', 784], ['#ffc531', 1047]];
function tone(f) {
  try {
    const c = NhacNen.getCtx(), t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(c.destination);
    g.gain.setValueAtTime(.22, t); g.gain.exponentialRampToValueAtTime(.001, t + .45); o.start(t); o.stop(t + .5);
  } catch (e) {}
}
function renderSimon(st, q) {
  const box = el('div', 'simon'), me = P, still = () => P === me && P.q === q;
  const pads = PADS.map(([c], i) => { const b = el('button', 'pad'); b.style.background = c; b.onclick = () => tap(i); box.appendChild(b); return b; });
  st.appendChild(box);
  let pos = 0, busy = true;
  const flash = async i => { pads[i].classList.add('lit'); tone(PADS[i][1]); await sleep(450); pads[i].classList.remove('lit'); await sleep(200); };
  async function demo(first) {
    busy = true; pos = 0;
    if (first) { await sleep(60); await sayP; } else await say(TTPH.simonAgain);
    await sleep(300);
    for (const i of q.seq) { if (!still()) return; await flash(i); }
    if (!still()) return;
    busy = false; say(TTPH.simonGo);
  }
  async function tap(i) {
    if (busy || P.lock) return;
    pads[i].classList.add('lit'); tone(PADS[i][1]); setTimeout(() => pads[i].classList.remove('lit'), 250);
    if (i !== q.seq[pos]) {
      busy = true; shake(box); P.mist++; P.qMist++; beep(false);
      await sleep(700); if (still()) demo(false);
      return;
    }
    if (++pos === q.seq.length) { busy = true; await sleep(300); right(); }
  }
  demo(true);
}

// ───── Vẽ tự do: bút màu + hình dán theo chủ đề, không có đúng sai ─────
const DRAW_COLORS = ['#ef3b3b', '#ff8c1a', '#f5d21c', '#3fbf4a', '#3b7bef', '#9b4dde', '#8b5a2b', '#ffffff'];
function renderDraw(st, q) {
  const S = Math.max(240, Math.min(innerWidth - 40, innerHeight - 340, 560)), dpr = Math.min(devicePixelRatio || 1, 2), W = Math.round(S * dpr);
  const box = el('div', 'card drawbox'), cv = document.createElement('canvas'), ix = cv.getContext('2d');
  cv.width = cv.height = W; cv.style.cssText = `width:${S}px;height:${S}px;background:${q.bg}`;
  const tools = el('div', 'dtools');
  let tool = DRAW_COLORS[0], acts = 0, last = null;
  const pick = b => tools.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b));
  DRAW_COLORS.forEach((c, i) => { const b = el('button', 'dcol' + (i ? '' : ' sel')); b.style.background = c; b.onclick = () => { tool = c; pick(b); }; tools.appendChild(b); });
  q.stk.forEach(e => { const b = el('button', 'dstk', e); b.onclick = () => { tool = { e }; pick(b); }; tools.appendChild(b); });
  const bar = el('div', 'bar'), clr = el('button', 'btn ghost small', '🧽 Xoá'), ok = el('button', 'btn green small', '✔ Xong');
  ok.disabled = true; bar.append(clr, ok);
  box.append(cv, tools, bar); st.appendChild(box);
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * W]; };
  // Vẽ/dán đủ 3 lần thì mới bấm Xong được
  const did = () => { if (++acts >= 3) ok.disabled = false; };
  ix.lineCap = ix.lineJoin = 'round'; ix.lineWidth = W * .025;
  cv.onpointerdown = e => {
    const p = pos(e);
    if (typeof tool === 'object') {
      ix.font = Math.round(W * .12) + 'px sans-serif'; ix.textAlign = 'center'; ix.textBaseline = 'middle';
      ix.fillText(tool.e, p[0], p[1]); tone(880); did(); return;
    }
    cv.setPointerCapture(e.pointerId); last = p;
    ix.fillStyle = ix.strokeStyle = tool; ix.beginPath(); ix.arc(p[0], p[1], ix.lineWidth / 2, 0, 7); ix.fill();
  };
  cv.onpointermove = e => { if (!last) return; const p = pos(e); ix.beginPath(); ix.moveTo(last[0], last[1]); ix.lineTo(p[0], p[1]); ix.stroke(); last = p; };
  cv.onpointerup = cv.onpointercancel = () => { if (last) { last = null; did(); } };
  clr.onclick = () => ix.clearRect(0, 0, W, W);
  ok.onclick = async () => {
    if (P.lock) return;
    P.lock = true; beep(true);
    const me = P; await say(TTPH.drawDone); await sleep(250);
    if (P === me) next();
  };
}

// ───── Lật thẻ tìm cặp ─────
function renderMemo(st, q) {
  const box = el('div', 'memo c' + (q.cards.length >= 8 ? 4 : 3)), seen = new Set();
  let open = [], left = q.cards.length / 2;
  q.cards.forEach((e, i) => {
    const c = el('button', 'card mcard', `<span>${e}</span>`);
    c.onclick = async () => {
      if (P.lock || open.length === 2 || c.classList.contains('up')) return;
      c.classList.add('up'); open.push({ c, e, i });
      if (open.length < 2) return;
      const [a, b] = open;
      if (a.e === b.e) {
        a.c.classList.add('ok'); b.c.classList.add('ok'); open = []; beep(true);
        if (--left) return;
        P.lock = true; const me = P;
        await say(TTPH.memoDone); await sleep(250);
        if (P === me) next();
        return;
      }
      // Chỉ tính là nhầm khi bé đã từng thấy hình cặp của thẻ đầu mà vẫn lật sai
      if (q.cards.some((x, j) => x === a.e && j !== a.i && seen.has(j))) { P.mist++; P.qMist++; }
      seen.add(a.i); seen.add(b.i); beep(false);
      setTimeout(() => { a.c.classList.remove('up'); b.c.classList.remove('up'); open = []; }, 900);
    };
    box.appendChild(c);
  });
  st.appendChild(box);
}

// ───── Nhớ hình: xem vài giây, các hình úp lại, một hình biến mất ─────
async function renderGone(st, q) {
  const row = el('div', 'card seq'), me = P;
  q.items.forEach(e => row.appendChild(el('span', '', e)));
  st.appendChild(row);
  const still = () => P === me && P.q === q;
  await sleep(60); await sayP; await sleep(q.ms);
  if (!still()) return;
  [...row.children].forEach(s => { s.textContent = ''; s.className = 'back'; });
  await sleep(900);
  if (!still()) return;
  [...row.children].forEach((s, i) => { s.className = i === q.miss ? 'qm' : ''; s.textContent = i === q.miss ? '?' : q.items[i]; });
  q.say = q.ask; st.querySelector('.prompt').textContent = q.ask;
  renderPick(st, q); say(q.ask);
}

// ───── Xếp thẻ theo thứ tự: chạm thẻ để đưa lên hàng trên, chạm ô trên để trả lại ─────
function renderOrder(st, q) {
  const n = q.tiles.length, key = t => JSON.stringify(t);
  let pool = q.tiles.map(t => ({ t })).concat((q.extra || []).map(t => ({ t })));
  for (let k = 0; k < 10; k++) { pool = shuffle(pool); if (pool.slice(0, n).map(x => key(x.t)).join() !== q.tiles.map(key).join()) break; }
  const wide = typeof q.tiles[0] === 'object';
  const slots = el('div', 'slots' + (wide ? ' col' : '')), bank = el('div', 'bank' + (wide ? ' col' : ''));
  const filled = Array(n).fill(null);
  const sEls = filled.map((_, i) => { const s = el('button', 'slot' + (wide ? ' wide' : '')); s.onclick = () => back(i); slots.appendChild(s); return s; });
  pool.forEach(x => {
    x.b = el('button', 'card tile ' + (wide ? 'wide' : itemKind(x.t)), itemHtml(x.t));
    x.b.onclick = () => put(x); bank.appendChild(x.b);
  });
  st.append(slots, bank);
  function draw() { sEls.forEach((s, i) => { s.innerHTML = filled[i] ? itemHtml(filled[i].t) : ''; s.classList.toggle('full', !!filled[i]); }); }
  function put(x) {
    if (P.lock) return;
    const i = filled.indexOf(null); if (i < 0) return;
    filled[i] = x; x.b.classList.add('used'); pool.forEach(y => y.b.classList.remove('glow')); draw();
    if (filled.indexOf(null) < 0) check();
  }
  function back(i) { if (P.lock || !filled[i]) return; filled[i].b.classList.remove('used'); filled[i] = null; draw(); }
  function check() {
    if (filled.every((x, i) => key(x.t) === key(q.tiles[i]))) { sEls.forEach(s => s.classList.add('ok')); right(); return; }
    shake(slots); wrong(); P.lock = true;
    setTimeout(() => {
      P.lock = false;
      filled.forEach((x, i) => { if (x) { x.b.classList.remove('used'); filled[i] = null; } }); draw();
      // Gợi ý: thẻ cần đặt đầu tiên sáng lên
      if (P.tries >= 2) { const g = pool.find(y => key(y.t) === key(q.tiles[0])); g.b.classList.add('glow'); say(PH.hint); }
    }, 700);
  }
}

function renderPick(st, q) {
  const box = el('div', 'opts');
  shuffle(q.o.map((o, i) => ({ o, ok: i === 0 }))).forEach(x => {
    const b = el('button', 'card opt ' + itemKind(x.o), itemHtml(x.o));
    b.dataset.ok = x.ok ? 1 : '';
    b.onclick = () => {
      if (P.lock) return;
      if (x.ok) { b.classList.add('right'); right(); }
      else {
        shake(b); wrong();
        const rest = [...box.children].filter(c => !c.dataset.ok && !c.classList.contains('dim'));
        if (P.tries === 2 && rest.length > 1) rest.find(c => c !== b).classList.add('dim');
        else if (P.tries >= 2) { box.querySelector('[data-ok="1"]').classList.add('glow'); say(PH.hint); }
      }
    };
    box.appendChild(b);
  });
  st.appendChild(box);
}

// Trả lời đúng: khen rồi sang câu sau. Câu đã sai thì ghi lại để ôn.
async function right() {
  P.lock = true; beep(true);
  const k = kid(), q = P.q;
  // Câu tạo ngẫu nhiên (Đảo Trí Tuệ) không có mã nên không đưa vào phần ôn tập
  if (q.id) {
    if (P.qMist) k.wrong[q.id] = (k.wrong[q.id] || 0) + 1;
    else if (k.wrong[q.id]) { if (--k.wrong[q.id] <= 0) delete k.wrong[q.id]; }
  }
  touch(k);
  const me = P;
  await say(rnd(PH.praise)); await sleep(250);
  if (P === me) next();
}
function wrong() {
  P.mist++; P.qMist++; P.tries++; beep(false);
  if (P.tries === 1) say(rnd(PH.retry));
  else if (P.tries === 2) say(rnd(PH.retry));
}
function next() { P.i++; if (P.i >= P.qs.length) finish(); else renderQ(); }

// ───── Ghép cặp: kéo thẻ bên trái thả vào thẻ bên phải (hoặc chạm trái rồi chạm phải) ─────
function renderMatch(st, q) {
  const box = el('div', 'match'), L = el('div', 'mcol'), R = el('div', 'mcol');
  box.append(L, R); st.appendChild(box);
  let sel = null, matched = 0;
  const targets = [];
  const cls = o => 'card mc ' + (itemKind(o) === 'group' ? 'grp' : itemKind(o));
  shuffle(q.p.map((p, i) => ({ p, i }))).forEach(({ p, i }) => {
    const c = el('div', cls(p[0]) + ' l', itemHtml(p[0])); c.dataset.i = i; L.appendChild(c);
    let sx, sy, moved = false;
    c.onpointerdown = e => {
      if (P.lock || c.classList.contains('ok')) return;
      e.preventDefault(); c.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY; moved = false;
      if (sel) sel.classList.remove('sel');
      sel = c; c.classList.add('sel'); say(p[2]);
    };
    c.onpointermove = e => {
      if (sel !== c || sx == null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 10) moved = true;
      if (!moved) return;
      c.classList.add('drag'); c.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
      targets.forEach(t => t.classList.toggle('hov', hit(t, e)));
    };
    c.onpointerup = c.onpointercancel = e => {
      if (sx == null) return;
      sx = null; c.classList.remove('drag'); c.style.transform = '';
      targets.forEach(t => t.classList.remove('hov'));
      if (moved) { const t = targets.find(t => hit(t, e)); if (t) tryPair(c, t); }
    };
  });
  shuffle(q.p.map((p, i) => ({ p, i }))).forEach(({ p, i }) => {
    const t = el('div', cls(p[1]) + ' r', itemHtml(p[1])); t.dataset.i = i; R.appendChild(t); targets.push(t);
    t.onclick = () => { if (sel && !P.lock) tryPair(sel, t); else say(p[3]); };
  });
  const hit = (t, e) => { const r = t.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom && !t.classList.contains('ok'); };
  async function tryPair(c, t) {
    c.classList.remove('sel'); sel = null;
    if (c.dataset.i === t.dataset.i) {
      c.classList.add('ok'); t.classList.add('ok'); beep(true); matched++;
      const me = P;
      if (matched === q.p.length) { P.lock = true; await say([q.p[+t.dataset.i][3], PH.matchDone]); if (P === me) finishMatch(q); }
      else say(q.p[+t.dataset.i][3]);
    } else {
      shake(t); wrong();
      if (P.tries >= 2) { const g = targets.find(x => x.dataset.i === c.dataset.i); g.classList.add('glow'); setTimeout(() => g.classList.remove('glow'), 2500); }
    }
  }
}
function finishMatch(q) {
  const k = kid();
  if (P.qMist) k.wrong[q.id] = (k.wrong[q.id] || 0) + 1;
  else if (k.wrong[q.id]) { if (--k.wrong[q.id] <= 0) delete k.wrong[q.id]; }
  touch(k); next();
}

// ───── Tô chữ/số theo nét mờ ─────
async function renderTrace(st, q) {
  const S = Math.max(220, Math.min(innerWidth - 60, innerHeight - 300, 440)), dpr = Math.min(devicePixelRatio || 1, 2);
  const W = Math.round(S * dpr);
  let font = `700 100px Andika, sans-serif`;
  const box = el('div', 'card trace');
  const holder = el('div'); holder.style.cssText = `position:relative;width:${S}px;height:${S}px`;
  const mk = () => { const c = document.createElement('canvas'); c.width = c.height = W; c.style.cssText = `width:${S}px;height:${S}px;position:absolute;inset:0`; return c; };
  const guide = mk(), ink = mk();
  holder.append(guide, ink);
  const meter = el('div', 'meter', '<i></i>');
  const bar = el('div', 'bar'); const clr = el('button', 'btn ghost small', '🧽 Tô lại'); bar.appendChild(clr);
  box.append(holder, meter, bar); st.appendChild(box);
  try { await document.fonts.load(font, q.ch); } catch (e) {}
  // Phóng chữ cho vừa khung (chữ thường như "o" thấp hơn nhiều so với số)
  const mx = guide.getContext('2d'); mx.font = font;
  const m0 = mx.measureText(q.ch);
  const fpx = 100 * Math.min(W * .72 / (m0.actualBoundingBoxAscent + m0.actualBoundingBoxDescent), W * .72 / (m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight));
  font = `700 ${Math.round(fpx)}px Andika, sans-serif`;
  // Mặt nạ: vùng nét chữ (để tính phần đã tô) và vùng nới rộng (để biết tô lem ra ngoài)
  const mask = document.createElement('canvas'), wide = document.createElement('canvas');
  mask.width = mask.height = wide.width = wide.height = W;
  const place = c => {
    const x = c.getContext('2d'); x.font = font; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    const m = x.measureText(q.ch);
    return { x, X: W / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2, y: W / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 };
  };
  let p = place(mask); p.x.fillText(q.ch, p.X, p.y);
  p = place(wide); p.x.lineWidth = fpx * .12; p.x.lineJoin = 'round'; p.x.fillText(q.ch, p.X, p.y); p.x.strokeText(q.ch, p.X, p.y);
  p = place(guide); p.x.fillStyle = '#f6e9d6'; p.x.fillText(q.ch, p.X, p.y);
  p.x.setLineDash([W * .02, W * .02]); p.x.lineWidth = W * .008; p.x.strokeStyle = '#c9ac85'; p.x.strokeText(q.ch, p.X, p.y);
  const step = Math.max(2, Math.round(3 * dpr));
  const md = mask.getContext('2d').getImageData(0, 0, W, W).data, wd = wide.getContext('2d').getImageData(0, 0, W, W).data;
  const pts = [];
  for (let y = 0; y < W; y += step) for (let x = 0; x < W; x += step) { const i = (y * W + x) * 4 + 3; pts.push([i, md[i] > 128, wd[i] > 128]); }
  const total = pts.filter(t => t[1]).length || 1;
  const ix = ink.getContext('2d');
  ix.lineCap = ix.lineJoin = 'round'; ix.lineWidth = Math.max(W * .07, fpx * .13); ix.strokeStyle = subjOf(P.L ? P.L.sub : 'toan').color;
  let last = null, done = false;
  const pos = e => { const r = ink.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * W]; };
  ink.onpointerdown = e => { if (done) return; ink.setPointerCapture(e.pointerId); last = pos(e); ix.beginPath(); ix.arc(last[0], last[1], ix.lineWidth / 2, 0, 7); ix.fillStyle = ix.strokeStyle; ix.fill(); };
  ink.onpointermove = e => { if (!last || done) return; const p2 = pos(e); ix.beginPath(); ix.moveTo(last[0], last[1]); ix.lineTo(p2[0], p2[1]); ix.stroke(); last = p2; };
  ink.onpointerup = ink.onpointercancel = () => { if (!last) return; last = null; check(); };
  clr.onclick = () => { ix.clearRect(0, 0, W, W); meter.firstChild.style.width = 0; };
  function check() {
    const d = ix.getImageData(0, 0, W, W).data;
    let cov = 0, inkN = 0, out = 0;
    for (const [i, inM, inW] of pts) { if (d[i] > 0) { inkN++; if (!inW) out++; if (inM) cov++; } }
    const f = cov / total;
    meter.firstChild.style.width = Math.min(100, f / .75 * 100) + '%';
    if (f < .75) return;
    if (out / inkN > .4) { say(PH.traceNeat); clr.onclick(); shake(box); P.qMist++; P.mist++; return; }
    done = true; beep(true); P.lock = true;
    const me = P;
    say(PH.traceDone).then(() => sleep(250)).then(() => { if (P === me) next(); });
  }
}

// ───── Hoàn thành bài ─────
const PETS = [{ at: 0, e: '🥚', n: 'Quả trứng' }, { at: 5, e: '🐣', n: 'Gà con mới nở' }, { at: 15, e: '🐥', n: 'Gà con' }, { at: 30, e: '🐔', n: 'Gà mái' }, { at: 60, e: '🦚', n: 'Chim công' }];
const petOf = s => PETS.filter(p => s >= p.at).pop();
async function finish() {
  const k = kid(), me = P;
  const before = totalStars(k);
  let stars = P.mist === 0 ? 3 : P.mist <= 2 ? 2 : 1;
  if (P.L) k.done[P.L.id] = Math.max(k.done[P.L.id] || 0, stars);
  // Đảo Trí Tuệ: làm đúng hết thì lên cấp, sai nhiều thì xuống cấp cho vừa sức bé
  const Z = P.zone && zoneOf(P.zone);
  let lvUp = false;
  if (Z) {
    const z = ttOf(k, Z.id); z.n++; z.s += stars;
    if (P.mist === 0 && z.lv < 3) { z.lv++; lvUp = true; } else if (P.mist >= 4 && z.lv > 1) z.lv--;
  }
  // Đánh dấu nhiệm vụ đã xong
  if (k.mission && k.mission.date === today()) k.mission.items.forEach((it, i) => {
    if (i === P.mi || (P.L && it.k === 'l' && it.id === P.L.id) || (Z && it.k === 't' && it.id === Z.id)) k.mission.done[i] = true;
  });
  // Chuỗi ngày học liên tục + huy hiệu
  const t = today(), newBadges = [];
  if (k.streak.last !== t) {
    k.streak.n = k.streak.last === dayAdd(t, -1) ? k.streak.n + 1 : 1; k.streak.last = t;
    [3, 7, 30].forEach(n => { if (k.streak.n >= n && !k.badges.includes(n)) { k.badges.push(n); newBadges.push(n); } });
  }
  touch(k);
  const grew = petOf(totalStars(k)) !== petOf(before);
  const nextI = k.mission.done.indexOf(false), allDone = nextI < 0, timeUp = secsToday(k) >= DB.set.limit * 60 && k.extra !== t;
  const fb = $('finBox');
  fb.innerHTML = `<div class="stars">${[1, 2, 3].map(i => `<span class="${i <= stars ? '' : 'no'}" style="animation-delay:${i * .25}s">⭐</span>`).join('')}</div>
    <h1>${P.review ? 'Ôn tập xong!' : Z ? Z.icon + ' ' + Z.name : esc(P.L.title)}</h1>
    ${lvUp ? `<p class="sub">${LV_ICON[ttOf(k, Z.id).lv - 1]} Bé lên Cấp ${ttOf(k, Z.id).lv}!</p>` : ''}
    ${grew ? `<div class="big-e">${petOf(totalStars(k)).e}</div><p class="sub">${PH.grow}</p>` : ''}
    ${newBadges.map(n => `<p class="sub">🏅 Huy hiệu ${n} ngày liền!</p>`).join('')}
    <div style="display:flex;flex-direction:column;gap:14px;align-items:center" id="finActs"></div>`;
  const acts = $('finActs');
  if (!allDone && !timeUp) { const b = el('button', 'btn green', '▶ Tiếp nhiệm vụ'); b.onclick = () => startItem(nextI); acts.appendChild(b); }
  if (Z && !timeUp) { const b = el('button', 'btn', '🔁 Chơi lượt nữa'); b.onclick = () => startZone(Z.id, -1); acts.appendChild(b); }
  const hb = el('button', 'btn ghost', '🏠 Về nhà'); hb.onclick = () => { hush(); goHome(); }; acts.appendChild(hb);
  show('fin'); beep(true);
  const lines = [P.review ? PH.praise[2] : PH.stars[stars - 1]];
  if (lvUp) lines.push(TTPH.lvUp);
  if (grew) lines.push(PH.grow);
  newBadges.forEach(n => lines.push(PH['badge' + n]));
  if (allDone) lines.push(PH.missionDone);
  P = null;
  await say(lines);
  if (timeUp && cur === 'fin') timeOk(goHome);
}

// ───── Khu vườn ─────
function goGarden() {
  const k = kid(), s = totalStars(k), pet = petOf(s), nx = PETS.find(p => p.at > s);
  const fl = ['🌷', '🌻', '🌼', '🌸', '🌹', '🍀'];
  $('gdBox').innerHTML = `<div class="pet">${pet.e}</div><h2>${pet.n}</h2>
    <p class="sub">${nx ? `Còn ${nx.at - s} ⭐ nữa để bạn nhỏ lớn lên` : 'Bạn nhỏ đã lớn hết cỡ rồi!'}</p>
    <div class="flowers">${Array.from({ length: Math.min(s, 60) }, (_, i) => fl[i % fl.length]).join('')}${s > 60 ? ' +' + (s - 60) : ''}${s ? '' : '<span class="sub">Học bài để trồng hoa nhé!</span>'}</div>
    <h2>🏅 Huy hiệu chăm học</h2>
    <div class="badges">${[3, 7, 30].map(n => `<div class="badge ${k.badges.includes(n) ? '' : 'no'}"><b>${n === 3 ? '🥉' : n === 7 ? '🥈' : '🥇'}</b>${n} ngày liền</div>`).join('')}</div>`;
  show('garden'); say(PH.garden);
}

// ───── Cổng phụ huynh: câu hỏi người lớn mới trả lời được ─────
function gate(onOk) {
  const a = 6 + (Math.random() * 4 | 0), b = 3 + (Math.random() * 7 | 0);
  let ans = '';
  overlay(`<div class="e" style="font-size:50px">🔐</div><p>Dành cho bố mẹ: ${a} × ${b} = ?</p><div class="gate" style="margin:0;padding:0"><div class="ans" id="gAns">&nbsp;</div><div class="pad" id="gPad"></div></div>`,
    [{ t: 'Đóng', cls: 'ghost small' }]);
  const pd = $('gPad');
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✔'].forEach(n => {
    const btn = el('button', '', n);
    btn.onclick = () => {
      if (n === '⌫') ans = ans.slice(0, -1);
      else if (n === '✔') { if (+ans === a * b) { $('ov').classList.remove('on'); onOk(); return; } shake($('gAns')); ans = ''; }
      else if (ans.length < 3) ans += n;
      $('gAns').innerHTML = ans || '&nbsp;';
    };
    pd.appendChild(btn);
  });
}

// ───── Khu phụ huynh ─────
let paKid = null, paFrom = 'who';
$('paBack').onclick = () => (paFrom === 'home' && kid() ? goHome() : goWho());
function goParent() {
  paFrom = cur === 'home' ? 'home' : 'who';
  if (!DB.kids.some(k => k.id === paKid)) paKid = DB.cur && kid() ? DB.cur : (DB.kids[0] || {}).id;
  renderParent(); show('parent');
}
function renderParent() {
  const box = $('paBox'); box.innerHTML = '';
  const k = DB.kids.find(x => x.id === paKid);
  if (k) {
    const tabs = el('div', 'kidtabs');
    DB.kids.forEach(x => { const b = el('button', x.id === paKid ? 'sel' : '', x.av + ' ' + esc(x.name)); b.onclick = () => { paKid = x.id; renderParent(); }; tabs.appendChild(b); });
    box.appendChild(tabs);
    // Thời gian học 7 ngày gần nhất
    const days = Array.from({ length: 7 }, (_, i) => dayAdd(today(), i - 6));
    const mins = days.map(d => Math.round((k.days[d] || 0) / 60)), mx = Math.max(DB.set.limit, ...mins);
    const wd = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const s1 = el('div', 'card psec', `<h2>⏱️ Thời gian học 7 ngày qua</h2><div class="bars">${days.map((d, i) => `<div><b>${mins[i]}′</b><i style="height:${mins[i] / mx * 90}px"></i>${wd[new Date(d + 'T12:00').getDay()]}</div>`).join('')}</div>
      <div class="row" style="color:var(--soft)">🔥 Chuỗi ngày học: ${k.streak.n} · ⭐ Tổng sao: ${totalStars(k)}</div>`);
    box.appendChild(s1);
    // Tiến độ từng môn
    const s2 = el('div', 'card psec', '<h2>📈 Tiến độ từng môn</h2>');
    SUBJECTS.forEach(S => {
      const ls = lessonsOf(k, S.id), d = ls.filter(L => k.done[L.id]).length;
      s2.appendChild(el('div', 'row', `<span style="width:150px">${S.icon} ${S.name}</span><span class="prog"><i style="width:${d / ls.length * 100}%;background:${S.color}"></i></span><span>${d}/${ls.length}</span>`));
    });
    // Giỏi / cần luyện
    const good = Object.keys(k.done).filter(id => k.done[id] === 3 && LESSON[id]).map(id => LESSON[id].title);
    const weakMap = {};
    Object.keys(k.wrong).forEach(qid => { const lid = qid.split('-').slice(0, 3).join('-'); if (LESSON[lid]) weakMap[lid] = (weakMap[lid] || 0) + k.wrong[qid]; });
    Object.keys(k.done).forEach(id => { if (k.done[id] === 1 && LESSON[id]) weakMap[id] = weakMap[id] || 1; });
    const weak = Object.keys(weakMap).sort((a, b) => weakMap[b] - weakMap[a]).map(id => LESSON[id].title);
    s2.appendChild(el('div', '', `<h2 style="font-size:20px">💪 Bé đang giỏi</h2>${good.length ? good.map(t => `<span class="tag good">${esc(t)}</span>`).join('') : '<span class="sub">Chưa có bài 3 sao</span>'}
      <h2 style="font-size:20px">🎯 Cần luyện thêm</h2>${weak.length ? weak.map(t => `<span class="tag">${esc(t)}</span>`).join('') : '<span class="sub">Chưa có — bé làm tốt lắm!</span>'}`));
    box.appendChild(s2);
    // Đảo Trí Tuệ: cấp độ từng vùng kỹ năng
    const s5 = el('div', 'card psec', '<h2>🏝️ Đảo Trí Tuệ</h2><p class="sub" style="text-align:left">App tự tăng độ khó khi bé làm đúng hết một lượt, giảm khi bé sai nhiều.</p>');
    ZONES.forEach(Z => {
      const z = ttOf(k, Z.id);
      s5.appendChild(el('div', 'row', `<span style="width:150px">${Z.icon} ${Z.name}</span>` + (Z.open
        ? `<span class="prog"><i style="width:${z.lv / 3 * 100}%;background:${Z.color}"></i></span><span>Cấp ${z.lv}/3 · ${z.n} lượt</span>`
        : '<span style="color:var(--soft)">Sắp mở</span>')));
    });
    box.appendChild(s5);
    // Cài đặt riêng của bé
    const s3 = el('div', 'card psec', `<h2>🧒 Cài đặt cho ${esc(k.name)}</h2><div class="row"><b>Chặng học</b></div>`);
    const chips = el('div', 'chips'); s3.appendChild(chips);
    stageChips(chips, k.stage, s => { k.stage = s; k.mission = null; touch(k); });
    s3.appendChild(el('div', 'row', '<b>Môn học</b> <span class="sub" style="margin:0">(chạm để bật/tắt)</span>'));
    const subRow = el('div', 'row');
    SUBJECTS.forEach(S => {
      const b = el('button', 'btn small ' + (k.off.includes(S.id) ? 'ghost' : 'green'), S.icon + ' ' + S.name);
      b.onclick = () => {
        if (k.off.includes(S.id)) k.off = k.off.filter(x => x !== S.id);
        else if (k.off.filter(x => x !== 'tt').length < SUBJECTS.length - 1) k.off.push(S.id);
        k.mission = null; touch(k); renderParent();
      };
      subRow.appendChild(b);
    });
    const tb = el('button', 'btn small ' + (k.off.includes('tt') ? 'ghost' : 'green'), '🏝️ Đảo Trí Tuệ');
    tb.onclick = () => { k.off = k.off.includes('tt') ? k.off.filter(x => x !== 'tt') : k.off.concat('tt'); k.mission = null; touch(k); renderParent(); };
    subRow.appendChild(tb);
    s3.appendChild(subRow);
    const del = el('button', 'btn ghost small danger', '🗑️ Xoá hồ sơ này');
    del.onclick = () => overlay(`<div class="e">⚠️</div><p>Xoá hồ sơ của ${esc(k.name)}? Toàn bộ sao và tiến độ sẽ mất.</p>`, [
      { t: 'Không xoá', cls: 'green' },
      { t: 'Xoá', cls: 'ghost small danger', fn: () => { DB.kids = DB.kids.filter(x => x !== k); if (DB.cur === k.id) DB.cur = null; save(); paKid = null; paFrom = 'who'; goParent(); } },
    ]);
    const rw = el('div', 'row'); rw.style.marginTop = '18px'; rw.appendChild(del); s3.appendChild(rw);
    box.appendChild(s3);
  } else box.appendChild(el('div', 'card psec', '<p>Chưa có hồ sơ bé nào. Bấm ⬅️ rồi chọn “Thêm bé”.</p>'));
  // Cài đặt chung
  const s4 = el('div', 'card psec', '<h2>⚙️ Cài đặt chung</h2>');
  const seg = (label, opts, val, onSet) => {
    const r = el('div', 'row', `<span class="grow">${label}</span>`), sg = el('div', 'seg');
    opts.forEach(([v, t]) => { const b = el('button', v === val ? 'sel' : '', t); b.onclick = () => { onSet(v); save(); renderParent(); }; sg.appendChild(b); });
    r.appendChild(sg); s4.appendChild(r);
  };
  seg('Thời gian học mỗi ngày', [[10, '10 phút'], [15, '15 phút'], [20, '20 phút']], DB.set.limit, v => DB.set.limit = v);
  seg('Giọng đọc', [[false, 'Bình thường'], [true, 'Chậm']], DB.set.slow, v => DB.set.slow = v);
  seg('Nhạc nền', [[true, 'Bật'], [false, 'Tắt']], DB.set.music, v => { if (v !== DB.set.music) toggleMusic(); });
  s4.appendChild(el('p', 'sub', `Tiến độ đang lưu trên máy này. Bản sau sẽ có đăng nhập để học tiếp trên máy khác.<br>Phiên bản ${APP_VER}`));
  box.appendChild(s4);
}

// ───── Đếm thời gian học (chỉ khi đang chơi và màn hình đang mở) ─────
setInterval(() => {
  if (cur !== 'play' || document.visibilityState !== 'visible') return;
  const k = kid(); if (!k) return;
  const t = today(); k.days[t] = (k.days[t] || 0) + 1;
  if (k.days[t] % 10 === 0) touch(k);
}, 1000);
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { save(); if (window.NhacNen && musicOn) { NhacNen.stop(); musicOn = false; } } });

// ───── Chạy không cần mạng + tự cập nhật bản mới ─────
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && cur !== 'play') location.reload(); });
}

if (kid()) goHome(); else goWho();
