// Góc thử thách – 3 trò tính giờ, đề tạo ngẫu nhiên theo lớp của bé (chơi mãi không hết đề):
//  ⚡ Tính nhẩm nhanh (60 giây) · 🎈 Bắn bóng bay (45 giây) · 🐝 Từ vựng nhanh (60 giây)
// Câu đọc đều cố định (không đọc số) nên dùng chung được file giọng thu sẵn.

const ARPH = {
  corner: 'Góc thử thách đây! Bé chọn một trò nhé.',
  speed: 'Tính nhẩm nhanh! Bé trả lời đúng càng nhiều câu càng tốt nhé. Bắt đầu!',
  pop: 'Bắn bóng bay! Bé chạm vào những quả bóng đúng với yêu cầu nhé. Bắt đầu!',
  vocab: 'Từ vựng nhanh! Bé nghe và chọn đúng hình nhé. Bắt đầu!',
  end: 'Hết giờ rồi!',
  record: 'Kỷ lục mới! Bé giỏi quá!',
  good: 'Bé làm tốt lắm! Lần sau cố thêm chút nữa nhé!',
  combo: 'Siêu quá! Đúng liền năm câu!',
};

const ARCADE = [
  { id: 'speed', name: 'Tính nhẩm nhanh', icon: '⚡', color: '#ff8a5c', secs: 60, stars: [8, 15, 22], desc: 'Đúng nhiều câu nhất trong 60 giây' },
  { id: 'pop', name: 'Bắn bóng bay', icon: '🎈', color: '#4fb6ff', secs: 45, stars: [5, 10, 15], desc: 'Chạm bóng có kết quả đúng' },
  { id: 'vocab', name: 'Từ vựng nhanh', icon: '🐝', color: '#7ccf5a', secs: 60, stars: [6, 12, 18], desc: 'Nghe tiếng Anh, chọn hình' },
];

const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
// Đáp án nhiễu gần đúng (không âm, không trùng)
function arOpts(ans, n = 4) {
  const out = new Set([ans]), near = [1, -1, 2, -2, 10, -10, 3, 5, -5];
  for (const d of near) { if (out.size >= n) break; if (ans + d >= 0) out.add(ans + d); }
  return [...out].sort(() => Math.random() - .5);
}

// Một phép tính phù hợp lớp: { t: '7 + 5', a: 12 }
function arCalc(stage) {
  if (stage <= 2) {                               // Mẫu giáo lớn: cộng trừ trong phạm vi 10
    if (Math.random() < .6) { const a = ri(0, 5), b = ri(0, 5); return { t: `${a} + ${b}`, a: a + b }; }
    const a = ri(2, 10), b = ri(0, a); return { t: `${a} - ${b}`, a: a - b };
  }
  if (stage === 3) {                              // Lớp 1: trong phạm vi 20, số tròn chục, phạm vi 100 không nhớ
    const k = ri(1, 4);
    if (k === 1) { const a = ri(2, 10), b = ri(1, 10); return { t: `${a} + ${b}`, a: a + b }; }
    if (k === 2) { const a = ri(11, 20), b = ri(1, a - 10); return { t: `${a} - ${b}`, a: a - b }; }
    if (k === 3) { const a = ri(1, 8) * 10, b = ri(1, 9 - a / 10) * 10; return Math.random() < .5 ? { t: `${a} + ${b}`, a: a + b } : { t: `${a + b} - ${b}`, a }; }
    const a1 = ri(1, 7), a2 = ri(0, 7), b1 = ri(1, 9 - a1), b2 = ri(0, 9 - a2), A = a1 * 10 + a2, B = b1 * 10 + b2;
    return Math.random() < .5 ? { t: `${A} + ${B}`, a: A + B } : { t: `${A + B} - ${B}`, a: A };
  }
  // Lớp 2: cộng trừ có nhớ trong 100, bảng nhân chia 2 và 5
  const k = ri(1, 4);
  if (k === 1) { const a = ri(15, 69), b = ri(6, 99 - a); return { t: `${a} + ${b}`, a: a + b }; }
  if (k === 2) { const a = ri(21, 99), b = ri(6, a - 5); return { t: `${a} - ${b}`, a: a - b }; }
  const m = Math.random() < .5 ? 2 : 5, x = ri(1, 10);
  return k === 3 ? { t: `${m} × ${x}`, a: m * x } : { t: `${m * x} : ${m}`, a: x };
}

// Lượt bóng bay: đích (ví dụ "= 10") và cách tạo một quả bóng (khoảng 40% là bóng đúng)
function arPopRound(stage) {
  if (stage <= 2) {
    const T = ri(1, 9);
    return { goal: `Bóng có số ${T}`, make: () => { const ok = Math.random() < .4, v = ok ? T : ri(0, 10); return { t: String(v), ok: v === T }; } };
  }
  const T = stage === 3 ? ri(8, 20) : rnd([10, 12, 15, 20, 25, 30, 40, 50]);
  const make = () => {
    if (Math.random() < .4) {                                // bóng đúng: một cách viết ra T
      if (stage === 4 && T % 5 === 0 && Math.random() < .4) return { t: `5 × ${T / 5}`, ok: true };
      if (stage === 4 && T % 2 === 0 && T <= 20 && Math.random() < .4) return { t: `2 × ${T / 2}`, ok: true };
      const a = ri(0, T); return Math.random() < .7 ? { t: `${a} + ${T - a}`, ok: true } : { t: `${T + a} - ${a}`, ok: true };
    }
    const c = arCalc(stage); return { t: c.t, ok: c.a === T };
  };
  return { goal: `Bóng có kết quả = ${T}`, make };
}

// Từ vựng tiếng Anh: lấy các câu "nghe và chọn" của lớp bé và các lớp dưới (giọng đã có sẵn)
function arVocabPool(stage) {
  const pool = [];
  for (const st in LESSONS) if (+st <= stage) for (const L of LESSONS[st].ta || [])
    for (const q of L.qs) if (q.t === 'pick' && q.show && q.show.ear && Array.isArray(q.say)) {
      const w = q.say.find(s => s.startsWith('en:'));
      if (w && q.o.every(o => typeof o === 'string')) pool.push({ w, o: q.o });
    }
  return pool;
}

function arVoices() { return Object.values(ARPH); }
