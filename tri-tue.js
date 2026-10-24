// Đảo Trí Tuệ – các trò rèn tư duy cho bé 5 tuổi (bám Bộ chuẩn phát triển trẻ 5 tuổi, lĩnh vực nhận thức).
// Câu hỏi tạo ngẫu nhiên theo cấp độ (1 dễ → 3 khó); sau mỗi lượt app tự lên/xuống cấp theo kết quả của bé.
// Câu đọc là câu cố định (không đọc số) nên dùng chung được file giọng thu sẵn.

const TTPH = {
  island: 'Chào mừng bé đến Đảo Trí Tuệ! Bé chọn một khu để chơi nhé.',
  soon: 'Khu này sắp mở, bé chờ nhé!',
  pattern: 'Bé xem quy luật nhé. Hình nào đến tiếp theo?',
  odd: 'Hình nào không cùng nhóm với các bạn?',
  memo: 'Bé lật thẻ, tìm hai hình giống nhau nhé.',
  memoDone: 'Bé tìm hết các cặp rồi!',
  goneLook: 'Bé nhìn kỹ và nhớ các hình nhé.',
  goneAsk: 'Hình nào vừa biến mất?',
  count: 'Bé đếm xem có bao nhiêu?',
  more: 'Nhóm nào có nhiều hơn?',
  less: 'Nhóm nào có ít hơn?',
  bigger: 'Số nào lớn hơn?',
  smaller: 'Số nào bé hơn?',
  biggest: 'Số nào lớn nhất?',
  smallest: 'Số nào bé nhất?',
  sum: 'Gộp hai nhóm lại, có tất cả bao nhiêu?',
  lvUp: 'Bé giỏi quá! Lần sau thử thách sẽ khó hơn một chút nhé!',
  shadow: 'Đây là bóng của hình nào?',
  same: 'Hình nào giống hệt hình mẫu?',
  listen: 'Bé nghe và chạm vào đúng hình nhé.',
  story: 'Bé xếp các tranh theo thứ tự, việc nào xảy ra trước thì xếp trước nhé.',
  simon: 'Bé xem bạn Cú gõ nhạc, rồi gõ lại giống hệt nhé.',
  simonGo: 'Đến lượt bé!',
  simonAgain: 'Bé xem lại nhé!',
  drawDone: 'Bức tranh của bé đẹp quá!',
};

// Nhóm đồ vật rõ ràng để bé phân loại
const TT_CATS = {
  fruit: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉'],
  veg: ['🥕', '🥦', '🌽', '🍆', '🥒', '🥔'],
  farm: ['🐄', '🐖', '🐑', '🐐', '🐎', '🐇'],
  sea: ['🐟', '🐙', '🦀', '🐬', '🐳', '🦑'],
  fly: ['🦋', '🐝', '🦅', '🦜', '🕊️', '🦉'],
  car: ['🚗', '🚌', '🚲', '✈️', '🚀', '⛵'],
  cloth: ['👕', '👗', '🧦', '🧢', '👖', '🧤'],
  school: ['✏️', '📏', '📚', '🎒', '🖍️', '✂️'],
};
const TT_FAR = [['fruit', 'car'], ['farm', 'cloth'], ['sea', 'school'], ['veg', 'car'], ['fly', 'cloth'], ['fruit', 'school']];
const TT_NEAR = [['fruit', 'veg'], ['farm', 'sea'], ['sea', 'fly'], ['cloth', 'school'], ['farm', 'fly']];
const TT_ALL = Object.values(TT_CATS).flat();
// Bộ hình dùng cho dãy quy luật (khác nhau rõ về màu/hình)
const TT_SEQ = [
  ['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'],
  ['🟥', '🟦', '🟨', '🟩', '🟪', '🟧'],
  ['❤️', '💙', '💛', '💚', '💜', '🧡'],
  ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉'],
  ['🐶', '🐱', '🐰', '🐻', '🐸', '🐵'],
  ['☀️', '🌙', '⭐', '☁️', '🌈', '⚡'],
];
const TT_COUNT = ['🍎', '🐟', '🎈', '⭐', '🌸', '🐥', '🚗', '🍓', '🦋', '🧸'];
const TT_PATTERNS = { 1: ['AB'], 2: ['AAB', 'ABB', 'ABC'], 3: ['AABB', 'ABCD', 'ABAC', 'ABCB'] };

