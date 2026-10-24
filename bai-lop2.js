// Chặng 4 – Lớp 2 (bám theo chương trình GDPT 2018)
const sentence = (en, tiles) => ({ t: 'order', say: ['Bé nghe rồi xếp thành câu nhé.', 'en:' + en], show: { ear: 1 }, tiles });
const PASS_GA = 'Gà trống nhà em có bộ lông màu đỏ tía, cái mào đỏ chót. Sáng nào gà trống cũng gáy ò ó o để đánh thức cả nhà dậy.';
const PASS_LAN = 'Chủ nhật, bố đưa Lan về quê thăm ông bà. Ông dẫn Lan ra vườn hái ổi. Bà nấu chè đỗ đen thật ngon. Lan rất vui.';
const PASS_THU = 'Mùa thu, trời trong xanh. Những chiếc lá vàng rơi xào xạc. Đêm rằm, các bạn nhỏ rước đèn ông sao.';
const readQ = (passage, say, o) => ({ t: 'pick', say, show: { read: passage }, o });

LESSONS[4] = {
  toan: [
    { title: 'Cộng trừ có nhớ trong phạm vi 100', icon: '🧮', qs: [
      calc(38, '+', 25), calc(47, '+', 36), calc(59, '+', 7), calc(29, '+', 45), calc(71, '-', 36), calc(80, '-', 27), calc(62, '-', 8),
      story('Thùng thứ nhất có 45 lít dầu, thùng thứ hai nhiều hơn thùng thứ nhất 18 lít. Hỏi thùng thứ hai có bao nhiêu lít dầu?', 63, [27]),
    ] },
    { title: 'Bảng nhân 2 và 5', icon: '✖️', qs: [
      calc(2, '×', 3), calc(2, '×', 7), calc(2, '×', 9), calc(5, '×', 4), calc(5, '×', 6), calc(5, '×', 9),
      story('Mỗi con gà có 2 chân. Hỏi 8 con gà có bao nhiêu chân?', 16, [10, 18]),
      story('Mỗi bàn tay có 5 ngón. Hỏi 4 bàn tay có bao nhiêu ngón?', 20, [9, 25]),
    ] },
    { title: 'Bảng chia 2 và 5', icon: '➗', qs: [
      calc(10, ':', 2), calc(16, ':', 2), calc(18, ':', 2), calc(25, ':', 5), calc(40, ':', 5), calc(35, ':', 5),
      story('Có 20 cái kẹo chia đều cho 5 bạn. Hỏi mỗi bạn được mấy cái kẹo?', 4, [15, 5]),
      story('Có 14 chiếc đũa, mỗi đôi có 2 chiếc. Hỏi có bao nhiêu đôi đũa?', 7, [12, 28]),
    ] },
    { title: 'Giờ, phút, ngày, tháng', icon: '⏰', qs: [
      { t: 'pick', say: 'Đồng hồ chỉ mấy giờ?', show: { clock: [8, 30] }, o: ['8 giờ 30 phút', '6 giờ 40 phút', '8 giờ', '9 giờ 30 phút'] },
      { t: 'pick', say: 'Đồng hồ chỉ mấy giờ?', show: { clock: [3, 15] }, o: ['3 giờ 15 phút', '3 giờ 3 phút', '3 giờ 45 phút', '15 giờ 3 phút'] },
      { t: 'pick', say: 'Đồng hồ chỉ mấy giờ?', show: { clock: [11, 30] }, o: ['11 giờ 30 phút', '6 giờ 55 phút', '12 giờ 30 phút', '11 giờ'] },
      { t: 'pick', say: 'Bé chạm vào đồng hồ chỉ 2 giờ 15 phút nhé.', o: ['clock:2:15', 'clock:3:10', 'clock:2:45', 'clock:2:0'] },
      { t: 'pick', say: 'Một giờ có bao nhiêu phút?', o: ['60', '100', '30', '24'] },
      { t: 'pick', say: 'Một ngày có bao nhiêu giờ?', o: ['24', '12', '60', '7'] },
      { t: 'pick', say: 'Tháng mười có bao nhiêu ngày?', o: ['31', '30', '28', '29'] },
      { t: 'pick', say: 'Ngày 24 tháng 10 là thứ Bảy. Ngày 25 tháng 10 là thứ mấy?', o: ['Chủ nhật', 'Thứ Sáu', 'Thứ Hai', 'Thứ Bảy'] },
    ] },
    { title: 'Số đến 1000, tiền, đo lường', icon: '💵', qs: [
      { t: 'pick', say: 'Số gồm 3 trăm, 4 chục và 5 đơn vị là số nào?', o: ['345', '543', '354', '3045'] },
      { t: 'pick', say: 'Số liền sau của 999 là số nào?', o: ['1000', '998', '1001', '900'] },
      { t: 'pick', say: '1 mét bằng bao nhiêu xăng-ti-mét?', o: ['100', '10', '1000', '50'] },
      { t: 'pick', say: '1 đề-xi-mét bằng bao nhiêu xăng-ti-mét?', o: ['10', '100', '1', '20'] },
      { t: 'pick', say: 'Một tờ 5000 đồng và một tờ 2000 đồng là bao nhiêu tiền?', show: { scene: '💵 💵' }, o: ['7000 đồng', '3000 đồng', '52000 đồng', '70000 đồng'] },
      { t: 'pick', say: 'Mẹ có 10000 đồng, mua bút hết 6000 đồng. Hỏi mẹ còn bao nhiêu tiền?', o: ['4000 đồng', '16000 đồng', '6000 đồng', '5000 đồng'] },
      story('Quả dưa nặng 3 ki-lô-gam, quả bí nặng 5 ki-lô-gam. Hỏi cả hai quả nặng bao nhiêu ki-lô-gam?', 8, [2, 15]),
      story('Can to có 10 lít nước, can nhỏ có 5 lít nước. Hỏi can to nhiều hơn can nhỏ mấy lít?', 5, [15]),
    ] },
  ],
  tv: [
    { title: 'Chính tả ch/tr', icon: '✍️', qs: [
      fill('quả …anh', 'quả chanh.', ['ch', 'tr']), fill('cây …e', 'cây tre.', ['tr', 'ch']),
      fill('con …ó', 'con chó.', ['ch', 'tr']), fill('cái …ống', 'cái trống.', ['tr', 'ch']),
      fill('con …im', 'con chim.', ['ch', 'tr']), fill('ông …ăng', 'ông trăng.', ['tr', 'ch']),
      fill('quả …uối', 'quả chuối.', ['ch', 'tr']), fill('…ường học', 'trường học.', ['tr', 'ch']),
    ] },
    { title: 'Chính tả s/x, l/n', icon: '🖊️', qs: [
      fill('ngôi …ao', 'ngôi sao.', ['s', 'x']), fill('…e đạp', 'xe đạp.', ['x', 's']),
      fill('quyển …ách', 'quyển sách.', ['s', 'x']), fill('màu …anh', 'màu xanh.', ['x', 's']),
      fill('quả …ê', 'quả lê.', ['l', 'n']), fill('cái …ón', 'cái nón.', ['n', 'l']),
      fill('con …ợn', 'con lợn.', ['l', 'n']), fill('…ước uống', 'nước uống.', ['n', 'l']),
    ] },
    { title: 'Từ chỉ sự vật, hoạt động, đặc điểm', icon: '🏷️', qs: [
      { t: 'pick', say: 'Từ nào chỉ hoạt động?', o: ['chạy', 'cái bàn', 'màu đỏ', 'cao'] },
      { t: 'pick', say: 'Từ nào chỉ sự vật?', o: ['quyển vở', 'nhảy', 'xinh', 'hát'] },
      { t: 'pick', say: 'Từ nào chỉ đặc điểm?', o: ['thông minh', 'đọc', 'con mèo', 'viết'] },
      { t: 'pick', say: 'Từ nào chỉ hoạt động?', o: ['quét nhà', 'cái chổi', 'sạch sẽ', 'ngôi nhà'] },
      { t: 'pick', say: 'Từ nào chỉ sự vật?', o: ['cây bàng', 'xanh tốt', 'lớn lên', 'tưới'] },
      { t: 'pick', say: 'Từ nào chỉ đặc điểm?', o: ['cao lớn', 'cây cau', 'trèo', 'ngủ'] },
      { t: 'pick', say: 'Từ nào cùng nghĩa với chăm chỉ?', o: ['siêng năng', 'lười biếng', 'vui vẻ', 'nhanh nhẹn'] },
      { t: 'pick', say: 'Từ nào trái nghĩa với cao?', o: ['thấp', 'to', 'dài', 'béo'] },
    ] },
    { title: 'Đọc hiểu', icon: '📖', qs: [
      readQ(PASS_GA, 'Bé đọc đoạn văn. Gà trống có bộ lông màu gì?', ['Đỏ tía', 'Trắng tinh', 'Đen nhánh', 'Vàng óng']),
      readQ(PASS_GA, 'Gà trống gáy vào lúc nào?', ['Buổi sáng', 'Buổi trưa', 'Buổi tối', 'Nửa đêm']),
      readQ(PASS_GA, 'Gà trống gáy để làm gì?', ['Đánh thức cả nhà', 'Gọi gà con ăn', 'Đuổi mèo', 'Chào ông mặt trời lặn']),
      readQ(PASS_LAN, 'Bé đọc đoạn văn. Lan về quê thăm ai?', ['Ông bà', 'Cô giáo', 'Bạn Mai', 'Chú Tư']),
      readQ(PASS_LAN, 'Ông dẫn Lan đi đâu?', ['Ra vườn hái ổi', 'Đi chợ', 'Ra biển', 'Đi câu cá']),
      readQ(PASS_LAN, 'Bà nấu món gì?', ['Chè đỗ đen', 'Cơm rang', 'Canh cua', 'Bánh chưng']),
      readQ(PASS_LAN, 'Lan về quê vào ngày nào?', ['Chủ nhật', 'Thứ Hai', 'Thứ Năm', 'Thứ Bảy']),
      readQ(PASS_THU, 'Bé đọc đoạn văn. Đoạn văn nói về mùa nào?', ['Mùa thu', 'Mùa hè', 'Mùa xuân', 'Mùa đông']),
    ] },
    { title: 'Câu và dấu câu', icon: '❓', qs: [
      { t: 'order', say: 'Bé xếp thành câu: Em là học sinh lớp Hai.', tiles: ['Em', 'là', 'học sinh', 'lớp Hai'] },
      { t: 'order', say: 'Bé xếp thành câu: Chúng em đang tập múa.', tiles: ['Chúng em', 'đang', 'tập', 'múa'] },
      { t: 'order', say: 'Bé xếp thành câu: Mùa xuân, cây cối đâm chồi nảy lộc.', tiles: ['Mùa xuân,', 'cây cối', 'đâm chồi', 'nảy lộc'] },
      { t: 'order', say: 'Bé xếp thành câu hỏi: Bạn có thích đọc truyện không?', tiles: ['Bạn', 'có', 'thích', 'đọc truyện', 'không?'] },
      { t: 'pick', say: 'Câu nào là câu hỏi?', o: ['Bạn tên là gì?', 'Bạn tên là Hoa.', 'Bạn thật giỏi!', 'Bạn hãy ngồi xuống.'] },
      { t: 'pick', say: 'Cuối câu: Hôm nay trời rất đẹp, cần dấu gì?', show: { word: 'Hôm nay trời rất đẹp …' }, o: ['Dấu chấm (.)', 'Dấu chấm hỏi (?)', 'Dấu phẩy (,)', 'Không cần dấu'] },
      { t: 'pick', say: 'Cuối câu: Con đã ăn cơm chưa, cần dấu gì?', show: { word: 'Con đã ăn cơm chưa …' }, o: ['Dấu chấm hỏi (?)', 'Dấu chấm (.)', 'Dấu phẩy (,)', 'Không cần dấu'] },
      { t: 'pick', say: 'Câu: Mẹ em là bác sĩ, thuộc kiểu câu nào?', show: { word: 'Mẹ em là bác sĩ.' }, o: ['Ai là gì?', 'Ai làm gì?', 'Ai thế nào?'] },
    ] },
  ],
  ta: [
    { title: 'Hoạt động', icon: '🏃', qs: [
      listen('run', ['🏃', '🏊', '💃', '📖']), listen('swim', ['🏊', '🏃', '🎤', '🎨']), listen('dance', ['💃', '🏊', '📖', '🏃']),
      listen('sing', ['🎤', '🎨', '💃', '🏃']), listen('read', ['📖', '🎤', '🏊', '🎨']), listen('draw', ['🎨', '📖', '🏃', '🎤']), listen('sleep', ['😴', '🏃', '🎤', '📖']),
    ] },
    { title: 'Quần áo', icon: '👕', qs: [
      listen('T-shirt', ['👕', '👗', '🧦', '👟']), listen('dress', ['👗', '👕', '🎩', '🧦']), listen('hat', ['🎩', '👟', '👗', '🧤']),
      listen('shoes', ['👟', '🧦', '🎩', '👕']), listen('socks', ['🧦', '👟', '🧤', '👗']), listen('gloves', ['🧤', '🧦', '🎩', '👕']),
    ] },
    { title: 'Thời tiết', icon: '🌦️', qs: [
      listen('sunny', ['☀️', '🌧️', '❄️', '🌬️']), listen('rainy', ['🌧️', '☀️', '☁️', '❄️']), listen('snowy', ['❄️', '🌧️', '☀️', '🌬️']),
      listen('windy', ['🌬️', '☁️', '☀️', '❄️']), listen('cloudy', ['☁️', '☀️', '🌧️', '🌬️']), listen('hot', ['🥵', '🥶', '🌧️', '❄️']), listen('cold', ['🥶', '🥵', '☀️', '🌬️']),
    ] },
    { title: 'Nghe câu, chọn hình', icon: '👂', qs: [
      listen('I have a cat.', ['🐱', '🐶', '🐟', '🐦']), listen('She is happy.', ['😊', '😢', '😠', '😴']),
      listen('It is a big elephant.', ['🐘', '🐭', '🐱', '🐰']), listen('There are three apples.', ['🍎🍎🍎', '🍎', '🍎🍎', '🍎🍎🍎🍎']),
      listen('I like ice cream.', ['🍦', '🍕', '🍚', '🥕']), listen('He is sleeping.', ['😴', '🏃', '🍽️', '📖']),
      listen('It is raining.', ['🌧️', '☀️', '❄️', '🌈']), listen('The bird can fly.', ['🐦', '🐟', '🐢', '🐌']),
    ] },
    { title: 'Xếp câu tiếng Anh', icon: '🧩', qs: [
      sentence('This is my bag.', ['This', 'is', 'my', 'bag.']),
      sentence('I like apples.', ['I', 'like', 'apples.']),
      sentence('What is your name?', ['What', 'is', 'your', 'name?']),
      sentence('How old are you?', ['How', 'old', 'are', 'you?']),
      sentence('I am seven years old.', ['I', 'am', 'seven', 'years', 'old.']),
      sentence('Can you swim?', ['Can', 'you', 'swim?']),
      sentence('I have two pens.', ['I', 'have', 'two', 'pens.']),
    ] },
  ],
  kn: [
    { title: 'Quản lý thời gian', icon: '⏳', qs: [
      { t: 'order', say: 'Bé xếp các việc buổi sáng theo đúng thứ tự nhé.', tiles: [{ e: '⏰', t: 'Thức dậy' }, { e: '🪥', t: 'Đánh răng, rửa mặt' }, { e: '🍜', t: 'Ăn sáng' }, { e: '🎒', t: 'Đeo cặp đi học' }] },
      { t: 'order', say: 'Bé xếp các việc buổi tối theo thứ tự hợp lý nhé.', tiles: [{ e: '🍚', t: 'Ăn tối' }, { e: '📚', t: 'Học bài, soạn cặp' }, { e: '🚿', t: 'Tắm, đánh răng' }, { e: '😴', t: 'Đi ngủ' }] },
      { t: 'pick', say: 'Đi học về, bé nên làm gì trước?', o: [{ e: '📚', t: 'Làm bài tập xong rồi mới chơi' }, { e: '🎮', t: 'Chơi điện tử thật lâu' }, { e: '📺', t: 'Xem ti vi đến tối' }] },
      { t: 'pick', say: 'Bé nên đi ngủ lúc nào để mai dậy sớm?', o: [{ e: '🕘', t: 'Khoảng 9 giờ tối' }, { e: '🕛', t: '12 giờ đêm' }, { e: '🌅', t: 'Khi trời sáng' }] },
      { t: 'pick', say: 'Bé chỉ được xem ti vi 30 phút. Hết giờ bé làm gì?', o: [{ e: '📴', t: 'Tự tắt ti vi' }, { e: '😠', t: 'Khóc đòi xem tiếp' }, { e: '🙈', t: 'Lén xem tiếp' }] },
      { t: 'pick', say: 'Sắp muộn giờ học, bé nên làm gì?', o: [{ e: '⏰', t: 'Hôm sau dậy sớm hơn' }, { e: '🏃', t: 'Chạy vội qua đường' }, { e: '🛏️', t: 'Nghỉ học luôn' }] },
    ] },
    { title: 'Bạn bè, làm việc nhóm', icon: '🤝', qs: [
      { t: 'pick', say: 'Bạn quên mang bút. Bé làm gì?', o: [{ e: '🖊️', t: 'Cho bạn mượn bút' }, { e: '😆', t: 'Cười chê bạn' }, { e: '🙈', t: 'Giả vờ không biết' }] },
      { t: 'pick', say: 'Khi làm việc nhóm, bạn đang nói ý kiến. Bé nên làm gì?', o: [{ e: '👂', t: 'Lắng nghe, chờ bạn nói xong' }, { e: '🗣️', t: 'Nói át lời bạn' }, { e: '🙄', t: 'Quay đi chỗ khác' }] },
      { t: 'pick', say: 'Bé thấy một bạn bị bắt nạt. Bé làm gì?', o: [{ e: '👩‍🏫', t: 'Báo ngay cho cô giáo' }, { e: '👀', t: 'Đứng xem' }, { e: '👊', t: 'Cùng trêu bạn' }] },
      { t: 'pick', say: 'Bạn được điểm cao. Bé nên làm gì?', o: [{ e: '👏', t: 'Chúc mừng bạn' }, { e: '😒', t: 'Ghen tị, không chơi với bạn' }, { e: '🤐', t: 'Nói xấu bạn' }] },
      { t: 'pick', say: 'Bé và bạn cùng muốn chơi một quả bóng. Cách nào tốt nhất?', o: [{ e: '🔄', t: 'Thay phiên nhau, hoặc chơi chung' }, { e: '✊', t: 'Giành lấy' }, { e: '😭', t: 'Khóc ăn vạ' }] },
      { t: 'pick', say: 'Có bạn mới chuyển đến lớp. Bé làm gì?', o: [{ e: '👋', t: 'Chào và rủ bạn cùng chơi' }, { e: '🙈', t: 'Lờ bạn đi' }, { e: '😜', t: 'Trêu bạn' }] },
    ] },
    { title: 'An toàn ở nhà', icon: '🏠', qs: [
      { t: 'pick', say: 'Ở nhà một mình, có người lạ gõ cửa. Bé làm gì?', show: { scene: '🚪 ✊' }, o: [{ e: '🔒', t: 'Không mở cửa, gọi điện cho bố mẹ' }, { e: '🚪', t: 'Mở cửa ngay' }, { e: '🗣️', t: 'Nói là nhà không có ai' }] },
      { t: 'pick', say: 'Bé thấy lọ thuốc trên bàn. Bé làm gì?', show: { scene: '💊' }, o: [{ e: '🙅', t: 'Không tự uống, báo người lớn' }, { e: '😋', t: 'Uống thử như kẹo' }, { e: '🎁', t: 'Mang cho bạn' }] },
      { t: 'pick', say: 'Bé có được tự bật bếp ga không?', show: { scene: '🔥 🍳' }, o: [{ e: '🙅', t: 'Không, chỉ người lớn được bật' }, { e: '👍', t: 'Có, bật để chơi' }] },
      { t: 'pick', say: 'Chơi ở ban công, bé nên làm gì?', show: { scene: '🏢' }, o: [{ e: '🚫', t: 'Không trèo lên lan can' }, { e: '🧗', t: 'Trèo lên ngó xuống' }, { e: '🪑', t: 'Kê ghế để đứng cao hơn' }] },
      { t: 'pick', say: 'Dao kéo sắc, bé cần làm gì?', show: { scene: '🔪 ✂️' }, o: [{ e: '🙅', t: 'Không lấy chơi, nhờ người lớn giúp' }, { e: '⚔️', t: 'Cầm múa như kiếm' }, { e: '🏃', t: 'Cầm chạy quanh nhà' }] },
      { t: 'pick', say: 'Tay đang ướt, bé có nên cắm sạc điện không?', show: { scene: '💧 🔌' }, o: [{ e: '🙅', t: 'Không, lau khô tay và nhờ người lớn' }, { e: '👍', t: 'Có, không sao đâu' }] },
    ] },
    { title: 'Phòng tránh đuối nước, cháy', icon: '🛟', qs: [
      { t: 'pick', say: 'Các bạn rủ đi tắm sông không có người lớn. Bé làm gì?', show: { scene: '🏞️' }, o: [{ e: '🙅', t: 'Từ chối, về báo bố mẹ' }, { e: '🏊', t: 'Đi tắm cùng' }] },
      { t: 'pick', say: 'Khi đi thuyền, bé cần làm gì?', show: { scene: '🚤' }, o: [{ e: '🦺', t: 'Mặc áo phao' }, { e: '🤸', t: 'Đứng nhảy trên thuyền' }, { e: '🖐️', t: 'Thò tay xuống nước' }] },
      { t: 'pick', say: 'Thấy bạn bị đuối nước, bé làm gì?', show: { scene: '🌊 🆘' }, o: [{ e: '📢', t: 'Hô to gọi người lớn, ném phao' }, { e: '🏊', t: 'Tự nhảy xuống cứu' }, { e: '🏃', t: 'Bỏ chạy về nhà' }] },
      { t: 'pick', say: 'Khi có cháy và nhiều khói, bé nên làm gì?', show: { scene: '🔥 💨' }, o: [{ e: '🧎', t: 'Bò thấp, che mũi miệng, thoát ra ngoài' }, { e: '🚪', t: 'Trốn vào tủ quần áo' }, { e: '🛗', t: 'Đi thang máy' }] },
      { t: 'pick', say: 'Bé thấy que diêm, bật lửa. Bé làm gì?', show: { scene: '🔥' }, o: [{ e: '🙅', t: 'Không nghịch, đưa cho người lớn' }, { e: '🔥', t: 'Bật thử cho vui' }] },
      { t: 'pick', say: 'Khi có cháy, gọi số nào?', show: { scene: '🚒' }, o: ['114', '113', '115', '116'] },
    ] },
    { title: 'Hiểu cảm xúc', icon: '😊', qs: [
      { t: 'pick', say: 'Bạn nào đang buồn?', o: ['😢', '😊', '😠', '😨'] },
      { t: 'pick', say: 'Bạn nào đang tức giận?', o: ['😠', '😢', '😊', '😴'] },
      { t: 'pick', say: 'Bạn nào đang sợ hãi?', o: ['😨', '😊', '😠', '😴'] },
      { t: 'pick', say: 'Khi bé đang rất tức giận, bé nên làm gì?', o: [{ e: '🌬️', t: 'Hít thở sâu, đếm đến 10' }, { e: '👊', t: 'Đánh bạn' }, { e: '💥', t: 'Ném đồ đạc' }] },
      { t: 'pick', say: 'Khi bé buồn, bé có thể làm gì?', o: [{ e: '🗣️', t: 'Kể với bố mẹ hoặc cô giáo' }, { e: '🤐', t: 'Giấu một mình mãi' }, { e: '😤', t: 'Cáu gắt với mọi người' }] },
      { t: 'pick', say: 'Bạn bị ngã và khóc. Bé nói gì?', o: [{ e: '🤗', t: 'Bạn có đau không? Để tớ giúp nhé' }, { e: '😆', t: 'Ha ha, ngã rồi' }, { e: '🙄', t: 'Không nói gì, đi chỗ khác' }] },
    ] },
  ],
};
