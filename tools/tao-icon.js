// Vẽ biểu tượng ứng dụng (ngôi sao vàng trên nền cam) ra icon-192.png và icon-512.png, không cần thư viện ngoài.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.join(__dirname, '..');

function draw(N) {
  const px = Buffer.alloc(N * N * 4), SS = 3;
  const star = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? .19 : .42) * N; star.push([N / 2 + r * Math.cos(a), N * .53 + r * Math.sin(a)]); }
  const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; return c; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let r = 0, g = 0, b = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const X = x + (sx + .5) / SS, Y = y + (sy + .5) / SS;
      const d = Math.hypot(X - N / 2, Y - N / 2);
      let c = [255, 170, 60];                                   // nền cam
      if (d < N * .44) c = [255, 248, 232];                     // vòng tròn kem
      if (inPoly(X, Y, star)) c = [255, 206, 40];               // ngôi sao
      r += c[0]; g += c[1]; b += c[2];
    }
    const i = (y * N + x) * 4, n = SS * SS;
    px[i] = r / n; px[i + 1] = g / n; px[i + 2] = b / n; px[i + 3] = 255;
  }
  return png(N, px);
}
function png(N, px) {
  const raw = Buffer.alloc((N * 4 + 1) * N);
  for (let y = 0; y < N; y++) px.copy(raw, y * (N * 4 + 1) + 1, y * N * 4, (y + 1) * N * 4);
  const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(N, 0); ih.writeUInt32BE(N, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
for (const n of [192, 512]) fs.writeFileSync(path.join(root, `icon-${n}.png`), draw(n));
console.log('Đã vẽ biểu tượng');