const ttTake = (a, n) => shuffle(a).slice(0, n);
const ttInt = (lo, hi) => lo + (Math.random() * (hi - lo + 1) | 0);
// Đáp án số: số đúng + các số gần nó (không ra ngoài khoảng lo..hi)
function ttNear(r, n, lo, hi) {
  const out = [r];
  for (const d of shuffle([1, -1, 2, -2, 3, -3])) { const x = r + d; if (x >= lo && x <= hi && !out.includes(x) && out.length < n) out.push(x); }
  return out.map(String);
}

// ───── Tư duy logic ─────
function qPattern(lv) {
  const pat = rnd(TT_PATTERNS[lv]), letters = [...new Set(pat)], n = lv === 3 ? 4 : 3;
  const pics = ttTake(rnd(TT_SEQ), Math.max(letters.length + 1, n)), map = {};
  letters.forEach((c, i) => { map[c] = pics[i]; });
  const len = pat.length * 2 + (Math.random() * 2 | 0);
  const seq = Array.from({ length: len }, (_, i) => map[pat[i % pat.length]]);
  const ans = map[pat[len % pat.length]];
  return { t: 'pick', say: TTPH.pattern, show: { seq: seq.concat('?') }, o: [ans, ...shuffle(pics.filter(x => x !== ans))].slice(0, n) };
}
function qOdd(lv) {
  const pair = shuffle(rnd(lv === 1 ? TT_FAR : lv === 3 ? TT_NEAR : TT_FAR.concat(TT_NEAR)));
  return { t: 'pick', say: TTPH.odd, o: [rnd(TT_CATS[pair[1]]), ...ttTake(TT_CATS[pair[0]], lv === 3 ? 4 : 3)] };
}

// ───── Trí nhớ ─────
function qMemo(lv) {
  const e = ttTake(TT_ALL, [3, 4, 6][lv - 1]);
  return { t: 'memo', say: TTPH.memo, cards: shuffle(e.concat(e)) };
}
// Nhớ hình rồi đoán hình nào biến mất (đáp án nhiễu là hình chưa từng hiện)
function qGone(lv) {
  const n = lv + 2, k = lv === 3 ? 4 : 3, pics = ttTake(TT_ALL, n + k - 1), miss = Math.random() * n | 0;
  return { t: 'gone', say: TTPH.goneLook, ask: TTPH.goneAsk, items: pics.slice(0, n), miss, o: [pics[miss], ...pics.slice(n)], ms: [4000, 3500, 3000][lv - 1] };
}

// ───── Toán vui ─────
function qCount(lv) {
  const r = lv === 1 ? ttInt(1, 5) : ttInt(4, 10);
  return { t: 'pick', say: TTPH.count, show: { count: [rnd(TT_COUNT), r] }, o: ttNear(r, lv === 3 ? 4 : 3, 1, 10) };
}
function qMore(lv) {
  const e = rnd(TT_COUNT), max = lv === 1 ? 5 : 8;
  let a, b;
  do { a = ttInt(1, max); b = ttInt(1, max); } while (lv === 1 ? Math.abs(a - b) < 2 : (a === b || Math.abs(a - b) > 3));
  const more = Math.random() < .5, ans = more ? Math.max(a, b) : Math.min(a, b);
  return { t: 'pick', say: more ? TTPH.more : TTPH.less, o: [e.repeat(ans), e.repeat(a + b - ans)] };
}
function qNum(lv) {
  const ns = ttTake(Array.from({ length: 10 }, (_, i) => i + 1), lv === 3 ? 3 : 2), big = Math.random() < .5;
  const ans = big ? Math.max(...ns) : Math.min(...ns);
  const say = lv === 3 ? (big ? TTPH.biggest : TTPH.smallest) : (big ? TTPH.bigger : TTPH.smaller);
  return { t: 'pick', say, o: [String(ans), ...ns.filter(x => x !== ans).map(String)] };
}
function qSum() {
  const a = ttInt(1, 5), b = ttInt(1, 4);
  return { t: 'pick', say: TTPH.sum, show: { sum: [rnd(TT_COUNT), a, b] }, o: ttNear(a + b, 4, 1, 10) };
}

