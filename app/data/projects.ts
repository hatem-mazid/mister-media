import type { ServiceSlug } from './services'

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

export type ProjectRecord = {
  slug: string
  service: ServiceSlug
  cover: string
  width: number
  height: number
  span: ProjectSpan
  featured: boolean
  motionSrc?: string
}

export const projects: readonly ProjectRecord[] = [
  {
    slug: 'brand-identity-system',
    service: 'logo-design-visual-identity' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-identity/1600/1800',
    width: 1600,
    height: 1800,
    span: 'hero',
    featured: true,
  },
  {
    slug: 'product-packaging',
    service: 'graphic-design-packaging-design' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-packaging/1600/1000',
    width: 1600,
    height: 1000,
    span: 'landscape',
    featured: true,
  },
  {
    slug: 'print-production',
    service: 'printing-packaging' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-print/1600/1000',
    width: 1600,
    height: 1000,
    span: 'landscape',
    featured: true,
  },
  {
    slug: 'digital-campaign',
    service: 'digital-marketing' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-digital/1200/1200',
    width: 1200,
    height: 1200,
    span: 'third',
    featured: true,
  },
  {
    slug: 'graphic-series',
    service: 'graphic-design-packaging-design' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-graphic/1200/1200',
    width: 1200,
    height: 1200,
    span: 'third',
    featured: true,
  },
  {
    slug: 'website-design',
    service: 'web-design' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-web/1200/1200',
    width: 1200,
    height: 1200,
    span: 'third',
    featured: true,
  },
  {
    slug: 'motion-film',
    service: 'video-editing-production' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-motion/1000/1600',
    width: 1000,
    height: 1600,
    span: 'tall',
    featured: true,
  },
  {
    slug: 'exhibition-stand',
    service: 'exhibition-planning-preparation' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-exhibition/1600/1000',
    width: 1600,
    height: 1000,
    span: 'wide',
    featured: true,
  },
  {
    slug: 'pack-production',
    service: 'printing-packaging' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-pack-prod/1200/1200',
    width: 1200,
    height: 1200,
    span: 'splitWide',
    featured: true,
  },
  {
    slug: 'visual-language',
    service: 'logo-design-visual-identity' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-language/1000/1200',
    width: 1000,
    height: 1200,
    span: 'splitNarrow',
    featured: true,
  },
  {
    slug: 'generated-film',
    service: 'ai-generated-videos' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-generated/1600/1000',
    width: 1600,
    height: 1000,
    span: 'half',
    featured: true,
  },
  {
    slug: 'social-campaign',
    service: 'digital-marketing' as ServiceSlug,
    cover: 'https://picsum.photos/seed/mm-project-social/1600/1000',
    width: 1600,
    height: 1000,
    span: 'band',
    featured: true,
  },
]

export type ProjectSlug = (typeof projects)[number]['slug']
