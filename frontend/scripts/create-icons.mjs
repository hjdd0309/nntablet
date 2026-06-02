// Generates pwa-192x192.png and pwa-512x512.png using only Node built-ins
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xEDB88320 ^ (n >>> 1) : n >>> 1
  return n
})

function crc32(buf) {
  let c = 0xFFFFFFFF
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.allocUnsafe(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.allocUnsafe(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}

function solidPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type: RGB

  // Each scanline: filter byte (0 = None) + RGB pixels
  const row = Buffer.alloc(1 + size * 3)
  row[0] = 0
  for (let x = 0; x < size; x++) {
    row[1 + x * 3] = r
    row[2 + x * 3] = g
    row[3 + x * 3] = b
  }
  const raw = Buffer.concat(Array(size).fill(row))

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// #2A2720 — app's dark charcoal, clean and distinctive as an icon
const [R, G, B] = [42, 39, 32]

writeFileSync('public/pwa-192x192.png', solidPNG(192, R, G, B))
writeFileSync('public/pwa-512x512.png', solidPNG(512, R, G, B))
console.log('✓ pwa-192x192.png, pwa-512x512.png created in public/')