// ───── Không gian ─────
// Vị trí: [hình, tên đọc, vật mốc, tên vật mốc]; trái/phải tính theo phía bé nhìn
const KG_PAIRS = [['🐱', 'Con mèo', '📦', 'cái hộp'], ['⚽', 'Quả bóng', '🪑', 'cái ghế'], ['🐦', 'Con chim', '🌳', 'cái cây'], ['🐶', 'Con chó', '🏠', 'ngôi nhà']];
const KG_DIR = { tren: [{ e: '⬆️', t: 'Ở trên' }, [0, 1]], duoi: [{ e: '⬇️', t: 'Ở dưới' }, [2, 1]], trai: [{ e: '⬅️', t: 'Bên trái' }, [1, 0]], phai: [{ e: '➡️', t: 'Bên phải' }, [1, 2]] };
const kgSay = (p, four) => `${p[1]} ở đâu so với ${p[3]}? ` + (four ? 'Ở trên, ở dưới, bên trái hay bên phải?' : 'Ở trên hay ở dưới?');
// Hình không đối xứng, để nhận ra khi bị lật hay xoay
const KG_ASYM = ['🦒', '🐘', '🐌', '🚗', '🦕', '🐢', '🐎', '🦆', '🚲', '🐓', '🦔', '🐿️'];
function qPos(lv, p) {
  const four = lv > 1, dirs = four ? ['tren', 'duoi', 'trai', 'phai'] : ['tren', 'duoi'], d = rnd(dirs);
  return { t: 'pick', say: kgSay(p, four), cap: `${p[1]} ở đâu so với ${p[3]}?`, show: { pos: [p[0], p[2], KG_DIR[d][1]] },
    o: [d, ...dirs.filter(x => x !== d)].map(x => KG_DIR[x][0]) };
}
function qShadow(lv) {
  const pics = lv === 3 ? ttTake(TT_CATS[rnd(Object.keys(TT_CATS))], 4) : ttTake(TT_ALL, lv === 1 ? 3 : 4);
  return { t: 'pick', say: TTPH.shadow, show: { shadow: pics[0] }, o: pics };
}
function qSame(lv) {
  const e = rnd(KG_ASYM);
  return { t: 'pick', say: TTPH.same, show: { pic: [e, ''] }, o: [e, ...ttTake(['scaleX(-1)', 'rotate(180deg)', 'rotate(90deg)'], lv === 3 ? 3 : 2).map(t => `tf:${t}|${e}`)] };
}

// ───── Ngôn ngữ ─────
const NN_WORDS = {
  vat: [['🐘', 'Con voi'], ['🐯', 'Con hổ'], ['🦒', 'Con hươu cao cổ'], ['🐒', 'Con khỉ'], ['🐢', 'Con rùa'], ['🐍', 'Con rắn'], ['🦆', 'Con vịt'], ['🐸', 'Con ếch']],
  do: [['🪑', 'Cái ghế'], ['🛏️', 'Cái giường'], ['☂️', 'Cái ô'], ['🔑', 'Chìa khóa'], ['🧹', 'Cái chổi'], ['🥢', 'Đôi đũa'], ['📺', 'Ti vi'], ['🕰️', 'Đồng hồ']],
  an: [['🍞', 'Bánh mì'], ['🥚', 'Quả trứng'], ['🍚', 'Bát cơm'], ['🥛', 'Cốc sữa'], ['🍦', 'Cây kem'], ['🌽', 'Bắp ngô'], ['🍉', 'Quả dưa hấu'], ['🍌', 'Quả chuối']],
};
// Âm đầu: chữ → [cách đọc âm, các hình có tên bắt đầu bằng âm đó]
const NN_INIT = {
  b: ['bờ', [['🐄', 'bò'], ['⚽', 'bóng'], ['🖊️', 'bút'], ['🦋', 'bướm'], ['🎂', 'bánh']]],
  c: ['cờ', [['🐟', 'cá'], ['🍊', 'cam'], ['🦀', 'cua'], ['🌳', 'cây']]],
  m: ['mờ', [['🐱', 'mèo'], ['🌧️', 'mưa'], ['🦟', 'muỗi']]],
  g: ['gờ', [['🐔', 'gà'], ['🐻', 'gấu'], ['🧤', 'găng tay']]],
  t: ['tờ', [['🍎', 'táo'], ['🚢', 'tàu'], ['🦐', 'tôm'], ['✋', 'tay']]],
  h: ['hờ', [['🌸', 'hoa'], ['🐯', 'hổ'], ['🦛', 'hà mã'], ['📦', 'hộp']]],
  l: ['lờ', [['🍃', 'lá'], ['🍐', 'lê'], ['🔥', 'lửa']]],
};
const nnInitSay = ch => `Hình nào có tên bắt đầu bằng âm ${NN_INIT[ch][0]}?`;
// Tranh theo thứ tự thời gian
const NN_STORY = [['🥚', '🐣', '🐥', '🐔'], ['🌰', '🌱', '🌿', '🌳'], ['🌅', '☀️', '🌇', '🌙'], ['😴', '🪥', '🍳', '🎒'], ['👶', '🧒', '🧑', '👴']];
function qListen(lv, w) {
  const cat = Object.keys(NN_WORDS).find(c => NN_WORDS[c].includes(w));
  const pool = lv === 3 ? NN_WORDS[cat] : Object.values(NN_WORDS).flat();
  return { t: 'pick', say: [TTPH.listen, w[1]], cap: TTPH.listen, show: { ear: 1 }, o: [w, ...ttTake(pool.filter(x => x !== w), lv === 3 ? 3 : 2)].map(x => x[0]) };
}
function qInit(lv, ch) {
  const ans = rnd(NN_INIT[ch][1]), others = ttTake(Object.keys(NN_INIT).filter(x => x !== ch), lv === 3 ? 3 : 2).map(x => rnd(NN_INIT[x][1]));
  return { t: 'pick', say: nnInitSay(ch), show: { big: ch }, o: [ans, ...others].map(([e, t]) => ({ e, t })) };
}
const qStory = (lv, s) => ({ t: 'order', say: TTPH.story, tiles: lv === 1 ? s.slice(0, 3) : s });

