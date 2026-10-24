// Nội dung bài học + các câu nói của ứng dụng.
// Mỗi câu đọc (say) có một file giọng thu sẵn trong giong/, tên file tính bằng vkey().
// Câu bắt đầu bằng "en:" được đọc bằng giọng tiếng Anh.

// Tên file giọng đọc: chữ không dấu (dễ nhận ra) + mã ngắn (để không trùng)
function vkey(s) {
  const en = s.startsWith('en:'), txt = en ? s.slice(3) : s;
  const base = txt.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 28).replace(/_+$/, '');
  let h = 5381;
  for (const c of s) h = (Math.imul(h, 33) ^ c.codePointAt(0)) >>> 0;
  return (en ? 'en_' : '') + base + '_' + (h % 1679616).toString(36);
}

const SUBJECTS = [
  { id: 'toan', name: 'Toán', icon: '🔢', color: '#ff8a5c', say: 'Môn Toán' },
  { id: 'tv', name: 'Tiếng Việt', icon: '📖', color: '#4fb6ff', say: 'Môn Tiếng Việt' },
  { id: 'ta', name: 'Tiếng Anh', icon: '🌍', color: '#7ccf5a', say: 'Môn Tiếng Anh' },
  { id: 'kn', name: 'Kỹ năng', icon: '🎒', color: '#b58cff', say: 'Kỹ năng đi học' },
];

const STAGES = [
  { id: 1, name: 'Chặng 1', sub: 'Mẫu giáo lớn', open: true },
  { id: 2, name: 'Chặng 2', sub: 'Chuẩn bị vào lớp 1', open: false },
  { id: 3, name: 'Chặng 3', sub: 'Lớp 1', open: true },
  { id: 4, name: 'Chặng 4', sub: 'Lớp 2', open: true },
];

