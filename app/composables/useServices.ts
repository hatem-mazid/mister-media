import { services } from '~/data/services'

export function useServices() {
  const { t } = useI18n()
  const localePath = useLocalePath()

  const items = computed(() =>
    services.map(service => ({
      slug: service.slug,
      name: t(`services.items.${service.slug}`),
      icon: service.icon,
      color: service.color,
      to: localePath(`/services/${service.slug}`),
    })),
  )

  function getBySlug(slug: string) {
    return items.value.find(service => service.slug === slug)
  }

  return {
    services: items,
    getBySlug,
  }
}