// ───── Cảm xúc ─────
const CX_FACE = { vui: ['😄', 'vui'], buon: ['😢', 'buồn'], gian: ['😠', 'tức giận'], so: ['😨', 'sợ hãi'], ngac: ['😲', 'ngạc nhiên'], ngu: ['😴', 'buồn ngủ'] };
const CX_EASY = ['vui', 'buon', 'gian'];
const cxFaceSay = f => `Bé chạm vào bạn đang ${CX_FACE[f][1]} nhé.`;
// Tình huống: [câu đọc, tranh, cảm xúc đúng]
const CX_SITU = [
  ['Bạn được tặng quà sinh nhật. Bạn sẽ cảm thấy thế nào?', '🎁 🎂', 'vui'],
  ['Bạn làm rơi cây kem xuống đất. Bạn sẽ cảm thấy thế nào?', '🍦 ⬇️', 'buon'],
  ['Bạn đang chơi thì bị giật mất đồ chơi. Bạn sẽ cảm thấy thế nào?', '🧸 ✊', 'gian'],
  ['Mẹ đi làm về, ôm bạn thật chặt. Bạn sẽ cảm thấy thế nào?', '👩 🤗', 'vui'],
  ['Chú chó nhỏ của bạn bị ốm. Bạn sẽ cảm thấy thế nào?', '🐶 🤒', 'buon'],
  ['Bạn được đi chơi công viên. Bạn sẽ cảm thấy thế nào?', '🎠 🎈', 'vui'],
  ['Trời tối, có tiếng sấm thật to. Bạn sẽ cảm thấy thế nào?', '🌩️ 🌑', 'so'],
  ['Bạn mở hộp ra, bất ngờ có chú thỏ nhảy ra. Bạn sẽ cảm thấy thế nào?', '📦 🐰', 'ngac'],
  ['Đã khuya rồi, bạn chơi cả ngày. Bạn sẽ cảm thấy thế nào?', '🌙 🛏️', 'ngu'],
  ['Bạn thân chuyển đi học trường khác. Bạn sẽ cảm thấy thế nào?', '👋 🚌', 'buon'],
];
// Nên làm gì: câu đọc kèm các lựa chọn (đáp án đúng đứng đầu)
const CX_ACT = [
  ['Bạn bị ngã và khóc. Bé nên làm gì? Đỡ bạn dậy và hỏi han, hay cười bạn?', '🧒 💥 😢', [{ e: '🤝', t: 'Đỡ bạn dậy, hỏi han' }, { e: '😆', t: 'Cười bạn' }]],
  ['Bé đang rất tức giận. Bé nên làm gì? Hít thở thật sâu rồi nói với mẹ, hay ném đồ đạc?', '😠', [{ e: '🌬️', t: 'Hít thở sâu, nói với mẹ' }, { e: '💥', t: 'Ném đồ đạc' }]],
  ['Có bạn mới vào lớp, ngồi một mình. Bé nên làm gì? Rủ bạn cùng chơi, hay mặc kệ bạn?', '🧒 🏫', [{ e: '👫', t: 'Rủ bạn cùng chơi' }, { e: '🙈', t: 'Mặc kệ bạn' }]],
  ['Bé muốn chơi đồ chơi bạn đang chơi. Bé nên làm gì? Hỏi bạn cho chơi cùng, hay giật lấy?', '🧸 👧', [{ e: '🗣️', t: 'Hỏi bạn cho chơi cùng' }, { e: '✊', t: 'Giật lấy' }]],
  ['Mẹ đang mệt. Bé có thể làm gì? Lấy nước cho mẹ, hay đòi mẹ chơi cùng?', '👩 😓', [{ e: '🥛', t: 'Lấy nước cho mẹ' }, { e: '📢', t: 'Đòi mẹ chơi cùng' }]],
  ['Bé lỡ làm vỡ cốc. Bé nên làm gì? Nói thật với bố mẹ, hay giấu đi?', '🥛 💔', [{ e: '🗣️', t: 'Nói thật với bố mẹ' }, { e: '🙊', t: 'Giấu đi' }]],
];
function cxOpts(lv, f) {
  const pool = lv === 1 ? CX_EASY : Object.keys(CX_FACE);
  return [f, ...ttTake(pool.filter(x => x !== f), lv === 3 ? 3 : 2)].map(x => CX_FACE[x][0]);
}
const qFace = (lv, f) => ({ t: 'pick', say: cxFaceSay(f), o: cxOpts(lv, f) });
const qSitu = (lv, s) => ({ t: 'pick', say: s[0], show: { scene: s[1] }, o: cxOpts(lv, s[2]) });
const qAct = a => ({ t: 'pick', say: a[0], show: { scene: a[1] }, o: a[2] });

