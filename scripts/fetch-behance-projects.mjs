/**
 * Snapshots public projects from a Behance profile into app/data/projects.ts,
 * including each gallery's images, text, and video embeds for the details page.
 *
 * Behance no longer offers a public API, so this talks to the same GraphQL
 * and gallery pages the site itself uses:
 *
 *   node scripts/fetch-behance-projects.mjs
 *   node scripts/fetch-behance-projects.mjs --user Fouad-Mazid
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const USERNAME = process.argv.includes('--user')
  ? process.argv[process.argv.indexOf('--user') + 1]
  : 'Fouad-Mazid'

const OUTPUT = fileURLToPath(new URL('../app/data/projects.ts', import.meta.url))
const ENDPOINT = 'https://www.behance.net/v3/graphql'
const BCP = '4c34489d-914c-46cd-b44c-dfd0e661136d'
const FEATURED_COUNT = 12
const PAGE_SIZE = 12
const GALLERY_CONCURRENCY = 3

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0'

const FEATURED_SPANS = [
  'hero',
  'landscape',
  'landscape',
  'third',
  'third',
  'third',
  'tall',
  'wide',
  'splitWide',
  'splitNarrow',
  'half',
  'band',
]

const FIELD_PRIORITY = [
  { service: 'graphic-design-packaging-design', fields: ['packaging', 'product design'] },
  { service: 'logo-design-visual-identity', fields: ['branding', 'icon design'] },
  {
    service: 'graphic-design-packaging-design',
    fields: [
      'graphic design',
      'advertising',
      'illustration',
      'character design',
      'drawing',
      'digital art',
      'art direction',
      'photography',
      'retouching',
    ],
  },
]

const QUERY = `query GetProfileProjects($username: String, $after: String) {
  user(username: $username) {
    profileProjects(first: ${PAGE_SIZE}, after: $after) {
      pageInfo { endCursor hasNextPage }
      nodes {
        id
        name
        slug
        url
        publishedOn
        fields { label slug }
        covers {
          size_808 { url width height }
          size_404 { url width height }
        }
      }
    }
  }
}`

const headers = {
  'User-Agent': UA,
  Origin: 'https://www.behance.net',
  'X-BCP': BCP,
  Cookie: `bcp=${BCP}`,
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function mapPool(items, limit, fn) {
  const out = new Array(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      out[index] = await fn(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}

async function fetchPage(after) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      ...headers,
      Referer: `https://www.behance.net/${USERNAME}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { username: USERNAME, after },
    }),
  })

  const json = await res.json()
  const connection = json?.data?.user?.profileProjects
  if (!connection) {
    throw new Error(`Behance returned no projects for ${USERNAME}: ${JSON.stringify(json).slice(0, 400)}`)
  }

  return connection
}

function slugify(name, id) {
  const base = String(name || id)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return base || String(id)
}

function uniqueSlug(name, id, used) {
  let slug = slugify(name, id)
  if (used.has(slug)) slug = `${slug}-${id}`
  used.add(slug)
  return slug
}

function fieldLabels(node) {
  return (node.fields ?? []).map(field => String(field.slug || field.label || '').toLowerCase())
}

function mapService(node) {
  const labels = fieldLabels(node)
  for (const group of FIELD_PRIORITY) {
    if (group.fields.some(field => labels.includes(field))) return group.service
  }
  return 'graphic-design-packaging-design'
}

function pickCover(node) {
  const cover = node.covers?.size_808 || node.covers?.size_404
  if (!cover?.url) return null

  return {
    url: cover.url.replace(/\/projects\/(?:max_)?\d+\//, '/projects/original/'),
    width: cover.width || 808,
    height: cover.height || 632,
  }
}

function decodeEntities(value) {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
}

function htmlToText(html) {
  return decodeEntities(String(html || ''))
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function compactText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function isOutro(text) {
  return /thank you for watching/i.test(text) || /like us on/i.test(text)
}

function extractVideo(html) {
  const source = String(html || '')
  const youtube = source.match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]+)/i)
  if (youtube) return { type: 'youtube', id: youtube[1] }
  const vimeo = source.match(/player\.vimeo\.com\/video\/(\d+)/i)
  if (vimeo) return { type: 'vimeo', id: vimeo[1] }
  return null
}

function pickImage(module) {
  const sizes = (module.imageSizes?.allAvailable ?? []).filter((size) => {
    const url = size?.url
    return url && !url.includes('_webp') && !url.includes('_still')
  })

  const rank = (url) => {
    if (url.includes('/source/')) return 0
    if (url.includes('/fs/')) return 1
    if (url.includes('/max_3840/')) return 2
    if (url.includes('/hd/')) return 3
    if (url.includes('/max_1200/') || url.includes('/1400_opt_1/')) return 4
    if (url.includes('/disp/')) return 5
    return 6
  }

  sizes.sort((a, b) => rank(a.url) - rank(b.url) || (b.width || 0) - (a.width || 0))
  const pick = sizes[0]
  const src = pick?.url || module.src
  if (!src) return null

  const width = pick?.width || module.width || 1600
  const height = module.width
    ? Math.max(1, Math.round(width * (module.height || module.width) / module.width))
    : (pick?.height || module.height || width)

  const image = {
    type: 'image',
    src,
    width,
    height,
  }

  if (module.altText) image.alt = module.altText
  if (module.fullBleed) image.fullBleed = true
  return image
}

function parseModules(rawModules, description) {
  const modules = []
  const seenVideo = new Set()
  const desc = compactText(description)
  const unknown = new Set()

  function push(module) {
    if (!module) return
    const type = module.__typename || module.type || ''

    if (type === 'ImageModule') {
      const image = pickImage(module)
      if (image) modules.push(image)
      return
    }

    if (type === 'TextModule') {
      const text = htmlToText(module.text)
      if (!text || isOutro(text) || (desc && compactText(text) === desc)) return
      const item = { type: 'text', text }
      if (module.alignment === 'center') item.align = 'center'
      modules.push(item)
      return
    }

    if (type === 'EmbedModule' || type === 'VideoModule') {
      const video = extractVideo(module.originalEmbed || module.fluidEmbed || module.embed || module.src)
      if (!video || seenVideo.has(video.id)) return
      seenVideo.add(video.id)
      modules.push(video)
      return
    }

    if (type === 'MediaCollectionModule') {
      const nested = module.components || module.modules || module.mediaCollection || []
      for (const child of nested) push(child)
      return
    }

    if (type) unknown.add(type)
  }

  for (const module of rawModules ?? []) push(module)
  return { modules, unknown: [...unknown] }
}

function extractStore(html) {
  const startTag = 'id="beconfig-store_state">'
  const start = html.indexOf(startTag)
  if (start < 0) return null
  const jsonStart = start + startTag.length
  const jsonEnd = html.indexOf('</script>', jsonStart)
  return JSON.parse(html.slice(jsonStart, jsonEnd))
}

async function fetchGallery(id) {
  const res = await fetch(`https://www.behance.net/gallery/${id}/a`, {
    headers: {
      ...headers,
      Accept: 'text/html,application/xhtml+xml',
      Referer: `https://www.behance.net/${USERNAME}`,
    },
  })

  if (!res.ok) throw new Error(`gallery ${id} HTTP ${res.status}`)

  const store = extractStore(await res.text())
  const project = store?.project?.project
  if (!project) throw new Error(`gallery ${id} had no project store`)

  const description = htmlToText(project.description || '')
  const parsed = parseModules(project.modules || project.allModules, description)

  return {
    description: description || undefined,
    publishedOn: project.publishedOn || undefined,
    modules: parsed.modules,
    unknown: parsed.unknown,
  }
}

function printProject(project) {
  const lines = [
    '  {',
    `    slug: ${JSON.stringify(project.slug)},`,
    `    name: ${JSON.stringify(project.name)},`,
    `    service: ${JSON.stringify(project.service)},`,
    `    cover: ${JSON.stringify(project.cover)},`,
    `    width: ${project.width},`,
    `    height: ${project.height},`,
    `    span: ${JSON.stringify(project.span)},`,
    `    featured: ${project.featured},`,
    `    behanceId: ${project.behanceId},`,
  ]

  if (project.sourceUrl) lines.push(`    sourceUrl: ${JSON.stringify(project.sourceUrl)},`)
  if (project.publishedOn) lines.push(`    publishedOn: ${project.publishedOn},`)
  if (project.description) lines.push(`    description: ${JSON.stringify(project.description)},`)
  if (project.modules?.length) {
    const json = JSON.stringify(project.modules, null, 4)
      .split('\n')
      .map((line, index) => (index === 0 ? line : `    ${line}`))
      .join('\n')
    lines.push(`    modules: ${json},`)
  }

  lines.push('  }')
  return lines.join('\n')
}

const nodes = []
let after = null

for (let page = 0; page < 20; page += 1) {
  const batch = await fetchPage(after)
  nodes.push(...(batch.nodes ?? []))
  console.log(`page ${page + 1}: ${batch.nodes?.length ?? 0} (total ${nodes.length})`)

  if (!batch.pageInfo?.hasNextPage || !batch.nodes?.length) break
  after = batch.pageInfo.endCursor
  await sleep(400)
}

if (!nodes.length) throw new Error(`No public projects found for ${USERNAME}`)

const used = new Set()
const listed = nodes.flatMap((node, index) => {
  const cover = pickCover(node)
  if (!cover) {
    console.warn(`skip ${node.id} ${node.name}: no cover`)
    return []
  }

  return [{
    slug: uniqueSlug(node.name, node.id, used),
    name: node.name,
    service: mapService(node),
    cover: cover.url,
    width: cover.width,
    height: cover.height,
    span: FEATURED_SPANS[index % FEATURED_SPANS.length],
    featured: index < FEATURED_COUNT,
    behanceId: node.id,
    sourceUrl: node.url,
    publishedOn: node.publishedOn,
  }]
})

console.log(`fetching ${listed.length} galleries…`)

const unknownTypes = new Set()
const projects = await mapPool(listed, GALLERY_CONCURRENCY, async (project, index) => {
  try {
    const details = await fetchGallery(project.behanceId)
    for (const type of details.unknown) unknownTypes.add(type)
    console.log(`gallery ${index + 1}/${listed.length}: ${project.name} (${details.modules.length} modules)`)
    return {
      ...project,
      description: details.description,
      publishedOn: details.publishedOn || project.publishedOn,
      modules: details.modules,
    }
  }
  catch (error) {
    console.warn(`gallery ${index + 1}/${listed.length} failed: ${project.name}`, error.message)
    return project
  }
})

const file = `import type { ServiceSlug } from './services'

export type ProjectSpan =
  | 'hero'
  | 'landscape'
  | 'third'
  | 'tall'
  | 'wide'
  | 'splitWide'
  | 'splitNarrow'
  | 'half'
  | 'band'

export type ProjectModule =
  | {
      type: 'image'
      src: string
      width: number
      height: number
      alt?: string
      fullBleed?: boolean
    }
  | {
      type: 'text'
      text: string
      align?: 'center'
    }
  | {
      type: 'youtube'
      id: string
    }
  | {
      type: 'vimeo'
      id: string
    }

export type ProjectRecord = {
  slug: string
  name: string
  service: ServiceSlug
  cover: string
  width: number
  height: number
  span: ProjectSpan
  featured: boolean
  behanceId: number
  motionSrc?: string
  sourceUrl?: string
  publishedOn?: number
  description?: string
  modules?: readonly ProjectModule[]
}

/**
 * Public projects from https://www.behance.net/${USERNAME}
 * Generated by scripts/fetch-behance-projects.mjs — do not edit by hand.
 */
export const projects: readonly ProjectRecord[] = [
${projects.map(printProject).join(',\n')}
]

export type ProjectSlug = (typeof projects)[number]['slug']
`

writeFileSync(OUTPUT, file)
if (unknownTypes.size) console.warn('unhandled module types', [...unknownTypes])
console.log(`wrote ${projects.length} projects to ${OUTPUT}`)
