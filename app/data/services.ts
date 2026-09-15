export const services = [
  { slug: 'logo-design-visual-identity', icon: 'lucide:fingerprint', color: '#F18F00' },
  { slug: 'graphic-design-packaging-design', icon: 'lucide:package', color: '#36393B' },
  { slug: 'printing-packaging', icon: 'lucide:printer', color: '#C45A11' },
  { slug: 'ai-generated-videos', icon: 'lucide:sparkles', color: '#7C3AED' },
  { slug: 'digital-marketing', icon: 'lucide:megaphone', color: '#2563EB' },
  { slug: 'video-editing-production', icon: 'lucide:clapperboard', color: '#B91C1C' },
  { slug: 'web-design', icon: 'lucide:monitor', color: '#0F766E' },
  { slug: 'exhibition-planning-preparation', icon: 'lucide:store', color: '#57534E' },
] as const

export type ServiceSlug = typeof services[number]['slug']
export type ServiceRecord = typeof services[number]