// ───── Sáng tạo ─────
const ST_MIX = [
  ['Màu đỏ trộn với màu vàng thành màu gì?', '#ef3b3b', '#f5d21c', '#ff8c1a'],
  ['Màu xanh dương trộn với màu vàng thành màu gì?', '#3b7bef', '#f5d21c', '#3fbf4a'],
  ['Màu đỏ trộn với màu xanh dương thành màu gì?', '#ef3b3b', '#3b7bef', '#9b4dde'],
  ['Màu đỏ trộn với màu trắng thành màu gì?', '#ef3b3b', '#ffffff', '#ff9cc8'],
  ['Màu đen trộn với màu trắng thành màu gì?', '#333333', '#ffffff', '#9a9a9a'],
];
const ST_COLORS = ['#ef3b3b', '#3b7bef', '#f5d21c', '#ff8c1a', '#3fbf4a', '#9b4dde', '#ff9cc8', '#9a9a9a', '#8b5a2b'];
// Vẽ tự do: nền + bộ hình dán theo chủ đề
const ST_DRAW = [
  { say: 'Bé vẽ và trang trí bầu trời nhé. Vẽ xong bé bấm nút Xong.', bg: '#d4f1ff', stk: ['☀️', '☁️', '🌈', '⭐', '🐦', '✈️', '🌙'] },
  { say: 'Bé vẽ và trang trí đáy biển nhé. Vẽ xong bé bấm nút Xong.', bg: '#a9def7', stk: ['🐟', '🐠', '🐙', '🦀', '🐚', '🐳', '🌿'] },
  { say: 'Bé vẽ và trang trí khu vườn nhé. Vẽ xong bé bấm nút Xong.', bg: '#dcf5c9', stk: ['🌸', '🌻', '🌷', '🦋', '🐝', '🐞', '🍄'] },
];
function qMix(lv, m) {
  const pool = ST_COLORS.filter(c => ![m[1], m[2], m[3]].includes(c));
  return { t: 'pick', say: m[0], show: { mix: [m[1], m[2]] }, o: [m[3], ...ttTake(pool, lv === 3 ? 3 : 2)].map(c => 'color:' + c) };
}
const qSimon = len => ({ t: 'simon', say: TTPH.simon, seq: Array.from({ length: len }, () => Math.random() * 4 | 0) });
const qDraw = () => Object.assign({ t: 'draw' }, rnd(ST_DRAW));

// Tất cả câu cố định của Đảo Trí Tuệ (dùng cho công cụ tạo file giọng đọc)
function ttVoices() {
  return [...Object.values(TTPH), ...ZONES.map(z => z.say),
    ...KG_PAIRS.flatMap(p => [kgSay(p, false), kgSay(p, true)]),
    ...Object.values(NN_WORDS).flat().map(w => w[1]), ...Object.keys(NN_INIT).map(nnInitSay),
    ...Object.keys(CX_FACE).map(cxFaceSay), ...CX_SITU.map(s => s[0]), ...CX_ACT.map(a => a[0]),
    ...ST_MIX.map(m => m[0]), ...ST_DRAW.map(d => d.say)];
}

