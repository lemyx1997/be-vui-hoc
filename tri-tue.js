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
  { id: 'kg', name: 'Không gian', icon: '📐', color: '#7ccf5a', say: 'Khu Không gian', open: false },
  { id: 'nn', name: 'Ngôn ngữ', icon: '🗣️', color: '#ffc531', say: 'Khu Ngôn ngữ', open: false },
  { id: 'cx', name: 'Cảm xúc', icon: '❤️', color: '#ff7bc0', say: 'Khu Cảm xúc', open: false },
  { id: 'st', name: 'Sáng tạo', icon: '🎨', color: '#2ec4b6', say: 'Khu Sáng tạo', open: false },
];
