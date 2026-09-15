export const services = [
  { slug: 'logo-design-visual-identity' },
  { slug: 'graphic-design-packaging-design' },
  { slug: 'printing-packaging' },
  { slug: 'ai-generated-videos' },
  { slug: 'digital-marketing' },
  { slug: 'video-editing-production' },
  { slug: 'web-design' },
  { slug: 'exhibition-planning-preparation' },
] as const

export type ServiceSlug = typeof services[number]['slug']
export type ServiceRecord = typeof services[number]