const rep = (n, f, lv) => Array.from({ length: n }, () => f(lv));
// make(lv): tạo một lượt chơi (5–6 câu) theo cấp độ hiện tại của bé
const ZONES = [
  { id: 'logic', name: 'Tư duy logic', icon: '🧩', color: '#ff8a5c', say: 'Khu Tư duy logic', open: true,
    make: lv => [qPattern(lv), qOdd(lv), qPattern(lv), qOdd(lv), qPattern(lv), qOdd(lv)] },
  { id: 'nho', name: 'Trí nhớ', icon: '🧠', color: '#b58cff', say: 'Khu Trí nhớ', open: true,
    make: lv => [qGone(lv), qMemo(lv), qGone(lv), qGone(lv), qMemo(lv)] },
  { id: 'so', name: 'Toán vui', icon: '🔢', color: '#4fb6ff', say: 'Khu Toán vui', open: true,
    make: lv => shuffle(lv === 1 ? [...rep(3, qCount, 1), ...rep(3, qMore, 1)]
      : lv === 2 ? [...rep(2, qCount, 2), ...rep(2, qMore, 2), ...rep(2, qNum, 2)]
      : [qCount(3), ...rep(2, qNum, 3), ...rep(3, qSum, 3)]) },
  { id: 'kg', name: 'Không gian', icon: '📐', color: '#7ccf5a', say: 'Khu Không gian', open: true,
    make: lv => {
      const ps = ttTake(KG_PAIRS, 3);
      return lv === 1 ? [qPos(1, ps[0]), qShadow(1), qPos(1, ps[1]), qShadow(1), qPos(1, ps[2]), qShadow(1)]
        : [qPos(lv, ps[0]), qShadow(lv), qSame(lv), qPos(lv, ps[1]), qShadow(lv), qSame(lv)];
    } },
  { id: 'nn', name: 'Ngôn ngữ', icon: '🗣️', color: '#ffc531', say: 'Khu Ngôn ngữ', open: true,
    make: lv => {
      const ws = ttTake(Object.values(NN_WORDS).flat(), 4), ss = ttTake(NN_STORY, 2), cs = ttTake(Object.keys(NN_INIT), 3);
      if (lv === 1) return [qListen(1, ws[0]), qListen(1, ws[1]), qStory(1, ss[0]), qListen(1, ws[2]), qListen(1, ws[3]), qStory(1, ss[1])];
      if (lv === 2) return [qListen(2, ws[0]), qInit(2, cs[0]), qStory(2, ss[0]), qListen(2, ws[1]), qInit(2, cs[1]), qInit(2, cs[2])];
      return [qInit(3, cs[0]), qStory(3, ss[0]), qInit(3, cs[1]), qListen(3, ws[0]), qInit(3, cs[2]), qStory(3, ss[1])];
    } },
  { id: 'cx', name: 'Cảm xúc', icon: '❤️', color: '#ff7bc0', say: 'Khu Cảm xúc', open: true,
    make: lv => {
      if (lv === 1) {
        const fs = shuffle(CX_EASY), ss = ttTake(CX_SITU.filter(s => CX_EASY.includes(s[2])), 3);
        return [qFace(1, fs[0]), qSitu(1, ss[0]), qFace(1, fs[1]), qSitu(1, ss[1]), qFace(1, fs[2]), qSitu(1, ss[2])];
      }
      const fs = ttTake(Object.keys(CX_FACE), 2), ss = ttTake(CX_SITU, 4), as = ttTake(CX_ACT, 2);
      return lv === 2 ? [qFace(2, fs[0]), qSitu(2, ss[0]), qSitu(2, ss[1]), qFace(2, fs[1]), qSitu(2, ss[2]), qSitu(2, ss[3])]
        : [qSitu(3, ss[0]), qAct(as[0]), qFace(3, fs[0]), qSitu(3, ss[1]), qAct(as[1]), qSitu(3, ss[2])];
    } },
  { id: 'st', name: 'Sáng tạo', icon: '🎨', color: '#2ec4b6', say: 'Khu Sáng tạo', open: true,
    make: lv => { const ms = ttTake(ST_MIX, 2); return [qSimon(lv + 1), qMix(lv, ms[0]), qSimon(lv + 2), qMix(lv, ms[1]), qDraw()]; } },
];
