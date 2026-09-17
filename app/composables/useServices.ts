import { services } from '~/data/services'

export function useServices() {
  const { t } = useI18n()
  const localePath = useLocalePath()

  const items = computed(() =>
    services.map((service, index) => ({
      slug: service.slug,
      name: t(`services.items.${service.slug}`),
      summary: t(`servicesPage.summaries.${service.slug}`),
      icon: service.icon,
      color: service.color,
      index: index + 1,
      to: localePath(`/services/${service.slug}`),
      workTo: localePath({
        path: '/projects',
        query: { service: service.slug },
      }),
    })),
  )

  function getBySlug(slug: string) {
    return items.value.find(service => service.slug === slug)
  }

  function neighbors(slug: string) {
    const list = items.value
    const index = list.findIndex(service => service.slug === slug)
    if (index < 0 || list.length < 2) return { previous: undefined, next: undefined }

    return {
      previous: list[(index - 1 + list.length) % list.length],
      next: list[(index + 1) % list.length],
    }
  }

  return {
    services: items,
    getBySlug,
    neighbors,
  }
}