// Công cụ soạn câu hỏi nhanh (dùng trong bai-lop1.js, bai-lop2.js)
// nums: đáp án đúng + 3 số nhiễu gần đúng
function nums(r, extra) {
  const out = [String(r)];
  for (const x of [...(extra || []), r + 1, r - 1, r + 10, r - 10, r + 2, r - 2, r + 3]) if (x >= 0 && !out.includes(String(x)) && out.length < 4) out.push(String(x));
  return out;
}
const OPW = { '+': 'cộng', '-': 'trừ', '×': 'nhân', ':': 'chia' };
function calc(a, op, b) {
  const r = op === '+' ? a + b : op === '-' ? a - b : op === '×' ? a * b : a / b;
  const ex = op === '×' || op === ':' ? [r + 2, r - 2, r + 5, r - 5] : [];
  return { t: 'pick', say: `${a} ${OPW[op]} ${b} bằng bao nhiêu?`, show: { eq: `${a} ${op} ${b} = ?` }, o: nums(r, ex) };
}
const story = (say, r, extra) => ({ t: 'pick', say, o: nums(r, extra) });
const listen = (word, o) => ({ t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:' + word], show: { ear: 1 }, o });
const fill = (word, say, o) => ({ t: 'pick', say: 'Bé chọn chữ điền vào chỗ trống: ' + say, cap: 'Bé nghe và chọn chữ điền vào chỗ trống', show: { word }, o });

const AVATARS = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐯', '🐸', '🐵', '🐧', '🦁', '🐨'];

// Câu nói chung của ứng dụng
const PH = {
  who: 'Ai đang học đấy? Bé chạm vào hình của mình nhé!',
  hello: 'Chào bé! Hôm nay mình cùng chơi mà học nhé!',
  mission: 'Đây là nhiệm vụ hôm nay. Bé bấm nút Bắt đầu nhé!',
  missionDone: 'Bé đã làm xong nhiệm vụ hôm nay. Giỏi quá!',
  praise: ['Đúng rồi! Bé giỏi quá!', 'Tuyệt vời!', 'Hoan hô bé!', 'Bé thông minh quá!', 'Chính xác! Giỏi lắm!', 'Đúng rồi, bé làm tốt lắm!'],
  retry: ['Chưa đúng rồi, bé thử lại nhé!', 'Gần đúng rồi, bé nghĩ thêm chút nữa nhé!', 'Không sao, bé chọn lại nhé!'],
  hint: 'Bé nhìn kỹ nhé, đáp án đang sáng lên đấy!',
  matchDone: 'Bé ghép đúng hết rồi!',
  traceDone: 'Bé tô đẹp quá!',
  traceMore: 'Bé tô kín theo nét chữ mờ nhé!',
  traceNeat: 'Bé tô gọn trong nét chữ nhé!',
  stars: ['Bé hoàn thành bài học rồi!', 'Bé được hai ngôi sao! Cố lên nhé!', 'Giỏi quá! Bé được ba ngôi sao!'],
  locked: 'Bé học xong bài trước để mở bài này nhé!',
  review: 'Mình cùng ôn lại những câu bé chưa nhớ nhé!',
  timeUp: 'Hôm nay bé giỏi lắm, mai mình chơi tiếp nhé!',
  garden: 'Khu vườn của bé đây! Học càng nhiều, khu vườn càng đẹp.',
  grow: 'Bạn nhỏ của bé lớn thêm rồi!',
  badge3: 'Bé học ba ngày liền! Bé được huy hiệu!',
  badge7: 'Bé học bảy ngày liền! Bé được huy hiệu!',
  badge30: 'Bé học ba mươi ngày liền! Bé thật chăm chỉ!',
  soon: 'Chặng này sắp có, bé chờ nhé!',
};

// Các câu hỏi:
//  pick  – chọn 1 đáp án (o[0] là đáp án đúng, khi hiện sẽ trộn thứ tự)
//  match – kéo thả ghép cặp: p = [trái, phải, câu đọc trái, câu đọc phải]
//  trace – tô theo nét chữ/số
//  order – xếp thẻ theo đúng thứ tự (tiles theo thứ tự đúng, extra = thẻ thừa gây nhiễu)
// Phần hình (show): count=[hình, số lượng] · big=chữ to · pic=[hình, chữ dưới] · scene=tranh · ear=nghe
//   eq=phép tính · word=từ có chỗ trống · read=đoạn văn · clock=[giờ, phút]
// Đáp án "clock:8:30" là mặt đồng hồ.
// Đáp án dạng "shape:tron" là hình vẽ, "color:#mã" là ô màu, {e, t} là hình kèm chữ.
const LESSONS = { 1: {
  toan: [
    { title: 'Đếm đến 5', icon: '🍎', qs: [
      { t: 'pick', say: 'Bé đếm xem có mấy quả táo?', show: { count: ['🍎', 2] }, o: ['2', '3', '1'] },
      { t: 'pick', say: 'Có mấy con cá?', show: { count: ['🐟', 4] }, o: ['4', '5', '3'] },
      { t: 'pick', say: 'Có mấy quả bóng bay?', show: { count: ['🎈', 3] }, o: ['3', '2', '5'] },
      { t: 'pick', say: 'Có mấy ngôi sao?', show: { count: ['⭐', 5] }, o: ['5', '4', '3'] },
      { t: 'pick', say: 'Bé chạm vào nhóm có 4 bông hoa nhé.', o: ['🌸🌸🌸🌸', '🌸🌸🌸', '🌸🌸🌸🌸🌸'] },
      { t: 'match', say: 'Bé kéo mỗi số đến đúng nhóm con vật nhé.', p: [['1', '🐶', '1', 'một con chó'], ['2', '🐱🐱', '2', 'hai con mèo'], ['3', '🐰🐰🐰', '3', 'ba con thỏ']] },
    ] },
    { title: 'Đếm đến 10', icon: '🧮', qs: [
      { t: 'pick', say: 'Bé đếm xem có mấy quả dâu?', show: { count: ['🍓', 6] }, o: ['6', '7', '5'] },
      { t: 'pick', say: 'Có mấy chú gà con?', show: { count: ['🐥', 8] }, o: ['8', '6', '9'] },
      { t: 'pick', say: 'Có mấy chiếc ô tô?', show: { count: ['🚗', 7] }, o: ['7', '8', '6'] },
      { t: 'pick', say: 'Có mấy cái kẹo?', show: { count: ['🍬', 10] }, o: ['10', '9', '8'] },
      { t: 'pick', say: 'Có mấy chiếc lá?', show: { count: ['🍀', 9] }, o: ['9', '10', '7'] },
      { t: 'match', say: 'Bé kéo mỗi số đến đúng nhóm nhé.', p: [['6', '🍌🍌🍌🍌🍌🍌', '6', 'sáu quả chuối'], ['8', '🐞🐞🐞🐞🐞🐞🐞🐞', '8', 'tám con bọ rùa'], ['10', '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵', '10', 'mười chấm tròn']] },
    ] },
    { title: 'Hình khối', icon: '🔺', qs: [
      { t: 'pick', say: 'Bé chạm vào hình tròn nhé.', o: ['shape:tron', 'shape:vuong', 'shape:tamgiac'] },
      { t: 'pick', say: 'Bé chạm vào hình vuông nhé.', o: ['shape:vuong', 'shape:tamgiac', 'shape:chunhat'] },
      { t: 'pick', say: 'Bé chạm vào hình tam giác nhé.', o: ['shape:tamgiac', 'shape:tron', 'shape:vuong'] },
      { t: 'pick', say: 'Bé chạm vào hình chữ nhật nhé.', o: ['shape:chunhat', 'shape:vuong', 'shape:tron'] },
      { t: 'pick', say: 'Quả bóng có dạng hình gì?', show: { pic: ['⚽', ''] }, o: ['shape:tron', 'shape:tamgiac', 'shape:vuong'] },
      { t: 'match', say: 'Bé kéo mỗi hình đến đồ vật có dạng giống nó nhé.', p: [['shape:tron', '🕒', 'hình tròn', 'cái đồng hồ'], ['shape:tamgiac', '🚩', 'hình tam giác', 'lá cờ đuôi nheo'], ['shape:vuong', '🎁', 'hình vuông', 'hộp quà']] },
    ] },
    { title: 'Nhiều hơn, ít hơn', icon: '⚖️', qs: [
      { t: 'pick', say: 'Nhóm nào có nhiều quả táo hơn?', o: ['🍎🍎🍎🍎🍎', '🍎🍎🍎'] },
      { t: 'pick', say: 'Nhóm nào có ít con cá hơn?', o: ['🐟🐟', '🐟🐟🐟🐟'] },
      { t: 'pick', say: 'Nhóm nào có nhiều bóng bay hơn?', o: ['🎈🎈🎈🎈🎈🎈', '🎈🎈🎈🎈'] },
      { t: 'pick', say: 'Nhóm nào có ít bông hoa hơn?', o: ['🌼🌼🌼🌼🌼', '🌼🌼🌼🌼🌼🌼🌼'] },
      { t: 'pick', say: 'Số nào lớn hơn?', o: ['7', '3'] },
      { t: 'pick', say: 'Số nào bé hơn?', o: ['2', '6'] },
    ] },
    { title: 'Tập tô số', icon: '✏️', qs: [
      { t: 'trace', ch: '1', say: 'Bé tô theo nét số 1 nhé.' },
      { t: 'trace', ch: '2', say: 'Bé tô theo nét số 2 nhé.' },
      { t: 'trace', ch: '3', say: 'Bé tô theo nét số 3 nhé.' },
      { t: 'trace', ch: '4', say: 'Bé tô theo nét số 4 nhé.' },
      { t: 'trace', ch: '5', say: 'Bé tô theo nét số 5 nhé.' },
    ] },
  ],
  tv: [
    { title: 'Chữ o, ô, ơ', icon: '⭕', qs: [
      { t: 'pick', say: 'Bé chạm vào chữ o nhé.', o: ['o', 'ô', 'ơ'] },
      { t: 'pick', say: 'Bé chạm vào chữ ô nhé.', o: ['ô', 'ơ', 'o'] },
      { t: 'pick', say: 'Bé chạm vào chữ ơ nhé.', o: ['ơ', 'o', 'ô'] },
      { t: 'pick', say: 'Con bò. Tiếng bò có chữ nào?', show: { pic: ['🐄', 'bò'] }, o: ['o', 'ô', 'ơ'] },
      { t: 'pick', say: 'Lá cờ. Tiếng cờ có chữ nào?', show: { pic: ['🚩', 'cờ'] }, o: ['ơ', 'o', 'ô'] },
      { t: 'match', say: 'Bé kéo mỗi chữ đến đúng hình nhé.', p: [['o', '🐄', 'chữ o', 'con bò'], ['ô', '👩‍🏫', 'chữ ô', 'cô giáo'], ['ơ', '🚩', 'chữ ơ', 'lá cờ']] },
    ] },
    { title: 'Chữ a, ă, â', icon: '🐟', qs: [
      { t: 'pick', say: 'Bé chạm vào chữ a nhé.', o: ['a', 'ă', 'â'] },
      { t: 'pick', say: 'Bé chạm vào chữ á, có cái mũ hình trăng khuyết nhé.', o: ['ă', 'â', 'a'] },
      { t: 'pick', say: 'Bé chạm vào chữ ớ, có cái mũ nhọn nhé.', o: ['â', 'a', 'ă'] },
      { t: 'pick', say: 'Con cá. Tiếng cá có chữ nào?', show: { pic: ['🐟', 'cá'] }, o: ['a', 'o', 'ơ'] },
      { t: 'pick', say: 'Cái cân. Tiếng cân có chữ nào?', show: { pic: ['⚖️', 'cân'] }, o: ['â', 'a', 'ô'] },
      { t: 'match', say: 'Bé kéo mỗi chữ đến đúng hình nhé.', p: [['a', '🐟', 'chữ a', 'con cá'], ['ă', '🛁', 'chữ á', 'bé tắm'], ['â', '⚖️', 'chữ ớ', 'cái cân']] },
    ] },
    { title: 'Chữ e, ê', icon: '🐐', qs: [
      { t: 'pick', say: 'Bé chạm vào chữ e nhé.', o: ['e', 'ê', 'o'] },
      { t: 'pick', say: 'Bé chạm vào chữ ê nhé.', o: ['ê', 'e', 'ô'] },
      { t: 'pick', say: 'Xe đạp. Tiếng xe có chữ nào?', show: { pic: ['🚲', 'xe'] }, o: ['e', 'ê', 'a'] },
      { t: 'pick', say: 'Con dê. Tiếng dê có chữ nào?', show: { pic: ['🐐', 'dê'] }, o: ['ê', 'e', 'ơ'] },
      { t: 'pick', say: 'Quả lê. Tiếng lê có chữ nào?', show: { pic: ['🍐', 'lê'] }, o: ['ê', 'â', 'e'] },
      { t: 'match', say: 'Bé kéo mỗi chữ đến đúng hình nhé.', p: [['e', '🚲', 'chữ e', 'xe đạp'], ['ê', '🐐', 'chữ ê', 'con dê']] },
    ] },
    { title: 'Chữ u, ư', icon: '🦉', qs: [
      { t: 'pick', say: 'Bé chạm vào chữ u nhé.', o: ['u', 'ư', 'o'] },
      { t: 'pick', say: 'Bé chạm vào chữ ư nhé.', o: ['ư', 'u', 'ơ'] },
      { t: 'pick', say: 'Con cú. Tiếng cú có chữ nào?', show: { pic: ['🦉', 'cú'] }, o: ['u', 'ư', 'ô'] },
      { t: 'pick', say: 'Sư tử. Tiếng sư có chữ nào?', show: { pic: ['🦁', 'sư tử'] }, o: ['ư', 'u', 'a'] },
      { t: 'pick', say: 'Quả dưa hấu. Tiếng dưa có chữ nào?', show: { pic: ['🍉', 'dưa'] }, o: ['ư', 'u', 'e'] },
      { t: 'match', say: 'Bé kéo mỗi chữ đến đúng hình nhé.', p: [['u', '🦉', 'chữ u', 'con cú'], ['ư', '🦁', 'chữ ư', 'sư tử']] },
    ] },
    { title: 'Tập tô chữ', icon: '✏️', qs: [
      { t: 'trace', ch: 'o', say: 'Bé tô theo nét chữ o nhé.' },
      { t: 'trace', ch: 'ô', say: 'Bé tô theo nét chữ ô nhé.' },
      { t: 'trace', ch: 'a', say: 'Bé tô theo nét chữ a nhé.' },
      { t: 'trace', ch: 'e', say: 'Bé tô theo nét chữ e nhé.' },
      { t: 'trace', ch: 'u', say: 'Bé tô theo nét chữ u nhé.' },
    ] },
  ],
  ta: [
    { title: 'Con vật', icon: '🐶', qs: [
      { t: 'pick', say: ['Bé nghe và chạm vào đúng con vật nhé.', 'en:cat'], show: { ear: 1 }, o: ['🐱', '🐶', '🐟'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:dog'], show: { ear: 1 }, o: ['🐶', '🐦', '🐱'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:fish'], show: { ear: 1 }, o: ['🐟', '🦆', '🐶'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:bird'], show: { ear: 1 }, o: ['🐦', '🐟', '🐱'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:duck'], show: { ear: 1 }, o: ['🦆', '🐦', '🐶'] },
      { t: 'match', say: 'Bé kéo mỗi con vật đến đúng chỗ nhé.', p: [['🐱', '🐱', 'en:cat', 'en:cat'], ['🐶', '🐶', 'en:dog', 'en:dog'], ['🦆', '🦆', 'en:duck', 'en:duck']] },
    ] },
    { title: 'Màu sắc', icon: '🎨', qs: [
      { t: 'pick', say: ['Bé nghe và chạm vào đúng màu nhé.', 'en:red'], show: { ear: 1 }, o: ['color:#ef3b3b', 'color:#3b7bef', 'color:#f5d21c'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:blue'], show: { ear: 1 }, o: ['color:#3b7bef', 'color:#3fbf4a', 'color:#ef3b3b'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:yellow'], show: { ear: 1 }, o: ['color:#f5d21c', 'color:#ff8c1a', 'color:#3b7bef'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:green'], show: { ear: 1 }, o: ['color:#3fbf4a', 'color:#ef3b3b', 'color:#f5d21c'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:orange'], show: { ear: 1 }, o: ['color:#ff8c1a', 'color:#ff7bc0', 'color:#3fbf4a'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:pink'], show: { ear: 1 }, o: ['color:#ff7bc0', 'color:#ef3b3b', 'color:#3b7bef'] },
    ] },
    { title: 'Số đếm', icon: '🔢', qs: [
      { t: 'pick', say: ['Bé nghe và chạm vào đúng số nhé.', 'en:one'], show: { ear: 1 }, o: ['1', '3', '5'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:two'], show: { ear: 1 }, o: ['2', '4', '1'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:three'], show: { ear: 1 }, o: ['3', '5', '2'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:four'], show: { ear: 1 }, o: ['4', '1', '3'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:five'], show: { ear: 1 }, o: ['5', '2', '4'] },
      { t: 'pick', say: ['Bé đếm và nghe nhé.', 'en:How many apples? Three!', 'Bé chạm vào nhóm có ba quả táo nhé.'], o: ['🍎🍎🍎', '🍎🍎', '🍎🍎🍎🍎'] },
    ] },
    { title: 'Hoa quả', icon: '🍌', qs: [
      { t: 'pick', say: ['Bé nghe và chạm vào đúng quả nhé.', 'en:apple'], show: { ear: 1 }, o: ['🍎', '🍌', '🍇'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:banana'], show: { ear: 1 }, o: ['🍌', '🍊', '🍎'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:orange'], show: { ear: 1 }, o: ['🍊', '🍉', '🍌'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:grapes'], show: { ear: 1 }, o: ['🍇', '🍎', '🥭'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:watermelon'], show: { ear: 1 }, o: ['🍉', '🍇', '🍊'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:mango'], show: { ear: 1 }, o: ['🥭', '🍌', '🍉'] },
    ] },
    { title: 'Cơ thể', icon: '👀', qs: [
      { t: 'pick', say: ['Bé nghe và chạm vào đúng hình nhé.', 'en:eyes'], show: { ear: 1 }, o: ['👀', '👂', '✋'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:nose'], show: { ear: 1 }, o: ['👃', '👄', '👀'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:ears'], show: { ear: 1 }, o: ['👂', '👃', '🦶'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:mouth'], show: { ear: 1 }, o: ['👄', '👀', '✋'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:hand'], show: { ear: 1 }, o: ['✋', '🦶', '👂'] },
      { t: 'pick', say: ['Bé nghe và chọn nhé.', 'en:foot'], show: { ear: 1 }, o: ['🦶', '✋', '👃'] },
    ] },
  ],
  kn: [
    { title: 'Chào hỏi lễ phép', icon: '👋', qs: [
      { t: 'pick', say: 'Buổi sáng đến lớp, bé gặp cô giáo. Bé sẽ làm gì? Khoanh tay chào cô, chạy vào lớp luôn, hay quay mặt đi?', show: { scene: '🏫 👩‍🏫 🧒' },
        o: [{ e: '🙇', t: 'Khoanh tay chào cô' }, { e: '🏃', t: 'Chạy vào lớp luôn' }, { e: '🙈', t: 'Quay mặt đi' }] },
      { t: 'pick', say: 'Bé gặp bạn cùng lớp. Bé nên vẫy tay chào bạn, hay đứng im không nói gì?', show: { scene: '🧒 👧' },
        o: [{ e: '👋', t: 'Vẫy tay chào bạn' }, { e: '😶', t: 'Đứng im không nói gì' }] },
      { t: 'pick', say: 'Tan học, mẹ đến đón. Trước khi về, bé nói gì với cô? Con chào cô con về ạ, hay chạy ra luôn?', show: { scene: '👩‍🏫 🧒 👩' },
        o: [{ e: '🙇', t: 'Con chào cô, con về ạ' }, { e: '🏃', t: 'Chạy ra luôn' }] },
      { t: 'pick', say: 'Bà cho bé quả táo. Bé nhận bằng hai tay và nói cảm ơn bà ạ, hay giật lấy rồi chạy đi?', show: { scene: '👵 🍎 🧒' },
        o: [{ e: '🤲', t: 'Nhận bằng hai tay, cảm ơn bà' }, { e: '🏃', t: 'Giật lấy rồi chạy đi' }] },
      { t: 'pick', say: 'Bé lỡ va vào bạn làm bạn ngã. Bé nên xin lỗi và đỡ bạn dậy, hay cười bạn?', show: { scene: '🧒 💥 👧' },
        o: [{ e: '🤝', t: 'Xin lỗi, đỡ bạn dậy' }, { e: '😆', t: 'Cười bạn' }] },
    ] },
    { title: 'Xin phép cô', icon: '🙋', qs: [
      { t: 'pick', say: 'Trong giờ học, bé muốn đi vệ sinh. Bé nên giơ tay xin phép cô, tự chạy ra ngoài, hay ngồi cố nhịn?', show: { scene: '🏫 🚻 🧒' },
        o: [{ e: '🙋', t: 'Giơ tay xin phép cô' }, { e: '🏃', t: 'Tự chạy ra ngoài' }, { e: '😣', t: 'Ngồi cố nhịn' }] },
      { t: 'pick', say: 'Cô hỏi cả lớp, bé biết câu trả lời. Bé nên giơ tay chờ cô gọi, hay nói to ngay lập tức?', show: { scene: '👩‍🏫 ❓ 🧒' },
        o: [{ e: '🙋', t: 'Giơ tay chờ cô gọi' }, { e: '📢', t: 'Nói to ngay' }] },
      { t: 'pick', say: 'Bé thấy khát nước trong giờ học. Bé nên xin phép cô đi uống nước, hay tự bỏ đi?', show: { scene: '🧒 🥤' },
        o: [{ e: '🙋', t: 'Xin phép cô đi uống nước' }, { e: '🚶', t: 'Tự bỏ đi' }] },
      { t: 'pick', say: 'Bé muốn dùng bút màu của bạn. Bé nên hỏi mượn: cho tớ mượn nhé, hay tự lấy luôn?', show: { scene: '🧒 🖍️ 👧' },
        o: [{ e: '🗣️', t: 'Hỏi mượn bạn' }, { e: '✊', t: 'Tự lấy luôn' }] },
      { t: 'pick', say: 'Bé thấy mệt và đau bụng ở lớp. Bé nên nói ngay với cô giáo, hay giấu không nói?', show: { scene: '🤒 👩‍🏫' },
        o: [{ e: '🗣️', t: 'Nói ngay với cô' }, { e: '🤐', t: 'Giấu không nói' }] },
    ] },
    { title: 'Xếp hàng, chờ lượt', icon: '🚶', qs: [
      { t: 'pick', say: 'Đến giờ ăn trưa, các bạn đang xếp hàng. Bé nên xếp hàng chờ đến lượt, hay chen lên trước?', show: { scene: '🧒 🧒 🧒 🍱' },
        o: [{ e: '🚶', t: 'Xếp hàng chờ lượt' }, { e: '💨', t: 'Chen lên trước' }] },
      { t: 'pick', say: 'Nhiều bạn đang rửa tay. Bé nên đứng chờ đến lượt mình, hay đẩy bạn ra?', show: { scene: '🧼 🚰 🧒' },
        o: [{ e: '⏳', t: 'Đứng chờ đến lượt' }, { e: '👐', t: 'Đẩy bạn ra' }] },
      { t: 'pick', say: 'Khi đi cầu thang, bé nên đi từ từ và vịn tay vịn, hay chạy nhảy xô đẩy?', show: { scene: '🪜 🧒' },
        o: [{ e: '🚶', t: 'Đi từ từ, vịn tay vịn' }, { e: '🤸', t: 'Chạy nhảy xô đẩy' }] },
      { t: 'pick', say: 'Chơi cầu trượt, bé nên lần lượt từng bạn một, hay tranh nhau trượt?', show: { scene: '🛝 🧒 👧' },
        o: [{ e: '👫', t: 'Lần lượt từng bạn' }, { e: '😤', t: 'Tranh nhau trượt' }] },
      { t: 'pick', say: 'Cô dặn cả lớp đi thành hàng ra sân. Bé nên đi theo hàng, hay chạy đi chơi một mình?', show: { scene: '👩‍🏫 🧒 🧒 🧒' },
        o: [{ e: '🚶', t: 'Đi theo hàng' }, { e: '🏃', t: 'Chạy đi một mình' }] },
    ] },
    { title: 'Đồ dùng học tập', icon: '✏️', qs: [
      { t: 'pick', say: 'Bé chạm vào đồ dùng học tập nhé.', o: ['✏️', '🧸', '🍭'] },
      { t: 'pick', say: 'Cái nào bé mang đi học để đọc?', o: ['📚', '⚽', '🎮'] },
      { t: 'pick', say: 'Bé đựng sách vở trong cái gì để mang đến lớp?', o: ['🎒', '🛒', '🧺'] },
      { t: 'pick', say: 'Tô màu xong, bé nên cất bút màu vào hộp gọn gàng, hay vứt lung tung?', show: { scene: '🖍️ 📦' },
        o: [{ e: '📦', t: 'Cất vào hộp gọn gàng' }, { e: '🌪️', t: 'Vứt lung tung' }] },
      { t: 'pick', say: 'Bé nên giữ sách vở sạch đẹp, hay vẽ bậy lên sách?', show: { scene: '📖 🧒' },
        o: [{ e: '✨', t: 'Giữ sách sạch đẹp' }, { e: '🖊️', t: 'Vẽ bậy lên sách' }] },
      { t: 'match', say: 'Bé kéo mỗi đồ dùng đến đúng chỗ nhé.', p: [['✏️', '✏️', 'cái bút chì', 'cái bút chì'], ['📏', '📏', 'cái thước kẻ', 'cái thước kẻ'], ['🎒', '🎒', 'cái cặp sách', 'cái cặp sách']] },
    ] },
    { title: 'An toàn cho bé', icon: '🛡️', qs: [
      { t: 'pick', say: 'Một người lạ cho bé kẹo và rủ đi theo. Bé nên từ chối và chạy đến chỗ cô hoặc bố mẹ, hay nhận kẹo và đi theo?', show: { scene: '🕴️ 🍬 🧒' },
        o: [{ e: '🙅', t: 'Từ chối, chạy đến chỗ cô, bố mẹ' }, { e: '🍬', t: 'Nhận kẹo và đi theo' }] },
      { t: 'pick', say: 'Bé bị lạc mẹ ở siêu thị. Bé nên đứng yên và nhờ cô chú bán hàng giúp, hay chạy đi tìm lung tung?', show: { scene: '🏬 😢 🧒' },
        o: [{ e: '🧍', t: 'Đứng yên, nhờ cô chú bán hàng' }, { e: '🏃', t: 'Chạy đi tìm lung tung' }] },
      { t: 'pick', say: 'Khi qua đường, bé nên nắm tay người lớn, hay chạy qua một mình?', show: { scene: '🚗 🚸 🧒' },
        o: [{ e: '🤝', t: 'Nắm tay người lớn' }, { e: '🏃', t: 'Chạy qua một mình' }] },
      { t: 'pick', say: 'Đèn giao thông màu nào thì được đi?', show: { scene: '🚦' }, o: ['color:#3fbf4a', 'color:#ef3b3b', 'color:#f5d21c'] },
      { t: 'pick', say: 'Thấy ổ cắm điện, bé nên tránh xa không chạm vào, hay thò tay vào nghịch?', show: { scene: '🔌 ⚡' },
        o: [{ e: '🙅', t: 'Tránh xa, không chạm' }, { e: '👆', t: 'Thò tay vào nghịch' }] },
    ] },
  ],
} };

// Gắn mã cho từng bài và từng câu (để lưu tiến độ, ôn câu sai). Gọi sau khi nạp xong mọi file bài học.
function finalizeLessons() {
  for (const st in LESSONS) for (const sub in LESSONS[st]) LESSONS[st][sub].forEach((L, i) => {
    L.id = st + '-' + sub + '-' + (i + 1); L.sub = sub; L.stage = +st; L.idx = i;
    L.say = 'Bài ' + (i + 1) + ': ' + L.title;
    L.qs.forEach((q, j) => { q.id = L.id + '-' + (j + 1); });
  });
}

// Tất cả câu cần thu giọng (dùng cho công cụ tạo file giọng đọc)
function allVoiceTexts() {
  const out = new Set(), add = s => { if (Array.isArray(s)) s.forEach(add); else if (s) out.add(s); };
  Object.values(PH).forEach(add);
  SUBJECTS.forEach(s => add(s.say));
  if (typeof TTPH !== 'undefined') { Object.values(TTPH).forEach(add); ZONES.forEach(z => add(z.say)); }
  for (const st in LESSONS) for (const sub in LESSONS[st]) for (const L of LESSONS[st][sub]) {
    add(L.say);
    for (const q of L.qs) { add(q.say); (q.p || []).forEach(p => { add(p[2]); add(p[3]); }); }
  }
  return [...out];
}
