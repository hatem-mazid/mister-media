/**
 * Generates app/data/worldMap.ts — a dotted world map for the coverage section.
 *
 * Usage: node scripts/generate-world-map.mjs
 *
 * Country outlines come from the public-domain johan/world.geo.json dataset (Natural Earth 110m).
 * Points are sampled on an even grid in Robinson projection space and tested against each
 * country polygon, so each dot is tagged with its ISO3 code. Antarctica is omitted.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SOURCE = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
const OUTPUT = fileURLToPath(new URL('../app/data/worldMap.ts', import.meta.url))

const WIDTH = 1000
const STEP = 6.4
const MIN_LAT = -57

// Robinson projection tables, 5° steps from 0° to 90°.
const PLEN = [1.0000, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9216, 0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322]
const PDFE = [0.0000, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1.0000]
const R = WIDTH / (2 * 0.8487 * Math.PI)

function interp(table, lat) {
  const a = Math.abs(lat)
  const i = Math.min(Math.floor(a / 5), 17)
  const f = (a - i * 5) / 5
  return table[i] + (table[i + 1] - table[i]) * f
}

function projectX(lon, lat) {
  return 0.8487 * R * interp(PLEN, lat) * (lon * Math.PI / 180)
}

function projectY(lat) {
  return -1.3523 * R * interp(PDFE, lat) * Math.sign(lat)
}

function latFromY(y) {
  const target = Math.abs(y) / (1.3523 * R)
  if (target > 1) return null
  let i = 0
  while (i < 18 && PDFE[i + 1] < target) i++
  const f = (target - PDFE[i]) / (PDFE[i + 1] - PDFE[i])
  return -(Math.sign(y) || 1) * (i * 5 + f * 5)
}

function ringBBox(ring) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const [x, y] of ring) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return [minX, minY, maxX, maxY]
}

function inRing(ring, x, y) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

const response = await fetch(SOURCE)
if (!response.ok) throw new Error(`Failed to fetch ${SOURCE}: ${response.status}`)
const geo = await response.json()

const polys = []
const outlineCenters = {}
for (const feature of geo.features) {
  const geom = feature.geometry
  const list = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates
  let largest = null
  for (const rings of list) {
    const bbox = ringBBox(rings[0])
    polys.push({ code: feature.id, rings, bbox })
    const area = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
    if (!largest || area > largest.area) largest = { area, bbox }
  }
  // Fallback centre for countries too small to receive a grid dot.
  const [minLon, minLat, maxLon, maxLat] = largest.bbox
  const lat = (minLat + maxLat) / 2
  outlineCenters[feature.id] = [projectX((minLon + maxLon) / 2, lat), projectY(lat)]
}

function countryAt(lon, lat) {
  for (const p of polys) {
    const [minX, minY, maxX, maxY] = p.bbox
    if (lon < minX || lon > maxX || lat < minY || lat > maxY) continue
    if (!inRing(p.rings[0], lon, lat)) continue
    if (p.rings.slice(1).some(hole => inRing(hole, lon, lat))) continue
    return p.code
  }
  return null
}

const dots = {}
const sums = {}
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
const xHalf = 0.8487 * R * Math.PI

for (let y = projectY(90); y <= projectY(MIN_LAT); y += STEP) {
  const lat = latFromY(y)
  if (lat === null || lat < MIN_LAT) continue
  const rowScale = 0.8487 * R * interp(PLEN, lat)
  for (let x = -xHalf; x <= xHalf; x += STEP) {
    const lon = (x / rowScale) * 180 / Math.PI
    if (lon < -180 || lon > 180) continue
    const code = countryAt(lon, lat)
    if (!code) continue
    const px = Math.round(x * 10) / 10
    const py = Math.round(y * 10) / 10
    ;(dots[code] ||= []).push([px, py])
    const s = (sums[code] ||= { x: 0, y: 0, n: 0 })
    s.x += px
    s.y += py
    s.n++
    if (px < minX) minX = px
    if (px > maxX) maxX = px
    if (py < minY) minY = py
    if (py > maxY) maxY = py
  }
}

const fmt = n => String(Math.round(n * 10) / 10)
const ox = -(minX - STEP)
const oy = -(minY - STEP)
const vbW = fmt(maxX - minX + STEP * 2)
const vbH = fmt(maxY - minY + STEP * 2)

const countryDots = {}
const countryCentroids = {}
let total = 0
for (const code of Object.keys(dots).sort()) {
  countryDots[code] = dots[code].map(([x, y]) => `M${fmt(x + ox)} ${fmt(y + oy)}h0`).join('')
  total += dots[code].length
}
for (const code of Object.keys(outlineCenters).sort()) {
  const s = sums[code]
  const [cx, cy] = s ? [s.x / s.n, s.y / s.n] : outlineCenters[code]
  countryCentroids[code] = [Number(fmt(cx + ox)), Number(fmt(cy + oy))]
}

// The dataset uses "-99" for disputed territories, so keys are always quoted.
const dotsLiteral = Object.entries(countryDots)
  .map(([code, d]) => `  '${code}': '${d}',`)
  .join('\n')

const centroidsLiteral = Object.entries(countryCentroids)
  .map(([code, [x, y]]) => `  '${code}': [${x}, ${y}],`)
  .join('\n')

const output = `// Generated by scripts/generate-world-map.mjs — do not edit by hand.
// Dotted world map in Robinson projection (${STEP}px grid, Antarctica omitted).
// Each country path draws one dot per grid point as a zero-length segment; render with a round line cap.

export const worldMap = {
  viewBox: '0 0 ${vbW} ${vbH}',
  width: ${vbW},
  height: ${vbH},
  dotSize: ${fmt(STEP * 0.62)},
  radius: ${fmt(R)},
  offset: [${fmt(ox)}, ${fmt(oy)}],
} as const

export const countryCentroids: Record<string, readonly [number, number]> = {
${centroidsLiteral}
}

export const countryDots: Record<string, string> = {
${dotsLiteral}
}
`

writeFileSync(OUTPUT, output)
console.log(`Wrote ${OUTPUT}: ${total} dots across ${Object.keys(countryDots).length} countries (${vbW} x ${vbH}).`)
